<template>
  <div class="selectBuotiqueListWrap">
    <ul class="selectBuotiqueList">
      <li class="shadow" v-for="(boutique,index) in boutiqueList " :key="index">
        <div class="leftImg">
          <img :src='boutique.detailsImage' alt="">
        </div>
        <div class="rightContent">
          <p class="accessoriesTitle">{{boutique.name}}</p>
          <p class="renIcon">￥{{boutique.price}}</p>
          <div class="products__amount clearfix">
            <span class="minusIcon" @click="deleteBoutique(boutique)"></span>
            <input :value="boutique.savenum" type="number" class="number" disabled="disabled"/>
            <span class="plusIcon" @click="addBoutique(boutique)"></span>
          </div>
        </div>
        <div class="closeBtn" @click="deleteBoutique(boutique)"></div>
      </li>
    </ul>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export default {
    data() {
      return {}
    },
    methods:{
      deleteBoutique(boutique){
        this.$confirm({
          message: 'Are you sure you want to delete this accessories?', confirm: () => {
            this.$store.dispatch('boutique/deleteBoutique',boutique).then(()=>{})
          }
        })
      },
      addBoutique(boutique){
        this.$store.dispatch('boutique/addBoutique',boutique).then((res)=>{
        }).catch(e=>{
          if(e.error_code=='1001'){
            //groupNu重复
            this.$alert(e.error[0].name+"将会被替换掉")
          }else{
            this.$alert(e.error)
          }
        })
      },
    },
    computed:{
      ...mapGetters({ boutiqueList: 'boutique/getSaveboutique'}),
    }
  }
</script>

<style scoped>
  @import "../../../static/style/global_mobile.css";
  .selectBuotiqueListWrap {overflow: auto;max-height:calc(100vh - .82rem - 1.64rem - 1.16rem);padding-bottom: .91rem;}
  .selectBuotiqueList {display: flex;flex-direction: column;align-items: center;min-height: 100%;}
  .selectBuotiqueList > li {position: relative;margin-top: .25rem;padding-left: .34rem;display: flex;background: #fff;width: 7rem;height: 2.72rem;border-radius: .1rem;}
  .selectBuotiqueList > li:first-child{margin-top: .1rem}
  .selectBuotiqueList > li > .closeBtn{width: .4rem;height: .4rem;padding: .1rem;background: url("../../../static/images/mobile/menuIcon.png") no-repeat center content-box;background-size: 2.71rem auto;background-position: -.91rem -1.26rem;position: absolute;top: .15rem;right: .13rem;}
  .selectBuotiqueList > li > .leftImg {width: 2.72rem;height: 100%;display: flex;align-items: center;}
  .selectBuotiqueList > li > .leftImg > img {width: 100%;display: block;}
  .selectBuotiqueList > li > .rightContent {width: 3.94rem;height: 100%;padding: .3rem .3rem .3rem .8rem;position: relative;}
  .selectBuotiqueList > li > .rightContent > .accessoriesTitle {font-size: .28rem;color: #4d5563;font-family: "PingFang SC Regular", serif;}
  .products__amount {width: 1.8rem;height: 0.45rem;line-height: 0.45rem;border: 1px solid #66748f;background: none;border-radius: 0.08rem;overflow: hidden;position: absolute;bottom: .3rem;left: 0.8rem;box-sizing: border-box;}
  .number {float: left;height: 100%;text-align: center;background: transparent;border-left: 1px solid #66748f;border-right: 1px solid #66748f;-webkit-appearance: none;border-radius: 0;width: 45%;border-left: 1px solid #66748f;border-right: 1px solid #66748f;color: #afb9cb;font-size: 0.22rem;opacity: 1;}
  .minusIcon {float: left;width: 0.48rem;height: 100%;background: url(../../../static/images/minusIcon.png) no-repeat center;background-size: 0.2rem auto;}
  .plusIcon {float: right;width: 0.48rem;height: 100%;background: url(../../../static/images/plusIcon.png) no-repeat center;background-size: 0.2rem auto;}</style>
