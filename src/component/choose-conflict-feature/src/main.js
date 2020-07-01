import Vue from 'vue'
import serverApi from '@/common/serverApi'
import store from '@/store/index';

//识别访问模式 pc? mobile? app
import ModeDrive from '@/packages/mode-drive';
Vue.use(ModeDrive)


let chooseConflictFeatureVue = require('./main.vue').default
let chooseConflictFeatureVueMob= require('./main_mob.vue').default

const ChooseConflictFeature = {
}
let defaultOptions = {
	//在冲突提示之前验证其他冲突
	beforeValid ({display_bindFeatureCodes,conflictFeatureCodes,feature}) {
		return Promise.resolve(true)
	},
	afterValid ({display_bindFeatureCodes,conflictFeatureCodes,feature}){
	}
}
let instance ;
/**
 * 优先从请求的参数里获取想要的访问模式 通过参数 _mode_drive_控制显示的模式
 */
ChooseConflictFeature.install = function (Vue,options = {}) {

	defaultOptions = Object.assign({}, defaultOptions, options); // 验证规则

	// 创建一个VUE构造器
	let ccfConstructor
	if(!ModeDrive.isWap()){
		ccfConstructor = Vue.extend(chooseConflictFeatureVue)
	}else {
		ccfConstructor = Vue.extend(chooseConflictFeatureVueMob)
	}
	// 实例化VUE实例
	instance = new ccfConstructor({})

	// 此处使用$mount来手动开启编译。用$el来访问元素，并插入到body中
	instance.vm = instance.$mount()

	document.body.appendChild(instance.vm.$el)
}




/**
* feature 当前点击的
* conflictFeatureCode
* preorderSid
*/
ChooseConflictFeature.valid = function(options = {}) {

	if(options.feature.selected === true){
		return Promise.resolve(false)
	}

	options = Object.assign({
		cancel: ()=>{}, //用户点击取消
		//confirm: ()=>{},//用户点击确定
		},  options); // 验证规则

	let feature = options.feature;

		//移除应用监听事件
	instance.$off("applyConflictResolution")
	instance.$off("cancelApply")

	//let selectedFeatures = JSON.parse(JSON.stringify(store.state.vehicle.selectedFeatures))
	let preorderSid = store.state.vehicle.configuration.preorderSid
	let selectedFeatures = store.state.vehicle.selectedFeatures
	//要把同级给移除
	let features = selectedFeatures.filter(vo => {
		return vo.familyCode != feature.familyCode;
	})
	let selectedFeatureCodes =  features.map(vo => {
		return vo.code;
	})


		let parames = { preorderSid: preorderSid}
		let url = "";
		//如果点击置灰项 需要把置灰项 传过去
		if(feature.selectable === false){
			parames['conflictFeatureCode'] = feature.code
			url = "/Home/Index/chooseConflictFeature.html"
		}else{
			selectedFeatureCodes.push(feature.code)
			url = "/Home/Index/chooseFeature.html"
		}
			parames['selectedFeatureCodes'] = selectedFeatureCodes.join(",")
		return new Promise((resolve) => {
			serverApi.get(url,parames).then(rs=>{
					let data = rs.data;
				/*console.log('chooseFeature接口：',rs.data);
				console.log('this.isShowHotTips',this.isShowHotTips);
                //命中爆款
                if(rs.data.promotionPrice<0 && this.isShowHotTips==0){
                	console.log('choose名中爆款1');
                    setTimeout(function(){
                        this.openHotTips = true;
                    },1000);
                    this.isShowHotTips =1;
                   setTimeout(function(){
                        _self.openHotTips = false;
                    },5000);
                }
                //非爆款
                if(rs.data.promotionPrice==0){
                	console.log('choose变为非爆款');
                    this.isShowHotTips = 0;
                    //_self.firstShowNoHotTip = true;
                    setTimeout(function(){
                        this.openNoHotTips = true;
                    },1000);

                    setTimeout(function(){
                        this.openNoHotTips = false;
                    },5000);
                }
*/
					let bindFeatureCodes = [];
					for(let familyCode in data.bind){
						if(data.bind[familyCode][0]!=undefined){
							bindFeatureCodes.push(data.bind[familyCode][0]);
						}
					}

					let conflictFeatureCodes = [];
					for(let familyCode in data.conflict){
						if(data.conflict[familyCode][0]!=undefined){
							conflictFeatureCodes.push(data.conflict[familyCode][0]);
						}
					}

					let display_bindFeatureCodes = [];
					for(let familyCode in data.display_bind){
						if(data.display_bind[familyCode][0]){
							display_bindFeatureCodes.push(data.display_bind[familyCode][0]);
						}
					}



					if(feature.selectable === false || data.isOriginOption === false){ //有冲突项


						let getFeaturesByFeatureCodes = store.getters["vehicle/getFeaturesByFeatureCodes"];
						let bindFeatures = getFeaturesByFeatureCodes(display_bindFeatureCodes)
						let conflictFeatures = getFeaturesByFeatureCodes(conflictFeatureCodes)

						instance.showRemoveFeatures = conflictFeatures //以下配置将会被移除
						if(bindFeatures.length == 0){ //如果接口没有给反显示的绑定项 自己从移除项里找 bind里的项拿出来
							let _bindConflictFeatureCodes = [];
							for(let familyCode in data.conflict){
								for(let bindFamilyCode in data.bind){
									if(bindFamilyCode == familyCode){
										_bindConflictFeatureCodes.push(data.bind[bindFamilyCode][0]);
									}
								}
							}
							if(_bindConflictFeatureCodes.length > 0){
								instance.showAddFeatures = getFeaturesByFeatureCodes(_bindConflictFeatureCodes);
							}
						}else{
							instance.showAddFeatures = bindFeatures //关联增加配置为
						}
						instance.priceGap = data.priceGap //变更价格
						instance.price = data.price //总价格
						instance.selectedFeature = feature //当前选中的

						defaultOptions.beforeValid({
							bindFeatureCodes: bindFeatureCodes,
							display_bindFeatureCodes: display_bindFeatureCodes,
							conflictFeatureCodes:conflictFeatureCodes,
							feature: feature
						}).then(valid=>{
							if(valid === true){
								instance.visible = true //显示
							}
						});


						  //用户取消应用
						  instance.$on("cancelApply", () => {
							  options.cancel();
						  })

						  instance.$on("applyConflictResolution", () => {
								store.commit('vehicle/changeUserSelectFeature',{bindCode: data.bind})
								let selectedFeatureCodes = store.state.vehicle.selectedFeatures.map(vo => {
									return vo.code;
								});

								let preBindFeatureCodes = [];
								for(let familyCode in data.bind){
									//同级的不存进去
									if(familyCode != feature.familyCode){
										preBindFeatureCodes.push(data.bind[familyCode][0]);
									}
								}
								//把当前选中的也放进去
								preBindFeatureCodes.push(feature.code)
								serverApi.get("/Home/Index/applyConflictResolution.html",{selectedFeatureCodes: selectedFeatureCodes.join(","),preBindFeatureCodes: preBindFeatureCodes.join(","),preorderSid: preorderSid}).then(applyConflictResolutionRs=>{

									this.chooseFeature({bind: data.bind,conflict: applyConflictResolutionRs.data.conflict});


									store.commit('vehicle/setPrice',{
									price: applyConflictResolutionRs.data.price,
									promotionPrice:applyConflictResolutionRs.data.promotionPrice,
									finalPrice:applyConflictResolutionRs.data.finalPrice,
									buyPromotionPrice:applyConflictResolutionRs.data.buyPromotionPrice})//改变价格
									instance.visible = false //隐藏
									// options.confirm();//确定事件回调
									resolve({isChange: true,bindFeatureCodes: bindFeatureCodes});
									defaultOptions.afterValid({
										bindFeatureCodes: bindFeatureCodes,
										display_bindFeatureCodes: display_bindFeatureCodes,
										conflictFeatureCodes:conflictFeatureCodes,
										feature: feature
									})
								})
						  });

					}else{
						let applyConflictFun = ()=> {
							this.chooseFeature({bind: data.bind,conflict: data.conflict,price: data.price})

							store.commit('vehicle/setPrice',{price: data.price,promotionPrice:data.promotionPrice,finalPrice:data.finalPrice,buyPromotionPrice:data.buyPromotionPrice})//改变价格
							resolve({isChange: true,bindFeatureCodes: bindFeatureCodes});

							defaultOptions.afterValid({
								bindFeatureCodes: bindFeatureCodes,
								display_bindFeatureCodes: display_bindFeatureCodes,
								conflictFeatureCodes:conflictFeatureCodes,
								feature: feature
							})
						}
						defaultOptions.beforeValid({
							bindFeatureCodes: bindFeatureCodes,
							display_bindFeatureCodes: display_bindFeatureCodes,
							conflictFeatureCodes:conflictFeatureCodes,
							feature: feature
						}).then(valid=>{
							if(valid === true){
								applyConflictFun()
							}
						});
					}

			})
		});


}

ChooseConflictFeature.getBindCodes = function({bind}) {
	let featureCode = [];
	//第一步  给这些features 设置为选中
	for(let familyCode in bind){
		featureCode.push(bind[familyCode][0])
	}
	return featureCode;
}


/**
 * 没有冲突的时候设置 Feature
 * @param {*} bind  给这些features 设置为选中 {M77: ["M77G"]}  {family代码: ["Feature代码"]}
 * @param {*} conflict 先把全部features设置为不置灰 然后把些features 设置为置灰   {M77: ["M77G"]}  {family代码: ["Feature代码"]}
 */
ChooseConflictFeature.chooseFeature = function({bind,conflict}) {
	//第一步  给这些features 设置为选中
	for(let familyCode in bind){
		let featureCode = bind[familyCode][0];
		store.commit('vehicle/setFeatureSelectFamilyByCode',{familyCode,featureCode})

	}

	//第二步  先把全部features设置为不置灰 然后把些features 设置为置灰
	this.setFeatureConflictByFeatureCodes(conflict);
}


ChooseConflictFeature.setFeatureConflictByFeatureCodes = function(conflict) {

	let featureCodes = [];
	for(let familyCode in conflict){
		featureCodes = featureCodes.concat(conflict[familyCode]);
	}
	store.commit('vehicle/setFeatureConflictByFeatureCodes',{featureCodes})
}


export default ChooseConflictFeature
