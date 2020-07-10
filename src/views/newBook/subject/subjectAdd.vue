<template>
  <div class="addImgResource xywCss">
    <div class="formbox">
      <el-form
        :model="imgForm"
        ref="imgForm"
        :rules="rules"
        label-width="160px"
        class="demo-ruleForm"
      >
        <div class="tabwrapper">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
          <el-form-item prop="bookName" label="书名:" class="width360">
            <el-input v-model="imgForm.bookName" name="bookName" ></el-input>
          </el-form-item>
          <el-form-item label="丛书名:" prop="seriesName" class="width360 author">
            <el-input v-model="imgForm.seriesName" name="seriesName" @input="getSeries" placeholder="点击关联丛书或手动输入"></el-input>
            <div class="list" v-if="isSeries">
              <ul>
                <li v-for="(item,index) in seriesList" :key="index" @click="changeSeries(item)">{{item.seriesName}}</li>
              </ul>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 35px;" v-if="isSeries"></div>
          </el-form-item>
          <el-form-item prop="language" label="语种：" class="width360">
            <el-input v-model="imgForm.language" name="language" ></el-input>
          </el-form-item>
          <el-form-item prop="estimatWordCount" label="预计字数:" class="width360">
            <el-input v-model.number="imgForm.estimatWordCount" name="estimatWordCount" ></el-input>
          </el-form-item>
          <el-form-item prop="estimatStampCount" label="预估印数：" class="width360">
            <el-input v-model.number="imgForm.estimatStampCount" name="estimatStampCount" ></el-input>
          </el-form-item>
          <el-form-item prop="estimatPrice" label="预估定价：" class="width360">
            <el-input v-model="imgForm.estimatPrice" name="estimatPrice" ></el-input>
          </el-form-item>
          <el-form-item prop="estimatSubmitDate" label="预估交稿时间：" class="width360 time100">
            <el-date-picker
              v-model="imgForm.estimatSubmitDate"
              type="date"
              placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>

          <el-form-item prop="keyword" label="关键词：" class="width360">
            <el-input v-model="imgForm.keyword" name="keyword"  placeholder="多个关键词之间用逗号隔开"></el-input>
          </el-form-item>
          <el-form-item prop="publicationForm" label="出版形式:" class="width360 time100">
            <el-select v-model="imgForm.publicationForm">
              <el-option
                v-for="(item,ind) in peopleList"
                :key="ind"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="planingManuscript" label="策划组稿：" class="width360">
            <el-input v-model="imgForm.planingManuscript" name="planingManuscript" ></el-input>
          </el-form-item>
          <el-form-item prop="editor" label="责任编辑：" class="width360">
            <el-input v-model="imgForm.editor" name="plandraft" ></el-input>
          </el-form-item>
          <el-form-item prop="declareDate" label="申报时间：" class="width360 time100">
            <el-date-picker
              v-model="imgForm.declareDate"
              type="datetime"
              placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="authorBookCount" label="作者用书数：" class="width360">
            <el-input v-model="imgForm.authorBookCount" name="authorBookCount" ></el-input>
          </el-form-item>
          <el-form-item label="责编推销数：" class="width360" prop="editorSellCount">
            <el-input v-model="imgForm.editorSellCount"></el-input>
          </el-form-item>
          <el-form-item prop="publishingBookCount" label="出版社用书数：" class="width360">
            <el-input v-model="imgForm.publishingBookCount" name="publishingBookCount" ></el-input>
          </el-form-item>
          <div class="sponsoredCss">
            <el-form-item prop="sponsored" label="作者方是否出赞助款"  class="width360">
              <el-radio-group v-model="imgForm.sponsored">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>

            </el-form-item>
            <el-form-item :prop="imgForm.sponsored==1?'sponsorship':''" v-if="imgForm.sponsored==1" class="sponsorship">
              <el-input v-model="imgForm.sponsorship" name="sponsorship"></el-input>
            </el-form-item>

          </div>

          <el-form-item prop="costBudget" label="成本预算：" class="width360">
            <el-input v-model="imgForm.costBudget" name="costBudget" ></el-input>
          </el-form-item>
          <el-form-item prop="mainReader" label="主要读者对象：">
            <el-input  type="textarea" :rows="3" maxlength="100" v-model="imgForm.mainReader" name="mainReader" style="width:90%"></el-input>
          </el-form-item>
          <el-form-item prop="prediction" label="预测书稿的社会效果与经济效益（包括初版印数和再版的可能性）：" class="content" label-width="100%">
            <el-input  type="textarea" v-model="imgForm.prediction" name="prediction"  :rows="4" maxlength="300" style="width:90%" resize="none"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;作（译）者简况</h6>
          <el-form-item prop="author" label="姓名:" class="width360 author">
            <el-input v-model="imgForm.author" name="name" @input="getAuthor"></el-input>
            <div class="list" v-if="isAuthor">
              <ul>
                <li v-for="(item,index) in authorList" :key="index" @click="changeAuthor(item)">{{item.name}}</li>
              </ul>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 35px;" v-if="isAuthor"></div>
            <!--<el-autocomplete
              class="inline-input"
              v-model="imgForm.name"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>-->

          </el-form-item>
          <el-form-item label="学历:" prop="education" class="width360 time100">
            <el-select
              v-model="imgForm.education"
              placeholder="请选择">
              <el-option
                v-for="item in educationList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="age" label="年龄：" class="width360">
            <el-input v-model="imgForm.age" name="age" ></el-input>
          </el-form-item>
          <el-form-item prop="specialty" label="专长(含外语):" class="width360">
            <el-input v-model="imgForm.specialty" name="specialty" ></el-input>
          </el-form-item>
          <el-form-item prop="unit" label="工作单位：" class="width360">
            <el-input v-model="imgForm.unit" name="unit" ></el-input>
          </el-form-item>
          <el-form-item prop="title" label="职务职称：" class="width360">
            <el-input v-model="imgForm.title" name="title" ></el-input>
          </el-form-item>
          <el-form-item prop="address" label="地址：" class="width360">
            <el-input v-model="imgForm.address" name="address" ></el-input>
          </el-form-item>

          <el-form-item prop="phone" label="联系电话：" class="width360">
            <el-input v-model="imgForm.phone" name="phone" ></el-input>
          </el-form-item>
          <el-form-item prop="professional" label="专业与写作水平：">
            <el-input  type="textarea" v-model="imgForm.professional" name="professional" style="width:90%"></el-input>
          </el-form-item>
          <el-form-item prop="srr" label="著作科研成果：">
            <el-input  type="textarea" v-model="imgForm.srr" name="srr" style="width:90%"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;其他信息</h6>
          <el-form-item label="   选题理由（出版价值\主要内容与特色）：" name="reason" class="content requiredCss" label-width="100%">
            <tinymce
              :height="300"
              ref="editor"
              v-model="imgForm.reason"
              style="width:99%;"
            ></tinymce>
            <div style="color: #F56C6C; font-size: 12px;" v-if="isreason">请输入选题理由</div>
          </el-form-item>

          <el-form-item label="对编写大纲、样稿的初审意见：" name="opinion" class="content requiredCss" prop="opinion" label-width="100%">
            <tinymce
              :height="300"
              ref="editor"
              v-model="imgForm.opinion"
              style="width:99%;"
            ></tinymce>
            <div style="color: #F56C6C; font-size: 12px;" v-if="isopinion">请输入对编写大纲、样稿的初审意见</div>
          </el-form-item>
          <el-form-item label="同类书（５种以上）国内外出版情况及本书稿较之有何特点：" name="features" class="content" label-width="100%">
            <tinymce
              :height="300"
              ref="editor"
              v-model="imgForm.features"
              style="width:99%;"
            ></tinymce>
          </el-form-item>
          <el-form-item prop="remark" label="备注：">
            <el-input  type="textarea" v-model="imgForm.remark" name="remark" ></el-input>
          </el-form-item>
          <el-form-item label="相关文件：">
            <el-upload
              class="upload-demo"
              :action="`${uploadUrl}${uploadPath}`"
              :limit="1"
              :on-exceed="handleFileExceed" :before-upload="beforeFileUpload" :on-success="handleFileSuccess"  multiple  :on-remove="handleFileRemove"
            >
              <el-button  :loading="uploading" type="primary">选择文件</el-button>
              <span v-if="imgForm.relatedFile" @click="downFile(imgForm.relatedFile)" style="cursor: pointer;color: #4285F4">下载</span>
            </el-upload>
            <div class="el-upload__tip" style="color:#ccc">可上传文件类型包括Word、PDF，大小不超过2M</div>
          </el-form-item>

        </div>
        <el-form-item align="center">
          <el-button type="primary" @click="dataSubmit" :loading="isdataSubmit">保存</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>
<script>
  import "@/styles/resource.scss";
  import "@/styles/commonRe.css";
  import Tinymce from "@/components/Tinymce";
  import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
  import {getAuthorAPI,getSeriesAPI,getEducationAPI,saveAPI} from '@/api/newBook/subject';
  import {editAPI} from "../../../api/newBook/subject";
  export default {
    components: { Tinymce},
    data() {
      return {
        uploadUrl: uploadUrl,
        uploadPath: uploadPath,
        imgForm: {
          seriesName: '',
          sponsorship:null,
          reason:'',
          opinion:'',
          relatedFile:null,
        },
        authorList:[],
        isAuthor:false,
        seriesList:[],
        educationList:[],
        isSeries:false,
        uploading:false,
        isreason:false,
        isopinion:false,
        isdataSubmit:false,
        peopleList: [
          {name: 'A', code: 'A'},
          {name: 'B', code: 'B'}
        ],
        rules: {
          bookName: [{required: true, message: '请输入书名', trigger: 'change'},{max: 80, message: '书名输入长度小于80', trigger: 'change'}],
          seriesName: [{required: true, message: '请输入丛书名', trigger: 'change'},{max: 80, message: '丛书名输入长度小于80', trigger: 'change'}],
          language: [{required: true, message: '请输入语种', trigger: 'change'},{max: 10, message: '语种输入长度小于10', trigger: 'change'}],
          estimatWordCount: [{required: true, message: '请输入预计字数', trigger: 'change'},{type: 'number', message: '请输入数字', trigger: 'change'},{pattern:/^[1-9]\d{0,9}$/, message: '请输入小于10位的数字', trigger: 'change'}],
          estimatStampCount: [{required: true, message: '请输入预估印数', trigger: 'change'},{type: 'number', message: '请输入数字', trigger: 'change'},{pattern:/^[1-9]\d{0,9}$/, message: '请输入小于10位的数字', trigger: 'change'}],
          estimatPrice: [{required: true, message: '请输入预估定价', trigger: 'change'},{pattern:/^(([1-9]\d{0,4})(\.\d{1,2})?|0\.([1-9][0]?|\d[1-9]))$/, message: '请输入0.1-99999之间的价格，最多保留小数点后两位', trigger: 'change'}],/*,{type: 'number', message: '请输入数字', trigger: 'change'},*/
          age:[{pattern:/^([1]?\d{1,2})$/, message: '请输入正确的年龄', trigger: 'change'}],
          specialty:[{max: 30, message: '专长输入长度小于30', trigger: 'change'}],
          unit:[{max: 30, message: '工作单位输入长度小于30', trigger: 'change'}],
          title:[{max: 30, message: '职务职称输入长度小于30', trigger: 'change'}],
          address:[{max: 50, message: '地址输入长度小于50', trigger: 'change'}],
          phone:[{pattern:/^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change'},],
          estimatSubmitDate: [{required: true, message: '请选择预估交稿时间', trigger: 'change'}],
          keyword: [{required: true, message: '请输入关键词', trigger: 'change'},{max: 100, message: '关键词输入长度小于100', trigger: 'change'}],
          publicationForm: [{required: true, message: '请选择出版形式', trigger: 'change'}],
          planingManuscript: [{required: true, message: '请输入策划组稿', trigger: 'change'},{max: 30, message: '策划组稿输入长度小于30', trigger: 'change'}],
          editor: [{required: true, message: '请输入责任编辑', trigger: 'change'},{max: 30, message: '责任编辑输入长度小于30', trigger: 'change'}],
          declareDate: [{required: true, message: '请选择申报时间', trigger: 'change'}],
          authorBookCount: [{required: true, message: '请输入作者用书数', trigger: 'change'},{max:10, message: '作者用书数输入长度小于10位', trigger: 'change'}],
          publishingBookCount: [{required: true, message: '请输入出版社用书数', trigger: 'change'},{max:10, message: '出版社用书数输入长度小于10位', trigger: 'change'}],
          sponsored: [{required: true, message: '请选择作者方是否出赞助款', trigger: 'change'}],
          sponsorship: [{required: true, message: '请输入赞助款', trigger: 'change'},{pattern:/^(([1-9]\d{0,4})(\.\d{1,2})?|0\.([1-9][0]?|\d[1-9]))$/, message: '请输入0.1-99999之间的价格，最多保留小数点后两位', trigger: 'change'}],
          costBudget: [{required: true, message: '请输入成本预算', trigger: 'change'},{pattern:/^(([1-9]\d{0,4})(\.\d{1,2})?|0\.([1-9][0]?|\d[1-9]))$/, message: '请输入0.1-99999之间的价格，最多保留小数点后两位', trigger: 'change'}],
          mainReader: [{required: true, message: '请输入主要读者对象', trigger: 'change'},{max: 100, message: '主要读者对象输入长度小于100', trigger: 'change'}],
          prediction: [{required: true, message: '请输入预测书稿的社会效果与经济效益（包括初版印数和再版的可能性）', trigger: 'change'},{max: 300, message: '预测书稿的社会效果与经济效益输入长度小于300', trigger: 'change'}],

          author: [{required: true, message: '请输入姓名', trigger: 'change'},{max: 10, message: '姓名输入长度小于10', trigger: 'change'}],
          subheading: [{required: true, message: '请输入副题', trigger: 'change'},],

          editorSellCount: [{max: 10, message: '责编推销数输入长度小于10', trigger: 'change'}],
        },
        activeName: "first",
        options: [{
          value: 'HTML',
          label: 'HTML'
        }, {
          value: 'CSS',
          label: 'CSS'
        }, {
          value: 'JavaScript',
          label: 'JavaScript'
        }],
        domain: process.env.BASE_API,
        requestPath: requestPath,
        uploadPath: uploadPath,
      };
    },
    created(){
      this.getEducation();
    },
    watch:{
      'imgForm.reason'(n,o){
        this.isreason=n.trim()!=''?false:true;
      },
      'imgForm.opinion'(n,o){
        this.isopinion=n.trim()!=''?false:true;
      },
      'imgForm.sponsored'(n,o){
        if(n!=o){
          this.imgForm.sponsorship='';
        }
      }
    },
    methods: {
      handleClick(tab, event) {},
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
      getAuthor(){
        console.log('改变',this.imgForm.author)
        if(this.imgForm.author.trim()==''){
          this.isAuthor=false;
          return
        }
        getAuthorAPI({name:this.imgForm.author}).then(res=>{
          if(res.data.status){
            this.authorList=res.data.data;
            this.isAuthor=res.data.data.length>0?true:false;
          }
        })

      },
      changeAuthor(item){
        this.imgForm.author=item.name;
        this.imgForm.authorId=item.id;
        this.isAuthor=false;
      },
      /*学历列表*/
      getEducation(){
        this.educationList=[];
        getEducationAPI().then(res=>{
          if(res.data.status){
            let keys=Object.keys(res.data.data),obj=res.data.data;
            keys.map((item)=>{
              let it={name:obj[item],code:item};
              this.educationList=[...this.educationList,it];
            })
            console.log('学历数据',this.educationList)
            /*this.educationList=res.data.data;*/
          }
        })
      },

      /*上传文件*/
      handleFileExceed(files, fileList) {
        this.$message.warning(`单次上传最多1个文件`);
      },
      beforeFileUpload(file) {
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
      handleFileSuccess(response, file, fileList) {
        console.log('上傳成功',response,file)
        this.imgForm.relatedFile = response;
        this.imgForm.relatedFileName=file.name;
        this.uploading=false;
      },
      handleFileRemove() {//删除pdf
        /*this.$set(this.imgForm,'relatedFile',null);*/
        this.imgForm.relatedFile=null;
        this.imgForm.relatedFileName=null;
      },
      /*下载*/
      downFile(url){
        let openUrl=`${process.env.BASE_API}/file/file/download/${url}`;
        window.open(openUrl);
      },

      /*失去焦点*/
      loseFocus(){
        let self=this;
        this.$nextTick(()=>{
          self.$refs.author.blur(function(){
            self.isAuthor=false
          })
        })

      },

      /*提交*/
      dataSubmit(){
        let self=this;
        this.$refs['imgForm'].validate((valid) => {
          if(this.imgForm.reason==''||this.imgForm.reason.trim()==''){
            this.isreason=true;
          }else{
            this.isreason=false;
          }
          if(this.imgForm.opinion.trim()==''){
            this.isopinion=true;
          }else{
            this.isopinion=false;
          }
          if(this.imgForm.sponsored==0){
            this.imgForm.sponsorship=null;
          }
          if (valid&&!this.isreason&&!this.isopinion) {
            this.isdataSubmit=true;
            saveAPI(this.imgForm).then(res=>{
              if(res.data.status){
                this.$store.state.tagsView.isNewone=true;
                this.$message.success('保存成功');
                let timer=window.setTimeout(()=>{
                  self.$router.push('/newBook/subject');
                  clearTimeout(timer);
                },2000)
              }else{
                this.$message.error(res.data.msg);
              }
              this.isdataSubmit=false
            })
          }
        })
      },

    }
  };
</script>
<style lang="less" scoped>
  .addImgResource {
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
      .tabwrapper {
        padding-top: 40px;
        .content{
          display: flex;
          flex-direction: column;
          .el-form-item__content{margin-left: 0px!important;}
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
    margin-top: 8px;
  }
  .tabwrapper{
    .content{
      display: flex;
      flex-direction: column;
      .el-form-item__content{margin-left: 0px!important;}
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
    .requiredCss{position: relative}
    .requiredCss:before{
      content: '*';
      position: absolute;
      left: 0;
      top:0;
      color:#F56C6C; font-size: 12px;
      height: 36px;
      line-height: 36px;
    }
  }

</style>
