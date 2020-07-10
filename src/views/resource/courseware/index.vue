<template>
  <el-container class="project-plan">
    <el-aside class="tree-aside">
      <el-tree
        :data="navTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        default-expand-all
        :highlight-current='true'
      ></el-tree>
    </el-aside>
    <el-main>
      <div class="buttons">
        <el-button
          type="primary"
          @click="importPdf"
          v-if="authBtns.filter(i => i.idName=='importBtn').length>0"
        >
          <i class="imBook"></i>
          {{authBtns.filter(i => i.idName=='importBtn')[0].name}}
        </el-button>
        <router-link
          :to="{ path: `courseware/create?type=add`}"
          v-if="authBtns.filter(i => i.idName=='addBtn').length>0"
        >
          <el-button type="primary">
            <i class="add"></i>
            {{authBtns.filter(i => i.idName=='addBtn')[0].name}}
          </el-button>
        </router-link>
      </div>

      <div class="formlist">
        <el-form ref="form" :model="listQuery" label-width="90px">
          <el-form-item label="资源名称:" >
            <el-input @keyup.enter.native="onSubmit" v-model="listQuery.name"></el-input>
          </el-form-item>
          <el-form-item label="所属图书:">
            <el-input @keyup.enter.native="onSubmit" v-model="listQuery.bookName"></el-input>
          </el-form-item>
          <el-form-item label="数据来源:"  style="margin-right:20px">
            <el-select v-model="listQuery.dataSources">
              <el-option label="全部" value="全部"></el-option>
              <el-option label="本版" :value="1"></el-option>
              <el-option label="外版" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="来源:"  v-show="hideFlag">
            <el-input @keyup.enter.native="onSubmit" v-model="listQuery.source"></el-input>
          </el-form-item>
          <el-form-item label="上传时间:" v-show="hideFlag">
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

          <div>
            <el-form-item class="width90" style="margin-right:20px;">
              <el-button type="primary" @click="onSubmit" class="search">检索</el-button>
            </el-form-item>
            <el-form-item class="width90" style="margin-right:20px;">
              <el-button type="primary" plain @click="onReset">
                <i class></i>重置
              </el-button>
            </el-form-item>
            <el-form-item class="width90" style="margin-right:20px;">
              <el-button type="text" @click="onHide" class="btntext">
                <template v-if="!hideFlag">
                  更多条件
                  <i class="el-icon-arrow-down"></i>
                </template>
                <template v-else>
                  收起
                  <i class="el-icon-arrow-up"></i>
                </template>
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div class="tablelist">
        <template>
          <el-tabs v-model="activeName" type="border-card" @tab-click="statusChange">
            <el-tab-pane label="所有课件" name="first"></el-tab-pane>
            <el-tab-pane label="已录入" name="second"></el-tab-pane>
            <el-tab-pane label="审核通过" name="third"></el-tab-pane>
            <el-tab-pane label="审核未通过" name="fourth"></el-tab-pane>
          </el-tabs>
        </template>

        <el-table
          @sort-change="sortChanged"
          border
          v-loading="listLoading"
          element-loading-text="给我一点时间"
          ref="multipleTable1"
          :data="list"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column label="资源名称" align="center" prop="name" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="来源" align="center">
            <template slot-scope="scope">{{scope.row.source}}</template>
          </el-table-column>
          <el-table-column label="文件格式" align="center">
            <template slot-scope="scope">{{scope.row.format}}</template>
          </el-table-column>
          <el-table-column label="售价" prop="sellingPrice" sortable="custom" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sellingPrice">￥{{scope.row.sellingPrice}}</span>
              <span v-else>免费</span>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" prop="uploadTime" sortable="custom" align="center">
            <template slot-scope="scope">{{scope.row.uploadTime}}</template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='0'">已录入</span>
              <span v-if="scope.row.status=='1'">审核通过</span>
              <span v-if="scope.row.status=='2'">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <router-link
                :to="{ path: `courseware/create?type=update`, query: {id: scope.row.id}}"
              >
                <i
                  :title="authBtns.filter(i => i.idName=='editBtn')[0].name"
                  class="edit distance"
                  v-if="authBtns.filter(i => i.idName=='editBtn').length>0"
                ></i>
              </router-link>
              <router-link :to="{ path: `courseware/create?type=view`, query: {id:scope.row.id}}">
                <i
                  :title="authBtns.filter(i => i.idName=='viewBtn')[0].name"
                  class="search distance"
                  v-if="authBtns.filter(i => i.idName=='viewBtn').length>0"
                ></i>
              </router-link>
              <router-link :to="`courseware/relatedResource?id=${scope.row.id}`">
                <i
                  :title="authBtns.filter(i => i.idName=='relatedBtn')[0].name"
                  class="link distance"
                  v-if="authBtns.filter(i => i.idName=='relatedBtn').length>0"
                ></i>
              </router-link>
            </template>
          </el-table-column>
        </el-table>

        <!-- 底部 -->
        <div class="prfooter">
          <div class="prfooterleft">
            <el-checkbox v-model="checkedAll" @change="changeStatus">全选</el-checkbox>
            <span class="marginLeft" @click="batchAudit">批量审核</span>
            <!-- 更多 -->
            <el-popover placement="right" width="150" trigger="click">
              <p @click="batchUpdatePrice">批量修改价格</p>
              <p @click="batchUpdateType">批量修改分类</p>
              <p @click="batchDel">批量删除</p>
              <span class="marginLeft" slot="reference">更多</span>
            </el-popover>
          </div>

          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
          </div>
        </div>
      </div>
    </el-main>

    <!-- </div> -->
    <!--导入课件对话框-->
    <el-dialog title="导入课件" :visible.sync="importDialog" @close="closeImport" class="dialog458 middle backgroundDialog">
      <p class="info">操作提示：单次上传最多10个文件，全部上传完成前请勿关闭窗口，避免数据丢失！</p>
      <el-upload
        class="upload-demo"
        :action="`${domain}/zuul${requestPath.file}${uploadPath}/info`"
        :on-success="handleSuccess"
        :on-exceed="exceedLimit"
        accept=".ppt, .pdf, .world, .excel, .txt, .zip"
        multiple
        :limit="10"
        :before-upload="beforeUpload"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">选择文件(可多选)</el-button>
      </el-upload>
      <el-form :model="importForm" label-width="82px" style="margin-top:20px" :rules="rules">
        <el-form-item label="来源：" prop="source">
          <el-input v-model="importForm.source"></el-input>
        </el-form-item>
        <el-form-item label="定价：" prop="price">
          <el-input v-model="importForm.price"></el-input>
        </el-form-item>
        <el-form-item label="关键词：" prop="keywords">
          <el-input v-model="importForm.keywords"></el-input>
        </el-form-item>
      </el-form>
      <div>
        <div class="dialogbtns">
          <el-button @click="importAll" :loading="loadingAudio">全部上传</el-button>
          <el-button @click="cancelImport">全部取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--批量审核对话框-->
    <el-dialog title="批量审核" :visible.sync="auditDialog" class="auditDialog backgroundDialog">
      <el-form :model="auditForm">
        <el-form-item label="审核状态：">
          <el-radio-group v-model="auditForm.status" @change="changeAudit">
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmAudit">确 定</el-button>
        <el-button @click="auditDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--批量修改价格-->
    <el-dialog
      title="批量修改价格"
      :visible.sync="updatePriceDialog"
      class="backgroundDialog updatePriceDialog"
      @close="closePrice"
    >
      <el-form :model="updatePriceForm" ref="priceForm">
        <el-form-item label="统一售价：" style="margin-bottom:0px;" prop="sellingPrice">
          <el-radio-group v-model="updatePriceForm.priceType" @change="updatePrice">
            <el-radio :label="1">付费</el-radio>
            <el-radio :label="2">免费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
         style="margin-left:86px"
          v-if="updatePriceForm.priceType==1"
          :rules="[{ required: true, message: '请输入价格',trigger: 'blur'},{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'价格最多只能保留两位小数'}]"
          prop="sellingPrice"
        >
          <el-input
            type="text"
            v-model="updatePriceForm.sellingPrice"
            style="width:200px;"
            class="input_price"
            placeholder="请输入价格"
          />&nbsp;元
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmUpdatePrice">确 定</el-button>
        <el-button @click="updatePriceDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 批量删除-->
    <el-dialog title="批量删除" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog">
      <p>确定要删除选择的资源吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDel">确 定</el-button>
        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--批量修改分类-->
    <!-- <el-dialog title="批量修改分类" :visible.sync="updateTypeDialog" class="backgroundDialog updateTypeDialog">
        <el-form :model="updateTypeForm">
            <el-form-item style="margin-bottom:0px;">
                <el-input type="text" v-model="updateTypeForm.type" style="width:200px;"/>
                <el-button>检索</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="typelist" style="width: 100%">
            <el-table-column prop="date" label="编号" width="180"></el-table-column>
            <el-table-column prop="name" label="名称" width="180"> </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button @click="confirmUpdatePrice">确 定</el-button>
            <el-button @click="updatePriceDialog = false">取 消</el-button>
        </div>
    </el-dialog>-->
    <el-dialog
      title="修改分类"
      :visible.sync="updateTypeDialog"
      class="updatePriceDialog backgroundDialog"
    >
      <treeselect
        v-model="treeSelectValue"
        :multiple="true"
        :options="treeSelectOptions"
        data-vv-scope="baseInfo"
        :normalizer="normalizer"
        v-validate="'required'"
        @select="selectFun"
        @deselect="deselectFun"
      />
      <div slot="footer" class="dialog-footer specialFooter">
        <el-button @click="confirmType">确 定</el-button>
        <el-button @click="updateTypeDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>


<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { getNavAPI } from "@/api/resource/common";
import {
  getListAPI,
  batchingAuditAPI,
  batchingUpdatePriceAPI,
  batchingDelAPI,
  importCourseAPI,
  getTreeAPI,
  updateTypeAPI
} from "@/api/resource/courseware";
import { getMultipleSelectionIDs } from "@/filters/getIds";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm
} from "@/utils/publicFunctions";
import pagination from "../components/pagination";
import "@/styles/resource.scss";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import store from "@/store";

export default {
  data() {
    const price = (rule, value, callback) => {
      let reg = /^\d{0,5}(\.\d{0,2})?$/;
      if(value!=""){
        if (!reg.test(value)) {
          callback(new Error("请输入0-99999之间数字，保留小数点后两位"));

        } else {
          callback();

        }
      }else{
        callback();
      }
      
    };
    return {
      priceState: false,
      fileList: [],
      typelist: [],
      navTree: [],
      timeLimit: null,
      list: null,
      total: null,
      activeName: "first",
      checkedAll: false, //全选
      listLoading: true,
      hideFlag: false, //默认收起
      auditDialog: false,
      updatePriceDialog: false,
      deleteDialog: false,
      updateTypeDialog: false,
      loadingAudio: false,
      auditForm: {
        status: 1
      },
      updatePriceForm: {
        ids: [],
        priceType: 1,
        sellingPrice: ""
      },
      updateTypeForm: {
        type: ""
      },
      typeform: {
        ids: [],
        diyTypeCode: [],
        diyTypeId: []
      },
      defaultProps: {
        children: "list",
        label: "showName"
      },
      treeSelectValue: null,
      treeSelectOptions: [],
      listQuery: {
        name: null,
        source: null,
        bookName: null,
        status: null,
        beginTime: null,
        endTime: null,
        dataSources: null,
        diyTypeId: null,
        diyTypeCode: null
      },
      listQuery: {
        pageNum: 1,
        pageSize: 20
      },
      multipleSelection: [],
      //批量审核
      batchData: {
        ids: [],
        status: 1
      },
      batchId: [],
      total: 100,
      pagesize: 30,
      currentPage: 1,
      importDialog: false,
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      importForm: {
        diyTypeCode: "02",
        diyTypeId: "01",
        names: [],
        token: []
      },
      authBtns: [],
      rules: {
        price: [{ required: false, validator: price}],
        source:[{max:30,message:'来源长度不可超过30'}],
        keywords:[{max:100,message:'关键字长度不可以超过100'}]
      }
    };
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    this.getNav();
    this.getList();
  },
  methods: {
    //排序
    sortChanged(column, prop, order) {
      if (column.prop == "sellingPrice" && column.order == "ascending") {
        this.listQuery.price = "asc";

        this.listQuery.uploadTime = "";
      } else if (
        column.prop == "sellingPrice" &&
        column.order == "descending"
      ) {
        this.listQuery.price = "desc";

        this.listQuery.uploadTime = "";
      } else if (column.prop == "uploadTime" && column.order == "ascending") {
        this.listQuery.price = "";

        this.listQuery.uploadTime = "asc";
      } else if (column.prop == "uploadTime" && column.order == "descending") {
        this.listQuery.price = "";

        this.listQuery.uploadTime = "desc";
      }
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if (res.data.code == 0) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
          res.data.data.list.forEach((back, index) => {
            res.data.data.list[index].uploadTime = back.uploadTime.substring(
              0,
              10
            );
          });
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    // 左侧自定义分类
    getNav() {
      getTreeAPI(9).then(res => {
        res.data.data = [{ showName: "全部" }].concat(res.data.data);
        res.data.code == 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
    },
    selectFun(node) {
      this.typeform.diyTypeId.push(node.id);
      this.typeform.diyTypeCode.push(node.code);
    },
    deselectFun(node) {
      for (var i = 0; i < this.typeform.diyTypeId.length; i++) {
        if (this.typeform.diyTypeId[i] == node.id) {
          this.typeform.diyTypeId.splice(i, 1);
          this.typeform.diyTypeCode.splice(i, 1);
        }
      }
    },
    getTree() {
      getTreeAPI(9).then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },
    //全选
    changeStatus() {
      if (this.checkedAll) {
        this.list.forEach(row => {
          this.$refs.multipleTable1.toggleRowSelection(row, true);
        });
        this.multipleSelection = this.list;
      } else {
        this.$refs.multipleTable1.clearSelection();
        this.multipleSelection = [];
      }
    },
    // 批量审核
    batchAudit() {
      if (this.multipleSelection.length > 0) {
        this.auditDialog = true;
        this.batchData.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //确认修改分类
    confirmType() {
      if(this.typeform.diyTypeId.length<1){
        this.$message.warning('请选择分类')
      }else{
        this.typeform.ids = this.multipleSelection.map(item => item.id);
        updateTypeAPI(this.typeform).then(res => {
          if (res.data.status) {
            operationMsg.apply(this, [res.data, `批量修改`]);
            this.updateTypeDialog = false;
          }
        });
      }
      
    },
    //批量修改分类
    batchUpdateType() {
      if (this.multipleSelection.length > 0) {
        this.updateTypeDialog = true;
        this.getTree();
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list
      };
    },
    //确认审核
    confirmAudit() {
      batchingAuditAPI(this.batchData).then(res => {
        operationMsg.apply(this, [
          res.data,
          `批量审核${this.batchData.ids.length}项`
        ]);
      });
      this.auditDialog = false;
    },

    // 确认修改价格
    confirmUpdatePrice() {
      this.$refs["priceForm"].validate(valid => {
        if (valid) {
          batchingUpdatePriceAPI(this.updatePriceForm).then(res => {
            operationMsg.apply(this, [res.data, `批量修改`]);
            this.getList();
          });
          this.updatePriceDialog = false;
        }
      });
    },
    //关闭修改价格
    closePrice() {
      this.$refs["priceForm"].clearValidate();
      this.updatePriceForm = {
        ids: [],
        priceType: 1,
        sellingPrice: ""
      };
    },
    //确认删除
    confirmDel() {
      batchingDelAPI(this.batchId).then(res => {
        operationMsg.apply(this, [res.data, `批量删除`]);
      });
      this.deleteDialog = false;
    },
    // 导入pdf
    importPdf() {
      var id = this.listQuery.diyTypeId;
      if (id) {
        this.importDialog = true;
      } else {
        this.$message.warning("请先选择自定义分类!");
      }
    },

    // 修改审核状态
    changeAudit(val) {
      if (val == "1") {
        this.batchData.status = 1;
      } else {
        this.batchData.status = 2;
      }
    },
    //批量修改价格
    batchUpdatePrice() {
      if (this.multipleSelection.length > 0) {
        this.updatePriceDialog = true;
        this.updatePriceForm.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //批量删除
    batchDel() {
      if (this.multipleSelection.length > 0) {
        this.deleteDialog = true;
        this.batchId = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },

    //修改价格状态
    updatePrice(val) {
      this.updatePriceForm.priceType = val;
    },
    //检索
    onSubmit() {
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
      this.getList()
    },
    onHide() {
      this.hideFlag = !this.hideFlag;
    },
    handleClick(tab, event) {},
    //多选框发生变化时
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 翻页
    pagesizeFun(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    handleNodeClick(data) {
      this.listQuery.diyTypeId = data.id;
      this.listQuery.diyTypeCode = data.code;
      this.getList();
    },
    // 切换列表状态
    statusChange(tab, event) {
      if (tab.index == 1) {
        this.listQuery.status = 0; //待审核
      } else if (tab.index == 2) {
        this.listQuery.status = 1; // 审核通过
      } else if (tab.index == 3) {
        this.listQuery.status = 2; //审核未通过
      } else {
        this.listQuery.status = null;
      }
      this.getList();
    },
    handleSuccess(res, file, fileList) {
      this.importForm.token.push(res.fileName);
      this.importForm.names.push(file.name);
    },
    exceedLimit() {
      this.$message.error("单次最多可上传10个文件");
    },
    beforeUpload(file) {
      const isPDF = file.type == "application/pdf" || file.type == "application/ppt" || file.type == "application/doc" || file.type == "application/docx" || file.type == "application/xls" || file.type == "application/xlsx" || file.type == "application/txt" || file.type == "application/rar" || file.type == "application/zip";
      const isLt6M = file.size / 1024 / 1024 < 6;
      if ( !isPDF ) { 
        this.$message.warning("只能上传word、ppt、pdf、excel、txt、压缩包文件!");
        return false;
      }
      // if (!isLt6M) {
      //   this.$message.error("上传大小不能超过 6MB!");
      //   return isLt6M;
      // }
    },
    //关闭
    closeImport(){
      this.importDialog = false;
      this.fileList = [];
      this.importForm = {
        keywords: "",
        names: [],
        price: "",
        size: [],
        source: "",
        synopsis: "",
        timeLength: [],
        token: []
      };
    },
    //全部取消
    cancelImport() {
      this.fileList = [];
      this.importForm = {
        keywords: "",
        names: [],
        price: "",
        size: [],
        source: "",
        synopsis: "",
        timeLength: [],
        token: []
      };
    },
    //全部上传
    importAll() {
      if (this.importForm.names.length > 0) {
        this.loadingAudio = true;
        this.importForm.price = Number(this.importForm.price);
        this.importForm.diyTypeId = this.listQuery.diyTypeId;
        this.importForm.diyTypeCode = this.listQuery.diyTypeCode;
        importCourseAPI(this.importForm).then(res => {
          operationMsg.apply(this, [res.data, `批量导入`]);
          this.fileList = [];
          this.loadingAudio = false;
        });
        this.importDialog = false;
      } else if (this.importForm.names.length == 0) {
        this.$message.error("请先上传课件资源!");
      }
    }
  },
  components: { pagination, Treeselect }
};
</script>
<style scoped>
/* .buttons .el-button {
  width: 100px;
  height: 34px;
  margin-right: 8px;
  padding-left: 15px;
}
.buttons .el-button:hover {
  background: #03bcd9;
  border-color: #03bcd9;
  border-radius: 0;
  color: #fff;
}
.formlist {
  padding: 35px 41px 15px 35px;
  background: #fff;
  margin-top: 24px;
} */
.dialogbtns {
  text-align: center;
}
.widthBig {
  width: 613px;
}

.formlist .line {
  text-align: center;
  margin-bottom: 0;
  border: 0;
}
.imBook {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/importico.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.add {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/plan_add.png") no-repeat;
  float: left;
}
.imExcel {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/plan_excel.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.submitIcon {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/plan_submitico.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.btntext {
  background: none;
  color: #409eff;
  border: 0;
}
.tablelist {
  z-index: 1;
  background-color: #fff;
  margin-top: 10px;
}

.tablelist .edit {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/edit.png") no-repeat;
}
.tablelist .search {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/search.png") no-repeat;
}
.tablelist .view {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/view.png") no-repeat;
}
.tablelist .link {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/link.png") no-repeat;
}
.tablelist .distance {
  margin-right: 5px;
}
.dialog458 .el-input {
  width: 130px;
}

.dialog458 .el-form-item {
  width: 200px;
  display: inline-block;
  margin-bottom: 5px;
}
.info {
  margin: 0;
}
.project-plan .upload-demo {
  display: inline-block;
}
</style>
<style scoped>
.project-plan .el-upload-list {
  width: 418px;
  height: 189px;
  overflow: auto;
  border: 1px solid #a9a9a9;
  margin-top: 5px;
  margin-bottom: 5px;
  overflow: auto;
}
.project-plan .updatePriceDialog .el-dialog {
  width: 458px;
  height: auto;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -229px;
  margin-top: -107px !important;
}

.project-plan .auditDialog .el-dialog {
  width: 458px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -229px;
  margin-top: -100px !important;
}
.project-plan .deleteDialog .el-dialog {
  width: 458px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -229px;
  margin-top: -90px !important;
}
.project-plan .formlist .el-form-item__label {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #424861;
}
/* .project-plan .formlist .el-input {
  width: 210px;
}
.project-plan .formlist .width260 .el-input {
  width: 260px;
} */
/* .project-plan .formlist .el-form-item {
  margin: 0;
  display: inline-block;
  margin-right: 48px;
  vertical-align: top;
  margin-bottom: 14px;
} */
.project-plan .width90 .el-form-item__content {
  margin-left: 0 !important;
}
/* .project-plan .formlist .el-button.search {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.project-plan .formlist .el-button {
  width: 89px;
  border-radius: 5px;
} */
.project-plan .el-upload {
  margin-top: 5px;
  margin-bottom: 5px;
  float: right;
}
/*底部*/
.prfooter {
  padding: 0px 21px;
  height: 40px;
  background: #3f4560;
  font-size: 13px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  line-height: 40px;
  /* position: fixed; */
  /* bottom: 0; */
  z-index: 10;
  /* width: 77%; */
}
.el-popover p {
  height: 20px;
  line-height: 20px;
}
.el-popover p:hover {
  cursor: pointer;
}
.prfooter .marginLeft {
  margin-left: 10px;
}
.prfooter .el-checkbox {
  color: #ffffff;
}
.prfooter span {
  color: #ffffff;
}
.prfooterleft span:hover {
  cursor: pointer;
}
.prfooterleft {
  float: left;
}
.prfooterright {
  /* width: 560px; */
  float: right;
}
.el-pagination {
  font-size: 13px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #fff;
}
/*翻页*/
/* .project-plan .el-pagination__total {
  color: #fff;
}
.project-plan .el-pagination {
  padding: 6px 0px;
}
.project-plan .el-pagination span,
.project-plan .el-pagination .el-select .el-input .el-input__inner,
.project-plan .el-pagination__editor.el-input .el-input__inner,
.project-plan .el-pagination .btn-next,
.el-pagination .btn-prev {
  color: #fff;
}
.project-plan .el-pagination .el-select .el-input .el-input__inner,
.project-plan .el-pagination__editor.el-input .el-input__inner {
  background: #393f5b;
  border: 0;
}
.project-plan .el-pager li,
.project-plan .el-pagination .btn-next,
.project-plan .el-pagination .btn-prev {
  background: #393f5b;
} */
.project-plan .el-table__header-wrapper th {
  background: #fff;
}
.dialog458 .el-dialog {
  width: 458px;
}
.copyright {
  width: 510px;
  height: 42px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #919cae;
  line-height: 42px;
  text-align: center;
  margin-top: 99px;
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 0;
}
</style>