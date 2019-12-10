<template lang="pug">
  .container
    .enter-fullscreen(@click="toggleFullscreen(document)") Full screen switch
    .screen(:style="screenStyle" @click.self="" ref="screen")
      .component(
        v-for="(item, index) in chartData.elements"
        :key="index"
        :style="{width: item.w + 'px', height: item.h + 'px', left: item.x + 'px', top: item.y + 'px', zIndex: chartData.elements.length - index}")
        div.filler(
          v-if="item.data.type == 'mycanvas'"
          :style="{width: '100%', height: '100%', backgroundColor: item.bgcolor}")
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
</template>

<script>
/* eslint-disable */
import vueCanvas from '../../components/visualComponents/vueCanvas';
import heatMap from '../../components/visualComponents/heatMap';
import vueScatter2 from '../../components/visualComponents/vueScatter2'
import vueCandle from '../../components/visualComponents/vueCandle'
import bMap from '../../components/visualComponents/bMap'
import myThree from '../../components/visualComponents/myThree'
import vueLeaflat from '../../components/visualComponents/vueLeaflat'
import vueMapbox from '../../components/visualComponents/vueMapbox'

export default {
   components: {
     
    vueCanvas,
    heatMap,
    vueScatter2,
    vueCandle,
    bMap,
    myThree,
    vueLeaflat,
    vueMapbox,


  },
  data() {
    return {
      chartData: {}, // 请求数据库
      document: document.documentElement,
    };
  },
  computed: {
    screenStyle() {
      return {
        width: '100%', //this.chartData.w + 'px',
        height: this.chartData.h + 'px',
        backgroundColor: this.chartData.bgcolor,
        backgroundImage: `url(${this.chartData.bgimage})`,
        backgroundSize: this.chartData.bgimagesize,
      };
    },
  },
  mounted() {
    // 请求数据库拿最新的数据
    this.$http.get('/chart/view/' + this.$route.params.id)
      .then((res) => {
        const { errno, data } = res.data;
        if (errno === 0) {
          this.title = data.title;
          document.title = data.title;
          this.chartData = data.chartData;
        }
      })
      .catch(() => {});
  },
  methods: {
    generateData(item) {
      if (item.data.datacon.type == 'raw') {
        item.data.generated = item.data.datacon.data
      } else if (item.data.datacon.type == 'connect') {
        this.$http.get('/connect/' + item.data.datacon.connectId)
          .then((res) => {
            const { errno, data } = res.data;
            if (errno === 0) {
              // console.log(data.data);
              item.data.generated = data.data;
            }
          })
          .catch(() => {});
      } else if (item.data.datacon.type == 'get') {
        clearInterval(interval);
        let time = item.data.datacon.interval ? item.data.datacon.interval : 1;
        interval = setInterval(() => {
          this.$http.get(item.data.datacon.getUrl)
            .then((res) => {
              item.data.generated = res.data;
            })
            .catch(() => {});
        }, time * 1000)
      }
    },
    toggleFullscreen (element) {
      let ele = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
      if (ele != null) {
        // 关闭全屏
        if (document.exitFullScreen) {
          document.exitFullScreen();
        } else if(document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if(element.msExitFullscreen) {
          element.msExitFullscreen();
        }
      } else {
        // 打开全屏
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if(element.msRequestFullscreen){
          element.msRequestFullscreen();
        } else if(element.webkitRequestFullscreen) {
          element.webkitRequestFullScreen();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.container{
  text-align: center;
  height: 100%;
  margin: 0px;
  padding: 0px;
}

.enter-fullscreen {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 80px;
  line-height: 80px;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  text-align: center;
  font-size: 24px;
  transition: opacity 0.3s ease;
  opacity: 0;
  z-index: 999;
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
}

.screen {
  margin: 0 auto;
  position: relative;
  width: 100%;
  height: 100%;
  .component {
    position: absolute;
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
        border-image: url('./../../assets/img/borders/1.png') 50;
      }
      &.border2 {
        border: 50px solid transparent;
        border-image: url('./../../assets/img/borders/2.png') 50;
      }
      &.border3 {
        border: 50px solid transparent;
        border-image: url('./../../assets/img/borders/3.png') 50;
      }
    }
  }
}
</style>
