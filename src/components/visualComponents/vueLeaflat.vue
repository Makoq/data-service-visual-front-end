<template>
<div id="leaflet-parent">
   <div 
   @click="click_listener"
   id="mapid"></div>
 
</div>
</template>

<script>
  export default {
     
    data () {
       
      return {
        map:null,
       echart_option:{}
 

      }
    },
     mounted(){

       this.map= L.map('mapid').setView([33.49771311230842, 109.45744048529967],5);
       L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      
    }).addTo(this.map)

    },
    watch:{
      Update:function(){
        let index = this.$store.state.currentElementIndex;

        let udx_data=this.$store.state.chartData.elements[index].data.datacon.data;

        this.addMarkers(udx_data)
      },
      

    },
    computed:{
        Update(){
                let index = this.$store.state.currentElementIndex;
                if(index<0) return
                return this.$store.state.chartData.elements[index].data;
        },
        

    },
    methods:{
      addMarkers(data){
        let self=this
        var month_ave=data.columns,station_info=data.rows
        if(station_info[0][station_info[0].length-1].year_gear===undefined) return
        //station_info.length
        var x_time=[]//echart横坐标值
        var start_year=station_info[0][station_info[0].length-1].year_gear[0]
        var end_year=station_info[0][station_info[0].length-1].year_gear[1]
        for(let y=start_year;y<=end_year;y++){
          for(let m=1;m<=12;m++){
              x_time.push(y*100+m)
          }
           
        }

        for(let i=0;i<station_info[0].length-1;i++){

            let marker = L.marker([station_info[0][i].lag,station_info[0][i].lat] ).addTo(this.map);
            marker.bindPopup('<div id="main_chart_'+i+'" style="width: 350px;height:260px;"></div>');
            

           let option = {
                          title: {
                              text: start_year+'-'+end_year+'水文站流量月均值'
                          },
                           
                          xAxis: {
                              data: []
                          },
                          yAxis: {},
                          series: [{
                              name: 'll',
                              type: 'line',
                              data: []
                          },
                          {
                              name: '模拟值',
                              type: 'line',
                              data: []
                          }
                          ]
                      };
            //echart纵坐标值
            
             month_ave[0][i].forEach(element => {
               option.series[0].data.push(element)
                 
             });
             month_ave[1][i].forEach(element => {
               option.series[1].data.push(element)
                 
             });

             option.xAxis.data=x_time;
            //将dom id作为对象属性
             self.echart_option['main_chart_'+i]=option
          

        }
      },
      click_listener(){
        let self=this
        //这里这是定时器，是因为点击后popup的dom出现后，才能获取节点，然后插入挂载echart的div
        setTimeout(()=>{

          let child=document.getElementsByClassName('leaflet-pane leaflet-popup-pane')[0].children.length

                  if(child>0){
                     
                      let echart_dom=document.getElementsByClassName('leaflet-popup-content')[0].children
                      let myChart = echarts.init(echart_dom[0]);
                      let data_name=echart_dom[0].id

                     
                      
                      // 装配数据。
                      myChart.setOption(self.echart_option[data_name]);
                  }


        },500)
        
      }

    }
  }
</script>

<style scoped>
#mapid { height: 100%; }
#leaflet-parent{
  height: 100%;
}
</style>>