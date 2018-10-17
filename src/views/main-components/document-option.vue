<style lang="less">
    @import '../../styles/common.less';
</style>
<!-- 文档修改，可修改内容，上传/删除附录 -->
<template>
    <div class="p-r">
        <Tabs type="card" v-if="tabList.length > 0" v-model="tabsValue" @on-click="clickTabs">
            <TabPane v-for="(item, index) in tabList" :key="index" :name="item.key" :label="item.labelName">
                <div v-if="tableDatas[index].cache">
                    <Table :disabled-hover="true" :height="windowHeight" border :columns="currentColumn" :data="tableDatas[index].data">
                        <div slot="footer">
                            <div class="tc" v-if="tableDatas[index].data.length < tableDatas[index].cache.length">
                                <Button long size="small" class="maring-top-10" @click="loadMore">
                                    加载更多
                                    <Icon type="chevron-down"></Icon>
                                </Button>
                            </div>
                            <div class="tc" v-else>没有更多数据了</div>
                        </div>
                    </Table>
                </div>
                <div v-else>
                    <Table :disabled-hover="true" :height="getWindowHeight(index)" border :columns="currentColumn" :data="tableDatas[index].data"></Table>
                </div>
            </TabPane>
            <div slot="extra">
                <Poptip v-if="showStatus" transfer title="更改状态" placement="bottom-end">
                    <Button size="small">
                        状态
                        <Icon type="arrow-down-b"></Icon>
                    </Button>
                    <RadioGroup v-model="standStatus" @on-change="changeStatus" size="small" slot="content">
                        <Radio v-for="(item, index) in statusList" :key="index" :label="item.value">{{item.label}}</Radio>
                    </RadioGroup>
                </Poptip>
                <slot name="option"></slot>
                <Button type="primary" size="small" @click="openAddAttach">添加附录</Button>
            </div>
        </Tabs>
        <Spin fix v-if="spinShow" size="large"></Spin>

        <Modal v-model="previewModal" :title="previewTitle" width="768" :footerHide="true">
            <div class="tc">
                <img :src="imgUrl" style="width: 100%;" />
            </div>
        </Modal>

        <Modal
            v-model="modal"
            :title="modalTitle"
            :loading="modalLoading"
            @on-ok="handleUpdate"
            ok-text="保存"
            ref="modal">
            <Form :model="formModel" :rules="rules" ref="form" @submit.native.prevent>
                <FormItem prop="value">
                    <div class="tc">
                        <Input v-model="formModel.value" type="textarea" :rows="20" placeholder="请输入要修改的内容"/>
                    </div>
                </FormItem>
            </Form>
        </Modal>
        <attach-upload
            ref="attachUpload"
            :doc-id="docId"
            :on-success="onSuccess"
            :format="['jpg', 'png', 'gif', 'jpeg']"
            accept=".jpg,.jpeg,.gif,.png"
            :param="uploadParams"
            :url="uploadUrl">
        </attach-upload>
    </div>
</template>

<script>
import { findDicWord } from '@/utils';
import { actionUrl } from '@/utils/request';
import attachUpload from '@/views/main-components/upload.vue';
export default {
    components: {attachUpload},
    props: {
        updateStatus: {
            type: Function
        },
        showStatus: {
            type: Boolean,
            default () {
                return false;
            }
        },
        saveUpdate: {
            type: Function
        },
        saveDelete: {
            type: Function
        },
        fetchDetail: {
            type: Function
        },
        url: String,
        uploadParam: {
            type: Object,
            default () {
                return {};
            }
        }
    },
    data () {
        return {
            standStatus: 1,
            statusList: [{value: 1, label: '启用'}, {value: 0, label: '停用'}],
            docId: this.$route.params.doc_id,
            tabsValue: '',
            tabList: [],
            modalTitle: '',
            modal: false,
            modalLoading: true,
            formModel: {
                value: ''
            },
            rules: {
                value: [
                    { required: true, message: '请输入要修改的内容', trigger: 'blur' }
                ]
            },
            colCode: '',
            rowIndex: '',
            spinShow: true,
            previewTitle: '',
            previewModal: false,
            imgUrl: '',
            uploadUrl: actionUrl + this.url,
            tableDatas: [],
            scrollLength: 20
        }
    },
    computed: {
        windowHeight () {
            return (window.innerHeight - 180) / window.devicePixelRatio;
        },
        // 有加载更多时的高度
        windowClient () {
            return window.devicePixelRatio;
        },
        uploadParams () {
            let obj = {
                sheetCode: 'attach',
                colCode: 'attach',
                rowIndex: 0
            };
            return Object.assign(obj, this.uploadParam);
        },
        currentDatas () {
            let item = this.tabList.find(ele => {
                return ele.key === this.tabsValue;
            });
            return item.content;
        },
        currentColumn () {
            let item = this.tabList.find(ele => {
                return ele.key === this.tabsValue;
            });
            let columns = [];
            if (item.key !== 'attach') {
                for(let key in item.content[0]) {
                    if (key !== 'mthId') {
                        let title = this.getDictName(key);
                        columns.push({
                            title,
                            key: key,
                            render: (h, params) => {
                                let rowData = params.row[key];
                                // if (rowData instanceof Object) {// 单元格内容为对象或对象数组
                                //     let plusButton = h('Button', {
                                //         props: {
                                //             type: 'dashed',
                                //             size: 'large',
                                //             icon: 'plus'
                                //         }
                                //     });
                                //     if (Array.isArray(rowData)) {
                                //         let arr = rowData.map(item => {
                                //             return this.renderImg(h, item);
                                //         });
                                //         arr.push(plusButton);
                                //         return h('div', arr);
                                //     } else {
                                //         let arr = [];
                                //         arr.push(this.renderImg(h, rowData));
                                //         arr.push(plusButton);
                                //         return h('div', arr);
                                //     }
                                // } else {
                                //     return this.renderText(h, params, key);
                                // }
                                if (Array.isArray(rowData)) {
                                    let checkObj = rowData.some(ele => {
                                        return ele instanceof Object;
                                    });
                                    // 单元格内容有对象处理为图片，如检测方法的计算，字符串数组连接后显示
                                    if (checkObj) {
                                        let arr = rowData.map(ele => {
                                            return this.renderImg(h, ele);
                                        });
                                        return h('div', arr);
                                    } else {
                                        let str = params.row[key].join('*');
                                        return this.renderText(h, params, key, str);
                                    }
                                } else {
                                    return this.renderText(h, params, key, params.row[key]);
                                }
                            }
                        });
                    }
                }
                if (columns.length > 10) {
                    columns.forEach((item, index, arr) => {
                        // 测定步骤和制样步骤单独设立宽度
                        if (item.key === 'testStep' || item.key === 'sampPreStep' || item.key === 'calculation') {
                            item.width = 400;
                        } else {
                            item.width = 200;
                        }
                    });
                }
            } else {
                // 附录处理
                columns.push({
                    title: item.labelName,
                    key: item.key,
                    render: (h, params) => {
                        if (params.row.attach) {
                            return this.renderImg(h, params.row.attach);
                        }
                    }
                });
                columns.push({
                    title: '操作',
                    key: 'option',
                    width: 200,
                    render: (h, params) => {
                        return h('Poptip', {
                            props: {
                                placement: "left-end",
                                confirm: true,
                                title: '您确认删除这条数据吗？',
                                transfer: true
                            },
                            on: {
                                'on-ok': () => {
                                    this.deleteAttach(params);
                                }
                            }
                        }, [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                }
                            }, '删除')
                        ]);
                    }
                })
            }
            return columns;
        }
    },
    methods: {
        renderText (h, params, key, content) {
            return h('Tooltip', {
                props: {
                    placement: 'top',
                    content: '双击修改内容',
                    transfer: true
                },
                style: {
                    cursor: 'pointer'
                }
            }, [
                h('span', {
                    on: {
                        'dblclick': () => {
                            this.openEditModal(params, key, content);
                        }
                    }
                }, content)
            ]);
        },
        renderImg (h, rowData) {
            return h('div', [
                h('Tooltip', {
                    props: {
                        placement: 'top',
                        content: '点击查看大图',
                        transfer: true
                    },
                    style: {
                        cursor: 'pointer'
                    }
                }, [
                    h('a', {
                        on: {
                            'click': () => {
                                this.previewTitle = rowData.attachName;
                                this.openAppendix(rowData);
                            }
                        }
                    }, [
                        h('img', {
                            style: {
                                height: '16px',
                                marginRight: '5px'
                            },
                            attrs: {
                                src: actionUrl + rowData.url
                            }
                        }),
                        h('span', {
                            style: {
                                marginRight: '5px'
                            }
                        }, rowData.attachName)
                    ])
                ])
            ]);
        },
        getWindowHeight (index) {
            if (this.tableDatas[index].data.length > 1) {
                return (window.innerHeight - 180) / window.devicePixelRatio;
            } else {
                return '';
            }
        },
        clickTabs (name) {
            let resultIndex = this.getCurrentIndex();
            this.tableDatas.forEach((ele, eleIndex) => {
                if (eleIndex !== resultIndex && ele.cache) {
                    ele.data = ele.cache.filter((item, index) => {
                        return index < this.scrollLength;
                    });
                }
            });
        },
        getCurrentIndex () {
            let index = this.tabList.findIndex(item => {
                return item.key === this.tabsValue;
            });
            return index;
        },
        getTableData (content, key) {
            // if (Array.isArray(item.content)) {
            //     return item.content;
            // } else {
            //     let result = item.content[item.key].map(ele => {
            //         return {[item.key]: ele};
            //     });
            //     return result;
            // }
            // return [];
            // item只有数组和对象两种情况，附录再多加一层
            if (Array.isArray(content)) {
                let checkObj = content.some(element => {
                    return element instanceof Object;
                });
                if (!checkObj || key === 'attach') {
                    return content.map(element => {
                        return {[key]: element};
                    });
                } else {
                    return content;
                }
            } else {
                let arr = [];
                arr.push(content);
                return arr;
            }
        },
        loadMore () {
            let index = this.getCurrentIndex();
            let cache = this.tableDatas[index].cache;
            if (!cache) {
                return;
            }
            let data = this.tableDatas[index].data;
            let arr = [];
            if (data.length + this.scrollLength < cache.length) {
                arr = cache.filter((item, index) => {
                    return index > data.length - 1 && index < data.length + this.scrollLength;
                });
            } else {
                arr = cache.filter((item, index) => {
                    return index > data.length - 1 && index < cache.length;
                });
            }
            this.tableDatas[index].data = data.concat(arr);
        },
        // 根据字典名查找对应中文
        getDictName(code) {
            return findDicWord(code);
        },
        openAddAttach () {
            this.$refs['attachUpload'].openModal();
        },
        // 附录上传成功后回调
        onSuccess () {
            this.spinShow = true;
            this.getDocumentDetail('attach');
        },
        // 打开附录文件
        openAppendix (img) {
            if(img.url) {
                this.imgUrl = actionUrl + img.url;
            }else {
                this.imgUrl = ''; // 清空图片路径
            }
            this.previewModal = true;
        },
        // 更新文档状态
        changeStatus () {
            let param = {status: this.standStatus};
            this.updateStatus(param).then(res => {
                this.$Message.success('文档状态更新成功');
            });
        },
        // 删除文档指定附录文件
        deleteAttach (params) {
            let param = {
                attachId: params.row.id,
                sheetCode: this.tabsValue,
                colCode: this.tabsValue,
                rowIndex: params.index
            };
            this.saveDelete(param).then(res => {
                this.$Message.success({
                    content: '【' + params.row.attachName + '】删除成功。',
                    duration: 5,
                    closable: true
                });
                this.spinShow = true;
                this.getDocumentDetail('attach');
            });
        },
        openEditModal (params, key, content) {
            this.$refs.form.resetFields();
            this.modal = true;
            this.rowIndex = params.index;
            this.colCode = key;
            this.modalTitle = '修改-' + this.getDictName(this.tabsValue) + '-' + this.getDictName(key);
            this.formModel.value = content;
        },
        // 修改文档内容
        handleUpdate () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let params = {
                        sheetCode: this.tabsValue,
                        colCode: this.colCode,
                        content: this.formModel.value,
                        rowIndex: this.rowIndex
                    };
                    this.saveUpdate(params).then(res => {
                        this.modal = false;
                        this.$Message.success('内容修改成功');
                        this.spinShow = true;
                        this.getDocumentDetail(this.tabsValue);
                    });
                } else {
                    this.$refs.modal.buttonLoading = false;
                }
            })
        },
        // 获取任务（文档）内容详情
        getDocumentDetail(defaultTab) {
            this.spinShow = true;
            this.fetchDetail().then(res => {
                this.spinShow = false;
                let result = [];
                let content = res.data.data.content;
                this.tableDatas = [];
                for (let key in content) {
                    let detail = content[key];
                    // if (!Array.isArray(content[key]) && Object.keys(content[key]).length > 1) {
                    //     let arr = [];
                    //     arr.push(content[key]);
                    //     detail = arr;
                    // }
                    let cache = this.getTableData(detail, key);                    
                    let obj = {
                        key,
                        labelName: this.getDictName(key),
                        content: cache
                    };
                    result.push(obj);
                    if (cache.length > this.scrollLength) {
                        let arr = cache.filter((item, index) => {
                            return index < this.scrollLength;
                        })
                        this.tableDatas.push({data: arr, cache: cache});
                    } else {
                        this.tableDatas.push({data: cache});
                    }
                }
                if (defaultTab && this.tabsValue === defaultTab) {
                    this.tabsValue = defaultTab;
                } else {
                    this.tabsValue = result[0].key;
                }
                this.tabList = result;
                this.standStatus = res.data.data.status;
            }).catch(err => {
                this.spinShow = false;
            });
        }
    },
    created () {
        this.getDocumentDetail();
    }
}
</script>

<style scoped>

</style>