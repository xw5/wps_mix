define(function(require, exports, module) {
    'use strict';
    //@option是一个参数对象对应的参数如下
    //@param time连续翻牌的时间间隔，默认600
    //@param className每一张牌的样式名，默认card_main
    //@param activeClass翻版时的样式，默认active
    //@param linkClass当前牌链接可点击的样式，默认linked
    //@param disableClass渐隐的样式名，默认disabled
    //@param data牌面的数据（链接，奖品图...），默认active
    //@param verifyFn暴露给外的验证函数，只有这个函数返回true时才可触发翻牌动作，默认return true
    function OpenCard(option){
        this.defaultSetting = {
            time:600,//每隔多久翻一张牌
            className:'card_main',//牌样式名
            activeClass:'active',//翻牌触发样式
            linkClass:'linked',//可点击
            disableClass:'disabled',//渐隐样式
            data:[],//奖品相关数据
            playCardFn:function(){//点击牌面执行的函数
                return true;
            }
        }
        this.nowSetting = $.extend({},this.defaultSetting,option);//参数重置
        this.init();
        this.addEvent();//事件绑定
    }
    OpenCard.prototype.init = function(){//进行翻牌前可进行复位准备下一次翻牌
        var that = this;
        this.cardList = $('.'+this.nowSetting.className);
        this.cardFront = $('.'+this.nowSetting.frontName);
        this.len = this.cardList.length;
        this.start = 0;
        this.index = -1;//当前被点击的牌面索引
        this.timer = null;
        this.luckId = '';//所中奖品ID
        this.isClicked = false;//牌面是否已经被翻过来了
        //复位牌
        this.cardList.each(function(){
            var index = $(this).index();
            var data = that.nowSetting.data[index];
            //清除高亮，渐隐，可点击等样式
            $(this).removeClass(that.nowSetting.activeClass);
            $(this).removeClass(that.nowSetting.disableClass);
            $(this).removeClass(that.nowSetting.linkClass);
            $(this).find('img').attr('src',data.middle_img);
            $(this).find('a').attr('href',data.url ? data.url : 'javascript:void(0);');
        });
    }
    OpenCard.prototype.getIndex = function(id){//根据ID值返回位置索引
        var data = this.nowSetting.data;
        var index = -1;
        for(var i = 0,len=data.length;i<len;i++){
            if(data[i].id === id){
                index = i;
                break;
            }
        }
        return index;
    }
    OpenCard.prototype.setPrize = function(){//调整奖品顺序，把所中的奖品放到用户点击的位置
        var prizeIndex = this.getIndex(this.luckId);
        var data = this.nowSetting.data;
        var card = this.cardList.eq(this.index);
        var card0 = this.cardList.eq(prizeIndex);
        if(prizeIndex === this.index){//如果点击的奖品位置正好是所中奖品位置，不做处理
            return ;
        }
        //把点击的位置换成所中的奖品
        card.find('img').attr('src',data[prizeIndex].middle_img);
        card.find('a').attr('href',data[prizeIndex].url ? data[prizeIndex].url : 'javascript:void(0);');
        //把点击位置的初始奖品放到另一位置占位
        card0.find('img').attr('src',data[this.index].middle_img);
        card0.find('a').attr('href',data[this.index].url ? data[this.index].url : 'javascript:void(0);');
    };
    // OpenCard.prototype.addEvent = function(){//事件绑定
    //     var that = this;
    //     this.cardList.each(function(){
    //         $(this).on('click',function(){
    //             if(that.nowSetting.verifyFn() && !that.isClicked){//验证动作，只有当外面设计的逻辑充许抽奖且当前没在翻牌状态才让走翻牌逻辑
    //                 that.isClicked = true;
    //                 that.index = $(this).index();
    //                 that.setPrize();
    //                 that.play();
    //             }
    //         })
    //     });
    // }
    OpenCard.prototype.addEvent = function(){//事件绑定
        var that = this;
        this.cardList.each(function(){
            $(this).on('click',function(){
                if(!that.isClicked){//避免多次点击
                    that.isClicked = true;
                    that.index = $(this).index();
                    that.nowSetting.playCardFn(this);
                    // that.index = $(this).index();
                    // that.setPrize();
                    // that.play();
                }
            })
        });
    };
    OpenCard.prototype.play = function(){//翻牌逻辑,data是要用来显示的牌数据
        var that = this;
        //重置奖品位置
        this.setPrize();
        //每隔设定的时候翻一张牌
        this.cardList.eq(this.index).addClass(that.nowSetting.activeClass+' '+that.nowSetting.linkClass);
        this.timer = setInterval(function(){
            if(that.start === that.index){//如果玩家点的是第一张就让它自动直接翻下一张即可
                that.start++;
            }
            that.cardList.eq(that.start++).addClass(that.nowSetting.activeClass);
            if(that.start > that.len){
                clearInterval(that.timer);
                that.cardList.eq(that.index).siblings().addClass(that.nowSetting.disableClass);
            }
        },this.nowSetting.time);
    }
    return OpenCard;
});