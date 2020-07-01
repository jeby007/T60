<template>
  <div>
    <div class="overlay"></div>
    <div class="changeColor" :class="[isShowChangeColor?'lightBoxAnimateShow':'lightBoxAnimateHide']">
      <div class="closeBtn" @click="closeChangeColor"></div>
      <p class="changeColor_title">{{$t('Color')}}</p>
      <div class="carPic">
        <img src="../../../static/images/mobile/carVs.jpg" alt="">
      </div>
      <p class="featureName">宝石蓝</p>
      <ul class="featureList">
        <li class="active"></li>
        <li></li>
      </ul>
      <div class="confirmBtn">{{$t('Confirm')}}</div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    props:['isShowChangeColor','family'],
    data() {
      return {
        featureList:''
      }
    },
    mounted(){
      //this.featureList = this.getShowFeaturesByFamily(this.family)
    },
    methods:{
      closeChangeColor(){
        this.$emit('close',false)
      }
    },
    computed:{
      ...mapGetters({getShowFeaturesByFamily: 'vehicle/getShowFeaturesByFamily'})
    }
  }
</script>

<style scoped>
  .overlay{display: flex;align-items: center;justify-content: center}
  .changeColor{width: 6.22rem;height: 9.13rem;background: #fff;border-radius: .1rem;position: fixed;display: flex;flex-direction: column;align-items: center;top: 0;right: 0;left: 0;bottom: 0;margin: auto;z-index: 7001}
  .changeColor>.closeBtn{width: .3rem;height: .3rem;background: url("../../../static/images/mobile/menuIcon.png") no-repeat center;background-size: 4.07rem auto;background-position: -1.37rem -1.89rem;position: absolute;top: .27rem;right: .25rem}
  .changeColor>.changeColor_title{font-size: .36rem;color: #2f3744;font-family: PingFangSC-Medium, sans-serif;margin-top: .3rem}
  .changeColor>.carPic{width: 5.34rem;height: 3rem;margin: 1rem 0 .3rem;}
  .carPic>img{width: auto;height: 100%}
  .changeColor>.featureName{font-size: .3rem;color: #2f3744;font-family: PingFangSC-Medium, sans-serif;}
  .changeColor>.featureList{display: -webkit-box;max-width: 95%;height: 1.1rem;align-items: center;margin-top: .5rem;overflow-x: auto;padding: 0 .2rem}
  .featureList>li{width: .86rem;height: .86rem;border-radius: 50%;margin-right: .48rem;background: #4a75e4;-moz-box-shadow:0px 2px 6px #D4D4D4; -webkit-box-shadow:0px 2px 6px #D4D4D4; box-shadow:0px 2px 6px #D4D4D4;}
  .featureList>li.active{border: .1rem solid #dfdfdf;box-shadow: none;box-sizing: content-box;}
  .featureList>li:last-child{margin-right: 0}
  .confirmBtn{width: 2.4rem;height: .6rem;background: #01aeff;color: #fff;font-size: .26rem;text-align: center;line-height: .6rem;border-radius: .08rem;margin-top: .5rem}
</style>
