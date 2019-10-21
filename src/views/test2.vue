<template>
  <div>
    <p>vue-json-editor</p>

    <vue-json-editor v-model="json" :show-btns="true" @json-change="onJsonChange"></vue-json-editor>
    <vue-canvas></vue-canvas>
    <el-button @click="udx_dataset()">udx_dataset</el-button>
  </div>
</template>
 
<script>
import vueJsonEditor from "vue-json-editor";
import tools from "../utils/tools";
import httpUtils from "../utils/httpUtils";

import vueCanvas from '../components/leaflet/vueCanvas';

export default {
  data() {
    return {
      json: {
        columns: ["日期", "访问用户"],
        rows: [
          {
            日期: "1月1日",
            访问用户: 1523
          },
          {
            日期: "1月2日",
            访问用户: 1223
          },
          
        ]
      },
      img: ""
    };
  },

  components: {
    vueJsonEditor,
    vueCanvas
  },

  methods: {
    onJsonChange(value) {
      console.log("value:", value);
    },
    udx_dataset() {
      httpUtils.get(this, "http://localhost:8897/testChart", data => {
        
        
        var dataset = new UdxDataset();
        dataset.createDataset();
        dataset.loadFromXmlStream(data);

        //取结点操作，这里去了两个结点的值
         let x_value=[],y_value=[]
        for(let i=0;i<7;i++){
            x_value.push(dataset.getChildNode(0).getKernel().getTypedValueByIndex(i))
            y_value.push(dataset.getChildNode(1).getKernel().getTypedValueByIndex(i))

        }
        
        console.log("DATASET", dataset);
        console.log("x__val", x_value);
        console.log("y__val", y_value);


      });
    }
  }
};
</script>