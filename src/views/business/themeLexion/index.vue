<template>
  <el-container class="project-plan">
    <div class="app-container">
      <div class="buttons" style="border:none">
        <el-button v-if="authBtns.map(i => i.idName).indexOf('importBtn') >= 0" @click="importBtn">
          {{authBtns.filter(i => i.idName=='importBtn')[0].name}}
          <i
            v-if="authBtns.filter(i => i.idName=='importBtn').length>0 && authBtns.filter(i => i.idName=='importBtn')[0].icon"
            :class="[authBtns[authBtns.map(i => i.idName).indexOf('importBtn')].icon, 'el-icon--right']"
          ></i>
        </el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0" @click="addBtn">
          {{authBtns.filter(i => i.idName=='addBtn')[0].name}}
          <i
            v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon"
            :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"
          ></i>
        </el-button>

        <!-- <el-button
        v-if="authBtns.map(i => i.idName).indexOf('deletAllBtn') >= 0"
        @click="deletAllBtn"
      >
        {{authBtns.filter(i => i.idName=='deletAllBtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='deletAllBtn').length>0 && authBtns.filter(i => i.idName=='deletAllBtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('deletAllBtn')].icon, 'el-icon--right']"
        ></i>
        </el-button>-->
      </div>
      <el-form inline class="form-inline formStyle" style="border:none">
        <el-form-item label="检索信息">
          <el-input v-model="listQuery.chineseRoot" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="search" @click="handleFilter" icon="el-icon-search">检索</el-button>
        </el-form-item>
      </el-form>
      <div class="tablelist">
        <template>
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="所有主题词" name="first"></el-tab-pane>
            <el-tab-pane label="已录入" name="second"></el-tab-pane>
            <el-tab-pane label="审核通过" name="third"></el-tab-pane>
            <el-tab-pane label="审核未通过" name="fourth"></el-tab-pane>
          </el-tabs>
        </template>
        <div class="table_outer_wrap">
          <el-table
            :key="tableKey"
            @sort-change="sortChanged"
            ref="multipleTable1"
            :data="list"
            v-loading="listLoading"
            element-loading-text="给我一点时间"
            border
            highlight-current-row
            stripe
            @selection-change="chioceList"
            :default-sort="{prop: 'date', order: 'descending'}"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" align="center"></el-table-column>
            <el-table-column label="中文词根" min-width="160" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.chineseRoot}}</span>
              </template>
            </el-table-column>
            <el-table-column label="中文同义词" min-width="180" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.chineseSynonym}}</span>
              </template>
            </el-table-column>
            <el-table-column label="词条属性" min-width="120" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.belong}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="上传时间"
              prop="uploadTime"
              min-width="140"
              align="center"
              sortable="costum"
            >
              <template slot-scope="scope">
                <span>{{scope.row.uploadTime}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态"  min-width="120" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status===0">待审核</span>
                <span v-if="scope.row.status===1">审核通过</span>
                <span v-if="scope.row.status===2">审核未通过</span>
              </template>
            </el-table-column>
            <el-table-column
              class-name="small-padding fixed-width"
              label="操作"
              width="200"
              align="center"
            >
              <template slot-scope="scope">
                <router-link :to="`themeLexicon/add?id=${scope.row.id}&type=update`">
                  <i
                    :title="authBtns.filter(i => i.idName=='editBtn')[0].name"
                    :class="authBtns.filter(i => i.idName=='editBtn')[0].icon"
                    v-if="authBtns.filter(i => i.idName=='editBtn').length>0"
                  ></i>
                </router-link>
                <router-link :to="`themeLexicon/add?id=${scope.row.id}&type=view`">
                  <i
                    :title="authBtns.filter(i => i.idName=='viewBtn')[0].name"
                    :class="authBtns.filter(i => i.idName=='viewBtn')[0].icon"
                    v-if="authBtns.filter(i => i.idName=='viewBtn').length>0"
                  ></i>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog
          title="导入Excel"
          :visible.sync="importExcDialog"
          class="backgroundDialog importExcDialog"
          @close="closeExcel"
        >
          <p>请选择要导入的文件，文件类型只支持Excel。</p>
          <div class="importExc">
            <input
              type="file"
              ref="file"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            >
            <a
              class="fake-download"
              :href="`${domain}/file/templet/主题词导入模板.xlsx`"
            >下载模板文件</a>
          </div>
          <el-progress :percentage="percentageValue" :stroke-width="12" color="#67C23A"></el-progress>
          <div slot="footer" class="dialog-footer">
            <el-button @click="confirmImport">确 定</el-button>
            <el-button @click="importExcDialog = false">取 消</el-button>
          </div>
        </el-dialog>
        <!--批量删除-->
        <el-dialog title="批量删除" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog">
          <p>确定要删除选择的信息吗？</p>
          <div slot="footer" class="dialog-footer ">
            <el-button type="primary" @click="confirmDel">确 定</el-button>
            <el-button @click="deleteDialog = false">取 消</el-button>
          </div>
        </el-dialog>
        <!--审核对话框-->
        <el-dialog title="批量审核" :visible.sync="auditDialog" class="auditDialog backgroundDialog">
          <el-form :model="auditForm">
            <el-form-item label="审核状态：">
              <el-radio-group v-model="auditForm.auditStatus" @change="changeAudit">
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="2">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmAudit">确 定</el-button>
            <el-button @click="auditDialog = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="prfooter">
        <div class="prfooterleft">
          <el-checkbox v-model="checkedAll" @change="changeStatus">全选</el-checkbox>
          <span class="marginLeft" @click="batchAudit">批量审核</span>
          <el-popover placement="right" width="150" trigger="click">
            <p @click="exportExcel">导出EXCEL</p>
            <p @click="deleteTheme">批量删除</p>
            <span class="marginLeft" slot="reference">更多</span>
          </el-popover>
        </div>
        <div class="prfooterright">
          <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
        </div>
      </div>
      <!-- 底部 -->
      <!-- <div class="prfooter">
      <div class="prfooterright">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNum"
          :page-sizes="[30,50,100,200,500]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          align="center"
        ></el-pagination>
      </div>
      </div>-->
      <!-- 底部 -->
     
    </div>
  </el-container>
</template>



<script>
import {
  getListAPI,
  deleteAPI,
  batchDelAPI,
  batchingAuditAPI,
  exportAPI,
  importAPI
} from "@/api/business/theme";
import {
  requestMsg,
  confirm,
  checkSelect,
  operationMsg
} from "@/utils/publicFunctions";
import { getMultipleSelectionIDs, removeDuplicates } from "@/filters/getIds";
import Cookies from "js-cookie";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import store from "@/store";
import "@/styles/resource.scss";
import pagination from "@/views/resource/components/pagination";

export default {
  data() {
    return {
      domain: process.env.BASE_API,
      importExcDialog: false,
      deleteDialog: false,
      auditDialog: false,
      auditForm: {
        auditStatus: 1
      },
      objectIds: "",
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      nation: "", //民族
      listQuery: {
        pageNum: 1,
        pageSize: 50
      },
      batchId: [],
      requestPath: requestPath,
      checkedAll: false,
      checkedAllRecorded: false, //已录入全选
      checkedAllPass: false, //已通过全选
      checkedAllUnpass: false, //未通过全选
      activeName: "first",
      timeLimit: null,
      multipleSelection: [],
      data: [
        {
          dataType: "",
          dataTypeSort: "",
          dataType: ""
        }
      ],
      editId: "",
      temp: {},
      rules: {
        name: [
          {
            required: true,
            pattern: /^.{1,6}$/,
            message: "请输入不超过六个字的标签名称",
            trigger: "change"
          }
        ]
        // database:[
        //   { required: true, trigger: 'change', message: '请选择数据类型'}
        // ]
      },
      batchData: {
        ids: [],
        status: 1
      },
      percentageValue: 0
    };
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
  },
  mounted() {
    this.getList();
    this.nation = Cookies.get("nation");
  },
  methods: {
    //排序
    sortChanged(column, prop, order) {
      //好傻的方法
      if (column.prop == "uploadTime" && column.order == "ascending") {
        this.listQuery.uploadTime = "asc";
      } else if (column.prop == "uploadTime" && column.order == "descending") {
        this.listQuery.uploadTime = "desc";
      }
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if (res.data.code === 0) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    confirmImport() {
      if (this.$refs.file.files[0]) {
        let file = this.$refs.file.files[0];
        // FormData 对象
        const form = new FormData();
        // 文件对象
        form.append("file", file);
        var timeid = window.setInterval(() => {
          if (this.percentageValue < 100) {
            this.percentageValue += 25;
          }
        }, 20);
        importAPI(form).then(res => {
          window.clearInterval(timeid);
          if (res.data.code == 0) {
            this.$message.success("文件：" + file.name + "," + res.data.data);
            this.importExcDialog = false;
            this.getList();
          } else {
            this.$message.error("文件：" + file.name + "上传失败");
          }
        });
      }
    },
    //关闭
    closeExcel() {
      var file = this.$refs.file;
      file.value = ""; //虽然file的value不能设为有字符的值，但是可以设置为空值
      this.percentageValue = 0;
    },
    // 修改审核状态
    changeAudit(val) {
      if (val == "1") {
        this.batchData.status = 1;
      } else {
        this.batchData.status = 2;
      }
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
    deletAllBtn(id) {
      //删除功能
      if (checkSelect.apply(this, [this.multipleSelection])) {
        this.batchData.ids = getMultipleSelectionIDs(this.multipleSelection);
        confirm.apply(this, ["确定要删除吗？"]).then(() => {
          deleteAPI(this.batchData.ids).then(res => {
            requestMsg.apply(this, [res.data, "删除"]);
          });
        });
      }
    },
    massSetting(msg, api, data, msgName) {
      confirm.apply(this, [msg]).then(() => {
        api(data).then(res => {
          operationMsg.apply(this, [res.data, msgName]);
        });
      });
    },
    singleDelete(id) {
      this.massSetting(`确定删除这个合同吗？`, deleteAPI, [id], `删除`);
    },
    addBtn() {
      this.$router.push({
        path: "/business/themeLexicon/add",
        query: { type: "add" }
      });
    },
    // editBtn(id){
    //   this.$router.push({ path:'/business/copyright/add', query:{id:id,type:'edit'}})
    // },
    // detailsBtn(id){
    //   this.$router.push({ path:'/business/copyright/add', query:{detailsId:id,type:'detail'}})
    // },
    //导入
    importBtn() {
      //导入
      this.importExcDialog = true;
    },
    removeBtn(item) {
      //移除
      var index = this.data.indexOf(item);
      if (index !== -1) {
        this.data.splice(index, 1);
      }
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
    //批量删除
    deleteTheme() {
      if (this.multipleSelection.length > 0) {
        this.deleteDialog = true;
        this.batchId = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //导出excel
    exportExcel() {
      if (this.multipleSelection.length > 0) {
        let oids = "";

        this.objectIds = this.multipleSelection.map((item, index) => {
          if (this.multipleSelection.length - 1 == index) {
            oids += item.id;
          } else {
            oids += item.id + ",";
          }
        });
        this.objectIds = oids;

        window.open(
          `${process.env.BASE_API}${
            requestPath.resource
          }/themeLexicon/export?objectIds=${this.objectIds}`
        );
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    confirmDel() {
      batchDelAPI(this.batchId).then(res => {
        operationMsg.apply(this, [res.data, `批量删除`]);
      });
      this.deleteDialog = false;
    },
    chioceList(val) {
      this.multipleSelection = val;
    },
    handleFilter() {
      store.dispatch("SetSupplierSerKeys", this.listQuery).then(res => {});
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    //未通过
    getUnpassedList() {
      this.listQuery.status = "2";
      this.getList();
    },
    //已通过
    getPassedList() {
      this.listQuery.status = "1";
      this.getList();
    },
    // 已录入
    getRecorded() {
      console.log("已录入");
      this.listQuery.status = "0";
      this.getList();
    },
    handleClick(tab, event) {
      if (tab.index == "0") {
        this.listQuery.status = null;
        this.getList();
      } else if (tab.index == "1") {
        this.getRecorded();
      } else if (tab.index == "2") {
        this.getPassedList();
      } else if (tab.index == "3") {
        this.getUnpassedList();
      }
    },
    // 所有图片批量审核
    batchAudit() {
      if (this.multipleSelection.length > 0) {
        this.auditDialog = true;
        this.batchData.ids = this.multipleSelection.map(item => item.id);
        console.log(this.batchData.ids);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //确认审核
    confirmAudit() {
      console.log(this.batchData);
      batchingAuditAPI(this.batchData).then(res => {
        operationMsg.apply(this, [
          res.data,
          `批量审核${this.batchData.ids.length}项`
        ]);
      });
      this.auditDialog = false;
    }
  },
  components: { pagination }
};
</script>
<style>
.project-plan .importExcDialog .el-dialog {
  width: 480px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -240px;
  margin-top: -150px !important;
}
.addStyle {
  margin-left: 100px;
  cursor: pointer;
}
.addStyle span {
  font-size: 20px;
  display: inline-block;
  vertical-align: middle;
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
.tablelist {
  background: #fff;
  margin-top: 10px;
  z-index: 1;
}

</style>
<style scoped>
.formStyle {
  background: #fff;
  padding: 20px 40px;
  height: 75px;
}
.app-container{
  width: 100%
}

.prfooter{
        width: calc(100vw - 237px);
    }

</style>
