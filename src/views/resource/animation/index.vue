<template>
  <el-container class="project-plan">
    <el-aside class="tree-aside" :data="navTree">
      <el-tree
        :data="navTree"
        :props="defaultProps"
        @node-click="handleNodeClick"
        default-expand-all
        :highlight-current='true'
        :expand-on-click-node="false"
      ></el-tree>
    </el-aside>

    <el-main>
      <div class="buttons">
        <el-button
          type="primary"
          @click="importAnimation"
          v-if="authBtns.filter(i => i.idName=='importBtn').length>0"
        >
          <i class="imBook"></i>
          {{authBtns.filter(i => i.idName=='importBtn')[0].name}}
        </el-button>
        <router-link :to="`animation_store/add_animation?type=add`">
          <el-button type="primary" v-if="authBtns.filter(i => i.idName=='addBtn').length>0">
            <i class="add"></i>
            {{authBtns.filter(i => i.idName=='addBtn')[0].name}}
          </el-button>
        </router-link>
      </div>
      <div class="formlist">
        <el-form ref="form" :model="querylist" label-width="82px">
          <el-form-item label="资源名称" >
            <el-input v-model="querylist.name"></el-input>
          </el-form-item>
          <el-form-item label="所属图书">
            <el-input v-model="querylist.bookName"></el-input>
          </el-form-item>

          <el-form-item label="数据来源"  style="margin-right:20px">
            <el-select v-model="querylist.dataSources" placeholder="请选择数据来源">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="本版" :value="0"></el-option>
              <el-option label="外版" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="hideFlag">
            <el-form-item label="来源">
              <el-input v-model="querylist.source"></el-input>
            </el-form-item>
            <el-form-item label="上传时间" class="widthBig">
              <el-date-picker
                v-model="timeLimit"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
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
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="所有动画" name="first"></el-tab-pane>
            <el-tab-pane label="已录入" name="second"></el-tab-pane>
            <el-tab-pane label="审核通过" name="third"></el-tab-pane>
            <el-tab-pane label="审核未通过" name="fourth"></el-tab-pane>
          </el-tabs>
        </template>
        <div class="table_outer_wrap">
          <el-table
            border
            style="width:100%;"
            element-loading-text="给我一点时间"
            ref="multipleTable1"
            :data="list"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            @sort-change="sortChanged"
          >
            <el-table-column type="index" align="center" :index="indexSet"></el-table-column>
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="name" label="资源名称" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="source" label="来源" align="center" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="price" label="定价" sortable="custom" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.price">￥{{scope.row.price.toFixed(2)}}</span>
                <span v-else></span>
              </template>
            </el-table-column>
            <el-table-column prop="uploadTime" label="上传时间" sortable="custom" align="center"></el-table-column>
            <el-table-column prop="timeLength" label="时长" align="center"></el-table-column>
            <el-table-column prop="size" label="文件大小" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status=='0'">已录入</span>
                <span v-if="scope.row.status=='1'">审核通过</span>
                <span v-if="scope.row.status=='2'">审核未通过</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <router-link :to="`animation_store/add_animation?id=${scope.row.id}&type=update`">
                  <i
                    :title="authBtns.filter(i => i.idName=='editBtn')[0].name"
                    class="edit distance"
                    v-if="authBtns.filter(i => i.idName=='editBtn').length>0"
                  ></i>
                </router-link>
                <router-link :to="`animation_store/add_animation?id=${scope.row.id}&type=view`">
                  <i
                    :title="authBtns.filter(i => i.idName=='viewBtn')[0].name"
                    class="search distance"
                    v-if="authBtns.filter(i => i.idName=='viewBtn').length>0"
                  ></i>
                </router-link>
                <router-link
                  :to="`animation_store/relatedResource?id=${scope.row.id}&name=${scope.row.name}`"
                >
                  <i
                    :title="authBtns.filter(i => i.idName=='relatedBtn')[0].name"
                    class="link distance"
                    v-if="authBtns.filter(i => i.idName=='relatedBtn').length>0"
                  ></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 底部 -->
        <div v-if="total>0" class="prfooter resource_prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterleft">
            <el-checkbox v-model="checkedAll" @change="changeStatus">全选</el-checkbox>
            <span class="marginLeft" @click="batchAudit">批量审核</span>
            <!--更多-->
            <el-popover placement="right" width="150" trigger="click">
              <p @click="batchUpdatePrice">批量修改价格</p>
              <p @click="batchUpdateType">批量修改分类</p>
              <p @click="batchDel">批量删除</p>
              <span class="marginLeft" slot="reference">更多</span>
            </el-popover>
            <!--更多-->
          </div>
          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" :pageNum="querylist.pageNum" :pageSize="querylist.pageSize" @currentPage="currentPageFun"></pagination>
          </div>
        </div>
      </div>
    </el-main>

    <!--审核对话框-->
    <el-dialog title="批量审核" :visible.sync="auditDialog" class="auditDialog backgroundDialog dialog460">
      <el-form :model="auditForm">
        <el-form-item label="审核状态：">
          <el-radio-group v-model="auditForm.auditStatus" @change="changeAudit">
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmAudit" type="primary">确 定</el-button>
        <el-button @click="auditDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--导入音频对话框-->
    <el-dialog title="导入动画" :visible.sync="importDialog" @close="closeImport" class=" middle backgroundDialog dialog460">
      <p class="info">操作提示：单次上传最多10个文件，全部上传完成前请勿关闭窗口，避免数据丢失！</p>

      <el-upload
        class="upload-demo"
        :action="`${domain}/zuul${requestPath.file}${uploadPath}/info`"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-exceed="exceedLimit"
        :limit="10"
        multiple
        accept='.avi,.wmv,.rmvb,.mp4,.mov,.flv'
        :file-list="fileList"
        :on-change="changeList"
        :auto-upload="false"
        ref="uploadDom"
      >
        <el-button size="small" type="primary">选择文件(可多选)</el-button>
      </el-upload>
      <el-form :model="importForm" style="margin-top:20px" label-width="82px" :rules="rules">
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
        <div class="dialogbtns dialog-footer">
          <el-button type="primary" @click="importAll" :loading="loadingAudio">全部上传</el-button>
          <el-button @click="cancelImport">全部取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--批量修改价格-->
    <el-dialog
      title="批量修改价格"
      :visible.sync="updatePriceDialog"
      class="backgroundDialog updatePriceDialog dialog460"
      @close="closePrice"
    >
      <el-form :model="updatePriceForm" ref="priceForm">
        <el-form-item
          label="定价"
          :rules="[{ required: true, message: '请输入价格',trigger: 'blur'},{pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,message:'价格最多只能保留两位小数'}]"
          prop="price"
        >
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
    <el-dialog title="批量删除" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog dialog460">
      <p>确定要删除选择的资源吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDel" type="primary">确 定</el-button>
        
        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--修改分类-->
    <el-dialog title="修改分类" :visible.sync="typeDialog" class="updatePriceDialog backgroundDialog dialog460">
      <treeselect
        v-model="treeSelectValue"
        :multiple="true"
        placeholder="请选择"
        :flat="true"
        :loadOptions='loadOptions'
        :auto-load-root-options="false"
        :options="treeSelectOptions"
        data-vv-scope="baseInfo"
        :normalizer="normalizer"
        v-validate="'required'"
        @select="selectFun"
        @deselect="deselectFun"
      />
      <div slot="footer" class="dialog-footer specialFooter">
        <el-button @click="confirmType" type="primary">确 定</el-button>
        <el-button @click="typeDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import {
  updateTypeAPI
} from "@/api/resource/common";
import {
  getListAPI,
  importAnimationAPI,
  batchingAuditAPI,
  batchingUpdatePriceAPI,
  batchDeleteAPI,
  getTreeAPI
} from "@/api/resource/animation";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm,
  returnMsg,
  getFileSize
} from "@/utils/publicFunctions";
import pagination from "../components/pagination";
import "@/styles/resource.scss";
import store from "@/store";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "animation_store",
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
      treeSelectValue: null,
      treeSelectOptions: [],
      typeDialog: false, //分类
      typeform: {
        ids: [],
        diyTypeCode: [],
        diyTypeId: [],
        objectType:8
      },
      authBtns: [],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      fileList: [],
      typelist: [],
      timeLimit: null,
      activeName: "first",
      checkedAll: false, //所有图片全选
      checkedAllRecorded: false, //已录入全选
      checkedAllPass: false, //已通过全选
      checkedAllUnpass: false, //未通过全选
      listLoading: true,
      list: [], //所有动画
      checkedList: {}, //选中的列表
      hideFlag: false, //默认展开
      auditDialog: false,
      importDialog: false,
      updatePriceDialog: false,
      deleteDialog: false,
      updateTypeDialog: false,
      loadingAudio: false,
      auditForm: {
        auditStatus: 1
      },
      importForm: {
        diyTypeCode: "02",
        diyTypeId: "01",
        keywords: "",
        names: [],
        price: "",
        size: [],
        source: "",
        synopsis: "",
        timeLength: [],
        resourceIds: [],
        token: []
      },
      updatePriceForm: {
        ids: [],
        price: ""
      },
      updateTypeForm: {
        type: ""
      },
      navTree: [],
      defaultProps: {
        children: "list",
        label: "showName"
      },

      querylist: {
        diyTypeId: null,
        name: null,
        source: null,
        dataSource: null,
        bookName: null,
        status: null,
        beginTime: null,
        endTime: null,
        diyTypeCode: null,
        pageNum: 1,
        pageSize: 50,
        orderBy: null
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
      rules: {
        price: [{ required: false, validator: price}],
        source:[{max:30,message:'来源长度不可超过30'}],
        keywords:[{max:100,message:'关键字长度不可以超过100'}]
      }
    };
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
    //解决索引只排序当前页的问题,增加函数自定义索引序号
    indexSet(index){
      return (this.querylist.pageNum-1)*this.querylist.pageSize+index+1;
    },
    //排序
    sortChanged(column, prop, order) {
      if (column.prop == "price" && column.order == "ascending") {
        this.querylist.price = "asc";

        this.querylist.uploadTime = "";
      } else if (
        column.prop == "price" &&
        column.order == "descending"
      ) {
        this.querylist.price = "desc";

        this.querylist.uploadTime = "";
      } else if (column.prop == "uploadTime" && column.order == "ascending") {
        this.querylist.price = "";

        this.querylist.uploadTime = "asc";
      } else if (column.prop == "uploadTime" && column.order == "descending") {
        this.querylist.price = "";

        this.querylist.uploadTime = "desc";
      }
      this.getList();
    },
    //确认修改分类
    confirmType() {
      if(!this.treeSelectValue){
        this.$message.warning('请选择分类')
      }else{
        this.typeform.ids = this.multipleSelection.map(item => item.id);
        updateTypeAPI(this.typeform).then(res => {
          if (res.data.status) {
            operationMsg.apply(this, [res.data, `批量修改`]);
            this.typeDialog = false;
          }
        });
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
    loadOptions({ action, parentNode, callback }){//此处可以懒加载，去掉loadOptions警告；
      callback();
    },
    getTree() {
      getTreeAPI(8).then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },
    handlePreview(file) {},
    handleRemove(file, fileList) {
      this.importForm.names.forEach( (res,index) => {
        if(file.name==res){
          this.importForm.names.splice(index,1)
          this.importForm.size.splice(index,1)        
          this.importForm.token.splice(index,1)
          this.importForm.timeLength.splice(index,1)
        }
      })
    },
    handleSuccess(res, file, fileList) {
      this.acount+=1;
      if(res.data){
        this.importForm.size.push(res.data.size);
        this.importForm.names.push(file.name);
        this.importForm.token.push(res.data.fileName);
        this.importForm.timeLength.push(res.data.time)
      }else{
        this.$message.warning(file.name+'已存在');
        this.$refs['uploadDom'].uploadFiles.forEach((item,index)=>{//删除上传过的文件
          if(item.name==file.name){
            this.$refs['uploadDom'].uploadFiles.splice(index,1);
            this.acount-=1;
          }
        })
      }
      if(this.acount==this.$refs['uploadDom'].uploadFiles.length){//文件上传完毕时
          if (this.importForm.names.length > 0) {         
          this.importForm.price = Number(this.importForm.price);
          this.importForm.diyTypeId = this.querylist.diyTypeId;
          this.importForm.diyTypeCode = this.querylist.diyTypeCode;
          importAnimationAPI(this.importForm).then(res => {
            operationMsg.apply(this, [res.data, `批量导入`]);
            this.fileList = [];
          });
          this.importDialog = false;
          this.loadingAudio = false;
        } else if (this.importForm.names.length == 0) {
          return
        }
      }
    },
    changeList(file,fileList){
      this.fileNum=fileList.length;
      if(this.fileNum==0){//全部上传已上传的文件，即没有文件时，再次打开上传按钮,
        this.loadingAudio=false;
      }
    },
    exceedLimit() {
      this.$message.error("单次最多可上传10个文件");
    },
    // 导入动画
    importAnimation() {
      var code = this.querylist.diyTypeCode;
      if (code) {
        this.importDialog = true;
      } else {
        this.$message.warning("请先选择自定义分类!");
      }
    },
    // 全部导入动画
    importAll() {
      if(this.$refs['uploadDom'].uploadFiles.length<=0){//判断是否选择文件了
        this.$message.warning('请选择文件');
        return false;
      }
      this.$message.warning('上传中,请耐心等待');
      this.$refs['uploadDom'].submit()
      this.acount=0;
      this.loadingAudio = true;
    },
    //全部取消
    cancelImport() {
      this.fileList = [];
      this.loadingAudio = false;
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
      this.acount=0;
    },
    //关闭
    closeImport(){
      this.importDialog = false;
      this.loadingAudio = false;
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
      this.acount=0;
    },
    // 上传删除图片
    imgListDel(index) {
      this.importForm.imglist.slice(index, 1);
    },
    //添加
    addPicture() {
      this.$router.push({
        name: "add_pic"
      });
    },
    //所有图片全选
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
    // 所有图片批量审核
    batchAudit() {
      if (this.multipleSelection.length > 0) {
        this.auditDialog = true;
        this.batchData.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //确认审核
    confirmAudit() {
      batchingAuditAPI(this.batchData).then(res => {
        if(res.data.code==0){
          this.$message.success('提交审核成功')
          this.getList()
        }else if(res.data.code==-7){
          this.$message.warning('审核通过的数据不可再修改状态')
        }else{
          operationMsg.apply(this, [
            res.data,
            `批量审核${this.batchData.ids.length}项`
          ]);
        }
      });
      this.auditDialog = false;
    },
    // 确认修改价格
    confirmUpdatePrice() {
      this.$refs["priceForm"].validate(valid => {
        if (valid) {
          if (isNaN(this.updatePriceForm.price) == true) {
            this.$message.warning("请输入数字，最多只能保留两位小数");
            return;
          } else {
            batchingUpdatePriceAPI(this.updatePriceForm).then(res => {
              operationMsg.apply(this, [res.data, `批量修改`]);
            });
            this.updatePriceDialog = false;
          }
        }
      });
    },
    //关闭修改价格
    closePrice() {
      this.$refs["priceForm"].resetFields();
      this.updatePriceForm = {
        ids: [],
        price: ""
      };
    },
    //确认删除
    confirmDel() {
      batchDeleteAPI(this.batchId).then(res => {
        operationMsg.apply(this, [res.data, `批量删除`]);
      });
      this.deleteDialog = false;
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
    //检索
    onSubmit() {
      if (this.timeLimit) {
        this.querylist.beginTime = this.timeLimit[0];
        this.querylist.endTime = this.timeLimit[1];
      } else {
        this.querylist.beginTime = null;
        this.querylist.endTime = null;
      }
      this.getList();
    },
    //重置
    onReset() {
      this.timeLimit = [];
      this.querylist = {
        pageNum: 1,
        status: this.querylist.status,
        pageSize: this.querylist.pageSize
      };
      this.getList();
    },
    onHide() {
      this.hideFlag = !this.hideFlag;
    },
    handleClick(tab, event) {
      this.currentPageFun(1);
      if (tab.index == "0") {
        this.querylist.status = null;
      } else if (tab.index == "1") {
        this.querylist.status = 0;
      } else if (tab.index == "2") {
        this.querylist.status = 1;
      } else if (tab.index == "3") {
        this.querylist.status = 2;
      }
      this.getList();
    },
    //多选框发生变化时
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 翻页
    pagesizeFun(val) {
      this.querylist.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.querylist.pageNum = val;
      this.getList();
    },

    handleNodeClick(data) {
      //点击树节点获取table数据
      this.querylist.diyTypeId = data.id;
      this.querylist.diyTypeCode = data.code;
      this.getList();
    },
    // 左侧自定义分类
    getNav() {
      getTreeAPI(8).then(res => {
        res.data.data = [{ showName: "全部" }].concat(res.data.data);
        res.data.code == 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
    },
    //所有动画
    getList() {
      getListAPI(this.querylist).then(res => {
        if (res.status) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
          res.data.data.list.forEach((back, index) => {
            res.data.data.list[index].uploadTime = back.uploadTime.substring(0,10);
            res.data.data.list[index].size = getFileSize(back.size)
          });
        } else {
          errorMsg.apply(this, [res.data, `获取表格数据`]);
        }
        this.listLoading = false;
      });
    }
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    this.getNav();
    this.getList();
  },
  activated() {
    this.getList();//缓存操作的新增编辑时，要更新数据
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  components: { pagination, Treeselect }
};
</script>
<style scoped>
.plan-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  box-sizing: border-box;
  padding-left: 1px;
  flex-basis: auto;
  height: calc(100vh - 50px);
}
.planLeft {
  width: 199px;
  height: 920px;
  background-color: #fff;
  border-right: 1px solid #ddd;
}
.planright {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 44px 30px 30px 30px;
}
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
  margin-right: 3px;
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
/* .dialog458 .el-input {
  width: 130px;
}

.dialog458 .el-form-item {
  width: 200px;
  display: inline-block;
  margin-bottom: 5px;
} */
.info {
  margin: 0;
}
.project-plan .upload-demo {
  display: inline-block;
}
.tablelist {
  background: #fff;
  margin-top: 10px;
  z-index: 1;
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
  margin: 0 auto;
}
.project-plan .el-tabs--border-card {
  -webkit-box-shadow: none;
  box-shadow: none;
}
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
.project-plan .updatePriceDialog .el-dialog {
  width: 458px;
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
/*  .project-plan .formlist .el-form-item {
  margin: 0;
  display: inline-block;
  margin-right: 48px;
  vertical-align: top;
  margin-bottom: 14px;
} */ 
/* .project-plan .width90 .el-form-item__content {
  margin-left: 0 !important;
}
.project-plan .formlist .el-button.search {
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

.project-plan .el-table__header-wrapper th {
  background: #fff;
}
.dialog458 .el-dialog {
  width: 458px;
}
</style>

