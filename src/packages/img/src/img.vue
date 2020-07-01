<template>
<img :src="src" :class="className" />
</template>
<script>
/**
 * 使用方法 
    <yp-img v-bind:src="图片地址" ></yp-img>
 */
  export default {
    name: 'YpImg',
    props: {
      src: {
        type: String,
        default: ''
      },
      //样式
      className: {
      }
    }
  }
</script>