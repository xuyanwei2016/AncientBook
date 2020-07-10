<template>
  <el-container class="project-plan xywCss submitBtn">
    <el-main>
      <div class="buttons">
        <el-button type="primary" v-if="authBtns.filter(i => i.idName=='addBtn').length>0"
                   @click="$router.push({path:'subject/subjectAdd'})">
          <i class="add"></i>选题申报
        </el-button>
        <el-button
          type="primary"
          @click="commit"
          v-if="authBtns.filter(i => i.idName=='submitBtn').length>0"
        >
          <i class="submitIcon"></i>提交审核
        </el-button>
        <el-button
          type="primary"
          @click="batchCommit"
          v-if="authBtns.filter(i => i.idName=='batchSubmitBtn').length>0"
        >
          <i class="submitIcon"></i>批量审核
        </el-button>
        <el-button
          type="primary"
          @click="choicEditor"
          v-if="authBtns.filter(i => i.idName=='editor').length>0"
        >
          <i class="submitIcon"></i>流程编辑
        </el-button>
        <el-button
          type="primary"
          @click="batchDelet"
          v-if="authBtns.filter(i => i.idName=='batchdeletBtn').length>0"
        >
          <i class="submitIcon"></i>
          批量删除
        </el-button>
        <el-button
          type="primary"
          @click="downloadExcel"
          v-if="authBtns.filter(i => i.idName=='downloadExcel').length>0"
        >
          <i class="imExcel"></i>导出Excel
        </el-button>
      </div>

      <div class="formlist">
        <el-form ref="form" :model="bookForm" label-width="82px">
          <el-form-item label="书  名">
            <el-input v-model="bookForm.bookName"></el-input>
          </el-form-item>
          <el-form-item label="申报时间">
            <el-date-picker
              v-model="declareDate"
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

          <el-form-item label="修改时间">
            <el-date-picker
              v-model="updateTime"
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
          <el-form-item label="责任编辑" width="180">
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
          <el-tabs v-model="changeStatus" type="border-card" @tab-click="handleClick">
            <!--<el-tab-pane label="所有选题" name="null"></el-tab-pane>-->
            <el-tab-pane v-for="(item,index) in status" :key="index" :label="item.name"
                         :name="item.status"></el-tab-pane>
          </el-tabs>
        </template>
        <div class="table_outer_wrap">
          <el-table
            :key="tableKey"
            :data="listData"
            v-loading="listLoading"
            element-loading-text="给我一点时间"
            border
            highlight-current-row
            ref="multipleTable"
            @selection-change="handleSelectionChange"
            @sort-change="sortChanged"
          ><!--@current-change="handleCurChange"-->
            <el-table-column type="index" align="center" label="序号"></el-table-column>
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="选题号" align="center">
              <template slot-scope="scope">{{scope.row.subjectNum }}</template>
            </el-table-column>
            <el-table-column label="书名" align="center">
              <template slot-scope="scope">{{scope.row.bookName }}</template>
            </el-table-column>
            <el-table-column label="作者" align="center">
              <template slot-scope="scope">{{ scope.row.author||'——'}}</template>
            </el-table-column>
            <el-table-column label="申报时间" sortable align="center" prop="declareDate">
              <template slot-scope="scope">{{ scope.row.declareDate ||'——'}}</template>
            </el-table-column>
            <el-table-column label="责任编辑" align="center">
              <template slot-scope="scope">{{ scope.row.editor ||'——'}}</template>
            </el-table-column>
            <el-table-column label="三审负责人" align="center">
              <template slot-scope="scope">{{ scope.row.thriceAuditName ||'——'}}</template>
            </el-table-column>
            <el-table-column label="修改时间" sortable align="center" prop="updateTime">
              <template slot-scope="scope">{{ scope.row.updateTime||'——'}}</template>
            </el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status =='1-1'">录入中</span>
                <span v-if="scope.row.status =='1-2-1'">待室主任审核</span>
                <span v-if="scope.row.status =='1-2-2'">待选题委员会审核</span>
                <span v-if="scope.row.status =='1-2-3'">待社长审核</span>
                <span v-if="scope.row.status =='1-3'">审核通过</span>
                <span v-if="scope.row.status =='1-4'">审核未通过</span>
                <span v-if="scope.row.status =='1-5'">三审驳回</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <i class="search distance" title="查看" @click="looktoRecord(scope.row,'lookId')"></i>
                <i class="edit distance" title="编辑" v-if="scope.row.status.indexOf('1-2')<0&&scope.row.status!='1-3'"
                   @click="looktoRecord(scope.row,'editId')"></i>
                <i class="imdel" title="删除" v-if="scope.row.status=='1-1'||scope.row.status=='1-4'" @click="deleteOne(scope.row)"></i>
                <i class="copy" title="审核" v-if="auth&&auth.filter(n=>n==scope.row.status).length>0"
                   @click="looktoRecord(scope.row,'examineId')"></i>

              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterright">
            <!--<el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="bookForm.pageNum"
              :page-sizes="[2,50,100,200,500]"
              :page-size="bookForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              align="center"
            ></el-pagination>-->
            <!--:page-size="listQuery.pageSize"-->
            <pagination @pagesize="pagesizeFun" :total="total"  @currentPage="currentPageFun" :page-size="bookForm.pageSize"
                        :current-page="bookForm.pageNum"></pagination>
          </div>
        </div>
      </div>
    </el-main>
    <v-alert :alertModelOptions="alertOptions"></v-alert>
    <el-dialog :visible.sync="isbatchCommit" width="500px" title="批量审核">
      <el-form class="batchCommit">
        <el-form-item label="审核意见：" >
          <el-radio-group  v-model="reviewStatus">
            <el-radio label="1-3">审核通过</el-radio>
            <el-radio label="1-4">审核未通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="inputC">
          <el-input type="textarea" :rows="4" v-model="textarea" ></el-input>
        </el-form-item>
        <span style="color: #F56C6C;height: 26px;line-height: 26px;" v-if="isTextarea">内容最多200字</span>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updataReview">确认</el-button>
        <el-button @click="isbatchCommit = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isEditor" width="500px" title="分配三审负责人">
      <el-form class="batchCommit">
        <el-form-item label="三审工作负责人：" >
          <el-select  value-key="userId" v-model="chargePerson" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="threeBtn">确认</el-button>
        <el-button @click="isEditor = false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="isdownloadExcel" width="500px" title="导出">
      <el-form class="batchCommit">
        <el-form-item label="导出范围：" >
          <el-radio-group  v-model="opsType">
            <el-radio :label="0">全部数据</el-radio>
            <el-radio :label="1">选中数据</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportBtn">确认</el-button>
        <el-button @click="isdownloadExcel = false">取消</el-button>
      </div>
    </el-dialog>

  </el-container>
</template>
<script>
  import store from "@/store";
  import router from "vue-router";
  import {getMultipleSelectionIDs} from "@/filters/getIds";
  import {confirm, requestMsg} from '../../../utils/publicFunctions';
  import "@/styles/resource.scss";
  import pagination from "../../../views/resource/components/pagination";
  import {getListAPI, updateStatusAPI, batchDeleteAPI,exportAPI,batchAuditAPI,getAuthAPI,getUserListAPI,subjectAssignAPI} from '@/api/newBook/subject';

  export default {
    name: "subjectIndex",
    components: {
      pagination
    },
    data() {
      return {
        authBtns: [],
        declareDate: [],
        updateTime: [],
        bookForm: {
          pageNum: 1,
          pageSize:50,
          status: null,
        },
        isbatchCommit:false,
        reviewStatus:'',
        textarea:'',
        isEditor:false,
        chargePerson:null,
        isdownloadExcel:false,
        options:[],
        alertOptions:{},
        changeStatus: null,
        status: [
          {name: '所有选题', status: null},
          {name: '录入中', status: '1-1'},
          {name: '待审核', status: '1-2'},
          {name: '审核通过', status: '1-3'},
          {name: '审核未通过', status: '1-4'},
          {name: '三审驳回', status: '1-5'}],
        //录入中：1-1 待室主任审核：1-2-1 待选题委员会审核：1-2-2 待社长审核：1-2-3 审核通过：1-3 审核未通过：1-4 三审驳回：1-5
        timeLimit: [],
        authList:['1-2-1','1-2-2','1-2-3','1-3'],
        authIndex:null,
        statusOne:null,
        tableKey: 0,
        listData: [],
        listLoading: false,
        multipleSelection: [],
        activeName: "first",
        total: 1,
        ids: [],
        opsType:1,
        auth:null,
        userList:[],
        isTextarea:false,
      };
    },
    mounted() {
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
      this.getList();
      this.getAuth();
      this.getUserList();
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    },
    watch:{
      isbatchCommit(n,o){
        if(!n){
          this.reviewStatus='';
          this.textarea='';
        }
      },
      isEditor(n,o){
        if(!n){
          this.chargePerson=null;
        }
      },
      textarea(n,o){
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
          }
        })
      },
      getAuth(){
        getAuthAPI().then(res=>{
          if(res.data.status){
            let keys=Object.keys(res.data.data),obj=res.data.data;
            this.auth=keys.filter((item)=>{
              return obj[item]==1;
            })
          }
        })
      },
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type];
      },
      //导出
      exportExc() {
      },
      //检索
      onSubmit() {
        if (this.declareDate&&this.declareDate.length > 0) {
          this.bookForm.declareStartDate = this.declareDate[0];
          this.bookForm.declareEndDate = this.declareDate[1];
        }else{
          this.bookForm.declareStartDate=null;
          this.bookForm.declareEndDate=null;
        }
        if (this.updateTime&&this.updateTime.length > 0) {
          this.bookForm.updateStartTime = this.updateTime[0];
          this.bookForm.updateEndTime = this.updateTime[1];
        }else{
          this.bookForm.updateStartTime = null;
          this.bookForm.updateEndTime = null;
        }
        this.bookForm.pageNum = 1;
        this.getList();
      },
      //重置
      onReset() {
        this.bookForm = {
          pageNum: 1,
          pageSize: this.bookForm.pageSize,
          status:this.bookForm.status,
          orderBy:this.bookForm.orderBy
        };
        this.declareDate=[];
        this.updateTime=[];
        this.bookForm.status == 'null'?delete this.bookForm.status:true;
        this.getList();
      },
      handleCurChange(val) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.multipleSelection.length > 0
          ? (this.ids = getMultipleSelectionIDs(this.multipleSelection, "id"))
          : this.ids = [];
      },

      // 排序
      sortChanged({column, prop, order}) {
        if (order) {
          this.bookForm.orderBy = `${prop} ${order.substring(0, order.length - 6)}`
        } else {
          this.bookForm.orderBy = null
        }
        this.getList();
      },

      getList() {
        this.listLoading = true;
        getListAPI(this.bookForm).then(res => {
          if (res.data.status) {
            this.listData = res.data.data.list;
            this.listLoading = false;
            this.total = res.data.data.total;
          }
        })
      },
      //查看图书
      looktoRecord(item, name) {
        if (name == 'examineId') {
          this.$router.push({path: `/newBook/subject/examine?lookId=${item.id}`});
          return
        }
        this.$router.push({path: `/newBook/subject/view?${name}=${item.id}`});
      },
      //提交审核
      commit() {
        let self = this;

        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }
        let boo = this.multipleSelection.every((item) => {
          return item.status == '1-1' || item.status == '1-4';
        });
        if (boo) {
          updateStatusAPI(self.ids).then(res => {
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
          this.$message.warning('只有录入中状态下的数据可以提交审核')
        }

      },
      //批量审核
      batchCommit() {
        let self = this;
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }

        let boo = this.multipleSelection.every((item) => {
          return item.status.indexOf('1-2')>=0;
        });
        if (boo) {
          this.statusOne=this.multipleSelection[0].status;
          let statusAll=this.multipleSelection.every((item)=>{
            return this.statusOne==item.status;
          })
          if(!statusAll){
            this.$message.warning('您不能同时审核不同状态的数据');
            return
          }

          this.authIndex = this.auth.findIndex((n) => n == this.statusOne);

          if(this.authIndex>=0){
            this.isbatchCommit=true;
          }else{
            if(this.auth&&this.auth.length>0){
              let obj={'1-2-1':'待室主任审核','1-2-2':'待选题委员会审核','1-2-3':'待社长审核'};
              this.$message.warning(`您只能审核状态为${obj[this.auth]}的数据`);
            }else{
              this.$message.warning(`您没有审核权限`);
            }

          }
        }else {
          this.$message.warning('只有待审核的数据可以批量审核');
        }
      },
      updataReview(){

        let reviewStatus=null,index=null;
        if(this.reviewStatus==''){
          this.$message.warning('请选择审核意见');
          return
        }else if(this.reviewStatus=='1-4'){
          reviewStatus='1-4';
        }else{
          index=this.authList.indexOf(this.statusOne);
          reviewStatus=this.authList[index+1];
        }
        let list=[];
        this.multipleSelection.map((item,index)=>{
          let iObj={id: item.id,
            subjectNum:item.subjectNum};
          list=[...list,iObj];
        })
        if(this.textarea.length>200){
          this.isTextarea=true;
          return
        }

        batchAuditAPI({
          auditOpinion:  this.textarea,
          nextStage: reviewStatus,
          stage: this.statusOne,
          status: this.reviewStatus=='1-3'?'1':'0',
          subjects: list
        }).then(res=>{
          if(res.data.status){
            this.$message.success('批量审核成功');
            this.isbatchCommit=false;
            this.reviewStatus='';
            this.textarea='';
            this.getList();
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },
      //导出excel
      downloadExcel() {
        if(this.multipleSelection.length==0){
          this.opsType=0;
        }else{
          this.opsType=1;
        }
        this.isdownloadExcel=true;
      },
      exportBtn(){
        let data={};
        if(this.opsType==0){
          data.opsType=0;
        }else{
          if(this.multipleSelection.length>0){
            data.opsType=this.opsType;
            data.ids=this.ids;
          }else{
            this.$message.warning('请到列表中选择要导出的数据');
            return
          }
        }

        let url=`${process.env.BASE_API}/newbook/bg/subject/export?`,url2='';
        for(let key in data){
          if(data[key]!=null){
            url2=url2+`&${key}=${data[key]}`;
          }
        }
        url=url+url2.substring(1);
        window.open(url);
        this.isdownloadExcel=false;
      },

      //批量删除
      batchDelet() {
        let self = this;
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }
        let boo = this.multipleSelection.every((item) => {
          return item.status == '1-1' || item.status == '1-4';
        });
        if (boo) {
          confirm.apply(this,['确定要删除选择的选题信息吗？']).then(() => {
            batchDeleteAPI(self.ids).then(res => {
              if (res.data.status) {
                this.$message.success('删除成功');
                this.getList();
              }
            })
          })
        } else {
          this.$message.warning('只有录入中和审核未通过的数据可以删除')
        }
      },
      /*单个删除*/
      deleteOne(item){

        let ids=[item.id];
        confirm.apply(this,['确定要删除选择的选题信息吗？']).then(() => {
          batchDeleteAPI(ids).then(res => {
            if (res.data.status) {
              this.getList();
              this.$message.success('删除成功');
            }
          })
        })
      },
      //流程编辑
      choicEditor() {
        let self = this;
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }
        let boo = this.multipleSelection.every((item) => {
          return item.status == '1-5' || (item.status == '1-3'&&item.thriceAudit == null);
        });
        if (boo) {
          this.isEditor=true;
          /*confirm.apply(this,['确认删除吗？']).then(() => {
            batchDeleteAPI({ids: self.ids}).then(res => {
              if (res.data.status) {
                this.$message.success('删除成功');
              }
            })
          })*/


        } else {
          this.$message.warning('只有三审驳回和审核通过并且没有三审负责人的数据可以进行流程编辑')
        }
      },
      /*指定三审负责人*/
      threeBtn(){
        if(!this.chargePerson){
          this.$message.warning('请选择三审工作负责人');
          return
        }
        subjectAssignAPI({
          ids: this.ids,
          userId:this.chargePerson.userId,
          userName:this.chargePerson.userName
        }).then(res=>{
          if(res.data.status){
            this.isEditor=false;
            this.$message.success('指定三审负责人成功');
            this.getList();
            this.chargePerson=null;
          }else{
            this.$message.error(res.data.msg);
          }
        })

      },
      handleClick(tab, event) {
        this.bookForm.status = tab.name;
        this.getList();
      },
      // 翻页
      currentPageFun(val) {
        this.bookForm.pageNum = val;
        this.getList();
      },
      pagesizeFun(val) {
        this.bookForm.pageNum = 1;
        this.bookForm.pageSize = val;
        this.getList();
      }
    },
    activated() {
      if(store.state.tagsView.isNewone){
        this.bookForm.pageNum=1;
      }
      this.getList();
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
