define(function(require, exports, module) {
    'use strict';
    //@option是一个参数对象对应的参数如下
    //@param listId滚动列表的ID，默认tipslist
    //@param time是多久更新一次，默认3.5s
    //@param speed是滚动一条的时间，默认0.6S
    function PlayList(option){
        this.defaultSetting = {
            listId:'tipsList',//滚播的父级ID
            time:3.5,//每隔多久滚播一次
            speed:0.6//滚播的速度
        }
        this.nowSetting = $.extend({},this.defaultSetting,option);//参数重置
        this.init();//初始化滚播
    };
    PlayList.prototype.init = function(){
        var that = this;
        this.nowStep = 0;
        this.listO = $('#'+this.defaultSetting.listId);
        this.listCon = this.listO.children().eq(0);
        this.listItem = this.listCon.children();
        this.listLen = this.listItem.length;
        this.listCon.append(this.listItem.eq(0).clone());
        this.step = this.listItem.eq(0).height();//滚动一次的步长
        this.play();
        //窗口变化则执行重置操作
        $(window).on('resize',function(){
            that.reset();
        });
    };
    //播放滚动
    PlayList.prototype.play = function(){
        var that = this;
        clearInterval(this.timer);
        this.timer = setInterval(function(){
            that.nowStep++;
            that.listCon.css({
                'transition':'transform '+that.defaultSetting.speed+'s',
                'webkitTransition':'transform '+that.defaultSetting.speed+'s',
                'transform':'translateY(-'+that.nowStep*that.step+'px)',
                'webkitTransform':'translateY(-'+that.nowStep*that.step+'px)'
            });
            if(that.nowStep>=that.listLen){//当滚动到最后一张的时候，重置到初始位置
                setTimeout(function(){
                    that.listCon.css({
                        'transition':'none',
                        'webkitTransition':'none',
                        'transform':'translateY(0px)',
                        'webkitTransform':'translateY(0px)'
                    });
                    that.nowStep = 0;
                },that.nowSetting.speed*1000);
            }
        },this.defaultSetting.time*1000);
    };
    //窗口变化重置相关属性
    PlayList.prototype.reset = function(){
        var that = this;
        clearInterval(this.timer);
        this.timer = setTimeout(function(){
            that.step = that.listItem.eq(0).height();
            that.listCon.css({
                'transition':'none',
                'webkitTransition':'none',
                'transform':'translateY(-'+that.nowStep*that.step+'px)',
                'webkitTransform':'translateY(-'+that.nowStep*that.step+'px)'
            });
            that.play();
        },100);
    };
    return PlayList;
});