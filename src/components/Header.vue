<template>
    <div class="wo-header">
        <div class="wo-back" @click="$emit('goBack')">
            <i class="iconfont">&#xe600;</i>
        </div>
        <div class="wo-title">{{title}}</div>
        <div class="wo-serve" @click="customServices">
            <span><i class="iconfont">&#xe6f6;</i></span>
        </div>
    </div>
</template>
<script>
export default {
  name: "Header",
  props: {
    title: String
  },
  methods: {
    // goBack() {
    //   console.log("返回");
    // },
    customServices() {
      console.log("客服");
    }
  }
};
</script>
<style scoped>
.wo-header {
  width: 100%;
  height: 45px;
  line-height: 45px;
  background-color: #ff8a00;
  font-size: 16px;
  position: fixed;
  z-index: 999;
  top:0;
}
.wo-header .wo-back {
  width: 40px;
  height: 45px;
  color:#fff;
  line-height: 45px;
  text-align: center;
  position: absolute;
}
.wo-header .wo-title {
  color:#fff;
  text-align: center;
  line-height: 45px;
}
.wo-header .wo-serve {
  width: 40px;
  color:#fff;
  height: 45px;
  text-align: center;
  position: absolute;
  top: 0;
  right: 0;
}
</style>
