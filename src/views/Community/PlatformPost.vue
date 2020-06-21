<template>
    <div class="UserList">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px;">平台帖子</div>
            </div>
            <div>
                <Button icon="ios-search" @click="LoadData">刷新</Button>
            </div>
        </div>

        <div class="content">
            <div>
                <Card dis-hover class="PlatformPostAvatar">
                    <div class="headersAvatar">
                        <img :src="require('../../assets/logo.png')" alt="">
                        <div style="flex: 1;padding-left: 20px">发布者昵称</div>
                        <Button type="primary" icon="ios-create-outline" size="small">
                            编辑
                        </Button>
                    </div>

                </Card>
            </div>
            <div style="padding-top: 10px;">
                <Card dis-hover>
                    <p slot="title">
                        帖子列表
                    </p>
                    <p slot="extra">
                        <Button type="primary" icon="ios-add" size="small" @click="onAdd">
                            添加
                        </Button>
                    </p>
                    <div class="table">
                        <Table border :columns="columns" size="small" :data="data" :loading="loading">
                            <template slot-scope="{ row, index }" slot="imgPath">
                                <img :src="row.imgPath" alt="" style="width: 40px;">
                            </template>
                            <template slot-scope="{ row, index }" slot="nickname">
                                {{row.user.nickname}}
                            </template>
                            <template slot-scope="{ row, index }" slot="status">
                                {{row.status == 0 ? '禁用' : '启用' }}
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
                                        <Icon type="ios-trash-outline" style="font-size: 22px;color: #F56C6C;cursor: pointer;"
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
        name: "PlatformPost",
        data() {
            return {
                loading: true,
                formInline: {
                    name: '',
                    status: '',
                    endTime: '',
                    startTime: '',
                    pageSize: 10,
                    pageNum: 1,
                    total: 0
                },
                time: [],
                isExport: false,
                data: []
            }
        },
        computed: {

            columns() {
                let columns = [];

                columns.push({
                    align: 'center',
                    title: '发布者',
                    key: 'nickname',
                });
                columns.push({
                    align: 'center',
                    title: '头像',
                    slot: 'imgPath',
                });
                columns.push({
                    align: 'center',
                    title: '话题',
                    sortable: true,
                    key: 'content',
                    width: 180
                });

                columns.push({
                    align: 'center',
                    title: '帖子标题',
                    key: 'title',
                    sortable: true,
                    width: 180
                });
                columns.push({
                    align: 'center',
                    title: '评论量',
                    sortable: true,
                    key: 'comments',
                });
                columns.push({
                    align: 'center',
                    title: '点赞量',
                    sortable: true,
                    key: 'thumbs',
                });

                columns.push({
                    align: 'center',
                    title: '分享量',
                    sortable: true,
                    key: '',
                });
                columns.push({
                    align: 'center',
                    title: '创建人',
                    key: 'userId',
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
                    align: 'center',
                    title: '状态',
                    slot: 'status',
                });
                columns.push({
                    title: '操作',
                    slot: 'action',
                    align: 'center',
                    width: 100
                });
                return columns;
            },
        },
        methods: {
            formatTs: formatTs,
            onAdd () {
                this.$router.push({path: '/addPlatformPost'})
            },
            onEdit (record) {
                this.$router.push({
                    path: '/addPlatformPost',
                    query: {
                        id: record.id
                    }
                })
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
                    formData.append('pageNum', this.formInline.pageNum);
                    formData.append('pageSize', this.formInline.pageSize);
                    let result = await api.PlatformPostList(formData)
                    if (result.code === 200) {
                        this.data = result.data.records
                        this.formInline.total = result.data.total
                    } else {
                        this.$Message.error(result.message);
                    }
                    this.loading = false
                }
                catch (e) {
                    console.log('222222222', e)
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
            .PlatformPostAvatar{
                .ivu-card-body{
                    padding: 0;
                    .headersAvatar{
                        display: flex;
                        align-items: center;
                        padding-right: 15px;
                        img {
                            width: 80px;
                            height: 80px;
                        }
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

