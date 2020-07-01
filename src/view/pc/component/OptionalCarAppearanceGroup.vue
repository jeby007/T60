<template>
  <div id="appearanceWrap">
    <!-- 切换场景 start-->
    <div class="header__scene" :class="{openScene: openScene}" @click="changeScene">
      <span class="sceneIcon"><i></i></span>
      <span class="sceneText">{{$t('Backgrounds')}}</span>
    </div>
    <!-- 切换场景 end -->

    <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutLeft">
      <div id="appearanceCanvas"></div>
    </transition>

    <div class="feature__block" v-if="selectedFeature != null"><!--内饰加bg-->
      <div class="familly__name-wrap">
        <span class="feature__tipsAnimation bellMove" @click="showOtherFeatures(family)"></span>
        <span class="familly__name"
              @click="showOtherFeatures(family)">{{$commonFun.featureName(selectedFeature) }}</span>
        <!-- <span class="feature__timeLimit"></span> -->
      </div>
      <div class="feature__wrap">
        <ul class="feature__wrap-ul">
          <vuescroll :ops="ops" :class="{hideFeature:family.code == 5}">
            <!--  feature 循环开始 -->
            <li v-for="feature in getShowFeaturesByFamily(family)">
              <div class="feature__inner" :class="{checked: feature.selected === true}">
                <span class="feature__span" @click.stop="changeFeature(feature,family)">
                  <yp-img :src="$commonFun.featureIcon(feature)" className="feature__img"/>
                  <i class="disabled" v-if="feature.selectable === false"></i>
                </span>
              </div>
            </li>
          </vuescroll>
        </ul>
      </div>

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
    props: ['group', 'isFirstIntoGroup'],
    data() {
      return {
        family: {},
        selectedFeature: null,
        familyList: [],
        openScene: false,     //场景切换关闭
        target: null,
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
    created() {
    },
    activated() {
      this.initThreeOptional();
      this.getfamilyList(this.group);
    },
    methods: {
      //加载family信息
      getfamilyList(group) {
        if (group) {
          let fun = this.$store.getters["vehicle/getShowFamilysByGroup"];
          this.familyList = fun(group);
          if (this.isFirstIntoGroup === false) { //不是第一次进入
            this.$threeOptional.switchAppearanceHotspot(this.familyList[0].code)//旋转角度
          }
        }
      },
      //初始化3D图
      initThreeOptional() {
        //渲染3D
        //请求一下, 避免defaultFeatureCods 为空的情况
        boutiqueVehicleComplex.init().then(() => {
          this.$threeOptional.showAppearance({
            //初始化默认code
            defaultFeatureCods: this.defaultFeatureCods,
            featureList: this.allSelectedFeaturesCode,

            haveTween: true, //有动画
            on: {
              startLoad3DJs: () => {
                loading.show();
              },
              extLoadingEnd: () => {
                loading.hide();
              }
            },
            el: "#appearanceCanvas"
          }).then(() => {
            this.setFamilySelected(this.familyList[0]) //设置第一个显示

          })
          //渲染3D
          if (this.$threeOptional.appearanceScene == 1) {
            this.openScene = false
          } else {
            this.openScene = true
          }
        });
      },
      changeScene() {
        this.openScene = !this.openScene
        if (this.openScene === true) {
          this.$threeOptional.changeAppearanceScene(2)
        } else {
          this.$threeOptional.changeAppearanceScene(1)
        }
      },

      //设置当前选中
      setFamilySelected(family) {
        this.family = family;
        this.selectedFeature = family.featureList.find(vo => {
          return vo.selected === true;
        });

      },
      //点击feature事件
      changeFeature(feature, family) {
        this.$chooseConflictFeature.valid({feature: feature}).then(res => {
          if (res.isChange === true) {
            //设置3D
            this.$threeOptional.setAppearanceFeature({featureCode: feature.code});
            boutiqueVehicleComplex.setUserSelectFeature({feature, family})
            this.selectedFeature = feature;
          }
        })
      },
      //显示feature弹框
      showOtherFeatures(family) {
        this.$showFeatureDialog.show({family: family})
      }
    },
    watch: {
      group() {
        this.getfamilyList(this.group);
      },
    },
    beforeDestroy() {
      this.$threeOptional.hideAppearance()
    },
    computed: {
      ...mapState({
        defaultFeatureCods: state => state.vehicle.defaultFeatureCods
      }),
      ...mapGetters({
        allSelectedFeaturesCode: 'vehicle/getAllSelectedFeaturesCode',
        getShowFeaturesByFamily: 'vehicle/getShowFeaturesByFamily',
        getFamilyByFamilyCode: 'vehicle/getFamilyByFamilyCode',
        getGroupByCode: 'vehicle/getGroupByCode',
      })

    },
    components: {
      FeatureCommentTag, vuescroll
    },
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #appearanceWrap >>> .carsPic {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }

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

  .qualityEnter {
    cursor: pointer;
  }

  .feature__wrap {
    animation-name: move;
    animation-duration: 600ms;
    animation-timing-function: cubic-bezier(.48, -0.3, .65, 1.28)

  }

  .feature__block {
    display: block;
    position: fixed;
    bottom: 1.30rem;
    left: 50%;
    margin-left: -6.52rem;
    padding: 0.15rem;
    width: 13.05rem;
    box-sizing: border-box;
    z-index: 7000;
  }

  .feature__block.show {
    display: block;
  }

  .feature__block.bg {
    background: rgba(32, 35, 41, 0.8);
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

  .familly__name {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.24rem;
    color: #fff;
  }

  .feature__timeLimit {
    display: inline-block;
    vertical-align: middle;
    width: 0.83rem;
    height: 0.43rem;
    background: url(../../../static/images/timeLimit.png) no-repeat;
    background-size: 0.83rem auto;
    margin-left: 0.2rem;
  }

  .feature__tipsAnimation {
    margin-right: 0.2rem !important;
  }

  .feature__info {
    margin: 0.20rem 0;
    font-size: 0.36rem;
    color: #fff;
    text-align: center;
  }

  .feature__salesPrice {
    display: inline-block;
    vertical-align: middle;
    color: #ffa401;
    font-size: 0.4rem;
    margin-right: 0.3rem;
  }

  .feature__salesPrice .renIcon {
    font-size: 0.2rem;
  }

  .feature__price {
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.3rem;
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
    text-align: center;
    height: 1.0rem;
  }

  .optionalCar .familly__menu {
    display: none;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    left: 2.80rem;
    width: 2.60rem;
    height: 7.0rem;
    background: url(../../../static/images/famillyBg.png) no-repeat;
    background-size: 2.60rem auto;
  }

  .optionalCar .familly__menu.show {
    display: block;
  }

  .optionalCar .familly__swiper {
    position: absolute;
    top: 1.58rem;
    left: -0.06rem;
    width: 2.60rem;
    height: 3.93rem;
    z-index: 6100;
    touch-action: none;
  }

  .optionalCar .familly__swiper .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .optionalCar .familly__swiper .swiper-slide.swiper-slide-prev, .optionalCar .familly__swiper .swiper-slide.swiper-slide-next {
    opacity: 0.4;
  }

  .optionalCar .familly__swiper .swiper-slide.swiper-slide-active {
    background: url(../../../static/images/famillyCur.png) no-repeat 0 0;
    background-size: 2.68rem auto;
  }

  .optionalCar .familly__swiper .swiper-slide.swiper-slide-active .familly__info {
    font-size: 0.36rem
  }

  .optionalCar .familly__info {
    width: 2.68rem;
    height: 1.31rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;
    font-size: 0.36rem;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .optionalCar .familly__text {
    display: inline-block;
    vertical-align: middle;
    width: 2.50rem;
    line-height: 1.2em;
  }

  .feature__wrap >>> .__panel {
    margin-bottom: -17px;
  }

</style>
