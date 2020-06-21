<template>
    <div class="AddCoursClassification">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px">{{id ? '编辑活动' : '新建活动'}}</div>
            </div>
            <div>
                <Button icon="ios-arrow-back" @click="onBack">返回</Button>
            </div>
        </div>
        <div class="content AddCoursList">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        {{id ? '编辑活动' : '新建活动'}}
                    </p>
                    <div class="addForm">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="300">
                            <FormItem label="活动名称" prop="title">
                                <Input v-model="formValidate.title" style="width: 200px" placeholder="请输入轮播名称"></Input>
                            </FormItem>
                            <FormItem label="是否需要付费">
                                <RadioGroup v-model="formValidate.payRequired">
                                    <Radio label="1">是</Radio>
                                    <Radio label="0">否</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="开始时间" prop="startDateData">
                                <DatePicker type="datetime" placeholder="请选择开始时间" @on-change="onStartDate" v-model="formValidate.startDateData" style="width: 200px"></DatePicker>
                            </FormItem>
                            <FormItem label="结束时间" prop="endDateData">
                                <DatePicker type="datetime" placeholder="请选择结束时间" @on-change="onEndDate" v-model="formValidate.endDateData" style="width: 200px"></DatePicker>
                            </FormItem>
                            <FormItem label="报名原价" prop="payAmount">
                                <Input v-model="formValidate.payAmount" style="width: 200px" placeholder="请输入轮播名称"></Input>
                            </FormItem>
                            <FormItem label="活动详情" prop="detail">
                                <Input v-model="formValidate.detail" style="width: 200px;display: none"></Input>
                                <Editor :content="formValidate.detail" style="height: 300px;width: 700px"  @updateDataEvent="updateData"/>
                            </FormItem>
                            <FormItem label="简介" prop="intro">
                                <Input v-model="formValidate.intro" style="width: 300px"  type="textarea" :rows="5" placeholder="请输入轮播名称"></Input>
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
    import {formatNumber, formatTs}  from '../../moment/index'
    import Editor from '../../components/Editor';
    // InstructorListUser
    export default {
        name: "AddActivityList",
        components: {Editor},
        data() {
            return {
                loading: true,
                formValidate: {
                    title: '',
                    payRequired: '',
                    payAmount: '',
                    detail: '',
                    intro: '',
                    endDateData: '',
                    endDate: '',
                    startDateData: '',
                    startDate: '',
                },
                ruleValidate: {
                    title: [
                        { required: true, message: '活动名称不能为空', trigger: 'blur' }
                    ],
                    payAmount: [
                        { required: true, message: '报名原价不能为空', trigger: 'blur' }
                    ],
                    detail: [
                        { required: true, message: '活动详情不能为空', trigger: 'blur' }
                    ],
                    startDateData: [
                        { required: true, type: 'date', message: '开始时间不能为空', trigger: 'change' }
                    ],
                    endDateData: [
                        { required: true, type: 'date', message: '结束时间不能为空', trigger: 'change' }
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
            formatTs: formatTs,
            onBack () {
                this.$router.go(-1)
            },
            onStartDate (val) {
                this.formValidate.startDate = this.formatTs(val);
            },
            onEndDate (val) {
                this.formValidate.endDate = this.formatTs(val);
            },
            updateData(e = ''){
                this.formValidate.detail = e;
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        formData.append('title', this.formValidate.title);
                        formData.append('payRequired', this.formValidate.payRequired);
                        formData.append('payAmount', this.formValidate.payAmount);
                        formData.append('detail', this.formValidate.detail);
                        formData.append('intro', this.formValidate.intro);
                        formData.append('endDate', this.formValidate.endDate);
                        formData.append('startDate', this.formValidate.startDate);
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
                    let data = await api.EditActivityList(form)
                    if (data.code === 200) {
                        this.$Message.success('编辑活动成功');
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
                    let data = await api.AddActivityList(form)
                    if (data.code === 200) {
                        this.$Message.success('新建活动成功');
                        this.onBack()
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
                        let data = await api.ActivityListDetils({id: this.id})
                        if (data.code === 200) {
                            let formData = data.data
                            this.formValidate.title = formData.title
                            this.formValidate.payRequired = formData.payRequired + ''
                            this.formValidate.payAmount = formData.payAmount + ''
                            this.formValidate.detail = formData.detail
                            this.formValidate.intro = formData.intro
                            this.formValidate.endDate = formData.endDate
                            this.formValidate.startDate = formData.startDate
                            this.formValidate.endDateData = formData.endDate
                            this.formValidate.startDateData = formData.startDate
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

