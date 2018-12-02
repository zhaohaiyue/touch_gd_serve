<template>
	<div id="sign">
        <div class="canvasBox" >
		    <vueSignature ref="signature" :sigOption="option"  :h="'150px'"></vueSignature>     
        </div>
		<button @click="save">保存</button>
		<button @click="overwrite">重写</button>
	</div>
</template>

<script>
export default {
	name: "sign",
	data() {
		return {
			option:{
				penColor:"rgb(0, 0, 0)",
				backgroundColor:"rgb(255,255,255)"
			}
		};
	},
	methods:{
		save(){
            var _this = this;
			var png = _this.$refs.signature.save()
			var jpeg = _this.$refs.signature.save('image/jpeg')
			var svg = _this.$refs.signature.save('image/svg+xml');
            console.log(_this.$refs)
			console.log(png);
			console.log(jpeg)
			console.log(svg)
		},
		overwrite(){
			var _this = this;
			_this.$refs.signature.clear();
		},
		fromDataURL(url){
			var _this = this;
			_this.$refs.signature.fromDataURL("data:image/png;base64,iVBORw0K...");
		}
	}
};
</script>
<style>
.canvasBox{
    padding: 5px;
}

</style>
