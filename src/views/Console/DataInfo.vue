
<template  >
  <div>
    <el-row>
      <el-col :span="24">
        {{ schema_info}}
        <el-table :data="schema_info" style="width: 100%">
          <el-table-column prop="datetime" label="日期" width="180"></el-table-column>
          <el-table-column prop="file" label="文件名" width="180"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="tags" label="标签"></el-table-column>
          <el-table-column prop="username" label="用户"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>

// import httpUtils from '../../utils/httpUtils';
import urlUtils from '../../utils/urlUtils';

import bus from '../../assets/eventBus';


export default {
  data() {
    return {
      udx_schema_id: '', // 某一条udxSchema的id，
      schema_info: [],
    };
  },
  computed: {},
  mounted() {
    var that=this
    bus.$once('id', (msg) => {
      that.udx_schema_id = msg;
      that.$axios
        .get(`/api${urlUtils.udx_schema_info}`, {
          params: {
            id: that.udx_schema_id,
            pageamount: 1,
            page: 1,
          },
        })
        .then((res) => {
          console.log(res.data)
          that.schema_info = res.data.data;
          // console.log(this.schema_info);
           console.log(that.schema_info)
        });
    });
   

  },
  methods: {
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
