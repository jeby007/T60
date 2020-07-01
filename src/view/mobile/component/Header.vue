<template>
  <div class="header">
    <div class="back" @click="$router.back()"></div>
    <slot name="title"></slot>
    <slot name="vsCar"></slot>
    <div class="toHome" @click="$router.push({name:'home'})"></div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style scoped>
  .header{
    width: 100%;height: .82rem;display: flex;align-items: center;justify-content: space-between;
    background: #6a7589;position: relative;
  }
  .header>.back{
    margin-left: .33rem;
    width: .21rem;height: .46rem;
    background: url("../../../static/images/mobile/menuIcon.png") no-repeat center;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -1.12rem -.17rem;
  }
  .header>.toHome{
    width: .49rem;height: .46rem;margin-right: .33rem;
    background: url("../../../static/images/mobile/menuIcon.png") no-repeat;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -.26rem -.18rem;
  }
  .title{
    display: inline-block;color: #fff;font: .36rem Arial;margin: 0 auto;
  }
  .vsCar{
    width: .47rem;height: .47rem;margin-right: .35rem;position: absolute;right: .85rem;top: 50%;transform: translateY(-50%);
    background: url("../../../static/images/mobile/menuIcon.png") no-repeat;
    -webkit-background-size: 4.07rem auto;
    background-size: 4.07rem auto;
    background-position: -2.32rem -.16rem;
  }
  .vsCar>.hint{
    width: .22rem;height: .22rem;border-radius: 50%;font-size: .14rem;color: #fff;
    background: #ef2f46;position: absolute;top:-.05rem;right: -.05rem;display: flex;align-items: center;justify-content: center;
  }
</style>
