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
              <el-form-item label="资源名称:" prop="name">
                <el-input v-model="resourceForm.name" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="作者:" prop="author" class="width360">
                <el-select
                  value-key="id"
                  v-model="resourceForm.author"
                  style="width:100%"
                  @change="changeName"
                  placeholder="点击关联作者"
                >
                  <el-option
                    v-for="item in authors"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                    style='width:360px'
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关键词:" prop="keywords">
                <el-input
                  v-model="resourceForm.keywords"
                  style="width:500px;"
                  placeholder="多个关键词用逗号隔开"
                ></el-input>
              </el-form-item>
              <el-form-item label="所属图书:" prop="bookName">
                <el-input v-model="resourceForm.bookName" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="来源:" prop="source">
                <el-input v-model="resourceForm.source" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item prop="departmentId" label="所属部门:" class="width360">
                <el-select
                  v-model="resourceForm.departmentId"
                  placeholder="所属部门"
                  name="department"
                  data-vv-as="selected"
                >
                  <el-option
                    v-for="item in departmentList"
                    :key="item.departmentId"
                    :label="item.departmentName"
                    :value="item.departmentId"
                  ></el-option>
                </el-select>
                <span>{{ errors.first('department') }}</span>
              </el-form-item>
              <el-form-item prop="diyTypeId" label="自定义分类:" style="width:600px;">
                <treeselect
                  placeholder="请选择"
                  v-model="resourceForm.diyTypeId[0]"
                  :multiple="false"
                  :options="treeSelectOptions"
                  data-vv-scope="baseInfo"
                  :normalizer="normalizer"
                  v-validate="'required'"
                  @input="selfChoose"
                  @select="selectFun"
                />
              </el-form-item>
              <!--自定义标签//10-->
              <ul>
                <li v-for="(value, index) in labelList" :key="index">
                  <el-form-item :label="value.name + ':'" prop="tablist">
                    <customLabel
                      :indx="index"
                      :getLabel="getnewLabel"
                      :arraylist="value.list||[]"
                      :defaultValue="defaultValue"
                      :labelValue="value"
                      :tabDefine="resourceForm.tablist"
                      :dialogStatus="dialogStatus"
                    ></customLabel>
                  </el-form-item>
                </li>
              </ul>

              <el-form-item label="课件封面：" prop="cover" class="width100">
                <el-upload
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  list-type="picture-card"
                  :on-preview="handlePreview"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :disabled="uploading"
                  :on-remove="handleRemove"
                  :show-file-list="false"
                  accept=".jpg, .jpeg, .png, .gif, .png"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span class="recomment">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、gif、png格式，不超过2M</span>
              </el-form-item>
              <el-form-item label="简介:" prop="synopsis" class="content">
                <tinymce :height="300" ref="editor" v-model="resourceForm.synopsis"></tinymce>
              </el-form-item>
              <el-form-item label="上传文件:">
                <p class="alert-info">支持WORD、PPT、PDF、Excel、TXT、压缩包等格式，不超过2G</p>
                <p class="animation-error" v-if="animationError">请上传课件文件</p>
                <a
                  class="el-upload-list__item-name"
                  v-if="rebackCourseware&&resourceForm.courseware"
                >
                  <i class="el-icon-document"></i>
                  {{resourceForm.courseware}}
                </a>
                <el-upload
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :on-preview="handlefilePreview"
                  :before-upload="beforefileUpload"
                  :on-success="handlefileSuccess"
                  :on-remove="handlefileRemove"
                  accept=".word, .ppt, .pdf, .excel, .txt"
                >
                  <el-button v-if="hiddenViewButton">选择</el-button>
                </el-upload>
              </el-form-item>

              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;商品信息</h6>
              <el-form-item label="商品编号:" prop="goosCode" style="width:100%;">
                <el-input v-model="resourceForm.goosCode" style="width:230px;"></el-input>
                <span class="recomment">可用来保存资源的旧编码</span>
              </el-form-item>
              <el-form-item label="数据来源:" prop="dataSources">
                <el-radio v-model="resourceForm.dataSources" :label="1">本版</el-radio>
                <el-radio v-model="resourceForm.dataSources" :label="2">外版</el-radio>
                <span class="recomment">选择外版后请填写或者关联合同信息</span>
              </el-form-item>
              <el-form-item label="销售状态:" prop="salesStatus">
                <el-radio v-model="resourceForm.salesStatus" :label="1">可售</el-radio>
                <el-radio v-model="resourceForm.salesStatus" :label="2">不可售</el-radio>
              </el-form-item>

              <el-form-item label="定价:" prop="price" style="width:100%;">
                <el-input v-model="resourceForm.price" style="width:230px;"></el-input>
                <span>元</span>
                <span class="recomment">在前台展示为划线价格</span>
              </el-form-item>
              <el-form-item label="售价:" prop="priceType">
                <el-radio v-model="resourceForm.priceType" :label="1">付费</el-radio>
                <el-radio v-model="resourceForm.priceType" :label="2">免费</el-radio>
              </el-form-item>
              <el-form-item v-if="resourceForm.priceType == 1" prop="sellingPrice">
                <el-input v-model="resourceForm.sellingPrice" style="width:230px;"></el-input>
                <span>元</span>
              </el-form-item>
              <el-form-item label="相关合同:" prop="agreement" class="width360">
                <el-button @click="getRelatedList" size="small" v-if="hiddenViewButton">选择合同</el-button>
                <span style="color:#a2adbd">可手动添加合同信息或者选择合同库文件</span>
              </el-form-item>
              <el-form-item prop="contractNumber">
                <el-input
                  style="width:325px "
                  :disabled="checkedRelated"
                  v-model="resourceForm.contractNumber"
                  placeholder="合同编号"
                ></el-input>
              </el-form-item>
              <el-form-item prop="contractName">
                <el-input
                  style="width:325px"
                  :disabled="checkedRelated"
                  v-model="resourceForm.contractName"
                  placeholder="合同名称"
                ></el-input>
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
                <!-- <p class="animation-error" style="margin-top:40px;" v-if="canUseDate">请输入有效的时间段</p>  -->
              </el-form-item>

              <!-- <el-form-item>
              <el-button type="primary"  @click="onSubmit" v-if="pageStatus == 0" >下一步,上传原始文件</el-button>
              </el-form-item>-->
            </el-form>
            <div slot="footer" class="dialog-footer" v-if="dialogStatus !== 'view'">
              <el-button @click="onSubmit('ruleForm')">保存</el-button>
              <el-button @click="$router.go(-1)" class="cancel">取消</el-button>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="原始文件" name="second" v-if="$route.query.type!=='add'">
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
                <el-button size="small" type="primary" v-if="hiddenViewButton">
                  <i class="el-icon-upload"></i>上传文件
                </el-button>
              </el-upload>
              <span class="recomment">可通过该模块管理资源的宣传材料、相关附件等文件</span>
            </div>

            <div class="uploadList">
              <el-table :data="tableData" border>
                <el-table-column prop="originalFileName" label="名称" align="center"></el-table-column>
                <el-table-column prop="size" label="大小" align="center"></el-table-column>
                <el-table-column prop="uploadtime" align="center" label="上传时间"></el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      @click="handleDel(scope.row.id,scope.row.fileName)"
                      type="text"
                      size="small"
                    >删除</el-button>
                    <el-button @click="handleDown(scope.row)" type="text" size="small">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <!--关联内容-->
        <el-dialog
          title="关联合同"
          :visible.sync="relatedDialog"
          class="backgroundDialog relatedDialog"
        >
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
      </el-tabs>
    </div>
  </div>
</template>
<script>
import {getLabelAPI} from "@/api/resourcenew/picture";
import { getInfoAPI, updateAPI, addAPI, uploadFileListAPI, delFileListAPI } from "@/api/resource/courseware";
import { getTreeAPI , getCopyrightListAPI} from "@/api/resource/animation";
import { operationMsg, requestMsg, errorMsg, confirm,compareDate,getFileSize} from "@/utils/publicFunctions";
import { getNavAPI } from "@/api/book-infomation/goodsInfo";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import Tinymce from "@/components/Tinymce";
import customLabel from "@/components/customLabel";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import "@/styles/resource.scss";
import "@/styles/commonRe.css"
import pagination from "../components/pagination";
import { getAuthorsAPI } from "@/api/resource/ebook";
import {
  fileListAPI,
  files,
  getDepartmentAPI,
  getCopyrightListAPI2,
  sectionAPI
} from "@/api/resource/common";
export default {
  data() {
    return {
      authors:[],
      departmentList: [],
      rebackCourseware: false,
      hiddenViewButton: false,
      id: "",
      animationError: "",
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
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      treeSelectOptions: [],
      noDiy: false,
      canUseDate: false,
      total2: 30,
      relatedForm: {},
      relateList: [],
      checkedRelatedList: {},
      checkedRelated: false,
      relatedDialog: false,
      navTree: [],
      tokens: "", //附件
      uploadFileList: {
        oid: this.$route.query.id,
        token: ""
      },
      imageUrl: "",
      pageStatus: "",
      resourceForm: {
        author:'',
        courseware: "",
        bookName: "",
        contractName: "",
        contractNumber: "",
        dataSources: 0,
        department: "",
        departmentId: "",
        divLableId: [],
        diyTypeCode: [],
        diyTypeId: [],
        endDate: "",
        goosCode: "",
        cover: null,
        keywords: "",
        labelContentCode: [],
        labelContentId: [],
        name: "",
        price: "",
        priceType: 2,
        relatedContracts: "",
        salesStatus: 2,
        sellingPrice: "",
        source: "",
        startDate: "",
        synopsis: "",
        tabDefine1: [],
        tablist: []//6
      },
      rules: {
        diyTypeId: [
          { required: true, message: "请填写自定义分类", trigger: "input" }
        ], //trigger: "input"不能改
        name: [
          { required: true, message: "资源名称为必填", trigger: "blur" },
          { max: 50, trigger: "blur", message: "长度50个字以内" }
        ],
        author: [{ max: 10, message: "长度10字以内", trigger: "blur" }],
        bookName: [{ max: 80, message: "长度在80字以内", trigger: "blur" }],
        keywords: { max: 100, message: "长度100字以内", trigger: "blur" },
        source: [{ max: 30, message: "长度在30字以内", trigger: "blur" }],
        imageUrl: [
          { type: "array", required: true, message: "请上传动画封面" }
        ],
        departmentId: [
          { required: true, message: "所属部门为必选", trigger: "change" }
        ],
        type: [{ required: true, trigger: "blur" }],
        price:[{pattern:/^([0-9]{0,5})(.[0-9]{0,2})?$/,message:'请输入0-99999之间的数字，最多保留两位'}],
        text: [{ required: true, message: "未填写", trigger: "blur" }],
        dataSources:[{required:true,message:'未填写',trigger:'blur'}],
        salesStatus:[{required:true,message:'未选择',trigger:'change'}],
        sellingPrice:[{required:true,trigger:'blur'},{pattern:/^([0-9]{0,5})(.[0-9]{0,2})?$/,message:'请输入0-99999之间的数字，最多保留两位'}],
        file: [{ required: true}],
        goosCode:[{max:20,message:'长度20字以内',trigger:'blur'}],
        contractNumber:[{max:20,message:'长度20字以内',trigger:'blur'}],
        contractName:[{max:50,message:'长度50字以内',trigger:'blur'}],
      },
      dialogStatus: "",
      textMap: {
        update: "修改课件信息",
        add: "添加课件信息"
      },
      uploading: false,
      activeName: "first",
      tableData: [],
      recordData: [],
      total: 30,
      //自定义标签
      labelList:[],
      defaultValue: [], //默认分类
      labelReback: []
    };
  },
  methods: {
    //作者列表
    getAuthors() {
      getAuthorsAPI().then(res => {
        if (res.data.status) {
          this.authors = res.data.data;
        }
      });
    },
    //选择作者
    changeName() {
      this.resourceForm.authorId = this.resourceForm.author.id;
      this.resourceForm.author = this.resourceForm.author.name;
    },
    // 获取用户部门
    gainSection() {
      sectionAPI().then(res => {
        this.resourceForm.department = res.data.data.deptList[0].deptName;
      });
    },

    getDepartmentList() {
      getDepartmentAPI().then(res => {
        this.departmentList = res.data.data;
      });
    },
    //校验自定义分类
    selfChoose(val) {
      this.$refs.ruleForm.validateField("diyTypeId");
    },
    selectFun(node) {
      this.resourceForm.diyTypeCode = [];
      if (node.code != null || node.code != "") {
        this.resourceForm.diyTypeCode.push(node.code);
      }

      this.resourceForm.diyTypeId = [];
      if (node.id != null || node.id != "") {
        this.resourceForm.diyTypeId.push(node.id);
      }
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
      getCopyrightListAPI2(this.relatedForm).then(res => {
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
        this.resourceForm.contractNumber = this.checkedRelatedList.identifier;
        this.resourceForm.contractName = this.checkedRelatedList.name;
        this.checkedRelated = true;
        this.relatedDialog = false;
      }else{
        this.$message.warning('请选择一条合同')
      }
      
    },
    cancelRelated() {
      this.checkedRelatedList = [];
      if (!this.resourceForm.contractNumber) {
        this.resourceForm.contractNumber = "";
        this.resourceForm.contractName = "";
        this.checkedRelated = false;
      } else {
        this.checkedRelated = true;
      }
      this.relatedDialog = false;
    },
    handleFilter() {
      this.getRelatedList();
    },
    isEdit() {
      this.$route.meta.title = "添加课件";
      const id = this.$route.query.id;
      if (this.$route.query.type == "update") {
        this.$route.meta.title = "修改课件";
        this.getInfo(id);
      } else if (this.$route.query.type == "view") {
        this.pageStatus = 1;
        this.$route.meta.title = "查看课件";
        this.getInfo(id);
      }
    },
    // 下一步
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
       //自定义标签//11
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
      this.resourceForm.labelId = labelId;
      this.resourceForm.labelContentCode = labelContentCode;
      this.resourceForm.labelContentId = labelContentId;
        if(this.resourceForm.name == ''){
          this.$message.warning('请填写资源名称')
          return;
        }
        if(this.resourceForm.diyTypeId.length<1){
            this.$message.warning('请选则自定义分类')
            return ;
        }   
        if(this.resourceForm.diyTypeId.length<=1){ 
            this.noDiy = true;
            return ;
        }
        if (!this.canUseDate) {
          this.canUseDate = true;
          return;
        } else {
          this.canUseDate = false;
        }
        if(this.resourceForm.startDate&&this.resourceForm.endDate){
          if(!compareDate(this.resourceForm.startDate,this.resourceForm.endDate)){
              this.$message.warning('开始时间不可以大于结束时间'); 
              return
          }
        }
        if (valid) {
          //必填字段
          const id = this.$route.query.id; //修改id
          if (id) {
            //修改
            updateAPI(this.resourceForm).then(res => {
              if (res.data.status) {
                this.$message.success("修改成功");
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
                this.$router.push({ path: "/resource/article" });
                this.$router.go(-1);
              } else {
                this.$message.error("添加失败"); 
              }
            });
          }
          console.log(JSON.stringify(this.resourceForm))
        } else {
          this.$message.warning("有未通过的验证");
        }
      });
      this.$validator.validateAll().then(result => {
        if (result) {
          this.dialogStatus === "add"
            ? this.invokeAPI(addAPI, this.resourceForm)
            : this.invokeAPI(updateAPI, this.resourceForm);
          return;
        } else {
          this.$message.warning("有未通过的验证");
        } 
      });
    },
    transformDateType(date) {
      // return new Date(date.replace(/-/g,'/')).getTime()
    },
    getNav() {
      getNavAPI().then(res => {
        res.data.code === 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
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
      getTreeAPI(9).then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },
    //保存
    invokeAPI(api, data) {
      //添加、修改调接口
      api(data).then(res => {
        if (res.data.status) {
          this.$message.success(`${this.textMap[this.dialogStatus]}成功`);
          this.activeName = "second";
          this.$router.go(-1)
        } 
        // else {
          // errorMsg.apply(this, [res.data, this.textMap[this.dialogStatus]]);
        // }
      });
    },

    handleClick() {},
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
    goback() {
      // this.$router.go(-1);
    },
    fininsh() {},
    handleInfo() {},
    pagesizeFun() {},
    currentPageFun() {},
    handleDown() {},
    /*上传原始文件 */
    handleFPreview(file) {},
    handleFRemove(file, fileList) {},
    beforeFUpload(file) {},
    handleFSuccess(res, file, fileList) {
      this.uploadFileList.token = res;
      this.getUploadFileList();
    },
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
    /* 上传合同*/
    handleFilePreview(file) {},
    handleFileRemove(file, fileList) {},
    beforeFileUpload(file) {},
    handleFileSuccess(res, file, fileList) {
      this.resourceForm.relatedContracts = res;
    },

    // 上传文件
    handlefilePreview(file) {},
    handlefileRemove(file, fileList) {},
    beforefileUpload(file) {},
    handlefileSuccess(res, file, fileList) {
      this.rebackCourseware = false;
      this.resourceForm.courseware = file.name;
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
      this.resourceForm.cover = res;
    },
    //原始文件列表
    getFileList() {},
    getInfo(id) {
      getInfoAPI(id).then(res => {
        if (res.data.code === 0) {
          //处理标签回显//7
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
          this.getLabel()
          this.resourceForm = res.data.data;
          this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${
            this.resourceForm.cover
          }&isOnLine=true`;
          this.tokens = res.data.data.attachmentList;
          this.getFiles();
          if (res.data.data.diyTypeId.length > 0) {
            this.noDiy = false;
          }
          if (
            res.data.data.diyTypeId == null ||
            res.data.data.diyTypeId == "null"
          ) {
            this.resourceForm.diyTypeCode = [];
            this.resourceForm.diyTypeId = [];
          }
        } else {
          this.$message.error(`获取数据失败`);
        }
      });
    },
     //自定义标签//8
    getnewLabel() {
      getLabelAPI(9).then(res => {
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
    // 自定义标签//8
    getLabel() {
      getLabelAPI(9).then(res => {
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
    }
  },
  created() {
    this.dialogStatus = this.$route.query.type;
    // this.$route.meta.title = this.changeTitle()+'课件';
  },
  mounted() {
    this.isEdit();
    this.getTree();
    this.hiddenView();
    this.rebackCourseware = true;
    if(this.dialogStatus == 'add'){
      //this.gainSection();
      this.getnewLabel()
    }
    this.getDepartmentList();
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
  margin-top: 300px;
  width: 100%;
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
/* .addImgResource .el-button {
  background: #409eff;
  border-color: #409eff;
  border-radius: 5px;
  color: #fff;
} */
./* .addImgResource button.cancel{
  background: #fff;
  color: #409eff;
} */ {
  background: #fff;
  color: #409eff;
}
.animation-error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding: 4px 0;
  margin: 0;
}
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
.addImgResource .el-form-item.width360 .el-input,
.addImgResource .el-form-item.width360 .el-textarea,
.addImgResource .el-form-item.width360 .el-date-editor {
  width: 360px;
}
.addImgResource .el-form-item.width460 .el-input,
.addImgResource .el-form-item.width460 .el-textarea {
  width: 460px;
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
.relatedResource .el-form-item,
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
</style>

