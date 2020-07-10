<!-- 电子书设置 -->
<template>
  <div class="setting-wrap">
    <span class="close-cat" @click="closePanel"><i class="el-icon-close "></i></span>
    <h3 class="tip">设置</h3>
    <div class="opt-list">
      <el-form ref="sizeForm" :model="sizeForm" label-width="80px" size="mini">
        <el-form-item label="阅读主题:" prop="topic">
          <el-radio-group v-model="sizeForm.topic" size="medium" class="topic">
            <el-radio :label="item.color" v-for="(item,index) in topicEnum" :key="index">
              <span :class="`topic-item ${item.class}`"><i class="el-icon-check"></i></span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="正文字体:" prop="fontFamily">
          <el-radio-group v-model="sizeForm.fontFamily" size="medium" class="fontFamily">
            <el-radio :label="item.family" v-for="(item,index) in fontFamilyEnum" :key="index">
              <span :class="`fontFamily-item ${item.class}`">{{ item.label }}</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="字体大小:" prop="fontSize">
          <el-radio-group v-model="sizeForm.fontSize" size="small" class="fontSize" fill="#C8D7DF">
            <el-radio-button :label="item.label" v-for="(item,index) in fontSizeEnum" :key="index">
              <span :class="`fontSize-item`">{{ item.label }}</span>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行间距:" prop="lineHeight">
          <el-radio-group v-model="sizeForm.lineHeight" size="small" class="lineHeight" fill="#C8D7DF">
            <el-radio-button label="minus">
              <span :class="`fontSize-item`"><i class="lineHeight-icon"></i><i class="el-icon-minus"></i></span>
            </el-radio-button>
            <el-radio-button :label="36">
              <span :class="`fontSize-item`">36</span>
            </el-radio-button>
            <el-radio-button label="plus">
              <span :class="`fontSize-item`"><i class="lineHeight-icon"></i><i class="el-icon-plus"></i></span>
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" @click="submitForm('sizeForm')">保存</el-button>
          <el-button @click="resetForm('sizeForm')">重置</el-button>
          <el-button @click="closePanel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script >
  export default {
    data() {
      return {
        // 阅读主题
        topicEnum: [{
          class: 'color1',
          color: 'E8E9E4',
        },{
          class: 'color2',
          color: 'CEE4D1',
        },{
          class: 'color3',
          color: 'DAF2F5',
        },{
          class: 'color4',
          color: 'E8EBED',
        },{
          class: 'color5',
          color: 'D1CDCE',
        },{
          class: 'color6',
          color: 'EED0D1',
        },{
          class: 'color7',
          color: '606262',
        }],

        currentFontSize: '',
        currentLineHeight: '',

        // 正文字体
        fontFamilyEnum: [{
          class: 'songti',
          // family: 'SimSun',
          family: 'songti',
          label: '宋体'
        },{
          class: 'yahei',
          // family: 'MicrosoftYaHei',
          family: 'yahei',
          label: '雅黑'
        },{
          class: 'kaiti',
          // family: 'KaiTi',
          family: 'kaiti',
          label: '楷体'
        }],
        // 字体大小
        fontSizeEnum: [{
          label: 'A-',
        },{
          label: '14',
        },{
          label: 'A+',
        }],

        sizeForm: {
          topic: '',
          fontFamily: '',
          fontSize: '',
          lineHeight: '',
        }
      }
    },
    mounted() {
      // this.resetForm('sizeForm')
    },
    methods: {
      closePanel() {
        // this.resetForm('sizeForm')
        this.$emit('settingCallback', {close: true})
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = this.sizeForm
            let { fontSize, lineHeight } = data
            switch (fontSize) {
              case 'A-':
                !this.currentFontSize && (this.currentFontSize = 14)
                this.currentFontSize -= 1
                break;
              case 'A+':
                !this.currentFontSize && (this.currentFontSize = 14)
                this.currentFontSize += 1
                break;
              case '14':
                this.currentFontSize = 14
                break;
              default:
                this.currentFontSize = ''
                break;
            }
            
            switch (lineHeight) {
              case 'minus':
                !this.currentLineHeight && (this.currentLineHeight = 36)
                this.currentLineHeight -= 1
                break;
              case 'plus':
                !this.currentLineHeight && (this.currentLineHeight = 36)
                this.currentLineHeight += 1
                break;
              case 36:
                this.currentLineHeight = 36
                break;
              default:
                this.currentLineHeight = ''
                break;
            }

            data['fontSize'] = this.currentFontSize
            data['lineHeight'] = this.currentLineHeight

            this.$emit('settingCallback', {close: true, data})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    created() {
      
    },
  }
</script>
<style lang="less">
  .setting-wrap{
    padding: 30px;
    height: 100%;
    .close-cat{
      width: 100%;
      display: block;
      font-size: 20px;
      i:hover{ opacity: 0.5; }
    }
    .tip{
      width: 100%;
      text-align: center;
      font-size:20px;
      margin-bottom: 20px;
      font-family:MicrosoftYaHei-Bold;
      font-weight:bold;
      color: #46515A;
    }
    //阅读主题
    .topic{
      margin-top: -18px;
      display: flex;
      align-items: center;
      .topic-item{
        width: 30px;
        height: 30px;
        line-height: 30px;
        border-radius: 50%;
        display: block;
        text-align: center;
        i{
          color: #C0272F;
          font-size: 15px;
          display: none;
        }
      }
      .topic-item.color1{ background-color: #E8E9E4; }
      .topic-item.color2{ background-color: #CEE4D1; }
      .topic-item.color3{ background-color: #DAF2F5; }
      .topic-item.color4{ background-color: #E8EBED; }
      .topic-item.color5{ background-color: #D1CDCE; }
      .topic-item.color6{ background-color: #EED0D1; }
      .topic-item.color7{ background-color: #606262; }

      .el-radio.is-checked .topic-item{ i{display:inline-block} }
      .el-radio .el-radio__input{ display: none; }
    }

    // 正文字体
    .fontFamily{
      .fontFamily-item{
        width: 55px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border:1px solid #C8D7DF;
        border-radius:3px;
        font-size: 12px;
        display: inline-block;
      }
      .fontFamily-item.songti{ color: #46515A; font-family:SimSun; }
      .fontFamily-item.yahei{ color: #CC2931; font-family:MicrosoftYaHei; }
      .fontFamily-item.kaiti{ color: #46515A; font-family:KaiTi; }
      
      .el-radio{ margin-right: 0; }
      .el-radio.is-checked .fontFamily-item{ background-color: #C8D7DF; }
      .el-radio .el-radio__input{ display: none; }
    }

    // 行间距
    .lineHeight{
      .lineHeight-icon{
        width: 18px;
        height: 12px;
        display: inline-block;
        background: url('~@/assets/ebook/line-height.png') center center no-repeat;
        background-size: 100% 100%;
        vertical-align: bottom;
        margin-right: 5px;
      }
      
    }
  }
</style>

