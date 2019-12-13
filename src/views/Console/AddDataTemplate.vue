<template  >
  <div>
    <el-form ref="form" :model="form" label-width="120px" :rules="rules">

        <el-form-item label="name" style="width:50%">
            <el-input type="input" v-model="form.name"></el-input>
        </el-form-item>
         <!-- 标签 -->
          <el-form-item label="Tags"  >
            <el-tag
              :key="tag"
              v-for="tag in form.tags"
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
        <el-form-item label="dataTemplate" style="width:80%">
            <el-input type="textarea" v-model="form.xml" rows="40" placeholder="Please organize content in xml format.."></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSubmit">create</el-button>

        </el-form-item>
    </el-form>
  </div>
</template>
<script>
import urlUtils from '../../utils/urlUtils';

export default {
  data() {
    return {
        form: {
            name:'',
            tags:['template'],
            xml:''
        },
        rules:{
            name: [
                    { required: true, message: 'please input name', trigger: 'blur' },
                    { min: 3, max: 30, message: '长度在 3 到 30 个字符', trigger: 'blur' }
                 ],
        },
        inputVisible: false,
        inputValue:''



    };
  },
  mounted() {

  },
  methods: {
    onSubmit() {
        let self=this
        this.form.tags=this.form.tags.join()
        this.$axios.post('/api/'+urlUtils.dataTemplate,this.form)
        .then(res=>{
            if(res.status===200){

                self.$message("create succceddfull!!")


            }

        })
      },
    handleClose(tag) {
      this.form.tags.splice(this.form.tags.indexOf(tag), 1);
    },
     handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.form.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
  }
};
</script>
<style lang="scss" scoped>

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

