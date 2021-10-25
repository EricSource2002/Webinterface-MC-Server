<template>
  <div id="ServerConfig">
    <md-steppers :md-active-step.sync="active" md-linear class="bg-dark md-elevation-8">
      <md-step id="first" md-label="Server" :md-done.sync="first" :md-error="firstStepError">
        <md-field style="width: 225px">
          <label>my-server</label>
          <md-input id="servernameInput" v-model="maxLength" maxlength="12"></md-input>
          <span class="md-suffix">.net</span>
        </md-field>
          <b-form-select id="VersionSelect" v-model="selectedServerSoftware" :options="serverSoftware"></b-form-select>
        <b-form-select id="VersionSelect" v-model="selectedVersion" :options="versions"></b-form-select>
        <md-button
          class="md-raised md-primary continue"
          @click="nextStep('first', 'second')"
        >Continue</md-button>
      </md-step>

      <md-step id="second" md-label="Ram" :md-error="secondStepError" :md-done.sync="second">
        <b-row>
          <b-col cols="8">
            <h1
              style="position: absolute; width: 100%;  margin-top: 70px; margin-left: -12px"
            >{{ram}}GB</h1>
            <md-progress-spinner :md-diameter="140" :md-stroke="14" :md-value="value"></md-progress-spinner>
            <vs-slider
              style="min-width: 100% !important;"
              :min="2"
              :max="16"
              step="2"
              v-model.number="ram"
              @change="sliderValue"
            />
          </b-col>
          <b-col>
            <ul style="list-style: none; width: 100%; float: left">
              <li>
                <md-icon>people</md-icon>
                <md-chip class="md-accent" style="float: left; margin-left: 10px">{{player}}</md-chip>
              </li>
            </ul>
          </b-col>
        </b-row>
        <md-button
          class="md-raised md-primary continue"
          @click="nextStep('second', 'third')"
        >Continue</md-button>
      </md-step>
      <md-step style="height: max-content;" id="third" md-label="World" :md-done.sync="third">
        <md-button
          id="CreateBtn"
          class="md-raised md-primary continue"
          @click="nextStep('third')"
        >Create</md-button>
        <b-row>
          <b-col md="6" sm="6" xs="12">
            <div id="booleanContainer" class="md-elevation-4">
              <md-switch
                v-for="item in configBooleanArray"
                :key="item"
                v-model="boolean"
                class="md-primary"
                value
                style="width: 100%"
              >{{item}}</md-switch>
            </div>
          </b-col>
          <b-col md="6" sm="6" xs="12">
            <div id="InputContainer" class="md-elevation-4">
              <md-field v-for="item in configInputArray" :key="item" style="width: 100%;">
                <label>{{item}}</label>
                <md-input></md-input>
                <span
                  class="md-helper-text"
                >{{configInputDefaultArray[configInputArray.indexOf(item)]}}</span>
              </md-field>
            </div>
          </b-col>
          <b-col md="6" sm="6" xs="12" style="margin-top: 5px">
            <md-button
              style="width:100%; margin-left: auto; margin-right: auto"
              class="md-raised md-accent"
            >Reset all</md-button>
          </b-col>
          <b-col md="6" sm="6" xs="12" style="margin-top: 5px">
            <md-button
              @click="create"
              class="md-raised md-primary"
              style="width:100%; margin-left: auto; margin-right: auto"
            >Create</md-button>
          </b-col>
        </b-row>
      </md-step>
    </md-steppers>
  </div>
</template>
<script>
import global from "@/global.js";
export default {
  name: "ServerConfig",
  data: () => ({
    socket: {},
    active: "first",
    first: false,
    second: false,
    third: false,
    secondStepError: null,
    ram: 2,
    value: 12.5,
    maxLength: null,
    player: 4,
    selectedVersion: null,
    versions: null,
    //
    selectedServerSoftware: "Spigot/Vanilla",
    serverSoftware: ["Spigot/Vanilla", "Forge"],
    //
    configBooleanArray: [],
    configInputArray: [],
    configInputDefaultArray: []
  }),
  created() {
    this.socket = global.socket;
    if(!this.socket.connected) return;
    this.socket.emit("checkVersions");
    this.socket.emit("checkConfig");
  },
  mounted() {
    this.socket.on("getVersions", versions_ => {
      this.versions = versions_;
      this.selectedVersion = versions_[0];
    }),
      this.socket.on("getConfig", config => {
        config.forEach(line => {
          let x = line.split("=")[1];
          let y = line.split("=")[0];
          switch (y) {
            case "online-mode":
            case "enable-rcon":
            case "max-players":
            case "network-compression-threshold":
            case "server-ip":
            case "level-name":
            case "resource-pack":
              return;
          }
          if (x == "true" || x == "false") {
            this.configBooleanArray.push(y);
          } else {
            this.configInputArray.push(y);
            this.configInputDefaultArray.push(x);
          }
        });
        this.$forceUpdate();
      });
  },
  methods: {
    create() {
      let servername = document.getElementById("servernameInput").value;
      let version = this.selectedVersion;
      let slots;
      if(this.player == "∞"){
        slots = 100;
      }else{
        slots = this.player;
      }
      console.log(servername, version);
      this.socket.emit("create", { servername: servername, 
                                   version: version, 
                                   serversoftware: this.selectedServerSoftware, 
                                   ram: this.ram * 1000,
                                   slots: slots});
      this.$router.push({ path: 'Dashboard' })
    },
    nextStep(id, index) {
      if (document.getElementById("servernameInput").value.length >= 3) {
        this[id] = true;
        this.firstStepError = null;
        if (index) {
          this.active = index;
        }
      } else {
        this.setError("first");
      }
    },
    setError(object) {
      switch(object){
      case "first": this.firstStepError = " "; break;
      case "second": this.firstStepError = " "; break;
      case "third": this.firstStepError = " "; break;
      }
      this.$forceUpdate();
    },
    sliderValue(value) {
      this.value = (value * 100) / 16;
      switch (this.ram) {
        case 2:
          this.player = "10";
          break;
        case 4:
          this.player = "24";
          break;
        case 6:
          this.player = "32";
          break;
        case 8:
          this.player = "50";
          break;
        default:
          this.player = "∞";
      }
    }
  }
};
</script>

<style scoped>
#booleanContainer {
  height: 1080px;
  text-align: left;
  padding-left: 15px;
}
#InputContainer {
  height: 1080px;
  text-align: left;
  padding-left: 15px;
  margin-top: -4px;
  padding-right: 15px;
}
#CreateBtn {
  margin-top: 443px;
  position: absolute;
}
.continue {
  float: right;
  top: 9px;
  left: 19px;
}
#VersionSelect {
  width: 140px;
  float: left;
  border-radius: 3px;
  border: none;
  background-color: #292e33;
  color: rgb(190, 192, 194);
  position: relative;
  margin-top: 5px;
}
#ServerConfig {
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  max-width: 800px;
}
.RamSlider {
  margin-top: 40px;
  max-width: 100px;
}
.md-progress-spinner {
  margin: 24px;
}
.md-icon {
  float: left;
  margin-top: 4px;
}
</style>