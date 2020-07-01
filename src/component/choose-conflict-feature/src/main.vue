<template>
  <div v-show="visible">
    <div class="overlay" v-show="visible"></div>
    <transition name="smallTolarge_t60">
      <div class="lightBox conflictBox" v-show="visible">
        <a href="javascript:;" @click="userCancel" class="closeBox" ></a>
        <h2 class="lightBox__title"><span>配置变更</span></h2>
        <div class="lightBox__cont clearfix">
          <div class="lightBox__cont--left fl">
            <div class="item__block--tips">您所选的 <span class="blueC">1.5直喷发动机+7DC</span> 配置即将发生变更</div>
            <div class="item__block remove__block">
                <h2 class="item__block-title">以下配置将会被移除</h2>
                <vue-scroll :ops="ops">
                  <ul v-show="showRemoveFeatures.length!=0">
                      <li v-for="feature in showRemoveFeatures">{{feature.nameZh}}</li>
                  </ul>
                </vue-scroll>
            </div>
            <div class="item__block add__block">
                <h2 class="item__block-title">关联增加配置为</h2>
                <vue-scroll :ops="ops">
                  <ul v-show="showAddFeatures.length!=0">
                      <li v-for="feature in showAddFeatures">{{feature.nameZh}}</li>
                  </ul>
                </vue-scroll>
            </div>
          </div>
          <div class="lightBox__cont--right fl">
              <span class="item__block-des">当前选项价格更新</span>
              <span class="item__block-price"><i class="renIcon">&yen;</i>{{$commonFun.formatPrice(price)}}</span><!--￥-->
              <div class="feature__btnWrap">
                <a href="javascript:;" @click="userCancel">取消</a>
                <a href="javascript:;" @click="applyConflictResolution()" class="confirmBtn">确认</a>
              </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import Vue from 'vue';
  import vuescroll from 'vuescroll';
  Vue.use(vuescroll);
  export default {
    name: 'PDChooseConflictFeature',
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
        showRemoveFeatures: [],
        showAddFeatures: [],
        price: 0,
        priceGap: 0,
        visible: false,
        ops: {
            vuescroll: {},
            scrollPanel: {},
            rail: {
                background: '#5c5c5c',
                opacity: 1,
                border: 'none',
                size: '2px',
                specifyBorderRadius: false,
                gutterOfEnds: null,
                keepShow: false
            },
            bar: {
                onlyShowBarOnScroll: true,
                keepShow: true,
                background: '#fff',
                opacity: 1,
                hoverStyle: false,
                specifyBorderRadius: false,
                minSize: false,
                size: '2px'
            }
        },
      }
    },
    methods: {
      userCancel() {
        this.visible = false
          this.$emit("cancelApply")
      },
      //应用冲突
      applyConflictResolution() {
          this.$emit("applyConflictResolution")
      }
    }
  }
</script>

<style scoped>
.lightBox.conflictBox {width: 12.8rem;margin: 0;height:5.5rem;}
.lightBox .lightBox__cont{
  width: 11rem;height: 4rem;margin: auto
}
.conflictBox .lightBox__cont--left {width: 6rem;height:3rem;margin:0.5rem 0 0 -0.5rem;padding:0rem 0.2rem 0.3rem;background: #6a7589;border:1px solid #666;}
.conflictBox .lightBox__cont--right{
  margin-left:0.5rem;width: 4.2rem;height:3.5rem;padding-top:0.50rem;position: relative;
}
.conflictBox .item__block--tips{
  font-size: 0.22rem;padding:0.1rem 0;height: 0.6rem;display: flex;align-items:center;
}
.conflictBox .item__block {display: inline-block;vertical-align:top;width:2.68rem;background: #9ca4b3;margin-right: 0.2rem;padding:0.1rem 0.2rem 0.3rem;}
.conflictBox .item__block.add__block{
  margin-right: 0;
}
.conflictBox .item__block-title {color: #fff; margin-bottom: 0.30rem; font-size: 0.18rem;line-height: 0.32rem;margin-bottom: 0.1rem;font-weight: normal;}
.conflictBox .item__block ul{
  display: block;width: 100%;height: 1.4rem;padding-right: 0.2rem;
}
.conflictBox .item__block li {padding:0.1rem 0;font-size: 0.18rem;}
.conflictBox .item__block.remove__block li{color:#333;}
.conflictBox .item__block.add__block li{color:#333;}
.conflictBox .item__block-des {display:block; margin-bottom: 0.2rem; color: #fff; font-size: 0.26rem;line-height: 1em;}
.conflictBox .item__block-price {display:block;font-size: 0.36rem;color:#01aeff;}
.conflictBox .feature__btnWrap{
  position: absolute;bottom: 0rem;left: 0;
}
.lightBox .feature__btnWrap a.confirmBtn{margin-right: 0;}

</style>
