<template>

      <div id="threeOptionalDivTop" style="display:none;">

          <div id="threeOptionalDiv" style="width: 100%; height:100%">
              <div class="carsPic" style="width: 100%; height:100%" v-show="visible === true">
                  <div id="container" v-show="appearanceIsShow"></div>
                  <div id="pano" style="width:100%;height:100%;" v-show="panoIsShow"></div>
                  <slot></slot>
              </div>
          </div>
      </div>
</template>
<script>
/**
 */
  export default {
    data() {
      return {
	appearanceIsShow: false,
	panoIsShow: false,
	visible: true,
      }
    },
    created () {
    },
    methods: {
      }
  }
</script>

<style scoped>
</style>
