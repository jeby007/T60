import serverApi from '@/common/serverApi'
import commonFun from '@/common/commonFun'
/**
*	定制精品处理
*/
const state = {
	customBoutique:[],//定制头枕信息,
}


// getters 用来获取属性的
const getters = {


	getBgimg: (state ) => (defaultSelectCode) => {
		return state.customBoutique.bgImage.replace('${interior}',defaultSelectCode);

	},
	//返回主驾副驾
	getSelectDrivingcustomBoutique: (state ) => {
		return state.customBoutique;
	},
	//返回主驾或副驾
	getSelectDriving: (state ) => (status) => {
		let drivingName = '';
		if(status == 'mainDrivingName'){
            drivingName = state.customBoutique.mainDrivingName
		}else{
            drivingName  = state.customBoutique.deputyDrivingName;
		}
		return drivingName;
	},
	//返回坐标及字体大小
	getMainOrDeputyImagePos: (state ) => (status) => {
		let arr = state.customBoutique;
		let newXY = {};
		if(status=='main'){
			newXY['x'] = state.customBoutique['mainDrivingImagePosX'];
			newXY['y'] = state.customBoutique['mainDrivingImagePosY'];
			newXY['fontColorList'] = state.customBoutique['fontColorList'];
			newXY['fontSizeOfImage'] = state.customBoutique['fontSizeOfImage'];
		}else{
			newXY['x'] = state.customBoutique['deputyDrivingImagePosX'];
			newXY['y'] = state.customBoutique['deputyDrivingImagePosY'];
			newXY['fontColorList'] = state.customBoutique['fontColorList'];
			newXY['fontSizeOfImage'] = state.customBoutique['fontSizeOfImage'];
		}
		return newXY;
	},
	//返回坐标及字体大小
	getMainOrDeputyImagePoss: (state ) =>{

		let arr = state.customBoutique;

		let newXY = {};
		let mainXY = {};
		let detypeXY = {};
		let mainDetypeXY = {};
		mainXY['x'] = state.customBoutique['mainDrivingImagePosX'];
		mainXY['y'] = state.customBoutique['mainDrivingImagePosY'];
		mainXY['fontColorList'] = state.customBoutique['fontColorList'];
		mainXY['fontSizeOfImage'] = state.customBoutique['fontSizeOfImage'];
		mainDetypeXY['mainXY'] = mainXY;

		detypeXY['x'] = state.customBoutique['deputyDrivingImagePosX'];
		detypeXY['y'] = state.customBoutique['deputyDrivingImagePosY'];
		detypeXY['fontColorList'] = state.customBoutique['fontColorList'];
		detypeXY['fontSizeOfImage'] = state.customBoutique['fontSizeOfImage'];
		mainDetypeXY['detypeXY'] = detypeXY;


		return mainDetypeXY;
	},
	//返回字体颜色
	getOrDeputyImageFontColor: (state ) => (fontColorId) => {
		let arr = state.customBoutique;
		let newFontColor = {};
		for(var i in state.customBoutique['fontColorList']){
			if(fontColorId==state.customBoutique['fontColorList'][i]['fontColorId']){
				newFontColor = state.customBoutique['fontColorList'][i];
			}else{
				newFontColor = state.customBoutique['fontColorList'][0];
			}
		}

		return newFontColor;
	},
	//返回字体颜色
	getOrDeputyImageFontColors: (state ) => (status,fontColorId) => {
		let detypeNewFontColor = {};
		let mainNewFontColor = {};

		let arr = state.customBoutique;
		let newFontColor = {};
		if(status=='mainDrivingName'){
			state.customBoutique.fontColorList.forEach(vo=>{
				if(fontColorId == vo['fontColorId']){
					newFontColor = vo;
				}else{
					newFontColor = state.customBoutique['fontColorList'][0];
				}
			});
		}else{
			state.customBoutique.fontColorList2.forEach(vo=>{
				if(fontColorId == vo['fontColorId']){
					newFontColor = vo;
				}else{
					newFontColor = state.customBoutique['fontColorList2'][0];
				}
			});
		}
		/*for(var i in state.customBoutique['fontColorList']){
			if(status==state.customBoutique['fontColorList'][i]['fontColorId']){
				newFontColor = state.customBoutique['fontColorList'][i];
			}else{
				newFontColor = state.customBoutique['fontColorList'][0];
			}
		}*/

		return newFontColor;
	},
}


// actions 对外提供的方法
const actions = {
	/**
	* 初始化精品列表
	* 1 普通的选配,参数为空
	* 2 $orderNo 从订单列表点击到选配页需要参数订单id
	* 3 $garageId,$token 从车库点击继续选配需要传 车库id和token
	*/
	init({ commit, state }) {
		return new Promise((resolve) => {
			serverApi.get("/Home/CustomBoutique/loadCustomBoutique.html").then(rs=>{
				//TODO 只要对应车型的
				if(rs.error_code ==0){
					let rsdata = rs.data.data;

					rsdata.customBoutique.fontColorList.forEach(res => {
						res['selected'] = false;
					});
					rsdata.customBoutique.fontColorList[0].selected = true;
					//主驾枕头
					rsdata.customBoutique['mainDrivingImagePosX'] = '272';
					rsdata.customBoutique['mainDrivingImagePosY'] = '925';

					//副驾枕头
					rsdata.customBoutique['deputyDrivingImagePosX'] = '272';
					rsdata.customBoutique['deputyDrivingImagePosY'] = '243';
					rsdata.customBoutique['fontColorList2'] = rsdata.customBoutique.fontColorList;
					commit('initState', { cacheState: {
						data_: rsdata.customBoutique,
					}});
				}

				resolve();
			});
		});


	},

	saveHeadRests({commit, state},{mainDriving,deputyDriving}) {
		return new Promise((resolve)=>{
			serverApi.get("/Home/CustomBoutique/saveHeadRests.html",{mainDriving:mainDriving,deputyDriving:deputyDriving}).then(rs=>{
			//TODO 只要对应车型的
			/*if(rs.error_code ==0){
				//let rsdata = rs.data.data;
				console.log('保存头枕信息：',rs.data);


			}*/

			resolve();
		});
		});


	},


}

// mutations 必须同步执行 改变对象属性 必须在这里执行
const mutations = {
	initState (state,cacheState){

		state.customBoutique = cacheState.cacheState.data_

	},


}

export default {
	namespaced: true,
	state: state,
	getters: getters,
	actions,
	mutations
}
