<template>
    <div class="UserList">
        <div class="HeaderComponent">
            <div class="row">
                <div class="border">
                </div>
                <div style="font-size: 17px;">课程列表</div>
            </div>
            <div>
                <Button icon="ios-search" @click="LoadData">刷新</Button>
            </div>
        </div>
        <div class="content CourseListsCard">
            <div>
                <Card dis-hover>
                    <p slot="title">
                        数据筛选
                    </p>
                    <div class="search CourseListsSearch">
                        <div class="row">
                            <div class="name">课程名称：</div>
                            <Input v-model="formInline.curriculumName" size="small" placeholder="课程名称查询" style="width: 150px"/>
                        </div>
                        <div class="row">
                            <div class="name">所属分类：</div>
                            <Select v-model="formInline.classifyId" size="small" @on-change="onChangeClassif" style="width:120px;margin-right: 10px;" placeholder="全部">
                                <Option :value="item.id" v-for="(item, i) in classifyList" :key="i">{{item.classifyName}}</Option>
                            </Select>
                            <Select :disabled="!formInline.classifyId" v-model="formInline.tagId" size="small" style="width:120px" placeholder="全部">
                                <Option :value="item.id" v-for="(item, i) in tagList" :key="i">{{item.tagName}}</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">课程状态：</div>
                            <Select v-model="formInline.curriculumStatus" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">锁定</Option>
                                <Option value="1">开启</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">是否热门：</div>
                            <Select v-model="formInline.popularStatus" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">会员专享状态：</div>
                            <Select v-model="formInline.specialStatus" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">会员免费状态：</div>
                            <Select v-model="formInline.freeStatus" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">付费状态：</div>
                            <Select v-model="formInline.payStatus" size="small" style="width:150px" placeholder="全部">
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">操作人：</div>
                            <Select size="small" style="width:150px" placeholder="全部">
                                <Option value="0">否</Option>
                                <Option value="1">是</Option>
                            </Select>
                        </div>
                        <div class="row">
                            <div class="name">注册时间：</div>
                            <DatePicker type="datetimerange" size="small" @on-change="onChangeTime" v-model="time"  placeholder="请选择开始时间-结束时间" style="width: 320px"></DatePicker>
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
                            <template slot-scope="{ row, index }" slot="curriculumImage">
                                <img :src="row.curriculumImage" alt="" style="width: 40px;">
                            </template>

                            <template slot-scope="{ row, index }" slot="chargeType">
                                {{row.chargeType == 1 ? '免费' :  row.chargeType == 2 ? '会员免费' :  row.chargeType == 3 ? '收费' : ''}}
                            </template>
                            <template slot-scope="{ row, index }" slot="curriculumStatus">
                                {{row.curriculumStatus == 0 ? '锁定' : '开启'}}
                            </template>
                            <template slot-scope="{ row, index }" slot="popularStatus">
                                {{row.popularStatus == 0 ? '否' : '是'}}
                            </template>
                            <template slot-scope="{ row, index }" slot="payStatus">
                                {{row.payStatus == 0 ? '否' : '是'}}
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
        name: "CourseList",
        components: {HeaderComponent},
        data() {
            return {
                loading: true,
                classifyList: [], //一级分类
                tagList: [], //二级分类
                time: [],
                typeList: [],
                formInline: {
                    classifyId: '', // 课程一级分类id
                    curriculumName: '', // 课程名称
                    curriculumStatus: '', //  课程状态 0：锁定 1：开启
                    startTime: '',  // 开始时间
                    endTime: '', // 结束时间
                    freeStatus: '', // 会员免费状态 0-否，1-是
                    operatorId: '', // 操作人
                    payStatus: '', //  付费状态 0-否，1-是
                    popularStatus: '', // 是否热门 0：否 1：是
                    specialStatus: '', // 会员专享状态 0-否，1-是
                    tagId: '', // 课程二级分类Id
                    pageSize: 10,
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
                    align: 'center',
                    title: '编号',
                    width: 100,
                    sortable: true,
                    key: 'id',
                });
                columns.push({
                    align: 'center',
                    title: '课程封面',
                    width: 120,
                    slot: 'curriculumImage',
                });
                columns.push({
                    align: 'center',
                    title: '课程名称',
                    fixed: 'left',
                    width: 180,
                    key: 'curriculumName',
                });
                columns.push({
                    align: 'center',
                    title: '课程类型',
                    width: 120,
                    slot: 'chargeType',
                });
                columns.push({
                    align: 'center',
                    title: '一级分类',
                    width: 120,
                    key: 'classifyName',
                });
                columns.push({
                    align: 'center',
                    title: '二级分类',
                    width: 120,
                    key: 'tagName',
                });
                columns.push({
                    align: 'center',
                    title: '购买量',
                    width: 100,
                    sortable: true,
                    key: 'quantityOfOrder',
                });
                columns.push({
                    align: 'center',
                    title: '收藏量',
                    width: 100,
                    sortable: true,
                    key: 'numberOfCollections',
                });
                columns.push({
                    align: 'center',
                    title: '排序',
                    width: 100,
                    sortable: true,
                    key: 'curriculumSort',
                });
                columns.push({
                    align: 'center',
                    title: '课程状态',
                    width: 100,
                    slot: 'curriculumStatus',
                });
                columns.push({
                    align: 'center',
                    title: '是否热门',
                    width: 100,
                    slot: 'popularStatus',
                });
                columns.push({
                    align: 'center',
                    title: '付费状态',
                    width: 100,
                    slot: 'payStatus',
                });
                columns.push({
                    title: '更新时间',
                    align: 'center',
                    sortable: true,
                    width: 180,
                    key: 'updatedTime',
                    render: (h, params) => {
                        let text = this.formatTs(params.row.updatedTime);
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
                    title: '操作人',
                    width: 100,
                    key: 'enableStatus',
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
            onChangeClassif (val) {
                if (val) {
                    this.LoadClassificationEr(val)
                }
            },
            async LoadClassificationEr (form) {
                try {
                    let data = await api.ClassificationEr({firstId: form})
                    if (data.code === 200) {
                        this.tagList = data.data
                    } else {
                        this.$Message.error(data.msg);
                    }
                }
                catch (e) {
                    console.log(e)
                }
            },
            onAdd () {
                this.$router.push({
                    path: '/AddCoursList'
                })
            },


            onSearch () {
                this.formInline.pageNum = 1
                this.LoadData()

            },
            onReset () {
                this.formInline.classifyId = '' // 课程一级分类id
                this.formInline.curriculumName = '' // 课程名称
                this.formInline.curriculumStatus = '' // 课程状态 0：锁定 1：开启
                this.formInline.endTime = '' // 结束时间
                this.formInline.startTime = '' // 开始时间
                this.formInline.freeStatus = '' // 会员免费状态 0-否，1-是
                this.formInline.operatorId = ''// 操作人
                this.formInline.payStatus = ''// 付费状态 0-否，1-是
                this.formInline.popularStatus = ''// 是否热门 0：否 1：是
                this.formInline.specialStatus = ''// 会员专享状态 0-否，1-是
                this.formInline.tagId = ''// 课程二级分类Id
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
                console.log(record)
                if (record.enableStatus == 0) {
                    this.$Message.error('该账号已经是禁用状态，请勿重复操作');
                } else {
                    let form = {
                        enableStatus: 0,
                        id: record.id,
                        password: 0,
                        phone: record.phone,
                        platformStatus: record.platformStatus,
                    }
                    this.LoadDataEdit(form)
                }
            },
            async LoadDataEdit(form) {
                try {
                    let data = await api.UserListEdit(form)
                    if (data.code === 200) {
                        this.$Message.success('删除成功');
                        this.onBack()
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
                    let form = {
                        classifyId: this.formInline.classifyId, // 课程一级分类id
                        curriculumName: this.formInline.curriculumName,  // 课程名称
                        curriculumStatus: this.formInline.curriculumStatus, // 课程状态 0：锁定 1：开启
                        endTime: this.formInline.endTime,  // 结束时间
                        startTime: this.formInline.startTime,// 开始时间
                        freeStatus: this.formInline.freeStatus, // 会员免费状态 0-否，1-是
                        operatorId: this.formInline.operatorId, // 操作人
                        payStatus: this.formInline.payStatus, // 付费状态 0-否，1-是
                        popularStatus: this.formInline.popularStatus, // 是否热门 0：否 1：是
                        specialStatus: this.formInline.specialStatus, // 会员专享状态 0-否，1-是
                        tagId: this.formInline.tagId, // 课程二级分类Id
                        pageSize: this.formInline.pageSize,
                        pageNum: this.formInline.pageNum,
                    }
                    let result = await api.CourseList(form)
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
                    let data = await api.ClassificationParentId()
                    if (data.code === 200) {
                        this.classifyList = data.data
                    } else {
                        this.$Message.error(data.msg);
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
                .CourseListsSearch{
                    .row {
                        display: flex;
                        align-items: center;
                        margin-right: 15px;
                        margin-bottom: 15px;
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
        .CourseListsCard{
            .ivu-card{
                .ivu-card-body{
                    padding: 16px 16px 1px 16px;
                }
            }

        }
    }
</style>
