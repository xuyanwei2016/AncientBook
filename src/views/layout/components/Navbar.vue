<template>
  <el-menu class="navbar" mode="horizontal">
    <img :src="Logo" alt="logo" class="logo">
    <span class="text-medium logo-text">中医基本古籍库数字化平台</span>

    <div class="nav-menu">
      <template v-for="(item,index) in permission_routers" v-if="item.meta && item.navItem">
        <div :class="{'nav-menu-item':true, 'nav-menu-item-active': side_cur_index === index}" :key="item.name" @click="switchRouter(index)">
          {{item.meta.title}}
        </div>
      </template>
    </div>

    <div class="right-menu">
        <router-link :to="{path:`/message`,query:{status:messageState}}">
          <!-- <div class="avatar-wrapper" @click="goToMessage"> -->
          <div class="avatar-wrapper">
            <svg-icon icon-class="messge_new" />
            <span  :class="messageState ? 'message-read':''">消息</span>
          </div>
        </router-link>
        <router-link :to="{path: `/personal`}">
          <div class="avatar-wrapper">
            <svg-icon icon-class="user_new" />
            <span>{{username}}</span>
          </div>
        </router-link>
        <!-- <router-link :to="{path: `/password`}"> -->
          <div class="avatar-wrapper" @click="changePassword">
            <svg-icon icon-class="changePass_new" />
            <span>修改密码</span>
          </div>
        <!-- </router-link> -->
        <div class="avatar-wrapper" @click="quit">
          <svg-icon icon-class="signOut_new" />
          <a>退出</a>
        </div>
      <!-- </router-link> -->

    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogchangePassWordVisible"
      width="25%"
      class="passwordheight"
      @close="closePassword"
    >
      <div>
        <div class="password">
          <div>
            <el-form
              label-position="right"
              :rules="rules"
              label-width="85px"
              class="el_form"
              ref="passwordForm"
              :model="passwordresourceForm"
            >
              <el-form-item label="旧密码:" prop="oldPassword">
                <el-input type="password"  v-model="passwordresourceForm.oldPassword"></el-input>
              </el-form-item>

              <el-form-item label="新密码:" prop="newPassword1">
                <el-input type="password"   v-model="passwordresourceForm.newPassword1"></el-input>
              </el-form-item>
              <el-form-item label="确认密码:" prop="newPassword2">
                <el-input type="password"   v-model="passwordresourceForm.newPassword2" show-password></el-input>
              </el-form-item>
            </el-form>

            <!-- <div class="bottom">
                    <el-button @click="dataSubmit">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
            </div>-->
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dataSubmit">确 定</el-button>
        <el-button type="primary" @click="dialogchangePassWordVisible = false">取 消</el-button>

      </span>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import ErrorLog from "@/components/ErrorLog";
import Screenfull from "@/components/Screenfull";
import LangSelect from "@/components/LangSelect";
import ThemePicker from "@/components/ThemePicker";
import Logo from "@/assets/img/ciic_logo.png";
import Cookies from "js-cookie";
import { editPasswordAPI } from "@/api/login.js";
import md5 from "blueimp-md5";
import { getMessageAPI } from "@/api/login.js";
import { resetRouter } from '@/router'
let timeOut =null
export default {
  components: {
    Breadcrumb,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker,
    Logo
  },
  data() {
    return {
      messageState:false,
      Logo: Logo,
      username: "",
      curPath: this.$route.path,
      columnDialog: false,
      dialogchangePassWordVisible: false,
      passwordresourceForm: {
        oldPassword: "",
        newPassword1: "",
        newPassword2: ""
      },
      passwordsubmitForm: {
        oldPassword: "",
        newPassword1: "",
        newPassword2: ""
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message:'请输入旧密码'
          }
        ],
        newPassword1: [
          {
            required:true,
            message:'请输入密码'
          },
          {

            pattern: /^[0-9a-zA-Z]{6,20}$/,
            message: "请输入字母、数字和符号的组合6-20个字符",
          }
        ],
        newPassword2: [
          {
            required:true,
            message:'请输入密码'
          },
          {
            pattern: /^[0-9a-zA-Z]{6,20}$/,
            message: "请输入字母、数字和符号的组合6-20个字符",
          }
        ]
      }

    };
  },
  computed: {
    ...mapGetters([
      "sidebar",
      "name",
      "avatar",
      "permission_routers",
      "side_cur_index"
    ])
  },
  created(){
    // window.clearInterval(timeOut)
    // timeOut =window.setInterval(()=>{
    //   this.timeState=true
    //   if(this.timeState== true){
    //     this.timeState=false
        this.hasNoRead()
    //   }
    // },100000)

  },
  mounted() {
    this.username = Cookies.get('username')
    var list = this.permission_routers
    for(let i = 0;i < list.length; i++){
      if(list[i].children){
          for(let j=0;j<list[i].children.length;j++){
            if(this.$router.history.current.path == list[i].children[j].path){//判断侧边栏一级
              this.switchRouter(i,this.$router.history.current.fullPath);
            }else{
              if(list[i].children[j].children){
                for(let k=0;k<list[i].children[j].children.length;k++){
                  if(this.$router.history.current.path.indexOf(list[i].children[j].children[k].path)!=-1){//判断侧边栏二级
                    this.switchRouter(i,this.$router.history.current.fullPath);
                  }
                }
              }
            }
          }
      }
    }
  },
  methods: {
    // 判断消息是否有未读
    hasNoRead(){
      getMessageAPI(this.news).then(res => {
        if (res.data.code == 0) {
          let list= res.data.data.list;
          list.map(item =>{
            if(item.status == 0){
              this.messageState=true
              // window.clearInterval(timeOut)
            }
          })
        } else {
        }
      })
    },
    quit() {
      this.$store.dispatch("FedLogOut").then(res => {
        if (res) {
          location.reload();
          //重置路由
          this.resetRouter()
        }
      });
    },
    switchRouter(index,pullPath) {
      let that = this;
      this.$store.dispatch("SwitchRoutes", {
          router: that.permission_routers[index].children,
          index: index
        })
        .then(res => {});
      let path = that.permission_routers[index].children[0].path;
      if(pullPath){
        this.$router.push(pullPath);
      }else{
        this.$router.push(path);
      }
      //console.log(that.permission_routers[index].children,"怎么了这是")
      this.$store.dispatch('delAllViews')//先清组件缓存
      //切换头部模块，缓存第一个菜单路由组件
      if(that.permission_routers[index].children[0].meta.noCache!="undefined"&&!that.permission_routers[index].children[0].meta.noCache){//刷新页面，判断是否缓存
        this.$store.dispatch('addVisitedViews',that.permission_routers[index].children[0])
      }
    },
    // goToMessage() {
    //   this.$router.push({path: '/message'})
    // },
    editPassword() {
      this.columnDialog = true;
    },
    changePassword() {
      this.dialogchangePassWordVisible = true;
    },
    closePassword(){
      this.$refs['passwordForm'].resetFields()
    },
    // 保存
    dataSubmit() {
      this.$refs['passwordForm'].validate(result => {
        if(result){
          this.passwordsubmitForm = JSON.parse(
            JSON.stringify(this.passwordresourceForm)
          );
          this.passwordsubmitForm.oldPassword = md5(
            this.passwordsubmitForm.oldPassword
          ).toUpperCase();
          this.passwordsubmitForm.newPassword1 = md5(
            this.passwordsubmitForm.newPassword1
          ).toUpperCase();
          this.passwordsubmitForm.newPassword2 = md5(
            this.passwordsubmitForm.newPassword2
          ).toUpperCase();
          if (
            this.passwordsubmitForm.newPassword1 !==
            this.passwordsubmitForm.newPassword2
          ) {
            this.$message.error("新密码与确认密码不符");
          } else {
            editPasswordAPI(this.passwordsubmitForm).then(res => {
              if (res.data.code === 1) {
                this.$message.error("旧密码输入错误，请重新输入!");
              } else if (res.data.code === 0) {
                this.$message.success("修改密码成功");
                this.dialogchangePassWordVisible = false;
                this.$store.dispatch("FedLogOut").then(res => {
                  if (res) {
                    location.reload();
                  }
                });
              }
            });
          }
        }
      })

    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.nav-menu-item {
  width: 90px;
  line-height: 66px;
  color: #fff;
  float: left;
  font-size: 16px;
  text-align: center;

  cursor: pointer;
}
.nav-menu-item-active {
  border-top: 3px solid #02b4d0;
  background: #3f4560;
}
.nav-menu-item-active{
  border-top: 3px solid #02B4D0;
  background: #3F4560;
}

.avatar-wrapper {
  float: left;
  font-size: 14px;
  margin-right: 20px;
  // &:nth-of-type(2){
    cursor: pointer;
    &:hover{color: #97a8be;}
  // }
}
.message-read{
  position: relative;
}
.message-read::before{
  content: '';
  position: absolute;
  top: 0;
  left: -4px;
  height: 4px;
  width: 4px;
  border-radius: 2px;
  background: red;
}
.navbar {
  height: 70px;
  line-height: 70px;
  border-radius: 0px !important;
  background: #2d3248;
  position: fixed;
  z-index: 99999;
  width: 100%;
  padding-left: 10px;
  .logo-text {
    color: aliceblue;
    float: left;
    margin:0 60px 0 10px;
    font-size: 18px;
    font-weight: bold;
  }
  .logo {
    float: left;
    margin-top: 24px;
  }

  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    color: #fff;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.passwordheight {
  margin-top: 120px;
}
</style>
<style scoped>
.default{
  background: #03bcd9;
  border:1px solid #fff;
  color: #fff;
}
.el-form-item{
  margin-bottom: 30px;
}
</style>
