<template>
  <el-container class="project-plan">
    <el-aside  class="tree-aside" v-if="navTree.length>0">
      <el-tree
        :data="navTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
        default-expand-all
        :highlight-current='true'
      ></el-tree>
    </el-aside>
    <el-main>
      <div class="buttons">
        
        <router-link :to="`book_store/addBookResource?type=add&id=null`">
          <el-button type="primary" v-if="authBtns.filter(i => i.idName=='addBtn').length>0">
            <i class="add"></i>添加
          </el-button>
        </router-link>
        <el-button
          type="primary"
          @click="importExc"
          v-if="authBtns.filter(i => i.idName=='importExcel').length>0"
        >
          <i class="imExcel"></i>导入Excel
        </el-button>
        <el-button
          type="primary"
          @click="importPicture"
          v-if="authBtns.filter(i => i.idName=='epubBtn').length>0"
        >
          <i class="imBook"></i>解析EPUB文件
        </el-button>
        <el-button
          type="primary"
          @click="commit"
          v-if="authBtns.filter(i => i.idName=='submitBtn').length>0"
        >
          <i class="submitIcon"></i>提交审核
        </el-button>
      </div>
      <div class="formlist">
        <el-form ref="form" :model="bookInfo" label-width="82px" :rules="rules">
          <el-form-item label="图书名称">
            <el-input v-model="bookInfo.name"></el-input>
          </el-form-item>

          <el-form-item label="作者">
            <el-input v-model="bookInfo.author"></el-input>
          </el-form-item>
          <el-form-item label="ISBN"  width="180">
            <el-input v-model="bookInfo.isbn"></el-input>
          </el-form-item>
          <template v-if="hideFlag">
            <el-form-item label="版次"  width="180">
              <el-input v-model="bookInfo.edition"></el-input>
            </el-form-item>
            <el-form-item label="责任编辑">
              <el-input v-model="bookInfo.executiveEditor"></el-input>
            </el-form-item>
            <el-form-item label="筛选">
              <el-select v-model="bookInfo.option" placeholder="--请选择--">
                <el-option label="无加工文件" :value="7"></el-option>
                <el-option label="无排版文件" :value="8"></el-option>
                <el-option label="无封面" :value="2"></el-option>
                <el-option label="无合同" :value="9"></el-option>
                <el-option label="无作者" :value="1"></el-option>
                <el-option label="无简介" :value="3"></el-option>
                <el-option label="无分类" :value="4" disabled></el-option>
                <el-option label="未定价" :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数据来源" style="margin-right:20px">
              <el-select v-model="bookInfo.dataSources" placeholder="请选择数据来源">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="本版" :value="0"></el-option>
                <el-option label="外版" :value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传时间">
              <el-date-picker
                v-model="timeLimit"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </template>
          <div>
            <el-form-item class="width90">
              <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search">检索</el-button>
              <el-button type="primary" plain @click="onReset">
                <i class></i>重置
              </el-button>
              <el-button type="text" @click="onHide" class="btntext">
                <template v-if="!hideFlag">
                  更多条件
                  <i class="el-icon-arrow-down"></i>
                </template>
                <template v-else>
                  简洁
                  <i class="el-icon-arrow-up"></i>
                </template>
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="tablelist">
        <template>
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="所有图书" name="first"></el-tab-pane>
            <el-tab-pane label="录入中" name="second"></el-tab-pane>
            <el-tab-pane label="待审核" name="third"></el-tab-pane>
            <el-tab-pane label="审核中" name="fourth"></el-tab-pane>
            <el-tab-pane label="审核通过" name="fifth"></el-tab-pane>
            <el-tab-pane label="审核未通过" name="six"></el-tab-pane>
          </el-tabs>
        </template>
        <div class="table_outer_wrap">
          <el-table
              border
              ref="multipleTable"
              :data="books"
              tooltip-effect="dark"
              style="width: 100%;"
              @selection-change="handleSelectionChange"
              @sort-change="sortChanged"
            >
              <el-table-column type="index" align="center" :index="indexSet"></el-table-column>
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column label="图书封面" prop="cover" align="center">
                <template slot-scope="scope">
                  <img v-if="scope.row.cover" :src="`${domain}${requestPath.file}?fileName=${scope.row.cover}&isOnLine=true`" class="avatar"/>
                  <img v-else src="../../../assets/img/bookDefault.png" alt="" class="avatar">
                </template>
              </el-table-column>
              <el-table-column label="图书名称" prop="name" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <!-- 因添加时作者类型改为数组，之前数据不会显示，与数据有关 ，无需修改-->
              <el-table-column prop="author" label="作者" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                 <!-- <span v-for="(item) in scope.row.author" :key="item.id">{{item.name}}&nbsp;</span> -->
                 <span>{{scope.row.author}}&nbsp;</span>
                </template> 
              </el-table-column>
              <el-table-column prop="isbn" label="ISBN" align="center" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="edition" label="版次" align="center" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="price"  label="定价" sortable="custom" align="center">
                 <template slot-scope="scope">
                   <span v-if="scope.row.price">￥{{scope.row.price}}</span>
                  <span v-else></span>
                 </template>
              </el-table-column>
              <el-table-column prop="publishTime" label="出版时间" sortable="custom" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.publishTime">{{scope.row.publishTime.slice(0,7)}}</span>
                 </template>
              </el-table-column>
              <el-table-column prop="uploadTime" label="上传时间" sortable="custom" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.status=='0'">录入中</span>
                    <span v-if="scope.row.status=='3'">待审核</span>
                    <span v-if="scope.row.status=='2'">审核中</span>
                    <span v-if="scope.row.status=='1'">审核通过</span>
                    <span v-if="scope.row.status=='4'">审核未通过</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="150" align="center">
                <template slot-scope="scope">
                   <router-link :to="`book_store/addBookResource?id=${scope.row.id}&type=update`">
                   <i class="edit distance" title="编辑" v-if="authBtns.filter(i => i.idName=='editBtn').length>0"></i></router-link>

                   <router-link :to="`book_store/addBookResource?id=${scope.row.id}&type=view`"><i class="search distance" title="查看" v-if="authBtns.filter(i => i.idName=='viewBtn').length>0"></i></router-link>
                   
                  <router-link :to="`book_store/relatedResource?id=${scope.row.id}&name=${scope.row.name}`">
                    <i class="link distance" title="关联资源" v-if="authBtns.filter(i => i.idName=='relatedBtn').length>0"></i>
                  </router-link>
                  <router-link tag="a" target="_blank" :to="`book_store/Ebook/ebook?bookid=${scope.row.id}`">
                    <i class="epub distance" title="查看epub文件" v-if="authBtns.filter(i => i.idName=='epubBtn').length>0"></i>
                  </router-link>
                </template>
              </el-table-column>  
            </el-table>
          </div>
       </div>
      <div v-if="total>0" class="prfooter resource_prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
        <div class="prfooterleft">
          <el-checkbox v-model="checkedAll" @change="changeStatus">全选</el-checkbox>
          <span class="marginleft"  @click="batchAudit">批量审核</span>
          <span class="marginleft" style="display:inline-block;margin-left:10px;"  @click="exportExcel">导出Excel</span>
          <!--更多-->
          <el-popover placement="right" width="150" trigger="click">
            <p @click="batchUpdatePrice">批量修改价格</p>
            <p @click="batchUpdateType">批量修改分类</p>
            <p @click="batchDel">批量删除</p>
            <p @click="setSalesStatus">设置上架状态</p>
            <span class="marginLeft" slot="reference">更多</span>
          </el-popover>
          <!--更多-->
        </div>
         <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" :pageNum="bookInfo.pageNum" :pageSize="bookInfo.pageSize" @currentPage="currentPageFun"></pagination>
          </div>
      </div>
      
    </el-main>
    <!--修改分类-->
    <el-dialog title="修改分类" width="456px" :visible.sync="typeDialog" class="updatePriceDialog backgroundDialog" style="height:auto !important;">
      <treeselect
        v-model="treeSelectValue"
        placeholder="请选择"
        :multiple="true"
        :options="treeSelectOptions"
        data-vv-scope="baseInfo"
        :flat="true"
        :normalizer="normalizer"
        v-validate="'required'"
        :loadOptions='loadOptions'
        :auto-load-root-options="false"
        @select="selectFun"
        @deselect="deselectFun"
      />
      <div slot="footer" class="dialog-footer specialFooter">
        <el-button @click="confirmType" type="primary">确 定</el-button>
        <el-button @click="typeDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--审核对话框-->
    <el-dialog title="批量审核" @close="closeAuditDialog" :visible.sync="auditDialog" width="458px" style="height:auto !important;" class="auditDialog backgroundDialog">
      <el-form :model="batchData">
        <el-form-item label="审核状态：">
          <el-radio-group v-model="batchData.status">
            <el-radio :label="2">审核中</el-radio>
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="4">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmAudit" type="primary">确 定</el-button>
        <el-button @click="auditDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 设置上架状态 -->
    <el-dialog
      title="设置上架状态"
      :visible.sync="setSellState"
      class="backgroundDialog setSellState"
      :rules="rules"
       width="458px"
      style="height:auto !important;"
    >
      <el-form :model="setSellForm">
        <el-form-item label="设置上架状态：" style="margin-bottom:0px;">
          <el-radio-group v-model="setSellForm.goodsStatus">
            <el-radio :label="1">已上架</el-radio>
            <el-radio :label="2">未上架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmUpdateState" type="primary">确 定</el-button>
        <el-button @click="setSellState = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--批量修改价格-->
    <el-dialog
      title="批量修改价格"
      :visible.sync="updatePriceDialog"
      class="backgroundDialog updatePriceDialog"
      @close="closePrice"
      style="height:auto !important;"
    >
      <el-form :model="updatePriceForm" ref="priceForm">
        <el-form-item label="定价"  :rules="[{ required: true, message: '请输入价格'},{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{0,2})))$/,message:'价格最多只能保留两位小数'}]" prop="price">
           <el-input
            type="text"
            v-model="updatePriceForm.price"
            style="width:200px;"
            class="input_price"
            placeholder="请输入价格"
            
          />&nbsp;元
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmUpdatePrice" type="primary">确 定</el-button>
        <el-button @click="updatePriceDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--批量删除-->
    <el-dialog title="批量删除" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog" style="height:auto !important;">
      <p>确定要删除选择的图书库资源吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDel" type="primary">确 定</el-button>
        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--导入Excel-->
    <el-dialog
      title="导入Excel"
      :visible.sync="importExcDialog"
      class="backgroundDialog importExcDialog"
      style="height:auto !important;" 
      @close="closeBatchAdd"
    >
      <p>请选择要导入的文件，文件类型只支持Excel。</p>
      <div class="importExc">
        <input type="file" @change="fileSelect" ref="file" accept=".xls,.xlsx">
        <a class="fake-download" :href="`${domain}/file/templet/导入图书信息模板.xls`">下载模板文件</a>
      </div>
      <!-- <el-progress :percentage="downLoadVal" :stroke-width="12" color="#67C23A"></el-progress> -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmImport" type="primary" :loading="downLoadVal">确 定</el-button>
        <el-button @click="importExcDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!---->
    <el-dialog title="提示" :visible.sync="importDialog" @close="closeEpub" class="backgroundDialog deleteDialog" style="height:auto !important;">
      <p class="info">请确认FTP中文件已全部上传完毕，再进行EPUB文件解析，解析过程会占用CPU空间影响平台访问速度，建议您在空余时间进行解析。</p>
      <div>
        <div class="dialogbtns">
          <el-button type="primary" @click="importAll" :loading="analysisEpub">确定</el-button>
          <el-button @click="importDialog=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--批量导出Excel-->
    <el-dialog
      title="批量导出"
      :visible.sync="exportExcelDialog"
      class="backgroundDialog exportExcelDialog"
      style="height:auto !important;"
      @close="exportExcelClose"
    >
      <el-form ref="exportExportform" :model="exportExportform" label-width="80px">
        <el-form-item label="导出范围">
          <el-select v-model="exportExportform.range">
            <el-option label="全部数据" value="0"></el-option>
            <el-option label="选中数据" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导出字段">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAllWords"
            @change="handleCheckAllWordsChange"
          >全部字段</el-checkbox>
          <el-checkbox-group v-model="exportExportform.words" @change="handleCheckedWordsChange">
            <el-checkbox
              v-for="(value,key) in excelListItems"
              :label="key"
              name="words"
              :key="key"
            >{{value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmExport" type="primary">导出</el-button>
        <el-button @click="exportExcelClose">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template> 
<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import pagination from "../components/pagination";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm,
  returnMsg
} from "@/utils/publicFunctions";
import getTreeId from '@/filters/getTreeid'
import store from "@/store";
import {
  getListAPI,
  batchingAuditAPI,
  batchingUpdatePriceAPI, 
  batchingDelAPI,
  commitAuditAPI,
  getFtpAPI,
  epubAPI,
  excelImportAPI,
  setSellAPI,
  uploadExcelAPI 
} from "@/api/resource/ebook";
import {
  excelExportAPI,
  exportListAPI,
  getTreeAPI,
  updateTypeAPI
} from "@/api/resource/common";
import "@/styles/resource.scss";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
import queryString from "query-string";
export default {
  name: "book_store",
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      //导出excel开始
      exportExcelDialog: false,
      isIndeterminate: false,
      checkAllWords: false,
      exportExportform: {
        words: [],
        range: ""
      },
      rangeExcelList: {
        objectIds: [],
        isDelete: 0,
        names: null,
        resourceType: 1
      },
      downLoadVal:false,
      excelListData: {},
      excelListItems: [],
      arrayWordsAll: [], //导出excel结束
      treeSelectValue: null,
      treeSelectOptions: [],
      authBtns: [],
      hideFlag: false, //默认收起
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      books: [],
      fileList: [],
      total: 0,
      activeName: "first",
      checkedAll: false,
      navTree: [],
      defaultProps: {
        children: "list",
        label: "showName"
      },
      bookInfo: {
        pageNum: 1,
        pageSize: 50,
      },
      timeLimit: null,
      multipleSelection: [],
      auditDialog: false,
      importExcDialog: false,
      typeDialog: false, //分类
      //批量审核
      batchData: {
        ids: [],
        status: null
      },
      auditForm: {
        auditStatus: 1
      },
      setSellState: false,
      updatePriceDialog: false,
      deleteDialog: false,
      importDialog: false,
      updatePriceForm: {
        ids: [],
        price: ""
      },
      rules: {
        price: {
          required: true,
          trigger: "blur",
          pattern: /^\d{0,5}(.\d{0,2})?$/,
          message: "请输入0-99999之间的数字，最多保留两位"
        }
      },
      setSellForm: {
        ids: [],
        goodsStatus:1
      },
      batchId: [],
      commitId: [],
      importForm: {
        imglist: [],
        from: "",
        price: "",
        keyword: ""
      },
      tokens: [],
      typeform: {//修改分类的
        ids: [],
        diyTypeCode: [],
        diyTypeId: [],
        objectType:1
      },
      exportExcelForm: {
        diyTypeId: [],
        name: "",
        author: "",
        edition: "",
        executiveEditor: "",
        isbn: "",
        option: null,
        beginTime: "",
        endTime: "",
        dataSources: null,
        status: "",
        diyTypeCode: "",
        pageNum: 1,
        pageSize: 50,
        orderBy: "",
        price:"",
        publishTime:"", 
        uploadTime:""
      },
      analysisEpub:false
    };
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  watch: {
    treeSelectValue(newVal,oldVal){//监听清空全部按钮
      if(newVal==null||newVal=='null'){
        return false;
      }
      if(newVal.length==0){
        this.typeform.diyTypeId=[];
        this.typeform.diyTypeCode=[];
      }
    }
  },
  methods: {
    //关闭批量导出弹窗
    exportExcelClose(){
      
      this.exportExportform= {
        words: [],
        range: ""
      }
      this.$refs['exportExportform'].resetFields()
      this.exportExcelDialog = false
    },
     //解决索引只排序当前页的问题,增加函数自定义索引序号
    indexSet(index){
      return (this.bookInfo.pageNum-1)*this.bookInfo.pageSize+index+1;
    },
    closeBatchAdd(){//清空导入的文件名   
      this.$refs.file.value='';
      this.downLoadVal=false;//初始加载条
      //this.$refs.file.outerHTML=this.$refs.file.outerHTML;
      //console.log(this.$refs.file,"$refs.file$refs.file")
    },
    closeEpub(){
      this.analysisEpub=false
    },
    //批量审核弹窗关闭
    closeAuditDialog(){
      this.batchData={
        ids: [],
        status: null
      }
    },
    //排序
    sortChanged(column, prop, order ){
      //好傻的方法
      if(column.prop=="price"&&column.order=="ascending"){
        this.bookInfo.price='asc';
        this.bookInfo.publishTime=''
        this.bookInfo.uploadTime=''
      }else if(column.prop=="price"&&column.order=="descending"){
        this.bookInfo.price='desc';
        this.bookInfo.publishTime=''
        this.bookInfo.uploadTime=''
      }else if(column.prop=="publishTime"&&column.order=="ascending"){
        this.bookInfo.price='';
        this.bookInfo.publishTime='asc'
        this.bookInfo.uploadTime=''
      }else if(column.prop=="publishTime"&&column.order=="descending"){
        this.bookInfo.price='';
        this.bookInfo.publishTime='desc'
        this.bookInfo.uploadTime=''
      }else if(column.prop=="uploadTime"&&column.order=="ascending"){
        this.bookInfo.price='';
        this.bookInfo.publishTime=''
        this.bookInfo.uploadTime='asc'
      }else if(column.prop=="uploadTime"&&column.order=="descending"){
        this.bookInfo.price='';
        this.bookInfo.publishTime=''
        this.bookInfo.uploadTime='desc'
      }
      this.getList()
    },
    //导出excel
    handleCheckedWordsChange(value) {
      let checkedCount = value.length;
      this.checkAllWords = checkedCount == this.arrayWordsAll.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.arrayWordsAll.length;
    },
    handleCheckAllWordsChange(val) {
      this.exportExportform.words = val ? this.arrayWordsAll : [];
      this.isIndeterminate = false;
    },
    // 确认导出
    confirmExport() {
      if (this.exportExportform.range == "0") {
        this.rangeExcelList.objectIds = [];
        this.rangeExcelList.names = this.arrayWordsAll.join(",");
      } else {
        this.rangeExcelList.objectIds = this.multipleSelection.map(item => item.id).join(",");
        this.rangeExcelList.names = this.exportExportform.words.join(",");
      }
      this.rangeExcelList=Object.assign(this.rangeExcelList,this.bookInfo)
      delete this.rangeExcelList.pageNum;
      delete this.rangeExcelList.pageSize;
      
      this.excelListData = queryString.stringify(this.rangeExcelList);     
      window.open(
        `${process.env.BASE_API}${requestPath.resource}/public/export?${this.excelListData}`
      );
    },
    // 导出excel
    exportExcel() {
      if (this.multipleSelection.length > 0) {
        this.getWordsList();
        this.rangeExcelList.objectIds = [];
        this.exportExcelDialog = true;
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //导出字段列表
    getWordsList() {
      exportListAPI().then(res => {
        if (res.data.status) {
          this.excelListItems = res.data.data;
          for (var key in this.excelListItems) {
            this.arrayWordsAll.push(key);
          }
        } else {
          this.$message.error("获取字段列表失败");
        }
      });
    },
    //确认修改分类
    confirmType() {
      if(!this.treeSelectValue){
        this.$message.warning('请选择分类')
      }else{
        this.typeform.ids = this.multipleSelection.map(item => item.id);
        updateTypeAPI(this.typeform).then(res => {
          if(res.data.status){
            operationMsg.apply(this, [res.data, `批量修改`]);
            this.typeDialog = false;
            this.treeSelectValue = null;
          }
        })
      }
      
    },
    //批量修改分类
    batchUpdateType() {
      if (this.multipleSelection.length > 0) {
        this.typeDialog = true;
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
    selectFun(node) {
      // this.typeform.diyTypeId=[];
      // this.typeform.diyTypeCode=[];
      this.typeform.diyTypeId.push(node.id);
      this.typeform.diyTypeCode.push(node.code);
     //this.typeform.diyTypeId = this.typeform.diyTypeId.concat(getTreeId([node],'list','id'))//父和子的都要
    // this.typeform.diyTypeCode = this.typeform.diyTypeCode.concat(getTreeId([node],'list','code'))//父和子的都要
     //console.log( this.typeform.diyTypeId," this.typeform.diyTypeId")
    },
    deselectFun(node) {
      //console.log(node,"delnode");
      for (var i = 0; i < this.typeform.diyTypeId.length; i++) {
        if (this.typeform.diyTypeId[i] == node.id) {
          this.typeform.diyTypeId.splice(i, 1);
          this.typeform.diyTypeCode.splice(i, 1);
        }
      }
       //console.log( this.typeform.diyTypeId," this.typeform.diyTypeId")
    },
    getTree() {
      getTreeAPI(1).then(res => {
        //res.data.data[0].list[0].list[0].list=null
        this.treeSelectOptions = res.data.data;
      });
    },
    loadOptions({ action, parentNode, callback }){//此处可以懒加载，去掉loadOptions警告；
    // if (action === LOAD_CHILDREN_OPTIONS) {
    //   switch (parentNode.list) {
    //     case 'null': {
    //       simulateAsyncOperation(() => {
    //         parentNode.children = []
    //         callback()
    //       })
    //       break
    //     }
    //     default: ''
    //   }
    // }
      callback();
    },
    searchType() {},
    handlePreview(file) {},
    handleRemove(file, fileList) {},
    beforeUpload(file) {
      const isJPG =
        file.type == "image/jpeg" ||
        file.type == "image/png" ||
        file.type == "image/gif";
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
      this.importForm.imglist.push(file);
    },
    // 导入图片
    importPicture() {
      this.importDialog = true;
    },
    // 提交审核
    commit() {
      if (this.multipleSelection.length > 0) {
        this.commitId = this.multipleSelection.map(item => item.id);
        this.submitAudit();
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    submitAudit() {
      commitAuditAPI(this.commitId).then(res => {
        if(res.data.code==0){
          this.$message.success('提交审核成功')
          this.getList()
        }else if(res.data.code==-7){
          this.$message.warning(res.data.msg)
        }else{
          operationMsg.apply(this, [res.data, `批量提交`]);
        }
        
      });
    },
    //导入Excel
    importExc() {
      var code = this.bookInfo.diyTypeCode;
      if (code) {
        this.importExcDialog = true;
      } else {
        this.$message.warning("请先选择自定义分类!");
      }
    },
    downloadTemp() {},
    //导出Excel
    exportExcel() {
      if (this.multipleSelection.length > 0) {
        this.getWordsList();
        this.exportExcelDialog = true;
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //查询
    onSubmit() {
      if (this.timeLimit) {
        this.bookInfo.beginTime = this.timeLimit[0];
        this.bookInfo.endTime = this.timeLimit[1];
      } else {
        this.bookInfo.beginTime = null;
        this.bookInfo.endTime = null;
      }
      this.getList();
    },
    onReset() {
      this.timeLimit = [];
      this.bookInfo = {
        pageNum: 1,
        status: this.bookInfo.status,
        pageSize: this.bookInfo.pageSize
      };
      this.getList();
    },
    onHide() {
      this.hideFlag = !this.hideFlag;
    },
    handleClick(tab, event) {
      this.currentPageFun(1)//初始化分页为第一页
      if (tab.index == "0") {
        this.bookInfo.status = null;
      } else if (tab.index == "1") {
        this.bookInfo.status = 0;
      } else if (tab.index == "2") {
        this.bookInfo.status = 3;
      } else if (tab.index == "3") {
        this.bookInfo.status = 2;
      } else if (tab.index == "4") {
        this.bookInfo.status = 1;
      } else if (tab.index == "5") {
        this.bookInfo.status = 4;
      }
     this.getList();

    },

    handleNodeClick(data) {
      //点击树节点获取table数据
      this.bookInfo.diyTypeId = data.id;
      this.bookInfo.diyTypeCode = data.code;
      this.getList();
    },
    //所有图书列表
    getList() {
      getListAPI(this.bookInfo).then(res => {
        if (res.data.code==0) {
          this.books = res.data.data.list;
          // this.books.map(v => {
          //   if(v.author){
          //     if(v.author.indexOf("[")>-1){
          //       v.author = JSON.parse(v.author);
          //     }
          //   }
          // });
          
          
          this.total = res.data.data.total;

        } else {
          errorMsg.apply(this, [res.data, `获取表格数据`]);
        }
        this.listLoading = false;
      });
    },
    //所有图书全选
    changeStatus() {
      if (this.checkedAll) {
        this.books.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        });
        this.multipleSelection = this.books;
      } else {
        this.$refs.multipleTable.clearSelection();
        this.multipleSelection = [];
      }
    },
    // 所有图书批量审核
    batchAudit() {
      if (this.multipleSelection.length > 0) {
        this.auditDialog = true;
        this.batchData.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //多选框发生变化时
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //确认审核
    confirmAudit() {
      batchingAuditAPI(this.batchData).then(res => {
        if(res.data.code==0){
          this.$message.success('批量审核成功')
          this.getList()
        }else if(res.data.code==-7){
          this.$message.warning(res.data.msg)
        }else{
          this.$message.error('批量审核失败')
        }
      });
      this.auditDialog = false;
    },
    pagesizeFun(val) {
      this.bookInfo.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.bookInfo.pageNum = val;
      this.getList();
    },
    // 设置上架状态
    setSalesStatus() {
      if (this.multipleSelection.length > 0) {
        this.setSellState = true;
        this.setSellForm.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    // 状态确认
    confirmUpdateState() {
      setSellAPI(this.setSellForm).then(res => {
        if (res.data.code == 0) {
          this.$message.success("设置上架状态成功");
          this.setSellState = false;
          this.getList();
        } else {
          this.$message.error("修改失败");
        }
      });
      this.deleteDialog = false;
    },
    //点击批量修改价格
    batchUpdatePrice() {
      if (this.multipleSelection.length > 0) {
        this.updatePriceDialog = true; //取消按钮
        this.updatePriceForm.ids = this.multipleSelection.map(item => item.id); //勾选的给ids
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    // 确认修改价格，确认按钮
    confirmUpdatePrice() {
      this.$refs['priceForm'].validate( valid => {
        if (valid) {
           //点击按钮时判断输入框内容是否合法
          if (isNaN(this.updatePriceForm.price) == true) {
            this.$message.warning("请输入数字，最多只能保留两位小数");
            return;
          } else {
            batchingUpdatePriceAPI(this.updatePriceForm).then(res => {
              operationMsg.apply(this, [res.data, `批量修改`]);
            });
          }
          this.updatePriceDialog = false;
        }
      } )
     
    },
    //关闭修改价格
    closePrice(){
      this.$refs['priceForm'].resetFields()
      this.updatePriceForm={
        ids: [],
        price: ""
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
    //确认删除
    confirmDel() {
      batchingDelAPI(this.batchId).then(res => {
        returnMsg.apply(this, [res.data, `批量删除`]);
      });
      this.deleteDialog = false;
    },

    epubFunFrist() {
      var promise = new Promise(function(resolve, reject) {
        getFtpAPI().then(res => {
          resolve(res.data.data);
        });
      });
      return promise;
    },
    //解析EpUB
    importAll() {
      this.analysisEpub=true
      var nthis = this;
      var text ="";
      this.epubFunFrist().then(function(data) {
        if(data.tokenList.length>0){
          nthis.tokens = data.tokenList;
          epubAPI(nthis.tokens.join(",")).then(res => {
            if (res.data.code==0) {
              nthis.$message.success("解析数据成功");
              nthis.getList()
              nthis.importDialog = false;
            } else {
              nthis.$message.error("解析数据失败");
            }
            nthis.analysisEpub=false
          });
        }else{
            nthis.analysisEpub=false
        }
        if(data.shortList.length>0){
          let shortList =data.shortList;
          for(var i=0;i<shortList.length;i++){
            text+= shortList[i]+"\n";
          }
          nthis.downloadAtxt("data.txt",text);
        }  
        if(data.tokenList.length==0&&data.shortList.length==0){
          nthis.$message.success('暂无数据解析')
          nthis.importDialog = false;
          this.analysisEpub=false;
        }
      });
    },
    //下载txt文件
    downloadAtxt(filename, text) {
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        } else {
            pom.click();
        }
    },
    //确认导入
    confirmImport() {
      
      if (this.$refs.file.files[0]) {
        this.downLoadVal=true;
        let formData = new FormData();
        formData.append("file", this.$refs.file.files[0]);
        // let setTime=setInterval(()=>{
        //   if(this.downLoadVal<100){
        //     this.downLoadVal+=20
        //   }
        // })
        
        excelImportAPI(formData,this.bookInfo).then(res => {
          //  clearInterval(setTime)
          if (res.data.status) {
            this.$message.success("导入成功！");

            this.importExcDialog = false;
            this.getList()
          } else {
            
            this.$message.error("导入失败！");
          }
          this.downLoadVal=false;
        });
      } else {
        this.$message.warning("请选择文件后再执行导入！");
      }
    },
    //关闭导入图书弹窗
    closeExcel(){
      this.downLoadVal=false;
      var file = this.$refs.file;
      file.value = ""; //虽然file的value不能设为有字符的值，但是可以设置为空值
    },
    fileSelect() {
      if (this.$refs.file.files[0]) {
        let file = this.$refs.file.files[0];
        if (
          file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"&&file.type !==
          "application/vnd.ms-excel"
        ) {
          this.$message.warning("导入文件只支持 xlsx 、xls格式！");
          this.$refs.file.value = null;
        }else{
          
          let formData = new FormData();
          formData.append("file", file);
        }
      }
    }, 
    // 左侧自定义分类
    getNav() {
      getTreeAPI(1).then(res => {
        res.data.data = [{ showName: "全部" }].concat(res.data.data);
        res.data.code == 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
    }
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    console.log(this.$route.meta.routerIds[0])
    this.getNav();
    this.getList();
  },
  activated() {
    this.getList();//缓存操作的新增编辑时，要更新数据
  },
  components: { pagination, Treeselect, queryString }
};
</script>
<style scoped>
.upload-wrap {
  position: relative;
  top: -24px;
  left: 100px;
}
.real-upload {
  z-index: 9;
  opacity: 0;
  -moz-opacity: 0;
  filter: alpha(opacity=0);
}
.plan-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  border-sizing: border-box;
  padding-left: 1px;
  flex-basis: auto;
  height: calc(100vh - 50px);
}
.planLeft {
  width: 199px;
  background-color: #fff;
  border-right: 1px solid #ddd;
}
.planright {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  flex-basis: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 44px 30px 30px 30px;
}
.buttons .el-button {
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
}
.widthBig {
  width: 613px;
}
/* /* .dialog458 .el-input {
  width: 130px;
}

.dialog458 .el-form-item {
  width: 200px;
  display: inline-block;
  margin-bottom: 5px;
}
.dialog458 .el-dialog {
  width: 458px;
} */ */

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
  margin-right: 5px;
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
.tablelist .epub {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/epub.png") no-repeat;
  background-size: 100% 100%;
}
.tablelist .distance {
  margin-right: 5px;
}
.el-popover p {
  height: 20px;
  line-height: 20px;
}
.el-popover p:hover {
  cursor: pointer;
}
.deleteDialog .info {
  font-size: 14px;
  line-height: 24px;
}
.el-form-item__content {
  margin-left: 20%;
}
</style>
<style>
.exportExcelDialog .el-dialog {
  width: 600px;
}
/* .exportExcelDialog .el-checkbox + .el-checkbox {
  margin: 0;
} */
.exportExcelDialog .el-textarea__inner{
  height: 80px;
}
.exportExcelDialog .el-checkbox {
  width: 120px;
  float: left;
}
.dialogbtns {
  text-align: center;
}
.project-plan .importExc .el-upload {
  float: none;
}
.project-plan .importExc {
  margin-bottom: 20px;
}
.project-plan .importExc .el-upload span {
  color: #67c23a;
  float: right;
}
.el-progress {
  margin-bottom: 15px;
}
.project-plan .el-upload-list {
  width: 418px;
  height: 189px;
  overflow: auto;
  border: 1px solid #a9a9a9;
  margin-top: 5px;
  margin-bottom: 5px;
  overflow: auto;
  margin: 0 auto;
}

.project-plan .importExcDialog .el-dialog {
  width: 430px;
}
.project-plan .updatePriceDialog .el-dialog {
  width: 458px;
}

.info {
  margin: 0;
}

/*翻页*/
.project-plan
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item.is-active {
  color: #02a7c1;
  font-weight: bold;
}
.project-plan
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #02a7c1;
}
.avatar {
  height: 26px;
  width: 26px;
  margin-bottom: -6px;
}
</style>