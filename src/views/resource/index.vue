<template>
  <div class="project-plan">
    <div class="plan-container">
      <div class="planLeft">
        <el-tree :data="datatree" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
      </div>
      <div class="planright">
        <div class="prtop">
          <div class="prtopt">
          <p class="type">
            <em>类型：</em><span class="blue">全部</span><span>图书</span><span>全部</span><span>图书</span><span>全部</span> <span>图书</span> <span>全部</span><span>图书</span>
<span>全部</span><span>图书</span><span>全部</span><span>图书</span>
            </p>
          <i class="el-icon-arrow-down pullright"></i>
          </div>
          <div class="prtopb">
          <p class="resource">
            <em>来源：</em><span>全部</span><span>图书</span><span>全部</span>
             </p>
          </div>
        </div>
        <div class="prmiddle">
           <div class="iconlist">
             <div class="iconleft pullleft">
              <em>排列：</em><span class="blue">关联度<i class="el-icon-sort"></i></span><span>出版时间<i class="el-icon-sort"></i></span><el-checkbox v-model="download">可下载</el-checkbox>
              <el-checkbox v-model="finished">已完成</el-checkbox>

             </div>
             <div class="iconright pull-right">
               <el-checkbox v-model="listFinished">列表显示完成度</el-checkbox>
               <i class="rowico marginleft"></i>
               <i class="listico marginleft"></i>
               <span class="marginleft">共300条搜索结果</span>
             </div>
           </div>
           <div class="plancon">
            <table>
              <tbody v-for="(item,index) in tabledata" :key="index">
                <tr>
                  <td>
                       <el-checkbox v-model="item.checked"></el-checkbox>
                       <div>
                         <img :src="item.imgUrl" class="pic"/>
                         <div class="info">
                           <h1 class="green">图书名称国际工程承包与海外投资税收筹划实务与案例(管理者终身学习)</h1>
                           <h6><em>作者：段从军</em><em>出版时间：2018年6月</em><em>版次：2018年10月第一版</em></h6>
                           <p>而劳务和特许权使用费的区别、常设机构判定、跨境租金、软件所得、国际运输、间接转让多个境内公司股权、境外税收抵免计算、进出口商品的归类及进口货物税率的适用、海关估价、进出口税收减免及后续监管、出口退税、企业重组中与跨境业务相关的国内税和海关税收、转让定价等问题所涉及的税务处理就更为复杂...</p>
                           <div class="infoicon">
                             <span class="red marginleft">完成度：90%</span>
                             <span class="marginleft bluecolor"><i class="resources"></i>相关资源</span>
                             <span class="marginleft bluecolor"><i class="dwico"></i>申请下载</span>
                           </div>
                         </div>
                       </div>
                  </td>
                </tr>
              </tbody>
            </table>
           </div>
        </div>
        <div class="prfooter">
          <div class="prfooterleft">
            <el-checkbox v-model="checkedAll">全选</el-checkbox>
            <span class="marginleft">批量下载</span>
            <span class="marginleft">更多</span>
          </div>
          <div class="prfooterright">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="center">
          </el-pagination>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
*{
  margin:0;
  padding:0;
}
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
p{
  margin:0;
  padding:0;
}
.prtop{
  background:#fff;
  height:98px;
  padding:18px 21px;
  }
.prtop p{
  height:34px;
  line-height: 34px;
  font-size:14px;
font-family:MicrosoftYaHei-Bold;
font-weight:bold;
float:left;
}
.prtop p em{
  font-style:normal;
  margin-right:14px;
}
.prtop p span{
  color:#3F4861;
  margin-right:20px;
}
.pullright{
  float:right;
}
.prtopb{
  clear:both;
  }
  .clear{
     clear:both;
  }
  .prmiddle{
    margin-top:31px;
  }
  .iconlist{
    height:40px;
    line-height:40px;
    padding:0px 21px;
    background:rgba(245,247,250,1);
    border:1px solid #DCDFE6;
  }
  .iconlist em{
    font-style:normal;
    font-size:14px;
font-family:MicrosoftYaHei;
font-weight:400;
color: #848AA1;
    }
  .iconlist span{
    margin-right:21px;
    font-size:14px;
    font-family:MicrosoftYaHei;
    font-weight:400;
    color: #848AA1;
    
  }
  .iconlist span.marginleft{
      margin-right:0px;
    }
.prtop p span.blue{
  color:#02B4D0;
}
 .iconlist span.blue{
    color:#02B4D0;
  }
  .pullleft{
    float:left;
     font-size:14px;
font-family:MicrosoftYaHei;
font-weight:400;
  }
  .iconleft{
    width:380px;
  }
  .iconright{
  /* width:340px; */
  float:right;
  font-size:14px;
font-family:MicrosoftYaHei;
font-weight:400;
  }
 
.rowico{
    display:inline-block;
    width:14px;
    height:14px;
    background:url("../../assets/img/rowico.png") no-repeat;
  }
  .listico{
    display:inline-block;
    width:14px;
    height:14px;
    background:url("../../assets/img/listico.png") no-repeat;
  }
  .marginleft{
    margin-left:20px;
  }
  .plancon{
   background:#fff;
   padding:16px;
  }
  .pic{
    width:121px;
    height:121px;
    float:left;
  }
  .info h1{
    font-size:16px;
font-family:MicrosoftYaHei;
font-weight:400;
height:20px;
line-height:20px;
  }
.info h6,.info p{
  font-size:14px;
font-family:MicrosoftYaHei;
font-weight:400;
}
.info h6{
  height:18px;
  line-height:18px;
  margin-top:8px;
}
.info h6 em{
  font-style:normal;
  margin-right:50px;
  color:#BBBBBB;
}
.info p{
  height:36px;
  line-height:18px;
  margin-top:15px;
  color:#7E7E7E;
}
  .infoicon{
    width:350px;
    float:right;
}
  .plancon .el-checkbox{
  float:left;
  margin-top:45px;
  }
  .red{
    color:#F56C6C;
  }
  .infoicon{
    font-size:14px;
    font-family:MicrosoftYaHei;
font-weight:400;
  }
  .resources{
    display:inline-block;
    width:16px;
    height:18px;
   background:url("../../assets/img/resourceico.png") no-repeat;
   margin-right:3px;
  }
  .dwico{
    display:inline-block;
    width:18px;
    height:18px;
   background:url("../../assets/img/downloadico.png") no-repeat;
   margin-right:3px;
  }
  .bluecolor{
    color:#409EFF;
  }
  .green{
    color:#02B4D0;
  }
  .plancon  table td{
    padding:10px 0px;
    border-bottom:1px solid #EBEEF5;
  }
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
    width:230px;
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
  
</style>
<style>
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
<script>
export default{
  name:'plan',
  data(){
    return {
      download:false,
      fininsh:false,
      listFinished:false,
      finished:false,
      checkedAll:false,
      total:0,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        },
      tabledata:[{
        checked:true,
        imgUrl:require('../../assets/img/book.png')
      },{
        checked:false,
        imgUrl:require('../../assets/img/book.png')
      },{
        checked:false,
        imgUrl:require('../../assets/img/book.png')
      },{
        checked:false,
        imgUrl:require('../../assets/img/book.png')
      },{
        checked:false,
        imgUrl:require('../../assets/img/book.png')
      }],
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
        }


    }
  },
   methods: {
      handleNodeClick(data) {
        console.log(data);
      },
    handleSizeChange(val) {
     
    },
    handleCurrentChange(val) {
      
    },
    handleCurrentChange(val) {
     
    },
    }
}
</script>
