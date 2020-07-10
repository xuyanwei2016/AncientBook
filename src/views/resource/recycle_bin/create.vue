<template>
  <div class="addImgResource">
    <div class="formbox">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="资源信息" name="first">
        <div class="tabwrapper">
        <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
        <el-form
          :model="resourceForm"
          ref="resourceForm"
          :rules="rules"
          label-width="100px"
          label-position="right"
        >
          <el-form-item label="名称:" prop="name">
            <el-input v-model="resourceForm.name" style="width:500px;"></el-input>
          </el-form-item>
          <el-form-item label="作者:" prop="author">
            <el-input v-model="resourceForm.author" style="width:500px;"></el-input>
          </el-form-item>
          <el-form-item label="关键词:" prop="keywords">
            <el-input v-model="resourceForm.keywords" placeholder="多个关键词用逗号隔开" style="width:500px;"></el-input>
          </el-form-item>
          <el-form-item label="封面:" prop="cover">
            <img
              v-if="resourceForm.cover"
              :src="`${this.domain}${this.requestPath.file}?fileName=${resourceForm.cover}&isOnLine=true`"
              class="reImg"
            >
          </el-form-item>
          <!-- <el-form-item label="课程简介:" prop="synopsis">
            <tinymce v-model="resourceForm.synopsis" style="width:600px;"></tinymce>
          </el-form-item>
          <el-form-item label="课程详情:" prop="text">
            <tinymce v-model="resourceForm.text" style="width:600px;"></tinymce>
          </el-form-item> -->

           <h6>&nbsp;&nbsp;|&nbsp;&nbsp;商品信息</h6>
          <el-form-item label="数据来源:" prop="dataSources">
            <el-radio v-model="resourceForm.dataSources" :label="0">本版</el-radio>
            <el-radio v-model="resourceForm.dataSources" :label="1">外版</el-radio>
          </el-form-item>
         <el-form-item label="合同名称:" prop="contractName">
            <el-input v-model="resourceForm.contractName" style="width:500px;"></el-input>
          </el-form-item>
          <el-form-item label="合同编号:" prop="contractNumber">
            <el-input v-model="resourceForm.contractNumber" style="width:500px;"></el-input>
          </el-form-item>
          <el-form-item label="有效日期:" prop="effectivedate" style="width:550px;" class="timeitem">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="resourceForm.startDate"
                value-format="yyyy-MM-dd"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="resourceForm.endDate"
                style="width: 100%;"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-col>
          </el-form-item>
        </el-form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="原始文件" name="fourth"  v-if="dialogStatus!='add'">
        <div class="initfiles">
          <div class="upload">
            <el-upload
              class="uploadfile"
              :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
              :on-preview="handleFPreview"
              :on-remove="handleFRemove"
              :on-success="handleFSuccess"
              :before-upload="beforeFUpload"
              :multiple="false"
              :show-file-list="false"
            >
              <el-button size="small" type="primary" class="mag-bot-15">
                <i class="el-icon-upload"></i>上传文件
              </el-button>
            </el-upload>
            <span class="recomment">可通过该模块管理资源的宣传材料、相关附件等文件</span>
          </div>

          <div class="uploadList">
            <el-table :data="tableData" border>
                  <el-table-column prop="originalFileName" label="名称" align="center"></el-table-column>
                  <el-table-column prop="size" label="大小" align="center"></el-table-column>
                  <el-table-column prop="createTime" align="center" label="上传时间"></el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <el-button @click="handleDel(scope.row.id,scope.row.fileName)" type="text" size="small">删除</el-button>
                      <el-button @click="handleDown(scope.row.fileName)" type="text" size="small">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
            <!-- <div class="btncenter">
                  <el-button @click="goback">上一步,填写资源信息</el-button>
                  <el-button @click="fininsh">完成,提交内容</el-button>
            </div>-->
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="操作记录" name="third">
        <div class="recordtable">
          <el-table :data="recordData" border>
            <el-table-column prop="name" label="操作名称" align="center"></el-table-column>
            <el-table-column prop="size" label="操作类型" align="center"></el-table-column>
            <el-table-column prop="operator" align="center" label="操作人"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="handleInfo(scope.row)" type="text" size="small">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="prfooter">
            <div class="prfooterright">
              <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    </div>
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import Tinymce from "@/components/Tinymce";
import pagination from "../components/pagination";
import { detailsAPI } from "@/api/resource/recycle";
import { uploadFileListAPI,files, delFileListAPI } from "@/api/resource/common";
import "@/styles/resource.scss";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  getFileSize
} from "@/utils/publicFunctions";
export default {
  name:"create_recycle_bin",
  components: { Tinymce, pagination },
  data() {
    return {
      hiddenViewButton:false,
      id:'',
      tokens:'',
      uploadFileList: {
        bookid: this.$route.query.id,
        token: []
      },
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      activeName: "first",
      uploading: false,
      tableData: [],
      recordData: [],
      resourceForm: {
        faceImg: null,
        dataSources: 0,
        startDate: "",
        endDate: ""
      },
      rules: {
        name: [{ required: true }],
        dataSources: [{ required: true }]
      },
      total: 30,
      dialogStatus:''
    };
  },
  created() {
    this.dialogStatus = this.$route.query.type;
  },
  mounted() {
    // this.pageDetails();
    this.isEdit();
    this.hiddenView();
    
  },
  methods: {
    //查看页面不显示上传按钮 
    hiddenView(){
      if( this.$route.query.type == 'view' ){
        this.hiddenViewButton = false
      }else{
        this.hiddenViewButton = true
      }
    },
     //上传文件列表
    getUploadFileList() {
    uploadFileListAPI(this.uploadFileList).then(res => {
       if(res.data.status){
          this.tokens=res.data.data
          this.getFiles()
          this.$message.success("添加成功");
        } else {
          this.$message.error("添加失败");
        }
      });
    },
    //文件列表
    getFiles(){
      if(this.tokens==''||this.tokens==null){
       this.tableData=[]
        return;
     } else {
        files({tokens:this.tokens}).then(res => {
       this.tableData=res.data.data
       res.data.data.forEach( (ele,index) => {
        res.data.data[index].size=getFileSize(ele.size)
      })
       })
     }
      
    },
    //删除上传文件
    handleDel(id,fileName){
      this.uploadFileList.token = fileName
    delFileListAPI(this.uploadFileList).then(res =>{
      if(res.data.status){
        this.tokens=res.data.data
        this.getFiles()
      this.$message.success("删除成功");
       }else{
         this.$message.error("删除失败");
       }
    })
    },
    handleFPreview(file) {},
    handleFRemove(file, fileList) {},
    beforeFUpload(file) {
    },
    handleFSuccess(res, file, fileList) {
     
     this.uploadFileList.token = res;
     this.getUploadFileList()
    },
    isEdit() {
      this.$route.meta.title = "查看资源回收站";
      const id = this.$route.query.id; //修改id
      if (id) {
        this.pageDetails(id);
        this.$route.meta.title = "修改资源回收站";
      }
    },

    // 查看详情页面
    pageDetails(id) {
      detailsAPI(id).then(res => {
        this.resourceForm=res.data.data
      });
    },

    //
    handleClick(tab) {
      if(tab.index==1){
        this.getFiles()
      }
    },

    // 上传课程封面图片
    handlePreview(file) {},
    beforeUpload(file) {},
    handleSuccess(res, file, fileList) {},
    handleRemove() {},

    // 上传合同
    handleFilePreview() {},
    beforeFileUpload() {},
    handleFileSuccess() {},
    handleFileRemove() {},

    // 详情
    handleInfo() {},

    pagesizeFun() {},
    currentPageFun() {},

    // 返回
    back() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.el-tabs {
  width: 1300px !important;
  margin: 30px auto !important;
}
.el-form-item {
  margin-left: 30px !important;
  margin-top: 20px !important;
}
.el-form-item__label {
  width: 100px !important;
}
.line {
  text-align: center;
  border-bottom: none;
}
.title {
  font-weight: bold;
  border-left: 4px solid #03bcd9;
  padding-left: 8px;
}
.el-tabs__content {
  margin-top: 30px !important;
}
.back {
  margin-left: 214px;
  margin-top: 20px;
  cursor: pointer;
}
.reImg{
  height: 146px;
  width: 146px;
}
</style>
