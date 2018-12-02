<template>
    
  <div class="broadbandBox"> 
    <Header @goBack="goBackToCollectPage()" title="责任人种产品类" ></Header>

    <div>
      <van-list >
        <van-cell class="picListStyle" v-for="item in picList" :key="item"  :title="item + ''" />
      </van-list>
    </div>

  </div>
</template>

<script>
    import Header from "@/components/Header";

export default {
components:{
    Header
},
data() {
    return {
      picList:['ICT','集线通','数字中继','商务总机','沃企云呼 ','语音天地',
      '800','4006','本地电话后付','商务动车','商务极光','商务快车']

    }
  },
  methods: {
    goBackToCollectPage() {
      this.$router.back(-1);
    }

  }
};

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

.picListStyle{
  font-size: 15px;
}

</style>