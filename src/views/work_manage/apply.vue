<template>
  <div class="project-plan">
    <div class="plan-container">
      <!-- <div class="planLeft">
        <el-tree :data="navTree" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
      </div> -->
      <el-main>
        <div class="formlist">
          <el-button type="primary" :loading="downAll" @click="downLoadAll">批量下载</el-button>
          
          <el-form ref="form" inline style="float:right;">
            <el-form-item>
              <el-select v-model="listQuery.status" placeholder="请选择状态" @change="getList">
                <el-option label="全部" value="" style="padding-left:10px"></el-option>
                <el-option label="待审核" :value="0" style="padding-left:10px"></el-option>
                <el-option label="已通过" :value="1" style="padding-left:10px"></el-option>
                <el-option label="已驳回" :value="2" style="padding-left:10px"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="total>0" >
          <div v-for="(item,index) in list" :key="index" class="listCon">
              <div class="left">
                <div>{{item[0].applyTime.substr(0,11)}}</div>
                <div>星期{{weekArray[new Date(item[0].applyTime).getDay()]}}</div>
              </div>
              <div class="right">
                <div class="rightInfo" v-for="(listcon,index) in item" :key="index">
                  <div class="imgLeft">
                    <img v-if="listcon.topImg"  :src="`${domain}${requestPath.file}?fileName=${listcon.topImg}&isOnLine=true`" class="pic"/>
                    <img v-else src="../../assets/img/info.jpg"  class="pic" alt=""> 
                    <p>{{listcon.applyTime.substr(11,5)}}</p>
                  </div>
                  <div class="info">
                    <div class="name">{{listcon.userName}}<span v-if="listcon.depa[0]">（{{listcon.depa[0].deptName}}）</span>
                      <i v-if="listcon.status == 0">待审核</i>
                      <i v-if="listcon.status == 1" class="check">已通过√</i>
                      <i v-if="listcon.status == 2" class="refuse">已驳回×</i>
                      <i v-if="listcon.status == 3" class="refuse">已过期</i>
                    </div>
                    <div class="text">申请下载：
                      <span v-for="book in listcon.resourceList" :key="book.resourceType">
                        【{{typeList[book.resourceType]}}】{{book.name}}；
                      </span>
                    </div>
                    <div class="text">申请原因：{{listcon.reason}}</div>
                    <router-link :to="{path: '/apply/apply_details', query: {id: listcon.id}}">
                      <div class="details">详情</div>
                    </router-link>
                    <el-button v-if="listcon.status == 1" style="line-height:7px;width:auto" :loading="batchDownLoading" class="download2" @click="predown(listcon.resourceList)">批量下载</el-button>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div v-else  style="height:500px;color:#666;line-height:500px;text-align:center;width:100%">
            <img src="../../assets/img/null_download.png" alt="尚未申请下载资源" style="margin-top:40px">
        </div>
        <div v-if="total>0" class="prfooter" :class="[ sidebar.opened ? 'opend' : 'closed']">
          <div class="prfooterright">
            <el-pagination 
              @size-change="handleSizeChange" 
              @current-change="handleCurrentChange" 
              :current-page="listQuery.pageNum" 
              :page-sizes="[30,50,100,200,500]" 
              :page-size="listQuery.pageSize" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="total" align="center">
            </el-pagination>
          </div>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { getNavAPI } from '@/api/resource/common'
 import {errorMsg} from '@/utils/publicFunctions'
import '@/styles/resource.scss'
import {
  getListAPI,
  predownAPI
} from "@/api/work/apply";
import {
  getTypeAPI,
} from "@/api/work/index";
export default{
  name:'apply',
  data(){
    return {
      domain: process.env.BASE_API,
      requestPath:requestPath,
      list:{},
      total:0,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        status:null,
      },
      weekArray: new Array("日", "一", "二", "三", "四", "五", "六"),
      finished:'',
      type:'',
      download:false,
      fininsh:false,
      listFinished:false,
      finished:false,
      checkedAll:false,
      navTree: [],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      typeList:[],
      batchDownLoading:false,
      downAll:false
    }
  },
  mounted() {
    this.getType();
    this.getNav()
    this.getList();
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
    downLoadAll(){
      this.downAll=true;
      let idsAll="";
      for( let keys in this.list){
        this.list[keys].forEach((element,indx) => {
          if(element.status==1){
            element.resourceList.forEach((item,indx)=>{
              idsAll+=item.resourceId+","
            })
          }
        });
      }
      if(idsAll.length-1==idsAll.lastIndexOf(",")){
        idsAll=idsAll.substring(0,idsAll.length-1)
      }
      predownAPI({ids:idsAll}).then( res => {
        if(res.data.code==0){
          window.open(`${process.env.BASE_API}${res.data.data}`);
        }else {
          this.$message.error(`${res.data.msg}`);
        }
        this.downAll=false
      })
    },
    getType() {
      getTypeAPI().then(res => {
        this.typeList = res.data.data
      })
    },
    getList() {
      getListAPI(this.listQuery).then(res =>{
        if (res.data.code==0) {
          this.list = res.data.data.map;
          this.total = res.data.data.total;
        } else {
          errorMsg.apply(this, [res.data, `获取数据`]);
        }
        
      })
    },
    // 左侧自定义分类
    getNav() {
      getNavAPI().then(res => {
          res.data.data = [{showName:'全部'}].concat(res.data.data)
          res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
      })
    },
    handleSizeChange(val) {
      this.listQuery.pageSize=val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum=val
      this.getList()
    },
    // handleNodeClick(data) { //点击树节点获取table数据
    //   this.listQuery.diyTypeId = data.id;
    //   this.listQuery.diyTypeCode = data.code;
    //   this.getList()
    // },
    //批量下载
    predown(list){
      this.batchDownLoading=true
      let ids = '';
      ids = list.map( v => v.resourceId).join(',');
      predownAPI({ids:ids}).then( res => {
        // console.log(res.data)
        if(res.data.status){
          // console.log(`${process.env.BASE_API}${res.data.data}`)
          window.open(`${process.env.BASE_API}${res.data.data}`);
        }else {
          this.$message.error(`${res.data.msg}`);
        }
        this.batchDownLoading=false
      })
    }
  }
}
</script>

<style lang="less" scoped>
// .formlist{
//   height:  80px;
//   background: #fff;
//   border-bottom: 1px solid #DCDFE6;
// }
// .project-plan .formlist{
//   padding: 0;
// }
// .project-plan .formlist .el-button{
//   height: 34px;
//   border-radius:0!important;
//   margin: 23px;
//   float: left;
//   width: 89px;
// }
.listCon{
  display: flex;
  background: #fff;
  width: 100%;
  .left{
    width: 150px;
    background: #fff;
    text-align: center;
    font-size:14px;
    padding-top: 50px;
    min-height: 80px;
    font-weight:bold;
    border-bottom: 1px solid #ECEEF3;
  }
  .right{
    flex: 1;
    background: #fff;
    border-left: 1px solid #DCDFE6;
    .rightInfo{
      padding-bottom: 20px;
      border-bottom: 1px solid #ECEEF3;
      overflow: hidden;
    }
    .imgLeft{
      float: left;
      margin-top: 38px;
      margin-left: 30px;
      width: 54px;
      text-align: center;
      margin-right: 20px;
      .pic{
        width: 54px;
        height: 54px;
        border-radius:50%;
      }
      p{
        font-size:12px;
        color:#77869C;
      }
    }
    .info{
      padding-top: 42px;
    }
    .name{
      color: #414760;
      font-size:14px;
      margin-bottom: 14px;
      font-weight:bold;
      span{
        color: #C0C5D2;
        font-size:12px;
        font-weight:normal;
      }
      i{
        float: right;
        color: #FC9933;
        margin-right: 50px;
        font-style: normal;
      }
      .check{
        color: #30BBC7;
      }
      .refuse{
        color: #F56362;
      }
    }
    .text{
      color: #4F5672;
      width: 100%;
      line-height:26px;
      font-size: 14px;
    }
    .details,.download2{
      width: 84px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: solid 1px #DBDEE5;
      font-size:12px;
      color:rgba(149,154,173,1);
      border-radius:14px;
      float: right;
      margin-right: 40px;
      margin-top: 14px;
      cursor: pointer;
      &:hover{
        background: #449CFE;
        color: #fff;
      }
    }
    .download2{
      margin-right:10px;
    }
    .download{
      margin-right: 10px;
    }
  }
}
</style>