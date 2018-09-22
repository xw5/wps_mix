这是wps项目的前端开发环境模板。

---

### 特性

* 支持less解析
* 支持autoprefixer浏览器兼容前辍处理
* 支持require.js模块化开发
* 支持sprite雪碧图制作并生成雪碧图css
* 支持文件版本管理，name.[ext]?v=[hash]
* 支持上线前静态资源URL批量替换
* 静态开发模式下自动启动服务器，自动监听文件修改，刷新浏览器实时预览效果

---

### 使用步骤

``` cmd
    npm install        //安装项目需要模块
    npm run static     //走静态开发流程
    npm run dev        //走前后端联调流程
    npm run build      //走构建流程
```

---

### 使用说明

因为项目特殊，有一步是处于前后端混合开发的时候，所以该模板有三种流程：

1. 静态开发流程，只做纯样式，静态JS效果,对应命令行 npm run static
2. 混合开发流程，开始进入后端环境，与后端联调,对应命令行 npm run dev
3. 发布构建流程，产出正式上线的文件用于上线，对应命令行 npm run build


### 项目模板获取

项目模板获取方式有二种：
1. 通过配套的脚手架wps-cli使用

``` cmd
    npm install wps-cli -g
    wps create project-name
```
通过此种方式获取代码，可以在命令行后面带入-t选择是否要开启html模块化功能
``` cmd
    wps create project-name -f // 使用html模块化
    wps create project-name // 默认不使用html模块化
```

2. 直接通过git clone使用
```
    git clone git@github.com:xw5/wps_mix.git
```

通过此种方式获取代码，获取的是完整的模板文件，根据需要选择留下哪个html,并修改config/config.js下的template值，如为true,则是使用html的模块化功能，你需要保留template文件夹，保留index.template.html文件，删除index.html文件，再把index.template.html改成index.html,反之则保留index.html,删除index.template.html文件和template文件夹。

### 项目模板架构

使用此项目模板需要遵循一定的目录结构，详细说明如下:
![项目模板架构](https://raw.githubusercontent.com/xw5/wps_mix/master/explain.png)