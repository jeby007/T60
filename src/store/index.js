import Vue from 'vue'
import Vuex from 'vuex'

import vehicle from './modules/vehicle'
import boutique from './modules/boutique' //精品
import customBoutique from './modules/customBoutique'//定制精品

Vue.use(Vuex)

export default new Vuex.Store({
	//严格模式，上线去掉，影响性能
 strict: true,
 modules: {
    vehicle,
    boutique,
    customBoutique
 }
})