<template>
 <el-container class="project-plan submitBtn">
     <el-main>
         <div class="dashboard-editor-container">
            <div class="exportExcelBox buttons">
                <h3 class="tit">数据统计</h3>
                <el-button
                    type="primary"
                    @click="exportExc"
                    v-if="authBtns.filter(i => i.idName=='exportExcel').length>0"
                    >
                    <i class="imExcel"></i>导出Excel
                </el-button>
            </div>

           <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>
           <div class="formlist">
             <el-form ref="form" :model="bookForm" label-width="75px">
               <el-form-item label="图书名称">
                 <el-input v-model="bookForm.bookName"></el-input>
               </el-form-item>
               <el-form-item label="作者">
                 <el-input v-model="bookForm.author"></el-input>
               </el-form-item>
               <el-form-item label="责任编辑">
                 <el-input v-model="bookForm.editor"></el-input>
               </el-form-item>

               <el-form-item label="选题号">
                 <el-input v-model="bookForm.subjectNum"></el-input>
               </el-form-item>
               <el-form-item label="操作时间">
                 <el-date-picker
                   v-model="timeLimit"
                   value-format="yyyy-MM-dd"
                   type="daterange"
                   range-separator="至"
                   start-placeholder="开始日期"
                   end-placeholder="结束日期">
                 </el-date-picker>
               </el-form-item>
               <el-form-item label="图书状态" >
                 <el-select v-model="bookForm.stage" placeholder="请选择">
                   <el-option label="全部" :value="null"></el-option>
                   <el-option label="选题申报" value="2-1"></el-option>
                   <el-option label="一审作业" value="3-1"></el-option>
                   <el-option label="二审作业" value="3-2"></el-option>
                   <el-option label="三审作业" value="3-3"></el-option>
                   <el-option label="书号申领" value="4-1"></el-option>
                   <el-option label="CIP下发" value="4-2"></el-option>
                   <el-option label="发排管理" value="5-1"></el-option>
                   <el-option label="封面设计管理" value="6-1"></el-option>
                   <el-option label="待新书付型" value="7-1"></el-option>
                   <el-option label="待审核毛书" value="7-2"></el-option>
                   <el-option label="待图书入库" value="7-3"></el-option>
                   <el-option label="入库完成" value="7-4"></el-option>
                 </el-select>
               </el-form-item>
               <el-form-item class="width90">
                 <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search">检索</el-button>
                 <el-button type="primary" plain @click="onReset">
                   <i class></i>重置
                 </el-button>
               </el-form-item>
               <div>

               </div>
             </el-form>
           </div>
        </div>
        <div class="tablelist">
            <el-table :key='tableKey' stripe :data="listData" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @current-change="handleCurChange" ref="multipleTable" @selection-change="handleSelectionChange" @sort-change="sortChanged">
            <el-table-column type="index" align="center"  label="序号"></el-table-column>
              <el-table-column type="selection" align="center"></el-table-column>
             <el-table-column label="选题号" align="center" min-width="120px">
                <template slot-scope="scope">{{scope.row.subjectNum }}</template>
            </el-table-column>
            <el-table-column label="图书名称" align="center"  min-width="240px">
                <template slot-scope="scope">{{scope.row.bookName }}</template>
            </el-table-column>
            <el-table-column label="作者" align="center" min-width="120px">
                <template slot-scope="scope"> {{ scope.row.author||'————'}}</template>
            </el-table-column>
            <el-table-column label="添加时间" sortable="custom" align="center" prop="createdTime"  width="180px">
                <template slot-scope="scope">{{ scope.row.createdTime  ||'————'}}</template>
            </el-table-column>
            <el-table-column label="责任编辑" align="center"  min-width="130px">
                <template slot-scope="scope">{{ scope.row.editor  ||'————'}}</template>
            </el-table-column>
            <el-table-column label="操作时间" sortable="custom" align="center" prop="opsTime" width="180px">
                <template slot-scope="scope">{{ scope.row.opsTime ||'————'}}</template>
            </el-table-column>
            <el-table-column label="状态" align="center"  min-width="170px">
                <template slot-scope="scope">
                <span v-for="(itv,inv) in scope.row.stages" :key="inv">{{inv>0?'，':''}}{{statusList[itv]}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100px">
                <template slot-scope="scope">
                <i class="search distance" title="查看" @click="looktoRecord(scope.row)" ></i>
                </template>
            </el-table-column>
            </el-table>

        </div>
        <div  v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterright">
            <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun" :page-size="bookForm.pageSize"
                        :current-page="bookForm.pageNum"></pagination>
          </div>
        </div>
    </el-main>

   <el-dialog :visible.sync="isdownloadExcel" width="500px" title="导出">
     <el-form class="batchCommit">
       <el-form-item label="导出范围：" >
         <el-radio-group  v-model="opsType">
           <el-radio :label="0">全部数据</el-radio>
           <el-radio :label="1">选中数据</el-radio>
         </el-radio-group>
       </el-form-item>
     </el-form>
     <div slot="footer" class="dialog-footer">
       <el-button @click="exportBtn">确认</el-button>
       <el-button @click="isdownloadExcel = false">取消</el-button>
     </div>
   </el-dialog>


</el-container>
</template>
<script>
import PanelGroup from '../components/PanelGroup';
import store from "@/store";
import { getMultipleSelectionIDs } from '@/filters/getIds';
import pagination from "../../../views/resource/components/pagination";
import "@/styles/resource.scss";
import {getListAPI,statisticsAPI,exportAPI} from '@/api/newBook/book.js';
export default {
  name: 'bookIndex',
  components: {
    PanelGroup,
    pagination
  },
  data() {
    return {
      authBtns: [],
      bookForm:{
        pageNum: 1,
        pageSize: 50,
        stage:null,
      },
      timeLimit:[],
      tableKey:0,
      listData: [],
      listLoading:false,
      isdownloadExcel:false,
      opsType:1,
      multipleSelection:[],
      ids:[],
      total:0,
      statusList:{
        "1-1":"选题申报","2-1":"选题申报","3-1":"一审作业", "3-2":"二审作业", "3-3":"三审作业", "4-1":"书号申领", "4-2":"CIP下发", "5-1":"发排管理", "6-1":"封面设计管理", "7-1":"待新书付型", "7-2":"待审核毛书", "7-3":"待图书入库", "7-4":"入库完成"
      },
    }
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    this.statistics();
    this.getList();
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    /*统计*/
    statistics(){
      statisticsAPI().then(res=>{
        if(res.data.status){

        }
      })
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    //导出
    exportExc(){
      if(this.multipleSelection.length==0){
        this.opsType=0;
      }else{
        this.opsType=1;
      }
      this.isdownloadExcel=true;
    },
    exportBtn(){
      let data={};
      if(this.opsType==0){
        data.opsType=0;
      }else{
        if(this.multipleSelection.length>0){
          data.opsType=this.opsType;
          data.ids=this.ids;
        }else{
          this.$message.warning('请到列表中选择要导出的数据');
          return
        }
      }

      let url=`${process.env.BASE_API}/newbook/bg/newbook/export?`,url2='';
      for(let key in data){
        if(data[key]!=null){
          url2=url2+`&${key}=${data[key]}`;
        }
      }
      url=url+url2.substring(1);
      window.open(url);
      this.isdownloadExcel=false;
    },
    //检索
    onSubmit(){
      if(this.timeLimit.length>0){
        this.bookForm.opsStartTime=this.timeLimit[0];
        this.bookForm.opsEndTime=this.timeLimit[1];
      }
      this.getList();
    },
    //重置
    onReset(){
      this.timeLimit=[];
      this.bookForm={
        pageNum: 1,
        pageSize: this.bookForm.pageSize,
        orderBy:this.bookForm.orderBy,
      };
      this.getList();
    },
    handleCurChange(val){
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multipleSelection.length>0 ? this.ids = getMultipleSelectionIDs(this.multipleSelection,'id') : true
    },
    // 排序
    sortChanged({column, prop, order}) {
      if (order) {
        this.bookForm.orderBy = `${prop} ${order.substring(0, order.length - 6)}`
      } else {
        this.bookForm.orderBy = null
      }
      this.getList();
    },
    getList(){
        this.listLoading=true;

      getListAPI(this.bookForm).then(res=>{
        if(res.data.status){
          this.listData=res.data.data.list;
          this.total = res.data.data.total;
        }
        this.listLoading=false;
      })

    },
    //查看图书
    looktoRecord(row){
        this.$router.push({path:`/newBook/book/view?lookId=${row.id}`})
    },
    // 翻页
    pagesizeFun(val) {
      this.bookForm.pageNum = 1;
      this.bookForm.pageSize = val;
      this.getList();
    },
    currentPageFun(val) {
      this.bookForm.pageNum = val;
      this.getList();
    }
  }
}
</script>
<style lang="less" scoped>
    .dashboard-editor-container{
        .tit{
            font-weight: 400;
            font-size: 20px;
            display: inline-block;
            margin-right: 18px;
        }
        .imExcel {
            display: inline-block;
            width: 14px;
            height: 14px;
            background: url("../../../assets/img/plan_excel.png") no-repeat;
            margin-right: 3px;
            float: left;
        }

    }

    .tablelist .search {
        display: inline-block;
        width: 17px;
        height: 19px;
        background: url("../../../assets/img/search.png") no-repeat;
    }
</style>
