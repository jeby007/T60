import serve from '@/common/serverApi.js'

export default{
    //正常选配页面初始load接口
    loadConfigurationOptionWithFeatures:function (params) {
        return serve.get("/Home/Index/loadConfigurationOptionWithFeatures.html",params);
    },
    //验证手机号码是否有极客选配资格
    checkMobileAndSendSms:function (params) {
        return serve.get("/Home/Index/checkMobile.html",params);
    },
    //验证手机号码和验证码
    checkCode:function (params) {
        return serve.get("/Home/Index/checkCode.html",params);
    },
    //确认配置页获取配置信息
    getConfiguration:function(params){
        return serve.get("/Home/Index/getConfiguration.html",params);
    },
    //下单
    saveToOrder:function(params){
        return serve.get("/Home/Garage/saveToOrder.html",params);
    },

    /**------------------- 车库相关接口start ----------------------------*/
	//我的车库 {token token}
    myGarage:function(params){
        return serve.get("/Home/Garage/myGarage.html",params);
    },
    
    //保存到车库 {userUuid 用户uuid,selectedCodes:主动选择featurecode,preorderSid:预订单id,garageId:车库id没有为空}
    saveToGarage:function(params){
        return serve.get("/Home/Garage/saveToGarage.html",params);
    },
    /**
     * 删除车库配置
     * @param params {garageId:车库id,userUuid 用户uuid}
     */
    garageDelete:function(params){
        return serve.get("/Home/Garage/garageDelete.html",params);
    },
    /**
     * 点击下单或者继续编辑时验证当前车库是否有效(定制车)
     * @param  params {garageId:车库id,userUuid 用户uuid}
     */
    myGarageToCheckMatch: function(params){
        return serve.get("/Home/Garage/myGarageToCheckMatch.html",params);
    },
    /**
     * 车库下单确认配置接口,点击下单(定制车有效,需要跳转到确认配置)
     * @param  params {garageId:车库id,userUuid 用户uuid}
     */
    garageConfiguration:function(params){
        return serve.get("/Home/Garage/garageConfiguration.html",params);
    },
   
    /**------------------- 车库相关接口end ----------------------------*/


    /**
     * 试乘试驾获取省份,城市,经销商接口
     */
    getAllDealerProCity:function () {
       return serve.get("/Home/Dealer/getAllDealerBySeries.html");
    },
    /**
    * 提交试乘试驾
    * * @param $sourceId //流水号
     * @param $custName 客户姓名
     * @param $gender 性别
     * @param $mobilephone 客户手机号
     * @param $intentSeries 意向车系
     * @param $dealerName 经销商名称
     * @param $dealerCode 经销商code
     * @param $city 城市名称
     * @param $state 省份名称
     * @param $preorderSid 预订单id
     * @Return void
    */
    singleReceive:function (params) {
            return serve.get("/Home/Testdrive/singleReceive.html",params);
    },
    /**
     * 爆款,现车 搜索省市区
     * @param $areacode 传入null或者'0'返回省，传入省Code返回市，传入市Code返回区
     */
    provinceSearch:function(params){
        return serve.get("/Home/Dealer/provinceSearch.html",params);
    },
    /**
     * 通过省市Code检索所在g50经销商
     * @param string $code 输入省市区Code
     */
    dealerSearchByCodeandcycleType:function(params){
        return serve.get("/Home/Dealer/dealerSearchByCodeandcycleType.html",params);
    },
    /**
    * 爆款列表接口
    */
    hotsales:function(){
        return serve.get("/Home/Index/hotSales.html");
    },

     /**
     * 获取精品列表
     * @param $selectFeatusCods 所有的选中项featurecode,用逗号分隔
     * @param string $currentFeatusCode 当前featurecode 可以不传,为空就是group下面的精品
     */
    boutiqueList:function(params){
        return serve.get("/Home/Boutique/getBoutiqueList.html",params);
    },

    /*
    * 保存精品
    * @param $preorderSid  预订单sid(或者是车库id,或者是sid)
    * @param string $boutiqueAndNum  格式为(id:num,id:num,id:num)冒号拼接精品和数量，逗号号隔开多个精品
    ** 2019-02-18
    */
    saveBoutque:function(params){
        return serve.get("/Home/Boutique/saveBoutque.html",params);
    },
    /**
     * 订单/车库继续编辑加载精品
     * @param $orderNo 订单需要的
     * @param $garageId 车库需要的
     * @param $token 车库需要的
     * @Author    Fal
     * 2019-02-20
     */
    loadBoutiqueFromOrderGarage:function(params){
        return serve.get("/Home/Boutique/loadBoutiqueFromOrderGarage.html",params);
    },
     /**
     * 各模式和个性化选配页：获取配置详情展示页面内容
     * @param string $sid 车辆sid 和mode 是一种情况 (现车,爆款等列表进入的时候使用sid)
     * @param string $preorderSid 预订单id, 和 mode 是一种情况 (从个性化选配进入)
     * @param int $mode 场景 当前选配车 -1       互动列表  0        智能推荐列表 2      热销推荐列表 4、5      W+3 列表 6
     * @param string $garageId 车库id 和  token是一种情况(车库)
     * @param string $token 登陆的token,和车库id配合使用
     */
    getConfigurationDetails:function(params){
        return serve.get("/Home/Index/getConfigurationDetails.html",params);
    },
    //车型对比页面
    getComparativeConfigurations:function(params){
        return serve.get("/Home/Index/getComparativeConfigurations.html",params);
    },
    //确认配置回去选项
    getEditFeatures:function(params){
        return serve.get("/Home/Index/getEditFeatures.html",params);
    },
    /*
     * 确认配置页查看相似现车
     * param    preorderSid         预订单主键
     */
    recommendInventories:function(params){
        return serve.get("/Home/Inventorycar/recommendInventories.html",params);
    },

    /*
     * 文件下载
     * param    filePath         文件地址
     */
    downloadFile:function(params){
        return serve.get("/Home/Index/downloadFile.html",params);
    },
    /*
    ** 更多现车：现车查询条件
    **
    */
    inventoryQuestions:function(){
        return serve.get("/Home/Inventorycar/inventoryQuestions.html");
    },

    /*
    ** 现车：选择答案
    * param    selectedFeatureCodes
    * param    sid
    ** 2018-08-24
    */
    inventorySelectAnswer:function(params){
        return serve.get("/Home/Inventorycar/inventorySelectAnswer.html",params);
    },

    /*
    ** 现车销售模式：获取现车销售列表
    ** param    city                城市编码
    ** param    dealerId            经销商id
    ** param    transmissionType    变速箱
    ** param    seatsLayout         座椅布局
    ** param    extColor            外观颜色
    ** param    engineType          发动机
    ** param    maxPrice            最高价
    ** param    minPrice            最低价
    ** param    pageIndex           请求页
    ** param    pageSize            每页显示数量
    ** 2018-04-01
    */
    findInventories:function(params){
        return serve.get("/Home/Inventorycar/findInventories.html",params);
    },
   /*
   * 互动问答模式：获取互动问答推荐车型
   * param    featureCodes    所选答案对应的 feature codes，半角逗号分隔
   *
   * 2018-03-14 2+2+3 N25J 2+2+2 N25H         1.5T直喷发动机+7DCT E00S  1.3T双喷射发动机+6MT E00G
   */
    getRecommendPackageByFeatureCodes:function(params){
         return serve.get("/Home/index/getRecommendPackageByFeatureCodes.html",params);
    },
    //测试sso登陆用的
    ssoOrderUrl:function(params){
        return serve.get("/Home/Garage/ssoOrderUrl.html",params);
    },
    //优惠包
    getCouponList:function(params){
        return serve.get("/Home/Couponpackage/getCouponList.html",params);
    },

    //互动问答 无参数
    interact:function(params){
        return serve.get("/Home/Interact/interact.html",params);
    },
	/*
    ** 根据经销商id获取热门车型库存
    ** param    dealerId    经销商id
    ** 2019-01-26
    */
    getHotPackageCount:function(params){
        return serve.get("/Home/Inventorycar/getHotPackageCount.html",params);
    },
	/*
    ** 获取某一款热门车型下的库存现车列表
    ** param    dealerId    经销商id
    ** packageSid    热门基型车sid
    ** 2019-01-26
    */
    getInventoriesByPackageSid:function(params){
        return serve.get("/Home/Inventorycar/getInventoriesByPackageSid.html",params);
    },
    /*
    ** 精品优惠包回调接口
    * @param $preorderSid  预订单sid
    * @param string $boutique  精品id（非必填项）
    * @param string $promotionId  优惠包id（非必填项）
    ** 2019-01-26
    */
    chooseBoutiqueAndPromotion:function(params){
        return serve.get("/Home/Couponpackage/chooseBoutiqueAndPromotion.html",params);
    },
   

    /*
    ** [意见反馈表单验证使用token]
    */
    getTokenFeedback:function(){
        return serve.get("/Home/Feedback/getToken_feedback.html");
    },

    /**
     * 意见反馈
     * @Purpose [意见反馈]
     * @param $username   用户名
     * @param $mobile  手机号
     * @param $reason  //意见反馈
     * @prama $token_feedback: token_feedback(上面的getTokenFeedback中获取)
     * @prama $images: 图片
     * @Return void
     * |+-----------------------------------------------------------------------------
     */
    feedbackFeedback:function(params){
        return serve.get("/Home/Feedback/feedbackFeedback.html",params);
    },

    /*
     * 获取上传图片用accessToken 时效5分钟
     * param    token   用户登录token
     *
     * 2018-12-25
     */
    getPicAccessToken:function(params){

        return serve.get("/Home/Feedback/getPicAccessToken.html",params);
    },


    /*
     * 上传图片
     * param    file   pic access token
     * accessToken
     * category
     *
     * 2018-12-25
     */
    uploadPic:function(params){
        return serve.get("/Home/Feedback/uploadPic.html",params);
    },

    /**
     * |+-----------------------------------------------------------------------------
     * @Purpose [语音列表查询接口]
     * @param $token  登录token(不必传)                   Y
     * @param $searchArea  查询范围(D90.外观/G50.内饰.装备等，不传默认整车)                 N
     * @Return json
     * |+-----------------------------------------------------------------------------
     */
    getAudioList:function(params){
        return serve.get("/Home/Audio/getAudioList",params,false);
    },

    /**
     * |+-----------------------------------------------------------------------------
     * @Purpose [即将开放的配置接口]
     * @param $pageNum 分页号 请固定为1
     * @param $pageSize 每页返回量 请固定为 200
     * |+-----------------------------------------------------------------------------
     */
    getRecordList:function(params){
        return serve.get("/Home/Record/getRecordList",params);
    },

    toDown:function(params){
        return serve.get("/Home/Index/toDown",params);
    },

    setExportConfigurationInventoryPdf:function(params){
        return serve.get("/Home/Index/setExportConfigurationInventoryPdf",params);
    },
};