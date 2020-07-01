<template>

  <div class="carsPic" style="width: 100%; height:300px" >
      <div id="container" v-show="!panoIsShow"></div>
      <div id="pano" style="width:100%;height:100%;" v-show="panoIsShow"></div>
      <slot></slot>
  </div>
</template>
<script>
/**
 * 使用方法
    <yp-three-optional v-bind:code="D60" ref="threeOptional"></yp-three-optional>


    支持回调事件
    clickAppearanceHotspot(family代码) => 点击了外观呼吸灯
    appearanceExtLoading(百分比) => 外观渲染进度
    appearanceExtLoadingEnd  =>外观渲染完毕


    clickPanoHotspot(family代码) => 点击了内饰呼吸灯
    panoExtLoadingEnd(百分比) => 内饰渲染进度
    panoExtLoadingEnd  => 内饰渲染完毕
 */
  export default {
    name: 'YpThreeOptional',
    props: {
      type: {
        type: String,
        default: ''
      },
      //车型代码
      code: {
        type: String,
        default: ''
      },
      //加载的素材 例如 wap pc win2000 win4000
      path: {
        type: String,
        default: 'wap'
      },
      //要显示的外观呼吸灯代码  ['M_00A' ,'M_006']
      appearanceHotspotCodes: {
        type: Array,
        default: function(){
          return [];
        }
      },
      //要显示的内饰呼吸灯代码  ['M_00C' ,'M77']
      panoHotspotCodes: {
        type: Array,
        default: function(){
          return [];
        }
      }
    },
    data() {
      return {
        appearanceIsLoad: false, //标识外观已经加载了
        panoIsLoad: false,//标识内饰已经加载了
        panoIsShow: false,
        appearanceHotspotIsInit: false, //外观呼吸灯已经初始化
        panoHotspotIsInit: false,//内饰呼吸灯已经初始化
        hotspotStartCode: 'YP'
      }
    },
    created () {
    },
    methods: {
      //显示外观
    showAppearance (options = {}) {
          this.panoIsShow = false;
          return this.startAppearance().then(()=>{
            addExt();
            setFeatureList(options.featureList);
          });
    },
    /**
     * 显示外观呼吸灯 (必须先调用显示外观)
     * options => clearoveSitClick 是否清楚点击过的样式效果 （呼吸灯点完之后会变灰色）
     *            switchCode 需要切换到指定的呼吸灯视角 传入呼吸灯代码
     */
    showAppearanceHotspot (options = {}) {
        var _self = this;
          clickAppearanceHotspot = function(hotspotName){
              hotspotName = hotspotName.replace(new RegExp(_self.hotspotStartCode),"")
              _self.$emit('clickAppearanceHotspot', hotspotName);//标识外观呼吸灯点击了
          }
          return new Promise((resolve, reject)=>{
              if(this.appearanceIsLoad === true && this.panoIsShow === false){
                  if(this.appearanceHotspotIsInit === false || options.clearoveSitClick === true){ //清空点击过的效果
                    this.appearanceHotspotIsInit = true
                    let codes = [];
                    this.appearanceHotspotCodes.forEach(element => {
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
        setExtHotspotSelect(this.hotspotStartCode + familyCode)
        setExtHotspotFeatureAngle(this.hotspotStartCode + familyCode);
    },
      //显示内饰
    showPano (featureList) {
        this.panoIsShow = true;
        if(typeof(deleteExt) != "undefined"){
            deleteExt();
        }
        return this.startPano().then(()=>{
              setIntFeatureList(featureList)
          });

    },
    /**
     * 显示内饰呼吸灯 (必须先调用显示内饰)
     * clearoveSitClick 是否清楚点击过的样式效果 （呼吸灯点完之后会变灰色）
     */
    showPanoHotspot (options = {}) {
        var _self = this;
          clickPanoHotspot = function(hotspotName){
              hotspotName = hotspotName.replace(new RegExp(_self.hotspotStartCode),"")
              _self.$emit('clickPanoHotspot', hotspotName);//标识外观呼吸灯点击了
          }
          return new Promise((resolve, reject)=>{
              if(this.panoIsLoad === true && this.panoIsShow === true){
                if(this.panoHotspotIsInit === false || options.clearoveSitClick === true){ //清空点击过的效果
                    this.panoHotspotIsInit = true
                    let codes = [];
                    this.panoHotspotCodes.forEach(element => {
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
    startAppearance () {
        var _self = this;
            return new Promise((resolve, reject)=>{
              if(this.appearanceIsLoad === false){
                  this.load ().then(()=>{
                       _self.appearanceIsLoad = true;
                      initCarStartFun();
                      addExt();
                      //渲染完成
                      carStartFunc = function () {
                        onWindowResize2();
                          resolve();
                      }
                      carExtLoading = function (value) {
                        //回调告诉外观渲染进度
                        _self.$emit('appearanceExtLoading',value);
                      }
                      carExtLoadingEnd = function(){
                        //回调告诉外观已经渲染完毕
                        _self.$emit('appearanceExtLoadingEnd');
                      }
                  })
              }else{
                resolve();
              }

            });
    },
    //切换到指定的外观呼吸灯视角
    switchPanoHotspot (familyCode) {
      console.info("switchPanoHotspot",familyCode)
        setIntHotspotSelect(this.hotspotStartCode + familyCode)
        setIntHotspotFeatureAngle(this.hotspotStartCode + familyCode);
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

        setTimeout(function(){
            switchLight(false);
        }, options.closeTime);
      }
    },
    /**
     * 关闭车灯
     */
    closeLight () {
      switchLight(false);
    },
    startPano () {
            var _self = this;
            return new Promise((resolve, reject)=>{
              if(this.panoIsLoad === false){
                  embedpano({swf:webSiteURL+"pano/krpano.swf", xml:webSiteURL+"pano/dt_pano/contextmenu.xml", target:"pano", html5:"auto", mobilescale:1.0, passQueryParameters:true,onready: krpanoReady,id:"pano1"});
                  this.panoIsLoad = true;
                  setTimeout(()=>{panoStart();},500)

                  carExtLoading = function (value) {
                    //回调告诉内饰渲染进度
                    _self.$emit('panoExtLoading',value);
                  }
                  carExtLoadingEnd = function(){
                    //回调告诉内饰已经渲染完毕
                    _self.$emit('panoExtLoadingEnd');
                  }

                  panoReady = function(){
                    resolve()
                  }
              }else{
                resolve()
              }
            });
    },
    load () {
      //没有加载过js
       if(typeof(window.YpThreeOptionalIsAppJs) =='undefined'){
          this.$emit('startLoad3DJs');//标识在加载js
          window.webSiteURL = staticWebSiteURL +  '3d/' + this.path + "/" ;
          return this.appendHead3DJs(this.code).then(()=>{
              window.YpThreeOptionalIsAppJs = true
              this.$emit('finishLoad3DJs');//标识结束加载js
          });
       }else{
         return Promise.resolve()
       }
    },
    appendHead3DJs: function(name) {
        var _self = this;
            return new Promise((resolve, reject)=>{

                        _self.loadScript(webSiteURL +"/car/" + name + "/three.min.js").then(()=>{
                            Promise.all([
                                _self.loadScript(webSiteURL +"/car/" + name + "/js/" + name + "Optional.js"),


                                _self.loadScript(webSiteURL +"/car/" + name + "/js/ThreeNode.js"),
                                _self.loadScript(webSiteURL +"/car/" + name + "/js/loaders/draco/DRACOLoader.js"),
                                _self.loadScript(webSiteURL +"/car/" + name + "/js/loaders/draco/geometry_helper.js"),
                                _self.loadScript(webSiteURL +"/car/" + name + "/js/loaders/AWDLoader.js"),
                                _self.loadScript(webSiteURL +"/car/" + name + "/js/Tween.js"),

                                _self.loadScript(webSiteURL +"/car/" + name + "/js/YappamCar.js"),
                                _self.loadScript(webSiteURL +"/car/" + name + "/js/DracoLoaderManage.js"),
                                _self.loadScript(webSiteURL +"/car/" + name + "/js/MaterialsManage.js"),
                                _self.loadScript(webSiteURL +"/car/" + name + "/js/LightsManage.js"),
                                _self.loadScript(webSiteURL +"/car/" + name + "/js/DeviceTesting.js"),



                                _self.loadScript( webSiteURL +"/pano/krpano.js"),
                                _self.loadScript( webSiteURL +"/pano/YappamCarPano.js")
                            ]).then(()=>{

                                _self.loadScript(webSiteURL +"/car/" + name + "/js/YappamCar.js").then(()=>{
                                        resolve();
                                });
                            });
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
      }
    }
  }
</script>

<style scoped>
</style>
