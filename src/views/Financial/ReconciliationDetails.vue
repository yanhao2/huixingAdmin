<template>
    <div class="UserList">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px;">对账单详情-未对账</div>
            </div>
            <div>
                <Button icon="ios-arrow-back" @click="onBack">返回</Button>
            </div>
        </div>
        <div class="content">
            <div>
                <Card dis-hover>
                    <p style="padding: 0 0 10px 0;font-weight: bold">
                        订单信息
                    </p>
                    <div class="UserDetails">
                        <table>
                            <tr>
                                <td class="bgColor" style="width: 20%;">订单编号</td>
                                <td style="text-align: left;padding-left: 30px;">1111111</td>
                            </tr>
                            <tr>
                                <td class="bgColor" style="width: 20%;">订单金额</td>
                                <td style="text-align: left;padding-left: 30px;">1111111</td>
                            </tr>
                            <tr>
                                <td class="bgColor" style="width: 20%;">支付方式</td>
                                <td style="text-align: left;padding-left: 30px;">1111111</td>
                            </tr>
                            <tr>
                                <td class="bgColor" style="width: 20%;">支付时间</td>
                                <td style="text-align: left;padding-left: 30px;">1111111</td>
                            </tr>
                            <tr>
                                <td class="bgColor" style="width: 20%;">订单状态</td>
                                <td style="text-align: left;padding-left: 30px;">1111111</td>
                            </tr>

                        </table>
                    </div>
                    <p style="padding: 10px 0;font-weight: bold">
                        对账信息
                    </p>
                    <div class="UserDetails">
                        <table>
                            <tr>
                                <td class="bgColor" style="width: 20%;">对账状态</td>
                                <td style="text-align: left;padding-left: 30px;">1111111</td>
                            </tr>
                        </table>
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
        name: "ReconciliationDetails",
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
