<!-- 登陆文件 -->
<template>
  <div class="login_section">
    <HeadBarLight2></HeadBarLight2>

    <div class="login_content">
      <p>
        登录
      </p>
      <el-input placeholder="请输入用户名" v-model="account"></el-input>
      <el-input placeholder="请输入密码" v-model="pwd" type="password"></el-input>
      <div style="padding-top: 5px">
        <el-checkbox style="margin-left: 5px; float: left">记住我</el-checkbox>
        <div class="no_account">
          <router-link to='/register'> 找回密码</router-link>
        </div>
      </div>
      <el-button class="login_button" type="primary" :loading=this.button_disabled @click.native="doLogin">提交</el-button>
      <div class="no_account">
        <router-link to='/register'> 没有账号</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import HeadBarLight2 from "../components/head/HeadBarLight2.vue";
  import server from '../../config/index';
  import axios from '../axios/http';
  import swal from 'sweetalert'

  export default {
    name: "Login",
    components: {HeadBarLight2},
    data() {
      return {
        account: '',
        pwd: '',
        error: '',
        url: server.url + '/api/session',
        button_disabled: false,
      }
    },
    methods: {
      setCookie: function(c_username, c_password) {
        document.cookie = c_username + ";" + c_password;
      },
      getCookie: function() {
        var c = document.cookie.split(";");
        return c[0];
      },
      doLogin: function () {
        this.button_disabled = true;
        if (this.account == "") {
          this.$message({
            message: '请输入用户名',
            type: 'warning'
          });
        }
        else if (this.pwd == "") {
          this.$message('请输入密码');
        }
        else {
          this.setCookie(this.account,this.pwd)
          this.$store.commit('setToken', "1");
          this.$store.commit('setUsername', this.account);
          sessionStorage.setItem('tokenid', "1");
          sessionStorage.setItem('username', this.account);
          this.$router.push('/center');
        }
        this.button_disabled = false;
      }
    }
  };
</script>

<style>
  .header {
    position: fixed;
    top: 0px;
    width: 100%;
    color: #323a45;
  }

  .login_content {
    text-align: center;
    margin-top: 200px;
    width: 20%;
    margin-left: auto;
    margin-right: auto;
  }

  .login_content > .el-input {
    margin: 5px;
  }

  .login_content > .el-button {
    margin: 8px 5px;
  }

  .login_button {
    width: 100%;
  }

  .no_account {
    float: right;
    cursor: pointer;
    font-size: 12px;
  }

  .no_account > a {
    color: #323a45;
  }
</style>

