<template>
  <div class="app-container">
    <div class="relatedResource">
      <div class="relatedMain">
        <div class="relatedbox">
          <el-form ref="form" :model="searchForm" inline label-width="82px">
            <p class="dataType">
              <em>数据类型：</em>
              <span :class="searchForm.resourceType === ''?'blue':''" @click="typeChange('')">全部</span>
              <span
                v-for="(item,index) in typeList"
                :key="index"
                @click="typeChange(index)"
                :class="index === searchForm.resourceType?'blue':''"
              >{{item}}</span>
            </p>
            <div class="searchbox">
              <el-form-item label="上传时间：" style="float:left">
                <el-date-picker
                  v-model="timeLimit"
                  value-format="yyyy-MM-dd 00:00:0"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @keyup.enter.native="onSubmit"
                ></el-date-picker>
              </el-form-item>
              <el-button type="primary" @click="search" icon="el-icon-search">检索</el-button>
              <br class="clear">
            </div>
          </el-form>
        </div>
        <div class="reslist" v-if="tabledata.length>0">
          <ul>
            <li v-for="(item,index) in tabledata" :key="index">
              <el-checkbox v-model="item.checked" ref="checkboxs" @change="changeValue"></el-checkbox>
              <div class="pic">
                <img
                  v-if='item.cover'
                  :src="`${domain}${requestPath.file}?fileName=${item.cover}&isOnLine=true`"
                  class="imagesize"
                >
                <img v-else src='../../../assets/img/bookDefault.png' style='width:120px;height:140px;'>
                <h6 class="text">{{item.name}}</h6>
              </div>
            </li>
          </ul>
        </div>
        <div class="reslist" v-else style="text-align:center;line-height:500px;">暂无数据</div>
        <!-- 底部 -->
        <div class="prfooter">
          <div class="prfooterleft">
            <el-checkbox v-model="checkedAll" @change="changeStatus">全选</el-checkbox>
            <span class="marginLeft" @click="batchAudit">批量导出</span>
          </div>
          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
          </div>
        </div>
        <!-- 底部 -->

        <!--批量导出-->
        <el-dialog
          title="批量导出"
          :visible.sync="exportExcelDialog"
          class="backgroundDialog exportExcelDialog"
        >
          <el-form ref="exportExportform" :model="exportExportform" label-width="82px">
            <el-form-item label="导出范围">
              <el-select v-model="exportExportform.range">
                <el-option label="全部数据" value="0"></el-option>
                <el-option label="选中数据" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="导出字段">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAllWords"
                @change="handleCheckAllWordsChange"
              >全部字段</el-checkbox>
              <el-checkbox-group
                v-model="exportExportform.words"
                @change="handleCheckedWordsChange"
              >
                <el-checkbox
                  v-for="(value,key) in excelListItems"
                  :label="key"
                  name="words"
                  :key="key"
                >{{value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="confirmExport">导出</el-button>
            <el-button @click="exportExcelDialog = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import pagination from "../components/pagination";
import "@/styles/resource.scss";
import { getTypeAPI, getRelatedListAPI, saveAPI } from "@/api/resource/recycle";
import {
  excelExportAPI,
  exportListAPI,
  downloadAPI,
  fileAPI
} from "@/api/resource/common";
import queryString from "query-string";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
export default {
  name: "related_Res_Bin",
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      applyDialog: false,
      applyform: {
        file: [],
        fileList: []
      },
      fileList: [],
      timeLimit: null,
      downParams: {},
      //批量导出
      isIndeterminate: false,
      checkAllWords: false,
      exportExcelDialog: false,
      exportExportform: {
        words: [],
        range: ""
      },
      rangeExcelList: {
        objectIds: [],
        isDelete: 1,
        names: null,
        resourceType: 1
      },
      excelListData: {},
      excelListItems: [],
      arrayWordsAll: [],
      searchForm: {
        id: "",
        name: "",
        resourceType: "",
        beginTime: "",
        endTime: "",
        pageNum: 1,
        pageSize: 50
      },
      checkedAll: false,
      total: 0,
      typeList: [],
      importExcelForm: {
        ids: []
      },
      tabledata: [],
      downLoadData: {
        ids: []
      }
    };
  },
  methods: {
    getfileList() {
      fileAPI().then(res => {
        this.fileList = res.data.data;
      });
    },
    //批量导出 全选字段
    handleCheckedWordsChange(value) {
      let checkedCount = value.length;
      this.checkAllWords = checkedCount === this.arrayWordsAll.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.arrayWordsAll.length;
    },
    handleCheckAllWordsChange(val) {
      this.exportExportform.words = val ? this.arrayWordsAll : [];
      this.isIndeterminate = false;
    },
    // 确认导出
    confirmExport() {
      if (this.exportExportform.range == "0") {
        this.rangeExcelList.objectIds = [];
        this.rangeExcelList.names = this.arrayWordsAll.join(",");
      } else {
        this.rangeExcelList.objectIds = this.importExcelForm.ids.join(",");
        this.rangeExcelList.names = this.exportExportform.words.join(",");
      }
      this.excelListData = queryString.stringify(this.rangeExcelList);

      window.open(
        `${process.env.BASE_API}${requestPath.resource}/public/export?${
          this.excelListData
        }`
      );
    },
    //导出字段列表
    getWordsList() {
      exportListAPI().then(res => {
        if (res.data.status) {
          this.excelListItems = res.data.data;
          for (var key in this.excelListItems) {
            this.arrayWordsAll.push(key);
          }
        } else {
          this.$message.error("获取字段列表失败");
        }
      });
    },
    search() {
      if (this.timeLimit) {
        this.searchForm.beginTime = this.timeLimit[0];
        this.searchForm.endTime = this.timeLimit[1];
      } else {
        this.searchForm.beginTime = null;
        this.searchForm.endTime = null;
      }
      this.getList();
    },
    changeStatus() {
      if (this.checkedAll) {
        for (var i = 0; i < this.$refs.checkboxs.length; i++) {
          this.tabledata[i].checked = true;
        }
      } else {
        for (var i = 0; i < this.$refs.checkboxs.length; i++) {
          this.tabledata[i].checked = false;
        }
      }
    },
    changeValue() {
      this.importExcelForm.ids = [];
    },
    batchAudit() {
      for (var i = 0; i < this.$refs.checkboxs.length; i++) {
        if (this.tabledata[i].checked) {
          this.importExcelForm.ids.push(this.tabledata[i].id);
        }
      }
      if (this.importExcelForm.ids.length > 0) {
        this.getWordsList();
        this.exportExcelDialog = true;
      } else {
        this.$message.warning("请先选择要操作的数据对象!");
      }
    },
    pagesizeFun(val) {
      this.searchForm.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.searchForm.pageNum = val;
      this.getList();
    },
    typeChange(index) {
      //数据类型
      if (index) {
        this.searchForm.resourceType = index;
      } else {
        this.searchForm.resourceType = null;
      }

      this.getList();
    },
    getType() {
      //getTypeAPI().then(res => {
        this.typeList = {1: "图书", 2: "文章", 5: "图片", 6: "视频", 7: "音频", 8: "动画", 10: "法规", 14: "条文", 15: "pdf"}
      //});
    },
    getList() {
      this.searchForm.id = this.$route.query.id;
      this.checkedAll = false;
      getRelatedListAPI(this.searchForm).then(res => {
        var arr = res.data.data.list;
        this.total = res.data.data.total;
        arr.forEach(function(item) {
          item.checked = false;
        });
        this.tabledata = arr;
      });
    }
  },
  created() {},
  mounted() {
    this.getType();
    this.getList();
    this.getfileList();
    this.relatedForm.resourceName=this.$route.query.name
  },
  components: { pagination, queryString }
};
</script>
<style>
.exportExcelDialog .el-dialog,
.exportExcelDialogApply .el-dialog {
  width: 506px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -253px;
  margin-top: -220px !important;
}
.exportExcelDialog .el-checkbox + .el-checkbox,
.exportExcelDialogApply .el-checkbox + .el-checkbox {
  margin: 0;
}
.exportExcelDialog .el-checkbox,
.exportExcelDialogApply .el-checkbox {
  width: 120px;
  float: left;
}
.relatedResource {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.reslist {
  min-height: 500px;
}
.reslist .down {
  font-size: 14px;
}
.reslist .down i:hover {
  cursor: pointer;
}
.clear {
  clear: both;
}

.reslist ul {
  width: 95%;
  padding-left: 5%;
  overflow: hidden;
}
.reslist ul li {
  width: 20%;
  margin-right: 5%;
  float: left;
}
.reslist .down {
  margin: 0;
  padding: 0;
  border-top: 1px solid #f2f2f2;
  height: 34px;
  line-height: 34px;
}
.reslist .text {
  line-height: 20px;
  margin-bottom: 26px;
  margin-top: 24px;
  height: 40px;
  font-size: 14px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.relatedMain {
  width: 80%;
}
.app-container {
  background: #fff;
}
.relatedbox {
  padding: 23px 20px;
  border: 1px solid #f2f2f2;
}
.relatedbox p {
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #424861;
  font-size: 14px;
  margin-bottom: 25px;
  height: 25px;
  line-height: 25px;
}
.relatedbox .el-form-item__label {
  font-weight: bold;
  text-align: left;
}
.relatedbox .el-form-item {
  margin-bottom: 0px;
}
.relatedbox .line {
  text-align: center;
  margin-bottom: 0;
  border: 0;
}

.relatedbox p em {
  font-weight: bold;
  font-style: normal;
  display: inline-block;
  width: 80px;
}
.relatedbox p span {
  margin-right: 22px;
}

.reslist li {
  list-style: none;
  border: 1px solid #f2f2f2;
  margin-bottom: 20px;
}
.reslist {
  margin: 0 auto;
  width: 80%;
  margin-top: 25px;
}
.reslist .pic {
  text-align: center;
}
.reslist h6 {
  margin: 0;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #424861;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 25px;
}
span.blue {
  color: #02b4d0;
}
.dataType span {
  cursor: pointer;
}
</style>

<style scoped>
  .prfooter{
    width: calc(100vw - 449px);
  }
</style>
