<template>
  <!--三审管理-->
  <div class="allTry">
    <el-container class="project-plan submitBtn">
      <el-main>
        <div class="buttons">
          <el-button
            type="primary"
            @click="reviewerBtn"
            v-if="authBtns.filter(i => i.idName=='person').length>0"
          >
            <i class="submitIcon"></i>指定审校人
          </el-button>
          <el-button
            type="primary"
            @click="reprintBtn"
            v-if="authBtns.filter(i => i.idName=='reprint').length>0"
          >
            <i class="submitIcon"></i>图书再版
          </el-button>

        </div>

        <div class="formlist">
          <el-form ref="form" :model="bookForm" label-width="82px">
            <el-form-item label="书  名">
              <el-input v-model="bookForm.bookName"></el-input>
            </el-form-item>
            <el-form-item label="选题号">
              <el-input v-model="bookForm.subjectNum"></el-input>
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="bookForm.author"></el-input>
            </el-form-item>
            <el-form-item label="审校人">
              <el-input v-model="bookForm.auditorName"></el-input>
            </el-form-item>
            <el-form-item label="审核状态:" prop="status" class="width360">
              <el-select v-model="bookForm.status" placeholder="请选择">
                <el-option
                  v-for="(item,ind1) in statusList"
                  :key="ind1"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="操作时间">
              <el-date-picker
                v-model="timeLimit"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
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
              <el-tab-pane label="新书" name="1"></el-tab-pane>
              <el-tab-pane label="再版图书" name="2"></el-tab-pane>
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
              <el-table-column type="index" align="center" label="序号"></el-table-column>
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column label="选题号" align="center" prop="subjectNum">
              </el-table-column>
              <el-table-column label="图书名称" align="center" prop="bookName"   min-width="250px">
              </el-table-column>
              <el-table-column label="作者" align="center">
                <template slot-scope="scope">{{ scope.row.author}}</template>
              </el-table-column>
              <el-table-column label="审校人" align="center" prop="auditorName">
              </el-table-column>
              <el-table-column label="审核状态" align="center"  width="180px">
                <template slot-scope="scope">{{statusList.filter(item=>{return item.code==scope.row.status})[0].name}}</template>
              </el-table-column>
              <el-table-column label="操作时间" sortable align="center" prop="dealTime"  width="180px">
                <template slot-scope="scope">{{ scope.row.dealTime }}</template>
              </el-table-column>

              <el-table-column label="操作" align="center" width="120px">
                <template slot-scope="scope">

                  <i class="search distance"  title="查看" @click="looktoRecord(scope.row,'lookId')"></i>
                  <i class="edit distance" title="编辑" v-if="scope.row.status=='2-1'||scope.row.status=='2-2'"  @click="looktoRecord(scope.row,'editId')"></i>

                </template>
              </el-table-column>
            </el-table>
          </div>
          <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
            <div class="prfooterright">
              <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun" :page-size="bookForm.pageSize"
                          :current-page="bookForm.pageNum"></pagination>
            </div>

          </div>
        </div>
      </el-main>
    </el-container>
    <!--弹出框-->
    <el-dialog title="指定审校人" :visible.sync="auditDialog" class="auditDialog backgroundDialog" width="400px">
      <el-form>
        <el-form-item label="一审负责人:" prop="series" class="width360">
          <el-select value-key="userId" v-model="peopleFrom" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item"></el-option>
          </el-select>
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
  import '../../../../styles/icon.scss';
  import {getListAPI,auditAssignAPI,reprintAPI,checkAPI} from '@/api/newBook/examine';
  import {getUserListAPI} from '@/api/newBook/subject';
  export default {
    name: "allTry",
    data() {
      return {
        authBtns: [],
        bookForm: {
          pageNum: 1,
          pageSize: 50,
          bookType:1,
        },
        /*三审列表状态：待完善：2-1，待分配：2-2，待一审：2-3-1，待二审：2-3-2，待三审：2-3-3，一审未通过：2-5-1，二审未通过：2-5-2，三审未通过：2-5-3审核通过：2-4*/
        statusList: [
          {name: '待完善', code: '2-1'},
          {name: '待分配', code: '2-2'},
          {name: '待一审', code: '2-3-1'},
          {name: '待二审', code: '2-3-2'},
          {name: '待三审', code: '2-3-3'},
          {name: '一审未通过', code: '2-5-1'},
          {name: '二审未通过', code: '2-5-2'},
          {name: '三审未通过', code: '2-5-3'},
          {name: '审核通过', code: '2-4'},
        ],
        timeLimit: [],
        activeName: '1',
        auditDialog: false,
        listData: [],
        listLoading: false,
        tableKey: 0,
        batchList: [],
        total: 1,
        ids:[],
        userList:[],
        peopleFrom:{
          userName:null,
          userId:null,
        },
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
    watch:{
      auditDialog(n,o){
        if(!n){
          this.peopleFrom={
            userName:null,
            userId:null,
          }
        }
      },
    },
    methods: {
      /*获取部门下的用户*/
      getUserList(){
        getUserListAPI().then(res=>{
          if(res.data.status){
            this.userList=res.data.data;
          }
        })
      },
      /*指定审校人*/
      reviewerBtn() {
        if (this.batchList.length == 0) {
          this.$message.warning('请选择至少一条记录进行操作')
        } else {

          const dataType = this.batchList.every(data => data.status == '2-2')
          if(dataType) {
            this.auditDialog = true;
          this.ids = getMultipleSelectionIDs(this.batchList);
        }else{
            this.$message.warning('只有待分配状态的数据可以指定审校人')
          }
        }
      },
      /*弹出框确认*/
      confirmAudit() {
        if(!this.peopleFrom.userId){
          this.$message.warning('请选择审校人');
          return
        }
        auditAssignAPI({
          ids: this.ids,
          auditor:this.peopleFrom.userId,
          auditorName:this.peopleFrom.userName,
          nextStage:'2-3-1'
        }).then(res=>{
          if(res.data.status){
            this.auditDialog=false;
            this.$message.success('指定成功');
            this.getList();
          }else{
            this.$message.error(res.data.msg);
          }
        })

      },
      /*图书再版*/
      reprintBtn(val) {
        let self=this;
        if (this.batchList.length == 0) {
          this.$message.warning('请选择至少一条记录进行操作')
        } else {
          const dataType = this.batchList.every(data => data.status == '2-4')
          if(dataType) {
            let passData=[];
            this.batchList.map(({id,subjectNum}) => passData=[...passData,{id:id,subjectNum:subjectNum}]);
            checkAPI(passData).then(res=>{
              if(res.data.data){
                /*let ids = getMultipleSelectionIDs(this.batchList);*/

                confirm.apply(this, ['确定要进行图书再版操作吗？']).then(() => {
                  reprintAPI(passData).then(res => {
                    if(res.data.status){
                      self.$message.success('图书再版成功');
                    }else{
                      self.$message.err(res.data.msg);
                    }
                    /*this.getList()*/
                  })
                })
              }else{
                this.$message.error('图书尚未印刷，不能进行图书再版');
              }

            })
          }else{
            this.$message.warning('只有审核通过的数据可进行操作')
          }
        }

      },
      /*获取列表数据*/
      getList() {
        this.listLoading = true;
        getListAPI(this.bookForm).then(res=>{
          if(res.data.status){
            this.listData=res.data.data.list;
            this.total=res.data.data.total;
            this.listLoading = false;
            this.getUserList();
          }
        })
      },
      //检索
      onSubmit() {
        console.log(1111,this.timeLimit)
        if (this.timeLimit&&this.timeLimit.length > 0) {
          this.bookForm.dealStartTime = this.timeLimit[0];
          this.bookForm.dealEndTime = this.timeLimit[1];
        }else{
          this.bookForm.dealStartTime = null;
          this.bookForm.dealEndTime = null;
        }
        this.bookForm.pageNum = 1;
        this.getList();
      },
      //重置
      onReset() {
        this.bookForm = {
          pageNum: 1,
          pageSize: this.bookForm.pageSize,
          orderBy:this.bookForm.orderBy
        };
        this.timeLimit=[];
        this.bookForm.bookType=Number(this.activeName);
        this.bookForm.status == 'null'?delete this.bookForm.status:true;
        this.getList();
      },
      handleClick(tab, event) {
        this.bookForm.bookType=Number(this.activeName);
        this.getList();
      },
      /*查看*/
      looktoRecord(item,name) {
        this.$router.push({path:`/newBook/examine/examineView?${name}=${item.id}`})
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
        console.log('pagesizeFun', val)
        this.bookForm.pageNum = 1;
        this.bookForm.pageSize = val;
        this.getList();
      },
      currentPageFun(val) {
        this.bookForm.pageNum = val;
        this.getList();
      },
      //排序
      sortChanged({column, prop, order}) {

        if (order) {
          this.bookForm.orderBy = `${prop} ${order.substring(0, order.length - 6)}`
        } else {
          this.bookForm.orderBy = null
        }
        console.log(22222,order)
        this.getList();
      },

    },
    activated() {
      /*if(!this.$route.meta.goback){
        this.timeLimit=[];
        this.listData=[];
        this.tableKey=0;
        this.total=1;
        this.auditDialog=false;
        this.listLoading=false;
        this.listQuery={
          pageNum: 1,
          pageSize: 50,
          bookType:1,
        };*/
        this.getList();
      /*}*/
      // 恢复成默认的false，避免isBack一直是true，导致下次无法获取数据
      /*this.$route.meta.isBack=false;*/
    },
  }
</script>

<style scoped lang="less">
  .allTry {

  }
</style>
