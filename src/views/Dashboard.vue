<template>
  <div id="dashboard-page" style="padding-top: 15px">
    <b-row>
      <b-col md="9" sm="12" xs="12">
        <div id="serverList" style=" max-width: 800px; padding-left: 10px">
          <div style=" height: 45px; margin-left: auto; margin-right: auto">
            <md-button
              @click="Refresh"
              class="md-raised md-primary"
              style="float: right; z-index: 0; margin-right: 10px"
            >Refresh</md-button>
            <md-button
              @click="$router.push({name: 'ServerConfig'})"
              class="md-raised green-bg"
              style="float: right; z-index: 0; margin-right: 0"
            >New Server</md-button>
          </div>
          <div style="margin-right: 10px">
            <md-app id="serverContainer" class="md-elevation-10">
              <md-app-content style="background-color: #2a2f33; border: none; padding-bottom: 23px;">
                <ServerCard
                  v-for="server in servers"
                  :key="server.name"
                  :serverName="server.name"
                  :serverPort="server.port"
                  :player="server.player"
                  :slots="server.slots"
                  :status="server.status"
                  :version="server.version"
                ></ServerCard>
              </md-app-content>
            </md-app>
          </div>
        </div>
      </b-col>
      <b-col>
        <img
          style="width: 500px; margin-top: 20px; margin-right: auto; margin-left: auto; text-align: center"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.minecraft.net%2Fcontent%2Fdam%2Fminecraft%2Fnews%2Fminecraft-earth-at-e3%2FImageFour.png&f=1&nofb=1"
        />
      </b-col>
    </b-row>
  </div>
</template>
<script>
import global from  "@/global.js";
import ServerCard from "@/components/Dashboard/ServerCard.vue";
export default {
  name: "Dashboard",
  components: {
    ServerCard
  },
  data: function() {
    return {
      socket: {},
      servers: {}
    };
  },
  created() {
    this.socket = global.socket;
    if(!this.socket.connected) return;
      this.socket.emit("AllServerInfo");
  },
  methods: {
    Refresh: function() {
      this.socket.emit("AllServerInfo");
    }
  },
  mounted() {
    this.socket.on("connected", () => {
      console.log("connected!");
      this.socket.emit("AllServerInfo");
    });
    this.socket.on("serverListUpdate", data => {
      data.sort(function(a, b) {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB)
          return -1;
        if (nameA > nameB) return 1;
        return 0; 
      });
      this.servers = data;
      console.log(data);
    });
  }
};
</script>
<style scoped>
#serverList {
  margin-left: auto;
  margin-right: auto;
}
#serverContainer {
  height: 600px;
  width: 100%;
}
.green-bg {
  background-color: #18c05e !important;
}
</style>
