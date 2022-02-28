<template>
  <div class="toast" v-show="isShow">
    <div>{{messages}}</div>
  </div>
</template>

<script>
export default {
  name: "Toast",
  data() {
    return {
      isShow: false,
      messages: ''
    }
  },
  methods: {
    show(message='默认文字',delay=2000) {
      this.messages = message
      this.isShow = true
      setTimeout(() => {
        this.messages = ''
        this.isShow = false
      },delay)
    }
  }
}
</script>

<style scoped>
  .toast {
    position: fixed;
    z-index: 99;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 8px 10px;
    color: #fff;
    background-color: rgba(0,0,0,.75);
  }
</style>
