/**
* 用户评价组件
*/
import Vue from 'vue'
import FeatureCommentTag from './src/feature-comment-tag';
import FeatureCommentAdd from './src/feature-comment-add';
import FeatureCommentList from './src/feature-comment-list';


import FeatureComment from './src/main.js';


export default {
	 install(Vue,options = {}) {
		Vue.use(FeatureComment,options)
	}
} 
		
export {FeatureCommentTag,FeatureCommentAdd,FeatureCommentList};
