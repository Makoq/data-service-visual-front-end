

<template>
  <div class="panel">
    <!-- 侧边栏标题 -->
    <div class="title" v-if="panelKey === 'layers'">
      <span>Layer ({{chartData.elements.length}})</span>
    </div>

    <div class="title" v-else-if="panelKey !== ''">
      <span>{{componentList[panelKey].name}} ({{componentList[panelKey].children.length}})</span>
    </div>

    <!-- 侧边栏显示内容 -->
    <div class="layer-list" v-if="panelKey === 'layers'">
      <draggable
        v-model="chartData.elements"
        @start="handleLayerListDragStart"
        @end="handleLayerListDragEnd"
        ghost-class="ghost"
      >
        <!-- 图层 -->
        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
          <div
            class="list-item"
            v-for="(item, index) in chartData.elements"
            :key="item.name"
            @click="$store.dispatch('setActiveComponentByIndex',index)"
            :class="{active: index === currentElementIndex}"
          >
            <div class="name">{{item.name}}</div>
            <i class="el-icon-delete icon" @click="handleDeleteComponent(index)"></i>
          </div>
        </transition-group>
      </draggable>
    </div>
    <!-- 其他工具 -->
    <div class="component-list" v-else-if="panelKey !== ''">
      <div
        class="list-item"
        :key="item.id"
        v-for="item in componentList[panelKey].children"
        @click="handleAddComponent(item)"
      >
        <div class="img-wrapper">
          <img :src="item.img" />
        </div>
        <div class="name">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
/* eslint-disable */
import { mapState } from "vuex";

export default {
  // 控制当前显示的 panel
  props: ["panelKey"],
  components: {
    draggable // 简写，正常的应该是   draggable: draggable
  },
  data() {
    return {
      drag: true,
      componentList: {
        map:{
          name: "Map",
          children: [
           {
              id: "map",
              name: "中国地图",
              img: require("@/assets/img/charts/map-china.png")
            },
            {
              id: "heatmap",
              name: "HeatMap",
              img: require("@/assets/img/charts/heatmap.png")
            },
            {
              id: "bmap",
              name: "百度热力地图",
              img: require("@/assets/img/charts/bmap.png")
            },
            {
              id: "3js",
              name: "3d",
              img: require("@/assets/img/charts/3js.jpg")
            },
             {
              id: "mapbox",
              name: "mapbox",
              img: require("@/assets/img/charts/mapbox.png")
            },
            {
              id: "leaflat",
              name: "leaflat",
              img: require("@/assets/img/charts/leaflat.png")
            },

            ]
        },
        mycanvas:{
          name: "Canvas",
          children: [
            {
              id: "mycanvas",
              name: "Canvas",
              img: require("@/assets/img/charts/canvas.png")
            },
            ]
        },
        pie:{
          name:"Pie",
          children:[
            {
              id: "pie",
              name: "饼图",
              img: require("@/assets/img/charts/pie.png")
            },
            {
              id: "ring",
              name: "环状图",
              img: require("@/assets/img/charts/ring.png")
            },
          ]
        },
        scatter:{
          name:"Scatter",
          children:[
             {
              id: "scatter1",
              name: "散点图",
              img: require("@/assets/img/charts/scatter.png")
            },
            {
              id: "scatter2",
              name: "散点图",
              img: require("@/assets/img/charts/scatter2.png")
            },
          ]
        },
        radar:{
          name:"radar",
          children:[
            // {
            //   id: "tree",
            //   name: "树图",
            //   img: require("@/assets/img/charts/tree.png")
            // },
             {
              id: "radar",
              name: "雷达图",
              img: require("@/assets/img/charts/radar.png")
            },
            {
              id: "funnel",
              name: "漏斗图",
              img: require("@/assets/img/charts/funnel.png")
            },
          ]
        },
        chart: {
          name: "Chart",
          children: [
            {
              id: "line",
              name: "折线图",
              img: require("@/assets/img/charts/line.png")
            },
            {
              id: "histogram",
              name: "柱状图",
              img: require("@/assets/img/charts/histogram.png")
            },
            {
              id: "bar",
              name: "条形图",
              img: require("@/assets/img/charts/bar.png")
            },
            
            
            {
              id: "candle",
              name: "K线图",
              img: require("@/assets/img/charts/candle.png")
            },
            
            
            // {
            //   id: "sankey",
            //   name: "桑基图",
            //   img: require("@/assets/img/charts/sankey.png")
            // },
           
            // {
            //   id: "candle",
            //   name: "K线图",
            //   img: require("@/assets/img/charts/candle.png")
            // },
            // {
            //   id: "gauge",
            //   name: "仪表盘",
            //   img: require("@/assets/img/charts/gauge.png")
            // },
            // {
            //   id: "liquidfill",
            //   name: "水球图",
            //   img: require("@/assets/img/charts/liquidfill.png")
            // }
            // {
            //   id: "wordcloud",
            //   name: "词云图",
            //   img: require("@/assets/img/charts/wordcloud.png")
            // }
          ]
        },
        text: {
          name: "Text",
          children: [
            {
              id: "text",
              name: "Text",
              img: require("@/assets/img/charts/text.png")
            }
          ]
        },
        picture: {
          name: "Image",
          children: [
            {
              id: "image",
              name: "Image",
              img: require("@/assets/img/charts/image.png")
            }
          ]
        },
        tools: {
          name: "Component",
          children: [
            {
              id: "border",
              name: "Border",
              img: require("@/assets/img/charts/border.png")
            }
          ]
        }
      },
      layerList: []
    };
  },
  computed: {
    ...mapState(["chartData", "currentElementIndex"])
    // chartData() {
    //   // 获取父组件 Toolbar.Vue 中的数据
    //   return this.$parent.chartData;
    // }
  },
  methods: {
    // 拖拽开始，激活拖拽的组件
    handleLayerListDragStart(e) {
      this.drag = true;
      this.$store.dispatch("setActiveComponentByIndex", e.oldIndex);

      // this.$parent.$parent.setActiveComponentByIndex(e.oldIndex);
    },
    // 拖拽结束，拖拽之后，旧组件在新位置，激活新的组件
    handleLayerListDragEnd(e) {
      this.drag = false;
      //this.$parent.$parent.setActiveComponentByIndex(e.newIndex);

      this.$store.dispatch("setActiveComponentByIndex", e.newIndex);

    },

    handleAddComponent(item) {
      console.log(item)
      let initData = {};
      if(item.id == "map"){
         initData = {
          type: "map",
          settings: {
            type: item.id
          },
          datacon: {
            type: "raw",
            connectId: "",
            data: {
              columns: ["测试数据x", "测试数据y"],
              rows: [
                { 测试数据x: "1", 测试数据y: 1 },
              { 测试数据x: "2", 测试数据y: 15 },

             
              ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
             
           columns: ["测试数据x", "测试数据y"],
              rows: [
                { 测试数据x: "1", 测试数据y: 1 },
              { 测试数据x: "2", 测试数据y: 15 },        
            ]
          }
        };

      }else if(item.id == "heatmap"){
        console.log("heat")
         initData = {
          type: "map",
          settings: {
            type: item.id
          },
          datacon: {
            type: "raw",
            connectId: "",
            data: {
              columns: ['lat', 'lng', '人数'],
               rows: [
            { 'lat': 115.892151, 'lng': 28.676493, '人数': 1000 },
            { 'lat': 117.000923, 'lng': 36.675807, '人数': 400 },
            { 'lat': 113.665412, 'lng': 34.757975, '人数': 800 },
            { 'lat': 114.298572, 'lng': 30.584355, '人数': 200 },
            { 'lat': 112.982279, 'lng': 28.19409, '人数': 100 },
            { 'lat': 113.280637, 'lng': 23.125178, '人数': 300 },
            { 'lat': 110.33119, 'lng': 20.031971, '人数': 800 },
            { 'lat': 104.065735, 'lng': 30.659462, '人数': 700 },
            { 'lat': 108.948024, 'lng': 34.263161, '人数': 300 },
            { 'lat': 103.823557, 'lng': 36.058039, '人数': 500 }
          ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
             
            columns: ['lat', 'lng', '人数'],
               rows: [
            { 'lat': 115.892151, 'lng': 28.676493, '人数': 1000 },
            { 'lat': 117.000923, 'lng': 36.675807, '人数': 400 },
            { 'lat': 113.665412, 'lng': 34.757975, '人数': 800 },
            { 'lat': 114.298572, 'lng': 30.584355, '人数': 200 },
            { 'lat': 112.982279, 'lng': 28.19409, '人数': 100 },
            { 'lat': 113.280637, 'lng': 23.125178, '人数': 300 },
            { 'lat': 110.33119, 'lng': 20.031971, '人数': 800 },
            { 'lat': 104.065735, 'lng': 30.659462, '人数': 700 },
            { 'lat': 108.948024, 'lng': 34.263161, '人数': 300 },
            { 'lat': 103.823557, 'lng': 36.058039, '人数': 500 }
          ]
          }
        };

      }else if(item.id == "leaflat"){
        console.log("leaflat")
         initData = {
          type: "map",
          settings: {
            type: item.id
          },
          datacon: {
            type: "raw",
            connectId: "",
            data: {
              columns: [ ],
               rows: [
             
          ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
             
            columns: [ ],
               rows: [
             
          ]
          }
        };

      }else if(item.id == "mapbox"){
        console.log("heat")
         initData = {
          type: "map",
          settings: {
            type: item.id
          },
          datacon: {
            type: "raw",
            connectId: "",
            data: {
              columns: ['lat', 'lng', '人数'],
               rows: [
            { 'lat': 115.892151, 'lng': 28.676493, '人数': 1000 },
            { 'lat': 117.000923, 'lng': 36.675807, '人数': 400 },
            { 'lat': 113.665412, 'lng': 34.757975, '人数': 800 },
            { 'lat': 114.298572, 'lng': 30.584355, '人数': 200 },
            { 'lat': 112.982279, 'lng': 28.19409, '人数': 100 },
            { 'lat': 113.280637, 'lng': 23.125178, '人数': 300 },
            { 'lat': 110.33119, 'lng': 20.031971, '人数': 800 },
            { 'lat': 104.065735, 'lng': 30.659462, '人数': 700 },
            { 'lat': 108.948024, 'lng': 34.263161, '人数': 300 },
            { 'lat': 103.823557, 'lng': 36.058039, '人数': 500 }
          ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
             
            columns: ['lat', 'lng', '人数'],
               rows: [
            { 'lat': 115.892151, 'lng': 28.676493, '人数': 1000 },
            { 'lat': 117.000923, 'lng': 36.675807, '人数': 400 },
            { 'lat': 113.665412, 'lng': 34.757975, '人数': 800 },
            { 'lat': 114.298572, 'lng': 30.584355, '人数': 200 },
            { 'lat': 112.982279, 'lng': 28.19409, '人数': 100 },
            { 'lat': 113.280637, 'lng': 23.125178, '人数': 300 },
            { 'lat': 110.33119, 'lng': 20.031971, '人数': 800 },
            { 'lat': 104.065735, 'lng': 30.659462, '人数': 700 },
            { 'lat': 108.948024, 'lng': 34.263161, '人数': 300 },
            { 'lat': 103.823557, 'lng': 36.058039, '人数': 500 }
          ]
          }
        };

      }else if(item.id == "bmap"){
        console.log("bmap")
         initData = {
          type: "map",
          settings: {
            type: item.id
          },
          datacon: {
            type: "raw",
            connectId: "",
            data: {
             columns: ['lat', 'lng'],
          rows: [
            { 'lat': 120.14322240845, 'lng': 30.236064370321 },
            { 'lat': 120.14301682797, 'lng': 30.236035316745 },
            { 'lat': 120.14138577045, 'lng': 30.236113748704 },
            { 'lat': 120.1400398833, 'lng': 30.235973050702 },
            { 'lat': 120.13893453465, 'lng': 30.23517220446 },
            { 'lat': 120.1382899739, 'lng': 30.234062922977 },
            { 'lat': 120.13265960629, 'lng': 30.231641351722 },
            { 'lat': 120.13170681763, 'lng': 30.229925745619 },
            { 'lat': 120.13119614803, 'lng': 30.228996846637 },
            { 'lat': 120.13023980134, 'lng': 30.228226570416 }
          ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
             
            columns: ['lat', 'lng'],
          rows: [
            { 'lat': 120.14322240845, 'lng': 30.236064370321 },
            { 'lat': 120.14301682797, 'lng': 30.236035316745 },
            { 'lat': 120.14138577045, 'lng': 30.236113748704 },
            { 'lat': 120.1400398833, 'lng': 30.235973050702 },
            { 'lat': 120.13893453465, 'lng': 30.23517220446 },
            { 'lat': 120.1382899739, 'lng': 30.234062922977 },
            { 'lat': 120.13265960629, 'lng': 30.231641351722 },
            { 'lat': 120.13170681763, 'lng': 30.229925745619 },
            { 'lat': 120.13119614803, 'lng': 30.228996846637 },
            { 'lat': 120.13023980134, 'lng': 30.228226570416 }
          ]
          }
        };

      }else if(item.id == "3js"){
        console.log("3js")
         initData = {
          type: "map",
          settings: {
            type: item.id
          },
          datacon: {
            type: "raw",
            connectId: "",
            data: {
             columns: ['lat', 'lng'],
          rows: [
            { 'lat': 120.14322240845, 'lng': 30.236064370321 },
            { 'lat': 120.14301682797, 'lng': 30.236035316745 },
            { 'lat': 120.14138577045, 'lng': 30.236113748704 },
            { 'lat': 120.1400398833, 'lng': 30.235973050702 },
            { 'lat': 120.13893453465, 'lng': 30.23517220446 },
            { 'lat': 120.1382899739, 'lng': 30.234062922977 },
            { 'lat': 120.13265960629, 'lng': 30.231641351722 },
            { 'lat': 120.13170681763, 'lng': 30.229925745619 },
            { 'lat': 120.13119614803, 'lng': 30.228996846637 },
            { 'lat': 120.13023980134, 'lng': 30.228226570416 }
          ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
             
            columns: ['lat', 'lng'],
          rows: [
            { 'lat': 120.14322240845, 'lng': 30.236064370321 },
            { 'lat': 120.14301682797, 'lng': 30.236035316745 },
            { 'lat': 120.14138577045, 'lng': 30.236113748704 },
            { 'lat': 120.1400398833, 'lng': 30.235973050702 },
            { 'lat': 120.13893453465, 'lng': 30.23517220446 },
            { 'lat': 120.1382899739, 'lng': 30.234062922977 },
            { 'lat': 120.13265960629, 'lng': 30.231641351722 },
            { 'lat': 120.13170681763, 'lng': 30.229925745619 },
            { 'lat': 120.13119614803, 'lng': 30.228996846637 },
            { 'lat': 120.13023980134, 'lng': 30.228226570416 }
          ]
          }
        };

      }else if(item.id == "mapbox"){
        console.log("mapbox")
         initData = {
          type: "map",
          settings: {
            type: item.id
          },
          datacon: {
            type: "raw",
            connectId: "",
            data: {
             columns:  [],
          rows: [
             
          ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
             
            columns: [],
          rows: [
            
          ]
          }
        };

      }
      else if(item.id == "mycanvas"){
         initData = {
          type: "mycanvas",
          settings: {
            type: item.id
          },
          datacon: {
            type: "raw",
            connectId: "",
            data: {
              columns: ["x", "y"],
              rows: [
                { x: "1", y: 1 },
              { x: "2", y: 15 },

             
              ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
             
           columns: ["x", "y"],
              rows: [
                { x: "1", y: 1 },
              { x: "2", y: 15 },

             
              ]
          }
        };

      }else if (item.id == "text") {
        initData = {
          type: "text",
          datacon: {
            text: "请输入文字",
            color: "#000000",
            fontSize: 48,
            fontFamily: "ZCOOL QingKe HuangYou",
            bold: false,
            italic: false,
            stroke: false,
            strokeColor: "#ffffff",
            strokeSize: 2,
            shadow: false,
            shadowColor: "#ff0000",
            shadowBlur: 10
          }
        };
        
      } else if (item.id == "image") {
        initData = {
          type: "image",
          datacon: {
            img: "",
            imgSize: "cover",
            opacity: 1
          }
        };
      } else if (item.id == "border") {
        initData = {
          type: "border",
          datacon: {
            borderId: 1,
            opacity: 1
          }
        };
      } else {
        initData = {
          type: "chart",
          settings: {
            type: item.id
          },
          datacon: {
            type: "raw",
            connectId: "",
            data: {
              columns: ["测试数据x", "测试数据y"],
              rows: [
                { 测试数据x: "1", 测试数据y: 1 },
              { 测试数据x: "2", 测试数据y: 15 },

             
              ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
             
           columns: ["测试数据x", "测试数据y"],
              rows: [
                { 测试数据x: "1", 测试数据y: 1 },
              { 测试数据x: "2", 测试数据y: 15 },        
            ]
          }
        };

         







      }
      const component = {
        name: "New Layer" + (this.$store.state.chartData.elements.length + 2),
        x: 10,
        y: 10,
        w: 900,
        h: 700,
        bgcolor: "rgba(0, 0, 0, 0)",
        active: false,
        data: initData
      };
      // $parent 是 Toolbar.vue， 控制其是否显示
      // $parent.$parent 是 Index.vue
      //this.$parent.$parent.addComponent(component);
      this.$store.dispatch("addComponent", component);
    },
    handleDeleteComponent(index) {
      // this.$parent.$parent.deleteComponent(index);
      this.$store.dispatch("deleteComponent", index);
    }
  }
};
</script>

<style lang="scss" scoped>
.panel {
  height: 100%;
  width: 160px;
  display: flex;
  flex-direction: column;
  background: #ffffffe9;
  box-shadow: 4px 0 4px #00000005;
}
.title {
  color: #999999;
  padding: 10px 16px 16px;
}
.component-list {
  flex: 1;
  padding: 0 10px 0 16px;
  overflow: scroll;

  .list-item {
    display: inline-block;
    width: 100px;
    background: rgba(64, 160, 255, 0.06);
    border: 1px solid rgba(64, 160, 255, 0.1);
    margin-right: 10px;
    margin-bottom: 12px;
    opacity: 0.6;
    transition: opacity, background 0.3s ease;
    text-align: center;
    padding: 5px 0;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
      background: rgba(64, 160, 255, 0.1);
      border: 1px solid #409eff;
      .name {
        color: #666666;
      }
    }

    .img-wrapper {
      display: flex;
      width: 100%;
      height: 80px;
      align-items: center;
      justify-content: center;
      img {
        height: 54px;
      }
    }

    .name {
      height: 20px;
      line-height: 20px;
      font-size: 13px;
      color: #777777;
    }
  }
}

.flip-list-move {
  transition: transform 0.5s;
}

.ghost {
  opacity: 0.3;
  background: #c8ebfb;
}

.layer-list {
  flex: 1;
  padding: 0;
  overflow: scroll;

  .list-item {
    display: flex;
    align-items: center;
    height: 48px;
    width: 100%;
    transition: background 0.3s ease;
    border-top: 1px solid rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    border-right: 6px solid transparent;
    margin-bottom: -1px;
    padding: 0 16px;
    box-sizing: border-box;

    &.active {
      background: rgba(64, 160, 255, 0.06);
      border-right: 6px solid #409eff7d;
    }

    &:hover {
      opacity: 1;
      background: rgba(64, 160, 255, 0.06);

      .icon {
        opacity: 1;
      }
    }

    .name {
      flex: 1;
      color: #777777;
    }

    .icon {
      float: right;
      color: #999999;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s ease;

      &:hover {
        color: #409eff;
        cursor: pointer;
      }
    }
  }
}
</style>
