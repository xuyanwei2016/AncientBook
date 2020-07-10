<template>
  <!--合同列表查看-->
  <div class="addImgResource contractLook">
    <div class="formbox">
      <el-button icon="el-icon-back" @click="$router.go(-1)"  type="text">返回</el-button>
      <el-form
        :model="imgForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <div class="tabwrapper1">
          <el-form-item label="机构名称:" prop="subheading">
            <el-input v-model="imgForm.subheading" disabled></el-input>
          </el-form-item>
          <el-form-item label="所在省份:" prop="subheading">
            <el-input v-model="imgForm.subheading" disabled></el-input>
          </el-form-item>
          <el-form-item label="详细地址:" prop="subheading">
            <el-input v-model="imgForm.subheading" type="textarea" disabled style="width: 80%"></el-input>
          </el-form-item>
          <el-form-item label="联系人:" prop="subheading">
            <el-input v-model="imgForm.subheading" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="subheading">
            <el-input v-model="imgForm.subheading" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系邮箱:" prop="subheading">
            <el-input v-model="imgForm.subheading" disabled ></el-input>
          </el-form-item>
          <el-form-item label="简介:">
            <el-input v-model="imgForm.subheading" type="textarea" disabled style="width: 80%"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import "@/styles/commonRe.css";
  import Tinymce from "@/components/Tinymce";
  import {getMultipleSelectionIDs} from "@/filters/getIds";
    export default {
        data() {
            return {
              imgForm:{},
            }
        },
        components: {},
        methods: {}
    }
</script>

<style lang="less" scoped>
  .contractLook {
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
