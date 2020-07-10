<template>
  <el-row class="panel-group" :gutter="0">
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description" >
          <div class="card-panel-text">已完成</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.completed" :duration="2600"  v-if="data"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
       <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待审核选题</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.subjectCount" :duration="3000" v-if="data"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
         <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待三审作业</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.thriceAuditCount" :duration="3200" v-if="data"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
       <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待申领书号</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.isbnCount" :duration="3600" v-if="data"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
       <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待CIP下发</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.cipCount" :duration="3600" v-if="data"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
       <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待封面设计</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.coverCount" :duration="3600" v-if="data"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
       <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待排版设计</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.typographicCount" :duration="3600" v-if="data"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
       <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待新书付型</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.bookModelCount" :duration="3600" v-if="data"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
       <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待审核毛书</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.bookPrintCount" :duration="3600" v-if="data"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
       <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="message" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待入库图书</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="data.storageCount" :duration="3600" v-if="data"></count-to>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import {statisticsAPI} from '@/api/newBook/book.js';
export default {
  data(){
    return{
      data:null,
    }
  },
  components: {
    CountTo
  },
  created(){
    this.statistics();
  },
  methods: {
    statistics(){
      statisticsAPI().then(res=>{
        this.data=res.data.data;
      })
    },
    handleSetLineChartData(type) {
      /*this.$emit('handleSetLineChartData', type)*/
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin: 0 -8px;
  margin-top: 18px;
  .card-panel-col{
    margin: 0 8px;
    margin-bottom: 32px;
    width: 223px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
