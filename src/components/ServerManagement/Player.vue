<template>
  <div class="PlayerPage" style="margin-left: 10px; margin-right: 10px; height: 100%;">
    <b-row style="height: 100%">
      <b-col cols="0.5" style="padding: 0px; z-index: 5">
        <SideNav />
      </b-col>
      <b-col>
        <b-row>
          <h1
            style="color: white; width: 100%; text-align: left; margin-left: 12px; padding-top: 5px"
          >Player</h1>
          <b-col lg="4" md="6" xs="12" id="CurrentPlayer">
            <div style="height: 500px; padding-top: 80px;" class="bg-dark md-elevation-8">
              <h3 class="cardTitle">Current</h3>
              <md-button  @click="Refresh('current')" class="RefreshBtn md-raised md-primary">Refresh</md-button>
              <b-row class="sortBar">
                <b-col style="padding: 0">
                  <md-button class="sortBtn" @click="Sort('name')">Name</md-button>
                </b-col>
                <b-col style="padding: 0">
                  <md-button class="sortBtn" @click="Sort('rang')">Rang</md-button>
                </b-col>
              </b-row>
              <div id="PlayerContainer">
                <h1 v-if="currentPlayers[0] == null" class="Empty">Empty</h1>
                <div v-for="player in currentPlayers" :key="player.rang" style="height: 50px">
                  <b-row class="PlayerCard md-elevation-5">
                    <b-col style="padding: 0">{{player.name}}</b-col>
                    <b-col style="padding: 0">
                      {{player.rang}}
                      <md-button class="EditBtn"
                      >
                        <md-icon>settings</md-icon>
                      </md-button>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </b-col>
          <b-col lg="4" md="6" sm="12" xs="12" id="BannedPlayer">
            <div style="height: 500px; padding-top: 80px;" class="bg-dark md-elevation-8">
              <h3 class="cardTitle">Banned</h3>
              <md-button @click="Refresh('banned')" class="RefreshBtn md-raised md-primary">Refresh</md-button>
              <b-row class="sortBar">
                <b-col style="padding: 0">
                  <md-button class="sortBtn">Name</md-button>
                </b-col>
                <b-col style="padding: 0">
                  <md-button class="sortBtn">Time</md-button>
                </b-col>
              </b-row>
              <div id="PlayerContainer">
                <h1 v-if="bannedPlayers[0] == null" class="Empty">Empty</h1>
                <div v-for="player in bannedPlayers" :key="player.rang" style="height: 50px">
                  <b-row
                    class="PlayerCard md-elevation-5"
                  >
                    <b-col style="padding: 0">{{player.name}}</b-col>
                    <b-col style="padding: 0">
                       {{player.time}}
                      <md-button
                        class="EditBtn"
                      >
                        <md-icon>settings</md-icon>
                      </md-button>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </b-col>
           <b-col lg="4" md="6" sm="12" xs="12" id="WhiteListPlayer">
            <div style="height: 500px; padding-top: 80px;" class="bg-dark md-elevation-8">
              <h3 class="cardTitle">Whitelist</h3>
              <md-button @click="Refresh('whitelist')" class="RefreshBtn md-raised md-primary">Refresh</md-button>
              <b-row class="sortBar">
                <b-col style="padding: 0">
                  <md-button class="sortBtn">Name</md-button>
                </b-col>
                <b-col style="padding: 0">
                  <md-button class="sortBtn">Rang</md-button>
                </b-col>
              </b-row>
              <div id="PlayerContainer">
                <h1 v-if="whiteListPlayers[0] == null" class="Empty">Empty</h1>
                <div v-for="player in whiteListPlayers" :key="player.rang">
                  <b-row
                    class="PlayerCard md-elevation-5"
                  >
                    <b-col style="padding: 0">{{player.name}}</b-col>
                    <b-col style="padding: 0">
                       {{player.rang}}
                      <md-button
                        class="EditBtn"
                      >
                        <md-icon>settings</md-icon>
                      </md-button>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import global from "@/global.js";
import SideNav from "../SideNav.vue";
export default {
  name: "Player",
  components: {
    SideNav
  },
  data: () => ({
    socket: {},
    server: null,
    currentPlayers: [],
    bannedPlayers: [],
    whiteListPlayers: []
  }),
  created() {
    if (global.server == null) {
      this.$router.push({ path: "Dashboard" });
    } else {
      this.socket = global.socket;
      if(!this.socket.connected) return;
      this.server = global.server;
      this.socket.emit("PlayerInfo", this.server);
      this.socket.emit("bannedPlayer", this.server);
      this.socket.emit("whiteListPlayer", this.server);
    }
  },
  methods: {
    Sort: function(sortInfo) {
      this.currentPlayers.sort(function(a, b) {
        let sortA, sortB;
        switch (sortInfo) {
          case "name":
            sortA = a.name.toLowerCase();
            sortB = b.name.toLowerCase();
            break;
          case "rang":
            sortA = a.rang.toLowerCase();
            sortB = b.rang.toLowerCase();
            break;
        }
        if (sortA < sortB) return -1;
        if (sortA > sortB) return 1;
        return 0;
      });
    },
    Refresh: function(refreshInfo){
      switch(refreshInfo){
        case "current": this.socket.emit("PlayerInfo", this.server);
        break;
        case "banned": 
        break;
      }
    }

  },
  mounted() {
    this.socket.on("reloadUser", data => {
      this.currentPlayers = [];
      data.forEach(user => {
        this.currentPlayers.push({ name: user, rang: "DEFAULT" });
        this.$forceUpdate();
      });
    });
    this.socket.on("bannedPlayerUpdate", data => {
     this.bannedPlayers = [];
       data.forEach(user => {
        this.bannedPlayers.push({ name: user.name, time: user.time });
        this.$forceUpdate();
      });
    });
    this.socket.on("whiteListPlayerUpdate", data => {
     this.whiteListPlayers = [];
       data.forEach(user => {
        this.whiteListPlayers.push({ name: user.name, rang: user.rang });
        this.$forceUpdate();
      });
    });
  }
};
</script>
<style scoped>
.PlayerCard {
  color: white;
  padding-top: 15px;
  background-color: #3f51b5;
  height: 50px;
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 4px;
  border-radius: 20px;
}
.RefreshBtn {
  position: absolute;
  right: 17px;
  top: 3px;
}
.EditBtn{
  position: absolute; 
  right: -8px; 
  top: -21px; 
  min-width: 50px; 
  height: 50px; 
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
#CurrentPlayer,
#BannedPlayer,
#WhiteListPlayer
{
  margin-top: 7px;
}
#PlayerContainer {
  height: 395px;
  overflow-y: show;
  overflow-x: hidden;
  margin: 10px;
  padding-top: 2px;
  background-color: #21252982;
}
.cardTitle {
  top: 1px;
  left: 20px;
  position: absolute;
  color: white;
}
.Empty {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: rgba(240, 248, 255, 0.137);
  font-size: 52px;
  margin-top: 136px;
}
.sortBar {
  position: absolute;
  width: 100%;
  left: 7px;
  padding-left: 33px;
  padding-right: 17px;
  top: 50px;
}
.sortBtn {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  border-radius: 0;
  width: -webkit-fill-available;
  margin: 0;
  height: 40px;
  font-size: 16px;
}
</style>
<style>
.md-table-content {
  background-color: rgb(44, 49, 54) !important;
}
</style>