<template>
  <div class="readCard">
    <Header title="身份证读取" @goBack="goBack()"></Header>
    <!-- 进度条 -->
    <div class="wo-step">
      <van-steps :active="active">
        <van-step v-for="item in steps">{{item}}</van-step>
        <!-- <van-step>录入客户信息</van-step> -->
        <!-- <van-step>选择宽带产品</van-step> -->
      </van-steps>
    </div>

    <!-- 输入框组件，输入个人信息和证件信息 -->
    <van-cell-group class="vanCellGroup">
        <van-field v-for ="cell in cells" :v-model="cell.name" :placeholder="cell.tip" :left-icon="cell.icon" />
      </van-cell-group>

    <!-- 底部的确认按钮 -->
    <woBtn btnText='确认' @woBtnHandle="saveInputInfo()"></woBtn>
  
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
    woTitleBar
  },
  data() {
    return {
      steps: ["身份证验证", "拍摄照片", "电子签名"],
      readTypeSlideShow: false, //阅读器设置
      readingShow: false, //读卡中...
      active: 0, //初始步骤条
      readResult: "请将二代身份证放置设备阅读区！",
      readerType: "未设置",
      userInfo: {
        username: "",
        number: "",
        address: ""
      },
      cells:[//输入框单元图标及提示信息
        {name:'personName', icon:'contact', tip:'请输入姓名'},
        {name:'cardNum', icon:'idcard', tip:'请输入证件号码'},
        {name:'birthday', icon:'clock', tip:'出生日期'},
        {name:'sxrq', icon:'clock', tip:'证件生效时间'},
        {name:'sxrq', icon:'clock', tip: '证件失效时间'},
        {name:'addr', icon:'location', tip:'请输入证件地址'}
      ]
    };
  },
  mounted() {
    if (!this.$route.params.active) {
      this.active = 0;
      return;
    } else {
      this.active = this.$route.params.active;
    }
  },
  methods: {
    goBack() {
      this.$router.back(-1);
    },
    //获取服务器时间接口
    getSysDate() {
      let url =
        this.HOME + "/app-web/woapp/v18/store/simCard/realName/getSysDate.do";
      this.$axios.get(url).then(res => {
        console.log(res.data);
      });
    },
    //一证五户限制接口
    checkCustInfo() {
      let postData = {
        operId: "GZLT1591",
        province: "51",
        city: "510",
        district: "440100",
        channelId: "51b2aub",
        channelType: "1030100",
        checkType: 0, // 0：证件校验 1：号码校验
        serialNumber: "13022224988", // todo 随便填个号码
        certType: "02",
        certNum: "12022519941017617X",
        certName: "赵海月"
      };
      let url = this.HOME + "/app-web/woapp/v18/user/checkCustInfo.do";
      this.$axios.get(url, { params: postData }).then(res => {
        console.log(res);
      });
    },
    //身份证实名制校验接口
    certCheck() {
      //军人身份证不做校验 TODO
      // 港澳台身份证不做校验TODO
    },
    saveInputInfo(){

    }

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
}
.readCardCon {
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: auto;
}
.bluetoothSet {
  width: 100%;
  height: 50px;
  background: #ffffff;
  line-height: 50px;
  padding: 0 10px;
  border-top: 1px solid #ddd;
  margin-top: 8px;
}
.cardInfoContainer {
  position: relative;
  width: 100%;
  height: auto;
  font-size: 14px;
}
.cardInfoContainer img {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
.cardInfoContainer .cardInfo {
  margin-left: 23%;
  padding-top: 14.3%;
  width: 45%;
  color: #666;
  line-height: 260%;
}
/* .name,.number{
  width: 100%;
    height: 30px;
    line-height: 30px;
} */
.readResult {
  position: absolute;
  left: 16%;
  top: 80%;
  width: 35%;
  font-size: 17px;
  color: #b39f90;
}
.layer {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.7);
}
.layer .layerCont {
  margin: 0 auto;
  text-align: center;
  position: absolute;
  top: 40%;
  left: 50%;
  max-height: 100%;
  overflow-y: auto;
  transform: translate3d(-40%, -50%, 0);
}

.layer .van-loading {
  width: auto;
}
.van-popup--right {
  width: 100%;
  height: 100%;
  background: #f5f2eb;
}
.vanCellGroup{
margin-top:2%;
}
.vanCellGroupFont{
  color:#CCCCCC;
}
</style>
