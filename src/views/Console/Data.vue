<template>
  <div>
    <el-row style="margin-bottom: 20px;">
      <el-col :span="12">
         <!-- 新建数据源按钮 -->
          <el-button v-if="currentType!='cloud'" type="primary" @click="addData">{{currentType!='udx'?$t('data_management.add_data_source'):$t('data_management.add_data_template')}}</el-button>
      </el-col>
      <el-col :span="12">
        <!-- 数据服务搜索 -->
          <div   class="searchInput">
            <el-input placeholder="search data service..." v-model="searchOnlineData" class="input-with-select">
             
              <el-button slot="append" @click="searchService()" icon="el-icon-search" ></el-button>
            </el-input>
          </div>
      </el-col>
    </el-row>
    <!-- 发布数据进度条，仅在本地数据列表展示 -->
    <el-progress v-if="readyProgress" :text-inside="true" :stroke-width="26" :percentage="percentage" status="success" ></el-progress>
    
     <el-divider ></el-divider>
    <!-- 数据源列表 -->
    <el-tabs v-model="activeName" @tab-click="tab_click" >
      <!-- UDX Source -->
      <el-tab-pane :label="tabName" name="first">
        <el-table :data="udxDataList"
        stripe
        :row-class-name="tableRowClassName"
        >
      
          <el-table-column    prop="name" :label="$t('data.name')"></el-table-column>
          <el-table-column prop="workSpaceName" :label="$t('data.workspace')"></el-table-column>
          <el-table-column  prop="img" :label="$t('data.img')">
            <template slot-scope="scope">
              <img height="70px" width="120px" style="border: 1px solid"  :src="scope.row.img"/>
            </template>
          </el-table-column>

          <el-table-column prop="tags" :label="$t('data.tags')"></el-table-column>
          

          <el-table-column :label="$t('data.oper')">
            <template slot-scope="scope">
              <el-button v-if="currentType!='cloud'" type="text" size="small" @click="detail(scope.row)">{{$t('data.check')}}</el-button>
              <!-- 将数据抽取部分抛弃，把schema树合并到详情 -->
              <!-- <el-button type="text" size="small" @click="content(scope.row)">{{$t('data.content')}}</el-button> -->
              <el-button v-if="currentType!='data'" type="text" size="small" @click="getOnlineData(scope.row)" id="btn_share">{{$t('data.fetch')}}</el-button>

              <el-button v-if="currentType!='cloud'" type="text" size="small" @click="share(scope.row)" id="btn_share">{{$t('data.share')}}</el-button>
              <el-button v-if="currentType!='cloud'" type="text" size="small" @click="deleteData('udx_source',scope.row.id,scope.row.workspace)" id="btn_del">{{$t('data.delete')}}</el-button>
              <el-button v-if="currentType!='cloud'" type="text" size="small" @click="editData(scope.row.id)" id="btn_edit">{{$t('data.edit')}}</el-button>

              <el-button v-if="currentType!='cloud'" type="text" size="small" @click="publicMyData(scope.row)" id="btn_public">{{$t('data.public')}}</el-button>


            </template>
          </el-table-column>
          
        </el-table>
   

      </el-tab-pane>
      
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
  title="share"
  :visible.sync="shareDialog"
  width="30%"
   >
  <span>这是一段信息</span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="shareDialog = false">取 消</el-button>
    
  </span>
</el-dialog>
  </div>
</template>

<script>
import httpUtils from '../../utils/httpUtils';
import urlUtils from '../../utils/urlUtils';
import toolUtils from '../../utils/toolUtils';


import bus from '../../assets/eventBus';
import { thisExpression } from 'babel-types';
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
      tabName:"",
      activeName: "first",
      currentPage:1,
      pageSize:10,
      total:0,
      //share
      shareDialog:false,
      //type
      currentType:'',
      //onlinedataid
      onlineDataId:[],
      //进度条
      percentage:0,
      readyProgress:false,
      //在线数据服务搜索
      searchOnlineData:'',
      selectSearchType:''


    };
  },
  watch:{
     $route(to,from){
       let type=to.path.split("/")
      
       this.currentType=type[type.length-1]
        
    
    if( this.currentType==='data'){
      this.searchOnlineData=''
      this.udxDataList=[]
      this.total=0

      this.tabName="Data Service"

       
      this.getDataSource("udx_source");
      this.getAllCount('udx_source');

    }else if(this.currentType==='udx'){
      this.tabName="Data Template"
      this.udxDataList=[]
      this.total=0
    }else if( this.currentType==='process'){

      this.udxDataList=[]
      this.total=0
     //TODO 获取数据处理方法列表
      this.tabName="Process Service"

    }else if( this.currentType==='program'){

      this.udxDataList=[]
      this.total=0

    //TODO 获取数据处理方案列表
      this.tabName="Program Service"

    }else if( this.currentType==='cloud'){
      this.searchOnlineData=''
      this.currentPage=1

      this.udxDataList=[]
      this.total=0

    //TODO 获取数据处理方案列表
      this.tabName="Online Data"
      this.onlineDataList()
      
    }
     
    }
  },
  mounted() {

    // let type=window.location.href.split("/")
    let type=this.$route.params.type
  
    if(type==='data'){
      
      this.currentType="data"
     
      this.tabName="Data Service"

      this.getDataSource("udx_source");
      this.getAllCount('udx_source');

    }else if(type==='cloud'){
      this.currentType='cloud'
      this.onlineDataList()
    }
    else if(type==='udx'){
      this.currentType='udx'
      this.udxDataList=[]
    }
    else if(type==='process'){

     
      this.currentType="process"
      this.tabName="Process Service"
    }else if(type==='program'){

  
      this.currentType="program"
      this.tabName="Program Service"
    }

  
    
    

  },
  filters: {
    simplifyID(id) {
      return id.slice(-6);
    }
  },
  methods: {
    searchService(){
      this.currentPage=1
       if(this.searchOnlineData.length<1){
          alert("empty search content!")
          this.onlineDataList()
        }else{

          if(this.currentType==='cloud'){
       
            this.searchOnlineDataService()
            
          }else if(this.currentType==='data'){
            this.searchLocalDataService()
            
          }
        }
      
    },
    searchOnlineDataService(){
      let self=this
      this.$axios.get(`/pd/${urlUtils.searchOnlieData}?words=${this.searchOnlineData}&page=${this.currentPage}`)
       .then(re=>{
         //TODO 
         let ar=[]
         re.data.list.forEach((v)=>{
           ar.push(v.info)
         })
         console.log(ar)
        self.udxDataList=ar
        //  self.udxDataList=re.data.list
         self.total=re.data.total
       })
    },
    searchLocalDataService(){
      let self=this
       this.$axios.get(`/api/${urlUtils.searchLocalData}?words=${this.searchOnlineData}&page=${this.currentPage}`)
       .then(re=>{
         self.udxDataList=re.data.data
         self.total=re.data.total
        //  console.log(re)
       })
    },  
     publicMyData(row){
       let self=this
       self.readyProgress=true
       self.percentage=0
       var timer1=setInterval(()=>{
         if(self.percentage<30){
           self.percentage++
         }else{
           clearInterval(timer1)
         }
       },10)
      
       this.$axios.post(`/api/${urlUtils.public_data}`,{
        data:row.localPath
       }).then(re=>{
          if(re.status===200){
             

            var timer2=setInterval(()=>{
              if(self.percentage<60){
                self.percentage++
              }else{
                clearInterval(timer2)
              }
              
            },50)

            let formData=new FormData()
            formData.append("info",JSON.stringify(row))
            formData.append("uid",re.data.uid.uid)

            self.$axios.post(`/api/${urlUtils.public_data_info}`,formData)
            .then(re=>{
              if(re.status===200){
                var timer3=setInterval(()=>{
                  if(self.percentage<=100){
                    self.percentage++
                  }else{
                    clearInterval(timer3)
                    
                    self.$message("public success!")
                    self.readyProgress=false
                  }   
                },50)

                
              }
              
            })
            

             
          }else{
            this.$message('err')
          }       
       })  
     },
     format(percentage) {
        return percentage === 100 ? '满' : `${percentage}%`;
      
    },
     onlineDataList(){
       let self=this
      //  this.currentPage=1
       this.$axios.get(`/pd/${urlUtils.onlineDataList}?page=${self.currentPage}`)
       .then(re=>{
         self.total=re.data.total
         self.udxDataList=[]
         re.data.list.forEach(el => {
           el.info['server_id']=el.uid
           self.udxDataList.push(el.info)
         
         });

       }) 
     },
     getOnlineData(row){
       //TODO 获取在线数据流
    
       let uid =row.server_id
       this.$axios.get(`/pd/${urlUtils.dataSteam}?uid=${uid}`,{
         responseType: 'blob'
       })
       .then(re=>{
          
          const blob = new Blob([re.data], {type: 'application/zip;charset=utf-8'});
          const alink = document.createElement('a')
          alink.style.display = 'none'
          alink.href = URL.createObjectURL(blob) 
          document.body.appendChild(alink)
          alink.click()
          URL.revokeObjectURL(alink.href)
          document.body.removeChild(alink)

       })

     },
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

      if (this.currentType=== "data") {
        this.$router.push({path:"udx-source",query:{type:'data'}});
      } else if (this.currentType === "process") {
        this.$router.push({path:"config-source",query:{type:'process'}});
      } else {
        this.$router.push({path:"config-source",query:{type:'program'}});
      }

      // this.selectVisible = true;
       
    },
    detail(row){
      
       this.$router.push({path:'/console/data/udx-info',query:{id:row.id}});


    },
    content(row){
      let id=row.id
        this.$router.push({path:'/console/data/content',query:{id:row.id,fileName:row.file}});
         

    },
    share(row) {
      this.shareDialog=true
       
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
    },
    editData(id){
      this.$router.push({path:'udx-source',query:{id:id,type:'edit'}})
    },
    tab_click(){},

    // 选择数据源类型
    selectDataSourceType() {
      this.selectVisible = false;

      if (this.radio == "type1") {
        this.$router.push("udx-source");
      } else if (this.radio == "type2") {
        this.$router.push("udx-source");

      } else {
        this.$router.push("config-source");
      }
    },
    //分页
    handleSizeChange(val) {
      this.pageSize=val
      if(this.currentType==='data'){
        this.getDataSource('udx_source')
      }else if(this.currentType==='cloud'){
        this.onlineDataList()
      }
      
      

    },
    handleCurrentChange(val) {
      this.currentPage=val
      if(this.currentType==='data'){
        this.getDataSource('udx_source')
      }else if(this.currentType==='cloud'){
        this.onlineDataList()
      }
      // this.getDataSource('udx_source')
    },
    tableRowClassName({row, rowIndex}) {
        if (rowIndex ===1) {
          return 'success-row';
        }  
        return '';
      }
     


  }
};
</script>

<style   scoped>

.el-table .success-row {
    background: oldlace;
  }
  .searchInput{
    margin-top: 5px;
  }
   .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
