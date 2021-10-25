<template>
  <div class="serverCard" style="margin-top: 7px">
    <div v-if="false" class="pb-xlg bg-dark md-elevation-8" style="height: 250px ">
      <b-row>
        <b-col cols="4">
          <h4 class="text-light" style="text-align: left; padding-left: 10px;">{{serverName}}</h4>
          <md-button
            @click="editBtn"
            class="md-raised md-primary"
            style="z-index: 0"
          >EDIT</md-button>
        </b-col>
        <b-col cols="8">
          <div id="ServerStatusContainer">
            <h6 style="float: left; ">Server status:</h6>
            <md-chip v-if="status == 'offline'" class="md-accent status">Offline</md-chip>
            <md-chip v-if="status == 'online'" class="green-bg status">Online</md-chip>
          </div>
          <md-progress-bar id="playerBar" md-mode="indeterminate"></md-progress-bar>
          <md-chip id="playerChip" class="md-primary">{{player}}/{{slots}}</md-chip>
        </b-col>
      </b-row>
    </div>
    <div class="pb-xlg bg-dark md-elevation-8" style="height: max-content">
      <b-row>
        <h5 style="position: absolute; right: 30px; padding-top: 5px; color: #929da7">{{version}}</h5>
        <b-col  md="4" sm="12" xs="12" id="EditContainer">
          <h4 class="text-light" style="text-align: center; margin-top: 10px">{{serverName}}</h4>
          <img id="serverIMG" src="@/assets/SCpic.png"/>
          <md-button
          id="EditBtn"
            @click="editBtn"
            class="md-raised md-primary"
          >EDIT SERVER</md-button>
        </b-col>
        <b-col md="8" sm="12" xs="12">
          <div id="StatusContainer">
            <h6 style="float: left">Server status:</h6>
            <md-chip v-if="status == 'offline'" class="md-accent status">Offline</md-chip>
            <md-chip v-if="status == 'online'" class="green-bg status">Online</md-chip>
          </div>
          <div id="PlayerContainer">
          <h6 style="float: left; margin-top: 59px; position: absolute">Players:</h6>
          <md-progress-bar id="playerBar" mode="determinate" :md-value="player" style></md-progress-bar>
          <md-chip id="playerChip" class="md-primary">{{player}}/{{slots}}</md-chip>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import global from '@/global.js'
export default {
  name: "ServerCard",
  props: {
    serverName: {},
    serverPort: {},
    player: {},
    slots: {},
    status: {},
    version: {}
  },
  methods: {
    editBtn(){
        global.server = this.serverName;
        this.$router.push({ name: 'Control' });
    }
  }
};
</script>
<style scoped>
#EditBtn{
  top: 3px;
}
#serverIMG{
  width: 80px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
#EditContainer{
  height: 180px;
}
#PlayerContainer{
  color: rgba(255, 255, 255, 0.568);
  padding-left: 15px;
  height: 100px;
}
#playerBar {
  margin-top: 40px;
  width: -webkit-fill-available;
  float: left;
  margin-right: 125px;
  margin-left: 112px;
}
#playerChip {
  float: right;
  margin-right: 55px;
  margin-top: -20px;
  display: block;
  z-index: 20;
  width: 65px;
}
#StatusContainer {
  color: rgba(255, 255, 255, 0.568);
  padding-top: 20px;
  padding-left: 15px;
}
.serverCard {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}
.status {
  display: block;
  float: left;
  font-size: 11px;
  width: 60px;
  margin-top: -6px;
  margin-left: 10px;
}
.green-bg {
  background-color: #18c05e !important;
}
</style>