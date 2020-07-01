<template>
	<div class="container">
		<div class="container--compare" v-show="isCont">
			<div class="header clearfix">
				<div class="header__right">
					<div class="header__sameitem" :class="{openSameitem: openSameitem}" @click="openSameitem=!openSameitem,hidSames()">
			          <span class="sameitemIcon"><i></i></span>
			          <span class="sameitemText" v-if="!openSameitem"><i>{{$t("HideSameSpecifications")}}</i></span>
			          <span class="sameitemText" v-else><i>{{$t("ShowSameSpecifications")}}</i></span>
			        </div>
					<a class="header__btn header__home" @click="goHomePage()">首页</a>
				</div>
				<div class="header__title" @click="goBack()">{{$t("ModelComparison")}}</div>
			</div>
			<div class="compareTop">
				<template v-if="compareInfo.length==0" >
					<div class="compareCar compareCar--left compareAddWrap">
						<a class="compareAdd" @click="goBack()">
							<i></i>
							<span>{{$t("AddToComparison")}}</span>
						</a>
					</div>
				</template>
				<template v-else>
					<div class="compareCar" :class="[itemIndex==0?'compareCar--left':'compareCar--right']" v-for="(item,itemIndex) in compareInfo" :key="itemIndex">
						
						<div class="compareCar__text">
							<div class="textInner">
								<h1>T60首发款</h1>
								<h2>{{item.name}}</h2>
								<h3>指导价：<span class="blueC"><i class="renIcon">￥</i>{{item.price}}</span></h3>
							</div>
						</div>
						<div class="compareCar__car">
							<i class="reduceIcon" @click="reduceItem(itemIndex,compareInfo)"></i>
							<yp-img className="imgCenter" :src="item.app_img" :key="item.app_img" alt="" ></yp-img>
						</div>
					</div>
					<div class="compareCar compareCar--right compareAddWrap"  v-if="compareInfo.length==1">
						<a class="compareAdd" @click="goBack()" >
							<i></i>
							<span>{{$t("AddToComparison")}}</span>
						</a>
					</div>
				</template>
			</div>
			<div class="compareCont">
				<vue-scroll :ops="ops">
					<div class="tableWrap">
						<table class="tableNormal"  v-for="(itemList,indexList) in groupnameList" :key="indexList">
							<colgroup>
								<col width="20%" />
								<col width="40%" />
								<col width="40%" />
							</colgroup>
							<thead>
								<tr @click="hiddenShow(itemList,groupnameList)">
									<th colspan="3">
										<div class="tableNormal__tit">
											<i class="fold" :class="{unfold:itemList.isActive}"></i>{{itemList.groupname}}
										</div>
									</th>
								</tr>
							</thead>
							<tbody>
								<template v-for="item in itemList.list" v-if="!item.isdisplay||!ishideSame">
									<tr v-show="!itemList.isActive">
										<th>{{item.familyName}}</th>
										<td v-for="(itemV,indexV) in item.vals" :key="indexV">{{itemV}}</td>
										<td v-if="item.vals.length==1"></td>
									</tr>
								</template>
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
				openSameitem:false,
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
				isCont: false,//进入页面内容隐藏
				ishideSame: false, //隐藏相同项
				hideSameText: "隐藏相同项", //隐藏相同项文字
				compareInfo: [], //车信息
				list: [], //对比信息
				groupnameList: [], //数据
				getSidModes: "",
				showCarDetailsValue:false    //菜单显示配置详情按钮
			}
		},
		mounted() {
			commonApi.init();
		},
		activated() {
			var _self = this;
			_self.getSidModes = localStorage.getItem('sidModes');
			api.getComparativeConfigurations({
				sidModes: _self.getSidModes
			}).then(rs => {
				if(rs.error_code == 0) {
					_self.isCont = true;
					rs = rs.data;
					rs.forEach(function(item, key) { //拼接图片
						rs[key]['app_img'] = publicStaticPtah + "/2d/car/" + item.image + ".png";
					})
					
					_self.compareInfo = rs;
					_self.resetCompetList(rs);
					 
				} else {
					this.$alert(rs.error);
				}
			});
		},
		methods: {
			goHomePage: function() { //去首页
				interActiveHandler.goToHomeView();
			},
			goBack: function() { //返回上一级页面
				this.$router.go(-1);
			},
			hiddenShow: function(item, _array) { //隐藏显示当前组
				var _self = this;
				_self.groupnameList = [];
		
				item.isActive = !item.isActive;
				_self.groupnameList = _array;
		
			},
			hidSames: function() { //隐藏显示相同项
				var _self = this;
				if(_self.ishideSame == false) {
					_self.ishideSame = true;
					_self.hideSameText = "显示相同项";
				} else {
					_self.ishideSame = false;
					_self.hideSameText = "隐藏相同项";
				}
			},
			reduceItem: function(index, _array) { //删除此车
				var _self = this;
				var getSidModesArr=_self.getSidModes.split(',');
				getSidModesArr.forEach(vo=>{
					var tempSidAndType=_array[index]['sid']+':4';
					if(vo!=tempSidAndType){
						_self.getSidModes=vo;
					}
				});
		
				_array.splice(index, 1);
				if(_array.length==0){
					_self.getSidModes='';
				}
				_self.compareInfo = _array;
				_self.groupnameList = _array;
				_self.resetCompetList(_array);
				localStorage.setItem('sidModes', _self.getSidModes);
			},
			resetCompetList: function(_array) { //重组列表
				var _self = this;
				if(_array.length == 0) {
					_self.groupnameList = [];
				} else {
					var list = [];
					var aa = [];
					aa = _array[0].configurationDetails;
					for(var j = 0; j < aa.length; j++) {
						var ss = [];
						ss['groupname'] = aa[j]['groupName'];
						ss['familyName'] = aa[j]['familyName'];
						ss['isdisplay'] = aa[j]['sameWithOthers'];
						var vals = [];
						for(var num = 0; num < _array.length; num++) {
							vals[num] = _array[num].configurationDetails[j]['featureName'];
						}
						ss['vals'] = vals;
						list.push(ss);
					}
					var groupname = [];
					list.map(function(value){//大类名
						if(groupname.indexOf(value.groupname)==-1){
							groupname.push(value.groupname)
						}
					})
					for(var p = 0; p < groupname.length; p++) {
						var val = [];
						for(var ii = 0; ii < list.length; ii++) {
							if(list[ii]['groupname'] == groupname[p]) {
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
				}
			},
			addNewModel:function(){   //添加车型对比到爆款推荐页
					var _self=this;
					_self.$router.push({name: 'hotRecommend',query: {sidModes:_self.getSidModes}})
			}
		},
		components: {

		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../../static/style/global.css';
/*车型对比隐藏相同项*/
.container--compare .header__sameitem{
display: inline-block;vertical-align: middle;position: relative;width: 2.24rem;height: 0.6rem;border:0.02rem solid #4d4f4f;background: rgba(26,26,26,0.8);font-size: 0.32rem;color: #fff;border-radius: 1rem;transition:all 0.2s;-webkit-transition:all 0.2s;z-index: 6000;cursor: pointer;
}
.container--compare .sameitemIcon{
position: absolute;left: 0.03rem;top:0.03rem;width: 0.5rem;height: 0.5rem;background: #fff;border-radius: 50%;
}
.container--compare .sameitemIcon i{
position: absolute;top:-0.05rem;left:-0.05rem;width:0.6rem;height: 0.6rem;background: url(../../static/images/menuIcon.png) no-repeat;background-size: 3rem auto;background-position:-1.2rem 0;
}
.container--compare .sameitemText{
position: absolute;right: 0.20rem;top:0rem;width: 1.30rem;height: 0.56rem;line-height:1.2em;font-size: 0.20rem;color: #01aeff;display:flex;align-items:center;
}
.container--compare .header__sameitem.openSameitem{
background: #01aeff;
}
.container--compare .header__sameitem.openSameitem .sameitemIcon{
left: auto;right: 0.03rem;
}
.container--compare .header__sameitem.openSameitem .sameitemText{
right: auto;left: 0.16rem;color: #fff; 
}
.container--compare {
	color: #fff;font-size: 0.14rem;height: 100%;
}
.compareTop {
	position: absolute;top: 1.46rem;left: 0.5rem;right: 0.5rem;height:1.7rem;z-index: 9;
}
.compareTop:before {
	content: "";position: absolute;left: 50%;top:50%;background: url(../../static/images/compareVs.png) no-repeat;background-size:0.89rem auto;width: 0.89rem;height: 0.96rem;margin-left: -0.445rem;margin-top:-0.48rem;
}
.compareCar {display: block;float: left;width: 50%;height:100%;}
.compareCar--left {padding-right:0.72rem;
}
.compareCar__text {
	float: right;width:2.4rem;text-align: right;margin-left: 0.4rem;
}
.compareCar__text .textInner{
	min-width:2.4rem;height: 1.7rem;display:flex;align-items:center;flex-direction:column;align-items: flex-end;justify-content:center;
}
.compareCar__text h1,.compareCar__text h2,.compareCar__text h3 {font-weight: normal;line-height: 1.3em;}
.compareCar__text h1,.compareCar__text h3 {font-size: 0.2rem;}
.compareCar__text h2{font-size: 0.24rem;}
.compareCar__car {
	position: relative;width: 3rem;height: 1.66rem;margin-right: 0.02rem;float: right;
}
.reduceIcon {
	position: absolute;right: -0.45rem;top:0.615rem;width: 0.43rem;height: 0.43rem;
	background: url(../../static/images/reduceIcon.png) no-repeat;background-size: 0.43rem auto;cursor: pointer;
}
.compareCar--right {padding-left: 0.72rem;}
.compareCar--right .compareCar__text {float: left;margin-right: 0.4rem;margin-left: 0;}
.compareCar--right .compareCar__text .textInner{
	align-items: flex-start;
}
.compareCar--right .compareCar__car {float: left;}
.compareCar--right .reduceIcon{
	left: -0.45rem;right: auto;
}
.compareAddWrap {
	display: table;vertical-align: middle;text-align: center;height: 1.7rem;
}
.compareAdd {
	color: #fff;font-size: 0.2rem;display: table-cell;vertical-align: middle;line-height: 0.4rem;cursor: pointer;
}
.compareAdd i {
	display: inline-block;background: url(../../static/images/add.png) no-repeat;width: 0.4rem;height: 0.4rem;background-size: 0.4rem auto;vertical-align: middle;margin-right: 0.12rem;
}
.compareAdd span {
	display: inline-block;vertical-align: middle;padding-right: 0.5rem;background: url(../../static/images/arrow2.png) no-repeat right center;background-size: 0.22rem auto;
}
.compareCont {
	position: absolute;top: 3.2rem;left: 0.5rem;right: 0.5rem;bottom: 0.8rem;background: rgba(74,90,115,0.4);border-radius: 0.1rem;
	padding: 0.2rem 0.1rem 0.2rem 0.2rem;height:calc(100vh - (3.2 + 0.8) * (100 * 100vw / 1920));
}
.compareCont .tableWrap {padding-right: 0.15rem;}
/*表格*/
.tableNormal {border: 0; margin: 0; padding: 0; width: 100%; border-collapse: collapse; margin-bottom: 1px;}
.tableNormal th,.tableNormal td {padding:0.1rem 0.2rem;text-align: left;}
.tableNormal th {font-weight: normal;}
.tableNormal thead th {background: #6a7589;}
.tableNormal tbody tr:nth-child(2n) th {background: rgba(104,182,255,0.1); border-right: 2px solid rgba(74,90,115,0.4);}
.tableNormal tbody tr:nth-child(2n) td {background: rgba(250,250,250,0.1);border-right:2px solid rgba(74,90,115,0.4);}
.tableNormal tbody tr:nth-child(2n) td:last-child {border-right: 0;}
.tableNormal__tit{line-height: 0.26rem;cursor: pointer;}
.tableNormal__tit .fold {float: right;width: 0.3rem; height: 0.27rem; background: url(../../static/images/unfoldIcon.png) no-repeat; background-size: 0.6rem auto;}
.tableNormal__tit .unfold {background-position: -0.3rem 0;}

</style>
