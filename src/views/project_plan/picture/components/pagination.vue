<template>
  <div class="pagination">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
        </el-pagination>
  </div>
</template>
<script>
export default{
  name:'pagination',
  props: ['total'],
  data(){
    return {
      listQuery: {
        pageNum: 1,
        pageSize: 30,
        }
    }
  },
  methods:{
    handleSizeChange(val) {
      this.$emit("pagesize",val)
    },
      handleCurrentChange(val) {
        this.$emit("currentPage",val)
        // console.log(`当前页: ${val}`);
      }
  }
}
</script>
