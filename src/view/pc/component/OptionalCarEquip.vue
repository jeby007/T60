<template>
  <div class="bsWrap swiper-container">
    <div class="equip__wrap swiper-wrapper">
      <div class="equip__inner swiper-slide" v-for="(family,index) in familys">
        <div class="equip__item">
          <div class="equip__img-wrap">
            <yp-img @click.native="showOtherFeatures(family)"
                    :src="$commonFun.featureImage(selectedFeatures[family.code])" className="base__img"/>
            <a class="qualityEnter" v-on:click="showBoutiqueFun(selectedFeatures[family.code].code)"
               v-if="selectedFeatures[family.code].haveBoutique === true"><span>{{selectedFeatures[family.code].boutiqueName}}</span></a>
          </div>
          <div class="equip__cont">
            <div class="equip__familly" @click="showOtherFeatures(family)">
              <span class="equip__familly-name">{{$commonFun.familyName(family)}}</span>
              <span class="feature__tipsAnimation bellMove"></span>
            </div>
            <div class="equip__feature-name-c">
              <div class="equip__feature-name-w">
                <vue-scroll :ops="ops">
                  <p class="equip__feature-name">
                    {{$commonFun.featureName(selectedFeatures[family.code]) }}
                  </p>
                </vue-scroll>
              </div>
            </div>
            <div class="equip__feature-price">
              <span class="feature__sales">
                <img src="@/static/images/sales1.png" alt="">
                <img src="@/static/images/sales2.png" alt="">
              </span>
              <i class="renIcon">￥</i>{{$commonFun.formatPrice(selectedFeatures[family.code].price)}}
              <span class="feature__perIcon" v-show="selectedFeatures[family.code].displayPercent">{{selectedFeatures[family.code].displayPercent}}}%用户优选</span>
            </div>
            <!--用户评论-->
            <FeatureCommentTag :featureCode="selectedFeatures" @tagClick="featureCommentTagClick"/>
            <div class="feature__wrap">
              <vue-scroll :ops="ops">
                <ul class="feature__wrap-ul">
                  <li v-for="feature in getShowFeaturesByFamily(family)">
                    <div class="feature__inner" :class="{checked:feature.selected === true}">
                      <span class="feature__span" @click.stop="changeFeature(feature,family)">
                         <yp-img :src="$commonFun.featureIcon(feature)"
                                className="feature__img"
                         />
                         <i class="disabled" v-if="feature.selectable === false"></i>
                      </span>
                    </div>
                  </li>
                </ul>
              </vue-scroll>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueScroll from 'vuescroll'
  Vue.use(VueScroll)
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'
  import {mapActions, mapGetters, mapState} from 'vuex'
  //用户评价
  import {FeatureCommentTag} from '@/component/feature-comment/index.js'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'
  export default {
    name: "OptionalCarEquip",
    components: {
      FeatureCommentTag,VueScroll
    },
    props: ['group'],
    data() {
      return {
        selectedFeatures: {},
        familys: [],
        featureCode:'',//
        showBoutique:false, //是否显示feature下面的精品弹框
        selectedGroup:'',  //当前选中的group
        swiperEq:'',
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

    mounted() {
      //this.famillyinitSwiper()
      //组装二级菜单
      let childMenus = [];
      this.group.childGroup.forEach(group => {
        let menu = {name: group.groupNameZh, selected: group.selected, vm: group}
        childMenus.push(menu)
      });
      this.childMenuClick(this.group.childGroup[0]) //设置第一个选中
      this.$emit('childMenuCallBack', childMenus);//回传二级菜单

    },
    methods: {
      //父类传过来的事件
      childMenuClick(group) {
        let fun = this.$store.getters["vehicle/getShowFamilysByGroup"];
        this.familys = fun(group)
        this.buildSelectedFeatures(this.familys)
        this.selectedGroup=group.groupNameZh
        // this.$nextTick(()=>{
        //   new Swiper('.equip__feature-name-c',{
        //     freeMode : true,
        //     freeModeMomentum:false,
        //     centeredSlides:true,
        //     observer: true,
        //     observeParents: true,
        //     preventClicksPropagation:true,
        //   })
        // })
      },


      //组装选中的feature
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
      },
      //显示其他
      showOtherFeatures(family) {
        this.$showFeatureDialog.show({family: family})
      },

      changeFeature(feature, family) {
        this.$chooseConflictFeature.valid({feature: feature}).then(isChange => {
          if (isChange === true) {
            boutiqueVehicleComplex.setUserSelectFeature({feature, family});
            this.buildSelectedFeatures(this.familys);
          }
        })
      },
      //点击feature精品弹框

      showBoutiqueFun(code) {
        this.$parent.childFeatureBoutiqueCallBack(code);
      },
      //点赞评论
      featureCommentTagClick (featureCode) {
        this.$router.push({name: 'featurecomment',query: {featureCode: featureCode}})
        //TODO 路由跳转
      }
    },
    watch:{
      selectedGroup(){
        this.$nextTick(()=>{
          this.swiperEq=new Swiper('.bsWrap', {
            freeMode : true,
            spaceBetween: '2%',
            slidesPerView: 'auto',
            observer: true,
            preventClicksPropagation:true,
          })
        })
      },
      // selectedFeatures(){
      //   this.$nextTick(()=>{
      //     let carEquipS =new Swiper('.feature__wrap',{
      //       freeMode : true,
      //       slidesPerView: 'auto',
      //       preventClicksPropagation:true,
      //     })
      //   })
      // }
    },
    computed: {
      ...mapGetters({
        getShowFeaturesByFamily: 'vehicle/getShowFeaturesByFamily'
      })
    },
  }
</script>

<style scoped>
  @import '../../../static/style/global.css';

  .bsWrap {
    width: 75%;
    height: 8.8rem;
    position: absolute;
    top: 50%;
    left: 6.15rem;
    margin-top:-4.4rem;
    z-index: 5000;
    overflow: hidden;
  }
  .equip__wrap {
    display: flex;
    /*width: 5.46rem;*/
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    z-index: 6500;
  }

  .feature__sales {
    display: none;
  }
  .base__img {
    display: block;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
  }


  .equip__wrap .equip__inner {
    height: 8.8rem;
    padding-bottom: 0.24rem;
    width: 5.46rem !important;
  }

  .equip__wrap .equip__item {
    display: inline-block;
    /*margin: 0 0.25rem;*/
    width: 5.46rem;
    height: 8.8rem;
    background: rgba(51,51,51,0.8);
    box-shadow: 0 0 3px rgba(23, 25, 27, 0.6);
    border-radius: 0.20rem;
    overflow: hidden;
    vertical-align: middle;
  }

  .equip__wrap .equip__img-wrap {
    width: 100%;
    height: 3.07rem;
    /*background: #fff;*/
    position: relative;
  }

  .equip__wrap .equip__img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .equip__wrap .equip__cont {
    width: 100%;
    padding: 0.20rem 0;
    color: #fff;
    text-align: center;
    position: relative;
  }

  .equip__wrap .equip__familly {
    position: relative;
    padding: 0 0.20rem 0.25rem 0.20rem;
    margin-bottom: 0.25rem;
    background: url(../../../static/images/lineBg.png) no-repeat center bottom;
    background-size: 3.71rem auto;
    overflow: hidden;
  }

  .equip__wrap .equip__familly-name {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.42rem;
  }

  .equip__wrap .feature__tipsAnimation {
    position: absolute;
    right: 0.10rem;
    top: -2px;
    margin-right: 0;
  }

  .equip__wrap .equip__feature-name {
    padding: 0 0.20rem 0.10rem 0.20rem;
    font-size: 0.38rem;
    word-break:keep-all;
    white-space:nowrap;
    /*overflow:hidden;*/
    cursor: default;
  }

  .equip__wrap .equip__feature-price {
    /*padding: 0 0.20rem;*/
    margin-bottom: 0.25rem;
    font-size: 0.42rem;
    color: #ffa401;
  }


  .equip__feature-price .feature__perIcon {
    margin-left: 0;
  }

  .equip__wrap .featureCommentWrap{
    padding-bottom: 0.2rem;text-align: center;margin-bottom: 0.2rem;background:url(../../../static/images/lineBg.png) no-repeat center bottom;background-size: 3.71rem auto;
  }
  .feature__wrap{height: 1.8rem;}
  .feature__wrap-ul{
    white-space:nowrap !important;
  }
  .feature__wrap>>>.__panel{
    margin-bottom: -17px;
  }

</style>
