var proName = 'wps_mix';//项目名称
module.exports={
    proName:proName,
    rem:true,//是否是rem布局项目
    remConfig:{//rem相关配置
        'width_design':1080,//设计稿尺寸
        'valid_num':6,//保留小数位
        'pieces':10//屏幕宽分成多少份
    },
    sprite:true,//是否需要精灵图
    template:false,//是否需要html模块化
    staticUrl:'./dist/',//静态开发输出存放目录
    temp_dir:'./temp/',//用于存放项目文件版本信息
    styleUrl : './publish/css/',//'../../public/styles/h5/'+proName+'/',//css存放的目录
    assetsUrl : './publish/assets/',//'../../public/styles/h5/'+proName+'/',//图片,字体等资源的存放的目录
    htmlUrl : './publish/',//'../../resources/views/h5/'+proName+'/',//html存放的目录
    jsDevUrl : './publish/js/',//'../../public/javascript/publish/spa/'+proName+'/',//JS存放目录
    cssOnlineUrl : '<%$media_prefix%>/styles/h5/'+proName+'/',//css在线目录
    assetsOnlineUrl : '<%$media_prefix%>/styles/h5/'+proName+'/',//静态资源(图片，字体...)在线目录
    jsOnlineUrl : '<%$media_prefix%>/javascript/publish/spa/'+proName+'/'//js在线目录
}