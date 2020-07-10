<template>
  <div class="addImgResource" style='background:#eef0f3;'>
    <div class="formbox" style='width:94%;'>
      <div class="tabwrapper" >
        <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
        <el-form
          :model="resourceForm"
          ref="ruleForm"
          :rules="rules"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="中文词根:" prop="chineseRoot" class="width360">
            <el-input v-model="resourceForm.chineseRoot" placeholder="多个词用逗号隔开"></el-input>
          </el-form-item>
          <el-form-item label="英文词根:" prop="englishRoot" class="width360">
            <el-input v-model="resourceForm.englishRoot" placeholder="多个词用逗号隔开"></el-input>
          </el-form-item>
          <el-form-item label="英文缩写:" prop="abbreviation" class="width360">
            <el-input v-model="resourceForm.abbreviation"></el-input>
          </el-form-item>
          <el-form-item label="中文同义词:" prop="chineseSynonym" class="width360">
            <el-input v-model="resourceForm.chineseSynonym"></el-input>
          </el-form-item>
          <el-form-item label="英文同义词:" prop="englishSynonym" class="width360">
            <el-input v-model="resourceForm.englishSynonym"></el-input>
          </el-form-item>
          <el-form-item label="中文释义:" prop="interpretation" class="width360">
            <el-input type="textarea" v-model="resourceForm.interpretation" :rows="8"></el-input>
          </el-form-item>
          <el-form-item label="中文别字:" prop="faultWord" class="width360">
            <el-input v-model="resourceForm.faultWord" placeholder="多个词用逗号隔开"></el-input>
          </el-form-item>
          <el-form-item label="词条属性:" prop="belong" class="width360">
            <el-select v-model="resourceForm.belong" placeholder="请选择">
              <el-option label="--请选择--" value="null"></el-option>
              <el-option
                v-for="(value,index) in options"
                :key="index"
                :label="value.seriesName"
                :value="value.id"
              ></el-option>
              <!-- <el-option label="请选择" value="null"></el-option>
              <el-option label="出版主题" value="1"></el-option>
              <el-option label="版权主题" value="2"></el-option>
              <el-option label="采购主题" value="3"></el-option>-->
            </el-select>
          </el-form-item>
          <el-form-item label="中文说明:" prop="chineseExplain" class="content">
            <tinymce :height="300" ref="editor" v-model="resourceForm.chineseExplain"></tinymce>
          </el-form-item>
           <el-form-item label="英文说明:" prop="englishExplain" class="content">
            <tinymce :height="300" ref="editor" v-model="resourceForm.englishExplain"></tinymce>
          </el-form-item>
          <el-form-item label="上位词:" prop="hypernym" class="width360">
            <el-input v-model="resourceForm.hypernym" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="下位词:" prop="hyponym" class="width360">
            <el-input v-model="resourceForm.hyponym" type="textarea"></el-input>
          </el-form-item>
          <el-form-item v-if="dialogStatus!='view'" style='text-align:center;'>
            <el-button type="primary" @click="onSubmit" v-if="pageStatus == 0" class='onSubmitClass'>保存</el-button>
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
  isExistAPI,
  getSeriesListAPI
} from "@/api/business/theme";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm
} from "@/utils/publicFunctions";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";

import Tinymce from "@/components/Tinymce";
import "@/styles/resource.scss";
import { files } from "@/api/resource/common";
export default {
  name:'add_theme',
  data() {
    var validateChineseRoot = (rule , value,cb) => {
      if(value !==''){
        this.isExistChineseRoot(value).then( res => {
          if(res.data.data){
            cb(new Error('中文词根已存在'))
          }else {
            cb()
          }
        })

      }     
    };
    return {
      tokens: "", //附件
      uploadFileList: {
        bookid: this.$route.query.id,
        token: ""
      },      
      upfiles: true,
      upfilesub: true,
      options: [],
      tableKey: 0,
      fileList: [],
      fileSubList: [],
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
        // name: "",
        // contractClass: "",
        // contractFile: "",
        // enclosure: "",
        // endTime: "",
        // firstAuthorize: "",
        // firstParty: "",
        // id: "",
        // identifier: "",
        // projectName: "",
        // secondAuthorize: "",
        // secondParty: "",
        // signingTime: "",
        // synopsis: "",
        // term: 0
      },
      dialogVisible: false,
      listLoading: true,
      authorlistLoading: true,
      list: [],
      rules: {
        chineseRoot: [
          { required: true, message: "请输入中文词根" },
          {validator:validateChineseRoot},
          {max:20,message:'中文词根长度必须小于20位'}
        ],
        englishRoot:{max:20,message:'英文词根长度必须小于20位'},
        abbreviation:{max:20,message:'英文缩写长度必须小于20位'},
        chineseSynonym:{max:100,message:'中文同义词长度必须小于100位'},
        englishSynonym:{max:100,message:'英文同义词长度必须小于100位'},
        faultWord:{max:100,message:'中文别字长度必须小于100位'},

      },
      dialogStatus: {},
      uploading: false,
      activeName: "first",
      tableData: [],
      recordData: [],
      total: 30,
      timeLimit: "",
      multipleSelection:null,
      whichName:''
    };
  },
  methods: {
    //文件列表
    getFiles() {
      if (this.tokens == null || this.tokens == "") {
        this.tableData = [];
        return;
      } else {
        files({ tokens: this.tokens }).then(res => {
          this.tableData = res.data.data;
        });
      }
    },
    //查看中文词根是否存在
    isExistChineseRoot(value){
      return isExistAPI({id:this.$route.query.id,chineseRoot:value})
    },
    isEdit() {
      const id = this.$route.query.id;
      console.log(this.dialogStatus)
      if (this.dialogStatus=='update') {
        this.$route.meta.title = "修改主题词";

        this.pageDetails(id);
      }
      if (this.dialogStatus=='add') {
        this.$route.meta.title = "添加主题词";
      }
      if (this.dialogStatus=='view') {
        this.pageStatus = 1;
        this.$route.meta.title = "查看主题词";
        this.pageDetails(id);
      }
    },
    getList() {
      console.log(this.listQuery);
      this.authorlistLoading = true;
      getauthorListAPI(this.listQuery).then(res => {
        if (res.data.code === 0) {
          this.authorlist = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.authorlistLoading = false;
      });
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
              } else {
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
              } else {
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

    handleClick(tab) {
      if (tab.index == 1) {
        this.getFiles();
      }
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
    // 下载
    handleDown(token) {
      window.open(
        `${process.env.BASE_API}${requestPath.file}download/${token}`
      );
    },

    /* 上传主题*/

    handleFileSuccess(res, file, fileList) {
      this.resourceForm.relatedContracts = res;
      this.upfiles = false;
      this.resourceForm.contractFile = file.response;
    },
    handleFileRemove() {
      this.upfiles = true;
    },
    // 附件

    handleSubSuccess(res, file, fileList) {
      this.resourceForm.relatedContracts = res;
      this.resourceForm.enclosure = file.response;
      this.upfilesub = false;
    },
    handleFileSubRemove() {
      this.upfilesub = true;
    },
    chioceList(val) {
      this.multipleSelection = val;
    },
    // 获取词条列表
    getcontractList() {
      getSeriesListAPI().then(res => {
        if (res.data.code == 0) {
          this.options = res.data.data;
        }
      });
    },
    //获取作者列表
    // getAuthorList(val) {
    //     this.whichName=val
    //   this.dialogVisible = true;
    //   this.getList();
    // },
    //确定选择作者
  //   getsureAuthor(){
  //       if(this.multipleSelection.length==1){
  //           let whichNam=this.whichName;
  //           // this.resourceForm.whichNam=this.multipleSelection[0].name;
  //           // console.log(this.resourceForm.whichNam)
  //           if(whichNam=='firstParty'){
  //               this.resourceForm.firstParty=this.multipleSelection[0].name
  //           }
  //           if(whichNam=='secondParty'){
  //               this.resourceForm.secondParty=this.multipleSelection[0].name
  //           }
  //           if(whichNam=='firstAuthorize'){
  //               this.resourceForm.firstAuthorize=this.multipleSelection[0].name
  //           }
  //           if(whichNam=='secondAuthorize'){
  //               this.resourceForm.secondAuthorize=this.multipleSelection[0].name
  //           }
  //           this.dialogVisible=false
  //       }else{
  //          this.$message.error("仅可以选择一条");
  //       }
        
  //   }
  },
  created() {
    this.dialogStatus = this.$route.query.type;
  },
  mounted() {
    this.isEdit();
    this.getcontractList()
    // this.pageDetails();
    this.listLoading = false;
  },
  components: { Tinymce }
};
</script>
<style lang="css" scoped>
/* .addImgResource .tabwrapper{
  background:white;
  width:100%;
  height:100%;
  margin-top:20px;
  padding: 30px 0;
}
.addImgResource .formbox .onSubmitClass{
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
#app .demo-ruleForm .main-container {
  background: #eef0f3 !important;
}
.addImgResource{
  background:#fff;
}
.addImgResource .el-form-item.width325 .el-input {
  width: 325px;
}
.addImgResource .el-form-item.content {
  width: 680px;
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

