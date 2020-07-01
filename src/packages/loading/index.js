import Vue from 'vue'
import loading from './src/main';


export default {
	 install(Vue,options = {}) {
		Vue.use(loading,options)
	}
} 
		
export {loading};