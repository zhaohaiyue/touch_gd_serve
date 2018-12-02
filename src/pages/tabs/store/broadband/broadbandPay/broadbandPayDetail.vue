<template>
  <!-- 宽带收费详情 -->
  <van-popup v-model="payDetail" position="right" :overlay="false">
    <Header @goBack="goBack()" @customServices="customServices()" title="宽带收费"></Header>
    <div class="scroll">
         <div v-if="!cbFeeloginFlag">
            <table class="wo-broadband-table">
                <tr>
                    <td class="wo-broadband-leftCol">
                        <span>客户姓名</span>
                    </td>
                    <td class="wo-broadband-rightCol">
                        <span>{{broadbandData.userName}}</span>
                    </td>
                </tr>
                <tr>
                    <td class="wo-broadband-leftCol">
                        <span>速率</span>
                    </td>
                    <td class="wo-broadband-rightCol">
                        <span>{{broadbandData.speed}}</span>
                    </td>
                </tr>
                <tr>
                    <td class="wo-broadband-leftCol">
                        <span>装机人员手机号码</span>
                    </td>
                    <td class="wo-broadband-rightCol">
                        <span>{{broadbandData.number}}</span>
                    </td>
                </tr>
                <tr>
                    <td class="wo-broadband-leftCol">
                        <span>装机地址</span>
                    </td>
                    <td class="wo-broadband-rightCol">
                        <span>{{broadbandData.address}}</span>
                    </td>
                </tr>
            </table>


            <table class="wo-broadband-table">
                <tr  v-for="(key, fee) in broadbandData.fee_Info">
                    <td class="wo-broadband-leftCol">
                        <span>{{fee.fee_name}}</span>
                    </td>
                    <td class="wo-broadband-rightCol">
                        <span>{{fee.amount/100}}元</span>
                    </td>
                </tr>
                <tr>
                    <td class="wo-broadband-totalChargeText">
                        <span class="wo-broadband-greytext">总应收</span>
                    </td>
                    <td class="wo-broadband-totalCharge">
                        <span>{{broadbandData.totalCharge}}</span>
                    </td>
                </tr>
            </table>
        </div>
        <div v-if="cbFeeloginFlag">
            <table class="wo-broadband-table">
                <tr>
                    <td width="50%">
                        <span>宽带编码</span>
                    </td>
                    <td class="">
                        <span>{{broadbandData.serialNumber}}</span>
                    </td>
                </tr>
            </table>
            <table class="wo-broadband-table">
                <tr v-for="(feeinfo,key) in broadbandData.feeInfos">
                    <td width="50%">
                        <span>{{feeinfo.feeTypeName}}</span>
                    </td>
                    <td>
                        <span>{{feeinfo.fee/100}}元</span>
                    </td>
                </tr>
                <tr>
                    <td width="50%">
                        <span>总应收</span>
                    </td>
                    <td>
                        <span>{{broadbandData.totalFee/100}}元</span>
                    </td>
                </tr>
            </table>
        </div>
        <div class="wo-broadband-payStatus" v-show="orderStatus.isShowText">
            <div>
                <div class="wo-broadband-payIcon">
                    <img v-bind:src="orderStatus.payIcon">
                </div>
                <span class="wo-broadband-payText">{{orderStatus.payText}}</span>
            </div>
        </div>
        <div class="wo-broadband-payWay">
            <div class="wo-alipay-botton-container" id="wo-alipay-button-container">
                <a class="wo-alipay-button" @click="openDialog(0)"><img src="../../../../../assets/img/alipayicon.png">支付宝支付</a>
            </div>
            <div class="wo-alipay-botton-container" id="wo-wechat-button-container">
                <a class="wo-wechat-button" @click="openDialog(1)"><img src="../../../../../assets/img/wechaticon.png">微信支付</a>
            </div>
            <div style="clear:both"></div>
        </div>
        <div v-show="dialog">
          <div class="popup-container popup-showing active">
              <div class="popup popScan">
                  <div class="qrcodeOuter">
                    <!-- <qrcode class="qrcodeContainer" version={{qrCodeData.version}} error-correction-level={{qrCodeData.level}} size={{qrCodeData.size}} data={{qrCodeData.data}} ></qrcode> -->
                    <div id="qrcode" class="qrcodeContainer" :src='qrCodeData.data'></div> 
                  </div>
                  <a class="dialogCancelButton" @click="dialog = false">
                    <img src="../../../../../assets/img/crossicon.png" style="vertical-align: 0;">
                  </a>
                  <span class="scanQrCode ng-binding">请{{qrCodeData.way}}扫描二维码</span>
                  <span class="scanCharge ng-binding">￥{{broadbandData.totalCharge}}</span>
              </div>
          </div>
          <div class="backdrop" id="scanPop"></div>
        </div>
    </div>
    <div class="quering" v-show="queryLayer">
        <van-loading type="spinner" color="black" />
        查询中...
    </div>
  </van-popup>
</template>
<script>
import Header from "@/components/Header";
import woBtn from "@/components/woBtn";
import woTitleBar from "@/components/woTitleBar";
import * as GdCityList from "../../../../../constants/gdCityList.js";  //城市编码
import QRCode from 'qrcodejs2';  //二维码
import axios from "axios";

let gdCityList =  GdCityList.default.gdCityList;

export default {
  components: {
    Header,
    woBtn,
    woTitleBar
  },
  data() {
    return {
        queryLayer: false, //控制查询中图层..
        gdCityList: gdCityList, //城市列表赋到data中
        payDetail: true, //收费信息
        dialog: false, //是否显示扫码
        cbFeeloginFlag: false, //cb费用标识
        timer: '',
        qrCodeData :{
            version: 6,
            level: 'M',
            size: '',
            data: '',
            way: ''
            // href: '',
        },
        //订单状态信息，用页面显示支付成功或失败
        orderStatus: {
            isShowButton: true, //是否显示两个支付的按钮
            isShowText: false,  //是否显示支付成功或失败
            isOpenDialog: false, //是否打开弹框
            payText: '',   //支付结果提示语
            //支付结果图标
            payIcon: ''
        },
        broadbandData: {
            serialNumber: '',
            totalFee: '',
            feeInfos: '',
            totalCharge: ''
        },
        param : {
            operatorId: '',
            city: '',
            district: '',
            channelId: '',
            channelType: '',
            serialNumber: '',
            orderId: '',
            cancelFee: '',
            feeStaffId: '',
            feeDepartId: '',
            feeEparchyCode: '',
            feeCityCode: '',
        },  
        broadbandData: {
            orderId: '',            //订单id
            userName: '',           //用户名称
            speed: '',              //速率
            totalCharge: '',        //总费用
            number: '',             //装机人员号码
            address: '',            //装机地址
            installCharge: '',      //一次性安装费用
            deviceCharge:'',        //设备费用
            netDeviceCharge: '',    //网络设备费用
            testCharge: '',         //调试费用
            device: '',             //MODEM/家庭网关/光猫费用
            aliPayUrl: '',          //支付宝生成二维码url
            weChatPayUrl: ''        //微信支付生成二维码url
        },
        param : {
            total_amount: "",
            rate_name: "",
            tel: "",
            trade_id: "",
            pro_number: "",
            broad_account: "",
            eparchy_code: ""
        }

    }
  },
  created(){

  },
  mounted(){
    let cbFeeloginFlag = Boolean(JSON.parse(localStorage.getItem('cbFeelogin')));
    this.cbFeeloginFlag = true;
    // 1
    cbFeeloginFlag ? this.getCbOrderData() : this.getOrderData();
    this.qrCodeData.size = window.innerWidth * 0.7 * 0.9;
    this.qrcode();
    //保存宽带订单信息，获取order_id   接着
  },
  methods: {
        qrcode () {
            let qrcode = new QRCode('qrcode', {
                width: 200,
                height: 200, // 高度
                text: '56663159' // 二维码内容
                // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
                // background: '#f0f'
                // foreground: '#ff0'
            })
            console.log(qrcode)

        },
        //得到一条市信息
        getCityInfo (key, value) {
            let gdCityList = this.gdCityList;
            if (key == 'cityName') {
                if (value.indexOf('市')) {
                    value = value.substr(0, value.length - 1);
                    console.log('去掉市： ' + value);
                }
            }
            for (let i in gdCityList) {
                let city = gdCityList[i];
                if (city[key] == value) {
                    return city;
                }
            }
        },
        //返回
        goBack() {
            this.$router.back(-1);
        },
        // openDialog(key) {
        //     if(key == 0 || key == 1){
        //         this.dialog = true
        //     }
        // },
        closeDialog() {
            this.dialog = false
        },
        
        //从缓存中获取宽带订单信息和装机人员信息
        getOrderData() {
        //     let data =JSON.parse(localStorage.getItem('orderUserInfo'));
        //     let installData =JSON.parse(localStorage.getItem('installedPersonInfo'));  
        //     console.log(data);
        //     console.log(installData);
        //     this.broadbandData.userName = data.cust_name;
        //     this.broadbandData.speed = data.mb;
        //     this.broadbandData.number = installData.wsResult.retData.params[4].value;
        //     this.broadbandData.totalCharge = data.total_amount != undefined?(data.total_amount * 0.01) + "元":"0元";
        //     this.broadbandData.address = data.intall_addr;
        //     this.broadbandData.fee_Info = data.fee_Info;
        //     let chargeArray = data.fee_Info;
        //     let chargeData = {}
        //     chargeArray.forEach( function (numObj, index, array){
        //         if(data == null){
        //             return;
        //         }
        //         var key = numObj.fee_name
        //         chargeData[key] = numObj.amount;
        //     });
        //     this.broadbandData.testCharge = chargeData['安装调测费'] != undefined?(chargeData['安装调测费'] * 0.01) + "元":"0元";
        //     this.broadbandData.device = chargeData['MODEM/家庭网关/光猫'] != undefined?(chargeData['MODEM/家庭网关/光猫'] * 0.01) + "元":"0元";
        //     this.broadbandData.installCharge = chargeData['一次性装机费'] != undefined?(chargeData['一次性装机费'] * 0.01) + "元":"0元";
        //     this.broadbandData.deviceCharge = chargeData['终端费'] != undefined?(chargeData['终端费'] * 0.01) + "元":"0元";
        //     this.broadbandData.netDeviceCharge = chargeData['宽带终端费'] != undefined?(chargeData['宽带终端费'] * 0.01) + "元":"0元";

        //     //$scope.param.total_amount = data.total_amount * 0.01;
        //     this.param.total_amount = 0.01;
        //     // TODO guanxu test 测试金额设为1分钱
        //     this.param.total_amount = 0.01;

        //     this.param.rate_name = data.rate_name + '-' + $scope.broadbandData.userName;
        //     this.param.tel = installData.wsResult.retData.params[4].value;
        //     this.param.trade_id = data.trade_id;
        //     this.param.broad_account = data.broad_account;
        //     this.param.pro_number = data.pro_number;
        //     this.param.eparchy_code = data.GD_BSS_HEAD.EPARCHY_CODE;
        //     this.param.customer_name = installData.wsResult.retData.params[3].value;  // 代维人员姓名
        //     this.param.customer_address = data.intall_addr;   // 装机地址

        //     this.param.serial_number = data.serial_number;
        },

        //2
        getCbOrderData() { // 获取cb工单信息
            let data =JSON.parse(localStorage.getItem('cbOrderInfo'));  
            let cbChannelInfo = JSON.parse(localStorage.getItem('cbChannelInfo'));  
            let cityInfo =JSON.parse(localStorage.getItem('cityInfo')); 
            this.broadbandData.serialNumber = data.serialNumber;
            console.log(cityInfo.ESS_CITY_CODE)
            
            this.broadbandData.totalFee = data.totalFee;
            this.broadbandData.feeInfos = data.fee_Info;
            console.log(this.broadbandData.feeInfos)
            this.broadbandData.totalCharge = data.totalFee ? data.totalFee * 0.01 + "元":"0元";

            this.param.operatorId = cbChannelInfo.chnl_code;
            this.param.city = cityInfo ? cityInfo.ESS_CITY_CODE : cbChannelInfo.trade_city_code;
            this.param.district = cbChannelInfo.city_code;
            this.param.channelId = cbChannelInfo.chnl_code;
            this.param.channelType = cbChannelInfo.chnl_kind_id;
            this.param.serialNumber = data.serialNumber;
            this.param.orderId = data.orderId;  
            this.param.cancelFee = data.totalFee;  
            this.param.feeStaffId = cbChannelInfo.chnl_code;
            this.param.feeDepartId = cbChannelInfo.chnl_id;
            let oneList = this.getCityInfo('essCityCode',this.param.city);
            console.log(oneList)
            this.param.feeEparchyCode =  oneList.bssCityCode;
            this.param.feeCityCode = cbChannelInfo.city_code;

            // TODO test 测试金额设为1分钱
            // $scope.param.cancelFee = 1;
        },
        //保存宽带订单信息，获取order_id
        saveOrderInfo() {

            var promise = new Promise(function(resolve,reject){

                var _resolve = resolve;
                var _reject = reject;
                var retry = function(msg) {
                    $ionicPopup.alert({
                        title: '保存订单失败',
                        buttons: [
                            {
                                text: '重试',
                                type: 'button-assertive',
                                onTap: function (e) {
                                    doSaveOrderInfo();
                                }
                            },
                            {
                                text: '取消',
                                type: 'button-stable',
                                onTap: function (e) {
                                    $location.url('/tabs/store/broadband/broadbandPay/login/newOrder');
                                }
                            }
                        ]
                    });
                }

                var doSaveOrderInfo = function() {

                    if($scope.broadbandData.orderId) {
                        _resolve();
                        return;
                    }
                    $http({
                        method: 'POST',
                        url: _broadbandUrl,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: $scope.param,
                        timeout: 5000,
                    }).success(function (data, status, headers, config) {

                        if (data && data.result == "success") {
                            $scope.broadbandData.orderId = data.orderId;
                            _resolve();
                        } else {
                            retry();
                        }
                    }).error(function (data, status, headers, config) {
                        retry();
                    }).finally(function () {
                        $ionicLoading.hide();
                    });
                }

                var parameter=DataFactory.get('proOrderInfo');
                showLoading();

                $http({
                    method:'POST',
                    url:_broadbandStatus,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    transformRequest: function(obj) {
                        var str = [];
                        for (var p in obj)
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        return str.join("&");
                    },
                    timeout: _httpTimeout,
                    data:parameter
                })
                .success(function(data, status, headers, config) {

                    // debugger;
                    if (GLOBAL.test.broadbandPay) {
                        data = newAndPayedOrder;
                    }

                    if(!data.result) {
                        $scope.loginPrompt={
                            hasError: true,
                            errorMsg: data.msg
                        };
                        return;
                    }
                    // 如果存在已支付，提示
                    var order = getOrder(data.list, $scope.param.broad_account, "00");
                    if(order) {
                        $scope.orderStatus.payText = '订单已支付!';
                        $scope.orderStatus.payIcon = 'build/img/store/broadband/tickicon.png';
                        $scope.orderStatus.isOpenDialog = false;
                        $scope.orderStatus.isShowText = true;
                        $scope.orderStatus.isShowButton = false;
                        _reject();
                        return;
                    }
                    //如果存在待付款,返回订单号
                    var order = getOrder(data.list, $scope.param.broad_account, "01");
                    if(order) {
                        $scope.broadbandData.orderId=order.order_id;
                        _resolve();
                        return;
                    }
                    //如果不存在待付款订单则保存订单
                    doSaveOrderInfo();
                })
                .error(function(data, status, headers, config){
                    $scope.loginPrompt = {
                        hasError: true,
                        errorMsg: '订单信息查询接口异常'
                    };
                })
                .finally(function() {
                    $ionicLoading.hide();
                });

            });

            return promise;
        },
        saveCbOrderInfo() {  // 保存cb工单
            let _this = this;
            let promise = new Promise(function(resolve,reject){

                let _resolve = resolve;
                let _reject = reject;
                let retry = function(msg) {
                    this.$dialog
                        .confirm({
                        message: "保存订单失败",
                        confirmButtonText: "重试",
                        cancelButtonText: "返回"
                        })
                        .then(() => {
                        doSaveOrderInfo();
                        console.log("重试");
                        })
                        .catch(() => {
                        this.payDetail = true;
                        console.log(返回)
                    });
                }
                _this.getStatus();
                
            });
            
            return promise;
        },
        getStatus() {
            let _this = this;
            let parameter =JSON.parse(localStorage.getItem('proOrderInfo'));  
            let url = this.HOME + "/app-web/woapp/v18/store/broadband/broadbandPay/getStatus.do";
                axios.post(url,{headers: { 'Content-Type': 'application/x-www-form-urlencoded' }},
                {data:this.parameter}).then(data => {
                    console.log(data)
                     
                    // debugger;
                    // if (this.test.broadbandPay) {
                    //     data = newAndPayedOrder;
                    // }

                    if(!data.data.result) {
                    _this.loginPrompt={
                        hasError: true,
                        errorMsg: data.msg
                    };
                    return;
                    }
                    // 如果存在已支付，提示
                    let order = _this.getOrder(data.data.list, _this.param.broad_account, "00");
                    if(order) {
                        _this.orderStatus.payText = '订单已支付!';
                        _this.orderStatus.payIcon = '../../../../../assets/img/tickicon.png';
                        _this.orderStatus.isOpenDialog = false;
                        _this.orderStatus.isShowText = true;
                        _this.orderStatus.isShowButton = false;
                        _reject();
                        return;
                    }
                    //如果存在待付款,返回订单号
                    let order1 = _this.getOrder(data.data.list, _this.param.broad_account, "01");
                    if(order1) {
                        _this.broadbandData.orderId=order.order_id;
                        _resolve();
                        return;
                    }
                    //如果不存在待付款订单则保存订单
                    // _this.doSaveOrderInfo();
                })
                .catch((data, status, headers, config) => {
                    this.loginPrompt = {
                        hasError: true,
                        errorMsg: '订单信息查询接口异常'
                    };
                })
                
        },

        // doSaveOrderInfo () {
        //     if(this.broadbandData.orderId) {
        //         _resolve();
        //         return;
        //     }
        //     // 保存cb订单信息
        //     let url = 
        //     this.HOME +
        //     "/app-web/woapp/v18/broadband/saveinfo/saveCBSSBroadbandOrder.do";
        //     axios.post(url,{data: this.param},{headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }}).then(data=>{
        //         if (data && data.result == "success") {
        //             this.broadbandData.orderId = data.orderId;
        //             _resolve();
        //         } else {
        //             //retry();
        //         }
        //     })
        //     .catch((data, status, headers, config)=>{
        //         //this.retry();
        //     })
        // },

        saveOrderInfoControll() {
            if (this.cbFeeloginFlag) {
                return this.saveCbOrderInfo()
            } else {
                return this.saveOrderInfo()
            }
        },

        //轮询订单状态
        getOrderState () {
            let retry = (msg) => {
                this.$dialog
                    .confirm({
                        message: "轮询订单状态失败",
                        confirmButtonText: "重试",
                        cancelButtonText: "返回"
                    })
                    .then(() => {
                        doGetOrderState();
                        console.log("重试");
                    })
                    .catch(() => {
                        //this.payDetail = true;
                        console.log(取消)
                });
            };

            this.doGetOrderState();
        },
        doGetOrderState () {
            let url = 
                this.HOME +
                "/app-web/woapp/v18/broadband/saveinfo/getBroadbandStatus.do";
            axios.post(url,
                {data: { order_id: this.broadbandData.orderId }},
                {timeout: 5000}
            ).then((data, status, headers, config)=>{
                if (data) {
                    let orderStatus = data.order_status;
                    let payStatus = data.pay_status;
                    if(payStatus == "00"){
                        this.orderStatus.payText = '支付成功!';
                        this.orderStatus.payIcon = '../../../../../assets/img/tickicon.png';
                        this.orderStatus.isOpenDialog = false;
                        this.orderStatus.isShowText = true;
                        this.orderStatus.isShowButton = false;
                        //$interval.cancel(timer);
                    }else if(payStatus == "11"){
                        this.orderStatus.payText = '失败，请再次支付!';
                        this.orderStatus.payIcon = '../../../../../assets/img/crossicon.png';
                        this.orderStatus.isOpenDialog = false;
                        this.orderStatus.isShowText = true;
                        this.orderStatus.isShowButton = true;
                        //$interval.cancel(timer);
                    }
                }
            })
            .catch((data, status, headers, config) => {
                    
            })   
        },

        //获取支付宝二维码url
        getAliPayUrl () {
            let promise = new Promise(function(resolve,reject){

                let _resolve = resolve;
                let retry = function(msg) {
                    this.$dialog
                        .confirm({
                        message: "获取支付宝二维码失败",
                        confirmButtonText: "重试",
                        cancelButtonText: "取消",
                        template: msg ? msg : null
                        })
                        .then(() => {
                            goGetAliPayUrl();
                            console.log("重试");
                        })
                        .catch(() => {
                            //this.payDetail = true;
                            console.log(返回)
                    });
                }

            })
            this.goGetAliPayUrl();
            return promise;
        },
        goGetAliPayUrl ()  {
            //showLoading();
            // 保存cb订单信息
            let url = 
            this.HOME +
            "/aop-pay/alipay/scanPay.do";
            axios.post(url,{data: {order_id: this.broadbandData.orderId}},{headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }},{
                    transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }},{timeout: 5000}
            ).then((data, status, headers, config)=>{
                if (data.qr_code) {
                    this.broadbandData.aliPayUrl = data.qr_code;
                    this.qrCodeData.data = this.broadbandData.aliPayUrl;
                    _resolve();
                }else {
                    retry(data.msg);
                    //_resolve();
                }
            })
            .catch((data, status, headers, config) => {
                //retry();
            });
        },

        //获取微信支付二维码url
        getweCharUrl () {
            let _this = this;
            var promise = new Promise(function(resolve,reject){

                var _resolve = resolve;
                var retry = function(msg) {
                    this.$dialog
                        .confirm({
                        message: "获取微信二维码失败",
                        confirmButtonText: "重试",
                        cancelButtonText: "取消",
                        template: msg ? msg : null
                        })
                        .then(() => {
                            doGetWeCharUrl();
                            console.log("重试");
                        })
                        .catch(() => {
                            //this.payDetail = true;
                            console.log(返回)
                    });
                }
                _this.doGetWeCharUrl();
            });
            
            return promise;
        },
        doGetWeCharUrl() {

            var url =
                this.HOME +
                "/aop-pay/wxpay/scanPay.do"; 
            axios.post(url,{data: {order_id: this.broadbandData.orderId}},{headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }}
            ).then((data, status, headers, config)=>{
                console.log(data)
                if (data.qr_code) {
                    this.broadbandData.weChatPayUrl = data.qr_code;
                    this.qrCodeData.data = this.broadbandData.weChatPayUrl;
                    _resolve();
                }else {
                    retry(data.msg);
                    //_resolve();
                }
            })
            .catch((data, status, headers, config) => {
                //retry();
            });
        },
        
        //关闭二维码对话框
        closeDialog() {
            this.orderStatus.isOpenDialog = false;
        },

        //打开二维码对话框  3
        openDialog(type){
            this.dialog = true;
            this.qrCodeData.data = '';
            if(type == 0){
                this.qrCodeData.data = this.broadbandData.aliPayUrl;
                this.qrCodeData.way = "支付宝";
                this.saveOrderInfoControll().then(this.getAliPayUrl()).then(function() {
                    this.timer = setInterval( () => {　
                        getOrderState();
        　　　　　　 }, 5000)
                });
            }else{
                this.qrCodeData.data = this.broadbandData.weChatPayUrl;
                this.qrCodeData.way = "微信";
                this.saveOrderInfoControll().then(this.getweCharUrl()).then(function() {
                    this.timer = setInterval( () => {　
                        this.getOrderState();
        　　　　　　 }, 5000)
                });
            }
            this.orderStatus.isOpenDialog = true;

        },

         /**
         * 返回宽带号码为broadAccount，且支付状态为status的订单
         * @param  {List} list 产品号码对应的订单列表
         * @param  {String} broadAccount 最新的宽带号码
         * @param  {String} status 订单状态
         * @return {String}      待支付的订单id
         */
         getOrder(list, broadAccount, status){
          let rtnOrder = "";
          for(let i = 0; i < list.length; i++) {
            let order = list[i];
            if(order.oper_id == broadAccount && order.pay_status == status) {
              rtnOrder = order;
            }
          }
          return rtnOrder;
        }

    }
}
</script>

<style>
/* 宽带收费table */
.scroll {
    position: absolute;
    height: 100%;
    top: 44px;
    background: #ffffff;
    -webkit-transform: translate3d(0, 0, 0);
}
.scroll {
    -webkit-overflow-scrolling: touch;
    width: 100%;
}
table {
    border-spacing: 0;
    border-collapse: collapse;
}
.wo-broadband-table {
    width: 100%;
    border-bottom: 5px solid #f0efed;
}
table td {
    padding: 5px 15px 5px 15px;
    border: 1px solid #f0efed;
}
.wo-broadband-payWay {
    margin-top: 15px;
    margin-left: 20px;
    margin-right: 20px;
}
.wo-broadband-payWay .wo-alipay-botton-container {
    width: 50%;
    float: left;
}
.wo-broadband-payWay #wo-alipay-button-container {
    padding-right: 6px;
}
.wo-broadband-payWay .wo-alipay-button {
    background-color: #01a9ec;
}
.wo-broadband-payWay .wo-alipay-botton-container a {
    display: inline-block;
    padding: 15px 10px 15px 10px;
    text-decoration: none;
    font-size: 16px;
    color: white;
    text-align: center;
    border-radius: 4px;
    width: 100%;
}
.wo-broadband-payWay img {
    border: 0px;
    vertical-align: middle;
    margin-right: 5px;
    width: 25px;
}
.wo-broadband-payWay #wo-wechat-button-container {
    padding-left: 6px;
}
.wo-broadband-payWay .wo-wechat-button {
    background-color: #0ac516;
}


/* 弹出二维码样式 */
.popup-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: transparent;
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    -moz-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -moz-align-items: center;
    align-items: center;
    z-index: 12;
    visibility: hidden;
}
.popup-container.popup-showing {
    visibility: visible;
}
.popScan {
    position: relative;
    height: 60%;
    width: 80% !important;
    z-index: 12;
    background-color: white !important;
    text-align: center;
}
.popup-container .popup {
    width: 250px;
    max-width: 100%;
    max-height: 90%;
    border-radius: 0px;
    background-color: rgba(255, 255, 255, 0.9);
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-direction: normal;
    -webkit-box-orient: vertical;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
}
.popup-container.active .popup {
    background-color: white;
    border-radius: 4px;
}
.popup-container.active .popup {
    -webkit-animation-name: superScaleIn;
    animation-name: superScaleIn;
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}
.popScan .qrcodeOuter {
    width: 100%;
    margin-top: 30px;
}
a {
    -webkit-user-drag: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-tap-highlight-color: transparent;
}
.popScan .dialogCancelButton {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: white;
    line-height: 55px;
    position: absolute;
    top: -17px;
    right: 0;
}
.popScan .dialogCancelButton img {
    width: 25px;
    vertical-align: none;
}
.popScan .scanQrCode {
    margin-top: 20px;
    color: #666666;
}
.popScan .scanCharge {
    margin-top: 15px;
    font-size: 25px;
    color: #333333;
}
.backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 11;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    visibility: hidden;
    opacity: 0;
    -webkit-transition: 0.1s opacity linear;
    transition: 0.1s opacity linear;
}
#scanPop {
    visibility: visible;
    opacity: 1;
}


.wo-step {
  width: 100%;
  padding: 5px;
  /* border-top: 1px solid #ddd; */
  /* border-bottom: 1px solid #ddd; */
}
.broadband-box {
  width: 100%;
  height: calc(100% - 80px);
  overflow-y: auto;
}
.wo-step-content {
  width: 100%;
  font-size: 12px;
  padding: 5px;
}
.wo-step-content .item-divider {
  /* font-size: 14px; */
  border-bottom: 1px solid #ddd;
  padding: 0px 16px;
  height: 25px;
  line-height: 25px;
  background-color: #fef7ea;
  min-height: 25px;
}
.wo-step-content .item {
  width: 100%;
  padding: 0 16px;
  height: 35px;
  line-height: 35px;
  border: none;
  border-bottom: 1px solid #ddd;
}
.listInfo {
  margin-top: 10px;
  background: #fff;
}
.item-note {
  float: left;
  border-right: 1px solid #ccc;
  width: 80px;
  margin-right: 20px;
}
.input_style {
  width: 80%;
  border: none;
  height: 30px;
  line-height: 35px;
}
.resetBtn {
  width: 20%;
  float: right;
  color: #fff;
  height: 30px;
  margin-top: 1.5px;
  line-height: 35px;
  text-align: center;
  background: #ff8a00;
  border-radius: 5%;
}

.addressList {
  width: 96%;
  padding: 0 5px;
  margin-top: 5px;
  background: #fff;
  margin-left: 2%;
  height: auto;
  overflow: scroll;
  position: absolute;
  top: 45px;
  left: 0;
  bottom: 0;
  right: 0;
}
.addressList li {
  font-size: 14px;
  padding: 8px 16px;
  border-bottom: 1px solid #ddd;
}
.van-popup--right {
  width: 100%;
  height: 100%;
  background: #f5f2eb;
}
.quering {
  position: absolute;
  top: 45px;
  background: #fff;
  bottom: 0;
  left: 0;
  right: 0;
  /* overflow-y: scroll; */
  text-align: center;
  padding-top: 50%;
}
.van-loading {
  width: 100%;
}
.active {
  color: #ff8a00;
}

</style>

