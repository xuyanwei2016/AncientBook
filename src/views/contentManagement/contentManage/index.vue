<template>
  <el-container class="project-plan">
    <el-aside class="tree-aside">
      <el-tree :data="navTree" :props="defaultProps" :expand-on-click-node="false" @node-click="handleNodeClick"></el-tree>
    </el-aside>

    <el-main>
      <div class="buttons">
        <router-link
          :to="`contentManage/create`"
          v-if="authBtns.filter(i => i.idName=='addBtn').length > 0"
        >
          <el-button v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0" style="margin-right:10px">
            {{authBtns.filter(i => i.idName=='addBtn')[0].name}}
            <i class="imadd"></i>
          </el-button>
        </router-link>
        <el-button
          v-if="authBtns.map(i => i.idName).indexOf('batchExamineBtn') >= 0"
          @click="batchExamine()"
        >
          {{authBtns.filter(i => i.idName=='batchExamineBtn')[0].name}}
          <i class="imbatch"></i>
        </el-button>
        <el-button
          v-if="authBtns.map(i => i.idName).indexOf('batchSetBtn') >= 0"
          @click="batchSet()"
        >
          {{authBtns.filter(i => i.idName=='batchSetBtn')[0].name}}
          <i class="imset"></i>
        </el-button>
      </div>

      <el-form inline label-width="82px" class="formlist form-inline">
        <el-form-item label="检索项">
          <el-input placeholder="请输入内容" v-model="listQuery.text" @keyup.enter.native="handleFilter" style="width:271px">
            <el-select v-model="listQuery.search" slot="prepend" class="prepend-el-select">
              <el-option label="标题" value="title"></el-option>
              <el-option label="作者" value="author"></el-option>
              <el-option label="来源" value="source"></el-option>
              <el-option label="录入人" value="userName"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="排序方式" >
          <el-select v-model="listQuery.sortOrder" class="select" @input="changeSort">
            <el-option label="默认排序" :value="0"></el-option>
            <el-option v-for="(item, index) in sortOrder" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检索范围" >
          <el-select v-model="listQuery.range" class="select">
            <el-option label="全部" value></el-option>
            <el-option v-for="(item, index) in range" :key="index" :value="index" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传时间" class="widthBig">
          <el-date-picker
            v-model="timeLimit"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @keyup.enter.native="handleFilter"
          ></el-date-picker>
        </el-form-item>
        <el-form-item class="width90 searchReset">
          <el-button @click="handleFilter" type="primary" class="search" icon="el-icon-search">检索</el-button><el-button @click="resetFilter" plain class='resetFilterClass'>重置</el-button>
        </el-form-item>
      </el-form>

      <div class="tablelist">
        <template style="margin:0 !important;">
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="所有资讯" name="first"></el-tab-pane>
            <el-tab-pane label="待审核" name="second"></el-tab-pane>
            <el-tab-pane label="审核通过" name="third"></el-tab-pane>
            <el-tab-pane label="审核未通过" name="fourth"></el-tab-pane>
          </el-tabs>
        </template>

        <div class="table_outer_wrap">
          <el-table
            height="500"
            :data="list"
            border
            v-loading="listLoading"
            element-loading-text="给我一点时间"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="内容标题" align="center">
              <template slot-scope="scope">{{scope.row.title}}</template>
            </el-table-column>
            <el-table-column label="属性" align="center">
              <template slot-scope="scope">{{scope.row.property}}</template>
            </el-table-column>
            <el-table-column label="来源" align="center">
              <template slot-scope="scope">{{scope.row.source}}</template>
            </el-table-column>
            <el-table-column label="作者" align="center">
              <template slot-scope="scope">{{scope.row.author}}</template>
            </el-table-column>
            <el-table-column label="上传时间" align="center">
              <template slot-scope="scope">{{scope.row.uploadTime}}</template>
            </el-table-column>
            <el-table-column label="录入人" align="center">
              <template slot-scope="scope">{{scope.row.userName}}</template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">待审核</span>
                <span v-if="scope.row.status === 1">审核通过</span>
                <span v-if="scope.row.status === 2">审核未通过</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              class-name="small-padding fixed-width"
              min-width="80"
              align="center"
            >
              <template slot-scope="scope">
                <router-link
                  :to="{ path:`contentManage/create`, query:{id:scope.row.id,type:'edit'}}"
                  v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"
                >
                  <i class="imedit" v-if="authBtns.map(i => i.idName).indexOf('editBtn') >= 0"></i>
                </router-link>
                <router-link
                  :to="{ path:`contentManage/create`, query:{detailsId:scope.row.id,type:'detail'}}"
                  v-if="authBtns.filter(i => i.idName=='viewBtn').length > 0"
                >
                  <i class="imeview" v-if="authBtns.map(i => i.idName).indexOf('viewBtn') >= 0"></i>
                </router-link>
                <i
                  class="imdel"
                  v-if="authBtns.map(i => i.idName).indexOf('delBtn') >= 0"
                  @click="batchDel(scope.row.id)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div  v-if="total>0" class="prfooter resource_prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
          </div>
        </div>
        
      </div>
    </el-main>

    <!-- 批量审核对话框 -->
    <el-dialog
      title="批量审核"
      :visible.sync="auditDialog"
      width="420px"
      class="auditDialog backgroundDialog"
    >
      <el-form>
        <el-form-item label="审核状态：">
          <el-radio-group v-model="batchData.status">
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

    <!-- 设置属性对话框 -->
    <el-dialog title="设置属性" :visible.sync="setDialog" width="550px" class="setDialog backgroundDialog">
      <el-form :model="form" ref="formData" label-width="100px" label-position="right">
        <el-form-item label="属性设置:">
          <el-checkbox-group v-model="type">
            <el-checkbox label="热门" name="type"></el-checkbox>
            <el-checkbox label="头条" name="type"></el-checkbox>
            <el-checkbox label="推荐" name="type"></el-checkbox>
            <el-checkbox label="置顶" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="内容来源:"
          :rules="[{ required: true, trigger:'blur', message: '请输入内容来源'},]"
          prop="source"
        >
          <el-select v-model="form.source" placeholder="请选择" style="width:220px;">
            <el-option
              v-for="item in sourseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容权重:">
          <el-input-number v-model="form.weight" style="width:220px;"></el-input-number>
        </el-form-item>
        <el-form-item label="虚拟点击量:">
          <el-input-number v-model="form.fictitiousClickNum" style="width:220px;"></el-input-number>
        </el-form-item>
        <el-form-item label="发布时间:">
          <el-date-picker
            v-model="form.releaseTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
          <el-checkbox label="定时发布"></el-checkbox>
        </el-form-item>
        <el-form-item label="下线时间:">
          <el-date-picker
            v-model="form.offlineTime"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
          <el-checkbox label="定时下线"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="confirmSet">确 定</el-button>
        <el-button @click="setDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import pagination from "../../../views/resource/components/pagination";
import { getNavAPI } from "@/api/resource/common";
import {
  getContantListAPI,
  batchAPI,
  setAtrAPI
} from "@/api/contentManagement/contentManage";
import { getAllSourceAPI } from "@/api/contentManagement/contentSource";
import { getAllAPI } from "@/api/contentManagement/contentColumn";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm,
  compareDate
} from "@/utils/publicFunctions";
import store from "@/store";
import "@/styles/resource.scss";

export default {
  name:'contentManage',
  components: { pagination },
  data() {
    return {
      sourseOptions: [],
      sortOrder: [
         {
           label:'发布时间倒序',
           value:1
         },
         {
           label:'更新时间倒序',
           value:2
         }
      ],
      range: {
        text: "文章",
        imgs: "图片集",
        video: "视频"
      },
      authBtns: [],
      navTree: [],
      list: [],
      type: [],
      total: 30,
      status: 1,
      defaultProps: {
        children: "list",
        label: "identifierName"
      },
      form: {
        search: "",
        ids: [],
        fictitiousClickNum: null,
        offlineTime: "",
        property: "",
        releaseTime: "",
        source: "",
        sourceId: 1,
        weight: ""
      },
      resourceForm: {},
      listQuery: {
        pageNum: 1,
        pageSize: 30,
        isDelete: 0,
        search: "title",
        sortOrder: "",
        range: ""
      },
      timeLimit: [],
      activeName: "first",
      listLoading: false,
      multipleSelection: [],
      auditDialog: false,
      setDialog: false,
      batchData: {
        ids: [],
        isDelete: 1
      },
      auditStatus: null
    };
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
  },
  activated() {
    this.getList();//缓存操作的新增编辑时，要更新数据
  },
  mounted() {
    this.getNav();
    this.getList();
    this.getSourceList();
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    getNav() {
      getAllAPI().then(res => {
        res.data.data = [{ identifierName: "全部" }].concat(res.data.data);
        res.data.code === 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
    },

    getList() {
      getContantListAPI(this.listQuery).then(res => {
        if (res.data.code === 0) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    //获取内容来源的列表
    getSourceList() {
      getAllSourceAPI().then(res => {
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            this.sourseOptions = [];
            res.data.data.forEach(ele => {
              let obj = {
                label: ele.sourceName + "",
                value: ele.id + ""
              };
              this.sourseOptions.push(obj);
            });
          } else {
            this.sourseOptions = [];
          }
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    handleNodeClick(data) {
      //点击树节点获取table数据
      this.listQuery.code = data.code;
      this.getList();
    },

    // 检索
    handleFilter() {
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

    // 重置
    resetFilter() {
      this.timeLimit = [];
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        isDelete: 0,
        search: "title",
        sortOrder: "",
        range: "",
        status:this.auditStatus
      };
      this.getList();
    },

    // 排序方式
    changeSort() {
      this.getList();
    },

    // 批量审核
    batchExamine() {
      if (this.multipleSelection.length > 0) {
        this.auditDialog = true;
        this.batchData.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请至少选择一条数据进行操作!");
      }
    },

    // 确认审核
    confirmAudit() {
      this.batchData.isDelete=0   //审核不删除
      batchAPI(this.batchData).then(res => {
        operationMsg.apply(this, [
          res.data,
          `批量审核${this.batchData.ids.length}项`
        ]);
      });
      this.auditDialog = false;
    },

    // 设置属性
    batchSet() {
      this.form = {
        search: "",
        ids: [],
        fictitiousClickNum: null,
        offlineTime: "",
        property: "",
        releaseTime: "",
        source: "",
        sourceId: 1,
        weight: ""
        
      };
      this.type = [];
      if (this.multipleSelection.length > 0) {
        this.setDialog = true;
        this.form.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请至少选择一条数据进行操作!");
      }
    },

    // 确认设置属性
    confirmSet() {
      this.$refs["formData"].validate(valid => {
        if (valid) {
          this.form.property = this.type.join(",");
        console.log(JSON.stringify(this.form))
          if (compareDate(this.form.releaseTime, this.form.offlineTime)) {
            setAtrAPI(this.form).then(res => {
              if (res.data.code === 0) {
                this.$message.success("设置成功!");
                this.getList();
                this.setDialog = false;
              } else {
                this.$message.error("设置失败!");
              }
            });
          } else {
            this.$message.warning("发布时间不可以大于下线时间");
          }
        }
      });
    },

    // 切换列表状态
    handleClick(tab, event) {
      if (tab.index == 1) {
        this.listQuery.status = 0; //待审核
        this.auditStatus = 0
      } else if (tab.index == 2) {
        this.listQuery.status = 1; // 审核通过
        this.auditStatus = 1
      } else if (tab.index == 3) {
        this.listQuery.status = 2; //审核未通过
        this.auditStatus = 2
      } else {
        this.listQuery.status = null;
        this.auditStatus = null
      }
      this.getList();
    },

    // 单条删除
    batchDel(id) {
      this.batchData.isDelete=1    //删除为1
      this.batchData.ids.push(id);
      confirm.apply(this, ["确认删除选择内容吗?"]).then(() => {
        batchAPI(this.batchData).then(res => {
          requestMsg.apply(this, [res.data, "删除"]);
        });
        this.getList();
      });
    },

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
    }
  }
};
</script>

<style scoped>
/*  .project-plan .searchReset .el-button.search {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.project-plan .searchReset .el-button {
  width: 89px;
  border-radius: 5px;
} */ 
/* .project-plan .searchReset .resetFilterClass{
  background:#ecf5ff;
  color:#409EFF;
  border:1px solid #b3d8ff;
}
.project-plan .searchReset .resetFilterClass:hover{
  background:#409EFF;
  color:#fff;
  border:1px solid #409EFF;
} */
/* .el-tree {
        background: #fff;
    } */
.el-aside {
  border-right: 1px solid #ddd;
  background-color: #fff;
  width: 199px !important;
}

.el-tree {
  overflow: auto !important;
}

.buttons {
  height: 80px;
  background-color: #fff;
  width: 100%;
  line-height: 80px;
  padding-left: 30px;
}

/* .el-button:not(:last-child) {
  margin-right: 0px !important;
} */

.el-form {
  margin-top: 10px;
  padding-top: 20px;
  width: 100%;
  background-color: #fff;
}

.prepend-el-select {
  width: 90px;
}

/* .select {
  width: 150px;
} */

.el-form--inline .el-form-item {
  margin-left: 20px;
  margin-right: 0px !important;
}

.el-tabs {
  margin-top: 20px;
  background-color: #fff;
}

.project-plan .auditDialog .el-dialog {
  width: 458px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -229px;
  margin-top: -100px !important;
}

.project-plan .setDialog .el-dialog {
  width: 300px !important;
  /* height: 500px; */
  /* position:absolute;
        left:50%;
        top: 50%;
        margin-left:-229px;
        margin-top:-100px !important; */
}
.dialog-footer,
.el-dialog__footer {
  text-align: center !important;
}

.imadd {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/importico.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.imbatch {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/batch_review.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.imset {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/set.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.imedit {
  display: inline-block;
  width: 20px;
  height: 22px;
  background: url("../../../assets/img/edit1.png") no-repeat;
}
.imeview {
  display: inline-block;
  width: 19px;
  height: 21px;
  background: url("../../../assets/img/search.png") no-repeat;
}
.imdel {
  display: inline-block;
  width: 21px;
  height: 21px;
  background: url("../../../assets/img/del1.png") no-repeat;
}
</style>
