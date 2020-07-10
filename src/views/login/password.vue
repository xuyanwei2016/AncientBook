<template>
    <div>
        <navbar></navbar>
        <div class="password">
            <p>修改密码</p>
            <div class="content">
                <el-form inline label-position="right" label-width="82px" class="el_form" :model="resourceForm">
                    <el-form-item label="旧密码:">
                        <el-input v-model="resourceForm.oldPassword"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码:">
                        <el-input v-model="resourceForm.newPassword1"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码:">
                        <el-input v-model="resourceForm.newPassword2"></el-input>
                    </el-form-item>
                </el-form>

                <div class="bottom">
                    <el-button @click="dataSubmit">保存</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Navbar } from '../../views/layout/components'
import { editPasswordAPI } from '@/api/login.js'
import md5 from 'blueimp-md5'

export default {
    components: { Navbar },
    data() {
        return {
            resourceForm: {},
            submitForm: {}
        }
    },
    mounted() {
        
    },
    methods: {
        // 保存
        dataSubmit() {
            this.submitForm = JSON.parse(JSON.stringify(this.resourceForm));
            this.submitForm.oldPassword = (md5(this.submitForm.oldPassword)).toUpperCase()
            this.submitForm.newPassword1 = (md5(this.submitForm.newPassword1)).toUpperCase()
            this.submitForm.newPassword2 = (md5(this.submitForm.newPassword2)).toUpperCase()
            if(this.submitForm.newPassword1 !== this.submitForm.newPassword2) {
                this.$message.error('新密码与确认密码不符')
            } else {
                editPasswordAPI(this.submitForm).then(res => {
                    if(res.data.code === 1) {
                        this.$message.error('旧密码错误，请重新输入!')
                    } else if(res.data.code === 0) {
                        this.$message.success('修改密码成功')
                        this.$router.push({path: '/dashboard/home'})
                    } 
                })
            }
            
        },
        
        // 取消
        cancel() {
            this.$router.push({path: '/dashboard/home'})
        }
    },
}
</script>

<style scoped>
    .password {
        padding-top: 70px;
        margin: 0 auto;
        background-color: #fff;
        height: 935px;
    }
    p {
         height: 30px;
        line-height: 10px;
        padding-left: 310px;
        border-bottom: 1px solid #ddd;
    }
    .content {
        width: 800px;
        border: 1px solid #ddd;
        margin-left: 310px;
        padding: 10px 0px;
    }
    .el_form {
        width: 300px;
        margin: 0 auto;
    }
    .bottom {
        text-align: center;
    }
</style>
