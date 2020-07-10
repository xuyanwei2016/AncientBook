<template>
<div class="app-container project-plan">
  <div class="relatedResource">
    <div class="form">
    <el-form class="formlist" ref="form" :model="querylist" label-width="82px">
      <div class="searchForm">
        <el-form-item label="资源类型"  style="margin-right:20px">
          <el-select v-model="querylist.resourceType" >
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(value,key) in typeList" :key="key"
            :label="value" :value="key" 
            >{{value}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" >
          <el-input v-model="querylist.name"></el-input>
         </el-form-item>
          <el-button type="primary" @click="search" icon="el-icon-search">检索</el-button>
      </div>
      <div class="buttons">
        <el-button type="primary" @click="related">关联内容</el-button>
        <el-button type="primary" @click="batchCancel">批量取消</el-button>
      </div>
    </el-form>
    <div class="table">
      <el-table
        border
        v-loading="listLoading"
        element-loading-text="给我一点时间"
        ref="multipleTable1"
        :data="list"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column prop="cover" label="资源图片" align="center" min-width="353">
        <template slot-scope="scope">
         
          <img  class="imagesize" :src="`${domain}${requestPath.file}?fileName=${scope.row.cover}&isOnLine=true`">  
        </template>
        </el-table-column>
         <el-table-column prop="name" label="资源名称" align="center" min-width="353">
        </el-table-column>
        <el-table-column prop="resourceType" label="类型" align="center">
          <template slot-scope="scope">
              <span>{{typeList[scope.row.resourceType]}}</span>
          </template>
        </el-table-column>
         <el-table-column prop="createTime" label="上传时间" align="center" min-width="180">

         </el-table-column>
        
        </el-table>
    </div>
    <!-- 底部 -->
         <div class="prfooter">
                 <div class="prfooterright">
                  <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
                </div>
              </div>
        <!-- 底部 -->
    </div>
    
  </div>
  <!--关联内容-->
  <el-dialog title="关联内容" :visible.sync="relatedDialog" class="backgroundDialog relatedDialog">
    <el-form :model="relatedForm" label-width="120">
        <el-form-item label="资源类型" style="margin-right:20px">
          <el-select v-model="relatedForm.resourceType" >
             
            <el-option v-for="(value,key) in typeList" :key="key"
            :label="value" :value="key" 
            >{{value}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择分类">
          <el-input v-model="relatedForm.diyTypeCode"></el-input>
         </el-form-item>
        <el-form-item label="资源名称">
          <el-input v-model="relatedForm.name"></el-input>
         </el-form-item>
          <el-button type="primary" @click="searchRelated" icon="el-icon-search">检索</el-button>
      </el-form>
     <el-table
              border
              v-loading="relateListLoading"
              element-loading-text="给我一点时间"
              ref="multipleTable1"
              :data="relateList"
              tooltip-effect="dark"
              @selection-change="handleSelectionChangeDialog"
              height="400px"
            >
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
              <el-table-column prop="author" label="作者" align="center"></el-table-column>
              <el-table-column prop="uploadTime" label="上传时间" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" align="center">
                <template slot-scope="scope">
                <span v-if="scope.row.status==0">已录入</span>
                <span v-if="scope.row.status==1">审核通过</span>
                <span v-if="scope.row.status==2">审核未通过</span>
                </template>
              </el-table-column>
     </el-table>
        <pagination style="background:#393f5b" @pagesize="pagesizeFun2" :total="total2" @currentPage="currentPageFun2" ref="child"></pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmRelated">确 定</el-button>
        <el-button @click="relatedDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  <!--/关联内容-->
  <!--批量取消-->
    <el-dialog title="批量取消" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog">
      <p>确定要取消选择的资源信息吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDel">确 定</el-button>
        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js'
import { getRelatedList, saveRelatedAPI,delRelatedAPI } from "@/api/resource/result";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm
} from "@/utils/publicFunctions";
import pagination from "../components/pagination";
import '@/styles/resource.scss'
import { getRelatedListAPI, fileAPI, getTypeAPI } from "@/api/resource/common"
export default {
  name: "related_Res_result",
  data() {
    return {
      domain: process.env.BASE_API,
    requestPath: requestPath,
    uploadPath: uploadPath,
      querylist: {
        name:'',
        id:this.$route.query.id,
        resourceType:'',
        pageNum: 1,
        pageSize: 5,
      },
       typeList:[],
      relatedForm:{
      resourceType:'2',
      pageNum:1,
      pageSize:50
      },
      relateListLoading:false,
      deleteDialog:false,
      relatedDialog:false,
      list: [],
      relateList:[],
      listLoading:false,
      total: 0,
      total2: 0,
      selectedList:[],
      selectCol:[],
      delFormids:[],
      saveForm:{
      id:null,
      names: [],
      objectId: this.$route.query.id,
      resourceIds: [],
      resourceType: null
      }
    };
  },
  methods: {
    // 资源类型列表
    getType() {
      getTypeAPI().then(res => {
        this.typeList = res.data.data
      })
    },
    confirmRelated(){
    if (this.selectedList.length > 0) {
       this.saveForm.resourceIds = this.selectedList.map(item => item.id);
       this.saveForm.names = this.selectedList.map(item => item.name);
       this.saveForm.cover=this.selectedList.map(item => item.cover);
       this.saveForm.resourceType =this.relatedForm.resourceType
       this.RealatedList()
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    RealatedList(){
      saveRelatedAPI(this.saveForm).then(res => {
        operationMsg.apply(this, [res.data.code, `关联`]);
      });
     
    },
    handleSelectionChange(){},
    related() {
      this.relatedDialog = true
      this.getDialogList()
    },
    getDialogList(){
    getRelatedListAPI(this.relatedForm).then(res=>{
        if (res.status) {
         this.relateList = res.data.data.list;
         this.total2 = res.data.data.total;
         //this.$refs.child.listQuery.pageSize=10
        } else {
          errorMsg.apply(this, [res.data, `获取表格数据`]);
        }
        this.relateListLoading = false;
      })
    },
    searchRelated(){
      this.getDialogList()
    },
    batchCancel() {
      
      if(this.selectCol.length>0){
        this.deleteDialog = true
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
      
    },
   handleSelectionChange(val){
      this.selectCol=val
    },
    handleSelectionChangeDialog(val){
     this.selectedList=val
    },
    //检索
    search(){
    this.getList()
    },
    // 翻页
    pagesizeFun(val) {
      this.querylist.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.querylist.pageNum = val;
      this.getList();
    },
    getList(){
      getRelatedList(this.querylist).then(res=>{
        if (res.status) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          errorMsg.apply(this, [res.data, `获取表格数据`]);
        }
        this.listLoading = false;
      })
    },
    // 翻页
    pagesizeFun(val) {
      this.querylist.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.querylist.pageNum = val;
      this.getList();
    },
    // 翻页
    pagesizeFun2(val) {
      this.relatedForm.pageSize=val
      this.getDialogList()
    },
    currentPageFun2(val) {
      this.relatedForm.pageNum=val
      this.getDialogList()
    },
    confirmDel(){
    this.delFormids=this.selectCol.map(item => item.id);
     delRelatedAPI(this.delFormids).then(res => {
        operationMsg.apply(this, [res.data, `取消关联`]);
      });
     this.deleteDialog = false
    }
  },
  mounted() {
    this.getList()
    this.getType()
  },
  components: { pagination }
};
</script>
<style scoped>
.relatedResource{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  
}
 .relatedResource .form {
  width: 100%;
} 
.relatedResource .el-form-item,.relatedDialog .el-form-item{
  display: inline-block;
}
.relatedDialog .el-form-item{
  width:240px;
}
.relatedDialog .el-select{
  width:150px;
}
.table{
  margin-top:10px;
}
.relatedDialog .el-input{
width:150px;
}
</style>
<style>

.relatedResource .prfooter{
  position: static;
    min-width: 980px;
    width:auto;
    margin-top:111px;
    
}
</style>

