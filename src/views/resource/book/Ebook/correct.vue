<!-- 纠错 -->
<template>
  <div class="ebook-correct">
    <el-form :model="correctForm" :rules="rules" ref="correctForm">
      <el-form-item label="" prop="content" class="correctForm-item">
        <el-input
          type="textarea"
          v-model="correctForm.content"
          :autosize="{ minRows: 6, maxRows: 6}"
          placeholder="请在此处填写纠错内容..."></el-input>
      </el-form-item>
      <el-form-item style="text-align:right">
        <el-button type="primary" @click="onSubmit('correctForm')" size="mini">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        correctForm: {
          content: ''
        },
        rules: {
          content: [
            { required: true, message: '请填写纠错内容', trigger: 'blur' },
            { validator: this.validatorContent }
          ]
        },
      }
    },
    methods: {
      validatorContent(rule, value, callback) {
        if (!value) {
          return callback(new Error('请填写纠错内容'));
        }
        if (value.length >300) {
          return callback(new Error('纠错内容不得超过300个字符'));
        }
        callback();
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = this.correctForm
            this.resetForm('correctForm')
            this.$emit('closeCorrect', {close: true, data})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  }
</script>
<style lang="scss">
  .el-dialog__body{
    padding: 10px 15px;
  }
  .ebook-correct{
    .el-form-item{
      margin-bottom: 0;
    }
  }
</style>