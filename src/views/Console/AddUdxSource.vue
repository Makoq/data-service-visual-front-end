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
          <!-- 连接参数 -->
          <el-form-item :label="$t('addUdxSource.local_path')" prop="name">
            <el-input v-model="form.selectPath" placeholder="" style="width:320px;">
              <template slot="prepend">Local Path:</template>
            </el-input>
            &nbsp;<el-button >{{$t('addUdxSource.select_local_file')}}
                </el-button>
          </el-form-item>
          <!-- 处理方法 -->
          <el-form-item :label="$t('addUdxSource.process_methods')" prop="name">
            <el-input v-model="form.processMethods" placeholder="" style="width:320px;">
              <!-- <template slot="prepend">Local Path:</template> -->
            </el-input>
            
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
        selectPath:'F:/udx/UdxServer/Server/data_dir/testschema',
        workspaceId:'',
        processMethods:''
      },
      value:'',
      inputVisible: false,
      inputValue: "",

      // 上传文件
      fileList: [],
      //编辑数据
      isEditType:false

      
       
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
    if(this.$route.query.type==='edit'){
      this.isEditType=true
        this.initEdit(this.$route.query.id)
    }else{
        
    }
    this.myWokrspace("workspace")
  },
  methods: {
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

      formData.append("workspace", this.value);
     

      this.form.myWokrspace.forEach((v)=>{
        if(v.id===this.value){
          
          formData.append("workSpaceName", v.name);
        }
      })


      console.log("workspace",this.value)
      if(this.isEditType){
        //workspaceId
        console.log(this.form)
        let originalId=this.form.workspaceId;
              formData.append("id",this.$route.query.id)
              formData.append("originalWS",originalId)

                httpUtils.post(this, urlUtils.update_udx_schema, formData, data => {
                  this.$message({
                    type: "success",
                    message: "修改成功"
                  });
                  this.$router.replace("/console/data");
                });
      }else{
          httpUtils.post(this, urlUtils.udx_source_upload, formData, data => {
                  this.$message({
                    type: "success",
                    message: "保存成功"
                  });
                  this.$router.replace("/console/data");
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
</style>
