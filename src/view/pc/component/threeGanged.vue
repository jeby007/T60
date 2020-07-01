<template>
  <mt-picker :slots="slots" @change="onValuesChange" value-key="name" :item-height="itemHeightNum"></mt-picker>
</template>

<script>
  import Vue from 'vue'
  import {Picker} from 'mint-ui'
  import 'mint-ui/lib/style.css'
  Vue.component(Picker.name, Picker)

  //引入测试数据
  //import address from '../../../static/js/testData/data'
  export default {
    name: "threeGanged",
    data(){
      return {
        itemHeightNum:null,
        slots: [
          {
            flex: 1,
            values: address,    //第一级slots数据来源
            defaultIndex:1,     //第一级默认选中的slots下标
            className: 'slot1', //对应的slot
            textAlign: 'center' //对齐方式
          },
          {
            flex: 1,
            values: address[0].childs,
            defaultIndex:0,
            className: 'slot2',
            textAlign: 'center'
          },
          {
            flex: 1,
            values: address[0].childs[0].childs,
            defaultIndex:0,
            className: 'slot3',
            textAlign: 'center'
          }
        ],
        myAdress:null
      }
    },
    created() {
      let sUserAgent = navigator.userAgent.toLowerCase();
      let IsIpad = sUserAgent.match(/ipad/i) == "ipad";
      let IsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
      let IsMidp = sUserAgent.match(/midp/i) == "midp";
      let IsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
      let IsUc = sUserAgent.match(/ucweb/i) == "ucweb";
      let IsAndroid = sUserAgent.match(/android/i) == "android";
      let IsCE = sUserAgent.match(/windows ce/i) == "windows ce";
      let IsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";

      if (!(IsIpad || IsIphoneOs || IsMidp || IsUc7 || IsUc || IsAndroid || IsCE || IsWM)) {
        this.itemHeightNum=115
      }else {
        this.itemHeightNum=36
      }

    },
    methods: {
      //三级联动滑块触发
      onValuesChange(picker, values) {
        if(!values[0]){
          this.$nextTick(()=>{
            if(this.myAdress){
              // 赋默认值
            }else{
              picker.setValues([address[0],address[0].childs[0],address[0].childs[0].childs[0]])
            }
          });
        }else{
          picker.setSlotValues(1, values[0].childs);
          let town = [];
          if(values[1]){
            town = values[1].childs;
          }
          picker.setSlotValues(2,town);
        }
      }
    },
  }
</script>

<style scoped>
  >>>.picker{
    width: 100%; position :absolute; top: -1.2rem; left: 0
  }
  >>>.picker-items  .picker-slot{
    font-size: .36rem; position: relative;
  }
  >>>.picker-items .picker-slot .picker-slot-wrapper .picker-selected{
    font-size: .42rem ;color: #fff;
  }
  >>>.picker-items .picker-slot .picker-slot-wrapper .picker-selected:before{
    background: transparent !important
  }
  >>>.picker-items .slot1 .picker-slot-wrapper .picker-item:before{
    width: .25rem; height: .30rem; content: ''; position: absolute; top: .54rem; left: 1.8rem; background: url("../../../static/images/lock.png"); -webkit-background-size: .25rem auto; background-size: .25rem auto
  }
  >>>.picker-center-highlight:before{
    background: -webkit-linear-gradient(left,rgba(255, 255, 255, 0),#5DDDD3,rgba(255,255,255,0));
    background: linear-gradient(to right, rgba(255, 255, 255, 0),#5DDDD3,rgba(255,255,255,0));
  }
  >>>.picker-center-highlight:after{
    background: -webkit-linear-gradient(left,rgba(255, 255, 255, 0),#5DDDD3,rgba(255,255,255,0));
    background: linear-gradient(to right, rgba(255, 255, 255, 0),#5DDDD3,rgba(255,255,255,0));
  }
</style>
