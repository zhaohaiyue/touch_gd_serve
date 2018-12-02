<template>
    <div class="wo-photopicker-component" v-bind:style="{width:width,height:containerHeight}">
          <p class="wo-photopicker-title">{{title}}</p>
        
          <div class="wo-photopicker-content">
            <img  v-if="!hasPhoto" class="wo-photopicker-icon"  v-on:click="onGetPhoto()" v-bind:style="{left:iconLeft+'px', top: iconTop+'px'}" src="@/assets/img/camera.png" alt="">
            <div v-if="!hasPhoto" class="wo-photopicker-bg" v-bind:style="{width: width, height: height}"></div>      
          
           <img v-if="hasPhoto" class="wo-photopicker-retake" v-bind:style="{left:retakeLeft+'px'}" src="@/assets/img/retake.png" alt="">    
           <img v-if="hasPhoto" class="wo-photopicker-close" src="@/assets/img/close_red.png" v-on:click="onClose()" alt="">
           <img v-if="hasPhoto" class="wo-photopicker-thumb" src="@/assets/img/photo.png" v-bind:style="{width: width, height: height}" alt="" />
          </div>   
    </div>     
</template>
<script>
export default {
  name: "takePhoto",
  props: {
    title: String
  },
  data() {
    return {
      hasPhoto: false,
      cols: 3, // 一行有几个元素
      margin: 20, // 边距
      windowWidth: window.innerWidth, // 窗口宽度
      fullWidth: "",
      itemWidth: "",
      iconLeft: "",
      retakeLeft: "",
      iconTop: "",
      containerHeight: "",
      // 未拍摄，一行三个(用截取而不是四舍五入，因为四舍五入有可能变大)
      iconSize: 60,
      retakeBtnSize: 44
    };
  },
  created() {
    this.fullWidth1();
    this.itemWidth1();
    this.iconLeft1();
    this.retakeLeft1();
    this.iconTop1();
    this.changeSize();
  },
  methods: {
    changeSize: function() {
      if (!this.hasPhoto) {
        this.width = this.itemWidth + "px";
        this.height = this.itemWidth + "px";
        this.containerHeight = this.itemWidth + 20 + "px";
      } else {
        this.width = this.fullWidth + "px";
        this.height = "auto";
        this.containerHeight = "auto";
      }
    },
    fullWidth1: function() {
      return (this.fullWidth = this.windowWidth - 2 * this.margin);
    },
    itemWidth1: function() {
      return (this.itemWidth = Math.floor(
        (this.windowWidth - (this.cols + 1) * this.margin) / this.cols
      ));
    },
    iconLeft1: function() {
      return (this.iconLeft = (this.itemWidth - this.iconSize) / 2);
    },
    retakeLeft1: function() {
      return (this.retakeLeft = (this.fullWidth - this.retakeBtnSize) / 2);
    },
    iconTop1: function() {
      return (this.iconTop = this.iconLeft);
    },
    onGetPhoto() {
      this.hasPhoto = true;
      this.changeSize();
    },
    onClose() {
      this.hasPhoto = false;
      this.changeSize();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wo-photopicker-component {
  position: relative;
  float: left;
  margin: 0 10px 10px 0;
}

.wo-photopicker-icon {
  position: absolute;
  width: 60px;
  height: 60px;
  left: 20px;
  top: 20px;
}

.wo-photopicker-content {
  position: relative;
}

.wo-photopicker-icon {
  position: absolute;
  width: 60px;
  height: 60px;
  left: 20px;
  top: 20px;
}

.wo-photopicker-retake {
  position: absolute;
  width: 44px;
  height: 44px;
  /* right: 10px; */
  /* top: 10px; */
  bottom: 15px;
}

.wo-photopicker-close {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 10px;
  top: 10px;
}

.wo-photopicker-thumb {
  width: 100px;
  height: 100px;
  border-radius: 4px;
}

.wo-photopicker-bg {
  border-radius: 4px;
  width: 100px;
  height: 100px;
  background-color: #ff8a00;
  float: left;
}

.wo-photopicker-title {
  font-size: 70%;
  color: #666;
  margin-bottom: 1px;
}
.wo-photo-container {
  position: relative;
  padding-right: 0;
  overflow: hidden;
}
</style>
