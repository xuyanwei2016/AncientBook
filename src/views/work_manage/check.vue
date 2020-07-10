<template>
  <div class="project-plan">
    <div class="plan-container">
      <!-- <div class="planLeft">
        <el-tree :data="navTree" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
      </div> -->
      <el-main>
        <div class="planright">
          <div class="formlist">
            <div class="allBox">
              <el-checkbox  v-model="checkedAll" @change="selectAll">全选</el-checkbox>
              <!-- <input type="checkbox"> -->
            </div>
            <div class="passBtn" v-if="authBtns.filter(i => i.idName=='passBtn').length>0" @click="review(1)">通过</div>
            <div class="refuseBtn" v-if="authBtns.filter(i => i.idName=='refuseBtn').length>0" @click="review(2)">驳回</div>
            <el-form ref="form">
              <el-form-item  style="float:right;margin-right:32px;margin-top:20px">
                <el-select v-model="listQuery.status" placeholder="请选择状态" @change="getList">
                  <el-option label="全部" value="" style="padding-left:10px"></el-option>
                  <el-option label="待审核" :value="0" style="padding-left:10px"></el-option>
                  <el-option label="已通过" :value="1" style="padding-left:10px"></el-option>
                  <el-option label="已驳回" :value="2" style="padding-left:10px"></el-option>
                </el-select>
              </el-form-item>
            </el-form> 
          </div>
          <div style="width:100%" v-if="total>0">
            <div  v-for="(item,index) in list" :key="index" class="listCon">
              <div class="left">
                <div>{{item[0].applyTime.substr(0,11)}}</div>
                <div>星期{{weekArray[new Date(item[0].applyTime).getDay()]}}</div>
              </div>
              <div class="right">
                <el-table
                  v-loading="listLoading"
                  element-loading-text="给我一点时间"
                  ref="checkTable"
                  :data="item"
                  tooltip-effect="dark"
                  style="position:relative;"
                  @selection-change="selectionChangeNative"
                >
                  <el-table-column align="center" type="selection" ref="selectionCheckbox"></el-table-column>
                  <el-table-column >
                    <template slot-scope="scope">
                      <div class="imgLeft">
                        <img v-if="scope.row.topImg" :src="`${domain}${requestPath.file}?fileName=${scope.row.topImg}&isOnLine=true`" class="pic"/>
                        <img src="../../assets/img/info.jpg"  class="pic" v-else>
                        <p>{{scope.row.applyTime.substr(11,5)}}</p>
                      </div>
                      <div class="info">
                        <div class="name">{{scope.row.userName}}<span v-for="dept in scope.row.depa" :key="dept.deptId">（{{dept.deptName}}）</span>
                            <i v-if="scope.row.status == 0">待审核...</i>
                            <i v-if="scope.row.status == 1" class="check">已审核√</i>
                            <i v-if="scope.row.status == 2" class="refuse">已驳回×</i>
                          </div>
                        <div class="text">申请下载：
                          <span v-for="book in scope.row.resourceList" :key="book.resourceType">
                            【{{typeList[book.resourceType]}}】{{book.name}}；
                          </span>
                        </div>
                        <div class="text">申请原因：{{scope.row.reason}}</div>
                        <div class="reject2" v-if="scope.row.status==0&&authBtns.filter(i => i.idName=='passBtn').length>0" @click="checkMethod(scope.row.id,2)">驳回</div>
                        <div class="pass2" v-if="scope.row.status==0&&authBtns.filter(i => i.idName=='refuseBtn').length>0" @click="checkMethod(scope.row.id,1)">通过</div>                      
                        <router-link :to="{path: '/check/check_details', query: {id: scope.row.id}}">                 
                          <div class="details">详情</div>
                        </router-link>
                        <!-- <div class="download2" v-if="scope.row.status==1">批量下载</div> -->                      
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- <div class="check-top">
                <div class="date">
                  <span>8/1</span>
                  <span class="day">周二</span>
                </div>
                <div class="border"></div>
              </div>             
              <div class="check-box" v-for="item2 in item" :key="item2.id">
                <div class="check-item">                 
                    <div class="center"> 
                      <div class="check-left">
                        <input type="checkbox">
                      </div>                    
                      <div class="check-middle">
                        <img :src="`${domain}${requestPath.file}?fileName=${item.topimg}&isOnLine=true`" class="pic"/>
                        <p style="color:#77869C;margin-top:10px;">{{11.02}}</p>
                      </div>
                      <div class="check-right">
                        <div class="name">
                          <p>吴唯一 <span style="color:#C0C5D2;">(编辑部)</span></p>
                        </div>
                        <div class="text">申请下载：
                          <span>申请下载：【图书】国际税收实务与案例；【图书】房地产开发企业税收与会计实务大全；</span>
                        </div>

                      </div>
                    </div>
                </div>
              </div> -->
            </div>
            
          </div>
          <div v-else  style="height:666px;color:#666;line-height:500px;text-align:center;overflow-y:scroll;width:100%">
              暂无数据
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
        </div>
      </el-main>
    </div>
    <!--审核对话框-->
    <el-dialog title="批量审核" :visible.sync="dialog" class="checkDialog backgroundDialog">
      <el-form>
        <el-form-item label="审核意见：">
          <el-input type="textarea" v-model="textarea" name="type" placeholder="请输入审核意见"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refuseCheck">确 定</el-button>
        <el-button @click="dialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { getMultipleSelectionIDs } from '@/filters/getIds'
import { getNavAPI } from '@/api/resource/common'
import '@/styles/resource.scss'
import store from '@/store'
import {
  getListAPI,
  reviewAPI
} from "@/api/work/check";
import {
  getTypeAPI,
} from "@/api/work/index";
 import {errorMsg} from '@/utils/publicFunctions'
export default{
  name:'apply',
  data(){
    return {
      domain: process.env.BASE_API,
      requestPath:requestPath,
      total:0,
      listQuery: {
        pageNum: 1,
        pageSize: 50,
        status:'',
        orderBy:'applyTime desc'
        //orderBy:'examineTime desc'
      },
      checked:false,
      list:[],
      typeList:[],
      weekArray: new Array("日", "一", "二", "三", "四", "五", "六"),
      authBtns:[],
      listLoading:true,
      textarea:'',
      checkedAll:false,
      navTree:[],
      defaultProps: {
        children: 'list',
        label: 'showName'
      },
      multipleSelection:[],
      ids:[],
      dialog:false,
    }
  },
  mounted() {
    this.getType();
    this.getNav()
    this.getList();
    this.authBtns = store.getters.pageBtn[this.$route.meta.routerIds[0]]
  },
  computed:{
    sidebar() {
      return this.$store.state.app.sidebar;
    }
  },
  methods: {
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
        this.listLoading = false
      })
    },
    // 左侧自定义分类
    getNav() {
        getNavAPI().then(res => {
          res.data.data = [{showName:'全部'}].concat(res.data.data)
          res.data.code === 0 ? this.navTree = res.data.data : this.$message.error('获取nav数据失败')
        })
    },
    checkMethod(id,status){
      this.ids= [id];
      if(status==1){//通过
        reviewAPI({ids:[id],status:status}).then( res => {
          if(res.data.code ==0){
            this.$message.success('审核成功')
            this.getList()
          }else if(res.data.code == -7){
            this.$message.error(res.msg)
          }else {
            this.$message.error('审核失败')
          }
        })
      }else if(status == 2){//驳回
        this.dialog = true
      }
     
    },
    review(index) {//审核
      if(this.multipleSelection.length>0){
        if(index == 1){//通过
          const statuType = this.multipleSelection.every(el => el.status ==0 );
          if(statuType){//只有未审核的状态才能审核
            reviewAPI({ids:this.ids,status:index}).then(res =>{
              if (res.data.code == 0) {
                this.$message.success('审核成功')
                this.getList()
                this.$router.go(-1);
              } else if(res.data.code == -7){
                this.$message.error(res.msg)
              }else {
                this.$message.error('审核失败')
              }
            })
          }else{
            this.$message.error('请选择待审核状态的数据进行操作');
          }
        } else if(index == 2){//驳回
          this.dialog = true  //弹窗
        }
      } else{
        this.$message.warning('请至少选择一条数据进行操作');
      }
    },
    refuseCheck() {//确认驳回
      if(Object.keys(this.textarea).length!=0){
        this.dialog = false
        const statuType = this.multipleSelection.every(el => el.status == 0);
        if(statuType){//只有未审核的状态才能审核
          reviewAPI({ids:this.ids,status:2,opinion:this.textarea}).then(res =>{
            if (res.status) {
              this.$message.success('审核成功')
              this.getList()
            }  else if(res.code == -7){
              this.$message.error(res.msg)
            }else {
              this.$message.error('操作失败')
            }
          })
        } else{
          this.$message.error('请选择待审核状态的数据进行操作');
        }
      } else{
        this.$message.error('请填写驳回意见');
      }
    },
    selectionChangeNative(selection,row) {
      this.multipleSelection = selection;
      this.ids = getMultipleSelectionIDs(this.multipleSelection)
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
    //全选
    selectAll(){      
      if (this.checkedAll) {
        let list = [];
        for(let key in this.list){
          let item = this.list[key];
          item.map( row => {
            list.push(row);
          })                 
        }
        list.map( row => {
          this.$refs.checkTable.map( table => {
            table.toggleRowSelection(row)
          });
        })
        this.multipleSelection = this.list;
      } else {
        this.$refs.checkTable.map( table => {
            table.clearSelection()
          });
       this.multipleSelection = []
      }
    }
  }
}
</script>

<style>
  /* .right .el-table__footer-wrapper, .el-table__header-wrapper{
    display: none !important;
  } */
  .checkDialog .el-dialog {
    width: 458px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -229px;
    margin-top: -100px !important;
  }
</style>

<style lang="less" scoped>
// *{
//   margin:0;
//   padding:0;
// }
.planright{
  padding: 0;
}
.project-plan .formlist{
  padding: 0;
}
.formlist{
  height: 80px;
  background: #fff;
  line-height: 80px;
  border-bottom: 1px solid #DCDFE6;
  .allBox{
    margin-left: 30px;
    float: left;
  }
  .passBtn,.refuseBtn{
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
    background:#F56362;
  }
}
.listCon{
  display: flex;
  background: #fff;
  .left{
    width: 150px;
    background: #fff;
    text-align: center;
    font-size:14px;
    padding-top: 50px;
    min-height: 80px;
    font-weight:bold;
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
    .checkbox{
      margin-top:58px;
      float:left;
      margin-left:30px;
      margin-right: 16px;
    }
    .imgLeft{
      float: left;
      margin-top: 38px;
      // margin-left: 30px;
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
    .details,.download2,.pass2,.reject2{
      width: 84px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: solid 1px #DBDEE5;
      font-size:12px;
      color:rgba(149,154,173,1);
      border-radius:14px;
      float: right;
      margin: 14px 0;
      margin-right: 10px;
      cursor: pointer;
      &:hover{
        background: #449CFE;
        color: #fff;
      }
    }
    .reject2{
      background:#F56362;
      color:#fff;
    }
    .download,.pass,.refuse{
      margin-right: 10px;
    }
  }
  
}
// .backgroundDialog .el-button{
//   height: 40px;
//   width: 80px;
//   line-height: 40px;
//   background: #03bcd9;
//   border: none;
//   color: white
// }
.check-top{
  display:flex;
  justify-content: space-between;
  align-items: center;
  .date{
    font-weight:bold;
    font-size:16px;
    .day{
      font-size:18px;
    }
  }
  .border{
    width:95%;
    border-top:1px solid #DCDFE6;
  }
}
.check-box{
  width:100%;
  .check-item{
    border-bottom:1px dashed #ccc;
    
    .center{
      padding:40px 0;
      display:flex;
      justify-content: flex-start;
      align-items: center;
      font-size:14px;
      .check-left{
        margin-right:16px;
      }
      .check-middle{
        text-align:center;
        margin-right:20px;
        image{
          width:54px;
          height:54px;
          border-radius:50%;
        }
      }
      .check-right{
        position:relative;
        .name{
          color:#414760;
          margin-bottom:20px;
        }
        .text{
          color:#4F5672;
        }
      }
    }
  }
}
// .prfooter{
//   width: calc(100vw - 180px);
//   padding: 0px 21px!important;
// }
</style>