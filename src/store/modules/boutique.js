import serverApi from '@/common/serverApi'
import commonFun from '@/common/commonFun'
import globalConfig from '@/globalConfig'
import InterActiveHandler from '@/common/InterActiveHandler'
import ModeDrive from '@/packages/mode-drive';
/**
*	精品处理
*/
const state = {
	//接口原始数据
	allBoutiqueList:[],//全部精品
	boutiqueList: [],//group 精品列表
	saveBoutiqueIds:[] // 保存的所有精品id,包括失效的
}


// getters 用来获取属性的
const getters = {
	//获取精品分类
	getBoutiqueCat:(state,getters) => {
		let catListAll = getters.getBoutiqueListGroupInfo;
		let catArr=[]
		catListAll.forEach(item=>{
			catArr.push({catCode:item.catCode,catName:item.catName})
		})
		return catArr;
	},
	//根据catCode 获取精品列表
	getBoutiqeListByCatCode:(state,getters) => (catCode) => {
		return state.boutiqueList.filter(item=>{
			return item.catCode == catCode;
		})
	},
	//获取精品,根据分类分组
	getBoutiqueListGroupInfo: (state,getters) => {
		let boutiquearr = [];
		let catCodearr = [];
		state.boutiqueList.forEach(item=>{

			catCodearr = catCodearr.concat(item.catCode)
		})
		catCodearr = $.unique(catCodearr)


		catCodearr.forEach((catCode,key)=>{

			let newarr = {}

			boutiquearr[key]=[];
			boutiquearr[key]=newarr;
			let codearritem = []
				state.boutiqueList.forEach(item=>{
					if(item.catCode==catCode){
						codearritem.push(item);
						newarr['catCode'] = item.catCode;
						newarr['catName'] = item.catName;
					}
				})
				boutiquearr[key]['data']= codearritem
			})

		return boutiquearr;
	},
	//获取当前feature下面的精品列表
	getFeatrueBoutique: (state) => (feaureCode) => {
		return state.boutiqueList.filter(item=>{
			if(item.selectedFeature !=null){
				return item.selectedFeature.indexOf(feaureCode) != -1;
			}
		})
	},
	//获取保存精品的总价格
	getSaveboutiqueTotalprice:(state ,getters)=>{
		let totalPrice = 0;
		getters.getSaveboutique.forEach(item=>{
			totalPrice+=item.price
		})
		return totalPrice;

	},
	//获取选择的精品str
	getSaveBoutiqueStr: (state ,getters) => {
		let saveBoutiqueStr = '';//保存的精品 格式是id:num, 逗号分隔
		getters.getSaveboutique.forEach(item=>{
				if(item.savenum>0){
					saveBoutiqueStr += item.id + ':' + item.savenum+",";
				}
		})
		return saveBoutiqueStr;
	},
	//根据id数组获取精品详情
	getBoutiqueInfoByIds:(state,getters)=>(id)=>{
		return getters.getBoutiqueListByIds(id);
	},
	//根据id数组获取精品列表
	getBoutiqueListByIds:(state)=>(idsArr)=>{
		return state.allBoutiqueList.filter(item=>{
			return idsArr.indexOf(item.id) != -1;
		})
	},
	//获取保存的失效精品
	getSaveInvalidBoutiqueStr:(state,getters)=>{
		let Invalid = [];//失效的id
		return  state.boutiqueList.filter(item=>{
				return item.savenum>0 && item.valid==false;
			})

		/*state.saveBoutiqueIds.forEach(id=>{
			let boutique = state.boutiqueList.filter(item=>{
				return item.id==id && item.valid==false;
			})

			if(!boutique){
				Invalid.push(id);
			}
		})
		return getters.getBoutiqueListByIds(Invalid);*/
	},
	//获取保存的精品,并且没有失效,失效的自动过滤掉
	getSaveboutique:(state)=>{

		let saveBoutiqueIds = state.saveBoutiqueIds;
		return state.boutiqueList.filter(item=>{
			return saveBoutiqueIds.indexOf(item.id)!=-1 ;
		})
	}

}


// actions 对外提供的方法
const actions = {
	/**
	* 初始化精品列表
	* 1 普通的选配,参数为空
	* 2 $orderNo 从订单列表点击到选配页需要参数订单id
	* 3 $garageId,$token 从车库点击继续选配需要传 车库id和token
	*/
	init({ commit, state },params) {
		return new Promise((resolve) => {


			let productCode = globalConfig.productCode;
			let boutiqueState = localStorage.getItem("boutiqueOdState");
			//缓存有了就不请求了
			if(boutiqueState != null ){
				commit('initCacheState',{ cacheState: JSON.parse(boutiqueState)});
				//取完以后就清空缓存
				localStorage.removeItem("boutiqueOdState");
				return resolve();
			}

			//有了数据就不请求了
			if(state.allBoutiqueList.length !=0){
				return resolve();
			}


			serverApi.get("/Home/Boutique/getBoutiqueList.html",params).then(rs=>{
				//TODO 只要对应车型的
				if(rs.error_code ==0){

					let boutique = rs.data.filter(item=>{
						return  item.supportedProductCodes[0].indexOf(productCode) >=0;
					})
					let saveBoutiqueIds = [];
					//初始化保存的数据
					boutique.forEach(item=>{
						if(item.savenum>0){
							saveBoutiqueIds.push(item.id);
						}

					})

					commit('initState', { cacheState: {
						allBoutiqueList: boutique,
						saveBoutiqueIds:saveBoutiqueIds
					}});
					//缓存精品数据
					localStorage.setItem("boutiqueState",JSON.stringify(state))
				}
				resolve();
			});


		});
	},
	/**
	* 过滤精品
	* defaultSelectCode 所有已选项的featurecode
	*/
	filterBoutiqueList({ commit, state },defaultSelectCode){

		let haveBoutiqueFeatureCode = [];// 有精品的Featurecode
		let featureCodeBoutiqueName = [];//featureCode 对应的第一个精品名称
		let boutiqueList = [];// group 下面的精品列表


		state.allBoutiqueList.forEach(item => {
            //第二层过滤 notFeatures,所有选中项都不能在notFeatures当中
              if(item.notFeatures ==null || commonFun.intersect(defaultSelectCode,item.notFeatures).length == 0){

           		 //第三次过滤 andFeatures ,andFeatures当中所有的值都应该在$selectFeatusCods 当中
		            if(item.andFeatures ==null || commonFun.intersect(defaultSelectCode,item.andFeatures).length == item.andFeatures.length){

		                if(item.tigimg==undefined){
		                	item['tigimg'] = item.spu1ImgUrl.split(',');
		                }

                		boutiqueList.push(item);
				         //第四层 feature下面是否有精品,当前选择feature 在selectedFeature当中
				         if(item.selectedFeature !=null){
							let codes = defaultSelectCode.filter(feaureCode => {
								return item.selectedFeature.indexOf(feaureCode) != -1;

							})
							codes.forEach(code=>{
								if(featureCodeBoutiqueName[code]==null){
									featureCodeBoutiqueName[code] = item.name;
								}
							})
							haveBoutiqueFeatureCode = haveBoutiqueFeatureCode.concat(codes)
				         }

		            }
              }
		});



			commit('setBoutiqueList', { cacheState: {
					boutiqueList: boutiqueList
				}});

		return {'haveBoutiqueFeatureCode':haveBoutiqueFeatureCode,'featureCodeBoutiqueName':featureCodeBoutiqueName};

	},
	//删除掉参数
	deleteSaveInvalidBoutique({ commit, state,getters },deleteList){
		commit('deleteBoutiqueList',deleteList)
	},
	/**
	*	保存精品,保存订单之前调用保存精品
	*	preorderSid 预订单id
	*/
	saveBoutique({ commit, state,getters },preorderSid){

		let saveBoutiqueStr = getters.getSaveBoutiqueStr(); //保存的精品 格式是id:num, 逗号分隔
		if(saveBoutiqueStr!=''){
			//调用保存精品接口
			serverApi.get("/Home/Boutique/saveBoutque.html",{preorderSid:preorderSid,boutiqueAndNum:saveBoutiqueStr}).then(rs=>{

				resolve();
			});
		}
	},
	//删除精品
	deleteBoutique({ commit, state },  boutique){

		if(boutique.savenum>0){
			commit('deleteBoutique',boutique)
		}
	},
	//添加精品
	addBoutique({ commit, state },  boutique){
		if(boutique.savenum==boutique.limt){
			return Promise.reject({error_code: '1000',error: '数量已经达到最大值,不能添加'});
		}else{
			let existGroupNo = state.allBoutiqueList.filter(item=>{
				return state.saveBoutiqueIds.indexOf(item.id) != -1 && item.groupNo==boutique.groupNo;
			})
			if(existGroupNo.length>0){
				commit('deleteBoutique',existGroupNo[0]);//删除groupNu重复的
				commit('addBoutique',boutique);//添加精品
				//把group重复的那一项反馈回去
				return Promise.reject({error_code: '1001',error: existGroupNo});
			}else{
				commit('addBoutique',boutique)
			}

		}
	}

}

// mutations 必须同步执行 改变对象属性 必须在这里执行
const mutations = {
	clearData (state){
		state.allBoutiqueList = []
		state.boutiqueList =  []
		state.saveBoutiqueIds =[]
		localStorage.removeItem("boutiqueState")
		localStorage.removeItem("boutiqueOdState")
	},
	//缓存跳转订单的时候缓存数据
	cacheData(state) {
		localStorage.setItem("boutiqueOdState",JSON.stringify(state))
	},
	//缓存当中的数据
	initCacheState(state,{cacheState}){
		state.allBoutiqueList = cacheState.allBoutiqueList
		state.boutiqueList = cacheState.boutiqueList
		state.saveBoutiqueIds = cacheState.saveBoutiqueIds
	},
	initState (state,{cacheState}){
		state.allBoutiqueList = cacheState.allBoutiqueList
		state.saveBoutiqueIds = cacheState.saveBoutiqueIds
	},
	/*//过滤精品
	filterBoutiqueList(state,{cacheState}){
		state.haveBoutiqueFeatureCode = cacheState.haveBoutiqueFeatureCode
		state.boutiqueList = cacheState.boutiqueList

	},*/
	setBoutiqueList(state, {cacheState}) {
		state.boutiqueList = cacheState.boutiqueList;
	},
	//批量删除失效精品
	deleteBoutiqueList(state,  deletBoutiqueList){
		let deleteIds = [];
		deletBoutiqueList.forEach(item=>{
			this.commit('boutique/deleteBoutique', item);
		})
		/*state.boutiqueList.forEach(item=>{
			if(deleteIds.indexOf(item.id)!=-1){
				item.savenum=0;
			}
		})*/
	},
	//精品保存的数量减1
	deleteBoutique(state,  boutique){
        //监测代码
        //pilot("track","event","D60Config","click",boutique.id,"0");
		boutique.savenum -=1;
		let newsaveBoutiqueIds = state.saveBoutiqueIds.filter(id=>{
			return id!=boutique.id;
		})
		state.saveBoutiqueIds = newsaveBoutiqueIds;

		localStorage.setItem("boutiqueState",JSON.stringify(state));

	},
	//精品保存的数量加1
	addBoutique(state,  boutique){
		//监测代码
        //pilot("track","event","D60Config","click",boutique.id,"1");
		boutique.savenum +=1;
		state.saveBoutiqueIds.push(boutique.id);
		localStorage.setItem("boutiqueState",JSON.stringify(state));
	}

}

export default {
	namespaced: true,
	state: state,
	getters: getters,
	actions,
	mutations
}
