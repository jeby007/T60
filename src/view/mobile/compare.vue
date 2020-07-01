<template>
  <div>
    <Header>
      <div slot="title">
        <p class="title">{{$t('ModelComparison')}}</p>
      </div>
    </Header>
    <div class="pages-tables" id="pages-tables" v-show="compareInfo.length > 0">
      <div class="waterMask" id="watermark"></div>
      <div class="rolling-table meal-table" ref="tableBox" :style="{height: maxHeight + 'px'}">
        <table class="table" id="table" cellpadding="0" cellspacing="0" ref="rollingTable">
          <tr>
            <th class="rows cross">
              <div class="hideOrShow">
                <div class="toggleBtn_bg" @click="togglehideSame" :class="{active: ishideSameOption}">
                  <div class="toggleBtn_bar"></div>
                </div>
                <p>{{$t('HideSame')}}</p>
                <p>{{$t('Specifications')}}</p>
              </div>
            </th>
            <!-- 添加对比车头部star -->
            <th class="rows" v-for="(item,itemIndex) in compareInfo" :key="itemIndex">
              <!-- @click="$router.push({name:'cardetails'})" -->
              <div class="tdContentWrap">
                <div class="tdContent">
                  <div class="carPic">
                    <yp-img :src="item.app_img" :key="item.app_img" alt=""></yp-img>
                    <div class="deleteBtn" @click="reduceItem(itemIndex,compareInfo)"></div>
                  </div>
                  <p>{{item.name}}</p>
                  <p>{{$t('Price')}}：{{item.price}}</p>
                </div>
              </div>
            </th>
            <!-- 添加对比车头部end -->
            <th class="rows">
              <div class="addCompare" @click="addCar()">
                <div></div>
              </div>
            </th>
          </tr>
          <!--遍历star-->
          <template>
            <div class="trWrap" v-for="(itemList,indexList) in groupnameList" :key="indexList">
              <tr class="groupNameWrap" id="groupNameWrap" @click="hiddenShow(itemList,groupnameList)">
                <div>
                  <td class="cols groupName">
                    <span>{{itemList.groupname}}</span>
                  </td>
                  <div class="foldFlag">
                    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                      <div class="foldIcon" :class="{active:itemList.isActive}" v-if="isShowFoldBtn"></div>
                    </transition>
                  </div>
                </div>
              </tr>
              <div class="fold_content">
                <transition enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
                  <div class="templateWrap" v-if="!itemList.isActive">
                    <tr v-for="item in itemList.list" v-if="!item.isdisplay||!ishideSameOption"
                        v-show="!itemList.isActive">
                      <div>
                        <td class="cols">
                          <span>{{item.familyName}}</span>
                        </td>
                      </div>
                      <div v-for="(itemV,indexV) in item.vals" :key="indexV">
                        <td>
                          <span>{{itemV}}</span>
                        </td>
                      </div>
                      <div v-if="item.vals.length==1">
                        <td></td>
                      </div>
                    </tr>
                  </div>
                </transition>
              </div>
            </div>
          </template>
          <!--遍历end-->
        </table>
      </div>
    </div>
    <div class="addCompare" v-show="compareInfo.length === 0" @click="$router.go(-1)">{{$t('Addmore')}}</div>
  </div>
</template>

<script>
  import {createIScroller, refreshScroller} from "../../static/js/lib/iscrollTabel";
  import api from '@/common/api/api.js'; //初始化3d引入js
  import commonApi from '@/common/commonFun.js'; //引入公共js
  export default {
    data() {
      return {
        maxHeight: '80%',
        scroll: {
          scroller: null
        },
        isShowFoldBtn: true,
        ishideSameOption: false,
        foldBtnOffsetLeft: null,
        groupnameList: [],
        compareInfo: [], //车信息
      }
    },
    activated() {
      //获取数据
      this.getloadComperData();
    },
    mounted() {
      this.maxHeight = window.screen.height;
      this.scroll.scroller = createIScroller(".meal-table");
      let groupNameW = window.screen.width;
      document.getElementById('pages-tables').addEventListener('touchmove', this.handeleMove)
    },
    methods: {
      addCar() {
        this.$router.push({name: 'hotrecommend'})
      },
      resetCompetList: function (_array) { //重组列表
        var _self = this;
        if (_array.length == 0) {
          _self.groupnameList = [];
        } else {
          var list = [];
          var aa = [];
          aa = _array[0].configurationDetails;
          for (var j = 0; j < aa.length; j++) {
            var ss = [];
            ss['groupname'] = aa[j]['groupName'];
            ss['familyName'] = aa[j]['familyName'];
            ss['isdisplay'] = aa[j]['sameWithOthers'];
            var vals = [];
            for (var num = 0; num < _array.length; num++) {
              vals[num] = _array[num].configurationDetails[j]['featureName'];
            }
            ss['vals'] = vals;
            list.push(ss);
          }
          var groupname = [];
          list.map(function (value) {//大类名
            if (groupname.indexOf(value.groupname) == -1) {
              groupname.push(value.groupname)
            }
          })
          for (var p = 0; p < groupname.length; p++) {
            var val = [];
            for (var ii = 0; ii < list.length; ii++) {
              if (list[ii]['groupname'] == groupname[p]) {
                var cc = [];
                cc['familyName'] = list[ii]['familyName'];
                cc['isdisplay'] = list[ii]['isdisplay'];
                cc['vals'] = list[ii]['vals'];
                val.push(cc);
              }
            }
            var dd = [];
            dd['list'] = val;
            dd['groupname'] = groupname[p];
            dd['isActive'] = false;
            groupname[p] = dd;
          }
          _self.groupnameList = groupname;
          _self.loadStyle();
        }
      },
      loadStyle() {
        this.$nextTick(() => {
          let groupNameW = window.screen.width;
          $('.groupNameWrap > div').width(groupNameW)
          this.foldBtnOffsetLeft = $('.foldIcon').offset().left
        })
      },
      reduceItem: function (index, _array) { //删除此车
        var _self = this;
        var getSidModesArr = _self.getSidModes.split(',');
        getSidModesArr.forEach(vo => {
          var tempSidAndType = _array[index]['sid'] + ':4';
          if (vo != tempSidAndType) {
            _self.getSidModes = vo;
          }
        });

        _array.splice(index, 1);
        if (_array.length == 0) {
          _self.getSidModes = '';
        }
        _self.compareInfo = _array;
        _self.groupnameList = _array;
        _self.resetCompetList(_array);
        localStorage.setItem('sidModes', _self.getSidModes);
      },
      getloadComperData() {
        this.getSidModes = this.$route.query.sidModes;
        api.getComparativeConfigurations({sidModes: this.getSidModes}).then(rs => {
          if (rs.error_code == 0) {
            rs = rs.data;
            rs.forEach(function (item, key) { //拼接图片
              rs[key]['app_img'] = publicStaticPtah + "/2d/car/" + item.image + ".png";
            })
            this.compareInfo = rs;
            this.resetCompetList(rs);
          } else {
            this.$alert({message: 'No comparison car', confirmBtnText: 'Confirm'});
          }
        });
      },
      hiddenShow: function (item, _array) { //隐藏显示当前组
        var _self = this;
        _self.groupnameList = [];
        item.isActive = !item.isActive;
        _self.groupnameList = _array;
      },
      togglehideSame() {
        if (this.ishideSameOption == false) {
          this.ishideSameOption = true;
        } else {
          this.ishideSameOption = false;
        }
      },
      handeleMove() {
        let foldMoveW = $('.foldFlag').offset().left
        foldMoveW < this.foldBtnOffsetLeft - 5 ? this.isShowFoldBtn = false : this.isShowFoldBtn = true
      }
    },
    beforeDestroy() {
      document.getElementById('pages-tables').removeEventListener('touchmove', this.handeleMove)
    }
  }
</script>

<style scoped>
  .pages-tables >>> .animated {
    -webkit-animation-duration: 300ms;
    animation-duration: 300ms;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }

  .rolling-table {
    height: 100%;
    font-size: 0.28rem;
    color: #86939a;
    background-color: #fff;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    position: relative;
    top: 0;
    overflow: hidden;
  }

  .rows {
    position: relative;
    z-index: 3;
  }

  .cross {
    position: relative;
    z-index: 5;
  }

  table td {
    border: 0px solid #000;
    font-size: 0.24rem;
    background: #fff;
    color: #000;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .table {
    color: #86939e;
    font-size: 0.32rem;
    border: none;
    min-height: 100%;
    text-align: center;
    min-width: 100%
  }

  .table th {
    color: #43484d;
    height: 2rem;
    width: 2.92rem;
    display: flex;
    background: #fff;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(239, 239, 239, 1);
    border-right: 1px solid rgba(239, 239, 239, 1);
  }

  .table td {
    min-height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 .3rem;
    text-align: left;
  }

  .table th:first-child {
    width: 1.8rem;
    border-right: none;
  }

  .table th:nth-child(2) {
    border-left: 1px solid rgba(239, 239, 239, 1);
    border-right: 1px solid rgba(239, 239, 239, 1) !important;
  }

  .table th:last-child {
    border-right: none;
  }


  .table th > .hideOrShow {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: .24rem;
    color: #4e5464;
    font-weight: 600
  }

  .table th > .hideOrShow > .toggleBtn_bg {
    width: .75rem;
    height: .4rem;
    background: #fff;
    border-radius: .4rem;
    border: 1px solid #d8d6d6;
    margin: .6rem 0 .1rem;
    position: relative
  }

  .table th > .hideOrShow > .toggleBtn_bg > .toggleBtn_bar {
    width: .35rem;
    height: .35rem;
    background: #fff;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    border-radius: .35rem;
    -moz-box-shadow: 0px 0px 5px #B5B5B5;
    -webkit-box-shadow: 0px 0px 5px #B5B5B5;
    box-shadow: 0px 0px 5px #B5B5B5;
  }

  .table th > .hideOrShow > .toggleBtn_bg.active {
    background: #01aeff;
  }

  .table th > .hideOrShow > .toggleBtn_bg.active > .toggleBtn_bar {
    left: auto;
    right: 0
  }

  .table th > .tdContentWrap {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .table th > .tdContentWrap > .tdContent {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .table th > .tdContentWrap > .tdContent > .carPic {
    width: 2.69rem;
    height: 1.35rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative
  }

  .table th > .tdContentWrap > .tdContent > .carPic > img {
    width: auto;
    height: 100%;
    display: block
  }

  .table th > .tdContentWrap > .tdContent > .carPic > .deleteBtn {
    width: .37rem;
    height: .37rem;
    background: url("../../static/images/mobile/deleteIconcar.png") no-repeat center;
    background-size: 100% auto;
    position: absolute;
    top: .05rem;
    right: -.05rem
  }

  .table th > .tdContentWrap > .tdContent > p {
    font-size: 0.22rem;
    color: #4e5464;
    font-weight: 400;
    padding: 0 .1rem
  }

  .table th > .addCompare {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center
  }

  .table th > .addCompare > div {
    width: .56rem;
    height: .56rem;
    background: url("../../static/images/mobile/menuIcon.png") no-repeat center;
    background-size: 4.07rem auto;
    background-position: -.22rem -1.18rem
  }

  tr {
    position: relative;
    background-color: #fff;
    display: flex;
  }

  tr > div {
    width: 2.92rem;
    border-right: 1px solid rgba(239, 239, 239, 1);
  }

  tr > div:last-child {
    border: none;
  }

  tr > div:first-child {
    width: 1.8rem;
  }

  tr > div:first-child > td {
    font-size: 0.24rem;
    color: rgba(38, 47, 63, 1);
    font-weight: 400;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column
  }

  tr > div:nth-child(2) {
    border-right: 1px solid rgba(239, 239, 239, 1);
  }

  .fold_content {
    overflow: hidden
  }

  .table > .trWrap {
    margin-bottom: .09rem
  }

  .table > .trWrap > .fold_content > .templateWrap > tr {
    min-height: .7rem;
  }

  .table > .trWrap > .fold_content > .templateWrap > tr td {
    padding: .15rem .3rem;
    color: #000
  }

  .table > .trWrap > .fold_content > .templateWrap > tr > div:first-child > td {
    color: #666
  }

  .table > .trWrap > .fold_content > .templateWrap > tr:nth-child(even) > div > td {
    background: #f2f6ff
  }

  .table > .trWrap > tr {
    min-height: .7rem;
  }

  .table > .trWrap > tr:first-child {
    background: #dde1ea;
  }

  .table > .trWrap > tr:first-child td {
    background: #dde1ea
  }

  .trWrap > tr:first-child > div > td {
    font-size: 0.28rem;
    color: #3e444f;
  }

  .groupNameWrap > div {
    position: relative
  }

  .groupNameWrap .foldFlag {
    width: .46rem;
    height: .35rem;
    position: absolute;
    top: 50%;
    right: .32rem;
    transform: translateY(-50%)
  }

  .groupNameWrap .foldIcon {
    width: 100%;
    height: 100%;
    background: url("../../static/images/mobile/menuIcon.png") no-repeat center content-box;
    padding: .1rem;
    background-size: 4.07rem auto;
    background-position: -.9rem -1.97rem;
    transform: rotate(0deg);
    transition: transform 300ms;
  }

  .groupNameWrap .foldIcon.active {
    transform: rotate(-90deg)
  }

  .trWrap:last-child > div {
    margin-bottom: .8rem
  }

  .addCompare {
    width: 100vw;
    height: 100vh;
    margin: auto;
    color: #01aeff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: .32rem;
    text-decoration: underline
  }
</style>
