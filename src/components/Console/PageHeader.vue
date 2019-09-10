// <template lang="pug">
//   .header
//     .page-title
//       span {{pageTitle}}
//     .icon-row
//       //- el-badge.icon.item(is-dot :hidden="true")
//         i.el-icon-bell
//     el-dropdown
//       .avatar-image
//       el-dropdown-menu(slot="dropdown")
//         el-dropdown-item(disabled) {{ user.username }}
//         el-dropdown-item(divided @click.native="logout") 退出
// </template>

<template>
  <div class="header">
    <div class="page-title">
      <span>{{pageTitle}}</span>
    </div>
    <el-dropdown style="margin-right: 100px">
      <div class="language" id="lan">{{lan}}<i class="el-icon-arrow-down el-icon--right"></i></div>
      <el-dropdown-menu slot="dropdown">

        <el-dropdown-item  @click.native="En">English</el-dropdown-item>
        <el-dropdown-item @click.native="Zh">简体中文</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-dropdown>
      <div class="avatar-image"> </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item disabled>{{ user.username }}</el-dropdown-item>
        <el-dropdown-item divided>Login</el-dropdown-item>
        <el-dropdown-item @click.native="logout">Logout</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>

<script>
import i18n from '../../assets/i18n/index';

export default {
  data() {
    return {
      lan: '简体中文',
      user: {
        uid: localStorage.getItem('uid'),
        username: localStorage.getItem('user'),
      },
    };
  },
  computed: {
    pageTitle() {
      return this.$route.meta.title;
    },
  },
  mounted() {
    if (!this.user.uid) {
      this.logout();
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('uid');
      localStorage.removeItem('user');
      this.$router.push('/');
    },
    En() {
      i18n.locale = 'en_US';
      this.lan = 'English';
    },
    Zh() {
      i18n.locale = 'zh_CN';
      this.lan = '简体中文';
    },

  },
};
</script>

<style lang="scss" scoped>
.header {
  padding: 15px 40px 0;
  display: flex;
  align-items: center;

  .page-title {
    flex: 1;
    font-size: 20px;
    font-weight: normal;
  }

  .icon {
    display: inline-block;
    font-size: 20px;
    margin-right: 14px;

    &:last-of-type {
      margin-right: 28px;
    }
  }

  .avatar-image {
    width: 32px;
    height: 32px;
    background: #ccc;
    border-radius: 50%;
    background-image: url("../../assets/img/profile.jpg");
    background-size: 32px;
  }


}
</style>
