<template>
  <div class="project-plan">
    <div class="plan-container">
       <div class="planLeft">
        <el-tree :data="datatree" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
      </div>
      <div class="planright">
         <div class="buttons">
           <el-button type="primary"><i class="imBook"></i>导入图书</el-button>
           <el-button type="primary"><i class="add"></i>添加</el-button>
           <el-button type="primary"><i class="imExcel"></i>导入Excel</el-button>
           <el-button type="primary"><i class="submitIcon"></i>提交审核</el-button>
         </div>
         <div class="formlist">
            <el-form ref="form" :model="bookInfo" label-width="82px" :rules="rules" >
              <el-form-item label="图书名称" >
                  <el-input v-model="bookInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="作者">
                  <el-input v-model="bookInfo.author"></el-input>
              </el-form-item>
              <el-form-item label="ISBN">
                  <el-input v-model="bookInfo.isbn"></el-input>
              </el-form-item>
              <el-form-item label="版次">
                  <el-input v-model="bookInfo.version"></el-input>
              </el-form-item>
              <el-form-item label="责任编辑" >
                  <el-input v-model="bookInfo.editor"></el-input>
              </el-form-item>
              <el-form-item label="筛选">
                  <el-input v-model="bookInfo.filter"></el-input>
              </el-form-item>
              <el-form-item label="上传时间" class="widthBig">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="bookInfo.startTime" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">至</el-col>
                <el-col :span="11">
                  <el-time-picker type="fixed-time" placeholder="选择时间" v-model="bookInfo.endTime" style="width: 100%;"></el-time-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="数据来源"  style="margin-right:20px">
                <el-select v-model="bookInfo.from" placeholder="请选择数据来源">
                  <el-option label="亚马逊" value="0"></el-option>
                  <el-option label="当当网" value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="width90" style="margin-right:20px;">
                <el-button type="primary" @click="onSubmit" class="search" icon="el-icon-search">检索</el-button>
              </el-form-item>
              <el-form-item class="width90" style="margin-right:20px;"> 
                <el-button type="primary" plain  @click="onReset"><i class=""></i>重置</el-button>
              </el-form-item>
              <el-form-item class="width90" style="margin-right:20px;"> 
                <el-button type="text"  @click="onHide" class="btntext">收起<i class="el-icon-arrow-up"></i></el-button>
              </el-form-item>
            </el-form>
         </div>
         <div class="tablelist">
           <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="所有图书" name="first">
                <tablelist :activename="activeName"></tablelist>
            </el-tab-pane>
            <el-tab-pane label="录入中" name="second">
               <tablelist :activename="activeName"></tablelist>
            </el-tab-pane>
            <el-tab-pane label="待审核" name="third">
               <tablelist :activename="activeName"></tablelist>
            </el-tab-pane>
            <el-tab-pane label="待审核" name="fourth">
               <tablelist :activename="activeName"></tablelist>
            </el-tab-pane>
            <el-tab-pane label="审核通过" name="five">
              <tablelist :activename="activeName"></tablelist>
              </el-tab-pane>
            <el-tab-pane label="审核未通过" name="six">
              <tablelist :activename="activeName"></tablelist>
            </el-tab-pane>
  </el-tabs>
         </div>
      </div>
    </div>
  </div>
</template>
<script>
import tablelist from './components/tablelist'
// import {getList} from '@/api/resource/ebook'  这个接口不存在先注释了
export default{
  name:'bookIndex',
  data(){
    return {
      activeName:'first',
     checkedAll:false,
     datatree:[{
       label:'项目规划',
        children: [{
            label: '项目分类名称一',
            children: [{
              label: '二级类别5',
              children:[{
                label:'三级类别1',
                children:[{
                  label:'四级类别1',
                  label:'四级类别2',
                  label:'四级类别3'
                }]
              }]
            }]
          }]
     },{
       label:'学科分类',
        children: [{
            label: '项目分类名称一',
            children: [{
              label: '二级类别5',
              children:[{
                label:'三级类别1',
                children:[{
                  label:'四级类别1',
                  label:'四级类别2',
                  label:'四级类别3'
                }]
              }]
            }]
          }]
     }],
     defaultProps: {
          children: 'children',
          label: 'label'
        },
        bookInfo:{
          name:'',
          author:'',
          isbn:'',
          version:'',
          editor:'',
          filter:'',
          startTime:'',
          endTime:'',
          from:''
        },
        
        rules:{},
        querylist:{
          diyTypeId:null,
          nai:null,
          name:null,
          author:null,
          isbn:null,
          option:null,
          beginTime:null,
          endTime:null,
          type:null,
          status:null,
          bookStatus:null,
          diyTypeCode:null,
          nationsType:null,
          pageNum:1,
          pageSize:20,
          orderBy:null
        }
         
      
    }
  },
  methods:{
    onSubmit(){

    },
    onReset(){

    },
    onHide(){

    },
    handleClick(){

    },
    handleSelectionChange(){

    },
   
  handleNodeClick(){

    },
    getList(){
      getList(this.querylist).then(res=>{
        
      })
    }
  },
  mounted() {
    this.getList()
  },
  components: { tablelist }
}
</script>
<style scoped>
.plan-container{
display:flex;
flex-direction:row;
flex:1;
border-sizing:border-box;
padding-left:1px;
flex-basis: auto;
height: calc(100vh - 50px);
}
.planLeft{
  width:199px;
  background-color: #fff;
    border-right: 1px solid #ddd;
   
}
.planright{
  -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding:44px 30px 30px 30px;
   
}
.buttons .el-button{
  width:100px;
  height:34px;
  margin-right:8px;
  padding-left: 15px;
}
.buttons .el-button:hover{
  background: #03BCD9; 
  border-color: #03BCD9; 
  border-radius: 0; 
  color: #fff;
}
.formlist{
padding:35px 41px 15px 35px;
background:#fff;
margin-top:24px;
}
.widthBig{
  width:613px;
}

.formlist .line{
  text-align:center;
  margin-bottom:0;
  border:0;
}
.imBook{
  display:inline-block;
  width:14px;
  height:14px;
  background:url("../../../assets/img/importico.png") no-repeat;
  margin-right:3px;
  float:left;
}
.add{
  display:inline-block;
  width:14px;
  height:14px;
  background:url("../../../assets/img/plan_add.png") no-repeat;
  float:left;
}
.imExcel{
  display:inline-block;
  width:14px;
  height:14px;
  background:url("../../../assets/img/plan_excel.png") no-repeat;
  margin-right:3px;
  float:left;
}
.submitIcon{
  display:inline-block;
  width:14px;
  height:14px;
  background:url("../../../assets/img/plan_submitico.png") no-repeat;
  margin-right:3px;
  float:left;
}
.btntext{
  background:none;
  color:#409EFF;
  border:0;
}
.tablelist .edit{
  display:inline-block;
  width:17px;
  height:19px;
  background:url("../../../assets/img/edit.png") no-repeat
}
.tablelist .search{
  display:inline-block;
  width:17px;
  height:19px;
  background:url("../../../assets/img/search.png") no-repeat
}
.tablelist .view{
  display:inline-block;
  width:17px;
  height:19px;
  background:url("../../../assets/img/view.png") no-repeat
}
.tablelist .link{
  display:inline-block;
  width:17px;
  height:19px;
  background:url("../../../assets/img/link.png") no-repeat
}
.tablelist .distance{
  margin-right:5px;
}
</style>
<style>
.project-plan .formlist .el-form-item__label{
  font-size:14px;
font-family:MicrosoftYaHei;
font-weight:400;
color:#424861;
}
.project-plan .formlist .el-input{
width:210px;
}
.project-plan .formlist .width260 .el-input{
  width:260px;
}
.project-plan .formlist .el-form-item{
  margin:0;
 display:inline-block;
 margin-right:48px;
 vertical-align: top;
 margin-bottom:14px;
}
.project-plan .width90 .el-form-item__content{
margin-left:0 !important;
}
/* .project-plan .formlist .el-button.search{
color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
}
.project-plan .formlist .el-button{
  width:89px;
  border-radius:5px;
} */
/*底部*/
.prfooter{
    padding:0px 21px;
    height:40px;
    background:#3F4560;
    font-size:13px;
font-family:MicrosoftYaHei-Bold;
font-weight:bold;
line-height:40px;
position:fixed;
bottom:0;
z-index:10;
width:86.5%;
}
  .prfooter .el-checkbox{
color:#FFFFFF;
  }
  .prfooter span{
    color:#FFFFFF;
  }
  .prfooterleft{
    float:left;
  }
  .prfooterright{
    width:560px;
    float:right;
  }
  .el-pagination{
font-size: 13px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color:#fff;
  } 
/*翻页*/
/* .project-plan .el-pagination__total{
    color:#fff;
  }
.project-plan .el-pagination{
  padding:6px 0px;
}
.project-plan .el-pagination span,
.project-plan .el-pagination .el-select .el-input .el-input__inner,
.project-plan .el-pagination__editor.el-input .el-input__inner,
.project-plan .el-pagination .btn-next, .el-pagination .btn-prev{
  color:#fff;
}
 .project-plan .el-pagination .el-select .el-input .el-input__inner,.project-plan .el-pagination__editor.el-input .el-input__inner{
    background:#393F5B;
    border:0;
  }
  .project-plan .el-pager li,.project-plan .el-pagination .btn-next,.project-plan .el-pagination .btn-prev{
     background:#393F5B;
  }  */
 </style>