<template  >
  <div>
    <el-row>
      <el-col :span="6">
        <h2>Udx Schema Tree</h2>
        <!-- {{udx_schema}} -->
        <!-- <div v-for="(item,ind) in udx_schema" :key="ind"> -->
        <!-- {{ind}} -->
        <div id="treeview0" class="treeview"></div>
        <!-- </div> -->
      </el-col>
      <el-col :span="18">
        <h2>Udx Schema Operation</h2>
        <el-card style="height:400px">
          TODO
          <!-- TODO 右边部分功能面板 -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import httpUtils from "../../utils/httpUtils";
import urlUtils from "../../utils/urlUtils";

import bus from "../../assets/eventBus";

export default {
  props: ["user"],
  data() {
    return {
      udx_schema: []
    };
  },
  computed: {},
  mounted() {
    // if (!this.user.uid) {
    //   this.logout();
    // }
    this.getSchemaContent();
  },
  methods: {
    getSchemaContent() {
      let id = this.$route.query.id;
      let file = this.$route.query.fileName;
      console.log(this);
      httpUtils.get(this, urlUtils.udx_node + "?id=" + id, data => {
        this.udx_schema = data;
        console.log(data);
        console.log(this);

        for (let i = 0; i < data.length; i++) {
          let sch = this.json2tree(data[i]);
          this.schemaTree(sch, i);
        }
      });
    },
    json2tree(data) {
      let id = 1;
      let obj = [];
      if ("UdxDeclaration" in data) {
        var declation = {
          text: "UdxDeclaration",
          state: {
            opened: true
          },
          children: []
        };

        if ("$" in data.UdxDeclaration) {
          let $ = {
            text: "data info",
            state: {
              opened: true
            },
            children: [
              {
                text: data.UdxDeclaration.$.name
              },
              {
                text: data.UdxDeclaration.$.description
              }
            ]
          };

          declation.children.push($);
        }

        if ("SemanticAttachment" in data.UdxDeclaration) {
          let SemanticAttachment = {
            text: "SemanticAttachment",
            state: {
              opened: true
            },
            children: []
          };
          declation.children.push(SemanticAttachment);

          if ("Concepts" in data.UdxDeclaration.SemanticAttachment) {
            let Concepts = {
              text: "Concepts",
              state: {
                opened: false
              },
              children: [
                {
                  text: data.UdxDeclaration.SemanticAttachment.Concepts
                }
              ]
            };

            declation.children[2].children.push(Concepts);
          }

          if ("SpatialRefs" in data.UdxDeclaration.SemanticAttachment) {
            let SpatialRefs = {
              text: "SpatialRefs",
              state: {
                opened: false
              },
              children: [
                {
                  text: data.UdxDeclaration.SemanticAttachment.SpatialRefs
                }
              ]
            };

            declation.children[2].children.push(SpatialRefs);
          }

          if ("Units" in data.UdxDeclaration.SemanticAttachment) {
            let Units = {
              text: "Units",
              state: {
                opened: false
              },
              children: [
                {
                  text: data.UdxDeclaration.SemanticAttachment.Units
                }
              ]
            };

            declation.children[2].children.push(Units);
          }

          if ("DataTemplates" in data.UdxDeclaration.SemanticAttachment) {
            let DataTemplates = {
              text: "DataTemplates",
              state: {
                opened: false
              },
              children: [
                {
                  text: data.UdxDeclaration.SemanticAttachment.DataTemplates
                }
              ]
            };

            declation.children[2].children.push(DataTemplates);
          }

          // if ("SpatialRefs" in data.UdxDeclaration.SemanticAttachment.Concepts)
        }

        if ("UdxNode" in data.UdxDeclaration) {
          let UdxNode = {
            text: "UdxNode",
            state: {
              opened: true
            },
            children: []
          };

          declation.children.push(UdxNode);





        }



      }
      obj.push(declation);
      console.log("obj", obj);
      return obj;
    },
    DIGUInode(obj,arr){
      for(let i=0;i<arr.length;i++){

        if("$" in arr[i]){
          
        }
      }



    },

    schemaTree(schema, i) {
      console.log("tree", schema);
      console.log("tree number", i);

      $("#treeview" + i).jstree({
        type: {
          default: {
            icon: true // 关闭默认图标
          }
        },
        core: {
          multiple: false,
          data: schema,
          dblclick_toggle: false // 禁用tree的双击展开
        }
      });
    }

  }
};
</script>
<style lang="scss">
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  user-select: none;
}
.el-header {
  padding: 0;
}
.el-container {
  height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
