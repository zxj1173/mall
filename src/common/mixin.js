export const testMixin = {
  mounted () {
    // console.log('我是混入')
  }
}
import BackTop from "@/components/content/backTop/BackTop"
export const backTopMixin = {
  components:{
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backTopClick() {
      this.$refs.scroll.scrollTo(0,0,1000)
    },
  }
}
