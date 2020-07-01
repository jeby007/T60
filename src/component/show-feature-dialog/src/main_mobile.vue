<template>
  <div v-show="visible">
    <div class="overlay" v-show="visible"></div>
    <transition name="smallTolarge">
<!--
      <div class="lightBox familyDetailsBox" v-show="visible">
        <a href="javascript:void(0);" class="closeBox" @click="userCancel">关闭弹框</a>
        <h2 class="lightBox__title"><span>{{$commonFun.featureName(showApolegaFeature) }}</span></h2>
        <div class="lightBox__cont clearfix">
          <yp-img v-bind:src="$commonFun.featureImage(showApolegaFeature)" className="lightBox__cont&#45;&#45;left fl"/>
          <div class="lightBox__cont&#45;&#45;right fl">
            <div class="feartureTitle clearfix">
              <span class="feartureName ellipsis">{{$commonFun.featureName(showApolegaFeature) }}</span>
              <span class="hornIcon" @click="audioControl(showApolegaFeature.code)" v-if="is_audio">
                  <audio :src="audioSrc" id="music"></audio>
              </span>
            </div>
            <div class="fearturePrice"><i class="renIcon">￥</i>{{showApolegaFeature.price}}</div>
            <div class="feartureDetails">{{showApolegaFeature.tip}}</div>
            <div class="feature__wrap">
                &lt;!&ndash; horizontalScroll &ndash;&gt;
                <ul class="feature__wrap-ul">
                  <li v-for="feature in showApolegaFeatures" v-on:click="changeShowApolegamyBox(feature)">
                    <div class="feature__inner" v-bind:class="{ checked: feature.selected === true }">
                      <span class="feature__span">
                          <yp-img v-bind:src="$commonFun.featureIcon(feature)"
                                  className="feature__img" />
                        <i class="disabled" v-if="feature.selectable === false"></i>
                      </span>
                    </div>
                  </li>
                </ul>
            </div>
            <div class="feature__btnWrap">
              <a href="javascript:void(0);" @click="userCancel">取11消</a>
              <a v-if="haveChange === true " class="confirmBtn" href="javascript:void(0);" @click="applyChange">确认</a>
            </div>
          </div>
        </div>
      </div>
-->
      <div class="changeColor" v-show="visible">
        <div class="closeBtn" @click="userCancel"></div>
        <p class="changeColor_title">{{$commonFun.featureName(showApolegaFeature)}}</p>
        <div class="carPic">
          <img :src="$commonFun.featureImage(showApolegaFeature)" alt="">
        </div>
        <p class="featureName">{{$commonFun.featureName(showApolegaFeature)}}</p>
        <ul class="featureList">
          <li v-for="feature in showApolegaFeatures" @click="changeShowApolegamyBox(feature)"
              :class="{active: feature.selected === true }"
          >
            <img :src="$commonFun.featureIcon(feature)" alt="">
          </li>
        </ul>
        <div class="confirmBtn" v-if="haveChange === true " @click="applyChange">Confirm</div>
      </div>
    </transition>
  </div>

</template>
<script>
  import Vue from 'vue';
  import vuescroll from 'vuescroll';
  Vue.use(vuescroll);
  import store from '@/store/index';
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'


  export default {
    name: 'PDShowFeatureDialog',
    props: {
      haveChange: {
        type: Boolean,
        default: false
      },
      confirmButtonText: {
        type: String,
        default: '确定',
      },
      cancelButtonText: {
        type: String,
        default: '取消',
      },
      confirm: Function,
      cancel: Function,
    },
    computed: {
      showApolegaFeature: function (params) {
        let fea = this.showApolegaFeatures.find(vo => {
          return vo.selected === true;
        })
        if (fea == null) {
          return {};
        }
        return fea
      }
    },
    data() {
      return {
        family: {},
        showApolegaFeatures: [],
        is_audio: false,
        visible: false,
      }
    },
    methods: {
      show(family, showApolegaFeatures) {
        this.family = family;
        this.showApolegaFeatures = JSON.parse(JSON.stringify(showApolegaFeatures));

        this.visible = true
      },
      userCancel() {
        this.visible = false
        this.$emit("applyChange",{isChange: false})
      },
      //改变选中的
      changeShowApolegamyBox(feature) {
        this.showApolegaFeatures.forEach(element => {
            element.selected = false
        });
        feature.selected = true
      },
      //确定改变主动选中项
      applyChange () {
        let getFeatureByFeatureCode = store.getters["vehicle/getFeatureByFeatureCode"];
        let feature = getFeatureByFeatureCode(this.showApolegaFeature.code);
        this.visible = false
        this.$chooseConflictFeature.valid({
            feature: feature,
            cancel: ()=>{
                //用户点击了取消 还原
	              let getShowFeaturesByFamily = store.getters["vehicle/getShowFeaturesByFamily"];
                 this.show(this.family,getShowFeaturesByFamily(this.family))
            },
            }).then(rs => {
            if(rs.isChange === true){
                boutiqueVehicleComplex.setUserSelectFeature({feature: feature,family: this.family}).then(()=>{
                  //通知 用户改变的了
                  rs['featureCode'] = feature.code
                  this.$emit("applyChange",rs)
                })
                store.dispatch('vehicle/setUserSelectFeature', {feature: feature,family: this.family})
            }else{
                  this.$emit("applyChange",{isChange: rs.isChange})
            }
        })
      },
      audioControl:function(feature_code){
        var _self = this;
        var audio = document.getElementById('music');
        if(audio.src != null){
          if(audio.paused){
              audio.play();
              $(".hornIcon").addClass("hornMove");
          }else{
              audio.pause();// 暂停
              $(".hornIcon").removeClass("hornMove");
          }
          audio.onended = function() {
              console.log("音频播放完成");
              $(".hornIcon").removeClass("hornMove");
          };
        }
      },
    }
  }
</script>

<style scoped>
  @import '../../../static/style/global.css';
  @import '../../../static/style/animate.css';
/*  >>>.animated{
    -webkit-animation-duration:300ms;
    animation-duration:300ms;
    -webkit-animation-fill-mode:both;
    animation-fill-mode:both;
  }
  .lightBox__cont--right .feartureName{
    float: left;font-size: 0.42rem;max-width: 8.2rem;line-height: 0.84rem;
  }
  .lightBox__cont--right .hornIcon{
    float: right;width:27px;height: 27px;background: url(../../../static/images/hornIcon2.png) no-repeat;background-size: 27px auto;
  }
  .lightBox__cont--right .hornIcon.hornMove{
    background: url(../../../static/images/hornGif.png) no-repeat;background-size: 513px auto;
      -webkit-animation: horn 2s steps(19) infinite;
      animation: horn 2s steps(19) infinite;
  }
  @keyframes horn {
      0% {background-position: 0;}
      100% {background-position: -513px;}
  }
  @-webkit-keyframes horn {
      0% {background-position: 0;}
      100% {background-position: -513px;}
  }
  .lightBox__cont--right .fearturePrice{
    font-size: 0.36rem;color: #ffa401;line-height: 0.56rem;
  }
  .lightBox__cont--right .fearturePrice .renIcon{font-size: 0.2rem;line-height: 1em;}
  .lightBox__cont--right .feartureDetails{
    font-size: 0.36rem;width: 95%;line-height: 0.52rem;height:1.56rem;margin:0.1rem 0;overflow: hidden;position: relative;
  }
  .familyDetailsBox .feature__wrap {margin: 0.1rem auto 0.2rem; width:100%;!*overflow-x: hidden*!}
  .familyDetailsBox .feature__wrap .feature__wrap-ul{
    width: auto;white-space:nowrap !important;
  }
  .feature__wrap>>>.__panel{
    margin-bottom: -17px;
  }*/



  .overlay{display: flex;align-items: center;justify-content: center}
  .changeColor{width: 6.22rem;height: 9.13rem;background: #fff;border-radius: .1rem;position: fixed;display: flex;flex-direction: column;align-items: center;top: 0;right: 0;left: 0;bottom: 0;margin: auto;z-index: 7001}
  .changeColor>.closeBtn{width: .3rem;height: .3rem;background: url("../../../static/images/mobile/menuIcon.png") no-repeat center;background-size: 4.07rem auto;background-position: -1.37rem -1.89rem;position: absolute;top: .27rem;right: .25rem}
  .changeColor>.changeColor_title{font-size: .36rem;color: #2f3744;font-family: PingFangSC-Medium, sans-serif;margin-top: .3rem}
  .changeColor>.carPic{width: 5.34rem;height: 3rem;margin: 1rem 0 .3rem;}
  .carPic>img{width: auto;height: 100%}
  .changeColor>.featureName{font-size: .3rem;color: #2f3744;font-family: PingFangSC-Medium, sans-serif;}
  .changeColor>.featureList{display: -webkit-box;max-width: 95%;height: 1.2rem;align-items: center;margin-top: .5rem;overflow-x: auto;padding: 0 .2rem}
  .featureList>li{width: .86rem;height: .86rem;border-radius: 50%;margin-right: .48rem;background: #4a75e4;-moz-box-shadow:0px 2px 6px #D4D4D4; -webkit-box-shadow:0px 2px 6px #D4D4D4; box-shadow:0px 2px 6px #D4D4D4;}
  .featureList>li.active{border: .15rem solid #dfdfdf;box-shadow: none;box-sizing: content-box;}
  .featureList>li:last-child{margin-right: 0}
  .featureList>li>img{width: 100%;height: auto}
  .confirmBtn{width: 2.4rem;height: .6rem;background: #01aeff;color: #fff;font-size: .26rem;text-align: center;line-height: .6rem;border-radius: .08rem;margin-top: .5rem}

</style>
