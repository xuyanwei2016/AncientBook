<template>
  <div class="app-container project-plan">
    <el-form inline class="formlist">
      <el-form-item label="操作人">
        <el-input @keyup.enter.native="handleFilter" v-model="listQuery.createrName" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter" class="search" icon="el-icon-search">检索</el-button>
        <el-button @click="resetFilter" plain>重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row>
      <el-table-column type="index" align="center" :index="indexSet"></el-table-column>      
      <!-- <el-table-column align="center" type="selection"></el-table-column> -->
      <el-table-column label="操作人" min-width="90px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createrAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" min-width="110px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" min-width="140px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" min-width="300px" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="120" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <i
          :class="authBtns.filter(i => i.idName=='detailbtn')[0].icon"
          v-if="authBtns.filter(i => i.idName=='detailbtn').length > 0"
          :title="authBtns.filter(i => i.idName=='detailbtn')[0].name"
          @click="handleDetail(scope.row)"
        ></i>
      </template>
    </el-table-column>
    </el-table>

    
    <div v-if="total>0" class="prfooter">
      <div class="prfooterright">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
      </div>
    </div>

    <el-dialog
      title="查看记录"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form ref="dataForm" :model="detailForm" label-width="80px">
        <el-form-item label="操作人">
          <el-input disabled v-model="detailForm.createrAccount"></el-input>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input disabled v-model="detailForm.ip"></el-input>
        </el-form-item>
        <el-form-item label="操作时间">
          <el-input disabled v-model="detailForm.createTime"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" rows="10" disabled v-model="detailForm.description"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getData ,getDetailAPI} from "@/api/system-management/systemlog";
import store from '@/store'
import "@/styles/resource.scss";
export default {
  name: "complexTable",
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        createrName: '',
        beginTime: null,
        endTime: null
      },
      authBtns:[],
      detailForm:{

      },
      dialogVisible:false,
      time:[],
      temp: {
        id: null,
        status: '',
        logo: '',
        name: '',
        description: ''
      },
      maxSort:0,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: '修改支付描述'
      },
      multipleSelection:[]
    };
  },
  mounted() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
    if( ifUndefined(store.getters.systemlogSerKeys.pageNum) ){
      this.listQuery = store.getters.systemlogSerKeys
      if(ifUndefined(this.listQuery.beginTime) || ifUndefined(this.listQuery.endTime)){
        this.time = []
        this.time[0] = this.listQuery.beginTime
        this.time[1] = this.listQuery.endTime
      }
    }
    this.getList();
  },
  methods: {
    //详情
    handleDetail(val){
      this.dialogVisible=true
      getDetailAPI(val.id).then(res => {
        if(res.data.code==0){
          this.detailForm=res.data.data
        }
      })
    },
    getList() {
      this.listLoading = true;
      getData(this.listQuery).then(response => {
        if(response.data.code === 0){
         for(let i=0;i<response.data.data.list.length;i++){
           let reg = /[\u4e00-\u9fa5]/g;           
           let descrip = response.data.data.list[i].description.match(reg);           
           response.data.data.list[i].description =descrip.join("").slice(0,8);
         }
          this.list = response.data.data.list
          this.total = response.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false;
      });
    },
    resetFilter(){
      this.time =[],
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        createrName: '',
        beginTime: null,
        endTime: null
      }
      this.getList()
    },
    handleFilter() {
      if (this.time) {
        this.listQuery.beginTime = this.time[0]
        this.listQuery.endTime = this.time[1]
      } else {
        this.listQuery.beginTime = null
        this.listQuery.endTime = null
      }
      store.dispatch('SetSystemlogSerKeys',this.listQuery).then(res => {
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    //解决索引只排序当前页的问题,增加函数自定义索引序号
    indexSet(index){
      return (this.listQuery.pageNum-1)*this.listQuery.pageSize+index+1;
    },
  }
};
</script>
<style scoped>
.prfooter{
        width: calc(100vw - 237px);
    }
</style>
