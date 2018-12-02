<template>
<div class="broadbandBox">
  <Header @goBack="goBack()" @customServices="customServices()" title="宽带收费"></Header>
  <div class="scroll padding">
    <div class="wo-city-content">
        <span class="wo-city-span">城市：<span class="wo-city ng-binding">{{cityName ? cityName : "广州"}}</span> 
        </span> <!-- cityName不能写死 -->
        <button @click="selectCity()" class="button button-assertive button-small wo-selectCity-button">选择其他城市</button>
    </div>
    <div class="list">
      <label class="item item-input wo-user-label ng-hide" v-show="!isCBSS">
          <img src="../../../../../assets/img/user.png" width="20" height="20">
          <input v-model="loginSenate.userName" @change="changeData()"  type="text" placeholder="请输入宽带帐号" class="wo-user-input">
      </label>
      <label class="item item-input wo-password-label">
          <img src="../../../../../assets/img/password.png" width="20" height="20">
          <input  v-model="loginSenate.userPassword" type="text" placeholder="请输入产品号码" class="wo-password-input">
      </label>
    </div>     
    <div class="wo-button">
      <button @click="broadbandFeelogin()" v-show="!isCBSS" class="button button-assertive button-block wo-broadband-button ng-hide">确认</button>
      <button @click="broadbandFeeloginControll()" v-show="isCBSS" class="button button-assertive button-block wo-broadband-button">确认</button>
    </div>
    <!-- input没值显示显示请输入产品号 -->
    <div class="wo-prompt-box" v-show="hasError">
      <div class="wo-prompt">
        <div class="wo-prompt-img-div">
          <img class="wo-prompt-img" src="../../../../../assets/img/prompt.png" width="20" height="20">
        </div>
          <div class="wo-prompt-content-div">
            <span class="wo-prompt-content ng-binding">请输入产品号码</span>
          </div>
      </div>
    </div>
  </div>
  <van-popup v-model="show" position="right" :overlay="false">
    <Header @goBack="show = false" @customServices="customServices()" title="选择城市"></Header>
    <div class="scroll">
        <div class="wo-citys">
            <div class="wo-city-container" v-for="city in citys">
                <button @click="chooseCity(city.CITY_NAME,city.ESS_CITY_CODE)" class="button button-outline button-assertive button-check wo-City-button wo-city ng-binding">{{city.CITY_NAME}}</button>
            </div>
            <div style="clear:both"></div>
        </div>
    </div>
  </van-popup>

</div>
</template>

<script>
import Header from "@/components/Header";
import woBtn from "@/components/woBtn";
import woTitleBar from "@/components/woTitleBar";
import * as Account from "../../../../../constants/account.js";  //城市编码
import axios from "axios";


let cityNameLists =  Account.default.account;
let citys = [];
for(let key in cityNameLists){
  let city = cityNameLists[key];
  citys.push(city);
  //console.log(key,cityNameLists[key]);  //key就是city_code
}
console.log(citys)

export default {
  components: {
    Header,
    woBtn,
    woTitleBar
  },

  data() {
    return {
      cityName: null, //查询城市
      ESS_CITY_CODE: null, //城市编码先设为null
      show: false,   //显示隐藏侧边栏
      citys: citys,  //城市列表
    //   resourcesname:'', //input框产品号是否为空
      hasError: false, //显示是否有输入产品号
      cbChannelInfo: {

      },
      loginSenate: {
        city_code: '',
        userName: '',
        userPassword: ''
      },
      qrCodeData:[
        {id: 0,name: "微信"},
        {id: 0,name: "支付宝"}
      ],
      isCBSS: true,  //先写死
      loginPrompt: {
            hasError: false,
            errorMsg: ''
      },

    };
  },
  watch: {

  },
  methods: {
    //返回
    goBack() {
      this.$router.back(-1);
    },
    selectCity() {
      this.show = true
    },
    chooseCity(CITY_NAME,ESS_CITY_CODE){
      this.show = false 
      let checkedCity = this.cityName = CITY_NAME;
      this.ESS_CITY_CODE = ESS_CITY_CODE;
      let cityInfo = {checkedCity,ESS_CITY_CODE}
      localStorage.setItem('cityInfo', JSON.stringify(cityInfo));
    },
    changeData(){

    },

    // 增加CB宽带收费控制
    broadbandFeeloginControll(){
        if(this.loginSenate.userPassword == ""){
            this.hasError = true
            return
        } else {
            this.hasError = false
        }
        let cityInfo = JSON.parse(localStorage.getItem('cityInfo'));
        // console.log(cityInfo)
        // console.log(cityInfo.ESS_CITY_CODE)
        this.loginSenate.city_code = (cityInfo.ESS_CITY_CODE ? cityInfo.ESS_CITY_CODE :this.city_code); //this.city_code暂没获取
            if (this.loginSenate.city_code == undefined ||this.loginSenate.city_code == "") {
                this.loginPrompt = {
                    hasError: true,
                    errorMsg: '请选择城市！'
                };
                return;
            }
            if (this.loginSenate.userPassword == undefined || this.loginSenate.userPassword == "") {
                    this.loginPrompt = {
                        hasError: true,
                        errorMsg: '请输入产品号码'
                    };
                    return;
                }
        
        // 获取地市账号信息
        //let record_content =JSON.parse(localStorage.getItem(''));
        //let parrams = {oper_id: '5107040953'};
        let url = 
        this.HOME +
        "/app-web/woapp/v18/system/accountToWcs/channelInfo.do";
        axios.get(url,{params:{oper_id: '5107040953'}}).then(data=>{
            if (data.data.resp_code == "0000") {
                //console.log(JSON.stringify(data));
                //DataFactory.set('cbChannelInfo', data);
                localStorage.setItem('cbChannelInfo', JSON.stringify(data));
                this.queryBroadConst(data); // 查询cb信息
            } else {
                this.$dialog.confirm({
                    title: "提示",
                    message:
                    "查询渠道信息失败",
                })
                return;
            }
        })
    },
    queryBroadConst() {  //查询收费工单
      let cbChannelInfo =JSON.parse(localStorage.getItem('cbChannelInfo'));  
      let cityInfo = JSON.parse(localStorage.getItem('cityInfo'));  
      console.log(cityInfo)
      let params = {
        operatorId: cbChannelInfo.data.chnl_code,
        city: cityInfo ? cityInfo.ESS_CITY_CODE : this.ESS_CITY_CODE,
        district: cbChannelInfo.data.city_code,
        channelId: cbChannelInfo.data.chnl_code,
        channelType: cbChannelInfo.data.chnl_kind_id,
        netTypeCode: '40',
        serialNumber: this.loginSenate.userPassword
      };
      //
      let url =
        this.HOME +
        "/app-web/woapp/v18/store/broadband/broadbandPay/queryBroadConst.do";
        axios.get(url,{params:params}).then(res=>{
            console.log(res)

            if (res.data.code === "0000") { // cb工单流程
                localStorage.setItem('cbOrderInfo', JSON.stringify(res.data.result));
                localStorage.setItem('cbFeelogin', JSON.stringify(true));
                if (res.data.result.fee_Info[0].payType === '1') {
                    //alert(1)
                    this.$router.push({ path: "/broadbandPayDetail"});
                } else {
                    this.$dialog.confirm({
                        title: "提示",
                        message:
                        "该工单已支付，请重新输入",
                    })
                } 
                //自己写支付信息
                // this.payDetail = true
                // console.log(this.payDetail) 
            } else { // 正常流程
                localStorage.setItem('cbFeelogin', JSON.stringify(false));
                this.broadbandFeelogin();
                //bss验证
            }
        })
    },
    broadbandFeelogin() {
        let cityInfo = JSON.parse(localStorage.getItem('cityInfo')); 
        localStorage.setItem('proOrderInfo', JSON.stringify(parameter));

        this.loginSenate.city_code = (cityInfo.ESS_CITY_CODE ? cityInfo.ESS_CITY_CODE :this.city_code); //this.city_code暂没获取
        if (this.loginSenate.city_code == undefined ||this.loginSenate.city_code == "") {
            this.loginPrompt = {
                hasError: true,
                errorMsg: '请选择城市！'
            };
            return;
        }

        var parameter = {
            eparchy_code: this.loginSenate.city_code,
            serial_number: this.loginSenate.userPassword,
            broad_accout: this.loginSenate.userName
        }
        
        if(this.isCBSS){
            parameter.broad_accout = this.loginSenate.userName || '1111111';
        }
        //存储信息  支付页面提取
        localStorage.setItem('proOrderInfo', JSON.stringify(parameter));

        console.log(parameter)
        //显示登录中...

        //暂不写...
    },

  }
};
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.broadbandBox {
  width: 100%;
  padding-top: 45px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
}
.padding {
    padding: 10px;
}
.scroll {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-text-size-adjust: none;
    -moz-text-size-adjust: none;
    text-size-adjust: none;
    -webkit-transform-origin: left top;
    transform-origin: left top;
}
.wo-city-content {
    height: 60px;
    border-bottom: 1px solid #e1e1e1;
}
.wo-city-content .wo-city-span {
    margin: 20px 10px;
    line-height: 60px;
    font-size: 15px;
    color: #333333;
}
.wo-city-content .wo-city-span .wo-city {
    font-size: 18px;
    font-weight: bold;
    color: #333333;
}

.button {
    border-color: #b2b2b2;
    background-color: #f8f8f8;
    color: #444;
    position: relative;
    display: inline-block;
    margin: 0;
    padding: 0 12px;
    min-width: 52px;
    min-height: 47px;
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
    vertical-align: top;
    text-align: center;
    text-overflow: ellipsis;
    font-size: 16px;
    line-height: 42px;
    cursor: pointer;
}
.button.button-assertive.button-outline {
    border-color: #ff8a00;
    background: transparent;
    color: #ff8a00;
}
.wo-citys .wo-city-container .addback {
     background-color: #ff8a00; 
     color: #ffffff;
}


.button-small {
    padding: 2px 4px 1px;
    min-width: 28px;
    min-height: 30px;
    font-size: 12px;
    line-height: 26px;
}
.button.button-assertive {
    border-color: #cc6e00;
    background-color: #ff8a00;
    color: #fff;
}
.wo-city-content .wo-selectCity-button {
    margin: 10px;
    height: 40px;
    float: right;
    border-radius: 5px;
    font-size: 14px;
    border: none;
    width: 105px;
}

.list {
    position: relative;
    padding-top: 1px;
    padding-bottom: 1px;
    padding-left: 0;
    margin-bottom: 20px;
}
.broadbandBox .list {
    margin: 0px 0px;
}
.item {
    border-color: #ddd;
    background-color: #fff;
    color: #444;
    position: relative;
    z-index: 2;
    display: block;
    margin: -1px;
    padding: 16px;
    border-width: 1px;
    border-style: solid;
    font-size: 16px;
}
.item, .item h1, .item h2, .item h3, .item h4, .item h5, .item h6, .item p, .item-content, .item-content h1, .item-content h2, .item-content h3, .item-content h4, .item-content h5, .item-content h6, .item-content p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.item-input {
    display: -webkit-box;
    display: -webkit-flex;
    display: -moz-box;
    display: -moz-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -moz-align-items: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    padding: 6px 0 5px 16px;
}
[ng\:cloak], [ng-cloak], [data-ng-cloak], [x-ng-cloak], .ng-cloak, .x-ng-cloak, .ng-hide:not(.ng-hide-animate) {
    display: none !important;
}
.broadbandBox .list .wo-user-label {
    margin: 20px 10px;
    border-radius: 5px;
}
.broadbandBox .list .wo-password-label {
    margin: 20px 10px;
    border-radius: 5px;
}
img {
    -webkit-user-drag: none;
}
.item-input input {
    -webkit-border-radius: 0;
    border-radius: 0;
    -webkit-box-flex: 1;
    -webkit-flex: 1 220px;
    -moz-box-flex: 1;
    -moz-flex: 1 220px;
    -ms-flex: 1 220px;
    flex: 1 220px;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
    padding-right: 24px;
    background-color: transparent;
}
textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"] {
    display: block;
    padding-top: 2px;
    padding-left: 0;
    height: 34px;
    color: #111;
    vertical-align: middle;
    font-size: 14px;
    line-height: 16px;
}
textarea, input[type="text"], input[type="password"], input[type="datetime"], input[type="datetime-local"], input[type="date"], input[type="month"], input[type="time"], input[type="week"], input[type="number"], input[type="email"], input[type="url"], input[type="search"], input[type="tel"], input[type="color"] {
    border: 0;
}
.item-input input, .item-input textarea {
    width: 100%;
}
.card .item.item-input input, .list-inset .item.item-input input, .padding > .list .item.item-input input, .padding-horizontal > .list .item.item-input input {
    padding-right: 44px;
}
.broadbandBox .list .wo-password-label .wo-password-input {
    margin-left: 15px;
}
 .broadbandBox .wo-button {
    margin: 0px 10px;
    border: none;
}
.button.button-block, .button.button-full {
    margin-top: 10px;
    margin-bottom: 10px;
}
.broadbandBox .wo-button .wo-broadband-button {
    border-radius: 5px;
}
.button:after {
    position: absolute;
    top: -6px;
    right: -6px;
    bottom: -6px;
    left: -6px;
    content: ' ';
}
.button-block {
    display: block;
    clear: both;
}
button.button-block, button.button-full, .button-full > button.button, input.button.button-block {
    width: 100%;
}
.button.button-block, .button.button-full {
    margin-top: 10px;
    margin-bottom: 10px;
}
.broadbandBox .wo-button .wo-broadband-button {
    border-radius: 5px;
}
.button.button-assertive.active, .button.button-assertive.activated {
    border-color: #cc6e00;
    background-color: #cc6e00;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.1);
}
.wo-prompt-box {
    background: #8c8c8c;
    margin: 20px 10px;
    border-radius: 5px;
}
.wo-prompt-box .wo-prompt {
    padding: 15px 40px;
}
.wo-prompt-box .wo-prompt .wo-prompt-img-div {
    width: 13%;
    display: inline-block;
    height: 100%;
    vertical-align: top;
}
.wo-prompt-box .wo-prompt .wo-prompt-img-div .wo-prompt-img {
    position: relative;
    left: 5px;
}
.wo-prompt-box .wo-prompt .wo-prompt-content-div {
    width: 85%;
    display: inline-block;
}
.wo-prompt-box .wo-prompt .wo-prompt-content-div .wo-prompt-content {
    color: white;
    font-size: 15px;
}


/* 选择城市样式 */
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
.wo-citys {
    padding: 10px;
}
.wo-citys .wo-city-container {
    width: 33.3%;
    float: left;
    padding: 10px 10px;
}

.wo-citys .wo-city-container .wo-city {
    width: 100%;
    clear: none;
    line-height: 20px;
    min-height: 40px;
    height: 44px;
    border-radius: 5px;
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

