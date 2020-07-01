<template>
    <div :style="{'background': 'url('+Bgimg+') no-repeat center center','width':'1200px','height':'675px'}">
    <!-- 主 -->
    <div v-show="mainShow" v-if="showXY" :style="{'font-size':'' + DrivingImageXY['fontSizeOfImage'] + 'px','z-index':'2','position':'absolute', 'top':'' + DrivingImageXY['mainXY']['x'] + 'px','left':'' + DrivingImageXY['mainXY']['y'] + 'px','color':'' + mainTextData['DrivingImageFontColor']['fontColorValue'] +''}">{{mainTextData['text']}}</div>
    <!-- 副 -->
    <div v-show="deputyShow" v-if="showXY" :style="{'font-size':'' + DrivingImageXY['fontSizeOfImage'] + 'px','z-index':'2','position':'absolute', 'top':'' + DrivingImageXY['detypeXY']['x'] + 'px','left':'' + DrivingImageXY['detypeXY']['y'] + 'px','color':'' + deputyTextData['DrivingImageFontColor']['fontColorValue'] +''}">{{deputyTextData['text']}}</div>

    <div class="feature__block bg"><!--内饰加bg-->
      <div class="familly__name-wrap">
        <span class="feature__tipsAnimation bellMove"></span>
        <span class="familly__name">{{selectDrivingName}}</span>
      </div>

      <div v-show="drivingName=='mainDrivingName'" style="text-align:center;margin-left:59px">
         <input v-model="mainTextData['text']" :maxlength="textMaxLength" type="text" style="width: 235px;height: 38px;border-radius:14px;cursor:text" placeholder="仅支持英文字母, 最多12个字符">
         <input @click="saveHeadRests(drivingName)" style="border: 1px solid #725ea6;background-color: #725ea6;border-radius:7px;margin-left:12px;width:50px;height:33px;" type="submit" value="保存" />
      </div>

      <div v-show="drivingName=='deputyDrivingName'" style="text-align:center;margin-left:59px">
         <input v-model="deputyTextData['text']" :maxlength="textMaxLength" type="text" style="width: 235px;height: 38px;border-radius:14px;cursor:text" placeholder="仅支持英文字母, 最多12个字符">
         <input @click="saveHeadRests(drivingName)" style="border: 1px solid 725ea6;background-color: #725ea6;border-radius:7px;margin-left:12px;width:50px;height:33px;" type="submit" value="保存" />
      </div>

      <div class="feature__info">
          <!-- <span>{{selectedColorFont.fontColorName}}</span> -->
        <span v-if="fontColorList[selectNavs]">{{fontColorList[selectNavs].fontColorName}}</span>
        <span class="feature__salesPrice">
          <i class="renIcon" v-if="fontColorList[selectNavs]">￥</i>
          <span v-if="fontColorList[selectNavs]">{{price}}</span>
        </span>
      </div>

      <div class="feature__wrap">
        <ul class="feature__wrap-ul clearfix">
          <!--  feature 循环开始 -->
            <li  @click="cancelCustom(drivingName)" >
            <div class="feature__inner" :class="{checked:selectNavs == -1}">
              <span class="feature__span">
                <img src=""/>
                <i class="disabled"></i>
              </span>
            </div>
          </li>
          <li  v-for="(item,grIndex) in fontColorList" @click="changeFontColor(item,grIndex,drivingName),getOrDeputyImageFontColor(item.fontColorId,drivingName)">
            <div class="feature__inner" :class="{checked:selectNavs == grIndex}">
              <span class="feature__span">
                <img src=""/>
              </span>
            </div>
          </li>

        </ul>
      </div>
    </div>

    <!-- <button >保存</button> -->
    <!-- <br/> -->
    <!-- <button @click="saveCustom(mainDrivDatas,deputyDrivDatas)">定制</button> -->
    </div>
</template>

<script>
import { mapActions,mapGetters,mapState } from 'vuex'
export default {
    data () {
        return {
            drivingName:'mainDrivingName',//默认为主的
            selectDrivingName:'',   //选中的，主/副
			selectNavs:'0',
            selectNav:'0',
            selectNav2:'0',
            //text:'MAXUS',
            interiorCode:'M_005AD',
            mainDrivDatas:[],
            deputyDrivDatas:[],
            Bgimg:'',
            DrivingImageXY:[],
            showXY:false,   //是否显示坐标
            //mainText:'',
            //deputyText:'',
            mainShow:true,
            deputyShow:false,
            mainTextData:{  //主的颜色值 和文字
                text:'MAXUS', //文字
                status:false,//用户是否点击了保存
                DrivingImageFontColor:[],//字体颜色
            },
            deputyTextData:{//副的颜色值 和文字
                 text:'MAXUS', //文字
                 status:false,//用户是否点击了保存
                 DrivingImageFontColor:[],//字体颜色
            },
            selectedColorFont:'',
        }
    },
    mounted(){
        this.getCustomBoutique('M_005AD');
        this.getMainDrivingImagePos('main');
        this.getOrDeputyImageFontColor('main','mainDrivingName');
        this.changeDriving('mainDrivingName');
        let fun = this.$store.getters["customBoutique/getSelectDrivingcustomBoutique"];
        let mainVM = [];
        let deputyVM = [];
        // 组装 主的信息
        mainVM['name'] = 'mainDrivingName';
        mainVM['fontColorList'] = fun['fontColorList'];
        mainVM['mainDrivingName'] = fun['mainDrivingName'];
        mainVM['mainDrivingImagePosX'] = fun['mainDrivingImagePosX'];
        mainVM['mainDrivingImagePosY'] = fun['mainDrivingImagePosY'];
        mainVM['fontSizeId'] = fun['fontSizeId'];
        mainVM['fontSizeName'] = fun['fontSizeName'];
        mainVM['fontSizeOfImage'] = fun['fontSizeOfImage'];
        mainVM['textMaxLength'] = fun['textMaxLength'];
        mainVM['price'] = fun['price'];
        // 组装副 的信息
        deputyVM['name'] = 'deputyDrivingName';
        deputyVM['fontColorList'] = fun['fontColorList'];
        deputyVM['deputyDrivingName'] = fun['deputyDrivingName'];
        deputyVM['deputyDrivingImagePosX'] = fun['deputyDrivingImagePosX'];
        deputyVM['deputyDrivingImagePosY'] = fun['deputyDrivingImagePosY'];
        deputyVM['fontSizeId'] = fun['fontSizeId'];
        deputyVM['fontSizeName'] = fun['fontSizeName'];
        deputyVM['fontSizeOfImage'] = fun['fontSizeOfImage'];
        deputyVM['textMaxLength'] = fun['textMaxLength'];
        deputyVM['price'] = fun['price'];

        let mainInfo = {    //主
            drivingName:'mainDrivingName',
            name:this.mainDrivingName,
            vm:mainVM
        };
        let deputyInfo = {  //副
            drivingName:'deputyDrivingName',
            name:this.deputyDrivingName,
            vm:deputyVM
        };

        let CustomBoutiqueArray = [];
        CustomBoutiqueArray[0] = mainInfo;
        CustomBoutiqueArray[1] = deputyInfo;
        this.$emit('childMenuCallBack', CustomBoutiqueArray);//回传二级菜单
    },
    computed:{
        ...mapState({
            mainDrivingName:state => state.customBoutique.customBoutique.mainDrivingName,//主驾头枕
            deputyDrivingName:state => state.customBoutique.customBoutique.deputyDrivingName,//副驾头枕
            fontColorList:state =>  state.customBoutique.customBoutique.fontColorList,
            fontColorList2:state =>  state.customBoutique.customBoutique.fontColorList2,
            price:state =>state.customBoutique.customBoutique.price,
            textMaxLength:state =>state.customBoutique.customBoutique.textMaxLength,
            interiorList:state =>state.customBoutique.customBoutique.interiorList,
            fontSizeOfImage:state =>state.customBoutique.customBoutique.fontSizeOfImage,
        }),

    },
    methods: {
        //从父类组件传过来的事件
        childMenuClick (vm) {
            this.changeDriving(vm.name);
        },
        getMainDrivingImagePos(status){
            //获取 定制枕头部分数据
            this.$store.dispatch('customBoutique/init').then(rs=>{
               /*let getMainOrDeputyImagePosfun = this.$store.getters['customBoutique/getMainOrDeputyImagePos'];
               this.DrivingImageXY =  getMainOrDeputyImagePosfun(status);*/

               let getMainOrDeputyImagePosfun = this.$store.getters['customBoutique/getMainOrDeputyImagePoss'];
               /*if(status=='main'){
                    this.mainShow = true;
                    this.deputyShow = false;
               }else{
                    this.mainShow = false;
                    this.deputyShow = true;
               }*/
               this.DrivingImageXY =  getMainOrDeputyImagePosfun;
               this.showXY = true;
            //    console.log('DrivingImageXY000000==',this.DrivingImageXY);
            });
        },

        getOrDeputyImageFontColor(fontColorId,drivingName){
            //枕头 上字体的颜色
            this.$store.dispatch('customBoutique/init').then(rs=>{
               let getOrDeputyImageFontColorfun = this.$store.getters['customBoutique/getOrDeputyImageFontColor'];
                // console.log(drivingName);
                //选颜色给主或者副    的指定字段 赋值
               if(drivingName=='mainDrivingName'){
                    this.mainTextData.DrivingImageFontColor =  getOrDeputyImageFontColorfun(fontColorId);
               } else{
                    this.deputyTextData.DrivingImageFontColor =  getOrDeputyImageFontColorfun(fontColorId);
               }
            });
        },
        getCustomBoutique(interiorCode ){
            this.$store.dispatch('customBoutique/init').then(rs=>{
                // console.log('interiorList:',this.interiorList);

               if(this.interiorList.indexOf(interiorCode)==-1){
                    // console.log('图片不存在');
               }else{
                    let bgimgfun = this.$store.getters['customBoutique/getBgimg'];
                    this.Bgimg =  bgimgfun('M_005AD');
               }


            });
        },
        saveHeadRests(drivingName){
            let _self = this;
            let reg = /^[-0-9a-zA-Z._()]*$/;

            if(drivingName=='mainDrivingName'){
                //this.mainText = this.text;

                if(!reg.test(this.mainTextData['text'])){
                    alert('文字不合法');
                    return false;
                }
                this.mainShow = true;
                this. mainTextData['status'] = true;
                let mainDrivData = {};
                mainDrivData['active'] = true;
                mainDrivData['interior'] = _self.interiorCode;
                //mainDrivData['fontColorId'] = this.fontColorList[this.selectNav]['fontColorId'];
                //this.mainTextData['DrivingImageFontColor'] = this.fontColorList[this.selectNav];
                mainDrivData['fontColorId'] = this.mainTextData['DrivingImageFontColor']['fontColorValue'];
                mainDrivData['fontSize'] = this.fontSizeOfImage;
                mainDrivData['text'] = this.mainTextData['text'];
                mainDrivData['skuId'] = 'a00001';
                let mainDriving =JSON.stringify(mainDrivData);
                _self.mainDrivDatas = mainDriving;
                // console.log('mainDriving:',mainDriving);
                if(this.deputyShow && this.mainShow){//2个都是true  就都打开
                    this.mainShow  = true;
                    this.deputyShow  = true;
                }
                // console.log('主驾数据：',_self.mainDrivDatas);
            }


            if(drivingName=='deputyDrivingName'){
                //this.deputyText = this.text;
                if(!reg.test(this.deputyTextData['text'])){
                    alert('文字不合法');
                    return false;
                }
                this.deputyShow = true;
                this.deputyTextData['status'] = true;
                let deputyDrivData = {};
                deputyDrivData['active'] = true;
                deputyDrivData['interior'] = _self.interiorCode;
                //deputyDrivData['fontColorId'] = this.fontColorList[this.selectNav2]['fontColorId'];
                //this.deputyTextData['DrivingImageFontColor'] = this.fontColorList[this.selectNav2];
                deputyDrivData['fontColorId'] = this.deputyTextData['DrivingImageFontColor']['fontColorValue'];
                deputyDrivData['fontSize'] = this.fontSizeOfImage;
                deputyDrivData['text'] = this.deputyTextData['text'];
                deputyDrivData['skuId'] = 'a00001';
                let deputyDriving =JSON.stringify(deputyDrivData);
                _self.deputyDrivDatas = deputyDriving;
                // console.log('deputyDriving:',deputyDriving);
                if(this.deputyShow && this.mainShow){//2个都是true  就都打开
                    this.mainShow  = true;
                    this.deputyShow  = true;
                }
                // console.log('副驾数据：',_self.deputyDrivDatas);
            }


            // console.log('this.fontColorList[this.selectNav]',this.fontColorList[this.selectNav]);

            /*this.$store.dispatch('customBoutique/saveHeadRests',{mainDriving,deputyDriving}).then((res)=>{

            })*/
        },
        //取消定制
        cancelCustom(drivingName){
            if(drivingName=='mainDrivingName'){
                this.selectNav = -1;
                this.mainTextData.text = '';
                this.mainTextData.status = false;
                this.mainTextData.DrivingImageFontColor = [];
                this.mainDrivDatas = {};

            }else{
                this.selectNav2 = -1;
                this.deputyTextData.text = '';
                this.deputyTextData.status = false;
                this.deputyTextData.DrivingImageFontColor = [];
                this.deputyDrivDatas = {};
            }
            this.selectNavs = -1;//设置选中为取消定制
            this.selectedColorFont = '';
        },
        //保存定制头枕
        saveCustom(mainDriving,deputyDriving){
            // console.log('mainDriving:',mainDriving);
            // console.log('deputyDriving:',deputyDriving);
            // console.log('保存定制头枕');
            this.$store.dispatch('customBoutique/saveHeadRests',{mainDriving,deputyDriving}).then((res)=>{

            })
        },
        /*getSelectFontColor(item){
            if(item.selected==true){
                return item.fontColorName;
            }
        },*/
        changeDriving(drivingName){

            if(drivingName == 'mainDrivingName'){
                this.getMainDrivingImagePos('main')
                this.getOrDeputyImageFontColor(this.fontColorList[this.selectNav].fontColorId,'mainDrivingName')
                this.selectNavs = this.selectNav;

           }
           if(drivingName == 'deputyDrivingName'){
                this.getMainDrivingImagePos();
                this.getOrDeputyImageFontColor(this.fontColorList[this.selectNav2].fontColorId,'deputyDrivingName')
                this.selectNavs = this.selectNav2;

            }
			//  console.log('副==============',this.selectNav2);
			//   console.log('主=====',this.selectNav);
            /*if(!this.mainTextData['status']){
                //当已经选则了  就不可以初始化红色值了! 主
                this.selectNav = 0;
            }
            if(!this.deputyTextData['status']){
                //当已经选则了  就不可以初始化红色值了! 副
                this.selectNav = 0;
            }*/
            //这是选择 主副的时候 下面的状态情况
            if(drivingName=='mainDrivingName'  && !this.mainTextData['status'] || drivingName=='mainDrivingName'  && !this.deputyTextData['status']){
                this.mainShow  = true;
                this.deputyShow = false;
            }
            if(drivingName=='deputyDrivingName' && !this.deputyTextData['status'] || drivingName=='deputyDrivingName'  && !this.mainTextData['status']){
                this.mainShow  = false;
                this.deputyShow = true;
            }
            if(drivingName=='mainDrivingName'  && this.deputyTextData['status'] || drivingName=='deputyDrivingName'  && this.mainTextData['status'] || this.mainTextData['status'] && this.deputyTextData['status']){
                this.mainShow  = true;
                this.deputyShow = true;
            }

            this.drivingName =  drivingName;   //赋值
            let getSelectDrivingfun = this.$store.getters['customBoutique/getSelectDriving'];
            this.selectDrivingName =  getSelectDrivingfun(this.drivingName);   //选中的，主/副
        },
        changeFontColor(item,index,drivingName){

            if(drivingName == 'mainDrivingName'){
                this.selectNav = index;
            }else{
                this.selectNav2 = index;
            }
            this.selectedColorFont =item;//设置当前选中的 是哪个文字 是红色 还是白色
            // console.log(item);
			// console.log( '主'+this.selectNav);
			// console.log( '次'+this.selectNav2);
             this.selectNavs = index;
            /*this.fontColorList.forEach(vo=>{
                vo['selected'] = false;
            });
            this.fontColorList[index].selected = true;*/
        },

        //删除精品
       deleteBoutique(boutique){
        this.$store.dispatch('boutique/deleteBoutique',boutique).then(()=>{})
       },
       //添加精品
       addBoutique(boutique){
         this.$store.dispatch('boutique/addBoutique',boutique).then((res)=>{
            if(!res){
                alert("数量已经达到最大值,不能添加")
            }
         })
       },

    },
    created(){

    }
}
</script>


<style scoped>
  #panoWrap{
    margin-top: -2.34rem;
    /*width: 100%;*/
    height: 121%;
    cursor: move;
  }
  /*feature动画*/
  @keyframes move {
    from {
      transform-origin: left;
      transform: rotate3d(0, 0, 1, 45deg);
      opacity: 0
    }
    to {
      transform-origin: left;
      transform: rotate3d(0, 0, 0);
      opacity: 1
    }
  }

  .feature__wrap {
    animation-name: move;
    animation-duration: 500ms;
    animation-timing-function: cubic-bezier(.48, -0.3, .65, 1.28)

  }

  .quality__recomm {
    display: block;
  }
  .quality__recomm {
    position: absolute;
    top: -0.10rem;
    right: 0.50rem;
    padding-left: 0.80rem;
    width: 4.35rem;
    height: 1.58rem;
    line-height: 1.58rem;
    background: url(../../../static/images/recommBg.png) no-repeat;
    background-size: 4.35rem auto;
  }

  .quality__recomm .recomm__text {
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.20rem;
    color: #fff;
    font-size: 0.36rem;
  }

   .quality__recomm .recomm__icon {
    display: inline-block;
    vertical-align: middle;
    width: 0.30rem;
    height: 0.30rem;
    background: url(../../../static/images/recommIcon.png) no-repeat;
    background-size: 0.30rem auto;
  }
  .feature__block {
    display: block;
    position: fixed;
    bottom: 0.40rem;
    left: 50%;
    margin-left: -6.52rem;
    padding: 0.15rem;
    width: 13.05rem;
    box-sizing: border-box;
    z-index: 7000;
  }

  .feature__block.show {
    display: block;
  }

  .feature__block.bg {
    background: rgba(32, 35, 41, 0.8);
    border-radius: 0.20rem;
  }

  .familly__name-wrap {
    width: 100%;
    text-align: center;
  }

  .feature__tips {
    display: inline-block;
    margin-right: 0.40rem;
    width: 0.34rem;
    height: 0.38rem;
    background: url(../../../static/images/tipsIcon2.png) no-repeat;
    background-size: 0.34rem auto;
    vertical-align: middle;
  }

  .feature__animation {
    display: inline-block;
    margin-right: 0.20rem;
    width: 23px;
    height: 23px;
    background: url(../../../static/images/lampIcon.png) no-repeat 0 0;
    background-size: 160px auto;
    vertical-align: middle;
  }

  .feature__animation.lampMove {
    -webkit-animation: lamp 1.5s steps(6) infinite;
    animation: lamp 1.5s steps(6) infinite;
  }

  @keyframes lamp {
    0% {
      background-position: 0;
    }
    100% {
      background-position: -160px;
    }
  }

  @-webkit-keyframes lamp {
    0% {
      background-position: 0;
    }
    100% {
      background-position: -160px;
    }
  }

  .familly__name {
    display: inline-block;
    vertical-align: middle;
    font-size: 0.42rem;
    color: #fff;
  }

  .feature__info {
    margin-bottom: 0.20rem;
    font-size: 0.36rem;
    color: #fff;
    text-align: center;
  }

  .feature__price {
    display: inline-block;
    vertical-align: middle;
  }

  .feature__name {
    margin-right: 0.25rem;
  }

  .feature__sales {
    margin-right: 0.05rem;
    width: 0.68rem;
    height: 0.39rem;
    position: relative;
  }

  .feature__sales img {
    display: block;
    width: 0.68rem;
    height: 0.39rem;
  }

  .feature__sales-wrap {
    position: absolute;
    top: -1.20rem;
    left: 50%;
    padding: 0.20rem;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    min-width: 3.0rem;
    min-height: 0.84rem;
    background: rgba(28, 32, 42, 0.7);
    border-radius: 0.20rem;
    white-space: nowrap;
  }

  .feature__sales-wrap:after {
    position: absolute;
    left: 50%;
    bottom: -0.40rem;
    transform: translate(-50%, 0);
    -webkit-transform: translate(-50%, 0);
    content: "";
    width: 0;
    height: 0;
    font-size: 0;
    font-weight: normal;
    border: 0.20rem solid transparent;
    border-top-color: rgba(28, 32, 42, 0.7);
  }

  .feature__sales-txt {
    font-size: 0.28rem;
    color: #fff;
  }

  .feature__salesPrice {
    margin-right: 0.05rem;
  }

  .feature__price {
    font-size: 0.29rem;
    opacity: 0.5;
    text-decoration: line-through;
  }

  .feature__info .symbol__icon {
    font-size: 0.18rem;
    font-style: normal;
    font-family: '微软雅黑';
  }

  .feature__wrap {
    margin: 0.20rem auto 0 auto;
    width: 98%;
    height: 1.6rem;
    overflow-x: auto;
    overflow-y: hidden;
    text-align: center;
  }

  .feature__wrap-ul {
    margin: 0 auto;
  }

  .feature__wrap-ul li {
    display: inline-block;
    vertical-align: middle; /*float: left;*/
    padding: 0 0.15rem;
    width: 1.6rem;
    height: 1.3rem;
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .feature__inner {
    width: 1.3rem;
    height: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
  }

  .feature__inner.checked {
    background: rgba(255, 255, 255, 0.6);
    -webkit-animation: featrueLarge 0.3s;
    animation: featrueLarge 0.3s;
  }

  @-webkit-keyframes featrueLarge {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      opacity: 1;
    }
    50% {
      -webkit-transform: scale(1.05);
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes featrueLarge {
    0% {
      -webkit-transform: scale(0.8);
      transform: scale(0.8);
      opacity: 1;
    }
    50% {
      -webkit-transform: scale(1.05);
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
      opacity: 1;
    }
  }

  .feature__span {
    position: relative;
    display: block;
    width: 0.98rem;
    height: 0.98rem;
    background-color: #fff;
    border-radius: 50%;
  }

  .feature__img {
    display: block;
    width: 1.1rem;
    height: 1.1rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
  }

</style>
