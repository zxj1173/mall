<template>
  <div ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    probeType:{
      type: Number,
      default:0,
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null,
    }
  },
  mounted() {
    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper,{
      click: true,  // scroll中由div包装的点击事件，才能触发
      probeType: this.probeType,  //使用scroll组件时传入参数，决定是否实时监听
      pullUpLoad: this.pullUpLoad,
    })

    // 2.监听滚动的位置
    if (this.probeType===2 || this.probeType===3){
      this.scroll.on('scroll',position => {
        // console.log(position)
        this.$emit('scrollPosition',position)
      })
    }
    // 3.监听scroll滚动到底部
    if(this.pullUpLoad){
      this.scroll.on('pullingUp',()=>{
       this.$emit('load')
      })
    }
  },
  methods: {
    scrollTo(x,y,time=300){
      this.scroll &&  this.scroll.scrollTo(x,y,time);
    },
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>

<style scoped>

</style>
