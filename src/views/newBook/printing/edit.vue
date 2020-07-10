<template>
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
            <el-input v-model="imgForm.bookName" name="bookName"></el-input>
          </el-form-item>
          <el-form-item label="书名（副题）:" prop="subheading" class="width360">
            <el-input v-model="imgForm.subheading"  ></el-input>
          </el-form-item>
          <el-form-item label="丛书名:" prop="seriesName"  class="width360 author">
            <el-input v-model="imgForm.seriesName"  @input="getSeries"></el-input>
            <div class="list" v-if="isSeries">
              <ul>
                <li v-for="(item,index) in seriesList" :key="index" @click="changeSeries(item)">{{item.seriesName}}</li>
              </ul>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 35px;" v-if="isSeries"></div>
          </el-form-item>
          <el-form-item prop="author" label="原著者:" class="width360">
            <el-input v-model="imgForm.author" name="author"></el-input>         <!--<el-select v-model="imgForm.bookname" disabled="disabled" placeholder="请选择活动区域">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>-->
          </el-form-item>
          <el-form-item prop="author" label="著作方式：" class="width360">
            <el-input v-model="imgForm.ISBN" name="ISBN"></el-input>
          </el-form-item>
          <el-form-item prop="author" label="作者：" class="width360">
            <el-input v-model="imgForm.ISBN" name="ISBN"></el-input>
          </el-form-item>
          <el-form-item prop="author" label="丛书著作方式：" class="width360">
            <el-input v-model="imgForm.ISBN" name="ISBN"></el-input>
          </el-form-item>
          <el-form-item prop="translator" label="丛书作者：" class="width360">
            <el-input v-model="imgForm.translator" name="translator"></el-input>
            <!--<i class="el-icon-circle-plus" style="font-size: 24px;margin-top: 5px" @click="addAuthor"></i>-->
          </el-form-item>
          <el-form-item prop="publish" label="成品尺寸：" class="width360">
            <el-input v-model="imgForm.publish" name="publish"></el-input>mm
          </el-form-item>
          <el-form-item prop="language" label="字数：" class="width360">
            <el-input v-model="imgForm.language" name="language"></el-input>千字
          </el-form-item>
          <el-form-item prop="editor" label="页数：" class="width360">
            <el-input v-model="imgForm.editor" name="editor"></el-input>页
          </el-form-item>
          <el-form-item prop="dutyEditor" label="插图：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor" align="left"></el-input>副
          </el-form-item>
          <el-form-item prop="dutyEditor" label="版次：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="印次：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="责任编辑：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="电话：" class="width360">
            <el-input v-model="imgForm.phone" name="phone"></el-input>
          </el-form-item>

        </div>
        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;印制信息</h6>
          <el-form-item prop="dutyEditor" label="书号：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="印张：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="装帧：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="定价：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="封面用纸：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="工艺要求：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="正文用纸：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="工艺要求：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="装订顺序：">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor" type="textarea"
                      :rows="4" style="width: 80%"  resize="none"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="其他要求：">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor" type="textarea"
                      :rows="4" style="width: 80%"  resize="none"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="包销（送货）情况：">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor" type="textarea"
                      :rows="4" style="width: 80%"  resize="none"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="印厂：" class="width360">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor"></el-input>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="时间：" class="width360">
            <el-date-picker
              v-model="imgForm.value1"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="dutyEditor" label="备注：">
            <el-input v-model="imgForm.dutyEditor" name="dutyEditor" type="textarea" :rows="4" style="width: 80%" resize="none"></el-input>
          </el-form-item>

        </div>
        <div class="tabwrapper2">
          <el-form-item align="center" style="margin-right: 140px">
            <el-button type="primary" @click="dataSubmit">保存</el-button>
            <el-button>取消</el-button>
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
          subheading: [{required: true, message: '请输入丛书名', trigger: 'change'},{max: 80, message: '书名（副题）输入长度小于80', trigger: 'change'}],
          seriesName:[{max: 80, message: '丛书名输入长度小于80', trigger: 'change'}],
          author:[{max: 10, message: '原著者输入长度小于10', trigger: 'change'}],
          phone:[{required: true, message: '请输入手机号', trigger: 'change'},{pattern:/^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change'},],
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
      }
    },
    created(){
      if (this.$route.fullPath.indexOf('editId') >= 0) {
      this.$route.meta.title = '编辑图书印刷信息';
      this.getDetail();
    }


    },
    methods: {
      getDetail(){},
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
      dataSubmit(){},
      /*查看选题号*/
      lookFile(){},

      /*添加作者*/
      addAuthor(){
        console.log('添加')
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
