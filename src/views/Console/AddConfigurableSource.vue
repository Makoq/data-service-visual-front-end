
<template>
  <div id="block_container">
    

    <div id="mydiv" style="display:none">mydiv</div>

    <el-row>
      <el-button type="success" icon="el-icon-caret-right" size="mini" @click="showCode()">Run</el-button>
      <el-button type="success" icon="el-icon-check" size="mini" @click="save()"></el-button>
      <el-button type="danger" icon="el-icon-folder-opened" size="mini" @click="blockLogList()"></el-button>
      <el-dialog title="提示" :visible.sync="congigureLogDialogVisible" width="30%">
        <el-table :data="blockList" @row-click="addBlockLog" style="width: 100%">
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

    <table id="tb_block">
      <tr>
        <td id="blocklyArea"></td>
        <td style="width: 1px;height: 100%; background: darkgray;"></td>
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
export default {
  data() {
    return {
      test: "",
      congigureLogDialogVisible: false,
      blockList: []
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

    myWorkspace.addChangeListener(event => {
      console.log(event.type, event.element);
      // Blockly.Events.CREATE||
      if (event.element == "click") {
        const block = myWorkspace.getBlockById(event.blockId);
        if (block) console.log(block, block.type);
      }
    });

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
  },
  methods: {
    save() {
      // Generate XML and set attributes.
      const xmlDom = Blockly.Xml.workspaceToDom(this.$myWorkspace);
      xmlDom.id = "workspaceBlocks";
      xmlDom.setAttribute("style", "display: none");
      const baseXml =
        '<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none"/>';
      const xmlStr = new XMLSerializer().serializeToString(xmlDom);
      console.log(xmlStr);
      let config_code_name = prompt("input name of your blocks");

      if (!config_code_name) {
        //prompt取消，则直接返回
        return;
      }

      if (config_code_name != "") {
        //prompt有值，则请求后台

        if (baseXml === xmlStr) {
          alert("empty content can't be saved!");
          return;
        }
        localStorage.setItem(config_code_name, xmlStr);
        httpUtils.get(
          this,
          urlUtils.insert_block_log + "?name=" + config_code_name,
          data => {
            setTimeout(() => {
              if (data === "ok") {
                this.$alert("save ok");
              }
            }, 1500);
          }
        );

        const xml = document.getElementById("workspaceBlocks");
        if (xml != undefined) document.getElementById("mydiv").removeChild(xml);
      } else {
        alert("input can not be empty!!");
      }
    },
    blockLogList() {
      httpUtils.get(this, urlUtils.block_log, data => {
        this.blockList = data;
        this.congigureLogDialogVisible = true;
      });
    },
    addBlockLog(row) {
      if (row.name) {
        this.load(row.name);
      }
    },

    load(k) {
      if (localStorage.getItem(k) != undefined) {
        const xml = document.getElementById("workspaceBlocks");
        if (xml == undefined) {
          const mydiv = document.getElementById("mydiv");
          mydiv.innerHTML = localStorage.getItem(k);
        }

        Blockly.Xml.domToWorkspace(
          document.getElementById("workspaceBlocks"),
          this.$myWorkspace
        );
      }
    },
    showCode() {
      // Generate JavaScript code and display it.
      // console.log("data",this.schemaxml)

      var dataset = new UdxDataset();
      dataset.createDataset();
      dataset.loadFromXmlStream(this.schemaxml);

      // console.log("count",dataset.getChildNode(1).getName())

      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      const code = Blockly.JavaScript.workspaceToCode(this.$myWorkspace);

      console.log(code);

      let obj;

      try {
        obj = eval(code);
        console.log("result", eval(code));
        console.log(typeof obj);
        if (typeof obj == "number") {
          $("#udx_data_show").removeClass("showData");
          $("#udx_data_show").addClass("showData_2");

          this.test = obj;
        } else if (typeof obj == "string") {
          this.test = obj;
        }
        // else if(typeof obj=="object"){
        //   alert("can`t show raw node object,please get() its attribute!")
        // }
        else if (obj.formatToXmlStream instanceof Function) {
          // $('#udx_data_show').removeClass('showData_2')

          $("#udx_data_show").addClass("showData");
          try {
            this.test = obj.formatToXmlStream();
          } catch (e) {
            alert("node select error!");
          }
        } else {
          alert("Uncaught SyntaxError: Unexpected identifier!!");
        }
      } catch (err) {
        alert(err);
      }
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
  width: 45%;
  /* height: 90%; */
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
