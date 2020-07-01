<template>
  <div v-show="visible" class="conflictFeatureWrap">
    <div class="overlay" v-show="visible" @click="userCancel"></div>
    <div class="conflictMsgWrap">
      <div class="conflictMsgHeader">
        <p>Warning</p>
        <div class="closeIcon" @click="userCancel"></div>
      </div>
      <div class="changeCur" v-if="selectedFeature != null">
        Change To：<em>{{$commonFun.featureName(selectedFeature)}}</em>
      </div>
      <div class="conflictDetail">
        <!-- <div class="changeHint" v-if="selectedFeature != null">您所选的 <span class="yellowC">{{$commonFun.featureName(selectedFeature)}}</span> 配置即将发生变更</div>        -->
        <div class="changeHint">
          <p>Exchange：</p>
          <p class="renIcon">&yen;{{price}}</p>
        </div>
        <ul>
          <li v-for="feature in showAddFeatures">
            <div class="changeAfter">
              <div class="leftPic">
                <yp-img :src="$commonFun.featureImage(feature)" class="pic"/>
              </div>
              <div class="rightDetail">
                <p>{{feature.nameEn}}</p>
                <p class="renIcon">¥ {{feature.price}}</p>
              </div>
            </div>
            <div class="changeBefore" v-if="getFeatureByFamiliy(feature.familyCode) != null">
              <p class="old">Before</p>
              <p>{{getFeatureByFamiliy(feature.familyCode).nameEn}}</p>
              <p class="renIcon">¥ {{getFeatureByFamiliy(feature.familyCode).price}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="btnWrap">
        <div class="cancel" @click="userCancel">Cancel</div>
        <div class="confirm"  @click="applyConflictResolution()">Confirm</div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      message: {
        type: String,
        default: '',
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
    data() {
      return {
        selectedFeature: null,
        showRemoveFeatures: [],
        showAddFeatures: [],
        price: 0,
        priceGap: 0,
        visible: false,
      }
    },
    methods: {
      getFeatureByFamiliy(familyCode){
         return this.showRemoveFeatures.find(vo => {
            return vo.familyCode == familyCode
          })
      },
      userCancel() {
        this.visible = false
          this.$emit("cancelApply")
      },
      //应用冲突
      applyConflictResolution() {
          //pilot("track","event","D60Config","click","","8");
          this.$emit("applyConflictResolution")
      }
    }
  }
</script>

<style scoped>
  .conflictFeatureWrap {
    width: 100%;height: 100%;position: fixed;top: 0;left: 0;z-index: 200;
  }
  .conflictFeatureWrap > .overlay {
    width: 100%;height: 100%;background: rgba(0, 0, 0, .5);position: absolute;top: 0;left:0;z-index: 2;
  }
  .conflictFeatureWrap>.conflictMsgWrap{
    width: 90%;max-height: 80%;background: #fff;position: absolute;top: 50%;left: 50%;transform: translate(-50%,-50%);z-index: 3;border-radius: .2rem;box-sizing: border-box;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictMsgHeader{
    width: 100%;height: .9rem;display: flex;align-items: center;justify-content: space-between;border-bottom: 1px solid rgba(239,239,239,1);padding: 0 .3rem;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictMsgHeader>p{
    font-size: .3rem;font-weight: 500;color:rgba(38,47,63,1);
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictMsgHeader>.closeIcon{
    width: .3rem;height: .31rem;padding: 1;
    background: url('../../../static/images/mobile/menuIcon.png') no-repeat center;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -1.37rem -1.89rem;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail{
    width: 100%;padding: .5rem .74rem 0 .82rem;overflow-y: scroll;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>.changeHint{
    display: flex;align-items: center;justify-content: space-between;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>.changeHint>p:first-child{
    font-size: .28rem;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>.changeHint>.renIcon{
    font-size: .26rem; color: #2593F9;
  }
  /* .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul{
    margin-top: .25rem;
  } */
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul>li{
    padding-top: .5rem;border-bottom:1px solid rgba(63,73,90,.2);
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul>li>.changeAfter{
    display: flex;align-items: center;margin-bottom: .2rem;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul>li>.changeAfter>.leftPic{
    width: 2rem;height: 2rem;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul>li>.changeAfter>.leftPic>.pic{
    width: 100%;height: auto;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul>li>.changeAfter>.rightDetail{
    padding-left: .24rem;font-size: .26rem;max-width: 60%;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul>li>.changeAfter>.rightDetail>.renIcon{
    color:rgba(63,73,90,.6);
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul>li>.changeBefore{
    width: 100%;min-height: .5rem;border-radius: .34rem;background: rgba(64,73,90,.08);display: flex;align-items: center;justify-content: space-between;padding: 0 .4rem 0 .12rem;font-size: .26rem;color:rgba(63,73,90,.5);margin: .2rem 0 .3rem 0;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul>li>.changeBefore>.old{
    color: #01aeff;font-size: .24rem;font-weight: 700;padding-left: .1rem;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.conflictDetail>ul>li>.changeBefore>p:nth-child(2){
    width: auto;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.btnWrap{
    width: 100%;height: 1rem;display: flex;align-items: center;justify-content: center;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.btnWrap>div{
    width: 2rem;height: .56rem;border-radius: .1rem;border: 1px solid #2593F9;display: flex;align-items: center;justify-content: center;font-size: .28rem;color:#2593F9 ;
  }
  .conflictFeatureWrap>.conflictMsgWrap>.btnWrap>.confirm{
    background: #2593F9;color: #fff;margin-left: 1rem;
  }
  .changeCur {display: flex; align-items: center; padding:0 0.83rem; width: 100%; min-height: .8rem; color: #262F3F; background:rgba(37,147,249,0.05); font-size:0.28rem;font-family:SourceHanSansCN-Bold;font-weight:bold;}
  .changeCur em {color: #2593F9;}
</style>
