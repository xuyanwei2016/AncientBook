<template>
  <div class="project-plan app-container">
    <div class="buttons">
      <el-button v-if="authBtns.map(i => i.idName).indexOf('addBtn') >= 0" @click="addBtn">
        {{authBtns.filter(i => i.idName=='addBtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='addBtn').length>0 && authBtns.filter(i => i.idName=='addBtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('addBtn')].icon, 'el-icon--right']"
        ></i>
      </el-button>

      <el-button
        v-if="authBtns.map(i => i.idName).indexOf('deletAllBtn') >= 0"
        @click="deletAllBtn"
      >
        {{authBtns.filter(i => i.idName=='deletAllBtn')[0].name}}
        <i
          v-if="authBtns.filter(i => i.idName=='deletAllBtn').length>0 && authBtns.filter(i => i.idName=='deletAllBtn')[0].icon"
          :class="[authBtns[authBtns.map(i => i.idName).indexOf('deletAllBtn')].icon, 'el-icon--right']"
        ></i>
      </el-button>
    </div>
    <el-form inline class="form-inline formlist">
      <el-form-item label="机构名称">
        <el-input v-model="listQuery.name" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="search" type="primary" @click="handleFilter" icon="el-icon-search">检索</el-button>
      </el-form-item>
    </el-form>
    <el-table :key="tableKey"   class="tablelist"  :data="list"  v-loading="listLoading"  element-loading-text="给我一点时间" border  highlight-current-row  stripe  @selection-change="chioceList">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" align="center" :index="indexSet"></el-table-column>
      <el-table-column label="机构名称" min-width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系人" min-width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.contacts}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="small-padding fixed-width" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <i
            :class="authBtns.filter(i => i.idName=='editBtn')[0].icon"
            :title="authBtns.filter(i => i.idName=='editBtn')[0].name"
            v-if="authBtns.filter(i => i.idName=='editBtn').length > 0"
            @click="editBtn(scope.row.id)"
          ></i>

          <i
            :class="authBtns.filter(i => i.idName=='detailsBtn')[0].icon"
            :title="authBtns.filter(i => i.idName=='detailsBtn')[0].name"
            v-if="authBtns.filter(i => i.idName=='detailsBtn').length > 0"
            @click="detailsBtn(scope.row.id)"
          ></i>

          <i
            :class="authBtns.filter(i => i.idName=='deleteBtn')[0].icon"
            :title="authBtns.filter(i => i.idName=='deleteBtn')[0].name"
            v-if="authBtns.filter(i => i.idName=='deleteBtn').length > 0"
            @click="singleDelete(scope.row.id)"
          ></i>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部 -->
    <div  v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
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
    

   
  </div>
</template>



<script>
import {getListAPI,deleteAPI} from "@/api/business/publish";
import { requestMsg, confirm, checkSelect, operationMsg} from "@/utils/publicFunctions";
import { getMultipleSelectionIDs, removeDuplicates } from "@/filters/getIds";
import Cookies from "js-cookie";
import store from "@/store";
import "@/styles/resource.scss";
export default {
  name:'publish',
  data() {
    return {
      authBtns: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      nation: "", //民族
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        name:''
      },
      timeLimit: null,
      multipleSelection: [],
      data: [
        {
          dataType: "",
          dataTypeSort: "",
          dataType: ""
        }
      ],
      editId: "",
      temp: {},
      rules: {
        name: [
          {
            required: true,
            pattern: /^.{1,6}$/,
            message: "请输入不超过六个字的标签名称",
            trigger: "change"
          }
        ]
        // database:[
        //   { required: true, trigger: 'change', message: '请选择数据类型'}
        // ]
      },
      batchData:{
        ids:''
      }
    };
  },
  created() {
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]];
  },
  activated() {
      this.getList();//缓存操作的新增编辑时，要更新数据
  },
  mounted() {
    this.getList();
    this.nation = Cookies.get("nation");
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      getListAPI(this.listQuery).then(res => {
        if (res.data.code === 0) {
          if(res.data.data){
              console.log(res.data.data.list,"pppp")
              this.list = res.data.data.list;
              this.total = res.data.data.total;
          }
        } else {
          this.$message.error("获取数据失败");
        }
        this.listLoading = false;
      });
    },
    deletAllBtn(id) {
      //删除功能
      if (checkSelect.apply(this, [this.multipleSelection])) {
        this.batchData.ids = getMultipleSelectionIDs(this.multipleSelection)
        confirm.apply(this, ["确定要批量删除这些机构吗？"]).then(() => {
        deleteAPI(this.batchData.ids).then(res => {
          requestMsg.apply(this, [res.data, "删除"]);
        });
      });
      }
      
    },
    massSetting(msg, api, data, msgName){
      confirm.apply(this,[msg]).then(() => {
        api(data).then(res => {
          operationMsg.apply(this,[res.data, msgName])
        })
      })
    },
    singleDelete(id){
      this.massSetting(`确定删除这个机构吗？`, deleteAPI, [id], `删除`)
    },
    addBtn() {
       this.$router.push({ path:'/business/publish/add', query:{id:null,type:'add'}})
    },
    editBtn(id){
      this.$router.push({ path:'/business/publish/add', query:{id:id,type:'edit'}})
    },
    detailsBtn(id){
      this.$router.push({ path:'/business/publish/add', query:{detailsId:id,type:'view'}})
    },
    //导入
    leadBtn() {},
    removeBtn(item) {
      //移除
      var index = this.data.indexOf(item);
      if (index !== -1) {
        this.data.splice(index, 1);
      }
    },
    
    chioceList(val) {
      this.multipleSelection = val;
    },
    handleFilter() {
      
      store.dispatch("SetSupplierSerKeys", this.listQuery).then(res => {
      });
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
     //解决索引只排序当前页的问题,增加函数自定义索引序号
    indexSet(index){
      return (this.listQuery.pageNum-1)*this.listQuery.pageSize+index+1;
    },
  }
};
</script>
<style>
.addStyle {
  margin-left: 100px;
  cursor: pointer;
}
.addStyle span {
  font-size: 20px;
  display: inline-block;
  vertical-align: middle;
}
</style>
<style scoped>

</style>