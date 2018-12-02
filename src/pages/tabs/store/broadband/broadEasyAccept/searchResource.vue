<template>
<div class="broadbandBox">
  <Header @goBack="goBack()" @customServices="customServices()" title="查询地址资源"></Header>

  <woSteps :steps="steps" :active="active"></woSteps>

  <div class="broadband-box">
    <div class='wo-step-content'>
        <div class="list" style="background:#fff;">
            <woTitleBar titleBarName="装机地址查询"></woTitleBar>
            <div class="item" @click="cityProperShow=true">{{city == '' ? '市、区': city}} <i class="iconfont icon-youjiantou fr"></i></div>
            <div class="item" @click="selectAddress()">{{address==''?'请输入具体地址信息':address}} <i class="iconfont icon-youjiantou fr"></i></div>
            <div class="item" v-if="address">
              <input type="text" class="input_style" v-model.trim="detailedAddress">
              <div class="resetBtn" @click="clearaddr()">重新输入</div>
            </div>
        </div>
        <div class="listInfo" v-if="address">
          <div class="item-divider" style="text-align:center;color:#ff8a00;border:1px solid rgba(255, 138, 0,.3);">检验结果</div>
          <div class="item"><span class="item-note">营业区</span>{{ossResouce.businessQuarter}}</div>
          <div class="item"><span class="item-note">营业中心</span>{{ossResouce.market_core_name}}</div>
          <div class="item"><span class="item-note">目标市场</span>{{ossResouce.target_market_name}}</div>
          <div class="item"><span class="item-note">接入方式</span>{{ossResouce.access_mode}}</div>
          <div class="item"><span class="item-note">资源类型</span>{{ossResouce.maintain_mode}}</div>
        </div>
    </div>
  </div>
  <woBtn btnText="下一步" @woBtnHandle="nextStep()"></woBtn>
    <!-- 市区选择 -->
    <van-popup v-model="cityProperShow" position="bottom" :overlay="false">
        <van-picker show-toolbar title="城市选择" @cancel="cityProperShow=false" @confirm="onConfirm" @change="onChange" :columns="columns"  />
    </van-popup>
    <!-- 地址查询 -->
    <van-popup v-model="searchAddrShow" position="right" :overlay="true">
        <van-search
          v-model.trim="searchAddrValue"
          placeholder="请输入搜索关键词"
          show-action
          @search="onSearch"
          @cancel="onCancel"
        />
        <div class='addressList' v-if="addressSearchResultShow">
          <ul>
            <li :class="{active_address: active_address == item.addressCode}" 
            @click="selectSearchAddr(item);" :key="item.addressCode"
            v-for="(item) in addressSearchResult">{{item.addressName.substr(5)}}
            </li>
          </ul>
        </div>
    <div class="quering" v-show="queryLayer">
      <van-loading type="spinner" color="black" />
      查询中...</div>
    </van-popup>
</div>
</template>

<script>
import Header from "@/components/Header";
import woBtn from "@/components/woBtn";
import woTitleBar from "@/components/woTitleBar";
import woSteps from "@/components/woSteps";
import * as gdCityDistrictList from "../../../../../constants/gdCityDistrictList.js";
import { getOssAddQuery, getOssResouceQuery } from "../../../../../api/api.js";

let cityLists = gdCityDistrictList.default.gdCityDistrictList;
let citys = {};
cityLists.forEach(function(cityItem, index) {
  let areaArr = [];
  cityItem.districts.forEach(function(areaItem, index1) {
    areaArr.push(areaItem.name);
  });
  citys[cityItem.name] = areaArr;
});
// console.log(citys);

export default {
  components: {
    Header,
    woBtn,
    woTitleBar,
    woSteps
  },
  data() {
    return {
      active_address: "",
      steps: ["查找地址资源", "录入客户信息", "选择宽带产品"],
      queryLayer: false, //控制查询中图层..
      addressSearchResult: [], //存放标准地址搜索
      addressSearchResultShow: false, //控制标准地址结果显示/隐藏
      active: this.$storage.get("step").step.broadSearchIndex, //设置当前step状态
      city: "", //市区
      address: "", //具体地址
      detailedAddress: "", //重新输入栏
      cityProperShow: false, //市区选择层
      searchAddrShow: false, //地址搜索层
      searchAddrValue: "", //地址搜索value
      ossResouce: {
        // businessQuarter: "深圳特区内分局",
        // market_core_name: "宝安北营销中心",
        // target_market_name: "新宝花园",
        // access_mode: "FTTH",
        // maintain_mode: "三话"
      },
      columns: [
        {
          values: Object.keys(citys),
          className: "column1"
        },
        {
          values: citys["广州"],
          className: "column2",
          defaultIndex: 8
        }
      ],
      localNetId: "", //本地网标识
      areaId: "" //服务区编码
    };
  },
  created() {
    let steps = this.$storage.get("step");
    this.steps = steps.step.labels;
  },
  watch: {
    //监听标准地址栏value
    searchAddrValue(cur, old) {
      if (this.searchAddrValue) {
        this.onSearch();
      } else {
        this.addressSearchResult = [];
        this.queryLayer = false;
        this.addressSearchResultShow = false;
        this.active_address = "";
      }
    }
  },
  methods: {
    //返回
    goBack() {
      this.$router.back(-1);
    },
    //选中地址搜索列表中的某一项
    selectSearchAddr(item) {
      this.active_address = item.addressCode;
      let params = {
        addrId: item.addressCode,
        antiType: 0,
        localNetId: this.localNetId
      };
      this.queryLayer = true;
      getOssResouceQuery(params).then(res => {
        if (res.data.respCode == "0") {
          this.queryLayer = false;
          this.ossResouce = res.data.accessModeList[0];
          this.ossResouce.access_mode = this.switchAccessMode(
            res.data.accessModeList[0].access_mode
          );
          this.address =
            res.data.address1Name +
            res.data.address2Name +
            res.data.address3Name;
          this.detailedAddress = res.data.address6Name + res.data.address7Name;
          this.searchAddrShow = false;
          // console.log(this.ossResouce)
        } else {
          this.$dialog
            .confirm({
              message: "您输入的地址暂无宽带资源!",
              confirmButtonText: "转预约单",
              cancelButtonText: "重新输入"
            })
            .then(() => {
              //TODO
              this.searchAddrValue = "";
              console.log("转预约单");
            })
            .catch(() => {
              //TODO
              this.queryLayer = false;
              console.log("重新输入");
            });
        }
      });
    },
    //地址搜索栏事件
    onSearch() {
      let params = {
        qryType: "0", // 查询方式 0地址关键字查询 1按邻居号码查询 2按地址简拼查询
        localNetId: this.localNetId, // 本地网标识 广州传1
        cityName: this.city.substring(2, 0), // 城市名
        areaId: this.areaId, // 服务区编码 天河区传30121
        districtName: this.city.substring(3), //区县名
        installAdd: this.searchAddrValue, // 地址关键字 邮通小区
        installAdd1: "wo-test", //将地址拆分为两部分，此处为前半部分
        installAdd2: "默认地址", //将地址拆分为两部分，此处为后半部分
        returnaddrNum: "", //返回地址的字段数目
        datamodifyLevel: "", //接口返回的字段数目
        temp: "" //存放临时字符串
      };
      //测试原有的接口
      this.queryLayer = true;
      getOssAddQuery(params).then(res => {
        if (res.status == "200") {
          this.queryLayer = false;
          if (res.data.respCode == "0000" && res.addrList !== []) {
            this.addressSearchResult = res.data.addrList;
            this.addressSearchResultShow = true;
            // console.log(res.data.addrList);
          } else {
            this.queryLayer = false;
          }
        }
      });
    },
    //地址搜索栏取消
    onCancel() {
      this.searchAddrShow = false;
    },
    //重新输入
    clearaddr() {
      this.detailedAddress = "";
    },
    //下一步
    nextStep() {
      if (!this.city) {
        this.$dialog.alert({
          message: "请选择市、区"
        });
        return;
      }
      if (!this.address) {
        this.$dialog.alert({
          message: "请选择具体地址信息"
        });
        return;
      }
      if (!this.detailedAddress) {
        this.$dialog.alert({
          message: "请选择具体地址信息"
        });
        return;
      }
      //保存用户选择信息
      let userSelectInfo = {
        city: this.city,
        address: this.address,
        detailedAddress: this.detailedAddress,
        ossResouce: this.ossResouce
      };
      // console.log(userSelectInfo);
      this.$router.push({ path: "/readIdCard", query: userSelectInfo });
    },
    //请输入具体地址信息
    selectAddress(e) {
      if (!this.city) {
        this.$dialog.alert({
          message: "请先选择市、区"
        });
        return;
      }
      this.searchAddrShow = true;
    },
    //市区弹出框change事件
    onChange(picker, values, index) {
      this.city = values.join("、");
      picker.setColumnValues(1, citys[values[0]]);
    },
    //市区弹出框确认事件
    onConfirm(values, index) {
      // console.log(this.city.substring(2,0))
      // console.log(this.city.substring(3))
      if (index[1] >= 10) {
        this.localNetId = index[0] + 1;
        this.areaId = index[0] + 1 + "" + (index[1] + 1);
        // console.log(index[0] + 1, index[0] + 1 + "" + (index[1] + 1));
      } else {
        this.localNetId = index[0] + 1;
        this.areaId = index[0] + 1 + "0" + (index[1] + 1);
        // console.log(index[0] + 1, index[0] + 1 + "0" + (index[1] + 1));
      }
      this.city = values.join("、");
      this.cityProperShow = false;
    },
    // 宽带接入方式显示内容转换
    switchAccessMode(access_mode) {
      var AccessMode = "";
      switch (access_mode) {
        case "1":
          AccessMode = "FTTH";
          break;
        case "2":
          AccessMode = "PON+LAN、NGN";
          break;
        case "3":
          AccessMode = "PON+ADSL";
          break;
        case "4":
          AccessMode = "LAN";
          break;
        case "5":
          AccessMode = "普通接入、传统DSL、PSTN";
          break;
        case "6":
          AccessMode = "IMS-EPON";
          break;
        case "7":
          AccessMode = "IMS-FTTH";
          break;
        default:
          AccessMode = "";
      }
      return AccessMode;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  /* border-top: 1px solid #ddd; */
  /* border-bottom: 1px solid #ddd; */
}
.broadband-box {
  width: 100%;
  height: calc(100% - 80px);
  overflow-y: auto;
  margin-top: 59px;
}
.wo-step-content {
  width: 100%;
  font-size: 12px;
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
.active_address {
  color: #ff8a00;
}
</style>

