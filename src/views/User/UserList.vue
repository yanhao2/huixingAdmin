<template>
    <div class="UserList">
        <HeaderComponent :name="'用户列表'"></HeaderComponent>
        <div class="content">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        数据筛选
                    </p>
                    <div class="search">
                        <div class="row">
                            <div class="name">手机号查询：</div>
                            <Input v-model="formInline.phone" size="small" placeholder="手机号查询" style="width: 150px"/>
                        </div>
                        <div class="row">
                            <div class="name">会员等级：</div>
                            <Input v-model="formInline.level" size="small" placeholder="会员等级" style="width: 150px"/>

                        </div>
                        <div class="row">
                            <div class="name">注册时间：</div>
                            <DatePicker type="datetimerange" size="small" placeholder="请选择开始时间-结束时间" style="width: 180px"></DatePicker>
                        </div>
                        <div class="row">
                            <div class="name">帐号类型：</div>
                            <Select v-model="formInline.teacherStatus" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">普通帐号</Option>
                                <Option value="1">老师帐号</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <Button type="primary" icon="ios-search" size="small" style="margin-right: 15px" @click="onSearch()">查询
                            </Button>
                            <Button icon="ios-search" size="small" @click="onReset()">重置</Button>

                        </div>
                    </div>
                </Card>
            </div>
            <div style="padding-top: 10px;">
                <Card dis-hover>
                    <p slot="title">
                        数据列表
                    </p>
                    <p slot="extra">
                        <Button :loading="isExport" size="small" @click="onExport">
                                <span v-if="!isExport">
                                    <Icon type="ios-cloud-download-outline" size="16" style="padding-right: 5px;"/>
                                    导出
                                </span>
                            <span v-else>正在导出中...</span>
                        </Button>
                    </p>
                    <div class="table">
                        <Table border :columns="columns" size="small" :data="data1">
                            <template slot-scope="{ row, index }" slot="action">
                                <div class="TableAction">
                                    <Tooltip content="查看" placement="top" :transfer="true">
                                        <Icon type="ios-eye-outline"
                                              style="margin-right: 5px;font-size: 22px; color: #0077CB"
                                              />
                                    </Tooltip>
                                    <Tooltip content="编辑" placement="top" :transfer="true">
                                        <Icon type="ios-create-outline"
                                              style="margin-right: 5px;font-size: 22px; color: #0077CB"
                                              />
                                    </Tooltip>
                                    <Tooltip content="删除" placement="top" :transfer="true">
                                        <Icon type="ios-trash-outline" style="font-size: 22px;color: #F56C6C;"
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
    export default {
        name: "UserList",
        components: {HeaderComponent},
        data() {
            return {
                formInline: {
                    phone: '',
                    level: '',
                    teacherStatus: '',
                    endTime: '',
                    startTime: '',
                    pageSize: 10,
                    pageNum: 1,
                    total: 0
                },
                isExport: false,
                cityList: [
                    {
                        value: 'New York',
                        label: 'New York'
                    },
                    {
                        value: 'London',
                        label: 'London'
                    },
                    {
                        value: 'Sydney',
                        label: 'Sydney'
                    },
                    {
                        value: 'Ottawa',
                        label: 'Ottawa'
                    },
                    {
                        value: 'Paris',
                        label: 'Paris'
                    },
                    {
                        value: 'Canberra',
                        label: 'Canberra'
                    }
                ],
                data1: [
                    {
                        name: 'John Brown',
                        age: 18,
                        address: 'New York No. 1 Lake Park',
                        date: '2016-10-03'
                    },
                    {
                        name: 'Jim Green',
                        age: 24,
                        address: 'London No. 1 Lake Park',
                        date: '2016-10-01'
                    },
                    {
                        name: 'Joe Black',
                        age: 30,
                        address: 'Sydney No. 1 Lake Park',
                        date: '2016-10-02'
                    },
                    {
                        name: 'Jon Snow',
                        age: 26,
                        address: 'Ottawa No. 2 Lake Park',
                        date: '2016-10-04'
                    }
                ]
            }
        },
        computed: {
            columns() {
                let columns = [];
                columns.push({
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left',
                })
                columns.push({
                    align: 'center',
                    title: 'ID',
                    width: 100,
                    sortable: true,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '手机号',
                    width: 100,
                    sortable: true,
                    fixed: 'left',
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '昵称',
                    width: 100,
                    sortable: true,
                    fixed: 'left',
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '姓名',
                    width: 100,
                    fixed: 'left',
                    sortable: true,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '用户等级',
                    width: 120,
                    sortable: true,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '可用积分',
                    width: 120,
                    sortable: true,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '总收益额',
                    width: 100,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '账户余额',
                    width: 100,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '累计提现',
                    width: 100,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '学弟学妹',
                    width: 100,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '是否会员',
                    width: 100,

                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '帐号类型',
                    width: 100,
                    key: 'id',
                });
                columns.push({
                    title: '注册时间',
                    align: 'center',
                    sortable: true,
                    width: 180,
                    key: 'gmtCreate',
                    render: (h, params) => {
                        let text = this.formatTs(params.row.gmtCreate);
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
                    title: '开通会员时间',
                    align: 'center',
                    width: 180,
                    sortable: true,
                    key: 'gmtModified',
                    render: (h, params) => {
                        let text = this.formatTs(params.row.gmtModified);
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
                    title: '启用',
                    width: 100,
                    key: 'id',
                });
                columns.push({
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                    fixed: 'right',
                    width: 140
                });
                return columns;
            },
        },
        methods: {
            formatTs: formatTs,
            onSearch () {

            },
            onReset () {

            },
            onExport () {
                this.isExport = true
                setTimeout(() => {
                    this.isExport = false
                }, 500)
            },
            // 表格数据分页
            onChangePage(page) {
                this.formInline.pageNum = page
            },
            // 表格数据个数
            onChangePageSize(size) {
                this.formInline.pageSize = size
            },
            async LoadData () {
                try {

                }
                catch (e) {
                    console.error(e)
                }
            }
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
    .UserList {
        height: 100%;
        padding: 10px 0;

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
                .search {
                    display: flex;
                    flex-wrap: wrap;

                    .row {
                        display: flex;
                        align-items: center;
                        margin-right: 15px;

                        .name {
                            white-space: nowrap;
                        }

                        .ivu-input-small {
                            border-radius: 2px;
                        }
                    }

                    .row:last-child {
                        margin-right: 0;
                    }
                }
                .table{
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
