
layui.define(['jquery', 'element', 'carousel', 'laypage', 'layer', 'form', 'upload'], function (exports) {
    var $ = layui.jquery
        , element = layui.element
        , layer = layui.layer
        , form = layui.form
        , upload = layui.upload
        , carousel = layui.carousel
        , laypage = layui.laypage;

    //轮播渲染
/*    carousel.render({
        elem: '#banner'
        , width: '100%'
        , height: '400px'
        , arrow: 'always'
    });

    //滚动监听
    $(window).scroll(function () {
        var scr = $(document).scrollTop();
        scr > 0 ? $(".nav").addClass('scroll') : $(".nav").removeClass('scroll');
    });*/

    $(".nav-menu ul li").each(function(){
        $(this).on().click(function(){
            /*console.log($(this).siblings())
            $(this).siblings().removeClass("active")*/
            /*console.log($(this))*/
            $('.doc').removeClass('active')
            $(this).addClass("active")

        })
    })

    /**
     * 用户登录
     * */
    form.on('submit(user_login)', function (data) {
        layer.load();
        if(data.field.username=="" || data.field.password==""){
            layer.closeAll()
            layer.msg('账号或者密码不能为空!',{icon:2,time:1000});
            return false;
        }
        /*var login_info=JSON.stringify(data.field);*/
        $.ajax({
            type: 'POST',
            url: "/member/index/login_f",
            data: data.field,
            dataType: "json",
            success: function (msg) {
                layer.closeAll('loading');
                if(msg.code==0){
                    /*var index=layer.alert('登录成功！', {icon: 6});*/
                    layer.msg('登录成功!',{icon:6,time:1000});
                    if($("#back_url").val().length>0){
                        window.location.href=$("#back_url").val();
                    }else{
                        window.location.href="/";
                    }
                    /*var index = parent.layer.getFrameIndex(window.name);
                    setTimeout(function(){
                        parent.layer.close(index)
                    },1000)*/
                }else if(msg.code==1){
                    layer.msg('平台升级，请重置密码!',{icon:2,time:2000},function(){
                        window.location.href='re_pwd.html';
                    });
                }else{
                    layer.msg('登录失败!',{icon:2,time:1000});
                }
            }
        });
        return  false
    })

    /**
     * 修改密码
     */
    $("#updatePassword").click(function(){
        layer.open({
            title: '修改密码',
            area: ['40%', '400px'],
            type: 1,
            content: `<div class="layui-form" ><div class="layui-form-item">
                <label class="layui-form-label" style="width:200px">用户名</label>
                <div class="layui-input-block">
                    <input style="width:240px" disabled type="text" id="username" name="username" autocomplete="off" placeholder="请输入用户名" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:200px">原密码</label>
                <div class="layui-input-block">
                    <input style="width:240px" type="text" id="old_password" name="old_password" required  lay-verify="required" autocomplete="off" placeholder="请输入原密码" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:200px">新密码</label>
                <div class="layui-input-block">
                    <input style="width:240px" type="text" id="new_password" name="new_password" required  lay-verify="required" autocomplete="off" placeholder="请输入新密码" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:200px">确认新密码</label>
                <div class="layui-input-block">
                    <input style="width:240px" type="text" id="new_password_second" required  lay-verify="required" name="new_password_second"  autocomplete="off" placeholder="请确认新密码" class="layui-input">
                </div>
            </div>
            <div class="layui-form-item">
                <div class="layui-input-block">
                    <button class="layui-btn" lay-submit lay-filter="update_password">立即提交</button>
                    <button class="layui-btn layui-btn-primary" lay-filter="cancel_update_password">取消</button>
                </div>
            </div>
            </div>`,
            btn:[]

        });
    })
    form.on('submit(update_password)', function (data) {
        console.log('submit(update_password)', data)
        $.ajax({
            type: 'POST',
            url: "/member/index/force_reset_password",
            data: data.field,
            dataType: "json",
            success: function (msg) {
                if(msg.code==0){
                    /*var index=layer.alert('登录成功！', {icon: 6});*/
                    layer.msg('修改密码成功!',{icon:6,time:1000},function(){
                        window.location.href='login.html';
                    });
                }else{
                    layer.msg(msg.msg,{icon:2,time:1000});
                }
            }
        });
        return false

    })

    form.on('submit(form_re_pwd)', function (data) {
        $.ajax({
            type: 'POST',
            url: "/member/index/force_reset_password",
            data: data.field,
            dataType: "json",
            success: function (msg) {
                if(msg.code==0){
                    /*var index=layer.alert('登录成功！', {icon: 6});*/
                    layer.msg('修改密码成功!',{icon:6,time:1000},function(){
                        window.location.href='login.html';
                    });
                }else{
                    layer.msg(msg.msg,{icon:2,time:1000});
                }
            }
        });
        return  false
    });


    /**
     * 用户登出
     * */
    $("#logout").click(function(){
        layer.load();
        $.ajax({
            type: 'get',
            url: "/member/index/logout_f",
            dataType: "json",
            success: function (msg) {
                layer.closeAll('loading');
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


    /**
     * 用户反馈
     * */
    form.on('submit(feedback)', function (data) {
        layer.load();
        $.ajax({
            type: 'POST',
            url: "/index/index/feedback",
            data: data.field,
            dataType: "json",
            success: function (msg) {
                layer.closeAll('loading');
                if(msg.code == 0){
                    //$("#follow").html('已关注');
                    $("input[name='title']").val("")
                    $("input[name='desc']").val("")
                    $("input[name='desc']").text("")
                    $("input[name='phone']").val("")
                    layer.alert(msg.data);
                }else{
                    layer.alert(msg.data);
                }
            }
        });
        return  false
    })


    $(document).ready(function(){
        var param_active = window.location.pathname
        var li_active_list=$(".li_active")
        li_active_list.removeClass("active")
        $.each(li_active_list,function(k,v){
            var attrs_active = "/"+$(this).attr("attrs")
            // console.log(attrs_active, param_active,$('.doc') )
            if(attrs_active == param_active){
                $(this).addClass("active")

            }else if((param_active=="/index/index/tool_apk/" || param_active=="/index/index/tool_animation" || param_active=="/index/index/tool_video" || param_active=="/index/index/tool_ota/") && attrs_active=="/tools"){
                $(this).addClass("active")
            }
        })

    })

    exports('common', {});
});


