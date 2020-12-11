<template lang="pug">
  div
    .screen
      .logo {{$t('home_page.title')}}
      .desc {{$t('home_page.subtitle')}}
      transition(name="slide-fade")
        .login-box(v-if="show")
          .radio-group
            .radio-btn(:class="{active: tab == 'login'}" @click="tab = 'login'") {{$t('home_page.login')}}
            .radio-btn(:class="{active: tab == 'reg'}" @click="tab = 'reg'") {{$t('home_page.register')}}
          el-input(:placeholder="$t('home_page.username')" v-model="form.user")
          el-input(
            :placeholder="$t('home_page.password')"
            :type="tab == 'login' ? 'password' : 'text'"
            v-model="form.password"
            @keyup.enter.native="handleClick"
            style="margin-top: 10px;")
      .btn-wrapper
        span.btn(@click="handleClick") {{$t('home_page.enter')}}
</template>

<script>

import md5 from 'js-md5';

export default {
  data() {
    return {
      show: false, // 是否显示登录框
      tab: "login",
      form: {
        user: "lan",
        password: "123"
      }
    };
  },
  mounted() {},
  methods: {
    handleClick() {
      if (!this.show) {
        // 没有显示登录框，直接获取localStorage中的登录信息
        if (localStorage.getItem("uid")) {
           this.$router.push("console"); // 如果localStorage中有信息，则直接登录
        } else {
          this.show = true; // 否则显示登录框
        }
      } else {
        // 开始检查
        const md5pass = md5(this.form.password); // 对密码进行MD5加密
        this.$http
          .post(`/user/${this.tab}`, {
            user: this.form.user,
            pass: md5pass
          })
          .then(res => {
            const { errno, errmsg, data } = res.data;
            if (errno === 0) {
              this.$message({
                type: "success",
                message: "验证成功"
              });
              localStorage.setItem("uid", data.uid);
              localStorage.setItem("user", data.name);
              this.$router.push("console");
            } else {
              this.$message.error(errmsg);
            }
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.screen {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: url("../assets/img/bg2.jpg");
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
}
.logo {
  height: 72px;
  line-height: 72px;
  text-align: center;
  font-weight: bold;
  font-size: 36px;
  color: #515151;
  //color: #fff;
  margin-top: 180px;

  &::after {
    content: ".";
    font-size: 42px;
    color: rgba(255, 0, 0, 0.6);
  }
}
.desc {
  text-align: center;
  font-size: 16px;
  font-weight: 300;
  font-family: "Noto Sans SC", sans-serif;
  // letter-spacing: 4px;
  color: #808080;
  //  color: #fff;
  margin: 0 0 40px;
}

.login-box {
  background: #ffffff;
  width: 240px;
  margin: 20px auto 40px;
  padding: 0 40px 36px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.06);
  .radio-group {
    text-align: center;
    .radio-btn {
      display: inline-block;
      padding: 10px 20px;
      margin: 10px 10px;
      color: #999999;
      &.active {
        color: #212121;
        border-bottom: 2px solid #212121;
      }
    }
  }
}

.btn-wrapper {
  margin-top: 40px;
  text-align: center;
  a {
    text-decoration: none;
    color: #ffffff;
  }
  .btn {
    padding: 12px 32px;
    background: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    transition: background 0.3s ease;
    font-size: 14px;
    border-radius: 50px;
    &:hover {
      background: #409eff;
      cursor: pointer;
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
