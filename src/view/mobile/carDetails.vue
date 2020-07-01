<template>
  <div>
    <Header>
      <div slot="title">
        <p class="title">{{$t('Configuration')}}</p>
      </div>
    </Header>
    <div class="topBanner">
      <div class="leftPic">
        <yp-img :src="img" :key="img" alt="" ></yp-img>
      </div>
      <div class="rightDetail">
        <p>T60首发自动豪华版</p>
        <!-- <p class="renIcon">总价：123,800</p> -->
        <div @click="JumpJeek()">{{$t('ChooseyourT60')}}</div>
      </div>
    </div>
	<!-- start -->
    <div class="configDetail_list" >
		<div class="configDetail_item" v-for="(item, index) in groupLists">
			<div class="item_title" @click="isHidenShow($event,index)">
				<div>{{item}}</div>
				<div :class="'titlekey'+index"></div>
			</div>
			<div class="itemDetail_list">
				<div v-show="toggleFold" :class="'contentkey'+index" >
					<div class="itemDetail_item" v-for="items in currentValueList" v-if="items.groupid==index">
						<!-- <div>{{items.familyName}}</div> -->
						<div>{{items.familyName}}</div>
						<div>{{items.featureName}}</div>
					</div>
				</div>
			</div>
		</div>
    </div>

	<!-- end -->

  </div>
</template>

<script>
import serverApi from '@/common/serverApi'
	export default {
		data() {
			return {
				toggleFold:true,
				groupLists:[],
				currentValueList:[],
				img:'',
			}
		},
		activated(){
			this.getLoadingData();
		},
		methods:{
			JumpJeek(){
				this.$router.push({name: "optionalcar",query: { dropDownMenuTab:true, tabToogle: false,mode:this.$route.query.mode}});
			},
			getLoadingData(){
				let param = {};
				param = {sid: this.$route.query.sid, mode: this.$route.query.mode};
				serverApi.get('Home/Index/getConfigurationDetails',param).then(rs=>{
					if(rs.error_code==0){
						this.img = publicStaticPtah + "/2d/car/" + rs.data.imgCode + ".png";
						this.groupLists = rs.data.group;
						this.currentValueList = rs.data.data;
                    }
				}).catch(e=>{


					this.$alert('数据加载失败,稍后再试')
				})
			},
			isHidenShow(e,index){
        let obj = e.currentTarget;
        if($(obj).find(".titlekey"+index).hasClass("active")){
					$(obj).find(".titlekey"+index).removeClass("active");
					$(".contentkey"+index).slideDown('fast');

        }else{
          $(obj).find(".titlekey"+index).addClass("active");
					$(".contentkey"+index).slideUp('fast');
				}

			}
		}
	}
</script>

<style scoped>
  .configDetail_list>>>.animated{
    -webkit-animation-duration:300ms;
    animation-duration:300ms;
    -webkit-animation-fill-mode:both;
    animation-fill-mode:both;
  }
  .topBanner{width: 100%;height: 3.46rem;display: flex;align-items: center;padding: 0 .3rem}
  .topBanner>.leftPic{width: 4.2rem;height: 2.3rem;display: flex;align-items: center;justify-content: center}
  .topBanner>.leftPic>img{width: auto;height: 100%;display: block}
  .topBanner>.rightDetail{max-width: calc(100vw - .6rem - 4.2rem);display: flex;flex-direction: column;justify-content: center;align-items: flex-end;font-size: .28rem}
  .topBanner>.rightDetail>.renIcon{font-size: .28rem;margin: .05rem 0 .2rem}
  .topBanner>.rightDetail>div{width: 2.3rem;height: .56rem;border: 1px solid #01aeff;line-height: .56rem;text-align: center;border-radius: .05rem;color: #01aeff;font-size: .26rem;margin-top: .1rem}
  .configDetail_list{max-height: calc(100vh - .82rem - 2.4rem - 1rem);overflow-y: auto;}
  .configDetail_item{margin-bottom: .1rem}
  .configDetail_item>.item_title{width: 100%;height: .71rem;background: #dde1ea;padding: 0 .32rem;display: flex;align-items: center;justify-content: space-between;font-size: .28rem;color: #3e444f}
  /*.configDetail_item>.item_title>div:last-child{width: .34rem;height: .47rem;padding: .1rem;background: url("../../static/images/mobile/menuIcon.png") no-repeat center content-box;background-size: 4.07rem auto;background-position: -.44rem -1.91rem;transition: transform 300ms}*/
  /*.configDetail_item>.item_title>div:last-child.active{transform: rotate(90deg)}*/
  .configDetail_item>.item_title>div:last-child{width: .46rem;height: .35rem;padding: .1rem;background: url("../../static/images/mobile/menuIcon.png") no-repeat center content-box;background-size: 4.07rem auto;background-position: -.9rem -1.97rem;transition: transform 300ms}
  .configDetail_item>.item_title>div:last-child.active{transform: rotate(-90deg)}
  .configDetail_item>.itemDetail_list{width: 100%;height: auto;overflow: hidden}
  .itemDetail_list .itemDetail_item{position: relative;width: 100%;min-height: .7rem;font-size: .24rem;color: #666;padding: .08rem .3rem;display: flex;align-items: center}
  .itemDetail_list .itemDetail_item:nth-child(even){background: #f2f6ff}
  .itemDetail_item>div:last-child{color: #000;max-width: 44%}
  .itemDetail_item>div:first-child{padding-right: .2rem}
  .itemDetail_item>div{width: 50%;word-break: normal;word-wrap: break-word;}
</style>
