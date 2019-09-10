

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
              id: "pie",
              name: "饼图",
              img: require("@/assets/img/charts/pie.png")
            },
            {
              id: "ring",
              name: "环状图",
              img: require("@/assets/img/charts/ring.png")
            },
            {
              id: "funnel",
              name: "漏斗图",
              img: require("@/assets/img/charts/funnel.png")
            },
            {
              id: "radar",
              name: "雷达图",
              img: require("@/assets/img/charts/radar.png")
            },
            // {
            //   id: "map-world",
            //   name: "世界地图",
            //   img: require("@/assets/img/charts/map-world.png")
            // },
            {
              id: "map",
              name: "中国地图",
              img: require("@/assets/img/charts/map-china.png")
            },
            // {
            //   id: "sankey",
            //   name: "桑基图",
            //   img: require("@/assets/img/charts/sankey.png")
            // },
            // {
            //   id: "scatter",
            //   name: "散点图",
            //   img: require("@/assets/img/charts/scatter.png")
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
            {
              id: "liquidfill",
              name: "水球图",
              img: require("@/assets/img/charts/liquidfill.png")
            }
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
      let initData = {};
      if (item.id == "text") {
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
              columns: ["日期", "访问用户"],
              rows: [
                { 日期: "1月1日", 访问用户: 1523 },
                { 日期: "1月2日", 访问用户: 1223 },
                { 日期: "1月3日", 访问用户: 2123 },
                { 日期: "1月4日", 访问用户: 4123 },
                { 日期: "1月5日", 访问用户: 3123 },
                { 日期: "1月6日", 访问用户: 7123 }
              ]
            },
            getUrl: "",
            interval: 2
          },
          generated: {
            columns: ["日期", "访问用户"],
            rows: [
              { 日期: "1月1日", 访问用户: 1523 },
              { 日期: "1月2日", 访问用户: 1223 },
              { 日期: "1月3日", 访问用户: 2123 },
              { 日期: "1月4日", 访问用户: 4123 },
              { 日期: "1月5日", 访问用户: 3123 },
              { 日期: "1月6日", 访问用户: 7123 }
            ]
          }
        };
      }
      const component = {
        name: "New Layer" + (this.$store.state.chartData.elements.length + 2),
        x: 10,
        y: 10,
        w: 400,
        h: 200,
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
  width: 250px;
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
