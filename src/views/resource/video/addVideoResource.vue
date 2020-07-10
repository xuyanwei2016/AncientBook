<template>
  <div class="addImgResource">
    <div class="formbox">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="资源信息" name="first">
          <div class="tabwrapper">
            <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
            <el-form
              :model="imgForm"
              ref="ruleForm"
              label-width="100px"
              :rules="rules"
              class="demo-ruleForm"
            >
              <el-form-item prop="name" label="资源名称:" class="width360">
                <el-input v-model="imgForm.name" :disabled="this.dialogStatus === 'view'" data-vv-as="field" name="name"></el-input>
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
              <el-form-item prop="bookName" label="所属图书:" class="width360">
                <el-input v-model="imgForm.bookName" :disabled="this.dialogStatus === 'view'" name="bookName"></el-input>
              </el-form-item>
              <el-form-item prop="source" label="来源:" class="width360">
                <el-input v-model="imgForm.source" :disabled="this.dialogStatus === 'view'" data-vv-as="field" name="source"></el-input>
              </el-form-item>
              <el-form-item prop="departmentId" label="所属部门:" class="width360">
                <el-select
                  v-model="imgForm.departmentId"
                  placeholder="所属部门"
                  data-vv-as="selected"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-option
                    v-for="item in departmentList"
                    :key="item.departmentId"
                    :label="item.departmentName"
                    :value="item.departmentId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="diyTypeId" label="自定义分类:">
                <treeselect
                  style="width:50%"
                  placeholder="请选择"
                  v-model="imgForm.diyTypeId"
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
              <el-form-item prop="cover" label="视频封面:" class="width100">
                <el-upload
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  list-type="picture-card"
                  :on-preview="handlePreview"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :disabled="this.dialogStatus === 'view'"
                  :on-remove="handleRemove"
                  :show-file-list="false"
                  accept=".jpg, .jpeg, .png, .gif, .png"

                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="简介:" prop="synopsis " class="synopsis">
                <tinymce :height="300" ref="editor" v-model="imgForm.synopsis"></tinymce>
              </el-form-item>
              <el-form-item label-width="150px" prop="video">
                <span slot="label">视频文件:</span>
                <p class="alert-info">支持AVI、WMV、RMVB、MP4、MOV、FLV等格式，不超过2G</p>
                <el-upload
                  class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}/video`"
                  :before-upload="beforeVideoUpload"
                  :on-success="handleVideoSuccess"
                  :on-preview="handleVideoPreview"
                  :on-remove="handleVideoRemove"
                  :show-file-list="false"
                  accept=".mp4, .avi, .wmv, .rmvb, .mov, .flv"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-button
                    size="small"
                    :loading="loadAnimation"
                    type="primary"
                    v-if="hiddenViewButton"
                  >点击上传</el-button>
                </el-upload>
                <video v-if="videoUrl" :src="videoUrl" controls class="video"></video>
                </el-form-item>
            <h6>&nbsp;&nbsp;|&nbsp;&nbsp;商品信息</h6>
            <el-form-item label="商品编码:" prop="goosCode" class="width325">
              <el-input :disabled="this.dialogStatus === 'view'" v-model="imgForm.goosCode"></el-input>
              <span class='recomment'>可用来保存资源的旧编码</span>
            </el-form-item>
            <el-form-item prop="dataSources" label="数据来源:">
              <el-radio-group :disabled="this.dialogStatus === 'view'" v-model="imgForm.dataSources">
                <el-radio :label="0">本版</el-radio>
                <el-radio :label="1">外版</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="salesStatus" label="销售状态:">
              <el-radio-group :disabled="this.dialogStatus === 'view'" v-model="imgForm.salesStatus">
                <el-radio :label="1">可售</el-radio>
                <el-radio :label="2">不可售</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="定价:" prop="price" class="width325">
              <el-input :disabled="this.dialogStatus === 'view'" v-model="imgForm.price"></el-input>元
              <span class='recomment'>在前台展示为划线价格</span>
            </el-form-item>
            <el-form-item label="售价:" prop="priceType">
              <el-radio-group :disabled="this.dialogStatus === 'view'" v-model="imgForm.priceType">
                <el-radio :label="1">付费</el-radio>
                <el-radio :label="2">免费</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="imgForm.priceType==1" prop="sellingPrice">
              <el-input :disabled="this.dialogStatus === 'view'" style="width:325px;" v-model="imgForm.sellingPrice"></el-input>
              <span>元</span>
            </el-form-item> 
            <el-form-item label="相关合同:" prop="agreement" class="width360">
                <el-button @click="getRelatedList" type="primary" size="small" v-if='hiddenViewButton'>选择合同</el-button>
                <span style="color:#a2adbd">可手动添加合同信息或者选择合同库文件</span>
              </el-form-item>
              <el-form-item prop="contractNumber">
                <el-input
                  style="width:325px "
                  :disabled="checkedRelated"
                  v-model="imgForm.contractNumber"
                  placeholder="合同编号"
                ></el-input>
              </el-form-item>
              <el-form-item prop="contractName">
                <el-input
                  style="width:325px"
                  :disabled="checkedRelated"
                  v-model="imgForm.contractName"
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
                    v-model="imgForm.startDate"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;"
                  ></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">至</el-col>
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="imgForm.endDate"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-col>
                <p class="animation-error" style="margin-top:40px;" v-if="canUseDate">请输入有效的时间段</p>
              </el-form-item>
              <!-- <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit"
                v-if="this.dialogStatus=='add'||this.dialogStatus=='update'"
              >保存</el-button>
              <el-button @click="$router.go(-1)">取消</el-button>
            </el-form-item>
              >下一步,上传原始文件</el-button>
              </el-form-item>-->
            </el-form>
            
          </div>
        </el-tab-pane>
        <el-tab-pane label="原始文件" name="fourth" v-if="dialogStatus!='add'">
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
                <el-table-column label="操作" align="center" >
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
        <!--//6-->
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
        <div class="btncenter">
          <el-button type="primary" @click="onSubmit('ruleForm')" v-if="dialogStatus !== 'view'">保存</el-button>
          <el-button @click="$router.go(-1)" class="cancel">取消</el-button>
        </div>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getLabelAPI } from "@/api/resourcenew/picture"; 
import {
  saveAPI,
  detailsAPI,
  editAPI,
  getTreeAPI,
  uploadFileListAPI,
  
  invokeAPI
} from "@/api/resource/video";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm,
  compareDate,
  getFileSize
} from "@/utils/publicFunctions";
import {
  files,
  getDepartmentAPI,
  getCopyrightListAPI,
  delFileListAPI,
  fileListAPI,
  sectionAPI
} from "@/api/resource/common";
import { getNavAPI } from "@/api/book-infomation/goodsInfo";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import Tinymce from "@/components/Tinymce";
import customLabel from "@/components/customLabel";
import imgDefault from "@/assets/img/bookDefault.png";
import "@/styles/resource.scss";
import "@/styles/commonRe.css"; 
import pagination from "../components/pagination";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getAuthorsAPI } from "@/api/resource/ebook";
export default {
  name: "add_video",
  data() {
    return {
      //2
      fileForm: {
        pageNum:1,
        pageSize:50
      },
      loadAnimation: false, 
      canUseDate: "",
      authors: [],
      hiddenViewButton: false,
      id: "",
      checkedRelatedList: {},
      relateList: [],
      relatedDialog: false,
      total: 0,
      total2: 30,
      relatedForm: {
        secondParty: "", //乙方
        identifier: "", //合同编号
        name: "" //合同名称
      },
      checkedRelated: false,
      departmentList: [],
      tokens: "", //附件
      uploadFileList: {
        oid: this.$route.query.id,
        token: ""
      },
      treeSelectValue: null,
      treeSelectOptions: [],
      navTree: [],
      imageUrl: "",
      imageUrl: imgDefault,
      videoUrl: "",
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      imgForm: {
        author: "",
        bookId: "",
        bookName: "",
        contractName: "",
        contractNumber: "",
        dataSources: 0,
        departmentId: "",
        labelId: [],
        diyTypeCode: [],
        diyTypeId: [],
        endDate: "",
        goosCode: "",
        keywords: "",
        labelContentCode: [],
        labelContentId: [],
        name: "",
        price: "",
        priceType: 1,
        relatedContracts: "",
        sellingPrice: null,
        size: "",
        source: "",
        owner: "",
        startDate: "",
        status: 0,
        synopsis: "",
        text: "",
        timeLength: "",
        video: "",
        cover: "",
        tabDefine1: [],
        tablist: [],
        salesStatus:1
      },
      rules: {
        name: [{ required: true, message: "请输入资源名称"},{max:80,message:'资源名称的长度不可以超过80'}],
        keywords:[{required:false,max:100,message:"关键词的长度不可以超过100"}],
         owner: [{ required: false,max:80,message:"所属图书长度不可以超过80"}],
         source:[{required: true,message:'请输入来源'},{ max:30,message:"来源长度不可以超过30"}],
         dataSources:[{required:true,message:'请输入数据来源'}],
        departmentId: [{ required: true, message: "请选择所属部门" }],
        video:[{required:true,message:'请上传视频文件'}],
        goosCode:[{required:false,message:'商品编码的长度不可以超过20',max:20}],
        contractNumber:[{required:false,message:'合同编号的长度不可以超过20'}],
        contractName:[{required:false,message:'合同名称的长度不可以超过50'}],
        sellingPrice: {
          pattern: /^\d{0,5}(\.\d{0,2})?$/,
          message: "请输入0-99999之间的数字，最多保留两位"
        },
        price:{
          pattern: /^\d{0,5}(\.\d{0,2})?$/,
          message: "请输入0-99999之间的数字，最多保留两位"
        },
        salesStatus: [{ required: true, message: "请选择销售状态" }],
        diyTypeId: [
          { required: true, message: "请填写自定义分类", trigger: "input" }
        ],
        bookName:[{
          required:false,
          message:'所属图书长度长度不超过80字',
          max:80
        }]
      },
      noDiy: false,
      dialogStatus: "",
      textMap: {
        update: "修改视频信息",
        add: "添加视频信息"
      },
      uploading: false,
      activeName: "first",
      tableData: [],
      recordData: [],
      
      //自定义标签
      labelList: [],
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
    // changeName() {
    //   this.imgForm.authorId = this.imgForm.author.id;
    //   this.imgForm.author = this.imgForm.author.name;
    // },
    //校验自定义分类
    selfChoose(val) {
      this.$refs.ruleForm.validateField("diyTypeId");
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
      //console.log(node,"delnode");
      for (var i = 0; i < this.imgForm.diyTypeId.length; i++) {
        if (this.imgForm.diyTypeId[i] == node.id) {
          this.imgForm.diyTypeId.splice(i, 1);
          this.imgForm.diyTypeCode.splice(i, 1);
        }
      }
       //console.log( this.typeform.diyTypeId," this.typeform.diyTypeId")
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
    //获取用户部门
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
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list
      };
    },
    selectFun(node) {
      this.noDiy = false;
      this.imgForm.diyTypeId.push(node.id);
      this.imgForm.diyTypeCode.push(node.code);
    },
    getTree() {
      getTreeAPI(6).then(res => {
        this.treeSelectOptions = res.data.data;
        console.log(this.treeSelectOptions,"treeSelectOptionstreeSelectOptionstreeSelectOptions")
      });
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
          this.noDiy = true;
          if (this.imgForm.startDate && this.imgForm.endDate) {
            if (!compareDate(this.imgForm.startDate, this.imgForm.endDate)) {
              this.$message.warning("开始时间不可以大于结束时间");
              return;
            }
          }
          this.dialogStatus === "add"
            ? this.invokeAPI(saveAPI, this.imgForm)
            : this.invokeAPI(editAPI, this.imgForm);
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
      //添加、修改调接口修改调接口
      api(data).then(res => {
        if (res.data.status) {
          this.$message.success(`${this.textMap[this.dialogStatus]}成功`);
          this.$router.go(-1);
          this.activeName = "second";
          this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${
            this.imgForm.cover
          }&isOnLine=true`;
        } else {
          errorMsg.apply(this, [res.data, this.textMap[this.dialogStatus]]);
        }
      });
    },
    handleClick(tab, event) {
      if (tab.label == '附件') {
        this.getFiles();
      }
    },

    goback() {
      this.activeName = "first";
    },
    fininsh() {},
    handleInfo() {},
    //4
     pagesizeFun(val) {
      this.fileForm.pageSize=val
      this.getFileList()
    },
    currentPageFun(val) {
      this.fileForm.pageNum=val
      this.getFileList()
    },
    //操作记录文件列表//3
    getFileList() {
      this.fileForm.resourceId=this.$route.query.id
      fileListAPI(this.fileForm).then(res => {
        if(res.data.code==0){
          this.recordData=res.data.data.list
          this.total=res.data.data.total
        }
      });
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
      this.imgForm.cover = res;
    },
    //上传视频
    handleVideoPreview(file) {},
    handleVideoRemove(file, fileList) {},
    beforeVideoUpload(file) {
      this.loadAnimation = true; 
      let isVideo = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
      if (isVideo!='mp4'&&isVideo!='avi'&&isVideo!='rmvb'&&isVideo!='wmv'&&isVideo!='wmv'&&isVideo!='mov'&&isVideo!='flv') {
        this.$message.error("视频只支持AVI、WMV、RMVB、MP4、MOV、FLV!");
        return false;
      }
      const isLt2G = file.size / 1024 / 2;
      if (!isLt2G) {
        this.loadAnimation = false; 
        this.$message.error("上传视频大小不能超过 2G!");
        return isLt2G;
      }
    },
    handleVideoSuccess(res, file, fileList) {
      this.videoUrl = `${this.domain}${this.requestPath.file}?fileName=${
        res.fileName
      }&isOnLine=true`;
      this.imgForm.video = res.fileName;
      this.imgForm.size=res.size
      this.imgForm.timeLength=res.time
      this.loadAnimation = false; 
      this.$refs['ruleForm'].clearValidate('video')
    },

    //查看和修改详情信息
    getInfo() {
      detailsAPI(this.$route.query.id).then(res => {
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
          this.tokens = res.data.data.attachmentList;
          this.treeSelectValue = res.data.data.diyTypeId;
          if (this.imgForm.video) {
            this.videoUrl = `${this.domain}${this.requestPath.file}?fileName=${
              this.imgForm.video
            }&isOnLine=true`;
          }
          if (this.imgForm.cover) {
            this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${
              this.imgForm.cover
            }&isOnLine=true`;
          }

          if (
            res.data.data.diyTypeId == null ||
            res.data.data.diyTypeId == "null"
          ) {
            this.imgForm.diyTypeId = [];
            this.imgForm.diyTypeCode = [];
          }
        } else {
          this.$message.error(`获取套餐数据失败`);
        }
        //详情页面清除校验
        if(this.dialogStatus=='view'){
          this.$refs['ruleForm'].resetFields()
        }
      });
    },
    //自定义标签
    getnewLabel() {
      getLabelAPI(6).then(res => {
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
    // 自定义标签
    getLabel() {
      getLabelAPI(6).then(res => {
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
          if (this.dialogStatus == "view") {
            for (let n = 0; n < this.defaultValue.length; n++) {
              if (this.defaultValue[n].labelMessage.length == 0) {
                this.labelList.splice(n, 1);
                this.defaultValue.splice(n, 1);
                n--;
              }
            }
          }
        }
      });
    }
  },
  created() {
    this.dialogStatus = this.$route.query.type;
  },
  mounted() {
    //this.getNav();
    if (this.dialogStatus === "view" || this.dialogStatus === "update") {
      this.getInfo();
      this.getFileList();//5
    }
    this.getTree();
    this.getDepartmentList();
    this.hiddenView();
    this.getAuthors();
    
    if (this.dialogStatus == "view") {
      this.$route.meta.title = "查看视频";
    }
    if (this.dialogStatus == "update") {
      this.$route.meta.title = "修改视频";
    }
    if (this.dialogStatus == "add") {
      this.$route.meta.title = "添加视频";
      this.getnewLabel()
      this.gainSection();
    }
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
.addImgResource .el-form-item.synopsis {
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
.video {
  width: 443px;
  height: 334px;
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
  width: 144px;
  height: 146px;
  display: block;
  border-radius: 6px;
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
.addImgResource .el-form-item.width360 .el-select{
  width: 100%;
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
.recomment {
  color: #a1abbc !important;
}
</style>

