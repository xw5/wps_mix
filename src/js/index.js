
require(['util','OpenCard','PlayList','dataServices','wx'],
    function(Util,OpenCard,PlayList,dataServices,wx) {
        console.log(Util,OpenCard,PlayList,dataServices,wx);
        var model = avalon.define({
            $id:"mobileSign",
            test:'这是avalon渲染的'
        });
        model.$watch('onReady',function(){
            //模拟loading效果
            setTimeout(function(){
                $('#pageLoading').remove();
            },1500);
        })
        avalon.scan(document.body);
        return model;
    });

