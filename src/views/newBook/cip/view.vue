<template>
  <div class="addImgResource cipView xywCss">
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
          <h5>书名与责任者项</h5>
          <el-form-item label="书名:" prop="bookName"  class="width360">
          <el-input v-model="imgForm.bookName" :disabled="vueStatus"></el-input>
        </el-form-item>
          <el-form-item label="卷（册）数:"  class="width360" prop="volumes">
            <el-input v-model="imgForm.volumes" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="并列书名:" prop="subBookName"  class="width360">
            <el-input v-model="imgForm.subBookName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="章回数:"  class="width360" prop="chapters">
            <el-input v-model="imgForm.chapters" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="正书名:"  class="width360" prop="mainBookName">
            <el-input v-model="imgForm.mainBookName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="说明文字:"  class="width360" prop="directions">
            <el-input v-model="imgForm.directions" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="分卷册书名:"  class="width360" prop="volumeBookName">
            <el-input v-model="imgForm.volumeBookName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="正文语种、各种文字对照:"  class="width360 labelLine" prop="mainBodyLanguage">
            <el-input v-model="imgForm.mainBodyLanguage" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="著作方式:"  class="width360" prop="workMethod">
            <el-input v-model="imgForm.workMethod" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="第一责任者:"  class="width360" prop="firstResponsiblePerson">
            <el-input v-model="imgForm.firstResponsiblePerson" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="著作方式:"  class="width360" prop="otherWorkMethod">
            <el-input v-model="imgForm.otherWorkMethod" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="其他责任者（包括分卷册责任者）:" :class="!vueStatus?'width360 seriesAuthor labelLine':'width360 labelLine'">
            <el-input  v-model="imgForm.otherResponsiblePerson" name="seriesAuthor" v-if="vueStatus" :disabled="vueStatus"></el-input>
            <div :class="authorError?'authorList redBorder':'authorList'" v-if="!vueStatus">
              <el-input v-for="(item,index) in seriesAuthor" :key="index" v-model="item.value" name="seriesAuthor"  :disabled="vueStatus" :style="{'marginTop':index>0?'5px':'0'}" style=""></el-input>
              <div class="tip" v-if="authorError">{{seriesAuthor.filter((itv)=>{return itv.value.length>20}).length>0?'输入内容长度小于20':'请填写其他责任者'}}</div>
            </div>
            <i class="el-icon-circle-plus" style="font-size: 24px;margin-top: 5px;cursor: pointer" @click="addAuthor" v-if="seriesAuthor[0].value&&!authorError&&!vueStatus"></i>

          </el-form-item>


          <!--<el-form-item label="其他责任者（包括分卷册责任者）:"  class="width360 labelLine" prop="otherResponsiblePerson">
            <el-input v-model="imgForm.otherResponsiblePerson" :disabled="vueStatus"></el-input>
          </el-form-item>-->
          <h5 style="color: #ff9933">版本及出版项</h5>
          <el-form-item label="版次:"  class="width360" prop="editionTimes">
            <el-input v-model="imgForm.editionTimes" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="印次:"  class="width360" prop="printTimes">
            <el-input v-model="imgForm.printTimes" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="其他版本形式:"  class="width360" prop="otherEditionForm">
            <el-input v-model="imgForm.otherEditionForm" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="与版本有关的责任者:"  class="width360 labelLine" prop="editionResponsiblePerson">
            <el-input v-model="imgForm.editionResponsiblePerson" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="责任编辑:"  class="width360" prop="editor">
            <el-input v-model="imgForm.editor" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="电话:"  class="width360" prop="phone">
            <el-input v-model="imgForm.phone" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="出版地:"  class="width360" prop="publisherPlace">
            <el-input v-model="imgForm.publisherPlace" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="出版者:"  class="width360" prop="publisher">
            <el-input v-model="imgForm.publisher" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="出版年月:"  class="width360" prop="publishDate">
            <el-input v-model="imgForm.publishDate" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="重印年月:"  class="width360" prop="reprintDate">
            <el-input v-model="imgForm.reprintDate" :disabled="vueStatus"></el-input>
          </el-form-item>
          <h5>载体形态项</h5>
          <el-form-item label="页数或卷册数:"  class="width360" prop="pagesOrVolumes">
            <el-input v-model="imgForm.pagesOrVolumes" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="图表:"  class="width360" prop="chart">
            <el-input v-model="imgForm.chart" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="成品尺寸:"  class="width360" prop="productSize">
            <el-input v-model="imgForm.productSize" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="附件:"  class="width360" prop="annex">
            <el-input v-model="imgForm.annex" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="字数:" prop="wordCount"  class="width360">
            <el-input v-model="imgForm.wordCount" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="印数:"  class="width360" prop="printCount">
            <el-input v-model="imgForm.printCount" :disabled="vueStatus"></el-input>
          </el-form-item>
          <h5>丛书项</h5>
          <el-form-item label="正丛书名:"  class="width360" prop="seriesName">
            <el-input v-model="imgForm.seriesName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="丛书编号:"  class="width360" prop="seriesNum">
            <el-input v-model="imgForm.seriesNum" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="并列丛书名:"  class="width360" prop="tiedSeriesName">
            <el-input v-model="imgForm.tiedSeriesName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="附属丛书名:"  class="width360" prop="attachedSeriesName">
            <el-input v-model="imgForm.attachedSeriesName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="附属丛书编号:"  class="width360" prop="attachedSeriesNum">
            <el-input v-model="imgForm.attachedSeriesNum" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="丛书责任者:"  class="width360" prop="seriesResponsiblePerson">
            <el-input v-model="imgForm.seriesResponsiblePerson" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="ISSN:"  class="width360" prop="issn">
            <el-input v-model="imgForm.issn" :disabled="vueStatus"></el-input>
          </el-form-item>
          <h5>付注项</h5>
          <el-form-item label="翻译图书的书名原文:"  class="width360 labelLine" prop="originalName">
            <el-input v-model="imgForm.originalName" :disabled="vueStatus"></el-input>
          </el-form-item>
          <h5>国际标准书号/装订形式/价格</h5>
          <el-form-item label="ISBN:"  class="width360" prop="isbnCopy">
            <el-input v-model="imgForm.isbnCopy" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="装订形式:"  class="width360" prop="bindingType">
            <el-input v-model="imgForm.bindingType" :disabled="vueStatus" prop="subheading"></el-input>
          </el-form-item>
          <el-form-item label="定价或估计:"  class="width360" prop="price">
            <el-input v-model="imgForm.price" :disabled="vueStatus" prop="subheading"></el-input>
          </el-form-item>
          <h5>提要项</h5>
          <el-form-item label="内容提要:"  :class="!vueStatus?'width360 requiredCss':'width360'"  label-width="140px" style="width: 100%">
            <tinymce
              :height="300"
              ref="editor"
              v-model="imgForm.summary"
              style="width:89%;"
              :disabled="vueStatus"
            ></tinymce>
            <div style="color: #F56C6C; font-size: 12px;" v-if="issummary&&!vueStatus">请输入内容提要</div>
          </el-form-item>
          <h5>排检项</h5>
          <el-form-item label="主题词:"  class="width360" prop="keywords">
            <el-input v-model="imgForm.keywords" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="分类号:"  class="width360" prop="classification">
            <el-input v-model="imgForm.classification" :disabled="vueStatus"></el-input>
          </el-form-item>

        </div>

        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;其他信息</h6>
          <el-form-item label="加急:" prop="expedited">
            <el-radio-group v-model="imgForm.expedited" :disabled="vueStatus">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="申请人:" class="width360" prop="applicant">
            <el-input v-model="imgForm.applicant" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="申请单位:" class="width360" prop="applicantUnit">
            <el-input v-model="imgForm.applicantUnit" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="申请时间:" class="width360">
            <el-date-picker
              v-model="imgForm.applicantTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd" :disabled="vueStatus">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="联系电话:" class="width360" prop="contactNumber">
            <el-input v-model="imgForm.contactNumber" :disabled="vueStatus"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;相关文件</h6>
          <el-form-item label="相关文件:">
            <div class="pdfCss" v-if="vueStatus">{{imgForm.relatedFile?imgForm.relatedFileName:'暂无文件'}}         <span v-if="fileList.length>0" @click="downFile(imgForm.relatedFile)" style="cursor: pointer;color: #4285F4">下载</span>
            </div>

            <el-upload
              class="upload-demo"
              :action="`${uploadUrl}${uploadPath}`"
              :limit="1"  :file-list="fileList"
              :on-exceed="handleFileExceed" :before-upload="beforeFileUpload" :on-success="handleFileSuccess"  multiple  :on-remove="handleFileRemove"  style="width: 80%"  v-if="!vueStatus"
            >
              <el-button  :loading="uploading" type="primary">选择文件</el-button>
              <span v-if="fileList.length>0" @click="downFile(imgForm.relatedFile)" style="cursor: pointer;color: #4285F4">下载</span>
            </el-upload>
            <!--<div class="el-upload__tip" v-if="!vueStatus">可上传文件类型包括Word、PDF，大小不超过2M</div>-->
            <div class="el-upload__tip" v-if="!vueStatus">可上传文件类型包括JPG、EXCEL、WORD、PDF，大小不超过2M</div>
          </el-form-item>
        </div>

        <!--审核意见-->
        <div class="tabwrapper1" v-if="((imgForm.stage=='4-5')&&($route.query.type=='distribution'))||(vueStatus&&auditLogs.length>0)"><!--vueStatus&&auditLogs.length>0&&-->
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;审核意见</h6>
          <el-form
            label-width="140px"
            class="demo-ruleForm"
            v-for="(item,index) in auditLogs"
            :key="index"
          >
            <el-form-item label="处  理 人：">
              <el-input v-model="item.auditorName" name="userName" style="width: 350px;" disabled></el-input>
            </el-form-item>
            <el-form-item label="审核状态：" class="width360">
              <span>{{item.status==1?'审核通过':'审核不通过'}}</span>
              <!--<el-radio-group v-model="item.status" disabled>
                <el-radio label="1">审核通过</el-radio>
                <el-radio label="0">审核不通过</el-radio>
              </el-radio-group>-->
            </el-form-item>
            <el-form-item label="处理时间:" class="width360">
              <el-input v-model="item.dealTime" name="dealTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="备注：" style="float: left;width:100%; display: block">
              <el-input v-model="item.remark" type="textarea" :rows="4" style="width:90%" resize="none" disabled></el-input>
            </el-form-item>

          </el-form>
        </div>

        <!--书号-->
        <div class="tabwrapper1" v-if="(vueStatus&&(imgForm.stage=='4-5'||imgForm.stage=='4-7'))||($route.query.type=='distribution'&&imgForm.stage=='4-6')">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;书号信息</h6>
          <el-form
            :model="examine"
            ref="examine"
            label-width="140px"
          >
            <el-form-item label="ISBN：" :prop="Boolean(imgForm.isbn&&(imgForm.stage=='4-5'||imgForm.stage=='4-7'))?'':'isbn'" :rules="[{ required: Boolean(imgForm.isbn&&(imgForm.stage=='4-5'||imgForm.stage=='4-7'))?false:true, message: `请输入ISBN`, trigger: 'change' },{ max: 20, message: `ISBN长度小于20`, trigger: 'change'}]">
              <el-input v-model="examine.isbn" name="isbn" style="width: 350px;" :disabled="Boolean(imgForm.isbn&&(imgForm.stage=='4-5'||imgForm.stage=='4-7'))"></el-input>
            </el-form-item>

            <el-form-item label="条码图片：" :class="!vueStatus&&'barCodeCss'"  :prop="Boolean(imgForm.isbn&&(imgForm.stage=='4-5'||imgForm.stage=='4-7'))?'':'barCode'" :rules="[{ required: Boolean(imgForm.isbn&&(imgForm.stage=='4-5'||imgForm.stage=='4-7'))?false:true, message: `请上传条码图片`, trigger: 'change' }]" style="width: 85%">
              <img :src="imgForm.barCode?`${uploadUrl}?fileName=${imgForm.barCode}&isOnLine=true`:'../../../static/img/picture.jpg'" alt="" v-if="imgForm.isbn&&(imgForm.stage=='4-5'||imgForm.stage=='4-7')" style="max-width: 150px;">
              <el-upload :action="`${uploadUrl}${uploadPath}/info`" :on-exceed="handleImgExceed" :before-upload="beforeImgUpload" :on-success="handleImgSuccess" multiple :limit="1" :file-list="imgList" :on-remove="handleImgRemove" v-if="(!imgForm.isbn||imgForm.isbn=='')&&imgForm.stage=='4-6'">
                <el-button :loading="uploadImging">选择文件</el-button>
                <!--<span>文件名</span>-->
              </el-upload>
              <span class="t"  v-if="(!imgForm.isbn||imgForm.isbn=='')&&imgForm.stage=='4-6'" style="color:#ccc">可上传包括JPG/PNG/GIF，小于3M的图片</span>
              <!--<div style="color: #F56C6C; font-size: 12px;" v-if="isbarCode">{{barCodeWord}}</div>-->
            </el-form-item>


          </el-form>
        </div>

        <!--CIP信息-->
        <div class="tabwrapper1" v-if="(vueStatus&&(imgForm.stage=='4-6'||imgForm.stage=='4-7'))||($route.query.type=='distribution'&&imgForm.stage=='4-5')"><!--$route.query.type=='distribution'-->
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;CIP信息</h6>
          <el-form-item label="图书在版编目（CIP）:" :class="vueStatus?'':'contentCss requiredCss'">
            <el-input v-model="content" name="content" type="textarea" :rows="4" style="width:90%;" resize="none" :disabled="Boolean(imgForm.cip&&(imgForm.stage=='4-6'||imgForm.stage=='4-7'))"></el-input>
            <div style="color: #F56C6C; font-size: 12px;" v-if="isContent">{{content.length>700?'图书在版编目输入长度小于700':'请输入图书在版编目'}}</div>
          </el-form-item>
          <el-form-item align="center" style="margin-left:0" v-if="imgForm.stage!='4-7'&&!imgForm.cip">
            <el-button type="primary" @click="cipSubmit">保存CIP</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </div>

        <el-form-item align="center" style="margin-right: 140px" v-if="!vueStatus">
          <el-button type="primary" @click="dataSubmit">保存</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>
        <div v-if="(vueStatus&&(imgForm.stage=='4-5'||imgForm.stage=='4-7'))||($route.query.type=='distribution'&&imgForm.stage=='4-6')">
          <el-form-item align="center" style="margin-right:140px" v-if="(!imgForm.isbn||imgForm.isbn=='')&&imgForm.stage=='4-6'" >
            <el-button type="primary" @click="examineSubmit">保存书号</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>
  import {uploadUrl, uploadPath, requestPath} from '@/utils/global.js';
  import Tinymce from "@/components/Tinymce";
  import {getDetailAPI,updateAPI,fillCipAPI,assignIsbnAPI,getAuditLogsAPI}  from '@/api/newBook/cip.js';

  import "@/styles/commonRe.css";
    export default {
        data() {
            return {
              uploadUrl: uploadUrl,
              uploadPath: uploadPath,
              uploading: false,
              uploadImging: false,
              imgForm:{
                summary:'',
                mainBodyLanguage:null,
                workMethod:null,
                firstResponsiblePerson:null,
                otherWorkMethod:null,
                editionTimes:null,
                printTimes:null,
                editor:null,
                phone:null,
                publishDate:null,
                productSize:null,
                seriesName:null,
                bindingType:null,
                price:null,
                expedited:null,
              },
              examine: {
                userName:'',
                isbn:'',
                barCode:null,
              },
              status: {
                '4-5': 'CIP分配',
                '4-6': '书号分配',

              },
              vueStatus:false,
              issummary:false,
              isbarCode:false,
              seriesAuthor:[{value:''}],
              isAuthor:[],
              authorError:false,
              fileList:[],
              imgList:[],
              barCode:'',
              barCodeWord:'',
              content:'',
              isContent:false,
              auditLogs:[],
              rules: {
                bookName: [{required: true, message: '请输入书名', trigger: 'change'},{max: 80, message: '书名输入长度小于80', trigger: 'change'}],
                volumes:[{max: 20, message: '卷（册）数输入长度小于20', trigger: 'change'}],
                subBookName:[{max: 80, message: '并列书名输入长度小于80', trigger: 'change'}],
                chapters:[{max: 20, message: '章回数输入长度小于20', trigger: 'change'}],
                mainBookName:[{max: 80, message: '正书名输入长度小于80', trigger: 'change'}],
                directions:[{max: 50, message: '说明文字输入长度小于50', trigger: 'change'}],
                volumeBookName:[{max: 80, message: '分卷册书名输入长度小于80', trigger: 'change'}],
                mainBodyLanguage: [{required: true, message: '请输入正文语种', trigger: 'change'},{max: 20, message: '输入内容长度小于20', trigger: 'change'}],
                workMethod: [{required: true, message: '请输入著作方式', trigger: 'change'},{max: 20, message: '输入内容长度小于20', trigger: 'change'}],
                firstResponsiblePerson: [{required: true, message: '请输入第一责任者', trigger: 'change'},{max: 20, message: '输入内容长度小于20', trigger: 'change'}],
                otherWorkMethod: [{required: true, message: '请输入著作方式', trigger: 'change'},{max: 20, message: '输入内容长度小于20', trigger: 'change'}],
                otherResponsiblePerson: [{required: true, message: '请输入其他责任者', trigger: 'change'},{max: 20, message: '输入内容长度小于20', trigger: 'change'}],
                seriesName: [{required: true, message: '请输入丛书名', trigger: 'change'},{max: 80, message: '丛书名输入长度小于80', trigger: 'change'}],
                seriesNum: [{max: 20, message: '丛书编号输入长度小于20', trigger: 'change'}],

                editionTimes: [{required: true, message: '请输入版次', trigger: 'change'},{max: 20, message: '版次输入长度小于20', trigger: 'change'}],
                printTimes: [{required: true, message: '请输入印次', trigger: 'change'},{max: 20, message: '印次输入长度小于20', trigger: 'change'}],
                otherEditionForm: [{max: 20, message: '其他版本形式输入长度小于20', trigger: 'change'}],
                editionResponsiblePerson: [{max: 20, message: '与版本有关的责任者输入长度小于20', trigger: 'change'}],
                editor: [{required: true, message: '请输入责任编辑', trigger: 'change'},{max: 30, message: '责任编辑输入长度小于30', trigger: 'change'}],
                phone: [{required: true, message: '请输入电话', trigger: 'change'},{pattern:/^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change'},],
                publisherPlace: [{max:20, message: '出版地输入长度小于20', trigger: 'change'},],
                publisher: [{max:20, message: '出版者输入长度小于20', trigger: 'change'},],

                publishDate: [{required: true, message: '请输入出版年月', trigger: 'change'},{max: 20, message: '出版年月长度小于20', trigger: 'change'}],
                reprintDate: [{max: 20, message: '重印年月输入长度小于20', trigger: 'change'}],
                wordCount: [{max: 10, message: '字数输入长度小于10', trigger: 'change'},],

                productSize: [{required: true, message: '请输入成品尺寸', trigger: 'change'},{max: 20, message: '成品尺寸输入长度小于20', trigger: 'change'},],

                pagesOrVolumes: [{max: 20, message: '页数或卷册数输入长度小于20', trigger: 'change'},],
                chart: [{max: 20, message: '图表输入长度小于20', trigger: 'change'},],
                annex: [{max: 20, message: '附件输入长度小于20', trigger: 'change'},],
                printCount: [{max: 20, message: '印数输入长度小于20', trigger: 'change'},],
                tiedSeriesName: [{max: 80, message: '并列丛书名输入长度小于80', trigger: 'change'},],
                attachedSeriesName: [{max: 80, message: '附属丛书名输入长度小于80', trigger: 'change'},],
                attachedSeriesNum: [{max: 20, message: '附属丛书编号输入长度小于20', trigger: 'change'},],
                seriesResponsiblePerson: [{max: 20, message: '丛书责任者输入长度小于20', trigger: 'change'},],
                issn: [{max: 20, message: 'ISSN输入长度小于20', trigger: 'change'},],
                originalName: [{max: 80, message: '翻译图书的书名原文输入长度小于80', trigger: 'change'},],

                bindingType: [{required: true, message: '请输入装订形式', trigger: 'change'},{max: 20, message: '装订形式输入长度小于20', trigger: 'change'}],
                price: [{required: true, message: '请输入定价或估计', trigger: 'change'},{pattern:/^(([1-9]\d{0,4})(\.\d{1,2})?|0\.([1-9][0]?|\d[1-9]))$/, message: '请输入0.1-99999之间的价格，最多保留小数点后两位', trigger: 'change'}],
                expedited: [{required: true, message: '请选择是否加急', trigger: 'change'},],
                contactNumber:[{pattern:/^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'change'}],
                userName: [{required: true, message: '请输入处理人', trigger: 'change'}],
                status: [{required: true, message: '请选择审核状态', trigger: 'change'}],
                auditOpinion: [{required: true, message: '请输入备注', trigger: 'change'}],
                isbnCopy: [{max: 20, message: 'ISBN输入长度小于20', trigger: 'change'}],
                keywords:[{max: 20, message: '主题词输入长度小于20', trigger: 'change'}],
                classification:[{max: 20, message: '分类号输入长度小于20', trigger: 'change'}],
                applicant:[{max: 20, message: '申请人输入长度小于20', trigger: 'change'}],
                applicantUnit:[{max: 30, message: '申请单位输入长度小于30', trigger: 'change'}],

              },
            }
        },
      created(){
        if (this.$route.fullPath.indexOf('editId') >= 0) {
          this.$route.meta.title = '修改书号/CIP管理';
          this.vueStatus = false;
        } else if (this.$route.fullPath.indexOf('lookId' )>= 0) {
          this.$route.meta.title = '查看书号/CIP管理';
          this.vueStatus = true;
        } else {
          this.$route.meta.title = '书号分配';
          this.vueStatus = false;
        }
        this.getDetail();
        this.getTime();
      },
      components: { Tinymce},
      watch:{
        seriesAuthor: {
          handler(newValue, oldValue) {
            this.isAuthor=newValue.filter((item)=>{
              return item.value!='';
            })
            if(this.isAuthor.length==0){
              this.authorError=true;
            }else{
              let arg=newValue.filter((item)=>{
                return item.value.length>20;
              })
              if(arg.length>0){
                this.authorError=true;
              }else{
                this.authorError=false;
              }

            }
            /*console.log('监听',this.isAuthor)*/
          },
          deep: true
        },
        'imgForm.summary'(n,o){
          this.issummary=(n&&(n.trim()!=''))?false:true;
        },
        /*barCode(n,o){
          if(!n||n==''){
            this.isbarCode=true;
            this.barCodeWord='请选择图片';
          }else{
            this.isbarCode=false;
          }
        },*/
        content(n,o){
          if(!n||n==''){
            this.isContent=true;
          }else{
            this.isContent=false;
          }
        },
        'examine.barCode'(n,o){
          if(n){
            this.$refs.examine.clearValidate('barCode');
          }

        },
      },
        methods: {
          getDetail(){
            this.fileList=[];
            getDetailAPI(this.$route.query.lookId||this.$route.query.editId).then(res=>{
              if(res.data.status){
                this.imgForm=res.data.data;
                /*if(this.imgForm.stage=='4-5'&&this.vueStatus){
                  this.$route.meta.title = 'CIP分配';
                }*/
                this.imgForm.summary=res.data.data.summary||'';
                this.content=res.data.data.cip||'';
                this.examine.isbn=res.data.data.isbn||'';
                if (this.$route.query.type=='distribution') {
                  this.$route.meta.title = this.status[this.imgForm.stage];

                }
                if(res.data.data.barCode){
                  /*/api/file/file/?fileName=c4840532fac240b38e8ccfedbcf57782&isOnLine=true*/
                  this.imgList=[{url:this.uploadUrl+`?fileName=${res.data.data.barCode}&isOnLine=true`}];
                }
                if(res.data.data.relatedFile){
                  let file={
                    name:res.data.data.relatedFileName,
                    url:this.uploadUrl+res.data.data.relatedFile,
                  };
                  this.fileList=[file];
                }
                if(this.imgForm.otherResponsiblePerson){
                  this.seriesAuthor=[];
                  let arg=this.imgForm.otherResponsiblePerson.match(/[^,]+/g);
                  arg.forEach((item)=>{
                    this.seriesAuthor=[...this.seriesAuthor,{value:item}];
                  })
                }
                this.getAuditLogs();
              }
            })
          },
          /*获取审核信息*/
          getAuditLogs(){
            getAuditLogsAPI(this.imgForm.id).then(res=>{
              if(res.data.status){
                this.auditLogs=res.data.data;
              }
            })
          },


          getTime(){
            var now = new Date();
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth();//得到月份
            var date = now.getDate();//得到日期

            var hour = now.getHours();//得到小时
            var minu = now.getMinutes();//得到分钟
            var sec = now.getSeconds();//得到秒
            this.examine.auditTime=year+'-'+(month>9?month:'0'+month)+'-'+(date>9?date:'0'+date)+' '+(hour>9?hour:'0'+hour)+':'+(minu>9?minu:'0'+minu)+':'+(sec>9?sec:'0'+sec);
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
          /*下载*/
          downFile(url){
            let openUrl=`${process.env.BASE_API}/file/file/download/${url}`;
            window.open(openUrl);
          },
          /*查看文件*/
          lookFile() {
          },
          handleFileExceed(files, fileList) {
            this.$message.warning(`单次上传最多1个文件`);
          },
          beforeFileUpload(file) {
            console.log(11112,file.type)


            const isPDF = file.type === 'application/pdf'||file.type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document'||file.type=='application/msword'||file.type=='image/jpeg'||file.type=="application/vnd.ms-excel"||file.type=="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            const isLt10M = file.size / 1024 / 1024 < 2;
            if (!isPDF) {
              this.$message.error('附件文件只能是 JPG、EXCEL、WORD、PDF 格式!')
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
          /*确定*/
          dataSubmit(){
            /*imgForm.otherResponsiblePerson*/
            this.$refs['ruleForm'].validate((valid) => {
              let boo=false;
              if(this.isAuthor.length==0){
                boo=true;
              }
              if(this.imgForm.summary.trim()==''){
                this.issummary=true;
              }else{
                this.issummary=false;
              }
              if(valid&&!boo&&!this.issummary){
                this.imgForm.otherResponsiblePerson='';
                this.isAuthor.forEach((item)=>{
                  this.imgForm.otherResponsiblePerson+=item.value+',';
                })
                this.imgForm.otherResponsiblePerson=this.imgForm.otherResponsiblePerson.substring(0,this.imgForm.otherResponsiblePerson.length-1);
                console.log(111,this.imgForm)

                updateAPI(this.imgForm).then(res=>{
                  if(res.data.status){
                    this.$message.success('编辑成功');
                    this.$router.go(-1);
                  }else{
                    this.$message.error(res.data.msg);
                  }
                })

              }
            })
          },
          /*上传图片*/
          handleImgExceed(files, fileList) {
            this.$message.warning(`单次上传最多1个文件`);
          },
          beforeImgUpload(file) {
            // console.log(file)
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
            const isLt3M = file.size / 1024 / 1024 < 3;
            if (!isJPG) {
              //this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
              this.isbarCode=true;
              this.barCodeWord='上传图片只能是 JPG/PNG/GIF 格式!';
              return isJPG
            }
            if (!isLt3M) {
              this.isbarCode=true;
              this.barCodeWord='上传图片大小不能超过 3MB!';
             // this.$message.error('上传图片大小不能超过 3MB!')
              return isLt3M
            }
            this.uploadImging = true
          },
          handleImgSuccess(response, file, fileList) {//请输入条码图片
            /*this.barCode=response.data.fileName;*/
            /*this.examine.barCode=response.data.fileName;*/
            this.$set(this.examine,'barCode',response.data.fileName);
            this.uploadImging = false;
          },
          handleImgRemove() {//删除pdf
            this.examine.barCode = '';
            this.$refs.examine.validateField("barCode")
          },
          /*书号信息保存*/
          examineSubmit(){
            this.$refs['examine'].validate((valid) => {
              /*if(!this.barCode||this.barCode==''){
                this.isbarCode=true;
                this.barCodeWord='请选择图片';
                return
              }*/
              if(valid){
                assignIsbnAPI({
                  ids:[this.imgForm.id],
                  isbn:this.examine.isbn,
                  barCode:this.examine.barCode}).then(res=>{
                  if(res.data.status){
                    this.$message.success('书号信息填写成功');
                    this.$router.go(-1);
                  }else{
                    this.$message.error(res.data.msg);
                  }
                })
              }
            })
          },
          /*保存CIP信息*/
          cipSubmit(){
            if(this.content==''||!this.content||this.content.length>700){
              this.isContent=true;
              return
            }else{
              this.isContent=false;
            }
            fillCipAPI({
              ids:[this.imgForm.id],
              content:this.content
            }).then(res=>{
              if(res.data.status){
                this.$message.success('填写CIP信息成功');
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
  .cipView {
    .el-form-item.width360 {
      width: 45%;
      display: inline-block;
      float: left;
    }
    .formbox {
      padding-left: 20px;
      background: #FFF;
      border: 1px solid #DCDFE6;
      -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      .tabwrapper1 {
        padding-top: 40px;
        display: block;
        h6{
          width: 100%;
          display: flex;
          justify-content: flex-start;
        }
        .content{
          display: flex;
          flex-direction: column;
          .el-form-item__content{margin-left: 0px!important;}
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
      h5{
        font-weight: normal;
        width: 200px;
        text-align: center;
        color: #ff9933
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
  .width360.requiredCss,.barCodeCss,.content.requiredCss{position: relative}
  .width360.requiredCss:before{
    content: '*';
    position: absolute;
    left: 60px;
    top:0;
    color:#F56C6C; font-size: 12px;
    height: 36px;
    line-height: 36px;
  }
  .content.requiredCss:before{
    content: '*';
    position: absolute;
    left: 3px;
    top:0;
    color:#F56C6C; font-size: 12px;
    height: 36px;
    line-height: 36px;
  }
  .barCodeCss:before{
    content: '*';
    position: absolute;
    left: 50px;
    top:0;
    color:#F56C6C; font-size: 12px;
    height: 36px;
    line-height: 36px;
  }
  .barCodeCss{
    img{max-width: 200px; max-height: 200px;}
  }
  .contentCss{position: relative;padding-left: 20px;}
  .contentCss:before{
    content: '*';
    position: absolute;
    left: 13px;
    top:0;
    color:#F56C6C; font-size: 12px;
    height: 36px;
    line-height: 36px;
  }
</style>
