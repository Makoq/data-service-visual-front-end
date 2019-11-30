<template  >
  <div >
     
    <canvas
      id="myCanvas"
      :width="width"
      :height="height"
      style="border:1px solid #c3c3c3;display:none"
    >您的浏览器不支持 HTML5 canvas 标签。</canvas>

    <img id="img" style="z-index:-1" src=""> 
    
      
     <div  style="float: left;margin-top: -60px;">
      <canvas id="scale" width="240" height="20" style="margin-bottom: -50px;margin-left: 100px;display:none"> </canvas>
    <img id="scale_img" style="display: display: table-row;width:100%"  src=""> 

     <h3 style="color:red;display: table-row">{{min===-1?'':min}}--{{max===-1?'':max}}</h3> 
     </div>
  </div>
</template>
<script>
import httpUtils from "../../utils/httpUtils";
import { globalBus } from '../../utils/globalBus';
import ramp from "../../utils/canvas/ramp";

export default {
  props:["width","height","canvasdata"],
  data() {
    return {
      _self:this,
      text:'',
      max:-1,
      min:-1
    };
  },
  watch:{
    colorBar:function(){
    
       this.updateData()
    },
     Update:function(){
       

        this.updateData()
     },
    //监听长宽变化，变化后重绘图像
    height:function(){
       
        // this.jieLiu(this.updateData, 500, 2000)();
    },
    width:function(){
       
        // this.jieLiu(this.updateData, 500, 2000)();
    }
  },
  computed:{
    //监听vuex中数据的变化
        Update(){
          let index = this.$store.state.currentElementIndex;
      
          return this.$store.state.chartData.elements[index].data;
        },
        colorBar(){
          return this.$store.state.colorNo
        }
  },
  mounted() {
     
      this.updateData()
     

            
      
  },
  methods: {

    
    updateData(){
      console.log("method")
        let url=this.canvasdata.columns
       httpUtils.get(this, url, data => {
         if(!data) {}
         else{
             var dataset = new UdxDataset();
        dataset.createDataset();
        dataset.loadFromXmlStream(data);

        //ascrid格式head,body
          let listnode = dataset.getChildNode(1);

          let colorJsonStr = sessionStorage.colorJson;
          // if (colorJsonStr === undefined) {
          //   alert("please choose a color clamp.");
          //   return;
          // }


          let colorBar = new Array();
          let colorJSON = JSON.parse(colorJsonStr);

          for (var i = 0; i <= 255; i++) {
            var rgb = {};
            rgb = colorJSON[i.toString()];
            colorBar.push({ r: rgb.r, g: rgb.g, b: rgb.b });
          }

        var canvas = document.getElementById("myCanvas");
           
          var ctx = canvas.getContext("2d");


          var srcData = new Array();

          var min = 99999,
            max = -99999;

          var rows = listnode.getChildNodeCount();
          // 一开始已经检测过了，保证了每个item(int_array|real_array)的长度是一致的，所以，这里直接取第一个的长度就可以了。
          
          var cols = listnode.getChildNode(0).getKernel().getArrayCount();
           let nodata=null
          for (var i = 0; i < rows; i++) {
            var child = listnode.getChildNode(i);

            for (var j = 0; j < cols; j++) {
              var curValue = child.getKernel().getTypedValueByIndex(j); //parseFloat(oneLineArray[j]);
              if (curValue != nodata) {
                if (curValue < min) {
                  min = curValue;
                }
                if (curValue > max) {
                  max = curValue;
                }
              }
              srcData.push(curValue);
            }
          }
            this.max=max
            this.min=min
         
          // 将高程数据映射到0-255之间
          for (var i = 0; i < srcData.length; i++) {
            if (srcData[i] != nodata)
              srcData[i] = parseInt(((srcData[i] - min) / (max - min)) * 255);
          }
           

                //创建一个图片
          var imgData = ctx.createImageData(cols, rows);
          // ImageData 有一个data属性，是一个一维数组，依次存储这r,g,b,a ，该数组的长度等于 w*h*4
          var flag = 0;
          for (var i = 0; i < imgData.data.length; i += 4) {
              if (srcData[flag] === nodata) {
                  imgData.data[i + 0] = 1;
                  imgData.data[i + 1] = 1;
                  imgData.data[i + 2] = 1;
                  imgData.data[i + 3] = 0;
                  flag++;
              } else {
                  var color = colorBar[srcData[flag]];
                  imgData.data[i + 0] = color.r;
                  imgData.data[i + 1] = color.g;
                  imgData.data[i + 2] = color.b;
                  imgData.data[i + 3] = 255;
                  flag++;
              }
          }
           
          
            // ctx.putImageData(imgData, 550 / 2, 300 / 2);

            var cW = canvas.width;
            var cH = canvas.height;

            // 计算显示的坐标（左上角）
            var x = cW / 2 - cols / 2;
            var y = cH / 2 - rows / 2;


            ctx.clearRect(0, 0, cW, cH);
            ctx.putImageData(imgData, x, y);

            let img_src=canvas.toDataURL();
           
            var img=document.getElementById("img");
            img.setAttribute("src",img_src);

            //图例canvas
            var sc = document.getElementById("scale");
            var scale = sc.getContext("2d");
            let ramp_obj=this.$store.state.colorCount
            let item=this.$store.state.colorNo
             
             for (var i = 0; i <=ramp_obj.colorCount-1; i++) {
            var rgb = {};
            rgb = colorJSON[i.toString()];
            scale.fillStyle = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
            scale.fillRect(x / 2, 0, (x + 1) / 2, 20);
          }

            let scale_img_src=sc.toDataURL();
            var scale_img=document.getElementById("scale_img");
            scale_img.setAttribute("src",scale_img_src);

          

            // img.setAttribute("width",this.width-400)
            // img.setAttribute("height",this.height-300)

         }
       

             




    })
     
  },
  jieLiu(method, delay, duration){
    console.log("jieliu")
         var that = this;
      var timer = this.timer;
      var begin = new Date().getTime();
      let _s=this
      return function() {
        var current = new Date().getTime();
        clearTimeout(timer);
        if (current - begin >= duration) {
        method()
          begin = current;
        } else {
          that.timer = setTimeout(function() {
           method()
          }, delay);
        }
      };

  }
}
};
</script>
<style  >

#img{
     height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
 
}
</style>

