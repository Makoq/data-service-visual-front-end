<template  >
 
  <div
   :width="width"
   :height="height"
   :id="'map'+data.mapid+1" 
   ref="mapcontainer"
   
     >         
        </div>
   
</template>
<script>
import httpUtils from "../../utils/httpUtils";
import mapboxgl from 'mapbox-gl'
import proj4 from 'proj4'
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
             let self=this
            mapboxgl.accessToken = 'pk.eyJ1IjoibGFuciIsImEiOiJjanl1N3M1N2YwOGY2M21wOXYwYTllaDRlIn0.XdQ1hnXfGordCsUueh7VLA'
            this.map = new mapboxgl.Map({
                container: 'map'+self.data.mapid+1 ,
                style: 'mapbox://styles/mapbox/streets-v9',
                center: [0,0], 
                zoom: 3,
            })
            let dom=document.getElementById('map'+this.data.mapid+1)
            dom.className='map'


            this.map.addControl(new mapboxgl.NavigationControl()); /* new NavigationControl()创建NavigationControl，NavigationCongtrol包含一个缩放按钮和指南针，addControl(control,position)：添加控件，position表示位置，可以是top-left' ,  'top-right' ,  'bottom-left' , and  'bottom-right'，默认top-right */
            this.map.addControl(new mapboxgl.ScaleControl());

           
            this.addLayer()
          
        }, 
        addLayer(){
            let self=this
            let url=this.data.columns
            
            httpUtils.get(this,url, (data) => {
               
            var dataset = new UdxDataset();
            dataset.createDataset();
            dataset.loadFromXmlStream(data);

            let nodeCount = dataset.getChildNodeCount();
            let node=dataset.getChildNode(1).getChildNode(0).getChildNode(3).getChildNode(0)
            let coords=(node.getKernel().getTypedValue()).split(",");

            let co=[]
            var firstProjection = 'PROJCS["NAD83 / Massachusetts Mainland",GEOGCS["NAD83",DATUM["North_American_Datum_1983",SPHEROID["GRS 1980",6378137,298.257222101,AUTHORITY["EPSG","7019"]],AUTHORITY["EPSG","6269"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4269"]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Lambert_Conformal_Conic_2SP"],PARAMETER["standard_parallel_1",42.68333333333333],PARAMETER["standard_parallel_2",41.71666666666667],PARAMETER["latitude_of_origin",41],PARAMETER["central_meridian",-71.5],PARAMETER["false_easting",200000],PARAMETER["false_northing",750000],AUTHORITY["EPSG","26986"],AXIS["X",EAST],AXIS["Y",NORTH]]';

            coords.forEach(v=>{
                let c=v.split(" ")
                c[0]=Number(c[0])
                c[1]=Number(c[1])
                        
                co.push(proj4(firstProjection).inverse(c))

            })
             
            this.map.flyTo({center: co[0], zoom: 6});
            let geoLayer={
                    'id': 'maine',
                    'type': 'fill',
                    'source': {
                    'type': 'geojson',
                    'data': {
                    'type': 'Feature',
                    'geometry': {
                    'type': 'Polygon',
                    'coordinates':[co] 
                  }
                }
              },
                  'layout': {},
                  'paint': {
                  'fill-color': '#088',
                  'fill-opacity': 0.7
                  }
            }
            let self=this
            setTimeout(_=>{
            self.map.addLayer(geoLayer)

            },500)
            
              
            });

        }
 
    },
    watch:{
      Update:function(){
        this.addLayer()
     },
    },
    computed:{
      Update(){
          let index = this.$store.state.currentElementIndex;
      
          return this.$store.state.chartData.elements[index].data;
        },

    },
    beforeDestroy(){
      this.points_layer=null
    }
  }
</script>
<style  scoped>
body { margin:0; padding:0; }
.mapboxgl-canvas{
      position: inherit !important;
    width: 100% !important;
    height: 100% !important;
}
.map { 
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

