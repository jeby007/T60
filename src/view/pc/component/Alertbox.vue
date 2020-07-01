<template>
  <div>
    <div class="overlay" v-show="visible"></div>
    <transition name="smallTolarge">
      <div class="lightBox conflictBox" v-show="visible && !isShowSpeedProgress" >
        <a href="javascript:;" @click="userCancel" class="closeBox" ></a>
        <h2 class="lightBox__title"><span>{{$t('SendEmail')}}</span></h2>
        <div class="lightBox__cont clearfix">
          <div class="inputUsername">
            <input type="text" placeholder="John Wilson" v-model="username" @input="verifyUsername">
            <p>{{unErrMsg}}</p>
          </div>
          <div class="inputUsername">
            <input type="text" placeholder="Title" v-model="caption" @input="verifyCaption">
            <p>{{captionErrMsg}}</p>
          </div>
          <div class="choose__Email">
            <i class="mailcheck" @click="isChecked = !isChecked" :class="{checked:isChecked}"></i><span>{{$t('UseCustomHeaders')}}</span>
          </div>
          <div class="inputEmail">
            <input type="text" placeholder="SendAddress@gmail.com" v-model="userEmail" @input="verifyEm">
            <p>{{emErrMsg}}</p>
          </div>
          <div class="EmailBtn"  @click="SpeedProgress">
            {{$t('Confirm')}}
          </div>
        </div>
      </div>
    </transition>
    <div class="speedProgress" v-show="isShowSpeedProgress && !isShowsuccessSpeed">
      <span @click="democlick">{{$t('Saving')}}...</span>
      <div class="abrodbg">
        <div class="within"></div>
      </div>
    </div>
    <transition name="smallTolarge">
      <div class="successSpeed lightBox" v-show="isShowsuccessSpeed">
        <a href="javascript:;" @click="userCancel(true)" class="closeBox" ></a>
        <img src="../../../static/images/successSpeed.png" alt="">
        <div class="Checkbtn" @click="userCancel(false)">
          {{$t('Check')}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import Vue from 'vue';
  import vuescroll from 'vuescroll';

  import api from "@/common/api/api.js";
  Vue.use(vuescroll);
    import {mapActions, mapGetters, mapState} from 'vuex'
  export default {
    props:['visible'],
    data() {
      return {
        isChecked:false,
        isShowSpeedProgress:false,
        isShowsuccessSpeed:false,
        closeBoxIs:true,
        caption:'',
        userEmail:'',
        emErrMsg:'',
        captionErrMsg:'',
        username:'',
        unErrMsg:''
      }
    },
    watch: {
		isChecked(newV, old){
			this.caption = newV ? 'Please receive the configuration list !':'';
		}
	},
	computed: {
      ...mapState({
        selectedFeatures: state => state.vehicle.selectedFeatures,
        preorderSid: state => state.vehicle.configuration.preorderSid,
        type: state => state.vehicle.type,
        mode: state => state.vehicle.mode,
        price: state => state.vehicle.price,
      }),
    },
    methods: {
      userCancel(to) {
        this.isShowSpeedProgress = false
        this.isShowsuccessSpeed = false
        this.$parent.closeAlertBox(false)
        if (!to){
          this.$router.push({name:'downloadlist'})
        }
      },
      verifyUsername(e){
        let unVal = e.target.value
        if(!this.username.trim()){
          this.unErrMsg = 'Please enter your name'
        }else if(unVal.length<2){
          this.unErrMsg = 'Enter at least 2 characters'
        }else{
          this.unErrMsg = ''
        }
      },

      verifyEm(e){
        let emVal = e.target.value
        if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(emVal.trim())) {
          this.emErrMsg = 'Please enter the correct email address'
        }else {
          this.emErrMsg = ''
        }
      },
      verifyCaption(e){
        let name = e.target.value
        if(!this.caption.trim()){
          this.captionErrMsg = 'Please enter title'
        }else if(name.length<2){
          this.captionErrMsg = 'Enter at least 2 characters'
        }else{
          this.captionErrMsg = ''
        }
      },
      SpeedProgress(){
        if (!this.emErrMsg && this.userEmail.trim() && this.caption.trim() && !this.captionErrMsg){
			this.isShowSpeedProgress = true //正常跳转
				api.setExportConfigurationInventoryPdf({preorderSid: this.preorderSid,mailTo: this.userEmail,mailTitle: this.caption,userName:this.username}).then(rs => {
					if(rs.success) {
						this.isShowsuccessSpeed = true;
					}
				});
        }else if (!this.userEmail.trim() && !this.caption.trim() && !this.username.trim()){
          this.emErrMsg = 'Please enter your email address'
          this.captionErrMsg = 'Please enter title'
          this.unErrMsg = 'Please enter your name'
        }
      },
      //应用冲突
      applyConflictResolution() {
        this.$emit("applyConflictResolution")
      },
      democlick(){
        this.isShowsuccessSpeed = true
      }
    }
  }
</script>
<style scoped>
  .lightBox{width: 12.8rem;margin: 0;height:5.5rem;}
  .lightBox .lightBox__cont{
    width: 11rem;height: 4.5rem;margin: auto;background: #384457;position: relative;
  }
  .lightBox .lightBox__cont .inputUsername{
    width: 100%;padding-top: .4rem;position: relative;
  }
  .inputUsername>p{color: red;font-size: .24rem;font-weight: 600;position: absolute;bottom: -.35rem;left: 2rem}
  .lightBox .lightBox__cont .inputUsername input{
    width:7rem;height: 0.6rem;line-height: 0.6rem;font-size: .3rem;border-radius: .2rem;background: #384457;padding-left: 0.2rem;border: 2px solid #66748f;margin: auto;display:block;color:#FFF;
  }
  .lightBox .lightBox__cont .choose__Email{
    width: 100%;text-align: center;margin-top: .25rem;font-size: 0.24rem;display: flex;justify-content: center;align-items: center;
  }
  .lightBox .lightBox__cont .choose__Email .mailcheck{
    display: inline-block;width:0.2rem;height:0.2rem;background: url(../../../static/images/mailchecked.png) no-repeat left;margin-right: 0.15rem;background-size:auto 0.2rem;cursor: pointer;
  }
  .lightBox .lightBox__cont .choose__Email .mailcheck.checked{
    background-position:right 0;
  }
  .lightBox .lightBox__cont .inputEmail{
    margin-top:0.25rem;position: relative;
  }
  .inputEmail>p{color: red;font-size: .24rem;font-weight: 600;position: absolute;bottom: -.35rem;left: 2rem}
  .lightBox .lightBox__cont .inputEmail input{
    width:7rem;height: 0.6rem;line-height: 0.6rem;font-size: .3rem;border-radius: .2rem;background: #384457;padding-left: 0.2rem;border: 2px solid #66748f;margin: auto;display:block;color:#FFF;
  }
  .lightBox .lightBox__cont .EmailBtn{
    position: absolute;bottom: 0.25rem;left: 50%;transform: translateX(-50%);-webkit-transform: translateX(-50%);-o-transform: translateX(-50%);width:2rem;text-align: center;height: 0.5rem;line-height: 0.5rem;background: #01aeff;border-radius: 0.1rem;cursor: pointer;font-size: .26rem;
  }
  .lightBox .lightBox__cont .EmailBtn:active{background: skyblue}
  .speedProgress{
    width: 5rem;height:1rem;z-index: 19999;position: fixed;top:0;left: 0;right:0;bottom:0;margin: auto;text-align: center;
  }
  .speedProgress .abrodbg{
    width:5rem;height: 0.2rem;border-radius: 0.2rem;background:#3b3d3f;margin-top: 0.15rem;
  }
  .speedProgress .within{
    width:20%;height: 0.2rem;border-radius: 0.2rem;margin-top: 0.15rem; background-image: -moz-linear-gradient( -180deg, rgb(39,148,249) 0%, rgb(39,247,249) 100%);background-image: -webkit-linear-gradient( -180deg, rgb(39,148,249) 0%, rgb(39,247,249) 100%);background-image: -ms-linear-gradient( -180deg, rgb(39,148,249) 0%, rgb(39,247,249) 100%);
  }
  .successSpeed{
    z-index: 19999;position: fixed;top:0;left: 0;right:0;bottom:0;margin: auto;text-align: center;width: 12.8rem;height: 4rem;
  }
  .successSpeed img{
    max-width: 100%;
  }
  .successSpeed .Checkbtn{
    width:2rem;text-align: center;height: 0.5rem;line-height: 0.5rem;background: #01aeff;border-radius: 0.1rem;cursor: pointer;margin:0.2rem auto 0 auto;
  }
</style>
