<template>
  <div class="addImgResource">
    <div class="formbox">
      <el-form
              :model="imgForm"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              :rules="rules"
            >
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="资源信息" name="first">
          <div class="tabwrapper">
            <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
            
             <el-form-item label="资源名称:" prop="name" class="width360">
                <el-input v-model="imgForm.name" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item label="作者:" prop="author" class="width360">
                <el-select
                  value-key="id"
                  v-model="imgForm.author"
                  style="width:100%"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="点击关联作者或手动输入"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-option
                    v-for="item in authors"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关键词:" prop="keywords" class="width360">
                <el-input v-model="imgForm.keywords" :disabled="this.dialogStatus === 'view'" placeholder="多个关键词用逗号隔开"></el-input>
              </el-form-item>
              <el-form-item label="所属图书:" prop="bookName" class="width360">
                <el-input v-model="imgForm.bookName" :disabled="this.dialogStatus === 'view'||imgForm.bookId!=null"></el-input>
              </el-form-item>
              <el-form-item prop="source" label="来源:" class="width360">
                <el-input
                  v-model="imgForm.source"
                  v-validate="'required'"
                  data-vv-as="field"
                  name="source"
                  :disabled="this.dialogStatus === 'view'"
                ></el-input>
              </el-form-item>
              <el-form-item prop="departmentId" label="所属部门:" class="width360">
                <el-select
                  v-model="imgForm.departmentId"
                  placeholder="所属部门"
                  name="department"
                  data-vv-as="selected"
                  :disabled="this.dialogStatus === 'view'||imgForm.bookId!=null"
                >
                  <el-option
                    v-for="item in departmentList"
                    :key="item.departmentId"
                    :label="item.departmentName"
                    :value="item.departmentId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="图片类型:" prop="imgtype" class="width360">
                <el-select v-model="imgForm.imageType" :disabled="this.dialogStatus === 'view'">
                  <el-option label="封面" :value="0"></el-option>
                  <el-option label="插图" :value="1"></el-option>
                  <el-option label="其他" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="自定义分类:" prop="diyTypeId">
                <treeselect
                  style="width:50%"
                  v-model="imgForm.diyTypeId"
                  placeholder="请选择"
                  :multiple="true"
                  :flat="true"
                  :options="treeSelectOptions"
                  data-vv-scope="baseInfo"
                  :normalizer="normalizer"
                  :loadOptions='loadOptions'
                  :auto-load-root-options="false"
                  v-validate="'required'"
                  @select="selectFun"
                  @deselect="deselectFun"
                  @input="selfChoose"
                  :disabled="this.dialogStatus === 'view'"
                />
              </el-form-item>
              <!--自定义标签-->
              <ul>
                <li v-for="(value, index) in labelList" :key="index">
                  <el-form-item :label="value.name + ':'" prop="tablist">
                    <customLabel
                      :indx="index"
                      :getLabel="getnewLabel"
                      :arraylist="value.list||[]"
                      :defaultValue="defaultValue"
                      :labelValue="value"
                      :tabDefine="imgForm.tablist"
                      :dialogStatus="dialogStatus"
                    ></customLabel>
                  </el-form-item>
                </li>
              </ul>
            <el-form-item label="简介:" prop="content" class="content">
              <tinymce :height="300" ref="editor" v-model="imgForm.synopsis"></tinymce>
            </el-form-item>
            <el-form-item label="图片：" prop="image" style="positin:relative">
              <el-upload
                :action="`${domain}${requestPath.file}${uploadPath}`"
                list-type="picture-card"
                :on-preview="handlePreview"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :disabled="this.dialogStatus === 'view'"
                :on-remove="handleRemove"
                :show-file-list="false"
                accept=".jpg,.png,.jpeg,.gif,.png"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <i class="el-icon-search magnifier" @click="toBigPic(imageUrl)"  v-if="imageUrl" title="查看原图"></i>
            </el-form-item>
            
            <h6>&nbsp;&nbsp;|&nbsp;&nbsp;商品信息</h6>
            <el-form-item label="商品编码:" prop="goosCode" class="width325">
              <el-input v-model="imgForm.goosCode" :disabled="this.dialogStatus === 'view'"></el-input>
              <span class='recomment'>可用来保存资源的旧编码</span>
            </el-form-item>
            <el-form-item prop="dataSources" label="数据来源:">
              <el-radio-group v-model="imgForm.dataSources" :disabled="this.dialogStatus === 'view'">
                <el-radio :label="0">本版</el-radio>
                <el-radio :label="1">外版</el-radio>
              </el-radio-group>
              <span class='recomment'>选择外版后请填写或者关联合同信息</span>
            </el-form-item>
            <el-form-item prop="salesStatus" label="销售状态:">
              <el-radio-group v-model="imgForm.salesStatus" :disabled="this.dialogStatus === 'view'">
                <el-radio :label="1">可售</el-radio>
                <el-radio :label="2">不可售</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="定价:" prop="price" class="width325">
              <el-input v-model="imgForm.price" :disabled="this.dialogStatus === 'view'"></el-input>元
              <span class='recomment'>在前台展示为划线价格</span>
            </el-form-item>
            <el-form-item label="售价:"  class="width325">
              <el-radio-group v-model="imgForm.priceType" :disabled="this.dialogStatus === 'view'">
                <el-radio :label="1">付费</el-radio>
                <el-radio :label="2">免费</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="imgForm.priceType==1" prop="sellingPrice">
              <el-input style="width:325px;" :disabled="this.dialogStatus === 'view'" v-model="imgForm.sellingPrice"></el-input>
              <span>元</span>
            </el-form-item>
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
                <el-button size="small" type="primary" v-if="hiddenViewButton" class="mag-bot-15">
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
                      v-if="dialogStatus!='view'"
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
        <el-tab-pane label="操作记录" name="fifth" v-if="this.dialogStatus==='view'">
          <div class="recordtable">
            <el-table :data="recordData" border>
              <el-table-column prop="name" label="操作名称" align="center"></el-table-column>
              <el-table-column prop="name" label="操作类型" align="center"></el-table-column>
              <el-table-column prop="createrAccount" label="操作人" align="center"></el-table-column>
              <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
              <el-table-column prop="ip" label="IP" align="center"></el-table-column>
            </el-table>
            <!-- 底部 -->
            <div class="prfooter">
              <div class="prfooterright">
                <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
              </div>
            </div>
            <!-- 底部 -->
          </div>
        </el-tab-pane>
        <div class="btncenter">
          <el-button type="primary" @click="onSubmit('ruleForm')" v-if="dialogStatus != 'view'">保存</el-button>
          <el-button @click="$router.go(-1)" class="cancel">取消</el-button>
        </div>
      </el-tabs>
      </el-form>
    </div>
    <!--关联内容-->
    <el-dialog title="关联合同" :visible.sync="relatedDialog" class="backgroundDialog relatedDialog">
      <el-form
        :model="relatedForm"
        label-width="120"
        style="margin-bottom:5px;"
        class="relatedFormInput"
      >
        <el-form-item label="合同编号">
          <el-input v-model="relatedForm.identifier" clearable></el-input>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="relatedForm.name" clearable></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleFilter">检索</el-button>
      </el-form>
      <el-table
        border
        ref="multipleTable2"
        :data="relateList"
        tooltip-effect="dark"
        style="background:#ccc;"
      >
        <el-table-column align="center" width="50">
          <template slot-scope="scope">
            <el-radio v-model="checkedRelatedList" :label="scope.row">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="合同名称" align="center" width="180"></el-table-column>
        <el-table-column prop="identifier" label="合同编号" align="center" width="180"></el-table-column>
        <el-table-column prop="signingTime" label="签订时间" align="center" width="180"></el-table-column>
        <el-table-column prop="secondParty" label="乙方" align="center"></el-table-column>
      </el-table>
      <div class="prfooter">
        <pagination
          @pagesize="pagesizeFun2"
          :total="total2"
          @currentPage="currentPageFun2"
          ref="child"
        ></pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmRelated">确 定</el-button>
        <el-button @click="cancelRelated">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="放大图" :visible.sync="toBigPicDialog" class="backgroundDialog updateTypeDialog">
      <div class="images">
        <img :src="bigSrc" class="bigavatar" @click="toSmallPic()">
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addAPI,
  getInfoAPI,
  updateAPI,
  getTreeAPI,
  delFileListAPI,
  uploadFileListAPI,
  getLabelAPI
} from "@/api/resourcenew/picture";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm,
  compareDate,
  getFileSize
} from "@/utils/publicFunctions";
import { getNavAPI } from "@/api/book-infomation/goodsInfo";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import Tinymce from "@/components/Tinymce";
import customLabel from "@/components/customLabel";
import "@/styles/resource.scss";
import "@/styles/commonRe.css";
import pagination from "../components/pagination";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getAuthorsAPI } from "@/api/resource/ebook";
import {
  fileListAPI,
  files,
  getDepartmentAPI,
  getCopyrightListAPI,
  sectionAPI
} from "@/api/resource/common";
export default {
  name: "add_pic",
  data() {
    return {
      canUseDate: false,
      authors: [],
      hiddenViewButton: false,
      id: "",
      checkedRelatedList: {},
      relateList: [],
      relatedDialog: false,
      total: 30,
      total2: 30,
      relatedForm: {
        secondParty: "", //乙方
        identifier: "", //合同编号
        name: "" //合同名称
      },
      checkedRelated: false,
      departmentList: [],
      tokens: "", //附件
      fileForm: {
        pageNum: 1,
        pageSize: 50
      },
      uploadFileList: {
        oid: this.$route.query.id,
        token: ""
      },
      navTree: [],

      imageUrl: "",
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      treeSelectValue: null,
      treeSelectOptions: [],
      imgForm: {
        sellingPrice: "",
        author: "",
        bookName: "",
        contractName: "",
        contractNumber: "",
        dataSources: 0,
        department: "",
        departmentId: "",
        labelId: ["55"],
        diyTypeCode: [],
        diyTypeId: [],
        endDate: "",
        goosCode: "",
        image: "",
        imageType: 0,
        keywords: "",
        labelContentCode: [],
        labelContentId: [],
        name: "",
        price: "",
        priceType: 1,
        relatedContracts: "",
        salesStatus: 1,
        sellingPrice: "",
        source: "",
        startDate: "",
        synopsis: "",
        text: "",
        tablist: [],
      },
      defaultValue: [], //默认分类
      labelList: [],
      dialogStatus: "",
      textMap: {
        update: "修改图片信息",
        add: "添加图片信息"
      },
      uploading: false,
      activeName: "first",
      tableData: [],
      recordData: [],
      labelReback: [],
      total: 30,
      rules: {
        name: [{ required: true, message: "请输入资源名称"},{max:80,message:'资源名称的长度不可以超过80'}],
        keywords:[{required:false,max:100,message:"关键词长度不可以超过100"}],
        author:[{max:10,message:'作者的长度不可以10'}],
        bookName: [{required:true,message:'请输入所属图书'},{max:80, message:"所属图书长度不可以超过80"}],       
        source:[{required:true,message:'请输入来源'},{max:30,message:"来源长度不可以超过30"}],
        departmentId: [
          { required: true, message: "请输入所属部门"}
        ],
        
        sellingPrice: {
          required: true,
          pattern: /^\d{0,5}(\.\d{0,2})?$/,
          message: "请输入0-99999之间的数字，最多保留两位"
        },
        price: {
          pattern: /^\d{0,5}(\.\d{0,2})?$/,
          message: "请输入0-99999之间的数字，最多保留两位"
        },
        goosCode: [
          {max:20,message: "商品编码长度不超过20"}
        ],
        salesStatus: [{ required: true, message: "请选择销售状态" }],
        diyTypeId: [
          { required: true, message: "请填写自定义分类", trigger: "input" }
        ], //trigger: "input"不能改
        image:[{
          required:true,
          message:'请上传图片'
        }]
        
      },
      toBigPicDialog: false,
      bigSrc: ""
    };
  },
  methods: {
    //放大图片
    toBigPic(val) {
      this.bigSrc = val
      this.toBigPicDialog = true;
    },
    toSmallPic(val) {
      this.toBigPicDialog = false;
    },
    //作者列表
    getAuthors() {
      getAuthorsAPI().then(res => {
        if (res.data.status) {
          this.authors = res.data.data;
        }
      });
    },
    //选择作者
    // changeName() {
    //   this.imgForm.authorId = this.imgForm.author.id;
    //   this.imgForm.author = this.imgForm.author.name;
    // },
    //校验自定义分类
    selfChoose(val) {
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField("diyTypeId");
      });
    },
    selectFun(node) {
      //this.imgForm.diyTypeCode = [];
      if (node.code != null || node.code != "") {
        this.imgForm.diyTypeCode.push(node.code);
      }

      //this.imgForm.diyTypeId = [];
      if (node.id != null || node.id != "") {
        this.imgForm.diyTypeId.push(node.id);
      }
    },
    deselectFun(node) {//监听删除
      for (var i = 0; i < this.imgForm.diyTypeId.length; i++) {
        if (this.imgForm.diyTypeId[i] == node.id) {
          this.imgForm.diyTypeId.splice(i, 1);
          this.imgForm.diyTypeCode.splice(i, 1);
        }
      }
    },
    loadOptions({ action, parentNode, callback }){//此处可以懒加载，去掉loadOptions警告；
      callback();
    },
    //查看页面不显示上传按钮
    hiddenView() {
      if (this.$route.query.type == "view") {
        this.hiddenViewButton = false;
      } else {
        this.hiddenViewButton = true;
      }
    },
    getRelatedList() {
      this.relatedDialog = true;
      getCopyrightListAPI(this.relatedForm).then(res => {
        if (res.data.code === 0) {
          this.relateList = res.data.data.list;
          this.total2 = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        // this.relatedDialog = false;
      });
    },
    pagesizeFun2(val) {
      this.relatedForm.pageSize = val;
      this.getRelatedList();
    },
    currentPageFun2(val) {
      this.relatedForm.pageNum = val;
      this.getRelatedList();
    },
    //相关合同--确定
    confirmRelated() {
      if(this.checkedRelatedList.id){
        this.imgForm.contractNumber = this.checkedRelatedList.identifier;
        this.imgForm.contractName = this.checkedRelatedList.name;
        this.checkedRelated = true;
        this.relatedDialog = false;
      }else{
        this.$message.warning('请选择一条合同')
      }
      
    },
    cancelRelated() {
      this.checkedRelatedList = [];
      if (!this.imgForm.contractNumber) {
        this.imgForm.contractNumber = "";
        this.imgForm.contractName = "";
        this.checkedRelated = false;
      } else {
        this.checkedRelated = true;
      }
      this.relatedDialog = false;
    },
    handleFilter() {
      this.getRelatedList();
    },
    // 获取用户部门
    gainSection() {
        sectionAPI().then(res => {
          this.imgForm.departmentId = res.data.data.deptList[0].deptId;
        });
      
    },
    getDepartmentList() {
      getDepartmentAPI().then(res => {
        this.departmentList = res.data.data;
      });
    },

    //操作记录文件列表
    getFileList() {
      this.fileForm.resourceId = this.$route.query.id;
      fileListAPI(this.fileForm).then(res => {
        if (res.data.code == 0) {
          this.recordData = res.data.data.list;
          this.total = res.data.data.total;
        }
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
      if (this.tokens == "" || this.tokens == null) {
        this.tableData = [];
        return;
      } else {
        files({ tokens: this.tokens }).then(res => {
          res.data.data.forEach( (ele,index) => {
            res.data.data[index].size=getFileSize(ele.size)
          })
          this.tableData = res.data.data;
        });
      }
    },
    //删除上传文件
    handleDel(id, fileName) {
      this.uploadFileList.token = fileName;
      delFileListAPI(this.uploadFileList).then(res => {
        if (res.data.status) {
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
    // 下一步
    onSubmit(ruleForm) {
      //自定义标签
      let labelId = [],
        labelContentCode = [],
        labelContentId = [];
      this.defaultValue.forEach(ele => {
        if (ele.labelMessage.length > 0) {
          ele.labelMessage.forEach(res => {
            labelId.push(ele.id);
            labelContentId.push(res.split(",")[0]);
            labelContentCode.push(res.split(",")[1]);
          });
        }
      });
      this.imgForm.labelId = labelId;
      this.imgForm.labelContentCode = labelContentCode;
      this.imgForm.labelContentId = labelContentId;

      this.$refs[ruleForm].validate(result => {
        if (result) {
          if (this.imgForm.startDate && this.imgForm.endDate) {
            if (!compareDate(this.imgForm.startDate, this.imgForm.endDate)) {
              this.$message.warning("开始时间不可以大于结束时间");
              return;
            }
          }
          this.dialogStatus === "add"
            ? this.invokeAPI(addAPI, this.imgForm)
            : this.invokeAPI(updateAPI, this.imgForm);

          return;
        } else {
          this.$message.warning("有未通过的验证");
        }
      });
    },
    getNav() {
      getNavAPI().then(res => {
        res.data.code === 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
    },
    //保存
    invokeAPI(api, data) {
      //添加、修改调接口
      api(data).then(res => {
        if (res.data.status) {
          this.$message.success(`${this.textMap[this.dialogStatus]}成功`);
          this.$router.go(-1);
          this.activeName = "second";
        } else {
          errorMsg.apply(this, [res.data, this.textMap[this.dialogStatus]]);
        }
      });
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list
      };
    },
    getTree() {
      getTreeAPI(5).then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },
    handleClick(tab) {
      if (tab.label == '附件') {
        this.getFiles();
      }
    },

    goback() {
      this.activeName = "first";
    },
    fininsh() {},
    handleInfo() {},
    pagesizeFun(val) {
      this.fileForm.pageSize = val;
      this.getFileList();
    },
    currentPageFun(val) {
      this.fileForm.pageNum = val;
      this.getFileList();
    },
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
      this.imgForm.relatedContracts = res;
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
      this.imgForm.image = res;
    },
    //  首页加载信息
    getInfo() {
      getInfoAPI(this.$route.query.id).then(res => {
        if (res.data.code === 0) {
          //处理标签回显
          if(res.data.data.labelList){
            if (res.data.data.labelList.length > 0) {
              let labelList = [];
              res.data.data.labelList.forEach(ele => {
                let obj2 = {
                  id: "",
                  labelMessage: []
                };
                obj2.id = ele.id;
                ele.list.forEach(element => {
                  obj2.labelMessage.push(element.id + "," + element.code);
                });
                labelList.push(obj2);
              });
              this.labelReback = labelList;
            }
          }
          this.getLabel();
          this.imgForm = res.data.data;
          if(this.imgForm.image){
            this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${
              this.imgForm.image
            }&isOnLine=true`;
          }
          // this.bookid = this.imgForm.id
          this.treeSelectValue = res.data.data.diyTypeId;
          this.tokens = res.data.data.attachmentList;
          this.getFiles();
          if (
            res.data.data.diyTypeId == null ||
            res.data.data.diyTypeId == "null"
          ) {
            this.imgForm.diyTypeId = [];
            this.imgForm.diyTypeCode = [];
          }
        } else {
          this.$message.error(`获取数据失败`);
        }
        //详情页面清除校验
        if(this.dialogStatus=='view'){
          this.$refs['ruleForm'].resetFields()
        }
      });
    },
    // 自定义标签
    getLabel() {
      getLabelAPI(5).then(res => {
        if (res.data.code == 0) {
          this.labelList = res.data.data.list;
          this.defaultValue = [];
          if (res.data.data.list.length > 0) {
            for (var j = 0; j < res.data.data.list.length; j++) {
              let obj = {
                id: "",
                labelMessage: []
              };
              obj.id = res.data.data.list[j].id;
              if (this.labelReback.length > 0) {
                for (var i = 0; i < this.labelReback.length; i++) {
                  if (this.labelReback[i].id == res.data.data.list[j].id) {
                    obj.labelMessage = this.labelReback[i].labelMessage;
                    break;
                  }
                }
              }
              this.defaultValue.push(obj);
            }
          }
          if(this.dialogStatus=='view'){
            for( let n=0; n<this.defaultValue.length; n++){
              if(this.defaultValue[n].labelMessage.length==0){
                this.labelList.splice(n,1)
                this.defaultValue.splice(n,1)
                n--
              }
            }
          }
        }
      });
    },
    getnewLabel() {
      getLabelAPI(5).then(res => {
        if (res.data.code == 0) {
          this.labelList = res.data.data.list;
          this.defaultValue = [];
          if (res.data.data.list.length > 0) {
            for (var j = 0; j < res.data.data.list.length; j++) {
              let obj = {
                id: "",
                labelMessage: []
              };
              obj.id = res.data.data.list[j].id;
              if (this.labelReback.length > 0) {
                for (var i = 0; i < this.labelReback.length; i++) {
                  if (this.labelReback[i].id == res.data.data.list[j].id) {
                    obj.labelMessage = this.labelReback[i].labelMessage;
                    break;
                  }
                }
              }
              this.defaultValue.push(obj);
            }
          }
        }
      });
    },
    reset() {
      this.imgForm = {
        sellingPrice: "",
        department: 0
      };
    }
  },
  created() {
    this.dialogStatus = this.$route.query.type;
  },
  mounted() {
    //this.getNav();
    if (this.dialogStatus == "view") {
      this.$route.meta.title = "查看图片";
    }
    if (this.dialogStatus == "update") {
      this.$route.meta.title = "修改图片";
    }
    if (this.dialogStatus == "add") {
      this.$route.meta.title = "添加图片";
      this.getnewLabel()
      this.gainSection();
    }
    if (this.dialogStatus === "view" || this.dialogStatus === "update") {
      this.getInfo();
      this.getFileList();
    }
    this.getTree();
    this.getDepartmentList();
    
 
    this.hiddenView();
    this.getAuthors();
  },
  components: { Tinymce, pagination, Treeselect, customLabel }
};
</script>
<style>
.addImgResource .relatedFormInput .el-form-item {
  width: 250px !important;
}
/* .relatedResource .el-form-item, */
.addImgResource .el-input.author-input {
  width: 80%;
}
.relatedDialog .el-form-item {
  display: inline-block;
}
.relatedDialog .el-form-item {
  width: 240px;
}
.relatedDialog .el-select {
  width: 150px;
}
.table {
  margin-top: 10px;
}
.relatedDialog .el-input {
  width: 150px;
}
.addImgResource .recordtable {
  position: relative;
}
.addImgResource .prfooter {
  position: static;
  width: 100%;
  margin-top: 300px;
}
#app .main-container {
  background: #eef0f3 !important;
}
.addImgResource .el-form-item.width325 .el-input {
  width: 325px;
}
.addImgResource .el-form-item.content {
  width: 680px;
}

.addImgResource .btncenter {
  text-align: center;
  margin-right: 10px;
  margin-top: 100px;
}
.addImgResource .recordtable {
  position: relative;
}

.el-pagination button:disabled {
  background: none;
}

.el-form-item__label em {
  color: red;
}
.addImgResource .avatar {
  width: 146px;
  height: 146px;
  display: block;
  border-radius: 6px;
}

/* .addImgResource .el-form-item {
  width: 80%;
} */
.addImgResource .el-form-item.width360 {
  width: 40%;
}
.addImgResource .el-form-item.width360 .el-select{
  width: 100%;
}
.addImgResource .el-form-item.width300 {
  width: 30%;
}

.addImgResource .el-input.inp {
  width: 20%;
  display: inline-block;
}
.recomment {
  color: #a1abbc !important;
}
.magnifier{
  font-size: 22px;
  color: #666;
  top: 125px;
  left: 168px;
  position: absolute;
}
.bigavatar {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
}
.images {
  text-align: center;
}
</style>

