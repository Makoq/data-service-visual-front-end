
<template>
  <div id="block_container">
    <!-- <el-row>
      <el-row>
        <el-button icon="el-icon-search" size="mini"></el-button>
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <el-button type="success" icon="el-icon-check" size="mini"></el-button>
        <el-button type="info" icon="el-icon-message" size="mini"></el-button>
        <el-button type="warning" icon="el-icon-star-off" size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
      </el-row>
      <hr />
      <el-col :span="12">

      </el-col>
      <el-col :span="12">
        <div style="border: 1px solid #ccc">adsad</div>
      </el-col>
    </el-row>-->
    <el-row>
      <el-button type="danger" icon="el-icon-folder-opened" size="mini"></el-button>
      <el-button type="warning" icon="el-icon-download" size="mini" @click="showCode()"></el-button>
      <el-button type="primary" icon="el-icon-edit-outline" size="mini"></el-button>
      <el-button type="success" icon="el-icon-check" size="mini"></el-button>
      <el-button type="info" icon="el-icon-message" size="mini"></el-button>
      <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
      <el-button type="danger" icon="el-icon-share" size="mini"></el-button>
    </el-row>
    <hr />

    <table id="tb_block">
      <tr>
        <td id="blocklyArea"></td>
        <td style="width: 1px;height: 100%; background: darkgray;"></td>
        <td id="td_udx_schema">
          <!-- jstree -->
          <div id="treeview1" class="treeview"></div>
        </td>
      </tr>
    </table>

    <div id="blocklyDiv" style="position: absolute"></div>
  </div>
</template>

<script>
import Vue from 'vue';

export default {
  mounted() {
    const blocklyArea = document.getElementById('blocklyArea');
    const blocklyDiv = document.getElementById('blocklyDiv');

    const myWorkspace = Blockly.inject(blocklyDiv, {
      media: 'libs/blockly/media/',
      toolbox: document.getElementById('toolbox'),
    });

    Vue.prototype.$myWorkspace = myWorkspace;

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
      // Position blocklyDiv over blocklyArea.
      blocklyDiv.style.left = `${x}px`;
      blocklyDiv.style.top = `${y}px`;
      blocklyDiv.style.width = `${blocklyArea.offsetWidth}px`;
      blocklyDiv.style.height = `${blocklyArea.offsetHeight}px`;
      Blockly.svgResize(myWorkspace);
    };
    window.addEventListener('resize', onresize, false);
    onresize();
    Blockly.svgResize(myWorkspace);

    myWorkspace.addChangeListener((event) => {
      console.log(event.type, event.element);
      // Blockly.Events.CREATE||
      if (event.element == 'click') {
        const block = myWorkspace.getBlockById(event.blockId);
        if (block) console.log(block, block.type);
      }
    });

    // 设置jstree
    $('#treeview1').jstree({
      type: {
        default: {
          icon: true, // 关闭默认图标
        },
      },
      core: {
        multiple: false,
        data: [
          {
            // id: '00',
            state: {
              disabled: true,
              selected: true,
              opened:true
            },
            text: '工作台',
          },
          {
            children: [
              {
                // id: '0101',
                text: '企业信息管理',
              },
              {
                id: '0102',
                text: '企业证照管理',
              },
            ],
            // id: '01',
            text: '企业管理',
            state: {
               
              opened:true
            },
          },
          {
            children: [
              {
                id: '0201',
                text: '生产企业商品管理',
              },
              {
                id: '0202',
                text: '商品溯源',
              },
              {
                id: '0203',
                text: '商品分布',
              },
            ],
            id: '02',
            text: '商品管理',
          },
          {
            children: [
              {
                id: '0301',
                text: '企业信息查询',
              },
              {
                id: '0302',
                text: '企业证照服务',
              },
            ],
            id: '03',
            text: '企业管理',
          },
         
        ],
        dblclick_toggle: false, // 禁用tree的双击展开
      },
    });

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
      xmlDom.id = 'workspaceBlocks';
      xmlDom.setAttribute('style', 'display: none');
      const xmlStr = new XMLSerializer().serializeToString(xmlDom);
      localStorage.workspace = xmlStr;

      const xml = document.getElementById('workspaceBlocks');
      if (xml != undefined) document.getElementById('mydiv').removeChild(xml);

      console.log('save ok');
    },

    load() {
      if (localStorage.workspace != undefined) {
        const xml = document.getElementById('workspaceBlocks');
        if (xml == undefined) {
          const mydiv = document.getElementById('mydiv');
          mydiv.innerHTML = localStorage.workspace;
        }

        Blockly.Xml.domToWorkspace(
          document.getElementById('workspaceBlocks'),
          this.$myWorkspace,
        );
        console.log('load ok');
      }
    },

    showCode() {
      // Generate JavaScript code and display it.
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      const code = Blockly.JavaScript.workspaceToCode(this.$myWorkspace);
      console.log(code);
    },

    runCode() {
      // Generate JavaScript code and run it.
      window.LoopTrap = 1000;
      Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
      const code = Blockly.JavaScript.workspaceToCode(this.$myWorkspace);
      Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
      try {
        console.log(code);
        eval(code);
      } catch (e) {
        alert(e);
      }
    },
  },
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
</style>
