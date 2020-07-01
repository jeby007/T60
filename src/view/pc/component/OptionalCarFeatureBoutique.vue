<template>
<div class="boutiqueWarp">
    <div class="overlay"></div>
    <div class="lightBox featureBoutiqueBox">
        <a href="javascript:void(0);" class="closeBox" @click="cloneBox()">关闭弹框</a>
        <div class="swiper-container qualityBoxSwiper" :class="{qualityBoxSwiperOne:getFeatureBoutiqueList.length<2}">
            <div class="swiper-wrapper">
                <div class="swiper-slide qualityBoxSlide" v-for="item in getFeatureBoutiqueList">
                    <h2 class="lightBoxTitle"><span>{{item.name}}</span></h2>
                    <div class="quality__list clearfix">
                        <div class="swiper-container qualityImgSwiperInit fl" v-if="item.tigimg.length>1">
                            <div class="swiper-wrapper">
                                <div v-for="imgsrc in item.tigimg" class="swiper-slide">
                                    <img :src="imgsrc" class="imgCenter" alt="">
                                </div>
                            </div>
                            <div  class="swiper-pagination swiper-pagination--qualityImg"></div>
                        </div>
                        <div class="swiper-container fl" v-else>
                            <div class="swiper-wrapper">
                                <div v-for="imgsrc in item.tigimg" class="swiper-slide">
                                    <img :src="imgsrc" class="imgCenter" alt="">
                                </div>
                            </div>
                        </div>
                        <div class="qualityInfo fl">
                            <div class="qualityPrice yellowC">
                                <i class="renIcon">￥</i>{{item.price}}
                            </div>
                            <div class="qualityDetails">{{item.description}}</div>
                            <div v-show="item.valid==false" class="quality__soldOut"></div>
                            <div v-show="item.valid==true" class="products__amountWrap clearfix">
                                <label class="fl">加购：</label>
                                <div class="products__amount fl">
                                    <span class="minusIcon" @click="deleteBoutique(item)"></span>
                                    <input :value="item.savenum" type="number" class="number" disabled="disabled"/>
                                    <span class="plusIcon" @click="addBoutique(item)"></span>
                                </div>
                            </div>
                            <a class="quality__btn" href="javascript:void(0);" @click="cloneBox()">确认</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="swiper-pagination  swiper-pagination--qualityBox"></div>
        </div>
    </div>
</div>

</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'

  export default {
    props: ['featureCode'],
    computed: {
      //获取精品弹框内容
      getFeatureBoutiqueList() {
        let fun = this.$store.getters["boutique/getFeatrueBoutique"];
        let list = fun(this.featureCode)
        return list
      }
    },
    mounted() {
         this.$nextTick(() => {
            if(this.getFeatureBoutiqueList.length>1){
                var qualityBoxSwiper = new Swiper('.qualityBoxSwiper', {
                                observer:true,
                                observeParents:true,
                                centeredSlides:true,
                                slidesPerView:1.5,
                                initialSlide :1,
                                loop:true,
                                autoplayDisableOnInteraction : false,
                                spaceBetween: 60,
                                pagination: {
                                    el: '.swiper-pagination--qualityBox',
                                    clickable :true,
                                },        
                            });
            }
            var qualityImgSwiper = new Swiper('.qualityImgSwiperInit', {
                            observer:true,
                            observeParents:true,
                            autoplayDisableOnInteraction : false,  
                            autoplay : 5000,
                            pagination: {
                                el: '.swiper-pagination--qualityImg',
                                type: 'fraction',
                            },
                        });
        }) 
    },
    methods: {
      //删除精品
      deleteBoutique(boutique) {
        this.$store.dispatch('boutique/deleteBoutique', boutique).then(() => {
        })
      },
      //添加精品
      addBoutique(boutique) {
        this.$store.dispatch('boutique/addBoutique', boutique).then((res) => {

        }).catch(e => {
          this.$alert(e.error)
        })
      },
      //关闭弹框
      cloneBox() {
        this.$emit("closeBoutiqueBox", {})
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
.featureBoutiqueBox{position: fixed;top: 50%;left: 0;width:100vw;height: 8.7rem;margin-top: -4.35rem;margin-left: 0;z-index: 7010;color: #fff;}
.featureBoutiqueBox .lightBoxTitle{
  text-align: center;margin-bottom:0.6rem;height: 0.8rem;line-height: 0.8rem;font-weight: normal;
}
.featureBoutiqueBox .lightBoxTitle span{display: inline-block;vertical-align: middle;color:#fff;font-size: 0.52rem;height: 100%;position: relative;}
.featureBoutiqueBox .lightBoxTitle span:before{
  content:"";position: absolute;top:0.15rem;left: -1.6rem;width:1.25rem;height:0.5rem;background: url(../../../static/images/boxTitleBgL.png) no-repeat;background-size: 1.25rem auto;
}
.featureBoutiqueBox .lightBoxTitle span:after{
  content:"";position: absolute;top:0.15rem;right: -1.6rem;width:1.25rem;height:0.5rem;background: url(../../../static/images/boxTitleBgR.png) no-repeat; background-size: 1.25rem auto;
}
.qualityBoxSwiperOne{
    width:14.4rem;
}
.featureBoutiqueBox .quality__list{
    width:14.4rem;height: 5.8rem;background: rgba(51,51,51,0.8);margin-left: 1.16rem;
}
.quality__list .swiper-container{
    width: 8.5rem;height: 4.8rem;margin:0.5rem 0.5rem 0 -1.16rem;background: #fff;position: relative;
}
.featureBoutiqueBox .qualityBoxSlide{
    height: 8.7rem;
}
.featureBoutiqueBox .qualityImg__list{
    width: 8.5rem;height: 4.8rem;position: relative;color: #fff;
}
.featureBoutiqueBox .imgCenter{width: 8.5rem;height: 4.8rem;}
.featureBoutiqueBox .qualityPrice {
    padding-top:0.5rem;font-size: 0.6rem;
}
.featureBoutiqueBox .qualityDetails {
    width: 6.16rem;margin:0.3rem 0rem 0.1rem 0;font-size: 0.36rem;line-height: 0.5rem;height: 1.5rem;overflow: hidden;
}
.featureBoutiqueBox .quality__btn{
    display: block;font-size: 0.36rem;width: 3.24rem;height: 0.9rem;line-height: 0.9rem;color: #fff;text-align: center;background: #ffa401;border-radius: 0.1rem;
}

.featureBoutiqueBox .quality__soldOut{
    display: block;margin:0.2rem 0 0.4rem 0.7rem;width: 1.82rem;height: 0.7rem;background: url(../../../static/images/soldOut.png) no-repeat;background-size: 1.82rem auto;
}
.featureBoutiqueBox .products__amountWrap{margin:0.2rem 0 0.4rem 0;}
.featureBoutiqueBox .products__amountWrap label{
    font-size: 0.34rem;margin-right: 0.2rem;line-height: 0.7rem;
}
.featureBoutiqueBox .products__amount{line-height: 0.7rem;border:1px solid #666;border-radius: 0.1rem;}
.featureBoutiqueBox .minusIcon,.featureBoutiqueBox .plusIcon{float: left;width: 0.7rem;height: 0.7rem;}
.featureBoutiqueBox .minusIcon{background: url(../../../static/images/minusIcon2.png) no-repeat center;background-size: 0.6rem auto;}
.featureBoutiqueBox .plusIcon{background: url(../../../static/images/plusIcon2.png) no-repeat center;background-size: 0.6rem auto;}
.featureBoutiqueBox .number{float: left;width: 0.9rem;height: 0.7rem;line-height: 0.7rem;border-left: 1px solid #666;border-right: 1px solid #666;color:#ffa401;font-size: 0.3rem;background: transparent;text-align: center;}
.quality__list .swiper-container>>>.swiper-container-horizontal>.swiper-pagination-bullets, .swiper-pagination-custom, .swiper-pagination-fraction{
    bottom: 0.15rem;right: 0.2rem;left: auto;color: #333;text-align: right;font-size: 0.3rem;
}
.featureBoutiqueBox >>>.swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets{bottom: 0;}
.featureBoutiqueBox >>>.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet{
    width: 0.2rem;height: 0.2rem;background: #fff;opacity: 0.5;margin:0 0.08rem;
}
.featureBoutiqueBox >>>.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet.swiper-pagination-bullet-active{background: #ffa401;}
  
</style>
