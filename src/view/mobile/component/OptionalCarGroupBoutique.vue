<!-- 精品选项列表 -->
<template>
  <div class="tabWrap">
    <div class="tabMenu">
      <p class="exteriorColor" v-if="$route.query.mode!=4" @click="showAppearance();" :class="{active: false}">{{$t('ExteriorColor')}}</p>
      <p class="accessories" :class="{active: true}">{{$t('Accessories')}}</p>
    </div>
    <div class="tabContent">
      <!-- 精品信息 -->
      <div class="storeListWrap">
        <ul class="storeList">
          <li v-for="(item,index) in boutiqueList" :key="index">
            <div class="leftImg" @click="showBoutiqueDetailBox(item)">
              <img :src="item.tipImage" alt="">
            </div>
            <div class="rightContent">
              <p class="accessoriesTitle">{{item.name}}</p>
              <p class="renIcon">￥{{item.price}}</p>
              <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div class="products__amount clearfix" v-show="item.savenum > 0">
                  <span class="minusIcon" @click="deleteBoutique(item)"></span>
                  <input :value="item.savenum" type="number" class="number" disabled="disabled"/>
                  <span class="plusIcon" @click="addBoutique(item)"></span>
                </div>
              </transition>
              <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
              >
                <div class="addToBag" @click="addBoutique(item)" v-show="item.savenum === 0" :key="index">{{$t('AddToBag')}}</div>
              </transition>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <BoutiqueDetailPopup
      :showBoutiqueDetail = "showBoutiqueDetail"
      @closeBoutiqueDetail = 'closeBoutiqueDetail'
      :item="item"
      v-if="showBoutiqueDetail"
      @addBoutique="addBoutique"
      @deleteBoutique="deleteBoutique"
    >
    </BoutiqueDetailPopup>
  </div>
  <!-- 缺少暂无数据 -->
</template>
<script>
  import {mapActions, mapGetters, mapState} from 'vuex'
  import BoutiqueDetailPopup from "./BoutiqueDetailPopup";
  export default {
    name: "carGroupBoutique",
    data() {
      return {
        showBoutiqueDetail:false,
        item:null
      };
    },
        computed: {
      ...mapState({
        type: state => state.vehicle.type,
        mode: state => state.vehicle.mode,
      }),
    },
    methods: {
      //关闭精品弹窗
      closeBoutiqueDetail(res){
        this.showBoutiqueDetail = res
      },
      //精品详情
      showBoutiqueDetailBox(item) {
        this.showBoutiqueDetail = true
        this.item = item
      },
      //显示3D车
      showAppearance: function () {
        this.$emit("showAppearance");
        this.$emit('demoset');
      },
      //精品 +1
      addBoutique: function (boutique) {
        this.$store.dispatch('boutique/addBoutique', boutique).then((res) => {

        }).catch(e => {
          if(e.error_code=='1001'){
                //groupNu重复
                this.$alert(e.error[0].name+"将会被替换掉")
              }else{
                this.$alert(e.error)
              }
        });
      },
      //精品 -1
      deleteBoutique: function (boutique) {
        this.$store.dispatch('boutique/deleteBoutique', boutique).then(() => {
        });
      }
    },
    computed: {
      //精品信息
      ...mapState({
        boutiqueList: state => state.boutique.allBoutiqueList
      }),
    },
    components:{BoutiqueDetailPopup}
  }
</script>

<style scoped>
  .rightContent>>>.animated{
    -webkit-animation-duration:300ms;
    animation-duration:300ms;
    -webkit-animation-fill-mode:both;
    animation-fill-mode:both;
  }
  .tabWrap > .tabMenu {display: flex;padding-top: .5rem;align-items: center;}

  .tabWrap > .tabMenu > p {margin-left: .3rem;font: .28rem Arial;}

  .tabWrap > .tabMenu > p.active {font: .36rem Arial;color: #01aeff;}

  .tabWrap > .tabContent > .storeListWrap {overflow: auto;max-height: 10.7rem;padding-bottom: .91rem;}

  @media screen and (min-height: 700px) {
    .tabWrap > .tabContent > .storeListWrap {overflow: auto;max-height: 13.6rem;}
  }

  .storeList {display: flex;flex-direction: column;align-items: center;margin-top: .52rem;min-height: 100%;}

  .storeList > li {margin-bottom: .24rem;padding-left: .34rem;display: flex;background: #fff;-moz-box-shadow: 0 0 .12rem #C4C4C4;-webkit-box-shadow: 0 0 .12rem #C4C4C4;box-shadow: 0 0 .12rem #C4C4C4;width: 7rem;height: 2.72rem;border-radius: .1rem;}

  .storeList > li > .leftImg {width: 2.72rem;height: 100%;display: flex;align-items: center;}

  .storeList > li > .leftImg > img {width: 100%;display: block;max-height: 100%}

  .storeList > li > .rightContent {width: 3.94rem;height: 100%;padding: .3rem .3rem .3rem .8rem;position: relative;}

  .storeList > li > .rightContent > .accessoriesTitle {font-size: .28rem;color: #4d5563;font-family: "PingFang SC Regular", serif;}

  .products__amount {width: 1.8rem;height: 0.45rem;line-height: 0.45rem;border: 1px solid #66748f;background: none;border-radius: 0.08rem;overflow: hidden;position: absolute;bottom: .3rem;left: 0.8rem;box-sizing: border-box;}

  .number {float: left;height: 100%;text-align: center;background: transparent;border-left: 1px solid #66748f;border-right: 1px solid #66748f;-webkit-appearance: none;border-radius: 0;width: 45%;border-left: 1px solid #66748f;border-right: 1px solid #66748f;color: #afb9cb;font-size: 0.22rem;opacity: 1;}

  .minusIcon {float: left;width: 0.48rem;height: 100%;background: url(../../../static/images/minusIcon.png) no-repeat center;background-size: 0.2rem auto;}

  .plusIcon {float: right;width: 0.48rem;height: 100%;background: url(../../../static/images/plusIcon.png) no-repeat center;background-size: 0.2rem auto;}
  .addToBag{width: 2.11rem;height: .56rem;line-height: .56rem;background: #01aeff;font-size: .26rem;color: #fff;text-align: center;border-radius: .08rem;position: absolute;bottom: .3rem;left: .8rem}
</style>
