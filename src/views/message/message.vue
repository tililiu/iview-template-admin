<style lang="less">
    @import './message.less';
</style>

<template>
    <div class="message-main-con">
        <div class="message-mainlist-con">
            <div>
                <Button @click="setCurrentMesType('unread')" size="large" long type="text"><transition name="mes-current-type-btn"><Icon v-show="currentMessageType === 'unread'" type="checkmark"></Icon></transition><span class="mes-type-btn-text">未读消息</span><Badge class="message-count-badge-outer" class-name="message-count-badge" :count="unreadCount"></Badge></Button>
            </div>
            <div>
                <Button @click="setCurrentMesType('hasread')" size="large" long type="text"><transition name="mes-current-type-btn"><Icon v-show="currentMessageType === 'hasread'" type="checkmark"></Icon></transition><span class="mes-type-btn-text">已读消息</span><Badge class="message-count-badge-outer" class-name="message-count-badge" :count="hasreadCount"></Badge></Button>
            </div>
        </div>
        <div class="message-content-con">
            <transition name="view-message">
                <div v-if="showMesTitleList" class="message-title-list-con">
                    <Table ref="messageList" :columns="mesTitleColumns" :data="currentMesList" :no-data-text="noDataText"></Table>
                </div>
            </transition>
            <transition name="back-message-list">
                <div v-if="!showMesTitleList" class="message-view-content-con">
                    <div class="message-content-top-bar">
                        <span class="mes-back-btn-con"><Button type="text" @click="backMesTitleList"><Icon type="chevron-left"></Icon>&nbsp;&nbsp;返回</Button></span>
                        <h3 class="mes-title">{{ mes.title }}</h3>
                    </div>
                    <p class="mes-time-con"><Icon type="android-time"></Icon>&nbsp;&nbsp;{{ mes.createTime }}</p>
                    <div class="message-content-body">
                        <p class="message-content">{{ mes.content }}</p>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
import {fetchMessages, updateMessage} from '@/api/system';
import {formatTime} from '@/utils';
export default {
    name: 'message_index',
    computed: {
        unreadCount () {
            return this.unreadMesList.length;
        },
        hasreadCount () {
            return this.hasreadMesList.length;
        }
    },
    data () {
        const markAsreadBtn = (h, params) => {
            return h('Button', {
                props: {
                    size: 'small'
                },
                on: {
                    click: () => {
                        this.chaneMessageStatus(params);
                    }
                }
            }, '标为已读');
        };
        return {
            currentMesList: [],
            unreadMesList: [],
            hasreadMesList: [],
            currentMessageType: 'unread',
            showMesTitleList: true,
            noDataText: '暂无未读消息',
            mes: {
                title: '',
                createTime: '',
                content: ''
            },
            mesTitleColumns: [
                {
                    title: ' ',
                    key: 'title',
                    align: 'left',
                    ellipsis: true,
                    render: (h, params) => {
                        return h('a', {
                            on: {
                                click: () => {
                                    this.showMesTitleList = false;
                                    this.mes.title = params.row.title;
                                    this.mes.createTime = formatTime(params.row.createTime);
                                    this.mes.content = params.row.content;
                                }
                            }
                        }, params.row.title);
                    }
                },
                {
                    title: ' ',
                    key: 'createTime',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('span', [
                            h('Icon', {
                                props: {
                                    type: 'android-time',
                                    size: 12
                                },
                                style: {
                                    margin: '0 5px'
                                }
                            }),
                            h('span', {
                                props: {
                                    type: 'android-time',
                                    size: 12
                                }
                            }, formatTime(params.row.createTime))
                        ]);
                    }
                },
                {
                    title: ' ',
                    key: 'asread',
                    align: 'center',
                    width: 100,
                    render: (h, params) => {
                        if (this.currentMessageType === 'unread') {
                            return h('div', [
                                markAsreadBtn(h, params)
                            ]);
                        }
                    }
                }
            ]
        };
    },
    methods: {
        backMesTitleList () {
            this.showMesTitleList = true;
        },
        setCurrentMesType (type) {
            if (this.currentMessageType !== type) {
                this.showMesTitleList = true;
            }
            this.currentMessageType = type;
            if (type === 'unread') {
                this.noDataText = '暂无未读消息';
                this.currentMesList = this.unreadMesList;
            } else if (type === 'hasread') {
                this.noDataText = '暂无已读消息';
                this.currentMesList = this.hasreadMesList;
            }
        },
        getMessageList () {
            fetchMessages().then(res => {
                this.currentMesList = this.unreadMesList = res.data.data.filter(item => {
                    return item.status === 0;
                });
                this.$store.commit('setMessageCount', this.unreadMesList.length);
                this.hasreadMesList = res.data.data.filter(item => {
                    return item.status === 1;
                });
            });
        },
        chaneMessageStatus (params) {
            updateMessage({id: params.row.id}).then(res => {
                this.getMessageList();
            });
        }
    },
    created () {
        this.getMessageList();
    }
};
</script>

