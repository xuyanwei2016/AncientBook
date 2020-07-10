<template>
  <div class="addImgResource">
    <div class="formbox">
      <el-form
        :model="imgForm"
        ref="ruleForm"
        :rules="rules"
        label-width="140px"
        class="demo-ruleForm"
      >

        <div class="tabwrapper">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>

          <el-form-item prop="bookName" label="图书名称:" class="width360">
            <el-input v-model="imgForm.bookName" name="bookName" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="选题号:" prop="subjectNum" class="width360">
            <el-input v-model="imgForm.subjectNum" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="author" label="作者:" class="width360">
            <el-input v-model="imgForm.author" name="author" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="seriesName" label="丛书名称:" class="width360">
            <el-input v-model="imgForm.seriesName" name="seriesName" disabled="disabled"></el-input>
            <!--<el-select v-model="imgForm.seriesName" disabled="disabled" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item prop="isbn" label="ISBN：" class="width360">
            <el-input v-model="imgForm.isbn" name="isbn" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="translator" label="译者：" class="width360">
            <el-input v-model="imgForm.translator" name="translator" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="publishingUnit" label="出版单位：" class="width360">
            <el-input v-model="imgForm.publishingUnit" name="publishingUnit" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="language" label="语种：" class="width360">
            <el-input v-model="imgForm.language" name="language" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="chiefEditor" label="主编：" class="width360">
            <el-input v-model="imgForm.chiefEditor" name="chiefEditor" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item prop="editor" label="责任主编：" class="width360">
            <el-input v-model="imgForm.editor" name="editor" disabled="disabled"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper" v-for="(item,index) in logs" :key="index">
          <h6 v-if="item.statusData">&nbsp;&nbsp;|&nbsp;&nbsp;{{item.statusData.title}}</h6>
          <el-steps v-if="item.statusData" :active="(item.items||item.stage=='7-0')?item.statusData.stages.indexOf(item.stage)+1:item.statusData.stages.indexOf(item.stage)">
            <el-step :title="step" v-for="(step,instep) in item.statusData.step" :key="instep"></el-step>
            <!--<el-step title="待审核"></el-step>
            &lt;!&ndash;<el-step title="审核中"></el-step>&ndash;&gt;
            <el-step title="审核通过"></el-step>-->
          </el-steps>

          <div class="liBox" v-if="item.stage">
            <div class="olist" v-for="(log,inlog) in item.items" :key="inlog" v-if="item.stage.indexOf('7-')!=0">
              <div class="oneLIne">
                <img :src="infoImg" alt="" class="infoImg">
                <span class="depart">{{log.dept}}：</span>
                <span class="name">{{log.userName||log.auditorName}}</span>
                <span class="date">（{{log.auditTime||log.dealTime}}）</span>
              </div>
              <div class="desc" v-if="item.statusData">
                <b>[{{log.stage_cn}}]</b>
                <span v-if="item.stage.indexOf('2-')!=0">{{log.status==1?' 审核通过 ':log.status==0?' 审核未通过 ':log.status==3?'三审驳回':''}}</span>
                <span v-if="item.stage.indexOf('2-')==0">{{log.status==1?' 审核通过 ':log.status==0?' 待审核 ':' 审核未通过 '}}</span>
                {{log.auditOpinion||log.remark}}</div>
            </div>
            <div class="olist noLine" v-for="(log,inlog) in item.items" :key="inlog" v-if="item.stage.indexOf('7-')==0">
              <div v-for="(logthr,inthr) in log.items" :key="inthr" v-if="log.code=='7-1'||log.code=='7-2'">
                <div class="oneLIne">
                  <img :src="infoImg" alt="" class="infoImg">
                  <span class="depart">{{storageStatus[logthr.stage]}}：</span>
                  <span class="name">{{logthr.userName||logthr.auditorName}}</span>
                  <span class="date">（{{timeSub(logthr.auditTime||logthr.dealTime)}}）</span>
                </div>
                <div class="desc" v-if="item.statusData"><b>[{{log.code=='7-1'?logthr.stage=='7-1-2-0'?'提交新书付型审核':'新书付型审核':'审核毛书'}}]</b>{{' 审核通过 '}}{{logthr.auditOpinion||logthr.remark}}</div>
              </div>
                <div v-if="log.code=='7-3'&&log.storage">
                  <div class="oneLIne">
                    <img :src="infoImg" alt="" class="infoImg">
                    <!--<span class="depart">{{log.storage.dept}}：</span>-->
                    <span class="name">{{log.storage.creatorName}}</span>
                    <span class="date">（{{log.storage.createdTime}}）</span>
                  </div>
                  <div class="desc" v-if="item.statusData"><b>[图书入库]</b>{{log.storage.status==1?' 审核通过 ':log.storage.status==0?'审核未通过':''}}{{log.storage.storageRemark||log.storage.storeroomRemark}}</div>
                </div>


              <!--</div>-->

            </div>
          </div>
        </div>


      </el-form>
    </div>
  </div>
</template>
<script>
  import "@/styles/resource.scss";
  import "@/styles/commonRe.css";
  import infoImg from '@/assets/img/info.jpg';
  import {getDetailAPI, getLogsAPI} from '@/api/newBook/book.js';

  export default {
    data() {
      return {
        imgForm: {},
        rules: {},
        activeName: "first",
        infoImg: infoImg,
        statusList: [
          {stages: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6'], title: '选题管理', step: ['录入中', '待审核', '审核通过']},

          {stages: ['2-3-1', '2-3-2', '2-3-3', '2-4'], title: '三审作业', step: ['一审', '二审', '三审']},

          {stages: ['4-1', '4-2', '4-3', '4-5', '4-6'], title: '书号/CIP申领', step: ['申请书号/CIP', '待审核', '审核通过', '下发CIP', '下发书号']},

          /*{stages:['2-1','2-2','2-2','2-4'],title:'CIP申领',step:['申请CIP','待审核','审核通过','下发CIP']},*/
          {stages: ['5-1', '5-2', '5-3', '5-5'], title: '发排管理', step: ['申请发排', '待审核', '审核通过', '完成排版']},

          {stages: ['6-1', '6-2', '6-3', '6-5'], title: '封面管理', step: ['申请封面', '待审核', '审核通过', '完成封面']},

          {stages: ['7-0', '7-1', '7-2', '7-3'], title: '图书印刷', step: ['财务到账', '新书付型', '审核毛书', '图书入库']},
        ],
        statusData: [],
        logs: [],
        storageStatus:{
           '7-1-2-0':'出版部',
           '7-1-2-1':'责编意见',
           '7-1-2-2':'总编室主任意见',
           '7-1-2-3':'财务意见',
           '7-1-2-4':'发行部意见',
           '7-1-2-5':'社领导意见',
           '7-2-1-1':'责编意见',
           '7-2-1-2':'出版意见',
        },
      }
    },
    created() {
      this.getDetail();
    },

    methods: {
      getDetail() {
        getDetailAPI(this.$route.query.lookId).then(res => {
            if (res.data.status) {
              this.imgForm = res.data.data;
              this.getLogs();
            }
          }
        )
      },
      getLogs() {
        let url = null;
        this.statusData = [];

        if (this.imgForm.stages.length > 0) {
          url = '';
          this.imgForm.stages.map(item => {
            url = url + item + ',';
          })
          url = url.substring(0, url.length - 1);
        }
        getLogsAPI({
          id: this.imgForm.id,
          stages: url,
        }).then(res => {
          if (res.data.status) {
            this.logs = res.data.data;

            if (this.logs && this.logs.length > 0) {


              this.logs.forEach((item, index) => {
                if(item.stage){
                  if(!item.items&&item.stage!='7-0'){
                    return
                  }
                  let cur = item.stage.substring(0,2);
                  /*if(cur=='1-'){
                    this.statusData=[...this.statusData,{stages:['1-1','1-2','1-3'],title:'选题管理',step:['录入中','待审核','审核通过']}];
                  }else if(){}*/
                  switch (cur) {
                    case '1-':
                      item.statusData = {
                        stages: ['1-1', '1-2', '1-3', '1-4', '1-5', '1-6'],
                        title: '选题管理',
                        step: ['录入中', '待审核', '审核通过']
                      };
                      if (item.stage == '1-4') {
                        item.statusData.step=['录入中', '待审核', '审核未通过'];
                      }
                      break;
                    case '2-':
                      item.statusData = {
                        stages: ['2-3-1', '2-3-2', '2-3-3', '2-4'],
                        title: '三审作业',
                        step: ['一审', '二审', '三审']
                      };
                      break;
                    case '4-':
                      let fourStatus = {
                        title: '书号/CIP申领',
                      };
                      if (item.stage != '4-6' && item.stage != '4-5') {
                        fourStatus.stages = ['4-1', '4-2', '4-3', '4-5', '4-6', '4-7'];
                        fourStatus.step = ['申请书号/CIP', '待审核', '审核通过', '下发CIP', '下发书号'];
                      } else if (item.stage == '4-6') {
                        fourStatus.stages = ['4-1', '4-2', '4-3', '4-6', '4-5', '4-7'];
                        fourStatus.step = ['申请书号/CIP', '待审核', '审核通过', '下发书号', '下发CIP'];
                      } else if (item.stage == '4-5') {
                        fourStatus.stages = ['4-1', '4-2', '4-3', '4-5', '4-6', '4-7'];
                        fourStatus.step = ['申请书号/CIP', '待审核', '审核通过', '下发CIP', '下发书号'];
                      }
                      item.statusData =  fourStatus;
                      break;
                    case '5-':
                      item.statusData = {
                        stages: ['5-1', '5-2', '5-3', '5-5'],
                        title: '发排管理',
                        step: ['申请发排', '待审核', '审核通过', '完成排版']
                      };
                      break;
                    case '6-':
                      item.statusData = {
                        stages: ['6-1', '6-2', '6-3', '6-5'],
                        title: '封面管理',
                        step: ['申请封面', '待审核', '审核通过', '完成封面']
                      };
                      break;
                    case '7-':
                      item.statusData = {
                        stages: ['7-0', '7-1', '7-2', '7-3'],
                        title: '图书印刷',
                        step: ['财务到账', '新书付型', '审核毛书', '图书入库']
                      };
                      break;
                  }
                }

              })


            }
          }
        })
      },
      handleClick(tab, event) {
      }
    }
  }
</script>
<style lang="less" scoped>
  .addImgResource {
    .el-form-item.width360 {
      width: 40%;
      display: inline-block;
    }

    .formbox {
      padding-left: 20px;
      padding-bottom: 60px;
      background: #FFF;
      border: 1px solid #DCDFE6;
      -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
    }
  }

  .liBox {
    margin-top: 15px;
  }

  .infoImg {
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 50px;
  }

  .olist {
    border-bottom: 1px solid #eee;
    padding: 10px 0;

    .oneLIne {
      display: flex;

      .name {
        max-width: 600px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    span {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      color: #555;
      font-size: 16px;
      vertical-align: top;
      margin-left: 5px;
      white-space: nowrap;
    }
  }
  .noLine{
    border: none;
    padding: 0;
    >div{
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
  }

  .desc {
    margin-top: 8px;
    display: flex;
    align-items: start;
    line-height: 30px;
    b{ flex-shrink:0}
    span{padding-right: 3px;color: #000}
  }
</style>
