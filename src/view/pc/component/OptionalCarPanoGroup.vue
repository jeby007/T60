<template>
  <div id="panoWrap">

    <!-- 切换前排 start-->
    <div class="header__scene" :class="{openScene: openScene === true}" @click="changeScene">
      <span class="sceneIcon"><i></i></span>
      <span class="sceneText" v-if="openScene === true">后排</span>
      <span class="sceneText" v-else>前排</span>
    </div>
    <!-- 切换前排 end -->

    <div class="feature__block bg"><!--内饰加bg-->
      <div class="familly__name-wrap">
        <span class="feature__tipsAnimation bellMove" @click="showOtherFeatures(family)"></span>
        <span class="familly__name" @click="showOtherFeatures(family)">{{$commonFun.featureName(selectedFeature) }}</span>
      </div>
      <div class="feature__info">
        <span class="feature__perIcon" v-show="selectedFeature.displayPercent">{{selectedFeature.displayPercent}}%用户优选</span>
        <span class="feature__salesPrice">
          <i class="renIcon">￥</i>{{selectedFeature.price}}
        </span>
        <!--用户评论-->
        <FeatureCommentTag :featureCode="selectedFeature.code" @tagClick="featureCommentTagClick"/>
      </div>
      <div class="feature__wrap">
        <vuescroll :ops="ops">
          <ul class="feature__wrap-ul">
            <!--  feature 循环开始 -->
            <li v-for="feature in  getShowFeaturesByFamily(family)" class="swiper-slide">
              <div class="feature__inner" :class="{checked: feature.selected === true}">
                <span class="feature__span" @click.stop="changeFeature(feature,family)">
                  <yp-img :src="$commonFun.featureIcon(feature)"
                                  className="feature__img"
                          />
                  <i class="disabled" v-if="feature.selectable === false"></i>
                </span>
              </div>
            </li>
          </ul>
        </vuescroll>
      </div>
      <!-- 精品 -->
      <div v-show="selectedFeature.haveBoutique=== true" class="qualityEnter"><span>{{selectedFeature.boutiqueName}}</span></div>
      <!--这块就是精品!!!!-->
    </div>


  </div>

</template>

<script>
  import Vue from 'vue';
  import vuescroll from 'vuescroll';
  Vue.use(vuescroll);

  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'
  import {mapActions, mapGetters, mapState} from 'vuex'
  import {loading} from '@/packages/loading'
  //用户评价
  import {FeatureCommentTag} from '@/component/feature-comment/index.js'

  export default {
    components: {
      FeatureCommentTag,vuescroll
    },
    props: ['group'],
    computed: {
        ...mapState({
          defaultFeatureCods: state => state.vehicle.defaultFeatureCods
        }),
        ...mapGetters({ allSelectedFeaturesCode: 'vehicle/getAllSelectedFeaturesCode',
                        getShowFeaturesByFamily: 'vehicle/getShowFeaturesByFamily',
                        getFamilyByFamilyCode: 'vehicle/getFamilyByFamilyCode'
                      })
     },
    created () {
        let fun = this.$store.getters["vehicle/getShowFamilysByGroup"];
        this.familyList = fun(this.group)
    },
    mounted() {
      //渲染内饰
      this.$threeOptional.showPano({
        //初始化默认code
        defaultFeatureCods: this.defaultFeatureCods,
        featureList: this.allSelectedFeaturesCode,
        on: {
          startLoad3DJs: () => {
            loading.show();
          },
          extLoadingEnd: () => {
            loading.hide();
          }
        },
        el: "#panoWrap"
      }).then(() => {
        //显示呼吸灯
            this.$threeOptional.showPanoHotspot({
              switchCode: this.familyList[0].code,
              on: {
                clickHotspot: (hotspotName)=>{
                  let family = this.getFamilyByFamilyCode(hotspotName)
                  if(family != null){
                    let _index = this.familyList.indexOf(family);
                    if(_index != -1){
                      this.$emit('setChildMenuSelected', _index);//回传二级菜单选中
                    }
                    this.setFamilySelected(family)
                  }else{
                    this.$alert(hotspotName + "不存在")
                  }
                }
              }
            })
      })
      //渲染内饰

      this.setFamilySelected(this.familyList[0]) //设置第一个显示
      //组装二级菜单
      let childMenus = [];
      this.familyList.forEach(family => {
          let menu = {name: this.$commonFun.familyName(family), selected: family.selected, vm: family}
          childMenus.push(menu)
      });
      this.$emit('childMenuCallBack', childMenus);//回传二级菜单
      //组装二级菜单

      if(this.$threeOptional.panoSwitch == 1){
          this.openScene= false
      }else{
          this.openScene= true
      }


    },
    methods: {
      changeScene () {
          this.openScene=!this.openScene
          if(this.openScene === true){
            this.$threeOptional.changePanoSwitch(2)
          }else{
            this.$threeOptional.changePanoSwitch(1)
          }
      },
      //从父类组件传过来的事件
      childMenuClick (vm) {
        this.setFamilySelected(vm)
        //旋转角度
         this.$threeOptional.switchPanoHotspot(vm.code)
      },
      //设置当前选中
      setFamilySelected (family) {
        this.family = family;
        this.selectedFeature = family.featureList.find(vo => {
          return vo.selected === true;
        });
      },
      //点击feature事件
      changeFeature(feature, family) {
        this.$chooseConflictFeature.valid({feature: feature}).then(isChange => {
          if (isChange === true) {
            console.info(feature.code)
            //设置3D
            this.$threeOptional.setPanoFeature({featureCode: feature.code});
            boutiqueVehicleComplex.setUserSelectFeature({feature, family})
            this.selectedFeature = feature;
            //this.$store.dispatch('vehicle/setUserSelectFeature', {feature,family})
          }
        })

      },
      featureCommentTagClick (featureCode) {  //点赞评论
        this.$router.push({name: 'featurecomment',query: {featureCode: featureCode}})
        //TODO 路由跳转
      },
      //显示feature弹框
      showOtherFeatures(family) {
        this.$showFeatureDialog.show({family: family})
      },
    },
    data() {
      return {
        family: null,
        selectedFeature: {},
        familyList: [],
        openScene: false,     //场景切换关闭
        ops: {
          vuescroll: {},
          scrollPanel: {
            initialScrollY: false,
            initialScrollX: false,
            scrollingX: true,
            scrollingY: false,
          },
          rail: {
            background: '#fff',
            opacity: 0.2,
            border: '50%',
            size: '0.04rem',
            specifyBorderRadius: false,
            gutterOfEnds: null,
            keepShow: false
          },
          bar: {
            onlyShowBarOnScroll: true,
            keepShow: true,
            background: '#fff',
            opacity: 1,
            border: '50%',
            hoverStyle: false,
            specifyBorderRadius: false,
            minSize: false,
            size: '0.04rem'
          }
        },
      }
    },
    destroyed() {
      this.$threeOptional.hidePano()
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #panoWrap >>>.carsPic{position: fixed;top:0;left: 0;width: 100%;height: 100vh;}
  /*feature动画*/
  @keyframes move {
    from {
      transform-origin: left;
      transform: rotate3d(0, 0, 1, 45deg);
      opacity: 0
    }
    to {
      transform-origin: left;
      transform: rotate3d(0, 0, 0);
      opacity: 1
    }
  }

  .feature__wrap {
    animation-name: move;
    animation-duration: 500ms;
    animation-timing-function: cubic-bezier(.48, -0.3, .65, 1.28)

  }
  .feature__block {
    display: block;
    position: fixed;
    bottom: 0.40rem;
    left: 50%;
    margin-left: -6.52rem;
    padding: 0.15rem;
    width: 13.4rem;
    box-sizing: border-box;
    z-index: 5000;
  }

  .feature__block.show {
    display: block;
  }

  .feature__block.bg {
    background: rgba(51,51,51, 0.8);
    border-radius: 0.20rem;
  }

  .familly__name-wrap {
    width: 100%;
    text-align: center;
  }

  .feature__tips {
    display: inline-block;
    margin-right: 0.40rem;
    width: 0.34rem;
    height: 0.38rem;
    background: url(../../../static/images/tipsIcon2.png) no-repeat;
    background-size: 0.34rem auto;
    vertical-align: middle;
  }

  .feature__animation {
    display: inline-block;
    margin-right: 0.20rem;
    width: 23px;
    height: 23px;
    /*background: url(../../../static/images/lampIcon.png) no-repeat 0 0;*/
    background-size: 160px auto;
    vertical-align: middle;
  }

  .feature__animation.lampMove {
    -webkit-animation: lamp 1.5s steps(6) infinite;
    animation: lamp 1.5s steps(6) infinite;
  }

  @keyframes lamp {
    0% {
      background-position: 0;
    }
    100% {
      background-position: -160px;
    }
  }

  @-webkit-keyframes lamp {
    0% {
      background-position: 0;
    }
    100% {
      background-position: -160px;
    }
  }

  .familly__name {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.42rem;
    color: #fff;
  }

  .feature__info {
    margin-top: 0.10rem;
    font-size: 0.36rem;
    color: #fff;
    text-align: center;
  }

  .feature__price {
    display: inline-block;
    vertical-align: middle;
  }

  .feature__name {
    margin-right: 0.25rem;
  }

  .feature__sales {
    margin-right: 0.05rem;
    width: 0.68rem;
    height: 0.39rem;
    position: relative;
  }

  .feature__sales img {
    display: block;
    width: 0.68rem;
    height: 0.39rem;
  }

  .feature__sales-wrap {
    position: absolute;
    top: -1.20rem;
    left: 50%;
    padding: 0.20rem;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    min-width: 3.0rem;
    min-height: 0.84rem;
    background: rgba(28, 32, 42, 0.7);
    border-radius: 0.20rem;
    white-space: nowrap;
  }

  .feature__sales-wrap:after {
    position: absolute;
    left: 50%;
    bottom: -0.40rem;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    content: "";
    width: 0;
    height: 0;
    font-size: 0;
    font-weight: normal;
    border: 0.20rem solid transparent;
    border-top-color: rgba(28, 32, 42, 0.7);
  }

  .feature__sales-txt {
    font-size: 0.28rem;
    color: #fff;
  }

  .feature__salesPrice {
    display: inline-block;vertical-align: middle;
    font-size: 0.34rem;color: #ffa401;
    margin-right: 0.3rem;
  }

  .feature__price {
    font-size: 0.29rem;
    opacity: 0.5;
    text-decoration: line-through;
  }

  .feature__info .symbol__icon {
    font-size: 0.18rem;
    font-style: normal;
    font-family: '微软雅黑';
  }

  .feature__wrap {
    text-align: center;height: 1.8rem;
  }
  .feature__wrap-ul{
    white-space:nowrap !important;
    width: auto !important;
  }
  .feature__wrap>>>.__panel{
    margin-bottom: -17px;
  }

</style>
