<template>
  <div class="details-container">
    <div class="top">
        <img v-if="info.topImg" :src="`${domain}${requestPath.file}?fileName=${info.topImg}&isOnLine=true`" class="pic"/>
        <img src="../../assets/img/info.jpg"  class="pic" v-else>
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
    <div class="checker" v-if="info.status != 0 && examine">
      <span>审核人：<i>{{examine.userName}}</i></span>
      <span >部门：<i v-for="(item,index) in examine.dept" :key="index">{{item.deptName}}</i></span>
      <span>审核时间：<i>{{examine.examineTime}}</i></span>
    </div>
    <el-form label-width="100px" class="demo-ruleForm" style="margin-bottom:50px"> 
      <el-form-item label="审核意见:" prop="type" class="width460">
        <el-input type="textarea" v-model="checkInfo" data-vv-as="field" name="type" placeholder="请输入审核意见"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn" v-if="info.status == 0">
      <div class="passBtn" @click="review(1)">通过</div>
      <div class="refuseBtn" @click="review(2)">驳回</div>
      <router-link :to="{path: '/check'}">
        <div class="cancelBtn">取消</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import {errorMsg} from "@/utils/publicFunctions.js";
import {
  getdetailsAPI,
  reviewAPI
} from "@/api/work/check";
import {
  getTypeAPI,
} from "@/api/work/index";
export default{
  name:'apply',
  data(){
    return {
      listLoading:true,
      domain: process.env.BASE_API,
      requestPath:requestPath,
      typeList:[],
      list:[],
      info:{},
      examine:{},
      checkInfo:'',
      allData:null,
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
        debugger
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
    review(index) {//审核
      reviewAPI({ids:[this.$route.query.id],status:index,opinion:this.checkInfo}).then(res =>{
         if (res.data.code==0) {
            this.$message.success('审核成功')
            this.$router.go(-1)         
          } else if(res.data.code==7){
            this.$message.warning('驳回需要填写审核意见')
          }else{
            errorMsg.apply(this, [res.data, `审核`]);
          }
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
  padding-bottom: 200px;
}
.top,.checker{
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
.checker{
  margin-bottom: 20px;
}
.text{
  font-size:14px;
  font-weight:bold;
  color:rgba(65,71,96,1);
  line-height:30px;
  margin-bottom: 25px;
}
.btn{
  float: left;
  margin-left: 30%;
}
.passBtn,.refuseBtn,.cancelBtn{
    width:88px;
    height:36px;
    background:rgba(64,158,255,1);
    border-radius:4px;
    line-height: 36px;
    color: #fff;
    text-align: center;
    float: left;
    margin-left: 20px;
    margin-top: 20px;
    cursor: pointer;
    font-size:14px;
}
.refuseBtn{
  background: #F56362;
}
.cancelBtn{
  background: #DCDFE6;
  color: #409EFF;
}
.el-table{
  max-height: 500px;
}
</style>