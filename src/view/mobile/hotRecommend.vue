<template>
  <div class="hotOnSaleWrap">
    <Header :compareList="compareList">
      <div slot="title">
        <p class="title">{{$t('HotOnSale')}}</p>
      </div>
      <div slot="vsCar">
        <div class="vsCar" @click="routerComper()">
          <div class="hint" v-show="this.recommendSidMode.length>0">
            <span>{{this.recommendSidMode.length}}</span>
          </div>
        </div>
      </div>
    </Header>
    <div class="hotCarWrap">
      <ul class="hotCarList">
        <li  v-for="(item,index) in hotRecommendlists" :key="index">
          <div class="hotCarTop">
            <div class="carPicWrap">
              <img :src="item.carImg" alt="">
            </div>
            <div class="carDetail">
              <p class="carTypeName">{{item.name}}</p>
              <p class="renIcon">￥{{$commonFun.formatPrice(item.price)}}起</p>
            </div>
            <div class="noAdd" :class="{added:item.compareFlag}" @click="addCompare(item,index)"></div>
          </div>
          <div class="hotCarBotton">
            <ul class="btnWrap">
              <li @click="clickCustommade(item)">
                {{$t('Configuration')}}
              </li>
              <li @click="clickCarDetail(item)">
                {{$t('ChooseyourT60')}}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>

  import api from "@/common/api/api.js";

  export default {
      name: "homeRecommend",
      data() {
          return {
             noData:false,
             hotRecommendlists: [], //存放爆款车列表
             recommendCarNum: 0,
             recommendSidMode: [],
             sid: [],
            compareList:[],
            sidModes:'',
          };
      },
      activated() {
          var _self = this;
          /*commonApi.init();*/
          var sidModes = localStorage.getItem("sidModes");
          if (sidModes != undefined) {
            _self.recommendSidMode = sidModes.split(",");
          }

          //获取热销车型
          api.hotsales().then(rs => {
              if (rs.data) {
                _self.hotRecommendlists = rs.data;
                  if(_self.hotRecommendlists.length==0){
                      _self.noData = true;
                      _self.recommendCarNum = 0;
                  }

                  _self.hotRecommendlists.forEach( vo=> {
                      var recommendCarStr = vo.sid + ":" + vo.type;
                      if($.inArray(recommendCarStr,_self.recommendSidMode) != -1){
                          vo.compareFlag = true;
                          _self.recommendCarNum++;
                      }else{
                          vo.compareFlag = false;   //添加加入对比属性
                      }
                      _self.$set(vo, 'showStock', false);   //添加显示库存属性
                      _self.$set(vo, 'brightSpotSplit', []);   //添加显示亮点
                      if(vo.brightSpot == ''){
                          vo.brightSpotSplit = [];
                      }else{
                          // vo['brightSpotSplit'] = vo.brightSpot.split('#');
                          _self.$set(vo, 'brightSpotSplit', vo.brightSpot.split('#'));
                      }
                      vo['carImg'] = publicStaticPtah + "/2d/car/" + vo.image + ".png";  //拼接车图片
                      _self.sid.push(vo.sid);
                  })
              }
          });
      },
      methods: {
        routerComper(){

		  this.$router.push({name:'compare',query: { sidModes:this.recommendSidMode.join(",")}})

        },
        //立即定制
        clickCustommade: function(item) {
            this.$router.push({
              name: "cardetails",
              query: {
                dropDownMenuTab:false,      //这个id参数仅为了loadConfigurationOptionWithFeatures接口传参，G50 app中没有
               sid:item.sid,
                mode:item.type
              }
            });
        },

        //车型详情
        clickCarDetail: function(item) {
            window.localStorage.setItem("optionalcar", item);
            this.$router.push({name: "optionalcar",query: { dropDownMenuTab:true, tabToogle: false,mode:item.type}});
        },
        //加入对比
        addCompare(item, index){
			let _self = this
			item.compareFlag = !item.compareFlag;
			var recommendCarStr = item.sid + ":" + item.type;
			if ($.inArray(recommendCarStr, _self.recommendSidMode) == -1) {
				//判断最多只让两款车型对比
				if (!item.compareFlag) {
					if (_self.recommendCarNum == 2) {
						_self.showAlertBox = true;
						return false;
					}
				}
				_self.recommendSidMode.push(recommendCarStr);
			}else{
				_self.recommendSidMode.splice($.inArray(recommendCarStr, _self.recommendSidMode),1);
			}

			if (item.compareFlag === true){
				this.compareList.push(item)
			}
			_self.compareList.filter(vo=>{
				vo.code == item.code
			})
			this.$forceUpdate()
        }
      },
  }
</script>

<style scoped>
  .title{
    position: absolute;top:50%;left:50%;color: #fff;;margin: 0 auto;font: .36rem Arial;transform: translate(-50%,-50%);
  }
  .hotOnSaleWrap{
    height: 100%
  }
  .hotOnSaleWrap>.hotCarWrap{
    max-height: 92%;overflow-y: scroll;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList{
    display: flex;justify-content: center;flex-direction: column;align-items: center;padding-bottom: .2rem;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li{
    display: flex;flex-direction:column;align-items: center;margin-top: .24rem;width: 7rem;min-height: 3.45rem;
    -moz-box-shadow:0 0 .12rem #C4C4C4; -webkit-box-shadow:0 0 .12rem #C4C4C4; box-shadow:0 0 .12rem #C4C4C4;;border-radius: .1rem;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarTop{
    width: 100%;min-height: 2.54rem;display: flex;align-items: center;position: relative;justify-content: space-between;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarTop>.carPicWrap{
    width: 4.32rem;height: 2.43rem;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarTop>.carPicWrap>img{
    width: auto;height: 100%;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarTop>.carDetail{
    max-width: 35%;padding-right:.4rem;position: relative;display: flex;flex-direction: column;align-items: flex-end;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarTop>.noAdd{
    width: .58rem;height: .58rem;position: absolute;top: .22rem;right: .22rem;
    background: url("../../static/images/mobile/menuIcon.png") no-repeat;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -1.7rem -1.18rem;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarTop>.noAdd.added{
    background-position: -.95rem -1.18rem;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarTop>.carDetail>.carTypeName{
    font-size: .28rem;color: #4d5563;margin: 1.2rem 0 .2rem;;
    /*font-size: .26rem;color: #4d5563;margin: .6rem 0 .2rem;max-height: .4rem;max-width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis*/
  }
  .carDetail>.carTypeName_intact{border: 1px solid #eee;font-size: .24rem;position: absolute;bottom: 0;right: .2rem;background: #fff;padding: .1rem}
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarTop>.carDetail>.renIcon{
    font-size: .28rem;color: #01aeff;margin-bottom: .4rem;
  }




  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarBotton{
    width: 100%;height: .92rem;box-sizing: border-box;position: relative;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarBotton>.btnWrap{
    display: flex;align-items: center;justify-content: space-between;width: 100%;height: 100%;padding: 0 .4rem;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarBotton>.btnWrap>li{
    display: flex;align-items: center;justify-content: center;color: #01aeff;width: 2.57rem;height: .57rem;border: 1px solid #01aeff;border-radius:.08rem ;font-size: .26rem;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarBotton>.btnWrap>li:last-child{
    color: #fff;background: #01aeff;
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarBotton:before{
    content: ''; width: 100%;height: 1px;display: block;
    background: -webkit-linear-gradient(left,rgba(255, 255, 255, 0),#e7e7e7,rgba(255,255,255,0));
    background: linear-gradient(to right, rgba(255, 255, 255, 0),#e7e7e7,rgba(255,255,255,0));
  }
  .hotOnSaleWrap>.hotCarWrap>.hotCarList>li>.hotCarBotton:after{
    content: ''; width: 1px;height: 100%;display: block;position: absolute;top: 0;left: 50%;transform: translateX(50%);
    background: -webkit-linear-gradient(bottom,rgba(255, 255, 255, 0),#e7e7e7,rgba(255,255,255,0));
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0),#e7e7e7,rgba(255,255,255,0));
  }
</style>
