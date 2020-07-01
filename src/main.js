import './common/rem';
import Vue from 'vue';
import App from './App.vue';
import {router} from './router';
import Header from './view/mobile/component/Header'
import Footer from "./view/mobile/component/Footer";


//wap端Header注册全局组件
Vue.component('Header', Header)
//wap端Footer全局组件
Vue.component('Footer', Footer)
//全局配置文件
import GlobalConfig from './globalConfig';

Vue.use(GlobalConfig)

//请求
import serverApi from '@/common/serverApi'

Vue.use(serverApi)

//全局事件
import commonFun from '@/common/commonFun'

commonFun.setGifImgFeatureCodes([]);//设置2D图后缀是gif的代码
Vue.prototype.$commonFun = commonFun

//识别访问模式 pc? mobile? app
import ModeDrive from '@/packages/mode-drive';
//ModeDrive.setModeDriveType('app')
Vue.use(ModeDrive)

// import Vconsole from 'vconsole'
// if(process.env.NODE_ENV ==='development'){
//   require(['vconsole'],(Vconsole)=>{
//   new Vconsole()
//   })

// }

//统一提示框
import MessageBox from '@/packages/message-box';

Vue.use(MessageBox)

//引入animated动画
import animated from 'animate.css'

Vue.use(animated)

//图片
import Img from '@/packages/img';

Vue.use(Img)


//加载中
import Loading from "@/packages/loading/src/main";

Vue.use(Loading)

//冲突项
import ChooseConflictFeature from '@/component/choose-conflict-feature';

Vue.use(ChooseConflictFeature)

//展示feature给用户选择
import ShowFeatureDialog from '@/component/show-feature-dialog';

Vue.use(ShowFeatureDialog)

//上牌城市选择
import CardCity from '@/component/card-city';

Vue.use(CardCity)


//保存车库
import saveGarageOrder from '@/component/save-garage-order';

Vue.use(saveGarageOrder)

import store from './store/index';

//国际化
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)


import axios from 'axios'
import Qs from 'qs'


Vue.prototype.axios = axios;
Vue.prototype.qs = Qs;


const i18n = new VueI18n({
  locale: 'zh', // 语言标识
  messages: {
    'zh': require('./common/lang/zh'),
    'en': require('./common/lang/en')
  }
})

window.route = router;
window.onresize = function () {
  // 页面初始化自适应
  if (ModeDrive.isPc()) {
    commonFun.init()
  }
}
//图片懒加载
new Vue({
  store,
  i18n,
  router,
  el: '#app',
  render: h => h(App)
});
