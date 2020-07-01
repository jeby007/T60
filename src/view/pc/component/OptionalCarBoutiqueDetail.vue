<template>
    <div class="boutiqueDetail">
        <div class="overlay"></div>
        <div class="lightBox boutiqueDetailBox" :class="[showBoutiqueDetail?'lightBoxAnimateShow':'lightBoxAnimateHide']">
            <a href="javascript:void(0);" class="closeBox" @click="cloneBox()">关闭弹框</a>
            <h2 class="lightBox__title"><span>{{getBoutiqueDetail.name}}</span></h2>
            <div class="lightBox__cont clearfix">
                <div class="lightBox__cont--left quality__list fl">
                    <!-- <div class="fl swiper-container qualityImgSwiperInit" v-if="getBoutiqueDetail.tigimg.length>1">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="imgitem in getBoutiqueDetail.tigimg">
                                <div class="qualityImg__list">
                                    <img class="imgCenter" :src="imgitem" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="swiper-pagination swiper-pagination--qualityImg"></div>
                    </div> -->
                    <div class="swiper-container">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <div class="qualityImg__list">
                                    <img class="imgCenter" :src="getBoutiqueDetail.tipImage" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="lightBox__cont--right qualityInfo fl">
                    <div class="qualityPrice blueC"><i class="renIcon">￥</i>{{getBoutiqueDetail.price}}</div>
                    <div class="qualityViewBoxCatName">{{getBoutiqueDetail.description}}</div>
                    <div class="feature__btnWrap">
                        <a class="confirmBtn" @click="cloneBox()">{{$t("AddToBag")}}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'

  export default {
    props: ['id','showBoutiqueDetail'],
    computed: {
      //获取精品弹框详情
      getBoutiqueDetail() {
        let fun = this.$store.getters["boutique/getBoutiqueInfoByIds"];
        let details = fun(this.id)
        details.forEach(item=>{
            details = item
        })
        return details
      }
    },
    mounted() {
        var _self = this;
        _self.$nextTick(() => {
            var qualityBoxSwiper = new Swiper ('.qualityImgSwiperInit', {
                observer:true,
                observeParents:true,
                autoplay:{
                    delay: 3000,
                    stopOnLastSlide:true
                },
                pagination: {
                    el:'.swiper-pagination--qualityImg',
                    type:'fraction',
                },
            });
        });

    },
    methods: {
      //关闭弹框
        cloneBox() {
          this.$emit("closeBoutiqueDetailBox", {})
        },
    },
    data() {
      return {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../../static/style/global.css';
.boutiqueDetailBox .qualityImg__list{
    width: 5.87rem;height:3.3rem;position: relative;color: #fff;background: #fff;
}
.boutiqueDetailBox .swiper-container{
    width:100%;height:100%;position: relative;border-radius: 0.1rem;
}
.boutiqueDetailBox .qualityImg__list img{width:5.87rem;height: 3.3rem;}
.boutiqueDetailBox .qualityInfo {width:3.8rem;height: 100%;position: relative;}
.boutiqueDetailBox .qualityPrice {
    font-size: 0.4rem;
}
.boutiqueDetailBox .qualityViewBoxCatName{
    font-size: 0.2rem;margin:0.2rem 0;
}
.boutiqueDetailBox .feature__btnWrap{
    position: absolute;left:0rem;bottom:0.4rem;
}
</style>
