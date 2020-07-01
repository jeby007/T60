<template>
  <div class="feartureCommentAddWrap">
    <div class="comment">
      <div class="header clearfix" @click="$router.back()">
        <div class="publishIcon"></div>
        <a class="publishBtn">发布评论</a>
      </div>
      <div class="carDetail">
        <three-ganged/>
      </div>
      <div class="commentContent">
        <div class="textareaWrap">
          <textarea placeholder="请输入您想要的评论内容"
                    class="content"
                    wrap="hard"
                    v-model="commentContent"
                    :class="{initial:!commentContent}"
          >
          </textarea>
        </div>
        <div class="textareaHint">20-500字</div>
      </div>
      <div class="fileWrap">
        <ul class="picWrap">
          <li>
            <div class="deletePic"></div>
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1559714360&di=a8127ecdfe2b03a0635ebc0b61c15625&imgtype=jpg&er=1&src=http%3A%2F%2Fimg.mp.itc.cn%2Fupload%2F20170424%2Fcad06fbd939d4c45b86fcf36d49b2dba_th.jpg" alt="">
          </li>
          <li class="addPic">
            <input type="file" name="file" accept="image/*">
          </li>
        </ul>
        <div class="releaseBtn">
          <span>发布</span>
        </div>
      </div>
    </div>
    <div class="mask"></div>
  </div>

</template>
<script>
  import Vue from 'vue'
  import featureComment from './main.js';
  import {Picker} from 'mint-ui'
  import 'mint-ui/lib/style.css'
  import threeGanged from '../../../view/pc/component/threeGanged'
  Vue.component(Picker.name, Picker)
  export default {
    name: 'YPFeatureCommentAdd',
    props: ['featureCode'],
    computed: {},
    data() {
      return {
        dzs: 0,
        pls: 0,
        commentContent:'',
        itemHeightNum:'',
      }
    },
    created() {
      featureComment.countComment({featureCode: this.featureCode}).then(rs => {
        this.dzs = rs.dzs
        this.pls = rs.pls
      });

      //判断是否为PC打开页面
      let sUserAgent = navigator.userAgent.toLowerCase();
      let IsIpad = sUserAgent.match(/ipad/i) == "ipad";
      let IsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      let IsMidp = sUserAgent.match(/midp/i) == "midp";
      let IsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      let IsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      let IsAndroid = sUserAgent.match(/android/i) == "android";
      let IsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      let IsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

      if (!(IsIpad || IsIphoneOs || IsMidp || IsUc7 || IsUc || IsAndroid || IsCE || IsWM)) {
        this.itemHeightNum=115
      }else {
        this.itemHeightNum=36
      }
    },
    methods: {
      tagClick() {
        this.$emit("tagClick", this.featureCode)
      },
      //三级联动滑块触发
      onValuesChange(picker, values) {
        if (values[0] > values[1]) {
          picker.setSlotValue(1, values[0]);
        }
      },
    },
    components:{threeGanged}
  }
</script>

<style scoped>
  .feartureCommentAddWrap{
    padding: 1rem 2.24rem 0; height: 100%;
  }
  .comment>.header{
    display: flex; align-items: center; top: .8rem
  }
  .publishIcon{
    width: .27rem; height: .43rem; background: url("../../../static/images/back.png") no-repeat; background-size: .26rem auto; -webkit-background-size: .26rem auto;
  }
  .publishBtn{
    padding-left: .6rem; vertical-align: middle; height: 0.8rem; line-height: 0.85rem; color: #fff; text-align: center; font-size: 0.32rem;
  }
  .carDetail{
    width: 100%; height: 4.3rem; overflow: hidden; position: relative;
  }
  .commentContent{
    width: 100%; height: 2.64rem; margin-bottom: 0.4rem; color: #636363; position: relative;
  }
  .textareaWrap{
    width: 100%; height:100%; text-align: center; background: #202020; font-size: .36rem; border-radius: .2rem; box-sizing: border-box; border: 1px solid #636363; color: #fff; word-wrap:break-word
  }
  .textareaWrap>.content{
    width: 100%; height: 100%; background: transparent; color: #fff
  }
  .textareaWrap>.content.initial{
    overflow-y:hidden; line-height: 2.64rem; text-align: center
  }
  .textareaHint{
    position: absolute; bottom: .2rem; right: .2rem
  }
  .fileWrap{
    width: 100%; height: 1.85rem; position: relative
  }
  .fileWrap>.picWrap{
    width: 70%; height :100%; display: flex; justify-content: flex-start
  }
  .fileWrap>.picWrap>li{
    width: 1.85rem; height: 1.85rem; margin-right: .2rem; position: relative
  }
  .fileWrap>.picWrap>li>.deletePic{
    width: .52rem; height: .52rem; border-radius: 50%; background: url("../../../static/images/reduceIcon.png") no-repeat; -webkit-background-size: .42rem auto; background-size: .42rem auto; border: .05rem solid #0d0d0c; box-sizing :border-box; position: absolute; top: -.2rem; left: 1.48rem
  }
  .fileWrap>.picWrap>li>img{
    width: 100%; height: 100%;
  }
  .fileWrap>.picWrap>li.addPic{
    border: 1px solid #4e4e4e; box-sizing: border-box; background: url("../../../static/images/filePic.png") no-repeat; -webkit-background-size:1.85rem auto; background-size: 1.85rem auto;
  }
  .fileWrap>.picWrap>li.addPic>input{
    width: 100%; height: 100%; opacity: 0
  }
  .releaseBtn{
    width: 3.38rem; height :.8rem; background: #ffa401; color: #fff; font-size :.36rem; display: flex; justify-content: center; align-items: center; border-radius: 0.15rem; position: absolute; bottom: 0; right: 0; cursor: pointer
  }
  .mask{
    width: 100%; height: 100%; background: rgba(0,0,0,.6); position: fixed; top: 0; left: 0; z-index: -1
  }

</style>
