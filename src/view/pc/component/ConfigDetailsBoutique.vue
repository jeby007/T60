<template>
<div class="boutiqueLists clearfix">
    <div class="boutiqueList" v-for="bouq in boutiqueList"  >
        <div class="boutiqueImg fl" @click="showBoutiqueDetailBox(bouq.id)">
            <img class="imgCenter" :src="bouq.tipImage" alt="" />
        </div>
        <div class="boutiqueInfo fl">
            <div class="boutiqueName ellipsis">{{bouq.name}}</div>
            <div class="boutiqueType ellipsis">{{bouq.catName}}</div>
            <div class="clearfix">
                <span class="blueC fl" style="line-height:0.5rem;"><i class="renIcon">￥</i>{{bouq.price}}</span>
                <span v-show="!garageEditable" class="boutiqueCost fl">数量：<i class="yellowC">{{bouq.savenum}}</i></span>
                <span v-show="bouq.valid==false" class="boutiqueSoldOut fl"></span>
                <div v-show="garageEditable && bouq.valid==true" class="products__amount clearfix fr">
                    <span class="minusIcon" @click="deleteBoutique(bouq)"></span>
                    <input :value="bouq.savenum" type="number" class="number" disabled="disabled" />
                    <span class="plusIcon" @click="addBoutique(bouq)"></span>
                </div>
            </div>
        </div>
        <span class="delBoutiqueList" v-show="garageEditable" @click="deleteBoutique(bouq)"></span>
    </div>
    <div class="addBoutiqueList" v-show="garageEditable" @click="jumpQuality">
        <div>
            <div></div>
            <p>{{$t('Addmore')}}</p>
        </div>
    </div>
</div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    props:['garageEditable'],
    data() {
        return {

        }
    },
    computed:{
        ...mapGetters({ boutiqueList: 'boutique/getSaveboutique'}),
    },
    methods: {
        //删除精品
        deleteBoutique(boutique){
            this.$store.dispatch('boutique/deleteBoutique',boutique).then(()=>{})
        },
       //添加精品
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
        //跳回选配页面精品
        jumpQuality(){
             this.$router.push({name: "optionalcar",params: {showGroupCode: 'jp'}});
        },
        //显示精品详情弹框
        showBoutiqueDetailBox(id){

            this.$emit("boutiqueDetailBoxCallBack",id)
            //console.log(this.$parent)
           /* this.$parent.id = id;
            this.$parent.showBoutiqueDetail = true;*/
           // this.$parent.boutiqueDetailBoxCallBack(id);
            // this.$emit('boutiqueDetailBoxCallBack',id)
        }
    }
}
</script>

<style scoped>
.boutiqueList{
  margin-bottom:0.2rem; padding:0.15rem; width:98%; height:1.84rem; background-color: #1a1a1a; border: 1px solid #666; border-radius: 0.1rem;position: relative;
}
.boutiqueLists .boutiqueImg{
  position: relative; width: 2.2rem; height: 1.3rem; background-color: #fff;margin-right: 0.26rem;
}
.boutiqueLists .imgCenter{max-width:2.2rem;max-height: 1.3rem}
.boutiqueLists .boutiqueInfo{
  width:6rem;color: #fff; font-size: 0.26rem; text-align: left;
}
.boutiqueLists .boutiqueName,.boutiqueLists .boutiquePrice{
  width: 4.4rem;height: 0.5rem;line-height: 0.5rem;
}
.boutiqueLists .boutiqueType{margin-bottom: 0rem;}
.boutiqueLists .qualityBlock__bottom{
  position: absolute;left: 4.46rem;bottom: 0.3rem;width: 7.7rem;line-height: 0.7rem;
}
.boutiqueLists .yellowC{line-height: 0.5rem;}
.boutiqueLists .products__amount{
  height: 0.5rem; line-height: 0.50rem; border:1px solid #666;border-radius: 0.1rem;
}
.boutiqueLists .minusIcon{float: left;width:0.5rem;height:100%;background: url(../../../static/images/minusIcon2.png) no-repeat center;background-size: 0.5rem auto;}
.boutiqueLists .number{float: left;width:0.84rem;height:100%;background: transparent;border-left:1px solid #666;border-right:1px solid #666;text-align: center;color:#fff;border-radius: 0;padding-left: 0.15rem;}
.boutiqueLists .plusIcon{float: right;width:0.5rem;height:100%;background: url(../../../static/images/plusIcon2.png) no-repeat center;background-size: 0.5rem auto;}
.boutiqueLists .delBoutiqueList{
  position: absolute;top:0.1rem;right: 0.1rem;width:0.35rem;height: 0.35rem;background: url(../../../static/images/closeIcon1.png) no-repeat center;background-size: 0.2rem auto;
}
.boutiqueLists .boutiqueSoldOut{
    margin:-0.095rem 0.6rem 0 0.6rem;width: 2.32rem;height: 0.89rem;background: url(../../../static/images/soldOut.png) no-repeat center center;background-size: 2.32rem auto;
}
.addBoutiqueList{
    width:10.6rem; height:1.84rem; background-color: #1a1a1a; border: 1px solid #666; border-radius: 0.1rem;color: #01aeff;font-family: PingFangSC-Medium, sans-serif;display: flex;align-items: center;justify-content: center}
.addBoutiqueList>div{width: 2rem; height: 100%; background-size: 100% auto;display: flex;align-items: center;justify-content: center;flex-direction: column;}
.addBoutiqueList>div>div{width: .99rem; height: .99rem; background: url(../../../static/images/addIconT60.png) no-repeat center;background-size: 100% auto;}
.addBoutiqueList p{margin-top: .08rem;font-size: .3rem}
  @media only screen and (min-width: 736px) and (max-width: 811px) {
    .boutiqueLists .boutiqueInfo{width: 3.2rem;}
    .boutiqueLists .boutiqueName,.boutiqueLists .boutiquePrice{width: 3rem;}
  }
</style>
