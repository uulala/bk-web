<template>
  <view class="layout">
    <view class="avatar-wrapper"></view>
    <view class="avatar-wrapper1"></view>
    <image
      class="avatar"
      src="/static/img/logo.png"
    ></image>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ls } from '@/plugin/utils'
import { wxLogin, signIn, signUp, signOut, delUser } from '@/api/user'

wxLogin((result) => {
  uni.switchTab({
    url: '/pages/home/index',
    // success(res) {
    //     let pages = getCurrentPages()
    //     pages[0].$vm.reloadData()
    // }
  })
})


</script>

<style lang="scss" scoped>
.layout {
  // display: flex;
  // align-items: center;
  // justify-content: space-around;
  position: relative;
  height: 100vh;
  width: 100vw;
}

@keyframes logoRotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}

.avatar-wrapper {
  position: absolute;
  border-radius: 50%;
  width: calc(23vw + 5px);
  height: calc(23vw + 5px);
  left: calc(50vw - 15vw - 2.5px);
  top: calc(50vh - 23vw - 2.5px);

  // background-image: linear-gradient(to right, red, yellow, white, violet);
  background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
  animation: logoRotate 3s linear 2s infinite;
}

.avatar-wrapper1 {
  position: absolute;
  border-radius: 50%;
  width: calc(23vw + 3px);
  height: calc(23vw + 3px);
  left: calc(50vw - 15vw - 1.5px);
  top: calc(50vh - 23vw - 1.5px);

  background: #fff;
}

.avatar {
  position: absolute;
  border-radius: 50%;
  width: 23vw;
  height: 23vw;
  left: calc(50vw - 15vw);
  top: calc(50vh - 23vw);
}
</style>
