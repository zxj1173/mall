<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll"
                    class="check-all"
                    @click.native="checkAll"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计:{{totalPrice}}
    </div>
    <div class="calculate">
      去结算:({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from "@/components/content/checkButton/CheckButton";
export default {
  name: "CartBottomBar",
  components: {
    CheckButton
  },
  computed: {
    totalPrice(){
      return '￥' + this.$store.state.cartList.filter(item => {
        return item.checked
      }).reduce((preValue,item) => {
        return preValue + item.price * item.count
      },0)
    },
    checkLength() {
      return this.$store.state.cartList.filter(item => item.checked).length
    },
    isSelectAll() { //是否全选
      if (this.$store.state.cartList.length ===0 )
        return false
      return !(this.$store.state.cartList.filter(item => item.checked===false).length)
    },
  },
  methods: {
    checkAll() {
      if (this.isSelectAll){ // true 全部选中
        this.$store.state.cartList.forEach(item => item.checked = false)
      }else{
        this.$store.state.cartList.forEach(item => item.checked = true)
      }
    }
  }
}
</script>

<style scoped>
  .bottom-bar {
    position: relative;
    display: flex;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background-color: #eee;

  }
  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
  }
  .check-all {
    width: 21px;
    height: 21px;
    line-height: 21px;
    margin-right: 5px;
  }
  .price {
    margin-left: 30px;
    flex: 1;
  }
  .calculate {
    width: 90px;
    background-color: red;
    color: #fff;
    text-align: center;
  }
</style>
