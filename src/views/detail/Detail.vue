<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="deltialnav"></detail-nav-bar>
    <scroll class="content" ref="scroll"
            :probeType="3"
            @scrollPosition="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"></detail-goods-info>
      <detail-param-info ref="params" :param-info="paramInfo"></detail-param-info>
      <detail-commen-info ref="commnet" :comment-info="commentInfo"></detail-commen-info>
      <goods-list ref="recommend" :goods="recommends"></goods-list>
    </scroll>
    <detail-bottom-bar @addCart="addToCart" class="bottom-bar"></detail-bottom-bar>
    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>
    <toast :messages="message" :show="show"></toast>
  </div>
</template>

<script>
import DetailNavBar from "@/views/detail/childComps/DetailNavBar";
import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "@/network/detail";
import DetailSwiper from "@/views/detail/childComps/DetailSwiper";
import DetailBaseInfo from "@/views/detail/childComps/DetailBaseInfo";
import DetailShopInfo from "@/views/detail/childComps/DetailShopInfo";
import DetailGoodsInfo from "@/views/detail/childComps/DetailGoodsInfo";
import DetailParamInfo from "@/views/detail/childComps/DetailParamInfo";
import DetailCommenInfo from "@/views/detail/childComps/DetailCommenInfo";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";
import Toast from "@/components/common/toast/Toast";
import DetailBottomBar from "@/views/detail/childComps/DetailBottomBar";
import {debounce} from "@/common/utils";
import {testMixin,backTopMixin} from "@/common/mixin";
import {mapActions} from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    Scroll,
    DetailParamInfo,
    DetailCommenInfo,
    GoodsList,
    DetailBottomBar,
    Toast
  },
  data() {
    return {
      iid:null,
      topImages:[],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      itemImgListener: null,
      themeTopY: [0,1000,2000,3000],
      getThemeTopY: null,
      currentIndex: 0,
      message:'',
      show: false
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid;

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      const data = res.result;
      //1获取顶部图片的轮播数据
      this.topImages = data.itemInfo.topImages;
      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
      // 3.创建店铺信息
      this.shop = new Shop(data.shopInfo)
      // 4.保存商品详细信息
      this.detailInfo = data.detailInfo;
      // 5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
      // 6.获取评论信息
      if (data.rate.cRate !== 0){
        this.commentInfo = data.rate.list[0];
      }
    })


  },
  updated() {
    // 3.请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })

    this.getThemeTopY = debounce(()=>{
      this.themeTopY = [];
      this.themeTopY.push(0);
      this.themeTopY.push(this.$refs.params.$el.offsetTop)
      this.themeTopY.push(this.$refs.commnet.$el.offsetTop)
      this.themeTopY.push(this.$refs.recommend.$el.offsetTop)
      this.themeTopY.push(1000000)
      console.log(this.themeTopY)
    },100)
  },
  mixins: [testMixin,backTopMixin],
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh,200)
    // 对监听的事件进行保存
    this.itemImgListener =() => {
      // this.$refs.scroll.refresh();  //执行30次
      refresh(); //少次
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)

  },
  destroyed() {
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
  methods: {
    imageLoad() {
      // 图片加载完
        this.$refs.scroll.refresh();
        this.getThemeTopY();
    },
    titleClick(index) {
      console.log(index)
      this.$refs.scroll.scrollTo(0,-this.themeTopY[index],200)
    },
    contentScroll(position) {
      //内容滚动监听
      this.isShowBackTop = position.y < -1000
      // 1.获取y值
      const positionY = -position.y
      // 2.positionY和主题中值进行对比
      //   [0, 5561, 6363, 6581,Number.MIN_VALUE]
      // positionY 在 0 和 5561 之间， index =0
      // positionY 在 5561 和 6363 之间， index =1
      // positionY 在 6363 和 6581 之间， index =2
      // positionY 在 6581 和 非常大的值之间, index =3
      let length = this.themeTopY.length
      for (let i=0;i<length;i++){
        if (  (this.currentIndex !==i) &&
          (positionY >= this.themeTopY[i] && positionY < this.themeTopY[i+1])  ){
          this.currentIndex = i;
          this.$refs.deltialnav.currentIndex = this.currentIndex;
        }
      }

      // if (positionY >= -this.themeTopY[1]){
      //   console.log('商品')
      //   this.$refs.deltialnav.currentIndex = 0;
      // }else if(positionY >= -this.themeTopY[2]){
      //   console.log('参数')
      //   this.$refs.deltialnav.currentIndex = 1;
      // }else if (positionY >= -this.themeTopY[3]){
      //   console.log('评论')
      //   this.$refs.deltialnav.currentIndex = 2;
      // }else {
      //   console.log('推荐')
      //   this.$refs.deltialnav.currentIndex = 3;
      // }
    },
    ...mapActions(['addCart']),
    addToCart() {
      // console.log('加入购物车成功');
      // 1.获取购物车需要展示的信息
      const prodcut = {}
      prodcut.image = this.topImages[0]
      prodcut.title = this.goods.title
      prodcut.desc = this.goods.desc
      prodcut.price = this.goods.nowPrice
      prodcut.iid = this.iid
      prodcut.count = 0
      // 2.将商品添加到购物车里
      // this.$store.commit('addCart',prodcut)
      // this.$store.dispatch('addCart',prodcut)

      // 3.弹窗
      // this.$store.dispatch('addCart',prodcut).then(res => {
      //   console.log(res)
      // })

      this.addCart(prodcut).then(res => {
        // console.log(res)
        this.$toast.show('成功加入购物车',2000);
        // this.$toast.show('哈哈哈',2000)
      })
    }
  }
}
</script>

<style scoped>
  #detail {
    height: 100vh;
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
  .content {
    height: calc(100% - 102px);
  }

</style>
