<template>
  <!--图书加印 图书加印-->
  <div class="addImgResource newBookView xywCss">
    <div class="formbox1">
      <el-form
        :model="step1Form"
        ref="step1Form"
        label-width="140px"
        class="demo-ruleForm"
      ><!--:rules="rules"-->
        <!--责任意见-->
        <div class="tabwrapper1" v-for="(item,index) in dataList" :key="index" v-if="dataList.length>0">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;{{stage[index].title}}：</h6>
          <el-form-item :label="`${stage[index].name}：`" class="width360">
            <el-input v-model="item.auditorName"  disabled></el-input>
          </el-form-item>
          <el-form-item label="处理时间：" class="width360">
            <el-date-picker
              v-model="item.dealTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="`${stage[index].remark}：`" class="">
            <el-input v-model="item.remark" name="remark" disabled type="textarea"
                      :rows="4" maxlength="100" style="width: 80%" resize="none"></el-input>
          </el-form-item>
        </div>

        <!--总编室主任意见-->
        <div class="tabwrapper1" v-if="dataList.length<6&&!vueStatus">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;{{stage[dataList.length].title}}：</h6>
          <el-form-item prop="auditorName" :label="`${stage[dataList.length].name}：`" class="width360" :rules="[{ required: true, message: `请输入${stage[dataList.length].name}`, trigger: 'change' },{ max: 20, message: `${stage[dataList.length].name}长度小于20`, trigger: 'change'}]">
            <el-input v-model="step1Form.auditorName" name="auditorName" :disabled="vueStatus" ></el-input>
          </el-form-item>
          <el-form-item prop="dealTime" label="处理时间：" class="width360" :rules="[{ required: true, message: `请选择处理时间`, trigger: 'change' }]">
            <el-date-picker
              v-model="step1Form.dealTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="remark" :label="`${stage[dataList.length].remark}：`" class="" :rules="[{ required: true, message: `请输入${stage[dataList.length].remark}`, trigger: 'change' },{ max: 100, message: `${stage[dataList.length].remark}长度小于100`, trigger: 'change'}]">
            <el-input v-model="step1Form.remark" name="remark" :disabled="vueStatus" type="textarea"
                      :rows="4" maxlength="100" style="width: 80%" resize="none"></el-input>
          </el-form-item>
        </div>


        <div class="tabwrapper2" v-if="dataList.length<6&&!vueStatus">
          <el-form-item align="center" style="margin-right: 140px">
            <el-button type="primary" @click="dataSubmit">保存</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import "@/styles/commonRe.css";
  import Cookies from "js-cookie";
  export default {
    name: 'HelloWorld',
    props:['step1Data'],
    data() {

      return {
        step1Form: {
          auditorName:'',
        },
        dataList:[],
        vueStatus: false,
        stage:[
          {title:'发行部意见',stage:'7-4-2-1',name:'发行部主任',remark:'发行部建议印数/定价'},
          {title:'出版部意见',stage:'7-4-2-2',name:'出版部部主任',remark:'出版部建议成本预算/建议定价'},
          {title:'责编意见',stage:'7-4-2-3',name:'责编编辑',remark:'责编建议印数/内容/定价'},
          {title:'财务意见',stage:'7-4-2-4',name:'财务',remark:'财务使用情况(合作图书必填)'},
          {title:'总编室主任意见',stage:'7-4-2-5',name:'总编室主任',remark:'是否质检/样书'},
          {title:'社领导意见',stage:'7-4-2-6',name:'社领导',remark:'社领导意见'},
        ],
      }
    },
    created() {
      if (this.$route.fullPath.indexOf('lookId') >= 0) {
        this.vueStatus = true;
      }
      this.dataList=this.step1Data||[];
      this.step1Form.auditorName = Cookies.get('username')||'';
      this.step1Form.auditor = Cookies.get('userId');
      this.getTime();
    },

    watch: {
      step1Data(n,o){
        this.dataList=n;
      },
    },
    methods: {
      getTime(){
        var myDate = new Date();
        this.step1Form.dealTime = myDate.getFullYear()+'-'+(myDate.getMonth()<9?'0'+(myDate.getMonth()+1):(myDate.getMonth()+1))+'-'+(myDate.getDate()<10?'0'+myDate.getDate():myDate.getDate());
      },

      dataSubmit(){
        this.$refs['step1Form'].validate((valid) => {
          if(valid){
            this.getTime();
            this.step1Form.bookType = '3';
            this.step1Form.fatherStage = '7-4';
            this.step1Form.id = this.$route.query.lookId||this.$route.query.examineId;
            this.step1Form.stage = this.stage[this.dataList.length].stage;

            this.$emit('examineFn',this.step1Form);

          }
        })

      },
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .newBookView {
    .el-form-item.width360 {
      width: 45%;
      display: inline-block;
    }

    .formbox1 {
      width: 100%;

      .tabwrapper1 {
        padding-top: 40px;

        .steps {
          width: 100%;
          display: flex;
          justify-content: center;

          ul {
            display: flex;
            position: relative;
            z-index: 0;
            background: #fff;
            width: 400px;
            justify-content: space-between;

            li {
              width: 70px;
              height: 70px;
              line-height: 70px;
              text-align: center;
              font-size: 13px;
              color: #008000;
              border: 1px solid #008000;
              border-radius: 50%;
              background: #fff;
              z-index: 11;
              cursor: pointer;
            }
          }

          ul:after {
            content: " ";
            border-top: 1px solid #ccc;
            width: 100%;
            position: absolute;
            top: 35px;
            left: 0;
            z-index: 0;
          }
        }
      }
    }

    .author .el-form-item__content {
      position: relative;

      .list {
        background: #fff;
        width: 100%;
        position: absolute;
        top: 43px;
        left: 0;
        z-index: 111;
        border: 1px solid #E4E7ED;
        border-radius: 4px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 5px 0;

        ul {
          color: #606266;
          height: auto;
          line-height: 34px;
          margin: 6px 0;
          /*display: block;*/

          li {
            padding: 0 20px;
            display: block;
            cursor: pointer;
          }

          li:hover {
            background: #f5f7fa;
            padding: 0 20px;
          }
        }
      }

      .popper__arrow {
        position: absolute;
        top: 37px;
        z-index: 222;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: transparent transparent #EBEEF5;
      }

      .popper__arrow::after {
        content: '';
        position: absolute;
        top: -5px;
        left: -6px;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: transparent transparent #fff;
      }
    }
  }
</style>
