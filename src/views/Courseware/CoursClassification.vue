<template>
    <div class="UserList">
        <HeaderComponent :name="'课程分类'"></HeaderComponent>
        <div class="content">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        数据筛选
                    </p>
                    <div class="search">
                        <div class="row">
                            <div class="name">分类名称：</div>
                            <Input v-model="formInline.classifyName" size="small" placeholder="分类名称" style="width: 150px"/>
                        </div>
                        <div class="row">
                            <div class="name">创建人：</div>
                            <Input v-model="formInline.username" size="small" placeholder="创建人" style="width: 150px"/>

                        </div>
                        <div class="row">
                            <div class="name">创建时间：</div>
                            <DatePicker type="datetimerange" @on-change="onChangeTime" v-model="time" size="small" placeholder="请选择开始时间-结束时间" style="width: 180px"></DatePicker>
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
                        <Table border :columns="columns" size="small" :data="data">
                            <template slot-scope="{ row, index }" slot="classifyImage">
                                <img :src="row.classifyImage" alt="" style="width: 40px;">
                            </template>
                            <template slot-scope="{ row, index }" slot="classifyStatus">
                                {{row.classifyStatus == 0 ? '下架' : '上架' }}
                            </template>

                            <template slot-scope="{ row, index }" slot="SetupThe">
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
    import HeaderComponent from '../../components/HeaderComponent'
    import {formatTs} from '../../moment/index'
    import api from '../../api/api'
    export default {
        name: "CoursClassification",
        components: {HeaderComponent},
        data() {
            return {
                formInline: {
                    classifyName: '', //分类名称
                    username: '', //创建人
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
                    title: '分类名称',
                    sortable: true,
                    key: 'classifyName',
                });
                columns.push({
                    align: 'center',
                    title: '分类Icon',
                    slot: 'classifyImage',
                });
                columns.push({
                    align: 'center',
                    title: '创建人',
                    key: 'updatedBy',
                });

                columns.push({
                    title: '创建时间',
                    align: 'center',
                    width: 180,
                    sortable: true,
                    key: 'createdTime',
                });
                columns.push({
                    align: 'center',
                    title: '状态',
                    slot: 'classifyStatus',
                });
                columns.push({
                    align: 'center',
                    title: '设置',
                    slot: 'SetupThe',
                });
                columns.push({
                    align: 'center',
                    title: '排序',
                    key: 'classifySort',
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
            // 选择时间
            onChangeTime() {
                this.formInline.startTime = this.formatTs(this.time[0]);
                this.formInline.endTime = this.formatTs(this.time[1]);
            },
            async LoadData () {
                try {
                    let form = {
                        classifyName: this.formInline.classifyName,
                        pageNum: this.formInline.pageNum,
                        pageSize: this.formInline.pageSize,
                        startTime: this.formInline.startTime,
                        endTime: this.formInline.endTime,
                        username: this.formInline.username,
                    }
                    let result = await api.CoursClassificationList(form)
                    if (result.code === 200) {
                        this.data = result.data
                    } else {
                        this.$Message.error(result.message);
                    }
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
