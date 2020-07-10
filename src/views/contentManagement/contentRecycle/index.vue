<template>
  <el-container class="project-plan">
    <el-aside class="tree-aside">
      <el-tree :data="navTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </el-aside>

    <el-main>
      <div class="buttons">
        <el-button
          v-if="authBtns.map(i => i.idName).indexOf('batchReduction') >= 0"
          @click="batchReduction()"
        >
          {{authBtns.filter(i => i.idName=='batchReduction')[0].name}}
          <i class="imreduction"></i>
        </el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('batchDel') >= 0" @click="batchDel()">
          {{authBtns.filter(i => i.idName=='batchDel')[0].name}}
          <i class="imDel"></i>
        </el-button>
        <el-button v-if="authBtns.map(i => i.idName).indexOf('allEmpty') >= 0" @click="allEmpty()">
          {{authBtns.filter(i => i.idName=='allEmpty')[0].name}}
          <i class="imempty"></i>
        </el-button>
      </div>

      <el-form  inline label-width="82px" class="formlist form-inline">
        <el-form-item label="检索项" >
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
          <el-select v-model="listQuery.orderBy" @input="changeSort">
            <el-option label="默认排序" value></el-option>
            <el-option v-for="(item, index) in orderBy" :key="index" :value="index" :label="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检索范围" >
          <el-select v-model="listQuery.range">
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
        <template>
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
                <i
                  class="imReduction"
                  title="还原"
                  v-if="authBtns.map(i => i.idName).indexOf('Reduction') >= 0"
                  @click="Reduction(scope.row.id)"
                ></i>
                <router-link
                  :to="{ path:`contentRecycle/details`, query:{detailsId:scope.row.id}}"
                  v-if="authBtns.filter(i => i.idName=='viewBtn').length > 0"
                >
                  <i
                    class="imview"
                    title="查看"
                    v-if="authBtns.map(i => i.idName).indexOf('viewBtn') >= 0"
                  ></i>
                </router-link>
                <i
                  class="imdel"
                  title="删除"
                  v-if="authBtns.map(i => i.idName).indexOf('batchDel') >= 0"
                  @click="batchDelete(scope.row.id)"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="total>0" class="prfooter resource_prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
          </div>
        </div>
        
      </div>
    </el-main>

    <!-- 批量还原对话框 -->
    <!-- <el-dialog title="提示" :visible.sync="auditDialog" width="20%" class="auditDialog backgroundDialog">
            <div class="dialogTip">确定要还原所选择的资讯吗？</div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="confirmAudit">确 定</el-button>
                <el-button @click="auditDialog = false">取 消</el-button>
            </div>
    </el-dialog>-->

    <!-- 彻底删除对话框 -->
    <!-- <el-dialog title="提示" :visible.sync="delDialog" width="20%" class="auditDialog backgroundDialog">
            <div class="dialogTip">当前操作不可逆转，确定要将选择的资讯彻底删除吗？</div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="confirmDel">确 定</el-button>
                <el-button @click="delDialog = false">取 消</el-button>
            </div>
    </el-dialog>-->

    <!-- 全部清空对话框 -->
    <!-- <el-dialog
      title="提示"
      :visible.sync="allEmptyDialog"
      width="20%"
      class="auditDialog backgroundDialog"
    >
      <div class="dialogTip">当前操作不可逆转，确定要彻底删除列表中全部的资讯内容吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmallEmpty">确 定</el-button>
        <el-button @click="allEmptyDialog = false">取 消</el-button>
      </div>
    </el-dialog> -->
  </el-container>
</template>

<script>
import pagination from "../../../views/resource/components/pagination";
import { getNavAPI } from "@/api/resource/common";
import {
  getContantListAPI,
  batchAPI,
  batchDelAPI,
  allEmptyAPI
} from "@/api/contentManagement/contentManage";
import { getAllAPI } from "@/api/contentManagement/contentColumn";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm
} from "@/utils/publicFunctions";
import { getMultipleSelectionIDs } from "@/filters/getIds";
import store from "@/store";
import "@/styles/resource.scss";

export default {
  name:'contentRecycle',
  components: { pagination },
  data() {
    return {
      options: [
        "空",
        "站内发布",
        "中国出版网",
        "证券时报网",
        "中国新闻出版广电报",
        "工信信息化和软件服务业司"
      ],
      orderBy: {
        releaseTime: "发布时间倒序",
        updateTime: "更新时间倒序",
        commentNum: "评论数量倒序",
        clickNum: "访问数量倒序"
      },
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
      defaultProps: {
        children: "list",
        label: "identifierName"
      },
      resourceForm: {},
      listQuery: {
        pageNum: 1,
        pageSize: 30,
        isDelete: 1,
        search: "title",
        orderBy: "",
        range: ""
      },
      timeLimit: [],
      activeName: "first",
      listLoading: false,
      multipleSelection: [],
      setDialog: false,
      batchData: {
        ids: [],
        isDelete: 0
      },
      auditStatus: null
    };
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
  },
  mounted() {
    this.getNav();
    this.getList();
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
        }
      });
    },

    handleNodeClick(data) {
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
        isDelete: 1,
        search: "title",
        orderBy: "",
        range: "",
        status: this.auditStatus
      };
      this.getList();
    },

    // 排序方式
    changeSort() {
      this.getList();
    },


    // 批量还原
    batchReduction() {
      if (this.multipleSelection.length > 0) {
        // this.auditDialog = true
        this.batchData.ids = this.multipleSelection.map(item => item.id);
        confirm.apply(this, ["确认还原?"]).then(() => {
          batchAPI(this.batchData).then(res => {
            operationMsg.apply(this, [
              res.data,
              `批量还原`
            ]);
          });
        });
      } else {
        this.$message.warning("请至少选择一条数据进行操作!");
      }
    },

    // 确认还原
    // confirmAudit() {
    //     batchAPI(this.batchData).then(res => {
    //         operationMsg.apply(this,[res.data,`批量还原${this.batchData.ids.length}项`])
    //     })
    //     this.auditDialog = false
    // },

    // 彻底删除
    batchDel() {
      if (this.multipleSelection.length > 0) {
        const ids = getMultipleSelectionIDs(this.multipleSelection);
        confirm.apply(this, ["确认删除?"]).then(() => {
          batchDelAPI(ids).then(res => {
            operationMsg.apply(this, [
              res.data,
              `删除`
            ]);
          });
        });
      } else {
        this.$message.warning("请至少选择一条数据进行操作!");
      }
    },

    // 确认删除
    // confirmDel() {
    //     const ids = getMultipleSelectionIDs(this.multipleSelection)
    //     batchDelAPI(ids).then(res => {
    //         operationMsg.apply(this,[res.data,`删除${this.multipleSelection.length}项`])
    //     })
    //     this.delDialog = false
    // },

    // 全部清空
    allEmpty() {
      confirm.apply(this, ["确认全部清空?"]).then(() => {
        allEmptyAPI().then(res => {
          operationMsg.apply(this, [
            res.data,
            `全部清空`
          ]);
        });
      });
    },

    // 确认清空
    // confirmallEmpty() {
    //     allEmptyAPI().then(res => {
    //         operationMsg.apply(this,[res.data,`全部清空${this.batchData.ids.length}项`])
    //     })
    //     this.allEmptyDialog = false
    // },

    // 单条删除
    batchDelete(id) {
      confirm.apply(this, ["确认删除吗?"]).then(() => {
        const ids = [id];
        batchDelAPI(ids).then(res => {
          operationMsg.apply(this, [res.data, `删除`]);
          this.getList();
        });
      });
    },

    // 单条还原
    Reduction(id) {
      confirm.apply(this, ["确认还原吗?"]).then(() => {
        this.batchData.ids = [id];
        batchAPI(this.batchData).then(res => {
          operationMsg.apply(this, [res.data, `还原`]);
          this.getList();
        });
      });
    },

    // 切换列表状态
    handleClick(tab, event) {
      if (tab.index == 1) {
        this.listQuery.status = 0; //待审核
        this.auditStatus = 0;
      } else if (tab.index == 2) {
        this.listQuery.status = 1; // 审核通过
        this.auditStatus = 1;
      } else if (tab.index == 3) {
        this.listQuery.status = 2; //审核未通过
        this.auditStatus = 2;
      } else {
        this.listQuery.status = null;
        this.auditStatus = null;
      }
      this.getList();
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
/* .project-plan .searchReset .el-button.search {
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

.dialogTip {
  text-align: center;
  padding: 10px 0;
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
.prepend-el-select{
  width: 90px;
}
/* .el-select {
  width: 90px;
} */

.select {
  width: 150px;
}

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
.imreduction {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/reduction.png") no-repeat;
  float: left;
  margin-right: 3px;
}
.imDel {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/remove.png") no-repeat;
  float: left;
  margin-right: 3px;
}
.imempty {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/allempty.png") no-repeat;
  float: left;
  margin-right: 3px;
}
.imReduction {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: url("../../../assets/img/refresh.png") no-repeat;
}
.imview {
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
