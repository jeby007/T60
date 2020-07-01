<template>
  <div class="container configDetails">
    <div class="header clearfix">
      <div class="header__right">
        <a href="javascript:void(0);" class="header__closePage" @click="$router.back()">关闭</a>
      </div>
      <div class="header__title" @click="goBack()">{{$t('ConfigDetail')}}</div>
    </div>
    <div class="middleBlockPublic">
    <div class="header__carWrap">
        <!-- <span class="header__carName">T60</span>
        <img src="@/static/images/car45.png" class="header__carImg" alt> -->
        <img src="@/static/images/cardetails-title.png" alt="">
    </div>
      <div class="configDetails__cont clearfix">
        <ul class="tabNav fl">
          <li
            :class="{active:selectNav == item}"
            @click="tabNav(item)"
            v-for="(item,key,index) in groupLists"
            :key="index"
          >
            {{item}}
          </li>
        </ul>

        <div class="tabList fl">
          <vue-scroll :ops="ops">
            <ul>
              <li v-for="item in currentValueList" class="clearfix">
                <span class="familyName">{{item.familyName}}</span>
                <span class="featureName">{{item.featureName}}</span>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import commonApi from "@/common/commonFun.js"; //引入公共js
import Menu from './component/Menu';
import Vue from "vue";
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import ModeDrive from '@/packages/mode-drive';
import serverApi from '@/common/serverApi'
import interActiveHandler from "@/common/InterActiveHandler"; //引入用户交互代理
Vue.use(vuescroll);

export default {
  components: {
      Menu
  },
  data() {
    return {
      groupLists: [],     //group列表
      valueList:[],
      currentValueList:[],
      selectNav: '基本选项',      //选中的tab
      ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
          background: '#fff',
          opacity: 0.2,
          border: '50%',
          size: '4px',
          specifyBorderRadius: false,
          gutterOfEnds: null,
          keepShow: false
        },
        bar: {
          onlyShowBarOnScroll: true,
          keepShow: true,
          background: '#fff',
          opacity: 1,
          border: '50%',
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: false,
          size: '4px'
        }           //滚动条初始化样式
      }
    }
  },
  mounted() {
    var _self = this;
    commonApi.init();
  },
  activated: function () {
    this.getConfigurationLists();
  },
  methods: {
    getConfigurationLists: function () {
      let param = {};
      let flag = false;
      if (this.$route.query.garageId !=null) {
        flag = true;
        param = {garageId: this.$route.query.garageId};
      } else if (this.$route.query.sid != null && this.$route.query.mode != null) {
        param = {sid: this.$route.query.sid, mode: this.$route.query.mode};
      } else {
        param = {preorderSid: this.$route.query.preorderSid};
      }


      interActiveHandler.getToken(flag).then((token)=>{
              let modeType = ModeDrive.getModel();
              param['modeType'] = modeType;
              param['token'] = token;
              serverApi.get('Home/Index/getConfigurationDetails',param).then(rs=>{
                    if(rs.error_code==0){
                         this.groupLists = rs.data.group;
                         this.valueList = rs.data.data;
                         this.tabNav(this.groupLists[0]);
                    }
              }).catch(e=>{
                 this.$alert('数据加载失败,稍后再试')
              })

           }).catch(e=>{//token无效
                if(e.error_code !=undefined && e.error_code==100010){
                       interActiveHandler.goToLoginView();
                  }else{
                  }
        })
    },
    tabNav: function (groupname) {
      this.currentValueList  = this.valueList.filter(item=>{
        return item.groupName == groupname
      })
      this.selectNav = groupname;
    },
    goBack: function () {   //返回上一级页面
      this.$router.go(-1);
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../static/style/global.css";

.configDetails__cont {
   position: absolute;left: 50%;top:50%;height: 6.05rem;margin-top:-3.05rem;width: 18.3rem;margin-left: -9rem;color: #fff;
}

.configDetails__cont .tabNav{
    width:3.2rem;
}
.configDetails__cont .tabNav li{
    display: block;height: 0.65rem;line-height:normal;font-size: 0.24rem;color:#999;padding-left: 0.5rem;position: relative;transition:all 0.3s;-webkit-transition:all 0.3s;margin:0.1rem 0;display: flex;align-items: center;
    word-wrap: break-word;word-break: normal;
}
.configDetails__cont .tabNav li a {color:#999;word-wrap: break-word;word-break: normal }
.configDetails__cont .tabNav li.active{
    background: url(../../static/images/navBg.png) no-repeat;background-size:3.2rem auto;padding-left: 0.26rem;word-wrap: break-word;word-break: normal;
}
.configDetails__cont .tabNav li.active a{color:#01aeff;}
.header__carWrap{
  display:flex;justify-content: center;align-items: center;position: fixed;width: 100%;top: 0.6rem;
}
.header__carName{
  display: inline-block;vertical-align: top;width:5.76rem;height: 1.01rem;background: url(../../static/images/headerCarBg.png) no-repeat;background-size: 5.76rem auto;color:#01aeff;font-size: 0.48rem;font-style: italic;line-height: 0.8rem;padding-left: 0.4rem;letter-spacing:0.06rem;
}
.header__carImg{
  display: inline-block;vertical-align: top;width:4.08rem;height:2.3rem;margin-left: -2.7rem;
}

.configDetails__cont .tabList li {
  display: block;
  /* height: 0.56rem; */
  /* line-height: 0.56rem; */
  font-size: 0.2rem;
}
.configDetails__cont .tabList {
  width: 14.64rem;
  height: 6.05rem;
  background: rgba(76,83,98,1);
  padding: 0.25rem;
  border-radius: 0.1rem;
}
.configDetails__cont .tabList .familyName {
  float: left;
  width: 4.2rem;
  padding-left: 0.4rem;
  background: rgba(59, 73, 94, 0.7);
  margin-right: 0.08rem;
  padding:0.15rem 0 0.15rem 0.4rem;
}

.configDetails__cont .tabList .featureName {
  float: left;
  width: 9rem;
  padding-left: 0.8rem;
  background: rgba(256, 256, 256, 0.1);
  padding:0.15rem 0 0.15rem 0.8rem;
}

.configDetails__cont .tabList li:nth-of-type(2n) {
  /* height: 0.56rem; */
  /* line-height: 0.56rem; */
}

.configDetails__cont .tabList li:nth-of-type(2n) .familyName,
.configDetails__cont .tabList li:nth-of-type(2n) .featureName {
  background: transparent;
}

@media only screen and (min-width: 736px) and (max-width: 811px) {
  .configDetails__cont .tabList {
    width: calc(100vw - (1.22 + 4 + 2) * (100 * 100vw / 1920));
    width: -webkit-calc(100vw - (1.22 + 4 + 2) * (100 * 100vw / 1920));
  }

  .configDetails__cont .tabList {
    padding-left: 0.6rem;
  }

  .configDetails__cont .tabList .familyName {
    width: 3rem;
    padding-left: 0.4rem;
  }

  .configDetails__cont .tabList .featureName {
    width: 7.8rem;
  }
}

@media only screen and (min-width: 900px) and (max-width: 1367px) {
  .header__carWrap{top: 1.8rem;}
}
@media only screen and (min-width: 1368px) and (max-width: 1681px) {
  .header__carWrap{top: 1.2rem;}
}
</style>
