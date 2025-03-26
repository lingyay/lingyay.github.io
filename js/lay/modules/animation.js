
layui.define(['jquery', 'element', 'carousel', 'laypage', 'layer', 'form', 'upload'], function (exports) {
    var $ = layui.jquery
        , element = layui.element
        , layer = layui.layer
        , form = layui.form
        , upload = layui.upload
        , carousel = layui.carousel
        , laypage = layui.laypage;


    form.on('select(tv_type)',function(data){
        console.log(data.value);
        if(data.value=="A261" || data.value=="A262"  || data.value == "98G60E" || data.value == "100GA1" || data.value == "100GA2" || data.value == "85G90E_JN"){
            uploadListIns.config.exts="jpg"
        }else if(data.value=="A361" || data.value=="A362" || data.value=="A360J" || data.value=="972" || data.value=="G62E" || data.value=="G90E" || data.value=="G50E_T963S" || data.value == "43G60E" || data.value == "85G60E" || data.value == "G50E_T920" || data.value == "32G50K"  || data.value == "43G50K"){
            uploadListIns.config.exts="bmp"
        }
    })


    form.on('select(tcl_otafile)',function(data){
        change_type(data.value)
    })


    $("#logout").click(function(){
        $.ajax({
            type: 'get',
            url: "/member/index/logout_f",
            dataType: "json",
            success: function (msg) {
                if(msg.code==0){
                    /*var index=layer.alert('登录成功！', {icon: 6});*/
                    layer.msg('已经退出!',{icon:6,time:2000});
                    setTimeout(function(){
                        window.location.reload();//刷新当前页面.
                    },1000)
                }
            }
        });
    })

    form.on('select(animation_type)',function(data){
        console.log(uploadListIns1)
        if(data.value==1){
            uploadListIns1.config.exts="png"
        }else if(data.value==2){
            uploadListIns1.config.exts=="zip"
        }
    })



    //多文件列表示例  -- 开机logo
    var demoListView = $('#demoList')
        ,uploadListIns = upload.render({
        elem: '#testList'
        ,url: '/index/index/upload_animation/'
        ,accept: 'file'
        ,multiple: false
        ,auto:false
        ,data:{"gcj-type": function(){
                return $("#tvType").val();
            }}
        ,field:'animation_logo'
        ,exts:'jpg|png|bmp'
        ,bindAction: '#testListAction'
        ,progress: function(n, elem){
            var percent = n + '%' //获取进度百分比
            element.progress('upload_apk_per_cent', percent); //可配合 layui 进度条元素使用

            //以下系 layui 2.5.6 新增
            console.log(n);
            console.log(elem); //得到当前触发的元素 DOM 对象。可通过该元素定义的属性值匹配到对应的进度条。
        }
        ,choose: function(obj){
            var files = this.files = obj; //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function(index, file, result){
                var tr = $(['<tr id="upload-'+ index +'">'
                    ,'<td>'+ file.name +'</td>'
                    ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                    ,'<td>等待上传</td>'
                    ,'<td>'
                    /* ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'*/
                    ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                    /*,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">下载</button>'*/
                    ,'</td>'
                    ,'</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function(){
                    obj.upload(index, file);
                    return false
                });

                //删除
                tr.find('.demo-delete').on('click', function(){
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView.html(tr);
            });
        }
        ,done: function(res, index, upload){
            $(".apk_upload_per_cent").hide();
            layer.closeAll('loading');
            if(res.code == 0){ //上传成功
                var tr = demoListView.find('tr#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                /*tds.eq(3).html(''); //清空操作*/
               /* tds.eq(3).find('.demo-reload').removeClass('layui-hide');*/
                /*tds.eq(3).find('.demo-reload').html("<a style='color: white;' href='"+res.url+"'>下载</a>");*/
                /*batch_upload();*/
                if(demoListView1[0].childElementCount>0){
                    uploadListIns1.upload();
                }else if(demoListView2[0].childElementCount>0){
                    uploadListIns2.upload();
                }else if(demoListView3[0].childElementCount>0){
                    uploadListIns3.upload();
                }else{
                    animation_smb()
                }

                return delete this.files[index]; //删除文件队列已经上传成功的文件

            }else if(res.code == "-1"){
                relogin();
                return false
            }
            layer.msg(res.msg,{icon:2,time:2000});
            this.error(index, upload);
        }
        ,before:function(res){
            $(".apk_upload_per_cent").show()
            layer.load();
        }
        ,error: function(index, upload){
            layer.closeAll('loading');
            var tr = demoListView.find('tr#upload-'+ index)
                ,tds = tr.children();
            tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            /*tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传*/
        }
    });

    $(".apk_upload_per_cent1").hide();
    //多文件列表示例  -- 开机动画
    var demoListView1 = $('#demoList1')
        ,uploadListIns1 = upload.render({
        elem: '#testList1'
        ,url: '/index/index/upload_animation/'
        ,accept: 'file'
        ,multiple: false
        ,auto:false
        ,data:{"gcj-type": function(){
                return $("#tvType").val();
            },"animation_type":function(){
                return $("#file_type").val();
            }}
        ,field:'boot_animation'
        ,exts:'png'
        ,bindAction: '#testListAction1'
        ,progress: function(n, elem){
            var percent = n + '%' //获取进度百分比
            element.progress('upload_apk_per_cent1', percent); //可配合 layui 进度条元素使用

            //以下系 layui 2.5.6 新增
            console.log(n);
            console.log(elem); //得到当前触发的元素 DOM 对象。可通过该元素定义的属性值匹配到对应的进度条。
        }
        ,choose: function(obj){
            var files = this.files = obj; //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function(index, file, result){
                var tr = $(['<tr id="upload-'+ index +'">'
                    ,'<td>'+ file.name +'</td>'
                    ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                    ,'<td>等待上传</td>'
                    ,'<td>'
                    /* ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'*/
                    ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                    /*,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">下载</button>'*/
                    ,'</td>'
                    ,'</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function(){
                    obj.upload(index, file);
                    return
                });

                //删除
                tr.find('.demo-delete').on('click', function(){
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns1.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView1.html(tr);
            });
        }
        ,done: function(res, index, upload){
            $(".apk_upload_per_cent1").hide();
            layer.closeAll('loading');
            if(res.code == 0){ //上传成功
                var tr = demoListView1.find('tr#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                /*tds.eq(3).html(''); //清空操作*/
                /* tds.eq(3).find('.demo-reload').removeClass('layui-hide');*/
                /*tds.eq(3).find('.demo-reload').html("<a style='color: white;' href='"+res.url+"'>下载</a>");*/

                if(demoListView2[0].childElementCount>0){
                    uploadListIns2.upload();
                }else if(demoListView3[0].childElementCount>0){
                    uploadListIns3.upload();
                }else{
                    animation_smb()
                }

                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }else if(res.code == "-99"){
                relogin();
            }
            layer.msg(res.msg,{icon:2,time:2000});
            this.error(index, upload);
            return true;
        }
        ,before:function(res){
            $(".apk_upload_per_cent1").show();
            layer.load();
        }
        ,error: function(index, upload){
            layer.closeAll('loading');
            var tr = demoListView1.find('tr#upload-'+ index)
                ,tds = tr.children();
            tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            /*tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传*/
        }
    });

    form.on('select(animation_type)',function(data){
        if(data.value==1){
            uploadListIns1.config.exts="png"
        }else if(data.value==2){
            uploadListIns1.config.exts="zip"
        }
    })



    $(".apk_upload_per_cent2").hide();
    //多文件列表示例  -- 开机视频
    var demoListView2 = $('#demoList2')
        ,uploadListIns2 = upload.render({
        elem: '#testList2'
        ,url: '/index/index/upload_animation/'
        ,accept: 'file'
        ,multiple: false
        ,auto:false
        ,data:{"gcj-type": function(){
                return $("#tvType").val();
            }}
        ,field:'animation_video'
        ,exts:'ts'
        ,bindAction: '#testListAction2'
        ,progress: function(n, elem){
            var percent = n + '%' //获取进度百分比
            element.progress('upload_apk_per_cent2', percent); //可配合 layui 进度条元素使用

            //以下系 layui 2.5.6 新增
            console.log(n);
            console.log(elem); //得到当前触发的元素 DOM 对象。可通过该元素定义的属性值匹配到对应的进度条。
        }
        ,choose: function(obj){
            var files = this.files = obj; //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function(index, file, result){
                var tr = $(['<tr id="upload-'+ index +'">'
                    ,'<td>'+ file.name +'</td>'
                    ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                    ,'<td>等待上传</td>'
                    ,'<td>'
                    /* ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'*/
                    ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                    /*,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">下载</button>'*/
                    ,'</td>'
                    ,'</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function(){
                    obj.upload(index, file);
                    return
                });

                //删除
                tr.find('.demo-delete').on('click', function(){
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns2.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView2.html(tr);
            });
        }
        ,done: function(res, index, upload){
            $(".apk_upload_per_cent2").hide()
            layer.closeAll('loading');
            if(res.code == 0){ //上传成功
                var tr = demoListView2.find('tr#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                /*tds.eq(3).html(''); //清空操作*/
                /* tds.eq(3).find('.demo-reload').removeClass('layui-hide');*/
                /*tds.eq(3).find('.demo-reload').html("<a style='color: white;' href='"+res.url+"'>下载</a>");*/
                if(demoListView3[0].childElementCount>0){
                    uploadListIns3.upload();
                }else{
                    animation_smb()
                }
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }else if(res.code == "-99"){
                relogin();
            }
            layer.msg(res.msg,{icon:2,time:2000});
            this.error(index, upload);
        }
        ,before:function(res){
            $(".apk_upload_per_cent2").show()
            layer.load();
        }
        ,error: function(index, upload){
            layer.closeAll('loading');
            var tr = demoListView2.find('tr#upload-'+ index)
                ,tds = tr.children();
            tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            /*tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传*/
        }
    });

    $(".apk_upload_per_cent3").hide();
    //多文件列表示例  -- 启动画面
    var demoListView3 = $('#demoList3')
        ,uploadListIns3 = upload.render({
        elem: '#testList3'
        ,url: '/index/index/upload_animation/'
        ,accept: 'file'
        ,multiple: false
        ,auto:false
        ,data:{
            "gcj-type": function(){
                return $("#tvType").val();
            },
        }
        ,field:'animation_splash_screen'
        ,exts:'png'
        ,bindAction: '#testListAction3'
        ,progress: function(n, elem){
            var percent = n + '%' //获取进度百分比
            element.progress('upload_apk_per_cent3', percent); //可配合 layui 进度条元素使用

            //以下系 layui 2.5.6 新增
            console.log(n);
            console.log(elem); //得到当前触发的元素 DOM 对象。可通过该元素定义的属性值匹配到对应的进度条。
        }
        ,choose: function(obj){
            var files = this.files = obj; //将每次选择的文件追加到文件队列
            //读取本地文件
            obj.preview(function(index, file, result){
                var tr = $(['<tr id="upload-'+ index +'">'
                    ,'<td>'+ file.name +'</td>'
                    ,'<td>'+ (file.size/1014).toFixed(1) +'kb</td>'
                    ,'<td>等待上传</td>'
                    ,'<td>'
                    /* ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'*/
                    ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                    /*,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">下载</button>'*/
                    ,'</td>'
                    ,'</tr>'].join(''));

                //单个重传
                tr.find('.demo-reload').on('click', function(){
                    obj.upload(index, file);
                    return
                });

                //删除
                tr.find('.demo-delete').on('click', function(){
                    delete files[index]; //删除对应的文件
                    tr.remove();
                    uploadListIns3.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                });

                demoListView3.html(tr);
            });
        }
        ,done: function(res, index, upload){
            $(".apk_upload_per_cent3").hide()
            layer.closeAll('loading');
            if(res.code == 0){ //上传成功
                var tr = demoListView3.find('tr#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(2).html('<span style="color: #5FB878;">上传成功</span>');
                /*tds.eq(3).html(''); //清空操作*/
                /* tds.eq(3).find('.demo-reload').removeClass('layui-hide');*/
                /*tds.eq(3).find('.demo-reload').html("<a style='color: white;' href='"+res.url+"'>下载</a>");*/
                 animation_smb()
                return delete this.files[index]; //删除文件队列已经上传成功的文件
            }else if(res.code == "-99"){
                relogin();
            }
            layer.msg(res.msg,{icon:2,time:2000});
            this.error(index, upload);
        }
        ,before:function(res){
            $(".apk_upload_per_cent3").show()
            layer.load();
        }
        ,error: function(index, upload){
            layer.closeAll('loading');
            var tr = demoListView3.find('tr#upload-'+ index)
                ,tds = tr.children();
            tds.eq(2).html('<span style="color: #FF5722;">上传失败</span>');
            /*tds.eq(3).find('.demo-reload').removeClass('layui-hide'); //显示重传*/
        }
    });

    $("#animation_sub").click(function(){
        const tv_type = $("#tvType").val();
        if (!tv_type) return layer.alert('请选择工程机型',{icon: 5})
        const tcl_otafile = $("#tcl_otafile").val();
        if (['1', '2'].includes(tcl_otafile) && demoListView[0].childElementCount <= 0) return layer.alert('请上传开机LOGO',{icon: 5})
        if(demoListView[0].childElementCount>0){
            uploadListIns.upload();
        }else if(demoListView1[0].childElementCount>0){
            uploadListIns1.upload();
        }else if(demoListView2[0].childElementCount>0){
            uploadListIns2.upload();
        }else if(demoListView3[0].childElementCount>0){
            uploadListIns3.upload();
        }else{
            animation_smb()
        }
    });

    function animation_smb(){
        layer.load();
        $.ajax({
            type: 'post',
            url: "/index/index/upload_animation/",
            data:{"tcl_otafile":$("#tcl_otafile").val(),"gcj-type":$("#tvType").val(),"animation_type":$("#file_type").val(),"do":"make_animation"},
            dataType: "json",
            success: function (msg) {
                if(msg.code==0){
                    layer.alert('制作成功', {icon: 6,time:2000});
                    layer.closeAll('loading');
                    $("#down_load").attr("href",msg.url);
                    $(".down_show").show()
                    demoListView.html("");
                    demoListView1.html("");
                    demoListView2.html("");
                    demoListView3.html("");
                    uploadListIns.config.elem.next()[0].files.FileList=[]
                    uploadListIns1.config.elem.next()[0].files.FileList=[]
                    uploadListIns2.config.elem.next()[0].files.FileList=[]
                    uploadListIns3.config.elem.next()[0].files.FileList=[]
                }
            }
        });
    }

    $("#del_data").click(function() {
        layer.load();
        $.ajax({
            type: 'post',
            url: "/index/index/del_animation/",
            data: {},
            dataType: "json",
            success: function (msg) {
                layer.closeAll('loading');
                if(msg.code == "-1"){
                    relogin();
                    return false
                }
                if (msg.code == 0) {
                    layer.closeAll('loading');
                    layer.alert('清理数据成功', {icon: 6});
                    $(".down_show").hide()
                }
            }
        })
    })


    $("#animation_sub").mouseover(function(){
        layer.tips('请确认是否要清除数据，否则会与上次的内容同步制作', this, {
            tips: [2, '#3595CC'],
            time: 4000
        });
    });

    var animation_type = $("#animation_type").val();
    $("#tcl_otafile option").each(function(){
        var sel_type=$(this).attr("value")
        if(sel_type == animation_type){
            console.log('---- tcl_otafile option start-logo ----', animation_type, sel_type)
            $(this).attr("selected",true)
            change_type(sel_type)
            form.render();
        }

    })

    function change_type(d){
        switch (d) {
            case '0':
                $("#open_logo").hide()
                $("#c_animation").hide();
                $("#c_video").hide();
                $("#boot_file").hide();
                demoListView.html("");
                demoListView1.html("");
                demoListView2.html("");
                demoListView3.html("");
                uploadListIns.config.elem.next()[0].files.FileList = []
                uploadListIns1.config.elem.next()[0].files.FileList = []
                uploadListIns2.config.elem.next()[0].files.FileList = []
                uploadListIns3.config.elem.next()[0].files.FileList = []
                $(".cs_banner_animation").show();
                $(".cs_banner_video").hide();
                break;
            case '1':
                $("#open_logo").show()
                $("#c_animation").show();
                $("#c_video").hide();
                $("#boot_file").show();
                $(".cs_banner_animation").show();
                $(".cs_banner_video").hide();
                demoListView3.html("");
                uploadListIns3.config.elem.next()[0].files.FileList = []
                break;
            case '2':
                $("#open_logo").show()
                $("#c_video").show();
                $("#boot_file").show();
                $("#c_animation").hide();
                $(".cs_banner_animation").hide();
                $(".cs_banner_video").show();
                demoListView2.html("");
                uploadListIns2.config.elem.next()[0].files.FileList = []
                break;
            default:
                return ""
        }
    }

    function relogin(){
        layer.alert('登陆信息过期，请重新登陆',{icon: 5})
        setTimeout(function(){
            location.reload()
        }, 2000);

    }

                exports('animation', {});
});


