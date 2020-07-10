<template>
  <div class="app-container">
    <div class="buttons">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('leadBtn') >= 0" @click="leadBtn">
        {{authBtns.filter(i => i.idName=='leadBtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='leadBtn').length>0 && authBtns.filter(i => i.idName=='leadBtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('leadBtn')].icon, 'el-icon--right']"
        ></i>
      </el-button>
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0" @click="addBtn">
        {{authBtns.filter(i => i.idName=='addBtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"
        ></i>
      </el-button>

      <el-button
        v-if="authBtns.map(i => i.idName).indexOf('deletAllBtn') >= 0"
        @click="deletAllBtn"
      >
        {{authBtns.filter(i => i.idName=='deletAllBtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='deletAllBtn').length>0 && authBtns.filter(i => i.idName=='deletAllBtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('deletAllBtn')].icon, 'el-icon--right']"
        ></i>
      </el-button>
    </div>
    <el-form inline class="form-inline">
      <el-form-item label="检索信息">
        <el-input v-model="listQuery.condition" placeholder="合同名称/合同编号" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter" icon="el-icon-search">检索</el-button>
      </el-form-item>
    </el-form>
    <el-table :key="tableKey"   class="tablelist"  :data="list"  v-loading="listLoading"  element-loading-text="给我一点时间" border  highlight-current-row  stripe  @selection-change="chioceList">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column label="合同名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同编号" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.identifier}}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同类型" min-width="120" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.contractClass==1">出版合同</span>
          <span v-if="scope.row.contractClass==2">采购合同</span>
          <span v-if="scope.row.contractClass==3">版权合同</span>
        </template>
      </el-table-column>
      <el-table-column label="签订时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.signingTime}}</span>
        </template>
      </el-table-column>
       <el-table-column label="到期时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
       <el-table-column label="乙方" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.secondParty}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i
            :class="authBtns.filter(i => i.idName=='editBtn')[0].icon"
            :title="authBtns.filter(i => i.idName=='editBtn')[0].name"
            v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"
            @click="editBtn(scope.row.id)"
          ></i>

          <i
            :class="authBtns.filter(i => i.idName=='detailsBtn')[0].icon"
            :title="authBtns.filter(i => i.idName=='detailsBtn')[0].name"
            v-if="authBtns.filter(i => i.idName=='detailsBtn').length > 0"
            @click="detailsBtn(scope.row.id)"
          ></i>

          <i
            :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon"
            :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name"
            v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0"
            @click="singleDelete(scope.row.id)"
          ></i>
        </template>
      </el-table-column>
    </el-table>
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
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        >
        <a class="fake-download" :href="`${domain}/file/templet/版权导入模板.xlsx`">下载模板文件</a>
      </div>
      <el-progress :percentage="percentageValue" :stroke-width="12" style="margin:15px auto" color="#67C23A"></el-progress>
       <div slot="footer" class="dialog-footer">
        <el-button @click="confirmImport">确 定</el-button>
        <el-button @click="importExcDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 底部 -->
    <div  v-if="total>0" class="prfooter">
      <div class="prfooterright">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.pageNum"
          :page-sizes="[30,50,100,200,500]"
          :page-size="listQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          align="center"
        ></el-pagination>
      </div>
    </div>


  </div>
</template>



<script>
import {getListAPI,deleteAPI,excelAPI} from "@/api/website-management/copyright";
import { requestMsg, confirm, checkSelect, operationMsg} from "@/utils/publicFunctions";
import { getMultipleSelectionIDs, removeDuplicates } from "@/filters/getIds";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import Cookies from "js-cookie";
import store from "@/store";
import "@/styles/resource.scss";
export default {
  data() {
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      nation: "", //民族
      upfiles:true,
      listQuery: {
        pageNum: 1,
        pageSize: 50
      },
      fileList:[],
      timeLimit: null,
      multipleSelection: [],
      data: [
        {
          dataType: "",
          dataTypeSort: "",
        }
      ],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      editId: "",
      temp: {},
      rules: {
        name: [
          {
            required: true,
            pattern: /^.{1,6}$/,
            message: "请输入不超过六个字的标签名称",
            trigger: "change"
          }
        ]
        // database:[
        //   { required: true, trigger: 'change', message: '请选择数据类型'}
        // ]
      },
      importExcDialog:false,
      batchData:{
        ids:''
      },
      uploadHetong:{
        file:''
      },
      percentageValue:0  //进度条值
    };
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
  },
  mounted() {
    this.getList();
    this.nation = Cookies.get("nation");
  },
  methods: {
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if (res.data.code === 0) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    deletAllBtn(id) {
      //删除功能
      if (checkSelect.apply(this, [this.multipleSelection])) {
        this.batchData.ids = getMultipleSelectionIDs(this.multipleSelection)
        confirm.apply(this, ["确定要删除吗？"]).then(() => {
        deleteAPI(this.batchData.ids).then(res => {
          requestMsg.apply(this, [res.data, "删除"]);
        });
      });
      }

    },
    massSetting(msg, api, data, msgName){
      confirm.apply(this,[msg]).then(() => {
        api(data).then(res => {
          operationMsg.apply(this,[res.data, msgName])
        })
      })
    },
    singleDelete(id){
      this.massSetting(`确定删除这个合同吗？`, deleteAPI, [id], `删除`)
    },
    addBtn() {
       this.$router.push({ path:'/business/copyright/add', query:{id:null,type:'add'}})
    },
    editBtn(id){
      this.$router.push({ path:'/business/copyright/add', query:{id:id,type:'edit'}})
    },
    detailsBtn(id){
      this.$router.push({ path:'/business/copyright/add', query:{detailsId:id,type:'detail'}})
    },
    //导入
    leadBtn() {
      this.importExcDialog=true;
    },
    removeBtn(item) {
      //移除
      var index = this.data.indexOf(item);
      if (index !== -1) {
        this.data.splice(index, 1);
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
            this.$message.error("文件：" + fileObj.name + "上传失败");
          }
        });
      }
    },
    chioceList(val) {
      this.multipleSelection = val;
    },
    handleFilter() {

      store.dispatch("SetSupplierSerKeys", this.listQuery).then(res => {
      });
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },


  }
};
</script>
<style scoped>
  .backgroundDialog .el-button{
    background:#03bcd9;
    color:white;
  }
  .prfooter{
        width: calc(100vw - 224px);
    }
</style>
<style>
  .app-container .importExcDialog .el-dialog{
    width: 420px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -210px;
    margin-top: -150px !important;
  }
  .addStyle {
  margin-left: 100px;
  cursor: pointer;
}
.addStyle span {
  font-size: 20px;
  display: inline-block;
  vertical-align: middle;
}
</style>
