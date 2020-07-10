<template>
  <!--审核毛书-->
  <div class="addImgResource newBookView">
    <div class="formbox1">
      <el-form
        :model="step2Form"
        ref="step2Form"
        label-width="140px"
        class="demo-ruleForm"
      ><!--:rules="rules"-->
        <!--责任意见-->
        <div class="tabwrapper1" v-for="(item,index) in dataList" :key="index" v-if="dataList.length>0">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;{{stages[index].title}}：</h6>
          <el-form-item :label="`${stages[index].name}：`" class="width360">
            <el-input v-model="item.auditorName" name="auditorName" disabled></el-input>
          </el-form-item>
          <el-form-item label="处理时间：" class="width360">
            <el-date-picker
              v-model="item.dealTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="样书照片：" class="dutyEditor" v-if="item.bookImage&&index==1">
            <img :src="`${uploadUrl}?fileName=${item.bookImage}&isOnLine=true`" class="avatar-uploader-icon" style="width: 178px; height: 178px;border: 1px dashed #d9d9d9;border-radius: 6px;">
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="item.remark" name="remark" disabled type="textarea" :rows="4" maxlength="100" style="width: 80%" resize="none"></el-input>
          </el-form-item>
        </div>
        <!--出版意见-->
        <div class="tabwrapper1" v-if="dataList.length<2&&!vueStatus">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;{{stages[dataList.length].title}}</h6>
          <el-form-item prop="auditorName" :label="`${stages[dataList.length].name}：`" class="width360" :rules="[{ required: true, message: `请输入${stages[dataList.length].name}`, trigger: 'change' },{ max: 20, message: `${stages[dataList.length].name}长度小于20`, trigger: 'change'}]">
            <el-input v-model="step2Form.auditorName" name="auditorName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item prop="dealTime" label="处理时间：" class="width360" :rules="[{ required: true, message: `请选择处理时间`, trigger: 'change' }]">
            <el-date-picker
              v-model="step2Form.dealTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="bookImage" label="样书照片：" class="dutyEditor" :rules="[{ required: true, message: `请上传样书照片`, trigger: 'change' }]" v-if="dataList.length>0">
            <el-upload class="avatar-uploader"
                       :action="`${uploadUrl}/upload/info`" :show-file-list="false" :on-remove="handleRemove" :on-success="handlePicSuccess" :before-upload="beforePicUpload">
              <img :src="`${uploadUrl}?fileName=${step2Form.bookImage}&isOnLine=true`" v-if="step2Form.bookImage"
                   class="avatar" style="width: 178px;height:178px;object:fit;">
              <!--<img src="../../../../assets/img/entry/addImg.png"
                   v-if="($route.query.examineId||$route.query.lookId)&&!step2Form.bookImage" class="avatar-uploader-icon"
                   style="width: 100%; height: 100%;">-->
              <div class="addImg" v-if="!vueStatus&&!$route.query.editId&&!step2Form.bookImage">
                <img src="../../../../assets/img/entry/addImg.png">
              </div>
              <div class="deleteImg" v-if="!vueStatus&&!$route.query.lookId&&step2Form.bookImage"
                   @click.stop="deleteIMG">
                <i class="el-icon-close"></i>
              </div>
            </el-upload>
            <span class="tip" style="color: #CCCCCC">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、gif格式，不超过2M</span>
          </el-form-item>
          <el-form-item prop="remark" label="备注：" :rules="[{ required: true, message: `请输入备注`, trigger: 'change' },{ max: 100, message: `备注长度小于100`, trigger: 'change'}]">
            <el-input v-model="step2Form.remark" name="remark" :disabled="vueStatus" type="textarea" :rows="4" maxlength="100" style="width: 80%" resize="none"></el-input>
          </el-form-item>
        </div>

        <div class="tabwrapper2" v-if="dataList.length<2&&!vueStatus">
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
  import "@/styles/commonRe.css";
  import {saveAuditAPI} from '@/api/newBook/printing';
  import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js';
  import Cookies from "js-cookie";

  export default {
    name: 'HelloWorld',
    props: ['step2Data'],
    data() {
      return {
        uploadUrl: uploadUrl,
        uploadPath: uploadPath,
        step2Form: {
          bookImage:'',
          auditorName:'',
        },
        dataList: [],
        vueStatus: false,
        stages:[
          {title:'责编意见',stage:'7-2-1-1',name:'责任编辑'},
          {title:'出版意见',stage:'7-2-1-2',name:'处理人'}
        ],
      }
    },
    created() {
      if (this.$route.fullPath.indexOf('lookId') >= 0) {
        this.vueStatus = true;
      }
      this.dataList = this.step2Data || [];
      this.step2Form.auditorName = Cookies.get('username');
      this.step2Form.auditor = Cookies.get('userId');
      this.getTime();
    },
    watch: {
      step2Data(n, o) {
        this.dataList = n||[];
      },
    },
    methods: {
      getTime(){
        var myDate = new Date();
        this.step2Form.dealTime = myDate.getFullYear()+'-'+(myDate.getMonth()<9?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1))+'-'+(myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate());
      },
      dataSubmit() {
        this.$refs['step2Form'].validate((valid) => {
          if (valid) {
            this.getTime();
            this.step2Form.bookType = this.$route.name=='secondEdition'?'2':'1';
            this.step2Form.fatherStage = '7-2';
            this.step2Form.id = this.$route.query.lookId||this.$route.query.examineId;
            this.step2Form.stage = this.stages[this.dataList.length].stage;

            this.$emit('examineFn',this.step2Form);
          }
        })
      },
      beforePicUpload(file) {
        const isJPG = file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG/JPEG/PNG/GIF 格式!');
          return isJPG
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return isLt2M
        }
        this.$message.warning('上传中');
      },
      handlePicSuccess(response, file, fileList) {
        console.log('上传成功',response);
        this.$message.success('上传成功');
        this.$set(this.step2Form,'bookImage',response.data.fileName);
        this.$refs.step2Form.validateField('bookImage');
        /*this.step2Form.bookImage = response.data.fileName;*/
      },

      handleRemove() { // 图片删除
        this.step2Form.bookImage = '';
        this.$refs.step2Form.validateField('bookImage');
        /*this.$refs['step2Form'].validate();*/
      },
      deleteIMG(){
        this.step2Form.bookImage = '';
        this.$refs.step2Form.validateField('bookImage');
        /*this.$refs['step2Form'].validate();*/
      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .newBookView {
    .el-form-item.width360 {
      width: 45%;
      display: inline-block;
    }

    .formbox1 {
      width: 100%;

      .tabwrapper1 {
        padding-top: 40px;

        .steps {
          width: 100%;
          display: flex;
          justify-content: center;

          ul {
            display: flex;
            position: relative;
            z-index: 0;
            background: #fff;
            width: 400px;
            justify-content: space-between;

            li {
              width: 70px;
              height: 70px;
              line-height: 70px;
              text-align: center;
              font-size: 13px;
              color: #008000;
              border: 1px solid #008000;
              border-radius: 50%;
              background: #fff;
              z-index: 11;
              cursor: pointer;
            }
          }

          ul:after {
            content: " ";
            border-top: 1px solid #ccc;
            width: 100%;
            position: absolute;
            top: 35px;
            left: 0;
            z-index: 0;
          }
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
</style>
