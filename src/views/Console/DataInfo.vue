
<template  >
  <div>
    <el-row>
       <el-col :span="5">
         <h3>{{$t('udx_schema.schema_tree')}}</h3>
        <el-row>
         
           
          <!-- <el-select v-model="value" placeholder="请选择" @change="selectValue">
            <el-option
              v-for="item in configList"
              :key="item.value"
              :label="item.schema"
              :value="item.schema"
            ></el-option>

          </el-select> -->

          <div id="treeview" class="treeview"></div>
        </el-row>
       </el-col>
      <el-col :span="19">

<el-row>
  <h4>Basic Information:</h4>

        <el-table :data="schema_info" style="width: 100%">
          <el-table-column prop="datetime" :label="$t('data.date')" width="180"></el-table-column>
          <!-- <el-table-column prop="file" :label="$t('data.name')" width="180"></el-table-column> -->
          <el-table-column prop="name" :label="$t('data.workspace')"></el-table-column>
          <!-- <el-table-column prop="describe" :label="$t('data.desc')"></el-table-column> -->
          <el-table-column prop="tags" :label="$t('data.tags')"></el-table-column>
          <el-table-column prop="username" :label="$t('data.user')"></el-table-column>
        </el-table>
</el-row>
<el-row >
  <h4>Describe:</h4>
  <el-card shadow="never">
    {{content}}
  </el-card>

</el-row>

      </el-col>


    </el-row>
  </div>
</template>

<script>

// import httpUtils from '../../utils/httpUtils';
import urlUtils from '../../utils/urlUtils';
import httpUtils from "../../utils/httpUtils";
import tools from "../../utils/tools";

import bus from '../../assets/eventBus';


export default {
  data() {
    return {
      udx_schema_id: '', // 某一条udxSchema的id，
      schema_info: [],
       value: "",
      configList: [],
      content:'',
      schemaTreeNode:{}


    };
  },
  computed: {

  },
  create() {

  },
  beforeMount() {

  },
  mounted() {
    this.udx_schema_id = this.$route.query.id;
    this.getUdxSchemaInfo();


    //初始化页面时初始化schema树
    this.defaultSchemaInfo();
    this.initJsTree(null);
    this.initJsExtractTree(null);
     
  },
  methods: {
   
//数据元数据表
    getUdxSchemaInfo() {
      
      this.$axios
        .get(`/api${urlUtils.udx_schema_info}`, {
          params: {
            id: this.$data.udx_schema_id,
            pageamount: 1,
            page: 1,
          },
        })
        .then((res) => {
          this.$data.schema_info = res.data.data;
          this.content= this.$data.schema_info[0].describe
        });
    },
    defaultSchemaInfo(){
      const {id}=this.$route.query
      this.$axios
        .get(`/api${urlUtils.data_source_detail_schema_file}`, {
          params: {
            id: this.$data.udx_schema_id,
          },
        })
        .then((res) => {
          this.schemaTreeNode = res.data;
          console.log(this.schemaTreeNode)
           var nodes = new tools.UdxNode();

          tools.trans_new(
            {
              UdxNode:  res.data.data.UdxDeclaration.UdxNode
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
    // selectValue(v) {
    //   this.udx_schema_data = this.tableObj[v];
    //   this.dataList=this.dataListObj[v]
    //   this.dataValue=this.dataListObj[v][0]
    //   this.getSchemaContent(v);
    //   this.getUdxDataXml(this.dataValue)
    // },
    

  },
  destroyed() {
    bus.$off('id');
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
.treeview {
  margin-top: 20px;
}
</style>
