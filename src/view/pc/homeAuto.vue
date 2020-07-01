<template>
  <div class="homeWrap">
    <div class="swiperWrap" ref="swiperWrap">
      <div class="homeSlide swiper-container">
        <ul class="homeSlide__wrapper swiper-wrapper">
          <li class="swiper-slide" v-for="(vo,index) in images"
            :class="{'swiper-slideR':(index==0 || index==2 || index==6),'swiper-slideL':(index==1 || index==3 || index==4 || index==5 ),'swiper-slide6':index==6}"
          >
            <img :src="vo.src" alt="" class="slideImg">
            <div class="codeImg" :class="{'codeImgIpad':$browserMode.isApad()===true}">
              <img src="../../static/images/os/home_swiper/code.png">
              <p>手机选配更方便</p>
            </div>
          </li>

        </ul>
        <div class="swiper-pagination"></div>
      </div>
    </div>
    <ul class="tabControl">
      <li class="productFeatures">
        <div>
          <div class="icon productFeaturesIcon"></div>
          <span>{{$t("SellingPoints")}}</span>
        </div>
      </li>
      <li class="IntelligentCustom" @click="$router.push({name:'optionalcar',query: {accessories: 1}, params: {clearCache: true}})">
        <div >
          <div class="icon IntelligentCustomIcon"></div>
          <span>{{$t("AccessoriesStore")}}</span>
        </div>
      </li>

      <li class="popularity" :class="{comingSoonLi:!showHot}" @click="$router.push({name:'hotrecommend'})">
        <div class="">
          <div class="icon popularityIcon"></div>
          <span>{{$t("HotOnSale")}}</span>
          <span class="rightTriangle"></span>
        </div>
      </li>
    </ul>
<!--
    <div class="homeQR" v-if="isShowQR">
      <div class="closeHomeQRBtn" @click="isShowQR=false"></div>
    </div>
-->
  </div>
</template>

<script>
import ModeDrive from '@/packages/mode-drive'
import interActiveHandler from "@/common/InterActiveHandler"; //引入用户交互代理
import api from "@/common/api/api.js";
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
  export default {
    name: "home",
    data(){
      return {
        openHotTime:'1566907200000', //热销放开时间 2019.8.27号 晚上20:00 1566907200000
        showHot:false, //热销是否放开
        isShowQR:true,
        swiperHeight: 0,
        tabControlHeight: 0,
        images:[],
        imageSize:{
          default: {
            width: 1920,
            height: 902,
          },
          ipad: {
            width: 2224,
            height: 1668,
          }

        }
      }
    },
    mounted() {
      var _self = this;
      let path = "";

       path =  _self.getImgPath();
       console.info("使用的图片路径是",path)
       if(path != ''){
         path += '/';
       }
      for(let i =1; i <=7; i++){
          this.images.push({
            src: require('@/static/images/os/home_swiper/'+path+ + i +'.jpg')
          })
      }
      this.$nextTick(()=>{
        new Swiper('.swiper-container',{
          autoHeight: true,
          // autoplay: true,
          loop:true,
          pagination: {
            el: '.swiper-pagination',
            clickable:true,
          },
          on:{
              slideChangeTransitionEnd: function(){
              pilot("track","event","D60Config","leadclick","feature","1");//切换结束时，告诉我现在是第几个slide
              },
          }
        })
        $('.swiperWrap').height(this.swiperHeight)
        $('.tabControl').height(this.tabControlHeight)
        $('.codeImg').css('top',this.swiperHeight * 0.8);

        //_self.tabControlH()
      })
      // document.documentElement.style.overflowY = 'hidden'


     // window.addEventListener('load',function () {


        //_self.$loading.hide();
        // let screenH = $('body').height()
        // let swiperH = $('.swiperWrap').height()
        // let tabControlH = screenH - swiperH
        // $('.tabControl').height(tabControlH)
        // $('.rightTriangle').css({'border-top':tabControlH+'px solid #999','border-left':tabControlH+'px solid transparent'})
        // if (tabControlH > 100){
        //   $('.comingSoon>p').css('font-size','125%')
        // }
      //})
      //window.addEventListener('resize',_self.tabControlH());
    },
    activated(){
      this.$threeOptional.init3dspotIs();//重新初始化外观内饰呼吸灯
       this.openHotByTime()
    },
    methods:{
      //根据屏幕尺寸获取图片路径 决定用哪套图
      getImgPath () {
        let _path = "";
        let _w = $(window).width();
        let _h = $(window).height()
        if(_w >= 1920){
        }else if(_w < 1920 && _w >= 1680){

        }else if(_w < 1680 && _w >= 1366){

        }else{
            _path = "ipad";
        }
        let imgWidth = ''
        let imgHeight = ''
        if(_path ==""){
          imgWidth = this.imageSize['default'].width;
          imgHeight = this.imageSize['default'].height;
        }else{
          imgWidth = this.imageSize[_path].width;
          imgHeight = this.imageSize[_path].height;
        }

        this.swiperHeight = imgHeight * _w / imgWidth; //算出轮播图高度

        this.tabControlHeight = _h - this.swiperHeight
        if(this.tabControlHeight <50){ //底部最小高度
            this.tabControlHeight = 50
            this.swiperHeight = _h - 50;
        }

        return _path;
      },
       //定时放开热销
      openHotByTime(){

        let timestamp = Date.parse(new Date()); // 当前时间戳

          //获取热销开放时间
         api.getHotOpenTime().then(rs => {
            if(rs.error_code==0){
                this.openHotTime = rs.data;
            }
            if(timestamp>= this.openHotTime){
                this.showHot  = true;
            }
         }).catch(e=>{
            if(timestamp>= this.openHotTime){
                this.showHot  = true;
            }
         })
         console.log('当前时间===>',timestamp)
         console.log('开放时间===>',this.openHotTime)
      },
      tabControlH(){    //计算tabControl高度
        let screenH = $(window).height()
        let swiperH = 1668 * $(window).width() / 2224;
        $('.swiperWrap').height(swiperH)
        $('.slideImg').height(swiperH)
        let tabControlH = screenH - swiperH
        $('.tabControl').height(tabControlH)
      },
      hotRouter(){
         if(typeof(this.$utmRouter.buildQuery().loadReduce)!=undefined){
                delete this.$utmRouter.buildQuery().loadReduce;
          }
          if(this.showHot){
            this.$utmRouter.push({name:'hotrecommend',params: {clearCache: true},query: this.$utmRouter.buildQuery()})
          }else{
            return;
          }
      },
      goHotRecommend(){
        if(ModeDrive.isApp()){
            this.$utmRouter.push({name:'hotrecommend'})
        }
      }
    },
  }
</script>

<style scoped>
  .homeWrap{
    width: 100%;height: 100%;
  }
  .swiperWrap{
    /*height: 83.5%;*/
    width: 100%;display: flex;flex-direction: column;justify-content: flex-end;align-items: center;
  }
  .homeSlide{
    width: 100%;/*height: 100%;*/
  }
  .homeSlide__wrapper{
    width: 100%;display: flex;
  }
  .homeSlide__wrapper>li{
    width:100%;
  }
  .homeSlide__wrapper>li>img{
    width: 100%;display: block;
  }
  .tabControl{
    /*max-height: 16.5%;*/height: 1rem;position: fixed;left: 0;bottom: 0;width: 100%;z-index: 100;
    border-top: 0.05rem solid #ffa401;box-sizing: border-box;display: flex;justify-content: space-between;align-items: center;
  }
  .tabControl>li{
    width: 33.3%;height: 100%;display: flex;align-items: center;justify-content: center;color: #fff;
  }
  .tabControl>li>div{
    display: flex;justify-content: center;align-items: center;cursor: pointer;
  }
  .tabControl>li>div>.icon{
    width: .5rem;height: .5rem;margin-right: .28rem;
  }
  .tabControl>li>div>span{
    font-size: .4rem;
  }
  .productFeatures{
    background: url("../../static/images/productFeatures.jpg") no-repeat;
    background-size:cover;
    position: relative;
  }
  .productFeatures:before{
    content: "";display: block;width: 0px;height: 0px;position: absolute;left: 50%;margin-left: -0.1rem;top: -.6rem;border-top: 0.2rem transparent dashed;border-right: 0.2rem transparent dashed;border-left: 0.2rem transparent dashed;border-bottom: 0.4rem #ffa401 solid;z-index: 9;
  }
  .IntelligentCustom{
    /*border-left:0.05rem solid #fff ;border-right:0.05rem solid #fff ;*/
    width: 33.4%;border-left: 0.04rem solid #fff;border-right: 0.04rem solid #fff;
    background: url("../../static/images/IntelligentCustom.jpg") no-repeat;
    background-size: cover;
  }
  .popularity{
    background: url("../../static/images/popularity.jpg") no-repeat;background-size:cover;position: relative;
  }
  .productFeaturesIcon{
    background: url("../../static/images/homeIcon.png") no-repeat;
    -webkit-background-size: .5rem auto;
    background-size: .5rem auto;
    background-position: 0 0;
  }
  .IntelligentCustomIcon{
    background: url("../../static/images/homeIcon.png") no-repeat;
    -webkit-background-size: .5rem auto;
    background-size: .5rem auto;
    transform: translateY(20%);
    background-position: -0.5rem 0;
  }
  .popularityIcon{
    background: url("../../static/images/homeIcon.png") no-repeat;transform: translateY(5%);
    -webkit-background-size: .5rem auto;
    background-size: .5rem auto;
    background-position: -1rem 0;
  }
  .slideVid{
    width: 100%;height: 100%;
  }
  .homeQR{
    width:4.55rem;height:3.7rem;position: fixed;right: 0;bottom: 16.5%;background: url("../../static/images/homeQR.png") no-repeat center;z-index: 100;
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
  }
  .popularity .rightTriangle{display: none;}
  /*即将开放star*/
  .comingSoonLi .popularityIcon,.comingSoonLi span{
    opacity: .2;cursor:not-allowed;
  }
  .comingSoonLi .rightTriangle{
    display: block;position: absolute;top: 0;right: 0;width: 1.2rem;height: 1.2rem;
    background: url("../../static/images/waitOpenIcon.png") no-repeat;background-size: 1.2rem auto;opacity: 1;
  }


.swiper-slide .codeImg{
  position: absolute;top:75%;text-align: center;color:#fff;font-size: 0.18rem;
}
.swiper-slide .codeImg img{
  display: block;width:1.5rem;height: 1.5rem;margin:0 auto 0.1rem;
}
.swiper-slide .codeImg.codeImgIpad{font-size: 0.34rem;}
.swiper-slide .codeImg.codeImgIpad img{
  width:2.5rem;height: 2.5rem;
}
.swiper-slideL .codeImg{
  left: 0.6rem;
}
.swiper-slideR .codeImg{
  right: 0.6rem;
}
.swiper-slide6 .codeImg{color: #002486;}
  .homeQR>.closeHomeQRBtn{
    width: .35rem;height: .35rem;position: absolute;right: 5%;top:0;border-radius: 50%;border: 1px solid #fff;
    background: #000 url("../../static/images/close.png") no-repeat center;
    -webkit-background-size: .15rem auto;
    background-size: .15rem auto;
  }
  >>>.swiper-pagination-bullet{
    background: rgba(255,255,255,.6);
    opacity: 1;
  }
  >>>.swiper-pagination>.swiper-pagination-bullet-active{
    background: #d3860b;
  }
</style>
