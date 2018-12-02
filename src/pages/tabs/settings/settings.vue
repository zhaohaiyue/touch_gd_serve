<template>
	<div>
	    <div>个人设置</div>
	    <div @click="joinRequest">工号绑定</div>
	</div>
</template>

<script>
export default {

  name: 'settings',

  data () {
    return {

    }
  },
  methods: {
  	joinRequest() {
  		let userSelectInfo = {
	        city: '广州',
	        active:this.active+1
	    };
	    this.$router.push({ name: "joinRequest", params: userSelectInfo });
  	}
  }
}
</script>

<style lang="css" scoped>
</style>