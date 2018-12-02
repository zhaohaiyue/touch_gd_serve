<template>
  <div class="broadbandBox">
    <Header @goBack="goBack()" @customServices="customServices()" title="填写绑定请求账号"></Header>
    <div class="wo-step">
      <van-steps :active="active">
        <van-step>绑定申请</van-step>
        <van-step>登录信息</van-step>
        <van-step>真实信息</van-step>
        <van-step>实名制拍照</van-step>
      </van-steps>
    </div>

    <!-- <div :class="['wo-radio']">
      <van-radio-group v-model="writeModel" @change="writeChange">
        <van-radio name="1">已有沃行销账号</van-radio>
        <van-radio name="2">注册沃行销账号</van-radio>
      </van-radio-group>k
    </div> -->

    <!-- 默认以沃云购绑定沃行销测试，登录账号为沃云购账号 -->
    <div>
    	<div>
    		<woTitleBar titleBarName="沃云购账号"></woTitleBar>
    		<van-cell-group>
			  <van-field
			    v-model="wygUsername"
			    required
			    disabled
			    clearable
			    label="用户名"
			    icon="question"
			    @click-icon="$toast('question')"
			  />
			</van-cell-group>
    	</div>
    	
    	<div>
    		<!-- 被绑定账号，需要 -->
    		<woTitleBar titleBarName="沃行销账号信息"></woTitleBar>
        <!-- 绑定状态：
        <div v-text="bindTag"></div> -->
    		<van-cell-group>
			  <van-field
			    v-model="wxxUsername"
			    required
			    clearable
			    label="用户名"
			    icon="question"
			    placeholder="请输入沃行销登录账号"
          :disabled="writeDisabled"
			    @click-icon="$toast('question')"
			  />

			  <van-field
			    v-model="wxxPassword"
			    type="password"
			    label="密码"
			    placeholder="请输入沃行销登录密码"
          :disabled="writeDisabled"
			    required
			  />
			</van-cell-group>
    	</div>
      <label :class="['register-link']"><a @click="registerClick">如果您暂无沃行销账号 点击注册</a></label>
    </div>


    <div class="broadband-box">
      <woBtn :btnText="btnText" @woBtnHandle="bind()"></woBtn>
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
      bindTag:0,  //设置绑定状态
      wygUsername: 'zhubr11',
      wxxUsername:'',
      wxxPassword:'',
      writeDisabled:null,
      btnText:'绑定',
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
    //修改填写模式时
    writeChange() {
      if(this.writeModel == 1) {
        this.writeDisabled = null;
        this.btnText = '绑定';
      } else {
        this.btnText = '注册';
        this.writeDisabled = 'disabled';
      }
    },
    onChange(picker, value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    onConfirm(value, index) {
      Toast(`当前值：${value}, 当前索引：${index}`);
    },
    onCancel() {
      Toast('取消');
    },
    //跳转到注册界面
    registerClick() {
      //保存用户选择信息
      let userSelectInfo = {
        active:this.active+1
      };
      this.$router.push({ name: "registerPage", params: userSelectInfo });
    },
    //下一步
    bind() {
      //保存用户选择信息
      let data = {
        pswd: this.wxxPassword,
        staffid: this.wxxUsername,
        province: "51"
      };
      console.log('bind');

      let url = this.HOME +
      "/touch_server/login/systemLogin"
      console.log(url);
      this.$axios.post(url,{msg:data}).then(resp => {
        console.log(resp.data);
        if(resp.data.msgFlag == 0) {
          // 进行绑定操作
        } else {
          this.$toast(resp.data.errmsg);
        }
      });
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
.register-link {
  margin-right: 10%;
  float: right;
}
</style>