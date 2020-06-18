<template>
    <div class="Login">
        <el-card class="boxCard">
            <img src="../assets/logo.png" alt="">
            <div class="title">惠行文件管理后台</div>
            <div class="form">
                <Form ref="formInline" :model="formInline" :rules="ruleInline">
                    <FormItem prop="username">
                        <Input type="text" size="large" v-model="formInline.username" placeholder="请输入用户名称">
                            <Icon type="ios-person-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem prop="password">
                        <Input type="password" size="large" v-model="formInline.password" placeholder="请输入登录密码">
                            <Icon type="ios-lock-outline" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" size="large" long @click="handleSubmit('formInline')">登录</Button>
                    </FormItem>
                </Form>
            </div>
        </el-card>
    </div>
</template>

<script>
    import api from '../api/api'
export default {
  name: "Login",
  data () {
    return {
        formInline: {
            username: '',
            password: ''
        },
        ruleInline: {
            username: [
                { required: true, message: '用户名称不能为空', trigger: 'blur' }
            ],
            password: [
                { required: true, message: '登录密码不能为空', trigger: 'blur' },
                { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
            ]
        }
    }
  },
  computed: {
  },
  methods: {
      handleSubmit(name) {
          this.$refs[name].validate((valid) => {
              if (valid) {
                  let formData = new FormData();
                  formData.append('username', this.formInline.username);
                  formData.append('password', this.formInline.password);
                  this.LoadLogin(formData)
              } else {
                  this.$Message.error('请按要求填写用户名和密码');
              }
          })
      },
      async LoadLogin (form) {
          try {
              let result = await api.TheLogin(form)
              if (result.code === 200) {
                  this.$store.commit('setStorageToken', result.data.token);
                  this.$store.commit('setStorageUser', JSON.stringify(result.data.user));
                  this.$router.push({path: `/`});
              } else {
                  this.$Message.error(result.message);
              }
          }
          catch (e) {
              console.log(e)
          }
      }
  },
  created () {

  },
  mounted () {

  },
  updated () {
  }
}
</script>

<style lang="scss">
    .Login{
        height: 100%;
        width: 100%;
        background: url("../assets/loginBg.jpg") no-repeat;
        background-size: 100% auto;
        display: flex;
        align-items: center;
        justify-content: center;
        .boxCard{
            text-align: center;
            background-color: transparent;
            box-shadow: none;
            border: none;
            img{
                width: 80px;
                height: 80px;
            }
            .title{
                color: #fff;
                font-size: 28px;
                font-weight: bold;
            }
            .form{
                padding-top: 30px;
                .ivu-input-group-append, .ivu-input-group-prepend{
                    background-color: transparent;
                    border-left: 1px solid #fff;
                    border-top: 1px solid #fff;
                    border-bottom: 1px solid #fff;
                }
                .ivu-input-group .ivu-input{
                    background-color: transparent;
                    border: 1px solid #fff;
                    /*border-top: 1px solid #fff;*/
                    /*border-bottom: 1px solid #fff;*/
                }
                .ivu-input-group-prepend{
                    .ivu-icon{
                        color: #fff;
                    }
                }
                .ivu-input-group-append, .ivu-input-group-prepend{
                    border-radius: 2px;
                }
                .ivu-input{
                    border-radius: 2px;
                    color: #fff;
                }
                .ivu-input::-webkit-input-placeholder {  /*Webkit browsers 谷歌*/
                    color:  #fff;
                    font-size: 14px;
                }

                .ivu-input:-moz-placeholder {  /*Mozilla Firefox 4 to 8 火狐*/
                    color:  #fff;
                    font-size: 14px;
                }

                .ivu-input::moz-placeholder {  /*Mozilla Firefox 19+ 火狐*/
                    color:  #fff;
                    font-size: 14px;
                }

                .ivu-input:-ms-input-placeholder {  /*Internet Explorer 10+ IE10以上*/
                    color: #fff;
                    font-size: 14px;
                }
            }
        }
    }
</style>
