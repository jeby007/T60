import Vue from 'vue'
import serverApi from '@/common/serverApi'
import area from '@/common/area';
let cardCity = require('./main.vue').default

const CardCity = {
}

let instance ;
/**
 * 优先从请求的参数里获取想要的访问模式 通过参数 _mode_drive_控制显示的模式
 */
CardCity.install = function (Vue) {
	// 创建一个VUE构造器
	let ccfConstructor = Vue.extend(cardCity)
	// 实例化VUE实例
	instance = new ccfConstructor({})
}

/**
 * 上牌  数据
 */
CardCity.valid = function(options = {}) {
    instance.allareas = area;
    //接收挂载位置
    let mountPosition = options.el;
    //将实例传到 指定的挂载点
    instance.vm = instance.$mount(mountPosition);
    //移除应用监听事件
    instance.$off("applyCity")

    return new Promise((resolve) => {
        //TODO 从 sessionlocation里取
        var citycode =  window.localStorage.getItem('city');//用户选择的城市数据
            //获取当前车型是否弹出 上牌城市接口
            serverApi.get("/Home/Index/getIndex.html",{}).then(rs=>{
                let rsdata = rs.data;
            //如果为true 则回调
            if(rsdata['data']['emissionCity']){
                //上牌显示总开关
                instance.visible.visible = true;
                if(citycode == null){
                    // citycode  如果没有值 代表没选择过! 那就显示这个  弹窗选择样式
                    instance.visible.visibleChoice = true;
                }else{
                    // citycode  如果有值 代表选择过! 那就隐藏这个  弹窗选择样式
                    instance.visible.visibleChoice = false;
                    //citycode  如果有值 代表选择过! 那就显示这个固定样式
                    instance.visible.visibleFixed = true;
                }
                instance.$on("applyCity", () => {
                    resolve();
                });
            }else{

                //上牌显示总开关
                instance.visible.visible = false;
                resolve();
            }
        });
    });
}
//通过此方法获取 已经选择的城市 传到确认配置页面 暴露
CardCity.getCityCode = function() {
    return new Promise((resolve) => {
        var citycode =  window.localStorage.getItem('city');//用户选择的城市数据
        resolve(citycode);
    });
}

CardCity.getProvinceCode = function() {
    return new Promise(() => {
        var province =  window.localStorage.getItem('province');//用户选择的省份数据
        var citycode =  window.localStorage.getItem('city');//用户选择的城市数据
        if(province != null){
            instance.provinceDefault = province;
            instance.cityCycle = instance.getAreabyId(province);
            instance.cityname = instance.obtainLicensedData[province]['city'][citycode];
            //拿到城市code
            instance.cityDefault = citycode;
        }else{
            //获取默认城市
            return new Promise(() => {
                serverApi.get("/Home/Inventorycar/ipGetCity.html",{}).then(rs=>{
                    var getcityIdbynames = instance.getcityIdbyname(rs['data']);
                    instance.cityCycle = instance.getAreabyId(getcityIdbynames['province'])
                    instance.provinceDefault = getcityIdbynames['province'];
                    instance.cityDefault = getcityIdbynames['city'];
                    // this.selectedareatext = this.allareas[this.selectedarea]['name'];
                    instance.cityname = instance.obtainLicensedData[instance.provinceDefault]['city'][instance.cityDefault];
                });
            });
        }
    })
}

CardCity.setProvinceCity = function(options = {}) {
    //设置省份城市数据
    let province = options.province;
    let city = options.city;
    window.localStorage.setItem('province',province);//设置省份数据
    window.localStorage.setItem('city',city);//设置城市数据
    //设置选择的城市
    instance.cityname =  instance.obtainLicensedData[instance.provinceDefault]['city'][instance.cityDefault];
    instance.visible.visibleFixed = true;//固定等true
    instance.visible.visibleChoice = false;//弹窗关闭
}

export default CardCity
