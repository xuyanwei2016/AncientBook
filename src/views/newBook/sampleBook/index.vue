<template>
  <!--样书管理-->
  <div class="finance">
    <el-container class="project-plan submitBtn">
      <el-main>
        <div class="formlist">
          <el-form ref="form" :model="bookForm" label-width="82px">
            <el-form-item label="书  名">
              <el-input v-model="bookForm.bookName"></el-input>
            </el-form-item>

            <el-form-item label="ISBN">
              <el-input v-model="bookForm.isbn"></el-input>
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

            >
              <el-table-column type="index" align="center" label="序号"></el-table-column>
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column label="图书名称" align="center" min-width="200">
                <template slot-scope="scope">{{scope.row.bookName }}</template>
              </el-table-column>
              <el-table-column label="ISBN" align="center" min-width="120">
                <template slot-scope="scope">{{scope.row.isbn }}</template>
              </el-table-column>
              <el-table-column label="版印次" align="center">
                <template slot-scope="scope">{{ scope.row.editionTimes}}</template>
              </el-table-column>
              <el-table-column label="样书数量" align="center">
                <template slot-scope="scope">{{ scope.row.styleBookCount}}</template>
              </el-table-column>
              <el-table-column label="领取样书数量" align="center">
                <template slot-scope="scope">{{ scope.row.applicantCount}}</template>
              </el-table-column>
              <el-table-column label="印厂" align="center">
                <template slot-scope="scope">{{ scope.row.printingHouse}}</template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="100px">
                <template slot-scope="scope">

                  <i class="search distance"  title="查看"  v-if="true" @click="looktoRecord(scope.row,'lookId')"></i>
                  <i class="edit distance" title="编辑" v-if="true"  @click="looktoRecord(scope.row,'editId')"></i>


                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
            <div class="prfooterright">
              <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"
                          :page-size="bookForm.pageSize"
                          :current-page="bookForm.pageNum"></pagination>
            </div>

          </div>
        </div>
      </el-main>
    </el-container>

  </div>
</template>

<script>
  import store from "@/store";
  import {getMultipleSelectionIDs} from "@/filters/getIds";
  import {operationMsg, confirm, requestMsg} from '@/utils/publicFunctions';
  import pagination from "@/views/resource/components/pagination";
  import {getListAPI} from '@/api/newBook/sampleBook.js';

  export default {
    data() {
      return {
        authBtns: [],
        bookForm: {
          pageNum: 1,
          pageSize: 50,
        },
        statusList: [
          {name: '待完善', code: 0},
          {name: '待分配', code: 0},
          {name: '待一审', code: 0},
          {name: '待二审', code: 0},
          {name: '待三审', code: 0},
          {name: '审核未通过', code: 0},
          {name: '审核通过', code: 0},
        ],
        timeLimit: [],
        activeName: "first",
        auditDialog: false,
        settlement: {radio:2,time:'',textarea:''},
        listData: [],
        listLoading: false,
        tableKey: 0,
        batchList: [],
        total: 0,

      }
    },
    mounted() {
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
      this.getList();
    },
    components: {
      pagination
    },
    computed:{
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    },
    methods: {

      /*获取列表数据*/
      getList() {
        this.listLoading = true;
        getListAPI(this.bookForm).then(res=>{
          if(res.data.status){
            this.listData = res.data.data.list;
            this.total = res.data.data.total;
            this.listLoading = false;
          }

        })
      },
      //检索
      onSubmit() {
        this.bookForm.pageNum = 1;
        this.getList();
      },
      //重置
      onReset() {
        this.bookForm = {
          pageNum: 1,
          pageSize: this.bookForm.pageSize,
        };
        this.getList();
      },
      /*查看*/
      looktoRecord(item,name) {
        /*if(name=='editId'){
          this.auditDialog = true;
          return
        }*/
        /*查看合同*/
        this.$router.push({path:`/newBook/sampleBook/view?${name}=${item.id}`})
      },
      /*勾选列表*/
      handleSelectionChange(val) {
        this.batchList = val;
      },
      handleCurChange(val) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val);
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
  }
</script>

<style scoped lang="less">
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
  .tablelist .imdel {
    display: inline-block;
    width: 21px;
    height: 21px;
    background: url("../../../assets/img/del1.png") no-repeat;
  }
  .tablelist .copy {
    display: inline-block;
    width: 21px;
    height: 21px;
    background: url("../../../assets/img/copy.png") no-repeat;
  }
</style>
