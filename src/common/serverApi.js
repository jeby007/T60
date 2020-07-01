import globalConfig from '@/globalConfig'
import axios from 'axios'
import {loading} from '@/packages/loading'

 
export default{
	install: function () {
		axios.defaults.baseURL = globalConfig.apiDomain;
	},
  get: function(url,params = {},options = {}){
    if(typeof(params) == 'undefined'){
      params = {};
    }
	if(options.showLoad === true){
		loading.show();
	}
    return axios.get(url,{params: params}).then(rs => {
        return rs.data;
     }).then(data => {
		if(options.showLoad === true){
			loading.hide();
		}
		return data;
	 });
  },
    /**
     * 文件上传
     */
    uploadFile: function(url,formData){
        var serverPost =  axios.create({
            baseURL: globalConfig.apiDomain,
            headers: {'Content-Type':'multipart/form-data'}
        });
        //加载中...
        //window.vueVm.$loading.show();
        loading.show();
        //加载中...
        return serverPost.post(url,formData).then(rs =>{
            //window.vueVm.$loading.hide();
            loading.hide();
            return rs;
        })
        /*
              let headers = {headers: {"Content-Type": "multipart/form-data"}}
              return axios.post(url,formData,headers).then(rs => {
                return rs.data;
             });*/
    }
};