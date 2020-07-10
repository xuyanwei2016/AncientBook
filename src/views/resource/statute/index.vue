<template>
  <el-container class="project-plan">
     <el-aside  class="tree-aside" :data="navTree">
        <el-tree 
                :data="navTree"
                :props="defaultProps"
                @node-click="handleNodeClick"
                default-expand-all
                :highlight-current='true'
                :expand-on-click-node="false"
              ></el-tree>
        </el-aside>
    <el-main>
      <div class="buttons">
        <el-button type="primary" @click="importAnimation" v-if="authBtns.filter(i => i.idName=='importBtn').length>0">
          <i class="imBook"></i>{{authBtns.filter(i => i.idName=='importBtn')[0].name}}
        </el-button>
        <router-link :to="`statute/create?type=add`"><el-button type="primary" v-if="authBtns.filter(i => i.idName=='addBtn').length>0">
           <i class="add"></i>{{authBtns.filter(i => i.idName=='addBtn')[0].name}}
           </el-button>
        </router-link>
      </div>
      <div class="formlist">
        <el-form ref="form" :model="querylist" label-width="82px">
          <el-form-item label="标题" >
            <el-input @keyup.enter.native="onSubmit" v-model="querylist.name"></el-input>
          </el-form-item>
          <el-form-item label="发布机关">
            <el-input @keyup.enter.native="onSubmit" v-model="querylist.issuingOrgan"></el-input>
          </el-form-item>
          <el-form-item label="发布文号">
            <el-input @keyup.enter.native="onSubmit" v-model="querylist.issuingNum"></el-input>
          </el-form-item>
          
          <template v-if="hideFlag">
          <el-form-item label="数据来源"  style="margin-right:20px" v-show="hideFlag">
            <el-select @keyup.enter.native="onSubmit" v-model="querylist.dataSources" placeholder="请选择数据来源">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="本版" :value="0"></el-option>
              <el-option label="外版" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传时间" class="widthBig" v-show="hideFlag">
            <el-date-picker
                v-model="timeLimit"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @keyup.enter.native="onSubmit"
              ></el-date-picker>
          </el-form-item>
          </template>
          <div>
            <el-form-item class="width90">
              <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search">检索</el-button>
              <el-button type="primary" plain @click="onReset">
                <i class></i>重置
              </el-button>
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
        <template>
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="所有法规" name="first"></el-tab-pane>
            <el-tab-pane label="已录入" name="second"></el-tab-pane>
            <el-tab-pane label="审核通过" name="third"></el-tab-pane>
            <el-tab-pane label="审核未通过" name="fourth"></el-tab-pane>
          </el-tabs>
        </template>
        <div class="table_outer_wrap">
          <el-table
                border
                element-loading-text="给我一点时间"
                ref="multipleTable1"
                :data="list"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                @sort-change="sortChanged"
              >
              <el-table-column type="index" align="center" :index="indexSet"></el-table-column>
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column prop="name" label="标题" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="issuingOrgan" label="发布机关" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="issuingNum" label="发布文号" align="center" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="issuingTime" label="发布时间" sortable="custom" align="center"></el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" sortable="custom" align="center"></el-table-column>
                <!-- <el-table-column prop="source" label="来源" align="center"></el-table-column>
                <el-table-column prop="sellingPrice" label="售价" align="center">
                  <template slot-scope="scope" v-if="scope.row.sellingPrice">￥{{parseFloat(scope.row.sellingPrice).toFixed(2)}}</template> 
                </el-table-column>
                <el-table-column prop="timeLength" label="时长" align="center"></el-table-column>
                <el-table-column prop="size" label="文件大小" align="center"></el-table-column> -->
                <el-table-column prop="status" label="状态" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status=='0'">已录入</span>
                    <span v-if="scope.row.status=='1'">审核通过</span>
                    <span v-if="scope.row.status=='2'">审核未通过</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <router-link :to="`statute/create?id=${scope.row.id}&type=update`">
                      <i :title="authBtns.filter(i => i.idName=='editBtn')[0].name" class="edit distance" v-if="authBtns.filter(i => i.idName=='editBtn').length>0"></i>
                    </router-link>
                    <router-link :to="`statute/create?id=${scope.row.id}&type=view`">
                      <i :title="authBtns.filter(i => i.idName=='viewBtn')[0].name" class="search distance" v-if="authBtns.filter(i => i.idName=='viewBtn').length>0"></i>
                    </router-link>
                    <router-link :to="`statute/relatedResource?id=${scope.row.id}&name=${scope.row.name}`">
                      <i :title="authBtns.filter(i => i.idName=='relatedBtn')[0].name" class="link distance" v-if="authBtns.filter(i => i.idName=='relatedBtn').length>0"></i>
                    </router-link>
                  </template>
                </el-table-column>
          </el-table>
        </div>
            <!-- 底部 -->
            <div v-if="total>0" class="prfooter resource_prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
              <div class="prfooterleft">
                <el-checkbox v-model="checkedAll" @change="changeStatus">全选</el-checkbox>
                <span class="marginLeft" @click="batchAudit">批量审核</span>
                <!--更多-->
                <el-popover placement="right" width="150" trigger="click">
                  <!-- <p @click="batchUpdatePrice">批量修改价格</p> -->
                  <p @click="batchUpdateType">批量修改分类</p>
                  <p @click="batchDel">批量删除</p>
                  <span class="marginLeft" slot="reference">更多</span>
                </el-popover>
                <!--更多-->
              </div>
              <div class="prfooterright">
                <pagination @pagesize="pagesizeFun" :total="total" :pageNum="querylist.pageNum" :pageSize="querylist.pageSize" @currentPage="currentPageFun"></pagination>
              </div>
            </div>
       </div>
      
      <!-- 底部 -->
     
    </el-main>

    <!--审核对话框-->
    <el-dialog title="批量审核" :visible.sync="auditDialog" class="auditDialog backgroundDialog dialog460">
      <el-form :model="auditForm">
        <el-form-item label="审核状态：">
          <el-radio-group v-model="auditForm.auditStatus" @change="changeAudit">
            <el-radio :label="1">审核通过</el-radio>
            <el-radio :label="2">审核不通过</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmAudit" type="primary">确 定</el-button>
        <el-button @click="auditDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog title="导入法规" :visible.sync="importDialog" class="backgroundDialog importExcDialog">
      <p>请选择要导入的文件，文件类型只支持Excel。</p>
      <div class="importExc">
         <input type="file" @change="fileSelect" ref="file">
         <a class="fake-download" :href="`${domain}/file/templet/导入法规信息模板.xlsx`">下载模板文件</a>
      </div>
      <el-progress :percentage="80"  :stroke-width="12" color="#67C23A"></el-progress>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmImport">确 定</el-button>
        <el-button @click="importDialog = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!--导入法规对话框--> 
    <el-dialog title="导入法规" :visible.sync="importDialog" @close="closeImport" class="middle backgroundDialog dialog460">
      <p class="info">操作提示:单次上传最多10个文件，全部上传完成前请勿关闭窗口，避免数据丢失!</p>
      <el-upload
        class="upload-demo"
        :action="`${domain}/zuul${requestPath.file}${uploadPath}/info`"
        :on-success="handleSuccess"
        multiple
        :on-exceed="exceedLimit"
        accept=".pdf"
        :limit="10"
        :before-upload="beforeUpload"
        :file-list="fileList"
        :on-change="changeList"
        :auto-upload="false"
        ref="uploadDom"
      >
        <el-button size="small" type="primary">选择文件(可多选)</el-button>
      </el-upload>
      <div>
        <div class="dialogbtns dialog-footer">
          <el-button   type="primary" @click="importAll" :loading="loadingAudio">全部上传</el-button>
          <el-button @click="cancelImport">全部取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!--批量修改价格-->
    <el-dialog
      title="批量修改价格"
      :visible.sync="updatePriceDialog"
      class="backgroundDialog updatePriceDialog dialog460"
    >
      <el-form :model="updatePriceForm">
        <el-form-item label="统一售价：" style="margin-bottom:0px;">
          <el-radio-group v-model="updatePriceForm.priceType" @change="updatePrice">
            <el-radio :label="1">付费</el-radio>
            <el-radio :label="2">免费</el-radio>
          </el-radio-group>
          <el-input
            type="text"
            v-model="updatePriceForm.sellingPrice"
            style="width:200px;"
            v-show="updatePriceForm.priceType===1"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmUpdatePrice">确 定</el-button>
        <el-button @click="updatePriceDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--批量删除-->
    <el-dialog title="批量删除" :visible.sync="deleteDialog" class="backgroundDialog deleteDialog dialog460">
      <p>确定要删除选择的法规资源吗？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDel" type="primary">确 定</el-button>
        <el-button @click="deleteDialog = false">取 消</el-button>
      </div>
    </el-dialog>
     <!--修改分类-->
    <el-dialog title="修改分类" :visible.sync="typeDialog" class="updatePriceDialog backgroundDialog dialog460">
      <treeselect 
      v-model="treeSelectValue" 
      :multiple="true" 
      placeholder="请选择"
      :flat="true"
      :loadOptions='loadOptions'
      :auto-load-root-options="false"
      :options="treeSelectOptions" 
      data-vv-scope="baseInfo" 
      :normalizer="normalizer" 
      v-validate="'required'" 
      @select="selectFun" 
      @deselect="deselectFun"/> 
      <div slot="footer" class="dialog-footer specialFooter">
        <el-button @click="confirmType" type="primary">确 定</el-button>
        <el-button @click="typeDialog = false">取 消</el-button>
      </div>
    </el-dialog>  
  </el-container>
</template>
<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import axios from 'axios'
import {
  getListAPI,
  importAnimationAPI,
  batchingAuditAPI,
  batchingUpdatePriceAPI,
  batchDeleteAPI,
  getTreeAPI,
  uploadAPI
  
} from "@/api/resource/statute";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm,
  returnMsg
} from "@/utils/publicFunctions";
import {
  updateTypeAPI
} from "@/api/resource/common";
import pagination from "../components/pagination";
import "@/styles/resource.scss";
import store from '@/store'
import Treeselect from '@riophae/vue-treeselect'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "statute",
  data() {
    return {
      treeSelectValue:null,
      treeSelectOptions: [],
      typeDialog:false,//分类
      typeform:{
        ids:[],
        diyTypeCode:[],
        diyTypeId:[],
        objectType:10
      },
      authBtns:[],
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      fileList: [],
      typelist: [],
      activeName: "first",
      checkedAll: false, //所有图片全选
      checkedAllRecorded: false, //已录入全选
      checkedAllPass: false, //已通过全选
      checkedAllUnpass: false, //未通过全选
      listLoading: true,
      list: [], //所有动画
      checkedList: {}, //选中的列表
      hideFlag: false, //默认展开
      auditDialog: false,
      importDialog: false,
      updatePriceDialog: false,
      deleteDialog: false,
      updateTypeDialog: false,
      loadingAudio:false,
      auditForm: {
        auditStatus: 1
      },
     importForm: {
        diyTypeCode: "",
        diyTypeId: "",
        names: [],
        token: [],
        size:[],
        timeLength:[]
      },
      updatePriceForm: {
        ids: [],
        priceType: 1,
        sellingPrice: ""
      },
      updateTypeForm: {
        type: ""
      },
      navTree: [],
      defaultProps: {
        children: "list",
        label: "showName"
      },

      querylist: {
        diyTypeId: null,
        name: null,
        source: null,
        dataSources:null,
        bookName: null,
        status: null,
        beginTime: null,
        endTime: null,
        diyTypeCode: null,
        pageNum: 1,
        pageSize: 50,
        orderBy: null
      },
      timeLimit:null,
      multipleSelection: [],
      //批量审核
      batchData: {
        objectId: [],
        status:1
      },
      batchId: [],
      total: 100,
      pagesize: 30,
      currentPage: 1,
      fileNum:0,
      acount:0
    };
  },
  watch: {
    treeSelectValue(newVal,oldVal){//监听清空全部按钮
      if(newVal==null||newVal=='null'){
        return false;
      }
      if(newVal.length==0){
        this.typeform.diyTypeId=[];
        this.typeform.diyTypeCode=[];
      }
    }
  },
  methods: {
    //解决索引只排序当前页的问题,增加函数自定义索引序号
    indexSet(index){
      return (this.querylist.pageNum-1)*this.querylist.pageSize+index+1;
    },
     //排序
    sortChanged(column, prop, order ){
      
      if(column.prop=="issuingTime"&&column.order=="ascending"){
        this.querylist.issuingTime='asc';
        this.querylist.uploadTime=''
      }else if(column.prop=="issuingTime"&&column.order=="descending"){
        this.querylist.issuingTime='desc';
        this.querylist.uploadTime=''
      }else if(column.prop=="uploadTime"&&column.order=="ascending"){
        this.querylist.issuingTime='';
        this.querylist.uploadTime='asc'
      }else if(column.prop=="uploadTime"&&column.order=="descending"){
        this.querylist.issuingTime='';
        this.querylist.uploadTime='desc'
      }
      this.getList()
    },
    //确认修改分类
    confirmType(){
      if(!this.treeSelectValue){
        this.$message.warning('请选择分类')
      }else{
        this.typeform.ids = this.multipleSelection.map(item => item.id);
        updateTypeAPI(this.typeform).then(res => {
            if(res.data.status){
                operationMsg.apply(this, [res.data, `批量修改`]);
                this.typeDialog = false
            }
        })
      }
    
    },
    //确认导入
    // confirmImport(){
    //   if (this.$refs.file.files[0]) {       
    //     importAnimationAPI(this.querylist).then(res => {
    //       // if(res.data.status){
    //       //   this.$message.success('导入成功！')
    //         this.importDialog = false
    //       // } else {
    //       //   this.$message.error('导入失败！')
    //       // }
    //       operationMsg.apply(this, [res.data, `导入`]);
    //     })
    //   } else {
    //     this.$message.warning('请选择文件后再执行导入！')
    //   }
    // },
    fileSelect() {
      if (this.$refs.file.files[0]) {
        let file = this.$refs.file.files[0]
        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          this.$message.warning('导入文件只能是 xlsx 格式！')
          this.$refs.file.value = null;
          return ;
        }
        let formData = new FormData()
        formData.append('file', file)
        axios.post(`${this.domain}${this.requestPath.file}${this.uploadPath}`,formData).then( res =>{
          this.querylist.token = res.data;
        })
        // uploadAPI(formData).then(res => {
        //   this.querylist.token = res;
        // })
      }
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
      this.typeform.diyTypeId.push(node.id);
      this.typeform.diyTypeCode.push(node.code)
   },
   deselectFun(node){
    for(var i=0;i<this.typeform.diyTypeId.length;i++){
       if(this.typeform.diyTypeId[i]==node.id){
           this.typeform.diyTypeId.splice(i,1)
           this.typeform.diyTypeCode.splice(i,1)
      }
    }
  },
    loadOptions({ action, parentNode, callback }){//此处可以懒加载，去掉loadOptions警告；
      callback();
    },
   getTree(){
      getTreeAPI(10).then(res => {
        this.treeSelectOptions=res.data.data
      })
    },
    handlePreview(file) {},
    handleRemove(file, fileList) {
      this.importForm.names.forEach( (res,index) => {
        if(file.name==res){
          this.importForm.names.splice(index,1)
          this.importForm.size.splice(index,1)        
          this.importForm.token.splice(index,1)
          this.importForm.timeLength.splice(index,1)
        }
      })
    },
    beforeUpload(file) {

      const isPDF =
        // file.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        // file.type == "application/vnd.ms-excel"
        // ;
        file.type == "application/pdf";
      const isLt6M = file.size / 1024 / 1024 < 6;
      if (!isPDF) {
        this.$message.error("上传只能是 pdf 格式!");
        this.loadingAudio = false;
        return isPDF;
      }
      // if (!isLt6M) {
      //   this.$message.error("上传大小不能超过 6MB!");
      //   return isLt6M;
      // }
     },
    handleSuccess(res, file, fileList) {
      this.acount+=1;
      if(res.data){
        this.importForm.size.push(res.data.size);
        this.importForm.names.push(file.name);
        this.importForm.token.push(res.data.fileName);
        this.importForm.timeLength.push(res.data.time)
      }else{
        this.$message.warning(file.name+'已存在')
        this.$refs['uploadDom'].uploadFiles.forEach((item,index)=>{//删除上传过的文件
          if(item.name==file.name){
            this.$refs['uploadDom'].uploadFiles.splice(index,1);
            this.acount-=1;
          }
        })
      }
      if(this.acount==this.$refs['uploadDom'].uploadFiles.length){//文件上传完毕时
        this.loadingAudio = false;
         if(this.importForm.names.length > 0){
          
          //this.importForm.diyTypeId = this.querylist.diyTypeId;//传id后台报错了
          this.importForm.diyTypeCode = this.querylist.diyTypeCode;
          importAnimationAPI(this.importForm).then(res => {
            operationMsg.apply(this, [res.data, `批量导入`]);
            this.fileList = [];
            
          });
          this.importDialog = false;
          this.loadingAudio = false;
        } else if (this.importForm.names.length == 0) {
          this.loadingAudio = false;
          return
        }   
      }
    },
    //关闭
    closeImport(){
      this.importDialog = false;
      this.loadingAudio=false;
      this.fileList = [];
      this.importForm = {
        keywords: "",
        names: [],
        price: "",
        size: [],
        source: "",
        synopsis: "",
        timeLength: [],
        token: []
      };
      this.acount=0;
    },
    //取消导入
    cancelImport() {
      this.fileList = [];
      this.loadingAudio=false;
       this.importForm = {
        keywords: "",
        names: [],
        price: "",
        size: [],
        source: "",
        synopsis: "",
        timeLength: [],
        token: []
      };
      this.acount=0;
    },
    //全部导入
    importAll() {
      if(this.$refs['uploadDom'].uploadFiles.length<=0){//判断是否选择文件了
        this.$message.warning('请选择文件');
        return false;
      }
      this.$message.warning('上传中,请耐心等待');
      this.loadingAudio = true;
      this.$refs['uploadDom'].submit()
      this.acount=0;
    },
    changeList(file,fileList){
      this.fileNum=fileList.length
      if(this.fileNum==0){//全部上传已上传的文件，即没有文件时，再次打开上传按钮,
        this.loadingAudio=false;
      }
    },
    exceedLimit(){
      this.$message.error('单次最多可上传10个文件')
    },
    // 导入动画
    importAnimation() {
      var code = this.querylist.diyTypeCode
      if(code) {
        this.importDialog = true
      } else {
        this.$message.warning("请先选择自定义分类!")
      }
    },
    // 全部导入动画
    // importAll(){
    //   this.importForm.diyTypeId=this.querylist.diyTypeId
    //   this.importForm.diyTypeCode=this.querylist.diyTypeCode
    //    importAnimationAPI(this.importForm).then(res => {
    //    operationMsg.apply(this, [res.data, `批量导入`]);
    //    this.onReset()
    //   });
    //   this.importDialog = false      
    // },
    // cancelImport(){
    // this.fileList=[]
    // this.importDialog = false
    // this.onReset()
    // },
    // 上传删除图片
    imgListDel(index) {
      this.importForm.imglist.slice(index, 1);
    },
    //添加
    addPicture() {
      this.$router.push({
        name: "add_pic"
      });
    },
    //所有图片全选
    changeStatus() {
      if (this.checkedAll) {
        this.list.forEach(row => {
          this.$refs.multipleTable1.toggleRowSelection(row, true);
        });
        this.multipleSelection = this.list;
      } else {
        this.$refs.multipleTable1.clearSelection();
        this.multipleSelection = [];
      }
    },
    // 所有图片批量审核
    batchAudit() {
      if (this.multipleSelection.length > 0) {
        this.auditDialog = true;
        this.batchData.objectId = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //确认审核
    confirmAudit() {
      batchingAuditAPI(this.batchData).then(res => {
        operationMsg.apply(this, [
          res.data,
          `批量审核${this.batchData.objectId.length}项`
        ]);
      });
      this.auditDialog = false;
    },
    // 确认修改价格
    confirmUpdatePrice() {
      batchingUpdatePriceAPI(this.updatePriceForm).then(res => {
        operationMsg.apply(this, [res.data, `批量修改`]);
      });
      this.updatePriceDialog = false;
    },
    //确认删除
    confirmDel() {
      // 后台说的去掉此判断

      // for( let i = 0 ;i < this.multipleSelection.length ; i++ ){
      //   if( this.multipleSelection[i].status == '1'  ){
          
      //     this.$message.warning('批量删除失败,不能删除审核通过的资源')
      //     return false
      //   }
      // }
      batchDeleteAPI(this.batchId).then(res => {
          this.deleteDialog = false;
          returnMsg.apply(this, [res.data, `批量删除`]); 
      });
    },
    // 修改审核状态
    changeAudit(val) {
      if (val == "1") {
        this.batchData.status = 1;
      } else {
        this.batchData.status = 2;
      }
    },
    //批量修改价格
    batchUpdatePrice() {
      if (this.multipleSelection.length > 0) {
        this.updatePriceDialog = true;
        this.updatePriceForm.ids = this.multipleSelection.map(item => item.id);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },
    //批量删除
    batchDel() {
      if (this.multipleSelection.length > 0) {
        this.deleteDialog = true;
        this.batchId = this.multipleSelection.map(item => item.id);
        this.batchData.status = this.multipleSelection.map(item => item.status);
      } else {
        this.$message.warning("请先选择需要操作的条目");
      }
    },

    //修改价格状态
    updatePrice(val) {
      this.updatePriceForm.priceType = val;
    },
    //检索
    onSubmit() { 
      if (this.timeLimit) {
        this.querylist.beginTime = this.timeLimit[0];
        this.querylist.endTime = this.timeLimit[1];
      } else {
        this.querylist.beginTime = null;
        this.querylist.endTime = null;
      }
      this.querylist.pageNum = 1;
      this.querylist.status = this.querylist.status;
      this.getList();
    },
    //重置
    onReset() {
      this.timeLimit=[]
      this.querylist = {
        pageNum: 1,
        status: this.querylist.status,
        pageSize: this.querylist.pageSize
      };
      this.getList();
    },
    onHide() {
      this.hideFlag = !this.hideFlag;
    },
    handleClick(tab, event) {
      this.currentPageFun(1);//初始分页为第一页
      if (tab.index == "0") {
        this.querylist.status = null;
        
      } else if (tab.index == "1") {
        this.querylist.status = 0;
      } else if (tab.index == "2") {
        this.querylist.status = 1;
      } else if (tab.index == "3") {
        this.querylist.status = 2;
      }
      this.getList();
    },
    //多选框发生变化时
    handleSelectionChange(val) {
      this.multipleSelection = val;
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

    handleNodeClick(data) { //点击树节点获取table数据
      this.querylist.diyTypeId = data.id;
      //console.log(data,"法规库")
      this.querylist.diyTypeCode = data.code;
      this.getList()
    },
    
    // 左侧自定义分类
    getNav() {
      getTreeAPI(10).then(res => {
        res.data.data = [{ showName: "全部" }].concat(res.data.data);
        res.data.code === 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
    },
    //所有动画
    getList() {
      getListAPI(this.querylist).then(res => {
        if (res.status) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
          res.data.data.list.forEach( (back,index) =>{
            if(res.data.data.list[index].uploadTime){
              res.data.data.list[index].uploadTime = back.uploadTime.substring(0,10)
            }
            if(res.data.data.list[index].issuingTime){
              res.data.data.list[index].issuingTime = back.issuingTime.substring(0,10)
            }
            
          })
        } else {
          errorMsg.apply(this, [res.data, `获取表格数据`]);
        }
        this.listLoading = false;
      });
    }
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
    this.getNav();
    this.getList();
  },
  activated() {
    this.getList();//缓存操作的新增编辑时，要更新数据
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  components: { pagination,Treeselect }
};
</script>
<style scoped>
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
.dialogbtns {
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
/* .dialog458 .el-input {
  width: 130px;
}

.dialog458 .el-form-item {
  width: 200px;
  display: inline-block;
  margin-bottom: 5px;
} */
.info {
  margin: 0;
}
.project-plan .upload-demo {
  display: inline-block;
}
.tablelist{
  background:#fff;
  margin-top:10px;
  z-index: 1;
}
</style>
<style scoped>
.project-plan .el-upload-list {
  width: 418px;
  height: 189px;
  overflow: auto;
  border: 1px solid #a9a9a9;
  margin-top: 5px;
  margin-bottom: 5px;
  overflow: auto;
  margin: 0 auto;
}
.project-plan .el-tabs--border-card {
  -webkit-box-shadow: none;
  box-shadow: none;
}
.project-plan
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item.is-active {
  color: #02a7c1;
  font-weight: bold;
}
.project-plan
  .el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #02a7c1;
}
.project-plan .importExcDialog .el-dialog {
  width: 430px;
  height: 270px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -215px;
  margin-top: -135px !important;
}
.project-plan .updatePriceDialog .el-dialog {
  width: 458px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -229px;
  margin-top: -107px !important;
}

.project-plan .auditDialog .el-dialog {
  width: 458px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -229px;
  margin-top: -100px !important;
}
.project-plan .deleteDialog .el-dialog {
  width: 458px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -229px;
  margin-top: -90px !important;
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
/* .project-plan .width90 .el-form-item__content {
  margin-left: 0 !important;
} */
/* .project-plan .formlist .el-button.search {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.project-plan .formlist .el-button {
  width: 89px;
  border-radius: 5px;
} */
.project-plan .el-upload {
  margin-top: 5px;
  margin-bottom: 5px;
  float: right;
}

.project-plan .el-table__header-wrapper th {
  background: #fff;
}
.dialog458 .el-dialog {
  width: 458px;
}
</style>

