import Vue from 'vue'
import VueRouter from 'vue-router'

//Views
import Dashboard from '../views/Dashboard.vue'
import ServerConfig from '../views/ServerConfig.vue'

//ServerManagement
import Control from '../components/ServerManagement/Control.vue'
import Plugins from '../components/ServerManagement/Plugins.vue'
import Config from '../components/ServerManagement/Config.vue'
import FileManager from '../components/ServerManagement/FileManager.vue'
import Player from '../components/ServerManagement/Player.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/Dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/ServerConfig',
    name: 'ServerConfig',
    component: ServerConfig
  },
  {
    path: '/Control',
    name: 'Control',
    component: Control
  },
  {
    path: '/Plugins',
    name: 'Plugins',
    component: Plugins
  },
  {
    path: '/Config',
    name: 'Config',
    component: Config
  },
  {
    path: '/FileManger',
    name: 'FileManager',
    component: FileManager
  },
  {
    path: '/Player',
    name: 'Player',
    component: Player
  },
]

const router = new VueRouter({
  routes
})

export default router
