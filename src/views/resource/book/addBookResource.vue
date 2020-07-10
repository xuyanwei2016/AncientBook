<template>
  <div class="addImgResource">
    <div class="formbox">
      <el-form
        :model="imgForm"
        ref="ruleForm"
        :rules="rules"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
          <el-tab-pane label="基本信息" name="first">
            <div class="tabwrapper">
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
              <el-form-item prop="name" label="图书名称:" class="width360">
                <el-input
                  v-model="imgForm.name"
                  v-validate="'required'"
                  data-vv-as="field"
                  data-vv-scope="baseInfo"
                  name="name"
                  :disabled="this.dialogStatus === 'view'"
                ></el-input>
              </el-form-item>
              <el-form-item label="副标题:" prop="subheading" class="width360">
                <el-input v-model="imgForm.subheading" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item prop="translatedNames" label="译名:" class="width360">
                <el-input
                  v-model="imgForm.translatedNames"
                  v-validate="'required'"
                  data-vv-as="field"
                  data-vv-scope="baseInfo"
                  name="translatedNames"
                  :disabled="this.dialogStatus === 'view'"
                ></el-input>
              </el-form-item>
              <el-form-item label="丛书名称:" prop="series" class="width360">
                <el-select v-model="imgForm.series" :disabled="this.dialogStatus === 'view'" placeholder="请选择">
                  <el-option label="请选择" :value="null"></el-option>
                  <el-option
                    v-for="item in bookNameList"
                    :key="item.id"
                    :label="item.seriesName"
                    :value="item.seriesName"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item prop="isbn" label="ISBN:" class="width360">
                <el-input
                  v-model="imgForm.isbn"
                  v-validate="'required'"
                  data-vv-as="field"
                  data-vv-scope="baseInfo"
                  name="isbn"
                  :disabled="this.dialogStatus === 'view'"
                ></el-input>
              </el-form-item>
              <el-form-item label="译者:" prop="translator" class="width360">
                <el-input v-model="imgForm.translator" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item prop="publisher" label="出版单位:" class="width360">
                <el-select
                  v-model="imgForm.publisher"
                  filterable
                  allow-create
                  default-first-option
                  :disabled="this.dialogStatus === 'view'"
                  placeholder="点击关联出版单位或手动输入">
                  <el-option
                    v-for="item in puboptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="languages" label="语种:" class="width360">
                <el-input
                  v-model="imgForm.languages"
                  v-validate="'required'"
                  data-vv-as="field"
                  data-vv-scope="baseInfo"
                  name="languages"
                  :disabled="this.dialogStatus === 'view'"
                ></el-input>
              </el-form-item>
              <el-form-item prop="publishTime" label="出版时间:" class="width360">
                <el-date-picker
                  type="month"
                  placeholder="出版时间"
                  v-model="imgForm.publishTime"
                  style="width: 100%;"
                  value-format="yyyy-MM"
                  v-validate="'required'"
                  data-vv-scope="baseInfo"
                  name="publishTime"
                  :disabled="this.dialogStatus === 'view'"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="主编:" prop="editor" class="width360">
                <el-input v-model="imgForm.editor" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item label="策划编辑:" prop="planningEditor" class="width360">
                <el-input v-model="imgForm.planningEditor" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item label="责任编辑:" prop="executiveEditor" class="width360">
                <el-input v-model="imgForm.executiveEditor" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item prop="author" label="作者:" class="width360">
                <el-select
                  value-key="id"
                  v-model="imgForm.author"
                  style="width:100%"
                  filterable
                  allow-create
                  default-first-option
                  :disabled="this.dialogStatus === 'view'"
                  placeholder="点击关联作者或手动输入">
                  <el-option
                    v-for="item in authors"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属部门:" prop="departmentId" class="width360">
                <el-select
                  v-model="imgForm.departmentId"
                  v-validate="'required'"
                  data-vv-scope="baseInfo"
                  :disabled="this.dialogStatus === 'view'"
                  name="department"
                  data-vv-as="selected"
                >
                  <el-option
                    v-for="item in departmentList"
                    :key="item.departmentId"
                    :label="item.departmentName"
                    :value="item.departmentId"
                  ></el-option>
                </el-select>
              </el-form-item>
             
              <!-- 为了样式好看请不要随意改动 -->
              <el-form-item class="width360" v-if="showInputName">
                <el-input v-model="authorName" :disabled="this.dialogStatus === 'view'" class="author-input" placeholder="请输入作者"></el-input>
              </el-form-item>
              <el-form-item label="关键词:" prop="keywords">
                <el-input v-model="imgForm.keywords" :disabled="this.dialogStatus === 'view'" placeholder="多个关键词用逗号隔开"></el-input>
              </el-form-item>
              <el-form-item label="广告语:" prop="advertising">
                <el-input v-model="imgForm.advertising" :disabled="this.dialogStatus === 'view'" type="textarea" placeholder="商品卖点、广告语等"></el-input>
              </el-form-item>
              <el-form-item prop="cover" label="图书封面:" class="width100">
                <el-upload
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  list-type="picture-card"
                  :on-preview="handlePreview"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :disabled="this.dialogStatus === 'view'"
                  :on-remove="handleRemove"
                  :show-file-list="false"
                >
                  <!-- <img v-if="!imageUrl" src="@/assets/img/bookDefault.png" alt=""> -->
                  <img
                    style="width:100%;height:100%;"
                    v-if="imageUrl"
                    :src="imageUrl"
                    class="avatar"
                  >
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item prop="dataType" label="数据类型:" style="width:92%;">
                <el-radio-group v-model="imgForm.dataType" :disabled="this.dialogStatus === 'view'">
                  <el-radio :label="0">纸质版</el-radio>
                  <el-radio :label="1">电子版</el-radio>
                  <el-radio :label="2">纸质版+电子版</el-radio>
                  <el-radio :label="3">其他</el-radio>
                </el-radio-group>
                <span>{{ errors.first('dataType') }}</span>
                <span class="recomment">标识平台数据有无实体数据和电子数据</span>
              </el-form-item>
              
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;发行信息</h6>
              <el-form-item prop="edition" class="width360" label="版次:">
                <!-- <span slot="label">
                  <em>*</em>版次:
                </span>-->
                <el-input
                  v-model="imgForm.edition"
                  v-validate="'required'"
                  data-vv-as="field"
                  data-vv-scope="baseInfo"
                  name="edition"
                  :disabled="this.dialogStatus === 'view'"
                ></el-input>
                <span>{{ errors.first('edition') }}</span>
              </el-form-item>
              <el-form-item label="装帧:" prop="binding" class="width360">
                <el-input :disabled="this.dialogStatus === 'view'" v-model="imgForm.binding"></el-input>
              </el-form-item>
              <el-form-item prop="format" label="开本:" class="width360">
                <el-input
                  v-model="imgForm.format"
                  v-validate="'required'"
                  data-vv-as="field"
                  data-vv-scope="baseInfo"
                  :disabled="this.dialogStatus === 'view'"
                  name="format"
                ></el-input>
              </el-form-item>
              <el-form-item prop="print" label="印次:" class="width360">
                <el-input
                  v-model="imgForm.print"
                  v-validate="'required'"
                  data-vv-as="field"
                  data-vv-scope="baseInfo"
                  :disabled="this.dialogStatus === 'view'"
                  name="print"
                ></el-input>
              </el-form-item>
              <el-form-item prop="wordCount" label="字数:" class="width360">
                <el-input
                  v-model="imgForm.wordCount"
                  v-validate="'required'"
                  data-vv-as="field"
                  data-vv-scope="baseInfo"
                  :disabled="this.dialogStatus === 'view'"
                  name="wordCount"
                ></el-input>
              </el-form-item>
              <el-form-item prop="sela" label="印张:" class="width360">
                <el-input
                  v-model="imgForm.sela"
                  v-validate="'required'"
                  data-vv-as="field"
                  data-vv-scope="baseInfo"
                  :disabled="this.dialogStatus === 'view'"
                  name="sela"
                ></el-input>
              </el-form-item>
              <el-form-item label="包册:" prop="packages" class="width360">
                <el-input v-model="imgForm.packages" :disabled="this.dialogStatus === 'view'"></el-input>
              </el-form-item>
              <el-form-item label="防伪码正版提示语:" prop="genuineHint">
                <el-input type="textarea" :disabled="this.dialogStatus === 'view'" v-model="imgForm.genuineHint"></el-input>
              </el-form-item>
              <el-form-item label="防伪码盗版提示语:" prop="pirateHint">
                <el-input type="textarea" :disabled="this.dialogStatus === 'view'" v-model="imgForm.pirateHint"></el-input>
              </el-form-item>
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;分类信息</h6>
              <el-form-item prop="diyTypeId" label="自定义分类:">
                <treeselect
                  placeholder="请选择"
                  v-model="imgForm.diyTypeId"
                  :flat="true"
                  :multiple="true"
                  :options="treeSelectOptions"
                  data-vv-scope="baseInfo"
                  :normalizer="normalizer"
                  :loadOptions='loadOptions'
                  :auto-load-root-options="false"
                  v-validate="'required'"
                  @input="selfChoose"
                  @select="selectFun"
                  @deselect="deselectFun"
                  :disabled="this.dialogStatus === 'view'"
                  
                />
              </el-form-item>
              <!--自定义标签-->
              <ul>
                <li v-for="(value, index) in labelList" :key="index">
                  <el-form-item :label="value.name + ':'" prop="tablist" >
                    <customLabel
                      :indx="index"
                      :getLabel="getnewLabel"
                      :arraylist="value.list||[]"
                      :defaultValue="defaultValue"
                      :labelValue="value"
                      :tabDefine="imgForm.tablist"
                      :dialogStatus="dialogStatus"
                    ></customLabel>
                  </el-form-item>
                </li>
              </ul>
              <!-- 产品要求隐藏纸质书信息，包裹div隐藏，需要在打开  start-->
              <div>
                <h6>&nbsp;&nbsp;|&nbsp;&nbsp;纸质书信息</h6>
                <el-form-item label="书代号:" prop="bookCode" class="width360">
                  <el-input v-model="imgForm.bookCode" :disabled="this.dialogStatus === 'view'"></el-input>
                </el-form-item>
                <el-form-item label="SKU编码:" prop="skucode" class="width360">
                  <el-input v-model="imgForm.skucode" :disabled="this.dialogStatus === 'view'"></el-input>
                </el-form-item>
                <el-form-item label="重量:" prop="weight" class="width360">
                  <el-input v-model="imgForm.weight" class="weight" :disabled="this.dialogStatus === 'view'"></el-input>
                  <span>千克</span>
                </el-form-item>
                <el-form-item label="商品权重:" prop="commodityWeight" class="width360">
                  <el-input v-model="imgForm.commodityWeight" :disabled="this.dialogStatus === 'view'"></el-input>
                </el-form-item>
                <el-form-item label="邮费选择:" prop="postage" class="width360">
                  <el-select v-model="imgForm.postage" :disabled="this.dialogStatus === 'view'">
                    <el-option label="免费" :value="0"></el-option>
                    <el-option label="付费" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="基础销量:" prop="basicSales" class="width360">
                  <el-input v-model="imgForm.basicSales" :disabled="this.dialogStatus === 'view'" class="weight"></el-input>万本
                </el-form-item>
                <el-form-item label="预售提示语:" prop="presaleHint">
                  <el-input type="textarea" :disabled="this.dialogStatus === 'view'" v-model="imgForm.presaleHint"></el-input>
                </el-form-item>
              </div>
              <!-- 产品要求隐藏纸质书信息，包裹div隐藏，需要在打开  end-->
            </div>
          </el-tab-pane>
          <el-tab-pane label="资源内容" name="second">
            <div class="tabwrapper">
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;展示信息</h6>
              <el-form-item prop="video" class="width100">
                <span slot="label">展示视频:</span>
                <p class="alert-info">支持AVI、WMV、RMVB、MP4、MOV、FLV等格式，时长不超过1分钟，大小不超过20M</p>

                <el-upload
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}/video`"
                  class="upload-demo"
                  :on-preview="handleBookPreview"
                  :before-upload="beforeBookUpload"
                  :on-success="handleBookSuccess"
                  :disabled="this.dialogStatus === 'view'"
                  :on-remove="handleBookRemove"
                  :show-file-list="false"
                  accept='.avi,.wmv,.rmvb,.mp4,.mov,.flv'
                  multiple
                >
                  <el-button
                    style="backgorund:#409eff;"
                    size="small"
                    type="primary"
                    :loading="loadAnimation"
                    v-if="hiddenViewButton"
                  >点击上传</el-button>
                </el-upload>
                <video
                  style="width:360px;height:180px;margin-top:10px;"
                  v-if="videoUrl"
                  :src="videoUrl"
                  controls
                  class="video"
                ></video>
              </el-form-item>

              <el-form-item label="商品相册:" class="width100">
                <p class="alert-info">上传商品展示图，最多不超过20张，仅支持jpg、jpeg、png、gif、png格式，单张图大小不超过2M</p>
                <el-upload
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  list-type="picture-card"
                  :on-preview="handlePhotoPreview"
                  :before-upload="beforePhotoUpload"
                  :on-success="handlePhotoSuccess"
                  :disabled="this.dialogStatus === 'view'"
                  :on-remove="handlePhotoRemove"
                  :limit="20"
                  :file-list="fileList"
                  multiple
                >
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogPicVisible">
                  <img width="100%" :src="imageUrl" alt>
                </el-dialog>
              </el-form-item>
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;资源内容</h6>
              <el-form-item label prop="content" class="content">
                <el-tabs v-model="tabName">
                  <el-tab-pane label="编辑推荐" name="tab1" class="content">
                    <tinymce
                      :height="300"
                      ref="editor"
                      v-model="imgForm.editorsChoice"
                      style="width:99%;"
                      :disabled="this.dialogStatus === 'view'"
                    ></tinymce>
                  </el-tab-pane>
                  <el-tab-pane label="图书简介" name="tab2" class="content">
                    <tinymce
                      :height="300"
                      ref="editor"
                      v-model="imgForm.bookIntro"
                      style="width:99%;"
                      :disabled="this.dialogStatus === 'view'"
                    ></tinymce>
                  </el-tab-pane>
                  <el-tab-pane label="图书目录" name="tab3" class="content">
                    <tinymce
                      :height="300"
                      ref="editor"
                      v-model="imgForm.bookCatalog"
                      :disabled="this.dialogStatus === 'view'"
                      style="width:99%;"
                    ></tinymce>
                  </el-tab-pane>
                  <el-tab-pane label="作者简介" name="tab4" class="content">
                    <tinymce :height="300" :disabled="this.dialogStatus === 'view'" ref="editor" v-model="imgForm.authorIntro" style='width:99%;'></tinymce>
                  </el-tab-pane>
                  <el-tab-pane label="详细介绍" name="tab5" class="content">
                    <tinymce
                      :height="300"
                      ref="editor"
                      v-model="imgForm.detailedIntro"
                      style="width:99%;"
                      :disabled="this.dialogStatus === 'view'"
                    ></tinymce>
                  </el-tab-pane>
                </el-tabs>
              </el-form-item>
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;阅读文件</h6>
              <p style="margin-left:50px;margin-bottom:20px;" class="alert-info">请上传资源的阅读文件，至少上传一种文件</p>
              <el-form-item label="PDF成品文件:" label-width="150px">
                <el-radio-group v-model="imgForm.pdfResourceType" :disabled="this.dialogStatus === 'view'" @change="changePDF">
                  <el-radio :label="1">上传PDF资源</el-radio>
                  <el-radio :label="2">绑定已有PDF资源</el-radio>
                </el-radio-group>
                <a class="el-upload-list__item-name" v-if="rebackpdf&&imgForm.pdfName">
                  <i class="el-icon-document"></i>
                  {{imgForm.pdfName}}
                </a>
                <el-upload
                  v-if="imgForm.pdfResourceType=='1'"
                  class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :before-upload="beforePDFUpload"
                  :on-success="handlePDFSuccess"
                  :limit="1"
                  :on-remove="handlePDFRemove"
                  :disabled="this.dialogStatus === 'view'"
                  accept="application/pdf"
                >
                  <el-button v-if="hiddenViewButton" size="small" type="primary">点击上传</el-button>
                </el-upload>
                <div v-if="imgForm.pdfResourceType=='2'">
                  <el-button type="primary" size="small" @click="choosePdf('pdf')">选择文件</el-button>
                </div>
              </el-form-item>
              <el-form-item label="视频成品文件:" label-width="150px">
                <el-radio-group v-model="imgForm.videoResourceType" :disabled="this.dialogStatus === 'view'" @change="changeVideo">
                  <el-radio :label="1">上传视频资源</el-radio>
                  <el-radio :label="2">绑定已有视频资源</el-radio>
                </el-radio-group>
                <a class="el-upload-list__item-name" v-if="rebackvideo&&imgForm.videoName">
                  <i class="el-icon-document"></i>
                  {{imgForm.videoName}}
                </a>
                <el-upload
                  v-if="imgForm.videoResourceType=='1'"
                  class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :before-upload="beforeVideoUpload"
                  :on-success="handleVideoSuccess"
                  :on-preview="handleVideoPreview"
                  :on-remove="handleVideoRemove"
                  accept="video/*"
                  :limit="1"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-button v-if="hiddenViewButton" size="small" type="primary">点击上传</el-button>
                </el-upload>
                <div v-if="imgForm.videoResourceType=='2'">
                  <el-button type="primary" size="small" @click="chooseVideo('video')">选择文件</el-button>
                </div>
              </el-form-item>
              <el-form-item label="音频成品文件:" label-width="150px">
                <el-radio-group v-model="imgForm.audioResourceType" :disabled="this.dialogStatus === 'view'" @change="changeAudio">
                  <el-radio :label="1">上传音频资源</el-radio>
                  <el-radio :label="2">绑定已有音频资源</el-radio>
                </el-radio-group>
                <a class="el-upload-list__item-name" v-if="rebackaudio&&imgForm.audioName">
                  <i class="el-icon-document"></i>
                  {{imgForm.audioName}}
                </a>
                <el-upload
                  v-if="imgForm.audioResourceType=='1'"
                  class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :before-upload="beforeAudioUpload"
                  :on-success="handleAudioSuccess"
                  :on-preview="handleAudioPreview"
                  :on-remove="handleAudioRemove"
                  accept="audio/*"
                  :limit="1"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-button v-if="hiddenViewButton" size="small" type="primary">点击上传</el-button>
                </el-upload>
                <div v-if="imgForm.audioResourceType=='2'">
                  <el-button type="primary" size="small" @click="chooseAudio('audio')">选择文件</el-button>
                </div>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="商品信息" name="third">
            <div class="tabwrapper">
              <h6>&nbsp;&nbsp;|&nbsp;&nbsp;商品信息</h6>
              <el-form-item prop="dataSources" label="数据来源:">
                <el-radio-group
                  :disabled="this.dialogStatus === 'view'"
                  v-model="imgForm.dataSources"
                  v-validate="'required'"
                  data-vv-scope="resourceInfo"
                >
                  <el-radio :label="0">本版</el-radio>
                  <el-radio :label="1">外版</el-radio>
                </el-radio-group>
                <span class="alert-info" style="margin-left:50px;">选择外版后请填写或者关联合同信息</span>
              </el-form-item>
              <el-form-item prop="salesStatus" style="width:100%" label="销售状态:">
                <el-radio-group
                  v-model="imgForm.salesStatus"
                  v-validate="'required'"
                  data-vv-scope="resourceInfo"
                  :disabled="this.dialogStatus === 'view'"
                >
                  <el-radio :label="1">可售</el-radio>
                  <el-radio :label="2">不可售</el-radio>
                </el-radio-group>

                <span
                  class="alert-info"
                  style="margin-left:50px;"
                >设置为可售商品在子站前台可以在线销售和阅读，设置为不可售前台仅展示介绍信息</span>
              </el-form-item>
              <el-form-item prop="sellstate">
                <span slot="label">设置价格:</span>
                <div class="dashed">
                  <h2>纸质书价格</h2>
                  <el-form-item label="定价:" prop="bookPrice" style="margin-bottom:25px">
                    <el-input :disabled="this.dialogStatus === 'view'" v-model="imgForm.bookPrice" class="width220"></el-input>&nbsp;元
                    <span class="alert-info" style="margin-left:50px;">在前台展示为划线价格</span>
                  </el-form-item>
                  <el-form-item  label="售价:" prop="bookSellingPrice">
                    <el-input :disabled="this.dialogStatus === 'view'" v-model="imgForm.bookSellingPrice" class="width220"></el-input>&nbsp;元
                  </el-form-item>
                </div>
                <div class="dashed">
                  <h2>电子书价格</h2>
                  <el-form-item label="定价:" prop="price" style="margin-bottom:25px">
                    <el-input :disabled="this.dialogStatus === 'view'" v-model="imgForm.price" class="width220"></el-input>&nbsp;元
                    <span class="alert-info" style="margin-left:50px;">在前台展示为划线价格</span>
                  </el-form-item>
                  <el-form-item label="售价:" prop="priceType">
                    <el-radio-group :disabled="this.dialogStatus === 'view'" v-model="imgForm.priceType"  v-validate="'required'">
                        <el-radio  :label="1">付费</el-radio>
                        <el-radio  :label="2">免费</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    v-if="imgForm.priceType=='1'"
                    prop="sellingPrice"
                    :label="imgForm.priceType=='1'?'售价:':''"
                  >
                    <span>{{ errors.first('sellingPrice') }}</span>
                    <el-input
                      v-if="imgForm.priceType == 1"
                      v-model="imgForm.sellingPrice"
                      :disabled="this.dialogStatus === 'view'"
                      style="width:222px;"
                    ></el-input>
                    <span v-if="imgForm.priceType == 1">元</span>
                  </el-form-item>
                </div>
              </el-form-item>
              <el-form-item label="相关合同:" prop="agreement" class="width360">
                <el-button v-if="hiddenViewButton" type="primary" @click="getRelatedList" size="small">选择合同</el-button>
                <!-- <span style="color:#a2adbd">可手动添加合同信息或者选择合同库文件</span> -->
              </el-form-item>
              <el-form-item prop="contractNumber">
                <el-input
                  style="width:325px "
                  :disabled="this.dialogStatus === 'view'"
                  v-model="imgForm.contractNumber"
                  placeholder="合同编号"
                  
                ></el-input>
              </el-form-item>
              <el-form-item prop="contractName">
                <el-input
                  style="width:325px"
                  :disabled="this.dialogStatus === 'view'"
                  v-model="imgForm.contractName"
                  placeholder="合同名称"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="有效日期:"
                prop="effectivedate"
                style="width:550px;"
                class="timeitem"
              >
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="imgForm.startDate"
                    value-format="yyyy-MM-dd"
                    style="width: 100%;"
                    :disabled="this.dialogStatus === 'view'"
                  ></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">至</el-col>
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="imgForm.endDate"
                    style="width: 100%;"
                    value-format="yyyy-MM-dd"
                    :disabled="this.dialogStatus === 'view'"
                  ></el-date-picker>
                </el-col>
                <p class="animation-error" style="margin-top:40px;" v-if="canUseDate">请输入有效的时间段</p>
              </el-form-item>
            </div>
          </el-tab-pane>

          <!-- 
          <el-tab-pane label="版权" name="ninth" v-if="this.dialogStatus==='view'">
            
            <div class="recordtable">
              <div class="downLoadFile" @click="downloadJgwj"><el-button type="primary">下载</el-button></div>
              <el-table :data="processData3" border @selection-change="handleSelectionJgwj">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="名称" align="left"></el-table-column>
                <el-table-column prop="type" label="文件类型" align="left">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type==0">文件</span>
                    <span v-if="scope.row.type==1">文件夹</span>
                  </template>
                </el-table-column>
                <el-table-column prop="size" align="center" label="大小"></el-table-column>
                <el-table-column prop="timestamp" align="center" label="上传时间"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane> -->
          
          <el-tab-pane label="原始文件" name="fourth" v-if="dialogStatus!='add'">
            <div class="initfiles">
              <div class="upload" v-if="this.dialogStatus==='update'||this.dialogStatus==='add'">
                <el-upload
                  class="uploadfile"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :on-preview="handleFPreview"
                  :on-remove="handleFRemove"
                  :on-success="handleFSuccess"
                  :before-upload="beforeFUpload"
                  :multiple="false"
                  :show-file-list="false"
                >
                  <el-button size="small" type="primary" v-if="hiddenViewButton" class="mag-bot-15">
                    <i class="el-icon-upload"></i>上传文件
                  </el-button>
                </el-upload>
                <span class="recomment">可通过该模块管理资源的宣传材料、相关附件等文件</span>
              </div>

              <div class="uploadList">
                <el-table :data="tableData" border>
                  <el-table-column prop="originalFileName" label="名称" align="center">
                    <template slot-scope="scope">
                      <router-link  :to="`/resource/annex/picture?fileName=${scope.row.fileName}&fileType=${scope.row.suffixName}`">{{scope.row.originalFileName}}</router-link>
                      <!-- <span v-else>{{scope.row.originalFileName}}</span> -->
                    </template>
                  </el-table-column>
                  <el-table-column prop="size" label="大小" align="center"></el-table-column>
                  <el-table-column prop="createTime" align="center" label="上传时间"></el-table-column>
                  <el-table-column label="操作" align="center" >
                    <template slot-scope="scope">
                      <el-button
                        @click="handleDel(scope.row.id,scope.row.fileName)"
                        type="text"
                        size="small"
                        v-if="dialogStatus!='view'"
                      >删除</el-button>
                      <el-button @click="handleDown(scope.row.fileName)" type="text" size="small">下载</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- <div class="btncenter">
                  <el-button @click="goback">上一步,填写资源信息</el-button>
                  <el-button @click="fininsh">完成,提交内容</el-button>
                </div>-->
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="操作记录" name="sixth" v-if="this.dialogStatus==='view'">
            <div class="recordtable">
              <el-table :data="recordData" border>
                <el-table-column prop="name" label="操作名称" align="center"></el-table-column>
                <el-table-column prop="name" label="操作类型" align="center"></el-table-column>
                <el-table-column prop="createrAccount" label="操作人" align="center"></el-table-column>
                <el-table-column prop="createTime" label="操作时间" align="center"></el-table-column>
                <el-table-column prop="ip" label="IP" align="center"></el-table-column>
              </el-table>
              <!-- 底部 -->
              <div class="prfooter">
                <div class="prfooterright">
                  <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
                </div>
              </div>
              <!-- 底部 -->
            </div>
          </el-tab-pane>
          <div class="btncenter">
            <el-button type="primary" @click="save('ruleForm')" v-if="dialogStatus!='view'">保存</el-button>
            <el-button @click="reset" class="cancel">取消</el-button>
          </div>
        </el-tabs>
      </el-form>
    </div>
    <el-dialog
      title="相关资源列表"
      :visible.sync="dialogPDFVisible"
      width="80%"
      :before-close="handlePDFClose"
    >
      <el-form ref="form" inline label-width="90px">
        <!-- <el-form-item label="资源类型" style="margin-right:20px">
          <el-select v-model="listPDFQuery.resourceType" placeholder="全部">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(value,key) in typeList"
              :key="key"
              :label="value"
              :value="key"
            >{{value}}</el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="资源名称:">
          <el-input v-model="listPDFQuery.name"></el-input>
        </el-form-item>
        <el-form-item class="width90" style="margin-right:20px;">
          <el-button type="primary" @click="onpdfSubmit" class="search">检索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        height="500"
        border
        v-loading="listpdfLoading"
        element-loading-text="给我一点时间"
        ref="multipleTable1"
        :data="pdfList"
        tooltip-effect="dark"
        @selection-change="handlepdfSelectionChange"
      >
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column type="selection" align="center"></el-table-column>

        <el-table-column label="资源名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>

        <el-table-column label="上传时间" align="center">
          <template slot-scope="scope">{{scope.row.uploadTime}}</template>
        </el-table-column>
      </el-table>
      <div style="background:#393f5b" class="dialog_prfooter">
        <pagination @pagesize="pdfpagesizeFun" :total="pdftotal" @currentPage="pdfcurrentPageFun"></pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm">确 定</el-button>
        <el-button @click="dialogPDFVisible = false;listPDFQuery.name=''">取 消</el-button>
      </span>
    </el-dialog>
    <!--关联内容-->
    <el-dialog title="关联合同" :visible.sync="relatedDialog" class="backgroundDialog relatedDialog">
      <el-form
        :model="relatedForm"
        label-width="120"
        style="margin-bottom:5px;"
        inline
        class="relatedFormInput"
      >
        <el-form-item label="合同编号">
          <el-input v-model="relatedForm.identifier" clearable></el-input>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="relatedForm.name" clearable></el-input>
        </el-form-item>
        <el-button type="primary" @click="handleFilter">检索</el-button>
      </el-form>
      <el-table
        border
        ref="multipleTable2"
        :data="relateList"
        tooltip-effect="dark"
        style="background:#ccc;"
      >
        <el-table-column align="center" width="50">
          <template slot-scope="scope">
            <el-radio v-model="checkedRelatedList" :label="scope.row">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="合同名称" align="center" width="180"></el-table-column>
        <el-table-column prop="identifier" label="合同编号" align="center" width="180"></el-table-column>
        <el-table-column prop="signingTime" label="签订时间" align="center" width="180"></el-table-column>
        <el-table-column prop="secondParty" label="乙方" align="center"></el-table-column>
      </el-table>
      <div class="prfooter">
        <pagination
          @pagesize="pagesizeFun2"
          :total="total2"
          @currentPage="currentPageFun2"
          ref="child"
        ></pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmRelated">确 定</el-button>
        <el-button @click="cancelRelated">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  addAPI,
  updateAPI,
  getInfoAPI,
  getAuthorsAPI,
  downLoadFileAPI
} from "@/api/resource/ebook";
import { getLabelAPI } from "@/api/resourcenew/picture";
import {
  updateTypeAPI,
  getTreeAPI,
  fileListAPI,
  uploadFileListAPI,
  bookNameListAPI,
  files,
  delFileListAPI,
  getDepartmentAPI,
  getTypeAPI,
  getProcessAPI,
  getCopyrightListAPI,
  sectionAPI
} from "@/api/resource/common";
import {
  operationMsg,
  requestMsg,
  errorMsg,
  confirm,
  compareDate,
  getFileSize
} from "@/utils/publicFunctions";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import Tinymce from "@/components/Tinymce";
import {getAllListAPI} from "@/api/business/publish";  
import customLabel from "@/components/customLabel";
import pagination from "../components/pagination";
import imgDefault from "@/assets/img/bookDefault.png";
import "@/styles/resource.scss";
import "@/styles/commonRe.css";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getRelatedListAPI,getTypeSetAPI } from "@/api/resource/ebook";
export default {
  name: "add_bookRes",
  data() {
    return {
      puboptions: [],  
      canUseDate: "",
      hiddenViewButton: false,
      id: "",
      checkedRelatedList: [],
      relateList: [],
      relatedDialog: false,
      timeList: [],
      total: 0,
      total2: 0,
      total3: 0,
      total4: 0,
      total5: 0,
      total6: 0,
      relatedForm: {
        type: 1
      },
      checkedRelated: false,
      priceType: 2,
      departmentList: [],
      tokens: "", //附件
      authors: [],
      authorName: "",
      showInputName: false,
      //丛书名称
      bookNameList: [],
      fileForm: {
        pageNum: 1,
        pageSize: 50
      },
      uploadFileList: {
        oid: "",
        token: ""
      },
      fileList: [],
      typeList: [],
      videoUrl: "",
      tabName: "tab1",
      activeName: "first",
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      uploading: false,
      uploadingBook: false,
      uploadingPhoto: false,
      rebackpdf: false,
      rebackaudio: false,
      rebackvideo: false,
      imageUrl: imgDefault,
      tableData: [],
      fileListPDF: [],
      fileListVideo: [],
      fileListAudio: [],
      tableKey: 0,
      defaultProps: {
        children: "list",
        label: "showName"
      },
      loadAnimation: false,
      imgForm: {},
      textMap: {
        update: "修改图书信息",
        add: "添加图书信息"
      },
      recordData: [],
      total: 10,
      pdfStatus: 1,
      audioStatus: 1,
      videoStatus: 1,
      chooseFile: "",
      imgForm: {
        goodsCode:'',
        pages:'',
        videoName: "",
        pdfName: "",
        audioName: "",
        series: "",
        advertising: "",
        author: "",
        basicSales: "",
        binding: "",
        bookCode: "",
        showVideo: "",
        status: 0,
        commodityWeight: "",
        pdfResourceType: "",
        videoResourceType: "",
        videoResourceType: "",
        cover: "",
        pdf: "",
        audio: "",
        video: "",
        dataType: 0,
        department: "",
        departmentId:"",
        dataSources: 0,
        diyTypeCode: [],
        diyTypeId: [],
        salesStatus: 1,
        radioPrice: 1,
        edition: "",
        editor: "",
        bookPrice: "",
        executiveEditor: "",
        format: "",
        genuineHint: "",
        bookPrice: "",
        bookSellingPrice: "",
        price: "",
        sellingPrice: "",
        isbn: "",
        keywords: "",
        labelContentCode: [],
        labelContentId: [],
        labelId: [],
        languages: "",
        name: "",
        packages: "",
        contractNumber: "",
        contractName: "",
        pirateHint: "",
        planningEditor: "",
        postage: 0,
        print: "",
        number: "",
        publishTime: "",
        publishBookTime:'',
        publisher: "",
        sela: "",
        skucode: "",
        startDate: "",
        subheading: "",
        translatedNames: "",
        translator: "",
        weight: null,
        wordCount: "",
        endDate: "",
        relatedContracts: "",
        goodsCover: [],
        tabDefine1: [],
        tabDefine2: [],
        tablist: [],
        contractList: []
      },
      inputValue1: "",
      inputValue2: "",
      dialogStatus: "",
      dialogPicVisible: false,
      dialogPDFVisible: false,
      treeSelectOptions: [],
      listpdfLoading: true,
      listPDFQuery: {
        pageNum: 1,
        pageSize: 50
      },
      selectList: [],
      pdfList: [],
      pdftotal: null,
      rules: {
        name: [
          { required: true, message: "请输入图书名称" },
          { max: 80, message: "图书库的长度必须小于80个字符" }
        ],
        pages:[{ max: 20, message: "页数长度必须小于20个字符" }],
        goodsCode:[{max: 30, message: "分类号的长度必须小于30个字符"}],
        converter:[{max: 30, message: "加工商的长度必须小于30个字符"}],
        publishBookTime:[{ required: true, message: "请输入出书时间" }],
        subheading: [{ max: 80, message: "副标题的长度必须小于80个字符" }],
        translator:[{max:30,message:'译者的长度必须小于30个字符'}],
        translatedNames: [
          //{ required: true, message: "请输入译名" },
          { max: 80, message: "译名的长度必须小于80个字符" }
        ],
        isbn: [
          { required: true, message: "请输入ISBN" },
          { pattern: /^\S{0,20}$/, message: "请输入除空格以外的任何字符，长度小于20" }
        ],
        publisher: [
          { required: true, message: "请输入出版单位" },
          { max: 30, message: "出版单位的长度必须小于30个字符" }
        ],
        languages: [
          { required: true, message: "请输入语种" },
          { max: 10, message: "语种长度不超过10个字符" }
        ],
        editor: [{ max: 30, message: "主编的长度必须小于30个字符" }],
        keywords: [{ max: 100, message: "关键词的长度必须小于100个字符" }],
        planningEditor: [
          { max: 30, message: "策划编辑的长度必须小于30个字符" }
        ],
        executiveEditor:[{max:30,message:'责任编辑的长度必须小于30个字符'}],
        advertising: [{ max: 200, message: "广告语的长度必须小于200个字符" }],
        edition: [
          { required: true, message: "请输入版次" },
          { max: 20, message: "版次的长度必须小于20个字符" }
        ],
        binding: [{ max: 20, message: "装帧的长度必须小于20个字符" }],
        print: [
          { required: true, message: "请输入印次" },
          { max: 20, message: "印次的长度必须小于20个字符" }
        ],
        format: [
          { required: true, message: "请输入开本" },
          { max: 20, message: "开本的长度必须小于20个字符" }
        ],
        wordCount: [
          { required: true, message: "请输入字数" },
          { max: 10, message: "字数的长度必须小于10个字符" }
        ],
        sela: [
          { required: true, message: "请输入印张" },
          { max: 10, message: "印张的长度必须小于10个字符" }
        ],
        packages: [{ max: 10, message: "包册的长度必须小于10个字符" }],
        genuineHint: [
          { max: 200, message: "仿伪正版提示语的长度必须小于200个字符" }
        ],
        pirateHint: [
          { max: 200, message: "仿伪盗版提示语的长度必须小于200个字符" }
        ],
        bookCode: [{ max: 20, message: "书代号的长度必须小于20个字符" }],
        weight: [{ max: 10, message: "重量的长度必须小于10个字符" }],
        skucode: [{ max: 20, message: "SKU编码长度必须小于20个字符" }],
        basicSales: [{ max: 10, message: "基础销量的长度必须小于10个字符" }],
        presaleHint: [{ max: 100, message: "预售提示语长度必须小于100个字符" }],
        bookPrice: [
          {
            require: false,
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "定价范围为0-99999之间，保留小数点后两位"
          }
        ],
        bookSellingPrice: [
          {
            require: false,
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "售价范围为0-99999之间，保留小数点后两位"
          }
        ],
        purchaseCost: [
          {
            require: false,
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "电子书购买成本范围为0-99999之间，保留小数点后两位"
          }
        ],
        procurementCost:[
          {
            require: false,
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "外采版权采购成本范围为0-99999之间，保留小数点后两位"
          }
        ],
        productionCost: [
          {
            require: false,
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "加工制作成本范围为0-99999之间，保留小数点后两位"
          }
        ],
        commodityWeight: [
          {
            max: 10,
            pattern: /^([0-9](\.[0-9]+)?|10)$/,
            message: "商品权重必须小于10的数字，小数点后一位"
          }
        ],
        publishTime: [{ required: true, message: "请输入出版时间" }],
        author: [{ required: true, message: "请输入作者" }],
        departmentId: [{ required: true, message: "请选择部门"}],
        cover: [{ required: true, message: "请选择图书封面" }],
        price: [
          {
            require: false,
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "定价范围为0-99999之间，保留小数点后两位"
          }
        ],
        sellingPrice: [
          { required: true, message: "请填写售价" },
          {
            pattern: /^\d{0,5}(\.\d{0,2})?$/,
            message: "售价价范围为0-99999之间，保留小数点后两位"
          }
        ],
        diyTypeId: [
          { required: true, message: "请填写自定义分类", trigger: "input" }
        ], //trigger: "input"不能改
        dataSources: [{ required: true, message: "请填写数据来源" }],
        salesStatus:[{required:true,message:'请输入销售状态'}]
      },
      //自定义标签
      labelList: [],
      defaultValue: [], //默认分类
      labelReback: [],
      path:'',
      infoPath:'',
      jglistLoading:true,
      upper:false,
      jgwjList:[]
    };
  },
  methods: {
    //下载加工文件
    downloadJgwj(){
      if(this.jgwjList.length>0){
        let opaths=''
        this.jgwjList.forEach((item,index) => {
          if(index==0){
            opaths+=this.path+"/"+item.name
          }else{
            opaths+=","+this.path+"/"+item.name
          }          
        })
        downLoadFileAPI(opaths).then(res=>{
          if(res.data.code==0){
            window.open(`${process.env.BASE_API}${res.data.data}`)
          }
        })
      }else{
        this.$message.warning('请选择文件');
        return
      }
    },
    handleSelectionJgwj(val){
      this.jgwjList=val;
    },
    //打开文件夹
    openFile(row){
      this.jgwjList=[];//清空选择的内容
      if(row.type==1){
        this.path+='/'+row.name;
        this.getProcess()
        this.upper=true//从下面挪到这里，保证只有文件夹才出返回按钮
      }
    },
    //划过变手
    handClass(row){
      if (row.columnIndex === 0&&row.row.type===1) {
        return 'hand'
      } else {
        return ''
      }
    },
    //返回上一层目录
    toUpper(){
      this.path=this.path.slice(0,this.path.lastIndexOf("/"));
      this.path.split('/').length==3?this.upper=false:this.upper=true
      this.getProcess()
    },
    //获取出版单位列表
    getList() {
      getAllListAPI("").then(res => {
        if (res.data.code === 0) {
          this.puboptions=[]    //清空    
          if(res.data.data){
            res.data.data.forEach( ele => {
              let obj={};
              obj.label=ele.name;
              obj.value=ele.name;
              this.puboptions.push(obj)
            })
          }
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    // 查看页隐藏上传按钮
    hiddenView() {
      if (this.$route.query.type == "view") {
        this.hiddenViewButton = false;
      } else {
        this.hiddenViewButton = true;
      }
    },
    //校验自定义分类
    selfChoose(val) {
      this.$refs.ruleForm.validateField("diyTypeId");
    },
    selectFun(node) {
      //this.imgForm.diyTypeCode = [];
      if (node.code != null || node.code != "") {
        this.imgForm.diyTypeCode.push(node.code);
      }
      //this.imgForm.diyTypeId = [];
      if (node.id != null || node.id != "") {
        this.imgForm.diyTypeId.push(node.id);
      }
    },
    deselectFun(node) {//监听删除
      for (var i = 0; i < this.imgForm.diyTypeId.length; i++) {
        if (this.imgForm.diyTypeId[i] == node.id) {
          this.imgForm.diyTypeId.splice(i, 1);
          this.imgForm.diyTypeCode.splice(i, 1);
        }
      }
    },
    loadOptions({ action, parentNode, callback }){//此处可以懒加载，去掉loadOptions警告；
      callback();
    },
    pagesizeFun2(val) {
      this.relatedForm.pageSize = val;
      this.getRelatedList();
    },
    currentPageFun2(val) {
      this.relatedForm.pageNum = val;
      this.getRelatedList();
    },
    pagesizeFun3(val) {},
    currentPageFun3(val) {},

    //选择资源的分页
    pdfpagesizeFun(val){
      this.listPDFQuery.pageSize=val
      this.getPDFList()
    },
    pdfcurrentPageFun(val){
      this.listPDFQuery.pageNum=val
      this.getPDFList()
    },
    //相关合同--确定
    confirmRelated() {
      if (this.checkedRelatedList.id) {
        this.imgForm.contractNumber = this.checkedRelatedList.identifier;
        this.imgForm.contractName = this.checkedRelatedList.name;
        this.checkedRelated = true;
        this.relatedDialog = false;
      } else {
        this.$message.warning("请选择一条合同");
      }
    },
    cancelRelated() {
      this.checkedRelatedList = [];
      if (!this.imgForm.contractNumber) {
        this.imgForm.contractNumber = "";
        this.imgForm.contractName = "";
        this.checkedRelated = false;
      } else {
        this.checkedRelated = true;
      }
      this.relatedDialog = false;
    },
    handleFilter() {
      this.getRelatedList();
    },
    // 获取用户部门
    gainSection(){
      sectionAPI().then( res => {
        this.imgForm.departmentId = res.data.data.deptList[0].deptId;
      })
    },
    
    querySearch() {},
    getType() {
      getTypeAPI().then(res => {
        if (res.data.code == 0) {
          this.typeList = res.data.data;
        }
      });
    },
    handleSelect() {},
    // changeName() {
    //   this.imgForm.authorId = this.imgForm.author.id;
    //   this.imgForm.author = this.imgForm.author.name;
    // },
    getAuthors() {
      getAuthorsAPI().then(res => {
        if (res.data.status) {
          this.authors = res.data.data;
        }
      });
    },
    // addAuthorName() {
    //   if (this.authorName != "") {
    //     let id = this.getNumber();
    //     this.authors.push({ id: id, name: this.authorName });
    //     this.imgForm.author.push({ id: id, name: this.authorName });
    //     this.authorName = "";
    //   } else {
    //     this.$message.error("请输入作者");
    //   }
    // },
    getNumber() {
      return Math.random() * 100;
    },
    // changeInputStatus() {
    //   this.showInputName = !this.showInputName;
    // },
    // 下载
    handleDown(token) {
      window.open(
        `${process.env.BASE_API}${requestPath.file}download/${token}`
      );
    },
    getDepartmentList() {
      getDepartmentAPI().then(res => {
        this.departmentList = res.data.data;
      });
    },
    handlepdfSelectionChange(val) {
      this.selectList = val;
    },
    // 获取丛书名称
    getBookNameList() {
      bookNameListAPI().then(res => {
        this.bookNameList = res.data.data;
      });
    },
    //操作记录列表
    getFileList() {
      this.fileForm.resourceId = this.$route.query.id;
      fileListAPI(this.fileForm).then(res => {
        if (res.data.code == 0) {
          this.recordData = res.data.data.list;
          this.total = res.data.data.total;
        }
      });
    },
    //上传文件列表
    getUploadFileList() {
      uploadFileListAPI(this.uploadFileList).then(res => {
        if (res.data.status) {
          this.tokens = res.data.data;
          this.getFiles();
          this.$message.success("添加成功");
        } else {
          this.$message.error("添加失败");
        }
      });
    },
    //文件列表
    getFiles() {
      if (this.tokens == null || this.tokens == "") {
        this.tableData = [];
        return;
      } else {
        files({ tokens: this.tokens }).then(res => {
          res.data.data.forEach( (ele,index) => {
            res.data.data[index].size=getFileSize(ele.size)
          })
          this.tableData = res.data.data;
        });
      }
    },
    //删除上传文件
    handleDel(id, fileName) {
      this.uploadFileList.token = fileName;
      delFileListAPI(this.uploadFileList).then(res => {
        if (res.data.status) {
          this.tokens = res.data.data;
          this.getFiles();
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
      });
    },
    handleFPreview(file) {},
    handleFRemove(file, fileList) {},
    beforeFUpload(file) {},
    handleFSuccess(res, file, fileList) {
      this.uploadFileList.token = res;
      this.getUploadFileList();
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.showName,
        children: node.list
      };
    },
    getTree() {
      getTreeAPI(1).then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },
    handleClick(tab, event) {
      //切换的时候清空选择的内容
      this.jgwjList=[];
      this.path=this.infoPath;
      if (tab.label == '附件') {
        this.getFiles();
      }
    },
    /*上传图片 */
    handlePreview(file) {},
    handleRemove(file, fileList) {},
    beforeUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif" ||
        file.type === "image/jpg" ||
        file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/JPEG/PNG/GIF/BMP 格式!");
        return isJPG;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return isLt2M;
      }
    },
    handleSuccess(res, file, fileList) {
      this.imageUrl = `${this.domain}${
        this.requestPath.file
      }?fileName=${res}&isOnLine=true`;
      this.imgForm.cover = res;
      this.$refs['ruleForm'].clearValidate('cover')
    },
    // 自定义分类1
    handleClose1(tag) {
      this.imgForm.tabDefine1.splice(this.imgForm.tabDefine1.indexOf(tag), 1);
    },
    handleInputConfirm1() {
      let inputValue = this.inputValue1;
      if (inputValue) {
        this.imgForm.tabDefine1.push(inputValue);
      }
      this.inputValue1 = "";
    },
    // 自定义分类2
    handleClose2(tag) {
      this.imgForm.tabDefine2.splice(this.imgForm.tabDefine2.indexOf(tag), 1);
    },
    handleInputConfirm2() {
      let inputValue = this.inputValue2;
      if (inputValue) {
        this.imgForm.tabDefine2.push(inputValue);
      }
      this.inputValue2 = "";
    },
    /*上传图书资源 */

    handleBookPreview(file) {},
    handleBookRemove(file, fileList) {},
    beforeBookUpload(file) {
      this.loadAnimation = true;
      let isVideo = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
      if (isVideo!='mp4'&&isVideo!='avi'&&isVideo!='rmvb'&&isVideo!='wmv'&&isVideo!='mov'&&isVideo!='flv') {
        this.$message.error("视频只支持AVI、WMV、RMVB、MP4、MOV、FLV!");
        return false;
      }
      const size = file.size / 1024 / 1024;
      if (size > 20) {
        this.$message.error("上传视频大小不能超过 20M!");
        this.loadAnimation = false;
        // return isLt2G;
      }
    },
    handleBookSuccess(res, file, fileList) {
      this.videoUrl = `${this.domain}${this.requestPath.file}?fileName=${
        res.fileName
      }&isOnLine=true`;
      this.imgForm.showVideo = res.fileName;
      this.loadAnimation = false;
    },
    /*上传相册 */
    handlePhotoPreview(file) {
      this.imageUrl = file.url;
      this.dialogPicVisible = true;
    },
    handlePhotoRemove(file, fileList) {
      this.imgForm.goodsCover = [];
      fileList.forEach(element => {
        this.imgForm.goodsCover.push(element.response);
      });
    },
    beforePhotoUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
        return isJPG;
      }
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
        return isLt3M;
      }
    },
    handlePhotoSuccess(res, file, fileList) {
      this.imgForm.goodsCover = [];
      fileList.forEach(element => {
        this.imgForm.goodsCover.push(element.response);
      });
    },
    /*上传pdf */
    handlePDFPreview(file) {},
    handlePDFRemove(file, fileList) {},
    beforePDFUpload(file) {},
    handlePDFSuccess(res, file, fileList) {
      this.rebackpdf = false;
      this.imgForm.pdfName = "";
      this.imgForm.pdf = "";
      this.imgForm.pdfName = file.name;
      this.imgForm.pdf = file.response;
    },
    /*上传视频 */
    handleVideoPreview(file) {},
    handleVideoRemove(file, fileList) {},
    beforeVideoUpload(file) {},
    handleVideoSuccess(res, file, fileList) {
      this.rebackvideo = false;
      this.pdfList.videoName = "";
      this.pdfList.video = "";
      this.imgForm.videoName = file.name;
      this.imgForm.video = res;
    },
    /*上传音频 */
    handleAudioPreview(file) {},
    handleAudioRemove(file, fileList) {},
    beforeAudioUpload(file) {},
    handleAudioSuccess(res, file, fileList) {
      this.rebackaudio = false;
      this.pdfList.audioName = "";
      this.pdfList.audio = "";
      this.imgForm.audio = res;
      this.imgForm.audioName = file.name;
    },
    /*相关合同 */
    handleContractPreview(file) {},
    handleContractRemove(file, fileList) {},
    beforeContractUpload(file) {},
    handleContractSuccess(res, file, fileList) {
      this.imgForm.relatedContracts = res;
    },

    //提交表单
    save(ruleForm) {
      //自定义标签
      let labelId = [],
        labelContentCode = [],
        labelContentId = [];
      this.defaultValue.forEach(ele => {
        if (ele.labelMessage.length > 0) {
          ele.labelMessage.forEach(res => {
            labelId.push(ele.id);
            labelContentId.push(res.split(",")[0]);
            labelContentCode.push(res.split(",")[1]);
          });
        }
      });
      this.imgForm.labelId = labelId;
      this.imgForm.labelContentCode = labelContentCode;
      this.imgForm.labelContentId = labelContentId;
      //
      if (this.timeList) {
        this.imgForm.startTime = this.timeList[0];
        this.imgForm.endTime = this.timeList[1];
      } else {
        this.imgForm.startTime = null;
        this.imgForm.endTime = null;
      }
      this.$refs[ruleForm].validate(valid => {
        
        if (valid) {
          if (this.imgForm.diyTypeId.length < 1) {
            this.$message.warning("请选则自定义分类");
            return;
          }
          if (this.imgForm.startDate && this.imgForm.endDate) {
            if (!compareDate(this.imgForm.startDate, this.imgForm.endDate)) {
              this.$message.warning("开始时间不可以大于结束时间");
              return;
            }
          }

          this.dialogStatus === "add"
            ? this.invokeAPI(addAPI, this.imgForm)
            : this.invokeAPI(updateAPI, this.imgForm);
        } else {
          this.$message.warning("图书信息有未通过的验证");
        }
      });

    },
    reset() {
      this.$router.go(-1)
    },



    //保存
    invokeAPI(api, data) {
      //添加、修改调接口
      api(data).then(res => {
        if (res.data.status) {
          this.$message.success(`${this.textMap[this.dialogStatus]}成功`);
          this.$router.go(-1);
          this.activeName = "second";
        } else {
          errorMsg.apply(this, [res.data, this.textMap[this.dialogStatus]]);
        }
      });
    },
    pagesizeFun(val) {
      this.fileForm.pageSize = val;
      this.getFileList();
    },
    currentPageFun(val) {
      this.fileForm.pageNum = val;
      this.getFileList();
    },
    changePDF() {},
    changeVideo() {},
    changeAudio() {},
    submitUpload() {},

    goPrev() {
      this.activeName = "first";
    },
    goNext() {
      this.dialogStatus === "add"
        ? this.invokeAPI(addAPI, this.imgForm)
        : this.invokeAPI(updateAPI, this.imgForm);
      this.activeName = "third";
    },
    goPrevRes() {
      this.activeName = "second";
    },
    goNextRes() {
      this.dialogStatus === "add"
        ? this.invokeAPI(addAPI, this.imgForm)
        : this.invokeAPI(updateAPI, this.imgForm);
      this.activeName = "fourth";
    },
    goback() {
      this.activeName = "third";
    },
    fininsh() {},
    //详情
    getInfo() {
      this.uploadFileList.oid = this.$route.query.id;
      getInfoAPI(this.$route.query.id).then(res => {
        if (res.data.code === 0) {
          //处理标签回显
          if(res.data.data.labelList){
            if (res.data.data.labelList.length > 0) {
              let labelList = [];
              res.data.data.labelList.forEach(ele => {
                let obj2 = {
                  id: "",
                  labelMessage: []
                };
                obj2.id = ele.id;
                ele.list.forEach(element => {
                  obj2.labelMessage.push(element.id + "," + element.code);
                });
                labelList.push(obj2);
              });
              this.labelReback = labelList;
            }
          }
          this.getLabel()
          this.imgForm = res.data.data;
          this.fileList = [];
          //回显商品画册
          this.imgForm.goodsCover = res.data.data.goodsCover;
          res.data.data.goodsCover.forEach((ele, index) => {
            if (ele) {
              let url = `${this.domain}${
                this.requestPath.file
              }?fileName=${ele}&isOnLine=true`;
              let obj = {
                url: url,
                response: ele
              };
              this.fileList.push(obj);
            }
          });
          //处理加工时间回显
          if(res.data.data.startTime&&res.data.data.endTime){
            this.timeList.push(res.data.data.startTime)
            this.timeList.push(res.data.data.endTime)
          }
          //处理重量
          if(res.data.data.weight){
            res.data.data.weight=res.data.data.weight+""
          }
          if (this.imgForm.cover) {
            this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${
              this.imgForm.cover
            }&isOnLine=true`;
          }
          if (this.imgForm.showVideo) {
            this.videoUrl = `${this.domain}${this.requestPath.file}?fileName=${
              this.imgForm.showVideo
            }&isOnLine=true`;
          }

          if (
            res.data.data.diyTypeId == null ||
            res.data.data.diyTypeId == "null"
          ) {
            this.imgForm.diyTypeId = [];
            this.imgForm.diyTypeCode = [];
          }
          //重量
          if(this.imgForm.weight){
            this.imgForm.weight=this.imgForm.weight+""
          }
          this.tokens = res.data.data.attachmentList;

          this.path=res.data.data.path;

          this.infoPath=res.data.data.path;

          
        } else {
          this.$message.error(`获取数据失败`);
        }
        //详情页面清除校验
        if(this.dialogStatus=='view'){
          this.$refs['ruleForm'].resetFields()
        }
      });
    },
    querySearch() {},
    handleSelect() {},
    //选择pdf文件
    choosePdf() {
      this.pdfList.pdfName = "";
      this.dialogPDFVisible = true;
      this.listPDFQuery.resourceType = "15";
      this.getType();
      this.getPDFList();
      this.chooseFile = "pdf";
    },
    handlePDFClose() {
      this.dialogPDFVisible = false;
    },
    onpdfSubmit() {
      this.getPDFList();
    },

    //提交选择的资源
    confirm() {
      if (this.selectList.length == 1) {
        if (this.chooseFile == "pdf") {
          this.imgForm.pdf = this.selectList[0].id;
          this.imgForm.pdfName = this.selectList[0].name;
        }
        if (this.chooseFile == "audio") {
          this.imgForm.audio = this.selectList[0].id;
          this.imgForm.audioName = this.selectList[0].name;
        }
        if (this.chooseFile == "video") {
          this.imgForm.video = this.selectList[0].id;
          this.imgForm.videoName = this.selectList[0].name;
        }

        this.dialogPDFVisible = false;
      } else if (this.selectList.length == 0) {
        this.$message.warning("至少选择一条");
      } else {
        this.$message.warning("仅可以选择一条");
      }
    },
    //选择视频文件
    chooseVideo() {
      this.pdfList.videoName = "";
      this.dialogPDFVisible = true;
      this.listPDFQuery.resourceType = "6";
      this.getType();
      this.getPDFList();
      this.chooseFile = "video";
    },
    //选择音频文件
    chooseAudio() {
      this.pdfList.audioName = "";
      this.dialogPDFVisible = true;
      this.listPDFQuery.resourceType = "7";
      this.getType();
      this.getPDFList();
      this.chooseFile = "audio";
    },
    getRelatedList() {
      this.relatedDialog = true;
      getCopyrightListAPI(this.relatedForm).then(res => {
        if (res.data.code === 0) {
          this.relateList = res.data.data.list;
          this.total2 = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        // this.relatedDialog = false;
      });
    },
    getPDFList() {
      this.listpdfLoading = true;
      getRelatedListAPI(this.listPDFQuery).then(res => {
        if (res.data.code == 0) {
          this.pdfList = res.data.data.list;
          this.pdftotal = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.listpdfLoading = false;
      });
    },
    filterData(arr1, arr2) {
      return arr1
        .concat(arr2)
        .reduce(
          (pre, next) =>
            pre.some(item => item.id == next.id) ? pre : [...pre, next],
          []
        );
    },

    //自定义标签
    getnewLabel() {
      getLabelAPI(1).then(res => {
        if (res.data.code == 0) {
          this.labelList = res.data.data.list;
          this.defaultValue = [];
          if (res.data.data.list.length > 0) {
            for (var j = 0; j < res.data.data.list.length; j++) {
              let obj = {
                id: "",
                labelMessage: []
              };
              obj.id = res.data.data.list[j].id;
              if (this.labelReback.length > 0) {
                for (var i = 0; i < this.labelReback.length; i++) {
                  if (this.labelReback[i].id == res.data.data.list[j].id) {
                    obj.labelMessage = this.labelReback[i].labelMessage;
                    break;
                  }
                }
              }
              this.defaultValue.push(obj);
            }
            
          }
          
        }
      });
    },
    // 自定义标签
    getLabel() {
      getLabelAPI(1).then(res => {
        if (res.data.code == 0) {
          this.labelList = res.data.data.list;
          this.defaultValue = [];
          if (res.data.data.list.length > 0) {
            for (var j = 0; j < res.data.data.list.length; j++) {
              let obj = {
                id: "",
                labelMessage: []
              };
              obj.id = res.data.data.list[j].id;
              if (this.labelReback.length > 0) {
                for (var i = 0; i < this.labelReback.length; i++) {
                  if (this.labelReback[i].id == res.data.data.list[j].id) {
                    obj.labelMessage = this.labelReback[i].labelMessage;
                    break;
                  }
                }
              }
              this.defaultValue.push(obj);
            }
          }
          if(this.dialogStatus=='view'){
            for( let n=0; n<this.defaultValue.length; n++){
              if(this.defaultValue[n].labelMessage.length==0){
                this.labelList.splice(n,1)
                this.defaultValue.splice(n,1)
                n--
              }
            }
          }
        }
      });
    }
  },

  mounted() {
    this.getList();  
    this.rebackpdf = true;
    this.rebackaudio = true;
    this.rebackvideo = true;
    if (this.dialogStatus === "view" || this.dialogStatus === "update") {
      if (this.dialogStatus === "view") {
        this.$route.meta.title = "查看图书";
        
      } else {
        this.$route.meta.title = "修改图书";
      }
      this.getInfo();
      this.getFileList();

      
    } else {
      if (this.dialogStatus === "add") {
        this.$route.meta.title = "添加图书";
        this.getnewLabel()

        this.gainSection()
      }
    }
    this.getTree();
    this.getBookNameList();
    this.getDepartmentList();
    this.getAuthors();
    this.hiddenView();
  },
  created() {
    this.dialogStatus = this.$route.query.type;
  },
  components: { Tinymce, pagination, Treeselect, customLabel }
};
</script>
<style scoped>
/* .addImgResource .relatedFormInput .el-form-item{
  width:250px !important;
} */

.addImgResource .el-form-item.width260 {
  width: 26%;
  display: inline-block;
}
.addImgResource .el-form-item.width90 {
  width: 26%;
  display: inline-block;
}
.addImgResource .el-form-item.width360 {
  width: 40%;
  display: inline-block;
}
.addImgResource .el-form-item.width360 .el-select{
  width: 100%;
}
.addImgResource .el-form-item.width300 {
  width: 30%;
  display: inline-block;
}
.addImgResource .el-form-item .width460 {
  min-height: 72px;
  border: 1px solid #ddd;
  width: 55%;
  display: inline-block;
}
/* .addImgResource .width460 {
  width: 55%;
  display: inline-block;
} */
.addImgResource .el-input.inp {
  width: 30%;
  display: inline-block;
}
.addImgResource .btncenter {
  text-align: center;
  margin: 40px auto;
}
.addImgResource .dashed {
  width: 720px;
  border: 1px dashed #dcdfe6;
  margin-bottom: 20px;
  padding: 25px 40px;
}
.animation-error {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding: 4px 0;
  margin: 0;
}
.addImgResource .dashed h2 {
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(83, 103, 137, 1);
  margin: 0;
  height: 25px;
  line-height: 25px;
}
.addImgResource .width220 {
  width: 220px;
  /* margin-bottom: 20px; */
}
.videoStyle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.avatar {
  height: 100%;
  width: 100%;
}
/* .relatedResource .el-form-item, */
.addImgResource .el-input.author-input {
  width: 80%;
}
.relatedDialog .el-form-item {
  display: inline-block;
}
.relatedDialog .el-select {
  width: 150px;
}
.table {
  margin-top: 10px;
}
.relatedDialog .el-input {
  width: 150px;
}
.addImgResource .recordtable {
  position: relative;
}
.addImgResource .prfooter {
  position: static;
  margin-top: 300px;
  width: 100%;
}
.yuan .el-input {
  width: 90% !important;
}
.downLoadFile{
  margin:10px auto;
  float: right;
}
.uploadList a{
  color: #409EFF;
}
.floder{
  height: 100%;
    width: 100%;
    display: inline-block;
    cursor: pointer;
}
</style>
<style>
.addImgResource textarea {
  height: 80px;
}
.addImgResource .el-input.weight {
  width: 80%;
}
.el-form-item__label em {
  color: #f56c6c;
  margin-right: 5px;
}

.recomment {
  color: #a1abbc !important;
}
.relatedResource {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
 .relatedResource .form {
  width: 100%;
} 
.hand{
  cursor: pointer;
}
.tonext{
  margin-bottom: 15px;
}
</style>
