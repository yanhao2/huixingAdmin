<template>
    <div class="UserList">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px;">用户列表</div>
            </div>
            <div>
                <Button icon="ios-search" @click="LoadData">刷新</Button>
            </div>
        </div>
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
                            <DatePicker type="datetimerange" size="small" @on-change="onChangeTime" v-model="time"  placeholder="请选择开始时间-结束时间" style="width: 180px"></DatePicker>
                        </div>
                        <div class="row">
                            <div class="name">帐号类型：</div>
                            <Select v-model="formInline.type" size="small" style="width:150px" placeholder="全部">
                                <Option v-for="(item, i) in typeList" :key="i" :value="item.id">{{item.name}}</Option>
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
                        <Table border :columns="columns" size="small" :data="data" :loading="loading">
                            <template slot-scope="{ row, index }" slot="status">
                                {{row.status == 0 ? '否' : '是'}}
                            </template>
                            <template slot-scope="{ row, index }" slot="teacherStatus">
                                {{row.teacherStatus == 0 ? '否' : '是'}}
                            </template>
                            <template slot-scope="{ row, index }" slot="enableStatus">
                                {{row.enableStatus == 0 ? '禁用' : '启用'}}
                            </template>

                            <template slot-scope="{ row, index }" slot="action">
                                <div class="TableAction">
                                    <Tooltip content="查看" placement="top" :transfer="true">
                                        <Icon type="ios-eye-outline"
                                              style="margin-right: 5px;font-size: 22px; color: #0077CB;cursor: pointer;"
                                              @click="onToView(row)"/>
                                    </Tooltip>
                                    <Tooltip content="编辑" placement="top" :transfer="true">
                                        <Icon type="ios-create-outline"
                                              style="margin-right: 5px;font-size: 22px; color: #0077CB;cursor: pointer;"
                                              @click="onEdit(row)"/>
                                    </Tooltip>
                                    <Tooltip content="删除" placement="top" :transfer="true">
                                        <Icon type="ios-trash-outline" style="font-size: 22px;color: #F56C6C;cursor: pointer;"
                                              @click="onDelete(row)"/>
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
        name: "UserList",
        components: {HeaderComponent},
        data() {
            return {
                loading: true,
                time: [],
                typeList: [],
                formInline: {
                    phone: '',
                    level: '',
                    endTime: '',
                    startTime: '',
                    pageSize: 10,
                    type: '',
                    pageNum: 1,
                    total: 0
                },
                isExport: false,
                data: []
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
                    width: 150,
                    sortable: true,
                    fixed: 'left',
                    key: 'phone',
                });
                columns.push({
                    align: 'center',
                    title: '昵称',
                    width: 100,
                    sortable: true,
                    fixed: 'left',
                    key: 'nickname',
                });
                columns.push({
                    align: 'center',
                    title: '姓名',
                    width: 100,
                    fixed: 'left',
                    sortable: true,
                    key: 'realName',
                });
                columns.push({
                    align: 'center',
                    title: '用户等级',
                    width: 120,
                    sortable: true,
                    key: 'level',
                });
                columns.push({
                    align: 'center',
                    title: '可用积分',
                    width: 120,
                    sortable: true,
                    key: 'credit',
                });
                columns.push({
                    align: 'center',
                    title: '总收益额',
                    width: 100,
                    sortable: true,
                    key: 'totalRevenue',
                });
                columns.push({
                    align: 'center',
                    title: '账户余额',
                    width: 100,
                    sortable: true,
                    key: 'amount',
                });
                columns.push({
                    align: 'center',
                    title: '累计提现',
                    width: 100,
                    sortable: true,
                    key: 'totalWithdrawAmount',
                });
                columns.push({
                    align: 'center',
                    title: '是否会员',
                    width: 100,
                    slot: 'status',
                });
                columns.push({
                    align: 'center',
                    title: '是否老师',
                    width: 100,
                    slot: 'teacherStatus',
                });
                columns.push({
                    title: '注册时间',
                    align: 'center',
                    sortable: true,
                    width: 180,
                    key: 'registerTime',
                    render: (h, params) => {
                        let text = this.formatTs(params.row.registerTime);
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
                    key: 'activationTime',
                    render: (h, params) => {
                        let text = this.formatTs(params.row.activationTime);
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
                    slot: 'enableStatus',
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
            // 选择时间
            onChangeTime() {
                this.formInline.startTime = this.formatTs(this.time[0]);
                this.formInline.endTime = this.formatTs(this.time[1]);
            },
            onSearch () {
                this.formInline.pageNum = 1
                this.LoadData()

            },
            onReset () {
                this.formInline.phone = ''
                this.formInline.level = ''
                this.formInline.teacherStatus = ''
                this.formInline.endTime = ''
                this.formInline.startTime = ''
                this.formInline.pageSize = 10
                this.formInline.pageNum = 1
                this.time = []
                this.LoadData()
            },
            onToView (record) {
                this.$router.push({
                    path: "/UserDetails",
                    query: {
                        id: record.id
                    }
                });
            },
            onEdit (record) {
                this.$router.push({
                    path: "/UserListEdit",
                    query: {
                        id: record.id
                    }
                });
            },
            onDelete (record) {
                if (record.enableStatus == 0) {
                    this.$Message.error('该账号已经是禁用状态，请勿重复操作');
                } else {
                    let formData = new FormData();
                    formData.append('enableStatus', 0);
                    formData.append('id', record.id);
                    formData.append('password', 0);
                    formData.append('phone', record.phone);
                    formData.append('platformStatus', record.platformStatus);
                    this.LoadDataEdit(formData)
                }
            },
            async LoadDataEdit(form) {
                try {
                    let data = await api.UserListEdit(form)
                    if (data.code === 200) {
                        this.$Message.success('删除成功');
                    } else {
                        this.$Message.error(data.msg);
                    }
                } catch (e) {
                    console.error(e)
                }
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
            async LoadData () {
                try {
                    this.loading = true
                    let formData = new FormData();
                    formData.append('endTime', this.formInline.endTime);
                    formData.append('level', this.formInline.level);
                    formData.append('pageNum', this.formInline.pageNum);
                    formData.append('pageSize', this.formInline.pageSize);
                    formData.append('phone', this.formInline.phone);
                    formData.append('startTime', this.formInline.startTime);
                    formData.append('type', this.formInline.type);
                    let result = await api.UserList(formData)
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
            objToArr(obj) {
                var arr = []
                for (let i in obj) {
                    arr.push({id: 0, name: obj[i]})
                }
                return arr;
            },
            // let obj = { '未完成': 5, '已完成': 8, '待确认': 4, '已取消': 6 };

            async LoadDictionary () {
                try {
                    let result = await api.UserListType()
                    if (result.code === 200) {
                        let item = this.objToArr(result.data)
                        this.typeList = item
                    } else {
                        this.$Message.error(result.message);
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
