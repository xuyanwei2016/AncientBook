<template>
  <div class="app-container">
    <div class="buttons">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addbtn') >= 0" @click="handleForm">
        {{authBtns.filter(i => i.idName=='addbtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addbtn').length>0 && authBtns.filter(i => i.idName=='addbtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addbtn')].icon, 'el-icon--right']"></i>
      </el-button>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" border element-loading-text="给我一点时间" highlight-current-row>
      <el-table-column label="栏目名称" min-width="200" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序号" min-width="100" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editbtn')[0].icon" v-if="authBtns.filter(i => i.idName=='editbtn').length > 0" @click="handleForm(scope.row)" :title="authBtns.filter(i => i.idName=='editbtn')[0].name"></i>
          <i :class="authBtns.filter(i => i.idName=='deletebtn')[0].icon" v-if="authBtns.filter(i => i.idName=='deletebtn').length > 0" @click="singleDelete(scope.row.id)" :title="authBtns.filter(i => i.idName=='deletebtn')[0].name"></i>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style='margin-right:50px;'>
        <el-form-item label="栏目名称：" prop="name">          
          <el-input v-model="temp.name"></el-input>          
        </el-form-item>
        <el-form-item label="排序号：" prop="sort">
          <el-input v-model="temp.sort"></el-input>
        </el-form-item>
      </el-form> 
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" :loading="sending">确认</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { add, getList, update, singleDeleteAPI, isExistAPI } from '@/api/website-management/board'
import { operationMsg, confirm } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (value.replace(/\s+/g,"") == ''){
        callback(new Error('未填写'));
      } else if (value.length > 15) {
        callback(new Error(`最多15字！现${value.length}字！`))
      } else {
        let params = { name: value }
        this.dialogStatus === 'update' ? params.id = this.temp.id : params
        isExistAPI(params).then(res => {
          res.data.code === 0 ? res.data.data === false ? callback() : callback(new Error(`栏目名${value}已存在！`)) : callback(new Error(`错误Error：${res.data.msg}`))
        })
      }
    }
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 50
      },
      temp: {
        name: '',
        sort: 0
      },
      maxSort: -1,
      rules: {
        name: [{ required: true, trigger: 'change', validator: validateName }],
        sort: [{ required: true, pattern: /^([1-9]\d*|0)$/, message: '请输入0或正整数', trigger: 'blur' }]
      },
      textMap: {
        create: '添加栏目',
        update: '编辑栏目'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      sending: false
    }
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList()
  },
  methods: {
    submitForm(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.sending = true
          this.temp.id ? this.invokeApi(update) : this.invokeApi(add)
        }
      })
    },
    invokeApi(api){
      api(this.temp).then(res => {
        operationMsg.apply(this, [res.data, this.textMap[this.dialogStatus] ])
        res.data.code === 0 ? this.dialogFormVisible = false : true
        this.sending = false
      })
    },
    handleForm(row){
      this.list.length>0 ? this.maxSort = this.list.reduce((maxNum, item) => Math.max(maxNum, item.sort), 0) : this.maxSort = -1
      if (row.id) {
        this.temp = Object.assign({}, row)
        this.dialogStatus = 'update'
      } else {
        this.resetTemp()
        this.dialogStatus = 'create'
      }
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    resetTemp(){
      this.temp = {
        name: '',
        sort: parseInt(this.maxSort)+1
      }
    },
    singleDelete(id) {
      confirm.apply(this,['确定删除此条栏目吗？']).then(() => {
        singleDeleteAPI(id).then(res => {
          operationMsg.apply(this,[res.data,'删除'])
        })
      })
    },
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取列表失败')
        }
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
</script>
