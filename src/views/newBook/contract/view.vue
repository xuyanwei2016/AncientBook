<template>
  <div class="contractAdd xywCss" style='background:#eef0f3;'>
    <div class="formbox" style='width:94%;'>
      <div class="tabwrapper">
        <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
        <el-form
          :model="resourceForm"
          ref="ruleForm"
          :rules="rules"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="合同名称:" prop="name"  class="width360">
            <el-input v-model="resourceForm.name" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="合同编号:" prop="identifier" class="width360">
            <el-input v-model="resourceForm.identifier" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="合同类型:" prop="contractClass" class="time100">
            <el-select v-model="resourceForm.contractClass"  placeholder="请选择" :disabled="vueStatus">
              <el-option
                v-for="(value,index) in options"
                :key="index"
                :label="value"
                :value="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目名称:" prop="projectName" class="width360">
            <el-input v-model="resourceForm.projectName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="有效期:" prop="term">
            <el-radio v-model="resourceForm.term" :label="0" :disabled="vueStatus">有期限</el-radio>
            <el-radio v-model="resourceForm.term" :label="1" :disabled="vueStatus">永久有效</el-radio>
          </el-form-item>
          <el-form-item label="签订时间:" :prop="resourceForm.term=='0'?'signingTime':''" class="width360 time100" v-if="resourceForm.term==0">
            <el-date-picker v-model="resourceForm.signingTime" type="date" placeholder="选择日期"  :picker-options="pickerOptions0" :disabled="vueStatus"></el-date-picker>

          </el-form-item>
          <el-form-item label="过期时间:" :prop="resourceForm.term=='0'?'endTime':''" class="width360 time100" v-if="resourceForm.term==0">
            <el-date-picker v-model="resourceForm.endTime" type="date" placeholder="选择日期" :disabled="vueStatus" :picker-options="pickerOptions1"></el-date-picker>

          </el-form-item>
          <el-form-item label="作者方赞助款金额:" prop="sponsorship" class="width360" v-if="$route.name=='financeView'&&$route.query.type=='detail'">
            <el-input v-model="resourceForm.sponsorship" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="甲方:" prop="firstParty" class="width360">
            <el-input v-model="resourceForm.firstParty" :disabled="vueStatus"></el-input>
            <span class="spn" @click="getAuthorList('firstParty')" v-if="!vueStatus">获取作者列表</span>
          </el-form-item>
          <el-form-item label="乙方:" prop="secondParty" class="width360">
            <el-input v-model="resourceForm.secondParty" :disabled="vueStatus"></el-input>
            <span class="spn" @click="getAuthorList('secondParty')" v-if="!vueStatus">获取作者列表</span>
          </el-form-item>
          <el-form-item label="甲方授权人:" prop="firstAuthorize" class="width360">

            <el-input v-model="resourceForm.firstAuthorize" :disabled="vueStatus"></el-input>
            <span class="spn" @click="getAuthorList('firstAuthorize')" v-if="!vueStatus">获取作者列表</span>
          </el-form-item>
          <el-form-item label="乙方授权人:" prop="secondAuthorize" class="width360">

            <el-input v-model="resourceForm.secondAuthorize" :disabled="vueStatus"></el-input>
            <span class="spn" @click="getAuthorList('secondAuthorize')" v-if="!vueStatus">获取作者列表</span>
          </el-form-item>
          <el-form-item label="简介:" prop="synopsis" class="content synopsis">
            <tinymce :height="300" ref="editor" v-model="resourceForm.synopsis"></tinymce>
          </el-form-item>
          <div class="resource_content">
            <el-form-item label="合同文件：">
              <!--<span  v-if="vueStatus" style="color: #909399">{{resourceForm.contractName||'暂无文件'}}</span>-->
              <div class="pdfCss" v-if="vueStatus">
                {{resourceForm.contractFile?resourceForm.contractName:'暂无文件'}}
                <span v-if="fileList.length>0" @click="downFile(resourceForm.contractFile)" style="cursor: pointer;color: #4285F4">下载</span>
              </div>
              <el-upload class="upload-demo uploadFileCss" :action="`${domain}/zuul${requestPath.file}${uploadPath}`" :on-exceed="handleFileExceed" :before-upload="beforeFileUpload" :limit="1" :on-success="handleFileSuccess"  multiple  :on-remove="handleFileRemove" :file-list="fileList" v-if="!vueStatus" accept="image/*,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
              >
                <el-button :loading="uploading" type="primary">选择文件</el-button>
                <span v-if="resourceForm.contractFile" @click="downFile(resourceForm.contractFile)" style="cursor: pointer;color: #4285F4">下载</span>
                <!--<span>{{resourceForm.pdf_zh}}</span>-->
              </el-upload>
              <div class="el-upload__tip" v-if="!vueStatus">可上传文件类型包括Word、PDF、Excel、图片</div>
              <!--<el-upload
                class="upload-demo"
                :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                :file-list="fileList"
                :on-success="handleFileSuccess"
                :on-remove="handleFileRemove"
                accept="image/*, application/pdf, application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                v-if="!vueStatus"
              >
                <el-button size="small" v-if="upfiles" type="primary">点击上传</el-button>
                <a class="el-upload-list__item-name" v-if="resourceForm.contractName&&conShow">{{resourceForm.contractName}}</a>

                <div slot="tip" class="el-upload__tip">可上传文件类型包括Word、PDF、Excel、图片</div>
              </el-upload>-->
            </el-form-item>
            <el-form-item label="上传附件：">
              <div class="pdfCss" v-if="vueStatus">
                {{resourceForm.file?resourceForm.fileName:'暂无文件'}}
                <span v-if="fileSubList.length>0" @click="downFile(resourceForm.file)" style="cursor: pointer;color: #4285F4">下载</span>
              </div>
              <el-upload
                class="upload-demo uploadFileCss"
                :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                :file-list="fileSubList"
                :limit="1"
                :on-exceed="handleSubFileExceed"
                :before-upload="beforeSubFileUpload"
                :on-success="handleSubSuccess"
                :on-remove="handleFileSubRemove"
                accept="image/*,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
                v-if="!vueStatus"
              >
                <el-button :loading="uploadingSub"  type="primary">选择文件</el-button>
                <span v-if="resourceForm.file" @click="downFile(resourceForm.file)" style="cursor: pointer;color: #4285F4">下载</span>
              </el-upload>
              <div class="el-upload__tip" v-if="!vueStatus">可上传文件类型包括Word、PDF、Excel、图片</div>
            </el-form-item>
          </div>
          <div class="reactResource" v-if="$route.name!='financeView'">
            <h6>&nbsp;&nbsp;|&nbsp;&nbsp;相关资源</h6>
            <el-button type="primary" @click="chooseResource"  plain style='margin-left:153px;' v-if="!vueStatus">选择资源</el-button>
            <el-button type="primary" @click="cancelResource" plain  v-if="!vueStatus">取消关联</el-button>
            <el-table
              class="tableList"
              :key="tableKey"
              height="500"
              :data="resourcelist"
              element-loading-text="给我一点时间"
              border
              highlight-current-row
              stripe
              @selection-change="chioceresource"
            >
              <el-table-column type="selection" align="center"></el-table-column>
              <el-table-column type="index" align="center" label="序号"></el-table-column>
              <el-table-column label="资源名称" min-width="160" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="类型" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.type==1">图书</span>
                  <span v-if="scope.row.type==2">文章</span>
                  <span v-if="scope.row.type==5">图片</span>
                  <span v-if="scope.row.type==6">视频</span>
                  <span v-if="scope.row.type==7">音频</span>
                  <span v-if="scope.row.type==8">动画</span>
                  <span v-if="scope.row.type==9">课件</span>
                  <span v-if="scope.row.type==10">法规</span>
                  <span v-if="scope.row.type==14">条文</span>
                  <span v-if="scope.row.type==15">pdf</span>
                  <span v-if="scope.row.type==16">专家</span>
                  <span v-if="scope.row.type==20">选题</span>

                </template>
              </el-table-column>
              <el-table-column label="作者" min-width="120" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.author}}</span>
                </template>
              </el-table-column>
              <el-table-column label="上传时间" min-width="140" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.uploadTime}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-form-item  style='text-align:center; width: 90%'>
            <el-button type="primary" @click="onSubmit" v-if="pageStatus == 0" class='onSubmitClass'>保存</el-button>
            <el-button  @click="reset" class='dialogFormVisibleClass'>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog title="作者列表"  class="fixHeight" :visible.sync="dialogVisible" width="80%">
        <el-form inline class="form-inline">
          <el-form-item label="姓名:">
            <el-input v-model="listQuery.name"></el-input>
          </el-form-item>
          <el-form-item label="机构名称:">
            <el-input v-model="listQuery.institutionName"></el-input>
          </el-form-item>
          <el-form-item label="创建时间:">
            <el-date-picker
              v-model="timeLimit"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button class="search" type="primary" @click="onSubmitauthor" icon="el-icon-search">检索</el-button><el-button type="primary" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          border
          v-loading="authorlistLoading"
          element-loading-text="给我一点时间"
          ref="multipleTable1"
          :data="authorlist"
          tooltip-effect="dark"
          @selection-change="chioceList"
          class="fixTable"
          height="400px"
        >
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column label="姓名" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="机构名称" align="center">
            <template slot-scope="scope">{{scope.row.institutionName}}</template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope">{{scope.row.createTime}}</template>
          </el-table-column>
        </el-table>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="getsureAuthor">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="资源列表" class="fixHeight" :visible.sync="dialogResourceVisible" width="80%">
        <el-form inline class="form-inline">
          <el-form-item label="资源类型"  style="margin-right:20px">
            <el-select v-model="relistQuery.resourceType" prop='resourceType' placeholder="请先选择资源类型">
              <el-option
                v-for="(value,key) in typeList"
                :key="key"
                :label="value"
                :value="key"
              >{{value}}</el-option>
            </el-select>
          </el-form-item>


          <el-form-item>
            <el-button class="search" type="primary" @click="onSubmitrechoose" icon="el-icon-search">检索</el-button>
          </el-form-item>
        </el-form>
        <el-table
          border
          v-loading="resourcelistLoading"
          element-loading-text="给我一点时间"
          ref="multipleTable1"
          :data="resourcelists"
          tooltip-effect="dark"
          height="400px"
          @selection-change="chioceresourceListAll"
        >
          <el-table-column type="index" align="center"></el-table-column>
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column label="资源名称" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="作者" align="center">
            <template slot-scope="scope">{{scope.row.author}}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0">已录入</span>
              <span v-if="scope.row.status==1">审核通过</span>
              <span v-if="scope.row.status==2">审核未通过</span>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" align="center">
            <template slot-scope="scope">{{scope.row.uploadTime}}</template>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          align="center"
          :page-sizes="[30,50,100,200,500]"
          :page-size="relistQuery.pageSize"
          :current-page="relistQuery.pageNum"
          @current-change="currentPageFun"
          @size-change="pagesizeFun"
        ></el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogResourceVisible = false">取 消</el-button>
          <el-button type="primary" @click="getsureResource">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {
    addAPI,
    detailsAPI,
    updateAPI,
    contractClassAPI,
    getauthorListAPI
  } from "@/api/website-management/copyright";
  import {
    operationMsg,
    requestMsg,
    errorMsg,
    confirm
  } from "@/utils/publicFunctions";
  import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
  import {getFinancialDetailAPI}  from '@/api/newBook/finance.js';

  import Tinymce from "@/components/Tinymce";
  import "@/styles/resource.scss";
  import { files , getTypeAPI, getRelatedListAPI} from "@/api/resource/common";
  export default {
    data() {
      const validateName = (rule, value, callback) => {
        //let reg = /^([\w\d]|[\u4e00-\u9fa5]){1,80}$/
        let reg = /^([\w\d]|[\u4e00-\u9fa5]){1,80}$/
        if( value.replace(/\s+/g,"") == '' ){
          callback(new Error('项目名称'));
        } else if(!reg.test(value)){
          callback(new Error('项目名称长度必须为小于80位的汉字、字母、数字'));
        }else{
          callback()
        }
      };
      const validateIdentifier = (rule, value, callback) => {
        let reg = /^([\w\d]){1,30}$/
        if( value.replace(/\s+/g,"") == '' ){
          callback(new Error('请填写项目编号'));
        } else if(!reg.test(value)){
          callback(new Error('项目编号长度必须为小于30位的字母、数字'));
        }else{
          callback()
        }
      }
      return {
        label:0,
        typeList:[],
        tokens: "", //附件
        uploadFileList: {
          bookid: this.$route.query.id,
          token: ""
        },
        signingTime: {
          disabledDate(time) {
            console.log(1111,this.resourceForm.endTime)

              return time.getTime() < this.resourceForm.endTime||new Date();


          },
        },
        endTime: {
          disabledDate(time) {
            console.log(1111,this.resourceForm.signingTime)
            return time.getTime() >this.resourceForm.signingTime||new Date();
          },
        },
        upfiles: true,
        upfilesub: true,
        options: [],
        tableKey: 0,
        fileList: [],
        fileSubList: [],
        domain: process.env.BASE_API,
        requestPath: requestPath,
        uploadPath: uploadPath,
        imageUrl: "",
        chioceresourceList:[],
        chioceresourceListAllList:[],
        resourcelistLoading:[],
        resourcelists:[
          {
            name:'张三',
            institutionName:'人民',
            createTime:'2018-09-09'
          },
          {
            name:'李四',
            institutionName:'人民',
            createTime:'2018-09-09'
          }
        ],
        pageStatus: 0,
        listQuery: {
          pageNum: 1,
          pageSize: 50
        },
        relistQuery:{
          pageNum: 1,
          pageSize: 50,
          resourceType:"1"
        },
        authorlist: [],
        resourceForm: {
          name: "",
          contractClass: "",
          contractFile: "",
          endTime: "",
          firstAuthorize: "",
          firstParty: "",
          id: "",
          identifier: "",
          projectName: "",
          secondAuthorize: "",
          secondParty: "",
          signingTime: "",
          synopsis: "",
          term: 0,
          type:[],
          objectId:[],
          sponsorship:null
        },
        dialogVisible: false,
        dialogResourceVisible:false,
        listLoading: true,
        resourcelistLoading:true,
        authorlistLoading: true,
        list: [],
        resourcelist:[],
        rules: {
          name: [{ required:true,message:'请输入合同名称'},{max:80,message:'合同名称长度必须为小于80个字符'}],
          identifier:[{ required:true,message:'请输入合同编号'},{max:30,message:'合同编号长度必须为小于30个字符'}],
          contractClass: [{ required:true,message:'请选择合同类型' }],
          projectName:[{ required:false, max:50,message:'项目名称的长度必须为小于50个字符' }],/*pattern:/^([\w\d]|[\u4e00-\u9fa5]){1,50}$/*/
          signingTime: [{ required:true,message:'请选择签订时间' }],
          endTime: [{ required: true, message: "请选择过期时间", trigger: "change" }],
          firstParty: [{ required: true, message: "请输入甲方", trigger: "change" },{max:100,message:'甲方输入长度必须为小于100个字符'}],
          secondParty: [{ required: true, message: "请输入乙方", trigger: "change" },{max:100,message:'乙方输入长度必须为小于100个字符'}],
          firstAuthorize: [{ required:true,trigger: 'change',message:'请输入甲方授权人' },{max:100,message:'甲方授权人输入长度必须为小于100个字符'}],
          secondAuthorize: [{ required:true,trigger: 'change',message:'请输入乙方授权人' },{max:100,message:'乙方授权人输入长度必须为小于100个字符'}],
          sponsorship: [{ required:true,trigger: 'change',message:'请输入作者方赞助款金额' }],
          term: [{ required:true,message:'请输入有效期' }],
        },
        dialogStatus: {},
        uploading: false,
        activeName: "first",
        tableData: [],
        recordData: [],
        total: 30,
        timeLimit: "",
        retimeLimit:"",
        multipleSelection:[],
        whichName:'',
        fileShow:true,
        conShow:true,
        vueStatus:false,
        uploadingSub:false,
        value1:'',
        value2:'',
        pickerOptions0: {
          disabledDate: (time) => {
            console.log(2222,this.resourceForm.endTime)
            if (this.resourceForm.endTime&&this.resourceForm.endTime != "") {
              return time.getTime() >= this.resourceForm.endTime;
            }else{
              return false
            }

          }
        },
        pickerOptions1: {
          disabledDate: (time) => {

            if (this.resourceForm.signingTime&&this.resourceForm.signingTime != "") {
              return time.getTime() <= this.resourceForm.signingTime;
            }else{
              return false
            }
          }
        },
      };
    },

    methods: {
      //资源类型
      getType() {
        getTypeAPI().then(res => {
          this.typeList = res.data.data;
        });
      },
      //文件列表
      getFiles() {
        if (this.tokens == null || this.tokens == "") {
          this.tableData = [];
          return;
        } else {
          files({ tokens: this.tokens }).then(res => {
            this.tableData = res.data.data;
          });
        }
      },
      isEdit() {
        const id = this.$route.query.id; //修改id
        const detailsId = this.$route.query.lookId; //查看id
        if (this.$route.query.type=='edit') {
          this.$route.meta.title = "修改合同";
          this.pageDetails(id);
        }else if (this.$route.query.type=='detail') {
          this.pageStatus = 1;
          this.$route.meta.title = "查看合同";
          this.vueStatus=true;
          this.pageDetails(detailsId);
        }else{
          this.$route.meta.title = "添加合同";
        }
      },
      getList() {
        this.authorlistLoading = true;
        getauthorListAPI(this.listQuery).then(res => {
          if (res.data.code === 0) {
            this.authorlist = res.data.data.list;
            /*this.total = res.data.data.total;*/
          } else {
            this.$message.error("获取数据失败");
          }
          this.authorlistLoading = false;
        });
      },
      onSubmitauthor() {
        if (this.timeLimit) {
          this.listQuery.beginTime = this.timeLimit[0];
          this.listQuery.endTime = this.timeLimit[1];
        } else {
          this.listQuery.beginTime = null;
          this.listQuery.endTime = null;
        }
        this.listQuery.pageNum = 1;
        this.listQuery.status = this.listQuery.status;
        this.getList();
      },
      chooseResource(){
        this.dialogResourceVisible=true;
        this.getRelatedList()
      },
      //获取所有资源列表
      getRelatedList(){
        getRelatedListAPI(this.relistQuery).then( res => {
          if(res.data.code==0){
            this.resourcelists=res.data.data.list;
            this.total=res.data.data.total;
            //this.=res.data.data.total
          }else{
            this.$message.error('列表获取失败')
          }
        })
      },
      //取消关联
      cancelResource(){
        if(this.chioceresourceList.length==0){
          this.$message.warning('请选择至少一条操作对象')
        }else{
          for(var i=0 ;i<this.chioceresourceList.length;i++){
            for(var j=0;j<this.resourcelist.length;j++){
              if(this.chioceresourceList[i].name==this.resourcelist[j].name){
                this.resourcelist.splice(j,1)
              }
            }

          }
          this.$message.success('取消关联成功');
        }
      },
      //资源列表查询
      onSubmitrechoose(){
        this.getRelatedList()
      },
      //资源列表插叙取消
      onResetchoose(){},
      //选择资源确定
      getsureResource(){
        if(!this.chioceresourceListAllList||this.chioceresourceListAllList.length==0){
          this.$message.warning('请选择数据');
          return
        }
        this.chioceresourceListAllList.forEach(res=>{
          let ary=this.resourcelist.filter((item)=>{
            return res.type==item.type&&res.id==item.id;
          })
          if(ary.length<=0){
            this.resourcelist.push(res);
            this.$message.success('选择数据成功');
          }
        })

        this.dialogResourceVisible=false;
        this.listLoading=false
      },
      //所有资源选择列表
      chioceresourceListAll(val){
        this.chioceresourceListAllList=val;
      },
      //重置
      onReset() {
        this.timeLimit = [];
        this.listQuery = {
          pageNum: 1,
          status: this.listQuery.status,
          pageSize: this.listQuery.pageSize
        };
        this.getList();
      },
      // 查看和修改详情信息
      pageDetails(id) {
        let api=this.$route.name=='financeView'?getFinancialDetailAPI:detailsAPI;
        let data=this.$route.name=='financeView'?{subjectId:this.$route.query.lookId,id:this.$route.query.id}:id;
        this.fileList=[];
        this.fileSubList=[];
        api(data).then(res => {
          if (res.data.code === 0) {
            if(res.data.data){
              this.resourcelist=res.data.data.list
              delete res.data.data.list
              this.resourceForm=res.data.data;
              this.resourceForm.objectId=[]
              this.resourceForm.type=[]
              this.resourcelist.forEach( res => {
                this.resourceForm.objectId.push(res.objectId)
              })
              if(res.data.data.contractFile){
                let file={
                  name:res.data.data.contractName,
                  url:this.uploadUrl+res.data.data.contractFile,
                };
                this.fileList=[file];
              }
              if(res.data.data.file){
                let fileSub={
                  name:res.data.data.fileName,
                  url:this.uploadUrl+res.data.data.file,
                };
                this.fileSubList=[fileSub];
              }

            }
          }
        });
      },
      getTime(nS) {
        var date=new Date(nS);
        var year=date.getFullYear();
        var mon = date.getMonth()+1;
        var day = date.getDate();
        /*var hours = date.getHours();
        var minu = date.getMinutes();
        var sec = date.getSeconds();*/

        return year+'-'+(mon>9?mon:'0'+mon)+'-'+(day>9?day:'0'+day);
      },
      //保存
      onSubmit() {

        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            //必填字段
            const id = this.$route.query.id; //修改id
            this.resourceForm.objectId=[];   //清空
            this.resourceForm.type=[];
            if(this.resourceForm.term==0){
              this.resourceForm.signingTime=this.getTime(this.resourceForm.signingTime);
              this.resourceForm.endTime=this.getTime(this.resourceForm.endTime);
            }else{
              this.resourceForm.signingTime=null;
              this.resourceForm.endTime=null;
            }

            this.resourcelist.forEach(res => {
              if(res.id){
                this.resourceForm.objectId.push(res.id)
              }else{
                this.resourceForm.objectId.push(res.objectId)
              }
              this.resourceForm.type.push(res.type)
            })   //关联

            if (id) {
              //修改
              this.resourceForm.id = this.$route.query.id;
              updateAPI(this.resourceForm).then(res => {
                if (res.data.status) {
                  this.$message.success("编辑成功");
                  this.activeName = "second";
                  this.$router.go(-1);
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            } else {
              //新增
              addAPI(this.resourceForm).then(res => {
                if (res.data.code === 0) {
                  this.$message.success("添加成功");
                  this.activeName = "second";

                  this.$router.go(-1);
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            }
          } else {
            this.$message.warning("有未通过的验证");
          }
        });
      },
      //取消
      reset() {
        this.$router.back();
      },

      handleClick(tab) {
        if (tab.index == 1) {
          this.getFiles();
        }
      },

      // 返回上一步
      goback() {
        this.activeName = "first";
      },
      // 完成提交内容
      fininsh() {
        this.$router.push({ path: "/resource/article" });
        this.$router.go(-1);
      },
      handleInfo() {},
      //相关资源列表
      pagesizeFun(val) {
        this.relistQuery.pageSize = val;
        this.getRelatedList();
      },
      currentPageFun(val) {
        this.relistQuery.pageNum = val;
        this.getRelatedList();
      },
      // 下载
      handleDown(token) {
        window.open(
          `${process.env.BASE_API}${requestPath.file}download/${token}`
        );
      },
      handleFileExceed(files, fileList) {
        this.$message.warning(`单次上传最多1个文件`);
      },
      beforeFileUpload(){
        this.uploading = true;
      },
      /* 上传合同*/

      handleFileSuccess(res, file, fileList) {
        this.resourceForm.relatedContracts = res;
        this.upfiles = false;
        this.resourceForm.contractFile = file.response;
        this.resourceForm.contractName=file.name;
        this.conShow=false
        this.uploading=false;
      },
      handleFileRemove() {
        this.upfiles = true;
        this.resourceForm.contractFile='';
        this.resourceForm.contractName='';
        this.fileList=[];
        //this.conShow=true
      },
      // 附件
      handleSubFileExceed(files, fileList) {
        this.$message.warning(`单次上传最多1个文件`);
      },
      beforeSubFileUpload(){
        this.uploadingSub = true;
      },
      handleSubSuccess(res, file, fileList) {
        this.resourceForm.relatedContracts = res;
        this.resourceForm.file = file.response;
        this.resourceForm.fileName=file.name
        this.upfilesub = false;
        this.fileShow=false;
        this.uploadingSub = false;

      },
      handleFileSubRemove() {
        this.upfilesub = true;
        this.resourceForm.file='';
        this.resourceForm.fileName='';
        this.fileSubList=[];
        //this.fileShow=true
      },
      /*下载*/
      downFile(url){
        let openUrl=`${process.env.BASE_API}/file/file/download/${url}`;
        window.open(openUrl);
      },
      chioceList(val) {
        this.multipleSelection = val;
      },
      //获取合同列表
      getcontractList() {
        contractClassAPI().then(res => {
          if (res.data.code == 0) {
            this.options = res.data.data;
          }
        });
      },
      //获取作者列表
      getAuthorList(val) {
        this.whichName=val
        this.dialogVisible = true;
        this.listQuery = {
          pageNum: 1,
          pageSize: 50
        };
        this.getList();
      },
      //确定选择作者
      getsureAuthor(){
        if(this.multipleSelection.length==1){
          let whichNam=this.whichName;
          // this.resourceForm.whichNam=this.multipleSelection[0].name;
          if(whichNam=='firstParty'){
            this.resourceForm.firstParty=this.multipleSelection[0].name
          }
          if(whichNam=='secondParty'){
            this.resourceForm.secondParty=this.multipleSelection[0].name
          }
          if(whichNam=='firstAuthorize'){
            this.resourceForm.firstAuthorize=this.multipleSelection[0].name
          }
          if(whichNam=='secondAuthorize'){
            this.resourceForm.secondAuthorize=this.multipleSelection[0].name
          }
          this.dialogVisible=false
        }else if(this.multipleSelection.length==0){
          this.$message.error("请选择要操作的信息");
        }else{
          this.$message.error("仅可以选择一条");
        }

      },
      //取消关联的选择
      chioceresource(val){
        this.chioceresourceList=val;
      }
    },
    created() {
      this.dialogStatus = this.$route.query.type;
    },
    mounted() {
      this.isEdit();
      /*this.pageDetails();*/
      this.getcontractList();
      this.resourcelistLoading=false;
      this.getType()
    },
    components: { Tinymce }
  };
</script>
<style lang="css" scoped>
  .contractAdd .tabwrapper{
    background:white;
    width:100%;
    height:100%;
    margin-top:20px;
    padding: 30px 0;
  }
  .contractAdd .formbox .onSubmitClass{
    background:#409eff;
    color:white;
    border-radius: 0;
  }
  /* .contractAdd .formbox .onSubmitClass:hover{
    background:#606266;
    color:white;
    border:1px solid #606266;
    border-radius: 0;
  }

  .contractAdd .formbox .dialogFormVisibleClass{
    background:white;
    border:1px solid #ccc;
    color:#ccc;
    border-radius: 0;
  }
  .contractAdd .formbox .dialogFormVisibleClass:hover{
    background:#606266;
    color:white;
    border:1px solid #606266;
    border-radius: 0;
  } */
  #app .main-container {
    background: #eef0f3 !important;
  }
  .contractAdd{
    background:#fff;
  }

  .contractAdd .el-form-item.content {
    width: 85%;
  }
  /* .contractAdd .el-button {
    background: #409eff;
    border-color: #409eff;
    border-radius: 5px;
    color: #fff;
  } */
  /* /* .contractAdd .btncenter .el-button {
    background: #fff;
    border-color: #409eff;
    border-radius: 5px;
    color: #409eff;
  } */
  /* .btncenter .el-button:hover {
    background: #409eff;
    border-color: #409eff;
    border-radius: 5px;
    color: #fff;
  } */
  .contractAdd .btncenter {
    text-align: center;
    margin-right: 10px;
    margin-top: 100px;
  }
  .contractAdd .recordtable {
    position: relative;
  }
  .contractAdd .prfooter {
    position: static;
    min-width: 980px;
    margin-top: 300px;
  }
  .el-pagination button:disabled {
    background: none;
  }
  .el-pagination{
    background: #393f5b;
  }
  .el-form-item__label em {
    color: red;
  }
  .contractAdd .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  /* .contractAdd .el-form-item.width360 .el-input,
  .contractAdd .el-form-item.width360 .el-textarea,
  .contractAdd .el-form-item.width360 .el-date-editor{
    width: 360px;
  }
  .contractAdd .el-form-item.width460 .el-input,
  .contractAdd .el-form-item.width460 .el-textarea {
    width: 460px;
  } */
   .contractAdd .demo-ruleForm .el-form-item {
    width: 50%;
  }
  .contractAdd .demo-ruleForm .content{
    width: 80%;
  }

  /*.contractAdd .el-form-item.width360 {
    width: 40%;
  }
  .contractAdd .el-form-item.width300 {
    width: 30%;
  }
  .contractAdd .el-form-item.width460 {
    width: 60%;
  }
  .contractAdd .el-textarea.width460,
  .contractAdd .el-input.width460 {
    width: 60%;
    display: inline-block;
  }
  .contractAdd .el-input.inp {
    width: 20%;
    display: inline-block;
  }*/
  .resource_content .tip {
    font-size: 14px;
    color: #ccc;
  }
  .resource_content .el-form-item__label {
    width: 120px !important;
  }
  .formbox {
    margin: 0;
  }
  .tableList {
    text-align: center;
    margin:20px auto;
    width:80%;
    border-left:1px solid #ebeef5;
    border-top:1px solid #ebeef5;
  }
  .spn {
    display: inline;
    color: #409eff;
    font-size: 12px;
    cursor: pointer;
  }
  .fixHeight {
    height: 100%;
    /* overflow: hidden; */
  }
</style>

