<template>
    <div v-show="visible.visible">
        <br>
        <br>
        <!-- 添加样式的时候     style样式 和 <br>标签     可删除,这是测试时候加的 -->
        <div v-show="visible.visibleFixed" @click="visible['visibleChoice'] = true" style="color:red">上牌城市: <a href="javascript:;" style="color:#bfec9e;">{{cityname}}</a></div>
        <div v-show="visible.visibleChoice">
            <div><span>选择城市</span></div>
            <!-- 省份开始 -->
            <select name="" v-model="provinceDefault" @change="getcity(provinceDefault)">
                <option v-for="(itam,index) in provinceCycle" :value="index" :key="index">{{itam.name}}</option>
            </select>
            <!-- 城市开始 -->
            <select name="" v-model="cityDefault">
                <option v-for="(itam,index) in cityCycle" :value="index" :key="index">{{itam}}</option>
            </select>
            <button @click="applyCity" type="button" style="margin-left:20px">点我</button>
        </div>

    </div>
</template>
<script>
import serverApi from '@/common/serverApi'
import area from '@/common/area';
    export default {
        name: 'YpCardCity',
        data() {
            return {
                visible: {
                    'visible':false,//全部 是否显示
                    'visibleChoice':false,//选择弹窗 是否显示
                    'visibleFixed':false,//固定样式 是否显示
                },//状态 是否显示
                provinceDefault:'',//省份默认
                cityDefault:'',//城市默认
                provinceCycle:[],//省份循环
                cityCycle:[],//城市循环
                obtainLicensedData: [],//获取上牌数据
                cityname: '上海'
            }
        },
        created () {
            this.obtainLicensedData = area;
        },
        mounted(){
            this.initCity();
        },
        methods: {
            initCity () {
                this.provinceCycle = area;
                //调用这个方法
                this.$cardCity.getProvinceCode();
            },
            //获取城市数组
            getAreabyId(areaid) {
                for(var i in this.obtainLicensedData){
                    if(areaid==i){
                        return this.obtainLicensedData[i]['city'];
                    }
                }
            },
            //获取城市和省份 根据name
            getcityIdbyname(arr) {
                var NameArr = {};
                for (var i in this.obtainLicensedData){
                    if(this.obtainLicensedData[i]['name']==arr['province']){
                        NameArr['province'] = i;
                    }
                    for(var k in this.obtainLicensedData[i]['city']){
                        if(this.obtainLicensedData[i]['city'][k]==arr['city']){
                            NameArr['city'] = k;
                        }
                    }
                }
                return NameArr;
            },
            //根据省获取城市
            getcity(selected) {
                // _self.selectedareatext = _self.allareas[selected]['name'];//省份
                // this.cityname = this.getAreabyId(selected);//城市
                for (var k in this.provinceCycle) {
                    if (selected == k) {
                        this.cityDefault = Number(k) + 100;//加10就是默认第一个城市
                        this.cityCycle = this.provinceCycle[k]['city'];//获取 城市的数组
                    }
                }
            },
            applyCity() {
                //点击确定设置 城市和省份
                this.$cardCity.setProvinceCity({province:this.provinceDefault,city:this.cityDefault});
            },
            closeORenter() {
                //关闭上牌弹窗
                this.visible.visibleChoice = false;
            },
        }
    }
</script>

<style scoped>

</style>
