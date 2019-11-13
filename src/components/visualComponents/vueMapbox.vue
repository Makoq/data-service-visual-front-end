<template  >
  <div
   :width="width"
   :height="height"
   id="map" 
   ref="mapcontainer"
   
     >         
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
         "type": "FeatureCollection",
         "features": []
      },
       map:null,
       chartDataArray:{},
       chartData:{},
       points_layer:null
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
            
            httpUtils.get(this,'http://localhost:8897/testChart?file=testObservation&type=chart', (data) => {
               
                var dataset = new UdxDataset();
                dataset.createDataset();
                dataset.loadFromXmlStream(data);
            //取结点操作
                let col = [],
                  row = [];

                    var siteCount = dataset.getChildNodeCount();
                    for (let i = 1; i < siteCount; i++) {
                      var site = [];
                      var siteNode = dataset.getChildNode(i);
                      var yearCount = siteNode.getChildNodeCount();
                      for (var j = 0; j < yearCount; j++) {
                        var yearNode = siteNode.getChildNode(j);
                        var monthCount = yearNode.getChildNodeCount();
                        for (var k = 0; k < monthCount; k++) {
                          var monthNode = yearNode.getChildNode(k);
                          //console.log(monthNode.getKernel().getArrayCount());
                          var days = monthNode.getKernel().getArrayCount();
                          var sum = 0;
                          for (var m = 0; m < days; m++) {
                            sum += monthNode.getKernel().getTypedValueByIndex(m);
                          }
                          sum /= days;

                          site.push(sum);
                        }
                      }
                      col.push(site);//将月均值入到col
                    }
                    //将第一个位置元素，入栈
                    let location_count = dataset
                      .getChildNodeCount()

                    
                    let lat = dataset.getChildNode(0).getChildNode(0);
                    let lag = dataset.getChildNode(0).getChildNode(1);

                    for (var i = 0; i < location_count-1; i++) {
                      let obj = {};
                      obj['name']= dataset.getChildNode(i).getName();
                      obj['lat'] = lat.getKernel().getTypedValueByIndex(i);
                      obj['lag'] = lag.getKernel().getTypedValueByIndex(i);

                      row.push(obj);//将站点信息，名字，经纬度，入到row
                    }


                     var month_ave=col,station_info=row
              var self=this
              
              for(let i=0;i<station_info.length;i++){

                  let geo_obj={
                            "type": "Feature",
                            "properties": {
                            "description": "<ve-line :data='chartData'></ve-line>",
                            "icon": "rocket",
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

               
        // console.log(JSON.stringify(geo))
            console.log("before",self.points_layer)
         
       try {
         setTimeout(()=>{
              self.map.addLayer({
              "id": "points",
              "type": "symbol",
              "source": {
              "type": "geojson",
              "data": self.myGeoJSON,
              },
              "layout": {
              "icon-image": "{icon}-15",
              "icon-allow-overlap": true
              }


            })

            self.points_layer=self.map.getLayer('points')
            console.log("ok",self.points_layer)
         },500)
         
       } catch (error) {
         console.log(error)
       }
        
         
        
         
        
              
 
        
             
              //  _self.map.getCanvas().style.cursor = 'pointer';
              // _self.map.on('click',function(e){
              //     console.log("e",e)

              //     console.log('layer',_self.map.getLayer('points'))
              //     console.log('source',_self.map.getSource('points'))

              // })





              












            });

            
            
            
             

        }, 
        generateGeoJSON(data){
              var month_ave=data.columns,station_info=data.rows
              var self=this
              
              for(let i=0;i<station_info.length;i++){

                  let geo_obj={
                            "type": "Feature",
                            "properties": {
                            "description": "<ve-line :data='chartData'></ve-line>",
                            "icon": "rocket",
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
             


        },
        operate(){
        console.log(this.map.getLayer('points'))

          console.log("Sd")
            this.map.on('click', 'points', function (e) {
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

            this.map.on('mouseenter', 'points', function () {
              this.map.getCanvas().style.cursor = 'pointer';
            });

            // Change it back to a pointer when it leaves.
            this.map.on('mouseleave', 'points', function () {
              this.map.getCanvas().style.cursor = '';
            }); 


        },
         
     
    },
    watch:{
      points_layer(val,oldVal){
        let self=this
        console.log("points val",val)
        if(val!=undefined){
              let a= self.map.on('mouseenter','points',function(e){
                self.map.getCanvas().style.cursor = '';
                  console.log("click point")
                 var features =  self.map.querySourceFeatures('points')
                 

                  let elnglat=[e.lngLat.lng.toFixed(1),e.lngLat.lat.toFixed(1)]


                  features.forEach((v)=>{
                    let pointlnglat=[v.geometry.coordinates[0].toFixed(1),v.geometry.coordinates[1].toFixed(1)]

                    if(pointlnglat[0] === elnglat[0]&&pointlnglat[1] === elnglat[1]){
                      let desp=v.properties.description;

                      while (Math.abs(e.lngLat.lng - pointlnglat[0]) > 180) {
                        pointlnglat[0] += e.lngLat.lng > pointlnglat[0] ? 360 : -360;
                        }
                         var popup = new mapboxgl.Popup({
                          closeButton: false,
                          closeOnClick: false
                          });
                        // Populate the popup and set its coordinates
                        // based on the feature found.
                        popup.setLngLat(pointlnglat)
                        .setHTML(desp)
                        .addTo(self.map);          

                    }
                  })

              });
              console.log("listen",a)

        }
      },
        Update:function(){
        // let index = this.$store.state.currentElementIndex;

        // let udx_data=this.$store.state.chartData.elements[index].data.datacon.data
        // this.generateGeoJSON(udx_data)
        
        // let geo=this.myGeoJSON
        // // console.log(JSON.stringify(geo))
        // console.log("sdsd")
       
        // this.map.addLayer({
        //   "id": "points",
        //   "type": "symbol",
        //   "source": {
        //   "type": "geojson",
        //   "data": geo,
        //   },
        //   "layout": {
        //   "icon-image": "{icon}-15",
        //   "icon-allow-overlap": true
        //   }


        // })
        // let _self=this
        // console.log(  "sas", _self.map.querySourceFeatures('points'))
       
             
              // _self.map.on('click','points',function(e){

              //    var features = _self.map.querySourceFeatures('points')
                 

              //     let elnglat=[e.lngLat.lng.toFixed(1),e.lngLat.lat.toFixed(1)]


              //     features.forEach((v)=>{
              //       let pointlnglat=[v.geometry.coordinates[0].toFixed(1),v.geometry.coordinates[1].toFixed(1)]

              //       if(pointlnglat[0] === elnglat[0]&&pointlnglat[1] === elnglat[1]){
              //         let desp=v.properties.description;

              //         while (Math.abs(e.lngLat.lng - pointlnglat[0]) > 180) {
              //           pointlnglat[0] += e.lngLat.lng > pointlnglat[0] ? 360 : -360;
              //           }
                        
              //           // Populate the popup and set its coordinates
              //           // based on the feature found.
              //           popup.setLngLat(pointlnglat)
              //           .setHTML(desp)
              //           .addTo(_self.map);
                        
                         

              //       }
              //     })

              // })
             
              //  _self.map.getCanvas().style.cursor = 'pointer';
              // _self.map.on('click',function(e){
              //     console.log("e",e)

              //     console.log('layer',_self.map.getLayer('points'))
              //     console.log('source',_self.map.getSource('points'))

              // })


             
        // this.operate()


        
        // this.map.on('mouseover','points',function(e){
        //   console.log(e)
        // })
         

      

       

        },
    },
    computed:{
      //  Update(){
      //     let index = this.$store.state.currentElementIndex;
      //     if(index<0) return
      //     return this.$store.state.chartData.elements[index].data;
      //   },


    },
    beforeDestroy(){
      this.points_layer=null
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
.mapboxgl-popup {
max-width: 400px;
font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}
</style>

