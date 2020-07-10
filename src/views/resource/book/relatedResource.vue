<template>
  <div class="app-container project-plan">
    <div class='buttons' v-if="pageType!='view'">
        <el-button type="primary" @click="lead">导入相关资源</el-button>
        <el-button type="primary" @click="related">关联内容</el-button>
        <el-button type="primary" @click="batchCancel">批量取消</el-button>
      </div>
    <div class="relatedResource">
      <div class="form">
        <el-form ref="form" :model="querylist" inline label-width="82px" class="formlist">
          <div class="searchForm">
            <el-form-item label="资源类型"  style="margin-right:20px">
              <el-select v-model="querylist.resourceType" placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="(value,key) in typeList"
                  :key="key"
                  :label="value"
                  :value="key"
                >{{value}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源名称" >
              <el-input v-model="querylist.name"></el-input>
            </el-form-item>
            <el-button type="primary" @click="search" class="search" icon="el-icon-search">检索</el-button>
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
                <img
                  :src="`${domain}${requestPath.file}?fileName=${scope.row.cover}&isOnLine=true`"
                  class="imagesize"
                  v-if="scope.row.cover"
                >
              </template>
            </el-table-column>
            <el-table-column prop="name" label="资源名称" align="center" min-width="353"></el-table-column>
            <el-table-column prop="resourceType" label="类型" align="center">
              <template slot-scope="scope">
                <!-- <span>{{typeList[scope.row.resourceType-1]}}</span> -->
                <span>{{typeList[scope.row.resourceType]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="上传时间" align="center" min-width="180"></el-table-column>
          </el-table>
        </div>
        <!-- 底部 -->
        <div class="prfooter" v-if="total>0" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
          </div>
        </div>
        <!-- 底部 -->
      </div>
    </div>
    <!--关联内容-->
    <el-dialog
      title="关联内容"
      :visible.sync="relatedDialog"
      width="80%"
      class="backgroundDialog relatedDialog"
    >
      <el-form :model="relatedForm" label-width="100" class="demo-ruleForm" inline>
        <el-form-item label="资源类型" style="margin-right:20px;">
          <el-select v-model="relatedForm.resourceType" @change="changeType" placeholder="全部">
            <el-option
              v-for="(value,key) in typeList"
              :key="key"
              :label="value"
              :value="key"
            >{{value}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称">
          <el-input v-model="relatedForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="selfClass" label="选择分类:" style="margin-right:20px;height:39px;">
          <treeselect
            :options="treeSelectOptions"
            data-vv-scope="baseInfo"
            :normalizer="normalizer"
            v-validate="'required'"
            placeholder="请选择"
            @select="selectFun"
            @deselect="deselectFun"
            @input="idChange"
            style="width: 150px;"
          />
          <p class="animation-error" v-if="noDiy">未选择</p>
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
        highlight-current-row
        @current-change="handleCurChange"
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
      <div class="dialog_prfooter">
        <pagination
          @pagesize="pagesizeFun2"
          :total="total2"
          @currentPage="currentPageFun2"
          ref="child"
          style="background:#393f5b"
        ></pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmRelated" type="primary">确 定</el-button>
        <el-button @click="relatedDialog = false">取 消</el-button>
        
      </div>
    </el-dialog>
    <!--/关联内容-->
    <!--批量取消-->
    <el-dialog title="批量取消" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog">
      <p>确定要取消选择的资源信息吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDel" type="primary">确 定</el-button>

        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 导入相关资源 -->
    <el-dialog title="导入相关资源" width="457px" @close="closeLead" :visible.sync="leadDialog" class="backgroundDialog">
      <p>单次上传最多10个文件，全部上传完成前请勿关闭窗口，避免数据丢失！</p>
      <el-form ref="form" :model="saveFileList" :rules="rules" label-width="82px">
        <div class="searchForm">
          <el-form-item label="资源类型"  prop="resourceType"  style="margin-right:20px">
            <el-select
              v-model="saveFileList.resourceType"             
              placeholder="请先选择资源类型"
              @change="changeFileType"
            >
              <el-option
                v-for="(value,key) in leadTypeList"
                :key="key"
                :label="value"
                :value="key"
              >{{value}}</el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <el-upload
        class="upload-demo"
        :action="`${domain}/zuul${requestPath.file}${uploadPath}/info`"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-exceed="exceedLimit"
        :on-change="changeList"
        :limit="10"
        :file-list="fileList"
        :auto-upload="false"
        multiple
        :before-upload="beforeUpload"
        ref="uploadDom"
      >
      <el-button slot="trigger" size="small" type="primary">点击上传(可多选)</el-button>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmLead" :loading="waiting"  type="primary">全部导入</el-button>
        <el-button @click="leadDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import {
  getRelatedList,
  getRelatedListAPI,
  saveRelatedAPI,
  delRelatedAPI,
  resourceImportAPI
} from "@/api/resource/ebook";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { fileAPI, getTypeAPI, getTreeAPI } from "@/api/resource/common";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm
} from "@/utils/publicFunctions";
import pagination from "../components/pagination";
import "@/styles/resource.scss";
export default {
  name: "related_Res_Book",
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      leadTypeList: {
        5: "图片",
        6: "视频",
        7: "音频",
        8: "动画",
      },
      querylist: {
        name: "",
        id: this.$route.query.id,
        resourceType: "",
        pageNum: 1,
        pageSize: 50
      },
      typeList: [],
      relatedForm: {
        resourceType: "1",
        pageNum: 1,
        pageSize: 50
      },
      relateListLoading: false,
      deleteDialog: false,
      relatedDialog: false,
      list: [],
      relateList: [],
      listLoading: false,
      total: 0,
      total2: 0,
      selectedList: [],
      selectCol: [],
      delFormids: [],
      saveForm: {
        id: null,
        names: [],
        objectId: this.$route.query.id,
        resourceIds: [],
        resourceType: 1
      },
      saveFileList: {
        objectId :'',
        size:[],
        names:[],
        token:[],
        timeLength:[]
      },
      leadDialog: false,
      fileList: [],
      rules: { resourceType: [{ required: true, message: "资源类型必选" }] },
      treeSelectOptions: [],
      treeSelectValue: null,
      noDiy: false,
      waiting:false,
      fileNum:0,
      acount:0,
      pageType:''
    };
  },
  methods: {
    
    idChange(val){
      if(!val){
        this.relatedForm.diyTypeCode = null;
        this.relatedForm.diyTypeId = null;
      }
    },
    //改变资源类型，分类库变化
    changeType(val){
      this.getTree(Number(val));     
    },
    //改变导入的文件类型
    changeFileType(){
      this.waiting=false;
      this.saveFileList.size=[];
      this.saveFileList.names=[];
      this.saveFileList.token=[];
      this.saveFileList.timeLength=[];
      this.fileList=[]
    },
    //分类树
    getTree(type) {
      getTreeAPI(type).then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list
      };
    },
    selectFun(node) {
      this.noDiy = false;

      this.relatedForm.diyTypeCode = node.code;
    },
    deselectFun(node) {
      this.relatedForm.diyTypeCode = null;
      this.relatedForm.diyTypeId = null;
    },
    //导入相关资源
    changeList(file,fileList){
      this.fileNum=fileList.length
    },
    handlePreview(file) {},
    handleRemove(file, fileList) {
      this.saveFileList.names.forEach( (res,index) => {
        if(file.name==res){
          this.saveFileList.names.splice(index,1)
          this.saveFileList.size.splice(index,1)        
          this.saveFileList.token.splice(index,1)
          this.saveFileList.timeLength.splice(index,1)
        }
      })
    },
    beforeUpload(file){
      this.waiting=true
      let fileType = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();     
      let sourceType=this.saveFileList.resourceType
      if(sourceType==5){
        if (fileType!='jpg'&&fileType!='png'&&fileType!='gif'&&fileType!='jpeg') {
          this.$message.error("图片只支持jpg、jpeg、png、gif格式");
          this.waiting=false
          return false;
        }
      }
      if(sourceType==6){
        if (fileType!='mp4'&&fileType!='avi'&&fileType!='rmvb'&&fileType!='wmv'&&fileType!='mov'&&fileType!='flv') {
          this.$message.error("视频只支持AVI、WMV、RMVB、MP4、MOV、FLV!");
          this.waiting=false
          return false;
        }     
      }
      if(sourceType==7){
        if (fileType!='mp3') {
          this.$message.error("音频只支持MP3格式");
          this.waiting=false
          return false;
        }       
      }
      if(sourceType==8){
        if (fileType!='mp4'&&fileType!='avi'&&fileType!='rmvb'&&fileType!='wmv'&&fileType!='mov'&&fileType!='flv'&&fileType!='fla') {
          this.$message.error("动画只支持AVI、WMV、RMVB、MP4、MOV、FLV、FLA!");
          this.waiting=false
          return false;
        }       
      }
      if(!sourceType){
          this.$message.error("请选择资源类型");
          this.waiting=false        
          return false
      }
    },
    handleSuccess(res, file, fileList) {
      this.acount+=1;
      if(res.data){
        this.saveFileList.size.push(res.data.size);
        this.saveFileList.names.push(file.name);
        this.saveFileList.token.push(res.data.fileName);
        this.saveFileList.timeLength.push(res.data.time)
      }else{
        this.$message.warning(file.name+'已存在')
      }
      if(this.acount==this.fileNum){
        if(this.saveFileList.resourceType){
          if(this.saveFileList.names.length>0){
            this.$message.warning('资源上传中,请耐心等待')
            this.saveFileList.objectId = this.$route.query.id; 
            resourceImportAPI(this.saveFileList).then(res => {
              if (res.data.code == 0) {
                this.$message.success("添加成功");
                this.leadDialog = false;
                this.getList();
              } else {
                this.$message.error("添加失败");
              }
            });
          }else{
            return
          }
          
        }else{
          this.$message.warning('请选择资源类型')
        }
        this.waiting=false
      }
      
    },
    //确认导入
    confirmLead() {
      this.$refs['uploadDom'].submit()
      this.acount=0;
    },
    exceedLimit() {
      this.$message.error("单次最多可上传10个文件");
    },
    //关闭资源导入
    closeLead(){
      this.saveFileList= {
        objectId :this.$route.query.id,
        size:[],
        names:[],
        token:[],
        timeLength:[]
      }
      this.acount=0;
      this.fileList=[]
      this.$refs['form'].resetFields()
      this.waiting=false
    },
    // 资源类型列表
    getType() {
      getTypeAPI().then(res => {
        this.typeList = res.data.data;
      });
    },

    confirmRelated() {
      if (this.selectedList.length > 0) {
        this.saveForm.resourceIds = this.selectedList.map(item => item.id);
        this.saveForm.names = this.selectedList.map(item => item.name);
        this.saveForm.cover = this.selectedList.map(item => item.cover);
        this.saveForm.resourceType = this.relatedForm.resourceType;
        this.RealatedList();
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    RealatedList() {
      saveRelatedAPI(this.saveForm).then(res => {
        operationMsg.apply(this, [res.data, `关联`]);
      });
      this.relatedDialog = false;
    },
    handleSelectionChange() {
      this.selectCol = val;
    },
    related() {
      this.relatedDialog = true;
      this.getDialogList();
    },
    getDialogList() {
      getRelatedListAPI(this.relatedForm).then(res => {
        if (res.data.data) {
          this.relateList = res.data.data.list;
          this.total2 = res.data.data.total;
          //this.$refs.child.listQuery.pageSize = 10;
        } else {
          errorMsg.apply(this, [res.data, `获取表格数据`]);
        }
        this.relateListLoading = false;
      });
    },
    searchRelated() {
      this.getDialogList();
    },
    batchCancel() {
      if (this.selectCol.length > 0) {
        this.deleteDialog = true;
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    handleSelectionChange(val) {
      this.selectCol = val;
    },
    handleSelectionChangeDialog(val) {
      this.selectedList = val;
    },
    handleCurChange(val){
      this.$refs.multipleTable1.toggleRowSelection(val)
    },
    //检索
    search() {
      this.getList();
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
    getList() {
      getRelatedList(this.querylist).then(res => {
        if (res.status) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          errorMsg.apply(this, [res.data, `获取表格数据`]);
        }
        this.listLoading = false;
      });
    },

    // 翻页
    pagesizeFun2(val) {
      this.relatedForm.pageSize = val;
      this.getDialogList();
    },
    currentPageFun2(val) {
      this.relatedForm.pageNum = val;
      this.getDialogList();
    },
    confirmDel() {
      this.delFormids = this.selectCol.map(item => item.id);
      delRelatedAPI(this.delFormids).then(res => {
        operationMsg.apply(this, [res.data, `取消关联`]);
      });
      this.deleteDialog = false;
    },
    //导入相关资源
    lead() {
      this.leadDialog = true;
    }
  },
  mounted() {
    this.getList();
    this.getType();
    this.getTree(1);
    this.relatedForm.resourceName=this.$route.query.name
    this.pageType=this.$route.query.type
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  components: { pagination, Treeselect }
};
</script>
<style scoped>
/* .project-plan .formlist{
  padding: 0;
  margin-top:0;
  background:transparent;
} */
.el-form-item{
  margin-bottom: 10px!important;
}
.relatedResource {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
 .relatedResource .form {
  width: 100%;
} 
.relatedResource .el-form-item,
.relatedDialog .el-form-item {
  display: inline-block;
}
/*  */
.relatedDialog .el-select {
  width: 150px;
}
.table {
  margin-top: 10px;
}
.relatedDialog .el-input {
  width: 150px;
}
/* .backgroundDialog .el-button {
  color: white;
  background: #03bcd9;
} */
/* .app-container .relatedResource .width260{
  width: 280px!important;
} */
</style>
<style>
.backgroundDialog .el-upload-list {
    width: 418px;
    height: 189px;
    overflow: auto;
    border: 1px solid #a9a9a9;
    margin-top: 10px;
    margin-bottom: 10px;
    overflow: auto;
}
.avatar {
  height: 40px;
  width: 40px;
}
</style>

