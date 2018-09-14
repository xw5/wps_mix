var gulp = require("gulp");
var gp = require("gulp-load-plugins")();
var runSequence = require("run-sequence");
var browserSync = require('browser-sync').create();
var pathUrl = require("./config/pathConfig");
var nowStatus = getEnvStatus();//获取当前所处的环境

//编译的路径定义
var styleUrl = nowStatus === 0 ? pathUrl.staticUrl : pathUrl.styleUrl;
var assetsUrl = nowStatus === 0 ? pathUrl.staticUrl : pathUrl.assetsUrl;
var htmlUrl = nowStatus === 0 ? pathUrl.staticUrl : pathUrl.htmlUrl;
var jsDevUrl = nowStatus === 0 ? pathUrl.staticUrl : pathUrl.jsDevUrl;
var tempDir = pathUrl.temp_dir;

var isJs = nowStatus===0 ? 'js/' : '';
var isCss = nowStatus===0 ? 'css/' : '';

var cssOnlineUrl = pathUrl.cssOnlineUrl;
var jsOnlineUrl = pathUrl.jsOnlineUrl;
var changeUrl = {
    '\\./css/': cssOnlineUrl,
    '\\./assets/': cssOnlineUrl+'assets',
    '\\./js/': jsOnlineUrl
};

//判断当前是在什么环境下
function getEnvStatus(){
	var nowStatus = process.env.NODE_ENV;
	var status = 0;
	switch(nowStatus){
		case 'local'://本地静态开发流程
			status = 0;
			break;
		case 'development'://前后端配合流程中
			status = 1;
			break;
		case 'production'://生产发布
			status = 2;
			break;
	}
	return status;
}

//清除js
gulp.task("clean:js",function(){
	return gulp.src(jsDevUrl+"js/*.js")
		.pipe(gp.clean())
});

//清除css
gulp.task("clean:css",function(){
	return gulp.src(styleUrl+"css/*.css")
		.pipe(gp.clean())
});
//清除html
gulp.task("clean:html",function(){
	return gulp.src(htmlUrl+"*.html")
		.pipe(gp.clean())
});

//清除html
gulp.task("clean:assets",function(){
	return gulp.src(styleUrl+"assets/**")
		.pipe(gp.clean())
});

//清除dist目录
gulp.task("clean:dist",function(){
	return gulp.src(pathUrl.staticUrl)
		.pipe(gp.clean())
});

//css、js、图片等静态文件版本管理
gulp.task('revHtml', function () {
	return gulp.src([tempDir+'rev/**/*.json', htmlUrl+'*.html'])
		.pipe(gp.debug({title:'html中静态资源版本管理:'}))
        .pipe(gp.revCollectorAyou())
        .pipe(gulp.dest(htmlUrl));
});
gulp.task('revCss', function () {
	return gulp.src([tempDir+'rev/assets/*.json', styleUrl+'*.css'])
		.pipe(gp.debug({title:'css中assets资源版本管理:'}))
        .pipe(gp.revCollectorAyou())
		.pipe(gulp.dest(styleUrl));
});

//开发环境编译less任务,同时做兼容处理
gulp.task('less',function(){
	var now = new Date();
	return gulp.src("./less/*.less")
	.pipe(gp.plumber())
	.pipe(gp.debug({title:'less解析:'}))
	.pipe(gp.sourcemaps.init())
	//less解析
	.pipe(gp.less())
	//浏览器兼容前缀添加
	.pipe(gp.autoprefixer({
		browsers:["last 1000 versions"]
	}))
	.pipe(gp.if(nowStatus === 2, gp.cleanCss({compatibility: 'ie8'})))
	.pipe(gp.if(nowStatus != 2, gp.revAyou()))
	.pipe(gp.sourcemaps.write('.'))
	.pipe(gulp.dest(styleUrl + isCss))
	.pipe(gp.if(nowStatus != 2, gp.revAyou.manifest()))
	.pipe(gp.if(nowStatus != 2, gulp.dest(tempDir+'rev/css/')))
});

//静态等资源移动任务:图片、视频、字体等
gulp.task("assetsMove",function(){
	return gulp.src("./assets/**")
	.pipe(gp.plumber())
	.pipe(gp.debug({title:'静态资源移动:'}))
	.pipe(gp.if(nowStatus != 2, gp.revAyou()))
	.pipe(gulp.dest(assetsUrl))
	.pipe(gp.if(nowStatus != 2, gp.revAyou.manifest()))
	.pipe(gp.if(nowStatus != 2, gulp.dest(tempDir+'rev/assets/')))
});

//通用js库插件移动
gulp.task("libMove",function(){
	return gulp.src(["./js/lib/**"])
	.pipe(gp.plumber())
	.pipe(gp.revAyou())
	.pipe(gulp.dest(jsDevUrl + isJs + "lib/"))
	.pipe(gp.revAyou.manifest())
	.pipe(gulp.dest(tempDir+'rev/js/lib/'))
}); 
//js模块化开发requirejs
gulp.task('rjs', function(){
	return gulp.src('./js/*.js')
	.pipe(gp.plumber())
	.pipe(gp.debug({title:'js打包requirejs:'}))
	.pipe(gp.sourcemaps.init())
	.pipe(
		gp.requirejsOptimize({
				optimize: 'none',
				mainConfigFile: './config/build.js'
	}))
	.pipe(gp.if(nowStatus === 2, gp.uglify({
		ie8:true
	})))
	.pipe(gp.if(nowStatus != 2, gp.revAyou()))
	.pipe(gp.sourcemaps.write('.'))
	.pipe(gulp.dest(jsDevUrl+isJs))
	.pipe(gp.if(nowStatus != 2, gp.revAyou.manifest()))
	.pipe(gp.if(nowStatus != 2, gulp.dest(tempDir+'rev/js/')))
});

//html资源资源换成线上路径
gulp.task("htmlPath", function(){
    return gulp.src(["*.html"])
        .pipe(gp.plumber())
        .pipe(gp.debug({title:'html路径及版本修改:'}))
        // .pipe(gp.if(nowStatus != 0,gp.assetRevision({
        //     hasSuffix: false,
        //     manifest: './manifest/assets.json'
        // })))
		.pipe(gp.if(nowStatus != 0,gp.urlReplace(changeUrl)))
        .pipe(gulp.dest(htmlUrl));
});

//文件变化监听
gulp.task("watch",function(){
	gulp.watch("./js/**/*.js",function(){
		console.log('===================js监听到修改===================');
		if(nowStatus === 0){
			runSequence(nowStatus === 0 ? "clean:js" : "" ,"rjs");
		}else{
			runSequence("rjs");
		}
	});
	gulp.watch("./assets/**/*.*",function(){
		console.log('===================静态图片等资源监听到修改===================');
		if(nowStatus === 0){
			runSequence(nowStatus === 0 ? "clean:assets" : "" ,"assetsMove");
		}else{
			runSequence("assetsMove");
		}
	});
	gulp.watch("./less/**/*.*",function(){
		console.log('===================less监听到修改===================');
		if(nowStatus === 0){
			runSequence(nowStatus === 0 ? "clean:css" : "" ,"less");
		}else{
			runSequence("less");
		}
	});
	gulp.watch("./*.html",function(){
		console.log('===================html监听到修改===================');
		if(nowStatus === 0){
			runSequence(nowStatus === 0 ? "clean:html" : "" ,"htmlPath");
		}else{
			runSequence("htmlPath");
		}
	});
});
//开启本地服务器
gulp.task("server",function(){
	browserSync.init({
		files:[
			pathUrl.staticUrl+"css/*.css",
			pathUrl.staticUrl+"js/*.js",
			pathUrl.staticUrl+"assets/**/*.*",
			pathUrl.staticUrl+"*.html"
		],
		server:{
			baseDir:pathUrl.staticUrl
		}
	})
});
//开发&&构建
gulp.task('start',function(){
	if(nowStatus === 0){
		console.log('===================启动静态开发流程===================')
		runSequence("clean:dist",["less","libMove","rjs","assetsMove"],"htmlPath","watch","server");
	}else if(nowStatus === 1){
		console.log('===================启动开发流程(路径替换，文件归位)===================')
		runSequence(["less","libMove","rjs","assetsMove"],"htmlPath","watch");
	}else{
		console.log('===================启动构建发布(压缩JS，打版本号)===================')
		runSequence(["less","libMove","rjs","assetsMove"],"htmlPath","revHtml","revCss");
	}
});