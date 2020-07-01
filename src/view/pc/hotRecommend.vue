<template>
    <div class="container hotRecommend">
    <div class="header clearfix">
        <div class="header__right">
            <a class="header__btn header__compare" @click="goToCompare()">
                <i class="compareNum" v-show="recommendCarNum">{{recommendCarNum}}</i>
            </a>
            <a v-on:click="goHomePage()" class="header__btn header__home">首页</a>
        </div>
        <div v-on:click="goHomePage()" class="header__title">{{$t("HotOnSale")}}</div>
    </div>
    <div class="middleBlockPublic">
        <div class="hotRecommend__cont clearfix">
          <div class="noData" v-show="noData">暂无数据</div>
          <div class="hotRecommend__lists fl">
              <vue-scroll :ops="ops">
                  <div class="hotRecommend__list clearfix"  v-for="(item,index) in hotRecommendlists"
                  :key="index">
                      <div class="hotRecommend__list--left fl">
                          <div class="carImg">
                              <img class="imgCenter" :src="item.carImg" alt>
                          </div>
                          <h3 class="carName">{{item.name}}</h3>
                          <div class="carPriceWrap clearfix">
                              <span class="original__price blueC">
                                  <i class="renIcon">￥</i>{{$commonFun.formatPrice(item.price)}}
                              </span>
                          </div>
                          <div class="btnWrap clearfix">
                              <a class="fl list__btn" @click="clickCustommade(item)">{{$t("ChooseyourT60")}}</a>
                              <a class="fr list__btn" @click="clickCarDetail(item)">{{$t("Configuration")}}</a>
                          </div>
                          <a href="javascript:void(0);" @click="joinComparison(item,index)" :class="{active:item.compareFlag}" class="compareBtn">对比</a>
                      </div>
                  </div>
              </vue-scroll>
          </div>
        </div>
    </div>

    <!-- tips弹框 start-->
    <div class="alertBox" v-show="showAlertBox">
        <div class="alertBox__text" v-if="recommendCarNum == 2">目前只支持两款车型对比！</div>
        <div class="alertBox__text" v-else-if="recommendCarNum == 0">请选择车型进行对比</div>
        <div class="alertBox__btnWrap">
            <a class="alertBox__btn" @click="showAlertBox = false">确定</a>
        </div>
    </div>
    <!-- tips弹框 end-->
    </div>
</template>

<script>

import commonApi from "@/common/commonFun.js"; //引入公共js
import api from "@/common/api/api.js";
import interActiveHandler from "@/common/InterActiveHandler"; //引入用户交互代理

import Vue from "vue";
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
Vue.use(vuescroll);

export default {
  data() {
    return {
      hotRecommendlists: [], //存放爆款车列表
      brightSpotSplit: [], //车型亮点列表
      recommendCarNum: 0,
      recommendSidMode: [],
      sid: [],
      noData:false,
      showCarDetailsValue: false, //菜单显示配置详情按钮
      showAlertBox: false, //显示alert弹框
      ops: {
        vuescroll: {},
        scrollPanel: {
          initialScrollY: false,
          initialScrollX: false,
          scrollingX: true,
          scrollingY: false,
        },
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
      },
    };
  },
  created() {
    var _self = this;
    localStorage.removeItem("sidModes");
  },
  mounted() {
    //防止键盘弹出 产生位移
    $("select").blur(function() {
      window.scroll(0, 0);
    });
  },
  activated: function() {
    var _self = this;
    commonApi.init();

    //大通监控代码
    //pilot("track", "pageview", "optionConfirm"); //布码后请将page_id的宏替换成具体值
    var sidModes = localStorage.getItem("sidModes");
    if (sidModes != undefined) {
      _self.recommendSidMode = sidModes.split(",");
    }

     // 获取爆款列表
          api.hotsales().then(rs => {
              _self.hotRecommendlists = rs.data;
              if(_self.hotRecommendlists.length==0){
                _self.noData = true;
              }
              _self.recommendCarNum=0;
              _self.hotRecommendlists.forEach( vo=> {
                  var recommendCarStr = vo.sid + ":" + vo.type;
                  if($.inArray(recommendCarStr,_self.recommendSidMode) != -1){
                      vo.compareFlag = true;
                      _self.recommendCarNum++;
                  }else{
                      vo.compareFlag = false;   //添加加入对比属性
                  }
                  _self.$set(vo, 'showStock', false);   //添加显示库存属性
                  _self.$set(vo, 'brightSpotSplit', []);   //添加显示亮点
                  if(vo.brightSpot == ''){
                      vo.brightSpotSplit = [];
                  }else{
                      // vo['brightSpotSplit'] = vo.brightSpot.split('#');
                      _self.$set(vo, 'brightSpotSplit', vo.brightSpot.split('#'));
                  }
                  vo['carImg'] = publicStaticPtah + "/2d/car/" + vo.image + ".png";  //拼接车图片
                  _self.sid.push(vo.sid);
              })
          })

          // _self.getProvince();
    },

  methods: {
    //点击立即定制
    clickCustommade: function(item) {
      // pilot("track", "form", {
      //   frmid: "FF10244",
      //   sid: "",
      //   config_price: item.price,
      //   te_quip: item.desc,
      //   config_name: item.name
      // });

      window.localStorage.setItem("carItem", item);
      this.$router.push({
        name: "optionalcar",
        query: {
          sid: item.sid,
          mode: item.type,
          // id:item.sid      //这个id参数仅为了loadConfigurationOptionWithFeatures接口传参，G50 app中没有
        },
        params: {clearCache: true}
      });
    },
    //点击车型详情
    clickCarDetail: function(item) {
      //pilot("track", "event", "G50Config", "leadclick", "configuration", "1");
      window.localStorage.setItem("carItem", item);
      this.$router.push({
        name: "cardetails",
        query: { sid: item.sid, mode: item.type }
      });
    },
    //加入对比
    joinComparison: function(item, index) {
      var _self = this;
      var recommendCarStr = item.sid + ":" + item.type;
      if ($.inArray(recommendCarStr, _self.recommendSidMode) == -1) {
        //判断最多只让两款车型对比
        if (!item.compareFlag) {
          if (_self.recommendCarNum == 2) {
            _self.showAlertBox = true;
            return false;
          }
        }
        _self.recommendSidMode.push(recommendCarStr);
      } else {
        _self.recommendSidMode.splice(
          $.inArray(recommendCarStr, _self.recommendSidMode),
          1
        );
      }

      // 切换加入对比按钮
      item.compareFlag = !item.compareFlag;

      // 更改加入对比的数字
      var compareNum = 0;
      var tempArr = [];
      _self.hotRecommendlists.forEach(vo => {
        if (vo.compareFlag == true) {
          tempArr.push(vo);
        }
      });
      _self.recommendCarNum = tempArr.length;
      localStorage.setItem("sidModes", _self.recommendSidMode.join(","));
    },
    goHomePage: function() {
      interActiveHandler.goToHomeView();
    },
    goToCompare: function() {
      //跳转车型对比页面
      var _self = this;
      if (_self.recommendCarNum == 0) {
        _self.showAlertBox = true;
      } else {
        var carmode_name = [];
        var config_name = [];
        var carprice = [];
        _self.hotRecommendlists.forEach(item => {
          if ($.inArray(item.sid + ":" + item.type, _self.recommendSidMode) >= 0) {
                carmode_name.push(item.name);
                config_name.push(item.desc);
                carprice.push(item.price);
          }
        });
        // pilot("track", "form", {
        //   frmid: "FF10254",
        //   sid: "",
        //   config_name: config_name.join(),
        //   carmode_name: carmode_name.join(),
        //   carprice: carprice.join()
        // });
        _self.$router.push({ name: "compare" });
      }
    }
  },
  components: {
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import "../../static/style/global.css";
.hotRecommend__cont {
  position: absolute;height: 4.2rem;left: 0;width: 100%;top:50%;margin-top:-2.2rem;
}
.hotRecommend__lists {
  height: 100%;width:100%;text-align: center;
}
.hotRecommend__list {
  display: inline-block;height:4.2rem;margin-right: 0.58rem;color: #fff;
}
.hotRecommend__list--left {
  width: 3.6rem;height: 100%;border-radius: 0.1rem;background: rgba(74,90,115, 0.7);text-align: left;position: relative;padding-top: 0.16rem;
}
.hotRecommend__list .carImg {
  display: block;width: 90%;height: 1.5rem;margin: 0 auto;position: relative;margin-top: 0.2rem;
}
.hotRecommend__list .carImg .imgCenter{
  max-width: 3.3rem;max-height: 1.86rem;
}
.hotRecommend__list .carName {
  padding:0 0.2rem;line-height: 0.44rem;font-size: 0.22rem;font-weight: normal;
}
.hotRecommend__list .carPriceWrap {
  margin-bottom: 0.2rem;padding:0 0.2rem;
}
.hotRecommend__list .carPrice {
  font-size: 0.2rem;line-height: 0.3rem;
}
.hotRecommend__list .btnWrap {
  padding: 0 0.2rem;
}
.hotRecommend__list .list__btn {
  font-size: 0.16rem;width: 1.5rem;height: 0.5rem;line-height: 0.5rem;text-align: center;border-radius: 0.1rem;border: 1px solid #66748f;color: #fff;cursor: pointer;
}
.hotRecommend__list .compareBtn {
  position: absolute;top: 0.1rem;right: 0.1rem;width: 0.6rem;height: 0.6rem;background: url(../../static/images/compareBtn.png) no-repeat;
  background-size: 1.2rem auto;background-position: right top;text-indent: -9999px;
}
.hotRecommend__list .compareBtn.active {
  background-position: left top;
}
</style>
