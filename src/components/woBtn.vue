<template>
    <div class="woBtn" @click="$emit('woBtnHandle')">{{btnText}}</div>
</template>
<script>
    export default{
        name: 'wo-btn',
        props:{
            btnText: String
        },
        methods: {
            
        }
    }
</script>
<style scoped>
.woBtn {
  width: 100%;
  height: 45px;
  background: #ff8a00;
  text-align: center;
  line-height: 45px;
  position: fixed;
  z-index: 999;
  bottom: 0;
  font-size: 16px;
  color: #fff;
}
</style>
