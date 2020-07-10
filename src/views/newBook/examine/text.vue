<template>
  <div class="addImgResource newBookView">
    <div class="formbox">
      <el-form
        :model="imgForm"
        ref="ruleForm"
        :rules="rules"
        label-width="140px"
        class="demo-ruleForm"
      >


        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
          <el-form-item :prop="vueStatus?'':'bookName'" label="书名（正题）:" class="width360">
            <el-input v-model="imgForm.bookName" name="bookName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="书名（副题）:" :prop="vueStatus?'':'subBookName'" class="width360">
            <el-input v-model="imgForm.subBookName"  :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'seriesName'"  label="丛书名:" class="width360 author">
            <el-input v-model="imgForm.seriesName" name="seriesName"  :disabled="vueStatus" @input="getSeries" placeholder="点击关联丛书或手动输入"></el-input>
            <div class="list" v-if="isSeries">
              <ul>
                <li v-for="(item,index) in seriesList" :key="index" @click="changeSeries(item)">{{item.name}}</li>
              </ul>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 35px;" v-if="isSeries"></div>
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'originalAuthor'" label="原著者:" class="width360">
            <el-input v-model="imgForm.originalAuthor" name="originalAuthor"  :disabled="vueStatus"></el-input>         <!--<el-select v-model="imgForm.bookname" disabled="disabled" placeholder="请选择活动区域">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>-->
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'workMethod'" label="著作方式：" class="width360">
            <el-input v-model="imgForm.workMethod" name="workMethod"  :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="作者：" :class="!vueStatus?'width360 seriesAuthor':'width360'">
            <el-input  v-model="imgForm.author" name="seriesAuthor" v-if="vueStatus" :disabled="vueStatus"></el-input>
            <div :class="isAuthor.length==0?'authorList redBorder':'authorList'" v-if="!vueStatus">
              <el-input v-for="(item,index) in seriesAuthor" :key="index" v-model="item.value" name="seriesAuthor"  :disabled="vueStatus" :style="{'marginTop':index>0?'5px':'0'}" style=""></el-input>
              <div class="tip" v-if="isAuthor.length==0">请填写作者</div>
            </div>
            <i class="el-icon-circle-plus" style="font-size: 24px;margin-top: 5px;cursor: pointer" @click="addAuthor" v-if="seriesAuthor[0].value&&!vueStatus"></i>

          </el-form-item>

          <el-form-item prop="seriesWorkMethod" label="丛书著作方式：" class="width360">
            <el-input v-model="imgForm.seriesWorkMethod" name="seriesWorkMethod"  :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item prop="seriesAuthor" label="丛书作者：" class="width360">
            <el-input v-model="imgForm.seriesAuthor" name="seriesAuthor"  :disabled="vueStatus"></el-input>
          </el-form-item>

          <el-form-item :prop="vueStatus?'':'productSize'" label="成品尺寸：" class="width360">
            <el-input v-model.number="imgForm.productSize" name="productSize"  :disabled="vueStatus"></el-input>mm
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'wordCount'" label="字数：" class="width360">
            <el-input v-model.number="imgForm.wordCount" name="wordCount"  :disabled="vueStatus"></el-input>千字
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'pages'" label="页数：" class="width360">
            <el-input v-model.number="imgForm.pages" name="pages"  :disabled="vueStatus"></el-input>页
          </el-form-item>
          <el-form-item prop="illustrations" label="插图：" class="width360">
            <el-input v-model="imgForm.illustrations" name="illustrations" :disabled="vueStatus" align="left"></el-input>副
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'edition'" label="版次：" class="width360">
            <el-input v-model="imgForm.edition" name="edition" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'printingTimes'" label="印次：" class="width360">
            <el-input v-model="imgForm.printingTimes" name="printingTimes" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'editor'" label="责任编辑：" class="width360">
            <el-input v-model="imgForm.editor" name="editor" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'phone'" label="电话：" class="width360">
            <el-input v-model="imgForm.phone" name="phone" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item prop="subjectNum" label="选题号：" class="width360">
            <el-input v-model="imgForm.subjectNum" name="subjectNum" :disabled="vueStatus"></el-input>

          </el-form-item>
          <el-form-item label="相关文件：" class="uploadCss">
            <div class="pdfCss" v-if="vueStatus">{{imgForm.relatedFile?imgForm.relatedFileName:'暂无文件'}}         <span v-if="fileList.length>0" @click="downFile(imgForm.relatedFile)" style="cursor: pointer">下载</span>
            </div>
            <el-upload
              class="upload-demo"
              :action="`${uploadUrl}${uploadPath}`"
              :limit="1"
              :on-exceed="handleFileExceed" :before-upload="beforeFileUpload" :on-success="handleFileSuccess"  multiple  :on-remove="handleFileRemove" v-if="!vueStatus"
            >
              <el-button  :loading="uploading" type="primary">选择文件</el-button>
            </el-upload>
            <div class="el-upload__tip" v-if="!vueStatus">可上传文件类型包括Word、PDF，大小不超过2M</div>
          </el-form-item>
        </div>
      </el-form>




      <div class="tabwrapper1" v-if="!$route.query.editId">
        <h6>&nbsp;&nbsp;|&nbsp;&nbsp;审核意见</h6>
        <el-form :model="examine"
                 ref="examine"
                 :rules="rules"
                 label-width="140px"
                 class="demo-ruleForm">
          <el-form-item prop="userName" label="审校人：" class="width360">
            <el-input v-model="examine.userName" name="userName" :disabled="vueStatus&&type>$route.query.type"></el-input>
          </el-form-item>
          <el-form-item label="审校意见：">
            <el-input v-model="examine.auditOpinion" name="auditOpinion" :disabled="vueStatus&&type>$route.query.type" :rows="4" style="width:80%" resize="none"></el-input>
          </el-form-item>
          <!--<el-form-item prop="dutyEditor" label="指定二审负责人：" class="">
            <el-select value-key="userId" v-model="firstInstance" placeholder="请选择"  :disabled="vueStatus&&type>$route.query.type">
              <el-option
                v-for="(item,ind) in userList"
                :key="item.userId"
                :label="item.userName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>-->
        </el-form>
      </div>





      <el-form label-width="140px" class="demo-ruleForm" v-if="!vueStatus">
        <el-form-item label="指定一审负责人:" prop="series" class="width360 peopleFrom">
          <el-select  value-key="userId" v-model="peopleFrom" placeholder="请选择" :class="isPeopleFrom?'select':''">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="item"></el-option>
          </el-select>
          <div class="tip" v-if="isPeopleFrom">请指定一审负责人</div>
        </el-form-item>
      </el-form>
      <el-form class="demo-ruleForm" style="width: 100%">
        <el-form-item style="display: flex;justify-content: center" v-if=" !vueStatus">
          <el-button type="primary" @click="dataSubmit(1)">通过</el-button>
          <el-button @click="dataSubmit(2)">驳回</el-button>
        </el-form-item>
        <el-form-item style="display: flex;justify-content: center" v-if="type==1">
          <el-button type="primary" @click="firstInsFn">通过</el-button>
          <el-button>驳回</el-button>
        </el-form-item>


      </el-form>


    </div>



  </div>
</template>
<script>

  import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js';
  import "@/styles/commonRe.css";
  import infoImg from '@/assets/img/info.jpg'
  import {getThreeDetailAPI,perfectInfoAPI,auditAssignAPI,batchAuditAPI} from '../../../api/newBook/examine';
  import {getUserListAPI,getSeriesAPI,subjectAssignAPI} from '@/api/newBook/subject';
  import Cookies from "js-cookie";
  export default {
    data() {
      return {
        uploadUrl:uploadUrl,
        uploadPath:uploadPath,
        imgForm:{
          series:''
        },
        peopleFrom:{
          userName:null,
          userId:null,
        },
        firstInstance:{
          userName:null,
          userId:null,
        },
        rules:{
          bookName: [{required: true, message: '请输入书名', trigger: 'change'},{max: 80, message: '书名输入长度小于80', trigger: 'change'}],
          subBookName:[{ required: true, message: '请输入副题', trigger: 'change' },{max: 80, message: '副题输入长度小于80', trigger: 'change'}],
          workMethod:[{ required: true, message: '请输入著作方式', trigger: 'change' },{max: 10, message: '著作方式输入长度小于10', trigger: 'change'}],
          productSize:[{ required: true, message: '请输入成品尺寸', trigger: 'change' },{type: 'number', message: '请输入尺寸数字', trigger: 'change'}],
          wordCount:[{ required: true, message: '请输入字数', trigger: 'change' },{type: 'number', message: '请输入字数数字', trigger: 'change'}],
          pages:[{ required: true, message: '请输入页数', trigger: 'change' },{type: 'number', message: '请输入页数数字', trigger: 'change'}],
          edition:[{ required: true, message: '请输入版次', trigger: 'change' }],
          printingTimes:[{ required: true, message: '请输入印次', trigger: 'change' }],
          editor:[{ required: true, message: '请输入责任编辑', trigger: 'change' }],
          phone:[{ required: true, message: '请输入电话', trigger: 'change' }],
          userName: [{required: true, message: '请输入审核人', trigger: 'change'}],
        },
        activeName: "first",
        infoImg:infoImg,
        peopleStatus:[
          {name: '待一审', code: '2-3-1'},
          {name: '待二审', code: '2-3-2'},
          {name: '待三审', code: '2-3-3'},
          {name: '审核通过', code: '2-4'},
        ],
        uploading:false,
        vueStatus:false,
        userList:[],
        isSeries:false,
        seriesList:[],
        seriesAuthor:[{value:''}],
        isAuthor:[],
        fileList:[],
        isPeopleFrom:true,
        type:0,
        examine: {
          userName:''
        },
      }
    },
    created(){
      if(this.$route.fullPath.indexOf('editId')>=0){
        this.$route.meta.title = '修改';
        this.vueStatus=false;
      }else if(this.$route.fullPath.indexOf('lookId'>=0)){
        this.$route.meta.title = '查看';
        this.vueStatus=true;
        this.type=this.$route.query.type;
      }else{
        this.$route.meta.title = '添加';
        this.vueStatus=false;
      }
      this.examine.userName = Cookies.get('username');
      this.getDetail();

    },
    watch:{
      seriesAuthor: {
        handler(newValue, oldValue) {

          this.isAuthor=newValue.filter((item)=>{
            return item.value!='';
          })
          console.log('监听',this.isAuthor)
        },
        deep: true
      },
      'peopleFrom.userName'(n,o){
        this.isPeopleFrom=n!=''?false:true;
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
      getDetail(){
        this.fileList=[];
        getThreeDetailAPI(this.$route.query.editId||this.$route.query.lookId).then(res=>{
          if(res.data.status){
            this.imgForm=res.data.data;
            if(res.data.data.relatedFile){
              let file={
                name:res.data.data.relatedFileName,
                url:this.uploadUrl+res.data.data.relatedFile,
              };
              this.fileList=[file];
            }
            this.getUserList();
          }
        })
      },
      /*下载*/
      downFile(url){
        let openUrl=`${process.env.BASE_API}/file/file/download/${url}`;
        window.open(openUrl);
      },
      getSeries(){
        if(this.imgForm.seriesName.trim()==''){
          this.isSeries=false;
          return
        }
        getSeriesAPI({name:this.imgForm.seriesName}).then(res=>{
          if(res.data.status){
            this.seriesList=res.data.data;
            this.isSeries=res.data.data.length>0?true:false;
          }
        })
      },
      changeSeries(item){
        this.imgForm.seriesName=item.seriesName;
        this.imgForm.seriesId=item.id;
        this.isSeries=false;
      },
      handleClick(tab, event) {},
      //通过
      dataSubmit(n){
        this.$refs['examine'].validate((valid) => {
          if(valid){
            batchAuditAPI({
              auditOpinion: this.examine.auditOpinion,
              currentStage: this.imgForm.status,
              ids: [this.$route.query.lookId],
              status:n
            }).then(res=>{
              if(res.data.status){
                this.$message.success('批量审核成功');

              }else{
                this.$message.error(res.data.msg);
              }
            })
          }
        })



      },
      /*指定负责人*/
      threeBtn(){
        /*auditor (string, optional): 审校人ID ,
auditorName (string, optional): 审校人 ,
ids (Array[integer], optional): ID ,
nextStage (string, optional): 下一阶段状态，一审：2-3-1，二审：2-3-2，三审：2-3-3*/
        auditAssignAPI({
          ids: [this.imgForm.id],
          auditor:this.peopleFrom.userId,
          auditorName:this.peopleFrom.userName,
          nextStage:'2-3-1'
        }).then(res=>{
          if(res.data.status){
            this.$message.success('保存成功');
            this.$router.go(-1);
          }else{
            this.$message.error(res.data.msg);
          }
        })

      },
      /*保存一审负责人*/
      /*查看选题号*/
      lookFile(){},
      handleFileExceed(files, fileList) {
        this.$message.warning(`单次上传最多1个文件`);
      },
      beforeFileUpload(file){
        console.log(file)
        const isPDF = file.type === 'application/pdf'||file.type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'||file.type=='application/msword';
        const isLt10M = file.size / 1024 / 1024 < 2;
        if (!isPDF) {
          this.$message.error('附件文件只能是 PDF、WORD 格式!')
          return isPDF;
        }
        if (!isLt10M) {
          this.$message.error('上传文件大小不能超过 2MB!');
          return isLt10M
        }
        this.uploading = true
      },
      handleFileSuccess(response, file, fileList){
        console.log('上傳成功',response,file)
        this.imgForm.relatedFileName=file.name;
        this.imgForm.relatedFile = response;
        this.uploading=false;
      },
      handleFileRemove() {//删除pdf
        this.imgForm.relatedFile=null;
        this.imgForm.relatedFileName=null;
      },
      /*添加作者*/
      addAuthor(){
        console.log('添加')
        if(this.seriesAuthor.length>=3){
          this.$message.error('丛书作者最多可填写三个');
          return
        }
        this.seriesAuthor=[...this.seriesAuthor,{value:''}];

      },
      /*一审*/
      firstInsFn(){
        auditAssignAPI({
          ids: [this.imgForm.id],
          auditor:this.firstInstance.userId,
          auditorName:this.firstInstance.userName,
          nextStage:this.peopleStatus[Number(this.type)],
        }).then(res=>{
          if(res.data.status){
            this.$message.success('保存成功');
            this.$router.go(-1);
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },



    }
  }
</script>
<style lang="less" scoped>
  .newBookView{
    .el-form-item.width360{
      width: 45%;
      display: inline-block;
    }
    .formbox{
      padding-left: 20px;
      background: #FFF;
      border: 1px solid #DCDFE6;
      -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
      .tabwrapper1{padding-top: 40px}
    }
  }
  .liBox{
    margin-top: 15px;
  }
  .infoImg{
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 50px;
  }

  .olist{
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    span{
      display: inline-block;
      height: 30px;
      line-height: 30px;
      color: #555;
      font-size: 16px;
      vertical-align: top;
      margin-left: 5px;
    }
  }
  .desc{
    margin-top: 8px
  }
  .newBookView .demo-ruleForm .tabwrapper1{
    .author .el-form-item__content{
      position: relative;
      .list{
        background: #fff;
        width: 100%;
        position: absolute;
        top: 43px;
        left:0;
        z-index: 111;
        border: 1px solid #E4E7ED;
        border-radius: 4px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 5px 0;
        ul{
          color: #606266;
          height:auto;
          line-height: 34px;
          margin: 6px 0;
          /*display: block;*/
          li{
            padding: 0 20px;
            display: block;
            cursor: pointer;
          }
          li:hover{
            background: #f5f7fa;
            padding: 0 20px;
          }
        }
      }
      .popper__arrow{
        position: absolute;
        top: 37px;
        z-index: 222;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: transparent transparent #EBEEF5;
      }
      .popper__arrow::after{
        content:'';
        position: absolute;
        top: -5px;
        left:-6px;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: transparent transparent #fff;
      }
    }



  }
</style>
