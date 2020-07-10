<template>
  <div class="project-plan app-container">
    <div class="buttons">
      <router-link :to="`contentColumn/create?upperId=0`" v-if="authBtns.filter(i => i.idName=='addBtn').length > 0">
        <el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}
          <i class="imadd"></i>
        </el-button>
      </router-link>
    </div>
    <tree-table :data="list" :evalFunc="func" :evalArgs="args" :expandAll="expandAll" border v-loading="listLoading" :par-selection="handleSelectionChange" :getFormatData="getFormatData" label-name="栏目标识名" first-column="identifierName">
      <el-table-column align="center" label="排序号" min-width="50">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="栏目显示名" min-width="70">
        <template slot-scope="scope">
          <span>{{scope.row.displayName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="内容数量" min-width="80">
        <template slot-scope="scope">
          <span>{{scope.row.contentNum}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="导航栏目" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.navigationBar === 0">启用</span>
          <span v-else>禁用</span>
        </template>
      </el-table-column>
      
      <el-table-column  label="操作" min-width="80" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="{ path:`contentColumn/create`,query:{upperName:scope.row.identifierName,upperId:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='addChildrenBtn').length > 0">
            <i class="imgadd" title="添加" v-if="authBtns.map(i => i.idName).indexOf('addChildrenBtn') >= 0"></i>
          </router-link>
          <!-- <i class="el-icon-caret-top" @click="upBtn(scope.row.id)"></i>
          <i class="el-icon-caret-bottom" @click="downBtn(scope.row.id)"></i> -->
          <!-- <i class="el-icon-d-caret changeSort" title="修改排序" @click="changeSort(scope.row)"></i> -->
          <router-link :to="{ path:`contentColumn/create`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0">
            <i class="imedit" title="编辑" v-if="authBtns.map(i => i.idName).indexOf('editBtn') >= 0"></i>
          </router-link>
          <i class="imdel" title="删除"  v-if="authBtns.map(i => i.idName).indexOf('deleteBtn') >= 0"  @click="deleteBtn(scope.row.id)"></i>
        </template>
      </el-table-column>
    </tree-table>

    <!-- 设置排序号对话框 -->
    <el-dialog title="设置排序位置"  :visible.sync="sortDialog" width="355px" @close="closeSort" class="auditDialog backgroundDialog">
        <el-form class="dialogTip" :rules="ruled" ref="sortForm" :model="getSortData" >
          <el-form-item label="排序号仅用于同级别栏目，请设置排序号:" prop="sort">
            <el-input v-model="getSortData.sort" style="width:265px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="confirmDel">确 定</el-button>
            <el-button @click="sortDialog = false">取 消</el-button>
        </div>
    </el-dialog>

    <!-- 删除对话框 -->
    <!-- <el-dialog title="删除" :visible.sync="dialogVisible" width="30%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="batchDelete">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-14:54
*/
// import waves from '@/directive/waves' // 水波纹指令
import treeTable from '@/components/TreeTable'
import treeToArray from '@/views/example/table/treeTable/customEval'
import { getAllAPI , batchDelAPI , updateUpDownAPI, changeSortAPI } from '@/api/contentManagement/contentColumn'
import getTreeId from '@/filters/getTreeid'
import { operationMsg, confirm, requestMsg } from '@/utils/publicFunctions'
import store from '@/store'

export default {
  name: 'customTreeTableDemo',
  // directives: { waves },
  components: { treeTable },
  data() {
    var validateParam = (rule, value, callback) => {
      if( value.replace(/\s+/g,"") == '' ){
        callback(new Error('请输入栏目标识名'));
      } else {
        callback()
      }
    };
    var validateSort =  (rule, value, callback) => {
      let reg=/^([1-9]\d{0,8}|0)$/
      if( value.replace(/\s+/g,"") == '' ){
        callback(new Error('请输入排序位置'));
      } else if(!reg.test(value)){
        callback(new Error('只可以输入正整数'))
      }else{
        callback()
      }
    };
    return {
      authBtns: [],
      func: treeToArray,
      expandAll: false,
      list: [],
      dialogVisible: false,
      listLoading: true,
      temp: {
        id: null,
        identifierName : '',
        intro: '',
        parentId: 0,
        sort: null
      },
      parentName:'',
      modules:[],
      authParams:{
        pId: 0,
        deptId: null
      },
      form:{
        id: 0,
        mpIdList: []
      },
      defaultProps: {
        children: 'children',
        label: 'moduleName'
      },
      formatList:[],
      ids: [],
      checkedIds:[],
      textMap: {
        update: '修改部门',
        create: '添加部门',
        createChild: '添加子部门'
      },
      rules: {
        identifierName: [{ type: 'string', required: true, trigger: 'change', validator: validateParam }],
        
      },
      ruled: {
        sort:[{ required:true, trigger:'blur', validator: validateSort}]
      },
      loading: false,
      multipleSelection:[],
      args: [null, null, 'timeLine'],
      sortDialog: false,
      changeSortData:null,
      getSortData:{
        sort: null
      }
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {
    this.getList()
  },
  methods: {
    // handleAuthorization(row){
    //   // console.log(row)
    //   this.authParams.pId = row.parentId
    //   this.authParams.deptId = row.id
    //   // console.log(this.authParams)
    //   getModuleAPI(this.authParams).then(res => {
    //     if (res.data.code === 0) {
    //       // console.log(res.data.data)
    //       this.modules = res.data.data.mpList
    //       this.form.id = row.id
    //       this.checkedIds = res.data.data.mpidList
    //       console.log(this.checkedIds)
    //       this.dialogPvVisible = true
    //     } else {
    //       this.$message.error('获取模块权限失败');
    //       console.log(res.data.data)
    //     }
    //   })
    // },
    // moduleSubmit() {
    //   this.loading = true
    //   this.form.mpIdList = this.$refs.tree.getCheckedKeys()
    //   console.log(this.form)
    //   updateModuleAPI(this.form).then(res => {
    //     operationMsg.apply(this,[res.data.code,'修改模块权限'])
    //     res.data.code === 0 ? this.dialogPvVisible = false : true
    //     this.loading = false
    //   })
    // },

    // 单条删除
    deleteBtn(val) {
      confirm.apply(this,['确认删除内容栏目吗?']).then(() => {
          batchDelAPI(val).then(res => {
              requestMsg.apply(this, [res.data, '删除'])
              this.getList()
          })
      })
    },
    changeSort(val){
      this.sortDialog=true;
      this.changeSortData=val
    },
    getFormatData(data){
      this.formatList = data
    },
    
    getList() {
      this.listLoading = true
      getAllAPI().then(response => {
        if(response.data.code === 0){
          const originalData = JSON.stringify(response.data.data)
          this.list = JSON.parse( originalData.replace(/list/ig, "children") )
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
   
    // 上移一位
    upBtn(id) {
//       const operationId = id;
//       console.log(operationId);
//       const exchangeId = id + 1;
//       updateUpDownAPI().then(res => {
//         var tempOption = this.list[i+1];
//         this.$set(this.list, i+ 1, this.list[i]);
//         this.$set(this.list, i, tempOption)
//         console.log(res);
//       })
    },

    // 下移
    // downBtn(id) {
    //   const operationId = id;
    //   const exchangeId = id + 1;      
    //   updateUpDownAPI({operationId,exchangeId}).then(res => {
    //     this.getList()
    //   })
    // },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.multipleSelection.length > 0 ? this.ids = getTreeId(this.multipleSelection,'children') : true
    },
    resetTemp() {
      this.temp = {
        id: null,
        identifierName : '',
        intro: '',
        parentId: 0
      }
    },
    handleCreate() {
      this.maxSort = getMaxSort(this.list)
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateChild(row){
      this.resetTemp()
      this.temp.parentId = row.id
      this.parentName = row.identifierName
      this.dialogStatus = 'createChild'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
   
    handleUpdate(row) {
      let {id,parentId,identifierName,intro} = row
      this.temp = {id,parentId,identifierName,intro}
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    //修改分类序号
    confirmDel(){
      this.getSortData.oid=this.changeSortData.id
      if(this.changeSortData.parent){
        this.getSortData.upperId=this.changeSortData.parent.id 
      }else{
        this.getSortData.upperId=0
      }
     this.$refs['sortForm'].validate((valid) => {
       if(valid){
         changeSortAPI(this.getSortData).then( res=> {
          if(res.data.code==0){
            this.getList();
            this.sortDialog=false;
          }else{
            this.$message.error('修改失败')
          }
        })
       }
     })
      
    },

    //关闭修改分类的弹窗
    closeSort(){
      this.sortDialog=false;
      this.getSortData={
        sort: 1
      }
    }
  }
}
</script>
<style scoped>
  .edit {
    cursor: pointer;
  }
  .changeSort{
    font-size: 22px;
  }
  .imadd {
    display: inline-block;
    width: 14px;
    height: 14px;
    background: url("../../../assets/img/importico.png") no-repeat;
    margin-right: 3px;
    float: left;
  }
  .imgadd {
    display: inline-block;
    width: 16px;
    height: 19px;
    background: url("../../../assets/img/new1.png") no-repeat;
  }
  .imsort {
    display: inline-block;
    width: 23px;
    height: 21px;
    background: url("../../../assets/img/sort.png") no-repeat;
  }
  .imedit {
    display: inline-block;
    width: 20px;
    height: 22px;
    background: url("../../../assets/img/edit1.png") no-repeat;
  }
  .imdel {
    display: inline-block;
    width: 21px;
    height: 21px;
    background: url("../../../assets/img/del1.png") no-repeat;
  }

  .dialog-footer, .el-dialog__footer {
    text-align: center !important;
  }
  /* .buttons .el-button{
    background: #03bcd9;
    border-color: #03bcd9;
    color: #fff;
  } */
</style>
