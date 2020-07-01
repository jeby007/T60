<!-- 已选配件组件 -->
<template>
  <div class="dropDownMenuWrap" >
    <div class="mask" @click="showOrHide" v-if = "isShow"></div>
    <transition
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <div class="dropDownMenu" v-if="isShow">
        <div class="dropDownMenuHeader_bg">
          <div class="dropDownMenuTab_title">
            <p @click="showExterior"    :class="{active: isExterior}">{{$t('ExteriorColor')}}</p>
            <p @click="showAccessories" :class="{active: isAccessories}">{{$t('Accessories')}}</p>
          </div>
          <!-- 外观列表 -->
          <div class="dropDownMenuTab_content clearfix">
            <div class="exteriorListWrap" v-if="isExterior">
              <ul class="exteriorList">
                <li v-for="feature in features">
                  <p>{{$t('ExteriorColor')}}</p>
                  <p>{{$commonFun.featureName(feature) }}</p>
                </li>
              </ul>
              <div v-if="features.length === 0" class="noDataSc">{{$t('NoUserSelect')}}</div>
            </div>
            <!-- 配件商品列表 -->
            <div class="AccessoriesWrap" v-if="isAccessories">
              <ul class="storeList removeMargin">
                <li v-for="bouq in boutiques" v-if="bouq.savenum > 0">
                    <div class="leftImg">
                        <img :src="bouq.tipImage" alt="">
                    </div>
                    <div class="rightContent">
                        <p class="accessoriesTitle">{{bouq.name}}</p>
                        <p class="renIcon">From ￥{{bouq.price}}</p>
                        <p class="total">数量:{{bouq.savenum}}</p>
                    </div>
                </li>
              </ul>
              <div v-if="boutiques.length === 0" class="noDataSc">{{$t('NoUserSelect')}}</div>
            </div>
          </div>
        </div>
        <div class="closeBtn" @click="showOrHide"></div>
      </div>
    </transition>
    </div>
</template>
<script >
  import {mapGetters, mapState} from 'vuex'
  //精品组件
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'
  //引入公共js
  import commonApi from '@/common/commonFun.js';

	export default {
		data() {
			return {
	        isExterior: true, //是否显示外观Tab
	        isAccessories: false,  //是否显示配件商品列表	，
          isShow: false,
          features: [],
          boutiques: []
			}
		},

		methods: {
			//显示隐藏
			showOrHide : function() {
        this.isShow = !this.isShow;
          if (this.isShow) {
            this.features = this.getSelectedFeatureByGroupCode(this.group.code);
            this.boutiques = this.boutiqueList;
          }
			},
			//显示外观Tab
			showExterior: function() {
				this.isExterior = true;
				this.isAccessories = false;
			},
			//显示配件商品列表
			showAccessories: function() {
				this.isExterior = false;
				this.isAccessories = true;
			},
      //获取已外观选择feature
      getSelectedFeatureByGroupCode(groupCode) {
          return this.selectedFeatures.filter(vo => {
            return vo.groupCode == groupCode;
         });
      }
		},
    computed: {
      ...mapState({
          selectedFeatures: state => state.vehicle.selectedFeatures
      }),
      ...mapGetters({
          boutiqueList: 'boutique/getSaveboutique'
      })
    },
		props: ['group']
	}

</script>

<style scoped>
@import "../../../static/style/global_mobile.css";
  .dropDownMenuWrap>>>.animated{
    -webkit-animation-duration:300ms;
    animation-duration:300ms;
    -webkit-animation-fill-mode:both;
    animation-fill-mode:both;
  }

  .dropDownMenuWrap{
    width: 100%;position: fixed;top:0;left: 0;
  }
  .dropDownMenuWrap .dropDownMenu{
    width: 100%;max-height: 9.9rem;position: fixed;bottom: .91rem;left: 0;z-index: 2 ;background: #fff;
  }
  .dropDownMenuWrap>.mask{
    width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index: 1;
    background: rgba(0,0,0,.7);
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg{
    width: 100%;height: 2.68rem;
    background: url("../../../static/images/mobile/dropDownMenu_bg.png") no-repeat;
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg>.dropDownMenuTab_title{
    display: flex;align-items: center;color: #034a6b;font: .28rem Arial;padding-top: .55rem;
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg>.dropDownMenuTab_title>p{
    margin-left: .34rem;
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg>.dropDownMenuTab_title>p.active{
    font-size: .36rem;color: #fff;
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg .exteriorListWrap{
    float:left;width: 100%;max-height: 8.51rem;margin-top: .52rem;min-height: 2.5rem;position: relative;
    background: #f5f6f6;overflow: auto;
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg .exteriorList{
    display: flex;flex-direction: column;
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg .exteriorList>li{
    width: 100%;height: 1.16rem;display: flex;align-items:center;justify-content: space-between;font: .28rem Arial;padding: 0 .64rem;color: #4d5563;position: relative;
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg .exteriorList>li>p:last-child{
    color: #32bcfd;
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg .exteriorList>li:after{
    width: 90%;height: 1px;content: '';position: absolute;left: 5%;bottom: 0;
    background: -webkit-linear-gradient(left,rgba(255, 255, 255, 0),#a1adc3,rgba(255,255,255,0));
    background: linear-gradient(to right, rgba(255, 255, 255, 0),#a1adc3,rgba(255,255,255,0));
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg .AccessoriesWrap{
    float:left;margin-top:.52rem;width: 100%;max-height: 8.51rem;min-height:2.5rem;background: transparent;overflow:auto
  }
  .dropDownMenuWrap .dropDownMenu>.dropDownMenuHeader_bg .removeMargin{
    margin-top: 0;
  }
  .dropDownMenuWrap>.dropDownMenu>.dropDownMenuHeader_bg .removeMargin .total{
    font-size:.22rem;color: #afb9cb;position: absolute;left: .8rem;bottom: .42rem;
  }
  .dropDownMenuWrap .dropDownMenu>.closeBtn{
    width: .3rem;height: .3rem;position:absolute;right: .35rem;top: .28rem;
    background: url("../../../static/images/mobile/menuIcon.png") no-repeat;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -1.75rem -0.24rem;
  }
	.storeList{
    display: flex;flex-direction: column;align-items: center;margin-top: .52rem;
  }
  .storeList>li{
    margin-bottom: .24rem;padding-left:.34rem;display: flex;background: #fff;
    -moz-box-shadow:0 0 .12rem #C4C4C4; -webkit-box-shadow:0 0 .12rem #C4C4C4; box-shadow:0 0 .12rem #C4C4C4;width: 7rem;height: 2.72rem;border-radius: .1rem;
  }
  .storeList>li>.leftImg{
    width: 2.72rem;height: 100%;display: flex;align-items: center;justify-content: center;
  }
  .storeList>li>.leftImg>img{
    width: 100%;display: block;max-height: 100%;
  }
  .storeList>li>.rightContent{
    width: 3.94rem;height: 100%;padding: .3rem .3rem .3rem .8rem;position: relative;
  }
  .storeList>li>.rightContent>.accessoriesTitle{
    font-size: .28rem;color: #4d5563;font-family:"PingFang SC Regular",serif;
  }
  .noDataSc{color:#01aeff;display: flex;align-items: center;justify-content: center;height: 2.5rem;font-size: .32rem;background: #fff}

</style>
