<template>
  <div class="app-container">
      
    <!-- <div class="buttons">
        <el-button icon="el-icon-view" @click="massReview">批量审核</el-button>
        <el-button icon="el-icon-circle-check" @click="corrected">完成纠错</el-button>
    </div> -->
    <el-form inline class="form-inline">
      <el-form-item label="操作人">
        <el-input @keyup.enter.native="handleFilter" style="width: 180px;" clearable v-model="listQuery.title">
        </el-input>
      </el-form-item>
      <el-form-item label="登录时间">
        <el-col :span="11">
          <el-date-picker type="date" v-model="listQuery.biginCommitTimeTime" value-format="yyyy-MM-dd" placeholder="年/月/日" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2" style="text-align: center;">至</el-col>
        <el-col :span="11">
          <el-date-picker type="date" v-model="listQuery.endCommitTimeTime" value-format="yyyy-MM-dd" placeholder="年/月/日" style="width: 100%;"></el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleFilter">检索</el-button>
        <el-button style="margin-left: 10px;" @click="resetFilter">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :key='tableKey' stripe :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row @current-change="handleCurChange" ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column align="center" type="selection"></el-table-column>
      <el-table-column min-width="100px" align="center" label="操作人">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" align="center" label="IP">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" align="center" label="操作时间">
        <template slot-scope="scope">
          <span>{{scope.row.commitTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录方式" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">PC端</span>
          <span v-else-if="scope.row.type === 2">WAP端</span>
        </template>
      </el-table-column>
      <el-table-column label="备注信息" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.content}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <!-- <el-dialog title="查看纠错内容" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="100px" style='margin-right:20px;'>
        <el-form-item label="资源名称：" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>
        <el-form-item label="资源类型：" prop="type">
          <el-input v-if="temp.type === 1" value="电子书"></el-input>
          <el-input v-else-if="temp.type === 2" value="文章"></el-input>
          <el-input v-else-if="temp.type === 3" value="视频"></el-input>
        </el-form-item>
        <el-form-item label="纠错人：" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="提交时间：" prop="commitTime">
          <el-input v-model="temp.commitTime"></el-input>
        </el-form-item>
        <el-form-item label="审核状态：" prop="status">
          <el-input v-if="temp.type === 0" value="未审核"></el-input>
          <el-input v-else-if="temp.type === 1" value="已审核"></el-input>
          <el-input v-else-if="temp.type === 2" value="已纠错"></el-input>
        </el-form-item>
        <el-form-item label="纠错内容：" prop="content">
          <el-input type="textarea" :autosize="{ minRows: 2}" v-model="temp.content"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog> -->

  </div>
</template>
<script>
import { getData, deleteData, changeType } from "@/api/website-management/errorCorrection";
import {operationMsg} from '@/utils/publicFunctions'
import {getMultipleSelectionIDs} from '@/filters/getIds'

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
        status: null,
        title: null,
        biginCommitTimeTime: null,
        endCommitTimeTime: null,
        type: null
      },
      massQuery: {
        ids: [],
        status: null
      },
      temp: {
        commitTime: '',
        type: null,
        status: null,
        name: '',
        title: '',
        content: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      multipleSelection:[]
    };
  },
  mounted() {
    this.getList()
  },
  methods: {
    handleCurChange(val){
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val)
      },
    getList() {
      this.listLoading = true;
      getData(this.listQuery).then(res => {
        console.log(res)
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败')
        }
        this.listLoading = false
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length>0 ? this.massQuery.ids = getMultipleSelectionIDs(this.multipleSelection): true
    },
    massReview(){
      if (this.multipleSelection.length!=0) {
        const unreviewed = this.multipleSelection.every(arg => arg.status === 0 )
        if (unreviewed) {
          this.$confirm('确定标记为已审核状态?', '批量审核', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.massQuery.status = 1
            changeType(this.massQuery).then(res => {
              operationMsg.apply(this,[res.data,'审核'])
            })
          });
        } else {
          this.$message.warning('只能操作未审核数据！')
        }
      } else {
        this.$message.warning('请先选择需要审核的内容')
      }
    },
    corrected(){
      if (this.multipleSelection.length!=0) {
        const unreviewed = this.multipleSelection.every(arg => arg.status === 1 )
        if (unreviewed) {
          this.$confirm('确定标记为已纠错状态?', '完成纠错', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.massQuery.status = 2
            changeType(this.massQuery).then(res => {
              operationMsg.apply(this,[res.data,'纠错'])
            })
          });
        } else {
          this.$message.warning('只能操作已审核数据！')
        }
      } else {
        this.$message.warning('请先选择完成纠错的内容')
      }
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize,
        status: null,
        title: null,
        biginCommitTimeTime: null,
        endCommitTimeTime: null,
        type: null
      }
      this.getList()
    },
    handleFilter() {
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
    singleDelete(id) {
      this.$confirm('确定要删除这条纠错吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteData(id).then(res => {
          operationMsg.apply(this,[res.data,'删除'])
        })
      });
    },
    checkDetail(row){
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.dialogFormVisible = true
    }
  }
};
</script>
<style>

</style>