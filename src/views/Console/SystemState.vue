<template>
   <div>

   <el-table
      :data="atateData"
      style="width: 100%">
      <el-table-column
        prop="item"
        :label="$t('system_state.item')"
        width="220">
      </el-table-column>
      <el-table-column
        prop="content"
        :label="$t('system_state.cont')"

        width="380">
      </el-table-column>
      <el-table-column
        prop="operation"
        :label="$t('system_state.oper')"
       >
      </el-table-column>
    </el-table>


   </div>
</template>
<script>
export default {
  data() {
    return {
      atateData: [
        {
          item: '版本',
          content: 'v1.0',

        },
        {
          item: '文件存储路径',
          content: 'F:\\udx\\UdxServer\\Server\\tmp',

        },
        {
          item: '数据库',
          content: 'MongoDB',

        },

        {
          item: '数据库名',
          content: 'VgeConfigurableDataDB',

        },

      ],
    };
  },
};
</script>
<style lang="scss">
</style>
