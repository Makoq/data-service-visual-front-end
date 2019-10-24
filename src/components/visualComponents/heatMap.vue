<template  >
 <ve-heatmap
 :width="width"
 :height="height"
 :data="chartData" 
 :settings="chartSettings"
 ></ve-heatmap>
  
</template>
<script>
import httpUtils from "../../utils/httpUtils";
import { globalBus } from '../../utils/globalBus';
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
      console.log("hongbao",this.data)
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
<style  >

 
</style>

