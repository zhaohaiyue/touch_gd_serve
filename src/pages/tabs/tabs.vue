<template>
    <div>
        <router-view></router-view>
        <div class="tabsFooter">
            <ul>
                <li @click="changeTab(item.url)" v-for="item in tabs">{{item.name}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      tabs: [
        { index: 0, name: "商城", img: "", url: "/store" },
        { index: 0, name: "订单", img: "", url: "/order" },
        { index: 0, name: "个人中心", img: "", url: "/settings" }
      ]
    };
  },
  methods: {
    changeTab(url) {
      this.$router.push({ path: url });
    }
  }
};
</script>
<style scoped>
.tabsFooter ul {
  display: table;
  width: 100%;
}

.tabsFooter {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  bottom: 0;
}
.tabsFooter li {
  display: table-cell;
  line-height: 45px;
  text-align: center;
  height: 45px;
  width: 33.3333%;
  background: #ddd;
}
</style>

