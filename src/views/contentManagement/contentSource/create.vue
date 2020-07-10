<template>
    <el-main>
        
            <el-tabs type="border-card" v-model="activeName">
                <el-tab-pane label="基本信息" name="first">
                    <div class="tabwrapper">
                        <el-form ref="resourceForm" :model="resourceForm" label-position="right" :rules="rules" label-width="150px">
                            <el-form-item label="来源名称:" prop="sourceName">
                                <el-col :span="11">
                                    <el-input v-model="resourceForm.sourceName" @change="ifExsit"></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="链接地址:" prop="website">
                                <el-col :span="11">
                                    <el-input v-model="resourceForm.website"></el-input>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="来源介绍:" prop="introduce">
                                <el-input type="textarea" v-model="resourceForm.introduce"  style="width:502px;"></el-input>
                            </el-form-item>
                            <el-form-item label="状态:" prop="status">
                                <el-radio v-model="resourceForm.status" :label="0">启用</el-radio>
                                <el-radio v-model="resourceForm.status" :label="1">禁用</el-radio>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
                <div class="btncenter">
                    <el-button @click="dataSubmit" type="primary">保存</el-button>
                    <el-button class="deback" @click="$router.go(-1)">取消</el-button>
                </div>
            </el-tabs>
            

        
    </el-main>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { addAPI , detailsAPI ,updateAPI, isExsitAPI } from '@/api/contentManagement/contentSource'



export default {
    components: {Tinymce},
    data() {
        const validateName = (rule, value , callback) => {
            let reg=/^.{0,30}$/;
            if( value.replace(/\s+/g,"") == '' ){
                callback(new Error('请填写来源名称'));
            } else if (!reg.test(value)){
                callback(new Error('来源名称长度必须小于30位'))
            }else {
                callback()
            }
        }
       
        return {
            resourceForm: {
                sourceName: '',
                website: '',
                introduce: '',
                status: 0,
                sort: 2
            },
            activeName:'first',
            rules: {
                sourceName:[{ required: true,validator:validateName }],
                website: [{ required: true, message: '请输入链接地址' },{pattern:/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/,message:'请输入正确的网址'}],
                introduce:[{ required: false,max:30, message: '来源介绍长度必须小于30位' }]
            }
        }
    },
    mounted () {
        this.isEdit()
    },
    methods: {
        isEdit() {
            this.$route.meta.title = "添加来源"
            const id = this.$route.query.id; //修改id
            if(id) { //修改
                this.$route.meta.title = "修改来源";
                this.pageDetails(id)
            }
        },


        pageDetails(id) {
            detailsAPI(id).then(res => {
                // console.log(res);
                this.resourceForm = res.data.data
            })
        },
        // 保存
        dataSubmit() {
            this.$refs['resourceForm'].validate((valid) => {
                if(valid) {
                    const id = this.$route.query.id; //修改id
                    if(id) { // 修改
                        this.resourceForm.id = id;
                        updateAPI(this.resourceForm).then(res => {
                            if(res.data.code === 0) {
                                this.$message.success("编辑成功")
                                this.$router.push({path: 'contentSource/index'})
                                this.$router.go(-1)
                            } else {
                                this.$message.error("编辑失败")
                            }
                        })
                    } else {
                        addAPI(this.resourceForm).then(res => {
                            if(res.data.code === 0) {
                                this.$message.success("添加成功")
                                this.$router.push({path: 'contentSource/index'})
                                this.$router.go(-1);
                            } else {
                                this.$message.error("添加失败")
                            }
                        })
                    }
                    
                }
            })
        },
        ifExsit(){
            if(this.resourceForm.sourceName){
                 const id = this.$route.query.id; //修改id
                 let oid=''
                 if(id){
                     let oid=id
                 }
                 const sourceNames={
                     oid:oid,
                     sourceName:this.resourceForm.sourceName
                 }
                 isExsitAPI(sourceNames).then( res=> {
                     if(res.data.data){
                         this.$message.error('该来源名称已存在')
                         
                     }else{
                         return
                     }
                 })
            }
        }
    },
}
</script>

<style scoped>
    .el-main {
        background-color: #fff;
        margin-bottom: 50px ;
        padding: 40px;
        background: #eef0f3;
    }
    .deback{
        background: white;
        color: #999;
        border: 1px solid #ccc;
    }
    .deback:hover{
        background: #546478;
        color: white;
        border: 1px solid #546478;
    }
    textarea{
        height: 230px;
    }
    .btncenter{
        text-align: center;
        margin: 40px auto;
    }
</style>
