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
        <router-link :to="{ path: `expert/create`}" style="margin-right:10px">
          <el-button type="primary" v-if="authBtns.filter(i => i.idName=='addBtn').length>0">
            <i class="add"></i>添加
          </el-button>
        </router-link>
        <el-button
          type="primary"
          @click="batchDel"
          v-if="authBtns.filter(i => i.idName=='batchDelBtn').length>0"
        >批量删除</el-button>
      </div>

      <div class="formlist">
        <el-form inline class="form-inline" label-width="82px">
          <el-form-item label="姓名">
            <el-input @keyup.enter.native="onSubmit" v-model="listQuery.name"></el-input>
          </el-form-item>
          <el-form-item label="机构名称">
            <el-input @keyup.enter.native="onSubmit" v-model="listQuery.institutionName"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
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
        </el-form>
      </div>

      <div class="tablelist">
        <template>
          <el-tabs v-model="activeName" type="border-card" @tab-click="statusChange">
            <el-tab-pane label="所有作者" name="first"></el-tab-pane>
            <el-tab-pane label="已录入" name="second"></el-tab-pane>
            <el-tab-pane label="审核通过" name="third"></el-tab-pane>
            <el-tab-pane label="审核未通过" name="fourth"></el-tab-pane>
          </el-tabs>
        </template>
        <div class="table_outer_wrap">
          <el-table
            border
            v-loading="listLoading"
            element-loading-text="给我一点时间"
            ref="multipleTable1"
            :data="list"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
            @sort-change="sortChanged"
            :default-sort = "{prop: 'date', order: 'descending'}"
          >
            <el-table-column type="index" align="center" :index="indexSet"></el-table-column>
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="姓名" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.name}}</template>
            </el-table-column>
            <el-table-column label="机构名称" align="center" :show-overflow-tooltip="true">
              <template slot-scope="scope">{{scope.row.institutionName}}</template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="date" sortable="custom">
              <template slot-scope="scope">{{scope.row.createTime}}</template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==0">已录入</span>
                <span v-if="scope.row.status==1">审核通过</span>
                <span v-if="scope.row.status==2">审核未通过</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <router-link :to="{ path: `expert/create`, query: {id: scope.row.id}}">
                  <i
                    class="edit distance"
                    title="编辑"
                    v-if="authBtns.filter(i => i.idName=='editBtn').length>0"
                  ></i>
                </router-link>
                <router-link :to="{ path: `expert/create`, query: {detailsId:scope.row.id,type:'view'}}">
                  <i
                    class="search distance"
                    title="查看"
                    v-if="authBtns.filter(i => i.idName=='viewBtn').length>0"
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
          </div>

          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" :pageNum="listQuery.pageNum" :pageSize="listQuery.pageSize" @currentPage="currentPageFun" ></pagination>
          </div>
        </div>
      </div>

     
    </el-main>

    <!--批量审核对话框-->
    <el-dialog title="批量审核" :visible.sync="auditDialog" class="auditDialog backgroundDialog dialog460">
      <el-form :model="batchData">
        <el-form-item label="审核状态：">
          <el-radio-group v-model="batchData.status" @change="changeAudit">
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

    <!--批量修改价格-->
    <!-- <el-dialog title="批量修改价格" :visible.sync="updatePriceDialog" class="backgroundDialog updatePriceDialog">
        <el-form :model="updatePriceForm">
            <el-form-item label="统一售价：" style="margin-bottom:0px;">
                <el-radio-group  v-model="updatePriceForm.priceType" @change="updatePrice">
                    <el-radio :label="1">付费</el-radio>
                    <el-radio :label="2">免费</el-radio>
                </el-radio-group>
                <el-input type="text" v-model="updatePriceForm.sellingPrice" style="width:200px;" v-show="updatePriceForm.priceType==1"/>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="confirmUpdatePrice">确 定</el-button>
            <el-button @click="updatePriceDialog = false">取 消</el-button>
        </div>
    </el-dialog>-->
    <!-- 批量删除-->
    <el-dialog title="批量删除" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog dialog460">
      <p>确定要删除选择的资源吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmDel">确 定</el-button>
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
  </el-container>
</template>


<script>
import { getTreeAPI } from "@/api/resource/common";
import {
  getListAPI,
  batchingAuditAPI,
  batchingDelAPI
} from "@/api/resource/expert";
import { batchingUpdatePriceAPI } from "@/api/resource/pdf";
import { getMultipleSelectionIDs } from "@/filters/getIds";
// import { getPicList,batchingUpdatePriceAPI } from "@/api/resourcenew/picture";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm,
  returnMsg
} from "@/utils/publicFunctions";
import pagination from "../components/pagination";
import "@/styles/resource.scss";
import store from "@/store";
export default {
  name:"expert",
  data() {
    return {
      authBtns: [],
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
      batchId: [],
      total: 100,
      pagesize: 30,
      currentPage: 1
    };
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    this.getNav();
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
    //排序
    sortChanged(column, prop, order ){
      console.log(column);
      if(column.prop=="date"&&column.order=="ascending"){
        this.listQuery.createTime='asc'
      }else if(column.prop=="date"&&column.order=="descending"){
        this.listQuery.createTime='desc'
      }
      this.getList()
    },
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if (res.data.code == 0) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
          res.data.data.list.forEach( (back,index) =>{
            if(res.data.data.list[index].createTime){
              res.data.data.list[index].createTime = back.createTime.substring(0,10) 
            }
            
          })
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    // 左侧自定义分类
    getNav() {
      getTreeAPI(16).then(res => {
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
    // 批量审核
    batchAudit() {
      if (this.multipleSelection.length > 0) {
        this.auditDialog = true;
        this.batchData.id = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //确认审核
    confirmAudit() {
      batchingAuditAPI(this.batchData).then(res => {
        operationMsg.apply(this, [
          res.data,
          `批量审核${this.batchData.id.length}项`
        ]);
        if (res.data.code == 0) {
          this.auditDialog = false;
        } else {
          this.auditDialog = true;
        }
      });
    },

    // 确认修改价格
    // confirmUpdatePrice(){
    //   batchingUpdatePriceAPI(this.updatePriceForm).then(res=>{
    //      operationMsg.apply(this,[res.data.code,`批量修改`])
    //   })
    //   this.updatePriceDialog=false
    // },

    //确认删除
    confirmDel() {
      batchingDelAPI(this.batchId).then(res => {
        returnMsg.apply(this, [res.data, `批量删除`]);
        this.getList();
      });
      this.deleteDialog = false;
    },

    // 修改审核状态
    changeAudit(val) {
      // if(val == '1'){
      //   this.batchData.status = 1
      // }else{
      //    this.batchData.status = 2
      // }
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
    //批量删除
    batchDel() {
      if (this.multipleSelection.length > 0) {
        this.deleteDialog = true;
        this.batchId = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },

    // //修改价格状态
    // updatePrice(val){
    //   this.updatePriceForm.priceType=val
    // },
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
      //点击树节点获取table数据
      this.listQuery.diyTypeId = data.id;
      this.listQuery.diyTypeCode = data.code;
      this.getList();
    },
    // 切换列表状态
    statusChange(tab, event) {
      this.currentPageFun(1);//初始化分页为第一页
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
.searching_a{
  background:#409eff;
  border:1px solid #409eff;
  border-radius: 5px;
}
.reset_a{
  color: #409EFF;
  background: #ecf5ff;
  border-color: #b3d8ff;
  border-radius: 5px;
}
.reset_a:hover {
  background: #409EFF;
  border-color: #409EFF;
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