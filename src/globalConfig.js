import Vue from 'vue'
import prodConfig from './config/ProdConfig'
import testConfig from './config/TestConfig'
/**
* 默认为开发环境
*默认的配置文件 如果对应的环境里配置了 会把默认的给覆盖
*/
const defaultPropertys = {
	//接口请求地址 结尾没有
	// /*apiDomain: 'http://t60enapi.datong.yappam.com/index.php',*/
	apiDomain: 'http://192.168.6.163/t60enapi/trunk/index.php',
	//apiDomain: 'http://192.168.6.119/d60api_all/trunk/index.php',

	WebSiteDomain: 'http://192.168.6.163:8181',

	//静态资源地址
	publicStaticPtah: '/static/material',

	mallProductUrl: 'https://mall.saicmaxus.com/stockcar/product/detail', //现车下单地址

	productCode:'T60', //当前车型

	threeOptionalCode:'T60_haiwai' //3D配车的路径
}







const GlobalConfig = {
}
/**
* 组装配置属性
*/
GlobalConfig.buildPropertys  = function () {

	let propertys = defaultPropertys;
	if(process.env.NODE_ENV === 'production'){
		propertys = Object.assign({}, propertys, prodConfig);
	}else if(process.env.NODE_ENV === 'test') {
		propertys = Object.assign({}, propertys, testConfig);
	}

	for (let k in propertys)
	{
		this[k] = propertys[k]
	}
}





GlobalConfig.install = function (){
	this.buildPropertys();
}
/**
 *	npm run build-prod
 production 正式环境
 development 开发
 test 测试

export default {
    //接口请求地址 结尾么有
    //apiDomain: 'http://api.yappam.com',


	apiDomain: process.env.NODE_ENV === 'production' ?  'http://api.yappam.com' : 'http://192.168.6.119/g50api_xuexi/index.php',

	WebSiteDomain:process.env.NODE_ENV === 'production' ?  'http://www.yappam.com' : 'http://test.www.yappam.com',
	//静态资源地址
	publicStaticPtah: process.env.NODE_ENV === 'production' ?  '/static/material' : '/static/material'


}
**/

export default GlobalConfig

