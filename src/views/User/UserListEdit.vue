<template>
    <div class="AddCoursClassification">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px">编辑资料</div>
            </div>
            <div>
                <Button icon="ios-arrow-back" @click="onBack">返回</Button>
            </div>
        </div>
        <div class="content">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        编辑资料
                    </p>
                    <p slot="extra">
                        <span style="color: #ed4014">
                        *
                        </span>
                        为必填项
                    </p>
                    <div class="addForm">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="300">
                            <FormItem label="手机号码" prop="phone">
                                <Input v-model="formValidate.phone" style="width: 200px" placeholder="请输入手机号码"></Input>
                            </FormItem>
                            <FormItem label="账号密码">
                                <Input  type="password" v-model="formValidate.password" style="width: 200px" placeholder="请输入账号密码"></Input>
                            </FormItem>
                            <FormItem label="是否特殊账号">
                                <RadioGroup v-model="formValidate.platformStatus">
                                    <Radio label="0">否</Radio>
                                    <Radio label="1">是</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="账户状态">
                                <RadioGroup v-model="formValidate.enableStatus">
                                    <Radio label="0">禁用</Radio>
                                    <Radio label="1">启用</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                                <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
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
    export default {
        name: "UserListEdit",
        data() {
            return {
                formValidate: {
                    enableStatus: '',
                    password: '',
                    phone: '',
                    platformStatus: '',
                },
                ruleValidate: {
                    phone: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' }
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
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            onBack () {
                this.$router.go(-1)
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        formData.append('enableStatus', this.formValidate.enableStatus);
                        formData.append('id', this.id);
                        formData.append('password', this.formValidate.password);
                        formData.append('phone', this.formValidate.phone);
                        formData.append('platformStatus', this.formValidate.platformStatus);
                        this.LoadDataEdit(formData)
                    } else {
                        this.$Message.error('请按要求填写');
                    }
                })
            },
            async LoadDataEdit(form) {
                try {
                    let data = await api.UserListEdit(form)
                    if (data.code === 200) {
                        this.$Message.success('编辑资料成功');
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
                        let data = await api.UserDetails({id: this.id})
                        if (data.code === 200) {
                            let formData = data.data
                            this.formValidate.enableStatus = formData.enableStatus + ''
                            this.formValidate.phone = formData.phone + ''
                            this.formValidate.platformStatus = formData.payAmount + ''
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
    }
</style>
