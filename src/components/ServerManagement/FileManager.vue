<template>
  <div class="FileManagerPage" style="margin-left: 10px; margin-right: 10px; height: 100%;">
    <b-row style="height: 100%">
      <b-col cols="0.5" style="padding: 0px; z-index: 5">
        <SideNav />
      </b-col>
      <b-col>
        <b-row>
          <h1 style="color: white; width: 100%; text-align: left; padding-top: 5px; margin-left: 12px">FileManager</h1>
          <b-col md="6" sm="12" xs="12">
            <div
              style="max-width: 1000px; min-height: 600px; height: max-content; padding-top: 80px; margin-top: 7px;"
              class="bg-dark md-elevation-8"
            >
              <h1
                style="position: absolute; color: white; width: 100%; text-align: left; margin-left: 12px; top: 7px"
              >{{server}}</h1>
              <b-row style="float: left; margin-top: -25px; margin-left: 0px">
                <b-col style="padding-left: 0; padding-right: 0">
                  <md-button class="headerBtn">
                    <i class="material-icons">insert_drive_file</i>
                  </md-button>
                </b-col>
                <b-col style="padding-left: 0; padding-right: 0">
                  <md-button class="headerBtn">
                    <i class="material-icons">create_new_folder</i>
                  </md-button>
                </b-col>
                <b-col style="padding-left: 0; padding-right: 0">
                  <md-button class="headerBtn">
                    <i class="material-icons">cloud_upload</i>
                  </md-button>
                </b-col>
              </b-row>
              <b-row
                v-if="!DeleteCheckBox"
                style="float: right; margin-top: -25px; margin-right: 0px"
              >
                <b-col style="padding-left: 0; padding-right: 0">
                  <md-button @click="showDelete" class="headerBtn">
                    <i class="material-icons">delete_forever</i>
                  </md-button>
                </b-col>
                <b-col style="padding-left: 0; padding-right: 0">
                  <md-button @click="reloadFiles" class="headerBtn">
                    <i class="material-icons">refresh</i>
                  </md-button>
                </b-col>
              </b-row>
              <b-row v-else style="float: right; margin-top: -25px; margin-right: 0px">
                <b-col style="padding-left: 0;  padding-right: 5px">
                  <md-button @click="showDelete" class="headerBtn">CANCEL</md-button>
                </b-col>
                <b-col style="padding-left: 0; padding-right: 10px">
                  <md-button @click="deleteFiles" class="md-raised md-accent headerBtn">DELETE</md-button>
                </b-col>
              </b-row>
              <div
                style="margin-left: 10px; margin-right: 10px; height: 1px; background-color: white; margin-top: 20px"
              ></div>
              <div id="FileContainer">
                <md-button
                  v-show="parentDirectory != null"
                  @click="directorySwitch(parentDirectory, 'back')"
                  class="FileCard"
                >
                  <div style="margin-top: 4px">
                    <i
                      class="material-icons"
                      style="margin-top: 0; text-align: left; float: left; width: 1000px"
                    >arrow_back</i>
                    <h6
                      style="margin-top: -21px;  float: left; text-align: left; padding-left: 30px; width: 1000px;"
                    >Go Back</h6>
                  </div>
                </md-button>
                <md-button
                  @click="directorySwitch(file, 'forward')"
                  class="FileCard md-flat"
                  v-for="file in dir"
                  :key="file.path"
                >
                  <b-row>
                    <b-col v-if="DeleteCheckBox" cols="0.5" style="height: 30px">
                      <md-checkbox
                        v-if="!blockedFiles.includes(file.name)"
                        :model="filesToDelete"
                        :value="file"
                        style="left: 20px; top: -10px"
                      ></md-checkbox>
                      <md-checkbox v-else disabled style="left: 20px; top: -10px"></md-checkbox>
                    </b-col>
                    <b-col style="margin-top: 4px">
                      <i
                        v-if="file.type == 'directory' && !blockedFiles.includes(file.name)"
                        class="material-icons"
                        style="margin-top: 0; text-align: left; float: left; width: 1000px; color: #3f51b5"
                      >folder</i>
                         <i
                        v-if="file.type == 'directory' && blockedFiles.includes(file.name)"
                        class="material-icons"
                        style="margin-top: 0; text-align: left; float: left; width: 1000px; color: rgb(255 82 82)"
                      >folder</i>
                      <i
                        v-if="file.type == 'file' && !blockedFiles.includes(file.name)"
                        class="material-icons"
                        style="; margin-top: 0; text-align: left; float: left; width: 1000px; color: #607d8b"
                      >insert_drive_file</i>
                      <i
                        v-if="file.type == 'file' && blockedFiles.includes(file.name)"
                        class="material-icons"
                        style="margin-top: 0; text-align: left; float: left; width: 1000px; color: #607d8b"
                      >block</i>
                      <h6
                        style="margin-top: -21px;  float: left; text-align: left; padding-left: 30px; width: 1000px;"
                      >{{file.name}}</h6>
                    </b-col>
                  </b-row>
                </md-button>
              </div>
            </div>
          </b-col>
          <b-col>
            <div
              style="max-width: 1000px; min-height: 600px; height: max-content; padding-top: 80px; margin-top: 7px;"
              class="bg-dark md-elevation-8"
            >
              <h1
                style="position: absolute; color: white; width: 100%; text-align: left; margin-left: 12px; top: 7px"
              >Editor</h1>
              <h4 style="color: white; position: absolute; top: 70px; left: 23px">{{editorFile}}</h4>
              <b-row
                v-if="!DeleteCheckBox"
                style="float: right; margin-top: -25px; margin-right: 0px"
              >
                <b-col style="padding-left: 0; padding-right: 0">
                  <md-button @click="showDelete" class="headerBtn">
                    <i class="material-icons">save</i>
                  </md-button>
                </b-col>
                <b-col style="padding-left: 0; padding-right: 0">
                  <md-button @click="reloadFiles" class="headerBtn">
                    <i class="material-icons">history</i>
                  </md-button>
                </b-col>
              </b-row>
              <b-row v-else style="float: right; margin-top: -25px; margin-right: 0px">
                <b-col style="padding-left: 0;  padding-right: 5px">
                  <md-button @click="showDelete" class="headerBtn">CANCEL</md-button>
                </b-col>
                <b-col style="padding-left: 0; padding-right: 10px">
                  <md-button @click="deleteFiles" class="md-raised md-accent headerBtn">DELETE</md-button>
                </b-col>
              </b-row>
              <div
                style="margin-left: 10px; margin-right: 10px; height: 1px; background-color: white; margin-top: 20px"
              ></div>
              <md-textarea
                id="EditorContainer"
                v-model="editorContent"
                style="padding-left: 10px; padding-right: 10px"
              ></md-textarea>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import global from "@/global.js";
//import client from "@/client.js";
import SideNav from "../SideNav.vue";
//<md-tooltip :md-active.sync="tooltipActive">Bottom</md-tooltip>
let serverToRun;
export default {
  name: "FileManager",
  data() {
    return {
      socket: {},
      server: global.server,
      dir: [],
      rawDir: [],
      lastDir: [],
      parentDirectory: null,
      DeleteCheckBox: false,
      filesToDelete: [],
      blockedFiles: [],
      editorContent: null,
      editorFile: null
    };
  },
  components: {
    SideNav
  },
  created() {
    if (global.server == null) {
      this.$router.push({ path: "Dashboard" });
    } else {
      this.socket = global.socket;
      if (!this.socket.connected) return;
      serverToRun = global.server;
    }
  },
  methods: {
    directorySwitch: function(to, way) {
      if (way === "back") {
        console.log(way, to, "backCheck");
        if (to == serverToRun) {
          this.dir = this.rawDir;
          this.parentDirectory = null;
        } else {
          console.log(this.lastDir, "a");
          this.dir = this.lastDir[this.lastDir.length - 1];
          this.lastDir.pop();
          console.log(this.dir, "a/b");
          console.log(this.lastDir, "b");
          let parent = this.dir[0].path.split("\\");
          this.parentDirectory = parent[parent.length - 2].toString();
        }
      } else if (way === "forward") {
        console.log(way, to, "forwardCheck");
        if (to.type === "file") {
          this.getInnerFile(to);
        } else {
          if (
            this.parentDirectory != serverToRun ||
            this.parentDirectory != null
          ) {
            this.lastDir.push(this.dir);
          }
          let parent = to.path.split("\\");
          this.parentDirectory = parent[parent.length - 2].toString();
          this.dir = [];
          to.children.forEach(file => {
            this.dir.push(file);
          });
        }
      }
      console.log(this.parentDirectory);
    },
    reloadFiles: function() {
      this.socket.emit("getFileTree", serverToRun);
    },
    showDelete: function() {
      if (this.DeleteCheckBox) {
        this.DeleteCheckBox = false;
        this.filesToDelete = [];
      } else {
        this.DeleteCheckBox = true;
      }
    },
    deleteFiles: function() {
      this.socket.emit("deleteFiles", serverToRun, this.filesToDelete);
      this.showDelete();
    },
    getInnerFile: function(file) {
      if (file.type == "directory" || this.blockedFiles.includes(file.name))
        return;
      this.editorFile = file.name;

      this.socket.emit("getInnerFile", serverToRun, file.path);
    }
  },
  mounted() {
    if(this.socket.connected){
      this.socket.emit("getFileTree", serverToRun);
    }
    this.socket.on("blockedFiles", data => {
      this.blockedFiles = data;
    });
    this.socket.on("updateFileTree", data => {
      console.log(data);
      this.dir = [];
      this.rawDir = [];
      data[
        data.findIndex(directory => directory.name == serverToRun)
      ].children.forEach(file => {
        this.dir.push(file);
      });
      this.dir.sort(function(a, b) {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
      });
      this.rawDir = this.dir;
      this.parentDirectory = null;
    });
    this.socket.on("innerFile", data => {
      if (data === [] || data == null) return;
      this.editorContent = data;
    });
  }
};
</script>
<style scoped>
.green-bg {
  background-color: #18c05e !important;
}
.FileCard {
  color: white;
  background-color: transparent;
  height: 40px;
  min-width: -webkit-fill-available;
  margin: 0;
  border-radius: 0px;
}
.headerBtn {
  margin-top: 5px;
  margin-left: 0;
  margin-right: 0px;
  padding: 0 !important;
  border-radius: 5px;
  min-width: 55px;
}
#FileContainer,
#EditorContainer {
  resize: none;
  width: -webkit-fill-available;
  height: 470px;
  background-color: #21252982;
  color: white;
  overflow-y: scroll;
  overflow-x: hidden;
  word-break: break-all;
  float: left;
  text-align: left;
  margin-top: 12px;
  margin-left: 15px;
  margin-right: 15px;
}
</style>