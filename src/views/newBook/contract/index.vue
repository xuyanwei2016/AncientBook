<template>
  <!--合同管理-->
  <div class="contract">
    <el-container class="project-plan">
      <el-main>
        <div class="buttons">
          <el-button
            type="primary"
            @click="importContract"
            v-if="authBtns.filter(i => i.idName=='importContract').length>0"
          >
            <i class="submitIcon"></i>导入合同
          </el-button>
          <el-button
            type="primary"
            @click="addBtn"
            v-if="authBtns.filter(i => i.idName=='addBtn').length>0"
          >
            <i class="submitIcon"></i>添加
          </el-button>
          <el-button
            type="primary"
            @click="batchDelete"
            v-if="authBtns.filter(i => i.idName=='batchDelete').length>0"
          >
            <i class="submitIcon"></i>批量删除
          </el-button>
          <el-button
            type="primary"
            @click="exportExcel"
            v-if="authBtns.filter(i => i.idName=='exportExcel').length>0"
          >
            <i class="submitIcon"></i>导出Excel
          </el-button>

        </div>


        <div class="formlist">
          <el-form ref="form" inline :model="bookForm">
            <el-form-item label="检索信息">
              <el-input v-model="bookForm.condition" placeholder="合同名称/合同编号"></el-input>
            </el-form-item>

            <el-form-item class="width90" style="margin-left: 0!important;">
              <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search"  style="margin: 0">检索</el-button>
             <!-- <el-button type="primary" plain @click="onReset">
                <i class></i>重置
              </el-button>-->
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
              <el-table-column label="合同名称" align="center">
                <template slot-scope="scope">{{scope.row.name }}</template>
              </el-table-column>
              <el-table-column label="合同编号" align="center">
                <template slot-scope="scope">{{scope.row.identifier }}</template>
              </el-table-column>
              <el-table-column label="合同类型" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.contractClass==1">出版合同</span>
                  <span v-if="scope.row.contractClass==2">采购合同</span>
                  <span v-if="scope.row.contractClass==3">版权合同</span>
                </template>
              </el-table-column>
              <el-table-column label="签订时间" align="center">
                <template slot-scope="scope">{{ scope.row.signingTime }}</template>
              </el-table-column>
              <el-table-column label="到期时间" align="center">
                <template slot-scope="scope">{{ scope.row.endTime }}</template>
              </el-table-column>
              <el-table-column label="乙方" align="center">
                <template slot-scope="scope">{{ scope.row.secondParty }}</template>
              </el-table-column>

              <el-table-column label="操作" align="center">
                <template slot-scope="scope">

                  <i class="search distance"  title="查看"  v-if="true" @click="looktoRecord(scope.row,'lookId')"></i>
                  <i class="edit distance" title="编辑" v-if="true"  @click="editBtn(scope.row.id)"></i>
                  <i class="imdel" title="删除" v-if=""  @click="singleDelete(scope.row.id)"></i>

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


    <!--导入合同-->
    <el-dialog
      title="导入合同"
      :visible.sync="importExcDialog"
      class="backgroundDialog importExcDialog"
    >
      <p>请选择要导入的文件，文件类型只支持Excel。</p>
      <div class="importExc">
        <input
          type="file"
          ref="file"
          id="videoForm"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        >
        <a class="fake-download" :href="`${domain}/file/templet/版权导入模板.xlsx`">下载模板文件</a>
      </div>
      <el-progress :percentage="percentageValue" :stroke-width="12" style="margin:15px auto" color="#67C23A" v-if="percentageValue"></el-progress>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmImport">确 定</el-button>
        <el-button @click="importExcDialog = false">取 消</el-button>
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
  </div>
</template>

<script>
  import {getListAPI,deleteAPI,excelAPI,exportAPI} from "@/api/website-management/copyright";
  import store from "@/store";
  import { getMultipleSelectionIDs, removeDuplicates } from "@/filters/getIds";
  import {requestMsg, confirm, checkSelect, operationMsg} from '@/utils/publicFunctions';
  import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
  import Cookies from "js-cookie";
  import pagination from "@/views/resource/components/pagination";
  import '../../../styles/icon.scss';
  import "@/styles/resource.scss";
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
        listData: [{questNumber:11,name:'2222',author:'sss'}],
        listLoading: false,
        tableKey: 0,
        batchList: [],
        total:0,
        importExcDialog:false,
        percentageValue:0,  //进度条值
        domain: process.env.BASE_API,
        isdownloadExcel:false,
        opsType:1,
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
    methods: {
      /*行内修改*/
      editBtn(id) {
        this.$router.push({ path:'/newBook/contract/view', query:{id:id,type:'edit'}})
      },
      /*行内删除*/
      singleDelete(id){
        this.massSetting(`确定要删除已选内容吗？`, deleteAPI, [id], `删除`)
      },
      massSetting(msg, api, data, msgName){
        confirm.apply(this,[msg]).then(() => {
          api(data).then(res => {
            operationMsg.apply(this,[res.data, msgName])
          })
        })
      },


      /*弹出框确认*/
      confirmAudit() {

      },

      /*获取列表数据*/
      getList() {
        this.listLoading = true;
        getListAPI(this.bookForm).then(res => {
          if (res.data.code === 0) {
            this.listData = res.data.data.list;
            this.total = res.data.data.total;
          } else {
            this.$message.error("获取数据失败");
          }
          this.listLoading = false;
        });
      },
      //检索
      onSubmit() {
        this.bookForm.pageNum = 1;
        this.getList();
      },
      /*查看*/
      looktoRecord(item,name) {
        this.$router.push({ path:'/newBook/contract/view', query:{lookId:item.id,type:'detail'}})
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
      //导入合同
      importContract(){
        console.log(this.$refs.file)
        this.importExcDialog=true;
        this.percentageValue=0;
        /*document.getElementById('videoForm')&&document.getElementById('videoForm').reset();*/
        /*this.$set(this.$refs,'file',null);*/
        /*this.$refs.file.files=[];*/
        /*console.log(1111,this.$refs.file)*/
        if(this.$refs.file){
          var file = document.getElementById('videoForm');
          file.value = ''; //虽然file的value不能设为有字符的值，但是可以设置为空值
        }

      },
      //上传文件
      confirmImport() {
        if (this.$refs.file.files[0]) {
          const fileObj = this.$refs.file.files[0];
          // FormData 对象
          const form = new FormData();
          // 文件对象
          form.append("file", fileObj);
          var timeid = window.setInterval( ()=>{
            if(this.percentageValue<100){
              this.percentageValue+=25;

            }
          },20);

          excelAPI(form).then(res => {
            window.clearInterval(timeid)
            if (res.data.code == 0) {

              this.$message.success(
                "文件：" + fileObj.name + "," + res.data.data
              );

              this.importExcDialog = false;
              this.getList();
            } else {
              //this.$message.error("文件：" + fileObj.name + "上传失败");
              this.$message.error('请使用正确的模板上传文件');
              /*this.importExcDialog = false;*/
            }
          });
        }else{
          this.$message.warning('请选择文件');
        }
      },
      //添加
      addBtn(){
        this.$router.push({path:`/newBook/contract/view`,query:{id:null,type:'add'}})
      },
      //批量删除
      batchDelete(){
        if (checkSelect.apply(this, [this.batchList])) {
          let ids = getMultipleSelectionIDs(this.batchList)
          confirm.apply(this, ["确定要删除已选内容吗？"]).then(() => {
            deleteAPI(ids).then(res => {
              requestMsg.apply(this, [res.data, "删除"]);
            });
          });
        }

      },
      //导出Excel
      exportExcel(){
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
          if(this.batchList.length>0){
            data.opsType=this.opsType;
            data.ids=getMultipleSelectionIDs(this.batchList);
          }else{
            this.$message.warning('请到列表中选择要导出的数据');
            return
          }
        }

        let url=`${process.env.BASE_API}/resource/bg/copyright/export?`,url2='';
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

    }
  }
</script>

<style lang="less">
  .contract{
    .backgroundDialog .el-button{
      background:#03bcd9;
      color:white;
    }
    .importExcDialog .el-dialog{
      width: 420px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -210px;
      margin-top: -150px !important;
    }
  }
  .fake-download{
    color: #4285F4;
  }

</style>
