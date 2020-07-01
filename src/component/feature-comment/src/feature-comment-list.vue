<template>
<div class="feartureCommentListWrap">
    <screeningComment v-if="showScreeningComment"
                      :showScreeningComment="showScreeningComment"
                      @closeCommentPopup="closeCommentPopup"
    />
    <div class="header clearfix">
        <div class="header__right">
            <a class="publishBtn">发布评论</a>
        </div>
        <div class="header__title header__title2" @click="$router.back()">用户评论</div>
    </div>
    <div class="feartureCommentLists">
        <!-- <div class="commentopsStyle"> -->
            <vue-scroll :ops="commentops">
                <div class="scrollWrap">
                    <div class="comment__crumb" @click="showScreeningComment=true">
                        已选：<span>外观</span> &gt; <span>外饰颜色</span> &gt; <span class="yellowC">水性蓝</span>
                    </div>
                    <div class="feartureCommentList">
                        <div class="comment__user clearfix">
                            <img class="userFace fl" src="../../../static/images/car45.png" alt="" />
                            <span class="userName fl">用户名称</span>
                            <a class="userDelete fr">删除</a>
                            <span class="userTime fr">评论时间</span>
                        </div>
                        <div class="comment__details">
                            <div class="comment__details--text">
                                <div class="commentTextWrap">
                                    <span class="commentText">{{commentText}}</span>
                                </div>
                                <div class="textUnfold" @click="toggleShowMore" v-if="isShowToggleBtn">
                                    <span>{{toggleBtn ? '展开' : '收起'}}</span>
                                </div>
                            </div>

                            <ul class="comment__details--img">
                                <li><img class="imgCenter" src="../../../static/images/car45.png" alt="" /></li>
                                <li><img class="imgCenter" src="../../../static/images/car45.png" alt="" /></li>
                                <li><img class="imgCenter" src="../../../static/images/car45.png" alt="" /></li>
                            </ul>
                        </div>
                        <div class="comment__total">
                            <span class="praiseIcon">501</span>
                            <span class="commentIcon">45</span>
                        </div>
                        <div class="comment__form">
                            <div class="" :class="{otherStyle: showOtherStyle && !isIos}">
                                <div class="comment__formBg clearfix">
                                    <div @focus="showOtherStyle = true" @blur="showOtherStyle = false" class="comment__form--field" contenteditable="true">登录后才可添加评论</div>
                                    <a class="sendBtn" @click="showOtherStyle = false">发送</a>
                                </div>
                            </div>
                        </div>
                        <ul class="comment__list">
                            <li>
                                <label class="yellowC">评论者A</label>回复<label class="yellowC">评论者B：</label>
                                <span class="comment__list--cont">评论的内容</span>
                                <span class="praiseIcon praiseIconNo">501</span>
                            </li>
                        </ul>
                        <div class="yellowC lookMoreBtn"><span>查看更多评论&gt;&gt;</span></div>
                    </div>
                </div>
            </vue-scroll>
        <!-- </div> -->
    </div>
</div>

</template>
<script>
import featureComment from './main.js';
import $ from 'jquery'
import Vue from "vue";
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import screeningComment from '../../../view/pc/component/screeningComment'
Vue.use(vuescroll);

export default {
    name: 'YPFeatureCommentList',
    props: ['featureCode'],
    computed: {
    },
    data() {
        return {
            dzs: 0,
            pls: 0,
            isIos:true,  //是否是ios系统
            showOtherStyle:false,
            commentops: {
                vuescroll: {},
                scrollPanel: {
                    initialScrollY: false,
                    initialScrollX: false,
                    scrollingX: false,
                    scrollingY: true,
                },
                rail: {
                    background: '#fff',
                    opacity: 0.2,
                    border: '50%',
                    size: '4px',
                    specifyBorderRadius: false,
                    gutterOfEnds: null,
                    keepShow: false
                },
                bar: {
                    onlyShowBarOnScroll: true,
                    keepShow: true,
                    background: '#fff',
                    opacity: 1,
                    border: '50%',
                    hoverStyle: false,
                    specifyBorderRadius: false,
                    minSize: false,
                    size: '4px'
                }           //滚动条初始化样式
            },
            commentText:'' ,
            toggleBtn: true,   // 显示展开还是收起 true/展开;false/收起
            isShowToggleBtn: false,   // 是否显示展开收起按钮
            showScreeningComment:false
        }
    },
    created () {
        featureComment.countComment({featureCode: this.featureCode}).then(rs => {
        	this.dzs = rs.dzs
        	this.pls = rs.pls
        });
    },
    mounted(){
        this.initTxt()
        document.documentElement.style.overflowY = 'hidden'
    },
    activated:function(){
        //判断系统
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isAndroid) {
            _self.isIos = false;
        }
        if (isIOS) {
    　　    _self.isIos = true;
        }
    },
    methods: {
        tagClick(){
        	this.$emit("tagClick",this.featureCode)
        },

        toggleShowMore () {
            this.toggleBtn = !this.toggleBtn;
            if (this.toggleBtn) {
                $('.commentTextWrap').css({'overflow':'hidden','max-height':'1.8rem'})
            }else {
                $('.commentTextWrap').css({'overflow':'visible','max-height':'100%'})
            }
        },
        initTxt(){
            this.commentText='这车好哇，牛大了百公里提速3秒半，开上这车腰不酸了腿不疼了，走路也有劲了，失散多年的亲人也找到了，从此趟上了人生巅峰！从此趟上了人生巅峰！从此趟上了人生巅峰！'
        },
        closeCommentPopup(bl){
            this.showScreeningComment=bl
        }
    },
    watch:{
        commentText(){
            this.$nextTick(()=>{
                const commentTextHight=$('.commentText').height()
                const commentTextWrapHight=$('.commentTextWrap').height()
                if (commentTextHight>commentTextWrapHight){
                    this.isShowToggleBtn=true
                } else {
                    this.isShowToggleBtn=false
                }
            })
        }
    },
    components:{screeningComment}
}
</script>

<style scoped>
.feartureCommentListWrap{width: 100%;height: 100%}
.commentTextWrap{max-height: 1.8rem;overflow: hidden}
.textUnfold{color: #ffa401;width: 1rem;cursor: pointer;}
.publishBtn{
    display: inline-block;vertical-align: middle;width: 2.76rem;height: 0.8rem;line-height: 0.8rem;background: #ffa401;color: #fff;text-align: center;font-size: 0.32rem;border-radius: 0.5rem;
}
.feartureCommentLists{
    position: fixed;top:1.8rem;left: 50%;margin-left: -10.625rem;
    width: 21.7rem;
    height:calc(100vh - (1.8 + 0.5) * (100 * 100vw / 2436));
    height:-webikit-calc(100vh - (1.8 + 0.5) * (100 * 100vw / 2436));
    height:-moz-calc(100vh - (1.8 + 0.5) * (100 * 100vw / 2436));
    height:-ms-calc(100vh - (1.8 + 0.5) * (100 * 100vw / 2436));
    height:-o-calc(100vh - (1.8 + 0.5) * (100 * 100vw / 2436));
}
/*.commentopsStyle{height: 100%;overflow-x:hidden;width: 100%;}*/
.comment__crumb{
    color: #fff;font-size: 0.36rem;width: 21.7rem;line-height: 0.6rem;margin-bottom: 0.3rem;padding-left: 0.6rem;position: relative;
}
.feartureCommentList{
    background: rgba(51,51,51,0.8);color: #fff;border-radius: 0.1rem;width: 21.3rem;padding-bottom: 0.1rem;margin-bottom: 0.3rem;
}
.comment__user{
    padding:0.12rem 0.36rem 0.2rem 0.56rem;line-height: 0.8rem;background: url(../../../static/images/line7.png) no-repeat center bottom;background-size:20.41rem auto;
}
.comment__user .userFace{
    width: 0.8rem;height: 0.8rem;border-radius: 50%;margin-right: 0.1rem;
}
.comment__user .userName{font-size: 0.36rem;}
.comment__user .userDelete{
    font-size: 0.3rem;padding-left: 0.32rem;background: url(../../../static/images/delIcon3.png) no-repeat left center;background-size: 0.26rem auto;margin-left: 0.4rem;color: #ffa401;
}
.comment__user .userTime{
    font-size: 0.26rem;color: #b5b8b9;
}
.comment__details{
    padding:0.3rem 0.6rem 0.3rem 0.7rem;display: flex;justify-content: space-between;
}
.comment__details .comment__details--text{
    max-width: 17.2rem;font-size: 0.3rem;line-height: 0.6rem;margin-right: 0.3rem;
}
.comment__details--img{display: flex;max-width: 7rem}
.comment__details--img li{
    width: 2rem;height: 2rem;margin-right: 0.3rem;position: relative;float: right;
}
.comment__total{
    padding-left:0.7rem;margin-bottom: 0.45rem;
}
.praiseIcon{
    display: inline-block;vertical-align: middle;padding-left: 0.4rem;background: url(../../../static/images/praiseIcon.png) no-repeat left center; background-size:0.29rem auto;
}
.praiseIcon.praiseIconNo{
    background: url(../../../static/images/praiseIcon2.png) no-repeat left center; background-size:0.35rem auto;
}
.commentIcon{
    display: inline-block;vertical-align: middle;padding-left: 0.4rem;background: url(../../../static/images/commentIcon.png) no-repeat left center; background-size:0.3rem auto; margin-left: 0.3rem;position: relative;
}
.commentIcon:after{
    content:"";display: block;width:0;height:0;border-left: 0.15rem solid transparent;border-right: 0.15rem solid transparent;border-bottom: 0.3rem solid #828281;position:absolute;left: 50%;bottom:-0.46rem;margin-left: -0.15rem;
}
.comment__form{
    padding-top:0.2rem;background: url(../../../static/images/line7.png) no-repeat center top;background-size:20.41rem auto;position: relative;
}
/*.comment__form:before{
    content:"";display: block;width:0;height:0;border-left: 0.15rem solid transparent;border-right: 0.15rem solid transparent;border-bottom: 0.3rem solid #828281;position:absolute;left: 2.2rem;top:-0.3rem;
}*/
.comment__formBg{
    width: 20rem;background: #202020;border-radius: 0.1rem;margin:0 auto;padding:0.1rem 0 0.1rem 0.1rem;
}
.comment__formBg .comment__form--field{
    float: left;width:18rem;min-height: 0.64rem;padding:0.07rem 0;line-height: 0.5rem;color: #8a8a8a;font-size: 0.32rem;background: transparent;max-height: 2.56rem;text-align: center;
    word-wrap: break-word;overflow-x: hidden;overflow-y: auto;-webkit-user-modify: read-write-plaintext-only;
}
.comment__formBg .sendBtn{
    float: right;width: 1.76rem;height: 0.64rem;line-height: 0.64rem;text-align: center;color: #fff;background: #ffa401;border-radius: 0.1rem;font-size: 0.32rem;
}
.comment__list{
    width: 19.3rem;margin:0.1rem auto 0.3rem;
}
.comment__list li{
    display: block;padding:0.1rem 0;font-size: 0.3rem;color: #ccc;
}
.comment__list li .praiseIcon{
    margin-left: 0.3rem;
}
.lookMoreBtn{
    display:block;padding:0.2rem 0 0.3rem 1rem;background: url(../../../static/images/line7.png) no-repeat center top;background-size:20.41rem auto;
}

/*input发布弹框*/
.feartureCommentLists .otherStyle{
    position: fixed;width:100%;height: 100%;top:0;left: 0;background: rgba(0,0,0,0.8);
}
.feartureCommentLists .otherStyle .comment__formBg{
    position: absolute;top:50%;left: 50%;margin-left: -10rem;margin-top:-0.45rem;
}
.feartureCommentLists .otherStyle .comment__form--field{
    text-align: left;
}
</style>
