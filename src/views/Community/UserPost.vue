<template>
    <div class="UserList">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px;">用户帖子</div>
            </div>
            <div>
                <Button icon="ios-search" @click="LoadData">刷新</Button>
            </div>
        </div>

        <div class="content">
            <div>
                <Card dis-hover class="UserPost">
                    <p slot="title">
                        数据筛选
                    </p>
                    <div class="search">
                        <div class="row">
                            <div class="name">发布者账号/昵称：</div>
                            <Input v-model="formInline.search" size="small" placeholder="发布者账号/昵称" style="width: 150px"/>
                        </div>
                        <div class="row">
                            <div class="name">是否推荐：</div>
                            <Select v-model="formInline.recStatus" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">是否热门：</div>
                            <Select v-model="formInline.hotStatus" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">状态：</div>
                            <Select v-model="formInline.disableStatus" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">禁用</Option>
                                <Option value="1">启用</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">发布时间：</div>
                            <DatePicker type="datetimerange" @on-change="onChangeTime" v-model="time" size="small" placeholder="请选择开始时间-结束时间" style="width: 320px"></DatePicker>
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
                        帖子列表
                    </p>
                    <div class="table">
                        <Table border :columns="columns" size="small" :data="data" :loading="loading">
                            <template slot-scope="{ row, index }" slot="imgPath">
                                <img :src="row.imgPath" alt="" style="width: 40px;">
                            </template>

                            <template slot-scope="{ row, index }" slot="phone">
                                {{row.user.phone}}
                            </template>
                            <template slot-scope="{ row, index }" slot="nickname">
                                {{row.user.nickname}}
                            </template>
                            <template slot-scope="{ row, index }" slot="topicName">
                                {{row.topic.name}}
                            </template>
                            <template slot-scope="{ row, index }" slot="topicNumbers">
                                {{row.topic.numbers}}
                            </template>
                            <template slot-scope="{ row, index }" slot="topicHotStatus">
                                {{row.topic.hotStatus == 0 ? '否' : '是' }}
                            </template>
                            <template slot-scope="{ row, index }" slot="topicRecStatus">
                                {{row.topic.recStatus == 0 ? '否' : '是' }}
                            </template>

                            <template slot-scope="{ row, index }" slot="status">
                                {{row.disableStatus == 0 ? '禁用' : '启用' }}
                            </template>
                            <template slot-scope="{ row, index }" slot="action">
                                <div class="TableAction">
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
    import {formatTs} from '../../moment/index'
    import api from '../../api/api'
    export default {
        name: "UserPost",
        data() {
            return {
                loading: true,
                formInline: {
                    search: '',
                    recStatus: '',
                    hotStatus: '',
                    disableStatus: '',
                    endTime: '',
                    startTime: '',
                    pageSize: 10,
                    pageNum: 1,
                    total: 0
                },
                time: [],
                data: []
            }
        },
        computed: {

            columns() {
                let columns = [];

                columns.push({
                    align: 'center',
                    title: '发布者账号',
                    sortable: true,
                    width: 130,
                    fixed: 'left',
                    slot: 'phone',
                });
                columns.push({
                    align: 'center',
                    title: '发布者昵称',
                    sortable: true,
                    fixed: 'left',
                    width: 130,
                    slot: 'nickname',
                });
                columns.push({
                    align: 'center',
                    title: '头像',
                    width: 100,
                    slot: 'imgPath',
                });
                columns.push({
                    align: 'center',
                    title: '话题',
                    width: 100,
                    slot: 'topicName',
                });
                columns.push({
                    align: 'center',
                    title: '话题参与量',
                    width: 120,
                    sortable: true,
                    slot: 'topicNumbers',
                });
                columns.push({
                    align: 'center',
                    title: '帖子标题',
                    width: 100,
                    key: 'title',
                });
                columns.push({
                    align: 'center',
                    title: '评论量',
                    sortable: true,
                    width: 100,
                    key: 'comments',
                });

                columns.push({
                    align: 'center',
                    title: '点赞量',
                    sortable: true,
                    width: 100,
                    key: 'thumbs',
                });
                columns.push({
                    align: 'center',
                    title: '分享量',
                    sortable: true,
                    width: 100,
                    key: '',
                });
                columns.push({
                    title: '发布时间',
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
                    title: '审核时间',
                    align: 'center',
                    width: 180,
                    sortable: true,
                    key: 'createTime',
                    render: (h, params) => {
                        let text = this.formatTs(params.row.topic.createTime);
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
                    title: '是否热门',
                    width: 100,
                    slot: 'topicHotStatus',
                });
                columns.push({
                    align: 'center',
                    title: '是否推荐',
                    width: 100,
                    slot: 'topicRecStatus',
                });

                columns.push({
                    align: 'center',
                    title: '状态',
                    width: 100,
                    slot: 'status',
                });
                columns.push({
                    title: '操作',
                    slot: 'action',
                    width: 100,
                    fixed: 'right',
                    align: 'center',
                });
                return columns;
            },
        },
        methods: {
            formatTs: formatTs,

            onSearch () {
                this.formInline.pageNum = 1
                this.LoadData()
            },
            onReset () {

                this.formInline.search = ''
                this.formInline.recStatus = ''
                this.formInline.hotStatus = ''
                this.formInline.disableStatus = ''
                this.formInline.endTime = ''
                this.formInline.startTime = ''
                this.formInline.pageNum = 1
                this.time = []
                this.LoadData()
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
                this.formInline.startTime = this.formatTs(this.time[0]);
                this.formInline.endTime = this.formatTs(this.time[1]);
            },
            async LoadData () {
                try {
                    this.loading = true
                    let formData = new FormData();
                    formData.append('search', this.formInline.search);
                    formData.append('recStatus', this.formInline.recStatus);
                    formData.append('hotStatus', this.formInline.hotStatus);
                    formData.append('disableStatus', this.formInline.disableStatus);
                    formData.append('pageNum', this.formInline.pageNum);
                    formData.append('pageSize', this.formInline.pageSize);
                    formData.append('startTime', this.formInline.startTime);
                    let result = await api.UserPostList(formData)
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
        .content {
            padding: 10px;
            background-color: #fff;
            height: calc(100% - 35px);
            overflow-y: auto;
            .UserPost{
                .ivu-card-body{
                    padding-bottom: 0;
                    .row {
                        display: flex;
                        align-items: center;
                        margin-right: 15px;
                        margin-bottom: 15px;
                    }
                }
            }
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

