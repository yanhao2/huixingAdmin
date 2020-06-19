<template>
    <el-input v-model="listVideoQuery.orgLogo" @change="orgLogoChange"></el-input>
    <el-col :span="10" class="mt10">
        <el-upload class="upload-demo" :file-list="fileList2" :action="domain" :before-upload="beforeAvatarUpload" :data="form"
                   :on-remove="handleRemoveQrgLogo" :on-success="handleAvatarSuccess" list-type="picture" :limit="1" multiple>
            <el-button size="small" type="primary" @click="upPicName='orgLogo'">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </el-col>


</template>

<script>
    export default {
        name: 'edit',
        data() {
            return {
                upPicName:'', //上传图片名字
                fileList1:[],
                form: {}, //上传到七牛的token
                bucketQuery:{
                    bucket: 'website-image' //这是我用来获取token传给后台的字段
                },
                domain: 'http://upload.qiniu.com', // 七牛云的上传地址
                qiniuaddr: 'pd6rnk9ck.bkt.clouddn.com' // 这是七牛云空间的外链默认域名
            }
        },
        methods: {
            // 上传图片规格
            beforeAvatarUpload (file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
                const isLt2M = file.size / 1024 / 1024 < 5
                if (!isJPG) {
                    return this.$message.error('上传文件只能是 JPG或PNG 格式!')
                }
                if (!isLt2M) {
                    return this.$message.error('上传图片大小不能超过 5MB!')
                }
                return upQiniu(this.bucketQuery).then(res => {
                    this.form = {
                        token:res.data
                    }
                })
            },
            //图片改变及上传
            bannerPicChange(value) {
                this.fileList1 = []
                this.fileList1.push({
                    name: value,
                    url: value
                })
            },
            handleBannerPicRemove(file, fileList) {
                this.fileList1 = []
                this.listVideoQuery.orgLogo= ''
            },
            handleAvatarSuccess(response) {
                if(this.upPicName =='orgLogo'){
                    this.fileList1 = []
                    this.fileList1.push({
                        name: 'http://' + this.qiniuaddr + '/' + response.key,
                        url: 'http://' + this.qiniuaddr + '/' + response.key
                    })
                    this.listVideoQuery.orgLogo= 'http://' + this.qiniuaddr + '/' + response.key
                }
                this.$message({
                    type: 'success',
                    message: '上传成功!',
                    duration: 2000
                })
            },
        }
    }
</script>

<style scoped>

</style>
