

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
    	
    	<div>
    		<!-- 被绑定账号，需要 -->
    		<woTitleBar titleBarName="能力注册"></woTitleBar>
        <!-- 绑定状态：
        <div v-text="bindTag"></div> -->
    		<van-cell-group>
			  <van-field
			    v-model="woxxUsername"
			    required
			    clearable
			    label="登录工号"
			    icon="question"
			    placeholder="请输入手机号"
          :disabled="writeDisabled"
			    @click-icon="$toast('question')"
			  />

			  <van-field
			    v-model="woxxPassword"
			    type="password"
			    label="登录密码"
			    placeholder="数字+大写字母+小写字母+特殊字符"
			    required
			  />

        <van-field
          v-model="woxxConfirm"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          required
        />

        <!-- 类型部分样式，较难调整，手写 -->
        <div data-v-2cce3410="" class="van-cell van-cell--required van-field">
          <div class="van-cell__title">
            <span>类型</span>
          </div>
        <div class="van-cell__value">
          <div class="van-field__body">
            <label class="van-field__control ">
            <input name="wxxType" class="radio-right" type="radio" value="1" checked="checked" @click="radioClick1">
            社会能人
            <input name="wxxType" class="radio-right" type="radio" value="2" @click="radioClick2">
            店铺
            </label>
          </div>
        </div>
      </div>

        

        <van-field
          v-model="province"
          required
          clearable
          label="推介人"
          placeholder="请输入发展人手机号"
          :disabled="writeDisabled"
          @click-icon="$toast('question')"
        />

        <van-field
          v-model="province"
          required
          clearable
          label="省份"
          placeholder="请输入省份"
          :disabled="writeDisabled"
        />

        <van-field
          v-model="city"
          required
          clearable
          label="地市"
          placeholder="请输入地市"
          :disabled="writeDisabled"
        />

        <van-field
          v-model="sms"
          center
          clearable
          label="短信验证码"
          placeholder="请输入短信验证码"
        >
          <van-button slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
			</van-cell-group>
    	</div>
    	
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
    //下一步
    nextStep() {
      //保存用户选择信息
      let userSelectInfo = {
        city: '广州',
        active:this.active+1
      };
      this.$router.push({ name: "registerPage1", params: userSelectInfo });
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
</style>