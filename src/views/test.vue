<template  >
  <div>
    <canvas
     
      ref="myCanvas"
      width="700"
      height="400"
      style="border:1px solid #c3c3c3;"
    >您的浏览器不支持 HTML5 canvas 标签。</canvas>


  </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  mounted() {
    var canvas = this.$refs.myCanvas;
        if (canvas.getContext){
          var ctx = canvas.getContext('2d');

          ctx.fillStyle = "rgb(200,0,0)";
          ctx.fillRect (10, 10, 55, 50);

          ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
          ctx.fillRect (30, 30, 55, 50)
        }
  },
  methods: {

  }
};
</script>
<style lang="scss">
</style>

