<template>
  <!--确认入库信息-->
  <div class="addImgResource contractView xywCss">
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
          <el-form-item label="图书名称:" prop="bookName"  class="width360">
            <el-input v-model="imgForm.bookName" disabled></el-input>
          </el-form-item>
          <el-form-item label="副标题:" class="width360" prop="subBookName">
            <el-input v-model="imgForm.subBookName" disabled></el-input>
          </el-form-item>
          <el-form-item label="丛书名称:" class="width360 time100">
            <el-input v-model="imgForm.seriesName" disabled>
              <!--<el-option label="请选择" :value="null"></el-option>
              <el-option
                v-for="(item,ind) in peopleList"
                :key="ind"
                :label="item.name"
                :value="item.code"
              ></el-option>-->
            </el-input>
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
          <el-form-item label="出版时间:" prop="publishingTime" class="width360">
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
          <!--<el-form-item label="策划编辑:">
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
            <el-input v-model="imgForm.remark" disabled type="textarea" :rows="4" maxlength="100" style="width:89%" resize="none"></el-input>
          </el-form-item>
        </div>

        <div class="tabwrapper1">
        <h6>&nbsp;&nbsp;|&nbsp;&nbsp;入库信息</h6>
        <el-form-item label="样书数量:" prop="styleBookCount" class="width360">
          <el-input v-model="imgForm.styleBookCount" :disabled="vueStatus"></el-input>
        </el-form-item>
        <el-form-item label="图书数量:" prop="bookCount" class="width360">
          <el-input v-model="imgForm.bookCount" :disabled="vueStatus"></el-input>
        </el-form-item>
        <el-form-item label="入库时间：" prop="storageTime" class="width360">
          <el-date-picker
            v-model="imgForm.storageTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd" :disabled="vueStatus">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="imgForm.storageRemark" :disabled="vueStatus" type="textarea" :rows="4" maxlength="100" style="width:89%" resize="none"></el-input>
        </el-form-item>
      </div>
        <!--其他说明-->
        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;其他说明</h6>
          <el-form-item label="入库数量:" prop="inventoryQuantity" class="width360">
            <el-input v-model="imgForm.inventoryQuantity" :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="库存数量:" prop="stockQuantity" class="width360">
            <el-input v-model="imgForm.stockQuantity" :disabled="vueStatus"></el-input>
          </el-form-item>

          <el-form-item label="库房备注:">
            <el-input v-model="imgForm.storeroomRemark" :disabled="vueStatus" type="textarea" :rows="4" maxlength="100" style="width:89%" resize="none"></el-input>
          </el-form-item>
          <el-form-item align="center" class="buttonS" v-if="!vueStatus">
            <el-button type="primary" @click="dataSubmit">确认入库</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import "@/styles/commonRe.css";
  import {getDetailAPI,updateAPI} from '@/api/newBook/storageRoom.js';
    export default {
      name: "storageRoomView",
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
              rules: {
                styleBookCount: [{required: true, message: '请输入样书数量', trigger: 'change'},{pattern: /^([1-9]\d{0,20}|0)$/, message: '样书数量输入长度小于20的数字', trigger: 'change'}],
                bookCount: [{required: true, message: '请输入图书数量', trigger: 'change'},{max: 20, message: '图书数量长度小于20', trigger: 'change'}],
                storageTime: [{required: true, message: '请输入入库时间', trigger: 'change'}],
                inventoryQuantity: [{required: true, message: '请输入入库数量', trigger: 'change'},{max:20, message: '入库数量长度小于20', trigger: 'change'}],
                stockQuantity: [{required: true, message: '请输入库存数量', trigger: 'change'},{max: 20, message: '库存数量长度小于20', trigger: 'change'}],
                storageRemark: [{max: 100, message: '备注长度小于100', trigger: 'change'}],
                storeroomRemark: [{max: 100, message: '库房备注长度小于100', trigger: 'change'}],
              },
            }
        },
        components: {},
      created(){
        if (this.$route.fullPath.indexOf('editId') >= 0) {
          this.$route.meta.title = '确认图书入库信息';
          this.vueStatus = false;
        } else if (this.$route.fullPath.indexOf('lookId' )>= 0) {
          this.$route.meta.title = '查看入库信息';
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
                this.$refs['ruleForm'].resetFields();
              }
            })
          },
          /*确认入库*/
          dataSubmit(){
            this.$refs['ruleForm'].validate((valid) => {
              if(valid){
                updateAPI(
                  {
                    bookCount:this.imgForm.bookCount,
                    id:this.imgForm.id,
                    inventoryQuantity:this.imgForm.inventoryQuantity,
                    storageRemark: this.imgForm.storageRemark,
                    storageTime: this.imgForm.storageTime,
                    storeroomRemark: this.imgForm.storeroomRemark,
                    styleBookCount:this.imgForm.styleBookCount,
                    stockQuantity:this.imgForm.stockQuantity}
                ).then(res=>{
                  if(res.data.status){
                    this.$message.success('入库成功');
                    this.$router.push('/newBook/storageRoom');
                  }else{
                    this.$message.error(res.data.msg);
                  }
                })
              }
            })

          },
        }
    }
</script>

<style lang="less" scoped>
  .contractView {
    .el-form-item.width360 {
      width: 45%;
      display: inline-block;
    }
    .formbox {
      padding-left: 20px;
      background: #FFF;
      border: 1px solid #DCDFE6;
      -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);
      .tabwrapper1 {
        padding-top: 40px
      }
      .tabwrapper2 {
        width: 95%;
        padding-top: 40px;
        padding-bottom: 10px;
        .buttons, .tablelist {
          padding-left: 20px;
        }
        .tablelist{padding-top: 10px;}
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
    span {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      color: #555;
      font-size: 16px;
      vertical-align: top;
      margin-left: 5px;
    }
  }

  .desc {
    margin-top: 8px
  }
</style>
