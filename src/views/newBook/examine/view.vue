<template>
  <div class="addImgResource newBookView xywCss">
    <div class="formbox" style="width: 90%;margin-top: 44px;">
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
                <li v-for="(item,index) in seriesList" :key="index" @click="changeSeries(item)">{{item.seriesName}}</li>
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
              <div class="tip" v-if="isAuthor.length>0&&isAuthor.filter(item=>{return item.value.length>10}).length>0">作者输入长度小于10个字符</div>
            </div>
            <i class="el-icon-circle-plus" style="font-size: 24px;margin-top: 5px;cursor: pointer" @click="addAuthor" v-if="seriesAuthor[0].value&&!vueStatus"></i>

          </el-form-item>

          <el-form-item :prop="vueStatus?'':'seriesWorkMethod'" label="丛书著作方式：" class="width360">
            <el-input v-model="imgForm.seriesWorkMethod" name="seriesWorkMethod"  :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="丛书作者：" class="width360" :prop="vueStatus?'':'seriesAuthor'">
            <el-input v-model="imgForm.seriesAuthor" name="seriesAuthor"  :disabled="vueStatus"></el-input>
          </el-form-item>

          <el-form-item :prop="vueStatus?'':'productSize'" label="成品尺寸：" class="width360">
            <el-input v-model="imgForm.productSize" name="productSize"  :disabled="vueStatus"></el-input>mm
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'wordCount'" label="字数：" class="width360">
            <el-input v-model="imgForm.wordCount" name="wordCount"  :disabled="vueStatus"></el-input>千字
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'pages'" label="页数：" class="width360">
            <el-input v-model="imgForm.pages" name="pages"  :disabled="vueStatus"></el-input>页
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'illustrations'" label="插图：" class="width360">
            <el-input v-model="imgForm.illustrations" name="illustrations" :disabled="vueStatus" align="left"></el-input>副
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'editionTimes'" label="版次：" class="width360">
            <el-input v-model="imgForm.editionTimes" name="editionTimes" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'printTimes'" label="印次：" class="width360">
            <el-input v-model="imgForm.printTimes" name="printTimes" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'editor'" label="责任编辑：" class="width360">
            <el-input v-model="imgForm.editor" name="editor" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item :prop="vueStatus?'':'phone'" label="电话：" class="width360">
            <el-input v-model="imgForm.phone" name="phone" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item prop="subjectNum" label="选题号：" class="width360">
            <el-input v-model="imgForm.subjectNum" name="subjectNum" :disabled="!!(vueStatus||imgForm.subjectNum)"></el-input>

          </el-form-item>
          <el-form-item label="相关文件：" class="uploadCss">
            <div class="pdfCss" v-if="vueStatus">{{imgForm.relatedFile?imgForm.relatedFileName:'暂无文件'}}         <span v-if="fileList.length>0" @click="downFile(imgForm.relatedFile)" style="cursor: pointer;color: #4285F4">下载</span>
            </div>
            <el-upload
              class="upload-demo uploadFileCss"
              :action="`${uploadUrl}${uploadPath}`"
              :limit="1"
              :file-list="fileList"
              :on-exceed="handleFileExceed" :before-upload="beforeFileUpload" :on-success="handleFileSuccess"  multiple  :on-remove="handleFileRemove" v-if="!vueStatus"
            >
              <el-button  :loading="uploading" type="primary">选择文件</el-button>
              <span v-if="fileList.length>0||imgForm.relatedFile" @click="downFile(imgForm.relatedFile)" style="cursor: pointer;color: #4285F4">下载</span>
            </el-upload>
            <div class="el-upload__tip" v-if="!vueStatus" >可上传文件类型包括Word、PDF，大小不超过2M</div>
          </el-form-item>
        </div>
      </el-form>



      <div class="tabwrapper1" v-if="!$route.query.editId&&(auditList.length>0||$route.query.type>=1)">
        <h6>&nbsp;&nbsp;|&nbsp;&nbsp;审核意见</h6>
        <!--auditList-->
        <el-form :model="item"
                 label-width="140px"
                 class="demo-ruleForm" v-if="auditList.length>0" v-for="(item,index) in auditList" :key="index" style="border-bottom: 1px solid #ccc;padding: 10px">
          <el-form-item prop="userName" label="审校人：" class="width3601">
            <el-input v-model="item.auditorName" disabled></el-input>
          </el-form-item>

          <el-form-item prop="dealTime" label="
处理时间：" class="width3601">
            <el-input v-model="item.dealTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="审校意见：" prop="auditOpinion">
            <el-input v-model="item.auditOpinion"  type="textarea" disabled  :rows="4" style="width:80%" resize="none"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="examine"
                 ref="examine"
                 :rules="rules"
                 label-width="140px"
                 class="demo-ruleForm" v-if="$route.query.type>=1">
          <el-form-item prop="userName" label="审校人：" class="width360">
            <el-input v-model="examine.userName" name="userName" :disabled="vueStatus&&type>$route.query.type"></el-input>
          </el-form-item>
          <el-form-item label="审校意见：" prop="auditOpinion">
            <el-input v-model="examine.auditOpinion" name="auditOpinion" type="textarea" :disabled="vueStatus&&type>$route.query.type" :rows="4" style="width:80%" resize="none"></el-input>
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




      <el-form label-width="140px" class="demo-ruleForm" v-if="!vueStatus&&imgForm.status=='2-2'">
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
        <el-form-item style="display: flex;justify-content: center" v-if="!vueStatus"><!--修改-->
          <el-button type="primary" @click="dataSubmit">保存</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>
        <el-form-item style="display: flex;justify-content: center" v-if="type>=1">
          <el-button type="primary" @click="firstInsFn(1)">通过</el-button>
          <el-button @click="firstInsFn(2)">驳回</el-button>
        </el-form-item>


      </el-form>


    </div>



  </div>
</template>
<script>

  import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js';
  import "@/styles/commonRe.css";
  import infoImg from '@/assets/img/info.jpg'
  import {getThreeDetailAPI, perfectInfoAPI, auditAssignAPI, batchAuditAPI,getAuditListAPI,getAuditSubListAPI} from '../../../api/newBook/examine';
  import {getUserListAPI,getSeriesAPI,subjectAssignAPI} from '@/api/newBook/subject';
  import Cookies from "js-cookie";
  export default {
    data() {
      return {
        uploadUrl:uploadUrl,
        uploadPath:uploadPath,
        imgForm:{
          series:'',
          subBookName:null,
          workMethod:null,
          productSize:null,
          wordCount:null,
          pages:null,
          editionTimes:null,
          printTimes:null,
          editor:null,
          phone:null,
        },
        peopleFrom:{
          userName:null,
          userId:null,
        },
        firstInstance:{
          userName:null,
          userId:null,
        },
        auditList:[],
        examine: {
          userName:'',
          auditOpinion:''
        },
        rules:{
          bookName: [{required: true, message: '请输入书名', trigger: 'change'},{max: 80, message: '书名输入长度小于80', trigger: 'change'}],
          originalAuthor: [{max: 10, message: '原著者长度小于10', trigger: 'change'}],
          seriesAuthor: [{max: 10, message: '丛书作者长度小于10', trigger: 'change'}],
          seriesWorkMethod: [{max: 10, message: '丛书著作方式长度小于10', trigger: 'change'}],
          subBookName:[{ required: true, message: '请输入副题', trigger: 'change' },{max: 80, message: '副题输入长度小于80', trigger: 'change'}],
          seriesName:[{max: 80, message: '丛书名输入长度小于80', trigger: 'change'}],
          workMethod:[{ required: true, message: '请输入著作方式', trigger: 'change' },{max: 20, message: '著作方式输入长度小于20', trigger: 'change'}],
          productSize:[{ required: true, message: '请输入成品尺寸', trigger: 'change' },{max: 20, message: '成品尺寸输入长度小于20', trigger: 'change'}],
          wordCount:[{ required: true, message: '请输入字数', trigger: 'change' },{max: 10, message: '字数输入长度小于10', trigger: 'change'}],
          pages:[{ required: true, message: '请输入页数', trigger: 'change' },{max: 10, message: '页数输入长度小于10', trigger: 'change'}],
          illustrations:[{max: 10, message: '插图输入长度小于10', trigger: 'change'}],
          editionTimes:[{ required: true, message: '请输入版次', trigger: 'change' },{max:20, message: '版次输入长度小于20个字符', trigger: 'change'}],
          printTimes:[{ required: true, message: '请输入印次', trigger: 'change' },{max:20, message: '印次输入长度小于20个字符', trigger: 'change'}],
          editor:[{ required: true, message: '请输入责任编辑', trigger: 'change' },{ max: 30, message: '责任编辑输入长度小于30个字符', trigger: 'change' }],
          phone:[{ required: true, message: '请输入电话', trigger: 'change' },{pattern:/^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change'}],
          userName: [{required: true, message: '请输入审校人', trigger: 'change'},{ max: 20, message: '审校人输入长度小于20个字符', trigger: 'change' }],
          auditOpinion: [{required: true, message: '请输入审核意见', trigger: 'change'},{ max: 100, message: '审核意见输入长度小于100个字符', trigger: 'change' }],
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
        isPeopleFrom:false,
        type:0,
      }
    },
    created(){
      if(this.$route.fullPath.indexOf('editId')>=0){
        this.$route.meta.title = '修改';
        this.vueStatus=false;
      }else if(this.$route.fullPath.indexOf('lookId'>=0)){
        if(this.$route.query.type){
          let ary=['一审','二审','三审']
          this.$route.meta.title = ary[this.$route.query.type-1]+'审核';
        }else{
          this.$route.meta.title = '查看';
        }
        this.vueStatus=true;
        this.type=this.$route.query.type;
      }else{
        this.$route.meta.title = '添加';
        this.vueStatus=false;
      }
      this.examine.userName = Cookies.get('username');
      this.examine.userId = Cookies.get('userId');
      this.getDetail();

    },
    watch:{
      seriesAuthor: {
        handler(newValue, oldValue) {

          this.isAuthor=newValue.filter((item)=>{
            return item.value!='';
          })

        },
        deep: true
      },
      'peopleFrom.userName'(n,o){
        this.isPeopleFrom=(n!=''?false:true);
        console.log(111111,this.isPeopleFrom)
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
             /*this.imgForm.productSize=this.imgForm.productSize?Number(this.imgForm.productSize):null;*/
            /*this.imgForm.wordCount=this.imgForm.wordCount?Number(this.imgForm.wordCount):null;*/
            if(res.data.data.relatedFile){
              let file={
                name:res.data.data.relatedFileName,
                url:this.uploadUrl+res.data.data.relatedFile,
              };
              this.fileList=[file];
            }
            if(this.imgForm.author){
              this.seriesAuthor=[];
              let arg=this.imgForm.author.match(/[^,]+/g);
              arg.forEach((item)=>{
                this.seriesAuthor=[...this.seriesAuthor,{value:item}];
              })
            }
            this.getUserList();
            /*if(this.$route.query.type!=1){
              this.getAuditList();
            }*/
            this.getAuditList();
            this.$refs['ruleForm'].resetFields();
          }
        })
      },
      //查审核意见
      getAuditList(){
        let API=this.$route.query.logStatus?getAuditSubListAPI:getAuditListAPI;
        let data={
          id: this.$route.query.lookId||this.$route.query.editId,
          stage: this.$route.query.status,
          status: this.$route.query.logStatus,
        };
        API(this.$route.query.logStatus?data:this.$route.query.lookId||this.$route.query.editId).then(res=>{
          this.auditList=res.data.data;
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
      //保存
      dataSubmit(){

        this.$refs['ruleForm'].validate((valid) => {
          let boo=false;
          if((this.isAuthor.length==0||!this.peopleFrom.userName||this.peopleFrom.userName=='')&&this.imgForm.status=='2-2'){
            if(!this.peopleFrom.userName||this.peopleFrom.userName==''){
              this.isPeopleFrom=true;
            }
            boo=true;
          }else if(this.isAuthor.length>0&&this.isAuthor.filter(item=>{return item.value.length>10}).length>0){
            boo=true;
          }
          if(valid&&!boo){
            this.imgForm.author='';
            this.isAuthor.forEach((item)=>{
              this.imgForm.author+=item.value+',';
            })
            this.imgForm.author=this.imgForm.author.substring(0,this.imgForm.author.length-1);
            perfectInfoAPI(this.imgForm).then(res=>{
              if(res.data.status){
                if(this.imgForm.status=='2-2'){
                  this.threeBtn();
                }else{
                  this.$router.go(-1);
                }
                this.$message.success('编辑成功');

              }else{
                this.$message.error(res.data.msg)
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
        this.fileList=[];
      },
      /*添加作者*/
      addAuthor(){
        console.log('添加')
        if(this.seriesAuthor.length>=10){
          this.$message.error('丛书作者最多可填写10个');
          return
        }
        this.seriesAuthor=[...this.seriesAuthor,{value:''}];

      },
      /*一审*/
      firstInsFn(n){
        this.$refs['examine'].validate((valid) => {
          if(valid){
            batchAuditAPI({
              auditOpinion: this.examine.auditOpinion,
              currentStage: this.imgForm.status,
              ids: [this.$route.query.lookId],
              status:n,
              userId: this.examine.userId,
              userName: this.examine.userName
            }).then(res=>{
              if(res.data.status){
                this.$message.success('审核成功');
                this.$router.go(-1);
              }else{
                this.$message.error(res.data.msg);
              }
            })
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
    .el-form-item.width3601{
      /*width: 45%;*/
      /*display: inline-block;*/
      .el-form-item__content .el-input input{
        width: 45%;
      }
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
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
