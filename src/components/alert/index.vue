<template>
  <div class="mark-layer" v-show="alertModelOptions.show">
    <div class="alert-box" :class="{'alert-box-input' :alertModelOptions.input} " :style="{width:alertModelOptions.width + 'px'}" >
      <div class="alert-top">
        <span class="title">{{alertModelOptions.warning || '系统提示消息'}}</span>
        <i @click="alertClose" v-if="alertModelOptions.showClose" class="el-message-box__close el-icon-close"></i>
      </div>
      <div class="alert-main">
        <div class="input" v-if="alertModelOptions.input" :class="{'min':alertModelOptions.max<1000}">
          <textarea v-model="alertModelOptions.html" :maxlength="alertModelOptions.max"  :placeholder="alertModelOptions.placeholder"></textarea>
          <span class="count">{{count(alertModelOptions.html)}}/{{alertModelOptions.max || 2000}}</span>
        </div>
        <div v-else>
          <h2 v-if="alertModelOptions.title" class="main-title">{{alertModelOptions.title}}</h2>
          <p class="main-msg">
            {{alertModelOptions.msg}}
          </p>
        </div>
        <div v-if="alertModelOptions.btn == 1">
          <span class="sure btn" @click="alertSubmit">{{alertModelOptions.sureText || '确定'}}</span>
        </div>
        <div v-else>
          <span class="sure btn" @click="alertSubmit">{{alertModelOptions.sureText || '确定'}}</span>
          <span class="close btn" @click='alertCancel'>{{alertModelOptions.cancelText || '取消'}}</span>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  export default{
    props:['alertModelOptions'],
    data(){
      return {
        // success:false
      }
    },
    methods:{
      alertCancel(){
        if(typeof (this.alertModelOptions.cancel) == 'function'){
          this.alertModelOptions.cancel()
        }
      },
      alertSubmit(){
        if(typeof (this.alertModelOptions.sure) == 'function'){
          this.alertModelOptions.sure()
        }
        // this.smallAlert();

      },
      alertClose() {
        if(this.alertModelOptions.disting){
          if(typeof (this.alertModelOptions.close) == 'function'){
            this.alertModelOptions.close()
          }
        }else {
          this.alertModelOptions.cancel()
        }
      },
      smallAlert(){
        this.success=true;
        let timer = setTimeout(()=>{
          this.success = false;
          clearTimeout(timer);
          timer=null;
        },this.alertModelOptions.duration)
      },
      count(str){//输入框字数显示待确认，输入空格是否算入字数内
        if(str.length>0){
          return str.length
        }else {
          return 0
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .mark-layer {
    position:fixed;
    top:0;
    left:0;
    z-index:999;
    width:100%;
    height:100%;
    background:rgba(0,0,0,0.4)
  }
  .alert-box{
    // width:340px;
    /* height:250px; */
    /* padding-bottom:30px; */
    position:fixed;
    top:50%;
    left:50%;
    margin-top:-125px;
    margin-left:-225px;

    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    font-size: 18px;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    text-align: left;
    overflow: hidden;
    backface-visibility: hidden;
    // box-shadow: 2px 2px 2px #ddd;
  }
  .alert-box-input{
    width:550px !important;
  }
  .alert-box .alert-top{
    padding: 15px 15px 10px;
    height:38px;
    line-height:38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
  }
  .alert-box .alert-top .title{
    font-size:14px;
    font-weight:normal;
    display:inline-block;
    color: #303133;
  }
  .alert-box .alert-top i{
    cursor:pointer;
  }
  .alert-main{
    text-align:center;
    /*padding:30px 0 30px;*/
  }
  .alert-main .input{
    width:510px;
    height:220px;
    margin:0 auto;
    margin-bottom:24px;
    position:relative;
  }
  .alert-main .min{
    height:120px;
  }
  .alert-main .input textarea{
    width:100%;
    height:100%;
    padding:10px;
    background:#F8F7F3;
    border:1px solid #AAAAAA;
    resize:none;
    box-sizing:border-box;
    font-size:14px;
    line-height:24px;
    outline:none;
  }
  .alert-main .input .count{
    position:absolute;
    right:20px;
    bottom:5px;
    color:#A7A7A7;
    font-size:14px;
  }
  .alert-main .main-title{
    color:#333;
    font-size:16px;
    font-weight:bold;
  }
  .alert-main .main-msg{
    width:288px;
    font-size:16px;
    color:#606266;
    margin:20px auto 20px;
    line-height:30px;
  }
  .alert-main .btn{
    display:inline-block;
    padding: 0 15px;
    margin-bottom: 15px;
    height:34px;
    line-height:34px;
    border-radius:4px;
    border:1px solid #E3E3E3;
    background:#E3E3E3;
    color:#666;
    cursor:pointer;
    font-size: 12px;
  }
  .alert-main .sure{
    color:#F8F7F3;
    background: #409eff;
    border:1px solid #409eff;
    margin-right:10px;
  }

</style>

