<template>
  <div id="LoginPanel">
    <div id="form" class="bg-dark md-elevation-5">
      <h1>Login</h1>
            <md-button
        @click="Close"
        class="md-flat"
        style="position: absolute;  top: 0px; right: 0px; min-width: 10px">
        <md-icon>close</md-icon>
      </md-button>
      <form style="padding-left: 20px; padding-right: 20px">
      <md-field>
        <label>Email:</label>
        <md-input></md-input>
      </md-field>
      <md-field>
      <label>Password:</label>
      <md-input type="password"></md-input>
    </md-field>
    <md-button id="LoginSubmitBtn" class="md-raised md-primary">Login</md-button>
    </form>
    </div>
  </div>
</template>
<script>
export default {
  name: "LoginPanel",
  methods: {
    Close: function(){
      document.getElementById("loginBtn").click();
    }
  }
}
</script>

<style scoped>
#LoginSubmitBtn{
    width: 130px;
    float: right;
    right: -8px;
}
#LoginPanel {
  width: 100%;
}
#form {
  position: absolute;
  left: calc(50% - 400px / 2);
  height: 260px;
  width: 400px;
  top: 110px;
  z-index: 50;
  color: #fff;
}
</style>