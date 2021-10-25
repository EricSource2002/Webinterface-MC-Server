<template>
  <div id="app">
    <LoginPanel :key="showLogin" v-if="showLogin" />
    <div
      id="DarkBGlayer"
      v-if="showLogin"
      style="position: absolute; z-index: 20; height: 100%; width: 100%; background-color:#00000057"
    ></div>
    <div id="nav" class="md-elevation-8">
      <md-button class="navBtn nav-left" @click="$router.push({name: 'Dashboard'})">Dashboard</md-button>
      <md-button class="navBtn nav-left">Forum</md-button>
      <md-button class="navBtn nav-right" @click="LoginPanel" id="loginBtn">Login</md-button>
    </div>
    <router-view />
  </div>
</template>
<script>
import LoginPanel from "./components/LoginPanel.vue";
import client from  "@/global.js";
import io from  "socket.io-client";
export default {
  data() {
    return {
      showLogin: false,
    };
  },
  components: {
    LoginPanel
  },
  methods: {
    LoginPanel: function() {
      if (!this.showLogin) {
        this.showLogin = true;
           document.getElementById("app").style = "overflow-y: hidden";
      } else {
        this.showLogin = false;
           document.getElementById("app").style = "overflow-y: auto";
      }
      console.log(this.showLogin);
    }
  },
 created(){
   //CONNECT TO MAIN SERVER
   client.socket = io("http://localhost:80");
 }
};
</script>
<style>
.md-tabs.md-theme-default .md-tabs-navigation {
  background-color: #0000004f !important;
  z-index: 20;
}
html.md-theme-default {
  background-color: #212529 !important;
}
body {
  background-color: #212529 !important;
  height: 100%;
}
#app {
  font-family: Poppins,Helvetica,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #212529 !important;
  height: 100%;
  overflow-x: hidden;
}
.vs-con-items {
  width: 100% !important;
}
.btn-responsive-line {
  background-color: rgb(255, 255, 255) !important;
  margin-left: 0;
}
</style>
<style scoped>
#nav {
  width: 100%;
  height: 50px;
  background-color: #0000004f;
}
.navBtn {
  color: rgba(255, 255, 255, 0.753) !important;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border-radius: 0;
  margin: 0;
  height: 50px;
}
.nav-left {
  float: left;
}
.nav-right {
  float: right;
  color: rgb(255, 255, 255) !important;
}
h4 {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
button {
  margin-left: 10px;
}
</style>