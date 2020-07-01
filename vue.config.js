const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  //编译输出路径
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  ////默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
  filenameHashing: true,
  /**
   * 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
   *  打包之后发现map文件过大，项目文件体积很大，设置为false就可以不输出map文件
   *  map文件的作用在于：项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
   *  有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
   * */
  productionSourceMap: false,
  configureWebpack:(config)=>{
  
	   //删除console插件
		let plugins = [
		  new UglifyJsPlugin({
			uglifyOptions: {
			  compress: {
				//warnings: false,
				drop_console:true,
				drop_debugger:true
			  },
			  output:{
				// 去掉注释内容
				comments: false,
			  }
			},
			sourceMap: false,
			parallel: true,
		  })
		];

	//只有打包生产环境才需要将console删除
    if(process.env.VUE_APP_build_type=='production'){
      config.plugins = [...config.plugins, ...plugins];
    }
  },
  //关闭预加载路由 https://blog.csdn.net/sinat_35538827/article/details/87969834
  chainWebpack: config => {
	    // 移除 prefetch 插件
		config.plugins.delete('prefetch')
  },
  // webpack-dev-server 相关配置
  devServer: {
     //open: process.platform === 'darwin',
     host: '0.0.0.0',
     port: 8181
  },
	//swiper  转es5 @see https://www.jb51.net/article/147140.htm
	transpileDependencies: [
		"swiper",
		"dom7",
		"ssr-window"
	]
};
