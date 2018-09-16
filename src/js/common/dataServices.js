define(function() {
	'use strict';
	
	
	/**
	* 创建模板服务模块
	*
	*/
	
	var DataServices = function() {
		this.init();
	};

	DataServices.prototype = {
		constructor: DataServices,

		init: function() {
			this.dataServices = [];
			this.dataModel = window.datamodel || {};			
		},

		add: function(name, url, dataMap, action) {
			this.dataServices[name] = new CURD(url, dataMap, action);
		},

		get: function(name) {
			return this.dataServices[name];
		},

		getDataModel: function() {
			return this.dataModel;
		}
	};

	
	var CURD = function(url, dataMap, action) {
		this.action = $.extend(true, {
			query: {},
			create: {},
			update: {},
			remove: {}
		}, action);
		this.params = {url: url};
		this.dataMap = dataMap;
		this.init();
	};

	CURD.prototype = {
		constructor: CURD,

		init: function() {
			for (var x in this.action) {
				this[x] = function(type) {
					return function(params){
						return this.send(params, type);	
					}; 
				}(x);
			}
		},

		//发送信息
		send: function(params, type) {			
			var _params = $.extend(true, {}, this.params, this.action[type], params);

			for (var x in this.dataMap) {
				if (_params.hasOwnProperty(x)) {
					var reg = new RegExp(':\\b' + x + '\\b');
					_params.url = _params.url.replace(reg, _params[x]);
				}
			}

			var httpHandler = $.ajax({
				type: _params.method || 'POST',
				cache: _params.cache,
				url: _params.url,
				dataType: _params.dataType || 'json',
				timeout: _params.timeout || 10000,
				data: _params.data || {}
			});
			return httpHandler;
		}
	};
	

	var ins = new DataServices();
    // 签到接口
    ins.add(
        'sign',												// name
        '/sign:_method_',						// url
        {_method_: '@_method_' },							// dataMap
        {													// action
            // 签到/补签
            setSign: {_method_: '/v2'},
            // 获取签到相关信息
            getSignStatus: {_method_: '/condition', method: 'GET'},
            // 获取签到已得奖品列表
            getMyRewards: {_method_: '/my_sign_gift', method: 'GET'},
            // 获取补签次数
            getAdditional: {_method_: '/additional', method: 'GET'},
            // 提交收货地址
            setAddress: {_method_: '/address/update'},
            // 获取所有翻牌的奖品接口
            getRecharge: {_method_: '/lists', method: 'get'},
            // 分享公众号信息
            getShare: {method: 'POST', _method_: '//zt.wps.cn/2018/pay_share/api/ticket',cache: false}
        }
    );
    ins.add(
        'address',												// name
        '/address:_method_',						// url
        {_method_: '@_method_' },							// dataMap
        {													// action
            // 提交收货地址
            setAddress: {_method_: '/update'}
        }
    );

	return ins;
})