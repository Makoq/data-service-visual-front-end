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
<!--     系统状态显示-->
     <div id="systemChart" ref="chart"></div>
   </div>
</template>
<script>
import echarts from 'echarts';

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
      // 系统状态显示所需参数
      time: [0.1, 0.2, 0.3, 0.4, 0.2, 0.6, 0.1, 0.2, 0.9, 0.5],
      cpu: [0.1, 0.4, 0.1, 0.3, 0.8, 0.7, 0.5, 0.4, 0.6, 0.7],
      mem: [0.1, 0.2, 0.3, 0.4, 0.2, 0.6, 0.1, 0.2, 0.9, 0.5],
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    addData(shift) {
      try {
        this.$http.get('/systemStatus')
          .then((res) => {
            this.time.push(res.data.timer);
            this.mem.push(res.data.mem);
            this.cpu.push(res.data.cpu);
          });
      } catch (e) {
        console.log(e);
      }
      if (shift) {
        this.time.shift();
        this.mem.shift();
        this.cpu.shift();
      }
    },
    drawLine() {
      const myChart = echarts.init(this.$refs.chart);
      // for (let i = 0; i < 10; i++) {
      //   this.addData();
      // }
      myChart.setOption({
        title: { text: 'cpu及内存占用率' },
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['ROM使用率', 'CPU使用率'],
        },
        xAxis: [{
          boundaryGap: false,
          data: this.time,
          splitLine: { show: false },
          axisLabel: { interval: 0 },
        }],
        yAxis: {},
        series: [
          {
            name: 'ROM使用率',
            type: 'line',
            data: this.mem,
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#8ec6ad',
                }, {
                  offset: 1,
                  color: '#ffe',
                }]),
              },
            },
          },
          {
            name: 'CPU使用率',
            type: 'line',
            data: this.cpu,
            smooth: true,
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#505765',
                }, {
                  offset: 1,
                  color: '#ffe',
                }]),
              },
            },
          },
        ],
      });
      // 开始轮询获取数据
      window.setInterval(() => {
        setTimeout(() => {
          const urlHash = window.location.hash;
          if (urlHash === '#/console/state') {
            this.addData(true);
            myChart.setOption({
              xAxis: { data: this.time },
              series: [
                {
                  data: this.mem,
                },
                {
                  data: this.cpu,
                },
              ],
            });
          }
          // this.addData(true);
        }, 0);
      }, 5000);
    },
  },
};
</script>
<style lang="scss">
  #systemChart {
    margin-top: 100px;
    width: 100%;
    height: 500px;
  }
</style>
