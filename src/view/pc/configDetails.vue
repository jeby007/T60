<template>
  <div class="container configDetails">
    <div class="header clearfix">
      <div class="header__right">
        <a class="header__btn header__home" @click="goHomePage()">首页</a>
      </div>
      <div class="header__title" @click="goback()">{{$t('ConfirmConfiguration')}}</div>
    </div>
    <div class="middleBlockPublic">
      <div class="configDetails__cont clearfix">
        <ul class="tabNav fl">
          <li v-for="vo in groups" :class="{active:showGroupCode === vo.code}">
            <a href="javascript:void(0);" @click="changeGroup(vo)">{{vo.groupNameZh}}</a>
          </li>
          <li v-for="vo in otherGroups" :class="{active:showGroupCode === vo.code}">
            <a href="javascript:void(0);" @click="changeGroup(vo)">{{vo.groupNameZh}}</a>
          </li>
        </ul>
        <div class="tabList fl">
          <div class="tabListWrap">
            <vue-scroll :ops="ops">
              <ul class="featureLists">
                <!--循环开始-->
                <li class="clearfix"  v-for="family in getShowFamilysByGroupCode(showGroupCode)" v-if="showOtherGroups === false" @click.stop="showUpdateFeatures(family)">
                  <div class="tableCell">
                    <span class="familyName ellipsis">{{$commonFun.familyName(family)}}</span>
                  </div>
                  <div class="tableCell">
                    <!--循环开始-->
                    <div class="featureWrap" v-for="feature in family.featureList">
                      <div class="fearureInfo">
                        <!-- <img class="featureImg" :src="items.app_2d" alt="" /> -->
                        <span class="featureName ellipsis">{{$commonFun.featureName(feature) }}</span>
                        <!-- 排放是否可编辑给editIcon元素添加判断v-if="list.editable && editHiddenShow" -->
                        <a href="javascript:void(0);" class="editIcon" v-if="family.editable === true && garageEditable"   @click="showUpdateFeatures(family)"></a>
                        <span class="featurePrice fr"  >￥{{$commonFun.formatPrice(feature.price)}} </span>
                      </div>
                    </div>
                    <!--循环结束-->
                  </div>
                  <span class="timeLimitIcon">限时</span>
                </li>
                <!--循环结束-->

                <!--精品列表 start-->
                <ConfigDetailsBoutique v-if="showGroupCode=='jp'" @boutiqueDetailBoxCallBack="boutiqueDetailBoxCallBack" :garageEditable='garageEditable'></ConfigDetailsBoutique>
                <!-- 精品列表 end -->
                <!--  精品详情弹框 start -->
                <OptionalCarBoutiqueDetail v-if="showBoutiqueDetail" :showBoutiqueDetail='showBoutiqueDetail' @closeBoutiqueDetailBox="showBoutiqueDetail=false" :id="id"></OptionalCarBoutiqueDetail>
                <!--  精品详情弹框 end -->
              </ul>
            </vue-scroll>
          </div>
        </div>
        <!--右侧下单部分 start-->
        <ConfigDetailsOrder
          ref="configDetailsOrder"
          :showCarSize='showCarSize'
          :getPrice='getPrice'
          :getOriginPrice='getOriginPrice'
          :price = 'price'
          :carLength='carLength'
          :carHeight='carHeight'
          :isShowHotTips='isShowHotTips'
          @saveToOrder='saveToOrder'
          >
        </ConfigDetailsOrder>
        <!-- 右侧下单部分 end -->

      </div>
    </div>
  </div>
</template>

<script>
  //import Swiper from 'swiper';
  import {mapActions, mapGetters, mapState} from 'vuex'
  import Menu from './component/Menu.vue';
  import commonApi from '@/common/commonFun.js';//引入公共js
  import interActiveHandler from "@/common/InterActiveHandler"; //引入用户交互代理
  import serverApi from '@/common/serverApi'
  //精品组件
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'
  //车库下单授权等处理

  //右侧下单部分
  import ConfigDetailsOrder from './component/ConfigDetailsOrder'

  //精品列表
  import ConfigDetailsBoutique from './component/ConfigDetailsBoutique'
  //精品详情弹框
  import OptionalCarBoutiqueDetail from './component/OptionalCarBoutiqueDetail'

  import ModeDrive from '@/packages/mode-drive';
  import saveGarageOrder from '@/component/save-garage-order';

  import api from "@/common/api/api.js";

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
        groups: [],
        garageId:'',
        garageEditable:true,//是否可以编辑,从车库过来的都不可以编辑
        //其他附加的
        otherGroups: [{
          groupNameZh: 'Accessories',
          code: 'jp'
        }],
        showDiscountBox:false,
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
        showBoutiqueDetail:false,   //精品详情弹框隐藏
        id:'',  //精品id
		    carLength:'4825',//4825
        carHeight:'1778',//1778
        showCarSize:true,   //显示车图尺寸
        isShowHotTips:0,   //是否弹过爆款弹框
        openHotTips:false,   //爆款提示弹框
      }
    },
    watch: {
      showGroupCode(){
         let group = this.groups.find(group => {
            return group.code === this.showGroupCode
         });


         if(group == null){
           this.showOtherGroups = true;
         }else{
           this.showOtherGroups = false;
         }
		    console.info("groupCode",group,this.showOtherGroups)
      }
    },
    created () {

    },
    activated () {
          this.init();
           this.garageEditable = true;
          if(this.$route.query.garageSaveToOrder!=undefined){
            this.garageEditable = false;//从车库过来的不可以编辑
          }
    },
    methods: {
	  //获取车的长宽高
      getCarConf(configSort){
          var configSorts = configSort;
          var lengthWidthHeight = '';
          for(var i=0;i<configSorts.length;i++){
              var configSortList = configSorts[i];

              var conSortListFamily = configSortList['familyList'];
              if(conSortListFamily){
                for(var j=0;j<conSortListFamily.length;j++){
                    if(conSortListFamily[j]['nameZh']){
                        if(conSortListFamily[j]['nameZh'].indexOf('长/宽/高(mm)')!=-1){
                            var conSortListFeature = conSortListFamily[j]['featureList'];
                            for(var ji=0;ji<conSortListFeature.length;ji++){
                                var lengthWidthHeight = conSortListFeature[ji]['nameZh'];
                                if(lengthWidthHeight){
                                    var LWH = lengthWidthHeight.split("×");
                                    this.carHeight = LWH[2];
                                    this.carLength = LWH[0];
                  				  console.log('carHeight:',this.carHeight);
                  				  console.log('carLength:',this.carLength);
                                }

                            }
                        }
                    }

                }
              }
          }

      },
      getConfiguration (params  = {}) {
          //this.groups = [];

          let flag = false;//是否验证token
          if(params.garageId !=undefined  && params.garageId !=null){
            flag = true;
            this.garageId = params.garageId;
          }
          //alert(this.garageEditable)
          return interActiveHandler.getToken(flag).then((token)=>{
            let modeType = ModeDrive.getModel();
            let newparams = $.extend({}, params, {token:token,modeType:modeType});
             return serverApi.get("/Home/Index/getConfiguration.html",newparams ).then(rs => {
                let data = rs.data;

                /*if(this.isShowHotTips==0 && rs.data.promotionPrice<0){  //第一次并且是爆款
                    this.openHotTips = true;//爆款提示显示
                    console.log('爆款：',this.openHotTips);
                    this.isShowHotTips = 1;
                }
                this.$store.commit('vehicle/setPrice',
{price: rs.data.price,promotionPrice:rs.data.promotionPrice})//改变价格,优惠价*/


                //看看是否爆款
                this.$refs.configDetailsOrder.getConfiguration(data.promotionPrice);
                return data;
            })

          })


      },
      /**
       * 初始化数据
       *  params => preorderSid
       *         => mode
       *         => type
       *
       */
      init () {


            let params = commonApi.GetRequest() //调用精品需要的参数,后续会补充,是否从车库,或者订单来的参数
            //TODO 需要做验证
            if(!params.type){
              params['type'] = 1;
              params['mode'] = 1;
            }
            boutiqueVehicleComplex.init(params).then(()=>{

                this.getConfiguration({
                  preorderSid: this.$route.query.preorderSid,
                  type: this.$route.query.type,
                  mode: this.$route.query.mode,
                  garageId: this.$route.query.garageId,
                }).then(data => {
                  // let groupList = commonApi.objToArray(data.groupList);
                  data.groupList.forEach(g => {
                    g['code'] = g.sid
                  })
                  this.groups = data.groupList;
                  this.showGroupCode = this.groups[0].code;
                  this.getCarConf(data.groupList);	//获取车的长高
                });

                //保存车库登录回调
                if(this.$route.query.action== 'saveToGarage'){
                  this.saveToGarage();
                }

            });
      },
      //保存车库
      saveToGarage(){

           interActiveHandler.getToken(true).then((token)=>{ //正确用户
              let params = {"token":token}
              if(this.garageId !=null){//有车库ID
                  params['garageId'] = this.garageId;
              }
              params['preorderSid'] = this.$route.query.preorderSid;
              //用户主动选择项featureCode
              params['selectedFeaturesCode'] = this.$store.getters['vehicle/getSelectedFeaturesCode'];
              //获取保存的精品
              params['saveBoutiqueStr'] = this.$store.getters['boutique/getSaveBoutiqueStr'];
               //用户主动选择项featureCode



              boutiqueVehicleComplex.saveBoutiqueVehicleToGarage(params).then(rs=>{
                  this.$alert('保存车库成功')
                  //this.$router.replace(this.$route.path)
                  this.garageId = rs.data.data; //回传车库ID
              }).catch(e=>{
                this.$alert(e.error)
              })
          }).catch(e=>{//token无效
                //回掉保存车库
                  if(e.error_code !=undefined && e.error_code==100010){
                        interActiveHandler.goToLoginView({
                            callbackUrl: this.$route.path + '?action=saveToGarage'
                        });
                  }else{
                  }

          });



      },
      //保存订单
      saveToOrder(){

            let params = {};
              if(this.garageId !=null){//有车库ID
                  params['garageId'] = this.garageId;
              }
              params['preorderSid'] = this.$route.query.preorderSid;
               //用户主动选择项featureCode
              params['selectedFeaturesCode'] = this.$store.getters['vehicle/getSelectedFeaturesCode'];
              //获取保存的精品
              params['saveBoutiqueStr'] = this.$store.getters['boutique/getSaveBoutiqueStr'];
               //用户主动选择项featureCode

            boutiqueVehicleComplex.saveBoutiqueVehicleToOrder(params).then(rs=>{
                   let modeType = ModeDrive.getModel();
                  if(modeType=='app'){
                        var orderId = rs.data.orderId;
                        var target_url = rs.data.url;
                        api.ssoOrderUrl({target_url:target_url,token: token}).then(function(ssores){
                               //alert(ssores.data)
                                var goOrderUrl = ssores.data + "&_t=" + Number(new Date()) ;
                                //_self.hasPost='no' ;//关闭后可以重新下单
                                interActiveHandler.goToOrderView(goOrderUrl).then((orderId)=>{
                                  //interActiveHandler.closeH5View().then(p => {});
                                   _self.$router.go(-1);//返回上一页
                                    //下单成功后,当前页面
                                });
                      });

                  }else{
                     location.href = rs.data.url;
                  }
              }).catch(e=>{
                this.$alert(e.error)
              })
      },
      //跳转到确认配置页面
      toConfDetails(){

        let mode = this.$store.state.vehicle.configuration.mode;
        if(this.$route.query.mode!=null){
          mode = this.$route.query.mode;
        }
       if(this.$route.query.sid !=null){//有车库ID
          this.$router.push({name:"cardetails",query: {sid:this.$route.query.sid,mode:mode}})
        }else{
           this.$router.push({name:"cardetails",query: {preorderSid:this.$route.query.preorderSid,mode:mode}})
        }

      },
      goback () {
        this.$router.go(-1)
      },
      getShowFamilysByGroupCode (groupCode) {
        if(groupCode != ''){
          let group =  this.groups.find(vo => {
              return vo.code == groupCode;
          });
          if(group != null){
            /*group.familyList.forEach(vo => {
                if(vo.editable === true){
                    let feature = this.getFeatureByFeatureCode(vo.featureList[0].code);
                    //console.info(feature,vo.featureList[0].code)
                    let _array = [];
                    _array.push(feature)
                    vo.featureList = _array
                }
            })*/
            return group.familyList;
          }
        }
      },
      //显示变更
      showUpdateFeatures(family) {
        if (!family.editable || !this.garageEditable){
          return false;
        }
        //var fea=family.featureList[0]
        //添加检测代码
        //pilot("track","event","D60Config","click",family.code+"_"+fea.code+"_"+fea.price,"10");
          this.$showFeatureDialog.show({family: this.getFamilyByFamilyCode(family.code),haveChange: true}).then(info => {
            //有改变
            if(info.isChange === true){
              if(this.$route.query.garageId){ //如果是车库来的 不能重新加载数据
                  let feature = this.getFeatureByFeatureCode(info.featureCode)
                  //回显当前数据
                  family.featureList = [{
                    nameZh: feature.nameZh,
                    price: feature.price,
                    code: feature.code
                  }]
                  //看看是否爆款
                  this.getConfiguration({
                    preorderSid: this.$route.query.preorderSid,
                    type: this.$route.query.type,
                    mode: this.$route.query.mode,
                    garageId: this.$route.query.garageId,
                  })
              }else{
                this.init();
              }

              /* */
            }
        })
      },
      goHomePage: function() {
        interActiveHandler.goToHomeView();
      },
      changeGroup (group) {
        this.showGroupCode = group.code
      },
      jumpStockRecommend: function(){
            var _self = this;
            _self.$router.push({name:'stockrecommend',query: {preorderSid:this.$route.query.preorderSid}});

            //G50智能选配_所有模式_确认配置_查看现车
            //  pilot('track','form',{
            //     frmid: "FF10142",
            //     sid: "",
            //     total_price: _self.totalPrice.replace(/[^0-9]/g,''),
            //     te_quip: _self.getAllSelectedFeatures(),
            // });
      },
      //点击精品详情弹框
      boutiqueDetailBoxCallBack(id){
         this.id = id;
         this.showBoutiqueDetail = true;
      },
    },
    computed: {
      ...mapState({
          price: state => state.vehicle.price,
          promotionPrice: state => state.vehicle.promotionPrice,
      }),
      ...mapGetters({
          getFamilyByFamilyCode: 'vehicle/getFamilyByFamilyCode',
          getFeatureByFeatureCode: 'vehicle/getFeatureByFeatureCode',
          boutiqueTotalprice: 'boutique/getSaveboutiqueTotalprice',  //获取精品总价
          boutiqueList: 'boutique/getSaveboutique'
      }),
      //获取总价:原价+优惠价+精品总价
      getPrice(){
          return this.price+this.promotionPrice+this.boutiqueTotalprice;
      },
	  //获取原价:原价+精品总价
      getOriginPrice(){
          return this.price+this.boutiqueTotalprice;
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
    position: absolute;left: 0;top:0;right:0;bottom:0;height: 6.5rem;width: 16.6rem;color: #fff;margin: auto;
  }
  .configDetails__cont .tabNav {width: 2.1rem;}
  /* .configDetails__cont .tabNav {width: 2.5rem;}
  .configDetails__cont .tabNav li {
    display: block;
    height: 0.8rem;
    line-height: 0.8rem;margin:0.2rem 0;
    font-size: 0.32rem;color:#999;
    padding-left: 0.7rem;
    position: relative;transition:all 0.3s;-webkit-transition:all 0.3s;
  }
  .configDetails__cont .tabNav li a {
    color:#999;
  }
  .configDetails__cont .tabNav li.active{
    background: url(../../static/images/navBg.png) no-repeat;
    background-size:2.5rem auto;padding-left: 0.26rem;
  }
  .configDetails__cont .tabNav li.active a{
    color:#eb9906;
  } */

  .configDetails__cont .tabList {
    width: 10.26rem;
    height: 5.5rem;
    /* background: rgba(51, 51, 51, 0.8); */
    background: rgba(74,90,115,0.4);
    padding: 0.5rem 0.4rem;
    border-radius: 0.1rem;
    margin-right: 0.2rem;
  }
  .configDetails__cont .tabListWrap{
      height: 100%;overflow-x: hidden;
    }
  .configDetails__cont .featureLists > li {
    display: block;
    font-size: 0.24rem;
    width: 100%;
    position: relative;
    background: rgba(256, 256, 256, 0.1);
  }
  .configDetails__cont .featureLists > li .familyName {background: rgba(104,182,255,0.1)}
  .configDetails__cont .tabList .timeLimitIcon{
    position: absolute;top:50%;margin-top:-0.275rem;width: 0.83rem;height: 0.43rem;left: 2.3rem;background: url(../../static/images/timeLimit.png) no-repeat;background-size: 0.83rem auto;text-indent: -9999px;display: none;
  }

  .configDetails__cont .tabList .tableCell {
    display: table-cell;
  }

  .configDetails__cont .tabList .tableCell:first-child {
    /* border-right: 0.08rem solid rgba(51,51,51,0.8); */
  }

  .configDetails__cont .tabList .familyName {
    display: inline-block;
    vertical-align: top;
    width: 2.8rem;
    padding: 0.05rem 0 0.05rem 0.54rem;
    line-height: 0.44rem;
  }

  .configDetails__cont .tabList .featureWrap {
    display: inline-block;
    vertical-align: top;
    width: 6.6rem;
    padding: 0.05rem 0.15rem 0.05rem 0.3rem;
    line-height: 0.44rem;
  }

  .configDetails__cont .tabList .featureImg {
    display: inline-block;
    vertical-align: middle;
    width: 0.78rem;
    height: 0.44rem;
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
    margin: 0 0.2rem;color:#01aeff;
    font-family: "微软雅黑",serif;
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

  .configDetails__cont .carIntro {
    width: 5.16rem;
    height: 7.45rem;
    padding: 0.26rem 0 0.2rem;
    border-radius: 0.1rem;
    position: relative;
    background: rgba(74,90,115,0.4);
  }

  .configDetails__cont .carIntro .carImg {
    width: 4.12rem;
    height: 2rem;
    margin: 0 auto;
    position: relative;
  }
  .configDetails__cont .carIntro .carImgBgL{
    position: absolute;top:50%;margin-top:-0.62rem;left: 0;width:0.29rem;height: 1.24rem;background: url(../../static/images/carBgL.png) no-repeat;background-size: 0.29rem auto;
  }
  .configDetails__cont .carIntro .carImgBgL span{
      position: absolute;top:0.3rem;left:50%;margin-left: -0.2rem;width:0.54rem;height: 0.4rem;font-size: 0.2rem;color: #999;text-align: center;line-height: 1em;transform:rotate(-90deg);-webkit-transform:rotate(-90deg);
  }
  .configDetails__cont .carIntro .carImgBgB{
      position: absolute;bottom:0;left:50%;margin-left: -1.735rem;width:3.47rem;height:0.29rem;background: url(../../static/images/carBgB.png) no-repeat;background-size:3.47rem auto;
  }
  .configDetails__cont .carIntro .carImgBgB span{
      position: absolute;top:0;left:1.2rem;width:1.1rem;height: 0.3rem;line-height: 0.3rem;font-size: 0.2rem;color: #999;text-align: center;
  }

  .configDetails__cont .carIntro .carImg img {
    position: absolute;
    top: 0;
    left: 0.5rem;
    bottom: 0.4rem;
    right: 0;
    margin: auto;
    max-width: 3.8rem;
    max-height: 1.2rem;
  }

  .configDetails__cont .carIntro .carStockTips {
    position: absolute;
    top: -0.68rem;
    right: -0.8rem;
    width: 3.25rem;
    height: 1.07rem;
    background: url(../../static/images/recommendBg.png) no-repeat left top;
    background-size: 3.25rem auto;
    font-size: 0.18rem;
    color: #97dbe7;
    line-height: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.3rem;
  }

  .configDetails__cont .carIntro .carStockTips span {
    display: inline-block;
    margin-top: -0.12rem;
    font-size: 0.36rem;
  }

  .configDetails__cont .carIntro .carStockTips i {
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 0.1rem solid transparent;
    border-bottom: 0.1rem solid transparent;
    border-left: 0.1rem solid #97dbe7;
    margin-left: 0.1rem;

  }

  .configDetails__cont .carIntro .carName {
    padding: 0.5rem 0.5rem 0.3rem;
    font-size: 0.48rem;
    color: #e9edf3;
    font-family: "黑体";
  }

  .configDetails__cont .carIntro .carDiscounts {
    width: 5.03rem;
    height: 0.83rem;
    line-height: 0.83rem;
    margin: 0 auto;
    background: url(../../static/images/discountsBg.png) no-repeat;
    background-size: 5.03rem auto;
    padding: 0 0.5rem;
    font-size: 0.26rem;
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
    display: flex;flex-direction:column;justify-content:center;
    padding: 0.15rem 0.2rem;
    margin-bottom: 0.30rem;
    height: 1.95rem;
    background: url(../../static/images/priceBg.png) no-repeat left center;
    background-size: 5.12rem auto;
  }

  .tip__txt-wrap {
    width: 4.62rem;line-height: 1em;color: #ffa401;padding:0.1rem 0.4rem 0.1rem 0.15rem;background:rgba(256,256,256,0.1) url(../../static/images/arrow4.png) no-repeat 4.28rem center;
    background-size: 0.18rem auto;margin-top: 0.12rem;font-size: 0.26rem;
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
    width: 4.2rem;
    height: 0.8rem;
    line-height: 0.8rem;
    text-align: center;
    font-size: 0.36rem;
    background:#ffa401;
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

  /*优惠包弹框*/
  .discountPackBox {
    height: 7.7rem;
    width: 100%;
  }

  .discountPackBox .closeBox {
    top: 0.3rem;
    right: 2.75rem;
  }

  .discountPackBox .discountPack__tab {
    display: block;
    text-align: center;
  }

  .discountPackBox .discountPack__tab a {
    display: inline-block;
    width: 3.6rem;
    height: 0.92rem;
    line-height: 0.92rem;
    color: #fff;
    font-size: 0.42rem;
    border: 1px solid #fff;
    margin: 0 0.2rem;
  }

  .discountPackBox .discountPack__tab a.active {
    background: #606c7a;
    border: 0;
  }

  .discountPackBox .discountPack__tabList {
    width: calc(100vw - 2.98 * (100 * 100vw / 2436));
    width: -webkit-calc(100vw - 2.98 * (100 * 100vw / 2436));
    margin: 0.7rem 0 0 2.98rem;
    text-align: center;
  }

  .discountPackBox .discountPack__list {
    display: inline-block;
    width: 5.81rem;
    height: 5.96rem;
    /*background: url(../../static/images/discountPackBg.png) no-repeat;*/
    background-size: 5.81rem auto;
    color: #fff;
    padding: 0.25rem 0.32rem;
    position: relative;
    margin-right: 0.7rem;
  }

  .discountPackBox .discountPack__list ul {
    display: block;
    height: 3.6rem;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .discountPackBox .discountPack__list li {
    display: block;
    padding: 0.1rem 0;
    font-size: 0.36rem;
    white-space: normal;
    line-height: 1.3em;
    text-align: left;
  }

  .discountPackBox .readyToUseBtn {
    position: absolute;
    bottom: 0.5rem;
    left: 50%;
    margin-left: -1.945rem;
    font-size: 0.36rem;
    width: 3.69rem;
    height: 0.86rem;
    background: #fff;
    color: #e05543;
    border-radius: 0.5rem;
    text-align: center;
    line-height: 0.86rem;
  }

  .discountPackBox .readyToUseBtn__disabled {
    background: #b5b5b5;
    color: #fff;
  }

  .discountPackBox .readyToUseBtn__used {
    background: transparent;
    border: 1px solid rgba(256, 256, 256, 0.6);
    color: #fff;
  }

  .discountPackBox .discountPack__tabList--disabled .discountPack__list {
    /*background: url(../../static/images/discountPackBg2.png) no-repeat;*/
    background-size: 5.81rem auto;
  }


  /*适配6,7,8P*/
  @media only screen and (min-width: 736px) and (max-width: 811px) {
    .configDetails__cont{width:16.9rem;margin-left: -8.45rem;}
    .configDetails__cont .tabNav {
      width: 2.5rem;overflow: hidden;
    }

    .configDetails__cont .tabList {
      width: 9rem;
    }

    .configDetails__cont .featureLists > li {
      width: 8rem;
    }

    .configDetails__cont .tabList .familyName {
      padding-left: 0.1rem;width: 1.8rem;
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

  /* @media only screen and (min-width: 900px) and (max-width: 1278px) {
    .configDetails__cont {height: 11rem;margin-top:-5.5rem;}
    .configDetails__cont .tabList {
      width: 12.5rem;
      height: 11rem;
    }

    .configDetails__cont .carIntro, .configDetails__cont .tabNav {
      height: 11rem;
    }
  } */
</style>
