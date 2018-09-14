define(function(require, exports, module) {
	'use strict';

	/**
	* 创建模板服务模块
	*/
	var DataServices = function() {
		this.init();
	};

	DataServices.prototype = {
		constructor: DataServices,

		init: function() {
			this.dataServices = [];
		},

		add: function(name, url, dataMap, action) {
			this.dataServices[name] = new CURD(url, dataMap, action);
		},

		get: function(name) {
			return this.dataServices[name];
		}
	};
	
	var CURD = function(url, dataMap, action) {
		this.action = $.extend(true, {
			query: {},
			create: {},
			update: {},
			remove: {}
		}, action);
		this.action = action;
		this.params = {url: url};
		this.dataMap = dataMap;
		this.init();
	};

	CURD.prototype = {
		constructor: CURD,

		init: function() {
			for (var x in this.action){
				// 为CURD对象的属性建立方法
				this[x] = function(type) {
					return function(params){
						return this.send(params, type);	
					}; 
				}(x);
			}
		},

		//发送信息
		send: function(params, type) {
			var _params = $.extend(true, {data: {}}, this.params, this.action[type], params);
			for (var x in this.dataMap) {
				if (_params.hasOwnProperty(x)) {
					var reg = new RegExp(':\\b' + x + '\\b');
					_params.url = _params.url.replace(reg, _params[x]);
				}
			}

			var requetType = _params.method || 'post';
			var url = _params.url;
			// var header = JSON.stringify({'X-Requested-With': 'XMLHttpRequest', 'Cookie': 'wps_sid='+wpsid});
			var data =  _params.data || {};


			var ajax = $.ajax({
				url: url,
				type: requetType,
				dataType: 'json',
				data: data
			});

			ajax.always(function( resp ) {
				if( resp.result === 'error' && resp.msg === 'no_login' ) {
					window.location.replace('http://vip.wps.cn/sign/error');
				}
			});
			return ajax;
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
			setSign: {_method_: '/v2' },
			// 获取签到相关信息
			getSignStatus: {_method_: '/condition', method: 'get'},
			// 获取签到已得奖品列表
			getMyRewards: {_method_: '/my_sign_gift', method: 'get'},
			// 获取补签次数
			getAdditional: {_method_: '/additional', method: 'get'},
			// 查询支付状态
			//payStatus: {_method_: '/order_status', method: 'get'},
			// 获取所有翻牌的奖品接口
			getRecharge: {_method_: '/lists', method: 'get'}
		}
	);

	// 收获信息接口
	ins.add(
		'userInfo',
		':_method_',
		{_method_: '@_method_' },							
		{								
			// 确认收货人信息
			setInfo: {_method_: '/address/update'},
			getUserInfo: {_method_: '/userinfo', method: 'get'}
		}
	);

	// 支付相关列表
	ins.add(
		'pay',
		'/pay/:_method_',
		{_method_: '@_method_' },							
		{								
			// 购买稻米
			daomi: {_method_: 'daomi', method: 'post'},
			// 购买会员
			member: {_method_: 'webpay', method: 'post'}
		}
	);
    
	return ins;
});
