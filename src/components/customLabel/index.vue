<template>
  <div class="custom">
    <div class="inlines">
      <el-select class="left"  :disabled="dialogStatus=='view'" @change="getValue" :value-key="defaultValue[indx].id" v-model="defaultValue[indx].labelMessage" multiple allow-create placeholder="请选择标签">
        <el-option
          v-for="item in arraylist"
          :key="item.labelContent"
          :label="item.labelContent"
          :value="item.id+','+item.code"
        ></el-option>
      </el-select>
    </div>
    <div class="right inlines" v-if="dialogStatus!='view'">
      <el-input class="inp" :disabled="dialogStatus=='view'" v-model="inputValue" placeholder="添加标签内容"></el-input>
      <el-button type="primary" @click="handleInputConfirm">确定</el-button>
    </div>
  </div>
</template>
<script>
import {  createContentAPI } from '@/api/business/label'
export default {
  name: "customLabel",
  props: {
    // tabDefine: {
    //   type: Array
    // },
    arraylist: {
      type: Array
    },
    defaultValue: {
      type: Array
    },
    labelValue:{
      type:Object
    },
    getLabel: {
      type: Function,
      default: null
    },
    indx:{
      type:Number
    },
    dialogStatus:{
      type:String
    }
  },
  data() {
    return {
      inputValue: "",
      index: 0,
      SaveUpdateLabelContentForm:{
        labelContent : '' ,
        labelId : '',
        parentId : 0
      }
    };
  },
  mounted(){
  },
  methods: {
    
    //确定
    handleInputConfirm() {
      // var obj = {}
      // obj.label = this.inputValue
      // obj.value = this.inputValue
      //判断已有标签是否存在
      // // var state = JSON.stringify(this.list).indexOf(JSON.stringify(obj))
      let flag=true;
      let inputValue = this.inputValue;
      this.arraylist.forEach(element => {
        if(element.labelContent==inputValue){
          this.$message.warning('列表里已存在该标签')
          flag=false
        }
      });
      if(flag){
        let obj = {};
        obj.labelContent = this.inputValue;
        if (inputValue) {
          this.SaveUpdateLabelContentForm={
            labelContent:inputValue,
            labelId:this.labelValue.id,
            parentId:0
          }
          createContentAPI(this.SaveUpdateLabelContentForm).then(res => {
            if(res.data.code === 0){
              this.$message.success('添加成功');
              if (this.getLabel) {  
                              
                this.getLabel();
              }
            }else{
              this.$message.error(`添加失败${res.data.msg}`)
            }
          })
        }else{
          this.$message.warning('请输入标签或选择已有标签')
        }
        this.inputValue = "";
      }
    },
    getValue(){
      console.log(this.defaultValue)
    }
  }
};
</script>
<style scoped>
.left {
  display: inline-block;
  width: 50%;
  /* min-height: 72px; */
  /* border: 1px solid #ddd; */
}
.inp {
  width: 150px;
}
.inlines{
  display: inline;
}

</style>


