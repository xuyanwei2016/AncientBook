<template>
  <!--财务管理-->
  <div class="finance">
    <el-container class="project-plan submitBtn">
      <el-main>
        <div class="formlist">
          <el-form ref="form" :model="bookForm" label-width="82px">
            <el-form-item label="书  名">
              <el-input v-model="bookForm.bookName"></el-input>
            </el-form-item>

            <el-form-item label="作者">
              <el-input v-model="bookForm.author"></el-input>
            </el-form-item>
            <el-form-item class="width90" style="margin-right: 0">
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
            >
              <el-table-column type="index" align="center" label="序号"></el-table-column><!--
              <el-table-column type="selection" align="center"></el-table-column>-->
              <el-table-column label="选题号" align="center">
                <template slot-scope="scope">{{scope.row.subjectNum }}</template>
              </el-table-column>
              <el-table-column label="图书名称" align="center">
                <template slot-scope="scope">{{scope.row.bookName }}</template>
              </el-table-column>
              <el-table-column label="作者" align="center">
                <template slot-scope="scope">{{ scope.row.author}}</template>
              </el-table-column>
              <el-table-column label="是否结算" align="center">
                <template slot-scope="scope">{{ status[scope.row.status]}}</template>
              </el-table-column>
              <el-table-column label="结算日期" align="center">
                <template slot-scope="scope">{{scope.row.status=='3-1'?'————':scope.row.settlementTime}}</template>
              </el-table-column>
              <el-table-column label="备注" align="center">
                <template slot-scope="scope">{{ scope.row.remark }}</template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">

                  <i class="search distance"  title="查看"  v-if="scope.row.isBinding" @click="looktoRecord(scope.row,'lookId')"></i>
                  <i class="edit distance" title="结算" v-if="scope.row.status!='3-3'"  @click="looktoRecord(scope.row,'editId')"></i>
                  <!--<i class="el-icon-delete"></i>
                  <i class="el-icon-document-copy"></i>-->


                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
            <div class="prfooterright">
              <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"  :page-size="bookForm.pageSize"
                          :current-page="bookForm.pageNum"></pagination>
            </div>

          </div>
        </div>
      </el-main>
    </el-container>
    <!--弹出框-->
    <el-dialog title="编辑数据：" :visible.sync="auditDialog"  width="500px">
      <el-form :model="settlement" inline label-width="100px">
        <el-form-item label="结算状态:">
          <el-radio-group v-model="settlement.radio">
            <el-radio label="3-2">部分结算</el-radio>
            <el-radio label="3-3">已结算</el-radio>
            <el-radio label="3-1">未结算</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结算日期：">
          <el-date-picker
            v-model="settlement.time"
            type="datetime"
            placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 340px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="settlement.textarea" name="dutyEditor" type="textarea" :rows="4" maxlength="200" resize="none" style="width: 340px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmAudit">确 定</el-button>
        <el-button @click="auditDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import store from "@/store";
  import {getMultipleSelectionIDs} from "@/filters/getIds";
  import {operationMsg, confirm, requestMsg} from '@/utils/publicFunctions';
  import pagination from "@/views/resource/components/pagination";
  import '../../../styles/icon.scss';
  import {getListAPI,settlementAPI} from '@/api/newBook/finance.js';

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
        status:{'3-1':'未结算','3-2':'部分结算','3-3':'已结算'},
        timeLimit: [],
        activeName: "first",
        auditDialog: false,
        settlement: {radio:null,time:'',textarea:''},
        listData: [],
        listLoading: false,
        tableKey: 0,
        batchList: [],
        total: 0,
        settlementId:null,
      }
    },
    mounted() {
      console.log(1111, this.$route.meta.routerIds)
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
    watch:{
      auditDialog(n,o){
        if(!n){
          this.settlement.radio=null;
          this.settlement.time='';
          this.settlement.textarea='';
        }
      },
    },
    methods: {
      /*行内修改*/
      editBtn() {

      },
      /*结算确认*/
      confirmAudit() {
        console.log(11111,this.settlementId,this.settlement.textarea,this.settlement.time,this.settlement.radio)
        if(!this.settlement.radio||this.settlement.radio==''){
          this.$message.warning('请选择结算状态');
          return
        }
        if(!this.settlement.time||this.settlement.time==''){
          this.$message.warning('请选择结算时间');
          return
        }
        settlementAPI({
          id:this.settlementId,
          remark: this.settlement.textarea,
          settlementTime: this.settlement.time,
          status: this.settlement.radio,
        }).then(res=>{
          if(res.data.status){
            this.auditDialog=false;
            this.$message.success('修改数据成功');
            this.getList();
          }else{
            this.$message.error(res.data.msg);
          }

        })
        /*id (integer, optional): ID ,
remark (string, optional): 备注 ,
settlementTime (string, optional): 结算时间 ,
status (string, optional): 结算状态,未结算：3-1, 部分结算：3-2, 已结算：3-3*/

      },

      /*获取列表数据*/
      getList() {
        this.listLoading=true;
        getListAPI(this.bookForm).then(res=>{
          this.listLoading=false;
          this.listData=res.data.data.list;
          this.total=res.data.data.total;
        })
      },
      //检索
      onSubmit() {
        this.bookForm.pageNum = 1;
        console.log('检索',this.bookForm)
        this.getList();
      },
      //重置
      onReset() {
        this.bookForm = {
          pageNum: 1,
          pageSize: this.bookForm.pageSize
        };
        this.getList();
      },
      /*查看*/
      looktoRecord(item,name) {
        if(name=='editId'){
          this.auditDialog = true;
          this.settlementId=item.id;
          return
        }
        /*查看合同*/
        this.$router.push({path:`/newBook/finance/view?${name}=${item.subjectId}&id=${item.id}&type=detail`})
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
      handleSizeChange(){},
      handleCurrentChange(){},
      //排序
/*      sortChanged(column, prop, order) {
        if (column.prop == "uploadTime" && column.order == "ascending") {
          this.listQuery.uploadTime = "asc";
        } else if (column.prop == "uploadTime" && column.order == "descending") {
          this.listQuery.uploadTime = "desc";
        }
        this.getList();
      },*/

    }
  }
</script>

<style scoped lang="less">
  .allTry {

  }
</style>
