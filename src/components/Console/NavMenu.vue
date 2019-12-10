<template lang="pug">
  .sidebar
    .logo
      router-link(to="/") {{$t('home_page.title')}}
    router-link.sidebar-item(
      v-for="item in menuList"
      :key="item.name"
      :class="{ active: routePath == item.path }"
      :to="item.path")
      i(:class="item.icon")
      span {{item.name}}
</template>

<script>
export default {
  data() {
    return {
      menuList: [
        {
          name: this.$t('navmenu.service_status'),
          icon: 'el-icon-warning-outline',
          path: '/console/state',
        },
        {
          name: this.$t('navmenu.my_workspace'),
          icon: 'el-icon-folder',
          path: '/console/workspace',
        },
        // {
        //   name: this.$t('navmenu.data_direct_upload'),
        //   icon: 'el-icon-upload2',
        //   path: '/console/directupload',
        // },
        {
          name: this.$t('navmenu.cloud_datalist'),
          icon: 'el-icon-cloudy',
          path: '/console/service/cloud',
        },
        {
          name: this.$t('navmenu.data_management'),
          icon: 'el-icon-s-management',
          path: '/console/service/data',
        },
        {
          name: this.$t('navmenu.udx_dataService'),
          icon: 'el-icon-link',
          path: '/console/service/udx',
        },

        {
          name: this.$t('navmenu.data_process_service'),
          icon: 'el-icon-menu',
          path: '/console/service/process',
        },
        {
          name: this.$t('navmenu.data_process_program'),
          icon: 'el-icon-s-grid',
          path: '/console/service/program',
        },
        {
          name: this.$t('navmenu.my_visualization'),
          icon: 'el-icon-document',
          path: '/console/chart',
        },
        {
          name: this.$t('navmenu.help'),
          icon: 'el-icon-s-help',
          path: '/console/help',
        },
      ],
    };
  },
  computed: {
    routePath() {
      return this.$route.path;
    },
  },
  mounted() {
    // this.routePath = this.$route.path;
  },
  methods: {
    goPath(path) {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 240px;
  background: #f7f9fa;
  z-index: 20;

  .logo {
    height: 120px;
    line-height: 120px;
    text-align: center;
    font-weight: bold;
    font-size: 22px;

    &::after {
      content: ".";
      font-size: 28px;
      color: rgba(255, 0, 0, 0.6);
    }

    a {
      color: #515151;
      text-decoration: none;
    }
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    height: 36px;
    margin: 8px 48px 8px 24px;
    padding: 0 16px;
    font-size: 14px;
    color: #808080;
    border-radius: 8px;
    text-decoration: none;

    &.active {
      color: #222222;
      background: rgba(0, 0, 0, 0.06);
    }

    i {
      font-size: 16px;
      margin-right: 8px;
    }

    &:hover {
      color: #333;
    }
  }
}
</style>
