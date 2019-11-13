<template lang="pug">
  .config
    .public-config(v-if="!currentElement.w")
      .config-box
        .title 画布大小
        el-row(:gutter="20")
          el-col(:span="12")
            el-input.num-input(v-model.number="chartData.w")
              template(slot="prepend") 宽
          el-col(:span="12")
            el-input(v-model.number="chartData.h")
              template(slot="prepend") 高
      .config-box
        .title 背景配置
        el-select(v-model="editorSettings.parentBg" placeholder="请选择" style="width: 100%")
          el-option(label="背景颜色" :value="0")
          el-option(label="背景图片" :value="1")
        el-row(:gutter="20" style="margin-top: 12px;" v-show="editorSettings.parentBg === 0")
          el-col(:span="4")
            el-color-picker(v-model="chartData.bgcolor")
          el-col(:span="20")
            el-input(v-model="chartData.bgcolor" readonly)
        el-row(:gutter="20" style="margin-top: 12px;" v-show="editorSettings.parentBg === 1")
          el-col(:span="24")
            el-upload(
              class="bg-uploader"
              action="http://localhost:3000/api/uploadfile/"
              :show-file-list="false"
              :on-success="handleScreenBgUploadSuccess"
              :before-upload="beforeUpload")
              .bg-preview-wrapper(v-if="chartData.bgimage")
                img.bg-preview(:src="chartData.bgimage")
              i.el-icon-plus.avatar-uploader-icon(v-else)
          el-col(:span="24" v-show="chartData.bgimage")
            el-select(v-model="chartData.bgimagesize" placeholder="请选择" style="width: 100%")
              el-option(label="覆盖" value="cover")
              el-option(label="平铺" value="contain")
              el-option(label="拉伸" value="100% 100%")
          el-col(:span="24" v-show="chartData.bgimage" style="margin-top: 16px")
            el-button(type="danger" plain @click="handleScreenBgDelete" style="width: 100%") 删除
    .component-config(v-if="currentElement.w")
      .panel-selector
        .radio-group
          .radio-btn(
            @click="thisKey='general'"
            :class="{active: thisKey=='general'}") 基础
          .radio-btn(
            @click="readyColorBars()"
            v-show="currentElement.data.type == 'mycanvas'"
            :class="{active: thisKey=='data'}") 数据
          .radio-btn(
            @click="thisKey='data'"
            v-show="currentElement.data.type == 'map'"
            :class="{active: thisKey=='data'}") 数据
          .radio-btn(
            @click="thisKey='data'"
            v-show="currentElement.data.type == 'chart'"
            :class="{active: thisKey=='data'}") 数据
          .radio-btn(
            @click="thisKey='data'"
            v-show="currentElement.data.type == 'text'"
            :class="{active: thisKey=='data'}") 文字
          .radio-btn(
            @click="thisKey='data'"
            v-show="currentElement.data.type == 'image'"
            :class="{active: thisKey=='data'}") 图片
          .radio-btn(
            @click="thisKey='data'"
            v-show="currentElement.data.type == 'border'"
            :class="{active: thisKey=='data'}") 边框
      .panel(v-show="thisKey=='general'")
        .config-box
          .title 控件名称
          el-input(v-model="currentElement.name")
        .config-box
          .title 组件位置
          el-row(:gutter="20")
            el-col(:span="12")
              el-input(v-model.number="currentElement.x")
                template(slot="prepend") x
            el-col(:span="12")
              el-input(v-model.number="currentElement.y")
                template(slot="prepend") y
          el-row(:gutter="20" style="margin-top: 4px;")
            el-col(:span="12")
              el-input(v-model.number="currentElement.w")
                template(slot="prepend") w
            el-col(:span="12")
              el-input(v-model.number="currentElement.h")
                template(slot="prepend") h
        .config-box
          .title 背景颜色
          el-row(:gutter="20")
            el-col(:span="4")
              el-color-picker(v-model="currentElement.bgcolor" show-alpha)
            el-col(:span="20")
              el-input(v-model="currentElement.bgcolor" readonly)
        //- .config-box
        //-   .title Settings.json
        //-   pre.code-box(v-html="formatedJSON")
      .panel(v-show="thisKey=='data' && (currentElement.data.type == 'mycanvas')")
        .config-box
          .title 数据源获取
          el-row(:gutter="20")
            el-col(:span="20") 
              el-input(v-model="data_src")
          el-row(:gutter="20")
            el-col(:span="20") 
              el-button(@click="testLineChart(data_src)") data
        .config-box
          .title 色带选择
          el-select(
            v-model="color_bar_value"
            placeholder="色带选择"
            @change="choose_color_bar"
            @visible-change="initCOlorBar()"
            style="width: 100%; margin-bottom: 10px;")
            el-option(
            v-loading="loading"
            v-for="item in color_bar" 
            :key="item.id" 
            :value="item")
              <p v-html="item.text"></p>
          canvas(id="nowShow" width="240" height="20")
        .config-box
          .title 数据配置
          el-select(
            v-model="currentElement.data.datacon.type"
            placeholder="请选择"
            @change="handleChartDataChange"
            style="width: 100%; margin-bottom: 10px;")
            el-option(label="静态JSON" value="raw")
            el-option(label="我的数据源" value="connect")
            //- el-option(label="表格数据" value="table")
            el-option(label="GET接口" value="get")
          //- el-input(
            v-model="currentElement.data.datacon.data"
            type="textarea"
            :rows="10"
            placeholder="请插入标准 JSON 文件"
            v-show="currentElement.data.datacon.type == 'raw'")
          vue-json-editor(
            v-if="currentElement.data.datacon.type == 'raw'"
            v-model="currentElement.data.datacon.data"
            mode="code"
            :show-btns="true"
            @json-save="handleChartDataChange")
          
          el-select(
            v-if="currentElement.data.datacon.type == 'connect'"
            v-model="currentElement.data.datacon.connectId"
            placeholder="请选择"
            @change="handleChartDataChange"
            style="width: 100%; margin-bottom: 10px;")
          
            //- el-option(v-for="item in connectList" :label="item.name" :value="item._id")
          el-input(
            v-if="currentElement.data.datacon.type == 'get'"
            v-model="currentElement.data.datacon.getUrl"
            type="textarea"
            :rows="5"
            style="margin-bottom: 10px;")
          el-row(v-if="currentElement.data.datacon.type == 'get'")
            el-col(:span="8")
              p(style="margin-top: 8px;") 刷新时间
            el-col(:span="16")
              el-input-number(
                v-model="currentElement.data.datacon.interval"
                :min="1"
                :max="10"
                @change="handleChartDataChange"
                style="width: 100%;")
      .panel(v-show="thisKey=='data' && (currentElement.data.type == 'chart')")
        .config-box
          .title 数据源获取
          el-row(:gutter="20")
            el-col(:span="20") 
              el-input(v-model="data_src")
          el-row(:gutter="20")
            el-col(:span="20") 
              el-button(@click="testLineChart(data_src)") data
        .config-box
          .title 数据配置
          el-select(
            v-model="currentElement.data.datacon.type"
            placeholder="请选择"
            @change="handleChartDataChange"
            style="width: 100%; margin-bottom: 10px;")
            el-option(label="静态JSON" value="raw")
            el-option(label="我的数据源" value="connect")
            //- el-option(label="表格数据" value="table")
            el-option(label="GET接口" value="get")
          //- el-input(
            v-model="currentElement.data.datacon.data"
            type="textarea"
            :rows="10"
            placeholder="请插入标准 JSON 文件"
            v-show="currentElement.data.datacon.type == 'raw'")
          vue-json-editor(
            v-if="currentElement.data.datacon.type == 'raw'"
            v-model="currentElement.data.datacon.data"
            mode="code"
            :show-btns="true"
            @json-save="handleChartDataChange")
          
          el-select(
            v-if="currentElement.data.datacon.type == 'connect'"
            v-model="currentElement.data.datacon.connectId"
            placeholder="请选择"
            @change="handleChartDataChange"
            style="width: 100%; margin-bottom: 10px;")
          
            //- el-option(v-for="item in connectList" :label="item.name" :value="item._id")
          el-input(
            v-if="currentElement.data.datacon.type == 'get'"
            v-model="currentElement.data.datacon.getUrl"
            type="textarea"
            :rows="5"
            style="margin-bottom: 10px;")
          el-row(v-if="currentElement.data.datacon.type == 'get'")
            el-col(:span="8")
              p(style="margin-top: 8px;") 刷新时间
            el-col(:span="16")
              el-input-number(
                v-model="currentElement.data.datacon.interval"
                :min="1"
                :max="10"
                @change="handleChartDataChange"
                style="width: 100%;")
      .panel(v-show="thisKey=='data' && (currentElement.data.type == 'map')")
        .config-box
          .title 数据源获取
          el-row(:gutter="20")
          .title 观测数据
            el-col(:span="20") 
              el-input(v-model="data_src")
          el-row(:gutter="20")
          .title 模拟数据
            el-col(:span="20") 
              el-input(v-model="data_sum")
          el-row(:gutter="20")
            el-col(:span="20") 
              el-button(@click="testLineChart(data_src,data_sum)") data
        .config-box
          .title 数据配置
          el-select(
            v-model="currentElement.data.datacon.type"
            placeholder="请选择"
            @change="handleChartDataChange"
            style="width: 100%; margin-bottom: 10px;")
            el-option(label="静态JSON" value="raw")
            el-option(label="我的数据源" value="connect")
            //- el-option(label="表格数据" value="table")
            el-option(label="GET接口" value="get")
          //- el-input(
            v-model="currentElement.data.datacon.data"
            type="textarea"
            :rows="10"
            placeholder="请插入标准 JSON 文件"
            v-show="currentElement.data.datacon.type == 'raw'")
          vue-json-editor(
            v-if="currentElement.data.datacon.type == 'raw'"
            v-model="currentElement.data.datacon.data"
            mode="code"
            :show-btns="true"
            @json-save="handleChartDataChange")
          
          el-select(
            v-if="currentElement.data.datacon.type == 'connect'"
            v-model="currentElement.data.datacon.connectId"
            placeholder="请选择"
            @change="handleChartDataChange"
            style="width: 100%; margin-bottom: 10px;")
          
            //- el-option(v-for="item in connectList" :label="item.name" :value="item._id")
          el-input(
            v-if="currentElement.data.datacon.type == 'get'"
            v-model="currentElement.data.datacon.getUrl"
            type="textarea"
            :rows="5"
            style="margin-bottom: 10px;")

          el-row(v-if="currentElement.data.datacon.type == 'get'")
            el-col(:span="8")
              p(style="margin-top: 8px;") 刷新时间
            el-col(:span="16")
              el-input-number(
                v-model="currentElement.data.datacon.interval"
                :min="1"
                :max="10"
                @change="handleChartDataChange"
                style="width: 100%;")
      .panel(v-show="thisKey=='data' && currentElement.data.type == 'text'")
        .config-box
          .title 输入文本
          el-input(
            v-model="currentElement.data.datacon.text"
            type="textarea"
            :rows="5"
            style="margin-bottom: 10px;")
        .config-box
          .title 字体字号
          el-select(
            v-model="currentElement.data.datacon.fontFamily"
            placeholder="请选择"
            style="width: 100%; margin-bottom: 10px;")
            el-option-group(label="英文字体")
              el-option(label="Molengo" value="Molengo")
                span(:style="{fontFamily: 'Molengo'}") Molengo
              el-option(label="Lobster" value="Lobster")
                span(:style="{fontFamily: 'Lobster'}") Lobster
            el-option-group(label="中文字体")
              el-option(label="思源黑体" value="Noto Sans SC")
                span(:style="{fontFamily: 'Noto Sans SC'}") 思源黑体
              el-option(label="思源宋体" value="Noto Serif SC")
                span(:style="{fontFamily: 'Noto Serif SC'}") 思源宋体
              el-option(label="站酷庆科黄油体" value="ZCOOL QingKe HuangYou")
                span(:style="{fontFamily: 'ZCOOL QingKe HuangYou'}") 站酷庆科黄油体
              el-option(label="站酷小薇体" value="ZCOOL XiaoWei")
                span(:style="{fontFamily: 'ZCOOL XiaoWei'}") 站酷小薇体
          el-row(:gutter="20")
            el-col(:span="4")
              el-color-picker(v-model="currentElement.data.datacon.color" show-alpha)
            el-col(:span="20")
              el-input(v-model="currentElement.data.datacon.fontSize")
                template(slot="append") px
          el-row(:gutter="20")
            el-col(:span="24")
              .btn(:class="{active: currentElement.data.datacon.bold}" @click="currentElement.data.datacon.bold = !currentElement.data.datacon.bold")
                i.iconfont.icon-bold
              .btn(:class="{active: currentElement.data.datacon.italic}" @click="currentElement.data.datacon.italic = !currentElement.data.datacon.italic")
                i.iconfont.icon-italic
        .config-box
          .title 描边
            el-switch(v-model="currentElement.data.datacon.stroke" style="float: right;")
          el-row(:gutter="20" v-show="currentElement.data.datacon.stroke")
            el-col(:span="4")
              el-color-picker(v-model="currentElement.data.datacon.strokeColor")
            el-col(:span="20")
              el-input(v-model="currentElement.data.datacon.strokeSize")
                template(slot="append") px
        .config-box
          .title 阴影
            el-switch(v-model="currentElement.data.datacon.shadow" style="float: right;")
          el-row(:gutter="20" v-show="currentElement.data.datacon.shadow")
            el-col(:span="4")
              el-color-picker(v-model="currentElement.data.datacon.shadowColor")
            el-col(:span="20")
              el-input(v-model="currentElement.data.datacon.shadowBlur")
                template(slot="append") px
      .panel(v-show="thisKey=='data' && currentElement.data.type == 'image'")
        .config-box
          .title 上传图片
          el-upload(
            class="bg-uploader"
            action="http://localhost:3000/api/uploadfile/"
            :show-file-list="false"
            :on-success="handleImageUploadSuccess"
            :before-upload="beforeUpload")
            .bg-preview-wrapper(v-if="this.currentElement.data.datacon.img")
              img.bg-preview(:src="this.currentElement.data.datacon.img")
            i.el-icon-plus.avatar-uploader-icon(v-else)
          el-row
            el-col(:span="24" v-show="this.currentElement.data.datacon.img")
              el-select(v-model="currentElement.data.datacon.imgSize" placeholder="请选择" style="width: 100%")
                el-option(label="覆盖" value="cover")
                el-option(label="平铺" value="contain")
                el-option(label="拉伸" value="100% 100%")
        .config-box
          .title 透明度
          el-slider(v-model="currentElement.data.datacon.opacity" :max="1" :step="0.01" show-input)
      .panel(v-show="thisKey=='data' && currentElement.data.type == 'border'")
        .config-box
          .title 边框样式
          el-select(
            v-model="currentElement.data.datacon.borderId"
            placeholder="请选择"
            style="width: 100%; margin-bottom: 10px;")
            el-option(label="古典-棕" :value="1")
            el-option(label="古典-白" :value="2")
            el-option(label="科技" :value="3")
        .config-box
          .title 透明度
          el-slider(v-model="currentElement.data.datacon.opacity" :max="1" :step="0.01" show-input)
      el-dialog(
        title="Preview"
        :modal-append-to-body="false"
        :visible.sync="canvas_preview"
        width="30%"
        
        )
        <div v-loading="loading">
         canvas( id="preview_canvas" width="440" height="400") 
        </div>
       
        span(slot="footer" class="dialog-footer")
            el-button(@click="canvas_preview = false") 取 消
            el-button(type="primary" @click="visual_grid()") 确 定 
</template>

<script>
/* eslint-disable */
import httpUtils from "../../utils/httpUtils";
import ramp from "../../utils/canvas/ramp";

import { globalBus } from "../../utils/globalBus";
import vueJsonEditor from "vue-json-editor";
import { mapState, mapGetters } from "vuex";
import { all } from "q";
import { constants } from "crypto";

export default {
  components: {
    vueJsonEditor
  },

  data() {
    return {
      loading: false,
      user: {
        uid: localStorage.getItem("uid"),
        username: localStorage.getItem("user")
      },
      editorSettings: {
        parentBg: 0, // 0代表背景颜色，1代表背景图片
        parentBgUrl: ""
      },
      thisKey: "general",
      connectList: [],
      data_src:  "http://localhost:8897/testChart?file=testObservation&type=chart",
      data_sum:"http://localhost:8897/testChart?file=testSimulation&type=chart",
      color_bar: [], //color色带
      color_bar_value: "",
      ramp_obj: {}, //色带对象
      cavas_name: "",
      canvas_preview: false,
      visual_data: {
        imgData: {},
        cols: "",
        rows: ""
      }
    };
  },

  computed: {
    ...mapState(["chartData"]),
    ...mapGetters(["currentElement"]),

    // chartData() {
    //   return this.$parent.chartData;
    // },

    // currentElement() {
    //   return this.$parent.currentElement;
    // },

    formatedJSON() {
      return JSON.stringify(this.$store.getters.currentElement, null, 2);
    }
  },

  mounted() {
    // TODO: 获取全部数据源列表
    // this.$http
    //   .get("/connect?uid=" + this.user.uid)
    //   .then(res => {
    //     const { errno, data } = res.data;
    //     if (errno === 0) {
    //       this.connectList = data.connectList;
    //     }
    //   })
    //   .catch(() => {});
  },
  methods: {
    handleScreenBgUploadSuccess(res, file) {
      this.$store.state.chartData.bgimage = res.url;
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeUpload(file) {
      const isPic = file.type === "image/jpeg" || file.type === "image/png";
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isPic) {
        this.$message.error("图片只能是 JPG 或 PNG 格式!");
      }
      if (!isLt4M) {
        this.$message.error("图片大小不能超过 4MB!");
      }
      return isPic && isLt4M;
    },

    handleScreenBgDelete() {
      this.$store.state.chartData.bgimage = "";
    },

    handleChartDataChange() {
      this.$parent.generateData(this.currentElement);
    },
    handleImageUploadSuccess(res, file) {
      // console.log(res);
      this.currentElement.data.datacon.img = res.url;
      // console.log(file);
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    wapper_data(row,col,dataset){
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
            let year_len=dataset.getChildNode(1).getChildNodeCount()
            let start_year=dataset.getChildNode(1).getChildNode(0).getName()
            col.push(start_year,year_len)
            //将第一个位置元素，入栈
            let location_count = dataset
              .getChildNodeCount()

            
            let lat = dataset.getChildNode(0).getChildNode(0);
            let lag = dataset.getChildNode(0).getChildNode(1);
            let year_gear=[dataset.getChildNode(0).getChildNode(2).getKernel().getTypedValueByIndex(0),dataset.getChildNode(0).getChildNode(2).getKernel().getTypedValueByIndex(1)]
             ;

            for (var i = 0; i < location_count-1; i++) {
              let obj = {};
              obj['name']= dataset.getChildNode(i).getName();
              obj['lat'] = lat.getKernel().getTypedValueByIndex(i);
              obj['lag'] = lag.getKernel().getTypedValueByIndex(i);

              row.push(obj);//将站点信息，名字，经纬度，入到row
            }
            let obj={'year_gear':year_gear}
            row.push(obj)
    },
    ///输入为udx_data的流
    testLineChart(obs,sum) {
      var _self = this,R=[],C=[]  ;
      if(_self.currentElement.data.settings.type === "leaflat"){

        if(obs!=''&&sum!=''){
           httpUtils.get(this, obs, data => {
              var dataset_observ = new UdxDataset();
              dataset_observ.createDataset();
              dataset_observ.loadFromXmlStream(data);

                httpUtils.get(this, sum, data2 => {
                  var dataset_sum = new UdxDataset();
                  dataset_sum.createDataset();
                  dataset_sum.loadFromXmlStream(data2);
                  //观测值
                  var row1=[],col1=[]
                  _self.wapper_data(row1,col1,dataset_observ)
                  R.push(row1)
                  C.push(col1)
                  //模拟值
                    row1=[],col1=[]
                  _self.wapper_data(row1,col1,dataset_sum)
                  R.push(row1)
                  C.push(col1)

                   var initData = {
                    type: "map",
                    settings: {
                      type:
                        _self.$store.state.chartData.elements[
                          _self.$store.state.currentElementIndex
                        ].data.settings.type //类型
                    },
                    datacon: {
                      type: "raw",
                      connectId: "",
                      data: {
                        columns: C,
                        rows: R
                      },
                      getUrl: "",
                      interval: 2
                    },
                    generated: {
                      columns: C,
                      rows: R
                    }
                  };

                  var da = {
                    ind: _self.$store.state.currentElementIndex,
                    data: initData
                  };
                  console.log("map", da);
                  _self.$store.dispatch("setComponentData", da);


                      


                });
        
            });
        }
      }else{
         httpUtils.get(this, obs, data => {
              var dataset = new UdxDataset();
              dataset.createDataset();
              dataset.loadFromXmlStream(data);

              if (_self.currentElement.data.type == "mycanvas") {
                //拿到最大最小值
                var min = 99999,
                  max = -99999;
                var listnode = dataset.getChildNode(1);
                var rows = listnode.getChildNodeCount();
                // 一开始已经检测过了，保证了每个item(int_array|real_array)的长度是一致的，所以，这里直接取第一个的长度就可以了。
                var cols = listnode
                  .getChildNode(0)
                  .getKernel()
                  .getArrayCount();

                for (var i = 0; i < rows; i++) {
                  var child = listnode.getChildNode(i);

                  for (var j = 0; j < cols; j++) {
                    var curValue = child.getKernel().getTypedValueByIndex(j); //parseFloat(oneLineArray[j]);
                    if (curValue != "") {
                      if (curValue < min) {
                        min = curValue;
                      }
                      if (curValue > max) {
                        max = curValue;
                      }
                    }
                  }
                }

                console.log("max,min", max, min);

                //当前点击的组件索引
                let index = _self.$store.state.currentElementIndex;

                //初始化数据
                let initData = {
                  type: "mycanvas",
                  settings: {
                    type:
                      _self.$store.state.chartData.elements[index].data.settings.type //类型
                  },
                  datacon: {
                    type: "raw",
                    connectId: "",
                    data: {
                      columns: url,
                      rows: [max, min]
                    },
                    getUrl: "",
                    interval: 2
                  },
                  generated: {
                    columns: url,
                    rows: ""
                  }
                };

                let da = {
                  ind: index,
                  data: initData
                };
                _self.$store.dispatch("setComponentData", da);

                globalBus.$emit("updateData");
              } else if (_self.currentElement.data.type == "map") {
                console.log(dataset.getChildNodeCount());

                //取结点操作
                let col = [],
                  row = [];

                if (_self.currentElement.data.settings.type === "mapbox") {
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
                }   else if (_self.currentElement.data.type == "chart") {
                //schema只有同级的若干个节点的情况 chart

                let node_len = dataset.getChildNodeCount();
                let arr_len = dataset
                  .getChildNode(0)
                  .getKernel()
                  .getArrayCount();

                //取结点操作
                let col = [],
                  row = [];
                for (let j = 0; j < node_len; j++) {
                  col.push(dataset.getChildNode(j).getName());
                }

                for (let i = 0; i < arr_len; i++) {
                  let obj = {};
                  for (let j = 0; j < node_len; j++) {
                    obj[col[j]] = dataset
                      .getChildNode(j)
                      .getKernel()
                      .getTypedValueByIndex(i);
                  }
                  row.push(obj);
                }
                //当前点击的组件索引
                let index = _self.$store.state.currentElementIndex;

                //初始化数据
                let initData = {
                  type: "chart",
                  settings: {
                    type:
                      _self.$store.state.chartData.elements[index].data.settings.type //类型
                  },
                  datacon: {
                    type: "raw",
                    connectId: "",
                    data: {
                      columns: col,
                      rows: row
                    },
                    getUrl: "",
                    interval: 2
                  },
                  generated: {
                    columns: col,
                    rows: row
                  }
                };

                let da = {
                  ind: index,
                  data: initData
                };
                console.log("chart", da);
                _self.$store.dispatch("setComponentData", da);
              }

              }
        });
      }
     
    },
    //选择色带后显示
    choose_color_bar(item) {
      this.color_bar_value = "选中第" + item.id + "色带";
      sessionStorage.colorJson = JSON.stringify(
        this.ramp_obj.getSingleRamp(item.id)
      );
      //改变色带时监听vuex中数据变化
      this.$store.dispatch("changeColor", item.id);
      this.$store.dispatch("setColorCount", this.ramp_obj);

      var c = document.getElementById("nowShow");
      var cxt = c.getContext("2d");

      for (var x = 0; x < this.ramp_obj.colorCount; ++x) {
        var rgb = this.ramp_obj.getSingleRamp(item.id)[x.toString()];
        cxt.fillStyle = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
        cxt.fillRect(x / 2, 0, (x + 1) / 2, 20);
      }
    },
    //初始化色带
    readyColorBars() {
      this.thisKey = "data";
      this.ramp_obj = new ramp.Ramp();
      let ramp1 = this.ramp_obj;
      var ColorJson = {};
      var canvasName = "mycanvas";
      this.cavas_name = "mycanvas";

      //拼装Data
      var DataArray = new Array();

      for (var i = 0; i < ramp1.rampCount; i++) {
        var ColorItem = {};
        ColorItem = {
          text:
            '<canvas id = "' +
            canvasName +
            (i + 1).toString() +
            '" width = "188" height = "20" ref="mycavs' +
            i +
            '"> </canvas>',
          id: i + 1
        };
        DataArray.push(ColorItem);
      }

      this.color_bar = DataArray;
      //若已选择色带则加载记忆
      if (this.color_bar_value != "") {
        let obj = {};
        obj.id = this.color_bar_value.match(/\d+/)[0];
        this.choose_color_bar(obj);
      }
    },
    initCOlorBar() {
      let ramp1 = this.ramp_obj;
      let canvasName = this.cavas_name;

      setTimeout(() => {
        for (var j = 1; j <= ramp1.rampCount; j++) {
          var c = document.getElementById(canvasName + j.toString());
          // let c=this.$refs.mycavs+j
          var cxt = c.getContext("2d");
          for (var x = 0; x < ramp1.colorCount; ++x) {
            var rgb = ramp1.getSingleRamp(j)[x.toString()];
            cxt.fillStyle = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
            cxt.fillRect(x / 2, 0, (x + 1) / 2, 20);
          }
        }
      }, 200);
    },
    visual_grid() {
      let _self = this;
      let index = _self.$store.state.currentElementIndex;

      let initData = {
        type: "chart",
        settings: {
          type: _self.$store.state.chartData.elements[index].data.settings.type //类型
        },
        datacon: {
          type: "raw",
          connectId: "",
          data: {
            columns: _self.visual_data.imgData,
            rows: [_self.visual_data.rows, _self.visual_data.cols]
          },
          getUrl: "",
          interval: 2
        },
        generated: {
          columns: [_self.visual_data.imgData],
          rows: [_self.visual_data.rows, _self.visual_data.cols]
        }
      };
      this.canvas_preview = false;

      let da = {
        ind: index,
        data: initData
      };

      _self.$store.dispatch("setComponentData", da);
    }
  }
};
</script>

<style lang="scss" scoped>
.config,
.component-config {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background: #ffffffe9;
  color: #515151;
  box-shadow: -4px 0 4px #00000005;
  padding: 0;
  overflow: hidden;
}

.public-config,
.component-config .panel {
  flex: 1;
  overflow-y: scroll;
}

.panel-selector {
  z-index: 100;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.06);
  .radio-group {
    text-align: center;
    .radio-btn {
      display: inline-block;
      padding: 10px 20px;
      margin: 0 10px;
      color: #999999;
      &.active {
        color: #212121;
        border-bottom: 2px solid #212121;
      }
    }
  }
}

.config-box {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin: 0;
  padding: 14px 20px;
  .title {
    font-weight: bold;
    font-size: 0.86rem;
    margin-bottom: 12px;
  }
  .btn {
    display: inline-block;
    width: 32px;
    height: 32px;
    line-height: 32px;
    margin: 5px 5px 5px 0;
    text-align: center;
    border-radius: 8px;
    transition: all 0.3s ease;
    color: #999;
    &:hover {
      cursor: pointer;
      background-color: rgba(64, 160, 255, 0.1);
      color: #666666;
    }
    &.active {
      background-color: rgba(64, 160, 255, 0.1);
      color: #409eff;
    }
    .iconfont {
      font-size: 22px;
    }
  }
}

.component-config /deep/ .jsoneditor-menu {
  display: none;
}

.num-input {
  .el-input-group__prepend {
    background-color: #ffffff !important;
  }
}

.code-box {
  width: 260px;
  max-height: 200px;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  padding: 6px;
  overflow: scroll;
  box-sizing: border-box;
}

// image upload
.bg-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  width: 260px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.bg-uploader /deep/ .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.bg-preview-wrapper {
  width: 100%;
  height: 150px;
  .bg-preview {
    max-width: 100%;
    height: 100%;
    margin: 0 auto;
  }
}
</style>
