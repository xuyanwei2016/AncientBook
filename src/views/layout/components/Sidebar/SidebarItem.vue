<template>
  <div class="menu-wrapper">
    <!-- <div  v-for="item in routes">
      <div :key="item.name">{{item.name}}</div>
    </div> -->
    <template v-for="item in routes">
        <router-link v-if="item.sideItem && !item.hidden" :to="item.path" :key="item.name">
          <el-menu-item :index="item.path" :class="{'side-item submenu-title-noDropdown':!isNest}"> <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
            <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
          </el-menu-item>
        </router-link>

        <el-submenu v-else-if="!item.hidden" :index="item.name||item.path" :key="item.name">
          <template slot="title">
            <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
            <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
          </template>

          <template v-for="child in item.children" v-if="!child.hidden">
            <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

            <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
              <el-menu-item :index="item.path+'/'+child.path">
                <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ])
  },
  mounted(){
  },
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      if (showingChildren.length === 1) {
        return true
      }
      return false
    }
  }
}
</script>
<style>
  .side-item {
    background-color: #2D3248!important;
    color: #fff!important;
  }
  .router-link-active .side-item{
    background-color: #02B4D0!important;
    color: #fff!important;
  }
  #app .sidebar-container .el-menu{
    background-color: #2D3248!important;
  }
  #app .el-submenu .el-submenu__title{
      background-color: #2D3248!important;
    color: #fff!important;
}
.el-submenu__icon-arrow{
  color: white!important;
}
#app .sidebar-container .nest-menu .el-submenu > .el-submenu__title, #app .sidebar-container .el-submenu .el-menu-item{
    background-color: #232635!important;
    color: #fff!important;
}
#app .sidebar-container .nest-menu .el-submenu > .el-submenu__title, #app .sidebar-container .el-submenu .el-menu-item:hover{
    background-color: #181a23!important;
    color: #fff!important;
}
#app .sidebar-container .el-submenu .el-menu-item.is-active{
  color: #409EFF!important;
}
</style>
