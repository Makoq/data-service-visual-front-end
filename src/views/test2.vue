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
          action="/te/publicdata"
          :data="form"
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


    <!-- <input type="file" id="file" multiple="multiple" onchange="handleFile()"> -->
    

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
      uploadurl:'/te/publicdata',
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
    beforeAvatarUpload(file){
     
      console.log("bef",file)
    },
     
  }
};
</script>
<style scoped>
.upload-demo input .el-upload__input{
  display: none!important;
}
</style>>