<template>
  <div class="project-plan app-container">
    <div class="buttons">
      <el-button  v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0" @click="addBtn">{{authBtns.filter(i => i.idName=='addBtn')[0].name}}<i v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon" :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"></i></el-button>
    </div>

    <el-table :key='tableKey'  class="tablelist" :data="list" v-loading="listLoading" element-loading-text="给我一点时间" border highlight-current-row stripe @selection-change="chioceList" >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" :index="indexSet"></el-table-column>
      <el-table-column label="标签名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文名称" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.englishName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属数据类型" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.dataType}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="140" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i :class="authBtns.filter(i => i.idName=='editBtn')[0].icon" :title="authBtns.filter(i => i.idName=='editBtn')[0].name" v-if="authBtns.filter(i => i.idName=='editBtn').length > 0" @click="editBtn(scope.row.id)"></i>
  
          <router-link :to="{ path:`label/basics_theory`, query:{id:scope.row.id}}" v-if="authBtns.filter(i => i.idName=='detailsBtn').length > 0"><i :class="authBtns.filter(i => i.idName=='detailsBtn')[0].icon"  :title="authBtns.filter(i => i.idName=='detailsBtn')[0].name"></i></router-link>

          <i :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon" :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name" v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0" @click="deleteBtn(scope.row.id)"></i>

        </template>
      </el-table-column>
    </el-table>

    <!-- 底部 -->
      <div  v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
        <div class="prfooterright">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
        </el-pagination>
        </div>
      </div>
    <!-- 弹框 -->
    <el-dialog :visible.sync="dialogFormVisible" width="570px" :title="dialogTit" @close="closeAddLabel">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style='margin-right:10px;'>
        <el-form-item label="标签名称："  prop="name">
          <el-input v-model="temp.name" style="width: 318px;"></el-input> 
        </el-form-item>
        <el-form-item label="英文名称：" prop="englishName">
          <el-input v-model="temp.englishName" style="width: 318px;"></el-input>
        </el-form-item>
        <div v-for="(domain,index) in temp.LabelDataTypeForm" :key="index" style="overflow:hidden">
          <el-form-item 
          :label="index < 1 ? '数据类型：' : ''" 
          :prop="'LabelDataTypeForm.' + index + '.dataType'"
          :rules="{
              required: true, message: '请选择数据类型'
          }"
          style="float:left"
        >
          <el-select v-model="domain.dataType" placeholder="请选择数据类型" @change="changeDataType">
            <el-option :label="typeItem" :value="typeId" v-for="(typeItem , typeId) in typeList"   :key="typeId"></el-option>
          </el-select>
          
        </el-form-item>
        <el-form-item 
          :prop="'LabelDataTypeForm.' + index + '.dataTypeSort'"
          :rules="sortRules"
          style="float:left;margin-left: -90px;"
          
        >
          <el-input v-model="domain.dataTypeSort" placeholder="排序号" style="width:108px;"></el-input>
          
        </el-form-item>
        <i class="el-icon-delete" @click.prevent="removeBtn(domain)" style="margin: 10px;" v-if="temp.LabelDataTypeForm.length>1"></i>
        </div>
        <p class="addStyle" @click="addType"><span>+</span>添加类型</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="formSubmit" :disabled="ifDisabled">保存</el-button>
        <el-button @click="dialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

  </div>
</template>



<script>
import { getListAPI, deleteAPI, saveAPI, getEditList, updateAPI, getDataTypeAPI } from '@/api/business/label'
import { requestMsg, confirm } from '@/utils/publicFunctions'
import { getMultipleSelectionIDs, removeDuplicates } from '@/filters/getIds'
import Cookies from 'js-cookie'
import store from '@/store'
import "@/styles/resource.scss";
export default {
  
  data() {
    
    const validateSort = (rule, value, callback) => {
      let reg = /^[0-9]*[1-9][0-9]*$/
      if( value == '' ){
        callback(new Error('请填写排序号'));
      } else if(!reg.test(value)){
        callback(new Error('排序号只能为正整数'));
      }else{
        callback()
      }
    };
    return {
      item:{
        dataType:'',
        dataTypeSort:'',
      },
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      nation:'', //民族
      listQuery: {
        pageNum: 1,
        pageSize: 50
      },
      timeLimit: null,
      batchList: [],
      dialogFormVisible: false,
     
      editId:'',
      typeList:{},
      temp: {
        name:"",
        englishName:"",
        LabelDataTypeForm:[
          {
            dataType:'',
            dataTypeSort:'',
          },
        ]
      },
      rules:{
        name:[{ required:true, message: '请输入标签名称' },{max:8,message:'标签名称不能超过8位'},{pattern:/^\S{0,8}$/,message:'标签名称不可以输入空格'}],
        englishName:[{required: false,max:80,message:'英文名称不能超过80位'}]
      },
      sortRules:[{required: true,validator:validateSort}],
      dialogTit:'',
      ifDisabled:false,
      typeArr:[]
    }
  },
  created(){
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  mounted() {    
    this.getList();
    this.nation = Cookies.get('nation');
    this.getDataType();
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    //改变数据类型
    changeDataType(val){
      let acount=0
      this.ifDisabled=false
      if(this.temp.LabelDataTypeForm.length>1){
        for (let i=0 ; i<this.temp.LabelDataTypeForm.length; i++){
          if(val==this.temp.LabelDataTypeForm[i].dataType){
            acount+=1           
          }
        }
        if(acount>1){
          this.$message.warning('该资源已存在')
          this.ifDisabled=true;
        }
      }  
    },
    getList() {
      this.listLoading = true
      getListAPI(this.listQuery).then(res => {
        if(res.data.code === 0){
          this.list = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error('获取数据失败');
        }
        this.listLoading = false
      })
    },
    deleteBtn(id) {//删除功能
      confirm.apply(this,['确定删除这个标签维度吗?']).then(() => {
        deleteAPI(id).then(res => {
          requestMsg.apply(this,[res.data,'删除'])
        })
      })
    },
    addType() {//添加标签
      if(this.ifDisabled){
        this.$message.warning('资源重复,不可再次添加')
      }else if(this.temp.LabelDataTypeForm.length>9){
        this.$message.warning('已选择全部数据类型')
      }else{
        for(let i=0 ; i<this.temp.LabelDataTypeForm.length; i++){
          if(this.temp.LabelDataTypeForm[i].dataType==''){
            this.$message.warning('请选择资源类型')
            return
          }
        }
        this.temp.LabelDataTypeForm.push({
          dataType:'',
          dataTypeSort:'',
        })
      }

    },
    addBtn() {
      this.dialogFormVisible = true;
      this.editId = '';
      this.dialogTit='添加标签'
    },
    removeBtn(item) {//移除，先不使用
      var index = this.temp.LabelDataTypeForm.indexOf(item);
      if (index !== -1) {
        this.temp.LabelDataTypeForm.splice(index, 1)
      }
      this.ifDisabled=false
    },
    editBtn(id) {// 修改标签
      this.dialogTit='修改标签'
      getEditList(id).then(res => {
        if(res.data.code == 0){
          this.temp.name=res.data.data.name;
          this.temp.englishName=res.data.data.englishName
          res.data.data.dataType.map(item=>{
            return item.dataType=item.dataType+""
          })
          this.temp.LabelDataTypeForm = res.data.data.dataType;
          this.editId = res.data.data.id;
          this.dialogFormVisible = true;
        }
      })
    },
    formSubmit() {//提交标签
      this.$refs['dataForm'].validate((valid) => { //必填项--name 
        if (valid) {
          if(this.temp.LabelDataTypeForm.length>0){ //判断是否填写了数据类型和number
            const reg=/^([1-9]\d*|[0]{1,1})$/; //含0正整数
            const newData = this.temp.LabelDataTypeForm.filter(el => el.dataType != '' && reg.test(el.dataTypeSort));
            if(newData.length == this.temp.LabelDataTypeForm.length){
              const obj={
                dataType: this.temp.LabelDataTypeForm,
                englishName: this.temp.englishName,
                name: this.temp.name //标签名 (string, optional) ,
              }
              if(this.editId){//修改
                obj.id = this.editId;
                updateAPI(obj).then(res => {
                  this.dialogFormVisible = false;
                  if(res.data.code === 0){
                    this.$message.success('修改成功');
                    this.getList();
                  } else if(res.data.code === -2) {
                    this.$message.error('修改失败：'+res.data.data);
                  }else{
                    this.$message.error('修改失败');
                  }
                })
              } else{//添加
                saveAPI(obj).then(res => {
                  this.dialogFormVisible = false;
                  if(res.data.code === 0){
                    this.$message.success('添加成功');
                    this.temp.name = ''
                    this.temp.englishName = ''
                    this.temp.LabelDataTypeForm.dataType = null
                    this.temp.LabelDataTypeForm.dataTypeSort = null
                    this.getList();
                  } else if(res.data.code === -2) {
                    this.$message.error('添加失败：'+res.data.data);
                  }else{
                    this.$message.error('添加失败');
                  }
                })
              }
            } else{
              this.$message.error('请填写正确的数据类型和排序号');
            }
          } else{
            this.$message.error('请至少添加一项数据类型');
          }
        }
      })
    },
    //清空添加标签
    closeAddLabel(){
      this.$refs['dataForm'].resetFields();
      this.temp={
        name:"",
        englishName:"",
        LabelDataTypeForm:[
          {
            dataType:'',
            dataTypeSort:'',
          },
        ]
      },
      this.ifDisabled=false;
    },
    chioceList(val) {
      this.batchList = val;
    },
    handleFilter(){
      if(this.timeLimit){
          this.listQuery.beginTime = this.timeLimit[0]
          this.listQuery.endTime = this.timeLimit[1]
        } else {
          this.listQuery.beginTime = null
          this.listQuery.endTime = null
        }
      store.dispatch('SetSupplierSerKeys',this.listQuery).then(res => {
      })
      this.listQuery.pageNum = 1
      this.getList()
    },
    resetFilter(){
      this.listQuery = {
        pageNum: 1,
        pageSize: this.listQuery.pageSize
      }
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
    //获取数据类型列表
    getDataType(){
      getDataTypeAPI().then( res => {
        if(res.data.code==0){
          this.typeList=res.data.data
          for (let keys in this.typeList){
            this.typeArr.push(keys)
          }
        }
      })
    }
  }
}
</script>
<style>
/* .dialogFormVisibleClass{
  background:white;
  border:1px solid #ccc;
  color:#ccc;
}
.dialogFormVisibleClass:hover{
  background:#606266;
  color:white;
  border:1px solid #606266;
} */
.addStyle{
  margin-left: 100px;
  cursor: pointer;
  width: 100px;
}
.addStyle span{
  font-size: 20px;
  display: inline-block;
  vertical-align: middle;
}
</style>
<style scoped>

.el-button.is-disabled{
  background: #a0cfff;
  color: white;
}
</style>
