<template  >
  <div>
    <el-row>
      <el-col :span="6">
        <el-row>
          <h3>{{$t('udx_schema.schema_tree')}}</h3>

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

        <el-row>
          <h3>{{$t('udx_schema.udx_data_list')}}</h3>
          <el-table :data="udx_schema_data" style="width: 100%">
            <el-table-column prop="data" :label="$t('udx_schema.data_list')" width="180"></el-table-column>
          </el-table>
        </el-row>
      </el-col>

      <el-col :span="18">
        <h3>Udx Schema Operation</h3>
        <el-card style="height:500px">
          <iframe id="iframe"  src='http://localhost:8888/tree?token=7b164ec065ba71f57b37ad6d519276d8e6b9800cef02ec49' />
          <!-- TODO 右边部分功能面板 -->
        </el-card>
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
      value: "",
      tableObj: {},
      jstree: []
    };
  },
  computed: {},
  mounted() {
    // if (!this.user.uid) {
    //   this.logout();
    // }
    this.defaultSchemaInfo();

    this.initJsTree(null);
  },
  methods: {
    selectValue(v) {
      this.udx_schema_data = this.tableObj[v];

      this.getSchemaContent(v);
    },
    defaultSchemaInfo() {
      const { id } = this.$route.query;
      httpUtils.get(this, `${urlUtils.default_udx_info}?id=${id}`, data => {
        this.configList = data;
        this.value = data[0].schema;
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
    getSchemaContent(schema) {
      const { id } = this.$route.query;

      httpUtils.get(
        this,
        `${urlUtils.udx_node}?id=${id}` + "&schema=" + schema,
        data => {
          var nodes = new tools.UdxNode();

          tools.trans_new(
            {
              UdxNode: data.UdxDeclaration.UdxNode
            },
            nodes
          );
          tools.reset();

          //  this.initJsTree(nodes.children);
          // 更新tree的数据
          $("#treeview").jstree(true).settings.core.data = nodes.children;
          $("#treeview").jstree(true).refresh();
        }
      );
    }
  },

  destroyed() {}
};
</script>
<style lang="scss">
.treeview {
  margin-top: 20px;
}
.el-card__body{
  height: 100%;
}
#iframe{
      width: 100%;
    height: 90%;
}

</style>
