var proName = 'mobile_sign_v2';
module.exports={
    proName:proName,
    template:false,
    staticUrl:'./dist/',
    temp_dir:'./temp/',
    styleUrl : './publish/css/',//'../../public/styles/h5/'+proName+'/',//css存放的目录
    assetsUrl : './publish/assets/',//'../../public/styles/h5/'+proName+'/',//图片,字体等资源的存放的目录
    htmlUrl : './publish/',//'../../resources/views/h5/'+proName+'/',//html存放的目录
    jsDevUrl : './publish/js/',//'../../public/javascript/publish/spa/'+proName+'/',//JS存放目录
    cssOnlineUrl : '<%$media_prefix%>/styles/h5/'+proName+'/',//css在线目录
    assetsOnlineUrl : '<%$media_prefix%>/styles/h5/'+proName+'/',//静态资源(图片，字体...)在线目录
    jsOnlineUrl : '<%$media_prefix%>/javascript/publish/spa/'+proName+'/'//js在线目录
}