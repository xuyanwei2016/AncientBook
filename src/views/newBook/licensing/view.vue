<template>
  <div class="addImgResource licensingView xywCss">
    <div class="formbox">
      <el-form
        :model="imgForm"
        ref="ruleForm"
        :rules="vueStatus?null:rules"
        label-width="140px"
        class="demo-ruleForm"
      >
        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>

          <el-form-item label="书名:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'bookName':''"  class="width360">
          <el-input v-model="imgForm.bookName" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
        </el-form-item>
          <el-form-item label="丛书名:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'seriesName':''"  class="width360 author">
            <el-input v-model="imgForm.seriesName" :disabled="vueStatus||imgForm.stage=='5-5'"  @input="getSeries"></el-input>
            <div class="list" v-if="isSeries">
              <ul>
                <li v-for="(item,index) in seriesList" :key="index" @click="changeSeries(item)">{{item.seriesName}}</li>
              </ul>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 35px;" v-if="isSeries"></div>
          </el-form-item>
          <el-form-item label="书号:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'isbn':''"  class="width360">
            <el-input v-model="imgForm.isbn" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <!--<el-form-item label="选题号:"  class="width360">
            <el-input v-model="imgForm.subheading" :disabled="vueStatus"></el-input>
          </el-form-item>-->
          <!--<el-form-item label="选题号:" prop="subjectNum"  class="width360">
            <el-input v-model="imgForm.subjectNum" :disabled="vueStatus||Boolean($route.query.editId)"></el-input>
          </el-form-item>-->
          <el-form-item label="著译者:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'author':''"  class="width360">
            <el-input v-model="imgForm.author" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="责任编辑:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'editor':''"  class="width360">
            <el-input v-model="imgForm.editor" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="字数（千字）:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'wordCount':''"  class="width360">
            <el-input v-model="imgForm.wordCount" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="原稿页数:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'pages':''"  class="width360">
            <el-input v-model="imgForm.pages" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="开本尺寸:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'formatSize':''"  class="width360">
            <el-input v-model="imgForm.formatSize" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="成品尺寸:"  class="width360" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'productSize':''">
            <el-input v-model="imgForm.productSize" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="正文字体:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'mainBodyFont':''"  class="width360">
            <el-input v-model="imgForm.mainBodyFont" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="字号:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'fontSize':''"  class="width360">
            <el-input v-model="imgForm.fontSize" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="行（每面）:"  class="width360" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'row':''">
            <el-input v-model="imgForm.row" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="字（每行）:"  class="width360" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'word':''">
            <el-input v-model="imgForm.word" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="装帧方式:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'bindingMethod':''"  class="width360">
            <el-input v-model="imgForm.bindingMethod" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="印刷色数:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'printingColor':''"  class="width360">
            <el-input v-model="imgForm.printingColor" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="排印厂:"  class="width360" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'factory':''">
            <el-input v-model="imgForm.factory" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="其他要求:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'otherClaim':''">
            <el-input v-model="imgForm.otherClaim" name="otherClaim" :disabled="vueStatus||imgForm.stage=='5-5'" type="textarea" resize="none" :rows="3" maxlength="100" style="width: 89%"></el-input>
          </el-form-item>
          <el-form-item label="正文用纸:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'mainBodyPaper':''">
            <el-input v-model="imgForm.mainBodyPaper" name="mainBodyPaper" :disabled="vueStatus||imgForm.stage=='5-5'" type="textarea" resize="none" :rows="3" maxlength="100" style="width: 89%"></el-input>
          </el-form-item>
          <!--manuscriptForm (string, optional): 稿件形式：电子稿，录入稿，公式多，表格多 ,-->
          <el-form-item label="稿件形式:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'manuscriptForm':''">
            <el-checkbox-group v-model="imgForm.manuscriptForm"  :disabled="vueStatus||imgForm.stage=='5-5'">
              <el-checkbox label="0">电子稿</el-checkbox>
              <el-checkbox label="1">录入稿</el-checkbox>
              <el-checkbox label="2">公式多</el-checkbox>
              <el-checkbox label="3">表格多</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="图（数量）:"  class="width360" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'imageCount':''">
            <el-input v-model="imgForm.imageCount" :disabled="vueStatus||imgForm.stage=='5-5'"></el-input>
          </el-form-item>
          <el-form-item label="备注:" :prop="(imgForm.stage=='5-1'||imgForm.stage=='5-2'||addShow)?'remark':''">
            <el-input v-model="imgForm.remark" name="language" :disabled="vueStatus||imgForm.stage=='5-5'" type="textarea" resize="none" :rows="3" maxlength="100" style="width: 89%"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper1" v-if="imgForm.stage=='5-5'||imgForm.stage=='5-3'||(imgForm.stage=='5-2'&&!vueStatus)">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;审核意见</h6>
          <el-form-item label="审核人:"   class="width360"><!--:prop="imgForm.stage=='5-2'?'auditorName':''"-->
            <el-input v-model="imgForm.auditorName" disabled></el-input><!--:disabled="vueStatus||imgForm.stage=='5-5'"-->
          </el-form-item>
        </div>
        <div class="tabwrapper1" v-if="imgForm.stage=='5-5'">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;排版文件</h6>

          <el-form-item label="相关文件：" :prop="imgForm.stage=='5-5'&&'relatedFile'">
            <div class="pdfCss" v-if="vueStatus">
              {{imgForm.relatedFile?imgForm.relatedFileName:'暂无文件'}}
              <span v-if="fileList.length>0" @click="downFile(imgForm.relatedFile)" style="cursor: pointer;color: #4285F4">下载</span>
            </div>
            <el-upload class="upload-demo uploadFileCss" :action="`${uploadUrl}${uploadPath}`" :on-exceed="handleFileExceed" :before-upload="beforeFileUpload" :limit="1" :on-success="handleFileSuccess"  multiple  :on-remove="handleFileRemove" :file-list="fileList" v-if="!vueStatus" accept="image/*,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf"
            >
              <el-button :loading="uploading" type="primary">选择文件</el-button>
              <span v-if="imgForm.relatedFile" @click="downFile(imgForm.relatedFile)" style="cursor: pointer;color: #4285F4">下载</span>
              <!--<span>{{resourceForm.pdf_zh}}</span>-->
            </el-upload>
            <div class="el-upload__tip" v-if="!vueStatus">可上传文件类型包括Word、PDF、Excel、图片</div>
          </el-form-item>
        </div>
        <div class="tabwrapper1" v-if="!vueStatus">
          <el-form-item align="center" style="margin-right: 140px">
            <el-button type="primary" @click="dataSubmit">保存</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js';
  import "@/styles/commonRe.css";
  import {getDetailAPI,saveAPI,updateAPI} from '@/api/newBook/licensing';
  import {getSeriesAPI} from '@/api/newBook/subject';
  import Cookies from "js-cookie";
    export default {
        data() {
            return {
              uploadUrl: uploadUrl,
              uploadPath: uploadPath,
              imgForm:{
                manuscriptForm:[],
                relatedFile:'',
                stage:'5-1'
              },
              uploading:false,
              seriesList:[],
              fileList:[],
              isSeries:false,
              vueStatus:false,
              addShow:false,
              rules: {
                bookName: [{required: true, message: '请输入书名', trigger: 'change'},{max: 80, message: '书名输入长度小于80', trigger: 'change'}],
                seriesName: [{required: true, message: '请输入丛书名', trigger: 'change'},{max: 80, message: '丛书名输入长度小于80', trigger: 'change'}],
                isbn: [{
                  max: 20,
                  message: '书号输入长度小于20',
                  trigger: 'change'
                }],
                subjectNum: [{required: true, message: '请输入选题号', trigger: 'change'},],
                author: [{required: true, message: '请输入著译者', trigger: 'change'},{max: 10, message: '著译者输入长度小于10', trigger: 'change'}],
                wordCount: [{required: true, message: '请输入字数', trigger: 'change'},{max: 10, message: '字数输入长度小于10', trigger: 'change'}],
                formatSize: [{required: true, message: '请输入开本尺寸', trigger: 'change'},{max: 10, message: '开本尺寸输入长度小于10', trigger: 'change'}],/*{pattern: /^[1-9]\d*$/, message: '请输入大于零的数字', trigger: 'change'}*/
                productSize:[{max: 20, message: '成品尺寸输入长度小于20', trigger: 'change'}],
                mainBodyFont: [{required: true, message: '请输入正文字体', trigger: 'change'},{max: 10, message: '正文字体输入长度小于10', trigger: 'change'}],
                fontSize: [{required: true, message: '请输入字号', trigger: 'change'},{max: 10, message: '字号输入长度小于10', trigger: 'change'}],
                row:[{max: 10, message: '行输入长度小于10', trigger: 'change'}],
                word:[{max: 10, message: '字输入长度小于10', trigger: 'change'}],
                bindingMethod: [{required: true, message: '请输入装帧方式', trigger: 'change'},{max: 10, message: '装帧方式输入长度小于10', trigger: 'change'}],
                printingColor: [{required: true, message: '请输入印刷色数', trigger: 'change'},{max: 10, message: '印刷色数输入长度小于10', trigger: 'change'}],
                factory:[{max: 20, message: '排印厂输入长度小于20', trigger: 'change'}],
                editor: [{required: true, message: '请输入责任编辑', trigger: 'change'},{max: 30, message: '责任编辑输入长度小于30', trigger: 'change'}],
                pages:[{max: 10, message: '原稿页数输入长度小于10', trigger: 'change'}],
                manuscriptForm: [{required: true, message: '请选择稿件形式', trigger: 'change'},],
                imageCount: [{required: true, message: '请输入图的数量', trigger: 'change'},{max: 10, message: '图的数量输入长度小于10', trigger: 'change'}],
                userName: [{required: true, message: '请输入审核人', trigger: 'change'}],
                otherClaim:[{max: 100, message: '其他要求输入长度小于100', trigger: 'change'}],
                mainBodyPaper:[{max: 100, message: '正文用纸输入长度小于100', trigger: 'change'}],
                remark:[{max: 100, message: '备注输入长度小于100', trigger: 'change'}],
                auditorName: [{required: true, message: '请输入审核人', trigger: 'change'}, {max: 20, message: '输入的内容不得超过20个字符', trigger: 'change'},],
                relatedFile: [{required: true, message: '请选择相关文件', trigger: 'change'},],
              },
            }
        },
      created(){
        if (this.$route.fullPath.indexOf('editId') >= 0) {
          this.$route.meta.title = '修改发排';
          this.vueStatus = false;
          this.addShow = false;
          this.getDetail();
        } else if (this.$route.fullPath.indexOf('lookId' )>= 0) {
          this.$route.meta.title = '查看发排';
          this.vueStatus = true;
          this.addShow = false;
          this.getDetail();
        } else {
          this.$route.meta.title = '添加发排';
          this.vueStatus = false;
          this.addShow = true;
        }
        /*this.imgForm.userName = Cookies.get('username');*/
      },
        components: {},
        methods: {
        /*保存*/
          dataSubmit(){
            let manuscriptForm='';
            if(this.imgForm.manuscriptForm&&this.imgForm.manuscriptForm.length>0&&typeof this.imgForm.manuscriptForm!='string'){
              this.imgForm.manuscriptForm.forEach((item)=>{
                manuscriptForm+=item+',';
              })
              manuscriptForm=manuscriptForm.substring(0,manuscriptForm.length-1);
            }

            this.$refs['ruleForm'].validate((valid) => {
              if(valid){
                this.imgForm.manuscriptForm=manuscriptForm;
                let API=this.$route.query.editId?updateAPI:saveAPI;
                API(this.imgForm).then(res=>{
                  if(res.data.status){
                    this.$message.success(`${this.$route.query.editId?'修改成功':'添加成功'}`);
                    this.$router.push('/newBook/licensing');
                  }else{
                    this.$message.error(res.data.msg);
                  }
                })
              }
            })

          },
          /*详情*/
          getDetail(){
            this.fileList=[];
            getDetailAPI(this.$route.query.lookId||this.$route.query.editId).then(res=>{
              if(res.data.status){
                this.imgForm=res.data.data;
                this.imgForm.manuscriptForm=this.imgForm.manuscriptFormReturn;
                if(this.imgForm.stage=='5-2'){
                  this.imgForm.auditorName = Cookies.get('username')||'';
                  this.imgForm.auditor = Cookies.get('userId');
                }
                this.$set(this.imgForm,'userName',Cookies.get('username'));
                this.$refs['ruleForm'].resetFields();
                if(!this.imgForm.manuscriptForm||this.imgForm.manuscriptForm==''){
                  this.imgForm.manuscriptForm=[];

                }
                if(res.data.data.relatedFile){
                  let file={
                    name:res.data.data.relatedFileName,
                    url:this.uploadUrl+res.data.data.relatedFile,
                  };
                  this.fileList=[file];
                }
              }
            })
          },

          /*丛书名*/
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
          /*下载*/
          downFile(url){
            let openUrl=`${process.env.BASE_API}/file/file/download/${url}`;
            window.open(openUrl);
          },
          handleFileExceed(files, fileList) {
            this.$message.warning(`单次上传最多1个文件`);
          },
          beforeFileUpload(){
            this.uploading = true;
          },
          handleFileSuccess(response, file, fileList) {
            console.log(11222,response, file)
            this.imgForm.relatedFile = response;
            this.imgForm.relatedFileName=file.name;
            /*if(response){
              let fileOne={
                name:response,
                url:this.uploadUrl+file.name,
              };
              this.fileList=[fileOne];
            }*/
            this.uploading=false;
            this.$refs.ruleForm.validateField('relatedFile');

          },
          handleFileRemove() {//删除pdf
            this.imgForm.relatedFile='';
            this.imgForm.relatedFileName='';
            this.fileList=[];
            this.$refs.ruleForm.validateField('relatedFile');
          },
        }
    }
</script>

<style lang="less" scoped>
  .licensingView {
    .el-form-item.width360 {
      width: 45%;
      display: inline-block;
    }
    .formbox {
      padding-left: 20px;
      background: #FFF;
      border: 1px solid #DCDFE6;
      -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      .tabwrapper1 {
        padding-top: 40px
      }
      .tabwrapper2 {
        width: 95%;
        padding-top: 40px;
        padding-bottom: 10px;
        .buttons, .tablelist {
          padding-left: 20px;
        }
        .tablelist{padding-top: 10px;}
      }
    }
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

  .liBox {
    margin-top: 15px;
  }

  .infoImg {
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 50px;
  }

  .olist {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    span {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      color: #555;
      font-size: 16px;
      vertical-align: top;
      margin-left: 5px;
    }
  }

  .desc {
    margin-top: 8px
  }
</style>
