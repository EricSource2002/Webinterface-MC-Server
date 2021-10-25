<template>
  <div class="PluginPage" style="margin-left: 10px; margin-right: 10px; height: 100%;">
    <b-row style="height: 100%">
        <b-col cols="0.5" style="padding: 0px; z-index: 5">
          <SideNav />
        </b-col>
        <b-col>
            <h1
              style="color: white; width: 100%; text-align: left; padding-top: 5px"
            >Plugins</h1>
        </b-col>
    </b-row>
  </div>
</template>
<script>
import SideNav from "../SideNav.vue";
import global from "@/global.js"
export default {
  name: "Plugins",
  components: {
    SideNav
  },
  mounted(){
  console.log(global.socket);
  }
}
</script>
<style scoped>

</style>