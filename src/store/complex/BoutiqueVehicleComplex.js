import Vue from 'vue'
import store from '@/store/index';
import commonFun from '@/common/commonFun.js';//初始化appsdk
import interActiveHandler from '@/common/InterActiveHandler'
import ModeDrive from '@/packages/mode-drive';
import serverApi from '@/common/serverApi'
/**
* 精品 于选配的复合业务
**/
const BoutiqueVehicleComplex = {

}
/**
* 初始化数据
options => 
		params  请求参数

		on => 
			vehicleSuccess 加载选配数据完成
			boutiqueSuccess 加载精品数据完成

*/
BoutiqueVehicleComplex.init = function (options = {}) {
			let params= options.params

			let urlparams = commonFun.GetRequest();//获取url上的参数,可能url里面会有大客户,汽车之家等参数过来,保存车库的时候需要有
			
			//把url上的参数存储到缓存
			sessionStorage.setItem("urlparams",JSON.stringify(urlparams));

			let urlparamss = sessionStorage.getItem("urlparams");
	

			params = Object.assign({}, urlparams, params); 


			let modeType = ModeDrive.getModel();
			params['modeType'] = modeType;
 
			if(typeof(params.garageId) != 'undefined'){ //需要用户登录
				return interActiveHandler.getToken(true).then((token)=>{
					params['token'] = token
					options.params = params
					return this._initData(options);
				}).catch(e=>{
					console.log(e,'eeeeee')
					interActiveHandler.goToLoginView();
				})
			}else{
				options.params = params
				return this._initData(options);
			}


}

//下单
BoutiqueVehicleComplex.saveBoutiqueVehicleToOrder = function(params={}){

    //用户主动选择项featureCode
    let selectedFeaturesCode = params.selectedFeaturesCode;
    //获取保存的精品

	let modeType = ModeDrive.getModel();
    params['modeType'] = modeType;
	params['selectedFeaturesCode'] =  selectedFeaturesCode!=undefined?selectedFeaturesCode.join(','):'';;
	

    //把url上的参数存储到缓存
	let urlparams = 	 JSON.parse(sessionStorage.getItem("urlparams"));//获取之前缓存当中url的上的参数
	params = Object.assign({}, urlparams, params);  //合并传过来的参数和之前存储的url参数

	return new Promise((resolve, reject)  => {
		if(params.saveBoutiqueStr!='' && params.saveBoutiqueStr!=undefined){
	    //如果有精品第一步要先保存精品
    		serverApi.get('Home/boutique/saveBoutque', {'preorderSid':params.preorderSid,'boutiqueAndNum':params.saveBoutiqueStr}).then(rs=>{
		     	//精品保存成功后保存车库
			     serverApi.get('Home/Index/saveToOrder',params).then(rs=>{
						if(rs.error_code==0){
							resolve(rs);
						}else{
							reject({error_code: '1004',error: '下单失败,请稍后再试'})
						}
					 })
				 }).catch(e=>{
			        reject({error_code: '1003',error: '精品保存失败,请稍后再试'})
			    })
	    }else{
	    	
	    	//保存车库
	    	serverApi.get('Home/Index/saveToOrder',params).then(rs=>{
				if(rs.error_code==0){
					resolve(rs);
				}else{
					reject({error_code: '1004',error: '下单失败,请稍后再试'})
				}
			 }).catch(e=>{
		        reject({error_code: '1004',error: '下单失败,请稍后再试'})
		      })
	    }   
	})
}

//保存精品,保存车库,后期还要有保存定制化精品
BoutiqueVehicleComplex.saveBoutiqueVehicleToGarage = function(params={}){

	
   
    //把url上的参数存储到缓存
	let urlparams = 	 JSON.parse(sessionStorage.getItem("urlparams"));//获取之前缓存当中url的上的参数
	params = Object.assign({}, urlparams, params);  //合并传过来的参数和之前存储的url参数
	let modeType = ModeDrive.getModel();
	params['modeType'] = modeType;

	
	return new Promise((resolve, reject)  => {
		if(params.saveBoutiqueStr!='' && params.saveBoutiqueStr!=undefined){
	    //如果有精品第一步要先保存精品
    		serverApi.get('Home/boutique/saveBoutque', {'preorderSid':params.preorderSid,'boutiqueAndNum':params.saveBoutiqueStr}).then(rs=>{
		     	//精品保存成功后保存车库
			     serverApi.get('Home/Garage/saveToGarage',params).then(rs=>{
						if(rs.error_code==0){
							resolve(rs);
						}else{
							reject({error_code: '1004',error: '车库保存失败,请稍后再试'})
						}
					 })
				 }).catch(e=>{
			        reject({error_code: '1003',error: '精品保存失败,请稍后再试'})
			    })
	    }else{
	    	
	    	//保存车库
	    	serverApi.get('Home/Garage/saveToGarage',params).then(rs=>{
				if(rs.error_code==0){
					resolve(rs);
				}else{
					reject({error_code: '1004',error: '车库保存失败,请稍后再试'})
				}
			 }).catch(e=>{
		        reject({error_code: '1004',error: '车库保存失败,请稍后再试'})
		      })
	    }   
	})
}

BoutiqueVehicleComplex._initData = function (options = {}) {
	let params = options.params
	let events = options.on
	
	return store.dispatch('vehicle/init', params).then(() => {
		//通知 车型加载完毕
		if(events !=undefined && typeof(events.vehicleSuccess) == 'function'){
			events.vehicleSuccess();
		}
		//初始化精品
		 return store.dispatch('boutique/init',params).then(()=>{
			//通知 车型加载完毕
			if(events!=undefined &&  typeof(events.boutiqueSuccess) == 'function'){
				events.boutiqueSuccess();
			}
			//精品调用完,过滤精品
		   return this.changeBoutique();
		})
	})
 }
	 
BoutiqueVehicleComplex.setUserSelectFeature = function ({feature,family}) {
   return store.dispatch('vehicle/setUserSelectFeature', {feature,family}).then(()=>{
                //精品调用完,过滤精品
                return  this.changeBoutique();
		})
}
		
BoutiqueVehicleComplex.changeBoutique = function () {
		//精品调用完,过滤精品
		return store.dispatch('boutique/filterBoutiqueList',store.getters['vehicle/getAllSelectedFeaturesCode']).then((rs)=>{
			//给feature添加精品
			let haveBoutiqueFeatureCode = rs.haveBoutiqueFeatureCode;
			let featureCodeBoutiqueName = rs.featureCodeBoutiqueName;
		
			 store.commit('vehicle/setFeatureBoutique',{featureCodes: haveBoutiqueFeatureCode,featureCodeBoutiqueName:featureCodeBoutiqueName});
			 return Promise.resolve();
		})
}
		
/**
* 清理数据
*/
BoutiqueVehicleComplex.clearData = function () {
	
            //清理选配数据
            store.commit('vehicle/clearData')
            store.commit('boutique/clearData')

            
			//return Promise.resolve();
}
export default BoutiqueVehicleComplex 