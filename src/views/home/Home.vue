<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control @itemClick="tabClick"
                 :titles="['流行','新款','精选']"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isFixed"></tab-control>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scrollPosition="getScrollPosition"
            :pull-up-load="true" @load="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperLoad"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control @itemClick="tabClick"
                   :titles="['流行','新款','精选']"
                   ref="tabControl2"></tab-control>
      <goods-list :goods="goods[currentType].list"></goods-list>
    </scroll>
    <back-top @click.native="backTopClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>

import HomeSwiper from "@/views/home/childComps/HomeSwiper";
import RecommendView from "@/views/home/childComps/RecommendView";
import FeatureView from "@/views/home/childComps/FeatureView";

import NavBar from 'components/common/navbar/NavBar';
import TabControl from "@/components/content/tabControl/TabControl";
import GoodsList from "@/components/content/goods/GoodsList";
import Scroll from "@/components/common/scroll/Scroll";


import {getHomeMultidata, getHomeGoods} from "@/network/home";
import {debounce} from "@/common/utils";
import scroll from "@/components/common/scroll/Scroll";
import {testMixin,backTopMixin} from "@/common/mixin";

export default {
  name: "Home",
  components:{
    HomeSwiper,
    RecommendView,
    FeatureView,
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
  },
  mixins: [testMixin,backTopMixin],
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
      },
      currentType:'pop',
      tabIndex: 0,
      tabOffsetTop:0,
      isFixed: false,
      saveY: 0,
      itemImgListener: null,
    }
  },
  created() {
    // 1.请求多个数据
    this.getHomeMultidata();
    // 2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');
  },
  activated() {
    this.$refs.scroll.scrollTo(0,this.saveY,0)
    this.$refs.scroll.refresh();  //防止滚动卡住不能动

    // 1.监听goods中item中图片加载完成
    const refresh = debounce(this.$refs.scroll.refresh,200)
    // 对监听的事件进行保存
    this.itemImgListener =() => {
      // this.$refs.scroll.refresh();  //执行30次
      refresh(); //少次
    }
    this.$bus.$on('itemImageLoad', this.itemImgListener)

  },
  deactivated() {
    // 1.保存y值
    this.saveY = this.$refs.scroll.getScrollY();
    // 2.取消全局时间的监听(事件，函数名)
    this.$bus.$off('itemImageLoad',this.itemImgListener)
  },
  methods: {

    // 事件监听的方法
    tabClick(index){
      this.tabIndex = index;
      switch (index){
        case 0:
          this.currentType = 'pop'
          break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },
    backTopClick() {
      this.$refs.scroll.scrollTo(0,0,6000)
    },
    getScrollPosition(position) {
      // 首页内容的滚动
      // 1.判断BackTop是否显示
      this.isShowBackTop = position.y <  -1000;
      // 2.决定tabControl是否吸顶(position: fixed)
      this.isFixed = position.y < -this.tabOffsetTop
    },
    loadMore() {
      this.getHomeGoods(this.currentType);
    },
    swiperLoad() {
      //轮播图的图片加载完成
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    // 网络请求相关的方法
    getHomeMultidata() {
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    },
    getHomeGoods(type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type,page).then(res => {
        // res.data.list  数组
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page +=1;
        //完成上拉加载更多
        this.$refs.scroll.finishPullUp();
      })
    },

  }
}
</script>

<style scoped>
  #home {
    position: relative;
    /*padding-top: 44px;*/
    height: 100vh;
  }
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-bottom: 44px;*/
  /*  position: fixed;*/
  /*  top: 44px;*/
  /*}*/
  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
</style>
