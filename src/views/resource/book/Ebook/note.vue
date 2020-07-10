<!-- 电子书笔记 -->
<template>
  <div class="note-wrap">
    <span class="close-note" @click="close"><i class="el-icon-close "></i></span>
    <h3 class="tip">笔记</h3>
    <div class="note-content">{{ content }}</div>
  </div>
</template>
<script >
  export default {
    props: ['content'],
    methods: {
      close() {
        this.$emit('closeNote', {close: true})
      },
    }
  }
</script>
<style lang="scss">
  .note-wrap{
    padding: 30px;
    height: 100%;
    .close-note{
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
    .note-content{
      height: 90%;
      overflow-y: auto;
    }
  }
</style>