<template>
  <div class="project-plan">
    <div class="plan-container" id="box">
      <div class="planLeft">
        <el-tree
          :data="navTree"
          :props="defaultProps"
          @node-click="handleNodeClick"
          default-expand-all
        ></el-tree>
      </div>
      <el-main>
        <div class="prtop">
          <div class="prtopt">
            <p class="type">
              <em>类型：</em>
              <span :class="listQuery.resourceType === ''?'blue':''" @click="typeChange('')">全部</span>
              <span
                v-for="(item,index) in typeList"
                :key="index"
                @click="typeChange(index)"
                :class="index === listQuery.resourceType?'blue':''"
              >{{item}}</span>
            </p>
            <i class="el-icon-arrow-down pullright"></i>
          </div>
          <div class="prtopb">
            <p class="resource">
              <em>来源：</em>
              <span
                v-for="(item,index) in sourceList"
                :key="index"
                @click="sourceChange(index)"
                :class="index === sourceIndex?'blue':''"
              >{{item}}</span>
            </p>
          </div>
        </div>
        <div class="prmiddle">
          <div class="iconlist">
            <div class="iconleft pullleft">
              <em>排列：</em>
              <span :class="relevanceType == true?'blue':''" @click="order()">
                关联度&nbsp;
                <i class="el-icon-back"></i>
              </span>
              <span
                :class="timeType == true?'blue':''"
                v-if="listQuery.resourceType==1"
                @click="order()"
              >
                出版时间
                <i class="el-icon-back"></i>
              </span>
              <span :class="timeType == true?'blue':''" v-else @click="order()">
                上传时间
                <i class="el-icon-back"></i>
              </span>
              <el-checkbox v-model="download" @change="downType(download)">可下载</el-checkbox>
              <el-checkbox v-model="finished" @change="finishedType(finished)">已完成</el-checkbox>
            </div>
            <div class="iconright pull-right">
              <el-checkbox v-model="listFinished" @change="fininshType = !fininshType">列表显示完成度</el-checkbox>
              <i :class="{rowCheck :viewType==2}" class="rowico marginleft" @click="viewType = 2"></i>
              <i
                :class="{tableCheck :viewType==1}"
                class="listico marginleft"
                @click="viewType = 1"
              ></i>
              <span class="marginleft">共{{total}}条搜索结果</span>
            </div>
          </div>
          <div class="plancon">
            <!-- 表格形式 -->
            <el-table
              border
              v-loading="listLoading"
              element-loading-text="给我一点时间"
              ref="multipleTable"
              :data="list"
              tooltip-effect="dark"
              style="margin-bottom:50px"
              @select="selectionChange"
              v-if="viewType == 1"
              :show-header="false"
            >
              <el-table-column align="center" type="selection"></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <div class="list" style="width:100%">
                    <div class="content">
                      <img
                        @click="toDetails(scope.row)"
                        v-if="scope.row.cover"
                        :src="`${domain}${requestPath.file}?fileName=${scope.row.cover}&isOnLine=true`"
                        class="pic"
                      >
                      <img
                        @click="toDetails(scope.row)"
                        v-else
                        src="../../assets/img/bookDefault.png"
                        class="pic"
                      >
                      <div class="info">
                        <h1 @click="toDetails(scope.row)" class="green">{{scope.row.name}}</h1>
                        <h6>
                          <em v-if="scope.row.resourceType==1||scope.row.resourceType==2">作者：{{scope.row.author}}</em>
                          <em v-if="scope.row.resourceType==1">ISBN号：{{scope.row.isbn}}</em>                                                        
                          <em v-if="scope.row.resourceType==1">出版时间：<span v-if="scope.row.publishTime">{{scope.row.publishTime.substr(0,7)}}</span></em>
                          <em v-if="scope.row.resourceType==1">版次：{{scope.row.edition}}</em>
                          <em v-if="scope.row.resourceType==1">本版/外版：{{scope.row.dataSources}}</em>
                          <em v-if="scope.row.resourceType==1">加工状态：<span v-if="scope.row.processingState==0">已加工</span><span v-if="scope.row.processingState==1">未加工</span> <span v-if="scope.row.processingState==2">免加工</span></em>
                          <em v-if="scope.row.resourceType==1">下架/上架：<span v-if="scope.row.status==1">上架</span><span v-if="scope.row.status==2">下架</span></em>
                          <em v-if="scope.row.resourceType==1">数字版权：{{scope.row.numberCopyright}}</em>
                          <em v-if="scope.row.resourceType==1">是否绘本：{{scope.row.isPaintBook}}  </em>
                          <em v-if="scope.row.resourceType==1">是否合作书：<span v-if="scope.row.isCooperationBook==1">是</span> <span v-if="scope.row.isCooperationBook==2">否</span></em>
                          <em v-if="scope.row.resourceType!=1">所属图书：{{scope.row.bookName}}</em>
                        </h6>
                        <p class="intro"  v-if="scope.row.resourceType!=1" v-html="scope.row.intro"></p>
                        <div class="infoicon">
                          <span class="red marginleft" v-if="fininshType == true">完成度：90%</span>
                          <span
                            class="marginleft bluecolor"
                            v-if="scope.row.resourceType==1"
                            @click="relation(scope.row)"
                          >
                            <i class="resources"></i>相关资源
                          </span>
                          <span
                            class="marginleft bluecolor"
                            @click="applyDown(scope.row)"
                            v-if="scope.row.download == 0"
                          >
                            <i class="dwico"></i>申请下载
                          </span>
                          <span class="marginleft bluecolor" v-else @click="downLoad(scope.row.id)">
                            <i class="dwico"></i>下载
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!-- 矩阵形式 -->
            <div class="matrix" v-if="viewType == 2">
              <div class="matrixList" v-for="(item,index) in matrixList" :key="index">
                <el-checkbox v-model="item.checkType" style="float:left"></el-checkbox>
                <img
                  @click="toDetails(item)"
                  v-if="item.cover"
                  :src="`${domain}${requestPath.file}?fileName=${item.cover}&isOnLine=true`"
                  class="image"
                >
                <img
                  @click="toDetails(item)"
                  v-else
                  src="../../assets/img/bookDefault.png"
                  class="image"
                >
                <div @click="toDetails(item)" class="text">{{item.name}}</div>
                <div class="btn" @click="applyDown(item)" v-if="item.download == 0">
                  <i class="el-icon-download"></i>申请下载
                </div>
                <div class="btn" @click="downLoad(item.id)" v-else>下载</div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterleft">
            <el-checkbox v-model="checkedAll" @change="allCheck">全选</el-checkbox>
            <span class="marginleft" @click="downLoad()">批量下载</span>
            <!--更多-->
            <el-popover placement="right" width="160" trigger="click">
              <p @click="exportData" style="margin-bottom: 10px;">批量导出图书元数据</p>
              <p @click="composition">排版文件</p>
              <span class="marginLeft" slot="reference">更多</span>
            </el-popover>
            <!--更多-->
            <!-- <span class="marginleft">更多</span> -->
          </div>
          <div class="prfooterright">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="listQuery.pageNum"
              :page-sizes="[30,50,100,200,500]"
              :page-size="listQuery.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              align="center"
            ></el-pagination>
          </div>
        </div>
      </el-main>
    </div>
    <el-dialog title="关联内容" :visible.sync="relatedDialog" class="backgroundDialog relatedDialog">
      <el-form :model="relatedForm" label-width="120">
        <el-form-item label="资源类型" style="margin-right:20px">
          <el-select v-model="relatedForm.resourceType" placeholder="全部">
            <el-option label="全部" value></el-option>
            <el-option v-for="(key,value) in typeList" :key="key" :label="key" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称">
          <el-input v-model="relatedForm.name"></el-input>
        </el-form-item>
        <el-button type="primary" @click="searchRelated" icon="el-icon-search">检索</el-button>
      </el-form>
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
      <div class="prfooter">
        <el-pagination
          @size-change="pagesizeFun2"
          @current-change="currentPageFun2"
          :current-page="relatedForm.pageNum"
          :page-size="relatedForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total2"
          align="center"
        ></el-pagination>
      </div>
    </el-dialog>
    <el-dialog
      title="申请下载"
      :visible.sync="applyDialog"
      @close="closeApply"
      class="backgroundDialog exportExcelDialog"
    >
      <el-form ref="applyform" :model="applyform" label-width="82px">
        <el-form-item label="文件形式">
          <el-checkbox-group v-model="applyform.fileList">
            <el-checkbox
              v-for="(value,key) in fileList"
              :label="key"
              name="words"
              :key="key"
            >{{value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p class="downloadSty">{{downloadTips}}</p>
        <el-form-item label="申请原因" prop="intro">
          <el-input v-model="applyform.reason" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmApply" :loading="applyLoading" class="success">确定</el-button>
        <el-button @click="applyDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--批量导出Excel-->
    <el-dialog
      title="批量导出"
      :visible.sync="exportExcelDialog"
      close="exportWin"
      class="backgroundDialog excelDialog"
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
          <el-checkbox-group v-model="exportExportform.words" @change="handleCheckedWordsChange">
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
    <!--下载-->
    <el-dialog
      title="下载"
      :visible.sync="downDialog"
      @close="closeDown"
      class="backgroundDialog exportExcelDialog"
    >
      <el-form ref="downForm" :model="downForm" label-width="82px">
        <el-form-item label="文件形式">
          <el-checkbox-group v-model="downForm.typeList">
            <el-checkbox
              v-for="(value,key) in fileList"
              :label="key"
              name="words"
              :key="key"
            >{{value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p class="downloadSty">{{downloadTips}}</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="confirmDown" :loading="downLoading" class="success">确定</el-button>
        <el-button @click="downDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { getMultipleSelectionIDs } from "@/filters/getIds";
import { getTreeAPI, fileAPI, exportListAPI } from "@/api/resource/common";
import "@/styles/resource.scss";
import { getRelatedList } from "@/api/resource/ebook";
import { predownAPI } from "@/api/work/apply";
import queryString from "query-string";
import { getListAPI, getTypeAPI, saveAPI, downLoadAPI } from "@/api/work/index";
import { messageAPI } from "@/api/login";
import { confirm } from "@/utils/publicFunctions";
export default {
  name: "plan",
  components: { queryString },
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      typeList: [],
      sourceList: ["全部", "本版", "外版"],
      sourceIndex: 0,
      relevanceType: true,
      timeType: false,
      navTree: [],
      defaultProps: {
        children: "list",
        label: "showName"
      },
      downloadTips: "",
      downDialog: false,
      downForm: {
        typeList: [],
        ids: []
      },
      fininshType: false,
      list: [],
      matrixList: [],
      total: 0,
      total2: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        resourceType: "",
        download: null
      },
      viewType: 1, //默认为table形式
      multipleSelection: [],
      ids: [],
      listLoading: true,
      download: false,
      fininsh: false,
      listFinished: false,
      finished: false,
      checkedAll: false,
      downLoadIds: [],
      relatedDialog: false,
      relatedForm: {
        pageNum: 1,
        pageSize: 50
      },
      relateList: [],
      relateListLoading: true,
      applyDialog: false,
      applyform: {
        file: [],
        fileList: [],
        reason: ""
      },
      fileList: [],
      downParams: {},
      exportExcelDialog: false,
      exportExportform: {
        words: [],
        range: ""
      },
      excelListItems: [],
      isIndeterminate: false,
      checkAllWords: false,
      arrayWordsAll: [], //导出excel结束
      rangeExcelList: {
        objectIds: [],
        isDelete: 0,
        names: null,
        resourceType: 1
      },
      applyLoading:false,
      downLoading:false,
      linkList: {
        1: "book_store/addBookResource?type=view&id=",
        2: "article/add_article?type=view&detailsId=",
        5: "picture_store/add_pic?type=view&id=",
        6: "video_store/add_video?type=view&id=",
        7: "audio_store/add_audio?type=view&id=",
        8: "animation_store/add_animation?type=view&id=",
        9: "courseware/create?type=view&id=",
        10: "statute/create?type=view&id=",
        14: "clause/add_clause?type=view&id=",
        15: "pdf/create?type=view&id=",
        16: "expert/create?type=view&id="
      },
      linkRelatedList:{
        1:'book_store/relatedResource',
        2:'article/relatedResource',
        5:'picture_store/relatedResource',
        6:'video_store/relatedResource',
        7:'audio_store/relatedResource',
        8:'animation_store/relatedResource',
        10:'statute/relatedResource',
        14:'clause/related_res',
        15:'pdf/relatedResource'      
      }
    };
  },
  watch: {
    "$store.state.pageTemp.search_value": function(e) {
      this.listLoading = true;
      this.listQuery.keyword = e;
      this.getList();
    }
    //选择的时候出现的下载
    // 'applyform.fileList':function(e){
    // if(e.length>0){
    // let data={
    // ids:this.downParams.id,
    // type:e.join(",")
    // }
    // predownAPI(data).then( res=> {
    // if(res.data.code==0){
    // this.downloadTips=res.data.data
    // }else{
    // this.downloadTips=res.data.msg
    // }
    // })
    // }else{
    // this.downloadTips=''
    // }
    // },
    // //下载是否有资源可以下载
    // 'downForm.typeList':function(e){
    // if(e.length>0){
    // let data={
    // ids:this.downForm.ids,
    // type:e.join(",")
    // }
    // predownAPI(data).then( res=> {
    // if(res.data.code==0){
    // this.downloadTips=res.data.data
    // }else{
    // this.downloadTips=res.data.msg
    // }
    // })
    // }else{
    // this.downloadTips=''
    // }
    // }
  },
  mounted() {
    this.getNav(0);
    this.getList();
    this.getType();
    this.getfileList();
    let reType = this.$route.params.id;
    if (!reType) {
      window.localStorage.removeItem("resourceType");
    } else {
      this.listQuery.resourceType = reType;
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    getType() {
      getTypeAPI().then(res => {
        this.typeList = res.data.data;
      });
    },
    getNav(type) {
      // 左侧自定义分类
      getTreeAPI(type).then(res => {
        if (type == 0) {
          res.data.data = [{ showName: "全部" }].concat(res.data.data);
        }
        res.data.code === 0
          ? (this.navTree = res.data.data)
          : this.$message.error("获取nav数据失败");
      });
    },
    getfileList() {
      fileAPI().then(res => {
        this.fileList = res.data.data;
      });
    },
    // 获取资源列表
    getList() {
      getListAPI(this.listQuery).then(res => {
        if (res.status) {
          this.list = res.data.data.list;
          this.list.map(v => {
            if (v.name) {
              v.name = v.name.replace(/<\/?[^>]*>/g, "");
            }
          });
          this.matrixList = this.list.map(el => {
            return { checkType: false, ...el };
          });
          this.total = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    typeChange(index) {
      //数据类型
      this.listLoading = true;
      this.listQuery.resourceType = index;
      this.listQuery.pageNum = 1;
      window.localStorage.setItem("resourceType", index);
      if (index) {
        this.getNav(index);
      } else {
        this.getNav(0);
      }
      this.getList();
    },
    sourceChange(index) {
      //本版和外版
      this.listLoading = true;
      this.sourceIndex = index;
      if (index == 0) {
        this.listQuery.dataSources = "";
      } else {
        this.listQuery.dataSources = index - 1;
      }
      this.getList();
    },
    order() {
      //出版时间
      this.listLoading = true;
      this.timeType = !this.timeType;
      this.relevanceType = !this.relevanceType;
      if (this.timeType) {
        if(this.listQuery.resourceType!=1){
           this.listQuery.orderBy = "uploadTime desc";
        }else{
          this.listQuery.orderBy = "publishTime desc";
        }
        
      } else {
        this.listQuery.orderBy = "";
      }
      this.getList();
    },
    downType(type) {
      //可下载
      this.listLoading = true;
      if (type) {
        this.listQuery.download = 1;
      } else {
        this.listQuery.download = "";
      }
      this.getList();
    },
    finishedType(type) {
      //已完成
      this.listLoading = true;
      if (type) {
        this.listQuery.status = 1;
      } else {
        this.listQuery.status = null;
      }
      this.getList();
    },
    //批量或者单条下载
    downLoad(id) {
      if (id) {
        this.downDialog = true;
        this.downForm.ids = id;
      } else {
        this.downLoadIds = [];
        if (this.viewType == 1) {
          //table下载
          this.downLoadIds = getMultipleSelectionIDs(this.multipleSelection);
        } else if (this.viewType == 2) {
          //矩阵下载
          this.matrixList.map(el => {
            if (el.checkType == true) {
              this.downLoadIds.push(el.id);
            }
          });
        }
        if (this.downLoadIds.length > 0) {
          this.downDialog = true;
          let ids = this.downLoadIds.join(",");
          this.downForm.ids = ids;
        } else {
          this.$message.warning("至少选择一条数据进行操作");
        }
      }
    },
    closeDown() {
      this.downForm = {
        typeList: [],
        ids: ""
      };
    },
    //确定下载
    confirmDown() {
      this.downLoading=true
      let data = {
        ids: this.downForm.ids,
        typeList: this.downForm.typeList.join(",")
      };
      predownAPI(data).then(res => {
        if (res.data.status) {
          this.downLoading=false;
          this.downDialog=false;
          this.$message.success('下载成功');
          window.open(`${process.env.BASE_API}${res.data.data}`);
        } else {
          this.$message.error(`${res.data.msg}`);
        }
        this.downLoading=false
      });
    },
    exportData() {
      //批量导出图书元数据
      this.downLoadIds = [];
      if (this.viewType == 1) {
        //table导出
        this.downLoadIds = getMultipleSelectionIDs(this.multipleSelection);
      } else if (this.viewType == 2) {
        //矩阵导出
        this.matrixList.map(el => {
          if (el.checkType == true) {
            this.downLoadIds.push(el.id);
          }
        });
      }
      if (this.downLoadIds.length > 0) {
        this.getWordsList();
        this.exportExcelDialog = true;
        this.rangeExcelList.objectIds = [];
      } else {
        this.$message.warning("至少选择一条数据进行操作");
      }
    },
    //排版文件
    composition(){
      if(this.multipleSelection.length>0){
        this.allLength=this.multipleSelection.length;
        this.acount=0;
        for(let j =0; j<this.multipleSelection.length>0 ; j++){
          if(this.multipleSelection[j].download==0){
            this.acount+=1
          }
        }
        confirm.apply(this, ["已选"+this.allLength+",其中"+this.acount+"需申请后下载"]).then(() => {
          let data={
            ids:getMultipleSelectionIDs(this.multipleSelection).join(","),
            typeList:'排版文件'
          }
          predownAPI(data).then( res => {
            if(res.data.status){
              window.open(`${process.env.BASE_API}${res.data.data}`);
            }else {
              this.$message.error(`${res.data.msg}`);
            }
          })  
        })
      }else{
        this.$message.warning('至少选择一条数据进行操作')
      }
      
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
    //导出excel
    handleCheckedWordsChange(value) {
      let checkedCount = value.length;
      this.checkAllWords = checkedCount === this.arrayWordsAll.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.arrayWordsAll.length;
    },
    // 确认导出
    confirmExport() {
      if (this.exportExportform.range == "0") {
        this.rangeExcelList.objectIds = [];
        this.rangeExcelList.names = this.arrayWordsAll.join(",");
      } else {
        this.rangeExcelList.objectIds = this.downLoadIds.join(",");
        this.rangeExcelList.names = this.exportExportform.words.join(",");
      }
      this.rangeExcelList=Object.assign(this.rangeExcelList,this.listQuery)
      delete this.rangeExcelList.pageNum;
      delete this.rangeExcelList.pageSize;
      this.excelListData = queryString.stringify(this.rangeExcelList);
      if (
        this.exportExportform.range == "1" &&
        this.exportExportform.words.length == 0
      ) {
        this.$message.warning("请选择导出字段");
        return;
      }
      window.open(
        `${process.env.BASE_API}${requestPath.resource}/public/export_book?${
          this.excelListData
        }`
      );
    },
    handleCheckAllWordsChange(val) {
      this.exportExportform.words = val ? this.arrayWordsAll : [];
      this.isIndeterminate = false;
    },
    selectionChange(selection, row) {
      //复选框
      this.multipleSelection = selection;
    },
    allCheck() {
      //全选
      if (this.checkedAll) {
        //全选
        if (this.viewType == 1) {
          //table全选
          this.$refs.multipleTable.toggleAllSelection();
          this.multipleSelection = this.list;
        } else {
          //矩阵全选
          this.matrixList.map(el => {
            el.checkType = true;
          });
        }
      } else {
        //取消全选
        if (this.viewType == 1) {
          //table全选
          this.$refs.multipleTable.clearSelection();
          this.multipleSelection = [];
        } else {
          //矩阵全选
          this.matrixList.map(el => {
            el.checkType = false;
          });
        }
      }
    },
    applyDown(row) {
      //申请下载
      this.downParams = row;
      this.applyDialog = true;
    },
    //关闭申请下载、
    closeApply() {
      this.applyform = {
        file: [],
        fileList: [],
        reason: ""
      };
    },
    relation(row) {
      this.$router.push('/resource/'+this.linkRelatedList[row.resourceType]+'?id='+row.id+'&name='+row.name+'&type=view')
    },
    getDialogList() {
      //相关资源list
      getRelatedList(this.relatedForm).then(res => {
        if (res.status) {
          this.relateList = res.data.data.list;
          this.total2 = res.data.data.total;
        } else {
          this.$message.error("获取数据失败");
        }
        this.relateListLoading = false;
      });
    },
    confirmApply() {
      this.applyLoading=true
      //申请下载
      this.applyform.arfList = [
        {
          deptId: this.downParams.department,
          resourceId: this.downParams.id,
          resourceType: this.downParams.resourceType
        }
      ];
      if (this.applyform.fileList.length < 1 && this.applyform.reason == "") {
        this.$message.error("请填写内容！");
        return;
      }
      this.applyform.file = this.applyform.fileList.join(",");
      const { fileList, ...rest } = this.applyform;

      // this.messageApply = {
      // applyId :
      // content :rest.reason
      // examineId :
      // id :rest.id
      // status :0
      // title :this.downParams.name
      // type :1
      // userId :this.downParams.id
      // }

      saveAPI(rest).then(res => {
        if (res.data.status) {
          this.$message.success("申请成功！");
          // messageAPI()
          this.applyDialog = false;
        } else {
          this.$message.error(`${res.data.msg}`);
        }
        this.applyLoading=false
      });
    },
    searchRelated() {
      //检索
      this.getDialogList();
    },
    // 翻页
    pagesizeFun2(val) {
      this.relatedForm.pageSize = val;
      this.getDialogList();
    },
    currentPageFun2(val) {
      this.relatedForm.pageNum = val;
      this.getDialogList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleNodeClick(data) {
      //点击树节点获取table数据
      // this.listQuery.diyTypeId = data.id;
      this.listQuery.code = data.code;
      this.getList();
    },
    toDetails(row) {
      this.$router.push(
        "/resource/" + this.linkList[row.resourceType] + row.id
      );
    },
    //批量导出图书元数据关闭弹窗
    exportWin() {
      this.exportExportform = {
        words: [],
        range: ""
      };
    }
  }
};
</script>

<style>
/* .plancon .el-table__footer-wrapper, .plancon .el-table__header-wrapper{
display: none !important;
} */
.plancon .el-table--border {
  border-top: none;
}
.excelDialog .el-dialog {
  width: 506px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -253px;
  margin-top: -220px !important;
}
.exportExcelDialog .el-dialog {
  width: 506px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -253px;
  margin-top: -300px !important;
}
.excelDialog .el-checkbox + .el-checkbox {
  margin: 0;
}
.excelDialog .el-checkbox {
  width: 120px;
  float: left;
}
</style>

<style lang="less" scoped>
#box {
  .prfooter.opend {
    width: calc(100% - 420px);
  }
  .prfooter.closed {
    width: calc(100% - 276px);
  }
  .footerversion.opend {
    width: calc(100% - 420px);
  }
  .footerversion.closed {
    width: calc(100% - 276px);
  }
  .el-main {
    flex-basis: 100%;
  }
  .planLeft .el-tree {
    width: 200px;
  }
}
p {
  margin: 0;
  padding: 0;
}
.prtop {
  background: #fff;
  height: 98px;
  padding: 18px 21px;
  p {
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
    float: left;
    em {
      font-style: normal;
      margin-right: 14px;
    }
    span {
      color: #3f4861;
      margin-right: 20px;
      cursor: pointer;
    }
  }
}
.pullright {
  float: right;
}
.prtopb {
  clear: both;
}
.clear {
  clear: both;
}
.prmiddle {
  margin-top: 31px;
}
.iconlist {
  height: 40px;
  line-height: 40px;
  padding: 0px 21px;
  background: rgba(245, 247, 250, 1);
  border: 1px solid #dcdfe6;
  em {
    font-style: normal;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: #848aa1;
  }
  span {
    margin-right: 21px;
    font-size: 14px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: #848aa1;
    cursor: pointer;
    .el-icon-back {
      font-weight: 800;
      font-size: 12px;
      transform: rotate(-90deg);
    }
  }
  .marginleft {
    margin-right: 0px;
  }
}
.prtop p span.blue {
  color: #02b4d0;
}
.iconlist span.blue {
  color: #02b4d0;
}
.pullleft {
  float: left;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
.iconright {
  // width:340px;
  float: right;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
.rowico {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../assets/img/rowico.png") no-repeat;
}
.listico {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url("../../assets/img/listIcon2.png") no-repeat;
}
.rowCheck {
  background: url("../../assets/img/rowIcon2.png") no-repeat;
}
.tableCheck {
  background: url("../../assets/img/listico.png") no-repeat;
}
.marginleft {
  margin-left: 20px;
  cursor: pointer;
}
.plancon {
  background: #fff;
}
.content {
  border-bottom: 1px solid #ccc;
  display: flex;
  padding-top: 20px;
  &:last-child {
    border-bottom: 0;
  }
}
.list {
  width: 100%;
  .pic {
    width: 121px;
    height: 121px;
    margin: 0 10px;
  }
  .info {
    flex: 1;
    h1 {
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      height: 60px;
      line-height: 20px;
    }
    h6,
    p {
      font-size: 14px;
      font-family: MicrosoftYaHei;
      font-weight: 400;
    }
    h6 {
      height: 18px;
      line-height: 18px;
      margin-top: 8px;
      margin-bottom: 24px;
    }
    h6 em {
      font-style: normal;
      margin-right: 50px;
      color: #bbbbbb;
      display: inline-block;
      margin-bottom: 25px;
    }
    p {
      height: 36px;
      line-height: 18px;
      margin-top: 15px;
      color: #7e7e7e;
    }
  }
  .el-checkbox {
    clear: both;
  }
  .el-checkbox {
    float: left;
    margin-top: 45px;
  }
}
.matrix {
  padding-left: 3%;
  overflow: hidden;
  width: 100%;
  padding-top: 22px;
}
.matrixList {
  width: 17%;
  height: 355px;
  padding: 10px 20px;
  text-align: center;
  margin-bottom: 30px;
  float: left;
  margin-right: 3%;
  box-sizing: padding-box;
  cursor: pointer;
  &:hover {
    box-shadow: 0px 0px 3px 3px #e5e5e5;
  }
  .el-checkbox {
    float: left;
    margin-right:0;
  }
  .image {
    height: 160px;
    width: 120px;
    margin-bottom: 18px;
    display: inline-block;
    margin-top: 20px;
  }
  .text {
    line-height: 20px;
    margin-bottom: 26px;
    height: 40px;
    font-size: 14px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .btn {
    height: 30px;
    border: 1px solid rgba(235, 238, 245, 1);
    color: #409eff;
    line-height: 30px;
    cursor: pointer;
    &:hover{
      color: #fff;
      background: rgba(64, 158, 255, 1);
    }
  }
}
.infoicon {
  margin-right: 28px;
  float: right;
  margin-bottom: 14px;
}
.red {
  color: #f56c6c;
}
.intro {
  line-height: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  margin-right: 28px;
  margin-bottom: 20px;
}
.infoicon {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
.resources {
  display: inline-block;
  width: 16px;
  height: 18px;
  background: url("../../assets/img/resourceico.png") no-repeat;
  margin-right: 3px;
  vertical-align: text-bottom;
}
.dwico {
  display: inline-block;
  width: 18px;
  height: 18px;
  background: url("../../assets/img/downloadico.png") no-repeat;
  margin-right: 3px;
  vertical-align: text-bottom;
}
.bluecolor {
  color: #409eff;
  cursor: pointer;
}
.green {
  color: #404761;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: #02b4d0;
    text-decoration: underline;
  }
}
.relatedDialog .el-form-item {
  width: 240px;
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
// .exportExcelDialog .el-checkbox + .el-checkbox{
// margin:0;
// }
.exportExcelDialog .el-textarea__inner {
  height: 80px;
}
.exportExcelDialog .el-checkbox {
  width: 120px;
}
// .backgroundDialog .success{
// background: #66B1FF;
// color: white;
// }
.downloadSty {
  padding-left: 12px;
  font-size: 12px;
  margin-bottom: 30px;
}
</style>

