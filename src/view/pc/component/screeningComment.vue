<template>
  <div class="screeningCommentWrap">
    <a href="javascript:;" class="close" @click="close"></a>
    <div class="screeningComment">
      <div class="screeningComment__title lightBox__title">
        <span>按分类查看评价</span>
      </div>
      <div class="carDetail">
        <three-ganged/>
      </div>
      <div class="screeningComment__btn">
        <div class="rest btn">重置</div>
        <div class="enter btn">确定</div>
      </div>
    </div>
  </div>
</template>

<script>
  import threeGanged from './threeGanged'
  export default {
    name: "screeningComment",
    props:['showScreeningComment'],
    methods:{
      close(){
        this.$emit('closeCommentPopup',false)
      }
    },
    components:{threeGanged}
  }
</script>

<style scoped>
  @import '../../../static/style/global.css';
  .screeningCommentWrap{
    width: 100% ;height: 100% ;background: rgba(0,0,0,.7); position: fixed; top: 0; left: 0; z-index: 8000; display: flex; justify-content: center; align-items: center;
  }
  .close{
    width: .4rem ;height: .4rem; background: url("../../../static/images/closeIcon2.png") no-repeat; -webkit-background-size: .4rem auto; background-siz: .4rem auto; position: fixed; top: .98rem; right: 1.2rem;
  }
  .screeningComment{
    width: 21.25rem ;height: 7.45rem; display: flex; flex-direction: column; justify-content: space-between; align-items: center;
  }
  .carDetail{
    width: 100%; height: 4.6rem; overflow: hidden; position: relative; background: #292b2f; border-radius: .15rem; transform: translateY(-8.5%); padding-top:1.8rem
  }

  .screeningComment__btn{
    width: 7.08rem; height: .8rem; box-sizing: border-box;
  }
  .btn{
    width: 3.39rem; height: 100%; border: 1px solid #808080; border-radius: .15rem; background: transparent; color: #fff;
  }
  .rest{
    background-color: #232323 ;margin-right: .3rem;
  }
  .enter{
    background-color: #ffa401 ;border: none
  }

</style>
