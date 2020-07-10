<template>
    <el-main>
        <el-tabs type="border-card" v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
                <div class="tabwrapper">
                    <el-form label-position="right" ref="resourceForm" :rules="rules" label-width="150px" :model="resourceForm">
                        <el-form-item label="上级栏目:" prop="upperName" v-if="uppername">
                            <el-col :span="11">
                                <el-input v-model="resourceForm.upperName" :disabled="uppername"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="上级栏目:" prop="upperName" v-else>
                            <el-col :span="11">
                                <el-input v-model="resourceForm.upperName" :disabled="uppername" placeholder="顶级栏目"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="导航栏目:" prop="navigationBar">
                            <el-radio v-model="resourceForm.navigationBar" :label="0">启用</el-radio>
                            <el-radio v-model="resourceForm.navigationBar" :label="1">禁用</el-radio>
                        </el-form-item>
                        <el-form-item label="栏目标识名:" prop="identifierName">
                            <el-col :span="11">
                                <el-input v-model="resourceForm.identifierName" @input="changeIdentifierName" @blur="getIdentifierName"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="栏目显示名:" prop="displayName">
                            <el-col :span="11">
                                <el-input v-model="resourceForm.displayName" @blur="getcheckName"></el-input>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="栏目图片:" prop="imgs">
                            <el-col :span="11">
                                <el-input v-model="resourceForm.imgs" disabled placeholder="支持png，jpg，gif格式，建议尺寸200*150"></el-input>
                            </el-col>
                            <el-col :span="13" style="padding-left:15px;">
                                <el-upload  :action="`${domain}/zuul${requestPath.file}${uploadPath}`" :show-file-list="false" :before-upload="beforeUpload" :on-success="handleSuccess" :on-preview="handlePreview">

                                    <el-button :disabled="uploading" type="primary">上传图片</el-button>
                                    <img v-if="resourceForm.imgs" :src="`${domain}${requestPath.file}?fileName=${resourceForm.imgs}&isOnLine=true`" :alt="`${resourceForm.title}`">
                                </el-upload>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="同级栏目排序号:" prop="sort">
                            <el-col :span="11">
                                <el-input v-model.number="resourceForm.sort"></el-input>
                            </el-col>
                            <el-col :span="10" class='recomment' style='width:48.6%;'>当前最大排序号为{{maxSort}}，修改排序号会将当前内容插入到对应排序位置</el-col>
                        </el-form-item>
                        <el-form-item label="栏目介绍:" prop="introduce">
                            <el-input type="textarea" :rows="4" v-model="resourceForm.introduce" style="width:657px;"></el-input>
                            <!-- <tinymce v-model="resourceForm.introduce" style="width:720px;"></tinymce> -->
                        </el-form-item>
                        <el-form-item label="META关键词:" prop="keyWord">
                            <el-col :span="11">
                                <el-input v-model="resourceForm.keyWord"></el-input>
                            </el-col>
                            <el-col :span="10" class='recomment' style='width:48.6%;'>针对搜索引擎设置的关键词，多个关键词使用英文“，”逗号隔开。</el-col>
                        </el-form-item>
                        <el-form-item label="META描述:" prop="metaDescribe">
                            <el-col :span="11">
                                <el-input v-model="resourceForm.metaDescribe"></el-input>
                            </el-col>
                            <el-col :span="10" class='recomment' style='width:48.6%;'>针对搜索引擎设置的网页描述，多个描述使用英文“,”逗号隔开</el-col>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
             <div class="btncenter">
            <el-button @click="dataSubmit" type="primary">保存</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
        </div>
        </el-tabs>   
        

       
    </el-main>
</template>

<script>
import { requestPath, uploadPath } from '@/utils/global.js'
import Tinymce from "@/components/Tinymce";
import { addAPI , detailsAPI , updateAPI , maxSortAPI, ifCheckNameAPI,identifierNameAPI} from '@/api/contentManagement/contentColumn'



export default {
    components: { Tinymce },
    data() {
        return {
            domain: process.env.BASE_API,
            requestPath: requestPath,
            uploadPath: uploadPath,
            dialogImgUrl: '',
            uploading: false,
            uppername: false,
            dialogVisible: false,
            resourceForm: {
                upperId: null,
                upperName: '顶级栏目',
                navigationBar: 0,
                identifierName: '',
                displayName: '',
                imgs: '',
                introduce: '',
            },
            activeName:'first',
            rules: {
                metaDescribe:[{ required: false, trigger: "blur",max:200, message: 'META关键词长度必须小于200位' }],
                keyWord:[{ required: false, trigger: "blur",max:200, message: 'META描述长度必须小于200位' }],
                introduce: [{ required: false, trigger: "change",max:200, message: '栏目介绍长度必须小于200位' }],
                upperName: [{ required: false}],
                navigationBar: [{ required: true}],
                identifierName: [{ required: true, message: "请输入栏目标识名", trigger: "blur" },{max:10, message: '栏目标识名长度必须小于10位' }],
                displayName: [{ required: true,message:'请输入栏目显示名', trigger:'blur' },{max:10, message: '栏目显示名长度必须小于10位' }],
                sort: [{ required: true,message:'请输入排序号'},{type:'number', message: '排序号只能为正整数' }]
            },
            maxSort: null
        }
    },
    mounted () {
        this.isEdit()
        this.getMaxSort()
    },
    methods: {
        isEdit() {
            this.$route.meta.title = "添加内容栏目";
            if(this.$route.query.upperId != 0) {
                this.uppername = true;
                this.resourceForm.upperName = this.$route.query.upperName
            }
            const id = this.$route.query.id; //修改id
            if(id) {
                this.$route.meta.title = "修改内容栏目";
                this.pageDetails(id)
            }
        },

        // 修改的详情页
        pageDetails(id) {
            detailsAPI(id).then(res => {
                this.resourceForm = res.data.data;
            })
        },

        // 保存
        dataSubmit() {
            this.$refs['resourceForm'].validate((valid) => {
                if(valid) {
                    const id = this.$route.query.id; //修改id
                    if(id) { //修改
                        this.resourceForm.id = id;
                        updateAPI(this.resourceForm).then(res => {
                            if(res.data.code === 0) {
                                this.$message.success("编辑成功")
                                this.$router.push({path: 'contentColumn/index'})
                                this.$router.go(-1)
                            } else {
                                this.$message.error("编辑失败")
                            }
                        })
                    } else {
                        this.resourceForm.upperId = this.$route.query.upperId
                        addAPI(this.resourceForm).then(res => {
                            if(res.data.code === 0) {
                                this.$message.success("添加成功")
                                this.$router.push({path: 'contentColumn/index'})
                                this.$router.go(-1);
                            } else {
                                this.$message.error("添加失败")
                            }
                        })
                    }
                }else{
                    this.$message.warning('栏目信息有未通过的验证')
                }
            })
        },

        // 获取最大排序号
        getMaxSort() {
            return maxSortAPI({upperId: this.$route.query.upperId}).then(res => {
                if(res.data.code==0){
                    this.maxSort=res.data.data
                }
            })
        },

        

        // 上传栏目图片
        beforeUpload(file) {
            this.uploading = true
        },
        handleSuccess(response, file, fileList) {
            this.resourceForm.imgs = response
            this.uploading = false
        },
        handlePreview(file) {
            this.resourceForm.imgs = file.url
            this.dialogVisible = true
        },
        //显示名称是否已经存在
        getcheckName(){
            if(this.resourceForm.displayName){
                 const id = this.$route.query.id;
                 let oid=''
                 if(id){
                    oid=id
                 }
                 let getDatas={
                     oid:oid,
                     displayName:this.resourceForm.displayName
                 }
                ifCheckNameAPI(getDatas).then( res => {
                    if(res.data.data){
                        this.$message.error('该栏目显示名称已存在')
                        
                    }else{
                        return
                    }
                })
            }
        },
        changeIdentifierName(){
            this.resourceForm.displayName=this.resourceForm.identifierName
        },
        //标识名称是否存在
        getIdentifierName(){
            
            if(this.resourceForm.identifierName){
                 const id = this.$route.query.id;
                 let oid=''
                 if(id){
                    oid=id
                 }
                 let getDatas={
                     oid:oid,
                     identifierName	:this.resourceForm.identifierName
                 }
                identifierNameAPI(getDatas).then( res => {
                    if(res.data.data){
                        this.$message.error('该栏目标识名称已存在')
                        
                    }else{
                        return
                    }
                })
            }
        },
       
    }
}
</script>

<style scoped>
    .el-main {
        background-color: #fff;
        margin-bottom: 50px ;
        padding: 40px;
        background: #eef0f3;
    }
    .title {
        border-left: 2px solid #03bcd9;
        padding-left: 10px;
        margin-bottom: 20px;
    }
    img {
        width: 100px !important;
        height: 40px !important;
        vertical-align: middle;
    }
    .el-col-11 {
        width: 45.83333%;
    }
    .el-col-13 {
        width: 54.16667%;
    }
    .el-col-10 {
        margin-left: 5px;
    }
    .deback{
        background:white;
        color: #03bcd9;
        border:1px solid #03bcd9;
        border-radius: 2px;
    }
    .deback:hover{
        background: #546478;
        color: white;
        border:1px solid #546478;
    }
    .recomment{
        color:#A1ABBC !important;
    }
    .btncenter{
        text-align: center;
        margin: 40px auto;
    }
</style>
