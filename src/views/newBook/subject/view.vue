<template>
  <!--修改选题-->
  <div class="addImgResource subjectView xywCss">
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
          <el-form-item label="书名:"  class="width360" prop="bookName">
            <el-input v-model="imgForm.bookName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="丛书名:" class="width360 author" prop="seriesName">
            <el-input v-model="imgForm.seriesName" :disabled="vueStatus" @input="getSeries"></el-input>
            <div class="list" v-if="isSeries">
              <ul>
                <li v-for="(item,index) in seriesList" :key="index" @click="changeSeries(item)">{{item.seriesName}}</li>
              </ul>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 35px;" v-if="isSeries"></div>
          </el-form-item>
          <el-form-item label="语种:"  class="width360" prop="language">
            <el-input v-model="imgForm.language" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="预计字数:"  class="width360" prop="estimatWordCount">
            <el-input v-model.number="imgForm.estimatWordCount" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="预估印数:"  class="width360" prop="estimatStampCount">
            <el-input v-model.number="imgForm.estimatStampCount" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="预估定价:"  class="width360" prop="estimatPrice">
            <el-input v-model="imgForm.estimatPrice" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="预估交稿时间:"  class="width360 time100" prop="estimatSubmitDate">
            <el-date-picker
              v-model="imgForm.estimatSubmitDate"
              type="date"
              :disabled="vueStatus"
              placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="关键词:"  class="width360" prop="keyword">
            <el-input v-model="imgForm.keyword" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="出版形式:"  class="width360 time100" prop="publicationForm">
            <el-select v-model="imgForm.publicationForm" placeholder="请选择" :disabled="vueStatus">
              <el-option
                v-for="(item,ind) in peopleList"
                :key="ind"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="策划组稿:"  class="width360" prop="planingManuscript">
            <el-input v-model="imgForm.planingManuscript" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="责任编辑:"  class="width360" prop="editor">
            <el-input v-model="imgForm.editor" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="申报时间:"  class="width360 time100" prop="declareDate">
            <el-date-picker
              v-model="imgForm.declareDate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期"  :disabled="vueStatus">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="作者用书数:"  class="width360" prop="authorBookCount">
            <el-input v-model="imgForm.authorBookCount" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="责编推销数:"  class="width360" prop="editorSellCount">
            <el-input v-model="imgForm.editorSellCount" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="出版社用书数:"  class="width360" prop="publishingBookCount">
            <el-input v-model="imgForm.publishingBookCount" :disabled="vueStatus"></el-input>
          </el-form-item>
          <div class="sponsoredCss">
            <el-form-item label="作者方是否出赞助款:"  class="width360" prop="sponsored">
              <el-radio-group v-model="imgForm.sponsored" :disabled="vueStatus">
                <el-radio :label="'1'">是</el-radio>
                <el-radio :label="'0'">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :prop="imgForm.sponsored==1?'sponsorship':''" v-if="imgForm.sponsored==1" class="sponsorship">
              <el-input v-model="imgForm.sponsorship" name="sponsorship" :disabled="vueStatus"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="成本预算:" prop="costBudget"  class="width360">
            <el-input v-model="imgForm.costBudget" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="主要读者对象:" prop="mainReader">
            <el-input v-model="imgForm.mainReader" :disabled="vueStatus" type="textarea" :rows="3" maxlength="100" style="width:90%" resize="none"></el-input>
          </el-form-item>
          <el-form-item label="预测书稿的社会效果与经济效益（包括初版印数和再版的可能性）：" prop="prediction" class="content" label-width="100%">
            <el-input v-model="imgForm.prediction" :disabled="vueStatus" type="textarea" :rows="4" maxlength="300" style="width:90%" resize="none"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;作（译）者简况</h6>
          <el-form-item prop="author" label="姓名:" class="width360 author">
            <el-input v-model="imgForm.author" name="name" :disabled="vueStatus" @input="getAuthor"></el-input>
            <div class="list" v-if="isAuthor">
              <ul>
                <li v-for="(item,index) in authorList" :key="index" @click="changeAuthor(item)">{{item.name}}</li>
              </ul>
            </div>
            <div x-arrow="" class="popper__arrow" style="left: 35px;" v-if="isAuthor"></div>

          </el-form-item>
          <el-form-item label="学历:"  class="width360 time100">
            <el-select v-model="imgForm.education" placeholder="请选择" :disabled="vueStatus">
              <el-option
                v-for="(item,ind) in educationList"
                :key="ind"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="age" label="年龄:" class="width360">
            <el-input v-model="imgForm.age" name="age" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="专长（含外语）:" class="width360" prop="specialty">
            <el-input v-model="imgForm.specialty" name="specialty" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="工作单位:" class="width360"   prop="unit">
            <el-input v-model="imgForm.unit" name="unit" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="职务职称:" class="width360"  prop="title">
            <el-input v-model="imgForm.title" name="title" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="地址:" class="width360"  prop="address">
            <el-input v-model="imgForm.address" name="address" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" class="width360" prop="phone">
            <el-input v-model="imgForm.phone" name="phone" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="专业与写作水平："  prop="professional">
            <el-input v-model="imgForm.professional" :disabled="vueStatus" type="textarea" :rows="4" maxlength="300" style="width:90%" resize="none"></el-input>
          </el-form-item>
          <el-form-item label="著作科研成果：">
            <el-input v-model="imgForm.srr" :disabled="vueStatus" type="textarea" :rows="4" maxlength="300" style="width:90%" resize="none"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;其他信息</h6>
          <el-form-item label="选题理由（出版价值\主要内容与特色）:"  class="content requiredCss" label-width="100%">
            <tinymce
              :height="300"
              ref="editor"
              v-model="imgForm.reason"
              style="width:90%;"
            ></tinymce>
            <div style="color: #F56C6C; font-size: 12px;" v-if="isreason">请输入选题理由</div>
          </el-form-item>
          <el-form-item label="对编写大纲、样稿的初审意见：" class="content requiredCss" label-width="100%">
            <tinymce
              :height="300"
              ref="editor"
              v-model="imgForm.opinion"
              style="width:90%;"
            ></tinymce>
            <div style="color: #F56C6C; font-size: 12px;" v-if="isopinion">请输入对编写大纲、样稿的初审意见</div>
          </el-form-item>
          <el-form-item label="同类书（５种以上）国内外出版情况及本书稿较之有何特点：" class="content" label-width="100%">
            <tinymce
              :height="300"
              ref="editor"
              v-model="imgForm.features"
              style="width:90%;"
            ></tinymce>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="imgForm.remark" name="language" :disabled="vueStatus" type="textarea" resize="none" :rows="3" maxlength="100" style="width: 90%"></el-input>
          </el-form-item>
          <el-form-item label="相关文件：">
            <div class="pdfCss" v-if="vueStatus">{{imgForm.relatedFile?imgForm.relatedFileName:'暂无文件'}}<span v-if="fileList.length>0" @click="downFile(imgForm.relatedFile)" style="cursor: pointer;color: #4285F4">下载</span>
            </div>
            <el-upload class="upload-demo uploadFileCss" :action="`${uploadUrl}${uploadPath}`" :on-exceed="handleFileExceed" :before-upload="beforeFileUpload" :limit="1" :on-success="handleFileSuccess"  multiple  :on-remove="handleFileRemove" :file-list="fileList" v-if="!vueStatus">
              <el-button :loading="uploading" type="primary">选择文件</el-button>
              <span v-if="fileList.length>0" @click="downFile(imgForm.relatedFile)" style="cursor: pointer;color: #4285F4">下载</span>
              <!--<span>{{resourceForm.pdf_zh}}</span>-->
            </el-upload>
            <div class="el-upload__tip" v-if="!vueStatus"  style="color:#ccc">可上传文件类型包括Word、PDF，大小不超过2M</div>

            <!--relatedFile-->
            <!--<el-button @click="lookFile" v-if="imgForm.relatedFile">查看</el-button>
            <el-upload :action="`${uploadUrl}${uploadPath}`" :on-exceed="handleFileExceed"
                       :before-upload="beforeFileUpload" :on-success="handleFileSuccess" multiple :limit="1"
                       :on-remove="handleFileRemove" :file-list="fileList">
              <el-button :loading="uploading" v-if="!imgForm.relatedFile">选择文件</el-button>
              &lt;!&ndash;<span>文件名</span>&ndash;&gt;
            </el-upload>
            <span class="t">可上传文件类型包括word、PDF</span>-->
          </el-form-item>
          <el-form-item align="center" v-if=" !vueStatus">
            <el-button type="primary" @click="dataSubmit">保存</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </div>

        <!--室主任意见-->
        <div class="tabwrapper" v-if="vueStatus&&opinionList.length>0" v-for="(item,index) in opinionList" :key="index">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;{{opinionTitle[index]}}</h6>
          <el-form-item label="审核人：">
            <!--stage (string, optional): 审核阶段，1：室主任，2：社审题会，3：社领导 ,-->
            <el-input v-model="item.userName" name="name" disabled style="width: 350px;"></el-input>
          </el-form-item>
          <el-form-item label="审核状态：" class="width360">
            {{item.status==1?'审核通过':'审核未通过'}}<!--status (string, optional): 状态：0：审核未通过，1：审核通过 ,-->
            <!--<el-input v-model="imgForm.name" name="name" disabled></el-input>-->
          </el-form-item>
          <el-form-item label="审核时间:" class="width360">
            <el-input v-model="item.auditTime" name="name" disabled></el-input>
          </el-form-item>
          <el-form-item label="审核意见：">
            <el-input v-model="item.auditOpinion" disabled type="textarea" :rows="4" style="width:90%" resize="none"></el-input>
          </el-form-item>
        </div>

        <!--社选题会意见-->
        <!--<div class="tabwrapper1" v-if="vueStatus">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;社选题会意见</h6>
          <el-form-item label="审核人：">
            <el-input v-model="imgForm.name" name="name" disabled style="width: 350px;"></el-input>
          </el-form-item>
          <el-form-item label="审核状态：" class="width360">
            {{'审核通过'}}
            &lt;!&ndash;<el-input v-model="imgForm.name" name="name" disabled></el-input>&ndash;&gt;
          </el-form-item>
          <el-form-item label="审核时间:" class="width360">
            <el-input v-model="imgForm.name" name="name" disabled></el-input>
          </el-form-item>
          <el-form-item label="审核意见：">
            <el-input v-model="imgForm.subheading" disabled type="textarea" :rows="4" style="width:80%" resize="none"></el-input>
          </el-form-item>
        </div>
        &lt;!&ndash;社领导意见&ndash;&gt;
        <div class="tabwrapper1" v-if="vueStatus">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;社领导意见</h6>
          <el-form-item label="审核人:">
            <el-input v-model="imgForm.name" name="name" disabled style="width: 350px;"></el-input>
          </el-form-item>
          <el-form-item label="审核状态:" class="width360">
            {{'审核通过'}}
            &lt;!&ndash;<el-input v-model="imgForm.name" name="name" disabled></el-input>&ndash;&gt;
          </el-form-item>
          <el-form-item label="审核时间:" class="width360">
            <el-input v-model="imgForm.name" name="name" disabled></el-input>
          </el-form-item>
          <el-form-item label="审核意见：">
            <el-input v-model="imgForm.subheading" disabled type="textarea" :rows="4" style="width:80%" resize="none"></el-input>
          </el-form-item>
        </div>-->
        <div class="tabwrapper" v-if="vueStatus&&imgForm.thriceAuditName">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;三审负责人</h6>
          <el-form-item label="三审负责人:">
            <el-input v-model="imgForm.thriceAuditName" name="thriceAuditName" disabled style="width: 350px;"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js';
  import "@/styles/resource.scss";
  import {getDetailAPI,getEducationAPI,getSeriesAPI,editAPI,getAuthorAPI,getAuditsListAPI,downLoadAPI} from '../../../api/newBook/subject';
  import "@/styles/commonRe.css";
  import Tinymce from "@/components/Tinymce";
    export default {
        data() {
            return {
              uploadUrl: uploadUrl,
              uploadPath: uploadPath,
              uploading: false,
              imgForm: {
                series: '',
                sponsorship:null,
              },
              seriesList:[],
              fileList:[],
              authorList:[],
              isAuthor:false,
              isSeries:false,
              vueStatus: false,
              isreason:false,
              isopinion:false,
              peopleList: [
                {name: 'A', code: 'A'},
                {name: 'B', code: 'B'}
              ],
              educationList:[],
              opinionList:[],
              opinionTitle:['室主任意见','社选题会意见','社领导意见','三审驳回'],
              people:['室主任','社审题会','社领导'],
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
            }
        },
      components: { Tinymce},
      created() {
        if (this.$route.fullPath.indexOf('editId') >= 0) {
          this.$route.meta.title = '修改选题';
          this.vueStatus = false;
          this.getDetail();
        } else if (this.$route.fullPath.indexOf('lookId' )>= 0) {
          this.$route.meta.title = '查看选题';
          this.vueStatus = true;
          this.getDetail();
        } else {
          this.$route.meta.title = '添加选题';
          this.vueStatus = false;
        }
        this.getEducation();
        this.getAuditsList();

      },
      watch:{
        'imgForm.reason'(n,o){
          this.isreason=n.trim()!=''?false:true;
        },
        'imgForm.opinion'(n,o){
          this.isopinion=n.trim()!=''?false:true;
        },
        'imgForm.sponsored'(n,o){
          if(n!=o&&o!=null){
            this.imgForm.sponsorship='';
          }
        }
      },
        methods: {
          /*详情*/
          getDetail(){
            this.fileList=[];
            getDetailAPI(this.$route.query.lookId||this.$route.query.editId).then(res=>{
              if(res.data.status){
                this.imgForm=res.data.data;
                console.log(11222,this.imgForm.sponsorship)
                this.imgForm.estimatStampCount=res.data.data.estimatStampCount?Number(res.data.data.estimatStampCount):null;
                this.imgForm.estimatWordCount=res.data.data.estimatWordCount?Number(res.data.data.estimatWordCount):null;

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

          /*获取审核意见*/
          getAuditsList(){
            let self=this;
            this.opinionList=[];
            getAuditsListAPI(this.$route.query.lookId||this.$route.query.editId).then(res=>{
              if(res.data.status){

                let a=[];
                a[3]='admin';
                console.log('获取审核意见', a)
                /*this.opinionList=res.data.data;*/
                this.$nextTick(()=>{
                  if(res.data.data.length>0){
                    res.data.data.forEach((item,index)=>{
                      switch (item.stage) {
                        case '1-2-1':
                          self.opinionList[0]=item;
                          break;
                        case '1-2-2':
                          self.opinionList[1]=item;
                          break;
                        case '1-2-3':
                          self.opinionList[2]=item;
                          break;
                        default:
                          self.opinionList[3]=item;
                          break;
                      }
                    })
                  }
                });
                this.$forceUpdate();
                console.log('数据',self.opinionList)

              }
            })
          },

          /*获取学历*/
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


          /*查看文件*/
          lookFile() {
          },
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
            this.imgForm.relatedFile=null;
            this.imgForm.relatedFileName=null;
            this.fileList=[];
          },

          /*下载*/
          downFile(url){
            let openUrl=`${process.env.BASE_API}/file/file/download/${url}`;
            window.open(openUrl);
          },
          /*确定*/
          dataSubmit(){
            let self=this;
            this.$refs['imgForm'].validate((valid) => {
              if(this.imgForm.reason.trim()==''){
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
                editAPI(this.imgForm).then(res=>{
                  if(res.data.status){
                    this.$message.success('修改成功');
                    let timer=window.setTimeout(()=>{
                      self.$router.push('/newBook/subject');
                      clearTimeout(timer);
                    },2000)

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
  .subjectView {
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
                white-space: nowrap;
                text-overflow: ellipsis;
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
    margin-top: 8px
  }
  .pdfCss{height: 40px; line-height: 40px; color: #606266;}
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
</style>
