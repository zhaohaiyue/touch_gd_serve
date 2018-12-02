<template>
    <div class="woTitleBar">{{titleBarName}}</div>
</template>
<script>
export default {
  name: "woTitleBar",
  props: {
    titleBarName: String
  },
  methods: {}
};
</script>
<style scoped>
.woTitleBar {
  padding: 0px 16px;
  height: 30px;
  line-height: 30px;
  background-color: #f5f5f5;
  min-height: 25px;
}
</style>

