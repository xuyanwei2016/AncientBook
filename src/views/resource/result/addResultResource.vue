<template>
  <div class="addImgResource">
    <div class="formbox">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="资源信息" name="first">
          <div class="tabwrapper">
            <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
            <el-form
              :model="resourceForm"
              ref="ruleForm"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="成果名称:" prop="name">
                <el-input v-model="resourceForm.name" class="width460"></el-input>
              </el-form-item>
              <el-form-item label="成果完成人:" prop="author" class="width360">
                <el-input v-model="resourceForm.author"></el-input>
              </el-form-item>
              <el-form-item label="第一完成单位:" prop="completeOrgan" class="width360">
                <el-input v-model="resourceForm.completeOrgan"></el-input>
              </el-form-item>
              <el-form-item label="成果类别:" prop="achievementClass" class="width360">
                <el-input v-model="resourceForm.achievementClass"></el-input>
              </el-form-item>

              <el-form-item label="自定义分类:">
                <treeselect
                  placeholder='请选择'
                  v-model="treeSelectValue"
                  :multiple="true"
                  :options="treeSelectOptions"
                  :normalizer="normalizer"
                  @select="selectFun"
                  @deselect="deselectFun"
                />
              </el-form-item>

              <el-form-item label="自定义标签:" prop="tab">
                <el-input type="textarea" class="width460" v-model="resourceForm.labelContentCode "></el-input>
                <el-input type="text" class="inp"></el-input>
                <el-button>确定</el-button>
              </el-form-item>
              <el-form-item label="研究起止时间:">
                <el-date-picker
                  v-model="timeLimit"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @keyup.enter.native="onSubmit"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="评价形式:" prop="evaluateForm" class="width360">
                <el-input v-model="resourceForm.evaluateForm"></el-input>
              </el-form-item>
              <el-form-item label="所属部门:" prop="department" class="width360">
                <el-select v-model="resourceForm.department">
                  <el-option
                    v-for="item in departmentList"
                    :key="item.departmentId"
                    :label="item.departmentName"
                    :value="item.departmentName"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关键词:" prop="keyword">
                <el-input placeholder="多个关键词用都好隔开" v-model="resourceForm.keyword"></el-input>
              </el-form-item>

              <el-form-item label="成果简介:" prop="synopsis" class="content">
                <tinymce :height="300" ref="editor" v-model="resourceForm.synopsis"></tinymce>
              </el-form-item>

              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;资源内容</h6>
              <div class="resource_content" style="margin-left: 120px;">
                <span class="tip">请上传资源的阅读文件，至少上传一种文件</span>
                <el-form-item label="PDF成品文件：">
                  <el-radio-group v-model="resourceForm.pdf" @change="changePdf">
                    <el-radio :label="0">上传PDF资源</el-radio>
                    <el-radio :label="1">绑定已有PDF资源</el-radio>
                  </el-radio-group>
                  <el-upload
                    :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                    :before-upload="beforePDFUpload"
                    :on-success="handlePDFSuccess"
                    v-if="resourceForm.pdf == 0"
                    :on-remove="handleRemovePdf"
                  >
                    <el-button :loading="uploading">上传文件</el-button>
                    <!-- <span>{{resourceForm.pdf_zh}}</span> -->
                  </el-upload>
                  <!-- <el-button v-if="resourceForm.pdfType == 0" @click="queryPDF">查看</el-button> -->
                  <el-button v-else @click="changePdf" style="display:block">选择文件</el-button>
                </el-form-item>
                <el-form-item label="视频成品文件：">
                  <el-radio-group v-model="resourceForm.video" @change="changeVideo">
                    <el-radio :label="0">上传视频资源</el-radio>
                    <el-radio :label="1">绑定已有视频资源</el-radio>
                  </el-radio-group>
                  <el-upload
                    :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                    :before-upload="beforeVideoUpload"
                    :on-success="handleVideoSuccess"
                    v-if="resourceForm.video == 0"
                    :on-remove="handleRemoveVideo"
                  >
                    <el-button :loading="uploading">上传文件</el-button>
                    <!-- <span>{{resourceForm.pdf_zh}}</span> -->
                  </el-upload>
                  <!-- <el-button v-if="resourceForm.pdfType == 0" @click="queryPDF">查看</el-button> -->
                  <el-button v-else @click="changeVideo" style="display:block">选择文件</el-button>
                </el-form-item>
                <el-form-item label="音频成品文件：">
                  <el-radio-group v-model="resourceForm.audio" @change="changeAudio">
                    <el-radio :label="0">上传音频资源</el-radio>
                    <el-radio :label="1">绑定已有音频资源</el-radio>
                  </el-radio-group>
                  <el-upload
                    :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                    :before-upload="beforeAudioUpload"
                    :on-success="handleAudioSuccess"
                    v-if="resourceForm.audio == 0"
                    :on-remove="handleRemoveAudio"
                  >
                    <el-button :loading="uploading">上传文件</el-button>
                    <!-- <span>{{resourceForm.pdf_zh}}</span> -->
                  </el-upload>
                  <!-- <el-button v-if="resourceForm.pdfType == 0" @click="queryPDF">查看</el-button> -->
                  <el-button v-else @click="changeAudio" style="display:block">选择文件</el-button>
                </el-form-item>
              </div>

              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;商品信息</h6>
              <el-form-item label="商品编号:" prop="goosCode" class="width100%">
                <el-input v-model="resourceForm.goosCode" style="width:230px;"></el-input>
                <span class="recomment">可用来保存资源的旧编码</span>
              </el-form-item>
              <el-form-item label="数据来源:" prop="dataSources">
                <el-radio v-model="resourceForm.dataSources" :label="1">本版</el-radio>
                <el-radio v-model="resourceForm.dataSources" :label="2">外版</el-radio>
                <span class="recomment">选择外版后请填写或者关联合同信息</span>
              </el-form-item>
              <el-form-item label="相关合同:" prop="relatedContracts" class="width360">
                <el-upload
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  list-type="picture-card"
                  :on-preview="handleFilePreview"
                  :before-upload="beforeFileUpload"
                  :on-success="handleFileSuccess"
                  :on-remove="handleFileRemove"
                  :show-file-list="false"
                ></el-upload>
                <p>
                  <el-input
                    v-model="resourceForm.contractNumber"
                    placeholder="合同编号"
                    class="width360"
                  ></el-input>
                </p>
                <p>
                  <el-input v-model="resourceForm.contractName" placeholder="合同名称" class="width360"></el-input>
                </p>
              </el-form-item>
              <el-form-item
                label="有效日期:"
                prop="effectivedate"
                style="width:550px;"
                class="timeitem"
              >
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

              <el-form-item>
                <el-button type="primary" @click="onSubmit" v-if="pageStatus == 0">保存</el-button>
                <el-button  @click="reset">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <el-tab-pane v-if="addShow" label="附件" name="fourth">
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
                <el-button size="small" type="primary">
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
                    <el-button
                      @click="handleDel(scope.row.id,scope.row.fileName)"
                      type="text"
                      size="small"
                    >删除</el-button>
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
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {
  addAPI,
  detailsAPI,
  updateAPI,
  delFileListAPI,
  uploadFileListAPI,
  getTreeAPI
} from "@/api/resource/result";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm
} from "@/utils/publicFunctions";
import { getNavAPI } from "@/api/book-infomation/goodsInfo";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import Tinymce from "@/components/Tinymce";
import "@/styles/resource.scss";
import pagination from "../components/pagination";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { files, getDepartmentAPI } from "@/api/resource/common";

export default {
  name: "add_result",
  data() {
    return {
      imgForm: "",
      status: "",
      addShow: true,
      departmentList: [],
      tokens: "", //附件
      uploadFileList: {
        bookid: this.$route.query.id,
        token: ""
      },
      treeSelectValue: null,
      timeLimit: "",
      treeSelectOptions: [],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      navTree: [],
      imageUrl: "",
      pageStatus: 0,
      resourceForm: {
        name: "",
        author: "",
        completeOrgan: "",
        evaluateForm: "",
        treeSelectValue: "",
        achievementClass: "",
        contractName: "",
        contractNumber: "",
        dataSources: 0,
        department: "区域一",
        labelId: [],
        diyTypeCode: [],
        diyTypeId: [],
        endDate: "",
        goosCode: "",
        cover: null,
        labelContentCode: [],
        labelContentId: [],
        price: "",
        priceType: 2,
        relatedContracts: "",
        salesStatus: 2,
        sellingPrice: "",
        source: "",
        startDate: "",
        synopsis: "",
        keyword: "",
        text: "",
        pdfFile: "",
        videoFile: "",
        audioFile: "",
        pdf: 0,
        video: 0,
        audio: 0,
        beginTime: "2018-5-20",
        endTime: "2018-5-2"
      },
      rules: {
        name: [
          { required: true, message: "成果名称为必填", trigger: "blur" },
          { max: 80, trigger: "blur", message: "长度80字以内" }
        ],
        author: [
          { required: true, message: "成果为必填", trigger: "blur" },
          { max: 30, trigger: "blur", message: "长度30字以内" }
        ],
        achievementClass: [
          { required: true, message: "成果类别为必填", trigger: "blur" },
          { max: 30, trigger: "blur", message: "长度30字以内" }
        ],
        source: [{ required: true, message: "来源为必填", trigger: "blur" }],
        department: [
          { required: true, message: "所属部门为必选", trigger: "blur" }
        ],
        keyword: [{ max: 100, trigger: "blur", message: "长度不超过100个字" }],
        synopsis: [{ max: 10000, trigger: "blur", message: "长度10000子以内" }],
        type: [{ required: true, trigger: "blur" }],
        price: [{ required: false, trigger: "blur" }],
        text: [{ required: true, message: "正文为必填", trigger: "blur" }],
        dataSources: [
          { required: true, message: "数据来源为必选", trigger: "blur" }
        ],
        salesStatus: [
          { required: true, message: "销售状态为必选", trigger: "blur" }
        ],
        sellingPrice: [
          { required: true, message: "付费的价格为必填", trigger: "blur" }
        ],
        evaluateForm: [
          { required: true, message: "评价形式为必填", trigger: "blur" },
          { max: 30, trigger: "blur", message: "长度30字以内" }
        ],
        treeSelectValue: [
          { required: true, message: "自定义分类为必选", trigger: "blur" }
        ],
        goosCode: [{ max: 20, trigger: "blur", message: "长度20字以内" }],
        completeOrgan: [
          { required: true, message: "第一完成单位为必填", trigger: "blur" },
          { max: 30, trigger: "blur", message: "长度30字以内" }
        ]
      },
      // dialogStatus: "",
      dialogStatus: {},
      textMap: {
        update: "修改图书信息",
        add: "添加图书信息"
      },
      uploading: false,
      activeName: "first",
      tableData: [],
      recordData: [],
      total: 30
    };
  },
  methods: {
    // 长度验证规则
    judgeStrLen(name) {},

    getTree() {
      getTreeAPI().then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },
    //
    _addShow() {
      let url = location.href;
      if (url.indexOf("type") === -1) {
        this.addShow = true;
      } else {
        // ?type=add 添加
        this.addShow = false;
      }
    },

    getDepartmentList() {
      // console.log(123)
      getDepartmentAPI().then(res => {
        console.log(res);
        this.departmentList = res.data.data;
      });
    },
    //上传文件列表
    getUploadFileList() {
      uploadFileListAPI(this.uploadFileList).then(res => {
        if (res.data.status) {
          this.tokens = res.data.data;
          this.getFiles();
          this.$message.success("添加成功");
        } else {
          this.$message.error("添加失败");
        }
      });
    },
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

    //删除上传文件
    handleDel(id, fileName) {
      this.uploadFileList.token = fileName;
      delFileListAPI(this.uploadFileList).then(res => {
        if (res.data.status) {
          console.log(res.data.data);
          this.tokens = res.data.data;
          this.getFiles();
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    handleFPreview(file) {},
    handleFRemove(file, fileList) {},
    beforeFUpload(file) {},
    handleFSuccess(res, file, fileList) {
      this.uploadFileList.token = res;
      this.getUploadFileList();
    },
    //修改tree lable
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list
      };
    },
    selectFun(node) {
      this.resourceForm.diyTypeId.push(node.id);
      this.resourceForm.diyTypeCode.push(node.code);
    },
    deselectFun(node) {
      for (var i = 0; i < this.imgForm.diyTypeId.length; i++) {
        if (this.imgForm.diyTypeId[i] == node.id) {
          this.imgForm.diyTypeId.splice(i, 1);
          this.imgForm.diyTypeCode.splice(i, 1);
        }
      }
    },
    isEdit() {
      this.$route.meta.title = "添加成果";
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      if (id) {
        this.$route.meta.title = "修改成果";
        this.pageDetails(id);
      }
      if (detailsId) {
        this.pageStatus = 1;
        this.$route.meta.title = "查看成果";
        this.pageDetails(detailsId);
      }
    },

    // 查看和修改详情信息
    pageDetails(id) {
      detailsAPI(id).then(res => {
        if (res.data.code === 0) {
          this.resourceForm = res.data.data;
          this.tokens = res.data.data.attachmentList;
        }
      });
    },

    // 下一步
    onSubmit() {
      this.$refs["ruleForm"].validate(valid => {
        console.log(valid);
        if (valid) {
          //必填字段
          const id = this.$route.query.id; //获取要操作的ID
          if (id) {
            //如果ID存在说明就是在修改已有的数据，否则就是下面的新增
            //修改
            this.resourceForm.id = this.$route.query.id;
            updateAPI(this.resourceForm).then(res => {
              console.log(res);
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
            console.log("新增成果数据");
            addAPI(this.resourceForm).then(res => {
              console.log(res);
              if (res.data.code === 0) {
                this.$message.success("添加成功");
                // this.activeName = "second";
                // this.$router.push({path: '/resource/result'})
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
      this.$router.go(-1);
      // this.resourceForm = {
      //   name: "",
      //   author: "",
      //   completeOrgan: "",
      //   evaluateForm: "",
      //   treeSelectValue: "",
      //   achievementClass: "",
      //   contractName: "",
      //   contractNumber: "",
      //   dataSources: 1,
      //   department: "区域一",
      //   labelId: ["02"],
      //   diyTypeCode: ["010101"],
      //   diyTypeId: ["1"],
      //   endDate: "",
      //   goosCode: "",
      //   cover: null,
      //   labelContentCode: ["0102"],
      //   labelContentId: ["3"],
      //   price: "",
      //   priceType: 2,
      //   relatedContracts: "",
      //   salesStatus: 2,
      //   sellingPrice: "",
      //   source: "",
      //   startDate: "",
      //   synopsis: "",
      //   keyword: "",
      //   text: "",
      //   pdfFile: "",
      //   videoFile: "",
      //   audioFile: "",
      //   pdf: 0,
      //   video: 0,
      //   audio: 0
      // };
    },
    getNav() {
      getNavAPI().then(res => {
        res.data.code === 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
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
      this.$router.push({ path: "/resource/result" });
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

    /* 上传合同*/
    handleFilePreview(file) {},
    handleFileRemove(file, fileList) {},
    beforeFileUpload(file) {},
    handleFileSuccess(res, file, fileList) {
      this.resourceForm.relatedContracts = res;
    },
    /*上传图片 */
    handlePreview(file) {},
    handleRemove(file, fileList) {},
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
    },
    handleSuccess(res, file, fileList) {
      this.imageUrl = `${this.domain}${
        this.requestPath.file
      }?fileName=${res}&isOnLine=true`;
      this.resourceForm.image = res;
    },
    //原始文件列表
    getFileList() {},
    //自定义分类

    // getInfo() {
    //   detailsAPI(this.$route.query.id).then(res => {
    //     if (res.data.code === 0) {
    //       this.resourceForm = res.data.data;
    //       this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${
    //         this.resourceForm.image
    //       }&isOnLine=true`;
    //     } else {
    //       this.$message.error(`获取数据失败`);
    //     }
    //   });
    // },

    // pdf资源
    changePdf() {},
    beforePDFUpload(file) {},
    handlePDFSuccess(res, file, fileList) {
      this.resourceForm.pdfFile = res;
    },
    handleRemovePdf() {},

    // 视频资源
    changeVideo() {},
    beforeVideoUpload(file) {},
    handleVideoSuccess(res, file, fileList) {},
    handleRemoveVideo() {},

    // 音频资源
    changeAudio() {},
    beforeAudioUpload(file) {},
    handleAudioSuccess(res, file, fileList) {},
    handleRemoveAudio() {}
  },
  created() {
    this.dialogStatus = this.$route.query.type;
  },
  mounted() {
    this.isEdit();
    // this.pageDetails();
    this.getDepartmentList();
    this._addShow();
    this.getTree();
  },
  components: { Tinymce, pagination, Treeselect }
};
</script>
<style>
#app .main-container {
  background: #eef0f3 !important;
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

/* /* .btncenter .el-button:hover {
  background: #409eff;
  border-color: #409eff;
  border-radius: 5px;
  color: #fff;
} */ */
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
.addImgResource .el-form-item {
  width: 80%;
}
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
/* .resource_content {
  margin-left: 120px;
} */
.resource_content .tip {
  font-size: 14px;
  color: #ccc;
}
.resource_content .el-form-item__label {
  width: 120px !important;
}
.recomment {
  color: #a1abbc !important;
}
</style>

