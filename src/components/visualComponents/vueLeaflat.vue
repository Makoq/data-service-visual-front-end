<template>
<div id="leaflet-parent">
   <div 
   @click="click_listener"
   id="map"></div>
 
</div>
</template>

<script>
  export default {
     props:["width","height","data","id"],
    data () {
       
      return {
        map:null,
       echart_option:{}
 

      }
    },
     mounted(){
       let self=this
      //  document.getElementById('mapid').id="mapid"+this.id
      //  let _map="mapid"+this.id

       this.map= L.map("map").setView([33.49771311230842, 109.45744048529967],8);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        
          }).addTo(self.map)
          
          let udx_data={
            'columns':self.data.columns,
            'rows':self.data.rows
          }

          self.addMarkers(udx_data)
      // setTimeout(()=>{
       

      // },500)
       




    },
    watch:{
      Update:function(){
        let index = this.$store.state.currentElementIndex;

        let udx_data=this.$store.state.chartData.elements[index].data.datacon.data;

        this.addMarkers(udx_data)
      },
      data:function(){
        let self=this
        let udx_data={
          'columns':self.data.columns,
          'rows':self.data.rows
        }

        self.addMarkers(udx_data)
      }
      

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
        if(station_info.length===0)return
        if(station_info[0][station_info[0].length-1]===undefined) return
        
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
           
              marker.bindPopup('<div id="main_chart_'+i+'" style="width:  580px;height:280px;"></div>');
             
            
            

           let option = {
                          title: {
                              text: station_info[0][i].name.slice(6)+'\n'+start_year+'-'+end_year+'年流量月均值'
                          },
                          legend: {
                              data:['观测值','模拟值']
                          }, 
                          xAxis: {
                            type: 'category',
                              data: []
                          },
                          yAxis: {},
                          series: [{
                              name: '观测值',
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
              //位置加载后，显示第一个位置的图表
              if(i===0){
                  marker.openPopup();
                  document.getElementsByClassName('leaflet-popup-content')[0].parentElement.style.width="170%"
                  let echart_dom=document.getElementsByClassName('leaflet-popup-content')[0].children
                  document.getElementsByClassName('leaflet-popup-close-button')[0].style.left="550px"

                  let myChart = echarts.init(echart_dom[0]);
                  myChart.setOption(option);
            } 
          

        }
      },
      click_listener(){
        let self=this
        //这里这是定时器，是因为点击后popup的dom出现后，才能获取节点，然后插入挂载echart的div
        setTimeout(()=>{

          let child=document.getElementsByClassName('leaflet-pane leaflet-popup-pane')[0].children.length

                  if(child>0){
                     //leaflet-popup-tip-container
                     document.getElementsByClassName('leaflet-popup-content')[0].parentElement.style.width="170%"
                     document.getElementsByClassName('leaflet-popup-close-button')[0].style.left="550px"
                      
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
.leaflet-popup-content-wrapper{
  height: 170%;
}
</style>>