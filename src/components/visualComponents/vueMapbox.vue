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
    },
    watch:{
       
    }
  }
</script>
<style  >
body { margin:0; padding:0; }
#map { position:relative; top:0; bottom:0; width:100%; }
</style>

