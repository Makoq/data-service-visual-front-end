
<template  >
  <div>
    <el-row>
      <el-col :span="24">


        <el-table :data="schema_info" style="width: 100%">
          <el-table-column prop="datetime" :label="$t('data.date')" width="180"></el-table-column>
          <!-- <el-table-column prop="file" :label="$t('data.name')" width="180"></el-table-column> -->
          <el-table-column prop="name" :label="$t('data.workspace')"></el-table-column>
          <el-table-column prop="describe" :label="$t('data.desc')"></el-table-column>
          <el-table-column prop="tags" :label="$t('data.tags')"></el-table-column>
          <el-table-column prop="username" :label="$t('data.user')"></el-table-column>
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
  computed: {

  },
  create() {

  },
  beforeMount() {

  },
  mounted() {
    this.udx_schema_id = this.$route.query.id;
    this.getUdxSchemaInfo();
     
  },
  methods: {
    getUdxSchemaInfo() {
      console.log("ff",this.udx_schema_id)
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
        });
    },
    test() {
      console.log(this);
      console.log(this.$data);
      console.log(this.udx_schema_info);
    },

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

</style>
