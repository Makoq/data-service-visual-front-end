<template>
  <div>
     
    <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="desc">
      <el-input type="textarea" v-model="form.desc"></el-input>
    </el-form-item>
    <el-form-item label="upload">
      <el-upload
          class="upload-demo"
          ref="upload"
          action="/te/randomsource"
          :data="form"
          :before-upload="before"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :limit="5"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </el-form-item>
    </el-form>


    <form :action="UploadOneServlet" method="post" name="f_upload" enctype="multipart/form-data">
        name<input type="text" name="name" /><br>
        origination<input type="text" name="origination" /><br>
        serverNode<input type="text" name="serverNode" /><br>
        userId<input type="text" name="userId" /><br>


        <input type="file" name="ogmsdata" multiple="multiple" /><br>
        <input type="submit" value="上传" />
    </form>
    

  </div>
</template>
 
<script>
import vueJsonEditor from "vue-json-editor";
import tools from "../utils/tools";
import httpUtils from "../utils/httpUtils";

import vueCanvas from '../components/visualComponents/vueCanvas';

export default {
  data() {
    return {
       UploadOneServlet:'/pd/randomsource',
      form:{
      
        desc:'my data'
      },
      formData:'',
      dataFile:{}
    };
  },

  components: {
    vueJsonEditor,
    vueCanvas
  },
  
  methods: {
     submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
    handleAvatarSuccess(res,file){
      if("source_store_id" in res){
        this.$message("ok")
      } 
    },
    before(file){
     
      console.log("bef",file)
    },
     upload2(){

       let f=document.getElementById("file2").file
       console.log("ff",f)
     }
  }
};
</script>
<style scoped>
.upload-demo input .el-upload__input{
  display: none!important;
}
</style>>