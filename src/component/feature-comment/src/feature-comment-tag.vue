<template>
  <div class="featureCommentWrap" @click="tagClick">
    <span class="praiseIcon">{{dzs}}</span>
    <span class="commentIcon">{{pls}}</span>
  </div>
</template>
<script>
import featureComment from './main.js';
export default {
  name: 'YPFeatureCommentTag',
  props: ['featureCode'],
  computed: {
  },
  data() {
    return {
      dzs: 0,
      pls: 0,
    }
  },
  created () {
    featureComment.countComment({featureCode: this.featureCode}).then(rs => {
    	this.dzs = rs.dzs
    	this.pls = rs.pls
    });
  },
  methods: {
    tagClick(){
    	this.$emit("tagClick",this.featureCode)
    }
  },
}
</script>

<style scoped>
.featureCommentWrap{
  display: inline-block;vertical-align: middle;
}
.featureCommentWrap .praiseIcon,.featureCommentWrap .commentIcon{
  display: inline-block;vertical-align: middle;font-size: 0.28rem;padding-left: 0.4rem;
}
.featureCommentWrap .praiseIcon{
  background: url(../../../static/images/praiseIcon.png) no-repeat left center;background-size:0.29rem auto; 
}
.featureCommentWrap .commentIcon{
  background: url(../../../static/images/commentIcon.png) no-repeat left center;background-size:0.3rem auto;margin-left: 0.4rem;
}
</style>
