<template>
  <div class="app-container">
      <el-form :model="form" ref="dataForm"  :rules="rules" label-position="right" label-width="120px" style='margin-right:30px;'>
        <el-form-item label="公告标题："  prop="title">
          <el-col :span="12">
            <el-input v-model="form.title" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="所属栏目：" prop="columnId">
          <el-col :span="12">
            <el-select placeholder="所属栏目" v-model="form.columnId" style="width:100%;">
              <el-option v-for="item in boardItem" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="置顶：" prop="topStatus">
          <el-radio-group v-model="form.topStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-col :span="12">
            <el-input v-model.number="form.sort"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="发布时间：" prop="releaserTime">
          <el-col :span="12">
            <el-date-picker v-model="form.releaserTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="来源：" prop="source">
          <el-col :span="12">
            <el-input v-model="form.source" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="发布人：" prop="releaser">
          <el-col :span="12">
            <el-input v-model="form.releaser" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="链接地址：" prop="linkType">
          <el-radio-group v-model="form.linkType">
            <el-radio label="0">默认</el-radio>
            <el-radio label="2">外部链接</el-radio>
            <el-radio label="1">内部链接</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="linkUrl" v-if="form.linkType!=0">
          <el-col :span="12">
            <el-input v-model="form.linkUrl" clearable></el-input>
          </el-col>
          <el-col :span="12" style="padding-left: 15px;">默认http://，如需https://开头请手动输入。注：如有链接，则前台默认获取链接地址，不获取公告内容！</el-col>
        </el-form-item>
        <el-form-item label="公告内容：" prop="content">
          <tinymce :height=400 ref="editor" v-model="form.content"></tinymce>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitForm" :loading="sending">确定</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </div>
  </div>
</template>

<script>
import { addAPI, editAPI, getContent, batchingDeleteAPI, updateTopAPI, getList, searchAPI, getContentList, getAllList,getSortBig} from '@/api/website-management/board'
import Tinymce from '@/components/Tinymce'
import { operationMsg, confirm, errorMsg } from '@/utils/publicFunctions'

export default {
  components:{ Tinymce },
  data() {
    return {
      infoId:null,
      boardItem: [],
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'change' }, { max: 50, message: '最多50个字符', trigger: 'change' }],
        columnId: [{ required: true, message: '请选择所属栏目', trigger: 'change' }],
        sort: [{ type: 'number', message: '排序必须为数字值', trigger: 'change' },{required: true, message: '请添加排序', trigger: 'change' }],
        releaserTime: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        source: [{ required: true, max: 50, message: '最多50个字符', trigger: 'change' }],
        releaser: [{ required: true, max: 30, message: '最多30个字符', trigger: 'change' }],
        linkUrl: {pattern: /^(http(s)?:\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/, trigger: 'change', message: '请输入真实合法的url，以http://或https://开始'}
        // content: [{ required: true, message: '请填写公告内容', trigger: 'change' }]
      },
      form:{
        columnId : null,
        status:0,
        title:'',
        content: '',
        releaser: '',
        releaserTime: null,
        source: '',
        topStatus: 0,
        sort:null,
      },
      sending:false
    }
  },

  mounted() {
    this.getBoardList()
    this.$route.query.id ? this.getList() : this.resetForm()

  },
  methods: {
    sortBig(){
      let that=this;
      getSortBig().then(res=>{
        res.data.status?this.form.sort=res.data.data:this.form.sort=null;
        console.log(res.data.status,this.form.sort)
      })
    },
    submitForm() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.sending = true
          this.form.id ? this.invokeApi(editAPI) : this.invokeApi(addAPI)
        }
      })
    },
    getBoardList(){
      getAllList().then(res => {
        res.data.code === 0 ? this.boardItem = res.data.data : this.$message.error(`获取全部栏目失败：${res.data.msg}`)
      })
    },
    invokeApi(api){
      api(this.form).then(res => {
        if(res.data.code ===0){
            this.$message.success(`操作成功`)
            this.$router.push("/websitemanage/board_manage/board_content")
        }else{
          this.$message.error(`操作失败`)
        }
        this.sending = false
      })
    },
    getList(){
      this.$route.meta.title = '修改公告'
      getContent(this.$route.query.id).then(res=>{
        res.data.status ? this.form = res.data.data : errorMsg.apply(this, [ res.data, '获取公告详情' ])

        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    resetForm(){
      this.$route.meta.title = '添加公告'
      this.form = {
        columnId : null,
        title:'',
        content: '',
        releaser: '',
        releaserTime: null,
        source: '',
        linkType: 0,
        linkUrl: 'http://',
        topStatus: 0,
        sort:null,
      };
      this.sortBig();
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

  }
}
</script>
