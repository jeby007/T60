<template>
  <div class="addShop">
    <div class="shopCarDetail" @click="showSelectedAcc">
      <div class="shoppingCarIcon"></div>
      <p class="renIcon">￥{{$commonFun.formatPrice(getPrice)}}</p>
      <div class="toggleBtn" :class="{active: isSelectedAcc}"></div>
    </div>
    <div class="confirmConfiguration" @click="toNextRouter">
      {{footerConfirmText}}
    </div>
  </div>
</template>

<script>
  import {mapState,mapGetters} from 'vuex'
  export default {
    props:['footerConfirmText'],
    data() {
      return {
        isSelectedAcc: false, //是否显示已选配件列表
      }
    },
    methods:{
      showSelectedAcc(){
        this.isSelectedAcc = !this.isSelectedAcc
        this.$emit('showSelectedAcce')
      },
      toNextRouter(){
        if (this.footerConfirmText == 'Confirm'){
          this.$router.push({name:'configDetails',query: { dropDownMenuTab:true, tabToogle: false,mode:this.$route.query.mode,}})
        }else if (this.footerConfirmText == 'Confirm Configuration'){
          this.$router.push({name:'downloadlist',query: { dropDownMenuTab:true, tabToogle: false,mode:this.$route.query.mode}})
        }
      }
    },
    computed:{
      ...mapState({
        price: state => state.vehicle.price,
      }),
      ...mapGetters({
        boutiqueTotalprice: 'boutique/getSaveboutiqueTotalprice'  //获取精品总价
      }),
      getPrice(){
        return this.price + this.boutiqueTotalprice;
      }
    },
  }
</script>

<style scoped>
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
    background: url("../../../static/images/mobile/menuIcon.png") no-repeat center;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -1.02rem -0.67rem;
  }
  .addShop>.shopCarDetail>.toggleBtn{
    position: absolute;right:.62rem ;bottom: .33rem;width: .26rem;height: .15rem;
    background: url("../../../static/images/mobile/menuIcon.png") no-repeat center;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -.37rem -.8rem;transition:transform 500ms;
  }
  .addShop>.shopCarDetail>.toggleBtn.active{
    transform:rotate(180deg);
  }
</style>
