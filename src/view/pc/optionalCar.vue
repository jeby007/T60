<template>
  <div class="container optionalCar">
    <!--头部-start-->
    <div class="header clearfix">
      <div class="header__right">
        <a class="header__btn header__home" @click="saveToHomePag">首页</a>
      </div>
    </div>
    <!--头部-end-->

    <!--总价-start-->
    <div class="price__wrap clearfix">
      <div class="total__price clearfix">
<!--         <router-link class="price__shopping" :to="{ name: 'shoppingcart'}">购物车</router-link>
-->        <a class="price__shopping" @click="goShoppingcart()">购物车</a>
        <span class="price">
          <span class="original__price">
            <i class="renIcon">￥</i>{{$commonFun.formatPrice(getPrice)}}
          </span>
        </span>
        <!-- <a class="price__hammer" @click="nextConfigCar()">立即下单</a> -->
        <a class="confirmConfig blueC" @click="nextConfigCar()">{{$t('ConfirmConfiguration')}}</a>
      </div>
    </div>
    <!--总价-end-->

    <div class="middleBlockPublic">
      <!--外观-start-->
      <OptionalCarAppearanceGroup ref="childOptionalComponent" v-if="showGroupCode ==='wg'"
                :group="getGroupByCode('wg')"
                :isFirstIntoGroup="isFirstIntoGroup">
      </OptionalCarAppearanceGroup>
      <!--外观-end-->

      <!--精品-start-->
      <OptionalCarGroupBoutique v-if="showGroupCode ==='jp'" @boutiqueDetailBoxCallBack="boutiqueDetailBoxCallBack" />
      <!--精品-end-->

      <!--左侧菜单-start-->
      <div class="left__menu">
        <ul class="tabNav fl">
           <li v-for="vo in showGroups" :class="{active:showGroupCode === vo.code}">
            <a href="javascript:void(0);" @click="changeGroup(vo)">{{vo.pageNameZh}}</a>
          </li>
        </ul>
      </div>
      <!--左侧菜单-end-->
    </div>

    <!--  精品详情弹框 start -->
    <OptionalCarBoutiqueDetail v-if="showBoutiqueDetail" :showBoutiqueDetail='showBoutiqueDetail' @closeBoutiqueDetailBox="showBoutiqueDetail=false" :id="id"></OptionalCarBoutiqueDetail>
    <!--  精品详情弹框 end -->
  </div>
</template>
<style scoped>

</style>
<script>
  import commonApi from '@/common/commonFun.js'
  import Menu from './component/Menu'
  // import CouponPackage from './component/CouponPackage'
  //import SysMessage from './component/SysMessage'
  import {loading} from '@/packages/loading'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'
  import $ from 'jquery'
  import interActiveHandler from '@/common/InterActiveHandler'


  import {mapActions, mapGetters, mapState} from 'vuex'

  //基本的选择样式
  import OptionalCarBaseGroup from './component/OptionalCarBaseGroup.vue'
  //外观的选择样式
  import OptionalCarAppearanceGroup from './component/OptionalCarAppearanceGroup.vue'
  //内饰选择样式
  import OptionalCarPanoGroup from './component/OptionalCarPanoGroup.vue'
  //装备选择样式
  import OptionalCarEquip from './component/OptionalCarEquip'

  //精品组件
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'

  //精品选择样式
  import OptionalCarGroupBoutique from './component/OptionalCarGroupBoutique'
  //精品详情弹框
  import OptionalCarBoutiqueDetail from './component/OptionalCarBoutiqueDetail'

  //车库下单授权等处理
  import saveGarageOrder from '@/component/save-garage-order';
  export default {
    data() {
      return {
        overlay:false,//指引遮罩层
        guideNum:1,//页面指引
        //加载总进度 到100 触发加载中消失
        progress: 0,
        //是否显示敬请期待
        showStayTunedBox: false,
        //车库ID
        garageId: null,
        //要显示的
        showGroupCode: 'wg', //默认显示外观
        //其他附加的
        showGroups: [
          {
            pageNameZh: 'Exterior',
            code: 'wg'
          },
          {
            pageNameZh: 'Accessories',
            code: 'jp'
        }],
        //二级菜单
        childMenus: [],
        showBoutiqueDetail:false, //是否显示精品详情弹框
        mySwiper: null,
        initialSlide:0,//group初始化选中第几个
        famillySwiper: null, //二级菜单
        isFirstIntoGroup: true,
        clickGroupHistory: [], //点击过的队列 用来标识第一次进入
        id:"",    //精品id
      }
    },
    created () {
      this.progress = 20;

    },
    activated() {
        //初始化数据
        this._loadData();
    },
    mounted () {
        this.progress += 20;
    },
    watch: {
      progress: (newData, oldData) =>{
        loading.show({
          progress: newData
        })
        if(newData>=100){
          loading.hide({all: true}) //隐藏加载中
        }
      },
      showGroupCode(n,o){
          if(n=='wg'){
             this.$nextTick(() => {
               this.$refs.childOptionalComponent.initThreeOptional();
        })
          }
      }
    },
    computed: {
      ...mapState({
        selectedFeatures: state => state.vehicle.selectedFeatures,
        preorderSid: state => state.vehicle.configuration.preorderSid,
        type: state => state.vehicle.type,
        mode: state => state.vehicle.mode,
        price: state => state.vehicle.price,
      }),

      ...mapGetters({
        getGroupByCode: 'vehicle/getGroupByCode',
        boutiqueTotalprice: 'boutique/getSaveboutiqueTotalprice'  //获取精品总价
      }),
      //获取总价
      getPrice(){
        return this.price + this.boutiqueTotalprice;
      },
    },
    methods: {
      saveToHomePag(){
        interActiveHandler.goToHomeView();
      },
    _loadData() {
      localStorage.removeItem("vehicleState");
      if(this.$route.params.clearCache === true){
         this.progress = 40;
      }
            if(this.$route.query.garageId != null){
              this.garageId = this.$route.query.garageId
            }else{
              this.garageId = null;
            }
            let params = commonApi.GetRequest() //调用精品需要的参数,后续会补充,是否从车库,或者订单来的参数
            if(!params.type){
              params['type'] = 1;
            }

            if(!params.mode){
              params['mode'] = 0;
            }

            boutiqueVehicleComplex.init({
              params: params,
              on: {
                vehicleSuccess: () =>{
                  this.progress += 30;
                },
                boutiqueSuccess: ()=>{
                  this.progress += 30;
                },
              }
            }).then(()=>{
                //保存车库登录回调
                if(this.$route.query.action== 'saveToGarage'){
                  this.saveToGarage();
                }
            });

      $(".price__hammer").addClass("hammerMove");

    },
      changeNext: function(num){    //指引页面js
          var _self = this;
          if(num){   //跳过
              _self.guideNum = num;
          }
          _self.guideNum = parseInt(_self.guideNum) + 1;
          if(_self.guideNum == 5){
              _self.overlay = false;
              localStorage.setItem('isguide', 1);
          }
      },
      //立即下单
      nextConfigCar() {
        if(this.garageId !=null && this.garageId !=undefined){
           this.$router.push({name: 'configDetails', query:{
            preorderSid: this.preorderSid,
            type: this.type,
            mode: this.mode,
            garageId: this.garageId,
          }})
        }else{
           this.$router.push({name: 'configDetails', query:{
            preorderSid: this.preorderSid,
            type: this.type,
            mode: this.mode,
        }})
        }
      },

      //跳转购物车页面
      goShoppingcart() {
          this.$router.push({name: 'shoppingcart', query:{
              preorderSid: this.preorderSid,
              type: this.type,
              mode: this.mode
          }})
      },
      //点击精品详情弹框
      boutiqueDetailBoxCallBack(id){
         this.id = id;
         this.showBoutiqueDetail = true;
      },
      //去首页
      saveToHomePage () {
          interActiveHandler.goToHomeView();
      },
      //保存车库
      saveToGarage(){
          interActiveHandler.getToken(true).then((token)=>{ //正确用户
              let params = {"token":token}
              if(this.garageId !=null){//有车库ID
                  params['garageId'] = this.garageId;
              }

              params['preorderSid'] = this.preorderSid;
              //用户主动选择项featureCode
              params['selectedFeaturesCode'] = this.$store.getters['vehicle/getSelectedFeaturesCode'];
              //获取保存的精品
              params['saveBoutiqueStr'] = this.$store.getters['boutique/getSaveBoutiqueStr'];

              boutiqueVehicleComplex.saveBoutiqueVehicleToGarage(params).then(rs=>{
                  this.$alert('保存车库成功')
                  this.$router.replace(this.$route.path)
                  this.garageId = rs.data.data; //回传车库ID
              }).catch(e=>{
                this.$alert(e.error)
              })
          }).catch(e => {//token无效
            //回掉保存车库
              if(e.error_code !=undefined && e.error_code==100010){
                        interActiveHandler.goToLoginView({
                          callbackUrl: this.$route.path + '?action=saveToGarage'
                      });
                  }else{
                  }


          });
      },
      //跳转到详情页
      toConfDetails(){

        let mode = this.$store.state.vehicle.configuration.mode;
        if(this.$route.query.mode!=null){
          mode = this.$route.query.mode;
        }

       if(this.$route.query.sid !=null){//有车库ID
          this.$router.push({name:"cardetails",query: {sid:this.$route.query.sid,mode:mode}})
        }else if(this.garageId !=null){

           this.$router.push({name:"cardetails",query: {preorderSid:this.preorderSid,mode:mode,garageId:this.garageId}})
        }else{
          this.$router.push({name:"cardetails",query: {preorderSid:this.preorderSid,mode:mode}})
        }

      },
      menuIsFold:function(){
        let startX, startY, moveEndX, moveEndY, moveX, moveY;
        //pc
        $(".left__menu").mousedown(function(e){
          // e.preventDefault();
          startX = e.pageX,
          startY = e.pageY;
          $(this).mousemove(function(e){
              e.preventDefault();
              moveEndX = e.pageX,
              moveEndY = e.pageY;
              moveX = moveEndX - startX,
              moveY = moveEndY - startY;
              if(moveX > 0){
                $(".menu__wrap").css('left',0);
                $(".menu__pack").css('left','-1.5rem');
              }else{
                $(".menu__wrap").css('left','-5.5rem');
                $(".menu__pack").css('left','0.5rem');
              }
          })
        }).mouseup(function(){
          $(this).off("mousemove")
        })
        //移动
        $(".left__menu").on("touchstart", function(e) {
    // 　　　　e.preventDefault();
    　　　　startX = e.originalEvent.changedTouches[0].pageX || e.targetTouches[0].pageX,
    　　　　startY = e.originalEvent.changedTouches[0].pageY || e.targetTouches[0].pageY;
    　　});
    　　$(".left__menu").on("touchmove", function(e) {
          e.preventDefault();
          moveEndX = e.originalEvent.changedTouches[0].pageX || e.targetTouches[0].pageX,
          moveEndY = e.originalEvent.changedTouches[0].pageY || e.targetTouches[0].pageY;
          moveX = moveEndX - startX,
          moveY = moveEndY - startY;
          if(moveX > 0){
            $(".menu__wrap").css('left',0);
            $(".menu__pack").css('left','-1.5rem');
          }else{
            $(".menu__wrap").css('left','-5.5rem');
            $(".menu__pack").css('left','0.5rem');
          }
    　　});
      },
      changeGroup (group) {
        this.showGroupCode = group.code
      }
    },

    components: {
      Menu,
      OptionalCarBaseGroup,
      OptionalCarAppearanceGroup,
      OptionalCarPanoGroup,
      OptionalCarEquip,
      OptionalCarGroupBoutique,
      OptionalCarBoutiqueDetail
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../../static/style/global.css';
  @import '../../static/style/animate.css';
  /*头部*/
  .optionalCar .price__wrap {
    position: fixed;
    top: 0.5rem;
    left: 0.5rem;
    z-index: 6000;
  }

  .optionalCar .total__price {
    float: left;
    min-width: 3.05rem;
    height: 0.5rem;
    line-height: 0.5rem;
    border: 0.02rem solid #4d4f4f;
    background: rgba(26, 26, 26, 0.8);
    border-radius: 0.25rem;
    overflow: hidden;
    position: relative;
    font-size: 0.26rem;
  }

  .optionalCar .price__shopping {
    float: left;
    width: 1rem;
    height: 100%;
    overflow: hidden;
    background: #01aeff url(../../static/images/shoppingIcon.png) no-repeat center center;
    background-size: 0.32rem auto;
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
    text-indent: -9999px;
  }

  .optionalCar .price {
    float: left;
    min-width: .5rem;
    height: 100%;
    color: #01aeff;
    font-size: 0.30rem;
    margin-right: 0.2rem;
  }

  .optionalCar .price__hammer {
    position: absolute;top: 50%;right: 0.2rem;margin-top: -10px;width: 20px;height:20px;background: url(../../static/images/hammerGif.png) no-repeat;background-size: 220px auto;text-indent: -9999px;
  }

  .optionalCar .price__hammer.hammerMove {
    -webkit-animation: hammerGif 0.6s steps(11) infinite;
    animation: hammerGif 0.6s steps(11) infinite;
  }

  .optionalCar .original__price {
    display: inline-block;
    padding-left: 0.20rem;
    width: 100%;
    height: 100%;
  }

  .optionalCar .price.out .original__price {
    text-decoration: line-through;
    animation: slideOutLeft 0.5s ease-in-out both;
    -webkit-animation: slideOutLeft 0.5s ease-in-out both;
  }

  .optionalCar .price.out .reduced__price {
    animation: slideInLeft 0.5s ease-in-out both 0.5s;
    -webkit-animation: slideInLeft 0.5s ease-in-out both 0.5s;
  }

  .optionalCar .price.in .original__price {
    animation: slideInLeft 0.5s ease-in-out both 0.5s;
    -webkit-animation: slideInLeft 0.5s ease-in-out both 0.5s;
  }

  .optionalCar .price.in .reduced__price {
    text-decoration: line-through;
    animation: slideOutLeft 0.5s ease-in-out both;
    -webkit-animation: slideOutLeft 0.5s ease-in-out both;
  }


  /*锤子动画*/
  @keyframes hammerGif {
    0% {
      background-position: 0;
    }
    100% {
      background-position: -220px;
    }
  }

  @-webkit-keyframes hammerGif {
    0% {
      background-position: 0;
    }
    100% {
      background-position: -220px;
    }
  }

  /* 左侧菜单 */
  .optionalCar .left__menu {
    position: absolute;top: 50%;left: 0.5rem;z-index: 6000;transform: translateY(-50%);-webkit-transform: translateY(-50%);width: 3.0rem;
  }

  /*3d*/
  .disabled {
    display: none;
  }

  .header {
    background: transparent;
  }

  .nowOpenGif {
    width: 0.8rem;
    height: 0.62rem;
    transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
    margin-left: 0.3rem;
    margin-top: 0.15rem;
  }

  .optionalCar #container.show, .optionalCar #pano.show {
    display: block;
  }

  .optionalCar .icon360 {
    position: absolute;
    display: none;
    bottom: 2.30rem;
    left: 50%;
    margin-left: -8.05rem;
    width: 16.11rem;
    height: 3.27rem;
    background: url(../../static/images/icon360.png) no-repeat;
    background-size: 16.11rem auto;
  }
  .total__price .confirmConfig{
    margin-right: 0.15rem;cursor: pointer;
  }
  @keyframes fadeBigSmall {
    0% {
      opacity: 1;
    }
    25% {
      opacity: .7;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: .7;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeBigSmall {
    0% {
      opacity: 1;
    }
    25% {
      opacity: .7;
    }
    50% {
      opacity: 1;
    }
    75% {
      opacity: .7;
    }
    100% {
      opacity: 1;
    }
  }

  .fit__wrap .horizontalScroll, .base__wrap .horizontalScroll, .quality__wrap .horizontalScroll, .out__wrap .horizontalScroll {
    width: calc(100vw - 1.16 * (100 * 100vw / 2436));
    width: -webkit-calc(100vw - 1.16 * (100 * 100vw / 2436));
  }

  .foldMenu .fit__wrap .horizontalScroll {
    width: calc(100vw - 6.15 * (100 * 100vw / 2436));
    width: -webkit-calc(100vw - 6.15 * (100 * 100vw / 2436));
  }

  .foldMenu .base__wrap .horizontalScroll, .foldMenu .quality__wrap .horizontalScroll, .foldMenu .out__wrap .horizontalScroll {
    width: calc(100vw - 5 * (100 * 100vw / 2436));
    width: -webkit-calc(100vw - 5 * (100 * 100vw / 2436));
  }

  /*价格蒙版*/
  .priceTipBox {
    position: fixed;
    top: 1.35rem;
    left: 0.90rem;
    z-index: 7200;
    width: 15.70rem;
  }

  .optionalCar .sales__wrap {
    float: left;
    position: relative;
    margin-left: 0.12rem;
    width: 2.19rem;
    height: 0.91rem;
  }

  @keyframes surprise {
    to {
      background-position: -27.55rem;
    }
  }

  @-webkit-keyframes surprise {
    to {
      background-position: -27.55rem;
    }
  }

  @keyframes open {
    to {
      background-position: -23rem;
    }
  }

  @-webkit-keyframes open {
    to {
      background-position: -23rem;
    }
  }

@media only screen and (min-width: 1300px) {
  .optionalCar .price__hammer {
    margin-top: -15px;width: 30px;height: 30px;background-size: 330px auto;
  }
  /*锤子动画*/
  @keyframes hammerGif {
    0% {
      background-position: 0;
    }
    100% {
      background-position: -330px;
    }
  }

  @-webkit-keyframes hammerGif {
    0% {
      background-position: 0;
    }
    100% {
      background-position: -330px;
    }
  }
}

</style>
