<template>
  <div class="base__wrap base__public">
    <div class="swiper-container base__swiper">
      <div class="swiper-wrapper base__swiperWrapper">
        <div class="swiper-slide" v-for="family in getShowFamilysByGroup">
          <div class="base__item-wrap clearfix">
            <div class="base__item-left">
              <yp-img @click.native="showOtherFeatures(family)"
                      :src="$commonFun.featureImage(selectedFeatures[family.code])" className="base__img"/>
              <a class="qualityEnter" v-if="selectedFeatures[family.code].haveBoutique === true">
                <span>{{selectedFeatures[family.code].boutiqueName}}</span>
              </a>
            </div>
            <div class="base__item-right">
              <div class="base__familly" @click="showOtherFeatures(family)">
                <span class="base__familly-name">{{$commonFun.familyName(family)}}</span>
                <span class="feature__tipsAnimation bellMove">
                </span>
              </div>
              <div class="base__itemDetails resetSroll">
                <p class="base__feature-name">{{$commonFun.featureName(selectedFeatures[family.code]) }} </p>
                <div class="base__feature-price">
                  <i class="renIcon">￥</i>{{selectedFeatures[family.code].price}}
                  <span class="feature__perIcon" v-show="selectedFeatures[family.code].displayPercent">{{selectedFeatures[family.code].displayPercent}}%用户优选</span>
                </div>
                <!--用户评论-->
                <FeatureCommentTag :featureCode="selectedFeatures"
                       @tagClick="featureCommentTagClick"/>
                <div class="base__tipDetails">
                  {{selectedFeatures[family.code].tip}}
                </div>
              </div>
              <div class="base__featureSwiper">
                <vuescroll :ops="ops">
                  <ul class="feature__wrap-ul">
                    <li v-for="feature in getShowFeaturesByFamily(family)">
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
<!--
                <div class="swiper-scrollbar">
                  <div class="swiper-scrollbar-drag"></div>
                </div>
-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

<script>
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'
  import {mapActions, mapGetters, mapState} from 'vuex'

  import Vue from 'vue';
  import vuescroll from 'vuescroll';
  Vue.use(vuescroll);

  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'

  //用户评价
  import {FeatureCommentTag} from '@/component/feature-comment/index.js'

  export default {
    components: {
      FeatureCommentTag,vuescroll
    },
    props: ['group'],
    computed: {
      ...mapGetters({
        getShowFeaturesByFamily: 'vehicle/getShowFeaturesByFamily'
      }),
      getShowFamilysByGroup() {
        if (this.group) {
          let fun = this.$store.getters["vehicle/getShowFamilysByGroup"];
          let newVal = fun(this.group)
          this.buildSelectedFeatures(newVal)
          return newVal
        }
      }
    },

    mounted(){
        this.$nextTick(() => {
          const baseSwiper = new Swiper('.base__swiper', {
            observer: true,
            observeParents: true,
            slidesPerView: 1.32,
            spaceBetween: 30,
          })
        })
    },
    watch: {
      selectedFeatures() {
      }
    },
    created() {
    },
    methods: {
      /**
       * 组装选中的 feature 避免多次循环取值
       */
      buildSelectedFeatures(familys) {
        this.selectedFeatures = {};
        familys.forEach(family => {
          let feature = family.featureList.find(feature => {
            return feature.selected === true;
          })
          if (feature != null) {
            this.selectedFeatures[family.code] = feature
          }
        })
        //console.info("selectedFeatures",this.selectedFeatures)
      },
      changeFeature(feature, family) {
        this.$chooseConflictFeature.valid({feature: feature}).then(isChange => {
          if (isChange === true) {
            boutiqueVehicleComplex.setUserSelectFeature({feature, family})
            //this.$store.dispatch('vehicle/setUserSelectFeature', {feature,family})
          }
        })

      },
      //显示其他
      showOtherFeatures(family) {
        this.$showFeatureDialog.show({family: family})
      },
      //点赞评论
      featureCommentTagClick(featureCode) {
        this.$router.push({name: 'featurecomment', query: {featureCode: featureCode}})
        //TODO 路由跳转
      }
    },
    data() {
      return {
        selectedFeatures: {},
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
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .optionalCar .group__swiper .swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .swiper-slide {
    width: 16rem !important;
    margin-right: 1rem !important;
  }

  .swiper-slide-feature {
    display: flex;
    /*width: 47.4px;*/
  }

  /*基础*/
  .base__wrap {
    display: block;
    height: 7.4rem;
    position: absolute;
    width: 100%;
    left: 4.15rem;
    top: 50%;
    margin-top: -3.7rem;
    z-index: 5000;
  }

  .base__wrap.show {
    display: block;
  }


  .base__public .base__item-wrap {
    width: 100%;
    height: 7.20rem;
    background: rgba(51, 51, 51, 0.8);
    color: #fff;
    border-radius: 0.20rem;
    overflow: hidden;
  }

  .base__public .base__item-left {
    float: left;
    position: relative;
    width: 41%;
    height: 100%;
    background: #fff;
  }

  .base__public .base__img {
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
  }

  .base__public .base__item-right {
    float: right;
    width: 59%;
    height: 100%;
    padding: 0.20rem 0.40rem;
  }

  .base__public .base__itemDetails {
    height: 4.2rem;
  }

  .base__public .base__familly {
    position: relative;
    height: 0.86rem;
    margin-bottom: 0.20rem;
  }

  .base__public .base__familly .feature__tipsAnimation {
    position: absolute;
    right: 0.20rem;
    margin-right: 0;
    top: 50%;
    transform: translate(0, -50%);
  }

  .base__public .base__familly-name {
    font-size: 0.65rem;
    margin-bottom: 0.20rem;
  }

  .base__public .base__feature-name {
    margin-bottom: 0.30rem;
    font-size: 0.45rem;
    line-height: 1.2em;
    color: #fff;
  }

  .base__public .base__feature-price {
    margin-bottom: 0.30rem;
    font-size: 0.45rem;
    line-height: 0.57rem;
    color: #ffa401;
  }


  .base__public .base__tipDetails {
    margin-bottom: 0.20rem;
    width: 100%; /*height: 1.80rem;*/
    font-size: 0.36rem;
    line-height: 1.3em;
  }

  .base__public .base__featureSwiper {
    padding-bottom: 0.1rem;height: 1.8rem;
  }

  .feature__wrap-ul{width:100%;}
  .base__featureSwiper>>>.__panel{
    margin-bottom: -17px;
  }

</style>
