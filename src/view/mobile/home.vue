<template>
  <div class="home_wrap">
    <div class="home_logo"></div>
    <div class="home_bg swiper-container">
      <ul class="swiper-wrapper">
        <li class="swiper-slide">
          <img src="../../static/images/mobile/home_swiper/6/A1.jpg" alt="">
        </li>
        <li class="swiper-slide">
          <img src="../../static/images/mobile/home_swiper/6/A2.jpg" alt="">
        </li>
        <li class="swiper-slide">
          <img src="../../static/images/mobile/home_swiper/6/A3.jpg" alt="">
        </li>
      </ul>
      <div class="swiper-pagination"></div>
    </div>
    <div class="home_btn">
      <div class="storeBtn" @click="$router.push({name:'optionalcar',query: {accessories: 1}, params: {clearCache: true}})">
        {{$t('AccessoriesStore')}}
      </div>
      <div class="hotBtn" @click="$router.push({name:'hotrecommend'})">
        {{$t('HotOnSale')}}
      </div>
    </div>
  </div>
</template>

<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'
  export default {
    name: "home",
    mounted() {
      let homeS=new Swiper('.home_bg',{
        autoplay:true,
        loop:true,
        pagination: {
          el: '.swiper-pagination',
        }
      })
    }
  }
</script>

<style scoped>
 @import "../../static/style/global_mobile.css";
  .home_wrap{
    width: 100%;height: 100%;
  }
  .home_logo{
    width: .79rem;height: .66rem;position: fixed;top:.3rem;left: .3rem;z-index: 2;
    background: url("../../static/images/mobile/home_logo.png") no-repeat;
    -webkit-background-size: .79rem auto;
    background-size: .79rem auto;
  }
  .home_bg{
    width: 100%;height: 100%;
  }
  .home_bg>ul{
   display: flex;
  }
  .home_bg>ul>li{
   width: 100%;height: 100%;
  }
  .home_bg>ul>li>img{
   width: 100%;height: 100%;
  }
  .home_btn{
    width: 100%;height: .62rem;padding: 0 .6rem;position: fixed;bottom: 1.5rem;left: 0;z-index: 2;display: flex;
  }
  .home_btn>.storeBtn,.hotBtn{
    width: 2.7rem;height: .62rem;border-radius: .08rem;display: flex;justify-content: center;align-items: center;
    background: #01aeff;font-size: .26rem;font-weight: bold;font-family: Arial,serif;color: #fff;
  }
  .home_btn>.storeBtn:first-child{
    margin-right: .94rem;
  }
  >>>.swiper-pagination{
    bottom: 2.5rem;
  }
  >>>.swiper-pagination-bullet{
   background: rgba(255,255,255,.5);
  }
  >>>.swiper-pagination-bullet-active{
    background:#01aeff
  }


</style>
