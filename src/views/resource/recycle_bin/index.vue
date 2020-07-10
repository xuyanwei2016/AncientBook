<template>
  <el-container class="project-plan">
    <el-aside class="tree-aside" :data="navTree">
      <el-tree
        :data="navTree"
        :highlight-current="true"
        :props="defaultProps"
        @node-click="handleNodeClick"
        default-expand-all
        :expand-on-click-node="false"
      ></el-tree>
    </el-aside>

    <el-main>
      <div class="buttons">
        <el-button type="primary" @click="batchRestore" v-if="authBtns.filter(i => i.idName=='batchBack').length>0">批量还原</el-button>
        <el-button type="primary" @click="batchDel" v-if="authBtns.filter(i => i.idName=='delBtn').length>0">彻底删除</el-button>
        <el-button type="primary" @click="allEmpty" v-if="authBtns.filter(i => i.idName=='clearBtn').length>0">全部清空</el-button>
      </div>

      <div class="formlist">
        <el-form inline class="form-inline" label-width="82px">
          <el-form-item label="资源名称">
            <el-input @keyup.enter.native="onSubmit" v-model="listQuery.name"></el-input>
          </el-form-item>
          <el-form-item label="上传时间">
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
          <el-form-item class="width90">
            <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search">检索</el-button>
            <el-button type="primary" plain @click="onReset">重置</el-button>
          </el-form-item>
          <!-- <el-form-item>
                      <el-button type="primary" @click="onSubmit">检索</el-button>
                      <el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>-->
        </el-form>
      </div>

      <div class="tablelist">
        <el-table
          border
          @sort-change="sortChanged"
          v-loading="listLoading"
          element-loading-text="给我一点时间"
          ref="multipleTable1"
          :data="list"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" align="center" :index="indexSet"></el-table-column>
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column label="资源名称" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="资源类型" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{typeList[scope.row.resourceType]}}</span>
            </template>
          </el-table-column>

          <el-table-column label="作者" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">{{scope.row.author}}</template>
          </el-table-column>
          <el-table-column label="售价" prop="sellingPrice" sortable="custom" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.priceType==1&&scope.row.sellingPrice">￥{{scope.row.sellingPrice.toFixed(2)}}</span>
              <span v-if="scope.row.priceType==2">免费</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" sortable="custom" align="center">
            <template slot-scope="scope">{{scope.row.createTime}}</template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0">已录入</span>
              <span v-if="scope.row.status==1">审核通过</span>
              <span v-if="scope.row.status==2">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
            <template slot-scope="scope">
                <i
                 @click="toDetails(scope.row)"
                  v-if="authBtns.filter(i => i.idName=='detailBtn').length > 0"
                  class="edit distance"
                  :class="authBtns.filter(i => i.idName=='detailBtn')[0].icon"
                  :title="authBtns.filter(i => i.idName=='detailBtn')[0].name"
                ></i>
                <i
                  @click="toRelative(scope.row)"
                  v-if="authBtns.filter(i => i.idName=='relevanceBtn').length > 0"
                  class="link distance"
                  :class="authBtns.filter(i => i.idName=='relevanceBtn')[0].icon"
                  :title="authBtns.filter(i => i.idName=='relevanceBtn')[0].name"
                ></i>
             
              <!-- <router-link :to="`recycle_bin/create?id=${scope.row.id}`"><i class="search distance"></i></router-link> -->
              <!-- <router-link :to="{ path: `recycle_bin/create`, query: {id:scope.row.id}}"><i class="search distance"></i></router-link> -->
              <!-- <router-link to="/resource/recycle_bin/relatedResource"><i class="link distance"></i></router-link> -->
            </template>
          </el-table-column>
        </el-table>

        <!-- 底部 -->
        <div v-if="total>0" class="prfooter resource_prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterleft">
            <el-checkbox v-model="checkedAll" @change="changeStatus">全选</el-checkbox>
            <!-- <span class="marginLeft" @click="exportExcel">导出Excel</span> -->
          </div>
          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" :pageNum="listQuery.pageNum" :pageSize="listQuery.pageSize" @currentPage="currentPageFun"></pagination>
          </div>
        </div>
      </div>
    </el-main>

    <!-- 批量删除-->
    <el-dialog title="批量删除" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog">
      <p>确定要删除选择的资源吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDel">确 定</el-button>
        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 批量还原 -->
    <el-dialog title="批量还原" :visible.sync="restoreDialog" class="backgroundDialog deleteDialog">
      <p>确定要还原选择的资源吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmRestore">确 定</el-button>
        <el-button @click="restoreDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 全部清空 -->
    <el-dialog title="全部清空" :visible.sync="allEmptyDialog" class="backgroundDialog deleteDialog">
      <p>确定要全部清空吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmEmpty">确 定</el-button>
        <el-button @click="allEmptyDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--批量导出-->
    <el-dialog
      title="批量导出"
      :visible.sync="exportExcelDialog"
      class="backgroundDialog exportExcelDialog"
    >
      <el-form ref="exportExportform" :model="exportExportform" label-width="82px">
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
        <el-form-item label="导出范围">
          <el-radio-group v-model="exportExportform.range">
            <el-radio label="全部数据" value="0"></el-radio>
            <el-radio label="选中数据" value="1"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmExport" class="leadActive">导出</el-button>
        <el-button @click="exportExcelDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>


<script>
import {
  getNavAPI,
  excelExportAPI,
  exportListAPI,
  getTypeAPI
} from "@/api/resource/common";
import {
  getListAPI,
  batchDelAPI,
  batchRestoreAPI,
  allEmptyAPI
} from "@/api/resource/recycle";
import { getMultipleSelectionIDs } from "@/filters/getIds";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm
} from "@/utils/publicFunctions";
import pagination from "../components/pagination";
import "@/styles/resource.scss";
import store from "@/store";
import queryString from "query-string";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
export default {
  name:"recycle_bin",
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      isIndeterminate: false,
      checkAllWords: false,
      authBtns: [],
      fileList: [],
      typeList: null,
      navTree: [],
      timeLimit: null,
      list: null,
      total: null,
      checkedAll: false, //全选
      listLoading: true,
      hideFlag: false, //默认收起
      exportExcelDialog: false,
      deleteDialog: false, //批量删除对话框
      restoreDialog: false, //批量还原对话框
      allEmptyDialog: false, //全部清空对话框
      exportExportform: {
        words: [],
        range: ""
      },
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

      defaultProps: {
        children: "list",
        label: "showName"
      },

      querylist: {
        name: null,
        source: null,
        bookName: null,
        status: null,
        beginTime: null,
        endTime: null,
        diyTypeCode: null,
        pageNum: 1,
        pageSize: 20,
        orderBy: null
      },

      listQuery: {
        pageNum: 1,
        pageSize: 50
      },
      multipleSelection: [],
      //批量审核
      batchData: {
        id: [],
        status: 1
      },
      //   batchId:[],
      ids: [],
      total: 100,
      pagesize: 30,
      currentPage: 1,
      rangeExcelList: {
        objectIds: [],
        isDelete: 1,
        names: null,
        resourceType: 1
      },
      excelListData: {},
      excelListItems: [],
      arrayWordsAll: [],
      linkList:{
        1:'book_store/addBookResource?type=view&id=',
        2:'article/add_article?type=view&detailsId=',
        5:'picture_store/add_pic?type=view&id=',
        6:'video_store/add_video?type=view&id=',
        7:'audio_store/add_audio?type=view&id=',
        8:'animation_store/add_animation?type=view&id=',
        9:'courseware/create?type=view&id=',
        10:'statute/create?type=view&id=',
        14:'clause/add_clause?type=view&id=',
        15:'pdf/create?type=view&id=',
        16:'expert/create?type=view&id='
      },
      linkRelatedList:{
        1:'book_store/relatedResource',
        2:'article/relatedResource',
        5:'picture_store/relatedResource',
        6:'video_store/relatedResource',
        7:'audio_store/relatedResource',
        8:'animation_store/relatedResource',
        10:'statute/relatedResource',
        14:'clause/related_res',
        15:'pdf/relatedResource'      
      }
    };
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
  },
  mounted() {
    this.getNav();
    this.getType();
    this.getList();
  },
  activated() {
    this.getList();//缓存操作的新增编辑时，要更新数据
  },
  methods: {
    //解决索引只排序当前页的问题,增加函数自定义索引序号
    indexSet(index){
      return (this.listQuery.pageNum-1)*this.listQuery.pageSize+index+1;
    },
    //详情页面
    toDetails(row){
      this.$router.push('/resource/'+this.linkList[row.resourceType]+row.objectId)
    },
    //相关资源
    toRelative(row){
      this.$router.push('/resource/'+this.linkRelatedList[row.resourceType]+'?id='+row.objectId+'&name='+row.name)
    },
    //资源类型列表
    getType() {
      getTypeAPI().then(res => {
        if (res.data.code == 0) {
          this.typeList = res.data.data;
        }
      });
    },
    //排序
    sortChanged(column, prop, order) {
      if (column.prop == "sellingPrice" && column.order == "ascending") {
        this.listQuery.price = "asc";

        this.listQuery.createTime = "";
      } else if (
        column.prop == "sellingPrice" &&
        column.order == "descending"
      ) {
        this.listQuery.price = "desc";

        this.listQuery.createTime = "";
      } else if (column.prop == "createTime" && column.order == "ascending") {
        this.listQuery.price = "";

        this.listQuery.createTime = "asc";
      } else if (column.prop == "createTime" && column.order == "descending") {
        this.listQuery.price = "";

        this.listQuery.createTime = "desc";
      }
      this.getList();
    },
    handleCheckedWordsChange(value) {
      let checkedCount = value.length;
      this.checkAllWords = checkedCount == this.arrayWordsAll.length;
      console.log(this.arrayWordsAll.length, checkedCount);
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.arrayWordsAll.length;
    },
    handleCheckAllWordsChange(val) {
      this.exportExportform.words = val ? this.arrayWordsAll : [];
      this.isIndeterminate = false;
    },
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if (res.data.code == 0) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
          this.listLoading = false;
          res.data.data.list.forEach((back, index) => {
            if (res.data.data.list[index].createTime) {
              res.data.data.list[index].createTime = back.createTime.substring(
                0,
                10
              );
            }
          });
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    // 确认导出
    confirmExport() {
      if (this.exportExportform.range == "0") {
        this.rangeExcelList.objectIds = [];
        this.rangeExcelList.names = this.arrayWordsAll.join(",");
      } else {
        this.rangeExcelList.objectIds = this.multipleSelection
          .map(item => item.objectId)
          .join(",");
        this.rangeExcelList.names = this.exportExportform.words.join(",");
        console.log(this.rangeExcelList.objectIds);
      }
      this.excelListData = queryString.stringify(this.rangeExcelList);

      window.open(
        `${process.env.BASE_API}${requestPath.resource}/public/export?${
          this.excelListData
        }`
      );
    },

    // 左侧自定义分类
    getNav() {
      getNavAPI().then(res => {
        res.data.data = [{ showName: "全部" }].concat(res.data.data);
        res.data.code == 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
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

    // 批量还原
    batchRestore() {
      if (this.multipleSelection.length > 0) {
        this.restoreDialog = true;
        this.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },

    // 确认还原
    confirmRestore() {
      batchRestoreAPI(this.ids).then(res => {
        operationMsg.apply(this, [res.data, `批量还原`]);
        this.getList();
      });
      this.restoreDialog = false;
    },

    // 全部清空
    allEmpty() {
      this.allEmptyDialog = true;
    },

    // 确认清空
    confirmEmpty() {
      allEmptyAPI().then(res => {
        if (res.data.code == 0) {
          this.getList();
        }
        operationMsg.apply(this, [res.data, `全部清空`]);
      });
      this.allEmptyDialog = false;
    },

    //批量删除
    batchDel() {
      if (this.multipleSelection.length > 0) {
        this.deleteDialog = true;
        this.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },

    //确认删除
    confirmDel() {
      batchDelAPI(this.ids).then(res => {
        if (res.data.code == 0) {
          this.getList();
        }
        operationMsg.apply(this, [res.data, `批量删除`]);
      });
      this.deleteDialog = false;
    },

    // 批量审核
    batchAudit() {
      if (this.multipleSelection.length > 0) {
        this.auditDialog = true;
        this.batchData.id = this.multipleSelection.map(item => item.id);
        console.log(this.batchData.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //确认审核
    confirmAudit() {
      console.log(this.batchData.status);
      batchingAuditAPI(this.batchData).then(res => {
        operationMsg.apply(this, [
          res.data,
          `批量审核${this.batchData.id.length}项`
        ]);
      });
      this.auditDialog = false;
    },

    // 修改审核状态
    changeAudit(val) {
      if (val == "1") {
        this.batchData.status = 1;
      } else {
        this.batchData.status = 2;
      }
    },
    // //批量修改价格
    // batchUpdatePrice(){
    //   if(this.multipleSelection.length>0){
    //     this.updatePriceDialog=true
    //     this.updatePriceForm.ids=this.multipleSelection.map(item => item.id)
    //   }else{
    //     this.$message.warning('请先选择需要操作的条目')
    //   }

    // },

    // //修改价格状态
    // updatePrice(val){
    //   this.updatePriceForm.priceType=val
    // },
    //检索
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
        console.log(res);
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
      this.getList();
    },
    onHide() {
      this.hideFlag = !this.hideFlag;
    },
    handleClick(tab, event) {},
    //多选框发生变化时
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 分页
    pagesizeFun(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    handleNodeClick(data) {
      //console.log(data);
      this.listQuery.diyTypeId = data.id;
      this.listQuery.diyTypeCode = data.code;
      this.excelListData.diyTypeId = data.id;
      this.excelListData.diyTypeCode = data.code;
      this.getList();
    }
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  components: { pagination }
};
</script>
<style scoped>
.searching_a {
  background: #409eff;
  border: 1px solid #409eff;
  border-radius: 5px;
}
.reset_a {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
  border-radius: 5px;
}
.reset_a:hover {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
  border-radius: 5px;
}
.el-tree {
  height: calc(100vh - 140px);
}
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
  background-color: #fff;
  margin-top: 10px;
}

.tablelist .edit {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/search.png") no-repeat;
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
.backgroundDialog .leadActive {
  background: #409eff;
  color: white;
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
.exportExcelDialog .el-dialog {
  width: 506px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -253px;
  margin-top: -220px !important;
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