<template  >
  <div>
      <el-row>
          <el-col :span="8">
              <el-tree
                    :props="props"
                    :load="loadNode"
                    lazy
                    show-checkbox
                    @check-change="handleCheckChange">
                </el-tree>
          </el-col>
          <el-col :span="16">right content</el-col>

      </el-row>

  </div>
</template>

<script>
import { thisExpression } from 'babel-types';
import i18n from '../../assets/i18n/index';
import httpUtils from '../../utils/httpUtils';
import urlUtils from '../../utils/urlUtils';

import bus from '../../assets/eventBus';


export default {
  data() {
    return {

      props: {
        label: 'name',
        children: 'zones',
      },
      count: 1,


      udx_schema_id: '', // 某一条udxSchema的id，
      schema_info: {},


    };
  },
  computed: {

  },
  mounted() {
    // if (!this.user.uid) {
    //   this.logout();
    // }
    bus.$on('id', function (msg) {
      this.udx_schema_id = msg;
      if (msg) {
        httpUtils.get(this, `${urlUtils.udx_schema_info}?id=${this.udx_schema_id}`, (data) => {
          console.log(data);
          this.schema_info = data;
        });
      }
    });
  },
  methods: {


    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region1' }, { name: 'region2' }]);
      }
      if (node.level > 3) return resolve([]);

      let hasChild;
      if (node.data.name === 'region1') {
        hasChild = true;
      } else if (node.data.name === 'region2') {
        hasChild = false;
      } else {
        hasChild = Math.random() > 0.5;
      }

      setTimeout(() => {
        let data;
        if (hasChild) {
          data = [{
            name: `zone${this.count++}`,
          }, {
            name: `zone${this.count++}`,
          }];
        } else {
          data = [];
        }

        resolve(data);
      }, 500);
    },

    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    handleNodeClick(data) {
      console.log(data);
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
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
}
</style>
