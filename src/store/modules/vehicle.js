import serverApi from '@/common/serverApi'
import userApi from '@/common/api/userApi'
import commonFun from '@/common/commonFun'
const myGroupCode = [
	{name: '基础', code: 'jc'},
	{name: '基本选项', code: 'jc'},

	{name: '外观', code: 'wg'},
	{name: 'Exterior', code: 'wg'},
	{name: '外饰', code: 'wg'},

	{name: '内饰', code: 'ns'},
	{name: '排放', code: 'pf'},
	{name: '装备', code: 'zb'},
	{name: '科技娱乐', code: 'kjyl'},
	{name: '安全操控', code: 'aqck'},
	{name: '舒适便捷', code: 'ssbj'},



	{name: '舒适娱乐', code: 'ssyl'},
	{name: '智能科技', code: 'znkj'},
	{name: '安全', code: 'aq'},
	{name: '基本信息', code: 'jbxx'}
]


        //对象转数组
const objToArray = function (obj){
	var arr = [];
	for(var i in obj){
		if(typeof(obj[i])=="string"){
			arr.push(obj[i]);
		}
	}
	return arr;
}

//缓存数据
const saveStateData = function (state){
	localStorage.setItem("vehicleState",JSON.stringify(state))
}


const state = {
	defaultFeatureCods: [],
	configuration: {},
	price: 0,
	type: 1,
	mode: 1,
	//所有group
	groups: [],
	familys: [],
	features: [],
	//用户主动选中的 [{groupNameZh: '', familyList: [{featureList: {}}]}]
	selectedFeatures: [],
	promotionPrice:0,//优惠价
}


// getters 用来获取属性的
const getters = {

	//获取主动选择的featurecode
	getSelectedFeaturesCode:(state)=>{
		return state.selectedFeatures.map(vo => {
		  	return vo.code;
		  })
	},
	/**
	 * 获取
	 */
	getGroups: (state ) => {
		return state.groups;
	},
	/**
	 * 根据代码获取Group
	 */
	getGroupByCode: (state ) => (code) => {
		return state.groups.find(vo => {
			return vo.code == code
		});
	},
	getSelectGroup: (state) => {
		return state.groups.find(vo => {
			return vo.selected === true;
		});
	},
	getShowFamilysByGroup: (state, getters) => (group) => {
		return getters.getShowFamilysByGroupCode(group.code)
	},
	getShowFamilysByGroupCode: (state) => (groupCode) => {
		let rs =  state.familys.filter(family => {
			return family.groupCode == groupCode && family.display === true;
		})
		return rs;
	},
	/**
	 * 根据 familyCode 获取 family
	 */
	getFamilyByFamilyCode: (state) => (familyCode) => {
		return state.familys.find(family => {
			return family.code == familyCode;
		})
	},
	/**
	 * 根据
	 */
	getAllSelectedFeaturesCode: (state, getters)  => {
		 return getters.getAllSelectedFeatures.map(vo => {
		  	return vo.code;
		  })
	},
	getShowFeaturesByFamily: () => (family) => {
		if(family != null && typeof(family) != 'undefined'){
			return family.featureList.filter(feature => {
				return feature.display === true;
			})
		}
	},
	/**
	 * 根据
	 */
	getAllSelectedFeatures: (state)  => {
		let features = [];
		 state.familys.forEach(family => {
			let featureList = family.featureList.find(feature => {
				return feature.selected === true;
			})
			features = features.concat(featureList)
		})
		 return features;
	},
	/**
	 * 根据featureCode获取Feature
	 */
	getFeatureByFeatureCode: (state) => (featureCode) => {
		let retrunFeatures = null;
		state.familys.some(family => {
			let findFeatures =  family.featureList.find(feature => {
				return feature.code == featureCode;
			})
			if(findFeatures != null){
				retrunFeatures = findFeatures;
				 return true;
			}
		})
		return retrunFeatures;
	},
	/**
	 * 根据featureCodes数组获取Features
	 */
	getFeaturesByFeatureCodes: (state) => (featureCodes) => {
		let features = [];
		state.familys.forEach(family => {

			let findFeatures =  family.featureList.filter(feature => {
				return featureCodes.indexOf(feature.code) != -1;
			})
			features = features.concat(findFeatures)
		})
		return features;
	}
}


// actions 对外提供的方法
const actions = {
	init({ commit, state },params) {
		if(typeof(params.type) == 'undefined'){
			params['type'] = 1;
		}
		if(typeof(params.mode) == 'undefined'){
			params['mode'] = 0;
		}

		return new Promise((resolve) => {
			let cacheState = localStorage.getItem("vehicleState");
			//缓存有了就不请求了
			if(cacheState != null ){
				commit('initState',{ cacheState: JSON.parse(cacheState)});
				return resolve();
			}
			//有了数据就不请求了
			if(state.groups.length !=0){
				return resolve();
			}

			serverApi.get("/Home/Index/loadConfigurationOptionWithFeatures.html",params).then(rs=>{
					let data = rs.data;
					let defaultFeatureCods = objToArray(data.defaultFeatureCods)
					//开始组装group, 只组装精品和外观
					data.group.forEach(group => {
						let codeData = myGroupCode.find(vo => {
							return vo.name === group.pageNameZh;
						})
						if(!codeData){
							alert('出现了不存在的group名称' + group.pageNameZh)
						}
						if(typeof(group.childGroup) !='undefined'){
								group.childGroup.forEach(childGroup => {
									let codeData = myGroupCode.find(vo => {
										return vo.name === childGroup.groupNameZh;
									})
									if(!codeData){
										alert('出现了不存在的group名称' + childGroup.groupNameZh)
									}
									childGroup['code'] = codeData.code;
								});
						}
						group['code'] = codeData.code;
						group['selected'] = false;
					});
					let groups = data.group;
					groups[0].selected = true;

					//结束组装group

					//开始组装family
					let familys =[]

					data.groupList.forEach(group => {
						let _familyArray = group.familyList;
						if(!Array.isArray(group.familyList)){
							_familyArray = objToArray(group.familyList);
						}

						/*let _findGroup = groups.find(vo => {return vo.groupid == group.groupid})
						if(_findGroup != null){
							_findGroup['groupNameZh'] = group['groupNameZh'];
						}*/
						//console.info("data.groups",groups)

						_familyArray.forEach(family=>{
							let _findGroup = myGroupCode.find(vo=>{return group.groupNameZh == vo.name});
							if(_findGroup == null){
								alert('出现了不存在的group名称' + group.groupNameZh)
							}
							family.featureList.forEach(feature=>{
								feature['groupCode'] = _findGroup.code
								feature['familyCode'] = family.code
								feature['haveBoutique'] = false
								feature['boutiqueName'] = '';
							})
							family['groupCode'] = _findGroup.code
							familys.push(family)
						})
					});
					// console.info("data._familyArray",familys)
					// console.info("data.group",groups)
					//console.info("data",data)
					commit('initState', { cacheState: {
						groups: groups,
						defaultFeatureCods: defaultFeatureCods,
						familys: familys,
						configuration: data.configuration,
						price: data.price,
						promotionPrice:data.configuration.promotionPrice,
						type: params.type,
						mode: params.mode
					}});


					let selectedFeatures = [];
					if(data.selectedCodes){
						let getFeatureByFeatureCode = this.getters['vehicle/getFeatureByFeatureCode'];
						data.selectedCodes.forEach(c => {
                            let _findFe = getFeatureByFeatureCode(c);
                            if(_findFe != null){
                                selectedFeatures.push(_findFe)
							}
						})
						commit('setSelectedFeatures',{selectedFeatures: selectedFeatures});
					}
					//组装用户主动选中项
					//缓存用户的数据
					saveStateData(state)






					resolve();//回调
				});



		});
	},
	/**
	 * 设置用户选中
	 * @param {*} param0
	 * @param {*} family 如果不传 就去 state 里的family去查找
	 */
	setUserSelectFeature ({ commit, state, getters },  {feature,family}) {
		commit('userSelectFeature', { feature ,family});
	},
	changeUserSelectFeature({ commit, state, getters },  {feature,family}) {

	}
}

// mutations 必须同步执行 改变对象属性 必须在这里执行
const mutations = {
	clearData (state){
		state.groups = []
		state.familys =  []
		state.configuration = {}
		state.price = 0
		state.promotionPrice = 0
		state.defaultFeatureCods = {}
		state.selectedFeatures = []
		state.type = 1
		state.mode = 1
		localStorage.removeItem("vehicleState")
		console.info("清空===>")
	},
	initState (state,{cacheState}){
		state.groups = cacheState.groups
		state.familys = cacheState.familys
		state.configuration = cacheState.configuration
		state.price = cacheState.price
		state.promotionPrice = cacheState.promotionPrice
		state.defaultFeatureCods = cacheState.defaultFeatureCods
		if(cacheState.selectedFeatures){
			state.selectedFeatures = cacheState.selectedFeatures
		}

		state.type = cacheState.type
		state.mode = cacheState.mode

	},
	setPrice(state, { price,promotionPrice }) {
		state.price = price //
		state.promotionPrice = promotionPrice;	//优惠价格

	},
	setSelectGroup(state, { group }) {
		state.groups.forEach(vo => {
			vo.selected = false;
		})
		group.selected = true
	},

	/**
	 * 根据familyCode 设置Feature选中 会把同级的其他Feature设置为不选中
	 * @param {} familyCode
	 * @param {*} featureCode 要设置选中的
	 */
	setFeatureSelectFamilyByCode (state, {familyCode, featureCode}){
		let family = state.familys.find(vo => {
			return vo.code == familyCode;
		})
		if(family != null){
			family.featureList.forEach(feature => {
				//把其他项改为不选中
				feature.selected = false;
				if(feature.code == featureCode){
					feature.selected = true;
				}
			})
		}
	},
	/**
	 * 把所有feature设置为不置灰,把传进来的 FeatureCodes 设置为置灰
	 */
	setFeatureConflictByFeatureCodes (state, {featureCodes}) {
		state.familys.forEach(family => {
			family.featureList.forEach(feature => {
				feature.selectable = true;
				if(featureCodes.indexOf(feature.code) != -1) {
					feature.selectable = false;
				}
			})
		})
	},
	userSelectFeature(state, { feature,family }) {
		if(family){
			family.featureList.forEach(vo => {
				//把其他项改为不选中
				vo.selected = false;
				//移除同级
				let _index = state.selectedFeatures.findIndex(fvo => {return vo.code == fvo.code})
				if(_index != -1){
					state.selectedFeatures.splice(_index,1)
				}
			})
		}
		//组织用户主动选中项
		state.selectedFeatures.push(feature)
		feature.selected = true
		//缓存用户的数据
		localStorage.setItem("vehicleState",JSON.stringify(state))
	},
	/**
	 * 改变用户的主动选中项
	 * @param {*} state
	 * @param {*} bindCode  {M77: ["M77G"]}  {family代码: ["Feature代码"]}
	 */
	changeUserSelectFeature(state,  {bindCode}) {
		for(let familyCode in bindCode){
			let featureCode = bindCode[familyCode][0];
			let _findFeature = state.selectedFeatures.find(vo => {
				return vo.familyCode == familyCode
			});
			if(_findFeature != null){
				//发现是同级兄弟
				if(_findFeature.code != featureCode){
					let getFeatureByFeatureCode = this.getters['vehicle/getFeatureByFeatureCode'];
					let feature = getFeatureByFeatureCode(featureCode);
					state.selectedFeatures.splice(state.selectedFeatures.findIndex(fvo => {return _findFeature.code == fvo.code}),1,feature);

				}
			}
		}
	},
	//feature是否有精品
	setFeatureBoutique(state,  {featureCodes,featureCodeBoutiqueName}){
		//let familys = state.familys;
		state.familys.forEach(familyItem=>{
			familyItem.featureList.forEach(featureItem=>{
				featureItem['haveBoutique'] = false;
				featureItem['boutiqueName'] = '';
				if(featureCodes.indexOf(featureItem.code) != -1){
					featureItem['haveBoutique'] = true;

					featureItem['boutiqueName'] = featureCodeBoutiqueName[featureItem.code];
				}
			})
		})
	}
}

export default {
	namespaced: true,
	state: state,
	getters: getters,
	actions,
	mutations
}
