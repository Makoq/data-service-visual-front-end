<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="ruleForm" label-width="100px" :hide-required-asterisk="true">
          <!-- 工作空间 -->
          <el-form-item :label="$t('addUdxSource.workspace')">
            <el-select v-model="value"  placeholder="请选择工作空间">
              <el-option  v-for="(item,ind) in form.myWokrspace" :label="item.name" :value="item.id" :key="ind"></el-option>

            </el-select>
          </el-form-item>
          <!-- 名称 -->
          <el-form-item :label="$t('addUdxSource.name')" prop="name">
            <el-input v-model="form.name" placeholder="请输入数据源名称" style="width:220px;"></el-input>
          </el-form-item>
          <!-- 描述 -->
          <el-form-item :label="$t('addUdxSource.desc')">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>

          <!-- 标签 -->
          <el-form-item :label="$t('addUdxSource.tags')" prop="name">
            <el-tag
              :key="tag"
              v-for="tag in form.dynamicTags"
              closable
              :disable-transitions="false"
              @close="handleClose(tag)"
            >{{tag}}</el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
            ></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加标签</el-button>
          </el-form-item>
          <!-- 图片 -->
          <el-form-item :label="$t('addUdxSource.img')" prop="name">
             <div style="display: -webkit-inline-box;"> 
             <img id="edit_img" v-if="imgUrl&&type!='data'" :src="imgUrl" />
             <el-upload
              action="#"
              list-type="picture-card"
              :limit="1"
              :on-change="changeImg"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :auto-upload="false">
              <i class="el-icon-plus"></i>
            </el-upload>
            
            <el-dialog :visible.sync="dialogVisible">
              <img id="avater" width="100%" :src="dialogImageUrl" />
            </el-dialog>
           
             </div>
          </el-form-item>
          <!-- 连接参数 -->
          <el-form-item :label="$t('addUdxSource.local_path')" prop="name">
            <el-input v-model="form.selectPath" placeholder="" style="width:520px;">
              <template slot="prepend">Local Path:</template>
            </el-input>
            <!-- &nbsp;<el-button >{{$t('addUdxSource.select_local_file')}}
                </el-button> -->
          </el-form-item>
          <!-- 处理方法 -->
          <el-form-item :label="$t('addUdxSource.process_methods')" prop="name">

            <!-- <el-input v-model="form.processMethods" placeholder="" style="width:320px;">
              
            </el-input> -->

            
             <el-tag
                  :key="key"
                  v-for="(tag,key) in chooseTemps"
                  closable
                  :disable-transitions="false"
                   @close="handleCloseTpm(key)"
                  >{{tag.name}}
                </el-tag>
                <el-button
                style="margin-left: 10px;"
                size="small"
                type="primary"
                @click="selectTemplate"
              >{{$t('addUdxSource.select')}}
            </el-button>
            <el-dialog
                title="提示"
                :visible.sync="selectT"
                width="50%"
                v-loading="loading"
                 >

                 <el-tag
                 :key="key"
                  v-for="(tag,key) in chooseTemps"
                  closable
                  :disable-transitions="false"
                  @close="handleCloseTpm(key)"
                  >
                  {{tag.name}}
                </el-tag>
                 

                    <el-table :data="dataTemplateList"
                      stripe
                      :row-class-name="tableRowClassName"
                      >
                      <el-table-column   prop="name" :label="$t('data.name')"></el-table-column>
                      <el-table-column   prop="tags" :label="$t('data.tags')"></el-table-column>
                      
                      <el-table-column   :label="$t('data.oper')">
                        <template slot-scope="scope">
                          <el-button   type="text" size="small" @click="getTemplateContent(scope.row)" id="btn_share">{{$t('data.content')}}</el-button>
                          <el-dialog
                            title="提示"
                            :visible.sync="xmlPreview"
                            width="60%"
                            :modal="false"
                            >
                            <el-input   type="textarea"  id="xmlPreview"   :disabled="true" v-model="xmlContent" rows="20" placeholder="Please organize content in xml format.." ></el-input>
                            <span slot="footer" class="dialog-footer">
                              <el-button @click="xmlPreview = false" type="primary">ok</el-button>
                            </span>
                          </el-dialog>

                          <el-button   type="text" size="small" @click="chooseTemp(scope.row)" id="btn_share">{{$t('data.choose')}}</el-button>

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



            
                <span slot="footer" class="dialog-footer">
                  <el-button @click="selectT = false" type="primary">ok</el-button> 
                </span>
              </el-dialog>





            
          </el-form-item>



          <!-- 上传UDX数据 -->
          <el-form-item :label="$t('addUdxSource.data')">
            <!-- <el-upload
              ref="upload"
              action="/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :on-exceed="handleExceed"
              :auto-upload="false"
              :file-list="fileList"
              :multiple="false"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
                 @click.native="selectPath(this)"
              >{{$t('addUdxSource.choose_data')}}</el-button>


              <div slot="tip" style="color:red" class="el-upload__tip">只能上传zip文件，且不超过10MB</div>
            </el-upload> -->
            <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitUpload"
              >{{$t('addUdxSource.upload_to_server')}}</el-button>
          </el-form-item>
          <!--  -->
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
/* eslint-disable */
import urlUtils from "../../utils/urlUtils";
import httpUtils from "../../utils/httpUtils";
import stringUtils from "../../utils/stringUtils";

export default {
  props: ["user"],
  data() {
    return {
      form: {
        myWokrspace:[],
        name: "",
        // tag
        dynamicTags: ["UDX", "水文学"],
        desc: "",
        selectPath:'F:/udx/UdxServer/Server/data_dir/testUpload/testUpload.zip',
        workspaceId:'',
        processMethods:'',
        template:[]
      },
      value:'',
      inputVisible: false,
      inputValue: "",

      // 上传文件
      fileList: [],
      //编辑数据
      isEditType:false,
      type:'',
      dialogImageUrl: '',
      dialogVisible: false,
      imgUrl:'',
      type:'',
      //数据模板显示
      chooseTemps:[],
      selectT:false,
      dataTemplateList:[],
      xmlPreview:false,
      xmlContent:'',



      loading:true,
      currentPage:0,
      pageSize:10,
      total:-1,



      
       
    };
  },
  computed: {
    // newData() {
    //   // 生成 columns 字段
    //   let columns = this.form.metrics.concat();
    //   columns.unshift(this.form.dimension);
    //   let data = {
    //     columns,
    //     rows: this.form.data
    //   };
    //   return data;
    // }
  },
  mounted(){
    this.currentPage=0
    this.type=this.$route.query.type
    console.log(this.type)
    if(this.$route.query.type==='edit'){
      this.isEditType=true
        this.initEdit(this.$route.query.id)
    }else{
        
    }
    this.myWokrspace("workspace")
  },
  methods: {
    selectTemplate(){

      let self=this
      this.$axios.get('/api/'+urlUtils.templateList+'?page='+this.currentPage)
      .then(res=>{
        if(res.status===200){
          
          self.dataTemplateList=res.data.list
          self.total=res.data.total
          self.selectT=true
          self.loading=false
          self.total=res.data.total
        }
      })

      
    },
    changeImg(file, fileList){
      let type=document.location.href.split("?")
      let real_type=type[type.length-1].split("=")
      this.type=real_type[1]
      let child=document.getElementById("edit_img")
    
      if(child!=null){
        let parent=child.parentElement
        parent.removeChild(child)
      }
      
      let self=this
      setTimeout(()=>{
        let img=document.getElementsByTagName("img")[0]
        self.imgUrl=self.getBase64Image(img)
        
         
      },1000)
      
     

    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      console.log(this.dialogImageUrl)
    },
    getBase64Image(img) {
         var canvas = document.createElement("canvas");
         canvas.width = img.width;
         canvas.height = img.height;
         var ctx = canvas.getContext("2d");
         ctx.drawImage(img, 0, 0, img.width, img.height);
         var dataURL = canvas.toDataURL("image/png");
         return dataURL
         // return dataURL.replace("data:image/png;base64,", "");
     },
    initEdit(id){
      
      httpUtils.get(this,urlUtils.solo_udx_schema+"?id="+id,data=>{
          
          //  this.form.myWokrspace.push()
         console.log(data)
          this.value=data[0].workspace
           this.form.name=data[0].name
           this.form.dynamicTags=(data[0].tags).split(",")
           this.form.desc=data[0].describe
           this.form.selectPath=data[0].localPath
           this.form.workspaceId=data[0].workspace
           let arr=JSON.parse(data[0].dataTemplate)
           console.log(arr)
           let self=this
           arr.forEach(v=>{
             self.chooseTemps.push(v)
           })
         
       
         this.imgUrl=data[0].img
          //  document.getElementsByTagName("img")[0].src=data[0].img
          
           
           
            
      })
    },
    selectPath(obj){
      console.log(obj)
          // document.getElementById("text").innerHTML="获取文件域完整路径为："+file_url;
    },
    submitUpload() {
      //this.$refs.upload.submit();

      // 如果文件不是xml文件，则提示。

      // for (var i = 0; i < this.fileList.length; i++) {
      //   if (!stringUtils.endWith(this.fileList[i].name, ".zip")) {
      //     alert("只能上传zip文件");
      //     return;
      //   }
      // }

      
      
      
      if (this.form.name.length <= 0) {
        alert("必须填写数据源名称");
        return;
      }

      // // 必须选择文件
      // if (this.fileList.length != 1) {
      //   alert("当且仅当选择一个文件");
      //   return;
      // }

      let formData = new FormData();
      // formData.append("file", this.fileList[0].raw);
      formData.append("name", this.form.name);
      formData.append("tags", this.form.dynamicTags);
      formData.append("desc", this.form.desc);
      formData.append("username", this.user.username);
      formData.append("uid", this.user.uid);
      //F:/udx/UdxServer/Server/tmp/testschema
      formData.append("localpath", this.form.selectPath);
      // let templateUids=[]
      // this.chooseTemps.forEach(v=>{
      //   templateUids.push(v.uid)
      // })
      formData.append("dataTemplate", JSON.stringify(this.chooseTemps));

      formData.append("workspace", this.value);
      formData.append("img", this.imgUrl);
     

     

      this.form.myWokrspace.forEach((v)=>{
        if(v.id===this.value){
          
          formData.append("workSpaceName", v.name);
        }
      })


       
      if(this.isEditType){
        //workspaceId
        let _self=this
        let originalId=this.form.workspaceId;
              formData.append("id",this.$route.query.id)
              formData.append("originalWS",originalId)

                httpUtils.post(this, urlUtils.update_udx_schema, formData, data => {
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                  //TODO 数据创建成功后跳转到回列表
                  this.$router.replace("/console/service/data");

                });
      }else{
          httpUtils.post(this, urlUtils.udx_source_upload, formData, data => {
                  this.$message({
                    type: "success",
                    message: "保存成功啦"
                  });
                  //TODO 数据创建成功后跳转到回列表
                  this.$router.replace("/console/service/data");
                  // this.$router.replace("/console/service/"+_self.type);
                   
                });
      }
      



    },
    handleRemove(file, fileList) {
      console.log("remove", file, fileList);
    },
    handlePreview(file) {
      console.log("preview", file);
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      // console.log("change", file, fileList);
    },
    handleExceed(file) {
      console.log("exceed", file);
    },
    handleClose(tag) {
      this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1);
    },
 handleCloseTpm(tag) {
      this.chooseTemps.splice(this.chooseTemps.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    tableRowClassName({row, rowIndex}) {
            if (rowIndex ===1) {
              return 'success-row';
            }  
            return '';
          },
    getTemplateContent(row){
      let self=this
      this.$axios.get('/api/'+urlUtils.temCont+'?uid='+row.uid)
        .then(res=>{
          if(res.status===200){
            self.xmlContent=res.data.xml
            self.xmlPreview=true
          }
        })
    },
    handleSizeChange(val){
       this.pageSize=val
    },
     handleCurrentChange(val) {
       this.selectTemplate()
     },
     chooseTemp(row){
       let obj={},flag=true
        
        for(let i=0;i<this.chooseTemps.length;i++){
          if(this.chooseTemps[i]['uid']===row.uid){
            flag=false;
            this.$message("have chosen this template!")
            break;
          }
        }
        if(flag){
          obj['name']=row.name
          obj['uid']=row.uid
          this.chooseTemps.push(obj)
        }
       
        

     },



    //用户的工作空间
    myWokrspace(type){
      httpUtils.get(this, urlUtils.get_source_list + "?type=" + type+"&username="+this.user.username+"&uid="+this.user.uid, data => {
        this.form.myWokrspace = data;
      });

      console.log(this.form.myWokrspace)
    }



  }
};
</script>

<style>
.upload {
  width: 300px;
}
.data-preview {
  padding: 10px;
  background-color: #f9f9f9;
}
.data-preview .tips {
  margin: 8px 4px 12px;
  color: #909399;
  font-size: 16px;
}
.data-preview .tips span {
  margin-left: 4px;
  font-size: 14px;
}

/* tag */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
/* img */

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-upload__input{
    display: none !important;
  }
</style>
