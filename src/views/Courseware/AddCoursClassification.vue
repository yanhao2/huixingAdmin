<template>
    <div class="AddCoursClassification">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div>{{firstId ? '新增下级' : '添加分类'}}</div>
            </div>
            <div>
                <Button icon="ios-arrow-back" @click="onBack">返回</Button>
            </div>
        </div>
        <div class="content">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        添加分类
                    </p>
                    <div class="addForm">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" style="width: 20%;margin: 0 auto;">
                            <FormItem label="分类名称" prop="classifyName">
                                <Input v-model="formValidate.classifyName" placeholder="请输入分类名称"></Input>
                            </FormItem>
                            <FormItem label="上级分类">
                                <Select v-model="formValidate.parentId" :disabled="firstId ? true : false" placeholder="请选择上级分类">
                                    <Option :value="item.id" v-for="(item, i) in ParentList" :key="i">{{item.classifyName}}</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="排序">
                                <Input v-model="formValidate.classifySort" placeholder="请输入排序"></Input>
                            </FormItem>

                            <FormItem label="分类图标" prop="classifyImage">
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
                                    <div slot="tip" class="el-upload__tip">图标尺寸为18*18比例，大小不能超过2MB，图片只能为jpg、png、gif格式</div>
                                    <img v-if="formValidate.classifyImage" :src="formValidate.classifyImage" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <Input v-model="formValidate.classifyImage" clearable placeholder="" style="display: none"></Input>
                                </el-upload>
                            </FormItem>
                            <FormItem label="状态" prop="classifyStatus">
                                <RadioGroup v-model="formValidate.classifyStatus">
                                    <Radio label="0">下架</Radio>
                                    <Radio label="1">上架</Radio>
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
    export default {
        name: "AddCoursClassification",
        data() {
            return {
                ParentList: [],
                uploadToken:"",
                uploadKey:"",
                domain: 'http://upload.qiniu.com', // 七牛云的上传地址
                qiniuaddr: 'pd6rnk9ck.bkt.clouddn.com', // 这是七牛云空间的外链默认域名
                form: {},
                QiniuData: {
                    key: "", //图片名字处理
                    token: "" //七牛云token
                },
                formValidate: {
                    classifyName: '', // 分类名称
                    classifyImage: '', //分类图标
                    classifySort: '', // 排序
                    classifyStatus: '', //状态 0:下架，1:上架
                    parentId: '', // 上级分类
                    classifyImageKey: ''
                },
                ruleValidate: {
                    classifyName: [
                        { required: true, message: '分类名称不能为空', trigger: 'blur' }
                    ],
                    classifyImage: [
                        { required: true, message: '分类图标不能为空', trigger: 'blur' }
                    ],
                    classifyStatus: [
                        { required: true, message: '状态不能为空', trigger: 'change' }
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
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let form = {
                            classifyImage: this.formValidate.classifyImageKey,
                            classifyName: this.formValidate.classifyName,
                            classifySort: this.formValidate.classifySort,
                            classifyStatus: this.formValidate.classifyStatus,
                            parentId: this.formValidate.parentId,
                        }
                        this.LoadDataAdd(form)
                    } else {
                        this.$Message.error('请按要求填写');
                    }
                })
            },
            async LoadDataAdd(form) {
                try {
                    let data = await api.ClassificationAdd(form)
                    if (data.code === 200) {
                        this.$Message.success('添加分类成功');
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
                        this.formValidate.classifyImage = data.data
                        this.formValidate.classifyImageKey = form.key
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
            async LoadData() {
                try {
                    let data = await api.ClassificationParentId()
                    if (data.code === 200) {
                        this.ParentList = data.data
                        if (this.firstId) {
                            this.formValidate.parentId = Number(this.firstId)
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
            this.LoadData()
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
    }
</style>
