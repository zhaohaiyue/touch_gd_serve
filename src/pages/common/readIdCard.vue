<template>
  <div class="readCard">
    <Header title="身份证读取" @goBack="goBack()"></Header>

    <woSteps :steps="steps" :active="readCardIndex"></woSteps>
    <!-- <div class="wo-step">
      <van-steps :active="active">
        <van-step v-for="item in steps">{{item}}</van-step>
      </van-steps>
    </div> -->
    <div class="readCardCon">
      <div class="bluetoothSet" @click="readTypeSlideShow = true">
        <span>蓝牙阅读器 :</span> <span style="font-weight:bold">{{readerType}}</span>
        <i class="iconfont icon-youjiantou fr"></i>
      </div>
      <div class="cardInfoContainer" style="height:388px">
            <!-- <img :src="{{avaterImg}}" class="avaterImg" v-show="avaterImg"> -->
            <img src="../../assets/img/cardBg.jpg" id="cardBg">
            <div class="cardInfo">
                <div class="name">{{"" || userInfo.username}}</div>
                <div class="number">{{"" || userInfo.number}}</div>
                <div class="address">{{"" || userInfo.address}}</div>
            </div>
            <div class="readResult">{{readResult}}</div>
        </div>
    </div>
    <woBtn :btnText='flag?"读取":"提交信息"' @woBtnHandle="readCard()"></woBtn>
    <div class="layer" v-show="readingShow">
      <div class="layerCont">
        <van-loading type="spinner" color="white" />
        <div style="color:#fff; font-size:18px;margin-top:10px;">正在读卡中...</div>
      </div>
    </div>
    <van-popup v-model="readTypeSlideShow" position="right" :overlay="true">
      <Header title="读取方式" @goBack="readTypeSlideShow=false"></Header>
      <div class="bluetoothConfigInfo" style="margin-top:45px">
        <woTitleBar titleBarName="读卡方式"></woTitleBar>

        <van-collapse v-model="activeNames" accordion>
          <van-collapse-item title="蓝牙" name="1">
            <div>
              <li><span>过滤蓝牙</span></li>
            </div>
          </van-collapse-item>
        </van-collapse>
        <!-- <div class="">
          <van-cell title="蓝牙" is-link arrow-direction="down" value=" (森锐)" />
        </div> -->
      </div>
    </van-popup>
  </div>
</template>

<script>
import Header from "@/components/Header";
import woBtn from "@/components/woBtn";
import woTitleBar from "@/components/woTitleBar";
import woSteps from "@/components/woSteps";
export default {
  components: {
    Header,
    woBtn,
    woTitleBar,
    woSteps
  },
  data() {
    return {
      radio:'',
      activeNames:'1',
      steps: ["查询地址资源", "录入客户信息", "选择宽带产品"],
      readTypeSlideShow: false, //阅读器设置
      flag: true, //底部按钮 读取-提交信息
      readingShow: false, //读卡中...
      readCardIndex: this.$storage.get('step').step.readCardIndex, //步骤条索引
      readResult: "请将二代身份证放置设备阅读区！",
      readerType: "未设置",
      userInfo: {
        username: "",
        number: "",
        address: ""
      }
    };
  },
  mounted(){
    this.steps = this.$storage.get('step').step.labels
    console.log(this.$route.query)
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
    readCard() {
      // if(this.readerType == "未设置") {
      //   this.$dialog.alert({
      //     message: "请设置蓝牙阅读器!"
      //   });
      //   return;
      // }
      //读取
      if (this.flag) {
        this.readingShow = true;
        var _this = this;
        setTimeout(function() {
          _this.readingShow = false;
          _this.userInfo.username = "赵海月";
          _this.userInfo.number =
            "225147198814142574".substr(0, 5) +
            "*********" +
            "225147198814142574".substr(14);
          _this.userInfo.address = "北京市海淀区西北旺镇亚信科技大厦";
          _this.flag = false;
          _this.readResult = "读卡成功";
        }, 2000);
      } else {
        //提交信息
        //TODO
        this.getSysDate();
        this.checkCustInfo();
        console.log("提交信息");
        this.$router.push({ path: '/readPhoto' });

      }
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


.readCardCon {
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: auto;
  margin-top: 60px;
}
.bluetoothSet {
  width: 100%;
  height: 50px;
  background: #ffffff;
  line-height: 50px;
  padding: 0 10px;
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
  z-index: 9999;
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
}

</style>
