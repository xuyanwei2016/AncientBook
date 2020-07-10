<template>
  <div class="addImgResource">
    <div class="formbox">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="资源信息" name="first">
          <div class="tabwrapper">
            <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
            <el-form :model="imgForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :rules="rules">
              <el-form-item prop="name" label="法规标题:" class="width360">
                <el-input
                  v-model="imgForm.name"                  
                  data-vv-as="field"
                  name="name"
                  :disabled="this.dialogStatus === 'view'"
                ></el-input>
              </el-form-item>
              <el-form-item label="发布机关:" prop="issuingOrgan" class="width360">
                <el-input v-model="imgForm.issuingOrgan" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item label="发布文号:" prop="issuingNum" class="width360">
                <el-input v-model="imgForm.issuingNum" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item prop="issuingTime" label="发布日期:" class="width360">
                <el-date-picker
                  type="date"
                  placeholder="发布日期"
                  v-model="imgForm.issuingTime"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                  v-validate="'required'"
                  data-vv-scope="baseInfo"
                  name="issuingTime"
                  :disabled="this.dialogStatus === 'view'"
                ></el-date-picker>
              </el-form-item>
              <el-form-item prop="implementTime" label="实施日期:" class="width360">
                <el-date-picker
                  type="date"
                  placeholder="实施日期"
                  v-model="imgForm.implementTime"
                  style="width: 100%;"
                  value-format="yyyy-MM-dd"
                  v-validate="'required'"
                  data-vv-scope="baseInfo"
                  name="implementTime"
                  :disabled="this.dialogStatus === 'view'"
                ></el-date-picker>
                <p class="animation-error"  v-if="canUseDate">请输入有效的时间段</p>
              </el-form-item>             
              <el-form-item label="时效:" prop="aging" class="width360">
                <el-input v-model="imgForm.aging" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item prop="publisher" label="出版单位:" class="width360"><!--//1-->
                <!-- <el-select
                  v-model="imgForm.publisher"
                  filterable
                  allow-create
                  default-first-option
                  placeholder="点击关联出版单位或手动输入">
                  <el-option
                    v-for="item in puboptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> -->
                <el-input  v-model="imgForm.publisher" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item prop="departmentId" label="所属部门:" class="width360">
                <el-select
                  v-model="imgForm.departmentId"
                  placeholder="所属部门"
                  name="department"
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
              <el-form-item label="关键词:" prop="keyword" class="width360">
                <el-input v-model="imgForm.keyword" :disabled="this.dialogStatus === 'view'" placeholder="多个关键词用逗号隔开"></el-input>
              </el-form-item>
              <el-form-item  prop="diyTypeId"   label="自定义分类:">
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
                  @input="selfChoose"
                  @select="selectFun"
                  @deselect="deselectFun"
                  :disabled="this.dialogStatus === 'view'"
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
                      :tabDefine="imgForm.tablist"
                      :dialogStatus="dialogStatus"
                    ></customLabel>
                  </el-form-item>
                </li>
              </ul>
              <el-form-item label="正文:" prop="text" class="content">
                <tinymce :height="300" ref="editor" @input="contentChage" v-model="imgForm.text"></tinymce>
              </el-form-item>
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;资源内容</h6>
              <div class="resource_content" style="margin-left: 120px;">
                <span class="tip">请上传资源的阅读文件，至少上传一种文件</span>
                <el-form-item label="PDF成品文件:" label-width="150px">
                <el-radio-group v-model="imgForm.pdfResourceType" :disabled="this.dialogStatus === 'view'" @change="changePDF">
                  <el-radio :label="1">上传PDF资源</el-radio>
                  <el-radio :label="2">绑定已有PDF资源</el-radio>
                </el-radio-group>
                <a class="el-upload-list__item-name" v-if="rebackpdf&&imgForm.pdfName"><i class="el-icon-document"></i>{{imgForm.pdfName}}</a>
                <el-upload
                  v-if="imgForm.pdfResourceType=='1'"
                  class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :before-upload="beforePDFUpload"
                  :on-success="handlePDFSuccess"
                  :limit="1"
                  :on-remove="handlePDFRemove"
                  accept="application/pdf"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-button size="small" type="primary" v-if='hiddenViewButton'>点击上传</el-button>
                </el-upload>
                <div  v-if="imgForm.pdfResourceType==2">
                  <el-button size="small" type="primary" @click="choosePdf('pdf')" v-if='hiddenViewButton'>选择文件</el-button>
                </div> 
              </el-form-item>
              <el-form-item label="视频成品文件:" label-width="150px">
                <el-radio-group v-model="imgForm.videoResourceType" :disabled="this.dialogStatus === 'view'" @change="changeVideo">
                  <el-radio :label="1">上传视频资源</el-radio>
                  <el-radio :label="2">绑定已有视频资源</el-radio>
                </el-radio-group>
                <a class="el-upload-list__item-name" v-if="rebackvideo&&imgForm.videoName"><i class="el-icon-document"></i>{{imgForm.videoName}}</a>
                <el-upload
                  v-if="imgForm.videoResourceType=='1'"
                  class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :before-upload="beforeVideoUpload"
                  :on-success="handleVideoSuccess"
                  :on-preview="handleVideoPreview"
                  :on-remove="handleVideoRemove"
                  accept="video/mp4"
                  :limit="1"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-button size="small" type="primary" v-if='hiddenViewButton'>点击上传</el-button>
                  
                </el-upload>
                <div  v-if="imgForm.videoResourceType==2">
                  <el-button size="small" type="primary" @click="chooseVideo('video')" v-if='hiddenViewButton'>选择文件</el-button>
                </div>
              </el-form-item>
              <el-form-item label="音频成品文件:" label-width="150px">
                <el-radio-group v-model="imgForm.audioResourceType" :disabled="this.dialogStatus === 'view'" @change="changeAudio">
                  <el-radio :label="1">上传音频资源</el-radio>
                  <el-radio :label="2">绑定已有音频资源</el-radio>
                </el-radio-group>
                <a class="el-upload-list__item-name" v-if="rebackaudio&&imgForm.audioName"><i class="el-icon-document"></i>{{imgForm.audioName}}</a>
                <el-upload
                  v-if="imgForm.audioResourceType=='1'"
                  class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :before-upload="beforeAudioUpload"
                  :on-success="handleAudioSuccess"
                  :on-preview="handleAudioPreview"
                  :on-remove="handleAudioRemove"
                  accept="audio/*"
                  :limit="1"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-button size="small" type="primary" v-if='hiddenViewButton'>点击上传</el-button>
                </el-upload>
                <div v-if="imgForm.audioResourceType==2">
                  <el-button size="small" type="primary" @click="chooseAudio('audio')" v-if='hiddenViewButton'>选择文件</el-button>
                </div>
              </el-form-item>
              </div>
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;商品信息</h6>
               <el-form-item label="商品编号:" prop="goosCode" class="width100%">
                <el-input v-model="imgForm.goosCode" style='width:230px;'></el-input>
                <span class="recomment">可用来保存资源的旧编码</span>
              </el-form-item>
              <el-form-item label="数据来源:"  prop="dataSources">
                
                  <el-radio :disabled="this.dialogStatus === 'view'" v-model="imgForm.dataSources" :label="0">本版</el-radio>
                  <el-radio :disabled="this.dialogStatus === 'view'" v-model="imgForm.dataSources" :label="1">外版</el-radio>
              </el-form-item>
              <!-- <el-form-item label="相关合同:" prop="agreement" class="width360">
                <el-button @click="getRelatedList" size="small" v-if='hiddenViewButton'>选择合同</el-button>
                <span style="color:#a2adbd">可手动添加合同信息或者选择合同库文件</span>
              </el-form-item>
              <el-form-item :prop="imgForm.dataSources==1?'contractNumber':'hh'" >
                <el-input
                  style="width:325px "
                  :disabled="checkedRelated"
                  v-model="imgForm.contractNumber"
                  placeholder="合同编号"
                ></el-input>
              </el-form-item>
              <el-form-item :prop="imgForm.dataSources==1?'contractName':'hh'">
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
                 <p class="animation-error" style="margin-top:40px;" v-if="canUseDate2">请输入有效的时间段</p> 
              </el-form-item> -->
            </el-form>
            <div class="btncenter"> 
                <el-button type="primary" @click="onSubmit('ruleForm')" v-if="dialogStatus !== 'view'">保存</el-button>
                <el-button @click="$router.go(-1)" class="cancel">取消</el-button>
            </div>
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
                  <el-button size="small" type="primary" v-if='hiddenViewButton' class="mag-bot-15">
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
                      <el-button @click="handleDel(scope.row.id,scope.row.fileName)"  v-if="dialogStatus!='view'" type="text" size="small">删除</el-button>
                      <el-button @click="handleDown(scope.row.fileName)" type="text" size="small">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- <div class="btncenter">
                  <el-button @click="goback">上一步,填写资源信息</el-button>
                  <el-button @click="fininsh">完成,提交内容</el-button>
                </div> -->
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
        <el-dialog
          title="相关资源列表"
          :visible.sync="dialogPDFVisible"
          width="80%"
          :before-close="handlePDFClose">
          <el-form ref="form" label-width="82px" inline class="formlist">
              <!-- <el-form-item label="资源类型"  style="margin-right:20px">
                <el-select  readonly="true" v-model="listPDFQuery.resourceType" placeholder="全部">
                  <el-option label="全部" value=""></el-option>
                  <el-option v-for="(value,key) in typeList" :key="key"
                  :label="value" :value="key" 
                  >{{value}}</el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="资源名称:" >
                <el-input v-model="listPDFQuery.name"></el-input>
              </el-form-item>
              <el-form-item class="width90" style="margin-right:20px;">
                <el-button type="primary" @click="onpdfSubmit" class="search" icon="el-icon-search">检索</el-button>
              </el-form-item>
            </el-form>
            <el-table
              height="400"
              border
              v-loading="listpdfLoading"
              element-loading-text="给我一点时间"
              ref="multipleTable1"
              :data="pdfList"
              tooltip-effect="dark"
              @selection-change="handlepdfSelectionChange"
            >
              <el-table-column type="index" align="center"></el-table-column>
              <el-table-column type="selection" align="center"></el-table-column>

              <el-table-column label="资源名称" align="center">
                <template slot-scope="scope">{{scope.row.name}}</template>
              </el-table-column>
              
              <el-table-column label="上传时间" align="center">
                <template slot-scope="scope">{{scope.row.uploadTime}}</template>
              </el-table-column>
            
            
            </el-table>
            <div style="background:#393f5b" class="dialog_prfooter">
                <pagination @pagesize="pagesizeFun1" :total="pdftotal" @currentPage="currentPageFun1"></pagination>
            </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm">确 定</el-button>
            <el-button @click="dialogPDFVisible = false;listPDFQuery.name=''">取 消</el-button>
          </span>
        </el-dialog>
        <!--关联内容-->
        <el-dialog title="关联合同" :visible.sync="relatedDialog" class="backgroundDialog relatedDialog">
          <el-form :model="relatedForm" label-width="120" style='margin-bottom:5px;' class='relatedFormInput'>
            <el-form-item label="合同编号">
              <el-input v-model="relatedForm.identifier" clearable></el-input>
            </el-form-item>
            <el-form-item label="合同名称">
              <el-input v-model="relatedForm.name" clearable></el-input>
            </el-form-item>
            <el-button type="primary" @click="handleFilter">检索</el-button>
          </el-form>
          <el-table border ref="multipleTable2" :data="relateList" tooltip-effect="dark" style="background:#ccc;">
            <el-table-column align="center" width="50">
              <template slot-scope="scope">
                <el-radio v-model="checkedRelatedList" :label="scope.row">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="合同名称" align="center" width='180'></el-table-column>
            <el-table-column prop="identifier" label="合同编号" align="center" width='180'></el-table-column>
            <el-table-column prop="signingTime" label="签订时间" align="center" width='180'></el-table-column>
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
import {
  saveAPI,
  uploadFileListAPI,
  detailsAPI,
  editAPI,
  getTreeAPI,
  delFileListAPI,
  getRelatedListAPI
} from "@/api/resource/statute";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm ,
  compareDate,
  getFileSize
} from "@/utils/publicFunctions";
import {
  files,
  getDepartmentAPI,
  getTypeAPI,
  getCopyrightListAPI,
  fileListAPI,
  sectionAPI
} from "@/api/resource/common";
import { getNavAPI } from "@/api/book-infomation/goodsInfo";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import Tinymce from "@/components/Tinymce";
import customLabel from "@/components/customLabel";
import "@/styles/resource.scss";
import "@/styles/commonRe.css"
import pagination from "../components/pagination";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {getListAPI} from "@/api/business/publish";  
export default {
  name: "statute_create",
  data() {
    return {
      puboptions: [],  
      dialogPDFVisible:false,
      hiddenViewButton: true,
      rebackpdf: false,
      rebackaudio: false,
      rebackvideo: false,
      typeList:[],
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
      loadAnimation: false,
      tokens: "", //附件
      uploadFileList: {
        oid: this.$route.query.id,
        token: ""
      },
      treeSelectValue: null,
      treeSelectOptions: [],
      navTree: [],
      imageUrl: "",
      animationUrl: "",
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      imgForm: {
        videoName: "",
        pdfName: "",
        audioName: "",
        pdfResourceType: "",
        videoResourceType: "",
        videoResourceType: "",
        tablist: "",
        tab: "",
        issuingOrgan: "",
        issuingNum: "",
        issuingTime: "",
        implementTime: "",
        publisher: "",
        keyword: "",
        treeSelectValue: "",
        pdf: "",
        // "id":this.$route.query.id,
        author: "",
        bookId: null,
        bookName: "",
        contractName: "",
        contractNumber: "",
        dataSources: 0,
        department: "",
        departmentId: null,
        labelId: null,
        diyTypeCode: [],
        diyTypeId: [],
        endDate: "",
        goosCode: "",
        keywords: "",
        labelContentDivTypeCode: null,
        labelContentDivTypeId: null,
        name: "",
        price: 0,
        relatedContracts: "",
        size: "",
        source: "",
        startDate: "",
        status: 0,
        synopsis: "",
        text: "",
        timeLength: "",
        animation: "",
        cover: "",
        tabDefine1: [],
        tablist: []
      },
      dialogStatus: "",
      textMap: {
        update: "修改法规信息",
        add: "添加法规信息"
      },
      uploading: false,
      activeName: "first",
      tableData: [],
      recordData: [],
      pdfList:[],
      audioList:[],
      videoList:[],
      pdftotal: null,
      listpdfLoading:true,
      listPDFQuery:{
        pageNum: 1,
        pageSize: 50
      },
      rules: {
        name: [
          { required: true, message: "请输入法规标题" },
          { max: 80,  message: "法规标题长度必须80字以内" }
        ],
        issuingOrgan: [
          { required: true, message: "请输入发布机关" },
          { max: 50,  message: "发布机关长度必须50字以内" }
        ],
        issuingNum: [
          { required: true, message: "请输入发布文号" },
          { max: 30,  message: "发布文号长度必须30字以内" }
        ],
        issuingTime: { required: true, message: "请输入发布日期" },
        aging: { max: 10, message: "时效长度必须10字以内" },
        publisher: { max: 30, message: "出版单位长度必须30字以内" },
        keyword: {
          max: 100,
          message: "关键词长度必须100字以内",
          trigger: "blur"
        },
        text: [{ required: true, message: "请输入正文", trigger: "blur" }],
        departmentId: { required: true, message: "请选择所属部门" },
        imageUrl: { type: "array", required: true, message: "请上传动画封面" },
        goosCode: { max: 20, message: "商品编号长度必须20字以内" },
        dataSources: { required: true, message: "请输入数据来源" },
        contractNumber: {required:true,max: 20, message: "合同编号长度必须20字以内" },
        contractName: { required:true,max: 50, message: "合同名称长度必须50字以内" },
        diyTypeId: [
          { required: true, message: "请填写自定义分类", trigger: "input" }
        ], //trigger: "input"不能改

      },
      animationError: false,
      noDiy: false,
      queryList: {
        pageSize: 50,
        pageNum: 1,
        resourceId: this.$route.query.id
      },
      canUseDate: false,
      canUseDate2: false,
      //自定义标签
      labelList:[],
      defaultValue: [], //默认分类
      labelReback: []
    };
  },
  methods: {
    contentChage(val){
      if(val.length>0){
        this.$refs['ruleForm'].clearValidate('text')
      }
    },
     //获取出版单位列表   
    getList() {
      getListAPI("").then(res => {
        if (res.data.code === 0) {
          this.puboptions=[]      //清空    
          if(res.data.data){
            res.data.data.list.forEach( ele => {
              let obj={};
              obj.label=ele.name;
              obj.value=ele.name;
              this.puboptions.push(obj)
            })
          }
        } else {
          this.$message.error("获取数据失败");
        }
      });
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
    onpdfSubmit(){
      this.getPDFList();
    },
    handlepdfSelectionChange(val){  
      this.selectList=val
    },
    /*上传pdf */
    handlePDFPreview(file) {},
    handlePDFRemove(file, fileList) {},
    beforePDFUpload(file) {},
    handlePDFSuccess(res, file, fileList) {
      this.rebackpdf = false;
      this.imgForm.pdfName = "";
      this.imgForm.pdf = "";
      this.imgForm.pdfName = file.name;
      this.imgForm.pdf = file.response;
    },
    /*上传视频 */
    handleVideoPreview(file) {},
    handleVideoRemove(file, fileList) {},
    beforeVideoUpload(file) {},
    handleVideoSuccess(res, file, fileList) {
      this.rebackvideo = false;
      this.imgForm.videoName = "";
      this.imgForm.video = "";
      this.imgForm.videoName = file.name;
      this.imgForm.video = res;
    },
    /*上传音频 */
    handleAudioPreview(file) {},
    handleAudioRemove(file, fileList) {},
    beforeAudioUpload(file) {},
    handleAudioSuccess(res, file, fileList) {
      this.rebackaudio = false;
      this.imgForm.audioName = "";
      this.imgForm.audio = "";
      this.imgForm.audio = res;
      this.imgForm.audioName = file.name;
    },
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
    //提交选择的资源
    confirm() {
      if (this.selectList.length == 1) {
        if (this.chooseFile == "pdf") {
          this.imgForm.pdf = this.selectList[0].id;
          this.imgForm.pdfName = this.selectList[0].name;
        }
        if (this.chooseFile == "audio") {
          this.imgForm.audio = this.selectList[0].id;
          this.imgForm.audioName = this.selectList[0].name;
        }
        if (this.chooseFile == "video") {
          this.imgForm.video = this.selectList[0].id;
          this.imgForm.videoName = this.selectList[0].name;
        }

        this.dialogPDFVisible = false;
      } else if (this.selectList.length == 0) {
        this.$message.warning("至少选择一条");
      } else {
        this.$message.warning("仅可以选择一条");
      }
    },
    //选择pdf文件
    choosePdf() {
      this.pdfList.pdfName = "";
      
      this.dialogPDFVisible = true;
      this.listPDFQuery.resourceType = "15";
      this.getType();
      this.getPDFList();
      this.chooseFile = "pdf";
    },
    handlePDFClose() {
      this.dialogPDFVisible = false;
    },
    //选择视频文件
    chooseVideo() {
      this.videoList.videoName = "";
      this.dialogPDFVisible = true;
      this.listPDFQuery.resourceType = "6";
      this.getType();
      this.getPDFList();
      this.chooseFile = "video";
    },
    //选择音频文件
    chooseAudio() {
      
      this.audioList.audioName = "";
      this.dialogPDFVisible = true;
      this.listPDFQuery.resourceType = "7";
      this.getType();
      this.getPDFList();
      this.chooseFile = "audio";
    },
    getPDFList() {
      this.listpdfLoading = true;
     getRelatedListAPI(this.listPDFQuery).then(res => {
        if (res.data.code == 0) {
          this.pdfList = res.data.data.list;
          this.pdftotal = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.listpdfLoading = false;
      });
    },
    changePDF() {},
    changeVideo() {},
    changeAudio() {},
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
        this.imgForm.relatedContracts = this.checkedRelatedList.id;
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
        this.imgForm.relatedContracts = "";
        this.checkedRelated = false;
      } else {
        this.checkedRelated = true;
      }
      this.relatedDialog = false;
    },
    handleFilter() {
      this.getRelatedList();
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
    getTree() {
      getTreeAPI(10).then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },
    // 下一步
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
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
        if(this.imgForm.name==''){
          this.$message.warning('请输入法规标题')
          return
        }
        if(this.imgForm.issuingOrgan==''){
          this.$message.warning('请输入发布机关')
          return
        }
        if(this.imgForm.issuingNum==''){
          this.$message.warning('请输入发布文号')
          return
        }
        if(this.imgForm.issuingTime==''){
          this.$message.warning('请输入发布日期')
          return
        }
        if(this.imgForm.text==''){
          this.$message.warning('请输入正文')
          return
        }
        if(this.imgForm.text.length>20000){
          this.$message.warning('请输入正文少于2万')
          return
        }
        if (this.imgForm.diyTypeId.length < 1) {
          this.$message.warning("请选则自定义分类");
          return;
        }
        if (this.canUseDate) {
          return;
        }
        if (this.canUseDate2) {
          return;
        }
        if (valid) {
          if(this.imgForm.startDate&&this.imgForm.endDate){
              if(!compareDate(this.imgForm.startDate,this.imgForm.endDate)){
                  this.$message.warning('开始时间不可以大于结束时间'); 
                  return
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
    transformDateType(date) {
      if (date != null) {
        return new Date(date.replace(/-/g, "/")).getTime();
      }
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
    handleClick(tab, event) {
      if (tab.label == '附件') {
        //点击附件
        this.getFiles();
      } else if (tab.label == '操作记录') {
        //点击操作记录
        this.getResourceLog();
      }
    },

    goback() {
      this.activeName = "first";
    },
    fininsh() {},
    handleInfo() {},
    pagesizeFun(val) {
      this.queryList.pageSize = val;
      this.getResourceLog();
    },
    currentPageFun(val) {
      this.queryList.pageNum = val;
      this.getResourceLog();
    },
    pagesizeFun1(val) {
      this.listPDFQuery.pageSize = val;
      this.getPDFList();
    },
    currentPageFun1(val) {
      this.listPDFQuery.pageNum = val;
      this.getPDFList();
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
    // handleVideoPreview(file) {},
    // handleVideoRemove(file, fileList) {},
    // beforeVideoUpload(file) {
    //   this.loadAnimation = true;
    //   const isVideo =
    //     file.type === "video/avi" ||
    //     file.type === "video/wmv" ||
    //     file.type === "video/rmvb" ||
    //     file.type === "video/mp4" ||
    //     file.type === "video/mov" ||
    //     file.type === "video/flv";
    //   const isLt2G = file.size / 1024 / 2;
    //   if (!isVideo) {
    //     this.$message.error("视频只支持AVI、WMV、RMVB、MP4、MOV、FLV!");
    //     return isVideo;
    //   }
    //   if (!isLt2G) {
    //     this.$message.error("上传视频大小不能超过 2G!");
    //     return isLt2G;
    //   }
    // },
    // handleVideoSuccess(res, file, fileList) {
    //   this.animationUrl = `${this.domain}${this.requestPath.file}?fileName=${
    //     res.fileName
    //   }&isOnLine=true`;
    //   this.imgForm.animation = res.fileName;
    //   this.animationError = false;
    //   this.loadAnimation = false;
    // },
    //原始文件列表
    getInfo() {
      detailsAPI(this.$route.query.id).then(res => {
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
          this.imgForm = res.data.data;
          this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${
            this.imgForm.cover
          }&isOnLine=true`;
          this.animationUrl = `${this.domain}${
            this.requestPath.file
          }?fileName=${this.imgForm.animation}&isOnLine=true`;
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
    //自定义标签//8
    getnewLabel() {
      getLabelAPI(10).then(res => {
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
      getLabelAPI(10).then(res => {
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
    },
    //获取操作记录
    getResourceLog() {
      fileListAPI(this.queryList).then(res => {
        if (res.data.code==0) {
          this.recordData = res.data.data.list;
          this.total=res.data.data.total
        }
      });
    },
    getType(){
      getTypeAPI().then( res => {
        if(res.data.code==0){
          this.typeList=res.data.data

          console.log(this.typeList,"typeList")
        }
      })
    },
    handleRemoveAudio() {},
    changeTitle() {
      let title = "";
      switch (this.dialogStatus) {
        case "add":
          title = "添加";
          break;
        case "view":
          title = "查看";
          break;
        case "update":
          title = "修改";
      }
      return title;
    }
  },
  created() {
    this.dialogStatus = this.$route.query.type;
    this.$route.meta.title = this.changeTitle() + "法规";
  },
  mounted() {
    //this.getNav();
    this.rebackpdf=true;
    this.rebackaudio=true;
    this.rebackvideo=true;
    this.hiddenView();
    this.$route.meta.title = "添加法规";
    if (this.dialogStatus === "view" || this.dialogStatus === "update") {
      if (this.dialogStatus === "view") {
        this.$route.meta.title = "查看法规";
      } else {
        this.$route.meta.title = "修改法规";
      }
      this.rebackpdf = true;
      this.rebackaudio = true;
      this.rebackvideo = true;
      this.getInfo();
    }
    this.getTree();
    this.getDepartmentList();
    if (this.dialogStatus === "add"){
      this.gainSection();
      this.getnewLabel()
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
} {
  background: #fff;
  color: #409eff;
}*/ 
.video {
  width: 443px;
  height: 334px;
}
.animation-error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding: 4px 0;
  margin: 0;
}
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
.audio {
  width: 443px;
  height: 50px;
}
.addImgResource .recordtable {
  position: relative;
}

.el-pagination button:disabled {
  background: none;
}

.el-form-item__label em {
  color: #f56c6c !important;
  font-size: 12px;
  margin-right: 4px;
}
.addImgResource .avatar {
  width: 146px;
  height: 146px;
  display: block;
  border-radius: 6px;
}
/* .addImgResource .el-form-item.width360 .el-input,
.addImgResource .el-form-item.width360 .el-textarea,
.addImgResource .el-form-item.width360 .el-date-editor {
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

