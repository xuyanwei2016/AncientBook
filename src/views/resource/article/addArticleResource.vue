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
              label-width="104px"
              class="demo-ruleForm"
            >
              <el-form-item label="文章标题:" prop="name" class="width360">
                <el-input v-model="resourceForm.name" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item label="作者:" prop="author" class="width360">
                <el-select
                  value-key="id"
                  v-model="resourceForm.author"
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
                <el-input v-model="resourceForm.keywords" :disabled="this.dialogStatus === 'view'" placeholder="多个关键词用逗号隔开"></el-input>
              </el-form-item>
              <el-form-item label="所属图书:" prop="bookName" class="width360">
                <el-input v-model="resourceForm.bookName"  :disabled="this.dialogStatus === 'view'||resourceForm.bookId!=null"></el-input>
              </el-form-item>
              <el-form-item label="来源:" prop="source" class="width360">
                <el-input v-model="resourceForm.source" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item label="所属部门:" prop="departmentId" class="width360">
                <el-select
                  v-model="resourceForm.departmentId"
                  v-validate="'required'"
                  data-vv-scope="baseInfo"
                  name="department"
                  data-vv-as="selected"
                  :disabled="this.dialogStatus === 'view'||resourceForm.bookId!=null"
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
                  v-model="resourceForm.diyTypeId"
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
                      :tabDefine="resourceForm.tablist"
                      :dialogStatus="dialogStatus"
                    ></customLabel>
                  </el-form-item>
                </li>
              </ul>

              <el-form-item label="文章封面：" prop="cover" class="width100">
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
                <span class="recomment">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、gif、png格式，不超过2M</span>
              </el-form-item>
              <el-form-item label="简介:" prop="intro" class="content">
                <tinymce :height="300" ref="editor" v-model="resourceForm.intro"></tinymce>
              </el-form-item>
              <el-form-item label="正文:" prop="text" class="content">
                <tinymce :height="300" ref="editor" v-model="resourceForm.text"></tinymce>
              </el-form-item>

              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;资源内容</h6>
              <div class="resource_content" style="margin-left: 120px;">
                <span class="tip">请上传资源的阅读文件，至少上传一种文件</span>
                <el-form-item label="PDF成品文件:" label-width="150px">
                  <el-radio-group :disabled="this.dialogStatus === 'view'" v-model="resourceForm.pdfResourceType" @change="changePDF">
                    <el-radio :label="1">上传PDF资源</el-radio>
                    <el-radio :label="2">绑定已有PDF资源</el-radio>
                  </el-radio-group>
                  <a class="el-upload-list__item-name" v-if="rebackpdf&&resourceForm.pdfName">
                    <i class="el-icon-document"></i>
                    {{resourceForm.pdfName}}
                  </a>
                  <el-upload
                    v-if="resourceForm.pdfResourceType==1"
                    class="upload-demo"
                    :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                    :before-upload="beforePDFUpload"
                    :on-success="handlePDFSuccess"
                    :limit="1"
                    :on-remove="handlePDFRemove"
                    :disabled="this.dialogStatus === 'view'"
                    accept="application/pdf"
                  >
                    <el-button size="small" type="primary" v-if="hiddenViewButton">点击上传</el-button>
                  </el-upload>
                  <div v-if="resourceForm.pdfResourceType==2">
                    <el-button size="small" type="primary" @click="choosePdf('pdf')">选择文件</el-button>
                  </div>
                </el-form-item>
                <el-form-item label="视频成品文件:" label-width="150px">
                  <el-radio-group :disabled="this.dialogStatus === 'view'" v-model="resourceForm.videoResourceType" @change="changeVideo">
                    <el-radio :label="1">上传视频资源</el-radio>
                    <el-radio :label="2">绑定已有视频资源</el-radio>
                  </el-radio-group>
                  <a class="el-upload-list__item-name" v-if="rebackvideo&&resourceForm.videoName">
                    <i class="el-icon-document"></i>
                    {{resourceForm.videoName}}
                  </a>
                  <el-upload
                    v-if="resourceForm.videoResourceType==1"
                    class="upload-demo"
                    :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                    :before-upload="beforeVideoUpload"
                    :on-success="handleVideoSuccess"
                    :on-preview="handleVideoPreview"
                    :on-remove="handleVideoRemove"
                    :disabled="this.dialogStatus === 'view'"
                    accept="video/mp4"
                    :limit="1"
                  >
                    <el-button size="small" type="primary" v-if="hiddenViewButton">点击上传</el-button>
                  </el-upload>
                  <div v-if="resourceForm.videoResourceType==2">
                    <el-button size="small"  type="primary" @click="chooseVideo('video')">选择文件</el-button>
                  </div>
                </el-form-item>
                <el-form-item label="音频成品文件:" label-width="150px">
                  <el-radio-group :disabled="this.dialogStatus === 'view'" v-model="resourceForm.audioResourceType" @change="changeAudio">
                    <el-radio :label="1">上传音频资源</el-radio>
                    <el-radio :label="2">绑定已有音频资源</el-radio>
                  </el-radio-group>
                  <a class="el-upload-list__item-name" v-if="rebackaudio&&resourceForm.audioName">
                    <i class="el-icon-document"></i>
                    {{resourceForm.audioName}}
                  </a>
                  <el-upload
                    v-if="resourceForm.audioResourceType==1"
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
                    <el-button size="small" type="primary" v-if="hiddenViewButton">点击上传</el-button>
                  </el-upload>
                  <div  v-if="resourceForm.audioResourceType==2">
                    <el-button size="small"  type="primary" @click="chooseAudio('audio')">选择文件</el-button>
                  </div>
                </el-form-item>
              </div>

              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;商品信息</h6>
              <el-form-item label="商品编号:" prop="goosCode" style="width:100%;">
                <el-input v-model="resourceForm.goosCode" :disabled="this.dialogStatus === 'view'" style="width:230px;"></el-input>
                <span class="recomment">可用来保存资源的旧编码</span>
              </el-form-item>
              <el-form-item label="数据来源:" prop="dataSources">
                <el-radio v-model="resourceForm.dataSources" :label="0" :disabled="this.dialogStatus === 'view'">本版</el-radio>
                <el-radio v-model="resourceForm.dataSources" :label="1" :disabled="this.dialogStatus === 'view'">外版</el-radio>
                <span class="recomment">选择外版后请填写或者关联合同信息</span>
              </el-form-item>
              <!-- <el-form-item label="上架状态:" prop="goodsStatus">
                <el-radio v-model="resourceForm.goodsStatus" :disabled="this.dialogStatus === 'view'" :label="1">已上架</el-radio>
                <el-radio v-model="resourceForm.goodsStatus" :disabled="this.dialogStatus === 'view'" :label="2">未上架</el-radio>
              </el-form-item> -->
              <el-form-item label="销售状态:" prop="salesStatus">
                <el-radio v-model="resourceForm.salesStatus" :label="1">可售</el-radio>
                <el-radio v-model="resourceForm.salesStatus" :label="2">不可售</el-radio>
              </el-form-item>

              <el-form-item label="定价:" prop="price" class="width360" style="width:600px;">
                <el-input v-model="resourceForm.price" :disabled="this.dialogStatus === 'view'" style="width:230px;"></el-input>
                <span>元</span>
                <span class="recomment">在前台展示为划线价格</span>
              </el-form-item>
              <el-form-item label="售价:" prop="priceType">
                <el-radio v-model="resourceForm.priceType" :disabled="this.dialogStatus === 'view'" :label="1">付费</el-radio>
                <el-radio v-model="resourceForm.priceType" :disabled="this.dialogStatus === 'view'" :label="2">免费</el-radio>
              </el-form-item>
              <el-form-item prop="sellingPrice" v-if="resourceForm.priceType == 1">
                <el-input v-model="resourceForm.sellingPrice" :disabled="this.dialogStatus === 'view'" style="width:230px;"></el-input>
                <span v-if="resourceForm.priceType == 1">元</span>
              </el-form-item>
              <el-form-item label="相关合同:" prop="agreement" class="width360">
                <el-button @click="getRelatedList" size="small" type="primary" v-if="hiddenViewButton">选择合同</el-button>
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
                <p class="animation-error" style="margin-top:40px;" v-if="canUseDate">请输入有效的时间段</p>
              </el-form-item>
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
                :disabled="this.dialogStatus === 'view'"
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
        <el-tab-pane label="操作记录" name="sixth" v-if="this.dialogStatus==='view'">
          <div  class="recordtable">
            <el-table :data="recordData" border>
              <el-table-column prop="name" label="操作名称" align="center"></el-table-column>
              <el-table-column prop="name" label="操作类型" align="center"></el-table-column>
              <el-table-column prop="createrAccount" label="操作人" align="center"></el-table-column>
              <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
              <el-table-column prop="ip" label="IP" align="center"></el-table-column>
              
            </el-table>
            <!-- 底部 -->
            <div v-if="total>0" class="prfooter">
              <div class="prfooterright">
                <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
              </div>
            </div>
            <!-- 底部 -->
          </div>
        </el-tab-pane>
        <!--相关资源列表-->
        <el-dialog
          title="相关资源列表"
          :visible.sync="dialogPDFVisible"
          width="80%"
          :before-close="handlePDFClose"
        >
          <el-form ref="form" inline label-width="90px">
            <!-- <el-form-item label="资源类型" style="margin-right:20px">
              <el-select readonly="true" v-model="listPDFQuery.resourceType" placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="(value,key) in typeList"
                  :key="key"
                  :label="value"
                  :value="key"
                >{{value}}</el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="资源名称:">
              <el-input v-model="listPDFQuery.name"></el-input>
            </el-form-item>
            <el-form-item class="width90" style="margin-right:20px;">
              <el-button type="primary" @click="onpdfSubmit" class="search">检索</el-button>
            </el-form-item>
          </el-form>
          <el-table
            height="500"
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
            <el-button @click="dialogPDFVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </span>
        </el-dialog>
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
            <el-table-column prop="signingTime" label="签订时间" align="center"></el-table-column>
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
            <el-button type="primary" @click="onSubmit" v-if="dialogStatus!='view'">保存</el-button>
            <el-button  @click="reset" class="cancel">取消</el-button>
          </div>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { getLabelAPI } from "@/api/resourcenew/picture";
import {
  addAPI,
  detailsAPI,
  updateAPI,
  getTreeAPI,
  delFileListAPI,
  uploadFileListAPI
} from "@/api/resource/article";
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
import imgDefault from "@/assets/img/bookDefault.png";
import "@/styles/resource.scss";
import "@/styles/commonRe.css";
import pagination from "../components/pagination";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  files,
  getDepartmentAPI,
  getCopyrightListAPI,
  getTypeAPI,
  fileListAPI,
  sectionAPI
} from "@/api/resource/common";
import { getAuthorsAPI,getRelatedListAPI } from "@/api/resource/ebook";
export default {
  name:"add_article",
  data() {
    return {
      canUseDate: "",
      authors: [], //作者
      hiddenViewButton: false,
      dialogPDFVisible: false,
      pdfList: [],
      typeList:[],
      rebackpdf: false,
      rebackaudio: false,
      rebackvideo: false,
      listPDFQuery:{
        pageNum: 1,
        pageSize: 50
      },
      defaultValue: "",
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
      fileForm: {
        pageNum: 1,
        pageSize: 50
      },
      checkedRelated: false,
      departmentList: [],
      tokens: "", //附件
      uploadFileList: {
        oid: this.$route.query.id || this.$route.query.detailsId,
        token: ""
      },
      treeSelectValue: null,
      treeSelectOptions: [],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      navTree: [],
      imageUrl: "",
      imageUrl: imgDefault,
      pageStatus: 0,
      resourceForm: {
        pdfResourceType: null,
        videoResourceType: null,
        audioResourceType: null,
        name: "",
        author: "",
        keywords: "",
        bookName: "",
        contractName: "",
        contractNumber: "",
        dataSources: 0,
        department: "",
        departmentId:"",
        labelId: [],
        diyTypeCode: [],
        diyTypeId: [],
        endDate: "",
        goosCode: "",
        cover: "",
        relatedContracts: "",
        labelContentCode: [],
        labelContentId: [],
        price: "",
        priceType: 1,
        salesStatus: 1,
        sellingPrice: "",
        source: "",
        startDate: "",
        intro: "",
        text: "",
        pdfFile: "",
        videoFile: "",
        audioFile: "",
        pdf: 0,
        video: 0,
        audio: 0,
        tabDefine1: [],
        tabDefine2: [],
        tablist: [],
        goodsStatus:2
      },
      // inputValue1:'',
      // inputValue2:'',
      rules: {
        name: [{ required: true,  message: "请输入文章标题" },{max:80,message:'文章标题的长度必须小于80个字符'}],
        author: [{ required: true, message: "请输入作者"}],
        keywords:[{max:100,message:'关键词的长度必须小于100个字符'}],
        bookName:[{max:80,message:'所属图书的长度必须小于80个字符'}],
        source: [{ max:30, message: "来源的长度必须小于30个字符"}],
        departmentId: [{ required: true, message: "请选择所属部门"}],
        diyTypeId:[{ required: true, message: "请填写自定义分类" ,trigger: "input"}],//trigger: "input"不能改
        price: [{ required: false, pattern: /^\d{0,5}(\.\d{0,2})?$/,message: "请输入0-99999之间的数字，最多保留两位" }],
        dataSources: [{ required: true, message: "请选择数据来源" }],
        goosCode: [{ max: 20, message: "商品编号的长度必须小于20个字符" }],
        goodsStatus: [{ required: true, message: "请选择上架状态" }],
        contractNumber: [
          { max: 20, message: "合同编号的长度必须小于20个字符" }
        ],
        contractName: [{ max: 50, message: "合同名称的长度必须小于50个字符" }],
        salesStatus: [
          { required: true, message: "销售状态为必选" }
        ],
        sellingPrice: [
          {
            required: true,
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "请输入0-99999之间的数字，最多保留两位"
          }
        ]
      },
      listpdfLoading:true,
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
      total: 30,
      pdftotal: null,
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
    //   this.resourceForm.authorId = this.resourceForm.author.id;
    //   this.resourceForm.author = this.resourceForm.author.name;
    // },
    //查看页面不显示上传按钮
    hiddenView() {
      if (this.$route.query.type == "view") {
        this.hiddenViewButton = false;
      } else {
        this.hiddenViewButton = true;
      }
    },
    //校验自定义分类
    selfChoose(val) {
      //console.log(val);
      this.$refs.ruleForm.validateField("diyTypeId");
    },
    selectFun(node) {
      //this.resourceForm.diyTypeCode = [];
      if (node.code != null || node.code != "") {
        this.resourceForm.diyTypeCode.push(node.code);
      }
      //this.resourceForm.diyTypeId = [];
      if (node.id != null || node.id != "") {
        this.resourceForm.diyTypeId.push(node.id);
      }
    },
    deselectFun(node) {//监听删除
      //console.log(node,"delnode");
      for (var i = 0; i < this.resourceForm.diyTypeId.length; i++) {
        if (this.resourceForm.diyTypeId[i] == node.id) {
          this.resourceForm.diyTypeId.splice(i, 1);
          this.resourceForm.diyTypeCode.splice(i, 1);
        }
      }
       //console.log( this.typeform.diyTypeId," this.typeform.diyTypeId")
    },
    loadOptions({ action, parentNode, callback }){//此处可以懒加载，去掉loadOptions警告；
      callback();
    },
    //提交选择的资源
    confirm() {
      if (this.selectList.length == 1) {
        if (this.chooseFile == "pdf") {
          this.resourceForm.pdf = this.selectList[0].id;
          this.resourceForm.pdfName = this.selectList[0].name;
        }
        if (this.chooseFile == "audio") {
          this.resourceForm.audio = this.selectList[0].id;
          this.resourceForm.audioName = this.selectList[0].name;
        }
        if (this.chooseFile == "video") {
          this.resourceForm.video = this.selectList[0].id;
          this.resourceForm.videoName = this.selectList[0].name;
        }
        this.dialogPDFVisible = false;
      } else if (this.selectList.length == 0) {
        this.$message.warning("至少选择一条");
      } else {
        this.$message.warning("仅可以选择一条");
      }
    },
    //选择视频文件
    chooseVideo() {
      this.pdfList.videoName = "";
      this.dialogPDFVisible = true;
      this.listPDFQuery.resourceType = "6";
      this.getType();
      this.getPDFList();
      this.chooseFile = "video";
    },
    //选择音频文件
    chooseAudio() {
      this.pdfList.audioName = "";
      this.dialogPDFVisible = true;
      this.listPDFQuery.resourceType = "7";
      this.getType();
      this.getPDFList();
      this.chooseFile = "audio";
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
    onpdfSubmit(){
       this.getPDFList()
    },
    handlepdfSelectionChange(val){
      this.selectList=val
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
    getType(){
      getTypeAPI().then( res => {
        if(res.data.code==0){
          this.typeList=res.data.data
        }
      })
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
    // 获取用户部门
    gainSection(){
      sectionAPI().then( res => { 
        this.resourceForm.department = res.data.data.deptList[0].deptName;
        this.resourceForm.departmentId = res.data.data.deptList[0].deptId;
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
          //console.log(res.data.data);
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
    getTree() {
      getTreeAPI(2).then(res => {
        //console.log(res.data.data,'hehhee')
        this.treeSelectOptions = res.data.data||[];
      });
    },
    isEdit() {
      this.$route.meta.title = "添加文章";
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      const type=this.$route.query.type
      if (id) {
        this.$route.meta.title = "修改文章";
        this.pageDetails(id);
      }
      if (type=='view') {
        this.pageStatus = 1;
        this.$route.meta.title = "查看文章";
        this.pageDetails(detailsId);
      }
    },

    // 查看和修改详情信息
    pageDetails(id) {
      detailsAPI(id).then(res => {
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
          this.resourceForm = res.data.data;
          this.tokens = res.data.data.attachmentList;
          //this.treeSelectValue = res.data.data.diyTypeId;
          if (this.resourceForm.cover) {
            this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${
              this.resourceForm.cover
            }&isOnLine=true`;
          }
          if (
            res.data.data.diyTypeId == null ||
            res.data.data.diyTypeId == "null"
          ) {
            this.resourceForm.diyTypeId = [];
            this.resourceForm.diyTypeCode = [];
          }
          
        }
        //详情页面清除校验
        if(this.dialogStatus=='view'){
          this.$refs['ruleForm'].resetFields()
        }
      });
    },
    //自定义标签//8
    getnewLabel() {
      getLabelAPI(2).then(res => {
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
      getLabelAPI(2).then(res => {
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
    // 下一步
    onSubmit() {
      this.$refs["ruleForm"].validate(valid => {
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
        if (this.resourceForm.diyTypeId.length < 1) {
          this.$message.warning("请选择自定义分类");
          return;
        }
        if (valid) {
          //必填字段
          if (this.resourceForm.startDate && this.resourceForm.endDate) {
            if (
              !compareDate(
                this.resourceForm.startDate,
                this.resourceForm.endDate
              )
            ) {
              this.$message.warning("开始时间不可以大于结束时间");
              return;
            }
          }
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
                this.$message.error(`"编辑失败,"${res.data.msg}`);
              }
            });
          } else {
            //新增
            addAPI(this.resourceForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success("添加成功");
                this.activeName = "second";
                this.$router.push({ path: "/resource/article" });
                this.$router.go(-1);
              } else {
                this.$message.error(`"添加失败,"${res.data.msg}`);
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
      this.$router.go(-1)
    },
    getNav() {
      getNavAPI().then(res => {
        res.data.code === 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
    },

    handleClick(tab) {
      if (tab.label == '附件') {
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
    pagesizeFun(val) {
      this.fileForm.pageSize = val;
      this.getFileList();
    },
    currentPageFun(val) {
      this.fileForm.pageNum = val;
      this.getFileList();
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
    beforeFileUpload(file) {
      const isJPG = file.type === "application/pdf";
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error("只能上传是 PDF 格式!");
        return isJPG;
      }
    },
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
      (this.imageUrl = `${this.domain}${
        this.requestPath.file
      }?fileName=${res}&isOnLine=true`),
        (this.resourceForm.cover = res);
    },
    getFileList() {
      this.fileForm.resourceId = this.$route.query.id;
      fileListAPI(this.fileForm).then(res => {
       if (res.data.code == 0) {
          this.recordData = res.data.data.list;
          this.total = res.data.data.total;
        }
      });
    },
    //原始文件列表
    getInfo() {
      getInfoAPI(this.$route.query.id).then(res => {
        if (res.data.code === 0) {
          this.resourceForm = res.data.data;
          this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${
            this.resourceForm.cover
          }&isOnLine=true`;
        } else {
          this.$message.error(`获取数据失败`);
        }
      });
    },

    /*上传pdf */
    handlePDFPreview(file) {},
    handlePDFRemove(file, fileList) {},
    beforePDFUpload(file) {},
    handlePDFSuccess(res, file, fileList) {
      this.rebackpdf = false;
      this.resourceForm.pdfName = "";
      this.resourceForm.pdf = "";
      this.resourceForm.pdfName = file.name;
      this.resourceForm.pdf = file.response;
    },
    /*上传视频 */
    handleVideoPreview(file) {},
    handleVideoRemove(file, fileList) {},
    beforeVideoUpload(file) {},
    handleVideoSuccess(res, file, fileList) {
      this.rebackvideo = false;
      this.pdfList.videoName = "";
      this.pdfList.video = "";
      this.resourceForm.videoName = file.name;
      this.resourceForm.video = res;
    },
    /*上传音频 */
    handleAudioPreview(file) {},
    handleAudioRemove(file, fileList) {},
    beforeAudioUpload(file) {},
    handleAudioSuccess(res, file, fileList) {
      this.rebackaudio = false;
      this.pdfList.audioName = "";
      this.pdfList.audio = "";
      this.resourceForm.audio = res;
      this.resourceForm.audioName = file.name;
    }
  },
  created() {
    this.dialogStatus = this.$route.query.type;
  },
  mounted() {
    this.rebackpdf = true;
    this.rebackaudio = true;
    this.rebackvideo = true;
    this.getFileList();
    this.isEdit();
    // this.pageDetails();
    this.getTree();
    this.getDepartmentList();
    if (this.dialogStatus == "add") {
      this.gainSection();
      this.getnewLabel()
    }
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
.addImgResource .prfooter {
  position: static;
  width: 100%;
  margin-top: 300px;
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

