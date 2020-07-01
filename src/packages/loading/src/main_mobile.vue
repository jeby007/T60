<template>
	  <div class="loadingWrapMob" v-if="visible === true" @click="clickOverLay">
        <span class="loadingImg"></span>
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
.loadingWrapMob{
    position: fixed;top:0;left: 0;width:100vw;height: 100vh;background: #fff;z-index: 8000;
}
.loadingWrapMob .loadingImg{
  position: absolute;top:0;left: 0;bottom:0;right: 0;margin:auto;width:210px;height:40px;background: url(../loading.gif) no-repeat;background-size: 210px auto;
}

</style>
