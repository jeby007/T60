<template>
	<div class="container">
		<div class="container--compare">
    <div class="Download-title clearfix">
        <div class="Download-title__left">
          <img src="../../static/images/downloadLogo.png" alt="">
        </div>
        <div class="Download-title__middle">
            {{$t('Download')}}
        </div>
    </div>
			<div class="compareCont">
				<vue-scroll :ops="ops">
					<div class="tableWrap">
						<table class="tableNormal" >
							<colgroup>
								<col width="16%" />
								<col width="16%" />
								<col width="16%" />
                <col width="16%" />
                <col width="16%" />
							</colgroup>
							<thead>
								<tr>
									<th>{{$t('OrderNo')}}</th>
                  <th>{{$t('OrderName')}}</th>
                  <th>{{$t('Dealer')}}</th>
                  <th>{{$t('OrderDate2')}}</th>
                  <th>{{$t('Price')}}</th>
                  <th>{{$t('Detell')}}</th>
								</tr>
							</thead>
							<tbody>
								<template>
									<tr v-for="(value, key, index) in DownloadObj">
										<th>{{value.No}}</th>
										<td>{{value.OrderName}}</td>
										<td>{{value.Dealer}}</td>
										<td>{{value.OrderDate}}</td>
										<td>￥{{value.Price}}</td>
										<td class="blueC"><a href="javascript:void(0)">PDF</a></td>
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

         DownloadObj: [
          {
              No: '50',
              OrderName: 'T60 pickup truck',
              Dealer:'SAIC Datong',
              OrderDate:'2019-02-14  17:45',
              Price:'122222'
            },
          {
              No: '50',
              OrderName: 'T60 pickup truck',
              Dealer:'SAIC Datong',
              OrderDate:'2019-02-14  17:45',
              Price:'122222'
          }
        ]

			}
		},
		mounted() {
			commonApi.init();
		},
		methods: {
			
		},
		components: {

		}
	}
</script>

<style scoped>
@import '../../static/style/global.css';
.container--compare {
	color: #fff;font-size: 0.18rem;height: 100%;
}
.compareAddWrap {
	display: table;vertical-align: middle;text-align: center;height: 1.7rem;
}
.compareCont {
	position: absolute;top: 1.5rem;left: 0.5rem;right: 0.5rem;bottom: 0.8rem;background: rgba(74,90,115,0.4);border-radius: 0.1rem;
	padding: 0.2rem 0.1rem 0.2rem 0.2rem;height:calc(100vh - (2.3) * (100 * 100vw / 1920));
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
.Download-title{position: relative;height:1.05rem;}
.Download-title__middle{
  font-size: 0.34rem;text-align: center;padding-top: 0.45rem;position: absolute;width:2rem;margin: auto;left: 50%;transform: translateX(-50%);-webkit-transform: translateX(-50%);
}
.Download-title__middle:after{content: ""; position: absolute;left: 50%;transform: translateX(-50%);-webkit-transform: translateX(-50%);-ms-transform: translateX(-50%);width:0.65rem;height: 0.03rem;background: #fff;bottom: 0;}
.Download-title__left{position: absolute;width:0.93rem;height: 1.05rem;display: flex;justify-content: center;align-items: center;left: 1rem;top: 0.15rem;}
.Download-title__left img{max-width: 100%;}
</style>
