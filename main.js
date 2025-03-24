// 优化后的核心代码结构
class ImageProcessor {
  constructor() {
    this.workerPool = new WorkerPool(4); // 创建4个Worker的线程池
  }

  async process(inputFiles) {
    try {
      const outputZip = new JSZip();
      const [bmpFile, animationFiles] = this.validateInput(inputFiles);
      
      // 并行处理三大模块
      const [logoBMP, animationData] = await Promise.all([
        this.processLogo(bmpFile),
        this.processAnimation(animationFiles)
      ]);

      // 构建ZIP结构
      outputZip.file("TCL_Boot_Logo_Directory/logo.bmp", logoBMP);
      outputZip.file("TCL_Boot_Logo_Directory/bootanimation/desc.txt", 
        this.generateDescTxt(animationData.boot.length, animationData.loop.length));
      
      await this.addAnimationToZip(outputZip, animationData);
      return outputZip.generateAsync({ type: "blob" });
    } catch (error) {
      console.error("处理失败:", error);
      throw new Error(`处理失败: ${error.message}`);
    }
  }

  // 输入验证增强版
  validateInput(files) {
    const bmpFiles = files.filter(f => f.name.endsWith('.bmp'));
    if (bmpFiles.length !== 1) throw new Error("必须包含且仅含一个BMP文件");
    
    const animationFiles = files.filter(f => 
      f.name.startsWith('animation/') && 
      ['.jpg', '.jpeg', '.png'].includes(f.name.slice(-4).toLowerCase())
    );
    
    const hasSubDirs = [...new Set(animationFiles.map(f => f.name.split('/')[1]))];
    if (!hasSubDirs.includes('boot') || !hasSubDirs.includes('loop')) {
      throw new Error("animation目录下必须包含boot和loop子目录");
    }
    
    return [bmpFiles[0], animationFiles];
  }

  // BMP处理增强版
  async processLogo(file) {
    const bitmap = await createImageBitmap(file);
    const canvas = new OffscreenCanvas(1920, 1080);
    
    // 尺寸校正
    if (bitmap.width !== 1920 || bitmap.height !== 1080) {
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0, 1920, 1080);
    }
    
    // 转换为16位BMP
    const blob = await canvas.convertToBlob({ 
      type: 'image/bmp',
      quality: 100,
      colorSpace: 'display-p3'
    });
    
    // 色深验证
    if (!await this.validateBMPDepth(blob)) {
      throw new Error("BMP转换后未达到16位色深要求");
    }
    return blob;
  }

  // 动画处理优化
  async processAnimation(files) {
    const groups = { boot: [], loop: [] };
    
    await Promise.all(files.map(async file => {
      const [_, folder] = file.name.split('/');
      const processed = await this.workerPool.processImage(file, {
        targetSize: { width: 1920, height: 1080 },
        dpi: 120,
        format: file.name.endsWith('.png') ? 'png' : 'jpeg'
      });
      
      groups[folder].push(processed);
    }));
    
    return groups;
  }

  // 动态计算帧率算法优化
  generateDescTxt(bootFrames, loopFrames) {
    const MIN_FPS = 15, MAX_FPS = 30, TARGET_DURATION = 4;
    const totalFrames = bootFrames + loopFrames * 2; // 假设loop循环两次
    const calculatedFps = Math.round(totalFrames / TARGET_DURATION);
    const fps = Math.max(MIN_FPS, Math.min(MAX_FPS, calculatedFps));
    
    return `3840 2160 ${fps}\np 1 0 boot\np 0 0 loop`;
  }
}

// Worker线程池实现
class WorkerPool {
  constructor(size = navigator.hardwareConcurrency || 4) {
    this.queue = [];
    this.workers = Array.from({ length: size }, () => {
      const worker = new Worker('./image-processor.worker.js');
      worker.onmessage = (e) => this.handleResponse(worker, e);
      return { worker, busy: false };
    });
  }

  processImage(file, options) {
    return new Promise((resolve, reject) => {
      this.queue.push({ file, options, resolve, reject });
      this.next();
    });
  }

  next() {
    if (!this.queue.length) return;
    const workerData = this.workers.find(w => !w.busy);
    if (!workerData) return;

    workerData.busy = true;
    const task = this.queue.shift();
    workerData.worker.postMessage(task, [task.file.stream()]);
  }

  handleResponse(worker, e) {
    const workerData = this.workers.find(w => w.worker === worker);
    workerData.busy = false;
    this.next();
  }
}
