<template lang="pug">
  div
    el-dialog(title="Statistics Information" :visible.sync="analyseVisible" width="400px")
      el-table(:data="analyseData" :show-header="false")
        el-table-column(property="key")
        el-table-column(property="value")

    el-row(:gutter="36"  v-for = "(page, index) of pages" :key="index")
      el-col(:span="6" v-for="item in page" :key="item.id")
        el-card(:body-style="{ padding: '0px' }" shadow="hover" @click.native="editChart(item.id)")
          img.image(:src="item.img")
          div(style="padding: 14px;")
            span {{item.title}}
            el-dropdown(style="float: right;")
              i.el-icon-more
              el-dropdown-menu(slot="dropdown")
                el-dropdown-item(@click.native="editChart(item.id)") Edit
                el-dropdown-item(@click.native="renameChart(item)") Rename
                el-dropdown-item(@click.native="copyChart(item)") Copy
                el-dropdown-item(@click.native="deleteChart(item.id)") Delete
                el-dropdown-item(@click.native="viewChart(item.id)" divided) View
                el-dropdown-item(@click.native="openChartAnalyse(item)") Statistics
    el-col(:span="24")
      el-card(:body-style="{ padding: '0px' }" shadow="hover" @click.native="addNewChart")
        .add-card
          i.el-icon-circle-plus
</template>s


<script>
/* eslint-disable */

import httpUtils from "../../utils/httpUtils";
import toolUtils from "../../utils/toolUtils";
import urlUtils from "../../utils/urlUtils";

export default {
  // components/Console/Index.Vue 传递过来的 属性 props
  props: ["user"],
  data() {
    return {
      chartList: [],
      analyseData: [],
      analyseVisible: false
    };
  },
  mounted() {
    this.getData();
  },
  computed: {
    // 判断数据行数，用于循环el-row
    pages() {
      const pages = [];
      this.chartList.forEach((item, index) =>{
        const page = Math.floor(index / 4);
        if(!pages[page]){
          pages[page] = [];
        }
        pages[page].push(item)
      })
      return pages
    }
  },
  methods: {
    getData() {
      // console.log(urlUtils.chart + "?uid=" + this.user.uid)
      httpUtils.get(this, urlUtils.chart + "?uid=" + this.user.uid, data => {
        this.chartList = data;
      });

      // this.$http
      //   .get("/chart?uid=" + this.user.uid)
      //   .then(res => {
      //     const { errno, data } = res.data;
      //     if (errno === 0) {
      //       this.chartList = data.chartList;
      //     }
      //   })
      //   .catch(() => {});
    },
    editChart(id) {
      this.$router.push(`/edit/${id}`); // 跳转到编辑页面，带着图表的id
    },
    // 添加新的图表
    addNewChart() {
      toolUtils.prompt(this, "输入大屏标题", "创建大屏项目", "", value => {
        httpUtils.post(
          this,
          urlUtils.chart,
          { title: value, uid: this.user.uid },
          data => {
            this.$message({
              type: "success",
              message: "创建成功"
            });
            this.editChart(data.id); // 新建的 chart 的 id
          }
        );
      });
    },
    renameChart(row) {
      toolUtils.prompt(this, "输入大屏标题", "重命名", row.title, value => {
        httpUtils.put(this, `/chart/${row.id}`, { title: value }, () => {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          setTimeout(() => {
            this.getData();
          }, 100);
        });
      });
    },
    copyChart(row) {
      toolUtils.prompt(
        this,
        "输入大屏标题",
        "复制大屏项目",
        row.title + "_副本",
        value => {
          // 复制当前chart
          httpUtils.post(
            this,
            `/chart/import/${row.id}`,
            { title: value, uid: this.user.uid },
            () => {
              this.$message({
                type: "success",
                message: "创建成功"
              });
              setTimeout(() => {
                this.getData();
              }, 100);
            }
          );
        }
      );
    },
    deleteChart(id) {
      toolUtils.confirm(this, "是否删除大屏项目？", () => {
        httpUtils.del(this, `/chart/${id}`, () => {
          this.$message({
            type: "success",
            message: "已删除"
          });
          setTimeout(() => {
            this.getData();
          }, 100);
        });
      });
    },
    viewChart(id) {
      this.$router.push(`/view/${id}`);
    },
    openChartAnalyse(row) {
      this.analyseVisible = true;
      this.analyseData = [
        {
          key: "Create Time",
          value: this.$dayjs(row.createdAt).format("YYYY-MM-DD HH:mm")
        },
        {
          key: "Edit Time",
          value: this.$dayjs(row.updatedAt).format("YYYY-MM-DD HH:mm")
        },
        {
          key: "Access Number",
          value: row.view
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.page-header-slot {
  position: fixed;
  top: 56px;
  left: 240px;
  right: 0;
  padding: 0 40px 20px;
  z-index: 8;
  background-color: rgba(255, 255, 255, 0.94);

  .search {
    width: 240px;
    float: right;
  }
}

.el-card {
  margin-bottom: 36px;

  .image {
    width: 100%;
    height: 150px;
    display: block;
    opacity: 0.6;
    transition: opacity 0.3s ease;
  }

  &:hover {
    cursor: pointer;
    .image {
      opacity: 0.8;
    }
  }
}

.el-card .add-card {
  height: 200px;
  line-height: 200px;
  text-align: center;
  font-size: 82px;
  color: rgba(0, 0, 0, 0.08);
}
</style>
