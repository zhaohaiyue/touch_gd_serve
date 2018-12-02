<template>
    <div class="woHome">
        <ul>
            <li v-for="item in menuData"  @click="clickMenu(item)">
              <img :src="item.img" alt="">
              <p> {{item.menuName}} </p> 
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  data() {
    return {
      menuData: [
        {
          index: 0,
          id: "SMZDJ",
          menuName: "2/3G预付费",
          img: require("@/assets/img/store_2_3.png"),
          url: "/readIdCard",
          step: {
            labels: ["身份证验证", "拍摄照片", "信息确认"],
            readCardIndex: 0,
            facePhotoIndex: 1
          }
        },
        {
          index: 1,
          id: "TYMBTC",
          menuName: "号卡开户",
          img: require("@/assets/img/store_2_3.png"),
          url: "",
          step: {
            labels: [
              "身份证验证",
              "拍摄照片",
              "套餐号码",
              "确认订单",
              "一键开户"
            ],
            readCardIndex: 0,
            facePhotoIndex: 1
          }
        },
        {
          index: 2,
          id: "KDXZHF",
          menuName: "宽带收费",
          img: require("@/assets/img/store_2_3.png"),
          url: "/broadbandPay"
        },
        {
          index: 3,
          id: "ZBSTXZ",
          menuName: "手厅下载",
          img: require("@/assets/img/store_2_3.png"),
          url: ""
        },
        {
          index: 4,
          id: "BSS_PZ",
          menuName: "BSS二次人脸",
          img: require("@/assets/img/store_2_3.png"),
          url: "",
          step: {
            labels: ["录入信息", "拍摄照片"],
            readCardIndex: 0,
            facePhotoIndex: 1
          }
        },
        {
          index: 5,
          id: "KDJYSL",
          menuName: "宽带开户",
          img: require("@/assets/img/store_2_3.png"),
          url: "/searchResource",
          step: {
            labels: ["查询地址资源", "录入客户信息", "选择宽带产品"],
            broadSearchIndex: 0,
            readCardIndex: 1,
            facePhotoIndex: 1
          }
        },
        {
          index: 6,
          id: "JKYBKH",
          menuName: "集客异步开户",
          img: require("@/assets/img/store_2_3.png"),
          url: "/collect",
          step: {
            labels: ["身份证验证", "拍摄照片", "电子签名"],
            readCardIndex: 0,
            facePhotoIndex: 1,
            signIndex: 2
          }
        },
        {
          index: 7,
          id: "APPZHWJ",
          menuName: "智慧沃家",
          img: require("@/assets/img/store_2_3.png"),
          url: "/searchResource",
          step: {
            labels: [
              "资源预判",
              "身份实名",
              "商品选择",
              "填写资料",
              "一键开户"
            ],
            broadSearchIndex: 0,
            readCardIndex: 1,
            facePhotoIndex: 1
          }
        }
      ]
    };
  },
  methods: {
    //业务菜单点击
    clickMenu(item) {
      //储存在localstorage
      this.$storage.set('step',item)
      this.$router.push({ path: item.url });
      return;
      let url =
        this.HOME + "/app-web/woapp/v18/system/config/checkPermission.do";

      this.$axios(url, {
        params: {
          device: "phone",
          user_code: "51b2aub",
          busi_code: item.id
        }
      }).then(res => {
        if (res.data.success) {
          this.$storage.set("step", item);
          this.$router.push({ path: item.url });
        } else {
          this.$dialog.alert({
            title: "提示",
            message: res.data.msg + "!"
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.woHome {
  width: 100%;
  text-align: center;
  margin-top: 5%;
}
.woHome li {
  float: left;
  width: 33.333%;
  padding: 8px 10px;
}
.woHome li img {
  margin-bottom: 8px;
  width: 100%;
}
</style>

