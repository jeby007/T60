import Vue from 'vue'
import ThreeOptionaMain from './src/main';


import ThreeOptionalVue from './src/three-optional.vue';

const ThreeOptional = {
	install: (Vue,options = {}) => {
		 if(options.isRegComponent === true){
			 Vue.component(ThreeOptionalVue.name, ThreeOptionalVue);
		 }
		 Vue.use(ThreeOptionaMain,options)
	}
}


export default ThreeOptional;