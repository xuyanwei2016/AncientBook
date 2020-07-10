<template>
  <el-main style="margin-bottom:50px;">
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <div class="tabwrapper">
            <el-form
              ref="resourceForm"
              :model="resourceForm"
              label-position="right"
              :rules="rules"
              label-width="150px"
            >
              <div class="title">基本信息</div>
              <el-form-item label="引题:" prop="cite">
                <el-input v-model="resourceForm.cite" :disabled="ifDisabled" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="内容主标题:" prop="title">
                <el-input v-model="resourceForm.title" :disabled="ifDisabled" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="副标题:" prop="subhead">
                <el-input v-model="resourceForm.subhead" :disabled="ifDisabled" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="属性设置:" prop="property">
                <el-checkbox-group v-model="type" :disabled="ifDisabled">
                  <el-checkbox label="热门" name="type"></el-checkbox>
                  <el-checkbox label="头条" name="type"></el-checkbox>
                  <el-checkbox label="推荐" name="type"></el-checkbox>
                  <el-checkbox label="置顶" name="type"></el-checkbox>
                  <!-- <el-checkbox label="可评论" name="type"></el-checkbox> -->
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="所属栏目:" prop="columnName">
                <treeselect
                  v-model="resourceForm.columnId"
                  placeholder="请选择所属栏目"
                  style="width:500px;"
                  :multiple="false"
                  :options="treeSelectOptions"
                  :normalizer="normalizer"
                  @select="selectFun"
                  :disabled="ifDisabled"
                ></treeselect>
              </el-form-item>
              <el-form-item label="作者:" prop="author">
                <el-input v-model="resourceForm.author" :disabled="ifDisabled" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item
                label="内容来源:"
                prop="source"
                :rules="[
                  { required: true, message: '请输入内容来源'}
                ]"
              >
                <el-select
                :disabled="ifDisabled"
                  v-model="sourceList"
                  multiple
                  filterable
                  :multiple-limit="1"
                  allow-create
                  @change="getsource"
                  default-first-option
                  placeholder="点击关联来源或手动输入"
                >
                  <el-option
                    v-for="item in sourseOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-checkbox label="新建来源" :disabled="ifDisabled" v-model="sourceState" @change="ifCreated"></el-checkbox>
                <span class="tip recomment">手动输入内容来源请勾选此项，新建来源可在内容来源管理模块中维护</span>
              </el-form-item>
              <el-form-item prop="website" v-if="resourceForm.sourceState==1">
                <el-input v-model="resourceForm.website" :disabled="ifDisabled" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="发布时间:" prop="releaseTime">
                <el-date-picker
                :disabled="ifDisabled"
                  v-model="resourceForm.releaseTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width:500px;"
                ></el-date-picker>
                <el-checkbox label="定时发布"></el-checkbox>
                <span class="tip recomment">日期格式:年-月-日 时:分:秒</span>
              </el-form-item>
              <el-form-item label="下线时间:" prop="offlineTime">
                <el-date-picker
                :disabled="ifDisabled"
                  v-model="resourceForm.offlineTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                  style="width:500px;"
                ></el-date-picker>
                <el-checkbox label="定时下线"></el-checkbox>
                <span class="tip recomment">日期格式:年-月-日 时:分:秒</span>
              </el-form-item>
              <el-form-item label="关键词:" prop="keywords">
                <el-input v-model="resourceForm.keywords" :disabled="ifDisabled" placeholder="多个关键词用逗号隔开" style="width:500px;"></el-input>
              </el-form-item>
              <el-form-item label="内容权重:" prop="weight">
                <el-input v-model="resourceForm.weight" :disabled="ifDisabled" style="width:500px;"></el-input>
                <span class="tip recomment">1~100数字越大，全文检索排名越靠前</span>
              </el-form-item>
              <div>
                <el-form-item label="点击量:" prop="clickNum" style="display:inline-block;">
                  <el-input-number v-model.number="resourceForm.clickNum"  :disabled="true" style="width:130px;"></el-input-number>
                </el-form-item>
                <span style="display:inline-block;">=</span>
                <el-form-item prop="actualClickNum" style="display:inline-block;margin-left: -150px;">
                  <el-input-number v-model.number="resourceForm.actualClickNum"  :disabled="true" style="width:130px;"></el-input-number>
                </el-form-item>
                <span style="display:inline-block;">+</span>
                <el-form-item prop="fictitiousClickNum" style="display:inline-block;margin-left: -150px;">
                  <el-input-number v-model.number="resourceForm.fictitiousClickNum" :disabled="ifDisabled" @input="fictitiousClick" style="width:130px"></el-input-number>
                </el-form-item>
                <span class="tip recomment">总点击量=实际点击量+虚拟点击量，点击量越高全文检索排名越靠前</span>
              </div>

              <el-form-item label="内容封面:" prop="cover">
                <el-upload
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  list-type="picture-card"
                  :on-preview="handlePreview"
                  :before-upload="beforeUpload"
                  :on-success="handleSuccess"
                  :disabled="uploading||ifDisabled"
                  :on-remove="handleRemove"
                  :show-file-list="false"
                >
                  <img
                    v-if="resourceForm.cover"
                    :src="`${domain}${requestPath.file}?fileName=${resourceForm.cover}&isOnLine=true`"
                    class="avatar"
                  >
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span class="tip recomment">支持jpg，jpeg，png，gif，bmp格式，建议尺寸600*420,大小不超过2M</span>
              </el-form-item>
              <el-form-item label="正文:" prop="text">
                <tinymce v-model="resourceForm.text" :disabled="ifDisabled" style="width:720px;"></tinymce>
              </el-form-item>

              <div class="title">图组内容</div>
              <el-form-item prop="list" class="imgTitle">
                <el-upload
                  class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                  :on-preview="handlePicPreview"
                  :before-upload="beforePicUpload"
                  :on-remove="handlePicRemove"
                  :on-success="handlePicSuccess"
                  :file-list="picList"
                  list-type="picture"
                  :disabled="ifDisabled"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">支持jpg、jpeg、png、gif、png格式</div>
                </el-upload>
              </el-form-item>
              <el-form-item v-for="(item,index) in resourceForm.list" :key="index">
                <div class="text imgIntro">
                  <el-input
                    type="textarea"
                    style="width:500px"
                    v-model="resourceForm.list[index].synopsis"
                    placeholder="请输入图片简介"
                    :disabled="ifDisabled"
                  ></el-input>
                </div>
              </el-form-item>
              <div class="title">视频内容</div>
              <el-form-item label="视频文件:" prop="video">
                <span>支持AVI、WMV、RMVB、MP4、MOV、FLV等格式，时长不超过1分钟，大小不超过100M</span>
                <el-upload
                  class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}/video`"
                  :before-upload="beforeVideoUpload"
                  :on-success="handleVideoSuccess"
                  :on-preview="handleVideoPreview"
                  :on-remove="handleVideoRemove"
                  :disabled="ifDisabled"
                  :show-file-list="false"
                  accept='.avi,.wmv,.rmvb,.mp4,.mov,.flv'
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
                <video
                  v-if="resourceForm.video"
                  :src="`${domain}${requestPath.file}?fileName=${resourceForm.video}&isOnLine=true`"
                  controls
                  class="video"
                ></video>
              </el-form-item>
            </el-form>
          </div>
          
        </el-tab-pane>
        <div class="btncenter">
          <el-button @click="dataSubmit" type="primary" v-if="ifShowsave">保存</el-button>
          <el-button @click="$router.go(-1)" class="deback">取消</el-button>
        </div>
    </el-tabs>
    

    
  </el-main>
</template>

<script>
//  ,updateAPI
import Tinymce from "@/components/Tinymce";
import treeTable from "@/components/TreeTable";
import treeToArray from "@/views/example/table/treeTable/customEval";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import {
  addAPI,
  detailsAPI,
  updateAPI
} from "@/api/contentManagement/contentManage";
import { getAllAPI } from "@/api/contentManagement/contentColumn";
import getTreeId from "@/filters/getTreeid";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { compareDate } from "@/utils/publicFunctions.js";
import { getAllSourceAPI } from "@/api/contentManagement/contentSource";

export default {
  components: { Tinymce, treeTable, Treeselect },
  data() {
    return {
      videoUpload: false,
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      activeName:'first',
      videoUrl: "",
      imgUrl: "",
      picList: [],
      resourceForm: {
        columnId: null,
        columnName: "",
        author: "",
        source: "",
        releaseTime: "",
        offlineTime: "",
        keywords: "",
        weight: null,
        clickNum: 0,
        actualClickNum: 0,
        fictitiousClickNum: 0,
        commentNum: 0,
        cover: "",
        text: "",
        list: [],
        video: "",
        property: [],
        source: "",
        sourceState: 2
      },
      sourceState: false,
      rules: {
        title: [
          { required: true, message: "请输入内容主标题" },
          { max: 80, message: "内容主标题长度必须小于80位" }
        ],
        columnName: [{ required: true, message: "请选择所属栏目" }],
        subhead: [{ max: 80, message: "副标题长度必须小于80位" }],
        cite: [{ max: 80, message: "引题长度必须小于80位" }],
        website: [{ required: true, message: "请输入网址" },{pattern:/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/,message:'请输入正确的网址'}],

        author: [{ max: 30, message: "作者长度必须小于30位" }],
        keywords: [{ max: 100, message: "关键词长度必须小于100位" }],
        clickNum: [{ type: "number", message: "点击量只能输入数字" }],
        actualClickNum: [{ type: "number", message: "点击量只能输入数字" }],
        fictitiousClickNum: [{ type: "number", message: "点击量只能输入数字" }],
        weight: [
          {
            pattern: /^([1-9][0-9]{0,1}|100)$/,
            message: "权重必须为1-100内整数数字"
          }
        ] ///^[0-9]*[1-9][0-9]*$/
      },
      uploading: false,
      type: [],
      dialogImageUrl: "",
      relateList: [],
      relateListLoading: false,
      selectedList: [],
      args: [null, null, "timeLine"],
      func: treeToArray,
      list: [],
      expandAll: false,
      listLoading: true,
      multipleSelection: [],
      formatList: [],
      treeSelectValue: null,
      treeSelectOptions: [],
      textList: {
        aa: "11"
      },
      ifShowsave: true,
      sourseOptions: [],
      sourceList: [],
      ifDisabled:false
    };
  },
  mounted() {
    this.isEdit();
    this.getColumn();
    this.getSourceList();
  },
  methods: {
    //虚拟点击量决定总量
    fictitiousClick(){
      this.resourceForm.clickNum=this.resourceForm.actualClickNum+this.resourceForm.fictitiousClickNum
    },
    //是否新建内容来源
    ifCreated(val) {
      if (val) {
        this.resourceForm.sourceState = 1;
      } else {
        this.resourceForm.sourceState = 2;
      }
    },
    //获取内容来源的值
    getsource(val) {
      let obj = {};
      obj = this.sourseOptions.find(item => {
        return item.value === val[0];
      });
      if (obj) {
        this.resourceForm.source = obj.label;
        this.resourceForm.sourceId = obj.value;
      } else {
        this.resourceForm.source = val[0];
        this.resourceForm.sourceId = null;
      }
    },
    //获取内容来源的列表
    getSourceList() {
      getAllSourceAPI().then(res => {
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            this.sourseOptions = [];
            res.data.data.forEach(ele => {
              let obj = {
                label: ele.sourceName + "",
                value: ele.id + ""
              };
              this.sourseOptions.push(obj);
            });
          } else {
            this.sourseOptions = [];
          }
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    // 修改tree
    normalizer(node) {
      return {
        id: node.id,
        label: node.identifierName,
        children: node.list
      };
    },
    selectFun(node) {
      this.resourceForm.code=node.code
      this.resourceForm.columnId = node.id;
      this.resourceForm.columnName = node.identifierName;
    },

    isEdit() {
      this.$route.meta.title = "添加内容管理";
      const id = this.$route.query.id; //修改id
      if (this.$route.query.type == "detail") {
        this.ifShowsave = false;
        this.ifDisabled=true
      } else {
        this.ifShowsave = true;
        this.ifDisabled=false
      }
      const detailsId = this.$route.query.detailsId; //查看id
      if (id) {
        //修改
        this.$route.meta.title = "修改内容管理";
        this.pageDetails(id);
      }
      if (detailsId) {
        this.$route.meta.title = "查看内容管理";
        this.pageDetails(detailsId);
      }
    },

    // 详情页
    pageDetails(id) {
      detailsAPI(id).then(res => {
        this.resourceForm = res.data.data;
        this.type = res.data.data.property.split(",");
        //this.resourceForm.columnId = res.data.data.columnId;
        this.picList = res.data.data.list.map(item => {
          return {
            url: `${this.domain}${this.requestPath.file}?fileName=${
              item.img
            }&isOnLine=true`,
            response: item.img
            // name: item.img
          };
        });

        //处理内容来源
        if (res.data.data.source) {
          this.sourceList = [res.data.data.source];
        } else {
          this.sourceList = [];
        }
        
      });
    },

    // 保存
    dataSubmit() {
      this.$refs["resourceForm"].validate(valid => {
        if (valid) {
          //校验时间
          if (this.resourceForm.releaseTime && this.resourceForm.offlineTime) {
            if (
              !compareDate(
                this.resourceForm.releaseTime,
                this.resourceForm.offlineTime
              )
            ) {
              this.$message.warning("发布时间不可大于下线时间");
              return;
            }
          }
          //【正文、视频、图组】应验证至少填写了其中一个，如果都未填写应有错误提示
          if (
            this.resourceForm.text == "" &&
            this.resourceForm.video == "" &&
            this.resourceForm.list == []
          ) {
            this.$message.warning("【正文、视频、图组】应至少填写一个");
            return;
          }
          const id = this.$route.query.id; //修改id
          this.resourceForm.property = this.type.join(",");
          
          if (id) {
            // 修改
            this.resourceForm.id = id;
            updateAPI(this.resourceForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success("编辑成功");
                this.$router.push({ path: "contentManage/index" });
                this.$router.go(-1);
              } else {
                this.$message.error("编辑失败");
              }
            });
          } else {
            addAPI(this.resourceForm).then(res => {
              if (res.data.code === 0) {
                this.$message.success("添加成功");
                this.$router.push({ path: "contentManage/index" });
                this.$router.go(-1);
              } else {
                this.$message.error("添加失败");
              }
            });
          }

        }else{
          this.$message.warning('内容信息有未通过的验证')
        }
      });
    },

    // 获取内容栏目
    getColumn() {
      getAllAPI().then(res => {
        this.treeSelectOptions = res.data.data;
      });
    },

    // 上传图片封面有关
    handlePreview(file) {
      this.imgUrl = file.url;
    },

    handleRemove(file, fileList) {
      this.imgUrl = "";
    },
    beforeUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif"||file.type === "image/bmp";
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
        return isJPG;
      }
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
        return isLt3M;
      }
      this.uploading = true;
      this.$message.warning("上传中");
    },
    handleSuccess(res, file, fileList) {
      this.$message.success("上传成功");
      this.resourceForm.cover = res;
    },

    // 上传视频
    beforeVideoUpload(file) {
      let isVideo = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
      let size=file.size;
      if (isVideo!='mp4'&&isVideo!='avi'&&isVideo!='rmvb'&&isVideo!='wmv'&&isVideo!='mov'&&isVideo!='flv') {
        this.$message.error("视频只支持AVI、WMV、RMVB、MP4、MOV、FLV!");
        return false;
      }
      if(size>1024*1024*100){
        this.$message.error("视频太大，请重新上传");
        return false;
      }
      this.uploading = true;
      this.$message.warning("上传中");
    },
    handleVideoSuccess(res, file, fileList) {
      this.$message.success("上传成功");
      this.videoUpload = true;
      this.resourceForm.video = res.fileName;
    },
    handleVideoPreview(file) {},
    handleVideoRemove(file, fileList) {},

    // 上传图组
    handlePicPreview(file) {
      this.dialogImageUrl = file.url;
    },
    beforePicUpload(file) {
      const isJPEG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPEG) {
        this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
        return isJPEG;
      }
      if (!isLt3M) {
        this.$message.error("上传图片大小不能超过 3MB!");
        return isLt3M;
      }
    },
    handlePicRemove(file, fileList) {
      let idx = {};
      idx = this.resourceForm.list.findIndex(item => {
        return item.img === file.response;
      });
      this.resourceForm.list.splice(idx, 1);

    },
    handlePicSuccess(res, file, fileList) {
      this.$message.success("上传成功");

      this.picList = fileList;
      this.resourceForm.list.push({ img: res, synopsis: "" });     

    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length > 0
        ? (this.ids = getTreeId(this.multipleSelection, "children"))
        : true;
    },

    getFormatData(data) {
      this.formatList = data;
    },

    // 翻页
    pagesizeFun(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.listQuery.pageNum = val;
      this.getList();
    }
  },
  activated() {
    this.getList();//缓存操作的新增编辑时，要更新数据
  }
};
</script>

<style scoped>
.imgIntro {
  clear: both !important;
  padding-top: 20px !important;
}
.el-main {
  background-color: #fff;
  margin-bottom: 50px ;
  padding: 40px;
  background: #eef0f3;
}
.title {
  border-left: 2px solid #03bcd9;
  padding-left: 6px;
  margin-bottom: 20px;
  margin-top: 10px;
}
.el-checkbox {
  margin-left: 10px;
}
.tip {
  margin-left: 20px;
  font-size: 14px;
}

.video {
  width: 443px;
  height: 334px;
}
.avatar {
  width: 146px;
  height: 146px;
}
.dialog-footer {
  text-align: center;
}

.imgTitle .text {
  float: left;
  padding-top: 80px;
}
.deback {
  background: white;
  color: #999;
  border: 1px solid #ccc;
}
.deback:hover {
  background: #546478;
  color: white;
  border: 1px solid #546478;
}
.el-form-item{
  margin-top:10px;
}
.btncenter{
  text-align: center;
  margin: 40px auto;
}
</style>
<style>
.imgTitle .el-upload-list__item {
  width: 500px !important;
}
.imgTitle .upload-demo {
  width: 500px !important;
  float: left;
  margin-right: 20px;
}
.imgTitle .text .el-textarea {
  width: 300px;
  height: 90px;
  margin-top: 10px;
}

.imgTitle .el-textarea__inner {
  width: 300px;
  height: 90px;
}
.recomment {
  color: #a1abbc !important;
}
button.el-button--text {
  background: none;
  color: #409eff;
  border: none;
}
</style>

