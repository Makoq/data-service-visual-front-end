<template  >
  <div>
    <el-row v-loading="loading">
      <el-col :span="5">
         <h3>{{$t('udx_schema.schema_tree')}}</h3>
        <el-row>
         
           
          <el-select v-model="value" placeholder="请选择" @change="selectValue">
            <el-option
              v-for="item in configList"
              :key="item.value"
              :label="item.schema"
              :value="item.schema"
            ></el-option>

          </el-select>

          <div id="treeview" class="treeview"></div>
        </el-row>

        <!-- <el-row>
          <h3>{{$t('udx_schema.udx_data_list')}}</h3>
          <el-table :data="udx_schema_data" style="width: 100%">
            <el-table-column prop="data" :label="$t('udx_schema.data_list')" width="180"></el-table-column>
          </el-table>
        </el-row> -->
      </el-col>

      <el-col :span="19">
        <h3>{{$t('udx_schema.data_show')}}</h3>
       
        <el-row>
          <el-col :span="10">
             <label style="color:green">Select: </label>
           <el-select v-model="dataValue" placeholder="请选择" @change="selectValue2">
            <el-option
              v-for="item in dataList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
           
          </el-select>

          </el-col>
          <el-col :span="10">
          <el-button type="text"      icon="el-icon-paperclip"   @click="toInternet()">Online Source</el-button>

          </el-col>

          
         
          
         
        </el-row>
        <!-- <hr /> --><br/>
         
        <el-card style="height:450px; ">
    <div id="mydiv" style="display:none">mydiv</div>
          
          <!-- TODO 右边部分功能面板 -->
          <table id="tb_block">
            <tr>
              <td id="blocklyArea"></td>
              <td style="width: 1px;height: 100%; background: darkgray;"></td>
               
              <td id="td_udx_schema" style="background: #f3f3f3;">
                
                <!-- jstree -->
                <!-- <div id="treeview1" class="treeview"></div> -->
               
                <div id="udx_data_show" >
                  
                  {{test  }}</div>
              </td>
            </tr>
          </table>

          <div id="blocklyDiv2" style="position: absolute"></div>


        </el-card>
        <br/>
         
        <el-button type="success"    icon="el-icon-caret-right" size="mini" @click="showCode()">Run</el-button>
        <el-button type="primary" icon="el-icon-check" size="mini" @click="save()">Save Code</el-button>
        <el-button type="danger" icon="el-icon-folder-opened" size="mini" @click="blockLogList()">Open Log</el-button>
        <!-- congigureLogDialogVisible = true -->
        <el-dialog
          title="提示"
          :visible.sync="congigureLogDialogVisible"
          width="30%"
           > 
         <el-table 
         :data="blockList" 
         @row-click="addBlockLog"
         style="width: 100%">
            <el-table-column prop="name" :label="$t('data.name')" width="180"></el-table-column>
            <el-table-column prop="time" :label="$t('data.date')" width="180"></el-table-column>
          
          </el-table>


          <span slot="footer" class="dialog-footer">
           
            <el-button type="primary" @click="congigureLogDialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
         
          <!--
        <el-button type="primary" icon="el-icon-edit-outline" size="mini"></el-button>

          <el-button type="info" icon="el-icon-message" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-button type="danger"  icon="el-icon-share" size="mini"></el-button> -->
      </el-col>
      
    </el-row>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import httpUtils from "../../utils/httpUtils";
import urlUtils from "../../utils/urlUtils";

import bus from "../../assets/eventBus";
import tools from "../../utils/tools";
import { constants, scrypt } from "crypto";
import { thisExpression } from "babel-types";

import Vue from 'vue';

export default {
  props: ["user"],
  data() {
    return {
     
      udx_schema: [],
      udx_schema_data: [],
      jstree_node: [],
      index: 1,
      isfirst: true,

      configList: [],
      dataValue:'',
      dataListObj:{},
      dataList:[],
      value: "",
      tableObj: {},
      jstree: [],

      schemaxml:'',
      test:'',
       congigureLogDialogVisible: false,
       blockList:[] ,
       loading:false,
       
    };
  },
  computed: {},
  mounted() {
    // if (!this.user.uid) {
    //   this.logout();
    // }

    const blocklyArea = document.getElementById('blocklyArea');
    const blocklyDiv2 = document.getElementById('blocklyDiv2');

    const myWorkspace2 = Blockly.inject(blocklyDiv2, {
      media: 'libs/blockly/media/',
      toolbox: document.getElementById('toolbox2'),
    });

    Vue.prototype.$myWorkspace2 = myWorkspace2;

    const onresize = function (e) {
      // Compute the absolute coordinates and dimensions of blocklyArea.
      let element = blocklyArea;
      let x = 0;
      let y = 0;
      do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      } while (element);
      // Position blocklyDiv2 over blocklyArea.
      blocklyDiv2.style.left = `${x-300}px`;
      blocklyDiv2.style.top = `${y-110}px`;
      blocklyDiv2.style.width = `${blocklyArea.offsetWidth}px`;
      blocklyDiv2.style.height = `${blocklyArea.offsetHeight}px`;
      Blockly.svgResize(myWorkspace2);
    };
    
    window.addEventListener('resize', onresize, false);
    onresize();
    Blockly.svgResize(myWorkspace2);

    

    //初始化页面时初始化schema树
    this.defaultSchemaInfo();
    this.initJsTree(null);
    this.initJsExtractTree(null);

     


  },
  methods: {
    toInternet(){
      let a=document.createElement('a')
      document.body.appendChild(a)
      a.setAttribute('display','none')
      a.setAttribute('href','http://geomodeling.njnu.edu.cn/dataItem/repository')
      a.target='blank'
      a.click()
    },
    selectValue(v) {
      this.udx_schema_data = this.tableObj[v];
      this.dataList=this.dataListObj[v]
      this.dataValue=this.dataListObj[v][0]
      this.getSchemaContent(v);
      this.getUdxDataXml(this.dataValue)
    },
    selectValue2(v){
        
      this.getUdxDataXml(v)

     
    },
    getUdxDataXml(schemaData){//拿到数据流文件
      
      httpUtils.get(this, `${urlUtils.udx_data_xml}?id=${this.$route.query.id}&schemaData=${schemaData}`, data => {
          this.schemaxml=data
         
          this.$message({
                type: "success",
                message: "ready to operate udx data: "+schemaData
        });

      })
    },
    defaultSchemaInfo() {
      const { id } = this.$route.query;
      httpUtils.get(this, `${urlUtils.default_udx_info}?id=${id}`, data => {
        this.configList = data;
        this.value = data[0].schema;

        this.dataList=data[0].data

        this.getSchemaContent(this.value);
        let tableList = new Object();

        for (let i = 0; i < data.length; i++) {
          tableList[data[i].schema] = [];
          for (let j = 0; j < data[i].data.length; j++) {
            let obj = {};
            obj["data"] = data[i].data[j];
            tableList[data[i].schema].push(obj);
          }
        }

        this.tableObj = tableList;
        this.udx_schema_data = tableList[this.value]; //初始化data table



        let dataList=new Object();

        for(let j=0;j<data.length;j++){
          dataList[data[j].schema]=data[j].data
        }
        this.dataListObj=dataList;
        this.dataValue=this.dataListObj[data[0].schema][0]

        setTimeout(()=>{
           this.getUdxDataXml(this.dataValue)
        },1000)
       
      });
    },
    initJsTree(data) {
      $("#treeview").jstree({
        type: {
          default: {
            icon: false
          }
        },
        core: {
          multiple: false,
          data,
          dblclick_toggle: false
        },
        plugins: ["search"]
      });
    },
    initJsExtractTree(data){
         $("#treeview1").jstree({
        type: {
          default: {
            icon: false
          }
        },
        core: {
          multiple: false,
          data,
          dblclick_toggle: false
        },
        plugins: ["search"]
      });
    },
    getSchemaContent(schema) {
      const { id } = this.$route.query;

      httpUtils.get(
        this,
        `${urlUtils.udx_node}?id=${id}` + "&schema=" + schema,
        data => {
          this.schemaxml=data.xml

          var nodes = new tools.UdxNode();

          tools.trans_new(
            {
              UdxNode: data.json.UdxDeclaration.UdxNode
            },
            nodes
          );
          tools.reset();

          //  this.initJsTree(nodes.children);
          // 更新tree的数据
          $("#treeview").jstree(true).settings.core.data = nodes.children;
          $("#treeview")
            .jstree(true)
            .refresh();


            $("#treeview1").jstree(true).settings.core.data = nodes.children;
          $("#treeview1")
            .jstree(true)
            .refresh();


        }
      );
    },
    removeToken(code){
      console.log("code",code[0])
      let tp=0
     
      for(let i=0;i<code.length;i++){
        if(code[i]==='(') tp++;

        else break
      }

      return code.slice(tp,-2-tp)


    },
    showCode() {
      // Generate JavaScript code and display it.
      // console.log("data",this.schemaxml)

      var dataset = new UdxDataset();
      dataset.createDataset();
      dataset.loadFromXmlStream(this.schemaxml);
 
      
      
      // console.log("count",dataset.getChildNode(1).getName())
      
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      let code = Blockly.JavaScript.workspaceToCode(this.$myWorkspace2);

      if(code.startsWith('(')){
         code=this.removeToken(code)
         
         console.log(code)
       }
      

      let obj;
      
      try{
        obj=eval(code)
        
       
       
        if(typeof obj=="number"){
          $('#udx_data_show').removeClass('showData')
          $('#udx_data_show').addClass('showData_2')
    
          this.test=obj
        }else if(typeof obj=="string"){
          this.test=obj
        }
        // else if(typeof obj=="object"){
        //   alert("can`t show raw node object,please get() its attribute!")
        // }
        else if(obj.formatToXmlStream instanceof Function){
          // $('#udx_data_show').removeClass('showData_2')
          
          $('#udx_data_show').addClass('showData')
          try{
            this.test=obj.formatToXmlStream()
          }catch(e){
            alert("node select error!")
          }

          
        }else{
          alert("Uncaught SyntaxError: Unexpected identifier!!")
        }
          
      }catch(err){
        alert(err)
      }


     
    },
    save() {
      // Generate XML and set attributes.

      this.loading=true
      const xmlDom = Blockly.Xml.workspaceToDom(this.$myWorkspace2);
      xmlDom.id = 'workspaceBlocks';
      xmlDom.setAttribute('style', 'display: none');
      const baseXml='<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none"/>'
      const xmlStr = new XMLSerializer().serializeToString(xmlDom);
      let config_code_name=prompt("input name of your blocks")
      console.log("CFG",config_code_name)
 
      if(!config_code_name){//prompt取消，则直接返回
       this.loading=false;
          return
        }

      if(config_code_name.length!=0){//prompt有值，则请求后台

        if(baseXml===xmlStr){
           this.loading=false;
          alert("empty content can't be saved!")
          return
        }
        localStorage.setItem(config_code_name,xmlStr)
        httpUtils.get(this,urlUtils.insert_block_log+"?name="+config_code_name,data=>{
          setTimeout(()=>{
             if(data==="ok"){
               this.loading=false;
            this.$alert("save ok")
          }
          },1500)
         

        })

        

        const xml = document.getElementById('workspaceBlocks');
        if (xml != undefined) document.getElementById('mydiv').removeChild(xml);


      }else{
        console.log("empty")
        setTimeout(()=>{
          this.loading=false;
          alert("input can not be empty!!")
        },1500)
         
        
      }

    },
    blockLogList(){
       httpUtils.get(this,urlUtils.block_log,data=>{

          this.blockList=data
          this.congigureLogDialogVisible=true
        })
    },
    addBlockLog(row){
       console.log("name",row.name)
      if(row.name){
      this.load(row.name)

      }
    },
    load(k) {
      if (localStorage.getItem(k) != undefined) {
          
          const mydiv = document.getElementById('mydiv');
          mydiv.innerHTML =''

        const xml = document.getElementById('workspaceBlocks');
        if (xml == undefined) {
          const mydiv = document.getElementById('mydiv');
          mydiv.innerHTML =localStorage.getItem(k) ;
        }

        Blockly.Xml.domToWorkspace(
          document.getElementById('workspaceBlocks'),
          this.$myWorkspace2,
        );
        


      }
    },
  

  },

  destroyed() {}
};
</script>
<style  >
.treeview {
  margin-top: 20px;
}
.el-card__body {
  height: 100%;
}
#tb_block {
  height: 90%;
  width: 100%;
  align-self: auto;
}

#blocklyArea {
  /* height: 90%; */
  width: 65%;
    
}
.showData{
  text-align: center;
      color: crimson;
    overflow-y: scroll;
    height: 100%;
}
.showData_2{
  text-align: center;
      color: crimson;
   
     
}
</style>
