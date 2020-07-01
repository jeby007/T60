<template>
  <div>
    <Header>
      <div slot="title">
        <p class="title">{{$t('Configuration')}}</p>
      </div>
    </Header>
    <div class="saveCanvas">
      <div class="groupList">
        <div ref="QRcodeSrcImg">
          <div class="orderSynopsis" ref="orderSynopsis">
            <div>
              <p>{{$t('ConfigurationOrder')}}</p>
              <p>{{$t('LDV')}}</p>
            </div>
            <div>
              <div class="typeName">
                <p>{{$t('T60TypeName')}}</p>
                <p>{{Interfacedata.name}}</p>
              </div>
              <div class="orderDate">
                <p>{{$t('OrderDate')}}</p>
                <p>{{Interfacedata.orderDate}}</p>
              </div>
              <div class="totalPrice">
                <p>{{$t('TotalPrice')}}</p>
                <p>AU＄{{Interfacedata.totalPrice}}</p>
                <p class="explain">(inc GST)</p>
              </div>
            </div>
          </div>
          <!--group遍历v-for遍历orderListWrap-->
          <div class="orderListWrap" v-for="(item, index) in Interfacedata.configurationList" :key="index"
               ref="itemList">
            <div class="itemName" v-if="item.display">{{item.name}}</div>
            <ul class="itemList">
              <!--参数遍历v-for遍历一下li-->
              <!-- 一个的情况  -->
              <li class="itemDetail" v-for="(items, indexa) in item.familyList" :key="indexa"
                  v-if="item.familyList[indexa]['featureList'][0]['display'] && item.familyList[indexa]['featureList'].length==1">
                <p>{{items.name}}</p>
                <p v-for="(itemsa, indexb) in items.featureList" :key="indexb">{{itemsa.name}}</p>
              </li>

              <li class="itemDetail" v-for="(items, indexa) in item.familyList" :key="indexa"
                  v-if="item.familyList[indexa]['featureList'].length>1"
                  :class="{special:item.familyList[indexa]['featureList'].length>1}"
              >
                <p v-if="items.display">{{items.name}}</p>
                <ul v-for="(itemsa, indexb) in items.featureList" :key="indexb">
                  <li>{{itemsa.name}}</li>
                  <li>
                    <span v-if="itemsa.standard">✓</span>
                    <span v-if="itemsa.optional">–</span>
                    <span v-if="itemsa.notAvaiable">○</span>
                  </li>
                </ul>
              </li>

            </ul>
          </div>
          <!--group遍历end-->
        </div>
      </div>
    </div>
    <!--ios长按保存-->
    <div class="canvasBase" v-if="canvasBase && (isIos||isWeChat)">
      <img :src="canvasBase" alt="canvasBase" class="canvasBase">
    </div>
    <!-- v-if="isIos" -->
    <!-- <div class="download" v-show="DownloadShow" @click="savePic">{{$t('Download')}}</div> -->
    <!-- <a class="download" href="javascript:;" @click="savePic">{{$t('Download')}}</a> -->
    <transition
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div class="savehint" v-show="isShowSaveHint">
        <div class="hintWrap">
          <p>{{$t('DownloadImg')}}!</p>
          <div class="confirmBtn" @click="isShowSaveHint = false">{{$t('Confirm')}}</div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
  import api from "@/common/api/api.js";
  import globalConfig from '@/globalConfig'
  import serverApi from '@/common/serverApi'
  //精品组件
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'
  import {mapActions, mapGetters, mapState} from 'vuex'

  export default {
    data() {
      return {
        photoUrl: '',
        isShowSaveHint: false,
        canvasBase: '',
        Interfacedata: [],
        imaSavePath: '',
        isIos: false,
        DownloadShow: true,
		    isWeChat:false,
      }
    },
    created() {
      //初始化数据
      boutiqueVehicleComplex.init();
    },
    activated() {
      //判断是否为ios设备
      let u = navigator.userAgent
      this.isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
	  this.getToConfigDetails();
	  this.isWeChat = u.toLowerCase().match(/MicroMessenger/i) == "micromessenger"?true:false;
    },
    computed: {
      ...mapState({
        preorderSid: state => state.vehicle.configuration.preorderSid,
      }),
    },
    methods: {
      getToConfigDetails() {
        let param = {};
        param['preorderSid'] = this.preorderSid;
        serverApi.get('Home/Index/getloadConfigurationInventory', param).then(rs => {
          this.Interfacedata = rs.data;
        })
      },
      savePicFile() {
        window.location.href = globalConfig.apiDomain + '/Home/Index/toDown?file_name=' + this.imaSavePath;
      },
      savePic() {
        let canvas = this.$refs.QRcodeSrcImg
        let itemList = this.$refs.itemList
        let totalH = itemList.reduce((pre, vo) => {
          return pre + vo.offsetHeight
        }, 0) + this.$refs.orderSynopsis.offsetHeight
        let _self = this
        let a = document.createElement('a');
        html2canvas(canvas, {scale: 1.5, logging: false, useCORS: true, height: totalH}).then(function (canvas) {
          let type = 'png';
          let imgData = canvas.toDataURL(type);
          // 照片格式处理
          let _fixType = function (type) {
            type = type.toLowerCase().replace(/jpg/i, 'jpeg');
            let r = type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/' + r;
          };
          //图片base64
          imgData = imgData.replace(_fixType(type), 'image/octet-stream');
          let filename = `configdetails.${type}`;
          //时间戳
          _self.canvasBase = imgData
          let timestamp = (new Date()).valueOf();
          if (!_self.isIos) {
            let dom = document.body.appendChild(canvas);
            dom.style.display = "none";
            a.style.display = "none";
            document.body.removeChild(dom);
            let blob = _self.dataURLToBlob(dom.toDataURL("image/png"));
            a.setAttribute("href", URL.createObjectURL(blob));
            a.setAttribute("download", "configurationList.jpg")
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(blob);
            document.body.removeChild(a);
          } else {
            _self.DownloadShow = false;
            _self.$alert('please Long Press Save Pictures!');
          }
          //_self.saveFile(imgData,filename);
        });
        // this.isShowSaveHint = true
      },
      dataURLToBlob(dataurl) {//ie 图片转格式
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime})
      },
      saveFile(data, filename) {
        let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = data;
        save_link.download = filename;

        let event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
      },
      //将base64转换为文件
      dataURLtoFile(dataurl, filename, callback) {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        //callback(new File([u8arr], filename, {type:mime}));
        return new File([u8arr], filename, {type: mime});
      },
    }
  }
</script>

<style scoped>
  >>> .animated {
    -webkit-animation-duration: 300ms;
    animation-duration: 300ms;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .orderSynopsis {
    width: 100%;
    height: 2.7rem;
  }

  .orderSynopsis > div {
    height: 50%;
    width: 100%
  }

  .orderSynopsis > div:first-child {
    display: flex;
    padding: 0 .3rem;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-size: .28rem;
    color: #2f3744
  }

  .orderSynopsis > div:last-child {
    background: #9ca4b3;
    display: flex;
  }

  .orderSynopsis > div:last-child > div {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff
  }

  .orderSynopsis > div:last-child > div > p:not(:first-child) {
    font-size: .28rem
  }

  .orderSynopsis > div:last-child > div > .explain {
    font-size: .24rem !important;
  }

  .typeName {
    width: 2.9rem;
    border-right: 1px solid #fff
  }

  .orderDate {
    width: 2.34rem;
  }

  .totalPrice {
    width: 2.26rem;
    border-left: 1px solid #fff
  }

  .groupList {
    overflow-y: auto;
    max-height: calc(100vh - .82rem)
  }

  .orderListWrap {
    overflow: hidden
  }

  .orderListWrap > .itemName {
    width: 100%;
    height: .71rem;
    background: #dde1ea;
    padding-left: .3rem;
    line-height: .71rem
  }

  .orderListWrap > .itemList > .itemDetail {
    width: 100%;
    min-height: .7rem;
    padding: 0 .3rem;
    color: #666;
    font-size: .24rem;
    position: relative;
    display: flex;
    align-items: center
  }

  .itemDetail > p {
    width: 50%;
    word-wrap: break-word;
    word-break: normal;
    padding-right: .2rem
  }

  .orderListWrap > .itemList > .itemDetail:nth-child(even) {
    background: #f2f6ff
  }

  .itemDetail > p:last-child {
    padding: .1rem 0 .1rem .2rem;
    color: #000
  }

  .download {
    width: 100%;
    height: .9rem;
    background: #01aeff;
    position: fixed;
    bottom: 0;
    left: 0;
    text-align: center;
    line-height: .9rem;
    color: #fff;
    font-size: .28rem;
    font-weight: 600
  }

  .savehint {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .savehint > .hintWrap {
    width: 6.22rem;
    height: 2.89rem;
    background: #48566d;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    font-size: .32rem;
    align-items: center;
    padding: 0 .2rem
  }

  .savehint > .hintWrap > p {
    word-wrap: break-word;
    word-break: normal;
    text-align: center
  }

  .savehint > .hintWrap > .confirmBtn {
    width: 2.4rem;
    height: .6rem;
    border-radius: .05rem;
    background: #01aeff;
    font-size: .26rem;
    text-align: center;
    line-height: .6rem;
    margin-top: .65rem
  }

  .canvasBase {
    position: fixed;
    top: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);
    display: flex;
    align-items: center;
    justify-content: center
  }

  .canvasBase > img {
    width: 90%;
    height: auto
  }

  .orderListWrap > .itemList > .itemDetail.special {
    display: block;
    padding: .06rem .3rem
  }

  .itemDetail.special > p {
    width: 100%;
    padding: 0;
    color: #333;
    font-weight: 600;
    line-height: .7rem
  }

  .itemDetail.special > ul {
    display: flex;
    align-items: center
  }

  .special > ul > li {
    width: 50%
  }

  .special > ul > li:first-child {
    padding-right: .2rem
  }

  .special > ul > li:last-child {
    padding-left: .2rem
  }

  .special > ul > li > span {
    margin-right: .2rem
  }

  .special > ul > li > span:last-child {
    margin-right: 0
  }
</style>
