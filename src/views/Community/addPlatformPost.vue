<template>
    <div class="AddCoursClassification">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px">{{id ? '编辑帖子' : '发布帖子'}}</div>
            </div>
            <div>
                <Button icon="ios-arrow-back" @click="onBack">返回</Button>
            </div>
        </div>
        <div class="content AddCoursList">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        {{id ? '编辑帖子' : '新建帖子'}}
                    </p>
                    <p slot="extra">
                        <span style="color: #ed4014">
                        *
                        </span>
                        为必填项
                    </p>
                    <div class="addForm">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
                            <FormItem label="帖子标题" prop="title">
                                <Input v-model="formValidate.title" style="width: 200px" placeholder="请输入帖子标题"></Input>
                            </FormItem>

                            <FormItem label="话题" prop="topicName">
                                <Input v-model="formValidate.topicName" style="width: 200px" placeholder="请输入话题"></Input>
                            </FormItem>

                            <FormItem label="帖子正文" prop="content">
                                <Input v-model="formValidate.content" type="textarea" :rows="4" style="width: 350px" placeholder="请输入帖子正文"></Input>
                            </FormItem>
                            <FormItem label="帖子图片">
                                <div style="display: flex">
                                    <div class="demo-upload-list" v-for="(item,index) in uploadList">
                                        <template>
                                            <img :src="item.url">
                                            <div class="demo-upload-list-cover">
                                                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                                                <Icon type="ios-trash-outline" @click.native="handleViewRemove(item, index)"></Icon>
                                            </div>
                                        </template>
                                    </div>
                                    <el-upload
                                        :limit="1"
                                        :action="domain"
                                        :data="QiniuData"
                                        ref="upload"
                                        class="avatar-uploader"
                                        :on-error="uploadError"
                                        :before-upload="beforeAvatarUpload"
                                        :on-success="handleAvatarSuccess"
                                        :show-file-list="false">
                                        <i class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </div>
                                <div class="el-upload__tip">
                                    尺寸为-*-比例，大小不能超过2MB，图片只能为jpg、png格式
                                </div>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formValidate')">发布</Button>
                                <Button @click="onBack()" style="margin-left: 10px;">取消</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
            </div>

        </div>
        <Modal title="查看图片" v-model="visible">
            <img :src="imgName" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    import api from "../../api/api";
    import {formatNumber }  from '../../moment/index'
    import Editor from '../../components/Editor';
    // InstructorListUser
    export default {
        name: "addPlatformPost",
        components: {Editor},
        data() {
            return {
                loading: true,
                visible: false,
                imgName: '',
                userList: [],
                uploadList: [
                ],
                domain: 'http://upload.qiniu.com', // 七牛云的上传地址
                QiniuData: {
                    key: "", //图片名字处理
                    token: "" //七牛云token
                },
                formValidate: {
                    title: '',
                    topicName: '',
                    content: '',
                    imgPath: '',
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '帖子标题不能为空', trigger: 'blur' }
                    ],
                    topicName: [
                        { required: true, message: '话题不能为空', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '帖子正文不能为空', trigger: 'blur' }
                    ],
                }
            };
        },
        computed: {
            id () {
                return this.$route.query.id
            },
        },
        methods: {
            formatNumber: formatNumber,
            onBack () {
                this.$router.go(-1)
            },
            handleView (name) {
                this.imgName = name.url;
                this.visible = true;
            },
            handleViewRemove (record, index) {
                this.uploadList.splice(index, 1);
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        let imgPath = []
                        if (this.uploadList.length > 0) {
                            this.uploadList.map((v) => {
                                imgPath.push(v.key)
                            })
                        }
                        console.log(imgPath.join(','))
                        formData.append('title', this.formValidate.title);
                        formData.append('topic.name', this.formValidate.topicName);
                        formData.append('content', this.formValidate.content);
                        formData.append('imgPath', imgPath.join(','));
                        if (this.id) {
                            formData.append('id', this.id);
                            this.LoadDataEdit(formData)
                        } else {
                            this.LoadDataAdd(formData)
                        }

                    } else {
                        this.$Message.error('请按要求填写');
                    }
                })
            },
            async LoadDataEdit(form) {
                try {
                    let data = await api.editPlatformPost(form)
                    if (data.code === 200) {
                        this.$Message.success('编辑帖子成功');
                        this.onBack()
                    } else {
                        this.$Message.error(data.msg);
                    }
                } catch (e) {
                    console.error(e)
                }
            },
            async LoadDataAdd(form) {
                try {
                    let data = await api.addPlatformPost(form)
                    if (data.code === 200) {
                        this.$Message.success('发布帖子成功');
                        this.onBack()
                    } else {
                        this.$Message.error(data.msg);
                    }
                } catch (e) {
                    console.error(e)
                }
            },
            uploadError(err, file, fileList) {
                this.$Message({
                    message: "上传出错，请重试！",
                    type: "error",
                    center: true
                });
            },
            // 上传图片规格
            beforeAvatarUpload (file) {
                const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
                const isLt2M = file.size / 1024 /1024 < 2
                if (!isJPG) {
                    this.$Message.error('上传文件只能是 JPG、PNG、gif 格式!')
                }
                if (!isLt2M) {
                    this.$Message.error('上传图片大小不能超过 2MB!')
                }
                this.QiniuData.key = `${this.formatNumber(new Date())}` + file.name
                return isJPG && isLt2M;
            },
            async LoadQiNiuToken () {
                try {
                    let result = await api.updateToken()
                    if (result.code === 200) {
                        this.QiniuData.token = result.data
                    } else {
                        this.$Message.error(result.message)
                    }
                }
                catch (e) {
                    console.log(e)
                }
            },
            // 上传图片成功
            handleAvatarSuccess(response) {
                this.LoadupdateUrl({key: response.key})
            },
            async LoadupdateUrl (form) {
                try {
                    let data = await api.updateUrl(form)
                    if (data.code === 200) {
                        let item = {
                            key: form.key,
                            url: data.data
                        }
                        this.uploadList.push(item)
                        this.$Message.success('上传成功');
                        if (this.$refs.upload) {
                            this.$refs.upload.clearFiles()
                        }
                    } else {
                        this.$Message.error(data.msg);
                    }
                } catch (e) {
                    console.error(e)
                }
            },
            async LoadData () {
                try {
                    if (this.id) {
                        let data = await api.PlatformPostItemDetails({id: this.id})
                        if (data.code === 200) {
                            let formData = data.data
                            console.log(formData)
                            this.formValidate.title = formData.title
                            this.formValidate.content = formData.content
                            this.formValidate.imgPath = formData.imgPath
                            this.formValidate.topicName = formData.topicVo.name
                        } else {
                            this.$Message.error(data.msg);
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            },
        },
        created() {
            this.LoadQiNiuToken()
            this.LoadData()
        },

        mounted() {
        },
        updated() {
        }
    }
</script>

<style lang="scss">
    .AddCoursClassification{
        padding: 10px 0;
        .HeaderComponent{
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-color: #fff;
            border-bottom: 1px solid #E9E9E9;
            padding: 5px 10px;
            .row{
                display: flex;
                align-items: center;
                .border{
                    width: 4px;
                    height: 15px;
                    background-color: #1378F6;
                    margin-right: 10px;
                }
            }
        }
        .content {
            padding: 10px;
            background-color: #fff;
            height: calc(100% - 35px);
            overflow-y: auto;

            .ivu-card {
                border-radius: 0;
                .ivu-card-head p{
                    font-size: 15px;
                    font-weight: inherit;
                }
                .addForm{
                    .avatar-uploader .el-upload {
                        border: 1px dashed #d9d9d9;
                        border-radius: 6px;
                        cursor: pointer;
                        position: relative;
                        overflow: hidden;
                    }

                    .avatar-uploader .el-upload:hover {
                        border-color: #409EFF;
                    }

                    .avatar-uploader-icon {
                        font-size: 28px;
                        color: #8c939d;
                        width: 100px;
                        height: 100px;
                        line-height: 100px;
                        text-align: center;
                    }
                    .avatar {
                        width: 100px;
                        height: 100px;
                        display: block;
                    }
                }
            }
        }
        .AddCoursList{
            .ivu-input, .ivu-select-selection{
                border-radius: 0;
            }
            .demo-upload-list{
                display: inline-block;
                width: 100px;
                height: 100px;
                text-align: center;
                border: 1px solid transparent;
                border-radius: 4px;
                overflow: hidden;
                background: #fff;
                position: relative;
                box-shadow: 0 1px 1px rgba(0,0,0,.2);
                margin-right: 4px;
            }
            .demo-upload-list img{
                width: 100%;
                height: 100%;
            }
            .demo-upload-list-cover{
                display: none;
                width: 100px;
                height: 30px;
                position: absolute;
                /*top: 0;*/
                bottom: 0;
                /*left: 0;*/
                /*right: 0;*/
                background: rgba(0,0,0,.6);
            }
            .demo-upload-list:hover .demo-upload-list-cover{
                display: block;
            }
            .demo-upload-list-cover i{
                color: #fff;
                font-size: 20px;
                cursor: pointer;
                margin: 0 2px;
            }
        }

    }
</style>


