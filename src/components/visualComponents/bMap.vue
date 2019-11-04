<template>
<div>
  <ve-heatmap 
  :width="width"
 :height="height"
  :data="chartData" 
  :settings="chartSettings"></ve-heatmap>
 
</div>
</template>

<script>
  export default {
     props:["width","height","data"],
    data () {
      this.chartSettings = {
        key: 'oBvDtR6nzWtVchkY4cLHtnah1VVZQKRK',
        bmap: {
          center: [this.data.rows[0].lat, this.data.rows[0].lng],
          zoom: 8,
          roam: true
        },
        type: 'bmap'
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