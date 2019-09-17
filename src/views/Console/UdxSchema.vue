<template  >
  <div>
    <el-row>
      <el-col :span="6">
        <el-row>
          <h3>{{$t('udx_schema.schema_tree')}}</h3>
          <!-- {{udx_schema}} -->
          <!-- <div v-for="(item,ind) in udx_schema" :key="ind"> -->
          <!-- {{ind}} -->
          <div id="treeview0" class="treeview"></div>
          <!-- </div> -->
        </el-row>

        <el-row>
          <h3>{{$t('udx_schema.udx_data_list')}}</h3>
          <el-table :data="udx_schema_data" style="width: 100%">
            <el-table-column prop="dataName" :label="$t('udx_schema.data_list')" width="180"></el-table-column>
          </el-table>
        </el-row>
      </el-col>

      <el-col :span="18">
        <h3>Udx Schema Operation</h3>
        <el-card style="height:400px">
          TODO
          <!-- TODO 右边部分功能面板 -->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import httpUtils from '../../utils/httpUtils';
import urlUtils from '../../utils/urlUtils';

import bus from '../../assets/eventBus';
import tools from '../../utils/tools';

export default {
  props: ['user'],
  data() {
    return {
      udx_schema: [],
      udx_schema_data: [],
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
      const { id } = this.$route.query;
      const file = this.$route.query.fileName;
      let _self=this

      httpUtils.get(this, `${urlUtils.udx_node}?id=${id}`, (data) => {
//         this.udx_schema = data.schema;

//这一步是干嘛？这是这个列表
        data.udx_data.forEach((v) => {
          const o = {
            dataName: v,
          };
          this.udx_schema_data.push(o);
        });
//         console.log("rrr",data.schema)

        // function UdxNode() {
        //   this.children = new Array();
        // }
        // for (let i = 0; i < data.schema.length; i++) {

        // let sch = this.json2tree(data.schema[i]);
        // this.schemaTree(sch, i);
       
        // const nodes = new tools.UdxNode();
        console.log('data--', data.schema[0]);
        console.log('node--', tools.udx_nodes.children);//这一开始应该为空吧？
// console.log('aa',data.schema[0].UdxDeclaration.UdxNode)
        // index = 1;\
        // debugger
        tools.trans_new(
          {
            UdxNode: data.schema[0].UdxDeclaration.UdxNode,
          },
          tools.udx_nodes
        );
        // tools.test(this)
        // this.test(0)   
        console.log('jstree', tools.udx_nodes.children);

        // this.initJsTree(nodes.children);
        // }
      });

    },
    test(i){
          if(i===4){
            return
          }else{
            console.log("test",i)
            this.test(++i)
          }
    },

    initJsTree(data) {
      console.log(data);
      $('#treeview0').jstree({
        type: {
          default: {
            icon: false,
          },
        },
        core: {
          multiple: false,
          data,
          dblclick_toggle: false,
        },
        plugins: ['search'],
      });
    },


    json2tree(data) {
      const id = 1;
      const obj = [];
      if ('UdxDeclaration' in data) {
        var declation = {
          text: 'UdxDeclaration',
          state: {
            opened: true,
          },
          children: [],
        };

        if ('$' in data.UdxDeclaration) {
          const $ = {
            text: 'data info',
            state: {
              opened: true,
            },
            children: [
              {
                text: data.UdxDeclaration.$.name,
              },
              {
                text: data.UdxDeclaration.$.description,
              },
            ],
          };

          declation.children.push($);
        }

        if ('SemanticAttachment' in data.UdxDeclaration) {
          const SemanticAttachment = {
            text: 'SemanticAttachment',
            state: {
              opened: true,
            },
            children: [],
          };
          declation.children.push(SemanticAttachment);
          console.log(
            'concep',
            'Concepts' in data.UdxDeclaration.SemanticAttachment,
          );
          if ('Concepts' in data.UdxDeclaration.SemanticAttachment) {
            const Concepts = {
              text: 'Concepts',
              state: {
                opened: false,
              },
              children: [
                {
                  text: data.UdxDeclaration.SemanticAttachment.Concepts,
                },
              ],
            };
            console.log();
            declation.children[1].children.push(Concepts);
          }

          if ('SpatialRefs' in data.UdxDeclaration.SemanticAttachment) {
            const SpatialRefs = {
              text: 'SpatialRefs',
              state: {
                opened: false,
              },
              children: [
                {
                  text: data.UdxDeclaration.SemanticAttachment.SpatialRefs,
                },
              ],
            };

            declation.children[1].children.push(SpatialRefs);
          }

          if ('Units' in data.UdxDeclaration.SemanticAttachment) {
            const Units = {
              text: 'Units',
              state: {
                opened: false,
              },
              children: [
                {
                  text: data.UdxDeclaration.SemanticAttachment.Units,
                },
              ],
            };

            declation.children[1].children.push(Units);
          }

          if ('DataTemplates' in data.UdxDeclaration.SemanticAttachment) {
            const DataTemplates = {
              text: 'DataTemplates',
              state: {
                opened: false,
              },
              children: [
                {
                  text: data.UdxDeclaration.SemanticAttachment.DataTemplates,
                },
              ],
            };

            declation.children[1].children.push(DataTemplates);
          }

          // if ("SpatialRefs" in data.UdxDeclaration.SemanticAttachment.Concepts)
        }
        // 移动下面代码位置，要改上面的declation.children[2].children.push(DataTemplates);
        if ('UdxNode' in data.UdxDeclaration) {
          const UdxNode = {
            text: 'UdxNode',
            state: {
              opened: true,
            },
            children: [],
          };

          declation.children.push(UdxNode);
        }
      }
      obj.push(declation);
      console.log('obj', obj);
      return obj;
    },


    schemaTree(schema, i) {
      console.log('tree', schema);
      console.log('tree number', i);

      $(`#treeview${i}`).jstree({
        type: {
          default: {
            icon: true, // 关闭默认图标
          },
        },
        core: {
          multiple: false,
          data: schema,
          dblclick_toggle: false, // 禁用tree的双击展开
        },
      });
    },
  },
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
