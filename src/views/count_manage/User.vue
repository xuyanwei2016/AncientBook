<template>
  <div class="project-plan">
    <div class="content" >
      <el-form inline class="form-inline" style="margin-bottom:40px">
        <el-form-item label="时间">
          <el-select v-model="listQuery.time" style="padding-left:20px!important">
            <el-option label="全部" :value="null"  style="padding-left:20px!important"></el-option>
            <el-option label="近一个月" :value="30" style="padding-left:20px!important"></el-option>
            <el-option label="近三个月" :value="90" style="padding-left:20px!important"></el-option>
            <el-option label="近半年" :value="182" style="padding-left:20px!important"></el-option>
            <el-option label="近一年" :value="365" style="padding-left:20px!important"></el-option>
          </el-select>
        </el-form-item>
        <span class="demonstration" @click="ifShowTime">自定义时间</span>
        <el-form-item label="时间范围" v-if="ifshowtimes">
          <el-date-picker
            v-model="selfTime"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="listQuery.departmentId">
            <el-option value=null label="全部" style="padding-left:20px!important"></el-option>
            <el-option v-for="item in departList" :key="item.code" :label="item.departmentName" :value="item.departmentId" style="padding-left:20px!important"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width90" style="margin-right:20px;">
          <el-button type="primary"  class="search" @click="onSubmit" icon="el-icon-search">检索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border style="margin-bottom:20px;">
        <el-table-column label="统计值">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="图书">
          <template slot-scope="scope">
            <!-- {{ scope.row.err.stack}} -->
          </template>
        </el-table-column>
        <el-table-column label="文章">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="视频">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="音频">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="动画">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="课件">
          <template slot-scope="scope">sss</template>
        </el-table-column >
        <el-table-column label="期刊">
          <template slot-scope="scope">sss</template>
        </el-table-column>
       
        <el-table-column label="论文">
          <template slot-scope="scope">sss</template>
        </el-table-column>
      </el-table>
      <el-table :data="list" border>
        <el-table-column label="统计值">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="法规">
          <template slot-scope="scope">
            <!-- {{ scope.row.err.stack}} -->
          </template>
        </el-table-column>
        <el-table-column label="标准">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="专利">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="成果">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="条文">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="课程">
          <template slot-scope="scope">sss</template>
        </el-table-column>
        <el-table-column label="试卷">
          <template slot-scope="scope">sss</template>
        </el-table-column >
        <el-table-column label="作者">
          <template slot-scope="scope">sss</template>
        </el-table-column>
       
        <el-table-column label="试题">
          <template slot-scope="scope">sss</template>
        </el-table-column>
      </el-table>
      <div>
        <div>
          <h3 class="tits">资源交易金额统计</h3>
          <div class="searchBox">
            <p class="spanBox">
               <span class="tads " @click="mouth" v-bind:class="{ active: isActive1 }">月度对比</span>|
               <span class="tads"  @click="year" v-bind:class="{ active: isActive2 }">年度对比</span>
            </p>
           
            <div class="formBox">
              <el-form v-if="ifShowYear" inline class="form-inline" style="margin-bottom:40px">
                <el-form-item label="选择年份:">
                  <el-select v-model="yearSearch.year">
                    <el-option label="2019" value="2019" style="padding-left:20px!important"></el-option>
                    <el-option label="2018" value="2018" style="padding-left:20px!important"></el-option>
                    <el-option label="2017" value="2017" style="padding-left:20px!important"></el-option>
                    <el-option label="2016" value="2016" style="padding-left:20px!important"></el-option>
                   
                    
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div
          class="area"
          id="myChart"
          :style="{width: '100%', height: '500px', margin: '20px auto'}"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { getNavAPI } from "@/api/resource/common";
import { getListAPI, getTypeAPI, getdepartListAPI, getYearAPI} from "@/api/work/user";
import echarts from "echarts";
import '@/styles/resource.scss'
export default {
  name: "plan",
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      times: "",
      departmentId: "",
      list: [1, 2, 3],
      
       
     
      ifshowtimes: false,
      mouthChartData: null,
      yearChartData: null,
      ifShowYear: true,
      isActive1:true,
      isActive2:false,
      selfTime: null,
      listQuery:{
         
      },
      yearSearch:{
        resourceType:null,
        year:2019
      },
      departList:[]
    };
  },
  mounted() {
    this.getList();
    this.drawLine();
    this.getDepartmentList();
  },
  methods: {
    getList() {
      getListAPI(this.listQuery).then(res => {
        if (res.status) {
          // this.listQuery = res.data.data.list;
          // this.total = res.data.data.total;
        } else {
          errorMsg.apply(this, [res.data, `获取数据`]);
        }
      });
    },
    getDepartmentList(){
      getdepartListAPI().then(res => {
        if(res.data.code==0){
         
          this.departList=res.data.data
        }
      })
    },
    ifShowTime() {
      this.ifshowtimes = true;
      this.listQuery.time=null;
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      let options = {
        title: {
          text: "折线图堆叠"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["图书", "视频", "音频", "课件", "动画"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [2016,2017,2018,2019]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "图书",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134]
          },
          {
            name: "视频",
            type: "line",
            stack: "总量",
            data: [220, 182, 191, 234]
          },
          {
            name: "音频",
            type: "line",
            stack: "总量",
            data: [150, 232, 201, 154]
          },
          {
            name: "课件",
            type: "line",
            stack: "总量",
            data: [320, 332, 301, 334]
          },
          {
            name: "动画",
            type: "line",
            stack: "总量",
            data: [820, 932, 901, 934]
          }
        ]
      };
      getYearAPI(this.yearSearch).then(res => {
          // 绘制图表

          myChart.setOption(options);
      })
      
    },
    mouth(){
      this.isActive1=true;
      this.isActive2=false;
      this.ifShowYear=true;
      if(this.yearSearch.year){
        this.drawLine()
      }else{
        this.$message({
          showClose: true,
          message: '请选择年份',
          type: 'warning'
        });
      }
      
    },
    year(){
      this.isActive1=false;
      this.isActive2=true;
      this.ifShowYear=false;
      this.yearSearch.year=null;
      this.drawLine()
    },
    onSubmit(){
      if(this.selfTime){
        this.listQuery.beginTime=this.selfTime[0];
        this.listQuery.endTime=this.selfTime[0]
      }
      this.getList()
    }
  }
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}
.content {
  margin: 40px;
  background: #fff;
  padding: 40px;
}
.demonstration {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  color: #409eff;
  cursor: pointer;
}
.tits {
  height: 80px;
  line-height: 80px;
  font-size: 18px;
}
.tads{
  font-size: 16px;
  display:inline-block;
  height: 36px;
  line-height: 36px;
  cursor: pointer;
}
.spanBox{
  display: inline-block;
}
.formBox{
  display: inline-block;
  margin-left: 40px;
}
.active{
  color: #409eff;
}

.searchBox{
  height: 36px;
  line-height: 36px;
  margin-bottom: 27px;
}
.tablelist .search {
  display: inline-block;
  width: 17px;
  height: 19px;
  background: url("../../assets/img/search.png") no-repeat;
}
.project-plan .form-inline .el-button.search {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
.project-plan .form-inline .el-button {
  width: 89px;
  border-radius: 5px;
  height: 36px;
  line-height: 36px;
}
</style>