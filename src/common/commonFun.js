/**
 * 公共脚本
 * @type {{get: module.exports.get}}
 */
import globalConfig from '@/globalConfig'
export default {
    setGifImgFeatureCodes(codes) {
        this.gifImgFeatureCodes = codes;
    },
    //2D图是 gif后缀的 代码 例如 发动机
    gifImgFeatureCodes: [],
    /**
     * 页面初始化自适应
     */
    init: function () {
        var screenWidth = $(window).width();
        if (screenWidth > 1920) {
            $("html").css({
                "font-size": "100px"
            })
        }else {
            $("html").css({
                "font-size": 100 * screenWidth / 1920 + "px"
            });
        }
    },
    S4: function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    guid: function () {
        let _self = this;
        return (_self.S4() + _self.S4() + "-" + _self.S4() + "-" + _self.S4() + "-" + _self.S4() + "-" + _self.S4() + _self.S4() + _self.S4());
    },
    isWeiXin: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    judgeIpad: function () {
        // var sUserAgent = navigator.userAgent.toLowerCase();
        // var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var isIpad = false;
        if (/(iPad)/i.test(navigator.userAgent)) {
            isIpad = true;
        }
        return isIpad;
    },
    familyName: function (family) {
        //TODO 中英文判断
        if (family)
            return family.nameEn;
    },
    featureName: function (feature) {
        //TODO 中英文判断
        if (feature)
            return feature.nameEn;
    },
    featureImage: function (feature) {
        let ext = ".png";
        if (this.gifImgFeatureCodes.indexOf(feature.code) != -1) {
            ext = ".gif"
        }
        //TODO 中英文判断
        if (feature)
            return globalConfig.publicStaticPtah + '/2d/' + feature.familyCode + '/' + feature.code + ext;
    },
    featureIcon: function (feature) {
        if (feature)
            return globalConfig.publicStaticPtah + '/icon/' + feature.familyCode + '/' + feature.code + '.png';
    },

    /**
     * 格式化金额
     */
    formatPrice: function (number) {
        if (isNaN(number) || number == "") return "0";
        number = Math.round(number * 100) / 100;
        if (number < 0)
            return '-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '');
        else
            return this.outputdollars(Math.floor(number - 0) + '')
    },
    outputdollars: function (number) { //格式化金额
        if (number.length <= 3)
            return (number == '' ? '0' : number);
        else {
            var mod = number.length % 3;
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (let i = 0; i < Math.floor(number.length / 3); i++) {
                if ((mod == 0) && (i == 0))
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                else
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            return (output);
        }
    },
    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);

        if (window.route.app && window.route.app._route && window.route.app._route.query) {
            if (window.route.app._route.query['ticket']) {
                return window.route.app._route.query['ticket'];
            }
        }
        /*
         r = window.location.hash.substr(1).match(reg);
         if (r != null) return unescape(r[2]);

         */
        return null;
    },
    //数组取交集
    intersect: function (arr1, arr2) {
        if (Object.prototype.toString.call(arr1) === "[object Array]" && Object.prototype.toString.call(arr2) === "[object Array]") {
            return arr1.filter(function (v) {
                return arr2.indexOf(v) !== -1
            })
        }
    },
    //获取url中"?"符后的字串
    GetRequest: function () {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }

        if (window.route.app && window.route.app._route && window.route.app._route.query) {
            for(let k in window.route.app._route.query){
                theRequest[k] = window.route.app._route.query[k]
            }
        }
        return theRequest;
    },
    //合并两个对象,转换成字符串
    mergeObjToStr: function (params1, params2, params3) {
        var newparams = $.extend({}, params1, params2); //保存object1和2合并后产生新对象，若2中有与1相同的key，默认2将会覆盖1的值
        let paramsStr = '';
        for (var paramKey in newparams) {
            paramsStr += `${paramKey}=${newparams[paramKey]}&`

        }
        if (paramsStr != '') {
            paramsStr = paramsStr.substring(0, paramsStr.length - 1);
        }
        return paramsStr;


    },
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    },
    //时间戳转为时间格式
    timestampToTime: function (timestamp) {
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + "-";
        var M =
            (date.getMonth() + 1 < 10 ?
                "0" + (date.getMonth() + 1) :
                date.getMonth() + 1) + "-";
        var D = date.getDate() + " ";
        var h = date.getHours() + ":";
        var m = date.getMinutes() + ":";
        var s = date.getSeconds();
        return Y + M + D + h + m + s;
    },
    //对象转数组
    objToArray : function (obj){
        var arr = [];
        for(var i in obj){
            arr.push(obj[i]);
        }
        return arr;
    }
};
