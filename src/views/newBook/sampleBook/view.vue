<template>
  <!--样书管理信息-->
  <div class="addImgResource newBookView">
    <div class="formbox">
      <el-form
        :model="imgForm"
        ref="ruleForm"
        :rules="rules"
        label-width="140px"
        class="demo-ruleForm"
      >
        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;基本信息</h6>
          <el-form-item label="图书名称:" prop="bookName" class="width360">
            <el-input v-model="imgForm.bookName" disabled></el-input>
          </el-form-item>
          <el-form-item label="副标题:" class="width360">
            <el-input v-model="imgForm.subBookName" disabled></el-input>
          </el-form-item>
          <el-form-item label="丛书名称:" class="width360">
            <el-input v-model="imgForm.seriesName" disabled></el-input>
            <!--<el-select v-model="imgForm.series" placeholder="请选择" :disabled="vueStatus">
              <el-option label="请选择" :value="null"></el-option>
              <el-option
                v-for="(item,ind) in peopleList"
                :key="ind"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>-->
          </el-form-item>
          <el-form-item label="ISBN:" prop="isbn" class="width360">
            <el-input v-model="imgForm.isbn" disabled></el-input>
          </el-form-item>
          <el-form-item label="译者:"  class="width360">
            <el-input v-model="imgForm.translator" disabled></el-input>
          </el-form-item>
          <el-form-item label="语种:" prop="language" class="width360">
            <el-input v-model="imgForm.language" disabled></el-input>
          </el-form-item>
          <el-form-item label="出版单位:" prop="publishingUnit" class="width360">
            <el-input v-model="imgForm.publishingUnit" disabled></el-input>
          </el-form-item>
          <el-form-item label="主编:" class="width360">
            <el-input v-model="imgForm.chiefEditor" disabled></el-input>
          </el-form-item>
          <el-form-item label="出版时间:" prop="subheading" class="width360">
            <el-input v-model="imgForm.publishingTime" disabled></el-input>
            <!--<el-date-picker
              v-model="imgForm.value1"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd" disabled>
            </el-date-picker>-->
          </el-form-item>
          <el-form-item label="责任编辑:" class="width360">
            <el-input v-model="imgForm.editor" disabled></el-input>
          </el-form-item>
          <el-form-item label="作者:" prop="author" class="width360">
            <el-input v-model="imgForm.author" disabled></el-input>
          </el-form-item>
         <!-- <el-form-item label="策划编辑:" class="width360">
            <el-input v-model="imgForm.author" :disabled="vueStatus"></el-input>
          </el-form-item>-->
          <el-form-item label="版次:" prop="editionTimes" class="width360">
            <el-input v-model="imgForm.editionTimes" disabled></el-input>
          </el-form-item>
          <el-form-item label="印次:" prop="printTimes" class="width360">
            <el-input v-model="imgForm.printTimes" disabled></el-input>
          </el-form-item>
          <el-form-item label="印张:" prop="stamp" class="width360">
            <el-input v-model="imgForm.stamp" disabled></el-input>
          </el-form-item>
          <el-form-item label="定价:" prop="price" class="width360">
            <el-input v-model="imgForm.price" disabled></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;印制信息</h6>
          <el-form-item label="印厂:" class="width360">
            <el-input v-model="imgForm.printingHouse" disabled></el-input>
          </el-form-item>
          <el-form-item label="时间：" class="width360">
            <el-date-picker
              v-model="imgForm.times"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input v-model="imgForm.remark" disabled type="textarea" :rows="4" maxlength="100" style="width:80%" resize="none"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper1 tabwrapperTable">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;样书信息</h6>
          <el-form-item label="样书总数量:" class="width360" prop="styleBookCount">
            <el-input v-model="imgForm.styleBookCount" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="收到样书时间：" class="width360">
            <el-date-picker
              v-model="imgForm.receivedTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd" :disabled="vueStatus">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="样书申领统计:"  style="width: 100%;" class="tableCss content">
            <template>
              <el-table
                :key="tableKey"
                stripe
                :data="listData"
                v-loading="listLoading"
                element-loading-text="给我一点时间"
                border
                highlight-current-row
                ref="multipleTable"
                style="width: 90%;margin-left: 0"
                class="iconCss"
              >

                <el-table-column label="申领人" align="center">
                  <template slot-scope="scope"  >
                    <span v-if="scope.$index!=listData.length-1||vueStatus">{{scope.row.applicant }}</span>
                    <input type="text" v-model="dataFrom.applicant"  v-if="scope.$index==listData.length-1&&!vueStatus" class="applicantCss" maxlength="20">
                  </template>

                </el-table-column>
                <el-table-column label="申领样书数量" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.$index!=listData.length-1||vueStatus">{{scope.row.applicantCount}}</span>
                    <input type="text" v-model="dataFrom.applicantCount"  v-if="scope.$index==listData.length-1&&!vueStatus"  class="applicantCss" maxlength="9">
                  </template>
                </el-table-column>
                <el-table-column label="领取时间" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.$index!=listData.length-1||vueStatus">{{scope.row.applicantTime }}</span>
                    <!--<input type="text"  v-model="dataFrom.applicantTime" v-if="scope.$index==listData.length-1"  class="applicantCss">-->
                    <div v-if="scope.$index==listData.length-1&&!vueStatus">
                      <el-date-picker
                        v-model="dataFrom.applicantTime"
                        type="datetime"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 90%">
                      </el-date-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                  <template slot-scope="scope">
                    <span v-if="scope.$index!=listData.length-1||vueStatus">{{scope.row.remark }}</span>
                    <input type="text"  v-model="dataFrom.remark" v-if="scope.$index==listData.length-1&&!vueStatus"  class="applicantCss"  maxlength="100">
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" v-if="!vueStatus" width="120px">
                  <template slot-scope="scope">
                    <span v-if="scope.$index!=listData.length-1" @click="deleteApplicant(scope.row.id)" style="cursor: pointer">删除</span>
                    <span v-if="scope.$index==listData.length-1" @click="saveApplicant" style="cursor: pointer">添加</span>
                    <span v-if="scope.$index==listData.length-1" @click="emptyFn" style="cursor: pointer">删除</span>
                  </template>
                </el-table-column>
              </el-table>

            </template>
          </el-form-item>
          <el-form-item align="center" class="buttonS" v-if="!vueStatus">
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
  import {getDetailAPI,saveApplicantAPI,deleteApplicantAPI,getApplicantAPI,updateAPI} from '@/api/newBook/sampleBook.js';
  export default {
    data() {
      return {
        vueStatus:false,
        imgForm:{},
        peopleList: [
          {name: '待完善', code: 0},
          {name: '待分配', code: 0},
          {name: '待一审', code: 0},
          {name: '待二审', code: 0},
          {name: '待三审', code: 0},
          {name: '审核未通过', code: 0},
          {name: '审核通过', code: 0},
        ],
        listData:[],
        listLoading:false,
        tableKey:0,
        rules: {
          styleBookCount: [{pattern: /^([1-9]\d{0,8}|0)$/, message: '样书总数量输入长度小于9的数字', trigger: 'change'},],/* */
          /*subheading: [{required: true, message: '请输入副题', trigger: 'change'},],*/
        },
        dataFrom:{},
      }
    },
    components: {},
    created(){
      if (this.$route.fullPath.indexOf('editId') >= 0) {
        this.$route.meta.title = '编辑样书信息';
      }else if (this.$route.fullPath.indexOf('lookId') >= 0) {
        this.$route.meta.title = '查看样书信息';
        this.vueStatus = true;
      }
      this.getDetail();
    },
    methods: {
      getDetail(){

        getDetailAPI(this.$route.query.lookId||this.$route.query.editId).then(res=>{
          if(res.data.status){
            this.imgForm=res.data.data;
            if(this.imgForm.publishingTime){
              this.imgForm.publishingTime=this.imgForm.publishingTime.slice(0,10);
            }
            this.getApplicant();
            this.dataFrom.styleBookId=this.imgForm.id;
          }
        })
      },
      getApplicant(){
        this.listLoading=true;
        getApplicantAPI(this.$route.query.lookId||this.$route.query.editId).then(res=>{
          if(res.data.status){
            this.listData=res.data.data;
            if(!this.vueStatus){
              let item={
                applicant:'',
                applicantCount:'',
                applicantTime:'',
                remark:'',
              };
              this.listData.push(item);
            }
            this.listLoading=false;
          }
        })
      },
      /*保存申领记录*/
      saveApplicant() {
        if(!this.dataFrom.applicant||this.dataFrom.applicant.trim()==''){
          this.$message.warning('请填写申领人');
          return
        }
        let rex=/^\d{0,9}$/;
        if(!this.dataFrom.applicantCount||this.dataFrom.applicantCount.trim()==''){
          this.$message.warning('请填写申领样书数量');
          return
        }else{
          if(!rex.test(this.dataFrom.applicantCount)){
            this.$message.warning('申领样书数量输入长度小于9的数字');
            return
          }
        }
        saveApplicantAPI(this.dataFrom).then(res => {
          if (res.data.status) {
            this.$message.success('添加成功');
            this.getApplicant();
            this.emptyFn();
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      /*删除申领记录*/
      deleteApplicant(id){
        deleteApplicantAPI(id).then(res=>{
          if(res.data.status){
            this.$message.success('删除成功');
            this.getApplicant();
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },
      /*清空*/
      emptyFn(){
        this.dataFrom.applicant='';
        this.dataFrom.applicantCount='';
        this.dataFrom.applicantTime='';
        this.dataFrom.remark='';
      },
      /*确认入库*/
      dataSubmit(){
        updateAPI({
          id: this.$route.query.lookId||this.$route.query.editId,
          receivedTime:this.imgForm.receivedTime,
          styleBookCount:this.imgForm.styleBookCount,
        }).then(res=>{
          if(res.data.status){
            this.$message.success('修改成功');
            this.$router.push('/newBook/sampleBook');
          }else{
            this.$message.error(res.data.msg);
          }
        })
      },
    }
  }
</script>

<style lang="less" scoped>
  .newBookView{
    .el-form-item.width360{
      width: 45%;
      display: inline-block;
    }
    .formbox{
      padding-left: 20px;
      background: #FFF;
      border: 1px solid #DCDFE6;
      -webkit-box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
      .tabwrapper1{padding-top: 40px;
        .steps{
          width: 100%;
          display: flex;
          justify-content: center;
          ul{
            display: flex;
            position: relative;
            z-index: 0;
            background: #fff;
            width: 400px;
            justify-content: space-between;
            li{
              width: 70px;
              height: 70px;
              line-height: 70px;
              text-align: center;
              font-size: 13px;
              color: #666666;
              border:1px solid #999999;
              border-radius: 50%;
              background: #fff;
              z-index: 11;
              cursor: pointer;
            }
            .active{
              color: #008000;
              border:1px solid #008000;
            }
          }
          ul:after{
            content: " ";
            border-top: 1px solid #ccc;
            width: 100%;
            position: absolute;
            top: 35px;
            left:0;
            z-index: 0;
          }
        }
        .content{
          display: flex;
          flex-direction: column;
          .el-form-item__content{margin-left: 0px!important;}
        }
      }
    }
    .author .el-form-item__content{
      position: relative;
      .list{
        background: #fff;
        width: 100%;
        position: absolute;
        top: 43px;
        left:0;
        z-index: 111;
        border: 1px solid #E4E7ED;
        border-radius: 4px;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 5px 0;
        ul{
          color: #606266;
          height:auto;
          line-height: 34px;
          margin: 6px 0;
          /*display: block;*/
          li{
            padding: 0 20px;
            display: block;
            cursor: pointer;
          }
          li:hover{
            background: #f5f7fa;
            padding: 0 20px;
          }
        }
      }
      .popper__arrow{
        position: absolute;
        top: 37px;
        z-index: 222;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: transparent transparent #EBEEF5;
      }
      .popper__arrow::after{
        content:'';
        position: absolute;
        top: -5px;
        left:-6px;
        width: 0;
        height: 0;
        border: 6px solid;
        border-color: transparent transparent #fff;
      }
    }
    .applicantCss{
      width: 90%;
      border: 1px solid #E4E7ED;
      height: 36px;
      line-height: 36px;
      border-radius: 3px;
      padding-left: 5px;
    }
  }
  .liBox{
    margin-top: 15px;
  }
  .infoImg{
    display: inline-block;
    height: 30px;
    width: 30px;
    border-radius: 50px;
  }

  .olist{
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    span{
      display: inline-block;
      height: 30px;
      line-height: 30px;
      color: #555;
      font-size: 16px;
      vertical-align: top;
      margin-left: 5px;
    }
  }
  .desc{
    margin-top: 8px
  }
</style>
