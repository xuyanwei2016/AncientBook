<template>
  <!--封面设计查看-->
  <div class="addImgResource coverView xywCss">
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
          <el-form-item label="书名:" :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'bookName':''" class="width360">
            <el-input v-model="imgForm.bookName" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'seriesName':''" class="width360 author" label="丛书名:">
            <el-input v-model="imgForm.seriesName" name="seriesName" :disabled="vueStatus||imgForm.stage=='6-5'"
                      @input="getSeries"></el-input>
            <div class="list" v-if="isSeries">
              <ul>
                <li v-for="(item,index) in seriesList" :key="index" @click="changeSeries(item)">{{item.seriesName}}</li>
              </ul>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 35px;" v-if="isSeries"></div>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'isbn':''" class="width360" label="书号:">
            <el-input v-model="imgForm.isbn" name="isbn" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
          </el-form-item>

          <!--<el-form-item prop="subjectNum" class="width360" label="选题号:">
            <el-input v-model="imgForm.subjectNum" name="author" :disabled="vueStatus"></el-input>
          </el-form-item>-->
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'author':''" class="width360" label="著译者:">
            <el-input v-model="imgForm.author" name="author" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'editor':''" class="width360" label="责任编辑:">
            <el-input v-model="imgForm.editor" name="editor" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'paperSize':''" class="width360" label="用纸尺寸:">
            <el-input v-model="imgForm.paperSize" name="paperSize" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'format':''" class="width360" label="开本:">
            <el-input v-model="imgForm.format" name="format" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'framing':''" class="width360" label="装帧方式:">
            <el-input v-model="imgForm.framing" name="framing" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'printedColors':''" class="width360" label="印刷色数:">
            <el-input v-model="imgForm.printedColors" name="printedColors" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
          </el-form-item>

          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'categories':''" class="width360 time100" label="分类:">
            <el-input v-model="imgForm.categories" name="categories" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
            <!--<el-select v-model="imgForm.categories" placeholder="请选择" :disabled="vueStatus">
              <el-option label="请选择" :value="null"></el-option>
              <el-option
                v-for="(item,ind) in peopleList"
                :key="ind"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'printingHouse':''" class="width360" label="排印厂：">
            <el-input v-model="imgForm.printingHouse" name="printingHouse" :disabled="vueStatus||imgForm.stage=='6-5'"></el-input>
          </el-form-item>

          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'processRequirements':''" label="工艺要求：">
            <el-input v-model="imgForm.processRequirements" name="processRequirements" :disabled="vueStatus||imgForm.stage=='6-5'"
                      type="textarea" resize="none" :rows="3" maxlength="100" style="width: 89%"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'designRequirements':''" label="设计要求：">
            <el-input v-model="imgForm.designRequirements" name="designRequirements" :disabled="vueStatus||imgForm.stage=='6-5'"
                      type="textarea" resize="none" :rows="3" maxlength="100" style="width: 89%"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'coverPaper':''" label="封面用纸：">
            <el-input v-model="imgForm.coverPaper" name="coverPaper" :disabled="vueStatus||imgForm.stage=='6-5'" type="textarea" resize="none"
                      :rows="3" maxlength="100" style="width: 89%"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'mainBodyPaper':''" label="正文用纸：">
            <el-input v-model="imgForm.mainBodyPaper" name="mainBodyPaper" :disabled="vueStatus||imgForm.stage=='6-5'" type="textarea"
                      resize="none" :rows="3" maxlength="100" style="width: 89%"></el-input>
          </el-form-item>
          <el-form-item :prop="(imgForm.stage=='6-1'||imgForm.stage=='6-2'||addShow)?'remark':''" label="备注：">
            <el-input v-model="imgForm.remark" name="remark" :disabled="vueStatus||imgForm.stage=='6-5'" type="textarea" resize="none"
                      :rows="3" maxlength="100" style="width: 89%"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper1" v-if="imgForm.stage=='6-5'||(imgForm.stage=='6-2'&&!vueStatus)||(imgForm.stage=='6-3'&&vueStatus)">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;审核意见</h6>
          <el-form-item label="审核人:"  class="width360"><!--:prop="imgForm.stage=='6-2'?'auditorName':''"-->
            <el-input v-model="imgForm.auditorName" disabled></el-input><!--vueStatus||imgForm.stage=='6-5'-->
          </el-form-item>
        </div>
        <div class="tabwrapper1" v-if="imgForm.stage=='6-5'">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;封面文件</h6>
          <el-form-item label="相关文件：" :prop="imgForm.stage=='6-5'&&'relatedFile'">

            <div v-if="imgForm.stage=='6-5'&&!imgForm.relatedFile&&vueStatus">暂无文件</div>
            <el-upload class="avatar-uploader"
                       :action="`${uploadUrl}/upload/info`" :show-file-list="false" :on-remove="handleRemove"
                       :on-success="handlePicSuccess" :before-upload="beforePicUpload">
              <img :src="`${uploadUrl}?fileName=${imgForm.relatedFile}&isOnLine=true`" v-if="imgForm.relatedFile"
                   class="avatar" style="width: 178px;height:178px;object:fit;border:dashed 1px #ccc">
             <!-- <img src="../../../assets/img/bookDefault.png" v-if="($route.query.editId||$route.query.lookId)&&!imgForm.relatedFile" class="avatar-uploader-icon" style="width: 100%; height: 100%;">-->
              <!--{{!vueStatus&&$route.query.editId&&!imgForm.relatedFile}}-->
              <div class="addImg" v-if="!vueStatus&&$route.query.editId&&!imgForm.relatedFile">
                <img src="../../../assets/img/entry/addImg.png">
              </div>
              <div class="deleteImg" v-if="!vueStatus&&!$route.query.lookId&&imgForm.relatedFile" @click.stop="deleteIMG">
                <i class="el-icon-close"></i>
              </div>
            </el-upload>
            <span class="tip" style="margin-left: 0; color: #ccc" v-if="!vueStatus">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、gif格式，不超过2M</span>
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
  import {getSeriesAPI} from '@/api/newBook/subject';
  import {saveAPI,updateAPI,getDetailAPI} from '@/api/newBook/cover.js';
  import Cookies from "js-cookie";

  export default {
    data() {
      return {
        uploadUrl: uploadUrl,
        uploadPath: uploadPath,
        imgForm: {
          relatedFile:'',
          stage:'6-1'
        },
        vueStatus: false,
        peopleList: [
          {name: '待完善', code: 0},
          {name: '待分配', code: 0},
          {name: '待一审', code: 0},
          {name: '待二审', code: 0},
          {name: '待三审', code: 0},
          {name: '审核未通过', code: 0},
          {name: '审核通过', code: 0},
        ],
        isSeries: false,
        seriesList: [],
        addShow:false,

        rules: {
          bookName: [{required: true, message: '请输入书名', trigger: 'change'}, {
            max: 80,
            message: '书名输入长度小于80',
            trigger: 'change'
          }],
          isbn: [{
            max: 20,
            message: '书号输入长度小于20',
            trigger: 'change'
          }],
          seriesName: [{required: true, message: '请输入丛书名', trigger: 'change'}, {
            max: 80,
            message: '丛书名输入长度小于80',
            trigger: 'change'
          }],
          author: [{required: true, message: '请输入著译者', trigger: 'change'}, {
            max: 10,
            message: '著译者输入长度小于10',
            trigger: 'change'
          }],
          editor: [{required: true, message: '请输入责任编辑', trigger: 'change'}, {
            max: 30,
            message: '责任编辑输入长度小于30',
            trigger: 'change'
          }],
          paperSize: [{required: true, message: '请输入用纸尺寸', trigger: 'change'}, {
            max: 10,
            message: '用纸尺寸输入长度小于10',
            trigger: 'change'
          }],
          format: [{required: true, message: '请输入开本', trigger: 'change'}, {
            max: 10,
            message: '开本输入长度小于10',
            trigger: 'change'
          }],
          framing: [{required: true, message: '请输入装帧方式', trigger: 'change'}, {
            max: 10,
            message: '装帧方式输入长度小于10',
            trigger: 'change'
          }],
          printedColors: [{required: true, message: '请输入印刷色数', trigger: 'change'}, {
            max: 10,
            message: '印刷色数输入长度小于10',
            trigger: 'change'
          }],
          categories:[{
            max: 10,
            message: '分类输入长度小于10',
            trigger: 'change'
          }],
          printingHouse: [{required: true, message: '请输入排印厂', trigger: 'change'},{
            max: 20,
            message: '排印厂输入长度小于20',
            trigger: 'change'
          }],
          subheading: [{required: true, message: '请输入副题', trigger: 'change'},],
          processRequirements: [{required: true, message: '请输入工艺要求', trigger: 'change'}, {
            max: 100,
            message: '输入的内容不得超过100个字符',
            trigger: 'change'
          },],
          designRequirements: [{required: true, message: '请输入设计要求', trigger: 'change'}, {
            max: 100,
            message: '输入的内容不得超过100个字符',
            trigger: 'change'
          },],
          coverPaper: [{max: 100, message: '输入的内容不得超过100个字符', trigger: 'change'},],
          mainBodyPaper: [{max: 100, message: '输入的内容不得超过100个字符', trigger: 'change'},],
          remark: [{max: 100, message: '输入的内容不得超过100个字符', trigger: 'change'},],
          auditorName: [{required: true, message: '请输入审核人', trigger: 'change'}, {max: 20, message: '输入的内容不得超过20个字符', trigger: 'change'},],
          relatedFile: [{required: true, message: '请选择相关文件', trigger: 'change'},],
        },
      }
    },

    created() {

      if (this.$route.fullPath.indexOf('editId') >= 0) {
        this.$route.meta.title = '修改封面';
        this.vueStatus = false;
        this.addShow = false;
        this.getDetail();
      } else if (this.$route.fullPath.indexOf('lookId') >= 0) {
        this.$route.meta.title = '查看封面';
        this.vueStatus = true;
        this.addShow = false;
        this.getDetail();
      } else {
        this.$route.meta.title = '添加封面';
        this.vueStatus = false;
        this.addShow = true;
      }

    },
    methods: {
      /*保存*/
      dataSubmit() {
        console.log(11111,this.imgForm.relatedFileName)
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            let API=this.$route.query.editId?updateAPI:saveAPI;
            API(this.imgForm).then(res => {
              if (res.data.status) {
                this.$message.success(`${this.$route.query.editId?'修改成功':'添加成功'}`);
                this.$router.push('/newBook/cover');
              }else{
                this.$message.error(res.data.msg);
              }
            })
          }
        })
      },
      uploadImg(img){
        console.log('子传父',img)
        this.imgForm.relatedFile=img.relatedFile;
        this.imgForm.relatedFileName=img.relatedFileName;
      },
      /*详情*/
      getDetail(){
        getDetailAPI(this.$route.query.lookId||this.$route.query.editId).then(res=>{
          if(res.data.status){
            this.imgForm=res.data.data;
            if(this.imgForm.stage=='6-2'&&!this.imgForm.auditorName){
              this.imgForm.auditorName = Cookies.get('username')||'';
              this.imgForm.auditor = Cookies.get('userId');

            }
            this.$refs.ruleForm.resetFields();
          }
        })
      },
      /*丛书名*/
      getSeries() {
        if (this.imgForm.seriesName.trim() == '') {
          this.isSeries = false;
          return
        }
        getSeriesAPI({name: this.imgForm.seriesName}).then(res => {
          if (res.data.status) {
            this.seriesList = res.data.data;
            this.isSeries = res.data.data.length > 0 ? true : false;
          }
        })
      },
      changeSeries(item) {
        this.imgForm.seriesName = item.seriesName;
        this.imgForm.seriesId = item.id;
        this.isSeries = false;
      },
//图片
      beforePicUpload(file) {
        const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif';/*|| file.type == 'image/gif'*/
        console.log(111111, file)
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/JPEG/PNG/GIF 格式!');
          return isJPG
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return isLt2M
        }
        /*this.uploading = true*/
        this.$message.warning('上传中');
      },
      handlePicSuccess(response, file, fileList) {
        /*this.uploading = false*/
        this.$message.success('上传成功');
        this.$set(this.imgForm,'relatedFile',response.data.fileName);
        this.$set(this.imgForm,'relatedFileName',file.name);
        this.$refs.ruleForm.validateField('relatedFile');
      },
      handlePicPreview(file) { // 图片预览

      },
      handleRemove() { // 图片删除
        this.imgForm.relatedFile='';
        this.imgForm.relatedFileName='';
        this.$refs.ruleForm.validateField('relatedFile');
      },
      deleteIMG(){
        this.imgForm.relatedFile = '';
        this.imgForm.relatedFileName = '';
        this.$refs.ruleForm.validateField('relatedFile');
      },
    }
  }
</script>

<style lang="less" scoped>
  .coverView {
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

        .tablelist {
          padding-top: 10px;
        }
      }
    }

    .author .el-form-item__content {
      position: relative;

      .list {
        background: #fff;
        width: 100%;
        position: absolute;
        top: 43px;
        left: 0;
        z-index: 111;
        border: 1px solid #E4E7ED;
        border-radius: 4px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 5px 0;

        ul {
          color: #606266;
          height: auto;
          line-height: 34px;
          margin: 6px 0;
          /*display: block;*/

          li {
            padding: 0 20px;
            display: block;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          li:hover {
            background: #f5f7fa;
            padding: 0 20px;
          }
        }
      }

      .popper__arrow {
        position: absolute;
        top: 37px;
        z-index: 222;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: transparent transparent #EBEEF5;
      }

      .popper__arrow::after {
        content: '';
        position: absolute;
        top: -5px;
        left: -6px;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: transparent transparent #fff;
      }
    }
    .addImg {
      background-color: #fbfdff;
      /*border: 1px dashed #c0ccda;*/
      border-radius: 6px;
      width: 140px;
      height: 140px;
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 30px;
        height: 30px;
      }
    }
    .deleteImg{
      font-size:20px;
      background: #000;
      color: #fff;
      width: 25px;
      height: 25px;
      line-height: 25px;
      position: absolute;
      top: 0;
      left: 150px;
      border-radius: 3px;
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
