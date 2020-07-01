<template>
  <div class="boutiqueDetailWrap">
    <div class="overlay"></div>
    <div :class="['showBoutiqueDetail'?'lightBoxAnimateShow':'lightBoxAnimateHide']" class="boutiqueDetail">
      <div class="topPicWrap">
        <p>{{getBoutiqueDetail.name}}</p>
        <div class="picWrap">
          <img :src="getBoutiqueDetail.detailsImage" alt="">
        </div>
      </div>
      <div class="bottomDetail">
        <p class="renIcon">￥{{$commonFun.formatPrice(getBoutiqueDetail.price)}}</p>
        <p class="productName">{{getBoutiqueDetail.description}}</p>
        <div class="products__amount clearfix">
          <span class="minusIcon" @click="reduce"></span>
          <input type="number" class="number" disabled="disabled" :value="getBoutiqueDetail.savenum"/>
          <span class="plusIcon" @click="add()"></span>
        </div>
        <div class="confirmBtn" @click="close">{{$t('Confirm')}}</div>
      </div>
      <div class="closeBtn" @click="close"></div>
    </div>
  </div>
</template>

<script>
  export default {
    props:['showBoutiqueDetail','item'],
    data() {
      return {
      }
    },
    methods:{
      reduce(){
        this.$emit('deleteBoutique',this.item)
      },
      add(){
        this.$emit('addBoutique',this.item)
      },
      close(){
        this.$emit('closeBoutiqueDetail',false)
      }
    },
    computed:{
      //获取精品弹窗详情
      getBoutiqueDetail(){
        let fun = this.$store.getters["boutique/getBoutiqueInfoByIds"];
        let details = fun(this.item.id)
        details.forEach(item=>{
          details = item
        })
        return details
      }
    }
  }
</script>

<style scoped>
  @import '../../../static/style/global_mobile.css';
  .boutiqueDetail{width: 82%;height: 68%;background: #fff;position: fixed;top: 0;left: 0;right: 0;bottom: 0;margin: auto;z-index: 7001;border-radius: .1rem}
  .boutiqueDetail>div{width: 100%;height: 50%}
  .boutiqueDetail>.topPicWrap{display: flex;flex-direction: column;align-items: center;}
  .topPicWrap>p{margin-top: .4rem;color: #2f3744;font-size: .36rem}
  .topPicWrap>.picWrap{width:100% ;height: 78%;display: flex;align-items: center;justify-content: center}
  .topPicWrap>.picWrap>img{width: 3.5rem;height: auto}
  .boutiqueDetail>.bottomDetail{background: #46546c;display: flex;flex-direction: column;align-items: center}
  .products__amount {margin-top: .38rem;width: 1.8rem;height: 0.45rem;line-height: 0.45rem;border: 1px solid #66748f;background: none;border-radius: 0.08rem;overflow: hidden;box-sizing: border-box;}
  .number {float: left;height: 100%;text-align: center;background: transparent;border-left: 1px solid #66748f;border-right: 1px solid #66748f;-webkit-appearance: none;border-radius: 0;width: 45%;border-left: 1px solid #66748f;border-right: 1px solid #66748f;color: #afb9cb;font-size: 0.22rem;opacity: 1;}
  .minusIcon {float: left;width: 0.48rem;height: 100%;background: url(../../../static/images/minusIcon.png) no-repeat center;background-size: 0.2rem auto;}
  .plusIcon {float: right;width: 0.48rem;height: 100%;background: url(../../../static/images/plusIcon.png) no-repeat center;background-size: 0.2rem auto;}
  .renIcon{margin-top: .42rem;font-size: .28rem}
  .productName{margin-top: .38rem;font-size: .28rem;color: #fff;max-width: 80%;height: 1.2rem}
  .confirmBtn{width: 2.41rem;height: .6rem;margin-top: .48rem;background: #01aeff;text-align: center;line-height: .6rem;font-size: .26rem;color: #fff;border-radius: .1rem}
  .boutiqueDetail>.closeBtn{width: .3rem;height: .3rem;background: url("../../../static/images/mobile/menuIcon.png") no-repeat center;background-size: 4.07rem auto;background-position: -1.37rem -1.89rem;position: absolute;top: .27rem;right: .25rem}
</style>
