<template>
    <div class="Layout">
        <el-container style="height: 100%;">
            <el-aside width="200px" class="LayoutAside">
                <div class="logo">
                    <img src="../assets/logo.png" alt="">
                </div>
                <el-menu :default-openeds="openedsList" :unique-opened="true" :default-active="activeData" :router="true" @select="onSelect">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>用户管理</template>
                        <el-menu-item index="/">用户列表</el-menu-item>
                        <el-menu-item index="LoginLog">登录日志</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-menu"></i>课件管理</template>
                        <el-menu-item index="CoursClassification">课程分类</el-menu-item>
                        <el-menu-item index="CourseList">课程列表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-menu"></i>讲师管理</template>
                        <el-menu-item index="InstructorList">讲师列表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="4">
                        <template slot="title"><i class="el-icon-menu"></i>社区管理</template>
                        <el-menu-item index="PlatformPost">平台帖子</el-menu-item>
                        <el-menu-item index="UserPost">用户帖子</el-menu-item>
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title"><i class="el-icon-menu"></i>运营系统</template>
                        <el-menu-item index="BannerList">轮播管理</el-menu-item>
                        <el-menu-item index="NoticeList">公告</el-menu-item>
                        <el-menu-item index="ActivityList">活动管理</el-menu-item>
                    </el-submenu>
                    <el-submenu index="6">
                        <template slot="title"><i class="el-icon-menu"></i>UGC审核系统</template>
                        <el-submenu index="6-1" class="menuTitleOne">
                            <template slot="title">帖子审核</template>
                            <el-menu-item index="InvitationUnaudited" class="menuTitleTwo">未审核</el-menu-item>
                            <el-menu-item index="InvitationOkPass" class="menuTitleTwo">已通过</el-menu-item>
                            <el-menu-item index="InvitationNotPass" class="menuTitleTwo">未通过</el-menu-item>
                        </el-submenu>
                        <el-submenu index="6-2" class="menuTitleOne">
                            <template slot="title">评论审核</template>
                            <el-menu-item index="RemarkUnaudited" class="menuTitleTwo">未审核</el-menu-item>
                            <el-menu-item index="RemarkNotPass" class="menuTitleTwo">未通过</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <el-submenu index="7">
                        <template slot="title"><i class="el-icon-menu"></i>财务</template>
                        <el-submenu index="7-1" class="menuTitleOne">
                            <template slot="title">对账管理</template>
                            <el-menu-item index="ReconciliationList" class="menuTitleTwo">对账列表</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <el-container>
                <el-header class="LayoutHeader">
                    <Input suffix="ios-search" size="small" placeholder="请输入搜索内容" style="max-width: 145px;margin-right: 15px;" />
                    <el-dropdown style="margin-right: 15px;"  placement="bottom">
                        <div class="userName el-dropdown-link">
                            <i class="el-icon-user"></i>
                            <span class="name">{{userName}}</span>
                            <i class="el-icon-arrow-down"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>修改密码</el-dropdown-item>
                            <el-dropdown-item>基本信息</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-popover style="margin-right: 15px;"
                        placement="bottom"
                        trigger="hover"
                                :visible-arrow="false"
                                class="message"
                        >
                        <div class="messageModal">
                            <div class="messageHeader">
                                <div class="col">消息中心</div>
                                <div class="col active">接受设置</div>
                            </div>
                            <div class="row">
                                <div class="col hover">全部消息</div>
                                <div class="col right">（<span style="color: #EE5735">10</span>）</div>
                            </div>
                            <div class="row">
                                <div class="col hover">全部消息</div>
                                <div class="col right">（<span style="color: #EE5735">10</span>）</div>
                            </div>
                            <div class="row">
                                <div class="col hover">全部消息</div>
                                <div class="col right">（<span style="color: #EE5735">10</span>）</div>
                            </div>
                            <div class="row">
                                <div class="col hover">全部消息</div>
                                <div class="col right">（<span style="color: #EE5735">10</span>）</div>
                            </div>
                        </div>

                        <el-badge :value="12" class="item" slot="reference">
                            <i class="el-icon-bell"></i>
                        </el-badge>
                    </el-popover>
                    <i class="el-icon-setting cursor" style="margin-right: 15px;"></i>
                    <i class="el-icon-switch-button cursor" style="cursor: pointer" @click="onLogout"></i>
                </el-header>

                <el-main style="padding: 0;height: calc(100% - 60px);background-color: #f5f5f5">
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script>
export default {
  name: "Layout",
  data () {
    return {
        userName: '',
        openedsList: ['1', '/'],
        activeData: '/',
    }
  },
  computed: {
      user() {
          return this.$store.getters.getSortageUser;
      },
      routerUrl() {
          return this.$store.getters.getSortageRouter;
      },

  },
  methods: {
      onSelect (index, indexPath) {
          localStorage.setItem('activeData',  index)
          this.activeData = index
          this.openedsList = indexPath
          this.$store.commit('setStorageRouter', JSON.stringify(indexPath));
      },
      onLogout () {
          localStorage.removeItem('user')
          localStorage.removeItem('routerUrl')
          localStorage.removeItem('token')
          this.$router.push({path: `/login`});
      }
  },
  created () {
      let user = JSON.parse(this.user)
      this.userName = user.roleName
      if (this.routerUrl) {
          this.openedsList = JSON.parse(this.routerUrl)
          this.activeData = localStorage.getItem('activeData')
          this.$forceUpdate()
      } else {
          this.$store.commit('setStorageRouter', JSON.stringify(this.openedsList));
      }

  },
  mounted () {

  },
  updated () {
  }
}
</script>

<style lang="scss">
    .el-menu , .Layout{
        height: calc(100% - 60px);
        overflow-y: auto;
        overflow-x: hidden;
        border-right: none;
    }
    .Layout{
        height: 100%;
        .LayoutAside{
            border-right: solid 1px #e6e6e6;
            height: 100%;
        }
        .el-menu{
            .el-menu-item {
                padding-left: 50px!important;
            }
            .menuTitleOne{
                .el-submenu__title{
                    padding-left: 50px!important;
                }
                .menuTitleTwo{
                    padding-left: 70px!important;
                }
            }
        }
        .logo{
            height: 60px;
            text-align: center;
            img {
                height: 60px;
            }
        }
        .LayoutHeader{
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 60px!important;
            box-shadow: 0px 2px 3px #f2f2f2;
            .ivu-input{
                border-radius: 20px;
            }
            .userName{
                .name{
                    padding: 0 5px;
                }
            }
            i.cursor{
                cursor: pointer;
            }

        }
        .el-menu-item.is-active{
            background-color: #ecf5ff;
        }
    }
    .message{

    }
    .el-popover{
        padding: 0;
    }
    .messageModal{
        .row{
            padding: 5px 0;
            display: flex;
        }
        .col{
            flex: 1;
            text-align: center;

        }
        .right{
            text-align: right;
        }
        .hover{
            cursor: pointer;
        }
        .hover:hover{
            color: rgb(0, 121, 254);

        }
        .messageHeader{
            display: flex;
            align-items: center;
            color: #ccc;
            background-color: #F3F3F3;
            padding: 5px 0;
            .row{
                display: flex;
            }
            .col{
                flex: 1;
                text-align: center;
            }
            .active{
                color: rgb(0, 121, 254);
                cursor: pointer;
            }
        }
    }

</style>
