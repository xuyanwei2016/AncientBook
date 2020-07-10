<template>
  <div class="project-plan">
    <div class="content">
      <el-form inline class="form-inline" style="margin-bottom:40px">
        <el-form-item label="时间">
          <el-select v-model="listQuery.time" style="padding-left:20px!important">
            <el-option label="全部" :value="null" style="padding-left:20px!important"></el-option>
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
            <el-option value="null" label="全部" style="padding-left:20px!important"></el-option>
            <el-option
              v-for="item in departmentList"
              :key="item.code"
              :label="item.departmentName"
              :value="item.departmentId"
              style="padding-left:20px!important"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width90" style="margin-right:20px;">
          <el-button type="primary" class="search" @click="onSubmit" icon="el-icon-search">检索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="list" border style="margin-bottom:20px;">
        <el-table-column label="统计值">
          <template slot-scope="scope">
            {{scope.row.static}}
          </template>
        </el-table-column>
        <el-table-column label="图书">
          <template slot-scope="scope">
            {{ scope.row.book}}
          </template>
        </el-table-column>
        <el-table-column label="文章">
          <template slot-scope="scope"> {{ scope.row.article}}</template>
        </el-table-column>
        <el-table-column label="图片">
          <template slot-scope="scope">{{ scope.row.image}}</template>
        </el-table-column>
        <el-table-column label="视频">
          <template slot-scope="scope">{{ scope.row.video}}</template>
        </el-table-column>
        <el-table-column label="音频">
          <template slot-scope="scope">{{ scope.row.audio}}</template>
        </el-table-column>
        <el-table-column label="动画">
          <template slot-scope="scope">{{ scope.row.audio}}</template>
        </el-table-column>
        <el-table-column label="课件">
          <template slot-scope="scope">{{ scope.row.courseware}}</template>
        </el-table-column>
        <el-table-column label="期刊">
          <template slot-scope="scope">{{ scope.row.periodical}}</template>
        </el-table-column>

        <el-table-column label="论文">
          <template slot-scope="scope">{{ scope.row.paper}}</template>
        </el-table-column>
      </el-table>
      <el-table :data="list" border>
        <el-table-column label="统计值">
          <template slot-scope="scope">{{ scope.row.static}}</template>
        </el-table-column>
        <el-table-column label="法规">
          <template slot-scope="scope">
            {{ scope.row.statute}}
          </template>
        </el-table-column>
        <el-table-column label="标准">
          <template slot-scope="scope">{{ scope.row.criterion}}</template>
        </el-table-column>
        <el-table-column label="专利">
          <template slot-scope="scope">{{ scope.row.standard}}</template>
        </el-table-column>
        <el-table-column label="成果">
          <template slot-scope="scope">{{ scope.row.achievement}}</template>
        </el-table-column>
        <el-table-column label="条文">
          <template slot-scope="scope">{{ scope.row.clause}}</template>
        </el-table-column>
        <el-table-column label="课程">
          <template slot-scope="scope">{{ scope.row.课程}}</template>
        </el-table-column>
        <el-table-column label="试卷">
          <template slot-scope="scope">{{ scope.row.试卷}}</template>
        </el-table-column>
        <el-table-column label="作者">
          <template slot-scope="scope">{{ scope.row.课件}}</template>
        </el-table-column>

        <el-table-column label="试题">
          <template slot-scope="scope">{{ scope.row.试题}}</template>
        </el-table-column>
      </el-table>
      <div>
        <div>
          <h3 class="tits">资源数量统计</h3>
        </div>
        <div
          class="area"
          id="myChart"
          :style="{width: '100%', height: '400px', margin: '20px auto'}"
        ></div>
        <div>
          <h3 class="tits">部门资源对比</h3>
        </div>
        <div>
          <el-form inline class="form-inline" style="margin-bottom:40px">
            <el-form-item label="选择年份:">
              <el-select v-model="yearSearch.year">
                <el-option label="2019" value="2019" style="padding-left:20px!important"></el-option>
                <el-option label="2018" value="2018" style="padding-left:20px!important"></el-option>
                <el-option label="2017" value="2017" style="padding-left:20px!important"></el-option>
                <el-option label="2016" value="2016" style="padding-left:20px!important"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源">
              <el-select v-model="yearSearch.resourceType">
                <el-option value="null" label="全部" style="padding-left:20px!important"></el-option>
                <el-option
                  v-for="(value,key) in resourceList"
                  :key="key"
                  :label="value"
                  :value="key"
                  style="padding-left:20px!important"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="width90" style="margin-right:20px;">
              <el-button
                type="primary"
                class="search"
                @click="onSubmitResource"
                icon="el-icon-search"
              >检索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          class="area"
          id="myLineChart"
          :style="{width: '100%', height: '600px', margin: '20px auto'}"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { getNavAPI } from "@/api/resource/common";
import { getdepartListAPI } from "@/api/work/user";
import { errorMsg } from "@/utils/publicFunctions";
import {
  getListAPI,
  getTypeAPI,
  getresourceNumAPI,
  getresourceListAPI,
  getPieAPI
} from "@/api/statistic-management/index";
import echarts from "echarts";
import "@/styles/resource.scss";
export default {
  name: "plan",
  data() {
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      times: "",
      departmentId: "",
      list: [],

      ifshowtimes: false,
      mouthChartData: null,
      yearChartData: null,
      isActive1: true,
      isActive2: false,
      selfTime: null,
      listQuery: {},
      yearSearch: {
        resourceType: null,
        year: 2019
      },
      resourceList: [],
      departmentList: [],
      chartInfo: null,
      getLineList: null
    };
  },
  mounted() {
    this.getList();
    this.drawPie();
    this.getlineData();
    this.getresourceList();
    this.getDepartmentList();
  },
  // watch: {
  //   getLineList: function(newVal, oldVal) {
  //     this.getLine();
  //   }
  // },
  methods: {
    getList() {
      getListAPI(this.listQuery).then(res => {
        if (res.data.code===0) {
          if(res.data.data){
            let backData=res.data.data;
            let listArr=[];

            for(let i in backData){
              listArr.push(backData[i])
            }
            this.list=listArr
          }
          // this.total = res.data.data.total;
        } else {
          errorMsg.apply(this, [res.data, `获取数据`]);
        }
      });
    },
    getDepartmentList() {
      getdepartListAPI().then(res => {
        if (res.data.code == 0) {
          this.departmentList = res.data.data;
        }
      });
    },
    getresourceList() {
      getresourceListAPI().then(res => {
        if (res.data.code == 0) {
          this.resourceList = res.data.data;
        }
      });
    },
    ifShowTime() {
      this.ifshowtimes = true;
      this.listQuery.time = null;
    },
    drawPie() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      let options = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "horizontal",
          left: "center",
          data: []
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      getPieAPI().then(res => {
        // 绘制图表
        if(res.data.code==0){
          if(res.data.data){
            options.legend.data=res.data.data.nameList;
            console.log(res.data.data.numlist)
            options.series[0].data=res.data.data.numlist;
            myChart.setOption(options,true);
          }
        }

      });
    },
    getLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myLineChart"));
      let options = {
        title: {
          text: "折线图堆叠"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {},
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
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: []
      };
      options.legend.data = this.getLineList.data.data.data;
      options.xAxis.data = this.getLineList.data.data.data;
      let dateList = this.getLineList.data.data.series;
      dateList.forEach(item => {
        delete item.stack;
        options.series.push(item);
      });
      myChart.setOption(options,true);


    },
    onSubmit() {
      if (this.selfTime) {
        this.listQuery.beginTime = this.selfTime[0];
        this.listQuery.endTime = this.selfTime[0];
      }
      this.getList();
    },
    getlineData() {
      getresourceNumAPI(this.yearSearch).then(res => {
        // 绘制图表
        if (res.data.code == 0) {
          this.getLineList = res;
          this.getLine();
        }
      });
    },

    onSubmitResource() {
      this.getlineData();
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
.tads {
  font-size: 16px;
  display: inline-block;
  height: 36px;
  line-height: 36px;
  cursor: pointer;
}
.spanBox {
  display: inline-block;
}
.formBox {
  display: inline-block;
  margin-left: 40px;
}
.active {
  color: #409eff;
}

.searchBox {
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
