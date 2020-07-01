
'use strict';
import appSdk from '@/common/appSdk.js';//初始化appsdk
import commonFun from '@/common/commonFun.js';//初始化appsdk
import userApi from '@/common/api/userApi.js';//初始化appsdk
import globalConfig from '@/globalConfig'
import saveGarageOrder from '@/component/save-garage-order';
//识别访问模式 pc? mobile? app
import modeDrive from '@/packages/mode-drive';
/**
 *与用户交互的代理，用来区分是微信还是APP
 *

 */
export default {
	//获取token  IsVerified是否验证token的有效性,true是验证
	getToken: function (IsVerified) {
		if (this.isApp()) {
			return appSdk.getToken(IsVerified);
		} else {
			return new Promise((resolve, reject) => {
				let token = userApi.getPcToken();
			    if(IsVerified===true){
					if(token==null || token == ''){
						reject({error_code: '100010',error: 'token为空,重新登陆'});
					}else{
						userApi.verificationPcLogin(token).then(rs=>{
						  //有登陆信息的
						   resolve(token);
						 }).catch(e=>{
						  //没有登陆,跳转到等页面
						  reject({error_code: '100010',error: 'token过期,重新登陆'});
						 })
					}
                  }else{
                     resolve(token);
                  }
		    });
        }
	},

	getCanOpenCamera:function(){

		//return appSdk.getCanOpenCamera();

		if (this.isApp()) {
			return appSdk.getCanOpenCamera();
		} else {
			//const token = localStorage.getItem('_token_');
            return new Promise((resolve, reject) => {
			    resolve("1");
		   });
        }
	},
  /**
  * 跳转去登录页面
  *
  * params  => callbackUrl 回跳路由，不填默认当前地址
  */
	goToLoginView: function (params={}) {

		if (this.isApp()) {
			return appSdk.goToLoginView(params);
		} else {


		 	this.setUrlCatch(params).then(()=>{
					location.href = globalConfig.apiDomain + "/Home/Login/login"
				})

			/*userApi.getLoginUrl(params).then(rs=>{

				location.href = rs;//跳转到登陆

				this.setUrlCatch(params).then(()=>{
					location.href = rs;
				})

			});*/

		}
	},
	//设置需要返回的url,和需要执行的方法
	 setUrlCatch :function(loginCallbackRun={}){

		return new Promise((resolve, reject)  => {

			if (loginCallbackRun.callbackUrl==undefined || loginCallbackRun.callbackUrl=='') {

					 //localStorage.setItem('callbackUrl',window.route.history.current.fullPath); //当前路由存储
					 localStorage.setItem('callbackUrl',location.hash.substr(1)); //当前路由存储

		 	}else{
		 		localStorage.setItem('callbackUrl',loginCallbackRun.callbackUrl);
		 	}
			resolve();
		})

	},
	//登陆完后回跳到相应的地址
goLoginBackurl : function(){

	  //登陆完后回调地址
      let callbackUrl = localStorage.getItem('callbackUrl');
      //登陆完以后,需要执行的方法
      let actionRun = localStorage.getItem('actionrun');

      let webSiteDomain = globalConfig.WebSiteDomain;

   		/*console.log(callbackUrl,'callbackUrl');
   		console.log(actionRun,'actionRun');
   		return false;*/
      if(actionRun!=undefined && actionRun!='' && actionRun!= null){
      	//如果有回调方法,需要先执行回调
      	if(actionRun=='saveBoutiqueFeatureToGarage'){
      		let preorderSid = localStorage.getItem('preorderSid');//预订单id
            let selectedFeaturesCode = localStorage.getItem('selectedFeaturesCode');//用户主动选择项featureCode
            let saveBoutiqueStr = localStorage.getItem('saveBoutiqueStr');//获取保存的精品

            saveGarageOrder.saveBoutiqueFeatureToGarage({preorderSid,selectedFeaturesCode,saveBoutiqueStr}).then(rs=>{

            	if(callbackUrl.indexOf("?") !=-1){

            		location.href = webSiteDomain+callbackUrl+'&garageId='+rs.data.data;
            	}else{
            		location.href = webSiteDomain+callbackUrl+'?garageId='+rs.data.data;
            	}

            }).catch(e=>{
	        	//保存车库失败,也是直接跳转
	        	location.href = webSiteDomain+callbackUrl
	      	})
      	}else if(actionRun=='deleteGarage'){
      		let garageId = localStorage.getItem('garageId');//车库id
      		//删除车库
      		saveGarageOrder.deleteGarage({garageId}).then(rs=>{
            	location.href = webSiteDomain+callbackUrl
            }).catch(e=>{
	        	//保存车库失败,也是直接跳转
	        	location.href = webSiteDomain+callbackUrl
	      	})
      	}
      }else{
      	//没有回调方法的时候直接跳转到回调地址上
      	location.href = webSiteDomain+callbackUrl;
      }

},
  /**
  * 跳转去首页页面
  */
	goToHomeView: function () {
		if (this.isApp()) {
			appSdk.goToHomeView();
		} else {
			window.route.push({name: "home",params: {clearCache: true} });
		}
	},
  /**
  * 跳转去H5页面
  */
	goToH5View: function (url) {
		if (this.isApp()) {
			return appSdk.goToH5View(url);
		} else {
			location.href = url;
		}
	},
  /**
  * 关闭H5页面
  */
	closeH5View: function(params){
		if (this.isApp()) {
			appSdk.closeH5View(params);
		} else {
			window.route.push({name: "home",params: {clearCache: true} });
			//alert("关闭页面");return false;
		}
	},
  /**
  * 跳转去在线客服页面
  */
	goToOnlineChatView: function () {
		if (this.isApp()) {
			appSdk.goToOnlineChatView();
		} else {
			window.open("https://imcc.saicmaxus.com/any800/echatManager.do?companyPk=ff80808165f0e0640165f153eb870069&codeKey=13")
			//alert('跳转去在线客服页面')
		}
	},
	/**
   * 跳转去下单页面
   */
   goToOrderView: function(url) {
		if (this.isApp()) {
			return appSdk.goToOrderView(url);
		} else {
			location.href = url;
		}
	},
	isApp: function () {
		if (modeDrive.isApp() === true) {
			return true;
		}
		return false;
	}
};
