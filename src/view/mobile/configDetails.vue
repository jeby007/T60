<template>
  <div class="configDetaulsWrap">
    <Header>
      <div slot="title">
        <p class="title">{{$t('ConfirmConfiguration')}}</p>
      </div>
    </Header>
    <div class="banner"></div>
    <div class="configDetails_tab">
      <div class="tabNav">
        <span v-if="$route.query.mode!=4" :class="{active:!tabFlag}" @click="tabBS">{{$t('BasicSpecification')}}</span>
        <span :class="{active:tabFlag}" @click="tabAcc">{{$t('Accessories')}}</span>
        <span class="configurationList" @click="toConfigurationList">{{$t('ConfigurationList')}}</span>
      </div>
      <div class="tabContent">
        <!--tab选项卡BasicSpecification组件-->
        <ConfigDetailsBS v-if="!tabFlag" :groups = groups></ConfigDetailsBS>
        <!--tab选项卡Accessories组件-->
        <ConfigDetailsAcc v-if="tabFlag"></ConfigDetailsAcc>
      </div>
    </div>
    <SelectedAccessories
      ref = "selectedAccessories"
      :group="getGroupByCode('wg')"
      @showOrHide = 'showSelectedAcce'
    />
    <Footer :footerConfirmText="footerConfirmText" @showSelectedAcce="showSelectedAcce"/>
  </div>
</template>

<script>
  import ConfigDetailsBS from "./component/ConfigDetails_BS";
  import ConfigDetailsAcc from "./component/ConfigDetails_Acc";
  import SelectedAccessories from './component/SelectedAccessories'
  import {mapGetters} from 'vuex'
  import serverApi from '@/common/serverApi'
  import interActiveHandler from "@/common/InterActiveHandler"; //引入用户交互代理
  import ModeDrive from '@/packages/mode-drive';
  import commonApi from '@/common/commonFun.js';//引入公共js
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'

  export default {
    data() {
      return {
        tabFlag:false,   //false:BasicSpecification  true:Accessories
        footerConfirmText:'Confirm Configuration',
        groups:[],
        garageEditable:true
      }
    },
    activated(){
      if(this.$route.query.mode==4){
          this.tabFlag = true
      }
      this.init()
    },
    methods:{
      toConfigurationList(){
          this.$router.push({name:'configurationList'})
      },
      tabAcc(){
        this.tabFlag = true
      },
      tabBS(){
        this.tabFlag = false
      },
      showSelectedAcce: function() {
        this.$refs.selectedAccessories.showOrHide();
      },
      getConfiguration(params = {}) {
        let flag = false;//是否验证token
        if (params.garageId != undefined && params.garageId != null) {
          flag = true;
          this.garageId = params.garageId;
        }
        return interActiveHandler.getToken(flag).then((token) => {
          let modeType = ModeDrive.getModel();
          let newparams = $.extend({}, params, {token: token, modeType: modeType});
          //getConfiguration 这个接口只接受 preorderSid
          newparams['garageId'] = '';
          newparams['preorderSid'] = this.$store.state.vehicle.configuration.preorderSid; //以VUEx的为标准
          return serverApi.get("/Home/Index/getConfiguration.html",newparams ).then(rs => {
            let data = rs.data;
            data.groupList.forEach(g =>{
              g['code'] = g.sid
            })
            this.groups = data.groupList;
            return data;
          })

        })
      },
      init() {
        let params = commonApi.GetRequest() //调用精品需要的参数,后续会补充,是否从车库,或者订单来的参数
        //TODO 需要做验证
        if (!params.type) {
          params['type'] = 1;
          params['mode'] = 1;
        }
        return boutiqueVehicleComplex.init({params: params}).then(() => {
          let preorderSid = this.$store.state.vehicle.configuration.preorderSid;
          return new Promise((resolve) => {
            this.getConfiguration({
              preorderSid: preorderSid,
              type: this.$route.query.type,
              mode: this.$route.query.mode,
              garageId: this.$route.query.garageId,
            }).then(data => {
              let groupList = data.groupList;
              groupList.forEach(g => {
                g['code'] = g.sid
              })
              this.groups = groupList;
              resolve();
            });
          });
        });
      },
    },
    computed:{
      ...mapGetters({
        getGroupByCode: 'vehicle/getGroupByCode',
      })
    },
    components:{ConfigDetailsBS,ConfigDetailsAcc,SelectedAccessories}
  }
</script>

<style scoped>
  @import "../../static/style/global_mobile.css";
  .banner{width: 100%;height: 1.64rem;background: url("../../static/images/mobile/banner.png") no-repeat center;background-size: 100% auto;}
  .configDetails_tab>.tabNav{width: 100%;height: 1.16rem;display: flex;align-items: center;color: #2f3744;font-size: .28rem;padding-left: .3rem;position: relative}
  .configDetails_tab>.tabNav>span{padding-right: .2rem}
  .configDetails_tab>.tabNav>span.active{font-size: .36rem;color: #01aeff}
  .configDetails_tab>.tabNav>.configurationList{font-size: .24rem;color: #01aeff;position: absolute;bottom: 0;right: 0;}
  .configurationList:after{content: '';display: inline-block;width: .26rem;height: .15rem;background: url("../../static/images/mobile/menuIcon.png") no-repeat center;background-size: 4.07rem auto;background-position: -.37rem -.81rem;transform: rotate(-90deg);margin-left: .1rem}
  .tabContent{max-height: calc(100vh - .82rem - 1.64rem - 1.16rem);overflow-y: auto;padding-bottom: .91rem}
</style>
