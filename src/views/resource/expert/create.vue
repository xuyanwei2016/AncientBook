<template>
<div class="addImgResource">
    <div class="formbox">
     <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
    <el-tab-pane label="基本信息" name="first">
        <div class="tabwrapper">
            <el-form label-position="right" ref="resourceForm" :rules="rules" label-width="150px" :model="resourceForm">
                <h6 class="title">基本信息</h6>
                <el-form-item label="姓名:" prop="name">
                    <el-input v-model="resourceForm.name" :disabled="this.dialogStatus === 'view'" style="width:500px;"></el-input>
                </el-form-item>
                <el-form-item label="作者照片:" prop="faceImg">  
                    <el-upload
                        :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                        list-type="picture-card"
                        :on-preview="handlePreview"
                        :before-upload="beforeUpload"
                        :on-success="handleSuccess"
                        :disabled="this.dialogStatus === 'view'"
                        :on-remove="handleRemove"
                        :show-file-list="false"
                        accept=".png,.jpg,.jpeg,.gif"
                        
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div style="color:#ccc;display:inline-block;width:250px;margin-left:20px;line-height:16px;" slot="tip" class="el-upload__tip">建议尺寸286*390，仅支持jpg、jpeg、png、gif格式，不超过2M</div>
                    </el-upload>
                        
                </el-form-item>
                <el-form-item label="性别:" prop="sex">
                    <el-radio v-model="resourceForm.sex" :disabled="this.dialogStatus === 'view'" :label="1">男</el-radio>
                    <el-radio v-model="resourceForm.sex" :disabled="this.dialogStatus === 'view'" :label="0">女</el-radio>
                </el-form-item>
                <el-form-item label="学历:" prop="education">
                    <el-select placeholder="请选择" :disabled="this.dialogStatus === 'view'" v-model='resourceForm.education' style="width:500px;">
                        <el-option
                            v-for="item in educationList"
                            :key="item.education"
                            :label="item.education"
                            :value="item.education">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构名称:" prop="institutionName">
                    <el-input v-model="resourceForm.institutionName" :disabled="this.dialogStatus === 'view'" style="width:500px;"></el-input>
                </el-form-item>
                <el-form-item label="职称:" prop="title">
                    <el-input v-model="resourceForm.title" :disabled="this.dialogStatus === 'view'" style="width:500px;"></el-input>
                </el-form-item>
                <el-form-item label="职务:" prop="post">
                    <el-input v-model="resourceForm.post" :disabled="this.dialogStatus === 'view'" style="width:500px;"></el-input>
                </el-form-item> 
                <el-form-item  prop="diyTypeId"   label="自定义分类:" style='width:650px'>
                <treeselect
                  style='width:500px'
                  placeholder="请选择"
                  v-model="resourceForm.diyTypeId"
                  :multiple="true"
                  :flat="true"
                  :options="treeSelectOptions"
                  data-vv-scope="baseInfo"
                  :normalizer="normalizer"
                  :loadOptions='loadOptions'
                  :auto-load-root-options="false"
                  v-validate="'required'"
                  @input="selfChoose"
                  @select="selectFun"
                  @deselect="deselectFun"
                  :disabled="this.dialogStatus === 'view'"
                />
              </el-form-item>
                <el-form-item label="擅长领域:" prop="areasExpertise">
                    <el-input v-model="resourceForm.areasExpertise" :disabled="this.dialogStatus === 'view'" style="width:500px;"></el-input>
                </el-form-item>
                <el-form-item label="作者简介:" prop="description">
                    <tinymce :height="300" style="width: 700px;" ref="editor" v-model="resourceForm.description"></tinymce>
                </el-form-item>
            </el-form>

            
        </div>
    </el-tab-pane>
    <div class="btncenter">
        <el-button type="primary" @click="dataSubmit" v-if="pageStatus == 0">保存</el-button>
        <el-button @click="$router.go(-1)" class="cancel">取消</el-button>
    </div>  
    </el-tabs>
    </div>
    </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { detailsAPI, updateAPI, addAPI, getTreeAPI } from '@/api/resource/expert'
import Treeselect from '@riophae/vue-treeselect'
import imgDefault from '@/assets/img/bookDefault.png'
import "@/styles/resource.scss";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    name:"create_expert",
    components: { Tinymce, Treeselect },
    data() {
        return {
            id:'',
            educationList:[{
                education: '选项1',
                education: '大专'
                }, {
                education: '选项2',
                education: '本科'
                }, {
                education: '选项3',
                education: '博士'
                }, {
                education: '选项4',
                education: '硕士'
            }],
            education:'',
            activeName:'first',
            treeSelectValue:null,
            treeSelectOptions: [],
            imageUrl: "",
            imageUrl: imgDefault,
            domain: process.env.BASE_API,
            requestPath: requestPath,
            uploadPath: uploadPath,
            resourceForm: {
                name: "",
                education: '本科',
                institutionName: "",
                title: "",
                post: "",
                sex: 1,
                faceImg: '',
                diyTypeCode: [],
                diyTypeId: [],
                labelContentCode: [],
                labelContentId: [],
                labelId: [],
                areasExpertise: "",
                description: "",
                status: 0
            },
            rules: {
                name: [{ required: true,message:'请输入名字'},{max:10,message:'名字的长度必须小于10'}],
                institutionName: [{max:20,message:'机构名称的长度必须小于20'}],
                sex: [{ required: true,message:'请选择性别'}],
                education: [{ required: true ,message:'请选择学历'}],
                post:[{required:false,max:50,message:'职务的长度不超过50个字符'}],
                areasExpertise:[{required:false,max:100,message:'擅长领域的长度不超过100个字符'}],
                title: [{ required: true ,message:'请输入职称'},{max:100,message:'职称的长度不超过100个字符'}],
                diyTypeId:[{ required: true, message: "请填写自定义分类",trigger: "input"}],//trigger: "input"不能改
            },
            noDiy:false,
            pageStatus: 0,
            uploading: false,
            dialogStatus:''
        }
    },
    created() {
        this.dialogStatus = this.$route.query.type;
    },
    mounted() {
        this.isEdit()
        this.getTree()
    }, 
    
    methods: {
        //校验自定义分类
        selfChoose(val){
            this.$refs.resourceForm.validateField("diyTypeId")
            
        },  
        selectFun(node) {
            //this.resourceForm.diyTypeCode=[];
            if(node.code!=null||node.code!=""){
                this.resourceForm.diyTypeCode.push(node.code);
            }
            
            //this.resourceForm.diyTypeId=[];
            if(node.id!=null||node.id!=""){
                this.resourceForm.diyTypeId.push(node.id);
            }
        },
        deselectFun(node) {//监听删除
        //console.log(node,"delnode");
            for (var i = 0; i < this.resourceForm.diyTypeId.length; i++) {
                if (this.resourceForm.diyTypeId[i] == node.id) {
                    this.resourceForm.diyTypeId.splice(i, 1);
                    this.resourceForm.diyTypeCode.splice(i, 1);
                }
            }
            //console.log( this.typeform.diyTypeId," this.typeform.diyTypeId")
        },
        loadOptions({ action, parentNode, callback }){//此处可以懒加载，去掉loadOptions警告；
            callback();
        },
        normalizer(node) {
            return {
                id: node.id,
                label: node.showName,
                children: node.list,
            }
        },
        getTree(){
            getTreeAPI(16).then(res => {0
            console.log(this.treeSelectOptions,'55555')
            this.treeSelectOptions=res.data.data
            })
        },
        isEdit() {
            this.$route.meta.title =  '添加专家'
            const id = this.$route.query.id //修改id
            const detailsId = this.$route.query.detailsId //查看id
            if(id) { //修改
                this.$route.meta.title = '修改专家'
                this.pageDetails(id)
            } 
            if(detailsId) { //查看 
                this.pageStatus = 1
                this.$route.meta.title = '查看专家'
                this.pageDetails(detailsId)
            }
        },

        // 查看和修改的页面信息
        pageDetails(id) {   
            detailsAPI(id).then(res => {
                // console.log(res);
                if(res.data.code === 0) {
                    this.resourceForm = res.data.data;
                    if(this.resourceForm.faceImg){
                        this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${this.resourceForm.faceImg}&isOnLine=true`; 
                    }
                    
                    this.treeSelectValue = res.data.data.diyTypeId;   
                    if(res.data.data.diyTypeId==null||res.data.data.diyTypeId=='null'){
                        this.resourceForm.diyTypeId=[];
                        this.resourceForm.diyTypeCode=[]
                    }
                }
                //详情页面清除校验
                if(this.dialogStatus=='view'){
                    this.$refs['resourceForm'].resetFields()
                }
            })
        },
        handleClick(){},
        // 保存
        dataSubmit() {
            this.$refs['resourceForm'].validate((valid) => {
                if(valid) { //必填字段验证
                    this.noDiy = true;
                    const id = this.$route.query.id; //修改id
                    if(id) { // 修改
                        this.resourceForm.id = id
                        console.log(JSON.stringify(this.resourceForm),'444')
                        updateAPI(this.resourceForm).then(res => {
                            if(res.data.code === 0) {
                                this.$message.success('编辑成功');
                                this.$router.push({ path: '/resource/expert'});
                                this.$router.go(-1);
                            } else {
                                this.$message.error('编辑失败')
                            }
                        })
                    } else { //添加
                        addAPI(this.resourceForm).then(res => {
                            if(res.data.code === 0) {
                                this.$message.success('添加成功');
                                this.$router.push({ path: '/resource/expert'});
                                this.$router.go(-1);
                            } else if( res.data.code == -8 ){
                                this.$message.error('名称重复，请重新填写');
                            }
                        })
                    }
                } else {
                    this.$message.error('请完善信息');
                }
            })
        },

        // 上传图片
        handlePreview(file) { //图片预览
            console.log(file);
            
            this.dialogImage = file
            this.dialogPvVisible = true
        },

        handleRemove() { //图片删除
            this.resourceForm.faceImg = ""
        },


        beforeUpload(file) {
            const isJPG = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif";
            const isLt3M = file.size / 1024 / 1024 < 3;
            if(!isJPG) {
                this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
                return isJPG;
            }
            if(!isLt3M) {
                this.$message.error("上传图片大小不能超过 3MB!");
                return isLt3M;
            }
        },

        handleSuccess(res, file, fileList) {
            this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${res}&isOnLine=true`,
            this.resourceForm.faceImg = res;
        },

    }
}
</script>

<style scoped>
.addImgResource .el-form-item {
  width: 80%;
}
.addImgResource .el-form-item.width360 {
  width: 40%;
}
.addImgResource .el-form-item.width360 .el-select{
  width: 100%;
}  
.avatar {
    width: 146px;
    height: 146px;
}
</style>
