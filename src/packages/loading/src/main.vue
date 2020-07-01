<template>
	<!-- <div v-if="visible === true">
		<div class="overlay" v-show="visible" @click="clickOverLay"></div>
		<div>显示文案:{{text}}</div>
		<div>进度:{{progress}}</div>
	</div> -->
	<div class="loadingWrap" v-if="visible === true" @click="clickOverLay">
        <div class="loadingMiddle">
            <div v-if="progress<=0" class="loading">...</div>
            <div v-else class="loadingPer">{{progress}}%</div>
        </div>
    </div>
</template>
<script>
/**
 */
  export default {
  props: ['progress','clickHide','text'],
    data() {
      return {
	       visible: false,
      }
    },
    created () {
    },
    methods: {
	    clickOverLay () {
		if(this.clickHide === true){
			this.$emit("hideLoad")
		}
	    }
    }
  }
</script>

<style scoped>
.loadingWrap{
    position: fixed;top:0;left: 0;width:100vw;height: 100vh;background: rgba(0,0,0,0.8);z-index: 8000;
}
.loadingWrap .loadingMiddle{position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin:auto; width: 280px; height: 128px; background:url(../loading.png) no-repeat;background-size: 280px auto;z-index:999}
.loadingWrap .loading {
   position: absolute;left: 200px;bottom:5px;width: 1.5em;height: 1.1em;display: inline-block;vertical-align: bottom;overflow: hidden;color: #fff;font-size: 16px;font-weight: bold;
    animation:dotAnimate 1s infinite step-start;
    -webkit-animation:dotAnimate 1s infinite step-start;
}
.loadingWrap .loadingPer{
   position: absolute;left: 200px;bottom:5px;display: block;line-height: 20px;color: #fff;font-size:22px;
}
@keyframes dotAnimate {
    0% { width: 0; margin-right: 1.5em; }
    33% { width: .5em; margin-right: 1em; }
    66% { width: 1em; margin-right: .5em; }
    100% { width: 1.5em; margin-right: 0;}
}
@-webkit-keyframes dotAnimate {
    0% { width: 0; margin-right: 1.5em; }
    33% { width: .5em; margin-right: 1em; }
    66% { width: 1em; margin-right: .5em; }
    100% { width: 1.5em; margin-right: 0;}
}

/*pc  loading 样式*/
@media only screen and (min-width: 1366px) {
  .loadingWrap .loadingMiddle{width: 550px; height: 280px; background:url(../loadingPC.png) no-repeat;background-size:550px auto;z-index:999;}
  .loadingWrap .loading,.loadingWrap .loadingPer{
     left:380px;bottom:25px;font-size: 38px;font-weight: bold;
  }
}
</style>
