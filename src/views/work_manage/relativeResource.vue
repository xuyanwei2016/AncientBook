<template>
  <div class="app-container project-plan">
    <div>
      <el-form class="formlist" :model="relatedForm" label-width="120" >
        <el-form-item label="资源类型" style="margin-right:20px">
          <el-select v-model="relatedForm.resourceType" placeholder="全部">
            <el-option label="全部" value></el-option>
            <el-option v-for="(key,value) in typeList" :key="key" :label="key" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称">
          <el-input v-model="relatedForm.name"></el-input>
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchRelated">检索</el-button>
      </el-form>
      <div class="table_custom">
        <el-table
          border
          v-loading="relateListLoading"
          element-loading-text="给我一点时间"
          ref="multipleTable1"
          :data="relateList"
          tooltip-effect="dark"
        >
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
          <el-table-column prop="createTime" label="上传时间" align="center"></el-table-column>
          <el-table-column prop="status" label="类型" align="center">
            <template slot-scope="scope">{{typeList[scope.row.resourceType]}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          align="center"
          :page-sizes="[30,50,100,200,500]"
          :page-size="relatedForm.pageSize"
          :current-page="relatedForm.pageNum"
          @current-change="currentPageFun"
          @size-change="pagesizeFun"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { getMultipleSelectionIDs } from "@/filters/getIds";
import { getNavAPI, fileAPI, exportListAPI } from "@/api/resource/common";
import "@/styles/resource.scss";
import { getRelatedList } from "@/api/resource/ebook";
import queryString from "query-string";
import { getTypeAPI } from "@/api/work/index";
export default {
  data() {
    return {
      relatedForm: {
        pageNum: 1,
        pageSize: 50
      },
      typeList: [],
      relateListLoading: true,
      relateList: [],
      total: 0
    };
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    getDialogList() {
      //相关资源list
      getRelatedList(this.relatedForm).then(res => {
        if (res.status) {
          this.relateList = res.data.data.list;
          this.total= res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.relateListLoading = false;
      });
    },
    getType() {
      getTypeAPI().then(res => {
        this.typeList = res.data.data;
        console.log(this.typeList)
      });
    },
    searchRelated() {
      //检索
      this.getDialogList();
    },
    // 翻页
  pagesizeFun(val) {
    this.relatedForm.pageSize = val;
    this.getDialogList();
  },
  currentPageFun(val) {
    this.relatedForm.pageNum = val;
    this.getDialogList();
  },
  },
  
  mounted() {
    this.relatedForm.id = this.$route.query.id;
    this.getDialogList();
    this.getType()
  }
};
</script>
<style scoped>
.el-input {
  width: 200px;
}
.el-form-item {
  display: inline-block;
  width: 300px;
}
/* .prfooter{
  width: calc(100vw - 218px);
} */
</style>
