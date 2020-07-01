<template>
  <div id="app">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <div id="flashDiv"></div>
  </div>
</template>
<script>

import Vue from 'vue';
//3D配车
import ThreeOptional from '@/packages/three-optional';
import familyMerge from '@/common/familyMerge.js' //组合项
import ModeDrive from '@/packages/mode-drive';
//全局配置文件
import GlobalConfig from './globalConfig';
export default {
  created () {
    this.$loading.show({
      progress: 0,
      clickHide: true
    });
  },
  mounted () {
    this.$loading.hide();
    Vue.use(ThreeOptional,
      {
        el: "#flashDiv",
        code: GlobalConfig.threeOptionalCode,
        path: 'wap',
        familyMerge: familyMerge,
        appearanceHotspotCodes: ['5','440','K15','K25','K50','M_003','M_004','M_005','M_009','M_00C','M_00E'],
        panoHotspotCodes: ['M_006','M_007','M_00F','M77','S30']
      })
  },
}
</script>

<style scoped>
</style>
