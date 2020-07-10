<template>
  <div class="details-container">
    <div class="top">
         <img v-if="info.topImg" :src="`${domain}${requestPath.file}?fileName=${info.topImg}&isOnLine=true`" class="pic"/>
        <img src="../../assets/img/info.jpg" class="pic" v-else>
        <span>申请人：<i>{{info.userName}}</i></span>
        <span>部门：<i v-for="dept in info.dept" :key="dept.deptId">{{dept.deptName}}&nbsp;&nbsp;&nbsp; </i></span>
        <span>申请时间：<i>{{info.applyTime}}</i></span>
        <span style="display:block">申请原因：<i>{{info.reason}}</i></span>
    </div>
    <div class="text">申请下载资源：</div>
    <el-table
      border
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      ref="multipleTable1"
      :data="list"
      tooltip-effect="dark"
      style="margin-bottom:50px"
    >
      <el-table-column prop="name" label="资源名称" align="center">
        <template slot-scope="scope">          
          <span @click="toDetails(scope.row)" style="cursor:pointer;">{{scope.row.name}}</span>       
        </template>
      </el-table-column>
      <el-table-column prop="resourceType " label="类型" align="center">
        <template slot-scope="scope">{{typeList[scope.row.resourceType ]}}</template>
      </el-table-column>
      <el-table-column prop="isbn" label="ISBN" align="center"></el-table-column>
      <el-table-column prop="editionNum" label="版次" align="center"></el-table-column>
      <el-table-column prop="size" label="大小" align="center"></el-table-column>
      <el-table-column prop="uploadTime" label="上传时间" align="center"></el-table-column>
      <el-table-column prop="file" label="下载内容" align="center"></el-table-column>
    </el-table>
    <div class="checker" v-if="info.status == 1">
      <span>审核人：<i>{{examine.userName}}</i></span>
      <span>部门：<i v-for="(item,index) in examine.dept" :key="index">{{item.deptName}}</i></span>
      <span>审核时间：<i>{{examine.examineTime}}</i></span>
    </div>
    <el-form label-width="100px" class="demo-ruleForm" style="margin-bottom:50px" v-if="info.status != 0">
      <el-form-item label="审核意见:" prop="type" class="width460">
        <el-input type="textarea" v-model="checkInfo" data-vv-as="field" name="type" placeholder="请输入审核意见"></el-input>
      </el-form-item>
    </el-form>
    <router-link :to="{path: '/apply'}">
      <div class="confirmBtn">确定</div> 
    </router-link>
    
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import {
  getTypeAPI,
} from "@/api/work/index";
import {
  getdetailsAPI,
} from "@/api/work/apply";
export default{
  name:'apply',
  data(){
    return {
      listLoading:true,
      domain: process.env.BASE_API,
      requestPath:requestPath,
      typeList:[],
      allData:null,
      list:[],
      info:{},
      examine:{},
      checkInfo:'',
      linkList:{
        1:'book_store/addBookResource?type=view&id=',
        2:'article/add_article?type=view&detailsId=',
        5:'picture_store/add_pic?type=view&id=',
        6:'video_store/add_video?type=view&id=',
        7:'audio_store/add_audio?type=view&id=',
        8:'animation_store/add_animation?type=view&id=',
        9:'courseware/create?type=view&id=',
        10:'statute/create?type=view&id=',
        14:'clause/add_clause?type=view&id=',
        15:'pdf/create?type=view&id=',
        16:'expert/create?type=view&id='
      }
    }
  },
  mounted() {
    this.getType();
    this.getList();
  },
  methods: {
    getType() {
      getTypeAPI().then(res => {
        this.typeList = res.data.data
      })
    },
    getList() {
      getdetailsAPI(this.$route.query.id).then(res =>{
        if (res.status) {
          this.info = res.data.data.apply
          this.list = res.data.data.list
          this.examine = res.data.data.examine
          this.allData=res.data.data
          if(this.examine){
            this.checkInfo=res.data.data.examine.opinion
          }
        } else {
          errorMsg.apply(this, [res.data, `获取数据`]);
        }
        this.listLoading = false;
      })
    },
    toDetails(row){
      this.$router.push('/resource/'+this.linkList[row.resourceType]+row.resourceId)
    }
  }
}
</script>

<style lang="less" scoped>
*{
  margin:0;
  padding:0;
}
.details-container{
  margin: 44px 60px;
  padding: 70px 100px;
  background: #fff;
  padding-bottom: 150px;
}
.el-table{
  max-height: 500px;
}
.top{
  font-size: 14px;
  margin-bottom: 100px;
  .pic{
    height: 54px;
    height: 54px;
    border-radius: 50%;
    float: left;
    margin-right: 10px;
    margin-top: 10px;
  }
  span{
    font-weight:bold;
    color:rgba(65,71,96,1);
    line-height:40px;
    margin-right: 60px;
  }
  i{
    font-style: normal;
    font-weight: normal;
  }
}
.text{
  font-size:14px;
  font-weight:bold;
  color:rgba(65,71,96,1);
  line-height:30px;
  margin-bottom: 25px;
}
.checker{
  font-size: 14px;
  margin-bottom: 20px;
  .pic{
    height: 54px;
    height: 54px;
    border-radius: 50%;
    float: left;
    margin-right: 10px;
    margin-top: 10px;
  }
  span{
    font-weight:bold;
    color:rgba(65,71,96,1);
    line-height:40px;
    margin-right: 60px;
  }
  i{
    font-style: normal;
    font-weight: normal;
  }
}
.confirmBtn{
    width:88px;
    height:36px;
    background:rgba(64,158,255,1);
    border-radius:4px;
    line-height: 36px;
    color: #fff;
    text-align: center;
    float: left;
    margin-left: 40%;
    margin-top: 20px;
    cursor: pointer;
    font-size:14px;
  }
</style>