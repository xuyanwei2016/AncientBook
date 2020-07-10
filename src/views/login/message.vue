<template>
  <div class="dashboard-container">
    <Navbar></Navbar>
    <div class="message-nav">
      <span class="message-text">消息</span>
      <div class="null-message"  v-if="!pageStatus">没有新消息</div>
    </div>
    <div class="message-content">
      <div class="all-read">
        <el-button class="all-read-btn" @click="changeMarkedRed" type="primary">全部标记为已读</el-button>
      </div>
      <div class="message-list">
        <ul v-if="messageList&&messageList.length>0">
          <li v-for="(item,index) in messageList" :key="index">
            <div v-on:click="toMessageDetail(item)"  class="list" :class="item.status==1 ? 'read':''">
              <!-- {{readState? read: }} -->
              <div class="tips">
                <div class="title" :class="item.status==1  ? 'read':''">{{item.title}}</div>
                <!-- <span>资源已审核</span> -->
                <i class="time">{{item.createTime}}</i>
              </div>
              <p class="text">{{item.content}}</p>
            </div>
          </li>
        </ul>
        <div v-else  style="height:500px;color:#666;line-height:500px;text-align:center;width:100%">
            <img src="../../assets/img/null.png" alt="暂无数据" style="margin-top:40px">
        </div>
      </div>
       <div class="messagePrfooter dialog_prfooter">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="news.pageNum" :page-sizes="[30,50,100,200,500]" :page-size="news.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" align="right">
      </el-pagination>
      </div>
    </div>
    <p class="footerversion">Copyright ©中医古籍出版社</p>
  </div>
</template>

<script>
import { Navbar } from "../../views/layout/components";
import { getMessageAPI,oneMessageReadAPI } from "@/api/login.js";

export default {
  data() {
    return {
      value: "",
      pageStatus: false,
      news: {
        pageNum: 1,
        pageSize: 20,
        orderBy:'createTime desc'
      },
      readState: false,
      messageList: [],
      total:null
    };
  },
  name: "layout",
  components: {
    Navbar
  },
  created(){
    this.pageStatus = this.$route.query.status
  },
  mounted() {
    this.getMessageList();
  },

  methods: {
    handleClickOutside() {
      this.$store.dispatch("closeSideBar", { withoutAnimation: false });
    },
    valueChange(value) {
      this.$store.dispatch("SetSearchValue", value).then(res => {
      });
    },
    // 获取消息列表
    getMessageList() {
      getMessageAPI(this.news).then(res => {
        if (res.data.code == 0) {
          this.messageList = res.data.data.list;
          this.total = res.data.data.total
        } else {
        }
      });
    },
    // 全部标记成已读
    changeMarkedRed() {
      oneMessageReadAPI(0).then(res=>{
        if(res.data.code == 0){
          this.getMessageList()
        }
      })
    },
    // 改变分页大小
    handleSizeChange(val) {
      this.news.pageSize = val
      this.getMessageList()
    },
    // 改变分页页数
    handleCurrentChange(val) {
      this.news.pageNum = val
      this.getMessageList()
    },
    // 跳转消息内容
    toMessageDetail(data){
      oneMessageReadAPI(data.id).then(res=>{
        if(res.data.code == 0){
          if(data.type == 1){
        this.$router.push({path:'/check'})
      }else{
        this.$router.push({path:'/apply'})
      }
        }
      }) 
    }
  }
};
</script>

<style lang="less" scoped>
.dashboard-container{
  background: none!important;
}
li {
  list-style-type: none;
}
.dashboard-container {
  overflow: hidden;
  background-color: #999;
}
.message-nav {

  display: flex;
  margin-top: 70px;
  height: 60px;
  line-height: 60px;
  background: #fff;
}
.message-text {
  padding-left: 28px;
  font-size: 12px;
  color: #a0aebd;
}
.null-message {
  margin-left: 30px;
  color: #a0aebd;
}
.message-content {

  display: flex;
  flex-direction: column;
  margin: 50px 100px;
  margin-top: 44px;
  background: #fff;
}
.all-read {
  position: relative;
  height: 98px;
}
.all-read-btn {
  position: absolute;
  right: 0;
  top: 0;
  margin: 31px 41px 5px 0;
}
.message-list {
  margin: -10px 50px 50px 10px;
}
.list {
  border-bottom: 1px dotted #ccc;
  padding: 10px;
  line-height: 30px;
  font-size: 14px;
  color: #7e7e7e;
}

.tips{
  display: flex;
  justify-content: space-between;
}
.title {
  font-size: 18px;
  color: #404761;
}
.read {
  color: #bbbbbb;
}
.messagePrfooter{
  padding-right: 20px;
  background: #3f4560;
}

</style>
