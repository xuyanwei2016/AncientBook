<template>
  
    <el-container class="project-plan">
        
        <el-aside  class="tree-aside">
            <el-tree :data="navTree" :props="defaultProps" :highlight-current='true' @node-click="handleNodeClick" default-expand-all></el-tree>
        </el-aside>
       
        <el-main>
            <div class="buttons">
              <router-link :to="`patent`">
                <el-button type="primary" @click="importPicture" v-if="authBtns.filter(i => i.idName=='importBtn').length>0">
                <!-- <el-button type="primary" @click="importPicture" >                 -->
                  <i class="imBook"></i>导入专利
                </el-button>
              </router-link>
              <router-link :to="`patent/add_patent`" >
                <el-button type="primary" v-if="authBtns.filter(i => i.idName=='addBtn').length>0">
                <!-- <el-button type="primary" > -->
                    <router-link :to="`patent/add_patent?type=add`">
                      <i class="add"></i>添加
                    </router-link>
                </el-button>
              </router-link>
            </div>
            <div class="formlist">
                <el-form ref="form" :model="querylist" label-width="100px">
                    <el-form-item label="标题:" class="width360">
                        <el-input @keyup.enter.native="onSubmit" v-model="listQuery.name"></el-input>
                    </el-form-item>
                    <el-form-item label="申请人:">
                        <el-input @keyup.enter.native="onSubmit" v-model="listQuery.author"></el-input>
                    </el-form-item>
                    <el-form-item label="发明人:" class='width460'>
                        <el-input @keyup.enter.native="onSubmit" v-model="listQuery.bookName"></el-input>
                    </el-form-item>
                   
                    <el-form-item label="上传时间:" v-show="hideFlag">
                        <el-date-picker
                        v-model="timeLimit"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @keyup.enter.native="onSubmit"
                        ></el-date-picker>
                    </el-form-item>
                     <el-form-item label="数据来源:"  style="margin-right:20px" v-show="hideFlag">
                        <el-select @keyup.enter.native="onSubmit" v-model="listQuery.source">
                            <el-option label="全部" value="全部"></el-option>
                            <el-option label="本版" value="本版"></el-option>
                            <el-option label="外版" value="外版"></el-option>
                        </el-select>
                    </el-form-item>

                    <div>
                        <el-form-item class="width90" style="margin-right:20px;">
                            <el-button type="primary" @click="onSubmit" class="search">检索</el-button>
                        </el-form-item>
                        <el-form-item class="width90" style="margin-right:20px;">
                            <el-button type="primary" plain @click="onReset">
                            <i class></i>重置
                            </el-button>
                        </el-form-item>
                        <el-form-item class="width90" style="margin-right:20px;">
                            <el-button type="text" @click="onHide" class="btntext">
                            <template v-if="!hideFlag">
                                更多条件
                                <i class="el-icon-arrow-down"></i>
                            </template>
                            <template v-else>
                                收起
                                <i class="el-icon-arrow-up"></i>
                            </template>
                            </el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>

           <div class="tablelist">
               <template >
                 <!-- " -->
                    <el-tabs v-model="activeName" type="border-card" @tab-click="statusChange">
                        <el-tab-pane label="所有专利" name="first"></el-tab-pane>
                        <el-tab-pane label="已录入" name="second"></el-tab-pane>
                        <el-tab-pane label="审核通过" name="third"></el-tab-pane>
                        <el-tab-pane label="审核不通过" name="fourth"></el-tab-pane>
                    </el-tabs>
                </template>

                <el-table height="450"  border v-loading="listLoading" element-loading-text="给我一点时间" ref="multipleTable1" :data="list" tooltip-effect="dark" @selection-change="handleSelectionChange">
                    <el-table-column type="index" align="center"></el-table-column>
                    <el-table-column type="selection" align="center"></el-table-column>
                    <el-table-column label="专利名称" align="center">
                        <template slot-scope="scope">
                            {{scope.row.name}}
                        </template>
                    </el-table-column>
                    <el-table-column label="发明人" align="center">
                        <template slot-scope="scope">
                            {{scope.row.inventPeople}}
                        </template>
                    </el-table-column>
                    <el-table-column  label="申请人" align="center">
                        <template slot-scope="scope">
                            {{scope.row.applyPeople}}
                        </template>
                    </el-table-column>
                    <!-- 申请时间,公开日 -->
                    <el-table-column  label="申请时间" prop="applyTime" sortable="custom" align="center">
                        <template slot-scope="scope">
                            {{scope.row.applyTime}}
                        </template>
                    </el-table-column>
                    <el-table-column  label="公开日" prop="publicTime" sortable="custom" align="center">
                        <template slot-scope="scope">
                            {{scope.row.publicTime}}
                        </template>
                    </el-table-column>
                    <el-table-column label="上传时间" prop="uploadTime" sortable="custom" align="center">
                        <template slot-scope="scope">
                            {{scope.row.uploadTime}}
                        </template>
                    </el-table-column>
                    <el-table-column  label="状态" align="center">
                        <template slot-scope="scope">
                            <!-- <span v-if="scope.row.status=='0'">待审核</span>
                            <span v-if="scope.row.status=='1'">审核通过</span> -->
                            <span >{{_initStatus(scope.row.status)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作">
                        <template slot-scope="scope">
                            <router-link :to="{path: `patent/add_patent`, query: {id: scope.row.id}}" >
                              <i class="edit distance" title="编辑" v-if="authBtns.filter(i => i.idName=='editBtn').length>0"></i>
                              <!-- <i class="edit distance" title="编辑" ></i> -->
                            </router-link>
                            <router-link :to="{path: `patent/add_patent`, query: {detailsId: scope.row.id}}">
                              <i class="search distance" title="查看" v-if="authBtns.filter(i => i.idName=='viewBtn').length>0"></i>
                              <!-- <i class="search distance" title="查看" ></i> -->
                            </router-link>
                            <router-link :to="`patent/relatedResource?id=${scope.row.id}`">
                              <i class="link distance" title="关联资源" v-if="authBtns.filter(i => i.idName=='relatedBtn').length>0"></i>
                              <!-- <i class="link distance" title="关联资源" ></i> -->
                            </router-link>
                        </template>
                    </el-table-column>
                </el-table>

                 <!-- 底部 -->
                <div class="prfooter">
                    <div class="prfooterleft">
                        <el-checkbox v-model="checkedAll" @change="changeStatus">全选</el-checkbox>
                        <span class="marginLeft" @click="batchAudit">批量审核</span>
                        <!-- 更多 -->
                        <el-popover  placement="right" width="150" trigger="click">
                            <p @click="batchUpdatePrice">批量修改价格</p>
                            <p @click="batchUpdateType">批量修改分类</p>
                            <p @click="batchDel">批量删除</p>
                            <span class="marginLeft" slot="reference">更多</span>
                        </el-popover>
                    </div>

                    <div class="prfooterright">
                        <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
                    </div>
                </div>
                
           </div>

         
        </el-main> 
        
    <!--修改分类-->
    <el-dialog title="修改分类" :visible.sync="typeDialog" class="updatePriceDialog backgroundDialog">
      <treeselect v-model="treeSelectValue" :multiple="true" :options="treeSelectOptions" data-vv-scope="baseInfo" :normalizer="normalizer" v-validate="'required'" @select="selectFun" @deselect="deselectFun"/> 
      <div slot="footer" class="dialog-footer specialFooter">
        <el-button @click="confirmType">确 定</el-button>
        <el-button @click="typeDialog = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--审核对话框-->
    <el-dialog title="批量审核" :visible.sync="auditDialog" class="auditDialog backgroundDialog">
        <el-form :model="auditForm">
            <el-form-item label="审核状态：">
                <el-radio-group  v-model="auditForm.auditStatus" @change="changeAudit">
                    <el-radio :label="1">审核通过</el-radio>
                    <el-radio :label="2">审核不通过</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="confirmAudit">确 定</el-button>
            <el-button @click="auditDialog = false">取 消</el-button>
        </div>
    </el-dialog>

<!-- 导入PDF -->
      <el-dialog title="导入标准" :visible.sync="importDialog" class="backgroundDialog updatePriceDialog">
      <p class="info">请选择要导入的文件，文件类型只支持PDF,可多选。</p>
      <el-upload class="upload-demo"
        :action="`${domain}/zuul${requestPath.file}${uploadPath}/info`"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        multiple>
        <el-button class="upbtn" size="small" type="primary">点击上传</el-button>
        <!-- <a class="fake-download" :href="`http://192.168.2.231:8296/file/templet/版权导入模板.xlsx`">下载模板文件</a> -->
      </el-upload>
      <div>
        <div class="dialogbtns">
          <el-button @click="importAll">确定</el-button>
          <el-button @click="cancelImport">取消</el-button>
        </div>
      </div>
    </el-dialog> 




     <!--批量修改价格-->
    <el-dialog title="批量修改价格" :visible.sync="updatePriceDialog" class="backgroundDialog updatePriceDialog">
        <el-form :model="updatePriceForm">
            <el-form-item label="统一售价：" style="margin-bottom:0px;">
                <el-radio-group  v-model="updatePriceForm.priceType" @change="updatePrice">
                    <el-radio :label="1">付费</el-radio>
                    <el-radio :label="2">免费</el-radio>
                </el-radio-group>
                <el-input type="text" v-model="updatePriceForm.sellingPrice" style="width:200px;" v-show="updatePriceForm.priceType==1"/>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="confirmUpdatePrice">确 定</el-button>
            <el-button @click="updatePriceDialog = false">取 消</el-button>
        </div>
    </el-dialog>

    <!-- 批量删除-->
    <el-dialog title="批量删除" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog">
        <p>确定要删除选择的资源吗？</p>
        <div slot="footer" class="dialog-footer">
            <el-button @click="confirmDel">确 定</el-button>
            <el-button @click="deleteDialog = false">取 消</el-button>
        </div>
    </el-dialog> 

   </el-container>
</template>


<script>
import { getNavAPI } from '@/api/resource/common'
import { getListAPI,batchingDelAPI,getTreeAPI,updateTypeAPI,toLeadAPI} from '@/api/resource/patent'
import {uploadUrl, requestPath, uploadPath } from '@/utils/global.js'
import { operationMsg, requestMsg, errorMsg, confirm, returnMsg } from "@/utils/publicFunctions";
import pagination from "../components/pagination";
import '@/styles/resource.scss'
import store from '@/store'
import Treeselect from '@riophae/vue-treeselect'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name:"patent",
  data() {
    return {
       treeSelectValue:null,
      treeSelectOptions: [],
       typeDialog:false,//分类
       typeform:{
      objectId:[],
      diyTypeCode:[],
      diyTypeId:[]
    },
      authBtns:[],
      fileList:[],
      typelist:[],
      navTree: [],
      timeLimit: null,
      list: null,
      total: 0,
      activeName: "first",
      checkedAll: false, //全选
      listLoading: true,
      hideFlag: false, //默认收起
      auditDialog:false,
      updatePriceDialog:false,
      deleteDialog:false,
      updateTypeDialog:false,
      importDialog: false,
      auditForm:{
        auditStatus:1
      },
      updatePriceForm:{
        objectId:[],
        priceType:1,
        sellingPrice:''
      },
      updateTypeForm:{
        type:''
      },
     
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      // 导入
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,

      querylist: {
        name: null,
        source: null,
        bookName: null,
        status: null,
        beginTime: null,
        endTime: null,
        diyTypeCode: null,
        pageNum: 1,
        pageSize: 20,
        orderBy: null,
        application:null,
        publication:null
      },

      listQuery: {
          pageNum: 1,
          pageSize: 50
      },
      multipleSelection:[],
      //批量审核
      batchData:{
         objectId:[],
         status:1
      },
      batchId:[],
      total: 0,
      pagesize: 30,
      currentPage: 1
    };
  },
  created() {
     this.uploadPath = uploadPath
   },
  mounted() {
      this.getNav()
      this.getList()
      this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  methods: {
    //排序
    sortChanged(column, prop, order ){
      //好傻的方法
      if(column.prop=="applyTime"&&column.order=="ascending"){
        this.listQuery.applyTime='asc';
        this.listQuery.publicTime=''
        this.listQuery.uploadTime=''
      }else if(column.prop=="applyTime"&&column.order=="descending"){
        this.listQuery.applyTime='desc';
        this.listQuery.publicTime=''
        this.listQuery.uploadTime=''
      }else if(column.prop=="publicTime"&&column.order=="ascending"){
        this.listQuery.applyTime='';
        this.listQuery.publicTime='asc'
        this.listQuery.uploadTime=''
      }else if(column.prop=="publicTime"&&column.order=="descending"){
        this.listQuery.applyTime='';
        this.listQuery.publicTime='desc'
        this.listQuery.uploadTime=''
      }else if(column.prop=="uploadTime"&&column.order=="ascending"){
        this.listQuery.applyTime='';
        this.listQuery.publicTime=''
        this.listQuery.uploadTime='asc'
      }else if(column.prop=="uploadTime"&&column.order=="descending"){
        this.listQuery.applyTime='';
        this.listQuery.publicTime=''
        this.listQuery.uploadTime='desc'
      }
      this.getList()
    },
    //确认修改分类
    confirmType(){
    this.typeform.objectId = this.multipleSelection.map(item => item.id);
    updateTypeAPI(this.typeform).then(res => {
    if(res.data.status){
      operationMsg.apply(this, [res.data, `批量修改`]);
      this.typeDialog = false
    }
    })
    },


    // 确认导入
    importAll() {
      toLeadAPI(this.importForm).then(res => {
        if (res.data.code == 0) {
          this.$message.success("导入成功");
          this.getList();
          // operationMsg.apply(this, [res.data, `导入成功`]);
          this.importDialog = false;
        } else {
          this.$message.success(`导入失败${res.data.msg}`);
        }
      });
    },
    //取消导入
    cancelImport() {
      this.fileList = [];
      this.importDialog = false;
    },
    handlePreview(file) {},
    handleRemove(file, fileList) {},
    beforeUpload(file) {
      console.log(file)
      this.LoadingPic = true;
      const isJPG =
        // file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        // file.type == "application/vnd.ms-excel"
        // ;
        file.type == "application/pdf"
      const isLt3M = file.size / 1024 / 1024 < 6;
      if (!isJPG) {
        this.$message.error("上传只能是 pdf 格式!");
        return isJPG;
      }
      // if (!isLt3M) {
      //   this.$message.error("上传大小不能超过 6MB!");
      //   return isLt3M;
      // }
      
    },
    handleSuccess(res, file, fileList) {

      
      this.importForm.token.push(file.name);
      this.importForm.pdf.push(res.fileName)
      this.importForm.diyTypeCode=this.listQuery.diyTypeCode
    },
    //批量修改分类
    batchUpdateType(){
    if (this.multipleSelection.length > 0) {
       this.typeDialog = true
       this.getTree()
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list,
      }
    },
   selectFun(node){
      this.typeform.diyTypeId.push(node.id)
      this.typeform.diyTypeCode.push(node.code)
   },
   deselectFun(node){
     console.log('ss')
    for(var i=0;i<this.typeform.diyTypeId.length;i++){
       if(this.typeform.diyTypeId[i]==node.id){
           this.typeform.diyTypeId.splice(i,1)
           this.typeform.diyTypeCode.splice(i,1)
      }
    }
  },
   getTree(){
      getTreeAPI().then(res => {
        this.treeSelectOptions=res.data.data
      })
    },
      getList() {
        this.listLoading = true;
        getListAPI(this.listQuery).then(res => {
            if (res.data.code == 0) {
            this.list = res.data.data.list;
            this.total = res.data.data.total;
            } else {
            this.$message.error("获取数据失败");
            }
            this.listLoading = false;
        });
    },
    // 左侧自定义分类
    getNav() {
        getNavAPI().then(res => {
            res.data.data = [{showName:'全部'}].concat(res.data.data)
            res.data.code == 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
        })
    },
    
    //添加
    // addPicture(){
    //  this.$router.push({
    //   name:'add_article'
    // })
    // },
    //全选
    changeStatus() {
      if (this.checkedAll) {
        this.list.forEach(row => {
          this.$refs.multipleTable1.toggleRowSelection(row, true);
           });
           this.multipleSelection=this.list
      } else {
        this.$refs.multipleTable1.clearSelection();
        this.multipleSelection=[]
      }
    },
    // 批量审核
    batchAudit() {
      if(this.multipleSelection.length > 0){
        this.auditDialog=true
        this.batchData.objectId=this.multipleSelection.map(item => item.id)
        console.log(this.batchData.objectId)
      }else{
        this.$message.warning('请先选择需要操作的条目')
      }
    },
    //确认审核
    confirmAudit(){
      console.log(this.batchData,'88888')
      batchingAuditAPI(this.batchData).then(res => {
          operationMsg.apply(this,[res.data,`批量审核${this.batchData.objectId.length}项`])
        })
        this.auditDialog=false
    },
    // 确认修改价格
    confirmUpdatePrice(){
      batchingUpdatePriceAPI(this.updatePriceForm).then(res=>{
         operationMsg.apply(this,[res.data,`批量修改`])
      })
      this.updatePriceDialog=false
    },
    //确认删除
     confirmDel(){
      batchingDelAPI(this.batchId).then(res=>{
      returnMsg.apply(this, [res.data, `批量删除`]);
      })
      this.deleteDialog=false
    },
    // 修改审核状态
    changeAudit(val){
      if(val == '1'){
        this.batchData.status=1
      }else {
         this.batchData.status=2
      }
    },
    //批量修改价格
    batchUpdatePrice(){
      if(this.multipleSelection.length>0){
        this.updatePriceDialog=true
        this.updatePriceForm.objectId=this.multipleSelection.map(item => item.id)
      }else{
        this.$message.warning('请先选择需要操作的条目')
      }
      
    },
    //批量删除
    batchDel(){
       if(this.multipleSelection.length>0){
         this.deleteDialog=true
         this.batchId=this.multipleSelection.map(item => item.id)
       }else{
        this.$message.warning('请先选择需要操作的条目')
      }
    },
   
    //修改价格状态
    updatePrice(val){
      this.updatePriceForm.priceType=val
    },
    //检索
    onSubmit() {
      // console.log(this.querylist);
       if(this.timeLimit){
        this.listQuery.beginTime = this.timeLimit[0]
        this.listQuery.endTime = this.timeLimit[1]
      } else {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }
      this.listQuery.pageNum = 1
      this.listQuery.status = this.listQuery.status
      this.getList();
    },
    //重置
    onReset() {
      this.timeLimit = []
      this.listQuery = {
        pageNum: 1,
        status: this.listQuery.status,
        pageSize: this.listQuery.pageSize
      };
      this.getList();
    },
    onHide() {
      this.hideFlag = !this.hideFlag;
    },
    handleClick(tab, event) {
      
    },
    //多选框发生变化时
    handleSelectionChange(val) {
      this.multipleSelection=val
    },
    // 翻页
    pagesizeFun(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    handleNodeClick(data) { //点击树节点获取table数据
    console.log(data)
     this.listQuery.diyTypeId = data.id;
      this.listQuery.diyTypeCode = data.code;
      this.querylist.diyTypeId = data.oldCode
      this.getList()
    },
    // 切换列表状态
    _initStatus(status){
      if(status == 0){
        return "待审核"
      }else if(status == 1){
        return '审核通过'
      }else if(status == 2){
        return '审核未通过'
      }else{
        return ''
      }
    },
    statusChange(tab,event) {
      if(tab.index == 1){ 
        this.listQuery.status = 0; //待审核
      } else if(tab.index == 2){
        this.listQuery.status = 1; // 审核通过
      } else if(tab.index == 3) {
        this.listQuery.status = 2; //审核未通过
      } else {
        this.listQuery.status =  null; 
      }
      this.getList();
    },
    // 导入成果
    importPicture() {
      console.log(this.querylist.diyTypeId)
       var code = this.querylist.diyTypeCode
      if(code) {
        this.importDialog = true
      } else {
        this.$message.warning("请先选择自定义分类!")
      }
    },
  },
  components: { pagination,Treeselect }
};
</script>
<style scoped>
.el-tree{
  height: calc(100vh - 140px);
}
.plan-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  box-sizing: border-box;
  padding-left: 1px;
  flex-basis: auto;
  height: calc(100vh - 50px);
}
.planLeft {
  width: 199px;
  height: 920px;
  background-color: #fff;
  border-right: 1px solid #ddd;
}
.planright {
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  -ms-flex-preferred-size: auto;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 44px 30px 30px 30px;
}
/* .buttons .el-button {
  width: 100px;
  height: 34px;
  margin-right: 8px;
  padding-left: 15px;
}
.buttons .el-button:hover {
  background: #03bcd9;
  border-color: #03bcd9;
  border-radius: 0;
  color: #fff;
}
.formlist {
  padding: 35px 41px 15px 35px;
  background: #fff;
  margin-top: 24px;
} */
.dialogbtns{
text-align: center;
}
.widthBig {
  width: 613px;
}

.formlist .line {
  text-align: center;
  margin-bottom: 0;
  border: 0;
}
.imBook {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/importico.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.add {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/plan_add.png") no-repeat;
  float: left;
}
.imExcel {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/plan_excel.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.submitIcon {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../../assets/img/plan_submitico.png") no-repeat;
  margin-right: 3px;
  float: left;
}
.btntext {
  background: none;
  color: #409eff;
  border: 0;
}
.tablelist {
  background-color: #fff;
  margin-top: 10px;
}

.tablelist .edit {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/edit.png") no-repeat;
}
.tablelist .search {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/search.png") no-repeat;
}
.tablelist .view {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/view.png") no-repeat;
}
.tablelist .link {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../../assets/img/link.png") no-repeat;
}
.tablelist .distance {
  margin-right: 5px;
}
.dialog458 .el-input{
  width:130px;
}

.dialog458 .el-form-item{
  width:200px;
  display:inline-block;
  margin-bottom:5px;
}
.info{
  margin:0;
}
.project-plan .upload-demo{
display:inline-block;
}
.upbtn{
  margin: 10px 208px 10px 0;
}

</style>
<style>
.project-plan .el-upload-list{
  width:418px;
  height:189px;
  overflow:auto;
  border:1px solid #A9A9A9;
  margin-top:5px;
  margin-bottom:5px;
  overflow:auto;
}
.project-plan .updatePriceDialog .el-dialog{

    width:458px;
    height:auto;
    position:absolute;
    left:50%;
    top: 50%;
    margin-left:-229px;
    margin-top:-107px !important;
  
}

.project-plan .auditDialog .el-dialog{
 width:458px;
    position:absolute;
    left:50%;
    top: 50%;
    margin-left:-229px;
    margin-top:-100px !important;
}
.project-plan .deleteDialog .el-dialog{
    width:458px;
    position:absolute;
    left:50%;
    top: 50%;
    margin-left:-229px;
    margin-top:-90px !important;
}
.project-plan .formlist .el-form-item__label {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #424861;
}
/* .project-plan .formlist .el-input {
  width: 210px;
}
.project-plan .formlist .width260 .el-input {
  width: 260px;
} */
/* .project-plan .formlist .el-form-item {
  margin: 0;
  display: inline-block;
  margin-right: 48px;
  vertical-align: top;
  margin-bottom: 14px;
} */
.project-plan .width90 .el-form-item__content {
  margin-left: 0 !important;
}
/* .project-plan .formlist .el-button.search {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.project-plan .formlist .el-button {
  width: 89px;
  border-radius: 5px;
} */
.project-plan  .el-upload{
margin-top:5px;
margin-bottom:5px;
float:right;
}

.dialog458 .el-dialog{
  width:458px;
}
</style>