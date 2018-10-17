<!-- 手动上传组件，支持批量上传 -->
<template>
    <Modal v-model="modal" title="添加附录" :footerHide="true" :mask-closable="false" transfer>
        <Form ref="attachForm" label-position="right" :label-width="100">
            <FormItem label="请选择文件：">
                <Upload
                    ref="upload"
                    :accept="accept"
                    :data="param"
                    :before-upload="beforeUpload"
                    :on-success="uploadSuccess"
                    :show-upload-list="false"
                    :headers="uploadHeader"
                    :action="url">
                    <Button type="dashed" icon="ios-cloud-upload-outline">请选择{{format.join()}}格式文件</Button>
                </Upload>
                <div v-if="fileList.length > 0">
                    <div>文件列表</div>
                    <div class="fileItem" v-for="(item, index) in fileList" :key="index"><Icon type="image"></Icon> {{item.name}}</div>
                </div>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="upload" :loading="loadingStatus">
                    {{ loadingStatus ? '上传中...' : '开始上传' }}
                </Button>
            </FormItem>
        </Form>
    </Modal>
</template>

<script>
import { getToken } from '@/utils/auth';

export default {
    props: {
        docId: String,
        onSuccess: {
            type: Function,
            default () {
                return {};
            }
        },
        accept: String,
        format: Array,
        param: {
            type: Object,
            default () {
                return {};
            }
        },
        url: String
    },
    computed: {
        uploadHeader () {
            return { 'token': getToken('token') };
        }
    },
    data () {
        return {
            modal: false,
            loadingStatus: false,
            fileList: []
        }
    },
    methods: {
        openModal () {
            this.fileList.splice(0, this.fileList.length);
            this.modal = true;
        },
        beforeUpload (file) {
            let check = this.format.some(item => {
                return file.name.indexOf(item) >= 0;
            });
            if (check) {
                this.fileList = [];
                this.fileList.push(file);
            } else {
                this.$Modal.warning({
                    title: '消息提示',
                    content: '文件 ' + file.name + ' 格式不正确，请上传'+this.format.join('，')+'格式的文件。'
                });
            }
            return false;
        },
        uploadSuccess (res, file, fileList) { // 文件上传回调 上传成功后删除待上传文件
            this.loadingStatus = false;
            this.modal = false;
            if (res.code == '0000') {
                this.$Notice.success({
                    title: '文件上传成功',
                    desc: '文件 ' + file.name + ' 上传成功。'
                });
                this.onSuccess();
            } else {
                this.$Notice.error({
                    title: '文件上传失败',
                    desc: res.msg + '',
                    duration: 0
                });
            }
        },
        // 增加附录
        upload () {
            if(this.fileList.length === 0) {
                this.$Modal.warning({
                    title: '消息提示',
                    content: '未选择上传文件'
                });
                return;
            }
            this.loadingStatus = true;
            for (let i = 0; i < this.fileList.length; i++) {
                let item = this.fileList[i];
                this.$refs['upload'].post(item);
            }
        }
    },
    mounted () {
        this.fileList = this.$refs['upload'].fileList;
    }
};
</script>

<style scoped>

</style>