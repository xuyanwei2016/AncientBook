<template>
  <!--新书 图书入库-->
  <div class="addImgResource newBookView xywCss">
    <div class="formbox1">
      <el-form
        :model="step3Form"
        ref="step3Form"
        :rules="rules"
        label-width="140px"
        class="demo-ruleForm"
      >
        <!--入库信息-->
        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;入库信息：</h6>
          <el-form-item label="样书数量：" class="width360" prop="styleBookCount">
            <el-input v-model="step3Form.styleBookCount"   :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="图书数量" class="width360" prop="bookCount">
            <el-input v-model="step3Form.bookCount"   :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="入库时间：" class="width360" prop="storageTime">
            <el-date-picker
              v-model="step3Form.storageTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"  :disabled="vueStatus">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注：" prop="storageRemark">
            <el-input v-model="step3Form.storageRemark" name="storageRemark"  :disabled="vueStatus" type="textarea":rows="4" maxlength="100" style="width: 80%" resize="none"></el-input>
          </el-form-item>
        </div>
<!--其他说明-->
        <div class="tabwrapper1">
          <h6>&nbsp;&nbsp;|&nbsp;&nbsp;其他说明：</h6>
          <el-form-item label="入库数量：" class="width360" prop="inventoryQuantity">
            <el-input v-model="step3Form.inventoryQuantity"   :disabled="vueStatus"></el-input>
          </el-form-item>
          <el-form-item label="库房备注：" prop="storeroomRemark">
            <el-input v-model="step3Form.storeroomRemark" name="storeroomRemark"  :disabled="vueStatus" type="textarea":rows="4" maxlength="100" style="width: 80%" resize="none"></el-input>
          </el-form-item>
        </div>
        <div class="tabwrapper2" v-if="!vueStatus">
          <el-form-item align="center" style="margin-right: 140px">
            <el-button :loading="dataSubmitLoading" type="primary" @click="dataSubmit">保存</el-button>
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
  import {bookStorageAPI} from '@/api/newBook/printing';
    export default {
        name: 'HelloWorld',
      props:['step3Data'],
        data() {
            return {
              step3Form: {
                styleBookCount:'',
              },
              dataList:{},
              vueStatus: false,
              dataSubmitLoading: false,
              stage:[
                {title:'入库信息',name:'样书数量',remark:'备注'},
                {title:'其他说明',name:'入库数量',remark:'库房备注'},
              ],
              rules:{
                styleBookCount:[{ required: true, message: `请输入样书数量`, trigger: 'change' },{pattern: /^([1-9]\d{0,8}|0)$/, message: '样书数量输入长度小于9的数字', trigger: 'change'}],
                bookCount:[{ required: true, message: `请输入图书数量`, trigger: 'change' },{ max: 20, message: `图书数量长度小于20`, trigger: 'change'}],
                storageTime:[{ required: true, message: `请选择入库时间`, trigger: 'change' }],
                remark:[{ max: 100, message: `备注长度小于100`, trigger: 'change'}],
                storageRemark:[{ max: 100, message: `备注长度小于100`, trigger: 'change'}],
                inventoryQuantity:[{ required: true, message: `请输入入库数量`, trigger: 'change' },{ max: 20, message: `入库数量长度小于20`, trigger: 'change'}],
                storeroomRemark:[{ max: 100, message: `库房备注长度小于100`, trigger: 'change'}],
              },
            }
        },
        created() {

          this.step3Form=this.step3Data||{styleBookCount:'',};
          console.log(2233,this.step3Form)
          if(this.$route.fullPath.indexOf('lookId') >= 0){
            this.vueStatus = true;
          }
          if(this.step3Form.styleBookCount&&this.step3Form.inventoryQuantity){
            this.vueStatus = true;
          }
        },
        watch: {
          step3Data(n,o){
            this.step3Form=n||{styleBookCount:'',};
            if(this.step3Form.styleBookCount&&this.step3Form.inventoryQuantity){
              this.vueStatus = true;
            }
          },
        },
        methods: {
          dataSubmit(){
            this.$refs['step3Form'].validate((valid) => {
              if(valid){
                this.dataSubmitLoading=true;
                this.step3Form.id = this.$route.query.lookId||this.$route.query.examineId;
                bookStorageAPI(this.step3Form).then(res=>{
                  if(res.data.status){
                    this.$message.success('保存成功');
                    this.$router.push('/newBook/printing');
                  }else{
                    this.$message.error(res.data.msg);
                  }
                  this.dataSubmitLoading=false;
                })

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
