<template>
  <div>
    <navbar></navbar>
    <div class="main personal_wrap">
      <div class="personal_top">
        <p>
          <span class="home" @click="back">&lt;&nbsp;&nbsp;返回</span>
          <span style="color:#97A8BE">个人信息设置</span>
        </p>
      </div>
      <div class="content">
        <el-form
          label-position="right"
          :rules="rules"
          label-width="82px"
          class="form"
          ref="dataForm"
          :model="resourceForm"
        >
          <el-form-item label="姓名:" prop="name">
            <el-col :span="15">
              <el-input v-model="resourceForm.name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="用户名:">
            <el-col :span="15">
              <el-input v-model="resourceForm.userName" disabled></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="手机号:" prop="phone">
            <el-col :span="15">
              <el-input v-model="resourceForm.phone"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="邮箱:" prop="email">
            <el-col :span="15">
              <el-input v-model="resourceForm.email"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="部门:">
            <el-col :span="15">
              <el-input v-model="dept" disabled></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="角色:">
            <el-col :span="15">
              <el-input v-model="role" disabled></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="用户头像:">
            <el-upload
              :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
              list-type="picture-card"
              :on-preview="handlePreview"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :disabled="uploading"
              :on-remove="handleRemove"
              :show-file-list="false"
            >
              
              <img
                v-if="resourceForm.topImg"
                :src="`${this.domain}${this.requestPath.file}?fileName=${resourceForm.topImg}&isOnLine=true`"
                class="avatar"
                :onerror="defaultImage"
              >
              <img src="../../assets/img/info.jpg" v-else class="avatar">
              <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
            </el-upload>
            <el-button class="resetBtn" size="mini" @click="reset" round >重置</el-button>
            <span class="tip">仅支持jpg、jpeg、png、gif、png格式，不超过2M。</span>
          </el-form-item>
          <el-form-item>
            <el-button @click="Submit" type="primary">保存</el-button>
          </el-form-item>
        </el-form>
       
      </div>
    </div>
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { Navbar } from "../../views/layout/components";
import { getPersonalAPI, editPersonalAPI } from "@/api/login.js";
import {defaultImage} from '@/assets/img/defaultAvatar.jpg'
export default {
  components: { Navbar },
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      resourceForm: {
        topImg: "",
        email: "",
        name: "",
        phone: ""
      },
      imgUrl: "",
      uploading: false,
      dept: "",
      role: "",
      defaultImage:defaultImage,
      rules: {
        name: [
          {
            required: true,
            pattern: /^\S{0,10}$/,
            message: "请输入中文、字母、数字、符号，长度不超过10个字"
          }
        ],
        email: [
          {
            required: false,
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: "请输入正确的Email",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            pattern: /^1[3|5|7|8|]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted() {
    this.getPersonal();
  },
  methods: {
    // 获取个人信息设置
    getPersonal() {
      getPersonalAPI().then(res => {
        console.log(res);
        this.resourceForm = res.data.data;
        const dept = [];
        const role = [];
        res.data.data.deptList.map(node => {
          dept.push(node.deptName);
        });
        res.data.data.roleList.map(node => {
          role.push(node.roleName);
        });
        this.dept = dept.join(",");
        this.role = role.join(",");
      });
    },

    // 保存
    Submit() {
       this.$refs['dataForm'].validate((valid) => {
         if (valid) {
           editPersonalAPI(this.resourceForm).then(res => {
            if (res.data.code === 0) {
              this.$message.success("修改成功");
              this.$router.push({ path: "/dashboard/home" });
            } else {
              this.$message.error("修改失败");
            }
          });
         }
         
       })
      
    },

    // 用户头像
    handlePreview(file) {
      this.imgUrl = file.url;
    },

    handleRemove(file, fileList) {
      this.imgUrl = "";
    },
    beforeUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
        return isJPG;
      }
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
        return isLt3M;
      }
      this.uploading = true;
      this.$message.warning("上传中");
    },
    handleSuccess(res, file, fileList) {
      this.$message.success("上传成功");
      this.resourceForm.topImg = res;
    },
    //重置
    reset(){
        this.resourceForm.topImg = "";
        this.imgUrl = "";
    },
    // 返回
    back() {
      this.$router.push({ path: "/dashboard/home" });
    }
  }
};
</script>

<style>
.main {
  margin: 0 auto;
  padding-top: 70px;
  height: 935px;
}
.main .personal_top{
  width: 100%;
  background-color: #fff;
  height: 70px;
  line-height: 70px;
  margin-bottom:20px;
}
.main p {
  width: 1200px;
  margin: 0 auto; 
}

.main .content {
  width: 1200px;
  background-color: #fff;
  margin: 0 auto;
  padding-top:60px;
  padding-bottom:60px;
}

.main .form {
  width: 500px;
  margin: 20px auto;
}
.main .footer {
  margin-top: 150px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  border-top: 1px solid #ddd;
  text-align: center;
  color: #ddd;
}
.personal_wrap .avatar {
  width: 146px;
  height: 146px;
}
.home {
  margin-right: 20px;
  cursor: pointer;
}
.tip {
  color: #999;
  font-size: 12px;
}
.resetBtn{
    position: absolute;
    top: 0;
    left: 180px;
}
</style>
