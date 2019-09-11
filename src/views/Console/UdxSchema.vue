<template  >
  <div>
      <el-row>
          <el-col :span="8">
              
          </el-col>
          <el-col :span="16">right content</el-col>

      </el-row>

  </div>
</template>

<script>
 ;
import httpUtils from '../../utils/httpUtils';
import urlUtils from '../../utils/urlUtils';

import bus from '../../assets/eventBus';


export default {
  props:['user'],
  data() {
    return {

       

    };
  },
  computed: {

  },
  mounted() {
    // if (!this.user.uid) {
    //   this.logout();
    // }
    this.getSchemaContent()
  },
  methods: {

    getSchemaContent(){
      let id=this.$route.query.id
      let file=this.$route.query.fileName
      
      httpUtils.get(this,urlUtils.udx_node+"?id="+id+"&fileName="+file,data=>{
          console.log(data)
      })
      
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
