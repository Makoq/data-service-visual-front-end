
<template  >
  <div>
    <el-row>
      <el-col :span="24">
         
         
        <el-table :data="schema_info" style="width: 100%">
          <el-table-column prop="datetime" label="日期" width="180"></el-table-column>
          <el-table-column prop="file" label="文件名" width="180"></el-table-column>
          <el-table-column prop="name" label="名称"></el-table-column>
          <el-table-column prop="describe" label="描述"></el-table-column>

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
  computed: {

  },
  create(){
    
  },
  beforeMount(){
   
  },
  mounted(){
    // console.log("idididi",this.$router.query.id)
    
   this.$data.udx_schema_id=this.$route.query.id
   this.getUdxSchemaInfo()
    // console.log("origin",vue)
    // bus.$on('id', (msg) => {
    //       vue.$data.udx_schema_id = msg;// bus.$off('id')//销毁监听器
    //       vue.getUdxSchemaInfo(vue)

    // });

  },
  methods: {
    getUdxSchemaInfo(){
      
     
     this.$axios
        .get(`/api${urlUtils.udx_schema_info}`, {
          params: {
            id: this.$data.udx_schema_id,
            pageamount: 1,
            page: 1,
          },
        })
        .then((res) => {
          
          this.$data.schema_info=res.data.data
          
        
          
        });



    },
    test(){
      console.log(this)
      console.log(this.$data)
      console.log(this.udx_schema_info)

    }

  },
  destroyed(){
    bus.$off('id')
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
 
</style>
