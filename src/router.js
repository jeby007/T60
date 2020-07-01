import Vue from 'vue';
import Router from 'vue-router';
import ModeDrive from '@/packages/mode-drive';
import commonFun from '@/common/commonFun'
import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'
import interActiveHandler from '@/common/InterActiveHandler'

Vue.use(Router);

/**
*这里控制什么端 引用什么页面
*/
const loadTMplByModeDrive = function (view) {
	/*if(ModeDrive.isPc()){
		require([view.pc + ""],resolve)
	}
	if(ModeDrive.isMobile()){
		require([view.mobile + ""],resolve)
  }
  if(ModeDrive.isApp()){
		require([view.pc + ""],resolve)
  }*/
  if(ModeDrive.isPc()){
		return view.pc();
	}
	if(ModeDrive.isWap()){
		if(typeof(view.wap) =='function'){
			return view.wap()
		}else{
			return view.pc();
		}
	}
  if(ModeDrive.isApp()){
    return view.pc();
  }

}


const routes = [
    {
        path: '*',
        redirect: { name: 'home' }
    },{
        name: 'home',
        path: '/home',
        component: (resolve) => loadTMplByModeDrive({
        pc: () => {
          return import("@/view/pc/home.vue");
        },
        wap: () => {
          return import("@/view/mobile/home.vue");
        },
        }),
        meta: {
          title: '首页'
        }
    },{
        name: 'optionalcar',
        path: '/optionalcar',
        component: (resolve) => loadTMplByModeDrive({
        	pc: () => {
        		return import("@/view/pc/optionalCar.vue");
        	},
          wap: () => {
            return import("@/view/mobile/optionalCar.vue");
          }
        }),
        meta: {
          title: 'T60-个性化选配'
        }
    },{
        name: 'hotrecommend',
        path: '/hotrecommend',
        component: (resolve) => loadTMplByModeDrive({
            pc: () => {
                return import("@/view/pc/hotRecommend.vue");
            },
            wap: () => {
                return import("@/view/mobile/hotRecommend.vue");
            },
        }),
        meta: {
          title: '热销推荐'
        }
    },{
        name: 'configDetails',
        path: '/configDetails',
        component: (resolve) => loadTMplByModeDrive({
            pc: () => {
                return import("@/view/pc/configDetails.vue");
            },
            wap:() => {
              return import("@/view/mobile/configDetails.vue")
            }
        }),
        meta: {
          title: '确认配置'
        }
    },{
        name: 'cardetails',
        path: '/cardetails',
        component: (resolve) => loadTMplByModeDrive({
        	pc: () => {
        		return import("@/view/pc/carDetails.vue");
        	},
          wap: () =>{
        	  return import("@/view/mobile/carDetails.vue")
          }
        }),
        meta: {
          title: '车型详情'
        }
    },{
        name: 'compare',
        path: '/compare',
        component: (resolve) => loadTMplByModeDrive({
        	pc: () => {
        		return import("@/view/pc/compare.vue");
        	},
          wap: () => {
        	  return import("@/view/mobile/compare.vue");
          }
        }),
        meta: {
          title: '车型对比'
        }
    },{
        name: 'shoppingcart',
        path: '/shoppingcart',
        component: (resolve) => loadTMplByModeDrive({
        	pc: () => {
        		return import("@/view/pc/shoppingCart.vue");
        	},
        }),
        meta: {
          title: '购物清单'
        }
    },{
        name: 'downloadlist',
        path: '/downloadlist',
        component: (resolve) => loadTMplByModeDrive({
        	pc: () => {
        		return import("@/view/pc/downloadlist.vue");
        	},
          wap: () => {
        	  return import("@/view/mobile/downloadlist.vue")
          }
        }),
        meta: {
          title: '下载列表'
        }
    },{
      name: 'configurationList',
      path: '/configurationList',
      component: (resolve) => loadTMplByModeDrive({
        pc: () => {
          return import("@/view/pc/configurationList.vue");
        },
        wap: () => {
          return import("@/view/mobile/configurationList.vue")
        }
      }),
      meta: {
        title: '配置详情'
      }
  }
];

// add route path
routes.forEach(route => {
  route.path = route.path || '/' + (route.name || '');
});

const router = new Router({
  //mode:'history',
  routes
});

router.beforeEach((to, from, next) => {
	// 页面初始化自适应

	//commonFun.init()
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }

  // 清理缓存 之所以放在 params里 是为了解决用户刷新问题 以及页面从定向防止清数据
  if(to.params.clearCache === true){
    boutiqueVehicleComplex.clearData()
	console.info("清空===>",to)
  }
  if(to.meta && to.meta.needLogin === true){ //登录验证
			console.info('路由验证token')
          interActiveHandler.getToken(true).then((token)=>{ //正确用户
				console.info('路由验证通过')
			  next()
          }).catch((e)=>{//token无效
				console.info('路由验证token无效')
              interActiveHandler.goToLoginView().then(()=>{
					next()
			   });
          });
  }else{
	  next();
  }

});

router.afterEach((route,Vue) => {
})

export {
  router
};
