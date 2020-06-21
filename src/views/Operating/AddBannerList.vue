<template>
    <div class="AddCoursClassification">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px">{{id ? '新增下级' : '新建轮播'}}</div>
            </div>
            <div>
                <Button icon="ios-arrow-back" @click="onBack">返回</Button>
            </div>
        </div>
        <div class="content AddCoursList">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        {{id ? '新增下级' : '新建轮播'}}
                    </p>
                    <div class="addForm">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="300">
                            <FormItem label="轮播名称" prop="carouselName">
                                <Input v-model="formValidate.carouselName" style="width: 200px" placeholder="请输入轮播名称"></Input>
                                <div>
                                    广告名称只是作为辨别多个广告条目之用，并不显示在广告中
                                </div>
                            </FormItem>
                            <FormItem label="轮播类型" prop="carouselType">
                                <Select v-model="formValidate.carouselType" style="width:200px" placeholder="全部">
                                    <Option value="1">活动</Option>
                                    <Option value="2">公告</Option>
                                    <Option value="3">直播预告</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="状态" prop="carouselStatus">
                                <RadioGroup v-model="formValidate.carouselStatus">
                                    <Radio label="0">开启</Radio>
                                    <Radio label="1">禁用</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="轮播图片">
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
                                    <img v-if="formValidate.carouselImage" :src="formValidate.carouselImage" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    <Input v-model="formValidate.carouselImage" clearable placeholder="" style="display: none"></Input>
                                </el-upload>
                            </FormItem>
                            <FormItem label="轮播排序" prop="carouselSort">
                                <Input v-model="formValidate.carouselSort" style="width: 200px" placeholder="请输入轮播排序"></Input>
                            </FormItem>
                            <FormItem label="轮播备注">
                                <Input v-model="formValidate.carouselIntro" type="textarea" :rows="4" style="width: 300px" placeholder="请输入轮播备注"></Input>
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
        name: "AddBannerList",
        components: {Editor},
        data() {
            return {
                loading: true,
                domain: 'http://upload.qiniu.com', // 七牛云的上传地址
                QiniuData: {
                    key: "", //图片名字处理
                    token: "" //七牛云token
                },
                formValidate: {
                    carouselImage: '',
                    carouselIntro: '',
                    carouselName: '',
                    carouselSort: '',
                    carouselStatus: '',
                    carouselType: '',
                    carouselImageKey: '',
                },
                ruleValidate: {
                    carouselName: [
                        { required: true, message: '轮播名称不能为空', trigger: 'blur' }
                    ],
                    carouselType: [
                        { required: true, message: '轮播类型不能为空', trigger: 'change' }
                    ],
                    carouselStatus: [
                        { required: true, message: '状态不能为空', trigger: 'change' }
                    ],
                    carouselSort: [
                        { required: true, message: '轮播排序不能为空', trigger: 'blur' }
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
            updateData(e = ''){
                this.formValidate.remark = e;
                console.info(e);
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        formData.append('carouselImage', this.formValidate.carouselImage);
                        formData.append('carouselIntro', this.formValidate.carouselIntro);
                        formData.append('carouselName', this.formValidate.carouselName);
                        formData.append('carouselSort', this.formValidate.carouselSort);
                        formData.append('carouselStatus', this.formValidate.carouselStatus);
                        formData.append('carouselType', this.formValidate.carouselType);
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
                    let data = await api.EditBannerList(form)
                    if (data.code === 200) {
                        this.$Message.success('编辑轮播成功');
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
                    let data = await api.AddBannerList(form)
                    if (data.code === 200) {
                        this.$Message.success('添加轮播成功');
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
                        this.formValidate.viewImage = data.data
                        this.formValidate.carouselImage = form.key
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
                        let data = await api.BannerListDetils({id: this.id})
                        if (data.code === 200) {
                            let formData = data.data
                            this.formValidate.viewImage = formData.viewImage
                            this.formValidate.carouselIntro = formData.carouselIntro
                            this.formValidate.carouselName = formData.carouselName
                            this.formValidate.carouselSort = formData.carouselSort + ''
                            this.formValidate.carouselStatus = formData.carouselStatus + ''
                            this.formValidate.carouselType = formData.carouselType + ''
                            this.formValidate.carouselImage = formData.carouselImage
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
        }
    }
</style>

