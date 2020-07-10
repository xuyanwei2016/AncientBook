<template>
  <div class="addImgResource">
    <div class="formbox">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="基本信息" name="first">
          <div class="tabwrapper">
            <el-form
              label-position="right"
              ref="resourceForm"
              :rules="rules"
              label-width="150px"
              :model="resourceForm"
            >
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
              <el-form-item label="资源名称:" prop="name">
                <el-input v-model="resourceForm.name" :disabled="this.dialogStatus === 'view'" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="作者:" prop="author">
                <el-select
                  value-key="id"
                  v-model="resourceForm.author"
                   style="width:500px;"
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
              <el-form-item label="关键词:" prop="keywords">
                <el-input
                  v-model="resourceForm.keywords"
                  style="width:500px;"
                  placeholder="多个关键词用逗号隔开"
                  :disabled="this.dialogStatus === 'view'"
                ></el-input>
              </el-form-item>
              <el-form-item label="来源:" prop="source">
                <el-input v-model="resourceForm.source" :disabled="this.dialogStatus === 'view'" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item prop="departmentId" label="所属部门:">
                <el-select
                  style="width:500px;"
                  v-model="resourceForm.departmentId"
                  v-validate="'required'"
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
              <el-form-item prop="diyTypeId" label="自定义分类:">
                <treeselect
                  style='width:500px'
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
                  @select="selectFun"
                  @deselect="deselectFun"
                  @input="selfChoose"
                  :disabled="this.dialogStatus === 'view'"
                />
              </el-form-item>

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
              <el-form-item label="上传PDF成品:" prop="pdf">
                <el-upload
                  class="upload-demo"
                  v-model="resourceForm.pdf"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :before-upload="beforePDFUpload"
                  :on-success="handlePDFSuccess"
                  :limit="1"
                  :on-remove="handlePDFRemove"
                  accept="application/pdf"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <a class="el-upload-list__item-name" v-if="rebackpdf&&resourceForm.pdfName">
                  <i class="el-icon-document"></i>
                  {{resourceForm.pdfName}}
                </a>
              </el-form-item>
               
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;商品信息</h6>
              <el-form-item label="商品编号:" class="width325">
                <el-input v-model="resourceForm.goosCode" :disabled="this.dialogStatus === 'view'" style="width:200px;"></el-input>
                <span class="tip">可用来保存资源的旧编码</span>
              </el-form-item>
              <el-form-item label="数据来源:" prop="dataSources">
                <el-radio v-model="resourceForm.dataSources" :disabled="this.dialogStatus === 'view'" :label="0">本版</el-radio>
                <el-radio v-model="resourceForm.dataSources" :disabled="this.dialogStatus === 'view'" :label="1">外版</el-radio>
                <span class="tip">选择外版后请填写或者关联合同信息</span>
              </el-form-item>
              <el-form-item label="销售状态:" prop="salesStatus">
                <el-radio-group v-model="resourceForm.salesStatus" :disabled="this.dialogStatus === 'view'">
                  <el-radio :label="1">可售</el-radio>
                  <el-radio :label="2">不可售</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="定价:" class="width325" prop="price">
                <el-input v-model="resourceForm.price" style="width:200px;" :disabled="this.dialogStatus === 'view'"></el-input>
                <span>元</span>
                <span class="tip">在前台展示为划线价格</span>
              </el-form-item>
              <el-form-item label="售价:">
                <el-radio-group v-model='resourceForm.priceType' :disabled="this.dialogStatus === 'view'" @change='priceTypeClick'>
                  <el-radio v-model="resourceForm.priceType" :label="1">付费</el-radio>
                  <el-radio v-model="resourceForm.priceType" :label="2">免费</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="sellingPrice" v-if="resourceForm.priceType == 1">
                <el-input
                  v-model="resourceForm.sellingPrice"  
                  :disabled="this.dialogStatus === 'view'" 
                  style="width:200px;"
                ></el-input>
                <span>元</span>
              </el-form-item>
              <el-form-item label="相关合同:" class="width360">
                <el-button @click="getRelatedList" type="primary" size="small" v-if="hiddenViewButton">选择合同</el-button>
                <span style="color:#a2adbd">可手动添加合同信息或者选择合同库文件</span>
              </el-form-item>
              <el-form-item :prop="resourceForm.dataSources==2?'contractNumber':'hh'">
                <el-input
                  style="width:325px "
                  :disabled="this.dialogStatus === 'view'"
                  v-model="resourceForm.contractNumber"
                  placeholder="合同编号"
                  
                ></el-input>
              </el-form-item>
              <el-form-item :prop="resourceForm.dataSources==2?'contractName':'hh'">
                <el-input
                  style="width:325px"
                  :disabled="this.dialogStatus === 'view'"
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
                    :disabled="this.dialogStatus === 'view'"
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
                    :disabled="this.dialogStatus === 'view'"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
            </el-form>

            <div class="btncenter">
              <el-button type="primary" @click="dataSubmit" v-if="pageStatus == 0">保存</el-button>
              <el-button @click="$router.go(-1)" class="cancel">取消</el-button>
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
import { getLabelAPI } from "@/api/resourcenew/picture"; //2
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import {
  addPdfAPI,
  detailsAPI,
  updatePdfAPI,
  getTreeAPI
} from "@/api/resource/pdf.js";
import {
  getNavAPI,
  getOptionAPI,
  getDepartmentAPI,
  getCopyrightListAPI,
  sectionAPI,
  encryptDividePDFByPageAPI
} from "@/api/resource/common.js";
import pagination from "../components/pagination";
import { compareDate } from "@/utils/publicFunctions.js";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import customLabel from "@/components/customLabel"; //3
import "@/styles/resource.scss";
import "@/styles/commonRe.css"; //1
import { getAuthorsAPI } from "@/api/resource/ebook";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "create_pdf",
  components: { Treeselect, customLabel, pagination }, //4
  data() {
    return {
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
      activeName: "first",
      treeSelectValue: null,
      treeSelectOptions: [],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      pageStatus: 0,
      navTree: [],
      checkedKeys: [],
      diyTypeCode: [],
      options: [],
      departmentList: "",
      defaultProps: {
        children: "list",
        label: "showName"
      },
      resourceForm: {
        department: "",
        name: "",
        author: "",
        keywords: "",
        source: "",
        goosCode: "",
        dataSources: 0,
        salesStatus: 1,
        price: "",
        priceType: 2,
        contractNumber: "",
        contractName: "",
        relatedContracts: "",
        startDate: "",
        endDate: "",
        diyTypeCode: [],
        diyTypeId: [],
        divLableId: [],
        labelContentCode: [],
        labelContentId: [],
        sellingPrice: "",
        tabDefine1: [],
        tablist: [],
        pdf:'',
        departmentId:null
      },
      rules: {
        name: [
          { required: true, message: "请输入资源名称" },
          { max: 30, message: "资源名称的长度不可大于30个字符" }
        ],
        author: [{ required: false }],
        keywords: [{ required: false ,max:100,message:'关键词长度不超过100个字符'}],
        source: [{required:false,max:30,message:'来源的长度不可大于30个字符'}],
        departmentId: [{ required: true, message: "请选择所属部门" }],
        dataSources: [{ required: true }],
        salesStatus: [{ required: true }],
        sellingPrice: [{ required: true, message: "请输入付费" }],
        diyTypeId: [
          { required: true, message: "请填写自定义分类", trigger: "input" }
        ], //trigger: "input"不能改
        contractNumber: [{ required: true, message: "请输入合同编号" }],
        contractName: [{ required: true, message: "请输入合同名称" }],
        price:[{
            require: false,
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "定价范围为0-99999之间，保留小数点后两位"
        }],
        sellingPrice:[
          {
            require: false,
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "定价范围为0-99999之间，保留小数点后两位"
          }
        ],
        pdf:[{required:true,message:'请输入PDF'}]
      },
      noDiy: false,
      //自定义标签
      labelList: [],
      defaultValue: [], //默认分类
      labelReback: [],
      rebackpdf:false
    };
  },
  created() {
    this.dialogStatus = this.$route.query.type;
  },
  mounted() {
    this.rebackpdf = true;
    this.isEdit();
    this.getTree();
    if (this.dialogStatus == "add") {
      this.gainSection();
      this.getnewLabel();
    }
    this.getDepartmentList();
    this.hiddenView();
    this.getAuthors();
  },
  methods: {
    // 免费清空
    priceTypeClick(val) {
      if (this.resourceForm.priceType == 2) {
        this.resourceForm.sellingPrice = null;
      }
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
      this.noDiy = false;
      this.$refs.resourceForm.validateField("diyTypeId");
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
    /*上传pdf */
    handlePDFPreview(file) {},
    handlePDFRemove(file, fileList) {},
    beforePDFUpload(file) {},
    handlePDFSuccess(res, file, fileList) {
      //pdf加密
      //encryptDividePDFByPageAPI(file.response)
      this.rebackpdf = false;
      this.resourceForm.pdfName = file.name;
      this.resourceForm.pdf = file.response;

      this.$refs['resourceForm'].clearValidate('pdf')
    },
    //相关合同--确定
    confirmRelated() {
      if (this.checkedRelatedList.id) {
        this.resourceForm.contractNumber = this.checkedRelatedList.identifier;
        this.resourceForm.contractName = cname;
        this.checkedRelated = true;
        this.relatedDialog = false;
      } else {
        this.$message.warning("请选择一条合同");
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
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list
      };
    },
    //获取用户部门
    gainSection() {
      sectionAPI().then(res => {
        this.resourceForm.departmentId = res.data.data.deptList[0].deptId;
      });
    },

    getDepartmentList() {
      getDepartmentAPI().then(res => {
        this.departmentList = res.data.data;
      });
    },
    selectFun(node) {
      if(node.code!=null||node.code!=""){
          this.resourceForm.diyTypeCode.push(node.code);
      }
      
      //this.resourceForm.diyTypeId=[];
      if(node.id!=null||node.id!=""){
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
    getTree() {
      getTreeAPI(15).then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },

    isEdit() {
      this.$route.meta.title = "添加PDF";
      const id = this.$route.query.id; //修改id
      const detailsId = this.$route.query.detailsId; //查看id
      if (id) {
        //修改
        this.$route.meta.title = "修改PDF";
        this.pageDetails(id);
      }
      if (detailsId) {
        //查看
        this.pageStatus = 1;
        this.$route.meta.title = "查看PDF";
        this.pageDetails(detailsId);
      }
    },
    // 查看和修改的页面信息
    pageDetails(id) {
      detailsAPI(id).then(res => {
        if (res.data.code === 0) {
          this.resourceForm = res.data.data;
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
          this.getLabel();
          this.resourceForm.diyTypeId = res.data.data.diyTypeId;
          this.resourceForm.diyTypeCode = res.data.data.diyTypeCode;
          if (res.data.data.diyTypeId) {
            this.noDiy = false;
          }
          
          if (
            res.data.data.diyTypeId == null ||
            res.data.data.diyTypeId == "null"
          ) {
            this.resourceForm.diyTypeId = [];
            this.resourceForm.diyTypeCode = [];
          }
        } else {
          this.$message.error("加载失败");
        }
        //详情页面清除校验
        if(this.dialogStatus=='view'){
            this.$refs['resourceForm'].resetFields()
        }
      });
    },
    //自定义标签//8
    getnewLabel() {
      getLabelAPI(15).then(res => {
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
      getLabelAPI(15).then(res => {
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
    // 保存
    dataSubmit() {
      this.$refs["resourceForm"].validate(valid => {
        if (valid) {
          //必填字段验证
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

          if (this.resourceForm.diyTypeId.length < 1) {
            this.$message.warning("请选择自定义分类");
            return;
          }
          if (valid) {
            this.noDiy = true;
            const id = this.$route.query.id; //修改id
            if (id) {
              //修改
              this.resourceForm.id = id;
              updatePdfAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success("编辑成功");
                  this.activeName = "second";
                  this.$router.push({ path: "/resource/article" });
                  this.$router.go(-1);
                } else {
                  this.$message.error("编辑失败");
                }
              });
            } else {
              //添加
              addPdfAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success("添加成功");
                  this.activeName = "second";
                  this.$router.push({ path: "/resource/article" });
                  this.$router.go(-1);
                } else {
                  this.$message.error("添加失败");
                }
              });
            }
          }
        }
      });
    },

    // getNav() {
    //     getNavAPI().then(res => {
    //         // console.log(res);
    //         res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败');
    //     })
    // },

    setSelect(data, obj) {
      //改变Tree选中节点时修改select
      // console.log(obj);

      this.diyTypeCode = obj.checkedNodes.map(node => {
        return { diyTypeId: node.id, code: node.code };
      });
    },

    setTree(tag) {
      //删除多选标签设置Tree的选中节点
    },

    // 上传合同
    handleFilePreview(file) {},
    handleFileRemove(file, fileList) {},
    beforeFileUpload(file) {},
    handleFileSuccess(res, file, fileList) {
      this.resourceForm.relatedContracts = res;
    }
  }
};
</script>

<style scoped>
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
.line {
  text-align: center;
  border-bottom: none;
}
.el-row {
  width: 156px;
  margin: 0 auto;
}
.tip {
  font-size: 14px;
  color: #ccc;
  margin-left: 8px;
}
.box-card {
  width: 1300px;
  margin: 30px auto;
}
.box {
  width: 1000px;
  margin: 0 auto;
}
./* .addImgResource button.cancel{
  background: #fff;
  color: #409eff;
} */ {
  background: #fff;
  color: #409eff;
}
</style>
