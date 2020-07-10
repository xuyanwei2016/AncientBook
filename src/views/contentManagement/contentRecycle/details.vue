<template>
    <el-main>
        <el-form ref="resourceForm" :model="resourceForm" label-position="right" :rules="rules" label-width="150px">
            <div class="title">基本信息</div>
            <el-form-item label="引题:" prop="cite">
                <el-input v-model="resourceForm.cite" :disabled="true" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item label="内容主标题:" prop="title">
                <el-input v-model="resourceForm.title" :disabled="true" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item label="副标题:" prop="subhead">
                <el-input v-model="resourceForm.subhead" :disabled="true" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item label="属性设置:" prop="property">
                <el-checkbox-group v-model="type" :disabled="true">
                    <el-checkbox label="热门" name="type"></el-checkbox>
                    <el-checkbox label="头条" name="type"></el-checkbox>
                    <el-checkbox label="推荐" name="type"></el-checkbox>
                    <el-checkbox label="置顶" name="type"></el-checkbox>
                    <el-checkbox label="可评论" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="所属栏目:" prop="columnName">
                <el-input v-model="resourceForm.columnName"  :disabled="true" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item label="作者:" prop="author">
                <el-input v-model="resourceForm.author" :disabled="true" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item label="内容来源:" prop="source">
                <el-input v-model="resourceForm.source" :disabled="true" style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item  prop="source">
                <el-input v-model="resourceForm.source" :disabled="true" style="width:500px;"></el-input>
                <el-checkbox label="新建来源" :disabled="true"></el-checkbox>
                <span class="tip">新建来源可在内容来源管理模块中维护</span>
            </el-form-item>
            <el-form-item label="发布时间:" prop="releaseTime">
                <el-date-picker v-model="resourceForm.releaseTime"  :disabled="true"type="date" placeholder="选择日期"></el-date-picker>
                <el-checkbox label="定时发布" :disabled="true"></el-checkbox>
                <span class="tip">日期格式:年-月-日 时:分:秒</span>
            </el-form-item>
            <el-form-item label="下线时间:" prop="offlineTime">
                <el-date-picker v-model="resourceForm.offlineTime"  :disabled="true" type="date" placeholder="选择日期"></el-date-picker>
                <el-checkbox label="定时下线" :disabled="true"></el-checkbox>
                <span class="tip">日期格式:年-月-日 时:分:秒</span>
            </el-form-item>
            <el-form-item label="关键词:" prop="keywords">
                <el-input v-model="resourceForm.keywords"  :disabled="true"  style="width:500px;"></el-input>
            </el-form-item>
            <el-form-item label="内容权重:" prop="weight">
                <el-input v-model="resourceForm.weight" :disabled="true" style="width:500px;"></el-input>
                <span class="tip">1~100数字越大，全文检索排名越靠前</span>
            </el-form-item>
            <el-form-item label="点击量:">
                <el-input v-model="resourceForm.clickNum" :disabled="true" style="width:165px;" ></el-input>
                <span>=</span>
                <el-input v-model="resourceForm.actualClickNum" :disabled="true" style="width:150px;" ></el-input>
                <span>+</span>
                <el-input v-model="resourceForm.fictitiousClickNum" :disabled="true" style="width:150px;"></el-input>
                <span class="tip">总点击量=实际点击量+虚拟点击量，点击量越高全文检索排名越靠前</span>
            </el-form-item>
            <el-form-item label="内容封面:" prop="cover">
                    <el-upload
                        :action="`${domain}/zuul${requestPath.file}${uploadPath}`"
                        list-type="picture-card"
                        :on-preview="handlePreview"
                        :before-upload="beforeUpload"
                        :on-success="handleSuccess"
                        :disabled="true"
                        :on-remove="handleRemove"
                        :show-file-list="false"
                    >
                        <img v-if="imgUrl" :src="imgUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span class="tip">建议尺寸600*420px或4:3，仅支持jpg、jpeg、png、png格式，不超过2M</span> 
            </el-form-item>
            <el-form-item label="正文:" prop="text">
                <tinymce v-model="resourceForm.text" style="width:720px;"></tinymce>
            </el-form-item>
            

            <div class="title">图组内容</div>
            <el-form-item prop="imgs" class="width100">
                <el-upload  :disabled="true" :action="`${domain}/zuul${requestPath.file}${uploadPath}`"  list-type="picture-card"
                        :file-list="resourceForm.picList" :on-preview="handlePicPreview" :before-upload="beforePicUpload"
                        :on-remove="handlePicRemove" :on-success="handlePicSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>


            <div class="title">视频内容</div>
            <el-form-item label="视频文件:" prop="video">
                <el-upload class="upload-demo"
                  :action="`${domain}/zuul${requestPath.file}${uploadPath}/video`"
                  :before-upload="beforeVideoUpload"
                  :on-success="handleVideoSuccess"
                  :on-preview="handleVideoPreview"
                  :on-remove="handleVideoRemove"
                  :show-file-list="false"
                   :disabled="true"
                >
                  <el-button size="small" :disabled="true" type="primary">点击上传</el-button>
                </el-upload>
                <video :src="videoUrl" v-if="resourceForm.video" controls class="video"></video>
            </el-form-item>

        </el-form>
    </el-main>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
import { addAPI , detailsAPI , updateAPI } from '@/api/contentManagement/contentManage'



export default {
    components: {Tinymce},
    data() {
        return {
            domain: process.env.BASE_API,
            requestPath: requestPath,
            uploadPath: uploadPath,
            videoUrl: '',
            imgUrl: '',
            resourceForm: {
                picList: []
            },
            rules: {
                title: [{ required: true }],
                columnName: [{ required: true }],
                source: [{ required: true }]
            },
            uploading: false,
            type: [],
            dialogVisible: false,
            dialogImageUrl: ''
        }
    },
    mounted () {
        this.isEdit()
        // this.pageDetails()
    },
    methods: {
        isEdit() {
            const detailsId = this.$route.query.detailsId; //查看id
            if(detailsId) {
                this.$route.meta.title = "查看内容回收站";
                this.pageDetails(detailsId)
            }
        },

        // 详情页
        pageDetails(id) {
            detailsAPI(id).then(res => {
                this.resourceForm = res.data.data
                this.type = res.data.data.property.split(',')
                //处理视频文件
                if(res.data.data.video){
                    this.videoUrl=`${this.domain}${this.requestPath.file}?fileName=${res.data.data.video}&isOnline=true`;
                }
            })
        },

        

        // 上传图片封面有关
        handlePreview(file) {
            this.imgUrl = file.url
        },
        
        handleRemove(file, fileList) {
            this.imgUrl = ''
        },
        beforeUpload(file) {
            const isJPG =
                file.type === "image/jpeg" ||
                file.type === "image/png" ||
                file.type === "image/gif";
            const isLt3M = file.size / 1024 / 1024 < 3;
            if (!isJPG) {
                this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
                return isJPG;
            }
            if (!isLt3M) {
                this.$message.error("上传图片大小不能超过 3MB!");
                return isLt3M;
            }
            this.uploading = true
            this.$message.warning('上传中')
        },
        handleSuccess(res, file, fileList) {
            this.$message.success('上传成功');
            this.imgUrl = `${this.domain}${this.requestPath.file}?fileName=${res}&isOnLine=true`;
            this.resourceForm.cover = res;
        },


        // 上传视频
        beforeVideoUpload(file) {
            let type = file.name.slice(file.name.lastIndexOf('.')+1).toLowerCase()
            const isVideo = type === 'mp4';
            if(!isVideo) {
                this.$message.error('上传视频只能是 mp4 格式!');
                return isVideo
            }
            this.uploading = true
            this.$message.warning('上传中')
        },
        handleVideoSuccess(res, file, fileList) {
            this.$message.success('上传成功');
            this.videoUrl = `${this.domain}${this.requestPath.file}?fileName=${res.fileName}&isOnline=true`;
            this.resourceForm.video = res.fileName;
        },
        handleVideoPreview(file) {},
        handleVideoRemove(file, fileList) {},

        // 上传图组
        handlePicPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        beforePicUpload(file) {
            const isJPEG =
                file.type === "image/jpeg" ||
                file.type === "image/png" ||
                file.type === "image/gif";
            const isLt3M = file.size / 1024 / 1024 < 3;
            if (!isJPEG) {
                this.$message.error("上传图片只能是 JPG/PNG/GIF 格式!");
                return isJPEG;
            }
            if (!isLt3M) {
                this.$message.error("上传图片大小不能超过 3MB!");
                return isLt3M;
            }
        },
        handlePicRemove(file, fileList) {},
        handlePicSuccess(res, file, fileList) {
            this.$message.success('上传成功');
        },

    },
}
</script>

<style scoped>
    .el-main {
        background-color: #fff;
        margin-bottom: 50px;
    }
    .title {
        border-left: 2px solid #03bcd9;
        padding-left: 6px;
        margin-bottom: 20px;
        margin-top: 10px;
    }
    .el-checkbox {
        margin-left: 10px;
    }
    .tip {
        margin-left: 20px;
    }
    
    .video{
        width:443px;
        height:334px;
    }
    .avatar {
        width: 146px;
        height: 146px;
    }
</style>

