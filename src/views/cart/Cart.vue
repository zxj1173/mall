<template>
  <div id="cart">
    <!--  导航  -->
    <nav-bar class="nav-bar"><div slot="center">购物车({{length}})</div></nav-bar>
    <!--  商品列表  -->
    <scroll class="content" ref="scroll">
      <cart-list></cart-list>
    </scroll>

    <!--  底部汇总  -->
    <cart-bottom-bar ></cart-bottom-bar>
  </div>
</template>

<script>
import NavBar from "@/components/common/navbar/NavBar";
import CartList from "@/views/cart/childComps/CartList";
import scroll from "@/components/common/scroll/Scroll";
import CartBottomBar from "@/views/cart/childComps/CartBottomBar";
import {mapGetters} from 'vuex'
export default {
  name: "Cart",
  components:{
    NavBar,
    CartList,
    scroll,
    CartBottomBar
  },
  computed: {
    // ...mapGetters(['cartLength'])
    ...mapGetters({
      length: 'cartLength'
    })
  },
  activated() {
    this.$refs.scroll.refresh();
  }
}
</script>

<style scoped>
  #cart {
    height: 100vh;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }
  .content {
    height: calc(100% - 44px - 49px - 40px);
    overflow: hidden;
  }
</style>
