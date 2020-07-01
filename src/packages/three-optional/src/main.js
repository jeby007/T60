import Vue from 'vue'
import modeDrive from '@/packages/mode-drive';
let threeOptionalVue = require('./main.vue').default



let defaultOptions = {
	haveBgImg: true, //是否有背景 (如果true 等于设置了 web_app = 'app' 才有开车灯、呼吸灯功能)
	//车型代码
	code: 'T60',
	//加载的素材 例如 wap pc win2000 win4000
	path: 'wap',
	//要显示的外观呼吸灯代码  ['M_00A' ,'M_006']
	appearanceHotspotCodes: [],
	//要显示的内饰呼吸灯代码  ['M_00C' ,'M77']
	panoHotspotCodes: [],
	//组合项代码
	familyMerge: [],
	//family特写镜头角度值 {familyCode: 'M_00C',camera:{x:y:z},controls:{x:y:z}}
	closeUpData:[],
}

let instance ;

const ThreeOptional = {
        appearanceIsLoad: false, //标识外观已经加载了
        panoIsLoad: false,//标识内饰已经加载了
		appearanceHotspotIsInit: false, //外观呼吸灯已经初始化
		appearanceIsShow: false, //外观显示了
		panoIsShow: false,//内饰显示了
        panoHotspotIsInit: false,//内饰呼吸灯已经初始化
				hotspotStartCode: 'YP',
				elVm: '',
				openLightTimeOut: null,
				appearanceScene: 1,//外观场景值
				panoSwitch: 1,//内饰角度


		  /**
		  *显示外观
			*	options => featureList 要显示的 feature
								=> defaultFeatureCods 默认的(用户看不到的配置) 只在初始化用到
								=> haveTween true 有动画

		  *				el => 要显示的元素 如 #flashDiv
		  *				on
		  *					startLoad3DJs  开始加载js
		  *					extLoading    加载进度
		  *					extLoadingEnd 加载完毕
		  */
		showAppearance (options = {}) {
			instance.appearanceIsShow = true;
			this.appearanceIsShow = true;
			  this.elVm = $("#threeOptionalDiv");
			  if(options.el){
				  $(options.el).append(this.elVm)
			  }
			  return this._startAppearance(options).then(()=>{
					return new Promise((resolve, reject) => {

						if(options.featureList){
							//setFeatureList(this._buildFamilyMerge(options.featureList));
						}
						/*if(options.haveTween === true){
							controls.target = new THREE.Vector3( 705, 0, 0 );
							tween  =  new TWEEN.Tween(controls.target).to({ x: 0,y: 0,z: 0 }, 1500).start().onStart(()=>{
							}).onComplete(()=>{
								resolve();
							});
							wheel_rotation(1500,-10);

						}else{
							resolve();
						}*/
						resolve();
					});

			  });
		},
		/**
		* 隐藏
		*/
		hideAppearance () {
			if(this.appearanceIsShow === true){
				$("#threeOptionalDivTop").append(this.elVm)
				  this.elVm = null
				  instance.appearanceIsShow = false;
				  this.appearanceIsShow = false;
			  if(typeof(deleteExt) != "undefined"){
				  deleteExt();
			  }
			}
		},
		//设置外观Feature featureCode ，angle: false 没有动画, familyCode
		setAppearanceFeature (options = {}) {
			console.info("应用3d", options.featureCode)
			let familyMergeCodes = this._getFamilyMergeByCode(options.featureCode);
			let codes = [];
			if(familyMergeCodes ==null){
				codes.push(options.featureCode)
			}else{
				codes = familyMergeCodes;
			}
			//console.info("应用3d2", codes)
			setFeatureList(codes);
			if(typeof(options.angle) == 'undefined' || options.angle == true){
				if(familyMergeCodes == null){ //不是组合项
					if(options.familyCode){
						setFeatureAngle(options.familyCode);
					}else{
						setFeatureAngle(options.featureCode);
					}
				}else{
					if(codes.length >0){
						setFeatureAngle(codes[0])
					}
				}
				//

			}
		},
		/**
		 * 批量设置内饰代码
		 */
		setFeatureList(featureList) {
			setFeatureList(this._buildFamilyMerge(featureList))
		},
		/**
		 * 显示外观呼吸灯 (必须先调用显示外观)
		 * options => clearoveSitClick 是否清楚点击过的样式效果 （呼吸灯点完之后会变灰色）
		 *            hotspotCodes 呼吸灯代码
		 *            switchCode 需要切换到指定的呼吸灯视角 传入呼吸灯代码
		 *			  on 事件
		 *					clickHotspot (hotspotName: 点击的呼吸灯代码) //标识外观呼吸灯点击了
		 *
		 */
		showAppearanceHotspot (options = {}) {
			  let _self = this;
			  clickAppearanceHotspot = function(hotspotName){
				  hotspotName = hotspotName.replace(new RegExp(_self.hotspotStartCode),"")
				  options.on.clickHotspot(hotspotName)//标识外观呼吸灯点击了
			  }
			  return new Promise((resolve, reject)=>{
				  if(this.appearanceIsLoad === true && instance.appearanceIsShow === true){
					  if(this.appearanceHotspotIsInit === false || options.clearoveSitClick === true){ //清空点击过的效果
						this.appearanceHotspotIsInit = true
						let codes = [];
						let appearanceHotspotCodes = [];
						if(options.hotspotCodes){ //优先以传进来的为主
							appearanceHotspotCodes = options.hotspotCodes;
						}else{
							appearanceHotspotCodes = defaultOptions.appearanceHotspotCodes;
						}
						appearanceHotspotCodes.forEach(element => {
							codes.push(this.hotspotStartCode + element);
						});
						oveSitClickGroupFamily(codes)
					  }
					  //切换视角
					  if(options.switchCode){
						this.switchAppearanceHotspot(options.switchCode)
					  }
				  }else{
					console.error("请先调用 showAppearance 方法 正确使用方式是 showAppearance().then(()=>{showAppearanceHotspot()})")
					  reject();
				  }
			  });

		},
		//跳转到指定的外观呼吸灯视角
		switchAppearanceHotspot (familyCode) {
			//console.info("旋转" + this.hotspotStartCode + familyCode)
			//setExtHotspotSelect(this.hotspotStartCode + familyCode)
			if(typeof(setExtHotspotFeatureAngle) == 'function'){
				setExtHotspotFeatureAngle(this.hotspotStartCode + familyCode);
			}

		},
		//关闭外观呼吸灯
		closeAppearanceHotspot () {
			if(typeof(oveSitClickGroupFamily) =='function'){
				oveSitClickGroupFamily([])
			}
		},


		  /**
		  *显示内饰
		  *	options => featureList 要显示的 feature
								=> defaultFeatureCods 默认的(用户看不到的配置) 只在初始化用到
		  * on
		  *		extLoading    加载进度
		  *		extLoadingEnd 加载完毕
		  */
		showPano (options = {}) {
			instance.panoIsShow = true;
			this.panoIsShow = true;
			if(typeof(deleteExt) != "undefined"){
				deleteExt();
			}
			return this._startPano(options).then(()=>{


					if(options.defaultFeatureCods){
						console.info("defaultFeatureCods",JSON.stringify(options.defaultFeatureCods))
						setIntFeatureList(options.defaultFeatureCods)
					}
					console.info(options.featureList)
					if(options.featureList){
						//setIntFeatureList(this._buildFamilyMerge(options.featureList))
					}
					//console.info(this._buildFamilyMerge(options.featureList))
					this.elVm = $("#threeOptionalDiv")
					if(options.el){
						//this.animate(options.el)
						$(options.el).append(this.elVm)
					}
			  });

		},
		/**
		 * 批量设置内饰代码
		 */
		setIntFeatureList(featureList) {
			let codes = this._buildFamilyMerge(featureList);
			console.info("接口绑定codes",codes)
			setIntFeatureList(codes)
		},
		/**
		 * 设置内饰
		 * @param {} options
		 */
		setPanoFeature (options = {}) {
			let familyMergeCodes = this._getFamilyMergeByCode(options.featureCode);
			let codes = [];
			if(familyMergeCodes ==null){
				codes.push(options.featureCode)
			}else{
				codes = familyMergeCodes;
			}
			console.info("codes",codes)
			setIntFeatureList(codes);

			if(familyMergeCodes == null){ //不是组合项
				if(options.familyCode){
					setIntFeatureAngle(options.familyCode);
				}else{
					setIntFeatureAngle(options.featureCode);
				}
			}else{
				if(codes.length >0){
					setIntFeatureAngle(codes[0])
				}

			}

		},
		/**
		* 隐藏
		*/
		hidePano () {
			if(this.panoIsShow === true){
				$("#threeOptionalDivTop").append(this.elVm)
				this.elVm = null
				instance.panoIsShow = false;
				this.panoIsShow = false;
			}
		},
		/**
		 * 显示内饰呼吸灯 (必须先调用显示内饰)
		 * options => clearoveSitClick 是否清楚点击过的样式效果 （呼吸灯点完之后会变灰色）
		 *            switchCode 需要切换到指定的呼吸灯视角 传入呼吸灯代码
		 *			  on 事件
		 *					clickHotspot (hotspotName: 点击的呼吸灯代码) //标识外观呼吸灯点击了
		 */
		showPanoHotspot (options = {}) {
			var _self = this;
			  clickPanoHotspot = function(hotspotName){
				  hotspotName = hotspotName.replace(new RegExp(_self.hotspotStartCode),"")
					  options.on.clickHotspot(hotspotName);//标识呼吸灯点击了
			  }
			  return new Promise((resolve, reject)=>{
				  if(this.panoIsLoad === true && instance.panoIsShow === true){
					if(this.panoHotspotIsInit === false || options.clearoveSitClick === true){ //清空点击过的效果
						this.panoHotspotIsInit = true
						let codes = [];
						defaultOptions.panoHotspotCodes.forEach(element => {
							codes.push(this.hotspotStartCode + element);
						});
						oveSitClickGroupFamilyInt(codes)
					}
					  //切换视角
					  if(options.switchCode){
						this.switchPanoHotspot(options.switchCode)
					  }
				  }else{
					console.error("请先调用 showPano 方法 正确使用方式是 showPano().then(()=>{showPanoHotspot()})")
					  reject();
				  }
			  });
		},
		/**
		* extLoading //回调告诉外观渲染进度
		* extLoadingEnd //回调告诉外观已经渲染完毕
		*/
		_startAppearance (options = {}) {
			var _self = this;
				return new Promise((resolve, reject)=>{
				  if(this.appearanceIsLoad === false){
					  this.load (options).then(()=>{

								if(defaultOptions.haveBgImg === true){
									web_app = "app"
								}else{
									web_app = "web"
								}
						   _self.appearanceIsLoad = true;
							initCarStartFun();
							if(options.addExt){
								addExt(options.addExt);
							}else{
								addExt({x: 158.223936006802, y: 94.10839793322155, z: -1070.3609665494243});
							}

						  if(options.haveTween === true){
							  controls.target = new THREE.Vector3( 705, 0, 0 );
							  scene.scale.x = 0.001;
							  scene.scale.y = 0.001;
							  scene.scale.z = 0.001;
							  scene2.scale.x = 0.001;
							  scene2.scale.y = 0.001;
							  scene2.scale.z = 0.001;
						  }
						  //渲染完成
						  carStartFunc = function () {

								//初始化数据
								setFeatureList(options.defaultFeatureCods)
								if(options.featureList){
									setFeatureList(_self._buildFamilyMerge(options.featureList));
								}
								onWindowResize2(); //TODO 根据页面来选择
								//if(options.haveTween === true){
									//tween  =  new TWEEN.Tween(controls.target).to({ x: 0,y: 0,z: 0 }, 1500).start().onComplete(()=>{
										//resolve();
									//});
								//}else{
									if(options.haveTween === true){
										_self.appearanceIntoTween(options).then(()=>{
											resolve();
										})

									}else{
										if(options.target){
											controls.target.x = options.target.x
											controls.target.y = options.target.y
											controls.target.z = options.target.z
										}
										resolve();
									}
								//}
						  }
						  carExtLoading = function (value) {
							//回调告诉外观渲染进度
							if(typeof(options.on) != 'undefined' && typeof(options.on.extLoading) == 'function'){
								options.on.extLoading(value)
							}
						  }
						  carExtLoadingEnd = function(){
							//回调告诉外观已经渲染完毕
							if(typeof(options.on) != 'undefined' && typeof(options.on.extLoadingEnd) == 'function'){
								options.on.extLoadingEnd()
							}

						  }
					  })
				  }else{
						if(options.addExt){
							addExt(options.addExt);
						}else{
							addExt();
						}
						this.onWindowResize(); //TODO 根据页面来选择
						if(options.haveTween === true){
							controls.target = new THREE.Vector3( 705, 0, 0 );
							scene.scale.x = 0.001;
							scene.scale.y = 0.001;
							scene.scale.z = 0.001;
							scene2.scale.x = 0.001;
							scene2.scale.y = 0.001;
							scene2.scale.z = 0.001;
						}
						if(options.defaultFeatureCods){
							setFeatureList(options.defaultFeatureCods)
						}
						if(options.featureList){
							setFeatureList(_self._buildFamilyMerge(options.featureList));
						}
						if(options.haveTween === true){
							this.appearanceIntoTween().then(()=>{
								resolve();
							})

						}else{
							resolve();
						}
				  }

				});
		},
		/**
		 * 外观进入动画
		 */
		appearanceIntoTween (options = {}) {
			if(!options.target){
				options.target = { x: -23,y: 0,z: 0 }
			}
			//把车摆正
			this.setCarExtPosition({x: 126.64461679301962, y: 63.16298138710392, z: -804.1888981005355})
			console.info("options.target",options.target)
			return new Promise((resolve)=>{
				setTimeout(()=>{
						scene.scale.x = 1;
						scene.scale.y = 1;
						scene.scale.z = 1;
						scene2.scale.x = 1;
						scene2.scale.y = 1;
						scene2.scale.z = 1;
						tween  =  new TWEEN.Tween(controls.target).to(options.target, 1500).start().onStart(()=>{
						}).onComplete(()=>{
							resolve();
						});

						if(typeof(wheel_rotation) == 'function'){
							wheel_rotation(1500,-12.6); //轮胎转动
						}

				}, 400);
			});
		},
		//切换到指定的外观呼吸灯视角
		switchPanoHotspot (familyCode) {
			//setIntHotspotSelect(this.hotspotStartCode + familyCode)
			if(typeof(setIntHotspotFeatureAngle) == 'function'){
				setIntHotspotFeatureAngle(this.hotspotStartCode + familyCode);
			}
		},
		/**
		 * 打开车灯
		 * options => type => xenon: 疝气 halogen 卤素 大灯
		 *            autoClose => true 自动关闭
		 *            closeTime => 3000 单位毫秒 自动关闭时间
		 */
		openLight (options = {}) {
		  options = Object.assign({}, {autoClose: true,closeTime: 3000}, options); // 配置参数

		  if(options.type == 'xenon'){
			switchLight(true,0);
		  }else{
			switchLight(true,1);
		  }
			if(options.autoClose === true){ //自动关闭
				if(this.openLightTimeOut != null){
					clearTimeout(this.openLightTimeOut)
				}

			this.openLightTimeOut = setTimeout(function(){
				switchLight(false);
			}, options.closeTime);
		  }
		},

		/***
		 * 放大角度特写 camera,position 通过 print3D()获取
		 */
		openCloseUp(options = {}){
			let data = defaultOptions.closeUpData.find(vo => {
				return vo.familyCode == options.familyCode;
			})
			console.info("openCloseUp",data)
			if(data != null){
				this.setMinDistance(200);
				this.setDisabled();
				this._changeCameraPosition(data.camera,data.controls);
			}
		},
		/***
		 * 放大角度特写 camera,position 通过 print3D()获取
		 */
		closeCloseUp(){
			this.reset3D();
		},
		/***
		 * 设置不然3D拖动
		 */
		setDisabled(){
			controls.enabled = false;
		},
		/**
		 * 设置可放大倍数
		 */
		setMinDistance (num) {
            controls.minDistance = num;
		},
		/**
		 * 重新计算窗体大小
		 */
		onWindowResize () {
            onWindowResize();
		},
		/***
		 * 放大角度特写 camera,position 通过 print3D()获取
		 */
		_changeCameraPosition (_cameraObj,_positionObj) {
			console.info("_cameraObj",_cameraObj,_positionObj)
			var tween1 = new TWEEN.Tween(camera.position)
			.to(_cameraObj, 1000)
			.start();

			var tween2 = new TWEEN.Tween(controls.target)
				.to(_positionObj, 1000)
				.start();
		},
		/***
		 * 禁止3D拖动
		 */
		saveState3D () {
			saveState3D();
		},
		/***
		 * 回复3D
		 */
		reset3D () {
			reset3D();
		},
		/**
		 * 关闭车灯
		 */
		closeLight () {
		  switchLight(false);
		},
		/**
		 * 关闭场景
		 */
		closeAppearanceScene() {
			scene2.background = null;
		},
		/**
		 * 改变场景 type 可选1  2
		 */
		changeAppearanceScene(type){
			this.appearanceScene = type
			//ChangeScene(type)
		},
		/**
		 * 改变内饰角度 type 可选1  2
		 */
		changePanoSwitch(type){
			this.panoSwitch = type
			switchInt(type)
		},
		/**
		 * 设置外观角度 {x: 98.06849157971862, y: 88.15131216551944, z: -843.5601340943036}
		 */
		setCarExtPosition(json){

			if(typeof(setCarExtPosition) == 'function'){
				setCarExtPosition(json)
			}

		},
		/**
		 * 设置外观角度 有动画效果 {x: 98.06849157971862, y: 88.15131216551944, z: -843.5601340943036}
		 */
		setCarExtPositionTween(json){
			setCarExtPositionTween(json)
		},
		/**
		 * 设置外观角度 有动画效果 {x: 98.06849157971862, y: 88.15131216551944, z: -843.5601340943036}
		 */
		setCarExtAToBTween(from,to){
			setCarExtAToBTween(from,to)
		},
		_startPano (options = {}) {
				let _self = this;
				return new Promise((resolve, reject)=>{
				  if(this.panoIsLoad === false){

						return this.loadPano (options).then(()=>{
								//回调告诉内饰渲染进度
								/*if(typeof(options.on) != 'undefined' && typeof(options.on.startLoad3DJs) == 'function'){
									options.on.startLoad3DJs()
								}*/

								navigator.pointerEnabled = navigator.maxTouchPoints > 0;			    // Edge 17
								document.documentElement.ontouchstart = navigator.maxTouchPoints > 0;  // Chrome 70
								embedpano({swf:webSiteURL+"pano/krpano.swf", xml:webSiteURL+"pano/dt_pano/contextmenu.xml", target:"pano", html5:"auto", mobilescale:1.0, passQueryParameters:true,onready: krpanoReady,id:"pano1"});
								this.panoIsLoad = true;
								setTimeout(()=>{panoStart();},500)

								carExtLoading = function (value) {
								//回调告诉内饰渲染进度
								if(typeof(options.on) != 'undefined' && typeof(options.on.extLoading) == 'function'){
									options.on.extLoading(value)
								}
								}

								panoReady = function(){
									//回调告诉内饰已经渲染完毕
									if(typeof(options.on) != 'undefined' && typeof(options.on.extLoadingEnd) == 'function'){
										options.on.extLoadingEnd()
									}
									resolve()
								}
						});
				  }else{
						resolve()
				  }
				});
		},
		/***
		 * 绑定组合项
		 */
		_buildFamilyMerge (featureList) {
			featureList.forEach(code => {
				let familyMergeStrCodes = this._getFamilyMergeByCode(code);
				if(familyMergeStrCodes != null) {
					featureList=featureList.concat(familyMergeStrCodes);
				}
			})
			return featureList;
		},
		_getFamilyMergeByCode (code) {
				let familyMergeStr = defaultOptions.familyMerge[code];//看看是不是组合项
				if(typeof(familyMergeStr)!='undefined'){
					let familyMergeStrCodes =  familyMergeStr.split(",");
					familyMergeStrCodes.push(code)
					return familyMergeStrCodes;
				}
			return null;
		},
		load (options = {}) {
		  //没有加载过js
		   if(typeof(window.YpThreeOptionalIsAppJs) =='undefined'){
				 if(typeof(options.on) != 'undefined' && typeof(options.on.startLoad3DJs) == 'function'){
					options.on.startLoad3DJs()
				}
			  //this.$emit('startLoad3DJs');//标识在加载js
				window.webSiteURL = staticWebSiteURL +  '3d/' + defaultOptions.path + "/" ;
				//alert(window.webSiteURL)
			  return this.appendHead3DJs(defaultOptions.code).then(()=>{
				  window.YpThreeOptionalIsAppJs = true
				  //this.$emit('finishLoad3DJs');//标识结束加载js
			  });
		   }else{
			 return Promise.resolve()
		   }
		},
		loadPano (options = {}) {
		  //没有加载过js
		   if(typeof(window.YpThreeOptionalappPano) =='undefined'){
				 if(typeof(options.on) != 'undefined' && typeof(options.on.startLoad3DJs) == 'function'){
					options.on.startLoad3DJs()
				}
			  //this.$emit('startLoad3DJs');//标识在加载js
				window.webSiteURL = staticWebSiteURL +  '3d/' + defaultOptions.path + "/" ;
				//alert(window.webSiteURL)
			  return this.appendPano3DJs(defaultOptions.code).then(()=>{
				  	window.YpThreeOptionalappPano = true
				  //this.$emit('finishLoad3DJs');//标识结束加载js
			  });
		   }else{
			 		return Promise.resolve()
		   }
		},
		appendHead3DJs: function(name) {
			let _self = this;
				return new Promise((resolve, reject)=>{

							_self.loadScript(webSiteURL +"car/" + name + "/three.min.js").then(()=>{
								let _array = [
									_self.loadScript(webSiteURL +"car/" + name + "/js/" + name + "Optional.js"),


									_self.loadScript(webSiteURL +"car/" + name + "/js/ThreeNode.js"),
									_self.loadScript(webSiteURL +"car/" + name + "/js/loaders/draco/DRACOLoader.js"),
									_self.loadScript(webSiteURL +"car/" + name + "/js/loaders/draco/geometry_helper.js"),
									_self.loadScript(webSiteURL +"car/" + name + "/js/loaders/AWDLoader.js"),
									_self.loadScript(webSiteURL +"car/" + name + "/js/Tween.js")

									//_self.loadScript( webSiteURL +"pano/krpano.js"),
									//_self.loadScript( webSiteURL +"pano/YappamCarPano.js")
								];
								if(modeDrive.isOs() === true){
									_array = _array.concat(_array,[
										_self.loadScript(webSiteURL +"car/" + name + "/js/loaders/RGBELoader.js"),
										_self.loadScript(webSiteURL +"car/" + name + "/js/loaders/HDRCubeTextureLoader.js"),
										_self.loadScript(webSiteURL +"car/" + name + "/js/pmrem/PMREMGenerator.js"),
										_self.loadScript(webSiteURL +"car/" + name + "/js/pmrem/PMREMCubeUVPacker.js"),
									])
								}
								_array = _array.concat(_array,[
									_self.loadScript(webSiteURL +"car/" + name + "/js/DracoLoaderManage.js"),
									_self.loadScript(webSiteURL +"car/" + name + "/js/MaterialsManage.js"),
									_self.loadScript(webSiteURL +"car/" + name + "/js/LightsManage.js"),
									_self.loadScript(webSiteURL +"car/" + name + "/js/DeviceTesting.js")
								])
								Promise.all(_array).then(()=>{

									_self.loadScript(webSiteURL +"car/" + name + "/js/YappamCar.js").then(()=>{
											resolve();
									});
								});
							});
				});




		},
		appendPano3DJs: function(name) {
			let _self = this;
				return new Promise((resolve, reject)=>{

								Promise.all([
									_self.loadScript( webSiteURL +"pano/krpano.js"),
									_self.loadScript( webSiteURL +"pano/YappamCarPano.js"),
									_self.loadScript( webSiteURL +"pano/YappamCarPano2.js")
								]).then(()=>{
									resolve();
								});
				});

		},
		  loadScript: function(url){
			return new Promise((resolve, reject)=>{

			let script = document.createElement('script')
			script.src = url;
			script.onload = resolve.bind(this, this.Dexie);
			script.onerror= reject;
			window.document.head.append(script);
		  });
		  },
		//把任意元素移动到指定的目标位置
		 animate: function (element,target){
			 clearInterval(element.timer1);
			 element.timer1=setInterval(function(){//element是一个对象，对象点出来的属性有且只有一个，避免多次点击按钮产生多个定时器
				 var current=element.offsetLeft;    //获取当前位置，数字类型，没有px。
				 //不可以用element.style.left，因为该写法只能获取到行内样式，不能获取到<style></style>标签内的样式
				 var step=10;//每次移动的距离
				 step=current<target?step:-step;//step的正负表示了向左或是向右移动
				 current+=step;    //计算移动到的位置，数字类型，没有px
				 if(Math.abs(target-current)>Math.abs(step)){//当离目标位置的距离大于一步移动的距离
					 element.style.left=current+"px";//移动

				 }else{//当间距小于一步的距离，则清理定时器，把元素直接拿到目标位置
					 clearInterval(element.timer1);
					 element.style.left=target+"px";

				}
			 },20);
		 }
}


/**
 *
 */
ThreeOptional.install = function (Vue,options = {}) {
	 defaultOptions = Object.assign({}, defaultOptions, options); // 配置参数
	// 创建一个VUE构造器
	let toConstructor = Vue.extend(threeOptionalVue)
	// 实例化VUE实例
	instance = new toConstructor({
		//data: options
	})


    //将实例传到 指定的挂载点
    instance.vm = instance.$mount(defaultOptions.el);

	Vue.prototype.$threeOptional = ThreeOptional; // 将组件暴露出去，并挂载在Vue的prototype上
}



export default ThreeOptional
