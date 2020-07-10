<template>
  <!--再版修改 查看 审核-->
    <div class="addImgResource newBookView xywCss">
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
            <el-form-item prop="bookName" label="书名（正题）:" class="width360">
              <el-input v-model="imgForm.bookName" name="bookName" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item label="书名（副题）:" prop="subBookName" class="width360">
              <el-input v-model="imgForm.subBookName" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item label="丛书名:" prop="seriesName"  class="width360 author">
              <el-input v-model="imgForm.seriesName"  @input="getSeries"  :disabled="vueStatus"></el-input>
              <div class="list" v-if="isSeries">
                <ul>
                  <li v-for="(item,index) in seriesList" :key="index" @click="changeSeries(item)">{{item.seriesName}}</li>
                </ul>
              </div>
              <div x-arrow="" class="popper__arrow" style="left: 35px;" v-if="isSeries"></div>
            </el-form-item>
            <el-form-item prop="originalAuthor" label="原著者:" class="width360">
              <el-input v-model="imgForm.originalAuthor" name="originalAuthor" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="workMethod" label="著作方式：" class="width360">
              <el-input v-model="imgForm.workMethod" name="workMethod" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="author" label="作者：" class="width360">
              <el-input v-model="imgForm.author" name="author" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="seriesWorkMethod" label="丛书著作方式：" class="width360">
              <el-input v-model="imgForm.seriesWorkMethod" name="seriesWorkMethod" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="seriesAuthor" label="丛书作者：" class="width360">
              <el-input v-model="imgForm.seriesAuthor" name="seriesAuthor" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="productSize" label="成品尺寸：" class="width360">
              <el-input v-model="imgForm.productSize" name="productSize" :disabled="vueStatus"></el-input>mm
            </el-form-item>
            <el-form-item prop="wordCount" label="字数：" class="width360">
              <el-input v-model="imgForm.wordCount" name="wordCount" :disabled="vueStatus"></el-input>千字
            </el-form-item>
            <el-form-item prop="pages" label="页数：" class="width360">
              <el-input v-model="imgForm.pages" name="pages" :disabled="vueStatus"></el-input>页
            </el-form-item>
            <el-form-item prop="illustrations" label="插图：" class="width360">
              <el-input v-model="imgForm.illustrations" name="illustrations" align="left" :disabled="vueStatus"></el-input>副
            </el-form-item>
            <el-form-item prop="editionTimes" label="版次：" class="width360">
              <el-input v-model="imgForm.editionTimes" name="editionTimes" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="printTimes" label="印次：" class="width360">
              <el-input v-model="imgForm.printTimes" name="printTimes" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="lastPrintTimes" label="上次印数：" class="width360">
              <el-input v-model="imgForm.lastPrintTimes" name="lastPrintTimes" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="lastPrice" label="上次定价：" class="width360">
              <el-input v-model="imgForm.lastPrice" name="lastPrice" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="lastIsbn" label="上版书号：" class="width360">
              <el-input v-model="imgForm.lastIsbn" name="lastIsbn" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="editor" label="责任编辑：" class="width360">
              <el-input v-model="imgForm.editor" name="editor" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="phone" label="电话：" class="width360">
              <el-input v-model="imgForm.phone" name="phone" :disabled="vueStatus"></el-input>
            </el-form-item>

          </div>
          <div class="tabwrapper1">
            <h6>&nbsp;&nbsp;|&nbsp;&nbsp;印制信息</h6>
            <el-form-item prop="isbn" label="书号：" class="width360">
              <el-input v-model="imgForm.isbn" name="isbn" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="stamp" label="印张：" class="width360">
              <el-input v-model="imgForm.stamp" name="stamp" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="framing" label="装帧：" class="width360">
              <el-input v-model="imgForm.framing" name="framing" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="price" label="定价：" class="width360">
              <el-input v-model="imgForm.price" name="price" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="coverPaper" label="封面用纸：" class="width360">
              <el-input v-model="imgForm.coverPaper" name="coverPaper" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="processRequirements" label="工艺要求：" class="width360">
              <el-input v-model="imgForm.processRequirements" name="processRequirements" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="mainBodyPaper" label="正文用纸：" class="width360">
              <el-input v-model="imgForm.mainBodyPaper" name="mainBodyPaper" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="designRequirements" label="工艺要求：" class="width360">
              <el-input v-model="imgForm.designRequirements" name="designRequirements" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="bindingOrder" label="装订顺序：">
              <el-input v-model="imgForm.bindingOrder" name="bindingOrder" type="textarea"  :disabled="vueStatus" :rows="4" style="width: 80%"  resize="none"></el-input>
            </el-form-item>
            <el-form-item prop="otherRequirements" label="其他要求：">
              <el-input v-model="imgForm.otherRequirements" name="otherRequirements" type="textarea"  :disabled="vueStatus" :rows="4" style="width: 80%"  resize="none"></el-input>
            </el-form-item>
            <el-form-item prop="deliveryStatus" label="包销（送货）情况：">
              <el-input v-model="imgForm.deliveryStatus" name="deliveryStatus" type="textarea"  :disabled="vueStatus" :rows="4" style="width: 80%"  resize="none"></el-input>
            </el-form-item>
            <el-form-item prop="printingHouse" label="印厂：" class="width360">
              <el-input v-model="imgForm.printingHouse" name="printingHouse" :disabled="vueStatus"></el-input>
            </el-form-item>
            <el-form-item prop="times" label="时间：" class="width360">
              <el-date-picker
                v-model="imgForm.times"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd" :disabled="vueStatus">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="remark" label="备注：">
              <el-input v-model="imgForm.remark" name="remark" type="textarea" :rows="4" style="width: 80%" resize="none" :disabled="vueStatus"></el-input>
            </el-form-item>

          </div>

          <div v-if="((vueStatus&&step1Data.length>0)||($route.query.examineId))&&((Number(imgForm.status)>0)||(Number(imgForm.status)==0&&imgForm.stage=='7-3'))">


            <!--印制流程-->
            <div class="tabwrapper1">
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;印制流程</h6>
              <div class="steps">
                <ul>
                  <li v-for="(step,inds) in steps" :key="inds" @click="curStep>inds&&StepFn(step)" :class="curStep>inds?'active':''">{{step.name}}</li>
                </ul>
              </div>
            </div>
            <div v-if="!isShowStep">
            <!--图书再版-->
            <div v-if="fatherStage=='7-1'">
              <stepOne :step1Data="step1Data" @examineFn="examineFn"></stepOne>
            </div>

            <!--审核毛书-->
            <div v-if="fatherStage=='7-2'">
              <stepTwo :step2Data="step2Data" @examineFn="examineFn"></stepTwo>
            </div>

            <!--图书入库-->
            <div v-if="fatherStage=='7-3'">
              <stepThree :step3Data="step3Data" @examineFn="examineFn"></stepThree>
            </div>
            </div>

            <div v-if="isShowStep">
              <!--图书再版-->
              <div v-if="isStep=='7-1'">
                <stepOne :step1Data="step1Data" @examineFn="examineFn"></stepOne>
              </div>

              <!--审核毛书-->
              <div v-if="isStep=='7-2'">
                <stepTwo :step2Data="step2Data" @examineFn="examineFn"></stepTwo>
              </div>

              <!--图书入库-->
              <div v-if="isStep=='7-3'">
                <stepThree :step3Data="step3Data" @examineFn="examineFn"></stepThree>
              </div>
            </div>

          </div>


          <div class="tabwrapper2" v-if="!vueStatus">
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

  import { uploadUrl, uploadPath, requestPath } from '@/utils/global.js';
  import "@/styles/commonRe.css";
  import infoImg from '@/assets/img/info.jpg';
  import {getSeriesAPI} from '@/api/newBook/subject';
  import {getDetailAPI, updateAPI, getLogsAPI, saveAuditAPI} from '@/api/newBook/printing';

  import stepOne from './look/step1.vue';
  import stepTwo from './look/step2.vue';
  import stepThree from './look/step3.vue';
  export default {
    data() {
      return {
        uploadUrl:uploadUrl,
        uploadPath:uploadPath,
        imgForm:{
          series:''
        },
        rules:{
          bookName: [{required: true, message: '请输入书名', trigger: 'change'},{max: 80, message: '书名输入长度小于80', trigger: 'change'}],
          subBookName: [{required: true, message: '请输入书名（副题）', trigger: 'change'},{max: 80, message: '书名（副题）输入长度小于80', trigger: 'change'}],
          seriesName:[{max: 20, message: '丛书名输入长度小于20', trigger: 'change'}],
          originalAuthor:[{max: 10, message: '原著者输入长度小于10', trigger: 'change'}],
          workMethod:[{required: true, message: '请输入著作方式', trigger: 'change'},{max: 20, message: '著作方式输入长度小于20', trigger: 'change'}],
          author:[{required: true, message: '请输入作者', trigger: 'change'},{required: true, message: '请输入作者', trigger: 'change'},{max: 10, message: '作者输入长度小于10', trigger: 'change'}],
          seriesWorkMethod:[{max: 10, message: '丛书著作方式输入长度小于10', trigger: 'change'}],
          seriesAuthor:[{max: 10, message: '丛书作者输入长度小于10', trigger: 'change'}],
          productSize:[{required: true, message: '请输入成品尺寸', trigger: 'change'},{max: 20, message: '成品尺寸输入长度小于20', trigger: 'change'}],
          wordCount:[{required: true, message: '请输入字数', trigger: 'change'},{max: 10, message: '字数输入长度小于10', trigger: 'change'}],
          pages:[{required: true, message: '请输入页数', trigger: 'change'},{max: 10, message: '页数输入长度小于10', trigger: 'change'}],
          illustrations:[{max: 10, message: '插图输入长度小于10', trigger: 'change'}],
          editionTimes:[{required: true, message: '请输入版次', trigger: 'change'},{max: 20, message: '版次输入长度小于20', trigger: 'change'}],
          printTimes:[{required: true, message: '请输入印次', trigger: 'change'},{max: 20, message: '印次输入长度小于20', trigger: 'change'}],
          lastPrintTimes:[{required: true, message: '请输入上次印数', trigger: 'change'},{max: 20, message: '上次印数输入长度小于20', trigger: 'change'}],
          lastPrice:[{required: true, message: '请输入上次定价', trigger: 'change'},{pattern:/^(([1-9]\d{0,4})(\.\d{1,2})?|0\.([1-9][0]?|\d[1-9]))$/, message: '请输入0.1-99999之间的价格，最多保留小数点后两位', trigger: 'change'}],
          lastIsbn:[{required: true, message: '请输入上版书号', trigger: 'change'},{max: 20, message: '上版书号输入长度小于20', trigger: 'change'}],
          editor:[{required: true, message: '请输入责任编辑', trigger: 'change'},{max: 30, message: '责任编辑输入长度小于30', trigger: 'change'}],
          phone:[{required: true, message: '请输入手机号', trigger: 'change'},{pattern:/^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change'},],


          isbn:[{required: true, message: '请输入书号', trigger: 'change'},{max: 20, message: '书号输入长度小于20', trigger: 'change'}],
          stamp:[{required: true, message: '请输入印张', trigger: 'change'},{max: 20, message: '印张输入长度小于20', trigger: 'change'}],
          framing:[{required: true, message: '请输入装帧', trigger: 'change'},{max: 20, message: '装帧输入长度小于20', trigger: 'change'}],
          price:[{required: true, message: '请输入定价', trigger: 'change'},{pattern:/^(([1-9]\d{0,4})(\.\d{1,2})?|0\.([1-9][0]?|\d[1-9]))$/, message: '请输入0.1-99999之间的价格，最多保留小数点后两位', trigger: 'change'}],
          coverPaper:[{required: true, message: '请输入封面用纸', trigger: 'change'},{max: 100, message: '封面用纸输入长度小于100', trigger: 'change'}],
          processRequirements:[{required: true, message: '请输入工艺要求', trigger: 'change'},{max: 100, message: '工艺要求输入长度小于100', trigger: 'change'}],
          mainBodyPaper:[{required: true, message: '请输入正文用纸', trigger: 'change'},{max: 100, message: '正文用纸输入长度小于100', trigger: 'change'}],
          designRequirements:[{required: true, message: '请输入工艺要求', trigger: 'change'},{max: 100, message: '工艺要求输入长度小于100', trigger: 'change'}],
          bindingOrder:[{required: true, message: '请输入装订顺序', trigger: 'change'},{max: 100, message: '装订顺序输入长度小于100', trigger: 'change'}],
          otherRequirements:[{required: true, message: '请输入其他要求', trigger: 'change'},{max: 100, message: '其他要求输入长度小于100', trigger: 'change'}],
          deliveryStatus:[{required: true, message: '请输入包销（送货）情况', trigger: 'change'},{max: 100, message: '包销（送货）情况输入长度小于100', trigger: 'change'}],
          printingHouse:[{max: 20, message: '印厂输入长度小于20', trigger: 'change'}],
          remark:[{max: 100, message: '备注输入长度小于100', trigger: 'change'}],
        },
        activeName: "first",
        infoImg:infoImg,
        peopleList:[
          {name:'待完善',code:0},
          {name:'待分配',code:0},
          {name:'待一审',code:0},
          {name:'待二审',code:0},
          {name:'待三审',code:0},
          {name:'审核未通过',code:0},
          {name:'审核通过',code:0},
        ],
        uploading:false,
        seriesList:[],
        isSeries:false,
        vueStatus:false,
        steps:[{name:'图书再版',fatherStage:'7-1'},{name:'审核毛书',fatherStage:'7-2'},{name:'图书入库',fatherStage:'7-3'}],
        fatherStage:'7-1',
        curStep:null,
        step1Data:[],/*图书再版 审核日记*/
        step2Data:[],/*审核毛书 审核日记*/
        step3Data:null,/*图书入库 审核日记*/
        isShowStep:false,
        isStep:'7-1',
      }
    },
    components:{stepOne,stepTwo,stepThree},
    created(){
      if (this.$route.fullPath.indexOf('editId') >= 0) {
        this.$route.meta.title = '编辑图书再版信息';
      }else if (this.$route.fullPath.indexOf('lookId') >= 0) {
        this.$route.meta.title = '查看图书再版信息';
        this.vueStatus = true;
      } else {
        this.$route.meta.title = '审核图书再版信息';
        this.vueStatus = true;
      }
      this.getDetail();
    },
    methods: {
      getDetail(){
        getDetailAPI(this.$route.query.editId||this.$route.query.lookId||this.$route.query.examineId).then(res=>{
          if(res.data.status){
            this.imgForm=res.data.data;
            this.fatherStage=this.imgForm.stage;
            if(this.$route.query.examineId) {
              this.curStep = this.imgForm.stage.slice(this.imgForm.stage.length - 1);
            }
            this.$refs['ruleForm'].resetFields();
            this.getLogs();
          }
        })
      },
      getLogs(){
        getLogsAPI({
          id:this.$route.query.lookId||this.$route.query.examineId,
          bookType:this.imgForm.bookType,
        }).then(res=>{
          if(res.data.status){
            let data=res.data.data;
            this.step1Data=data.filter((item,index)=>{
              return item.code=='7-1'
            })[0].items;
            this.step2Data=data.filter((item,index)=>{
              return item.code=='7-2'
            })[0].items;
            this.step3Data=data.filter((item,index)=>{
              return item.code=='7-3'
            })[0].storage;
            if(this.$route.query.lookId){
              this.isShowStep=true;
            }else{
              this.isShowStep=false;
            }
          }
        }).then(resq=>{

          if(!this.$route.query.examineId){

            for(let i=0;i<3;i++){
              if(i==0&&this.step1Data.length>0){

                if(Number(this.curStep)>1)return
                this.curStep=1;
                console.log(123,this.curStep)
              }else if(i==1&&this.step2Data.length>0){
                console.log(234,this.curStep)
                if(Number(this.curStep)>2)return
                this.curStep=2;
              }else if(i==2&&this.step3Data!=null){
                console.log(23456,this.curStep)
                this.curStep=3;
              }
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
      handleClick(tab, event) {},
      //通过
      dataSubmit(){
        this.$refs['ruleForm'].validate((valid) => {
          if(valid){
            updateAPI(this.imgForm).then(res=>{
              if(res.data.status){
                this.$message.success('修改成功');
                this.$router.push('/newBook/printing');
              }else{
                this.$message.error(res.data.msg);
              }
            })
          }
        })
      },
      /*查看选题号*/
      lookFile(){},

      /*添加作者*/
      addAuthor(){
        console.log('添加')
      },
      StepFn(item){
        this.fatherStage =item.fatherStage;
        this.isStep =item.fatherStage;
      },
      /*审核接口*/
      examineFn(obj){
        saveAuditAPI(obj).then(res=>{
          if(res.data.status){
            this.$message.success('保存成功');
            this.$router.push('/newBook/printing');
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
    .steps{
      width: 100%;
      display: flex;
      justify-content: center;
      ul{
        display: flex;
        position: relative;
        z-index: 0;
        background: #fff;
        width: 400px;
        justify-content: space-between;
        li{
          width: 70px;
          height: 70px;
          line-height: 70px;
          text-align: center;
          font-size: 13px;
          color: #666666;
          border:1px solid #999999;
          border-radius: 50%;
          background: #fff;
          z-index: 11;
          cursor: pointer;
        }
        .active{
          color: #008000;
          border:1px solid #008000;
        }
      }
      ul:after{
        content: " ";
        border-top: 1px solid #ccc;
        width: 100%;
        position: absolute;
        top: 35px;
        left:0;
        z-index: 0;
      }
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
</style>
