<template>
  <div class="storeWrap">
    <Header>
      <div slot="title">
        <p class="title">{{$t('AccessoriesStore')}}</p>
      </div>
    </Header>
    <!-- 3D -->
    <OptionalCarAppearanceGroup
                  v-if = "isAppearance"
                  ref='optionalCarAppearanceGroup'
                  :group="getGroupByCode('wg')"
                  @demoset="demoset"
                  v-on:showBoutique = "showBoutique"
                  >
    </OptionalCarAppearanceGroup>
    <!-- 精品 -->
    <OptionalCarGroupBoutique
                  v-if = "isBoutique"
                  ref='optionalCarGroupBoutique'
                  v-on:showAppearance = "showAppearance"
                  >
    </OptionalCarGroupBoutique>
    <!-- 已选择配件弹窗 -->
    <SelectedAccessories
                  ref = "selectedAccessories"
                  :group="getGroupByCode('wg')"
                  @showOrHide = 'showSelectedAcce'
                  >
    </SelectedAccessories>
    <Footer @showSelectedAcce="showSelectedAcce" :footerConfirmText="footerConfirmText" />
  </div>
</template>

<script>
  /*3D车 外观组件*/
  import OptionalCarAppearanceGroup from './component/OptionalCarAppearanceGroup'
  /*精品选项组件*/
  import OptionalCarGroupBoutique from './component/OptionalCarGroupBoutique'
  /*已选择配件 组件*/
  import SelectedAccessories from './component/SelectedAccessories'
  import commonApi from '@/common/commonFun.js'
  //精品组件
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'

  import { mapActions, mapGetters, mapState } from 'vuex'

  export default {
    name: "accessoriesstore",
    data(){
      return {
        isBoutique: true, //显示精品选项列表
        isAppearance: false, //显示3D车选项列表
        footerConfirmText:'Confirm'
      }
    },
    activated() {
      //初始化外观数据，精品信息
      this._loadData();
    },

    methods: {
      demoset(){
          this.$refs.optionalCarAppearanceGroup.init3DStatus();
      },
      //显示精品
      showBoutique: function() {
          this.isBoutique = true;
          this.isAppearance = false;
      },
      //显示3D
      showAppearance: function() {
          this.isBoutique = false;
          this.isAppearance = true;
      },
      //显示已选择配件
      showSelectedAcce: function() {
          this.$refs.selectedAccessories.showOrHide();
      },
      //初始化数据
      _loadData: function() {
            localStorage.removeItem("vehicleState");
            // boutiqueVehicleComplex.clearData();
            if(this.$route.params.clearCache === true){
               this.progress = 40;
            }

            let params = commonApi.GetRequest()
            if(!params.type) {
              params['type'] = 1;
            }

            if(!params.mode) {
              params['mode'] = 1;
            }
            //初始化数据
            boutiqueVehicleComplex.init({
                params: params,
                on: {
                  vehicleSuccess: ()=> {
                      this.progress += 30;
                  },
                  boutiqueSuccess: ()=> {
                    this.progress += 30;
                  }
              }
            }).then(()=>{
            });
      },


      //保存车库
      saveToGarage: function() {

      }

    },
    computed: {
      ...mapState({
        selectedFeatures: state => state.vehicle.selectedFeatures,
        preorderSid: state => state.vehicle.configuration.preorderSid,
        type: state => state.vehicle.type,
        mode: state => state.vehicle.mode,
        promotionPrice: state => state.vehicle.promotionPrice,
      }),
      ...mapGetters({
        groups: 'vehicle/getGroups',
        getGroupByCode: 'vehicle/getGroupByCode',
      }),
      getPrice() {
        return this.price + this.boutiqueTotalprice;
      }
    },
    components:{
      OptionalCarAppearanceGroup,
      OptionalCarGroupBoutique,
      SelectedAccessories
    }
  }
</script>

<style scoped>
  @import "../../static/style/global_mobile.css";
  .storeWrap{
    width: 100%;height: 100%;
  }
  .addShop{
    width: 100%;height: .91rem;position: fixed;left: 0;bottom: 0;display: flex;z-index:3;
  }
  .addShop>div{
    width: 50%;height: 100%;
  }
  .addShop>.confirmConfiguration{
    background: #01aeff;display: flex;justify-content: center;align-items: center;color: #fff;font:.28rem Arial ;
  }
  .addShop>.shopCarDetail{
    display: flex;align-items: center;position: relative;border-top: 1px solid #c9c9c9;background: #fff;
  }
  .addShop>.shopCarDetail>.shoppingCarIcon{
    width: .48rem;height: .38rem;margin:0 .08rem 0 .6rem;
    background: url("../../static/images/mobile/menuIcon.png") no-repeat center;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -1.02rem -0.67rem;
  }
  .addShop>.shopCarDetail>.toggleBtn{
    position: absolute;right:.62rem ;bottom: .33rem;width: .26rem;height: .15rem;
    background: url("../../static/images/mobile/menuIcon.png") no-repeat center;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -.37rem -.8rem;transition:transform 500ms;
  }
  .addShop>.shopCarDetail>.toggleBtn.active{
    transform:rotate(180deg);
  }
</style>
