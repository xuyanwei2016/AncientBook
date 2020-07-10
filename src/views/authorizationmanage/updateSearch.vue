<template>
    <div  class="container">
        <el-button @click="addSearch">增量索引</el-button>
        <el-button @click="updateSearch">更新索引</el-button>
    </div>
</template>
<script>
import {addSearchAPI,updateSearchAPI} from '@/api/authorization-management/updateSearch'
export default {
    methods:{
        addSearch(){
            addSearchAPI().then( res => {
                if(res.data.code==0){
                    this.$message.success('更新成功')
                }else{
                    this.$message.error('更新失败')
                }
            })
        },
        updateSearch(){
            updateSearchAPI().then( res => {
                if(res.data.code==0){
                    this.$message.success('更新成功')
                }else{
                    this.$message.error('更新失败')
                }
            })
        }
    }
}

</script>

<style lang="less" scoped>
    .container{
        display: flex;
        justify-content:center;
        margin-top: 80px;
        .el-button{
            height: 145px;
            width: 300px;
            margin-left: 60px;
        }
    }
</style>
