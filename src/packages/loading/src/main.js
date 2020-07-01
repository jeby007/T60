import Vue from 'vue'
let loadingVue = require('./main.vue').default
let loadingVueMob = require('./main_mobile.vue').default
 
import ModeDrive from '@/packages/mode-drive';
Vue.use(ModeDrive)

let defaultOptions = {
	text: '',
	progress: 0,
	//点击背景隐藏
	clickHide: false
}

//队列 用于存储显示个数
let queue = [];

let instance ;

const Loading = {
      
		  /**
		  *显示
			*	options => 
							text 文字
							progress 进度 填数字
		  */
		show (options = {}) {
			
			  queue.push(options);

			  //移除应用监听事件
			  instance.$off("hideLoad")
			  options = Object.assign({}, defaultOptions, options); // 配置参数 
			  
			  
				instance.clickHide = options.clickHide;
				instance.text = options.text;
				instance.progress = options.progress; 
			  instance.visible = true;
				
			  instance.$on("hideLoad",()=>{
				 this.hide(options);
			  })

		}
		,
		  /**
		  *显示
			*	options => 
						all => true 关闭所有
		  */
		hide (options = {}) {
			if(options.all === true){
				queue = [];
			}else{
				queue.pop();
			}
			
			if(queue.length <=0){
				  instance.visible = false; 
			}
			
		}
}


/**
 * 
 */
Loading.install = function (Vue,options = {}) {
	 defaultOptions = Object.assign({}, defaultOptions, options); // 配置参数
	// 创建一个VUE构造器
	let ldConstructor;
	if (!ModeDrive.isWap()) {
	    ldConstructor = Vue.extend(loadingVue)
	} else {
	    ldConstructor = Vue.extend(loadingVueMob)
	}
	// 实例化VUE实例
	instance = new ldConstructor({
		//data: options
	})
		
	// 此处使用$mount来手动开启编译。用$el来访问元素，并插入到body中
   instance.vm = instance.$mount()

   document.body.appendChild(instance.vm.$el)

	Vue.prototype.$loading = Loading; // 将组件暴露出去，并挂载在Vue的prototype上
}



export default Loading
