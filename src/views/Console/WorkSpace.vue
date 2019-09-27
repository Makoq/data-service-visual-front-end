
<template  >
  <div>

      <!-- 新建数据源按钮 -->
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" @click="createWorkspace">{{$t('workspace.create_workspace')}}</el-button>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-table :data="workspacelist" style="width: 100%">
          <el-table-column prop="datetime" :label="$t('data.date')" width="180"></el-table-column>
          <el-table-column prop="name" :label="$t('data.workspace')"></el-table-column>
          <el-table-column prop="tags" :label="$t('data.tags')"></el-table-column>
          <el-table-column prop="username" :label="$t('data.user')"></el-table-column>
          <el-table-column :label="$t('data.oper')">
            <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteWorkspace(scope.row.id)">{{$t('data.delete')}}</el-button>
                    <el-button type="text" size="small" @click="editeWorkspace(scope.row.id)">{{$t('workspace.edite')}}</el-button>

            </template>
          </el-table-column>

        </el-table>
        <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
               :page-sizes="[10,50,100, 200, 300, 400]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>

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
  props: ['user'],
  data() {
    return {
      workspacelist: [],
      currentPage:1,
      pageSize:10,
      total:0

    };
  },
  computed: {

  },
  create() {

  },
  beforeMount() {

  },
  mounted() {
    this.getWorkSpaceList('workspace');
    this.getAllCount('workspace');

  },
  methods: {
    getAllCount(type){
      httpUtils.get(this, `${urlUtils.data_count}?type=${type}`, (data) => {
        this.total = data;
      });
    },
    getWorkSpaceList(type) {
      httpUtils.get(this, `${urlUtils.get_source_list}?type=${type}&username=${this.user.username}&uid=${this.user.uid}&page=${this.currentPage}&pageSize=${this.pageSize}`, (data) => {
        this.workspacelist = data;
      });
    },
    createWorkspace() {
      this.$router.push({ path: '/console/workspaceInfo' });
    },
    deleteWorkspace(id) {
      toolUtils.confirm(this, '是否删除当前工作空间?', () => {
        httpUtils.get(
          this,
          `${urlUtils.workspace_delete}?id=${id}&username=${this.user.username}&uid=${this.user.uid}`,
          (data) => {
            this.$message({
              type: 'success',
              message: '已删除',
            });
            setTimeout(() => {
              this.getWorkSpaceList('workspace');
            }, 100);
            // this.editChart(data._id);
          },
        );
      });
    },
    editeWorkspace(id) {
      this.$router.push({ path: 'workspaceInfo', query: { id, type: 'edit' } });
    },
    handleSizeChange(val){
      this.pageSize=val
      this.getWorkSpaceList('workspace')
    },
    handleCurrentChange(val){
       this.currentPage=val
      this.getWorkSpaceList('workspace')
    },

    test() {
      console.log(this);
    },

  },
  destroyed() {

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
