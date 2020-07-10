<template>
  <el-container class="project-plan submitBtn">
    <el-main>
      <div class="buttons">
        <el-button type="primary" v-if="authBtns.filter(i => i.idName=='submitAudit').length>0" @click="submitAudit">
          <i class="add"></i>提交审核
        </el-button>
        <el-button
          type="primary"
          @click="commit"
          v-if="authBtns.filter(i => i.idName=='audit').length>0"
        >
          <i class="submitIcon"></i>审核
        </el-button>
        <el-button
          type="primary"
          @click="assignNumber"
          v-if="authBtns.filter(i => i.idName=='assignNumber').length>0"
        >
          <i class="submitIcon"></i>分配书号
        </el-button>
        <el-button
          type="primary"
          @click="choicEditor"
          v-if="authBtns.filter(i => i.idName=='fillCip').length>0"
        >
          <i class="submitIcon"></i>填写CIP
        </el-button>

        <el-button
          type="primary"
          @click="downloadExcel"
          v-if="authBtns.filter(i => i.idName=='exportExcel').length>0"
        >
          <i class="imExcel"></i>导出Excel
        </el-button>
      </div>

      <div class="formlist">
        <el-form ref="form" :model="bookForm" label-width="82px">
          <el-form-item label="书名">
            <el-input v-model="bookForm.bookName"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="bookForm.author"></el-input>
          </el-form-item>
          <el-form-item label="书号">
            <el-input v-model="bookForm.isbn"></el-input>
          </el-form-item>
          <el-form-item label="选题号">
            <el-input v-model="bookForm.subjectNum"></el-input>
          </el-form-item>
          <el-form-item label="下发时间">
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
            <el-tab-pane label="所有图书" :name="null"></el-tab-pane>
            <el-tab-pane label="录入中" name="4-1"></el-tab-pane>
            <el-tab-pane label="待审核" name="4-2"></el-tab-pane>
            <el-tab-pane label="未分配" name="4-5"></el-tab-pane>
            <el-tab-pane label="已分配" name="4-7"></el-tab-pane>
            <el-tab-pane label="审核通过" name="4-3"></el-tab-pane>
            <el-tab-pane label="审核未通过" name="4-4"></el-tab-pane>
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
            <el-table-column type="index" align="center" label="序号" width="60"></el-table-column>
            <el-table-column label="选题号" align="center">
              <template slot-scope="scope">{{scope.row.subjectNum }}</template>
            </el-table-column>
            <el-table-column label="书名" align="center">
              <template slot-scope="scope">{{scope.row.bookName }}</template>
            </el-table-column>
            <el-table-column label="作者" align="center">
              <template slot-scope="scope">{{ scope.row.author||'——' }}</template>
            </el-table-column>
            <el-table-column label="下发时间" sortable="custom" align="center" prop="releaseTime">
              <template slot-scope="scope">{{ scope.row.releaseTime||'——' }}</template>
            </el-table-column>
            <el-table-column label="责任编辑" align="center">
              <template slot-scope="scope">{{ scope.row.editor ||'——' }}</template>
            </el-table-column>
            <el-table-column label="ISBN" align="center">
              <template slot-scope="scope">{{ scope.row.isbn||'——' }}</template>
            </el-table-column>
            <el-table-column label="核子号" align="center">
              <template slot-scope="scope">{{ scope.row.cip ||'——' }}</template>
            </el-table-column>
            <!--stage (string, optional): 状态：录入中：4-1，待审核：4-2，审核通过：4-3，审核未通过：4-4，待CIP分配：4-5，待书号分配：4-6，已分配：4-7 ,-->
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span>{{status[scope.row.stage]}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <i class="search distance" title="查看" @click="looktoRecord(scope.row,'lookId')"></i>
                <i class="edit distance" title="编辑" v-if="scope.row.stage=='4-1'||scope.row.stage=='4-4'||scope.row.stage==null"
                   @click="looktoRecord(scope.row,'editId')"></i>

                <i class="copy" title="分配" v-if="scope.row.stage=='4-5'||scope.row.stage=='4-6'" @click="distribution(scope.row)"></i>

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
        <!--批量审核-->
        <el-dialog title="批量审核" :visible.sync="batchDialog" class="auditDialog backgroundDialog" width="500px">
          <el-form :model="firstPeople" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="审核状态:" prop="status">
              <el-radio-group v-model="firstPeople.status">
                <el-radio label="1">审核通过</el-radio>
                <el-radio label="0">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注:" class="width360">
              <el-input v-model="firstPeople.remark" name="remark" type="textarea" :rows="4" maxlength="200" resize="none"></el-input>
            </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="batchSubmit">确 定</el-button>
            <el-button @click="batchDialog = false">取 消</el-button>
          </div>
        </el-dialog>
        <!--分配书号-->
        <el-dialog title="添加书号" :visible.sync="numberDialog" class="auditDialog backgroundDialog"  width="500px">
          <el-form  label-width="100px">
            <el-form-item label="书号:">
              <el-input v-model="isbn"></el-input>
            </el-form-item>
            <el-form-item label="上传条码:">
              <el-upload :action="`${uploadUrl}${uploadPath}/info`" :on-exceed="handleFileExceed"
                         :before-upload="beforeFileUpload" :on-success="handleFileSuccess" multiple :limit="1"
                         :file-list="fileList"
                         :on-remove="handleFileRemove">
                <el-button :loading="uploading">选择文件</el-button>

              </el-upload>
              <span class="t" style="color: #ccc">可上传包括JPG/PNG/GIF，小于3M的图片</span>
            </el-form-item>


          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="assignIsbn">确 定</el-button>
            <el-button @click="numberDialog = false">取 消</el-button>
          </div>
        </el-dialog>

        <!--导出-->
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

        <!--填写CIP-->
        <el-dialog title="添加CIP" :visible.sync="cipDialog" class="auditDialog backgroundDialog" width="500px">
          <el-form  :model="addCip" :rules="rules" ref="cipForm">
            <el-form-item label="图书在版编目（CIP）:" prop="content">
              <el-input v-model="addCip.content" name="content" type="textarea" :rows="4"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="fillCIP">确 定</el-button>
            <el-button @click="cipDialog = false">取 消</el-button>
          </div>
        </el-dialog>


        <v-alert :alertModelOptions="alertOptions"></v-alert>
      </div>
    </el-main>
  </el-container>
</template>
<script>
  import '../../../styles/icon.scss';
  import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js';
  import store from "@/store";
  import {getMultipleSelectionIDs} from "@/filters/getIds";
  import "@/styles/resource.scss";
  import pagination from "../../../views/resource/components/pagination";
  import {getListAPI,updateStatusAPI,batchAuditAPI,fillCipAPI,assignIsbnAPI} from '@/api/newBook/cip.js';

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
        fileList:[],
        authBtns: [],
        bookForm: {
          pageNum: 1,
          pageSize: 50,
        },
        timeLimit: [],
        tableKey: 0,
        listData: [],
        listLoading: false,
        multipleSelection: [],
        activeName: null,
        total: 1,
        batchDialog: false,
        firstPeople: {
          status:null,
          remark:'',
        },
        addCip: {
          content:'',
        },
        reviewStatus:'',
        batchList: [],
        ids: [],
        numberDialog: false,
        cipDialog: false,
        uploading: false,
        status: {
          '4-1': '录入中',
          '4-2': '待审核',
          '4-3': '审核通过',
          '4-4': '审核未通过',
          '4-5': '待CIP分配',
          '4-6': '待书号分配',
          '4-7': '已分配'
        },
        isbn:'',
        barCode:'',
        isdownloadExcel:false,
        opsType:1,
        rules: {
          status:[{ required: true, message: "请选择审核状态", trigger: "change" }],
          content:[{ required: true, message: "请输入图书在版编目（CIP）", trigger: "change" },{ max: 700, message: "图书在版编目（CIP）输入长度小于700", trigger: "change" }],
        }
      };
    },
    mounted() {
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
      this.getList();
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    },
    watch:{
      batchDialog(n,o){
        if(!n){
          this.$nextTick(()=>{
            this.firstPeople.status=null;
            this.firstPeople.remark='';
            this.$refs['ruleForm'].resetFields();
          })
        }
      },
      cipDialog(n,o){
        if(!n){
          this.$nextTick(()=>{
            this.addCip.content='';
            this.$refs['cipForm'].resetFields();
          })
        }
      },
      numberDialog(n,o){
        if(!n){
          this.$nextTick(()=>{
            this.isbn='';
            this.fileList=[];
          })
        }
      },
    },
    methods: {
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type];
      },
      //导出
      exportExc() {
      },
      //检索
      onSubmit() {
        this.bookForm.pageNum = 1;
        if(this.timeLimit&&this.timeLimit.length>0){
          this.bookForm.startTime = this.timeLimit[0];
          this.bookForm.endTime = this.timeLimit[1];
        }else{
          this.bookForm.startTime = null;
          this.bookForm.endTime = null;
        }

        this.getList();
      },
      //重置
      onReset() {
        this.bookForm = {
          pageNum: 1,
          pageSize: this.bookForm.pageSize,
          stage: this.bookForm.stage
        };
        this.timeLimit=[];
        this.getList();
      },
      handleCurChange(val) {
        this.$refs.multipleTable.clearSelection();
        this.$refs.multipleTable.toggleRowSelection(val);
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
        this.$router.push({path: `/newBook/cip/view?${name}=${item.id}`});
      },
      //提交审核
      commit() {
        let self=this;
        if (this.batchList.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }
        let boo = this.batchList.every((item) => {
          return item.stage == '4-2'||item.stage=='4-4';
        })
        if (boo) {
          this.batchDialog = true;
        } else {
          this.$message.warning('只有待审核状态下的数据可以审核')
        }
      },
      batchSubmit() {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            batchAuditAPI({
              ids: this.ids,
              remark: this.firstPeople.remark,
              status:this.firstPeople.status
            }).then(res=>{
              if(res.data.status){
                this.$message.success('批量审核成功');
                this.firstPeople.remark='';
                this.firstPeople.status=null;
                this.ids=[];
                this.batchDialog=false;
                this.getList();
              }else{
                this.$message.error(res.data.msg);
              }
            })
          }
        })

      },


      /*分配书号*/
      assignNumber() {
        let self=this;
        if (this.batchList.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }
        let boo = this.batchList.every((item) => {
          return item.stage == '4-3'||item.stage == '4-6';
        })
        if (boo) {
          this.numberDialog = true;
        } else {
          this.$message.warning('只有审核通过状态下的数据可以操作')
        }

      },
      assignIsbn(){
        if(this.isbn==''){
          this.$message.warning('请填写书号');
          return
        }
        if(this.isbn.length>20){
          this.$message.warning('书号长度限制在20以内');
          return
        }
        if(this.barCode==''){
          this.$message.warning('请上传条码');
          return
        }
        assignIsbnAPI({
          ids:this.ids,
          isbn:this.isbn,
          barCode:this.barCode}).then(res=>{
          if(res.data.status){
            this.$message.success('分配成功');
            this.numberDialog=false;
            this.getList();
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },
      /*提交审核*/
      submitAudit(){
        let self=this;
        if (this.batchList.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }
        let boo = this.batchList.every((item) => {
          return item.stage == '4-1';
        })
        if (boo) {
          updateStatusAPI({ids: this.ids}).then(res => {
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
      },
      //导出excel
      downloadExcel() {
        if(this.batchList.length==0){
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
          console.log(22222,this.batchList)
          if(this.batchList.length>0){
            data.opsType=this.opsType;
            data.ids=this.ids;
          }else{
            this.$message.warning('请到列表中选择要导出的数据');
            return
          }
        }

        let url=`${process.env.BASE_API}/newbook/bg/cip/export?`,url2='';
        for(let key in data){
          console.log(key,data[key])
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
      },
      //填写CIP
      choicEditor() {
        let self=this;
        if (this.batchList.length == 0) {
          this.$message.warning('请选择一条数据进行操作');
          return
        }
        let boo = this.batchList.every((item) => {
          return item.stage == '4-3'||item.stage == '4-5';
        })
        if (boo) {
          this.cipDialog = true;
        } else {
          this.$message.warning('只有审核通过和待CIP分配状态下的数据可以操作')
        }
      },
      fillCIP(){
        this.$refs['cipForm'].validate(valid => {
          if (valid) {
            console.log(22222,this.ids)
            fillCipAPI({
              ids:this.ids,
              content:this.addCip.content
            }).then(res=>{
              if(res.data.status){
                this.$message.success('添加成功');
                this.ids=[];
                this.addCip.content='';
                this.cipDialog = false;
                this.getList();
              }else{
                this.$message.error(res.data.msg);
              }
            })
          }
        })

      },
      handleClick(tab, event) {
        /*录入中：4-1，待审核：4-2，审核通过：4-3，审核未通过：4-4，待CIP分配：4-5，待书号分配：4-6，已分配：4-7*/
        this.bookForm.stage = tab.name;
        console.log(tab)
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
      /*上传图片*/
      handleFileExceed(files, fileList) {
        this.$message.warning(`单次上传最多1个文件`);
      },
      beforeFileUpload(file) {
        // console.log(file)
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
          return isJPG
        }
        if (!isLt3M) {
          this.$message.error('上传图片大小不能超过 3MB!')
          return isLt3M
        }
        this.uploading = true
      },
      handleFileSuccess(response, file, fileList) {
        this.barCode=response.data.fileName;
        this.uploading = false;
      },
      handleFileRemove() {//删除pdf
        this.barCode = '';
      },
      /*行内分配*/
      distribution(item){
        console.log(1111,item)
        this.$router.push({path: `/newBook/cip/view?lookId=${item.id}&type=distribution`});
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
