<template>
<!-- 此文件后续会移动相关文件夹下 -->
  <div class="readCard">

    <!-- 顶端bar   -->
    <Header title="人脸识别" @goBack="goBack()"></Header> 

    <!-- 步骤条 -->
    <div class="wo-step">
      <van-steps :active="active">
        <van-step>查询地址资源</van-step>
        <van-step>人脸识别</van-step>
        <van-step>选择宽带产品</van-step>
      </van-steps>
    </div>

    <!-- 操作提示文本 -->
    <div class="wo-step-content">
        <woTitleBar titleBarName="点击按钮上传照片"></woTitleBar>
    </div>


    <!-- 拍照按钮 -->
    <div class="faceRECG_box" > 
        <van-row >
            <van-col span="8" >
                <van-button @click='picSwitch00 += 1,picSwitch01 -=1' size='normal' round v-show="picSwitch01">
                <van-icon name="photograph" v-show="picSwitch01"/>
                </van-button>
                <img src="@/assets/img/gakki.jpg" v-show=picSwitch00 width="100%" height="100%">
            </van-col>
            <van-col span="8">
                <van-button @click=goBack() size='normal' round>
                <van-icon name="photograph" />
                </van-button>
            </van-col>
            <van-col span="8">
                <van-button @click=goBack() size='normal' round>
                <van-icon name="photograph" />
                </van-button>
            </van-col>
        </van-row>
    </div>

    <!-- 背景图
    <div class="cardInfoContainer">
        <img src="../../assets/img/2018-11-25.jpg" id="cardBg">
    </div> -->

    <!-- 底部按钮 -->
    <woBtn :btnText='flag?"上传照片":"上传照片"' @woBtnHandle="faceRECG_upload()"></woBtn>


  </div>
</template>

<script>
import Header from "@/components/Header";
import woBtn from "@/components/woBtn";
import woTitleBar from "@/components/woTitleBar";

export default {
  components: {
    Header,
    woBtn,
    woTitleBar,
  },
  data() {
    return {
      active: 0, //初始化步骤条
      picSwitch00:0,
      picSwitch01:1,
      userInfo: {
        username: "",
        number: "",
        address: ""
      }
    };
  },
  mounted() {
    if (!this.$route.params.active) {
      this.active = 1;
      return;
    } else {
      this.active = this.$route.params.active;
    }
  },//激活步骤条

  methods: {
    goBack() {
      this.$router.back(-1);
    }, //返回按钮


    faceRECG_upload() {
      this.$dialog.alert({
          message: "上传照片"
        })//上传照片逻辑
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.readCard {
  padding: 45px 0;
  font-size: 14px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.wo-step {
  width: 100%;
  padding: 5px;
}

.cardInfoContainer {
  position: relative;
  width: 100%;
  height: auto;
  font-size: 14px;
}
.cardInfoContainer img {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}
.wo-step-content {
  width: 100%;
  font-size: 12px;
  padding: 5px;
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
.wo-photopicker-title {
        font-size: 70%;;
        color: #666;
        margin-bottom: 1px;
        text-align: center;
}
.center {
    padding: 100% 100% 100% 100%
}
</style>
