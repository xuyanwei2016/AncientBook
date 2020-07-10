<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <el-menu mode="vertical" unique-opened :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" background-color="#304156" text-color="#bfcbd9" active-text-color="#409EFF" @select="menuClick">
      <sidebar-item :routes="side_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Hamburger from '@/components/Hamburger'

export default {
  components: { SidebarItem, Hamburger },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'side_routers'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted(){
    //console.log(this.permission_routers,'permission_routers');
  },
  methods:{
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    menuClick(index,path){//监听侧边栏的点击事件，缓存组件
      let activeIndex=index;
      this.$store.dispatch('delAllViews')//先清组件缓存
      //侧边栏组件的tab等参数也要保持高亮，用组件缓存
      let router=null;
      //匹配点击的路由对象
      for(let i=0;i<this.side_routers.length;i++){
        let item=this.side_routers[i];
        let children=this.side_routers[i]['children'];
        if(item.path==activeIndex){//匹配到一级路由
          router=item;
          break;
        }
        if(children!=null&&children!="undefined"&&children!="null"){//匹配到二级路由
          router=children.filter(item => activeIndex.indexOf(item.path)!=-1)[0];
          if(router){//匹配到就结束
             break;
          }
        }
      }
      if(router.meta.noCache!=undefined&&router.meta.noCache!="undefined"&&router.name&&!router.meta.noCache){
        this.$store.dispatch('addVisitedViews',router)
      }
    }
  }
}
</script>

<style scoped>
  .scrollbar-wrapper {
    border-right: 1px solid #ECEFF2!important
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    text-align: center;
    padding-top: 6px;
    background-color: #2D3248;
  }
</style>
