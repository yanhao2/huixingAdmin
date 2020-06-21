<template>
    <div class="UserList">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px;">活动管理</div>
            </div>
            <div>
                <Button icon="ios-search" @click="LoadData">刷新</Button>
            </div>
        </div>

        <div class="content ActivityList">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        数据筛选
                    </p>
                    <div class="search">
                        <div class="row">
                            <div class="name">活动名称：</div>
                            <Input v-model="formInline.title" size="small" placeholder="请输入活动名称" style="width: 150px"/>
                        </div>
                        <div class="row">
                            <div class="name">是否需要付费：</div>
                            <Select v-model="formInline.payRequired" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">创建时间：</div>
                            <DatePicker type="datetimerange" @on-change="onChangeTime" v-model="time" size="small" placeholder="请选择创建开始时间-结束时间" style="width: 320px"></DatePicker>
                        </div>

                        <div class="row">
                            <div class="name">活动时间：</div>
                            <DatePicker type="datetimerange" @on-change="onChangeTimeEvent" v-model="timeEvent" size="small" placeholder="请选择活动开始时间-结束时间" style="width: 320px"></DatePicker>
                        </div>
                        <div class="row">
                            <div class="name">状态：</div>
                            <Select v-model="formInline.status" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">下架</Option>
                                <Option value="1">上架</Option>
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
                        <Button type="primary" icon="ios-add" size="small" @click="onAdd">
                            添加
                        </Button>
                    </p>
                    <div class="table">
                        <Table border :columns="columns" size="small" :data="data" :loading="loading">
                            <template slot-scope="{ row, index }" slot="type">
                                {{row.type == 0 ? '活动' : '通知' }}
                            </template>
                            <template slot-scope="{ row, index }" slot="status">
                                {{row.status == 0 ? '下架' : '上架' }}
                            </template>
                            <template slot-scope="{ row, index }" slot="action">
                                <div class="TableAction">
                                    <Tooltip content="编辑" placement="top" :transfer="true">
                                        <Icon type="ios-create-outline"
                                              style="margin-right: 5px;font-size: 22px; color: #0077CB;cursor: pointer;"
                                              @click="onEdit(row)"
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
    import {formatTs} from '../../moment/index'
    import api from '../../api/api'
    export default {
        name: "ActivityList",
        data() {
            return {
                loading: true,
                formInline: {
                    activityEndTime: '',
                    activityStartTime: '',
                    createdEndTime: '',
                    createdStartTime: '',
                    payRequired: '',
                    status: '',
                    title: '',
                    pageSize: 10,
                    pageNum: 1,
                    total: 0
                },
                time: [],
                timeEvent: [],
                isExport: false,
                data: []
            }
        },
        computed: {

            columns() {
                let columns = [];

                columns.push({
                    align: 'center',
                    title: '编号',
                    sortable: true,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '活动名称',
                    sortable: true,
                    key: 'title',
                });
                columns.push({
                    align: 'center',
                    title: '活动类型',
                    slot: 'type',
                });
                columns.push({
                    align: 'center',
                    title: '报名人数',
                    key: 'numberOfMan',
                });

                columns.push({
                    title: '创建时间',
                    align: 'center',
                    width: 180,
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
                    title: '活动结束时间',
                    align: 'center',
                    width: 180,
                    sortable: true,
                    key: 'endDate',
                    render: (h, params) => {
                        let text = this.formatTs(params.row.endDate);
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
                    title: '状态',
                    slot: 'status',
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
            onAdd () {
                this.$router.push({path: '/AddActivityList'})
            },
            onEdit (record) {
                this.$router.push({
                    path: '/AddActivityList',
                    query: {
                        id: record.id
                    }
                })
            },
            onSearch () {
                this.formInline.pageNum = 1
                this.LoadData()
            },
            onReset () {
                this.formInline.activityEndTime = ''
                this.formInline.activityStartTime = ''
                this.formInline.createdEndTime = ''
                this.formInline.createdStartTime = ''
                this.formInline.status = ''
                this.formInline.payRequired = ''
                this.formInline.title = ''
                this.formInline.pageNum = 1
                this.time = []
                this.timeEvent = []
                this.LoadData()
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
                this.LoadData()
            },
            // 表格数据个数
            onChangePageSize(size) {
                this.formInline.pageSize = size
                this.LoadData()
            },
            // 选择时间
            onChangeTime() {
                this.formInline.createdStartTime = this.formatTs(this.time[0]);
                this.formInline.createdEndTime = this.formatTs(this.time[1]);
            },
            onChangeTimeEvent() {
                this.formInline.activityStartTime = this.formatTs(this.timeEvent[0]);
                this.formInline.activityEndTime = this.formatTs(this.timeEvent[1]);
            },
            async LoadData () {
                try {
                    this.loading = true
                    let formData = new FormData();
                    formData.append('activityEndTime', this.formInline.activityEndTime);
                    formData.append('activityStartTime', this.formInline.activityStartTime);
                    formData.append('createdEndTime', this.formInline.createdEndTime);
                    formData.append('createdStartTime', this.formInline.createdStartTime);
                    formData.append('pageNum', this.formInline.pageNum);
                    formData.append('pageSize', this.formInline.pageSize);
                    formData.append('payRequired', this.formInline.payRequired);
                    formData.append('title', this.formInline.title);
                    formData.append('status', this.formInline.status);

                    let result = await api.ActivityList(formData)
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
        .ActivityList{
            .ivu-card-body{
                padding-bottom: 0;
                .row{
                    padding-bottom: 15px;
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

