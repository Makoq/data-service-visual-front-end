<template  >

 <div id="main">
      <div id="Stats-output">
    </div>
    <!-- Div which will hold the Output -->
    <div id="WebGL-output">
    </div>

    <div id="div_chart" style="width: 600px;height:400px;"></div>
 </div>
  
</template>
<script>
import main from '../../../public/libs/3js/main'
export default {
    props:["width","height","data"],
    data () {
      this.chartSettings = {
        position: 'china',
        type: 'map',
        geo: {
          label: {
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#323c48',
              borderColor: '#111'
            },
            emphasis: {
              areaColor: '#2a333d'
            }
          }
        }
      }
      return {
        chartData: {
          columns: this.data.columns ,
          rows: this.data.rows
        }
      }
    },
    mounted(){
      
      main.ready()
      let cav=document.getElementById("WebGL-output")
      cav.firstElementChild.style.height='100%'
      cav.firstElementChild.style.width='100%'

      
     
    },
    watch:{
      data:function(){
        this.chartData= {
          columns: this.data.columns ,
          rows: this.data.rows
        }
      }
    }
  }
</script>
<style  scoped>
body{
  margin: 0;
  overflow: hidden;
}
#main{
  width: 100%;
  height: 100%;
}
#WebGL-output{
      width: 100%;
    height: 100%;
}
#WebGL-output canvas{
      width: 100%;
    height: 100%;
}
</style>

