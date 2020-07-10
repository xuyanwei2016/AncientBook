<template>
  <div class="app-container">
    <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px">
      <el-form-item label="广告描述：" prop="signValue">
        <el-col :span="12">
          <el-input type="input" placeholder="请输入内容" v-model="temp.signValue" clearable></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="时间限制：" prop="endTime">
        <el-date-picker v-model="temp.endTime" width="100%" clearable type="date" placeholder="年/月/日" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
        <el-checkbox id="checkbox" style="margin-left:15px;" v-model="checked" :disabled="temp.endTime ===null">启用</el-checkbox>
      </el-form-item>
      <el-form-item label="链接地址：" prop="linkType">
        <el-radio-group v-model="temp.linkType">
          <el-radio :label="0">外部链接</el-radio>
          <el-radio :label="1" disabled>内链到内容</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="url">
        <el-col :span="12">
          <el-input placeholder="请输入内容" v-model="temp.url" clearable></el-input>
        </el-col>
        <el-col :span="12" style="color:gray; padding-left:15px;">默认以 http://，如果使用https://开头请手动输入</el-col>
      </el-form-item>
      <el-form-item label="排序号：" prop="sort">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="temp.sort" clearable></el-input>
        </el-col>
        <el-col :span="18" style="color:gray; padding-left:15px;">当前最大排序号为{{maxSort}}，修改排序号会将当前内容插入到对应排序位置</el-col>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="temp.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="链接图片：" prop="picture">
        <el-col :span="12">
          <el-input v-model="temp.picture" disabled></el-input>
        </el-col>
        <el-col :span="12" style="padding-left:15px;">
          <el-upload :action="`${domain}/zuul${requestPath.file}${uploadPath}`" :show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess">
            <el-button :loading="uploading">上传图片</el-button>
          </el-upload>
        </el-col>
      </el-form-item>
      <el-form-item label="" prop="picture">
        <div style="color:gray;">
          当前广告位模式为<span v-if="type==1">通栏广告</span><span v-else-if="type==2">区域广告</span><span v-else-if="type==3">飘窗广告</span>，建议图片尺寸 300*200，只支持 jpg,jpeg,png,gif格式图片
        </div>
        <img v-if="temp.picture" style="max-width:300px;max-height:200px;" :src="`${domain}${requestPath.file}?fileName=${temp.picture}&isOnLine=true`" :alt="`${temp.picture}`">
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!infoId" :loading="sending" @click="createData">保存</el-button>
      <el-button v-else :loading="sending" @click="updateData">保存</el-button>
      <el-button @click="$router.back()">取消</el-button>
    </div>
  </div>
</template>

<script>
import { requestPath, uploadPath } from '@/utils/global.js'
import { addAd, updateAd, getOnead, getAdSignAPI } from '@/api/website-management/adPos'
import {errorMsg} from '@/utils/publicFunctions'
// import { getMaxSort } from '@/filters/getIds'

export default {
  data() {
    const validateUrl = (rule, value, callback) => {
      let urlreg = /^(http(s)?:\/\/)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/;
      if ( !urlreg.test(value) ){
        callback(new Error('请输入真实合法的url，以http://或https://开始'));
      } else {
        callback()
      }
    };
    const validateSort = (rule, value, callback) => {
      let reg = /^([1-9]\d{0,8}|0)$/;
      if ( !reg.test(value) ){
        callback(new Error('请输入0-999999999之间的整数'));
      } else {
        callback()
      }
    };
    return {
      domain: process.env.BASE_API,
      requestPath: requestPath,
      uploadPath: uploadPath,
      infoId:null,
      total: null,
      type: null,
      checked: false,
      fileList:[],
      maxSort: 0,
      temp: {
        adsignId : 0,
        endTime: null,
        signValue: '',
        linkType: 0,
        status: 1,
        url: 'http://',
        picture: '',
        sort: undefined
      },
      rules: {
        signValue: [{ type: 'string', required: true, trigger: 'change', message: '标题必填' }],
        linkType: [{ required: true, message: '链接类型必选', trigger: 'blur' }],
        url: [{ required: true, trigger: 'change', validator: validateUrl }],
        sort: [{ required: true, validator: validateSort }],
        status: [{ required: true, message: '状态必选', trigger: 'blur' }],
        // picture: [{ type: 'string', required: true, trigger: 'change', message: '未添加连接图片！' }]
      },
      sending: false,
      uploading: false
    }
  },
  mounted() {
    this.getOnedata()
    this.getAdSign()
  },
  methods: {
    getAdSign () {
      getAdSignAPI(this.$route.query.adsignid).then(res => {
        res.data.status ? this.type = res.data.data.type : errorMsg.apply(this, [ res.data, `获取广告位详情` ])
      })
    },
    getOnedata(){
      this.infoId = this.$route.query.id
      if(this.infoId){
        getOnead(this.infoId).then(res=>{
          res.data.status ? this.temp = res.data.data : errorMsg.apply(this, [ res.data, `获取广告详情` ])
          res.data.data.endTime!=null?this.checked=true:this.checked=false
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
      }else{
        this.resetTemp()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      }
    },
    beforeUpload(file){
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt3M = file.size / 1024 / 1024 < 3;
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!');
        return isJPG
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!');
        return isLt3M
      }
      this.uploading = true
    },
    handleSuccess(response, file, fileList){
      this.temp.picture = response
      this.uploading = false
    },
    resetTemp() {
      this.temp = {
        adsignId : this.$route.query.adsignid,
        endTime: null,
        signValue: '',
        linkType: 0,
        status: 1,
        url: 'http://',
        picture: null,
        sort: this.maxSort
      };
      this.checked = false;
      this.fileList = [];
    },
    createData() {
      this.temp.adsignId = this.$route.query.adsignid
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.sending = true
          if (this.temp.endTime) {
            !this.checked ? this.temp.endTime = null : this.temp.endTime
          }
          addAd(this.temp).then(res => {
            this.sending = false
            if (res.data.status) {
              this.$message.success('广告创建成功')
              this.$router.back()
            } else {
              errorMsg.apply(this, [ res.data, `广告创建` ])
            }
          })
        }
      })
    },
    updateData() {
      this.temp.adsignId = this.$route.query.adsignid
      this.temp.id = this.$route.query.id
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.sending = true

          if (this.temp.endTime) {
            !this.checked ? this.temp.endTime = null : this.temp.endTime
          }
          const tempData = Object.assign({}, this.temp)
          updateAd(tempData).then(res => {
            this.sending = false
            if (res.data.status) {
              this.$message.success('广告更新成功')
              this.$router.back()
            } else {
              errorMsg.apply(this, [ res.data, `广告更新` ])
            }
          })
        }
      })
    }
  }
}
</script>
