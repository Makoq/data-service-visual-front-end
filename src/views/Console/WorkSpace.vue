
<template  >
  <div>

      <!-- 新建数据源按钮 -->
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" @click="createWorkspace">{{$t('workspace.create_workspace')}}</el-button>
    </el-row>

    <el-row>
      <el-col :span="24">   
        <el-table :data="workspacelist" style="width: 100%">
          <el-table-column prop="datetime" label="日期" width="180"></el-table-column>
          <el-table-column prop="name" label="空间名称"></el-table-column>
          <el-table-column prop="tags" label="标签"></el-table-column>
          <el-table-column prop="username" label="用户"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteWorkspace(scope.row.id)">{{$t('data.delete')}}</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import httpUtils from '../../utils/httpUtils';
import urlUtils from '../../utils/urlUtils';
import toolUtils from '../../utils/toolUtils';

import bus from '../../assets/eventBus';


export default {
    props: ["user"],
  data() {
    return {
      workspacelist:[]
      
    };
  },
  computed: {

  },
  create(){
    
  },
  beforeMount(){

  },
  mounted(){
      this.getWorkSpaceList("workspace")

  },
  methods: {
      getWorkSpaceList(type){
            httpUtils.get(this, urlUtils.get_source_list+ "?type=" + type+"&username="+this.user.username+"&uid="+this.user.uid, data => {
        this.workspacelist = data;
      });
      },
    createWorkspace(){
        this.$router.push({path:'/console/workspaceInfo'})
    },
    deleteWorkspace(id){
        toolUtils.confirm(this, "是否删除当前工作空间?", () => {
        httpUtils.get(
          this,
          urlUtils.workspace_delete + "?id=" + id+"&username="+this.user.username+"&uid="+this.user.uid ,
          data => {
            this.$message({
              type: "success",
              message: "已删除"
            });
            setTimeout(() => {
              this.getWorkSpaceList("workspace");
            }, 100);
            // this.editChart(data._id);
          }
        );
      });
    },
 
    test(){
      console.log(this)
      

    }

  },
  destroyed(){
     
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