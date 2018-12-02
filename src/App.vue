<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  font-size: 12px;
}
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  min-height: 100%;
  background-size: cover;
}
ul {
  list-style: none;
}
a {
  color: #000;
  text-decoration: none;
}
img {
  vertical-align: top;
  border: none;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
/* 修改vantUI的部分样式 */
.van-picker__cancel,
.van-dialog__confirm, 
.van-picker__confirm {
  color: #ff8a00 !important;
}
</style>
