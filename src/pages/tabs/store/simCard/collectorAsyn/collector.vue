<template>

  <div class="broadbandBox">
    <Header @goBack="goBack()" title="选择证件入网"></Header>
    <div class="jkbtnBox">
      <van-row type="flex" justify="space-around">
        <van-col span="9"><span>
            <van-button class="jkbtn" round plain type="danger" @click="setVisible()">个人证件入网</van-button>
          </span></van-col>
        <van-col span="9"><span>
            <van-button class="jkbtn" round plain type="danger" @click="comShowVisible()">集团证件入网</van-button>
          </span></van-col>
      </van-row>
    </div>

    <!-- 集团证件入网下面的两个按钮,提示，单选框-->
    <div class="companyBtn" v-if="comShow">
      <div>
        <van-row type="flex" justify="space-around">
          <van-col span="11"><span>
              <van-button class="jtBtn" type="default" @click="setVisible()">使用人产品</van-button>
            </span></van-col>
          <van-col span="11"><span>
              <van-button class="jtBtn" type="default" @click="setVisible()">责任人产品</van-button>
            </span></van-col>
        </van-row>
        <!-- 提示 -->
        <van-row type="flex" justify="space-around" class="tipsBox">
          <van-col span="11"><span></span></van-col>
          <van-col span="11"><span class="tips" @click="toGoodType()">责任人产品种类？</span></van-col>
        </van-row>
        <!-- 复选框 -->
        <van-row type="flex" justify="space-around" class="tipsBox">
          <van-col span="11"><span>
              <van-checkbox v-model="isSelf" class="isSelfCheckedBtn" checked-color="#FF6600">经办人本人</van-checkbox>
            </span></van-col>
          <van-col span="11"><span></span></van-col>
        </van-row>

      </div>

    </div>

    <!-- 点击个人证件入网弹出的单选面板 -->
    <!-- <div class="wo-footer-component" v-if= "show"> 
    </div> -->
    <van-actionsheet v-model="show" title="请选择证件类型">
      <!-- <p> -->
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell v-for="item in cardList" style='font-size:14px' :title="item.cardType" clickable @click="clickRadio(item)">
            <van-radio :name="item.index" />
          </van-cell>
          <!-- <van-cell style='font-size:14px' title="居民身份证" clickable @click="radio = '1'"><van-radio name="1" /></van-cell>
          <van-cell style='font-size:14px' title="户口簿" clickable @click="radio = '2'"><van-radio name="2" /></van-cell>
          <van-cell style='font-size:14px' title="军人身份证" clickable @click="radio = '3'"><van-radio name="3" /></van-cell>
          <van-cell style='font-size:14px' title="武装警察身份证" clickable @click="radio = '4'"> <van-radio name="4" /></van-cell>
          <van-cell style='font-size:14px' title="港澳居民来往内地通行证" clickable @click="radio = '5'"><van-radio name="5" /></van-cell>
          <van-cell style='font-size:14px' title="护照" clickable @click="radio = '6'"><van-radio name="6" /></van-cell>    
          <van-cell style='font-size:14px' title="台湾居民来往大陆通行证" clickable @click="radio = '7'"> <van-radio name="7" /></van-cell> -->
        </van-cell-group>
      </van-radio-group>
      <!-- </p> -->
    </van-actionsheet>

    <!-- 当证件类型是2，4，5，6，7的时候，右侧弹框输入资料 -->

    <van-popup v-model="show" position="right" :overlay="false">
        内容
      </van-popup>

  </div>
</template>

<script>
  import Header from "@/components/Header";
  import woBtn from "@/components/woBtn";
  // import woTitleBar from "@/components/woTitleBar";
  export default {
    components: {
      Header,
      woBtn,
    },
    data() {
      return {
        radio: '',
        isSelf: true,
        show: false,
        comShow: false,
        picTypeUrl: '/picType',
        readIdCardUrl: '/readIdCard',
        InputOtherCardInfoUrl:'/InputOtherCardInfo',
        cardList: [{ index: 1, cardType: '居民身份证' },
        { index: 2, cardType: '户口簿' },
        { index: 3, cardType: '军人身份证' },
        { index: 4, cardType: '武装警察身份证' },
        { index: 5, cardType: '港澳居民来往内地通行证' },
        { index: 6, cardType: '护照' },
        { index: 7, cardType: '台湾居民来往大陆通行证' }
        ]
      }
    },
    watch: {
      radio:function(newValue, oldValue) {
        //监测radio值的变化
        console.log("**********当前的newValue***********" + newValue);
          if (newValue){
            if(newValue=='1' || newValue=='3'){
              console.log("kk"+this.radio);
              this.$router.push({path: this.readIdCardUrl});
            }else {
              this.$router.push({path: this.InputOtherCardInfoUrl})
            }
        }
      }
    } ,
    methods: {
      clickRadio(item) {
        this.radio = item.index
        console.log(item)
      },
      //返回
      goBack() {
        this.$router.back(-1);
      },
      setVisible() {
        this.show = !this.show;
        if (this.comShow) {
          this.comShow = false;
          this.show = true;
        }
        else { this.show = true; }
      },
      comShowVisible() {
        if (this.show) {
          this.show = false;
          this.comShow = true;
        }
        else { this.comShow = true; }
      },
      toGoodType() {
        this.$router.push({ path: this.picTypeUrl });
      }
    }


  }

</script>

<style>
  .broadbandBox {
    width: 100%;
    padding: 45px 0;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .companyBtn {
    width: 100%;
    padding: 30px 0;
    position: relative;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .jkbtn {
    width: 100%;

  }

  .jtBtn {
    width: 100%;
    border-style: solid;
    border-width: 1px;
    border-color: #CCCCCC;
  }

  .tipsBox {
    padding-top: 2%;
  }

  .tips {
    position: relative;
    text-align: right;
    font-size: 15px;
  }

  .isSelfCheckedBtn {
    font-size: 15px;
  }

  .jkbtnBox {
    width: 100%;
    padding-top: 30px;
    padding-bottom: 30px;
    border-top-style: solid;
    border-bottom-style: solid;
    border-width: 1px;
    border-color: #CCCCCC;
  }

  .wo-footer-component {
    /* display: flex; */
    justify-content: center;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    /* height: 45; */
    border-top: 1px solid white;
  }
</style>