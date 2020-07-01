import Vue from 'vue' 
 


let defaultOptions = {
}
 

let instance ;

const FeatureComment = {
		/**
		* 统计评论个数
		 params => featureCode
		*/
       countComment (params = {}) {
			//alert(params.featureCode)
			return Promise.resolve({dzs: 100,pls: 99});
	   }
}


/**
 * 
 */
FeatureComment.install = function (Vue,options = {}) {
	 defaultOptions = Object.assign({}, defaultOptions, options); // 配置参数
	 
}



export default FeatureComment
