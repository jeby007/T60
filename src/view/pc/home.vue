<template>
  <div class="homeWrap">
    <img class="homeLogo" src="../../static/images/logo.png" alt="">
    <div class="swiperWrap">
      <div class="homeSlide swiper-container">
        <ul class="homeSlide__wrapper swiper-wrapper">
          <li class="swiper-slide">
            <img src="../../static/images/home-swiper/1.jpg" alt="">
          </li>
          <li class="swiper-slide">
            <img src="../../static/images/home-swiper/2.jpg" alt="">
          </li>
          <li class="swiper-slide">
            <img src="../../static/images/home-swiper/3.jpg" alt="">
          </li>
        </ul>
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <ul class="tabControl">
      <li class="productFeatures">
        <div>
          <span class="icon productFeaturesIcon"></span>
          <span>{{$t("SellingPoints")}}</span>
        </div>
      </li>
      <li class="IntelligentCustom" @click="$router.push({name:'optionalcar',query: {accessories: 1}, params: {clearCache: true}})">
        <div >
          <span class="icon IntelligentCustomIcon"></span>
          <span>{{$t("AccessoriesStore")}}</span>
        </div>
      </li>
      <li class="popularity" @click="$router.push({name:'hotrecommend'})">
        <div >
          <span class="icon popularityIcon"></span>
          <span>{{$t("HotOnSale")}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'
  export default {
    name: "home",
    data(){
      return {
      }
    },
    mounted() {
      new Swiper('.swiper-container',{
        autoplay: true,
        loop:true,
        pagination: {
          el: '.swiper-pagination',
          clickable:true,
        },
      })
    },
  }
</script>

<style scoped>
.homeWrap{
  width: 100%;height: 100%;
}
.homeLogo{
  position: fixed;top:0.4rem;left: 0.4rem;width: 0.93rem;height: 0.8rem;z-index: 100;
}
.swiperWrap{
  width: 100%;height: 83.5%;display: flex;flex-direction: column;justify-content: flex-end;align-items: center;
}
.homeSlide{
  width: 100%;height: 100%;
}
.homeSlide__wrapper{
  width: 100%;height: 100%;display: flex;
}
.homeSlide__wrapper>li{
  width:100%;height: 100%;
}
.homeSlide__wrapper>li>img{
  width: 100%;height: auto;
}
.tabControl{
  height: 16.5%;width: 100%;border-top: 4px solid #fff;display: flex;justify-content: space-between;
}
.tabControl>li{
  width: 33.3333%;height: 100%;border-right: 0.04rem solid #fff;display: flex;align-items: center;justify-content: center;color: #fff;
}
.tabControl>li:last-child{border:0;}
.tabControl>li>div{
  display: flex;justify-content: center;align-items: center;cursor: pointer;
}
.tabControl>li>div>.icon{
  width: .5rem;height: .5rem;margin-right: 0.15rem;
}
.productFeatures{
  background: url("../../static/images/productFeatures.jpg") no-repeat;
  -webkit-background-size: 100% auto;
  background-size: 100% auto;position: relative;
}
.productFeatures:before{
  content: "";display: block;width:0;height:0;border-right:0.13rem solid transparent;border-left:0.13rem solid transparent;border-bottom:0.26rem solid #fff;position: absolute;left: 50%;margin-left: -0.13rem;top:-0.26rem;z-index: 100;

}
.IntelligentCustom{
  width: 33.4%;
  background: url("../../static/images/IntelligentCustom.jpg") no-repeat;
  -webkit-background-size: 100% auto;
  background-size: 100% auto;
}
.popularity{
  background: url("../../static/images/popularity.jpg") no-repeat;-webkit-background-size: 100% auto;background-size: 100% auto;
}
.productFeaturesIcon{
  background: url("../../static/images/homeIcon.png") no-repeat;
  background-position: 0 0;
  background-size: 1.5rem auto;
}
.IntelligentCustomIcon{
  background: url("../../static/images/homeIcon.png") no-repeat;
 background-position: -0.5rem 0;
  background-size: 1.5rem auto;
  transform: translateY(10%);
}
.popularityIcon{
  background: url("../../static/images/homeIcon.png") no-repeat;
  background-position: -1rem 0;
  background-size: 1.5rem auto;
}
.slideVid{
  width: 100%;height: 100%;
}
>>>.swiper-pagination-bullet{
  width:0.2rem;height: 0.12rem;border-radius: 0.5rem;
  background: rgba(256,256,256,.5);
  opacity: 1;
}
>>>.swiper-pagination>.swiper-pagination-bullet-active{
  background: #fff;
}
</style>
