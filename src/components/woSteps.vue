<template>
    <div class="wo-step">
      <van-steps :active="active">
        <van-step v-for="item in steps">{{item}}</van-step>
      </van-steps>
    </div>
</template>
<script>
export default {
  name: "woSteps",
  props: {
    steps: Array,
    active:Number
  },
  methods: {}
};
</script>
<style scoped>

.wo-step{
    width: 100%;
    position: fixed;
    top: 45px;
    z-index: 99;
    border-bottom: 1px solid #ddd;
}
</style>

