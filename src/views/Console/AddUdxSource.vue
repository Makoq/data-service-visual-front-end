<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="ruleForm" label-width="100px" :hide-required-asterisk="true">
          <!-- 名称 -->
          <el-form-item :label="$t('addUdxSource.name')" prop="name">
            <el-input v-model="form.name" placeholder="请输入数据源名称" style="width:220px;"></el-input>
          </el-form-item>
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
          <!-- 上传UDX数据 -->
          <el-form-item :label="$t('addUdxSource.data')">

            <el-upload
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
              <el-button slot="trigger" size="small" type="primary">{{$t('addUdxSource.choose_data')}}</el-button>
              <el-button
                style="margin-left: 10px;"
                size="small"
                type="success"
                @click="submitUpload"
              >{{$t('addUdxSource.upload_to_server')}}</el-button>
              <div slot="tip" style="color:red" class="el-upload__tip">只能上传zip文件，且不超过10MB</div>
            </el-upload>


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

      form:{
        name: "",
        // tag
        dynamicTags: ["UDX", "水文学"],
        desc:''
      },
      
      inputVisible: false,
      inputValue: "",

      // 上传文件
      fileList: []
      // udx_source_upload_url: urlUtils.udx_source_upload
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
  methods: {
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

      // 必须选择文件
      if (this.fileList.length != 1) {
        alert("当且仅当选择一个文件");
        return;
      }

      let formData = new FormData();
      formData.append("file", this.fileList[0].raw);
      formData.append("name", this.form.name);
      formData.append("tags", this.form.dynamicTags);
      formData.append("desc", this.form.desc);


      httpUtils.post(this, urlUtils.udx_source_upload, formData, data => {


        this.$message({
          type: "success",
          message: "保存成功"
        });
        this.$router.replace('/console/data');
      });

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

    // onSubmit() {
    //   var that = this;
    //   that.$refs["ruleForm"].validate(valid => {
    //     if (valid) {
    //       that
    //         .$confirm("确定提交吗？", "提示", {
    //           confirmButtonText: "确定",
    //           cancelButtonText: "取消",
    //           type: "warning",
    //           center: true
    //         })
    //         .then(() => {
    //           console.log(this.newData);
    //           this.$http
    //             .post("/connect/", {
    //               name: this.form.name,
    //               data: this.newData,
    //               uid: this.user.uid
    //             })
    //             .then(res => {
    //               const { errno, data } = res.data;
    //               if (errno === 0) {
    //                 this.$message({
    //                   type: "success",
    //                   message: "保存成功"
    //                 });
    //                 this.$router.push("/console/data");
    //                 // this.editChart(data._id);
    //               }
    //             })
    //             .catch(() => {});
    //         })
    //         .catch(() => {});
    //     } else {
    //       return false;
    //     }
    //   });
    //   // this.$router.push('/console/data')
    // },

    // tag
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
