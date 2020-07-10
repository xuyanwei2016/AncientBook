<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <navbar></navbar>
    <sidebar class="sidebar-container"></sidebar>
    <div :class="[{'main-breadcrumb-move' : sidebar.opened},'main-breadcrumb']">
      <breadcrumb class="breadcrumb-container"></breadcrumb>
      <div class="search" v-if="pageStatus == true">
        <input type="text" placeholder="——输入关键词——" maxlength="30" v-model="value" @input="valueChange(value)" >
        <i class="el-icon-search"></i>
        <router-link :to="`/search`">
          <span>高级检索</span>
        </router-link>
      </div>
      <div class="search" style="margin-top:22px" v-if="workPage==true">
        <router-link :to="`/works`">
          <span>全文检索</span>
        </router-link>
      </div>
      <!-- <div class="search" v-if="goback == true">
        <a href="javascript:;" @click="gobackFun">
          <span>返回</span>
        </a>
      </div>
      <div class="getBackBusiness" v-if="getBackBusiness == true">
        <a @click="getBackBusinessRouter">
          <span>返回</span>
        </a>
      </div> -->
      <div class="getBackBusiness" v-if="goback">
        <a @click="goBack">
          <span>返回</span>
        </a>
      </div>
    </div>
    <div class="main-container main_outer">
      <app-main></app-main>
    </div>
    <p class="footerversion" :class="[ sidebar.opened ? 'opend' : 'closed']">Copyright ©中医古籍出版社</p>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import Breadcrumb from "@/components/Breadcrumb";

export default {
  // props: ['pageStatus'],  //input
  data() {
    return {
      value: "",
      pageStatus: false,
      goback: false,
      getBackBusiness: false,
      workPage:false
    };
  },
  name: "layout",
  components: {
    Breadcrumb,
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  watch: {
    $route(to, from) {//匹配mate的goback字段,是否显示返回,查看的页面标识
      let href=window.location.href;
      let fromFullpath=from.fullPath;
      let toFullpath=to.fullPath;
      if(to.meta.goback||href.indexOf('&type=view')!=-1){
        this.goback = true;
      }else{
        this.goback = false;
      }
      if (to.path == "/works") {//显示高级检索的按钮
        this.pageStatus = true;
      } else {
        this.pageStatus = false;
        this.value=''
      }
      if(to.path == '/search'){
        this.workPage=true
      }else{
        this.workPage=false
      }

      //保持切换页面时，不需要保持tab高亮时，清空本地存储，合同模块这么做的
      if(href.indexOf('contract')!=-1&&fromFullpath.indexOf('contract')){
        if(!/&type=view|&type=update/.test(fromFullpath)&&!/&type=view|&type=update/.test(href)){
          window.localStorage.removeItem("activeName");
          window.localStorage.removeItem("onsale")
        }
      }
      // //合同外的其他模块的tab也要保持高亮，用组件缓存
      if(to.name&&!to.meta.noCache){
        this.$store.dispatch('addVisitedViews',to)
      }
    }
  },
  mounted() {
    let href=window.location.href;
    if(this.$route.meta.goback||href.indexOf('&type=view')!=-1){//刷新页面的判断
      this.goback = true;
    }else{
      this.goback = false;
    }
    if (this.$route.path == "/works") {//显示高级检索的按钮
      this.pageStatus = true;
    } else {
      this.pageStatus = false;
    }
    if(this.$route.path == '/search'){
      this.workPage=true
    }else{
      this.workPage=false
    }
    if(this.$route.meta.noCache!="undefined"&&!this.$route.meta.noCache){//刷新页面，判断是否缓存
      this.$store.dispatch('addVisitedViews',this.$route)
    }
  },
  methods: {
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    handleClickOutside() {
      this.$store.dispatch("closeSideBar", { withoutAnimation: false });
    },
    valueChange(value) {
      if (value.length < 30) {
        this.$store.dispatch("SetSearchValue", value).then(res => {});
      }else{
        return
      }
    },
    goBack(){
      this.value=''
      this.$router.back();
    },
    gobackFun() {
      this.$router.push({
        name: "works",
        params: { id: window.localStorage.getItem("resourceType") }
      });
    },
    getBackBusinessRouter() {
      this.$router.push({
        name: "label",
        params: { id: window.localStorage.getItem("resourceType") }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.footerversion {
    height: 60px;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: #919CAE;
    line-height: 49px;
    text-align: center;
    margin-top: 25px;
    position: fixed;
    bottom: -11px;
    right: 0;
    width: 100%;
    background: #eef0f3;
    z-index: 200;
    margin: 0!important;
    transition: width 0.28s;
}
.footerversion.closed{
    width: calc(100% - 36px);
}
.footerversion.opend{
    width: calc(100% - 180px);
}
.getBackBusiness {
  color: #626b92;
  cursor: pointer;
  float: right;
  margin: 26px 30px;
  font-size: 14px;
}
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.main-breadcrumb {
  position: relative;
  top: 70px;
  z-index: 9;
  background: #fff;
  height: 60px;
  margin-bottom: 50px;
  margin-left: 36px;
  .breadcrumb-container {
    height: 60px;
    line-height: 60px !important;
  }
}
.main-breadcrumb-move {
  margin-left: 180px;
}
.search {
  float: right;
  margin-right: 26px;
  font-size: 14px;
  margin-top: 12px;
  position: relative;
  input {
    width: 300px;
    height: 36px;
    background: rgba(239, 242, 245, 1);
    border-radius: 18px;
    outline: none;
    border: 0;
    padding-left: 20px;
    margin-right: 10px;
  }
  span {
    color: #626b92;
    cursor: pointer;
  }
  i.el-icon-search{
    position: absolute;
    top: 10px;
    right: 88px;
    font-size: 16px;
    color: #ADBDCE;
  }
}
.resource-type {
  display: inline-block;
  padding: 0 30px;
  height: 70px;
  line-height: 70px;
  // display:flex;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  .left {
    margin-left: 70px;
    float: left;
    .type {
      padding: 0 20px;
      // font-size:14px;
      color: 14px;
    }
    .active {
      color: #02b4d0;
    }
  }
  .right {
    float: right;
    color: #02b4d0;
    cursor: pointer;
  }
}
</style>
