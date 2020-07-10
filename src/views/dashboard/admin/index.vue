<template>
  <div class="dashboard-editor-container">
    <h3 class="tit">数据统计</h3>
    <panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group>
    <div class="chart-wrapper">
      <div class="chart-cont">
        <h3 class="tit">图书统计</h3>
        <div  class="area">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="下载统计" name="first">
             <!-- <LineChart :chart-data="lineChartData"></LineChart>-->
               </el-tab-pane>
            <el-tab-pane label="访问量统计" name="second">
               <!--<BarChart :chart-data="viewChartData"></BarChart>-->
              </el-tab-pane>
          </el-tabs>

        </div>
        <div class="pie">
          <div class="years-option">
            资源下载量：35476
            <!-- <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in years"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </div>
          <pie-chart></pie-chart>
        </div>
      </div>
      <div class="todo">
        <h3 class="tit">待处理事务</h3>
        <div class="todo--item">
          <span class="todo-tit">待审核电子书</span>
          <b class="num-red">2</b>
        </div>
         <div class="todo--item">
          <span class="todo-tit">待审核文章</span>
          <b class="num-red">4</b>
        </div>
         <div class="todo--item">
          <span class="todo-tit">待审核视频</span>
          <b class="num-red">5</b>
        </div>
         <div class="todo--item">
          <span class="todo-tit">待审核音频</span>
          <b class="num-red">1</b>
        </div>
         <div class="todo--item">
          <span class="todo-tit">待审核图片</span>
          <b class="num-red">5</b>
        </div>
        <div class="todo--item">
          <span class="todo-tit">待审核论文</span>
          <b class="num-red">6</b>
        </div>
        <div class="todo--item">
          <span class="todo-tit">待审核条文</span>
          <b class="num-red">3</b>
        </div>
        <div class="todo--item">
          <span class="todo-tit">待审核期刊</span>
          <b class="num-red">2</b>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
const viewChartData = {
  newVisitis: {
    expectedData: [130, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [100, 192, 120, 144, 160, 130, 140],
    actualData: [130, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [20, 100, 121, 104, 105, 90, 100],
    actualData: [190, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [140, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
export default {
  name: 'dashboard-admin',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      viewChartData: viewChartData.newVisitis,
      activeName:'first',
      value:'',
      years: [{
          value: '选项1',
          label: '1'
        }, {
          value: '选项2',
          label: '2'
        }, {
          value: '选项3',
          label: '3'
        }, {
          value: '选项4',
          label: '4'
        }, {
          value: '选项5',
          label: '5'
        }],
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    handleClick(tab){

    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-main{
  display: inline-block!important;
}
.dashboard-editor-container {
  .todo--item{
    height:35px;
    line-height:35px;
    font-size:15px;
  }
  .years-option{
    font-size: 14px;
    margin-bottom: 48px;
   text-align:center;
    .el-select{
      z-index:100
    }
  }
  padding: 0 32px;
  background-color: rgb(240, 242, 245);
  .tit{
    font-weight: 400;
    font-size: 20px;
  }
  .chart-wrapper {
    background: #eef0f3;
    padding: 0;
    margin-bottom: 32px;
    display:flex;
    justify-content: space-between;
    .chart-cont{
      display: flex;
      flex-flow:row wrap;
      height: 600px;
      .tit{
        flex:1 100%;
        text-indent: 20px;
      }
      background: #fff;
      width: 75%;
      .area{
        margin-left: 10px;
        width: 0!important;
        flex:10%;
      }
      .pie{
        // width: 50%!important;
        // margin-top: 55px;
        flex:20%;
      }
    }
    .todo{
      background: #fff;
      width: 24%;
      padding:10px 25px;
    }
    .todo--item{
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      b{
        font-weight: 400;
      }
      .num-red{
        color:#F37A58;
      }
    }
  }

}
</style>
