
<template>
  <div id="block_container">
    <div id="mydiv" style="display:none">mydiv</div>

    <el-row>
      <el-button type="success" icon="el-icon-caret-right" size="mini" @click="showCode()">Run</el-button>
      <!-- <el-button type="primary" icon="el-icon-dish" size="mini" @click="showData()">Data Source</el-button> -->

      <el-button type="warning" icon="el-icon-check" size="mini" @click="save()">Save Code</el-button>
      <el-button
        type="danger"
        icon="el-icon-folder-opened"
        size="mini"
        @click="blockLogList()"
      >Code Log</el-button>
      <!-- block log list -->
      <el-dialog title="Configure Log" :visible.sync="congigureLogDialogVisible" width="30%">
        <el-table :data="blockList" @row-click="addBlockLog" style="width: 100%;">
          <el-table-column prop="name" :label="$t('data.name')" width="180"></el-table-column>
          <el-table-column prop="time" :label="$t('data.date')" width="180"></el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="congigureLogDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>

      <!-- <el-button type="warning" icon="el-icon-download" size="mini" @click="showCode()"></el-button> -->
      <!-- <el-button type="primary" icon="el-icon-edit-outline" size="mini"></el-button> -->
      <!-- <el-button type="info" icon="el-icon-message" size="mini"></el-button> -->
      <!-- <el-button type="danger" icon="el-icon-delete" size="mini"></el-button> -->
      <!-- <el-button type="danger" icon="el-icon-share" size="mini"></el-button> -->
    </el-row>
    <hr />

    <table id="tb_block" v-loading="loading">
      <tr>
        <td id="blocklyArea"></td>
        <td style="width: 1px;height: 100%; background: darkgray;"></td>
        <td id="selsctData">
          <el-card style="height:100%;overflow-y: scroll">
            <el-tabs v-model="dataSourceTab" @tab-click="tab_click">
              <el-tab-pane label="udx" name="udx">
                <el-collapse v-model="activeItem" accordion @change="CollapseSwitch">
                  <el-collapse-item
                    :title="item.name"
                    :name="item.id"
                    v-for="(item,ind) in udxDataList"
                    :key="ind"
                  >
                    <!-- <div>{{item.localPath}}</div>
                    -->
                    <div :id="item.id">{{item.id}}</div>

                    <el-button icon="el-icon-check" size="mini" @click="copy(item.id)"></el-button>
                    <el-row style="background:rgb(243, 250, 255)">
                      <label style="color:green">
                        <strong>Schema:</strong>
                      </label>

                      <el-select
                        style="margin-left:0px"
                        v-model="value"
                        placeholder="请选择"
                        @change="selectValue"
                      >
                        <el-option
                          v-for="item in configList"
                          :key="item.value"
                          :label="item.schema"
                          :value="item.schema"
                        ></el-option>
                      </el-select>
                      <hr />

                      <div :id="'treeview'+item.id" class="treeview"></div>
                      <hr />
                      <label style="color:green">
                        <strong>Data:</strong>
                      </label>
                      <el-select
                        style="margin-left:20px"
                        v-model="dataValue"
                        placeholder="请选择"
                        @change="selectValue2"
                      >
                        <el-option v-for="item in dataList" :key="item" :label="item" :value="item"></el-option>
                      </el-select>
                    </el-row>
                  </el-collapse-item>
                </el-collapse>
                  <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
              </el-tab-pane>
              <el-tab-pane label="src" name="src">
                <!-- TODO SRC -->
                <el-collapse accordion>
                  <el-collapse-item title="一致性 Consistency" name="1">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                  </el-collapse-item>

                  <el-collapse-item title="反馈 Feedback" name="2">
                    <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
                    <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>
              <el-tab-pane label="config" name="config">
                <!-- TODO Config -->
                <el-collapse accordion>
                  <el-collapse-item title="一致性 Consistency" name="1">
                    <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                    <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                  </el-collapse-item>
                </el-collapse>
              </el-tab-pane>

              <el-tab-pane label="create" name="create">
                <!-- TODO Create -->
                 <div id="create_tree"></div>
                 <el-button @click="te">s</el-button>
              </el-tab-pane>


            
            </el-tabs>
          </el-card>
        </td>
        <td id="td_udx_schema">
          <div id="udx_data_show">{{test }}</div>
        </td>
      </tr>
    </table>

    <div id="blocklyDiv" style="position: absolute"></div>
  </div>
</template>

<script>
import Vue from "vue";
import httpUtils from "../../utils/httpUtils";
import urlUtils from "../../utils/urlUtils";
import tools from "../../utils/tools";

export default {
  props: ["user"],
  data() {
    return {
      dataSourceTab: "udx",
      configDataSource: false,
      test: [],
      congigureLogDialogVisible: false,
      blockList: [],
      srcList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      udxDataList: [],
      activeItem: "",
      configList: [],

      dataListObj: {},
      dataList: [],
      value: "",
      dataValue: "",
      id: "",
      loading: false,
      createUdxDataDefault:[
                      {
                          "text" : "Root node",
                          "state" : {"opened" : true },
                          "children" : [
                               
                          ]
                    }
                  ],
      jsTreeData:{},
      createUdxDataObj:null
    };
  },
  mounted() {
    const blocklyArea = document.getElementById("blocklyArea");
    const blocklyDiv = document.getElementById("blocklyDiv");

    const myWorkspace = Blockly.inject(blocklyDiv, {
      media: "libs/blockly/media/",
      toolbox: document.getElementById("toolbox")
    });

    Vue.prototype.$myWorkspace = myWorkspace;

    const onresize = function(e) {
      // Compute the absolute coordinates and dimensions of blocklyArea.
      let element = blocklyArea;
      let x = 0;
      let y = 0;
      do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
      } while (element);
      // Position blocklyDiv over blocklyArea.
      blocklyDiv.style.left = `${x}px`;
      blocklyDiv.style.top = `${y}px`;
      blocklyDiv.style.width = `${blocklyArea.offsetWidth}px`;
      blocklyDiv.style.height = `${blocklyArea.offsetHeight}px`;
      Blockly.svgResize(myWorkspace);
    };
    window.addEventListener("resize", onresize, false);
    onresize();
    Blockly.svgResize(myWorkspace);

    // myWorkspace.addChangeListener(event => {
    //   console.log(event.type, event.element);
    //   // Blockly.Events.CREATE||
    //   if (event.element == "click") {
    //     const block = myWorkspace.getBlockById(event.blockId);
    //     if (block) console.log(block, block.type);
    //   }
    // });

    // 设置jstree

    /* TODO: Change toolbox XML ID if necessary. Can export toolbox XML from Workspace Factory. */
    // var toolbox = document.getElementById("toolbox");
    // var options = {
    //   toolbox: toolbox,
    //   collapse: true,
    //   comments: true,
    //   disable: true,
    //   maxBlocks: Infinity,
    //   trashcan: true,
    //   horizontalLayout: false,
    //   toolboxPosition: 'start',
    //   css: true,
    //   media: '../../media/',
    //   rtl: false,
    //   scrollbars: true,
    //   sounds: true,
    //   oneBasedIndex: true,
    //   grid: {
    //     spacing: 20,
    //     length: 1,
    //     colour: '#888',
    //     snap: false
    //   }
    // };

    // /* Inject your workspace */
    // var workspace = Blockly.inject('blocklyDiv', options);

    // /* Load Workspace Blocks from XML to workspace. Remove all code below if no blocks to load */

    // /* TODO: Change workspace blocks XML ID if necessary. Can export workspace blocks XML from Workspace Factory. */
    // var workspaceBlocks = document.getElementById("workspaceBlocks");

    // /* Load blocks to workspace. */
    // Blockly.Xml.domToWorkspace(workspaceBlocks, workspace);

    this.getDataSource("udx_source");
    this.getAllCount("udx_source");
  },
  methods: {
    copyValue(val) {
      //如果这里换为 input 则不支持换行
      var temp = document.createElement("textarea");
      temp.value = val;
      document.body.appendChild(temp);
      temp.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      temp.style.display = "none";
      console.log("复制成功");
    },
    copy(c) {
      this.copyValue(c);
    },
    selectValue(v) {
      this.getSchemaContent(v, this.id);
      this.dataList = this.dataListObj[v];
      this.dataValue = this.dataList[0];
    },
    selectValue2(v) {
      console.log(v);
    },
    getSchemaContent(schema, id) {
      httpUtils.get(
        this,
        `${urlUtils.udx_node}?id=${id}` + "&schema=" + schema,
        data => {
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
          $("#treeview" + id).jstree(true).settings.core.data = nodes.children;
          $("#treeview" + id)
            .jstree(true)
            .refresh();

          $("#treeview1").jstree(true).settings.core.data = nodes.children;
          $("#treeview1")
            .jstree(true)
            .refresh();
        }
      );
    },
    getDataSchemaAndData(id) {
      httpUtils.get(this, `${urlUtils.default_udx_info}?id=${id}`, data => {
        this.configList = data;

        this.value = data[0].schema;
        this.dataValue = data[0].data[0];
        this.dataList = data[0].data;

        let dataList = new Object();

        for (let j = 0; j < data.length; j++) {
          dataList[data[j].schema] = data[j].data;
        }
        this.dataListObj = dataList;

        this.initJsTree(null, id);
        this.initJsExtractTree(null);

        let val = this.value;
        this.getSchemaContent(val, id); //拿到schema

        // setTimeout(() => {
        //   //  this.getUdxDataXml(this.dataValue)//拿到数据流文件
        // }, 1000);
      });
    },
    CollapseSwitch(v) {
      console.log("id", v);
      this.id = v;
      this.getDataSchemaAndData(v);
    },
    tab_click() {
      console.log(this.dataSourceTab);
      if (this.dataSourceTab === "udx") {
        this.getDataSource("udx_source");
        this.getAllCount("udx_source");
      } else if (this.dataSourceTab === "src") {
        //TODO src data source
        // this.getDataSource("udx_source");
        // this.getAllCount('udx_source');
      } else if (this.dataSourceTab === "config") {
        //TODO src data source
        // this.getDataSource("udx_source");
        // this.getAllCount('udx_source');
      }else if (this.dataSourceTab === "create") {
         this.initCreateTree(this.createUdxDataDefault);
         this.createUdxDataObj=new UdxDataset();
         this.createUdxDataObj.createDataset();
      }
    },
    getAllCount(type) {
      httpUtils.get(this, `${urlUtils.data_count}?type=${type}`, data => {
        this.total = data;
      });
    },
    getDataSource(type) {
      httpUtils.get(
        this,
        urlUtils.get_source_list +
          "?type=" +
          type +
          "&username=" +
          this.user.username +
          "&uid=" +
          this.user.uid +
          "&page=" +
          this.currentPage +
          "?pageSize=" +
          this.pageSize,
        data => {
          this.udxDataList = data;
        }
      );
    },

    showData() {
      this.configDataSource = true;
      this.tab_click();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    save() {
      // Generate XML and set attributes.
      const xmlDom = Blockly.Xml.workspaceToDom(this.$myWorkspace);
      xmlDom.id = "workspaceBlocks";
      xmlDom.setAttribute("style", "display: none");
      const baseXml =
        '<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none"/>';
      const xmlStr = new XMLSerializer().serializeToString(xmlDom);
      console.log("save:",xmlStr);
      let config_code_name = prompt("input name of your blocks");
      this.loading = true;
      if (!config_code_name) {
        //prompt取消，则直接返回
        return;
      }

      if (config_code_name != "") {
        //prompt有值，则请求后台

        if (baseXml === xmlStr) {
          alert("empty content can't be saved!");
          this.loading = false;
          return;
        }
        localStorage.setItem(config_code_name, xmlStr);
        httpUtils.get(
          this,
          urlUtils.insert_block_log + "?name=" + config_code_name,
          data => {
            setTimeout(() => {
              if (data === "ok") {
                this.loading = false;
                this.$alert("save ok");
              }
            }, 1500);
          }
        );

        const xml = document.getElementById("workspaceBlocks");
        if (xml != undefined) document.getElementById("mydiv").removeChild(xml);
      } else {
        this.loading = false;
        alert("input can not be empty!!");
      }
    },
    blockLogList() {
      httpUtils.get(this, urlUtils.block_log, data => {
        this.blockList = data.reverse();

        this.congigureLogDialogVisible = true;
      });
    },
    addBlockLog(row) {
      if (row.name) {
        this.load(row.name);
      }
    },

    load(k) {
      const mydiv = document.getElementById("mydiv");
      mydiv.innerHTML = "";
      if (localStorage.getItem(k) != undefined) {
        const xml = document.getElementById("workspaceBlocks");
        if (xml == undefined) {
          const mydiv = document.getElementById("mydiv");
          mydiv.innerHTML = localStorage.getItem(k);
          console.log("load", localStorage.getItem(k))
        }

        Blockly.Xml.domToWorkspace(
          document.getElementById("workspaceBlocks"),
          this.$myWorkspace
        );
      }
    },
    getUdxDataXml(schemaData, id) {
      //拿到数据流文件

      httpUtils.get(
        this,
        `${urlUtils.udx_data_xml}?id=${id}&schemaData=${schemaData}`,
        data => {
          // this.schemaxml=data
          if (data) {
            return data;
          }
          //   this.$message({
          //         type: "success",
          //         message: "ready to operate udx data: "+schemaData
          // });
        }
      );
    },
    removeToken(code) {
      console.log("code", code[0]);
      let tp = 0;

      for (let i = 0; i < code.length; i++) {
        if (code[i] === "(") tp++;
        else break;
      }

      return code.slice(tp, -2 - tp);
    },
    showCode() {
      // Generate JavaScript code and display it.

      // var dataset = new UdxDataset();
      // dataset.createDataset();
      // dataset.loadFromXmlStream(this.schemaxml);

      this.test = [];
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;

      let code = Blockly.JavaScript.workspaceToCode(this.$myWorkspace);
      // console.log("origin",code)

      // eval('var arr=[]')
      // console.log(eval("function f(){ var arr=[];"+code+" return arr;}f();"))
      // console.log(eval(code));
     

      var ds_array = code.match(/ds_(.+)_ds/g);

      console.log(ds_array)

      var code_getdataset =
        "fetch($url)" + ".then(res => res.json())" + ".then($ds_node => {";
 
      var code_all = "",formmer_id='',fommer_name='',formmer_ds_id='';
      for (var i = 0; i < ds_array.length; i++) {
        let ds = ds_array[i];
        let ds_name_str = ds.match(/name(.+)name/g)[0];
        let ds_id_str = ds.match(/id(.+)id/g)[0];

        let ds_name = ds_name_str.substring(5, ds_name_str.length - 5);
        let ds_id = ds_id_str.substring(3, ds_id_str.length - 3);
        let  ds_id_=ds_id.replace(/_/g,'-')
        
        
        if(i===0){
        code_getdataset = code_getdataset.replace("$url","\'/api/schemadataxml?id="+ds_id_+"&schemaData="+ds_name+".xml\'");
        code_getdataset = code_getdataset.replace("$ds_node", "ds_" + ds_id);
        
       
        }else{
        code_getdataset = code_getdataset.replace(formmer_id,ds_id_);
        code_getdataset = code_getdataset.replace(fommer_name,ds_name);
        code_getdataset = code_getdataset.replace(formmer_ds_id,ds_id);
         
        }
        formmer_id=ds_id_
        fommer_name=ds_name
        formmer_ds_id=ds_id

        
        

        code_all += code_getdataset;
        //  code_all +='console.log(\'id\', ds_'+ ds_id+');'
        code_all += 'var '+ ds + '= new UdxDataset(); ';
        code_all +=  ds + '.createDataset(); ';

        code_all += ds + '.loadFromXmlStream('+"ds_" + ds_id+'.data);';
         code_all +='console.log(\'id\','+ ds+');'
         code_all+=ds+'//dosome\n'
      }

      code_all += code ;

      for (var i = 0; i < ds_array.length; i++) {
        code_all += " \n});";
      }
       
 
      console.log("code",code);
      console.log("cco:",code_all)
      eval(code_all);

      // console.log(eval(
      //   'function ff(){'

      //   +'return '
      //   +code

      //   +'};ff();'

      // ))

      // setTimeout(() => {
      //   console.log('app_node',app_node);
      //   // this.test=app_node;
      // }, 500);

      //  console.log(code.getChildNodeCount());

      // console.log(eval(this.getUdxDataXml) )
      // let par=code.split(",")
      // let id=par[0].split("'")[1]
      // let name=par[1].split("'")[1]
      // console.log(id)
      // console.log(name)
      // console.log('function f(){ var _'+id+'=new  UdxDataset(); return '+id+'};f();')
      // console.log(eval('function f(){ var '+id+'=new  UdxDataset(); return '+id+'};f();'))

      // let obj;
      // console.log("ad",eval(code)) ;
      // try {
      //   obj = eval(code);
      //   // console.log("result", eval(code));
      //   // console.log(typeof obj);
      //   if (typeof obj == "number") {
      //     $("#udx_data_show").removeClass("showData");
      //     $("#udx_data_show").addClass("showData_2");

      //     this.test = obj;
      //   } else if (typeof obj == "string") {
      //     this.test = obj;
      //   }
      //   // else if(typeof obj=="object"){
      //   //   alert("can`t show raw node object,please get() its attribute!")
      //   // }
      //   else if (obj.formatToXmlStream instanceof Function) {
      //     // $('#udx_data_show').removeClass('showData_2')

      //     $("#udx_data_show").addClass("showData");
      //     try {
      //       this.test = obj.formatToXmlStream();
      //     } catch (e) {
      //       alert("node select error!");
      //     }
      //   } else {
      //     alert("Uncaught SyntaxError: Unexpected identifier!!");
      //   }
      // } catch (err) {
      //   alert(err);
      // }
    },

    runCode() {
      // Generate JavaScript code and run it.
      window.LoopTrap = 1000;
      Blockly.JavaScript.INFINITE_LOOP_TRAP =
        'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
      const code = Blockly.JavaScript.workspaceToCode(this.$myWorkspace);
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      try {
        console.log(code);
        eval(code);
      } catch (e) {
        alert(e);
      }
    },
    initJsExtractTree(data) {
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
    initJsTree(data, id) {
      $("#treeview" + id).jstree({
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
    initCreateTree(data){

       $('#create_tree').jstree({
                'core' : {
                  "check_callback" : true ,
                  data
                },

                "plugins" : ["contextmenu","dnd"]
              });
             
    },
    te(){
       
       
      var instance = $('#create_tree').jstree(true);
      this.jsTreeData=instance._model.data;

      console.log(this.jsTreeData);
      console.log(this.jsTreeData['#'].children[0]);

      console.log(this.createUdxDataObj);

    },
    jsTreeDataToUdxDataSet(){
      var rootId=this.jsTreeData['#'].children[0];
      
      var nodeId=this.jsTreeData[rootId].children

      




    }

  }
};
</script>

<style scoped>
#block_container {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
#selsctData {
}
.treeview {
  margin-top: 20px;
}

#tb_block {
  height: 90%;
  width: 100%;
  align-self: auto;
}

#blocklyArea {
  /* height: 90%; */
  width: 55%;
}

#td_udx_schema {
  border: 1px solid #ccc;
  width: 25%;
  /* height: 90%; */
}
#selsctData {
  border: 1px solid #ccc;
}
#treeview1 {
  margin-top: 0px;
  padding-left: 0px;
}
.showData {
  text-align: center;
  overflow-y: scroll;
  height: 100%;
}
.showData_2 {
  text-align: center;
}
</style>
