<template>
    <div class="UserList">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px;">用户详情</div>
            </div>
            <div>
                <Button icon="ios-arrow-back" @click="onBack">返回</Button>
            </div>
        </div>
        <div class="content">
            <div>
                <Card dis-hover>
                    <p style="padding: 0 0 10px 0;font-weight: bold">
                        基本信息
                    </p>
                    <div class="UserDetails">
                        <table>
                            <tr>
                                <td rowspan="5" class="bgColor">
                                    <div class="photo">
                                        <img :src="userData.headImg" alt="">
                                        <p>{{userData.nickname}}</p>
                                        <div class="Badge" :style="{backgroundColor: userData.status == 1 ? '#f90' : '#eee'}">
                                            {{userData.status == 1 ? '会员' : '非会员'}}
                                        </div>
                                    </div>
                                </td>
                                <td class="bgColor">ID</td>
                                <td>{{userData.id}}</td>
                                <td class="bgColor">生日</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td class="bgColor">手机号码</td>
                                <td>{{userData.phone}}</td>
                                <td class="bgColor">用户等级</td>
                                <td>{{userData.level}}</td>
                            </tr>
                            <tr>
                                <td class="bgColor">性别</td>
                                <td>{{userData.sex == 0 ? '女' : '男'}}</td>
                                <td class="bgColor">注册时间</td>
                                <td>{{formatTs(userData.registerTime)}}</td>
                            </tr>
                            <tr>
                                <td class="bgColor">姓名</td>
                                <td>{{userData.realName}}</td>
                                <td class="bgColor">开通会员时间</td>
                                <td>{{formatTs(userData.activationTime)}}</td>
                            </tr>
                            <tr>
                                <td class="bgColor">昵称</td>
                                <td>{{userData.nickname}}</td>
                                <td class="bgColor">状态</td>
                                <td>{{userData.enableStatus == 0 ? '禁用' : '启用'}}</td>
                            </tr>
                        </table>
                    </div>
                    <p style="padding: 10px 0;font-weight: bold">
                        统计信息
                    </p>
                    <div class="UserDetails">
                        <table>
                            <tr>
                                <th class="bgColor">总收益额</th>
                                <th class="bgColor">账户余额</th>
                                <th class="bgColor">累计提现</th>
                                <th class="bgColor">可用积分</th>
                                <th class="bgColor">提现次数</th>
                            </tr>
                            <tr class="color">
                                <td>¥{{userData.totalRevenue}}</td>
                                <td>{{userData.amount}}</td>
                                <td>{{userData.totalWithdrawAmount}}</td>
                                <td>{{userData.credit}}</td>
                                <td>{{userData.totalWithdraw}}</td>
                            </tr>
                            <tr>
                                <th class="bgColor">收藏课程</th>
                                <th class="bgColor">邀请好友</th>
                                <th class="bgColor">发帖量</th>
                                <th class="bgColor">订单总量</th>
                                <th class="bgColor">预约记录</th>
                            </tr>
                            <tr class="color">
                                <td>{{userData.courseNumber}}</td>
                                <td>{{userData.totalInformer}}</td>
                                <td>{{userData.topicNumber}}</td>
                                <td>{{userData.orderNumber}}</td>
                                <td>{{userData.reserveNumber}}</td>
                            </tr>
                        </table>
                    </div>
                    <p style="padding: 10px 0;font-weight: bold">
                        订单记录
                    </p>
                    <div class="OrderRecord">
                        <Table border size="small" :columns="columns" :data="data" :loading="loading">
                            <template slot-scope="{ row, index }" slot="type">
                                {{
                                    row.type == 0 ? '购买会员' :
                                    row.type == 1 ? '赠送会员' :
                                    row.type == 2 ? '购买课程' :
                                    row.type == 3 ? '积分商城' :
                                    row.type == 4 ? '参加活动' :
                                    row.type == 5 ? '参与直播' : ''
                                }}
                            </template>

                            <template slot-scope="{ row, index }" slot="payType">
                                {{
                                row.payType == 1 ? '支付宝' :
                                row.payType == 2 ? '微信' :
                                row.payType == 3 ? '银联支付' : ''
                                }}
                            </template>
                            <template slot-scope="{ row, index }" slot="action">
                                <div class="TableAction">
                                    <Tooltip content="查看订单" placement="top" :transfer="true">
                                        <Icon type="ios-eye-outline"
                                              style="margin-right: 5px;font-size: 22px; color: #0077CB;cursor: pointer;"
                                            />
                                    </Tooltip>
                                </div>
                            </template>
                        </Table>
                        <div class="Pages">
                            <Page :total="formInline.total" :current="formInline.pageNum"
                                  :page-size="formInline.pageSize"
                                  :page-size-opts="[10, 20, 30, 50]"
                                  show-sizer
                                  size="small"
                                  @on-change="onChangePage"
                                  @on-page-size-change="onChangePageSize"/>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>
    import HeaderComponent from '../../components/HeaderComponent'
    import {formatTs} from '../../moment/index'
    import api from "../../api/api";
    export default {
        name: "UserDetails",
        components: {HeaderComponent},
        data() {
            return {
                loading: true,
                formInline: {
                    total: 0,
                    pageSize: 10,
                    pageNum: 1,
                },
                userData: {},
                data: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                ],
            }
        },
        computed: {
            id () {
                return this.$route.query.id
            },
            columns() {
                let columns = [];

                columns.push({
                    align: 'center',
                    title: '订单编号',
                    sortable: true,
                    key: 'orderSn',
                });
                columns.push({
                    title: '提交时间',
                    align: 'center',
                    sortable: true,
                    key: 'createTime',
                    render: (h, params) => {
                        let text = this.formatTs(params.row.createTime);
                        return h('div', [
                            h('div', {
                                slot: 'content',
                                style: {
                                    worWrap: 'break-word',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-all',
                                    textAlign: 'center'
                                }
                            }, text)
                        ])
                    }
                });
                columns.push({
                    align: 'center',
                    title: '订单类型',
                    slot: 'type',
                });
                columns.push({
                    align: 'center',
                    title: '订单金额',
                    sortable: true,
                    key: 'totalAmount',
                });
                columns.push({
                    align: 'center',
                    title: '支付方式',
                    slot: 'payType',
                });
                columns.push({
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                });
                return columns;
            },
        },
        methods: {
            formatTs: formatTs,
            onBack () {
                this.$router.go(-1)
            },
            // 表格数据分页
            onChangePage(page) {
                this.formInline.pageNum = page
                this.LoadDataOrderRecord()
            },
            // 表格数据个数
            onChangePageSize(size) {
                this.formInline.pageSize = size
                this.LoadDataOrderRecord()
            },
            async LoadData () {
                try {
                    let result = await api.UserDetails({id: this.id})
                    if (result.code === 200) {
                        this.userData = result.data
                    } else {
                        this.$Message.error(result.message);
                    }
                }
                catch (e) {
                    console.error(e)
                }
            },
            async LoadDataOrderRecord () {
                try {
                    this.loading = true
                    let formData = new FormData();
                    formData.append('pageNum', this.formInline.pageNum);
                    formData.append('pageSize', this.formInline.pageSize);
                    formData.append('userId', this.id);
                    let result = await api.UserDetailsOrderRecord(formData)
                    if (result.code === 200) {
                        this.data = result.data.records
                        this.formInline.total = result.data.total
                    } else {
                        this.$Message.error(result.message);
                    }
                    this.loading = false
                }
                catch (e) {
                    console.error(e)
                }
            },
        },
        created() {
            this.LoadData()
            this.LoadDataOrderRecord()
        },
        mounted() {

        },
        updated() {
        }
    }
</script>

<style lang="scss">
    .UserList {
        height: 100%;
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
                .bgColor{
                    background-color: #f8f8f9;
                }
                .UserDetails{
                    table{
                        width: 100%;
                        border-spacing: 0;
                        border-left: 1px solid #dcdee2;
                        border-top: 1px solid #dcdee2;
                        tr{

                            td, th{
                                padding: 8px;
                                border-right: 1px solid #dcdee2;
                                border-bottom: 1px solid #dcdee2;
                                text-align: center;
                            }
                        }
                        tr.color{
                            td{
                                color: #2848F6;
                            }
                        }
                        .photo{
                            text-align: center;
                            img {
                                width: 50px;
                                height: 50px;
                            }
                            .Badge{
                                margin: 10px auto;
                                width: 50px;
                                height: 20px;
                                border-radius: 10px;
                                color: #fff;
                            }
                        }
                    }
                }
                .OrderRecord{
                    .ivu-table-small{
                        font-size: 14px;
                    }
                    .Pages{
                         padding-top: 10px;
                         display: flex;
                         justify-content: flex-end;
                     }
                }
            }

        }
    }
</style>
