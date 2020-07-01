<!-- 3D 车 外观选项 -->
<template>
  <div class="tabWrap">
    <div class="tabMenu">
      <p class="exteriorColor" :class="{active: true}">{{$t('ExteriorColor')}}</p>
      <p class="accessories" @click="showBoutique()" :class="{active: false}">{{$t('Accessories')}}</p>
    </div>
    <!-- 3D内容 -->
    <div class="tabContent">
      <div class="abbrCar">
        <div id="appearanceCanvas"></div>
        <div class="car_bg"></div>


        <p class="colerName">{{selectedFeature.nameEn}}</p>
        <ul class="colerFeature">
          <li :class="{active: feature.selected}"
              v-for="(feature,index) in getShowFeaturesByFamily(family)" :key="index"
              @click="changeFeature(feature)">
            <yp-img :src="$commonFun.featureIcon(feature)" class="feature__icon"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import boutiqueVehicleComplex from '@/store/complex/BoutiqueVehicleComplex'
  import {mapGetters, mapState} from 'vuex'
import {loading} from '@/packages/loading'
import Vue from 'vue';
  export default {
    props: ['group'],
    data() {
      return {
        selectedFeature: null,
        family: {},
        familyList: [],
        featuresList: [],
      }
	},
	watch: {
		"$route": "init3DStatus"
	},
    created() {
		this.getFamilyList(this.group);
	},
	mounted() {
		this.init3DStatus();
	},
    methods: {
		init3DStatus() {
			this.$nextTick(() => {
				this.getFamilyList(this.group);
				this.getShowFeaturesByFamily(this.family);
				this.$threeOptional.showAppearance({
					//初始化默认code
					defaultFeatureCods: this.defaultFeatureCods,
					featureList: this.allSelectedFeaturesCode,
					haveTween: false, //有动画
					on: {
					startLoad3DJs: () => {
						loading.show();
					},
					extLoadingEnd: () => {
						loading.hide();
					}
					},
					el: "#appearanceCanvas"
				}).then(() => {
					this.setFamilySelected(this.familyList[0])
				});
			});		
		},
      //显示精品列表
      showBoutique: function () {
        this.$emit("showBoutique");
      },
      //获取family列表
      getFamilyList: function () {
        // let fun = this.$store.getters["vehicle/getShowFamilysByGroup"];
        this.familyList = this.getShowFamilysByGroup(this.group)
        this.setFamilySelected(this.familyList[0]) //设置第一个显示
      },


      //设置当前选中
      setFamilySelected: function (family) {
        this.family = family;
        this.selectedFeature = family.featureList.find(vo => {
          return vo.selected === true;
        });
      },
      //点击feature事件
      changeFeature(feature) {
        let family = this.family;
        this.$chooseConflictFeature.valid({feature: feature}).then(rs => {
          if (rs.isChange === true) {
            //设置3D
            this.$threeOptional.setAppearanceFeature({featureCode: feature.code});
            boutiqueVehicleComplex.setUserSelectFeature({feature, family})
            this.selectedFeature = feature;
          }
        })
      }
    },
    computed: {
      ...mapState({
        defaultFeatureCods: state => state.vehicle.defaultFeatureCods
      }),
      ...mapGetters({
        allSelectedFeaturesCode: 'vehicle/getAllSelectedFeaturesCode',
        getShowFeaturesByFamily: 'vehicle/getShowFeaturesByFamily',
		getFamilyByFamilyCode: 'vehicle/getFamilyByFamilyCode',
		getShowFamilysByGroup: 'vehicle/getShowFamilysByGroup',
      })
    },
    beforeDestroy() {
      this.$threeOptional.hideAppearance()
    }
  }
</script>

<style scoped>
  .tabWrap {
    width: 100%;
    height: 87%
  }

  .tabWrap > .tabMenu {
    display: flex;
    padding-top: .5rem;
    align-items: center;
  }

  .tabWrap > .tabMenu > p {
    margin-left: .3rem;
    font: .28rem Arial;
  }

  .tabWrap > .tabMenu > p.active {
    font: .36rem Arial;
    color: #01aeff;
  }

  .abbrCar {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  #appearanceCanvas {
    width: 100%;
    height: 3.7rem;
    margin-top: 1.75rem;
  }

  .car_bg {
    width: 100%;
    height: .93rem;
    margin-bottom: .7rem;
    background: url("../../../static/images/mobile/3Dcar_bg.png");
    -webkit-background-size: 100% auto;
    background-size: 100% auto;
  }

  .colerName {
    font-size: .3rem;
  }

  .colerFeature {
    display: -webkit-box;
    align-items: center;
    max-width: 100%;
    justify-content: center;
    overflow-x: auto;
    margin-top: .76rem;
    height: 1.5rem;
    padding-left: .2rem;
  }

  .colerFeature > li {
    width: .85rem;
    height: .85rem;
    border-radius: 50%;
    margin-right: .2rem;
  }

  .colerFeature > li.active {
    border: .2rem solid #dcdcdd;
    box-sizing: content-box;
  }

  .feature__icon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0px 0.1rem 0.22rem 0.02rem rgba(37, 46, 62, 0.22);
  }
</style>
