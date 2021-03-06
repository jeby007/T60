import Vue from 'vue'
 
//支持的模式
const ModeDriveType = ['pc','mobile','app'];

const ModeDrive = {
	type: 'mobile',
	getQueryString: function(name){
		var reg = new RegExp("(^|&|\\?)" + name + "=([^&]*)(&|$)", "i"); 
		var r = window.location.href.substr(1).match(reg); 
		if (r != null) return unescape(r[2]); 
		return null; 
	},
	/**
	 * 根据浏览器性质来判断
	 */
	browserRedirect: function(){
		//优先以APP为准
		if(this.valid.app()){
			return 'app';
		}
		
		if(this.valid.mobile()){
			return 'mobile';
		}
		
		if(this.valid.pc()){
			return 'pc';
		}
		return null;
	},
	valid: {
		mobile: function(){
			let sUserAgent = navigator.userAgent.toLowerCase();
			let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
			let bIsMidp = sUserAgent.match(/midp/i) == "midp";
			let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
			let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
			let bIsAndroid = sUserAgent.match(/android/i) == "android";
			let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
			let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
			if (!(bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){ //PC端
				return false;
			}
			return true;
		},
		pc: function(){
			return this.mobile() === false;
		},
		app: function(){
			if(window.isMaxusApp){
				return true;
			}
			return false;
		}
	}
}

/**
 * 优先从请求的参数里获取想要的访问模式 通过参数 _mode_drive_控制显示的模式
 */
ModeDrive.install = function (Vue,validOptions = {}) {
	
	let _mode_drive_ = this.getQueryString("_mode_drive_");
	if(_mode_drive_!=null){
		let _have = ModeDriveType.find(vo => {
			return vo === _mode_drive_;
		});
		if(_have !=null){
			this.type = _mode_drive_
		}
	}else{
		this.valid = Object.assign({}, this.valid, validOptions); // 验证规则
		_mode_drive_ = this.browserRedirect();
		if(_mode_drive_ !=null){
			this.type = _mode_drive_
		}
	}
	console.info("route",this.type)
	Vue.prototype.$modeDrive = ModeDrive; // 将ModeDrive组件暴露出去，并挂载在Vue的prototype上
}



/*
* 获取当前访问的模式
* 返回 pc mobile app 
**/
ModeDrive.getModel = function() {
	return this.type;
}

ModeDrive.isPc = function () {
	return this.getModel() === 'pc';
}


ModeDrive.isMobile = function () {
	return this.getModel() === 'mobile';
}

ModeDrive.isApp = function () {
	return this.getModel() === 'app';
}


/**
 * 自己设置驱动类别
 */
ModeDrive.setModeDriveType = function (driveType) {
	this.type  = driveType;
}


export default ModeDrive
