<template>
  <div class="bs_list">
    <div class="bs_item" v-for="(group,index) in groups" :key="index">
      <div class="item_header">
        <div>{{group.groupNameZh}}</div>
        <div :class="{active: !checkDetail(group)}" @click="toggleFold(group)"></div>
      </div>
      <div style="overflow: hidden">
        <transition
          enter-active-class="animated slideInDown"
          leave-active-class="animated slideOutUp"
        >
          <div class="item_contentList" v-if="!checkDetail(group)">
            <div class="contentItem" v-for="(family,index) in getShowFamilysByGroupCode(group.code)" :key="index">
              <div>{{family.nameEn}}</div>
              <div>{{$commonFun.featureName(family.feature)}}</div>
              <!--更换配置按钮-->
              <div class="editorIcon" @click="changeConfig(family)" v-if="family.editable"></div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <ChangeColor
      :isShowChangeColor = 'isShowChangeColor'
      @close="closeChangeColor"
      v-show="isShowChangeColor"
      :family="family"
    />
  </div>
</template>

<script>
  import ChangeColor from "./ChangeColor";
  import {mapGetters, mapState} from 'vuex'
  export default {
    props:['groups'],
    data() {
      return {
        isShowChangeColor:false,
        family:'',
        detailGroups:[],
      }
    },
    methods:{
      changeConfig(family){
        this.$showFeatureDialog.show({family: this.getFamilyByFamilyCode(family.code),haveChange: true}).then(info => {
          //有改变
          if(info.isChange === true){
            this.$parent.getConfiguration();
          }
        })
      },
      toggleFold(group){
        let _f = this.detailGroups.find(vo => {
          return vo.code == group.code;
        })
        _f.active = !_f.active;
      },
      closeChangeColor(res){
        this.isShowChangeColor = res
      },
      checkDetail(group){
        let _f = this.detailGroups.find(vo => {
          return vo.code == group.code;
        })
        if(_f == null){
          this.detailGroups.push({code: group.code,active: false })
          return false;
        }
        return _f.active;
      },
      getShowFamilysByGroupCode (groupCode) {
        if(groupCode != ''){
          let group =  this.groups.find(vo => {
            return vo.code == groupCode;
          });
          if(group != null){
            let familyList =  group.familyList;
            if(!Array.isArray(familyList)){
              familyList = this.objToArray(familyList);
            }
            group.familyList = familyList;
            group.familyList.forEach(vo=>{
              let feature =vo.featureList[0];
              let data = this.getFeatureByFeatureCode(feature.code)
              if(data!=null){
                vo['feature'] = data //重组数据
              }else{
                feature['familyCode'] = vo.code
                vo['feature'] = feature//重组数据
              }
            })
            return group.familyList
          }
        }
      },
      objToArray  (obj){
        var arr = [];
        for(var i in obj){
          arr.push(obj[i]);
        }
        return arr;
      },
    },
    computed:{
      ...mapState({
        price: state => state.vehicle.price,
        promotionPrice: state => state.vehicle.promotionPrice,
        defaultFeatureCods: state => state.vehicle.defaultFeatureCods
      }),
      ...mapGetters({
        allSelectedFeaturesCode: 'vehicle/getAllSelectedFeaturesCode',
        getFamilyByFamilyCode: 'vehicle/getFamilyByFamilyCode',
        getFeatureByFeatureCode: 'vehicle/getFeatureByFeatureCode',
      }),
    },
    components:{ChangeColor}
  }
</script>

<style scoped>
  @import "../../../static/style/global_mobile.css";
  .bs_list>>>.animated{
    -webkit-animation-duration:300ms;
    animation-duration:300ms;
    -webkit-animation-fill-mode:both;
    animation-fill-mode:both;
  }
  .bs_list{width: 100%}
  .bs_item{width: 100%;margin-bottom: .09rem}
  .item_header{width: 100%;height: .71rem;background: #dde1ea;color: #3e444f;font-size: .28rem;padding: 0 .3rem;display: flex;align-items: center;justify-content: space-between}
  .item_header>div:last-child{width: .35rem;height: .46rem;padding: .1rem;background: url("../../../static/images/mobile/menuIcon.png") no-repeat content-box;background-size: 4.07rem auto;background-position:-.44rem -1.91rem;transition: transform 300ms;}
  .item_header>div:last-child.active{transform: rotate(90deg)}
  .item_contentList{overflow: hidden}
  .contentItem{position: relative;display: flex;align-items: center;padding-left: .3rem;font-size: .24rem;color: #666;min-height: .81rem;width: 100%}
  .contentItem:nth-child(even){background: #f2f6ff}
  .contentItem>.editorIcon{width: .41rem;height: .37rem;background: url("../../../static/images/mobile/menuIcon.png") no-repeat center;background-size: 4.07rem auto;background-position:-1.75rem -.67rem;position: absolute;top: 50%;transform: translateY(-50%);right: .37rem}
  .contentItem>div:nth-child(2){position: absolute;top: 50%;transform: translateY(-50%);left: 3.8rem;color: #000;max-width: 2.8rem}
</style>
