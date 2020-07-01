<template>
  <div class="container">
    <div class="container--compare">
      <div class="Download-title clearfix header">
        <!-- <div class="Download-title__left">
          <img src="../../static/images/downloadLogo.png" alt="">
        </div> -->
        <div class="header__title" @click="goback()">{{$t('ConfirmConfiguration')}}</div>
        <div class="Download-title__middle">
          {{$t('ConfigurationOrder')}}
        </div>
      </div>
      <div class="header__scene" @click="savecanvas">
        <span class="sceneIcon"><i></i></span>
        <span class="sceneText">{{$t('Download')}}</span>
      </div>
      <div class="compareCont">
        <vue-scroll :ops="ops">
          <div class="tableWrap">
            <table class="tableNormal" ref="tableNormal">
              <colgroup>
                <col width="33%"/>
                <col width="33%"/>
              </colgroup>
              <thead>
              <tr>
                <th>{{$t('T60TypeName')}} {{Interfacedata.name}}</th>
                <th>{{$t('OrderDate')}} {{Interfacedata.orderDate}}</th>
                <th>{{$t('TotalPrice')}} {{Interfacedata.totalPrice}}</th>
              </tr>
              </thead>
              <tbody>
                <div v-for="(vo,n) in Interfacedata.configurationList" class="itemCol" :key="n">
                  <tr class="typeTitle">
                    <th>{{vo.name}}</th>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr v-for="(item,i) in vo.familyList" :key="i"
                    v-if="vo.familyList[i]['featureList'][0]['display'] && vo.familyList[i]['featureList'].length==1"
                  >
                    <th>{{item.name}}</th>
                    <td>{{item.featureList[0].name}}</td>
                    <td>{{item.featureList[0].price}}</td>
                  </tr>
                  <tr v-for="(item,i) in vo.familyList" :key="i"
                    v-if="vo.familyList[i]['featureList'].length>1"
                  >
                    <p class="specialName" v-if="item.display">{{item.name}}</p>
                    <div v-for="(itemsa, indexb) in item.featureList" :key="indexb" class="special">
                      <p>{{itemsa.name}}</p>
                      <p class="specialConten">
                        <span v-if="itemsa.standard">✓</span>
                        <span v-if="itemsa.optional">–</span>
                        <span v-if="itemsa.notAvaiable">○</span>
                      </p>
                    </div>
                    <!--<td>{{item.featureList[0].name}}</td>
                    <td>{{item.featureList[0].price}}</td>-->
                  </tr>
                </div>
              </tbody>
            </table>
          </div>
        </vue-scroll>
      </div>
    </div>
  </div>
</template>

<script>
  import commonApi from '@/common/commonFun.js'; //引入公共js
  import serverApi from '@/common/serverApi'
	import { mapState } from 'vuex'
  import html2canvas from 'html2canvas'

	//引入vuescroll
  import Vue from 'vue';
  import vuescroll from 'vuescroll';
  import 'vuescroll/dist/vuescroll.css';

  Vue.use(vuescroll);

  import api from '@/common/api/api.js'; //初始化3d引入js
  import interActiveHandler from '@/common/InterActiveHandler'; //引入用户交互代理
  export default {
    data() {
      return {
        //滚动条
        ops: {
          vuescroll: {},
          scrollPanel: {},
          rail: {
            background: '#fff',
            opacity: 0.2,
            border: 'none',
            size: '4px',
            specifyBorderRadius: false,
            gutterOfEnds: null,
            gutterOfSide: '4px',
            keepShow: false
          },
          bar: {
            onlyShowBarOnScroll: true,
            keepShow: true,
            background: '#fff',
            opacity: 1,
            hoverStyle: false,
            specifyBorderRadius: false,
            minSize: false,
            size: '4px'
          }
        },
				Interfacedata:[],
        isDownload:false
      }
    },
    mounted() {
      commonApi.init();
    },
    activated() {
      this.getToConfigDetails();
    },
    updated(){
      const el = this.$refs.special
      //console.log(window.getComputedStyle(el).width);
    },
    methods: {
      goback() {
        this.$router.go(-1)
      },
      getToConfigDetails() {
        let param = {};
        param['preorderSid'] = this.preorderSid;
        serverApi.get('Home/Index/getloadConfigurationInventory', param).then(rs => {
          this.Interfacedata = rs.data;
        })
      },
      // 下载图片
      savecanvas(){
        let that = this;
        that.isDownload = true
        if (that.isDownload){
          let canvasID = this.$refs.tableNormal;
          let height = $(canvasID).outerHeight(true);
          let a = document.createElement('a');
          html2canvas(canvasID,{scale:2}).then(canvas => {
            let dom = document.body.appendChild(canvas);
            dom.style.display = "none";
            a.style.display = "none";
            document.body.removeChild(dom);
            let blob = that.dataURLToBlob(dom.toDataURL("image/png"));
            a.setAttribute("href", URL.createObjectURL(blob));
            a.setAttribute("download", "configurationList.jpg")
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(blob);
            document.body.removeChild(a);
            that.isDownload = false
          });
        }
      },
      dataURLToBlob(dataurl) {//ie 图片转格式
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime})
      },
    },
    computed: {
      ...mapState({
        preorderSid: state => state.vehicle.configuration.preorderSid,
      }),
    }
  }
</script>

<style scoped>
  @import '../../static/style/global.css';

  .container--compare {
    color: #fff;
    font-size: 0.18rem;
    height: 100%;
  }

  .compareAddWrap {
    display: table;
    vertical-align: middle;
    text-align: center;
    height: 1.7rem;
  }

  .compareCont {
    position: absolute;
    top: 1.5rem;
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.8rem;
    background: rgba(74, 90, 115, 0.4);
    border-radius: 0.1rem;
    padding: 0.2rem 0.1rem 0.2rem 0.2rem;
    height: calc(100vh - (2.3) * (100 * 100vw / 1920));
  }

  .compareCont .tableWrap {
    padding-right: 0.15rem;
  }

  /*表格*/
  .tableNormal {
    border: 0;
    margin: 0;
    padding: 0;
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1px;
    background: rgba(74,90,115,.5);
  }

  .tableNormal th, .tableNormal td {
    padding: 0.1rem 0.2rem;
    text-align: left;
  }

  .tableNormal th {
    font-weight: normal;
  }

  .tableNormal thead th {
    background: #6a7589;
  }

  .tableNormal tbody tr:nth-child(2n) th {
    background: rgba(250, 250, 250, 0.1);
    border-right: 2px solid rgba(74, 90, 115, 1);
  }

  .tableNormal tbody tr:nth-child(2n) td {
    background: rgba(250, 250, 250, 0.1);
    border-right: 2px solid rgba(74, 90, 115, 0.4);
  }

  .tableNormal tbody tr:nth-child(2n) td:last-child {
    border-right: 0;
  }

  .tableNormal__tit {
    line-height: 0.26rem;
    cursor: pointer;
  }

  .tableNormal__tit .fold {
    float: right;
    width: 0.3rem;
    height: 0.27rem;
    background: url(../../static/images/unfoldIcon.png) no-repeat;
    background-size: 0.6rem auto;
  }

  .tableNormal__tit .unfold {
    background-position: -0.3rem 0;
  }

  .Download-title {
    position: relative;
    height: 1.05rem;
  }

  .Download-title__middle {
    font-size: 0.34rem;
    text-align: center;
    padding-top: 0.45rem;
    position: absolute;
    width: 3.5rem;
    margin: auto;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
  }

  .Download-title__middle:after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    width: 0.65rem;
    height: 0.03rem;
    background: #fff;
    bottom: 0;
  }

  .Download-title__left {
    position: absolute;
    width: 0.93rem;
    height: 1.05rem;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 1rem;
    top: 0.15rem;
  }

  .Download-title__left img {
    max-width: 100%;
  }

  .header__scene .sceneIcon i {
    position: absolute;
    top: 0rem;
    left: 0rem;
    width: 0.5rem;
    height: 0.5rem;
    background: url(../../static/images/Configuration-order.png) no-repeat;
    background-size: 0.5rem auto;
  }
  .typeTitle{background: #646d7e}
  .itemCol{width: 100%;display: contents}
  .special{position: relative;padding-left: .2rem;display: flex;height: .4rem}
  .special>p{line-height: .4rem}
  .specialConten{position: absolute;top: 50%;transform: translateY(-50%);right: -.38rem}
  .specialName{padding-left: .2rem;height: .5rem;line-height: .5rem}
</style>
