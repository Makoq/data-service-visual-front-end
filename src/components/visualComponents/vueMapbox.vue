<template  >
  <div
   :width="width"
   :height="height"
   id="map" 
   ref="mapcontainer"  >         
        </div>
</template>
<script>
import httpUtils from "../../utils/httpUtils";
import mapboxgl from 'mapbox-gl'

 export default {
    props:["width","height","data"],
    data () {
     return {
       myGeoJSON:{
         "type": "Feature",
         "features": []
      },
       map:null,
       chartDataArray:{},
       chartData:{}
     } 
    },
    mounted(){
        this.init()
    },
    methods:{
          init () {
                mapboxgl.accessToken = 'pk.eyJ1IjoibGFuciIsImEiOiJjanl1N3M1N2YwOGY2M21wOXYwYTllaDRlIn0.XdQ1hnXfGordCsUueh7VLA'
                this.map = new mapboxgl.Map({
                    container: 'map',
                    style: 'mapbox://styles/mapbox/streets-v9',
                    center: [96.95, 36.78], 
                    zoom: 3,
                })

                this.map.addControl(new mapboxgl.NavigationControl()); /* new NavigationControl()创建NavigationControl，NavigationCongtrol包含一个缩放按钮和指南针，addControl(control,position)：添加控件，position表示位置，可以是top-left' ,  'top-right' ,  'bottom-left' , and  'bottom-right'，默认top-right */
                this.map.addControl(new mapboxgl.ScaleControl());
                //   console.log(map)
            }, 
          generateGeoJSON(data){
              var month_ave=data.columns,station_info=data.rows
              var self=this
              
              for(let i=0;i<station_info.length;i++){

                  let geo_obj={
                            "type": "Point",
                            "properties": {
                            "description": "<ve-line :data='chartData'></ve-line>",
                            "icon": "theatre",
                            "point_name":''
                            },
                            "geometry": {
                            "type": "Point",
                            "coordinates": []
                            }
                      }
              //凑geoJSON数据
              geo_obj.geometry.coordinates.push(station_info[i].lat);
              geo_obj.geometry.coordinates.push(station_info[i].lag);
              geo_obj.properties.point_name=station_info[i].name;

              self.myGeoJSON.features.push(geo_obj)
              //凑数据
              let the_rows=[]
              month_ave.forEach((el,i) => {
                let ob={}
                ob["月份"]=i+1
                ob["流量"]=el
                the_rows.push(ob)
              });
              self.chartDataArray[station_info[i].name]={
                columns:["年份","流量"],
                rows:the_rows
              }

              }
              console.log(self.chartDataArray)
              console.log(self.myGeoJSON)


          }
    },
    watch:{
        Update:function(){
        let index = this.$store.state.currentElementIndex;

        let udx_data=this.$store.state.chartData.elements[index].data.datacon.data
        this.generateGeoJSON(udx_data)
        
        let geo=this.myGeoJSON
        this.map.addLayer({
          "id": "station",
          "type": "symbol",
          "source": {
          "type": "geojson",
          "data": geo
          }
        })
        this.map.on('click', 'station', function (e) {
          var coordinates = e.features[0].geometry.coordinates.slice();
          
          var name=e.features[0].properties.point_name
          this.chartData=this.chartDataArray[name]//通过站名切换折线图的输入值

          var description = e.features[0].properties.description;
          
          // Ensure that if the map is zoomed out such that multiple
          // copies of the feature are visible, the popup appears
          // over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }
          
          new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map);
        });








        },
    },
    computed:{
       Update(){
          let index = this.$store.state.currentElementIndex;
          if(index<0) return
          return this.$store.state.chartData.elements[index].data;
        },
    }
  }
</script>
<style  >
body { margin:0; padding:0; }
.mapboxgl-canvas{
      position: inherit !important;
    width: 100% !important;
    height: 100% !important;
}
#map { 
  position:relative; 
  top:0; 
  bottom:0; 
  width:100%;height:100% 
}
.mapboxgl-canvas-container{
  position:inherit;
  height: 100%;
  width: 100%
}
</style>

