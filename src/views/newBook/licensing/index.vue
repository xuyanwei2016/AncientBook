<template>
  <!--发牌管理-->
  <el-container class="project-plan submitBtn">
    <el-main>
      <div class="buttons">
        <el-button
          type="primary"
          @click="addOne"
          v-if="authBtns.filter(i => i.idName=='addBtn').length>0"
        >
          <i class="submitIcon"></i>添加
        </el-button>

          <el-button type="primary" v-if="authBtns.filter(i => i.idName=='submitAudit').length>0"  @click="changeStatus(0)">
            <i class="add"></i>提交审核
          </el-button>
        <el-button type="primary" v-if="authBtns.filter(i => i.idName=='batchAudit').length>0"  @click="changeStatus(1)">
            <i class="add"></i>批量审核
          </el-button>
        <el-button type="primary" v-if="authBtns.filter(i => i.idName=='designFinish').length>0" @click="changeStatus(2)">
            <i class="add"></i>设计完成
          </el-button>
        <el-button type="primary" v-if="authBtns.filter(i => i.idName=='batchDelete').length>0" @click="batchDelete">
            <i class="add"></i>批量删除
          </el-button>



      </div>

      <div class="formlist">
        <el-form ref="form" :model="bookForm" label-width="82px">
          <el-form-item label="书名">
            <el-input v-model="bookForm.bookName"></el-input>
          </el-form-item>
          <el-form-item label="审核时间">
            <el-date-picker
              v-model="timeLimit"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="bookForm.author"></el-input>
          </el-form-item>
          <el-form-item label="完成时间">
            <el-date-picker
              v-model="timeLimit1"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="选题号">
            <el-input v-model="bookForm.subjectNum"></el-input>
          </el-form-item>
          <el-form-item label="责任编辑">
            <el-input v-model="bookForm.editor"></el-input>
          </el-form-item>

          <el-form-item class="width90">
            <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search">检索</el-button>
            <el-button type="primary" plain @click="onReset">
              <i class></i>重置
            </el-button>
          </el-form-item>

        </el-form>
      </div>
      <div class="tablelist">
        <template>
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="所有图书" :name="null"></el-tab-pane>
            <el-tab-pane label="录入中" name="5-1"></el-tab-pane>
            <el-tab-pane label="待审核" name="5-2"></el-tab-pane>
            <el-tab-pane label="审核通过" name="5-3"></el-tab-pane>
            <el-tab-pane label="设计完成" name="5-5"></el-tab-pane>
          </el-tabs>
        </template>
        <div class="table_outer_wrap iconCss">
          <el-table
            :key="tableKey"
            stripe
            :data="listData"
            v-loading="listLoading"
            element-loading-text="给我一点时间"
            border
            highlight-current-row
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            @sort-change="sortChanged"
          >
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column label="选题号" align="center">
              <template slot-scope="scope">{{scope.row.subjectNum }}</template>
            </el-table-column>
            <el-table-column label="书名" align="center">
              <template slot-scope="scope">{{scope.row.bookName }}</template>
            </el-table-column>
            <el-table-column label="作者" align="center">
              <template slot-scope="scope">{{ scope.row.author||'———'}}</template>
            </el-table-column>
            <el-table-column label="审核时间" sortable="custom" align="center" prop="auditTime">
              <template slot-scope="scope">{{ scope.row.auditTime ||'———'}}</template>
            </el-table-column>
            <el-table-column label="责任编辑" align="center">
              <template slot-scope="scope">{{ scope.row.editor ||'———'}}</template>
            </el-table-column>
            <el-table-column label="完成时间" align="center" sortable="custom" prop="completeTime">
              <template slot-scope="scope">{{ scope.row.completeTime ||'———'}}</template>
            </el-table-column>
            <el-table-column label="审核人" align="center">
              <template slot-scope="scope">{{ scope.row.auditorName||'———' }}</template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.stage  =='5-1'">录入中</span>
                <span v-if="scope.row.stage  =='5-2'">待审核</span>
                <span v-if="scope.row.stage  =='5-3'">审核通过</span>
                <span v-if="scope.row.stage  =='5-5'">设计完成</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <i class="search distance" title="查看" @click="looktoRecord(scope.row,'lookId')"></i>
                <i class="edit distance" title="编辑" v-if="scope.row.stage  !='5-3'"
                   @click="looktoRecord(scope.row,'editId')"></i>

                 <i class="imdel" title="删除" @click="deleteOne(scope.row)" v-if="scope.row.stage == '5-1'&&!scope.row.subjectNum" ></i>

              </template>
            </el-table-column>
          </el-table>
        </div>
        <div  v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"  :page-size="bookForm.pageSize"
                        :current-page="bookForm.pageNum"></pagination>
          </div>
        </div>

      </div>
      <v-alert :alertModelOptions="alertOptions"></v-alert>
    </el-main>
  </el-container>
</template>
<script>
  import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js';
import store from "@/store";
import { getMultipleSelectionIDs } from "@/filters/getIds";
import {getListAPI,submitReviewAPI,batchDeteleAPI} from '@/api/newBook/licensing.js';
import "@/styles/resource.scss";
import pagination from "../../../views/resource/components/pagination";
  import {confirm} from "../../../utils/publicFunctions";
export default {
  name: "subjectIndex",
  components: {
    pagination
  },
  data() {
    return {
      alertOptions:{},
      uploadUrl: uploadUrl,
      uploadPath: uploadPath,
      authBtns: [],
      bookForm: {
        pageNum: 1,
        pageSize: 50,//状态：录入中：5-1，待审核：5-2，审核通过：5-3，设计完成：5-5
        stage:null,
      },
      timeLimit: [],
      timeLimit1: [],
      tableKey: 0,
      listData: [{questNumber:11,name:'2222',author:'sss'}],
      listLoading: false,
      multipleSelection: [],
      activeName: null,
      total:1,
      batchDialog:false,
      firstPeople:{},
      batchList:[],
      ids:[],
      numberDialog:false,
      cipDialog:false,
      uploading:false,
    };
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    this.getList();
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {

    //检索
    onSubmit() {
      this.bookForm.pageNum = 1;
      if(this.timeLimit&&this.timeLimit.length>0){
        this.bookForm.approveStartTime = this.timeLimit[0];
        this.bookForm.approveEndTime = this.timeLimit[1];
      }else{
        this.bookForm.approveStartTime = null;
        this.bookForm.approveEndTime = null;
      }
      if(this.timeLimit1&&this.timeLimit1.length>0){
        this.bookForm.completeStartTime = this.timeLimit1[0];
        this.bookForm.completeEndTime = this.timeLimit1[1];
      }else{
        this.bookForm.completeStartTime = null;
        this.bookForm.completeEndTime = null;
      }

      this.getList();
    },
    //重置
    onReset() {
      this.bookForm = {
        pageNum: 1,
        pageSize: this.bookForm.pageSize,
        stage: this.bookForm.stage,
        orderBy:this.bookForm.orderBy
      };
      this.timeLimit=[];
      this.timeLimit1=[];
      this.getList();
    },

    handleSelectionChange(val) {
      this.batchList = val;
      this.batchList.length > 0
        ? (this.ids = getMultipleSelectionIDs(this.batchList, "id"))
        : this.ids = [];
    },
    sortChanged({column, prop, order}) {
      if (order) {
        this.bookForm.orderBy = `${prop} ${order.substring(0, order.length - 6)}`
      } else {
        this.bookForm.orderBy = null
      }
      this.getList();
    },
    getList() {
      this.listLoading=true;
      getListAPI(this.bookForm).then(res=>{
        if(res.data.status){
          this.listData=res.data.data.list;
          this.total=res.data.data.total;
        }
        this.listLoading=false;
      })
    },
    //查看图书
    looktoRecord(item,name) {
      this.$router.push({ path:`/newBook/licensing/view?${name}=${item.id}`});
    },
    //添加
    addOne() {
      /*this.batchDialog=true;*/
      this.$router.push('/newBook/licensing/view');

    },

    /*提交审核*/
    /*批量审核*/
    changeStatus(num){
      let self=this;
      let data=[
        {stage:'5-1',status:'录入中',curStage:'5-2'},
        {stage:'5-2',status:'待审核',curStage:'5-3'},
        {stage:'5-3',status:'审核通过',curStage:'5-5'},
        ];
      if (this.batchList.length == 0) {
        this.$message.warning('请选择一条数据进行操作');
        return
      }
      let stampV = this.batchList.every((item) => {
        return item.manuscriptForm !=''  && item.manuscriptForm!=null;
      })

      if(!stampV&&num==0){
        this.$message.warning(`请先完善信息，再提交审核`);
        return
      }
      let boo = this.batchList.every((item) => {
        return item.stage == data[num].stage;
      })

      if (boo) {
        submitReviewAPI({
          ids: this.ids,
          stage:data[num].curStage
        }).then(res => {

          if (res.data.status) {
            this.alertOptions={
              show: true,
              btn:1,
              msg: '操作成功！',
              sureText: '确定',
              showClose: true,
              width: 450,
              sure() {
                self.alertOptions.show = false;
                self.getList();
              },
              cancel() {
                self.alertOptions.show = false;
                self.getList();
              }
            };
          } else {
            this.$message.error(res.data.msg);
          }
        })
      } else {
        this.$message.warning(`只有${data[num].status}状态下的数据可以提交审核`)
      }
    },

    /*行内删除*/
    deleteOne(item){
      let ids=[item.id];
      confirm.apply(this,['确定要删除选择的图书排版信息吗？']).then(() => {
        batchDeteleAPI(ids).then(res => {
          if (res.data.status) {
            this.getList();
            this.$message.success('删除成功');
          }
        })
      })
    },

    //批量删除
    batchDelete() {
      let self = this;
      if (this.batchList.length == 0) {
        this.$message.warning('请选择一条数据进行操作');
        return
      }
      /*上面顺下来的数据不能删除*/
      let subjectNum = this.batchList.every((item) => {
        return item.subjectNum == null;
      });
      if(!subjectNum){
        this.$message.warning('不能删除自动推送的排版资源')
        return
      }

      let boo = this.batchList.every((item) => {
        return item.stage == '5-1';
      });
      if(!boo){
        this.$message.warning('只有录入中数据可以删除')
        return
      }
      confirm.apply(this,['确定要删除选择的图书排版信息吗？']).then(() => {
        batchDeteleAPI(self.ids).then(res => {
          if (res.data.status) {
            self.$message.success('删除成功');
            self.getList();
          }
        })
      })
    },

    handleClick(tab, event) {
      this.bookForm.stage = tab.name;
      this.getList();
    },
    // 翻页
    pagesizeFun(val) {
      this.bookForm.pageNum = 1;
      this.bookForm.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.bookForm.pageNum = val;
      this.getList();
    },

  }
};
</script>
<style lang="less" scoped>
  .dashboard-editor-container {
    .tit {
      font-weight: 400;
      font-size: 20px;
      display: inline-block;
      margin-right: 18px;
    }
    .imExcel {
      display: inline-block;
      width: 14px;
      height: 14px;
      background: url("../../../assets/img/plan_excel.png") no-repeat;
      margin-right: 3px;
      float: left;
    }
  }

  .tablelist .search {
    display: inline-block;
    width: 17px;
    height: 19px;
    background: url("../../../assets/img/search.png") no-repeat;
  }
  .tablelist .edit {
    display: inline-block;
    width: 17px;
    height: 19px;
    background: url("../../../assets/img/edit.png") no-repeat;
  }
  .imdel {
    display: inline-block;
    width: 21px;
    height: 21px;
    background: url("../../../assets/img/del1.png") no-repeat;
  }
  .copy {
    display: inline-block;
    width: 21px;
    height: 21px;
    background: url("../../../assets/img/copy.png") no-repeat;
  }
</style>
