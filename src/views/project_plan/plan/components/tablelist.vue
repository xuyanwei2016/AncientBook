<template>
  <div class="tabpane">
    <el-table
              ref="multipleTable"
              :data="books"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
            <el-table-column
            type="selection"
            width="55">
            </el-table-column>
              <el-table-column
              label="图书名称"
              prop="name"
             >
               <template slot-scope="scope">{{ scope.row.name }}</template>
              </el-table-column>
              <el-table-column
              prop="isbn"
              label="ISBN"
              >
              </el-table-column>
              <el-table-column
              prop="version"
              label="版次"
              >
              </el-table-column>
              <el-table-column
              prop="price"
              label="售价"
              >
              </el-table-column>
              <el-table-column
              prop="starttime"
              label="出版时间"
              >
              </el-table-column>
              <el-table-column
              prop="uploadtime"
              label="上传时间"
              >
              </el-table-column>
              <el-table-column
      
             label="操作"
            width="120">
            <template slot-scope="scope">
              <i class="edit distance"></i>
              <i class="search distance"></i>
              <i class="view distance"></i>
              <i class="link distance"></i>
            </template>
          </el-table-column>
    </el-table>
    <div v-if="total>0" class="prfooter">
        <div class="prfooterleft">
          <el-checkbox v-model="checkedAll">全选</el-checkbox>
          <span class="marginleft">批量下载</span>
          <span class="marginleft">更多</span>
        </div>
        <div class="prfooterright">
          <pagination @pagesize="pagesizeFun" :total="total" @currentPage="currentPageFun"></pagination>
        </div>
    </div>
  </div>
</template>
<script>
import pagination from '../components/pagination'
export default {
  name:'tablelist',
   props: ['activename'],
  data(){
     return {
       checkedAll:false,
       books:[{
        name:'111',
        isbn:'isbn'
        }],
        total:100,
        pagesize:30,
        currentPage:1
     }
  },
  methods:{
    handleSelectionChange(){
      
    },
    pagesizeFun(val){
    console.log(val)
    },
    currentPageFun(val){
      console.log(val)
    }
  },
  components: { pagination }
}
</script>
