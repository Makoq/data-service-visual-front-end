<template>
  <div>
    <!-- 新建数据源按钮 -->
    <el-row style="margin-bottom: 20px;">
      <el-button type="primary" @click="addData">{{$t('data_management.add_data_source')}}</el-button>
    </el-row>

    <!-- 数据源列表 -->
    <el-tabs v-model="activeName" @tab-click="tab_click">
      <!-- UDX Source -->
      <el-tab-pane :label="$t('data_management.udx_source')" name="first">
        <el-table :data="udxDataList">
          <!-- <el-table-column prop="_id" label="id">
             <template slot-scope="scope">
              <span>{{ scope.row._id | simplifyID }}</span>
            </template>
          </el-table-column> -->

          <el-table-column prop="name" :label="$t('data.name')"></el-table-column>
          <el-table-column prop="workSpaceName" :label="$t('data.workspace')"></el-table-column>
          <el-table-column prop="tags" :label="$t('data.tags')"></el-table-column>
          <!-- <el-table-column prop="file" label="文件"></el-table-column> -->


            <!-- <template slot-scope="scope">
              <span>{{ $dayjs(scope.row.createdAt).format('YYYY-MM-DD HH:mm') }}</span>
            </template>-->
          <!-- </el-table-column> -->

          <el-table-column :label="$t('data.oper')">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="detail(scope.row)">{{$t('data.check')}}</el-button>
              <el-button type="text" size="small" @click="content(scope.row)">{{$t('data.content')}}</el-button>

              <el-button type="text" size="small" @click="share(scope.row)">{{$t('data.share')}}</el-button>
              <el-button type="text" size="small" @click="deleteData('udx_source',scope.row.id,scope.row.workspace)">{{$t('data.delete')}}</el-button>
              <el-button type="text" size="small" @click="editData(scope.row.id)">{{$t('data.edit')}}</el-button>


            </template>
          </el-table-column>
          
        </el-table>
   

      </el-tab-pane>
      <!-- 数据容器源 -->
      <el-tab-pane :label="$t('data_management.data_process_service')" name="second">配置管理</el-tab-pane>
      <!-- 可配置源 -->
      <el-tab-pane :label="$t('data_management.data_process_program')" name="third">角色管理</el-tab-pane>

           <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
               :page-sizes="[10,50,100, 200, 300, 400]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
    </el-tabs>

    <!-- 弹出对话框选择创建服务类型 -->
    <el-dialog
      :title="$t('data_management.source_type')"
      :visible.sync="selectVisible"
      width="400px"
    >
      <el-row style="margin-bottom: 15px;">
        <el-radio v-model="radio" label="type1">{{$t('data_management.udx_source')}}</el-radio>
      </el-row>
      <el-row style="margin-bottom: 15px;">
        <el-radio v-model="radio" label="type2">{{$t('data_management.data_process_service')}}</el-radio>
      </el-row>
      <el-row style="margin-bottom: 15px;">
        <el-radio v-model="radio" label="type3">{{$t('data_management.data_process_program')}}</el-radio>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="selectDataSourceType">确定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出框 分享链接 -->
    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    
  </span>
</el-dialog>
  </div>
</template>

<script>
import httpUtils from '../../utils/httpUtils';
import urlUtils from '../../utils/urlUtils';
import toolUtils from '../../utils/toolUtils';


import bus from '../../assets/eventBus';
/* eslint-disable */
export default {
  props: ["user"],
  data() {
    return {
      udxDataList: [],
      data_container_source_list: [],
      configurable_data_list: [],

      // 创建数据源类型
      selectVisible: false,
      radio: "type1",

      //tab
      activeName: "first",
      currentPage:1,
      pageSize:10,
      total:0

    };
  },
  mounted() {
    this.getDataSource("udx_source");
    this.getAllCount('udx_source');

  },
  filters: {
    simplifyID(id) {
      return id.slice(-6);
    }
  },
  methods: {
     getAllCount(type){
      httpUtils.get(this, `${urlUtils.data_count}?type=${type}`, (data) => {
        this.total = data;
      });
    },
    getDataSource(type) {
      httpUtils.get(this, urlUtils.get_source_list + "?type=" + type+"&username="+this.user.username+"&uid="+this.user.uid+"&page="+this.currentPage+"?pageSize="+this.pageSize, data => {
        this.udxDataList = data;
      });
    },

    addData() {
      this.selectVisible = true;
      // this.$router.push("data/add");
    },
    detail(row){
      //  console.log("parent",this)
      //  bus.$emit('id',row.id)
       this.$router.push({path:'/console/data/udx-info',query:{id:row.id}});


    },
    content(row){
      let id=row.id
        this.$router.push({path:'/console/data/content',query:{id:row.id,fileName:row.file}});
         

    },
    share(row) {

       
    },
    deleteData(type, id,workspace) {

      toolUtils.confirm(this, "是否删除当前数据源?", () => {
        httpUtils.get(
          this,
          urlUtils.delete_source + "?id=" + id + "&type=" + type+"&username="+this.user.username+"&uid="+this.user.uid+"&workspace="+workspace,
          data => {
            this.$message({
              type: "success",
              message: "已删除"
            });
            setTimeout(() => {
              this.getDataSource(type);
            }, 100);
            // this.editChart(data._id);
          }
        );
      });

      // this.$confirm("？", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     httpUtils.get(
      //       this,
      //       urlUtils.delete_source + "?id=" + id + "&type=" + type,
      //       data => {
      //         this.$message({
      //           type: "success",
      //           message: "已删除"
      //         });
      //         setTimeout(() => {
      //           this.getDataSource(type);
      //         }, 100);
      //         // this.editChart(data._id);
      //       }
      //     );
      //   })
      //   .catch(() => {});
    },
    editData(id){
      this.$router.push({path:'data/udx-source',query:{id:id,type:'edit'}})
    },
    tab_click(){},

    // 选择数据源类型
    selectDataSourceType() {
      this.selectVisible = false;

      if (this.radio == "type1") {
        this.$router.push("data/udx-source");
      } else if (this.radio == "type2") {
        this.$router.push("data/udx-source");

      } else {
        this.$router.push("data/config-source");
      }
    },
    //分页
    handleSizeChange(val) {
      this.pageSize=val
      this.getDataSource('udx_source')
      

    },
    handleCurrentChange(val) {
      this.currentPage=val
      this.getDataSource('udx_source')

    

    },
     


  }
};
</script>

<style lang="scss" scoped>
</style>
