<template>
  <div class="broadbandBox">
    <Header @goBack="goBack()" @customServices="customServices()" title="注册"></Header>
    <div class="wo-step">
      <van-steps :active="active">
        <van-step>绑定申请</van-step>
        <van-step>登录信息</van-step>
        <van-step>真实信息</van-step>
        <van-step>实名制拍照</van-step>
      </van-steps>
    </div>


    <!-- 默认以沃云购绑定沃行销测试，登录账号为沃云购账号 -->
    <div>
    		<!-- 被绑定账号，需要 -->
    		<woTitleBar titleBarName="实名制拍照"></woTitleBar>
        <van-row>
          <van-col span="8">
            <div class="wo-photopicker-div">
              <div  class="wo-photopicker-title">照片</div>
              <div class="wo-photopicker-bg"></div>
              <img class="wo-photopicker-icon" src="@/assets/img/camera.png">
            </div>
          </van-col>

          <van-col span="8">
            <div class="wo-photopicker-div">
              <div  class="wo-photopicker-title">照片</div>
              <div class="wo-photopicker-bg"></div>
              <img class="wo-photopicker-icon" src="@/assets/img/camera.png">
            </div>
          </van-col>

          <van-col span="8">
            <div class="wo-photopicker-div">
              <div  class="wo-photopicker-title">照片</div>
              <div class="wo-photopicker-bg"></div>
              <img class="wo-photopicker-icon" src="@/assets/img/camera.png">
            </div>
          </van-col>
        </van-row>
    </div>


    <div class="broadband-box">
      <woBtn :btnText="btnText" @woBtnHandle="nextStep()"></woBtn>
    </div>

  </div>
</template>

<script>

import Header from "@/components/Header";
import woBtn from "@/components/woBtn";
import { Picker,Toast,Popup,Field,RadioGroup, Radio } from 'vant';
import woTitleBar from "@/components/woTitleBar";

export default {

  name: 'NumJoin',
  components: {
    Header,
    woBtn,
    woTitleBar
  },

  data () {
    return {
      active:0,  //设置当前step状态
      woxxUsername: null,
      woxxPassword:null,
      woxxConfirm:null,  //确认密码
      woxxRadio:1,
      province:null,
      city:null,
      wo_show: false,
      writeModel: 1,  //选择能力注册或者手动输入
      username:'zhubr11',
      password:'123456',
      writeDisabled:null,
      sms:null,  //验证码
      btnText:'下一步'
    };
  },
  mounted() {
    //处理step参数
    if (!this.$route.params.active) {
      this.active = 0;
      return;
    } else {
      this.active = this.$route.params.active;
    }
    //处理绑定参数
    if (!this.$route.params.bindTag) {
      this.bindTag = 0;
      return;
    } else {
      this.bindTag = this.$route.params.bindTag;
    }
  },
  methods: {
    //返回
    goBack() {
      this.$router.back(-1);
    },
    onChange(picker, value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    onConfirm(value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    radioClick1() {
      this.woxxRadio = 1;
      console.log('radioClick1:' + this.woxxRadio);
    },
    radioClick2() {
      this.woxxRadio = 2;
      console.log('radioClick2:'+this.woxxRadio);
    },
    onCancel() {
      Toast('取消');
    },
    onRead() {
      Toast('取消');
    },
    //下一步
    nextStep() {
      console.log('nextStep');
    }
  }
}
</script>

<style lang="css" scoped>
.broadbandBox {
  width: 100%;
  padding: 45px 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.wo-step {
  width: 100%;
  padding: 5px;
  /* border-top: 1px solid #ddd; */
  /* border-bottom: 1px solid #ddd; */
}
.wo-radio {
  width: 100%;
  padding: 5px;
}
.broadband-box {
  width: 100%;
  height: calc(100% - 200px);
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
.woPopBtn {
  width: 100%;
  height: 45px;
  background: #ff8a00;
  text-align: center;
  line-height: 45px;
  bottom: 0;
  color: #fff;
}
.radio-right {
  margin-left: 20px;
  border: 1px solid black;
}
.photo {
  margin-left: 5px;
  width:50px;
  height: 50px;
  border: 1px solid black;
}
/*照片部分*/
.wo-photopicker-div{
  margin-left: 15px;
}
.wo-photopicker-title {
    font-size: 70%;
    color: #666;
    margin-bottom: 1px;
    margin-left: 40px;
}
.wo-photopicker-bg {
    border-radius: 4px;
    width: 100px;
    height: 100px;
    background-color: #ff8a00;
}
.wo-photopicker-icon {
    position:relative;
    width: 60px;
    height: 60px;
    top: -80px;
    left: 20px;
}
</style>