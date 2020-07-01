<template>
  <div class="quality__wrap ">
    <!-- span class="quality__num">共找到12件精品配件</span -->
    <div class="quality__inner ">
      <div class="swiper-container">
        <!--   <span class="quality__tag">热销</span> -->
        <div class="quality__lump swiper-wrapper">
          <div class="quality__item swiper-slide" v-for="(item,index) in boutiqueList" :key="index">
            <div class="quality__img-wrap">
              <img :src="item.tipImage" alt="" class="quality__img" @click="showBoutiqueDetailBox(item.id)">
              <!-- <span class="hotSellIcon">热销</span>
              <span class="popularityIcon">人气</span> -->
            </div>
            <div class="quality__cont">
              <p class="quality__title">{{item.name}}</p>
              <!-- <p class="quality__category">{{item.catName}}</p> -->
              <div class="quality__price-wrap clearfix">
                <span class="quality__price fl">
                  <i class="renIcon">￥</i>{{item.price}}
                </span>
              </div>
              <span v-show="item.valid==false" class="quality__soldOut"></span>
              <div @click="addBoutique(item)" v-if="!item.savenum" class="addToCart">{{$t('addToCart')}}<i class="addcartIcon"></i></div>
              <div v-show="item.savenum">
                <div v-show="item.valid==true" class="products__amount clearfix">
                  <span class="minusIcon" @click="deleteBoutique(item)"></span>
                  <input :value="item.savenum" type="number" class="number" disabled="disabled"/>
                  <span class="plusIcon" @click="addBoutique(item)"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="quality__item swiper-slide virtualHide" v-if="virtualData" v-for="vo in virtualData"></div>
        </div>
      </div>
       <div v-if="boutiqueList.length == 0" class="noData">{{$t('NoAccessories')}}</div>
    </div>
  </div>
</template>

<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'
  import { mapActions,mapGetters,mapState } from 'vuex'
  export default {
    data(){
      return {
        tocartshow:false,
        virtualData:[]
      }
    },
    created(){
      //算出需要虚拟填充的swiperSlide数量
      const num = this.boutiqueList.length - 1
      const virtual = num % 5
      for (let i = 0; i <virtual ; i++) {
        this.virtualData.push(1)
      }
    },
    mounted(){
      this.$nextTick(() => {
        this.initSwiper()
      });
    },
    methods: {
      initSwiper(){
        new Swiper('.swiper-container',{
          freeMode : true,
          slidesPerView: 'auto',
          slidesPerGroup:5,
          slidesPerColumn:2,
          slidesPerColumnFill:'row',
          observer: true,
          observeParents: true,
          preventClicksPropagation:true,
        })
      },
        //删除精品
       deleteBoutique(boutique){
        this.$store.dispatch('boutique/deleteBoutique',boutique).then(()=>{})
       },
       //添加精品
       addBoutique(boutique){

         this.$store.dispatch('boutique/addBoutique',boutique).then((res)=>{

         }).catch(e=>{
            if(e.error_code=='1001'){
              //groupNu重复
              this.$alert(e.error[0].name+"将会被替换掉")
            }else{
              this.$alert(e.error)
            }
         })
       },
       //点赞评论
      featureCommentTagClick (featureCode) {
        this.$router.push({name: 'featurecomment',query: {featureCode: featureCode}})
        //TODO 路由跳转
      },
      //点击显示精品详情弹框
      showBoutiqueDetailBox(id){
        this.$emit("boutiqueDetailBoxCallBack",id)
        // this.$parent.boutiqueDetailBoxCallBack(id);
      },
      Tocartshow(){
        this.tocartshow = !this.tocartshow
      },
    },
    computed:{
      ...mapState({
        boutiqueList: state => state.boutique.allBoutiqueList
      }),
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*.active {color: red}*/
.quality__wrap {display: block;height: 7.4rem;width: 16.0rem;position: absolute;left: 2.6rem;top: 50%;margin-top:-3.7rem;}
.quality__wrap.show {display: block;}
.quality__wrap .quality__num {display: block;margin-bottom: 0.30rem;color: #fff;font-size: 0.32rem;}
.quality__wrap .quality__inner {height: 7.40rem;padding-bottom: 0.24rem;position: relative;display: flex;box-sizing: border-box;width: 100%}
.quality__lump {}
.quality__wrap .quality__item {
  position: relative;display: inline-block; margin: 0 0.10rem;width: 3.0rem;height: 3.50rem;background: rgba(74,90,115,0.7);border-radius: 0.10rem;overflow: hidden;vertical-align: middle;
}
.quality__wrap .quality__img-wrap {
  width: 100%;height: 1.7rem;background-color: #fff;display: flex;align-items: center;justify-content: center;position: relative;
}
.quality__wrap .quality__img {display: block;width: 100%;height: 100%;}
.quality__wrap .hotSellIcon{
  position: absolute;top:0.15rem;left: 0;width: 1.14rem;height: 0.54rem;background: url(../../../static/images/hotsale.png) no-repeat;background-size: 1.14rem auto;text-indent: -9999px;display: none;
}
.quality__wrap .popularityIcon{
  position: absolute;top:0.15rem;left: 0;width: 1.14rem;height: 0.54rem;background: url(../../../static/images/popularity.png) no-repeat;background-size: 1.14rem auto;text-indent: -9999px;display: none;
}
.quality__wrap .quality__cont {
  width: 100%;padding: 0.20rem 0.07rem;color: #fff;
}
.quality__wrap .quality__title {
  padding:0 0.08rem;margin-bottom: 0.10rem;font-size: 0.20rem;white-space: normal;line-height: 1.2em;
}
.quality__wrap .quality__category {
  margin-bottom: 0.35rem;font-size: 0.38rem;
}
.quality__wrap .quality__price-wrap {
  padding-bottom: 0.15rem;margin-bottom: 0.15rem;background: url(../../../static/images/line5.png) no-repeat center bottom;background-size: 2.85rem auto;
}
.quality__wrap .quality__price {
  padding:0 0.08rem;font-size: 0.20rem;font-weight: bold;color: #01aeff;
}
.optionalCar .quality__wrap .products__amount {
position: absolute;left: 0.5rem;bottom: 0.15rem;width: 2.0rem;margin: 0 auto;height: 0.5rem;line-height: 0.5rem;border: 1px solid #66748f;background: none;border-radius: 0.10rem;overflow: hidden;
}
.optionalCar .quality__wrap .number {
  float: left;width: 50%;height: 100%;border-left: 1px solid #66748f;border-right: 1px solid #66748f;color: #fff;text-align: center;font-size: 0.20rem;background: transparent;padding-left: 0.15rem;
}
.optionalCar .quality__wrap .minusIcon {
  float: left;width: 25%;height: 100%;background: url(../../../static/images/minusIcon.png) no-repeat center;background-size: 0.14rem auto;
}
.optionalCar .quality__wrap .plusIcon {
  float: right;width: 25%;height: 100%;background: url(../../../static/images/plusIcon.png) no-repeat center;background-size: 0.14rem auto;
}
.virtualHide{opacity: 0}
.addToCart{position: absolute;left: 0.5rem;bottom: 0.15rem;width: 2.0rem;margin: 0 auto;height: 0.5rem;line-height: 0.5rem;font-size: 0.2rem;text-align: center;display:flex;justify-content: center;align-items: center;cursor: pointer;}
.addToCart .addcartIcon{display:inline-block;background: url(../../../static/images/addcartIcon.png) no-repeat center center;width:0.27rem;height:0.22rem;margin-left: 0.1rem;background-size:0.27rem; height:0.22rem;}
  .swiper-container{width: 100%;height: 100%}
</style>
