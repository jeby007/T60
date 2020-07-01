
var webSiteCDNURLList = []
var webSiteURL = "";
var web_app = ""; //app 有背景 web 无背景
/**
* 标识外观可以开始操作了
*/
var carStartFunc = function(){
	
}

/**
* 渲染加载进度
*/        
var carExtLoading = function(value){
	console.log("开始加载-");
	console.log('加载百分比',value);
}


//全部完毕
var carExtLoadingEnd = function(){
	
	console.log('全部完毕');
}
//内饰加载完毕
var panoReady = function () {
	 
}
/**
* 标识内饰可以开始操作了
*/
var carLodingOver = function(){
	
}

//监听外观 3d上面点击的点
document.addEventListener("HotspotClick", function(e) {
	clickAppearanceHotspot(e.hotspotName)
	//console.log(e.hotspotName.substring(2,e.hotspotName.length));
}, false);
//监听内饰 3d上面点击的点
document.addEventListener("HotspotClickInt", function(e) {
		clickPanoHotspot(e.hotspotName)
	 // console.log(e.hotspotName.substring(2,e.hotspotName.length));
});

 
//3d上面点击的事件
var clickAppearanceHotspot = function(hotspotName){
	
}//3d上面点击的事件
var clickPanoHotspot = function(hotspotName){
	
}

	
