import Vue from 'vue'
import serverApi from '@/common/serverApi'
import store from '@/store/index';

//识别访问模式 pc? mobile? app
import ModeDrive from '@/packages/mode-drive';
Vue.use(ModeDrive)

let showFeatureDialogVue = require('./main.vue').default
let showFeatureDialogVueMobile = require('./main_mobile.vue').default


const ShowFeatureDialog = {
}
const defaultOptions = {
	//不可以改变
	haveChange: false
}
let instance ;
/**
 * 优先从请求的参数里获取想要的访问模式 通过参数 _mode_drive_控制显示的模式
 */
ShowFeatureDialog.install = function (Vue) {

	// 创建一个VUE构造器
	let sfdConstructor;
	// 创建一个VUE构造器
	if(!ModeDrive.isWap()){
		sfdConstructor = Vue.extend(showFeatureDialogVue)
	}else{
		sfdConstructor = Vue.extend(showFeatureDialogVueMobile)
	}
	// 实例化VUE实例
	instance = new sfdConstructor({
		//data: options
	})

	// 此处使用$mount来手动开启编译。用$el来访问元素，并插入到body中
	instance.vm = instance.$mount()

	document.body.appendChild(instance.vm.$el)
}




/**
* 显示给用户看family下的其他 feature
* family 当前点击的
*/
ShowFeatureDialog.show = function(options = {}) {
	options = Object.assign({}, defaultOptions, options); // 验证规则
	let family = options.family


	let getShowFeaturesByFamily = store.getters["vehicle/getShowFeaturesByFamily"];
	let showFeatures = getShowFeaturesByFamily(family);


	instance.haveChange = options.haveChange

	instance.$off("applyChange")

	return new Promise((resolve) => {
		instance.show(family,showFeatures);
		instance.$on("applyChange",(info) => {
			resolve(info)
		})
	});


}







export default ShowFeatureDialog
