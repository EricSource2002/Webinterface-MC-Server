<template>
  <div class="ConfigPage" style="margin-left: 10px; margin-right: 10px; height: 100%;">
    <b-row style="height: 100%">
        <b-col cols="0.5" style="padding: 0px; z-index: 5">
          <SideNav />
        </b-col>
        <md-button @click="test">test</md-button>
        <b-col>
            <h1
              style="color: white; width: 100%; text-align: left; padding-top: 5px"
            >Config</h1>
        </b-col>
    </b-row>
  </div>
</template>
<script>
 // eslint-disable-next-line no-unused-vars
import client from "@/App.vue";
import SideNav from "../SideNav.vue";
export default {
  name: "Config",
  components: {
    SideNav
  },
  methods: {
    test: function(){
      console.log(client.socket);
    }
  }
}
</script>
<style scoped>

</style>