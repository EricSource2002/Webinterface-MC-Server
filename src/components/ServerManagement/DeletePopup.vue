<template>
  <div id="DeletePopup">
    <div id="form" class="bg-dark md-elevation-5">
      <h3 style="width: 100%; text-align: left; padding-left: 10px">
        Delete
        <span style="color: #ffffff94">{{server}}</span>
      </h3>
      <md-button
        @click="Close"
        class="md-flat"
        style="position: absolute;  top: 0px; right: 0px; min-width: 10px"
      >
        <md-icon>close</md-icon>
      </md-button>
      <h6
        style="width: 100%; text-align: left; padding-left: 10px; color: #ffffff94"
      >Completely deletes your entire server.</h6>
      <form style="padding-left: 20px; padding-right: 20px; padding-top: 30px">
        <md-field
          :class="ErrorClass"
          style="width: 100%; float: left; text-align: left; margin-left: -10px; top: -15px"
        >
          <label>Confirm the server name</label>
          <md-input v-model="serverInput" required></md-input>
        </md-field>
        <md-button id="DeleteBtn" @click="Delete" class="md-raised md-accent">Delete</md-button>
      </form>
    </div>
  </div>
</template>
<script>
import global from  "@/global.js";
export default {
  name: "DeletePopup",
  data() {
    return {
      socket: {},
      serverInput: null,
      showError: false
    };
  },
  props: {
    server: {},
  },
  created() {
    this.socket = global.socket;
  },
  methods: {
    Delete: function() {
      if (this.serverInput == this.server) {
        this.socket.emit("deleteServer", this.server);
        this.showError = false;
        this.$parent.$options.methods.Delete();
        this.$router.push({ path: "dashboard" });
      } else {
        this.showError = true;
      }
    },
    Close: function() {
       document.getElementById("deleteBtn").click();
    }
  },
  computed: {
    ErrorClass() {
      return {
        "md-invalid": this.showError
      };
    }
  }
};
</script>
<style scoped>
#DeleteBtn {
  width: 130px;
  float: right;
  right: -21px;
  top: -3px;
}
#DeletePopup {
  width: 100%;
}
#form {
  position: absolute;
  left: calc(50% - 400px / 2);
  height: 220px;
  width: 400px;
  top: 110px;
  z-index: 50;
  color: #fff;
}
</style>