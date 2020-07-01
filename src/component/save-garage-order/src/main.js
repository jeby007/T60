import Vue from 'vue'
import serverApi from '@/common/serverApi'
import InterActiveHandler from '@/common/InterActiveHandler'
import ModeDrive from '@/packages/mode-drive';
import commonFun from '@/common/commonFun.js';//初始化appsdk
import globalConfig from '@/globalConfig'
//支持的模式
const SaveGarageOrder = ['pc','mobile','app'];


/**
 * 优先从请求的参数里获取想要的访问模式 通过参数 _mode_drive_控制显示的模式
 */
SaveGarageOrder.install = function (Vue,options = {}) {
	
	
}


/*
* 保存精品,用户主动选择项到车库 , 如果有精品第一步先保存精品,然后保存车库
* @param preorderSid 预订单id
* @param selectedFeaturesCode 主动选择项
* @param saveBoutiqueStr 选择的精品
* @param garageId 如果是修改、就传修改的车库ID
* 返回 pc mobile app 
**/
SaveGarageOrder.saveBoutiqueFeatureToGarage = function({preorderSid,garageId,selectedFeaturesCode,saveBoutiqueStr,token}){
	 //先获取token
	  
	 let boutiqueSaveParams = {'preorderSid':preorderSid,'saveBoutiqueStr':saveBoutiqueStr}; //保存的精品

    return new Promise((resolve, reject)  => {

    	 localStorage.setItem('preorderSid', preorderSid);
		 localStorage.setItem('selectedFeaturesCode', selectedFeaturesCode);
		 localStorage.setItem('saveBoutiqueStr', saveBoutiqueStr);
		        //InterActiveHandler.goToLoginView(loginCallbackRun); //跳转到登陆

    		
    		 let selectedFeaturesCode = selectedFeaturesCode!=undefined?selectedFeaturesCode.join(','):'';
 			 let modeType = ModeDrive.getModel();
    		 let saveToOrderParams = {'preorderSid':preorderSid,'selectedCodes':selectedFeaturesCode,'token':token,'modeType':modeType,garageId: garageId};
	 		 let urlparams = commonFun.GetRequest();//获取url上的参数,可能url里面会有大客户,汽车之家等参数过来,保存车库的时候需要有
	         let newsaveToOrderParams = $.extend({}, urlparams, saveToOrderParams); 
	   
	        //能获取到token,并且是有效的
	        //保存精品
	        if(saveBoutiqueStr!='' && saveBoutiqueStr!=undefined){
	  
	        	let boutiqueSaveParams = {'preorderSid':preorderSid,'boutiqueAndNum':saveBoutiqueStr};
	        	//保存精品
	        	this.boutiqueSave(boutiqueSaveParams).then(rs=>{
	        		//保存车库
	        		this.garageSave(newsaveToOrderParams).then(garageRs=>{
	        			resolve(garageRs);//返回车库保存的结果
	        		}).catch(e=>{
	        			//车库保存失败
	        			reject(e)
	        		})
	        	}).catch(e=>{
	        		//精品保存失败
	        		reject(e)
	        	})
	        }else{
	        
	        		//保存车库
	        		this.garageSave(newsaveToOrderParams).then(garageRs=>{

	        			resolve(garageRs);//返回车库保存的结果
	        		}).catch(e=>{
	        			//车库保存失败
	        			reject(e)
	        		})
	        } 
    })  
}	

/**
* 验证是否登陆,没有登陆直接跳转到登陆页面
* loginCallbackRun 用户设定的如果没有登陆,登陆后的回调和执行方法  {callbackUrl:'',actionrun:'saveBoutiqueFeatureToGarage'};
* callbackUrl 登陆后跳转的页面(默认是当前路由,可以为空)  actionrun 登陆后先执行这个方法,然后跳转到回调地址(可以为空)
*/
SaveGarageOrder.verificationLogin = function(loginCallbackRun={}){
	return new Promise((resolve, reject)  => {
		InterActiveHandler.getToken(true,loginCallbackRun).then((token)=>{
			resolve()
		})
	})
}

/**
* 车库列表
* loginCallbackRun 用户设定的如果没有登陆,登陆后的回调和执行方法  {callbackUrl:'',actionrun:'saveBoutiqueFeatureToGarage'};
* callbackUrl 登陆后跳转的页面(默认是当前路由,可以为空)  actionrun 登陆后先执行这个方法,然后跳转到回调地址(可以为空)
*/
SaveGarageOrder.garageList = function(loginCallbackRun={}){
	return new Promise((resolve, reject)  => {
		InterActiveHandler.getToken(true,loginCallbackRun).then((token)=>{
			
			serverApi.get('Home/Garage/myGarage',{token:token}).then(rs=>{
	     		resolve(rs)
			 }).catch(e=>{
		        reject({error_code: '1003',error: '车库列表加载失败,请稍后再试'})
		    })
		})
	})

}



/**
* 确认配置页下单,可以提前不登陆,需要先保存精品
* preorderSid 预订单id
* selectedCodes 用户主动选择的featurecode
*/
SaveGarageOrder.saveToOrder = function({preorderSid,saveBoutiqueStr,selectedCodes}){
	
	return new Promise((resolve, reject)  => {

		 let selectedCodes = selectedCodes!=undefined?selectedCodes.join(','):'';
		 let saveToOrderParams = {'preorderSid':preorderSid,'selectedCodes':selectedCodes};
		 let urlparams = commonFun.GetRequest();//获取url上的参数,可能url里面会有大客户,汽车之家等参数过来,保存车库的时候需要有
    	 let newsaveToOrderParams = $.extend({}, urlparams, saveToOrderParams); 

    	 console.log("saveBoutiqueStr",saveBoutiqueStr);
    	 console.log("preorderSid",preorderSid);
    	 console.log("selectedCodes",selectedCodes);

		 //保存精品
        if(saveBoutiqueStr!='' && saveBoutiqueStr!=undefined){
        	let boutiqueSaveParams = {'preorderSid':preorderSid,'boutiqueAndNum':saveBoutiqueStr};
     
        	//保存精品
        	this.boutiqueSave(boutiqueSaveParams).then(rs=>{
        		//下单
        		this.saveToOrderFun(newsaveToOrderParams).then(rsorder=>{
        			resolve(rsorder)
        		}).catch(e=>{
        			//下单失败
        			reject(e)
        		})
        	}).catch(e=>{
        		//精品保存失败
        		reject(e)
        	})
        }else{
        	//下单
    		this.saveToOrderFun(newsaveToOrderParams).then(rsorder=>{
    			resolve(rsorder)
    		}).catch(e=>{
    			//下单失败
    			reject(e)
    		})
        }


		
	})
}
//保存精品
SaveGarageOrder.boutiqueSave = function(boutiqueSaveParams){
	return new Promise((resolve, reject)  => {
		serverApi.get('Home/boutique/saveBoutque',boutiqueSaveParams).then(rs=>{
	     	resolve(rs)
		 }).catch(e=>{
	        reject({error_code: '1003',error: '精品保存失败,请稍后再试'})
	    })

	})

}

//保存选配车到车库
SaveGarageOrder.garageSave = function(saveToOrderParams){
	return new Promise((resolve, reject)  => {
		serverApi.get('Home/Garage/saveToGarage',saveToOrderParams).then(rs=>{
			if(rs.error_code==0){
				resolve(rs)
			}else{
				reject({error_code: '1004',error: '车库保存失败,请稍后再试'})
			}
	     	
		 }).catch(e=>{
	        reject({error_code: '1004',error: '车库保存失败,请稍后再试'})
	      })

	})

}
//保存订单
SaveGarageOrder.saveToOrderFun = function(params){
	return new Promise((resolve, reject)  => {
		serverApi.get('Home/Index/saveToOrder',params).then(rs=>{
			if(rs.success){
				resolve(rs);
				//location.href = rs.url;
			}else{
				reject({error_code: '1008',error: '下单失败,稍后再试'})
			}
		 }).catch(e=>{
	        reject({error_code: '1008',error: '下单失败,稍后再试'})
	      })

	})

	
}

//保存现车
SaveGarageOrder.inventorySaveToGarage = function(saveToOrderParams){
	return new Promise((resolve, reject)  => {
		serverApi.get('Home/Garage/inventorySaveToGarage',saveToOrderParams).then(rs=>{
	     	resolve(rs)
		 }).catch(e=>{
	        reject({error_code: '1005',error: '车库保存失败,请稍后再试'})
	      })

	})

}



//设置需要返回的url,和需要执行的方法
/*SaveGarageOrder.setUrlCatch = function({loginCallbackRun}){

	return new Promise((resolve, reject)  => {


		 if(loginCallbackRun!=undefined || loginCallbackRun!=''){
		 	if (loginCallbackRun.callbackUrl==undefined || loginCallbackRun.callbackUrl=='') {
		 		localStorage.setItem('callbackUrl',window.route.history.current.fullPath); //当前路由存储
		 	}else{
		 		localStorage.setItem('callbackUrl',loginCallbackRun.callbackUrl);
		 	}

		 	if (loginCallbackRun.actionrun==undefined || loginCallbackRun.actionrun=='') {
		 		localStorage.removeItem('actionrun');
		 	}else{
		 		localStorage.setItem('actionrun',loginCallbackRun.actionrun);
		 	}

		 	//localStorage.setItem('loginCallbackRun', 'saveBoutiqueFeatureToGarage');
		 }else{
			localStorage.setItem('callbackUrl',window.route.history.current.fullPath); //当前路由存储 
		 }
		 resolve();
	})
	

}*/




export default SaveGarageOrder
