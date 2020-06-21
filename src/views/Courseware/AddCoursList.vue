<template>
    <div class="AddCoursClassification">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px">{{firstId ? '新增下级' : '添加课程'}}</div>
            </div>
            <div>
                <Button icon="ios-arrow-back" @click="onBack">返回</Button>
            </div>
        </div>
        <div class="content AddCoursList">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        添加课程
                    </p>
                    <div class="addForm">
                        <div style="display: flex;">

                            <div style="flex: 1;">
                                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="230">
                                    <div class="addFormBasic">
                                        <div class="position">
                                            <div class="name">
                                                基本信息
                                            </div>
                                            <span class="border"></span>
                                        </div>

                                    </div>

                                    <FormItem label="课程名称" prop="classifyName">
                                        <Input v-model="formValidate.classifyName" placeholder="请输入分类名称" style="width: 200px"></Input>
                                    </FormItem>
                                    <FormItem label="课程分类">
                                        <Select v-model="formValidate.classifyId" @on-change="onChangeClassif" style="width:200px;margin-right: 10px;" placeholder="全部">
                                            <Option :value="item.id" v-for="(item, i) in classifyList" :key="i">{{item.classifyName}}</Option>
                                        </Select>
                                        <Select :disabled="!formValidate.classifyId" v-model="formValidate.tagId" style="width:200px" placeholder="全部">
                                            <Option :value="item.id" v-for="(item, i) in tagList" :key="i">{{item.tagName}}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="课程类型">
                                        <RadioGroup v-model="formValidate.classifyStatus">
                                            <Radio label="0">VIP专享课程</Radio>
                                            <Radio label="1">付费课程</Radio>
                                            <Radio label="1">免费课程</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    <FormItem label="课程原价" prop="classifyName">
                                        <Input v-model="formValidate.classifyName" placeholder="请输入分类名称" style="width: 200px"></Input>
                                    </FormItem>
                                    <FormItem label="VIP专享价" prop="classifyName">
                                        <Input v-model="formValidate.classifyName" placeholder="请输入分类名称" style="width: 200px"></Input>
                                    </FormItem>
                                    <FormItem label="课程简介">
                                        <Editor :content="content" style="height: 300px;width: 700px"  @updateDataEvent="updateData"/>
                                    </FormItem>
                                    <FormItem label="课程讲师">
                                        <Select v-model="formValidate.tagId" style="width:200px" placeholder="全部">
                                            <Option :value="item.id" v-for="(item, i) in tagList" :key="i">{{item.tagName}}</Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="讲师简介">
                                        <Input v-model="formValidate.classifyName" type="textarea" :rows="5" placeholder="讲师简介" style="width: 350px" />
                                    </FormItem>
                                    <FormItem label="课程排序" prop="classifyName">
                                        <Input v-model="formValidate.classifyName" placeholder="请输入分类名称" style="width: 200px"></Input>
                                    </FormItem>
                                    <div class="addFormBasic">
                                        <div class="position">
                                            <div class="name">
                                                课程章节
                                            </div>
                                            <span class="border"></span>
                                        </div>
                                    </div>
                                    <div v-for="(items, i) in chapterList" :key="i">
                                        <div style="display: flex">
                                            <div style="padding-right: 15px">
                                                <FormItem
                                                    class="ivu-form-item-required"
                                                    v-for="(item, index) in items.child"
                                                    :key="index"
                                                    :label="item.title">
                                                    <Input v-if="index !==2"  v-model="item.value" placeholder="请输入分类名称" style="width: 200px"></Input>
                                                    <RadioGroup v-else v-model="item.value">
                                                        <Radio label="1">是</Radio>
                                                        <Radio label="0">否</Radio>
                                                    </RadioGroup>
                                                </FormItem>
                                            </div>
                                            <Button @click="handleRemove(i)">删除</Button>
                                        </div>
                                    </div>
                                    <FormItem>
                                        <Button type="dashed" @click="handleAdd" icon="md-add">添加章节</Button>
                                    </FormItem>
                                    <FormItem label="是否热门">
                                        <RadioGroup v-model="formValidate.classifyStatus">
                                            <Radio label="1">是</Radio>
                                            <Radio label="0">否</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                    <FormItem>
                                        <Button type="primary" @click="handleSubmit('formDynamic')">保存，暂不上架</Button>
                                        <Button type="primary" @click="handleReset('formDynamic')" style="margin-left: 8px">完成，提交上架</Button>
                                    </FormItem>
                                </Form>
                            </div>
                        </div>

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
    export default {
        name: "AddCoursList",
        components: {Editor},
        data() {
            return {
                classifyList: [], //一级分类
                tagList: [], // 二级分类
                content: '测试文章内容111111111',
                chapterList: [
                    {
                        index: 0,
                        child: [
                            {title: '章节名称', value: ''},
                            {title: '章节视频', value: ''},
                            {title: '是否显示', value: ''},
                        ],
                    },

                ], //章节
                uploadToken:"",
                uploadKey: "",
                domain: 'http://upload.qiniu.com', // 七牛云的上传地址
                qiniuaddr: 'pd6rnk9ck.bkt.clouddn.com', // 这是七牛云空间的外链默认域名
                form: {},
                QiniuData: {
                    key: "", //图片名字处理
                    token: "" //七牛云token
                },
                formValidate: {
                    chargeType: '', // 收费类型
                    classifyId: '', //课程一级分类id
                    classifySort: '', // 分类排序 正序排序，不排序则为0
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
            handleRemove (index) {
                this.chapterList.splice(index, 1)
            },
            handleAdd () {
                // if (this.chapterList.length > 0) {
                //     for(let i = 0; i < this.chapterList.length; i++) {
                //         for (let j= 0; j < this.chapterList[i].child.length; j++) {
                //             if (this.chapterList[i].child[0].value == '' &&
                //                 this.chapterList[i].child[1].value == '' &&
                //                 this.chapterList[i].child[2].value == '') { //是不是文本
                //                 this.$Message.error('请填写必填字段');
                //                 return false;
                //             } else {
                //                 let index = 0
                //                 this.chapterList.push({
                //                     index: index++,
                //                     child: [
                //                         {title: '章节名称', value: ''},
                //                         {title: '章节视频', value: ''},
                //                         {title: '是否显示', value: ''},
                //                     ],
                //                 },);
                //                 return false;
                //             }
                //
                //         }
                //
                //     }
                // } else {
                    let index = 0
                    this.chapterList.push({
                        index: index++,
                        child: [
                            {title: '章节名称', value: ''},
                            {title: '章节视频', value: ''},
                            {title: '是否显示', value: ''},
                        ],
                    },);
                    return false;
                // }


            },
            onBack () {
                this.$router.go(-1)
            },
            onChangeClassif (val) {
                if (val) {
                    this.LoadClassificationEr(val)
                }
            },
            async LoadClassificationEr (form) {
                try {
                    let data = await api.ClassificationEr({firstId: form})
                    if (data.code === 200) {
                        this.tagList = data.data
                    } else {
                        this.$Message.error(data.msg);
                    }
                }
                catch (e) {
                    console.log(e)
                }
            },
            updateData(e = ''){
                this.content = e;
                console.info(e);
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
            async LoadDictionary () {
                try {
                    let data = await api.ClassificationParentId()
                    if (data.code === 200) {
                        this.classifyList = data.data
                    } else {
                        this.$Message.error(data.msg);
                    }
                }
                catch (e) {
                    console.log(e)
                }
            }
        },
        created() {
            this.LoadData()
            this.LoadDictionary()
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
                    .addFormBasic{
                        position: relative;
                        padding-right: 180px;
                        .position{
                            position: absolute;
                            left: -16px;
                            display: flex;
                            align-items: center;
                            .name{
                                width: 120px;
                                background-color: #9EA8B5;
                                height: 36px;
                                line-height: 36px;
                                text-align: center;
                                color: #ffffff;
                            }
                            .border{
                                border: 18px solid transparent;
                                border-left: 14px solid #9EA8B5;
                                width: 0;
                                height: 0;
                            }
                        }



                    }
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
