<template lang="pug">
  div
    vue-context-menu(
      class="right-menu"
      :target="contextMenuTarget"
      :show="contextMenuVisible"
      @update:show="(show) => contextMenuVisible = show")
      a(href="javascript:;" @click="copyChartCom") Copy
      a(href="javascript:;" @click="moveUpChartCom") Move Up
      a(href="javascript:;" @click="moveDownChartCom") Move Down
      a(href="javascript:;" @click="deleteChartCom") Delete
      a(href="javascript:;" @click="compnentInfo") Info
      a(href="javascript:;" @click="draggable") {{draggableComponent?'Disdraggable':'Draggable'}}

    //- 发布对话框
    el-dialog(title="Publish" :visible.sync="$parent.publishPopVisible" width="50%")
      div(style="margin-bottom: 16px;") 发布成功! 访问地址为:
      el-input(v-model="publicUrl" readonly)
      span(slot="footer")
        el-button(type="primary" @click="btnPublish") 确定
    //- 画布
    .edit-view(
      tabindex="0"
      @keydown.space.prevent="handleSpaceDown"
      @keyup.space.prevent="handleSpaceUp"
      @click.self="handleActivated(-1)")
      vue-draggable-resizable(
          :style="wrapStyle"
          :x="100"
          :y="50"
          :w="chartData.w"
          :h="chartData.h"
          class-name="screen-box"
          class-name-draggable="screen-box-draggable"
          :drag-handle="'.drag-handle'"
          :draggable="screenDraggable"
          :resizable="false")
        .screen(:style="screenStyle" @click.self="handleActivated(-1)" ref="screen")
         
          vue-drag-resize(
            v-for="(item, index) in chartData.elements"
            :key="index"
            :isActive="item.active && !$parent.preview"
            :parentScaleX="scale"
            :parentScaleY="scale"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :parentLimitation="true"
            :parentW="chartData.w"
            :parentH="chartData.h"
            :aspectRatio="false"
            :minw="20"
            :minh="20"
            :z="chartData.elements.length - index"
            :isDraggable="draggableComponent"
            :isResizable="!$parent.preview"
            @activated="handleActivated(index)"
            @resizing="handleResize(item, arguments[0])"
            @dragging="handleDrag(item, arguments[0])")
            div.filler(
              v-if="item.data.type == 'mycanvas'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}" ref="panel")
              vue-canvas(
                 v-if="item.data.settings.type=='mycanvas'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :canvasdata="item.data.generated")
            div.filler(
              v-if="item.data.type == 'map'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")         
              ve-map(
                v-if="item.data.settings.type=='map'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated"
                :settings="item.data.settings") 
              heat-map(
                v-else-if="item.data.settings.type=='heatmap'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated"
                :settings="item.data.settings")
              vue-mapbox(
                 v-else-if="item.data.settings.type=='mapbox'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated"
                :settings="item.data.settings")
              vue-leaflat(
                 v-else-if="item.data.settings.type=='leaflat'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :id="item.data.mapid"
                :data="item.data.generated"
                :settings="item.data.settings")
              b-map(
                v-else-if="item.data.settings.type=='bmap'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated"
                :settings="item.data.settings")
              my-three(
                v-else-if="item.data.settings.type=='3js'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated"
                :settings="item.data.settings")
            div.filler(
              v-if="item.data.type == 'chart'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")
              ve-liquidfill(
                v-if="item.data.settings.type=='liquidfill'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated")
                //- @ready-once="generateData(item)"
              ve-scatter(
                v-else-if="item.data.settings.type=='scatter1'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated")
              vue-scatter2(
                v-else-if="item.data.settings.type=='scatter2'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated")
              ve-candle(
                v-else-if="item.data.settings.type=='candle'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated")
                //- @ready-once="generateData(item)"
              ve-radar(
                v-else-if="item.data.settings.type=='radar'"
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated")
                //- @ready-once="generateData(item)"
              ve-chart(
                v-else
                :width="item.w + 'px'"
                :height="item.h + 'px'"
                :data="item.data.generated"
                :settings="item.data.settings")
                //- @ready-once="generateData(item)"
            div.filler(
              v-if="item.data.type == 'text'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")
              div.textcontainer(
                :style="{fontFamily: item.data.datacon.fontFamily, fontWeight: item.data.datacon.bold ? 'bold' : 'normal', fontStyle: item.data.datacon.italic ? 'italic' : 'normal', color: item.data.datacon.color, fontSize: item.data.datacon.fontSize + 'px', textStroke: item.data.datacon.stroke ? item.data.datacon.strokeSize+'px '+item.data.datacon.strokeColor : '0', textShadow: item.data.datacon.shadow ? '5px 5px '+item.data.datacon.shadowBlur+'px '+item.data.datacon.shadowColor : 'none'}"
                v-text="item.data.datacon.text")
            div.filler(
              v-if="item.data.type == 'image'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")
              div.imagecontainer(
                :style="{backgroundImage: `url(${item.data.datacon.img})`, backgroundSize: item.data.datacon.imgSize, opacity: item.data.datacon.opacity}")
                .placeholder(v-show="!item.data.datacon.img")
            div.filler(
              v-if="item.data.type == 'border'"
              :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")
              div.bordercontainer(
                :class="'border' + item.data.datacon.borderId"
                :style="{opacity: item.data.datacon.opacity}")
          .mock(:class="{front: screenDraggable}")
</template>

<script>
import { component as VueContextMenu } from '@xunlei/vue-context-menu';
import { constants } from 'crypto';
import { mapState } from 'vuex';

import vueCanvas from '../../components/visualComponents/vueCanvas';
import heatMap from '../../components/visualComponents/heatMap';
import vueScatter2 from '../../components/visualComponents/vueScatter2'
import vueCandle from '../../components/visualComponents/vueCandle'
import bMap from '../../components/visualComponents/bMap'
import vueMapbox from '../../components/visualComponents/vueMapbox'
import myThree from '../../components/visualComponents/myThree'
import vueLeaflat from '../../components/visualComponents/vueLeaflat'

/* eslint-disable */
export default {
  components: {
    "vue-context-menu": VueContextMenu,
    vueCanvas,
    heatMap,
    vueScatter2,
    vueCandle,
    bMap,
    vueMapbox,
    myThree,
    vueLeaflat
  },

  props: ["scale"],
  data() {
    return {
      // 底图是否可拖拽
      screenDraggable: false,

      // 右键菜单
      contextMenuTarget: document.getElementById("app"),
      contextMenuVisible: false,
      draggableComponent:true
       
    };
  },
  computed: {
    publicUrl() {
      return `http://${window.location.host}${window.location.pathname}#/view/${this.$route.params.id}`;
    },

    // 计算属性，在标签中可以当作属性一样使用。
    // chartData() {
    //   return this.$parent.chartData;
    // },
    ...mapState(["chartData"]),
  

    wrapStyle() {
      return {
        transform: `scale(${this.scale})`
      };
    },

    screenStyle() {
      return {
        backgroundColor: this.chartData.bgcolor,
        backgroundImage: `url(${this.chartData.bgimage})`,
        backgroundSize: this.chartData.bgimagesize
      };
    }
  },

  methods: {
    handleSpaceDown() {
      this.screenDraggable = true;
    },
    handleSpaceUp() {
      this.screenDraggable = false;
    },
    handleActivated(index) {
      this.$store.dispatch("setActiveComponentByIndex", index);
      // this.$parent.setActiveComponentByIndex(index);
    },
    handleResize(widget, arg) {
      const item = widget;
      item.x = arg.left;
      item.y = arg.top;
      item.w = arg.width;
      item.h = arg.height;
    },
    handleDrag(widget, arg) {
      const item = widget;
      
      item.x = arg.left;
      item.y = arg.top;
    },
    generateData(item) {
      this.$parent.generateData(item);
    },

    // === 右键菜单 ===
    compnentInfo(){
      console.log(this.$store.state.currentElementIndex)
      console.log("component info:",this.$store.state.chartData.elements)
    },
    // 复制
    copyChartCom() {
     
      var cur_elem_index = this.$store.state.currentElementIndex;
      var chart_data = this.$store.state.chartData;
      var cur_com = chart_data.elements[cur_elem_index];

      console.log(chart_data)
      if(cur_com.data.settings.type==="leaflat"){
        alert("can't copy this!")
      }
      else if (cur_elem_index != -1) {
        
        var cur_com_clone = Object.assign({}, cur_com);
        cur_com_clone.name = cur_com.name + "_copy_" + chart_data.elements.length;
        cur_com_clone.x += 20;
        cur_com_clone.y += 20;

        this.$store.dispatch("addComponent", cur_com_clone);
        // this.$parent.addComponent(cur_com_clone);
      }
      this.contextMenuVisible = false;
    },

    // 上移
    moveUpChartCom() {
      // 查找当前组件在 chartData.elements 数组中的位置
      var cur_elem_index = this.$store.state.currentElementIndex;
      var chart_data = this.$store.state.chartData;
      if(cur_elem_index>0){
        var former_elem=this.$store.state.chartData.elements[cur_elem_index-1]
        var cur_elem=this.$store.state.chartData.elements[cur_elem_index]
        
        this.$store.state.chartData.elements[cur_elem_index-1]=cur_elem
        this.$store.state.chartData.elements[cur_elem_index]=former_elem

        this.$store.dispatch("moveUpElement", this.$store.state.chartData)

      }else{
        alert("Already the top component!!")
      }
   
      this.contextMenuVisible = false;
    },

    // 下移
    moveDownChartCom() {
      var cur_elem_index = this.$store.state.currentElementIndex;
      var chart_data = this.$store.state.chartData;
      console.log( cur_elem_index)
      console.log( this.$store.state.chartData.elements.length)

      if(cur_elem_index<this.$store.state.chartData.elements.length-1){

        var next_elem=this.$store.state.chartData.elements[cur_elem_index+1]
        var cur_elem=this.$store.state.chartData.elements[cur_elem_index]
        
        this.$store.state.chartData.elements[cur_elem_index+1]=cur_elem
        this.$store.state.chartData.elements[cur_elem_index]=next_elem

        this.$store.dispatch("moveDownElement", this.$store.state.chartData)

      }else{
        alert("Already the bottom component!")
      }




      this.contextMenuVisible = false;
    },

    deleteChartCom() {
      if (this.$store.state.currentElementIndex != -1) {
        // this.$parent.deleteComponent(this.$parent.currentElementIndex);
        this.$store.dispatch(
          "deleteComponent",
          this.$store.state.currentElementIndex
        );
      }
      this.contextMenuVisible = false;
    },
draggable(){
  if(this.draggableComponent){
    this.draggableComponent=false
  }else{
    this.draggableComponent=true
  }
 this.contextMenuVisible = false;

},
    // 发布
    btnPublish() {
      //window.location.href = this.publicUrl; // 在当前tab中打开
      window.open(this.publicUrl); // 在新tab中打开
      this.$parent.publishPopVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.edit-view {
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: visible;
  outline: 0;
}

.screen-box {
  // width: 1220px;
  // height: 400px;
  position: relative;
  background: #ffffff;
  transform-origin: 0 0;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
  transition: transform 0.5s ease;

  &.screen-box-draggable {
    cursor: grab;
  }
}

.screen {
  position: relative;
  width: 100%;
  height: 100%;
  .vdr {
    border: 0;
  }
  .filler {
    .textcontainer {
      word-wrap: break-word;
    }
    .imagecontainer {
      width: 100%;
      height: 100%;
      .placeholder {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
      }
    }
    .bordercontainer {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      &.border1 {
        border: 50px solid transparent;
        border-image: url("./../../assets/img/borders/1.png") 50;
      }
      &.border2 {
        border: 50px solid transparent;
        border-image: url("./../../assets/img/borders/2.png") 50;
      }
      &.border3 {
        border: 50px solid transparent;
        border-image: url("./../../assets/img/borders/3.png") 50;
      }
    }
  }
}

.mock {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  z-index: -1;

  &.front {
    z-index: 999;
  }
}

.right-menu {
  border: 1px solid #eee;
  box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, 0.1);
  border-radius: 1px;
  display: block;
  font-family: Microsoft Yahei, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: fixed;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  z-index: 999;
  display: none;

  a {
    padding: 2px 15px;
    // width: 120px;
    height: 28px;
    line-height: 28px;
    text-align: left;
    display: block;
    color: #1a1a1a;
  }

  a:link {
    text-decoration: none;
    color: #000;
  }
    a:active {
    text-decoration: blink;
  }
    a:visited {
    text-decoration: none;
    color: green;
  }
   
    // user agent stylesheet
    a:-webkit-any-link {
    color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
  }
  a:hover {
    background: #42b983;
    // background: $color-primary;
    color: #fff;
  }
}
</style>
