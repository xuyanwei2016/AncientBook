<template>
    <div class="contain">
        <div class="file">
            <img tyle="width:100%;height:100%;" v-if="imageUrl&&this.fileType=='.gif'||this.fileType=='.jpg'||this.fileType=='.png'" :src="imageUrl" class="avatar">
            <iframe  v-else-if="this.fileType=='.xls'||this.fileType=='.xlsx'" src='https://view.officeapps.live.com/op/view.aspx?src=http://storage.xuetangx.com/public_assets/xuetangx/PDF/1.xls' width='100%' height='100%' frameborder='1'></iframe>
            <embed v-else-if="this.fileType=='.pdf'" :src="imageUrl" height="100%" width="100%" type="application/pdf">
            <img v-else-if="this.fileType=='.zip'"  src="../../../assets/img/u1362.png"  height="184px" width="178px">
            <iframe v-else-if="this.fileType=='.doc'||this.fileType=='.docx'" src="http://www.xdocin.com/xdoc?_func=to&_format=html&_cache=1&_xdoc=http://www.xdocin.com/demo/demo.docx" width='100%' height='100%' frameborder='1'></iframe>

        </div>
        <div class="intro">
            <h3>基本信息</h3>
            <div>
                <span class="name">资源名称：</span>
                <span class="con">读书人嗨起来</span>
            </div>
            <div>
                <span class="name">文件格式：</span>
                <span class="con">PNG</span>
            </div>
            <div>
                <span class="name">文件大小：</span>
                <span class="con">20M</span>
            </div>
            <div>
                <span class="name">文件类型：</span>
                <span class="con">矢量图</span>
            </div>
            <div>
                <span class="name">上传时间：</span>
                <span class="con">2018-09-09 12:00:00</span>
            </div>
            <div>
                <span class="name">上传人：</span>
                <span class="con">吴唯一</span>
            </div>
            <div>
                <span class="name">最后修改时间：</span>
                <span class="con">2018-09-08</span>
            </div>
        </div>
    </div>
</template>
<script>
import { uploadUrl, uploadPath, requestPath } from "@/utils/global.js";
export default {
    name:'annexPicture',
    data() {
        return {
            domain: process.env.BASE_API,
            requestPath: requestPath,
            uploadPath: uploadPath,
            imageUrl:'',
            fileType:''
        }
    },
    mounted (){
        this.imageUrl = `${this.domain}${this.requestPath.file}?fileName=${this.$route.query.fileName}&isOnLine=true`;
        this.fileType=this.$route.query.fileType;
        console.log(this.fileType,"ppp")
    }
}
</script>

<style scoped>
    .contain{
        display: flex;
        height: 100vh;
    }
    .file{
        flex: 2;
        margin: 40px auto;
        text-align: center;
        border-right:1px solid #ccc;
    }
    .intro{
        flex: 1;
        padding: 20px;
    }
    .intro div{
        margin-bottom: 20px;
        color: #333;
        font-size: 14px;
    }
    .intro span{
        display: inline-block;
    }
    .intro .name{
        width: 120px;
        text-align: right;
    }
</style>
