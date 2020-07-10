<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App'
  }
</script>

<style>
 body{
   background: #eef0f3;
 }
/* .el-form-item{
  margin-bottom: 30px!important;
} */
.el-form--inline .el-form-item {
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
}
.imagesize{
  height: 40px;
  width: 40px;
}
.main-container{
  padding-bottom: 75px;
}
/*分页*/
.prfooter {
  padding: 0px 21px;
  height: 40px;
  background: #3f4560;
  font-size: 13px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  position:fixed;
  bottom: 49px;
  line-height: 40px;
  z-index: 200;
  transition: width 0.28s;
  /* width: calc(100vw - 430px); */
  display: flex;
  justify-content: space-between;
}
.prfooter.opend{
  width:calc(100% - 220px);
}
.prfooter.closed{
  width:calc(100% - 76px);
}
/*分页*/
.prfooter .el-checkbox {
  color: #ffffff;
}
.prfooter span {
  color: #ffffff;
}
.el-pagination {
  font-size: 13px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #fff;
}
/*左面的树*/
.tree-aside{
  width:200px!important;
  height:920px;
  overflow: auto;
  background: #fff;
}
/*树*/
.el-tree-node{
  padding: 5px 0;
}
.custom-tree-node span:first-child{
  white-space: pre-line;
}
.el-tree-node__label{
  white-space: pre-line;
}
  .submitBtn .el-main .formlist .el-form .el-form-item.width90 .el-form-item__content{
    margin-left: 0 !important;
  }
</style>
