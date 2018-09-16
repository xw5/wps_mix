var gulp = require("gulp");
var gp = require("gulp-load-plugins")();
var runSequence = require("run-sequence");
var browserSync = require('browser-sync').create();
var config = require("./config/config");
var nowStatus = getEnvStatus();//获取当前所处的环境

//编译的路径定义
var styleUrl = nowStatus === 0 ? config.staticUrl : config.styleUrl;
var assetsUrl = nowStatus === 0 ? config.staticUrl : config.assetsUrl;
var htmlUrl = nowStatus === 0 ? config.staticUrl : config.htmlUrl;
var jsDevUrl = nowStatus === 0 ? config.staticUrl : config.jsDevUrl;
var tempDir = config.temp_dir;

var isJs = nowStatus===0 ? 'js/' : '';
var isCss = nowStatus===0 ? 'css/' : '';

var cssOnlineUrl = config.cssOnlineUrl;
var jsOnlineUrl = config.jsOnlineUrl;
var changeUrl = {
    '\\./css/': cssOnlineUrl,
    '\\./assets/': cssOnlineUrl+'assets',
    '\\./js/': jsOnlineUrl
};

var hasServer = false;

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
	return gulp.src(config.staticUrl)
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
	return gulp.src("./src/less/*.less")
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
	.pipe(gp.if(hasServer,browserSync.stream()))
});

//静态等资源移动任务:图片、视频、字体等
gulp.task("assetsMove",function(){
	return gulp.src("./src/assets/**")
	.pipe(gp.plumber())
	.pipe(gp.debug({title:'静态资源移动:'}))
	.pipe(gp.if(nowStatus != 2, gp.revAyou()))
	.pipe(gulp.dest(assetsUrl+'assets/'))
	.pipe(gp.if(nowStatus != 2, gp.revAyou.manifest()))
	.pipe(gp.if(nowStatus != 2, gulp.dest(tempDir+'rev/assets/')))
});

//通用js库插件移动
gulp.task("libMove",function(){
	return gulp.src(["./src/js/lib/**"])
	.pipe(gp.plumber())
	.pipe(gp.revAyou())
	.pipe(gulp.dest(jsDevUrl + isJs + "lib/"))
	.pipe(gp.revAyou.manifest())
	.pipe(gulp.dest(tempDir+'rev/js/lib/'))
}); 
//js模块化开发requirejs
gulp.task('rjs', function(){
	return gulp.src('./src/js/*.js')
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
	.pipe(gp.if(hasServer,browserSync.stream()))
});

//html资源资源换成线上路径
gulp.task("htmlPath", function(){
    return gulp.src(["./src/*.html"])
        .pipe(gp.plumber())
        .pipe(gp.debug({title:'html路径及版本修改:'}))
        // .pipe(gp.if(nowStatus != 0,gp.assetRevision({
        //     hasSuffix: false,
        //     manifest: './manifest/assets.json'
        // })))
		.pipe(gp.if(nowStatus != 0,gp.urlReplace(changeUrl)))
        .pipe(gulp.dest(htmlUrl));
});

//html模板功能实现
gulp.task('htmlSolve',function(){
	return gulp.src('src/*.html')
	.pipe(gp.plumber())
    .pipe(gp.debug({title:'html处理:'}))
	.pipe(gp.if(config.template,gp.fileInclude({
      prefix: '@@',
      basepath: '@file'
    })))
	.pipe(gp.if(nowStatus != 0,gp.urlReplace(changeUrl)))
	.pipe(gulp.dest(htmlUrl))
	.pipe(gp.if(hasServer,browserSync.stream()))
});

//文件变化监听
gulp.task("watch",function(){
	gulp.watch("./src/js/**",function(){
		console.log('===================js监听到修改===================');
		if(nowStatus === 0){
			runSequence("clean:js","rjs");
		}else{
			runSequence("rjs");
		}
	});
	gulp.watch("./src/assets/**",function(){
		console.log('===================静态图片等资源监听到修改===================');
		if(nowStatus === 0){
			runSequence("clean:assets","assetsMove");
		}else{
			runSequence("assetsMove");
		}
	});
	gulp.watch("./src/less/**",function(){
		console.log('===================less监听到修改===================');
		if(nowStatus === 0){
			runSequence("clean:css","less");
		}else{
			runSequence("less");
		}
	});
	gulp.watch(["./src/*.html","./src/template/*.html"],function(){
		console.log('===================html监听到修改===================');
		if(nowStatus === 0){
			runSequence("clean:html","htmlSolve");
		}else{
			runSequence("htmlSolve");
		}
	});
});
//开启本地服务器
gulp.task("server",function(){
	hasServer = true;
	bs = browserSync.init({
		// files:[
		// 	config.staticUrl+"css/*.css",
		// 	config.staticUrl+"js/*.js",
		// 	config.staticUrl+"assets/**",
		// 	config.staticUrl+"*.html"
		// ],
		port:6666,
		server:{
			baseDir:config.staticUrl
		}
	})
});
//开发&&构建
gulp.task('start',function(){
	if(nowStatus === 0){
		console.log('===================启动静态开发流程===================')
		runSequence("clean:dist",["less","libMove","rjs","assetsMove"],"htmlSolve","watch","server");
	}else if(nowStatus === 1){
		console.log('===================启动开发流程(路径替换，文件归位)===================')
		runSequence(["less","libMove","rjs","assetsMove"],"htmlSolve","watch");
	}else{
		console.log('===================启动构建发布(压缩JS，打版本号)===================')
		runSequence(["less","libMove","rjs","assetsMove"],"htmlSolve","revHtml","revCss");
	}
});