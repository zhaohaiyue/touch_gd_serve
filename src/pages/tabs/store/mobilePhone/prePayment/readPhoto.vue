<template>
  <div  class="takePhoto">
    <Header title="拍摄照片" @goBack="goBack()"></Header>
    <woSteps :steps="steps" :active="facePhotoIndex"></woSteps>
    <div class="titleBar">
      <woTitleBar titleBarName="拍摄证件照和正面免冠照"></woTitleBar>
    </div>
    <div class="takePhotoForId">
        <takePhoto title="证件照一(正面)"></takePhoto>
        <takePhoto title="证件照二(反面)"></takePhoto>
        <takePhoto title="正面免冠照"></takePhoto>
    </div>
    <woBtn btnText="上传照片" @woBtnHandle="upLoadPhoto()"></woBtn>
 </div> 
</template>

<script>
import Header from "@/components/Header";
import woBtn from "@/components/woBtn";
import takePhoto from "@/components/takePhoto";
import woSteps from "@/components/woSteps";
import woTitleBar from "@/components/woTitleBar";

export default {
  components: {
    Header,
    woSteps,
    woBtn,
    woTitleBar,
    takePhoto
  },

  data() {
    return {
      steps: ["身份证读取", "拍照", "信息确认"],
      facePhotoIndex: this.$storage.get("step").step.facePhotoIndex,
      hasPhoto: false
    };
  },
   mounted(){
    this.steps = this.$storage.get('step').step.labels
    console.log(this.$route.query)
  },
  methods: {
    upLoadPhoto() {
      console.log("上传照片");
    },
    goBack() {
      this.$router.back(-1);
    },
    onRead(file) {
      console.log(file);
      this.$refs.goodsImg.src = file.content;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.takePhoto {
  width: 100%;
  padding: 45px 0;
  font-size: 14px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.takePhotoForId {
  width: 100%;
}
.titleBar{
  margin-top:59px;
}
.upphoto {
  width: 100%;
  height: calc(100% - 60px);
  overflow-y: auto;
  padding-left: 5px;
  padding-right: 5px;
}
</style>
