<template>
    <div class="AddCoursClassification">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px">{{firstId ? '新增下级' : '添加讲师'}}</div>
            </div>
            <div>
                <Button icon="ios-arrow-back" @click="onBack">返回</Button>
            </div>
        </div>
        <div class="content AddCoursList">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        添加讲师
                    </p>
                    <div class="addForm">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="300">
                            <FormItem label="讲师账户" prop="id">
                                <Select
                                    placeholder="请输入手机号搜索讲师"
                                    style="width: 200px"
                                    v-model="formValidate.id"
                                    filterable
                                    remote
                                    :remote-method="remoteMethod"
                                    :loading="loading">
                                    <Option v-for="(option, index) in userList" :value="option.id" :key="index">{{option.phone}}</Option>
                                </Select>

                            </FormItem>
                            <FormItem label="讲师昵称" prop="nickName">
                                <Input v-model="formValidate.nickName" style="width: 200px" placeholder="请输入讲师昵称"></Input>
                            </FormItem>
                            <FormItem label="头像">
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
                                    <div slot="tip" class="el-upload__tip">
                                        尺寸为-*-比例，大小不能超过2MB，图片只能为jpg、png格式
                                    </div>
                                    <img v-if="formValidate.headImg" :src="formValidate.headImg" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <Input v-model="formValidate.headImg" clearable placeholder="" style="display: none"></Input>
                                </el-upload>
                            </FormItem>
                            <FormItem label="讲师简介">
                                <Editor :content="formValidate.remark" style="height: 300px;width: 700px"  @updateDataEvent="updateData"/>
                            </FormItem>
                            <FormItem label="状态" prop="status">
                                <RadioGroup v-model="formValidate.status">
                                    <Radio label="0">开启</Radio>
                                    <Radio label="1">禁用</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Card>
            </div>

        </div>
    </div>
</template>

<script>
    import api from "../../api/api";
    import {formatNumber }  from '../../moment/index'
    import Editor from '../../components/Editor';
    // InstructorListUser
    export default {
        name: "AddInstructorList",
        components: {Editor},
        data() {
            return {
                loading: true,
                userList: [],
                domain: 'http://upload.qiniu.com', // 七牛云的上传地址
                QiniuData: {
                    key: "", //图片名字处理
                    token: "" //七牛云token
                },
                formValidate: {
                    headImg: '',
                    id: '',
                    remark: '',
                    status: '', //状态
                    nickName: '',
                    headImgKey: '',
                },
                ruleValidate: {
                    id: [
                        { type: 'number',  required: true, message: '讲师账户不能为空', trigger: 'change' }
                    ],
                    nickName: [
                        { required: true, message: '讲师昵称不能为空', trigger: 'blur' }
                    ],
                }
            };
        },
        computed: {
            firstId () {
                return this.$route.query.firstId
            },
        },
        methods: {
            formatNumber: formatNumber,
            onBack () {
                this.$router.go(-1)
            },
            updateData(e = ''){
                this.formValidate.remark = e;
                console.info(e);
            },
            remoteMethod (query) {
                if (query !== '') {
                    this.loading = true;
                    this.LoadData(query)
                } else {
                    this.userList = [];
                }
            },
            async LoadData(phone) {
                try {
                    let formData = new FormData();
                    formData.append('phone', phone);
                    let data = await api.InstructorListUser(formData)
                    console.log(data)
                    if (data.code === 200) {
                        this.loading = false;
                        this.userList = data.data
                    } else {
                        this.$Message.error(data.msg);
                    }
                } catch (e) {
                    console.error(e)
                }
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        formData.append('headImg', this.formValidate.headImgKey);
                        formData.append('id', this.formValidate.id);
                        formData.append('nickName', this.formValidate.nickName);
                        formData.append('remark', this.formValidate.remark);
                        formData.append('status', this.formValidate.status);
                        this.LoadDataAdd(formData)
                    } else {
                        this.$Message.error('请按要求填写');
                    }
                })
            },
            async LoadDataAdd(form) {
                try {
                    let data = await api.InstructorAdd(form)
                    if (data.code === 200) {
                        this.$Message.success('添加讲师成功');
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
                        this.formValidate.headImg = data.data
                        this.formValidate.headImgKey = form.key
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

        },
        created() {
            this.LoadQiNiuToken()
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
        }
    }
</style>

