<template lang="pug">
  #app
    router-view
</template>

<style lang="scss">
@import url('/assets/font/googleapis/googleapis.css');
@import url('//at.alicdn.com/t/font_1127427_8156c125kn9.css');

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  user-select: none;
}
.el-header {
  padding: 0;
}
.el-container {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
