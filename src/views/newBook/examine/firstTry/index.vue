<template>
  <!--一审作业-->
  <div class="allTry">
    <el-container class="project-plan submitBtn">
      <el-main>
        <div class="buttons">
          <el-button
            type="primary"
            @click="reviewerBtn"
            v-if="authBtns.filter(i => i.idName=='person').length>0"
          >
            <i class="submitIcon"></i>批量审核
          </el-button>
          <el-button
            type="primary"
            @click="reprintBtn"
            v-if="authBtns.filter(i => i.idName=='reprint').length>0"
          >
            <i class="submitIcon"></i>指定审校人
          </el-button>

        </div>

        <div class="formlist">
          <el-form ref="form" :model="bookForm" label-width="82px">
            <el-form-item label="书  名">
              <el-input v-model="bookForm.bookName"></el-input>
            </el-form-item>
            <el-form-item label="添加时间">
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
            <el-form-item label="审核时间">
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

            <el-form-item label="审校人">
              <el-input v-model="bookForm.auditorName"></el-input>
            </el-form-item>
            <el-form-item label="审核状态" prop="status" class="width360">
              <el-select v-model="bookForm.status" placeholder="请选择">
                <el-option
                  v-for="(item,ind1) in statusList"
                  :key="ind1"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
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
              style="min-height: 124px;"
            >
              <el-table-column type="index" align="center" label="序号"></el-table-column>
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column label="选题号" align="center" prop="subjectNum">
              </el-table-column>
              <el-table-column label="图书名称" align="center" prop="bookName"   min-width="180px">
              </el-table-column>
              <el-table-column label="作者" align="center">
                <template slot-scope="scope">{{ scope.row.author}}</template>
              </el-table-column>
              <el-table-column label="添加时间" sortable="custom" align="center" prop="createTime"   width="180px">
              </el-table-column>
              <el-table-column prop="pricipalName" label="三审负责人" align="center">
              </el-table-column>


              <el-table-column label="操作时间" sortable="custom" align="center" prop="dealTime"   width="180px">
                <template slot-scope="scope">{{ scope.row.dealTime }}</template>
              </el-table-column>

              <el-table-column label="审校人"  align="center">
                <template slot-scope="scope">{{ scope.row.auditorName }}</template>
              </el-table-column>

              <el-table-column label="审核状态" align="center"   width="150px">
                <template slot-scope="scope">{{scope.row.logStatus!=null?(statusList.filter(item=>{return item.code==scope.row.logStatus})[0]).name:true}}</template>
              </el-table-column>

              <el-table-column label="操作" align="center"   width="120px">
                <template slot-scope="scope">
                  <i class="search distance"  title="查看" @click="looktoRecord(scope.row,'lookId')"></i>
                  <i class="copy distance" title="审核" v-if="scope.row.logStatus==0||scope.row.logStatus==3"  @click="looktoRecord(scope.row,'editId')"></i>

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
      </el-main>
    </el-container>
    <!--弹出框-->
    <el-dialog :visible.sync="isbatchCommit" width="500px" title="批量审核">
      <el-form class="batchCommit" ref="imgForm"
               :rules="rules" :model="imgForm">
        <span style="height: 35px; line-height: 26px;display: inline-block">审核意见（其中作者简介不少于50字，内容提要不少于100字）：</span>
        <el-form-item class="inputC" prop="textarea">
          <el-input type="textarea" :rows="4" v-model="imgForm.textarea" ></el-input><!--minlength="50" maxlength="100" show-word-limit-->
        </el-form-item>
        <el-form-item prop="reviewStatus" style="padding-top: 10px;">
          <el-radio-group  v-model="imgForm.reviewStatus"><!--1：审核通过，2：审核未通过-->
            <el-radio label="1">审核通过</el-radio>
            <el-radio label="2">审核未通过</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataReview">确认</el-button>
        <el-button @click="isbatchCommit = false">取消</el-button>
      </div>
    </el-dialog>

<!--指定审校人-->
    <el-dialog title="指定审校人" :visible.sync="auditDialog" class="auditDialog backgroundDialog"  width="400px">
      <el-form>
        <el-form-item label="二审负责人:" prop="series" class="width360">
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
  import { getMultipleSelectionIDs } from "@/filters/getIds";
  import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions';
  import pagination from "@/views/resource/components/pagination";
  import '../../../../styles/icon.scss';
  import {getSubListAPI,batchAuditAPI,auditAssignAPI} from '@/api/newBook/examine.js';
  import {getUserListAPI} from '@/api/newBook/subject';

  export default {
    name: "firstTry",
    data() {
      return {
        authBtns: [],
        bookForm: {
          pageNum: 1,
          pageSize: 50,
          type:'2-3-1',
          bookType:1,
        },/*0：待审核，1：审核通过,2：审核未通过，二审驳回：3，三审驳回：4*/
        statusList:[
          {name:'待审核',code:'0'},
          {name:'审核通过',code:'1'},
          {name:'审核未通过',code:'2'},
          {name:'二审驳回',code:'3'},
          /*{name:'三审驳回',code:4},*/
        ],
        timeLimit: [],
        timeLimit1: [],
        activeName: "1",
        auditDialog:false,
        isTextarea:false,
        peopleFrom:{
          userName:null,
          userId:null,
        },
        userList:[],
        isbatchCommit:false,
        firstPeople:null,
        listData: [],
        listLoading: false,
        tableKey: 0,
        batchList:[],
        ids:[],
        total:1,
        imgForm:{
          reviewStatus:'',
          textarea:'',
        },
        rules: {
          textarea:[{required: true, message: '请输入审核意见', trigger: 'change'},{max: 100, message: '审核意见输入长度小于100', trigger: 'change'}],
          reviewStatus:[{required: true, message: '请选择审核状态', trigger: 'change'}],
        }
      }
    },
    components: {
      pagination
    },
    mounted() {
      console.log(1111,this.$route.meta.routerIds)
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
      this.getList();
    },
    computed:{
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    },
    watch:{
      isbatchCommit(n,o){
        if(!n){
          this.$refs['imgForm'].resetFields();
          this.imgForm.reviewStatus='';
          this.imgForm.textarea='';
        }
      },
      auditDialog(n,o){
        if(!n){
          this.peopleFrom={
            userName:null,
            userId:null,
          }
        }
      },
      'imgForm.textarea'(n,o){
        if(n.length>200){
          this.isTextarea=true;
        }else{
          this.isTextarea=false;
        }
      },
    },
    methods: {
      /*获取部门下的用户*/
      getUserList(){
        getUserListAPI().then(res=>{
          if(res.data.status){
            this.userList=res.data.data;
            console.log('获取部门用户',this.userList);
          }
        })
      },
      /*批量审核*/
      reviewerBtn(){
        if(this.batchList.length == 0){
          this.$message.warning('请选择至少一条记录进行操作')
        } else{
          let boo = this.batchList.every((item) => {
            return item.logStatus==0||item.logStatus==3;
          });
          if (boo) {
            this.isbatchCommit = true;
          }else {
            this.$message.warning('只有未审核和二审驳回的数据可以批量审核');
          }
        }

      },
      updataReview(){

        this.$refs['imgForm'].validate((valid) => {
          if(valid){
            batchAuditAPI({
              auditOpinion: this.imgForm.textarea,
              currentStage: '2-3-1',
              ids: this.ids,
              status:this.imgForm.reviewStatus
            }).then(res=>{
              if(res.data.status){
                this.$message.success('批量审核成功');
                this.isbatchCommit=false;
                this.imgForm.reviewStatus='';
                this.imgForm.textarea='';
                console.log('批量审核',res.data);
                this.getList();
              }else{
                this.$message.error(res.data.msg);
              }
            })
          }
        })


      },
      /*指定审校人弹出框确认*/
      confirmAudit(){
        if(!this.peopleFrom.userId){
          this.$message.warning('请选择审校人');
          return
        }
        auditAssignAPI({
          ids: this.ids,
          auditor:this.peopleFrom.userId,
          auditorName:this.peopleFrom.userName,
          nextStage:'2-3-2'
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
      /*指定审校人*/
      reprintBtn(val){
        if (this.batchList.length == 0) {
          this.$message.warning('请选择至少一条记录进行操作')
        } else {
          const dataType = this.batchList.every(data => data.logStatus == 1)
          if(dataType) {
            let boo=this.batchList.every(data => data.isRepeatAssign == 0);
            if(boo){
              this.auditDialog = true;
            }else{
              this.$message.warning('请勿重复指派');
            }

          }else{
            this.$message.warning('只有审核通过的数据可进行操作');
          }
        }
      },
      /*获取列表数据*/
      getList(){
        this.listLoading=true;
        getSubListAPI(this.bookForm).then(res=>{
          if(res.data.status){
            this.listLoading=false;
            this.listData=res.data.data.list;
            this.total=res.data.data.total;
            this.getUserList();
          }
        })
      },
      //检索
      onSubmit() {
        if (this.timeLimit&&this.timeLimit.length > 0) {
          this.bookForm.createStartTime = this.timeLimit[0];
          this.bookForm.createEndTime = this.timeLimit[1];
        }else{
          this.bookForm.createStartTime=null;
          this.bookForm.createEndTime=null;
        }
        if (this.timeLimit1&&this.timeLimit1.length > 0) {
          this.bookForm.dealStartTime = this.timeLimit1[0];
          this.bookForm.dealEndTime = this.timeLimit1[1];
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
          type:'2-3-1',
          orderBy:this.bookForm.orderBy
        };
        this.timeLimit=[];
        this.timeLimit1=[];
        this.bookForm.bookType=Number(this.activeName);
        this.bookForm.status == 'null'?delete this.bookForm.status:true;
        this.getList();
      },
      handleClick(tab, event) {
        this.bookForm.bookType=Number(this.activeName);
        this.getList();
      },
      /*查看*/
      looktoRecord(item,name){
        this.$router.push({path:`/newBook/examine/examineView?lookId=${item.id}${name=='editId'?'&type=1':''}&logStatus=${item.logStatus}&status=2-3-1`});
      },
      /*勾选列表*/
      handleSelectionChange(val) {
        this.batchList = val;
        this.batchList.length > 0
          ? (this.ids = getMultipleSelectionIDs(this.batchList, "id"))
          : this.ids = [];
      },
      handleCurChange(val){
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
      //排序
      sortChanged({column, prop, order}) {
        if (order) {
          this.bookForm.orderBy = `${prop} ${order.substring(0, order.length - 6)}`
        } else {
          this.bookForm.orderBy = null
        }
        this.getList();
      },
    },
    activated() {
      /*if(!this.$route.meta.goback){
        this.userList=[];
        this.listData=[];
        this.tableKey=0;
        this.activeName='1';
        this.total=1;
        this.auditDialog=false;
        this.listLoading=false;
        this.bookForm={
          pageNum: 1,
          pageSize: 50,
          type:'2-3-1',
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
  .allTry{

  }
</style>
