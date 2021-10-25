<template>
          <div class="pb-xlg" id="SideBar">
            <md-list>
              <h3 id="LogoSideNav">Hosting</h3>
              <div style="margin-left: -25px;">
                <md-divider class="md-inset SideBarDivider"></md-divider>
              </div>
              <md-list-item @click="$router.push({ name: 'Control' })">
                <md-icon>control_camera</md-icon>
                <span class="md-list-item-text" style="margin-left: -25px;">Control</span>
              </md-list-item>
              <md-list-item  @click="$router.push({ name: 'Plugins' })">
                <md-icon>view_list</md-icon>
                <span class="md-list-item-text" style="margin-left: -25px;">Plugins</span>
              </md-list-item>
              <md-list-item @click="$router.push({ name: 'Config' })">
                <md-icon>build</md-icon>
                <span class="md-list-item-text" style="margin-left: -25px;">Config</span>
              </md-list-item>
              <md-list-item @click="$router.push({ name: 'FileManager' })">
                <md-icon>folder</md-icon>
                <span class="md-list-item-text" style="margin-left: -25px;">FileManager</span>
              </md-list-item>
              <md-list-item  @click="$router.push({ name: 'Player' })">
                <md-icon>people</md-icon>
                <span class="md-list-item-text" style="margin-left: -25px;">Player</span>
              </md-list-item>
              <div style="margin-left: -25px;">
                <md-divider class="md-inset SideBarDivider"></md-divider>
              </div>
              <md-list-item @click="alert('test')">
                <md-icon>headset_mic</md-icon>
                <span class="md-list-item-text" style="margin-left: -25px;">Discord</span>
              </md-list-item>
              <md-list-item @click="alert('test')">
                <md-icon>contact_support</md-icon>
                <span class="md-list-item-text" style="margin-left: -25px;">Support</span>
              </md-list-item>
            </md-list>
          </div>
</template>
<style scoped>
.md-list.md-theme-default {
  background-color: #0000004f !important;
  height: 100% !important;
}
#SideBar {
  width: 100%;
  height: 100%;
  position: relative;
  color: rgb(189, 189, 189);
  text-align: center;
}
@media only screen and (max-width: 1000px) {
  #SideBar {
    width: 50px;
    position: relative;
    display: block;
  }
  .SideBarDivider {
    display: none;
  }
  #LogoSideNav {
    display: none;
  }
}
</style>