<template>
  <div style="height: 100%">
    <div v-if="showDeletePopup">
      <DeletePopup :server="server"/>
      <div style="position: fixed; width: 100%; height: 100%; background: #0000007a; z-index: 20"></div>
    </div>
    <div id="ControlPage" style="margin-left: 10px; margin-right: 10px; height: 100%;">
      <b-row style="height: 100%">
        <b-col cols="0.5" style="padding: 0px; z-index: 5">
          <SideNav />
        </b-col>
        <b-col>
          <b-row>
            <h1
              style="color: white; width: 100%; text-align: left; margin-left: 12px; padding-top: 5px"
            >Control</h1>
            <b-col lg="4" md="12" sm="12" xs="12" id="Control-Panel">
              <div class="pb-xlg bg-dark PanelRegular md-elevation-8">
                <ul style="height: 100%; list-style: none">
                  <li>
                    <h4
                      class="text-light"
                      style="float: left; margin-top: 5px; margin-left: 10px"
                    >Control</h4>
                    <md-button id="deleteBtn" @click="Delete" class="md-raised md-accent">
                      <md-icon>delete_forever</md-icon>
                    </md-button>
                  </li>
                  <li class="controlListItem" style="margin-top: 55px">
                    <h5 style="color: white; ">Status:</h5>
                    <md-chip
                      v-if="status == 'offline' || status == 'loading'"
                      class="md-accent"
                      style="float: left"
                    >Offline</md-chip>
                    <md-chip v-if="status == 'online'" class="green-bg" style="float: left">Online</md-chip>
                  </li>
                  <li class="controlListItem" style="margin-top: 95px">
                    <h5 style="color: white; ">Ipv4:</h5>
                    <md-chip class="md-primary" style="float: left">hexenzwiebel.ddns.net</md-chip>
                  </li>
                  <li class="controlListItem" style="margin-top: 135px">
                    <h5 style="color: white;">Player:</h5>
                    <md-chip class="md-primary" style="float: left">{{player}}/{{slots}}</md-chip>
                  </li>

                  <md-button
                    v-if="status == 'offline'"
                    v-on:click="StartServer()"
                    id="StartBtn"
                    class="md-raised green-bg"
                  >Start</md-button>
                  <md-button
                    v-if="status == 'online'"
                    v-on:click="StopServer()"
                    id="StopBtn"
                    class="md-raised md-accent"
                  >Stop</md-button>
                  <div v-if="status == 'loading'">
                    <h6
                      style="position: absolute; margin-top: 170px; right: 53px; color: #FF5252"
                    >Loading</h6>
                    <fulfilling-square-spinner
                      style="position: absolute; margin-top: 170px; right: 25px"
                      :animation-duration="4000"
                      :size="20"
                      color="#FF5252"
                    />
                  </div>
                </ul>
              </div>
            </b-col>
            <b-col lg="4" md="6" sm="12" xs="12" id="Chat-Panel">
              <div class="pb-xlg bg-dark PanelRegular md-elevation-8">
                <h4 class="text-light" style="float: left; margin-top: 5px; margin-left: 10px">Chat</h4>
                <div id="ChatContainer"></div>
              </div>
            </b-col>
            <b-col lg="4" md="6" sm="12" xs="12" id="Player-Panel">
              <div class="pb-xlg bg-dark PanelRegular md-elevation-8">
                <h4
                  class="text-light"
                  style="float: left; margin-top: 5px; margin-left: 10px"
                >Player</h4>
                <div id="PlayerContainer"></div>
              </div>
            </b-col>
            <b-col id="Console-Panel" sm="12">
              <div v-show="ConsoleExpand" class="pb-xlg bg-dark Console-Large md-elevation-8">
                <h4
                  class="text-light"
                  style="float: left;text-align: left; margin-top: 5px; margin-left: 10px; width: 100%"
                >Console</h4>
                <div id="ConsoleContainer"></div>
                <form
                  autocomplete="off"
                  id="consoleFormLarge"
                  style="margin-left: 15px; margin-right: 15px; margin-top: 45px"
                >
                  <md-field style="text-align: center; justify-content: center">
                    <label>Command</label>
                    <span class="md-prefix">/</span>
                    <md-input id="consoleInputLarge"></md-input>
                  </md-field>
                  <md-button id="ConsoleReduceBtn" class="md-raised" @click="ReduceConsole">
                    <md-icon>keyboard_arrow_up</md-icon>
                  </md-button>
                </form>
              </div>
              <div v-show="!ConsoleExpand" class="pb-xlg bg-dark Console-Small md-elevation-8">
                <h4
                  class="text-light"
                  style="float: left;text-align: left; margin-top: 5px; margin-left: 10px; width: 100%"
                >Console</h4>
                <form
                  autocomplete="off"
                  id="consoleFormSmall"
                  style="margin-left: 15px; margin-right: 15px; margin-top: 45px"
                >
                  <md-field style="text-align: center; justify-content: center; top: 20px">
                    <label>Command</label>
                    <span class="md-prefix">/</span>
                    <md-input id="consoleInputSmall"></md-input>
                  </md-field>
                  <md-button id="ConsoleExpandBtn" class="md-raised" @click="ExpandConsole">
                    <md-icon>keyboard_arrow_down</md-icon>
                  </md-button>
                </form>
                <div style="width: 100%">
                  <md-button id="ConsoleSendBtn" class="md-raised md-primary">Send</md-button>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import global from "@/global.js";
import SideNav from "../SideNav.vue";
import DeletePopup from "./DeletePopup.vue";
import { FulfillingSquareSpinner } from "epic-spinners";

var serverToRun;
var port = 25565;

export default {
  name: "Control",
  components: {
    SideNav,
    DeletePopup,
    FulfillingSquareSpinner
  },
  data() {
    return {
      socket: {},
      status: "loading",
      player: "0",
      slots: "?",
      server: "undefined",
      renderControlBtn: true,
      ConsoleExpand: false,
      showDeletePopup: false
    };
  },
  created() {
    if (global.server == null) {
      this.$router.push({ path: "Dashboard" });
    } else {
      this.socket = global.socket;
      if(!this.socket.connected) return;
      serverToRun = global.server;
      this.server = serverToRun;
    }
  },
  methods: {
    StartServer: function() {
      document.getElementById("ConsoleContainer").innerHTML = "";
      this.socket.emit("runServer", serverToRun);
    },
    StopServer: function() {
      this.socket.emit("command", `stop*${port}`);
    },
    ExpandConsole: function() {
      this.ConsoleExpand = true;
    },
    ReduceConsole: function() {
      this.ConsoleExpand = false;
    },
    Delete: function() {
      if (!this.showDeletePopup) {
        this.showDeletePopup = true;
        document.getElementById("app").style = "overflow-y: hidden";
      } else {
       this.showDeletePopup = false;
       document.getElementById("app").style = "overflow-y: auto";
      }

      console.log(this.showDeletePopup);
    }
  },
  mounted() {
     const consoleContainer = document.getElementById("ConsoleContainer");
     const PlayerContainer = document.getElementById("PlayerContainer");
     const ChatContainer = document.getElementById("ChatContainer");
    if(this.socket.connected){
      console.log("connected!");
      ClearConsole();
      this.socket.emit("ServerInfo", serverToRun);
      this.socket.emit("ReconnectToServer", { name: serverToRun, port: port });
      appendConsoleMessage(`Server: ${serverToRun}`, "cyan");
      appendConsoleMessage(`Port: ${port}`, "cyan");
      appendConsoleMessage("#####################", "yellow");
    }
    let consoleFormLarge = document.getElementById("consoleFormLarge");
    let consoleFormSmall = document.getElementById("consoleFormSmall");
    let consoleInputSmall = document.getElementById("consoleInputSmall");
    let consoleInputLarge = document.getElementById("consoleInputLarge");
    consoleFormLarge.addEventListener("submit", e => {
      e.preventDefault();
      let data = consoleInputLarge.value;
      if (data != "!clear" && serverToRun != null) {
        this.socket.emit("command", `${data}*${port}`);
        consoleInputLarge.value = null;
      } else {
        ClearConsole();
      }
    });
    consoleFormSmall.addEventListener("submit", e => {
      e.preventDefault();
      let data = consoleInputSmall.value;
      if (data != "!clear" && serverToRun != null) {
        this.socket.emit("command", `${data}*${port}`);
        consoleInputSmall.value = null;
      } else {
        ClearConsole();
      }
    });
    this.socket.on("ServerUpdate", data => {
      this.slots = data.slots;
      this.player = data.player.length;
      this.status = data.status;
      this.$forceUpdate();
      reloadPlayerList(data.player);
    });
    this.socket.on("reloadUser", user => {
      this.player = user.length;
      reloadPlayerList(user);
    });
    this.socket.on("statusReturn", status => {
      this.status = status;
      this.$forceUpdate();
    });
    this.socket.on("write-command", data => {
      appendConsoleMessage(data, "white");
    });
    this.socket.on("infoMessage", data => {
      appendConsoleMessage(`INFO(${data})`, "green");
    });
    this.socket.on("errorMessage", data => {
      appendConsoleMessage(`ERROR(${data})`, "red");
    });
    this.socket.on("chatMessage", data => {
      appendChatMessage(data.message, data.time);
    });
    function ClearConsole() {
      consoleContainer.innerHTML = " ";
    }

    function appendConsoleMessage(message, color) {
      let messageElement = document.createElement("div");
      messageElement.innerText = message;
      switch (color) {
        case "green":
          messageElement.style =
            "color: #00ff00; background-color: transparent; float: left; width: 100%";
          break;
        case "white":
          messageElement.style =
            "color: white; background-color: transparent; float: left; width: 100%";
          break;
        case "yellow":
          messageElement.style =
            "color: yellow; background-color: transparent; float: left; width: 100%";
          break;
        case "red":
          messageElement.style =
            "color: red; background-color: transparent; float: left; width: 100%";
          break;
        case "cyan":
          messageElement.style =
            "color: cyan; background-color: transparent; float: left; width: 100%";
          break;
        default:
          messageElement.style =
            "color: white; background-color: transparent; float: left; width: 100%";
      }
      consoleContainer.appendChild(messageElement);
      consoleContainer.scrollTop = consoleContainer.scrollHeight;
    }
    function reloadPlayerList(data) {
      PlayerContainer.innerHTML = null;
      data.forEach(user => {
        let item = document.createElement("div");
        item.innerText = `[DEFAULT] ${user}`;
        PlayerContainer.appendChild(item);
        PlayerContainer.scrollTop = PlayerContainer.scrollHeight;
      });
    }
    function appendChatMessage(message, time) {
      let messageElement = document.createElement("div");
      messageElement.innerText = `[${time}] ${message}`;
      ChatContainer.appendChild(messageElement);
      ChatContainer.scrollTop = ChatContainer.scrollHeight;
    }
  }
};
</script>
<style scoped>
#deleteBtn {
  position: absolute;
  min-width: 10px;
  right: 15px;
  top: 10px;
}
#PlayerContainer,
#ChatContainer {
  width: -webkit-fill-available;
  height: 65%;
  background-color: #21252982;
  overflow-y: scroll;
  overflow-x: hidden;
  word-break: break-all;
  float: left;
  text-align: left;
  margin-top: 12px;
  margin-left: 15px;
  margin-right: 15px;
}
.controlListItem {
  width: 260px;
  float: left;
  position: absolute;
  margin-top: 20px;
  margin-left: 10px;
  list-style: none;
}
#ConsoleExpandBtn {
  float: right;
  top: -112px;
  right: -15px;
}
#ConsoleReduceBtn {
  float: right;
  right: -15px;
  top: -592px;
}
#ConsoleSendBtn {
  float: right;
  top: 37px;
  right: -120px;
  color: white !important;
}
#StartBtn,
#StopBtn {
  float: right;
  top: 150px;
  color: white !important;
}
.green-bg {
  background-color: #18c05e !important;
}
h5 {
  color: white;
  float: left;
  text-align: left;
  margin-top: 3px;
  width: 80px;
}
.PanelRegular {
  height: 200px;
  margin-top: 7px;
  color: white;
}
.Console-Large {
  height: 600px;
  margin-top: -38px;
  color: white;
}
.Console-Small {
  height: 200px;
  margin-top: -38px;
  color: white;
}
#ConsoleContainer {
  overflow-y: scroll;
  overflow-x: hidden;
  word-break: break-all;
  float: left;
  text-align: left;
  margin-top: 12px;
  height: 78%;
  width: -webkit-fill-available;
  background-color: #21252982;
}
#ConsoleContainer {
  padding: 0px !important;
  margin-left: 15px !important;
  margin-right: 15px !important;
}
#Control-Panel,
#Console-Panel {
  padding-left: 15px !important;
  padding-right: 15px !important;
}
</style>