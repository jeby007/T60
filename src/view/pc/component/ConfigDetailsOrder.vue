<template>
    <div class="optionalCarOder fr">
        <div class="carIntro">
            <div class="carImg">
                <div v-show="showCarSize" class="carImgBgL"><span>{{carHeight}}</br>mm</span></div>
                <div v-show="showCarSize" class="carImgBgB"><span>{{carLength}}mm</span></div>
                <img src="../../../static/images/car.png" alt=""/>
            </div>
            <div class="carParam">
                <span class="carParam__left"></span>
                <span class="carParam__right"></span>
            </div>
            <div class="carName">
                <img src="../../../static/images/addcart_name.png" alt="">
            </div>

            <div class="carTotal">
                <!--  <div class="tip__txt-wrap" @click="showDiscountBox=true">综合优惠：￥30000</div> -->
                <div class="totalPrice">{{$t('Price')}}</div>
                <div class="modifyPrice clearfix">
                    <div class="discountsPrice fl"><i class="renIcon">￥</i>{{$commonFun.formatPrice(getPrice)}}</div>
                    <div class="originalPrice fr lineT" v-show="promotionPrice<0 && price>0">
                        <i class="renIcon">￥</i>{{$commonFun.formatPrice(getOriginPrice)}}
                    </div>
                </div>
            </div>
            <a href="javascript:void(0);" class="orderBtn" @click="$router.push({name:'configurationList'})">
                <!-- <span class="hotPriceIcon" v-show="promotionPrice<0 && price>0"></span> -->
                {{$t('ConfigurationList')}}
            </a>
            <div class="GoConfigDetail" @click="saveToOrder" >{{$t('SendEmail')}}</div>

            <Alertbox @closeAlertBox='closeAlertBox' :visible='Alertboxshow'></Alertbox>
        </div>
        <!--了解更多产品 start-->
        <div class="lightBox codeBox" v-show="Learnmore">
            <a href="javascript:void(0);" class="closeBox" @click="Learnmore=false">关闭弹框</a>
            <div class="code__con">
                <img src="@/static/images/moreCodeImg.png" alt=""/>
            </div>
        </div>
    </div>

</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import serverApi from '@/common/serverApi'
import Alertbox from './Alertbox'
export default {
    props: ['getPrice','getOriginPrice','price','carHeight','carLength','showCarSize'],
    data () {
        return {
            openNoHotTips:false,//弹出取消爆款提示框,从爆款变成非爆款
            Learnmore:false,  //了解更多产品弹窗
            promotionPrice: 0,
            openHotTips: false,
            Alertboxshow:false
        }
    },
    watch: {
        openNoHotTips (o) {
            if(o === true){
                setTimeout(()=>{
                    this.openNoHotTips = false;
                },5000)
            }
        }
    },
    methods: {
        saveToOrder(){
            // this.$emit("saveToOrder", {})
            this.Alertboxshow = true;
        },
        getConfiguration (promotionPrice) {
            let _self = this;
            if(_self.promotionPrice==0){
                if(promotionPrice <0){
                    this.openHotTips = true;
                }
            }

            if(_self.promotionPrice < 0){
                if(promotionPrice == 0){
                    this.openNoHotTips = true;
                }
            }
            _self.promotionPrice = promotionPrice;
        },
        closeHotTips(){
            this.openHotTips = false;
        },
        closeAlertBox(res){
            this.Alertboxshow = res
        }
    },
     components: {
        Alertbox
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../../static/style/global.css';
.configDetails__cont .carIntro {
    width: 3.86rem;height: 5.45rem;padding: 0.26rem 0 0.2rem;border-radius: 0.1rem;background: rgba(74,90,115,0.4);
    position: relative;
}
.configDetails__cont .carIntro .carImg {
width: 3.12rem;height: 1.65rem;margin: 0 auto;position: relative;
}
.configDetails__cont .carIntro .carImgBgL{
position: absolute;top:40%;margin-top:-0.62rem;left: -5%;width:0.29rem;height: 1.24rem;background: url(../../../static/images/carBgL.png) no-repeat;background-size: 0.29rem auto;
}
.configDetails__cont .carIntro .carImgBgL span{
  position: absolute;top:0.36rem;left:50%;margin-left: -0.2rem;width:0.6rem;height: 0.4rem;font-size: 0.2rem;color: #999;text-align: center;line-height: 1em;transform:rotate(-90deg);-webkit-transform:rotate(-90deg);
}
.configDetails__cont .carIntro .carImgBgB{
  position: absolute;bottom:0;left:60%;margin-left: -1.735rem;width:3rem;height:0.29rem;background: url(../../../static/images/carBgB.png) no-repeat;background-size:3.47rem auto;
}
.configDetails__cont .carIntro .carImgBgB span{
  position: absolute;top:0;left:1.2rem;width:1.1rem;height: 0.3rem;line-height: 0.3rem;font-size: 0.2rem;color: #999;text-align: center;
}
.configDetails__cont .carIntro .carImg img {
position: absolute;top: 15%;left: 0.3rem;bottom: 0.4rem;right: 0;margin: auto;max-width: 2.6rem;max-height: 1rem;
}
.configDetails__cont .carIntro .carName {
font-size: 0.36rem;color: #e9edf3;font-family: "黑体",serif;width:65%;margin: auto;display: flex;justify-content: center;align-items: center;height:1rem;
}
.configDetails__cont .carIntro .carName img{
    max-width: 100%;
}
.configDetails__cont .carIntro .carDiscounts {
width: 5.03rem;height: 0.83rem;line-height: 0.83rem;margin: 0 auto;background: url(../../../static/images/discountsBg.png) no-repeat;
background-size: 5.03rem auto;padding: 0 0.5rem;font-size: 0.26rem;
}
.configDetails__cont .carTotal {
display: flex;flex-direction:column;justify-content:center;
padding: 0.15rem 0.2rem;margin-bottom: 0.15rem;height: 1.15rem;background: url(../../../static/images/priceBg.png) no-repeat left center;
background-size: 5.12rem auto;
}
.tip__txt-wrap {
width: 4.62rem;line-height: 1em;color: #ffa401;padding:0.1rem 0.4rem 0.1rem 0.15rem;background:rgba(256,256,256,0.1) url(../../../static/images/arrow4.png) no-repeat 4.28rem center;
background-size: 0.18rem auto;margin-top: 0.12rem;font-size: 0.26rem;
}
.modifyPrice {
line-height: 0.6rem;
}
.configDetails__cont .totalPrice, .configDetails__cont .discountsPrice {
display: inline-block;vertical-align: middle;font-family: "微软雅黑";
}
.configDetails__cont .totalPrice {
width: 1.8rem;font-size: 0.22rem;line-height: 1.2em;display: block;color: #999;
}
.configDetails__cont .totalPrice .lineT {color: #9fa4b2;}
.configDetails__cont .discountsPrice {font-size: 0.3rem;color: #fff;}
.configDetails__cont .originalPrice {font-size: 0.28rem;color: #b8bfcb;}
.configDetails__cont .discountsPrice.dis {color: #d3b5ff;}
.configDetails__cont .orderBtn{
display: block;width: 3rem;height: 0.5rem;line-height: 0.5rem;text-align: center;font-size: 0.22rem;background:#01aeff;
border-radius: 0.06rem;position: relative;margin: 0 auto;color: #fff;
}
/* .configDetails__cont .orderBtn2{
display: block;width: 3.2rem;height: 0.5rem;line-height: 0.5rem;text-align: center;font-size: 0.22rem;background:#01aeff;
border-radius: 0.06rem;position: relative;margin:0.1rem auto;color: #fff;
} */
.configDetails__cont .orderBtn .hotPriceIcon {
position: absolute;top: 0;left: 0;width: 0.78rem;height: 0.77rem;background: url(../../../static/images/hotPriceIcon.png) no-repeat;
background-size: 0.78rem auto;
}
.configDetails__cont .btn__moreCar {width: 4.56rem;height: 0.88rem;line-height: 0.88rem;}

/*选中爆款优惠弹框*/
.hotDiscountPriceBox{
    width:100vw;height: 100vh;position: fixed;top:0;left:0;background: rgba(0,0,0,0.8);color:#fff;text-align: right;z-index: 99999;
}
.hotDiscountPriceCont{
    width:11.16rem;position: absolute;top:5.7rem;right: 1.6rem;
}
.hotDiscountPriceTips{font-size: 0.5rem;margin-bottom: 0.6rem;margin-right: 0.3rem;}
.hotDiscountPriceBox .IKownBtn{display: inline-block;vertical-align: middle;width:2.66rem;height: 0.82rem;color:#fff;font-size: 0.4rem;text-align: center;line-height: 0.82rem;border:1px solid #fff;border-radius: 0.5rem;margin-right: 0.46rem;}
.hotDiscountPriceBox .boxPriceCont{
    display: inline-block;vertical-align: middle;width:5.27rem;height: 1.18rem;background: url(../../../static/images/borderBg.png) no-repeat center;background-size: 5.27rem auto;padding:0.1rem 0.2rem 0 0.58rem;text-align: left;color:#b8bfcb;position: relative;
}
.hotDiscountPriceBox .totalTips{font-size: 0.26rem;line-height: 1.2em;}
.hotDiscountPriceBox .discountsPrice{font-size: 0.48rem;color: #ffa401;}
.hotDiscountPriceBox .discountsPrice .renIcon{color:#ffa401;}
.hotDiscountPriceBox .originalPrice{font-size: 0.28rem;}

/*综合优惠弹框*/
.allDiscountsBox{
width: 16.38rem;height:9.68rem;margin-left:-8.195rem;margin-top:-4.84rem;
}
.allDiscountsBox .lightBox__cont{
margin-left: 0;width:100%;height: auto !important;padding:0.2rem 0.4rem 0.2rem 0.2rem;
}
.allDiscountsBox .allDiscounts__list{
margin-bottom:0.1rem;width: 100%;
}
.allDiscountsBox .discountPrice,.allDiscountsBox .allDiscounts__setmealWrap{
background: #1a1a1a;border:1px solid #999;border-radius: 0.2rem;padding:0.2rem;font-size: 0.32rem;width:14.75rem;
}
.allDiscountsBox .deleteList{
width: 0.64rem;height: 0.64rem;background: url(../../../static/images/reduceIcon.png) no-repeat;background-size: 0.64rem auto;
}
.allDiscountsBox .allDiscounts__setmealLists{
display: block;margin:0.1rem 0 0.4rem;
}
.allDiscountsBox .allDiscounts__setmealLists li{
float:left;width: 2.68rem;height: 3.04rem;margin-right: 0.2rem;background: #333;border-radius: 0.2rem;padding:0.2rem 0.2rem 0;
}
.allDiscountsBox .carImg{
width: 2.3rem;height: 1.3rem;background: #fff;margin-bottom: 0.1rem;position: relative;
}
.allDiscountsBox .carName{
font-size: 0.24rem;line-height: 0.46rem;height: 0.92rem;overflow: hidden;
}
.allDiscountsBox .carPrice{
font-size: 0.36rem;
}
.allDiscountsBox .carPrice .yenIcon{font-size: 0.2rem;font-style: normal;}
.allDiscountsBox .allDiscounts__setmealTotal,.allDiscountsBox .allDiscountsTotal{
text-align: right;font-size: 0.32rem;
}
.allDiscountsBox .allDiscountsTotal{width:14.75rem;}
.GoConfigDetail{margin: .15rem auto 0;font-size: 0.24rem;line-height: 0.45rem;width: 3rem;height: 0.45rem;text-align: center;cursor: pointer;border:1px solid #01aeff;border-radius: 0.05rem;color: #01aeff;}
.configDetails__cont .discountsPrice{font-size: .4rem;color: #01aeff;font-weight: 600}
</style>
