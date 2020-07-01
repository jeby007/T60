<template>
  <div class="container configDetails">
    <div class="header clearfix">
      <div class="header__right">
        <a class="header__closePage" @click="goback()">关闭</a>
      </div>
      <div class="header__title" @click="goback()">{{$t('ShoppingCart')}}</div>
    </div>
    <div class="middleBlockPublic">
      <div class="configDetails__cont clearfix">
        <ul class="tabNav fl">
          <li v-for="vo in allGroups" :class="{active:showGroupCode === vo.code}">
            <a href="javascript:void(0);" @click="changeGroup(vo)">{{vo.pageNameZh}}</a></li>
          <li v-for="vo in otherGroups" :class="{active:showGroupCode === vo.code}" v-show="boutiqueList.length>0">
            <a href="javascript:void(0);" @click="changeGroup(vo)">{{vo.groupNameZh}}</a>
          </li>
        </ul>
        <div class="tabList fl" v-if="allGroups.length > 0 || boutiqueList.length>0">
          <div class="tabListWrap resetSroll">
            <vue-scroll :ops="ops">
              <ul class="featureLists">
                <!--循环开始-->
                <li class="clearfix" v-for="feature in getSelectedFeatureByGroupCode" v-if="showOtherGroups === false">
                  <div class="tableCell">
                    <span class="familyName ellipsis">{{$commonFun.familyName(getFamilyByFamilyCode(feature.familyCode))}}</span>
                  </div>
                  <div class="tableCell">
                    <!--循环开始-->
                    <div class="featureWrap">
                      <div class="fearureInfo">
                        <!-- <img class="featureImg" :src="items.app_2d" alt="" /> -->
                        <span class="featureName ellipsis">{{$commonFun.featureName(feature) }}</span>
                        <!-- 排放是否可编辑给editIcon元素添加判断v-if="list.editable && editHiddenShow" -->
                        <span class="featurePrice fr">￥{{feature.price}}</span>

                      </div>

                    </div>
                    <!--循环结束-->
                  </div>
                </li>
                <!--循环结束-->
              </ul>
              <!--精品列表 start-->
              <ConfigDetailsBoutique
                v-if="showGroupCode =='jp'"
                @boutiqueDetailBoxCallBack="boutiqueDetailBoxCallBack"
              >
              </ConfigDetailsBoutique>
              <!-- 精品列表 end -->

              <!--  精品详情弹框 start -->
              <OptionalCarBoutiqueDetail
                v-if="showBoutiqueDetail"
                @closeBoutiqueDetailBox="showBoutiqueDetail=false"
                :id="id">
              </OptionalCarBoutiqueDetail>
              <!--  精品详情弹框 end -->

            </vue-scroll>
          </div>
        </div>

        <!--右侧下单部分 start-->
        <ConfigDetailsOrder
          :showCarSize='showCarSize'
          :getPrice='getPrice'
          :getOriginPrice='getOriginPrice'
          :price='price'
          :promotionPrice='promotionPrice'
          :carLength='carLength'
          :carHeight='carHeight'
          @saveToOrder='saveToOrder'
        >
        </ConfigDetailsOrder>
        <!-- 右侧下单部分 end -->
        <div class="noData" v-if="allGroups.length == 0 && boutiqueList.length == 0">{{$t('NoUserSelect')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex'
  import Menu from './component/Menu.vue';
  import commonApi from '@/common/commonFun.js';//引入公共js
  import serverApi from '@/common/serverApi'
  //精品组件
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'

  //精品列表
  import ConfigDetailsBoutique from './component/ConfigDetailsBoutique'
  //精品详情弹框
  import OptionalCarBoutiqueDetail from './component/OptionalCarBoutiqueDetail'

  //右侧下单部分
  import ConfigDetailsOrder from './component/ConfigDetailsOrder'

  import Vue from "vue";
  import vuescroll from 'vuescroll';
  import 'vuescroll/dist/vuescroll.css';

  Vue.use(vuescroll);

  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'

  export default {
    data() {
      return {
        //要显示的
        showGroupCode: '',
        showOtherGroups: false,
        allGroups: [],
        //其他附加的
        otherGroups: [{
          groupNameZh: '精品',
          code: 'jp'
        }],
        showDiscountBox: false,
        ops: {
          vuescroll: {},
          scrollPanel: {
            initialScrollY: false,
            initialScrollX: false,
            scrollingX: false,
            scrollingY: true,
          },
          rail: {
            background: '#fff',
            opacity: 0.2,
            border: '50%',
            size: '4px',
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
            size: '4px'
          }
        },
        showBoutiqueDetail: false,     //精品详情弹框隐藏
        id: '',    //精品id
        showCarSize: true,   //显示车图尺寸
        carLength: '4825',//4825
        carHeight: '1778',//1778,
      }
    },

    watch: {
      showGroupCode() {
        let group = this.allGroups.find(group => {
          return group.code === this.showGroupCode
        });
        if (group == null) {
          this.showOtherGroups = true;
        } else {
          this.showOtherGroups = false;
        }
      }
    },
    activated() {
      if (this.groups.length == 0) { //刷新页面 直接 跳回选配页
        this.$router.replace({name: 'optionalcar'})
      } else {
        this.init();
      }

    },
    methods: {
      //点击显示精品详情弹框
      boutiqueDetailBoxCallBack(id) {
        this.id = id;
        this.showBoutiqueDetail = true;
      },
      buildData() {
        this.allGroups = [];
        this.groups.forEach(group => {
          if (group.code == 'zb') {
            group.childGroup.forEach(childGroup => {
              if (this.selectedFeatures.find(vo => {
                return vo.groupCode == childGroup.code
              }) != null) {
                this.allGroups.push({code: childGroup.code, pageNameZh: childGroup.groupNameZh})
              }

            });
          } else {
            if (this.selectedFeatures.find(vo => {
              return vo.groupCode == group.code
            }) != null) {
              this.allGroups.push(group)
            }
          }
        })
        if (this.allGroups.length > 0) {
          this.showGroupCode = this.allGroups[0].code;
        }else {
          this.showGroupCode = this.otherGroups[0].code;
        }

      },
      /**
       * 初始化数据
       *  params => preorderSid
       *         => mode
       *         => type
       *
       */
      init() {
        boutiqueVehicleComplex.init().then(() => {
          this.buildData();
        });
      },
      goback() {
        this.$router.go(-1)
      },
      changeGroup(group) {
        this.showGroupCode = group.code
      },
      //保存下单
      saveToOrder() {

      }
    },
    computed: {
      ...mapState({
        price: state => state.vehicle.price,
        promotionPrice: state => state.vehicle.promotionPrice,
        selectedFeatures: state => state.vehicle.selectedFeatures
      }),
      ...mapGetters({
        groups: 'vehicle/getGroups',
        getFamilyByFamilyCode: 'vehicle/getFamilyByFamilyCode',
        getFeatureByFeatureCode: 'vehicle/getFeatureByFeatureCode',
        boutiqueTotalprice: 'boutique/getSaveboutiqueTotalprice',  //获取精品总价
        boutiqueList: 'boutique/getSaveboutique'
      }),
      //获取总价:原价+优惠价+精品总价
      getPrice() {
        return this.price + this.promotionPrice + this.boutiqueTotalprice;
      },
      //获取原价:原价+精品总价
      getOriginPrice() {
        return this.price + this.boutiqueTotalprice;
      },
      getSelectedFeatureByGroupCode() {
        if (this.showGroupCode != '') {
          return this.selectedFeatures.filter(vo => {
            return vo.groupCode == this.showGroupCode
          })
        }
      }
    },
    components: {
      Menu,
      ConfigDetailsBoutique,
      OptionalCarBoutiqueDetail,
      ConfigDetailsOrder
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../../static/style/global.css';

  .configDetails__cont {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    height: 6.5rem;
    width: 16.6rem;
    color: #fff;
    margin: auto;
  }

  .configDetails__cont .tabNav {
    /*margin-top:0.3rem;*/
    width: 1.6rem;
  }

  .configDetails__cont .tabNav li {
    display: block;
    height: 0.5rem;
    line-height: 0.5rem;
    margin: 0.1rem 0;
    font-size: 0.32rem;
    color: #999;
    padding-left: 0.7rem;
    position: relative;
    transition: all 0.3s;
    -webkit-transition: all 0.3s;
  }

  .configDetails__cont .tabNav li a {
    color: #999;
  }

  .configDetails__cont .tabNav li.active {
    background: url(../../static/images/navBg.png) no-repeat;
    background-size: 2.5rem auto;
    padding-left: 0.26rem;
  }

  .configDetails__cont .tabNav li.active a {
    color: #01aeff;
  }

  .configDetails__cont .tabList {
    width: 10.26rem;
    height: 5.5rem;
    /* background: rgba(51, 51, 51, 0.8); */
    background: rgba(74,90,115,0.4);
    padding: 0.5rem 0.4rem;
    border-radius: 0.1rem;
    margin-right: 0.2rem;
  }

  .configDetails__cont .tabListWrap {
    height: 100%;
    overflow-x: hidden;
  }

  .configDetails__cont .featureLists > li {
    display: block;
    font-size: 0.24rem;
    width: 10.82rem;
    background: rgba(256, 256, 256, 0.1);
    position: relative;
  }

  .configDetails__cont .tabList .timeLimitIcon {
    position: absolute;
    top: 50%;
    margin-top: -0.275rem;
    width: 0.83rem;
    height: 0.43rem;
    left: 2.3rem;
    background: url(../../static/images/timeLimit.png) no-repeat;
    background-size: 0.83rem auto;
    text-indent: -9999px;
  }

  .configDetails__cont .tabList .tableCell {
    display: table-cell;
  }

  .configDetails__cont .tabList .tableCell:first-child {
    border-right: 0.08rem solid rgba(30, 35, 50, 0.6);
  }

  .configDetails__cont .tabList .familyName {
    display: inline-block;
    vertical-align: top;
    width: 2.4rem;
    padding: 0.05rem 0 0.05rem 0.54rem;
    line-height: 0.44rem;
  }

  .configDetails__cont .tabList .featureWrap {
    display: inline-block;
    vertical-align: top;
    width: 7rem;
    padding: 0.05rem 0.15rem 0.05rem 0.3rem;
    line-height: 0.44rem;
  }

  .configDetails__cont .tabList .featureImg {
    display: inline-block;
    vertical-align: middle;
    width: 0.78rem;
    height: 0.44rem;
    vertical-align: middle;
    margin-right: 0.25rem;
  }

  .configDetails__cont .tabList .featureName {
    display: inline-block;
    vertical-align: middle;
    line-height: 0.44rem;
    max-width: 6.6rem;
  }

  .configDetails__cont .tabList .editIcon {
    float: right;
    width: 0.25rem;
    height: 0.25rem;
    background: url(../../static/images/editIcon.png) no-repeat center;
    background-size: 0.25rem auto;
    margin-top: 0.08rem;
  }

  .configDetails__cont .tabList .featurePrice {
    margin: 0 0.2rem;
    color: #ffa401;
    font-family: "微软雅黑";
  }

  .configDetails__cont .tabList .featureMoneyOff {
    width: 0.68rem; /*height: 0.39rem;*//*background: url(../../static/images/salesBg.png) no-repeat;background-size: 0.68rem auto;*/
    text-indent: -999px;
  }

  .configDetails__cont .tabList .featureMoneyOff img {
    display: block;
    width: 0.68rem;
    height: 0.39rem;
  }

  .configDetails__cont .featureLists > li:nth-of-type(2n) {
    background: transparent;
  }

  .configDetails__cont .featureLists > li:nth-of-type(2n) .tableCell:first-child {
    border: 0;
  }

  .configDetails__cont .carDiscounts__title {
    padding-right: 0.42rem;
    background: url(../../static/images/tipsIcon.png) no-repeat right center;
    background-size: 0.34rem auto;
  }

  .configDetails__cont .carDiscounts__cont {
    padding-right: 0.26rem;
    background: url(../../static/images/arrow3.png) no-repeat right center;
    background-size: 0.18rem auto;
  }

  .configDetails__cont .carTotal {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0.15rem 0.2rem;
    margin-bottom: 0.30rem;
    height: 1.95rem;
    background: url(../../static/images/priceBg.png) no-repeat left center;
    background-size: 5.12rem auto;
  }

  .tip__txt-wrap {
    width: 4.62rem;
    line-height: 1em;
    color: #ffa401;
    padding: 0.1rem 0.4rem 0.1rem 0.15rem;
    background: rgba(256, 256, 256, 0.1) url(../../static/images/arrow4.png) no-repeat 4.28rem center;
    background-size: 0.18rem auto;
    margin-top: 0.12rem;
    font-size: 0.26rem;
  }

  .modifyPrice {
    line-height: 0.6rem;
  }

  .configDetails__cont .totalPrice, .configDetails__cont .discountsPrice {
    display: inline-block;
    vertical-align: middle;
    font-family: "微软雅黑";
  }

  .configDetails__cont .totalPrice {
    width: 1.8rem;
    font-size: 0.26rem;
    line-height: 1.2em;
    display: block;
    color: #999;
  }

  .configDetails__cont .totalPrice .lineT {
    color: #9fa4b2;
  }

  .configDetails__cont .discountsPrice {
    font-size: 0.48rem;
    color: #ffa401;
  }

  .configDetails__cont .originalPrice {
    font-size: 0.28rem;
    color: #b8bfcb;
  }

  .configDetails__cont .discountsPrice.dis {
    color: #d3b5ff;
  }

  .configDetails__cont .orderBtn, .configDetails__cont .btn__moreCar {
    display: block;
    width: 3.6rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    font-size: 0.36rem;
    background: #ffa401;
    border-radius: 0.1rem;
    position: relative;
    margin: 0 auto;
    color: #fff;
  }

  .configDetails__cont .btn__moreCar {
    width: 4.56rem;
    height: 0.88rem;
    line-height: 0.88rem;
  }

  .configDetails__cont .orderBtn .hotPriceIcon {
    position: absolute;
    top: 0;
    left: 0;
    width: 0.78rem;
    height: 0.77rem;
    background: url(../../static/images/hotPriceIcon.png) no-repeat;
    background-size: 0.78rem auto;
  }

  .configDetails__cont .addOnTips {
    padding-top: 0.2rem;
    text-align: center;
    font-size: 0.26rem;
    color: #afbacc;
  }

  .configDetails__cont .goAddOn {
    color: #40a8c6;
  }

  .carDiscounts--details {
    position: absolute;
    bottom: 0.1rem;
    left: 0.38rem;
    width: 4.4rem;
    height: 3.9rem;
    background: #4d5a6f;
    border: 1px solid #7985a1;
    border-radius: 0.1rem;
    padding: 0 0.25rem;
    z-index: 1000;
  }

  .carDiscounts--details__title {
    line-height: 0.6rem;
    text-align: center;
    font-size: 0.26rem;
  }

  .carDiscounts--details .arrowIcon {
    position: absolute;
    top: 0.1rem;
    right: 0.15rem;
    width: 0.54rem;
    height: 0.39rem;
    background: url(../../static/images/arrowU.png) no-repeat center;
    background-size: 0.44rem auto;
  }

  .carDiscounts--details__cont {
    padding: 0.1rem 0;
    border-top: 1px solid #737c8a;
    border-bottom: 1px solid #737c8a;
    height: 1.6rem;
    line-height: 1.2em;
    overflow-y: auto;
  }

  .carDiscounts--details__question {
    font-size: 0.24rem;
  }

  .carDiscounts--details__answer {
    font-size: 0.18rem;
  }

  .carDiscounts--detailsUl {
    display: block;
    height: 1.7rem;
    overflow-y: auto;
  }

  .carDiscounts--detailsUl li {
    display: block;
    padding: 0.22rem 0;
    border-bottom: 1px solid #7985a1;
    font-size: 0.24rem;
    line-height: 0.34rem;
  }

  .carDiscounts--detailsUl .radio {
    width: 0.35rem;
    height: 0.35rem;
    background: url(../../static/images/radioIcon.png) no-repeat;
    background-size: 0.35rem auto;
    background-position: left bottom;
  }

  .carDiscounts--detailsUl .radio.checked {
    background-position: left top;
  }

  .familyDetailsBox .feature__wrap {
    height: 1.5rem;
    margin-top: 0.2rem;
  }


  /*fearture精品内容*/
  .products__title {
    padding: 0.2rem 0 0.15rem 1rem;
    font-size: 0.24rem;
    color: #afbacc;
  }

  .products__title .unFold {
    display: inline-block;
    vertical-align: -0.06rem;
    width: 0.54rem;
    height: 0.39rem;
    background: url(../../static/images/arrowD.png) no-repeat center;
    background-size: 0.34rem auto;
  }

  .products__lists li {
    display: block;
    margin-bottom: 0.1rem;
  }

  .featureProducts {
    padding-right: 0.15rem;
  }

  .products__lists .products__info {
    width: 6.4rem;
    padding: 0.1rem 0.3rem 0.1rem 0.02rem;
    background: rgba(24, 29, 40, 0.3);
    border-radius: 0.1rem;
    height: 0.6rem;
    line-height: 0.4rem;
    font-size: 0.24rem;
  }

  .products__lists .deleteIcon {
    display: inline-block;
    vertical-align: middle;
    width: 0.46rem;
    height: 0.46rem;
    background: url(../../static/images/reduceIcon.png) no-repeat center;
    background-size: 0.36rem auto;
  }

  .products__lists .products__img {
    display: inline-block;
    vertical-align: middle;
    width: 0.4rem;
    height: 0.4rem;
    margin: 0 0.2rem 0 0.15rem;
  }

  .products__lists .products__name {
    display: inline-block;
    vertical-align: middle;
    max-width: 3.8rem;
  }

  .products__lists .products__amount {
    width: 1.9rem;
    height: 0.6rem;
    border: 1px solid #5a626f;
    background: rgba(24, 29, 40, 0.3);
    border-radius: 0.1rem;
    line-height: 0.6rem;
  }

  .products__lists .minusIcon {
    float: left;
    width: 0.5rem;
    height: 100%;
    background: url(../../static/images/minusIcon.png) no-repeat center;
    background-size: 0.34rem auto;
  }

  .products__lists .number {
    float: left;
    width: 0.8rem;
    height: 100%;
    background: transparent;
    border-left: 1px solid #5a626f;
    border-right: 1px solid #5a626f;
    text-align: center;
    color: #fff;
  }

  .products__lists .plusIcon {
    float: right;
    width: 0.5rem;
    height: 100%;
    background: url(../../static/images/plusIcon.png) no-repeat center;
    background-size: 0.34rem auto;
  }

  .qualityBlock__list-wrap .quality__soldOut {
    position: absolute;
    left: 50%;
    bottom: 0.10rem;
    margin-left: -1.16rem;
    width: 2.32rem;
    height: 0.89rem;
    background: url(../../static/images/soldOut.png) no-repeat center center;
    background-size: 2.32rem auto;
  }

  /*现车入口*/
  .curCar__entrance {
    position: fixed;
    top: 0.3rem;
    left: 50%;
    padding: 0.5rem 1.5rem 0 1.5rem;
    width: 9.0rem;
    height: 1.9rem;
    transform: translate(-50%, 0);
    text-align: center;
    background: url(../../static/images/curCarBg.png) no-repeat;
    background-size: 9.0rem auto;
    z-index: 7000;
  }

  .curCar__entrance .curCar__left {
    float: left;
    width: 0.73rem;
    height: 0.26rem;
    background: url(../../static/images/curLeftArrow.png) no-repeat;
    background-size: 0.73rem auto;
  }

  .curCar__entrance .curCar__text {
    display: inline-block;
    vertical-align: top;
    margin-top: -0.15rem;
    color: #ffa401;
    font-size: 0.40rem;
  }

  .curCar__entrance .curCar__point {
    display: inline-block;
    vertical-align: top;
    margin: -0.35rem -0.20rem 0 0;
    width: 1.13rem;
    height: 1.11rem;
    background: url(../../static/images/pointIcon.png) no-repeat;
    background-size: 1.13rem auto;
  }

  .curCar__entrance .curCar__right {
    float: right;
    width: 0.73rem;
    height: 0.26rem;
    background: url(../../static/images/curRightArrow.png) no-repeat;
    background-size: 0.73rem auto;
  }

  .curCar__entrance .curCar__point {
    animation: point 0.5s ease infinite alternate;
    -webkit-animation: point 0.5s ease infinite alternate;
  }

  @keyframes point {
    0% {
      transform: translate(5px, 10px) scale(1.1)
    }
    100% {
      transform: translate(0, 0) scale(1.0)
    }
  }

  @-webkit-keyframes point {
    0% {
      transform: translate(5px, 10px) scale(1.1)
    }
    100% {
      transform: translate(0, 0) scale(1.0)
    }
  }

  .configDetails >>> .boutiqueCost {
    float: right;
  }

  /*暂无数据*/
  .configDetails .noData {
    right: auto;
    width: 74%;
  }

  @media only screen and (min-width: 736px) and (max-width: 811px) {
    .configDetails__cont {
      width: 16.9rem;
      margin-left: -8.45rem;
    }

    .configDetails__cont .tabNav {
      width: 2rem;
      overflow: hidden;
    }

    .configDetails__cont .tabList {
      width: 9rem;
    }

    .configDetails__cont .featureLists > li {
      width: 8rem;
    }

    .configDetails__cont .tabList .familyName {
      padding-left: 0.1rem;
      width: 1.8rem;
    }

    .configDetails__cont .tabList .featureWrap {
      width: 6.3rem;
    }

    .configDetails__cont .tabList .featureName {
      max-width: 4rem;
    }

    .configDetails__cont .tabList .featurePrice {
      margin: 0 0.1rem;
    }

    .familyDetailsBox .closeBox {
      right: 0;
    }

    .lightBox__title {
      max-width: 6rem;
    }

    .hotDiscountPriceCont {
      right: 0.65rem;
    }
  }

  /* @media only screen and (min-width: 900px) and (max-width: 1368px) {
    .configDetails__cont {
      height: 11rem;
      margin-top: -5.5rem;
    }

    .configDetails__cont .tabList {
      width: 12.5rem;
      height: 11rem;
    }

    .configDetails__cont .carIntro, .configDetails__cont .tabNav {
      height: 11rem;
    }
  } */
</style>
