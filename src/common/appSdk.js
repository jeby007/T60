'use strict';
import userApi from '@/common/api/userApi';//用户接口
/**
 * h5 与 app交互的sdk
 *  
            
 */
export default {

   getCanOpenCamera:function(){
       var _self = this;
       return new Promise((resolve, reject) => {
       getCanOpenCameraCallBack = function (result) {
            
            if (result == null || result == '') {
               console.log('是否开启相机返回数据为空了')
               resolve(0)
            } else {
               resolve(result)
            }
         }

         try {
            if (_self.isAndroid()) {
               resolve(1);
               //window.android.canOpenCamera() 暂时不需要检测权限
            } else {
               _self.log('调用IosApp 是否开启相机方法');
               window.webkit.messageHandlers.canOpenCamera.postMessage(null);
            }

         } catch (e) {
            console.log('调用app判断权限出现了异常',e)
           resolve(1);//异常后显示开启
         }
      });
   },
   getToken: function (IsVerified) {
      let _self = this;
      //return Promise.resolve(66);
      return new Promise((resolve, reject) => {
              
         getTokenCallBack = function (token) {
            if(IsVerified === true){
               if (token == null || token == '') { 
                  //走错误
                  reject({error_code: '100010',error: 'token过期,重新登陆'});
               }else{
                  userApi.getInfoByToken(token).then(function(rs){
                     resolve(token)
                  }).catch( e=>{
                     //走错误
                     reject({error_code: '100010',error: 'token过期,重新登陆'});
                  })
               }
            }else{
               resolve(token);
            }
         }
         try {
            _self.log('调用APP获取token===>')
            if (_self.isAndroid()) {
               window.android.getToken()
            } else {
               window.webkit.messageHandlers.getToken.postMessage(null)
            }

         } catch (e) {
            _self.log("getToken异常了", JSON.stringify(e))
            //走错误
            reject();
         }
      });
   },
   /**
   * 跳转去登录页面 登录成功 返回token
   * params  => callbackUrl 回跳路由，不填默认当前地址
   */
   goToLoginView: function (params = {}) {
      let _self = this;
      return new Promise((resolve, reject) => {
         _self.log('跳转去App登录页面')
         getTokenCallBack = function (token) {
            _self.log('登录后拿到的token????' + token)
            if (token == null || token == '') {
               //走错误
               _self.log('走错误????')
               reject();
            } else {
               
               if(params.callbackUrl){
                  window.route.replace({name: 'loginCallback',params: {type: 'app'}})
               }else{
                  resolve(token)
               }
               
            }
         }
         if(params.callbackUrl){
            localStorage.setItem("callbackUrl", params.callbackUrl);
         }
		  if(_self.isAndroid()){
			 window.android.goToLoginView()
		  }else{
         _self.log('唤起苹果登录')
			 window.webkit.messageHandlers.goToLoginView.postMessage(null)
		  }
      });/*
      getTokenCallBack = function (token) {
		  _self.log('登录后拿到的token'+ token)
         if(token ==''){
            if(typeof(faile) != "undefined"){
               faile();
            }
         }else{
            userApi.getInfoByToken(token).then(userInfo => {
                success(userInfo);
            }).catch( e => {
               if(typeof(faile) != "undefined"){
                  faile();
               }
            })
         }
      }
      if(this.isAndroid()){
         window.android.goToLoginView()
      }else{
         window.webkit.messageHandlers.goToLoginView.postMessage(null)
      }*/
   },
   /**
   * 跳转去首页页面
   */
   goToHomeView: function () {
      var _self = this;
      _self.log('跳转去App首页')
      if (_self.isAndroid()) {
         window.android.goToHomeView()
      } else {
         _self.log('调用了苹果的去首页')
         
         try {
            //setTimeout(()=>{
               window.webkit.messageHandlers.goToHomeView.postMessage(null)
            //},500)
         } catch (e) {
            console.error("xxx",e)
            _self.log("goToHomeView异常了", e)
         }
         
      }
   },
   /**
   * 跳转去H5页面
   */
   goToH5View: function (url) {
      var _self = this;
      return new Promise((resolve, reject) => {
         _self.log('跳转去H5页')
         goToH5CallBack = function (params) {
            _self.log('回调参数' , params)
            resolve(params)
         }
		  if(_self.isAndroid()){
			 window.android.goToH5View(url)
		  }else{
			 window.webkit.messageHandlers.goToH5View.postMessage(url)
		  }
      });
   },
   /**
   * 关闭H5页面
   */
   closeH5View: function (params) {
      var _self = this;
	  if(_self.isAndroid()){
		 window.android.closeH5View(params)
	  }else{
		 if(typeof(params) =='undefined'){
			 params = ''
		 }
		// closeH5View(params)
		window.webkit.messageHandlers.closeH5View.postMessage(params)
	  }
   },
   /**
   * 跳转去在线客服页面
   */
   goToOnlineChatView: function () {
      var _self = this;
      _self.log('跳转去App在线客服')
      if (_self.isAndroid()) {
         window.android.goToOnlineChatView()
      } else {
         window.webkit.messageHandlers.goToOnlineChatView.postMessage(null)
      }
   },
	/**
   * 跳转去下单页面
   */
   goToOrderView: function (url) {
      var _self = this;
      _self.log('跳转去App下单')
      return new Promise((resolve, reject) => {
         goToOrderCallBack = function (orderId) {
            _self.log('执行了goToOrderCallBack',orderId)
            resolve(orderId)
         }
         if (_self.isAndroid()) {
            window.android.goToOrderView(url)
         } else {
            window.webkit.messageHandlers.goToOrderView.postMessage(url)
         }
      });
      /*goToOrderCallBack = function () {
         callback()
      }
      if(this.isAndroid()){
         window.android.goToOrderView(url)
      }else{
         window.webkit.messageHandlers.goToOrderView.postMessage(url)
      }*/
   },
   log: function (msg, data) {
      if (data) {
         console.log(msg, data);
      } else {
         console.log(msg);
      }

   },
   /*
   * 判断是否是安卓
   **/
   isAndroid: function () {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      if (bIsAndroid) {
         return true;
      }
      return false;
   },
   browserRedirect: function () {
      var sUserAgent = navigator.userAgent.toLowerCase();
      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      var bIsAndroid = sUserAgent.match(/android/i) == "android";
      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
      if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) { //PC端
         return;
      } else { // 移动端

      }
   }
};
