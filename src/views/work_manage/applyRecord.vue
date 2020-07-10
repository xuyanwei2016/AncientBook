<template>
  <el-container class="project-plan">
    <el-main>
      <div class="formlist">
        <el-form ref="form" :model="recordForm" inline label-width="82px" :rules="rules">
          <!-- <el-form-item label="姓名" class="width180">
            <el-input v-model="recordForm.name"></el-input>
          </el-form-item>
          <el-form-item label="部门">
                <el-select
                v-model="recordForm.departmentName"
                placeholder="所属部门"
                v-validate="'required'"
                data-vv-scope="baseInfo"
                name="department"
                data-vv-as="selected"
              >
                <el-option
                  v-for="item in departmentList"
                  :key="item.departmentId"
                  :label="item.departmentName"
                  :value="item.departmentName"
                ></el-option>
              </el-select>
            </el-form-item> -->
           <el-form-item label="申请时间" class="widthBig">
              <el-date-picker
                v-model="timeLimit"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="width90" style="margin-right:20px;">
              <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search">检索</el-button><el-button type="primary" plain @click="onReset">
                <i class></i>重置
              </el-button>
            </el-form-item>
        </el-form>
      </div>
      <div class="">
        <div class="tablelist table_custom">
          <el-table
              border
              ref="multipleTable"
              tooltip-effect="dark"
              style="width: 100%;"
              :data="list"
          >
              <el-table-column type="index" width="50" :index="indexSet"></el-table-column>
              <el-table-column  property="applyDept" label="申请人/(部门)" width="160">
                <template slot-scope="scope">
                    <span v-if="scope.row.applyName">{{scope.row.applyName}}</span>
                    <span v-if="scope.row.applyDept">({{(scope.row.applyDept)}})</span>
                </template>
              </el-table-column>
              <el-table-column  property="applyName" label="审批人/(部门)"  width="160">
                <template slot-scope="scope">
                    <span v-if="scope.row.examineName">{{scope.row.examineName}}</span>
                    <span v-if="scope.row.examineDept">({{scope.row.examineDept}})</span>
                </template>
              </el-table-column>
              <el-table-column  property="applyTime" label="申请时间"></el-table-column>
              <el-table-column  property="examineTime" label="审批时间"></el-table-column>
              <el-table-column  property="resourceName" label="资源名称"></el-table-column>
              <el-table-column  property="file" label="文件类型"></el-table-column>
              <el-table-column  property="download" label="下载状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.download==1">已下载</span>
                    <span v-if="scope.row.download==0">未下载</span>
                </template>
              </el-table-column>
                          

          </el-table>
        </div>
        <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterright">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="recordForm.pageNum"
              :page-sizes="[30,50,100,200,500]"
              :page-size="recordForm.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              align="center"
            ></el-pagination>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
import "@/styles/work.scss";
import { errorMsg } from "@/utils/publicFunctions";
import { getDepartmentAPI } from "@/api/resource/common";
import { getListAPI } from "@/api/work/applyRecord";
export default {
    data() {
        return {
            recordForm:{
              pageSize:50,
              pageNum:1
            },
            rules:{

            },
            timeLimit:[],
            departmentList: [],
            list:[],
            total:30
        }
    },
    computed:{
      sidebar() {
        return this.$store.state.app.sidebar;
      }
    },
    methods:{
      //获取列表
      getList(){
        getListAPI(this.recordForm).then(res => {
          console.log(res.data,"kkkkk")
          if (res.data.code==0) {
          this.list = res.data.data.list;
          this.total = res.data.data.total;
        } else {
          errorMsg.apply(this, [res.data, `获取数据`]);
        }
        })
      }, 
      handleSizeChange(val) {
        this.recordForm.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.recordForm.pageNum = val;
        this.getList();
      },
      //解决索引只排序当前页的问题,增加函数自定义索引序号
      indexSet(index){
        return (this.recordForm.pageNum-1)*this.recordForm.pageSize+index+1;
      },
      //检索
      onSubmit(){
        if (this.timeLimit) {
          this.recordForm.beginTime = this.timeLimit[0];
          this.recordForm.endTime = this.timeLimit[1];
        } else {
          this.recordForm.beginTime = null;
          this.recordForm.endTime = null;
        }
        this.getList()
      },
      //重置
      onReset(){
        this.recordForm={
          pageSize:50,
          pageNum:1
        };
        this.timeLimit=[]
      },
      getDepartmentList() {
        getDepartmentAPI().then(res => {
          this.departmentList = res.data.data;
        });
      },
    },
    mounted(){
      this.getDepartmentList()
      this.getList()
    }
}
</script>
<style scoped>
/* .prfooter{
  width:calc(100vw - 218px)
} */
</style>
