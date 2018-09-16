var proName = 'mobile_sign_v2';
module.exports={
    proName:proName,
    template:true,
    staticUrl:'./dist/',
    temp_dir:'./temp/',
    styleUrl : './publish/css/',//'../../public/styles/h5/'+proName+'/',//css存放的目录
    assetsUrl : './publish/assets/',//'../../public/styles/h5/'+proName+'/',//静态图片等资源的存放的目录
    htmlUrl : './publish/',//'../../resources/views/h5/'+proName+'/',//html存放的目录
    jsDevUrl : './publish/js/',//'../../public/javascript/publish/spa/'+proName+'/',//JS存放目录
    cssOnlineUrl : '<%$media_prefix%>/styles/h5/'+proName+'/',
    jsOnlineUrl : '<%$media_prefix%>/javascript/publish/spa/'+proName+'/'
}