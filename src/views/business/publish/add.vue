<template>
  <div class="addImgResource" style='background:#eef0f3;'>
    <div class="formbox" style='width:94%;'>
      <div class="tabwrapper">
        <el-form
          :model="resourceForm"
          ref="ruleForm"
          :rules="rules"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="机构名称:" prop="name" class="width360">
            <el-input v-model.trim="resourceForm.name" :disabled="ifDisabled"></el-input>
          </el-form-item>
          <el-form-item label="所在省份:" prop="province" class="width360">
            <el-select v-model="resourceForm.province" :disabled="ifDisabled" placeholder="请选择">
              <el-option
                v-for="value in provinceObj"
                :key="value.index"
                :label="value.name"
                :value="value.name"
              ></el-option>
              
            </el-select>
          </el-form-item>
          <el-form-item label="详细地址:" prop="address" class="width360">
              <el-input type="textarea" v-model.trim="resourceForm.address" :disabled="ifDisabled"></el-input>
          </el-form-item>
         
         

          <el-form-item label="联系人:" prop="contacts" class="width360">
            <el-input v-model.trim="resourceForm.contacts" :disabled="ifDisabled"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="telephone" class="width360">
            <el-input v-model="resourceForm.telephone" :disabled="ifDisabled"></el-input>
          </el-form-item>
          <el-form-item label="联系邮箱:" prop="email" class="width360">
            <el-input v-model="resourceForm.email" :disabled="ifDisabled"></el-input>
          </el-form-item>
          <el-form-item label="简介:" prop="synopsis" class="content">
            <tinymce :height="300" ref="editor"   v-model="resourceForm.synopsis"></tinymce>
          </el-form-item>
         
          <el-form-item style='text-align:center;'>
            <el-button type="primary" @click="onSubmit" v-if="pageStatus == 0" class='onSubmitClass' >保存</el-button>
            <el-button  @click="reset" class='dialogFormVisibleClass'>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import {
  addAPI,
  detailsAPI,
  updateAPI,
  repeatAPI
} from "@/api/business/publish";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm
} from "@/utils/publicFunctions";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { provinceObj } from "@/utils/province.js";
import Tinymce from "@/components/Tinymce";
import "@/styles/resource.scss";
import { files } from "@/api/resource/common";
export default {
  data() {
    return {
      tokens: "", //附件

      upfiles: true,
      upfilesub: true,
      options: [],
      tableKey: 0,

      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      imageUrl: "",
      pageStatus: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 50
      },
      authorlist: [],
      resourceForm: {
        address: "",
        contacts: "",
        email: "",
        id: "",
        name: "",
        province: "",
        synopsis: "",
        telephone: ""
      },
      provinceObj:provinceObj,
      listLoading: true,
      list: [],
      rules: {
        address:[{ required: false,pattern: /^\S{1,50}$/, message: "详细地址长度必须小于50位", trigger: "blur" }],
        contacts:[{ required: false,pattern: /^\S{1,30}$/, message: "联系人长度必须小于30位", trigger: "blur" }],
        name: [{ required: true,message: "请输入机构名称"},{pattern: /^\S{1,30}$/, message: "机构名称长度必须小于30位" }],
        telephone:[{ required: false, pattern:/^\d{11}$/,message: '请输入正确的电话号码' }],
        email:[{ required:false, pattern:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,message:'请输入正确的Email', trigger:'blur'}],
      },
      dialogStatus: {},
      uploading: false,
      activeName: "first",
      tableData: [],
      recordData: [],
      total: 30,
      timeLimit: "",
      multipleSelection:null,
      whichName:'',
      ifDisabled:false
    };
  },
  methods: {
    //文件列表
    
    isEdit() {
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      this.$route.meta.title = "添加出版单位";
      if (id) {
        this.$route.meta.title = "修改出版单位";

        this.pageDetails(id);
      }
      if (detailsId) {
        this.pageStatus = 1;
        this.$route.meta.title = "查看出版单位";
        this.pageDetails(detailsId);
        this.ifDisabled=true
      }
    },
   
    onSubmitauthor() {
      if (this.timeLimit) {
        this.listQuery.beginTime = this.timeLimit[0];
        this.listQuery.endTime = this.timeLimit[1];
      } else {
        this.listQuery.beginTime = null;
        this.listQuery.endTime = null;
      }
      this.listQuery.pageNum = 1;
      this.listQuery.status = this.listQuery.status;
      this.getList();
    },

    //重置
    onReset() {
      this.timeLimit = [];
      this.listQuery = {
        pageNum: 1,
        status: this.listQuery.status,
        pageSize: this.listQuery.pageSize
      };
      this.getList();
    },
    // 查看和修改详情信息
    pageDetails(id) {
      detailsAPI(id).then(res => {
        if (res.data.code === 0) {
            if(res.data.data){
                this.resourceForm=res.data.data
            }
           
        }
      });
    },
    // 下一步
    onSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          //必填字段
          const id = this.$route.query.id; //修改id
          if (id) {
            //修改
            this.resourceForm.id = this.$route.query.id;
            updateAPI(this.resourceForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success("编辑成功");
                this.activeName = "second";
                 this.$router.go(-1);
              }else if(res.data.code == '-8'){
                this.$message.error("机构名称已存在");                
              }else{
                this.$message.error("编辑失败");
              }
            });
          } else {
            //新增
            addAPI(this.resourceForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success("添加成功");
                this.activeName = "second";
                
                this.$router.go(-1);
              }else if(res.data.code == '-8'){
                this.$message.error("机构名称已存在");                
              }else{
                this.$message.error("添加失败");
              }
            });
          }
        } else {
          this.$message.warning("有未通过的验证");
        }
      });
    },
    //取消
    reset() {
      this.$router.back();
    },
    //机构名称重复验证
    ifRepeat(){
      repeatAPI(this.resourceForm.name).then( res=> {
        if(res.data.code=="-8"){
          this.$message.warning('机构名称已存在')
        }else{
          return
        }
      })
    },
  

    // 返回上一步
    goback() {
      this.activeName = "first";
    },
    // 完成提交内容
    fininsh() {
      this.$router.push({ path: "/resource/article" });
      this.$router.go(-1);
    },
    handleInfo() {},
    pagesizeFun() {},
    currentPageFun() {},


    /* 上传合同*/




  },
  created() {
    this.dialogStatus = this.$route.query.type;
  },
  mounted() {
    this.isEdit();
    this.pageDetails();
    this.listLoading = false;
  },
  components: { Tinymce }
};
</script>
<style lang="css" scoped>
.addImgResource .tabwrapper{
  background:white;
  width:100%;
  height:100%;
  margin-top:20px;
  padding: 30px 0;
}
/* .addImgResource .formbox .onSubmitClass{
  background:#409eff;
  color:white;
  border-radius: 0;
}
.addImgResource .formbox .onSubmitClass:hover{
  background:#606266;
  color:white;
  border:1px solid #606266;
  border-radius: 0;
}

.addImgResource .formbox .dialogFormVisibleClass{
  background:white;
  border:1px solid #ccc;
  color:#ccc;
  border-radius: 0;
}
.addImgResource .formbox .dialogFormVisibleClass:hover{
  background:#606266;
  color:white;
  border:1px solid #606266;
  border-radius: 0;
} */
#app .main-container {
  background: #eef0f3 !important;
}
.addImgResource{
 background: #fff;
}
.addImgResource .el-form-item.width325 .el-input {
  width: 325px;
}
.addImgResource .el-form-item.content {
  width: 800px;
}
/* .addImgResource .el-button {
  background: #409eff;
  border-color: #409eff;
  border-radius: 5px;
  color: #fff;
} */
/* .addImgResource .btncenter .el-button {
  background: #fff;
  border-color: #409eff;
  border-radius: 5px;
  color: #409eff;
} */
/* .btncenter .el-button:hover {
  background: #409eff;
  border-color: #409eff;
  border-radius: 5px;
  color: #fff;
} */
.addImgResource .btncenter {
  text-align: center;
  margin-right: 10px;
  margin-top: 100px;
}
.addImgResource .recordtable {
  position: relative;
}
.addImgResource .prfooter {
  position: static;
  min-width: 980px;
  margin-top: 300px;
}
.el-pagination button:disabled {
  background: none;
}

.el-form-item__label em {
  color: red;
}
.addImgResource .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/* .addImgResource .el-form-item.width360 .el-input,
.addImgResource .el-form-item.width360 .el-textarea,
.addImgResource .el-form-item.width360 .el-date-editor{
  width: 360px;
}
.addImgResource .el-form-item.width460 .el-input,
.addImgResource .el-form-item.width460 .el-textarea {
  width: 460px;
} */
/* .addImgResource .el-form-item {
  width: 80%;
} */
.addImgResource .el-form-item.width360 {
  width: 40%;
}
.addImgResource .el-form-item.width300 {
  width: 30%;
}
.addImgResource .el-form-item.width460 {
  width: 60%;
}
.addImgResource .el-textarea.width460,
.addImgResource .el-input.width460 {
  width: 60%;
  display: inline-block;
}
.addImgResource .el-input.inp {
  width: 20%;
  display: inline-block;
}
.resource_content .tip {
  font-size: 14px;
  color: #ccc;
}
.resource_content .el-form-item__label {
  width: 120px !important;
}
.formbox {
  margin: 0;
}
.tableList {
  margin: 20px;
}
.spn {
  display: inline;
  color: #409eff;
  font-size: 12px;
  cursor: pointer;
}
</style>

