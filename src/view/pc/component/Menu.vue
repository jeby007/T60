<template>
  <div id="right__menu" class="right__menu" :class="{unfold: unfold}">
    <a class="menu__icon" @click.stop="showMenu"></a>
    <div class="other__menu">
      <ul class="menu__ul" :class="[unfold?'slideInDown':'slideOutUp']">
        <li class="menu__feedback" @click.stop="tofeedback">意见反馈</li>
        <li class="menu__carbarn"  @click.stop="gotoGarage">我的车库</li>
        <li class="menu__customer"   @click="goToOnlineChat()"><a href="">在线客服</a></li>
        <li class="menu__config" v-show="showCarDetails" @click="toConfDetails()">配置详情</li>
        <li class="menu__driver" @click.stop="toTestDrive">预约试驾</li>
        <li class="menu__operate">操作说明</li>
      </ul>
    </div>
  </div>
</template>

<script>
  //import interActiveHandler from '@/common/InterActiveHandler';//引入用户交互代理
  //import globalConfig from '@/globalConfig';
  //import commonApi from '@/common/commonApi.js';//引入公共js
  import ModeDrive from '@/packages/mode-drive';
  import saveGarageOrder from '@/component/save-garage-order';
  import interActiveHandler from "@/common/InterActiveHandler"; //引入用户交互代理
  export default {
    data() {
      return {
        unfold: false,  //右下角菜单
        modeType:'pc'
      }
    },
    props: [
      'showCarDetails'    //显示配置详情(只有选配页面,确认配置,车型详情页面才显示)
    ],
      mounted() {
         this.modeType = ModeDrive.getModel();
      },
   
    methods: {
      toConfDetails(){
        this.$emit("toConfDetails",{})
      },
      //在线客服
      goToOnlineChat(){
        interActiveHandler.goToOnlineChatView();
      },
      showMenu() {
        if(this.unfold === false){
          this.unfold = true;
         document.getElementById('right__menu').addEventListener('click', this.hidenMenu);
        }else{
          this.hidenMenu()
        }
      },
      toTestDrive(){
        this.hidenMenu()
        this.$router.push({name:'testdrive'})
      },

      //去我的车库
      gotoGarage(){
        
         this.hidenMenu()
         this.$router.push({name:'myGarage'});

      },
      toCarDetails(){
        this.hidenMenu()
        this.$router.push({name:'cardetails'})
      },
      tofeedback(){
        this.hidenMenu()
        this.$router.push({name:'feedback'})
      },
      hidenMenu () {
        this.unfold = false;
        document.getElementById('right__menu').removeEventListener('click', this.hidenMenu);
      },
      beforeDestroy(){
         this.hidenMenu()
      }
    }
  }
</script>

<style scoped>
  @import '../../../static/style/global.css';
  @import '../../../static/style/animate.css';
  .right__menu{display: inline-block;vertical-align: middle;}
  .right__menu .menu__icon {
    display: inline-block;vertical-align: middle;width: 1rem;height: 1rem;border:0.02rem solid #4d4f4f;border-radius: 50%;
    background: rgba(26,26,26,0.8) url(../../../static/images/menuIcon.png) no-repeat;
    background-size: 6rem auto;background-position:-2rem 0;
    position: fixed;top:0.7rem;right:2.78rem;box-sizing:content-box;
  }
  .right__menu .other__menu{
    display:none;position: fixed;top:0;left:0;width:100%;height: 100%;background: rgba(0,0,0,0.7);z-index:7000;
  }
  .right__menu.unfold .menu__icon{z-index: 7001;border:0.02rem solid #ffa401;}
  .right__menu.unfold .other__menu{display: block;}
  .right__menu .menu__ul {
    position: fixed;right:-1.22rem;top:2rem;z-index: 7001;
  }
  .right__menu .menu__ul li {
    display: block;width:5rem;height: 1.2rem;background: url(../../../static/images/menuDetailIcons.png) no-repeat;background-size: 5rem auto;padding-left: 1.02rem;color: #fff;font-size: 0.3rem;line-height: 1.2rem;
  }
    .right__menu .menu__ul li a{color: #fff;}
  .right__menu .menu__ul li.menu__feedback{background-position: 0 0;}
  .right__menu .menu__ul li.menu__carbarn{background-position: 0 -1.2rem;}
  .right__menu .menu__ul li.menu__customer{background-position: 0 -2.4rem;}
  .right__menu .menu__ul li.menu__config{background-position: 0 -3.6rem;}
  .right__menu .menu__ul li.menu__driver{background-position: 0 -4.8rem;}
  .right__menu .menu__ul li.menu__operate{background-position: 0 -6rem;}
  .slideInDown{
    animation:slideInDown 0.2s linear 0.1s both;
    -webkit-animation:slideInDown 0.2s linear 0.1s both;
  }
  .slideOutUp{
    animation:slideOutUp 0.2s linear both;
    -webkit-animation:slideOutUp 0.2s linear both;
  }
  @media only screen and (min-width: 736px) and (max-width: 811px) {

  }
</style>
