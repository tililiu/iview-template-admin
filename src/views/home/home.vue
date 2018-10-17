<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>
<template>
<div>
    <Card style="width: 350px;">
        <Row type="flex" class="user-infor">
            <Col span="8">
            <Row class-name="made-child-con-middle" type="flex" align="middle">
                <img class="avator-img" :src="avatorPath" />
            </Row>
            </Col>
            <Col span="16" style="padding-left:6px;">
            <Row class-name="made-child-con-middle" type="flex" align="middle">
                <div>
                    <b class="card-user-infor-name">{{ userName }}</b>
                    <p>super admin</p>
                </div>
            </Row>
            </Col>
        </Row>
        <div class="line-gray"></div>
        <Row class="margin-top-8">
            <Col span="8">
            <p class="notwrap">上次登录时间:</p>
            </Col>
            <Col span="16" class="padding-left-8">2018.02.27-17:32:20</Col>
        </Row>
        <Row class="margin-top-8">
            <Col span="8">
            <p class="notwrap">上次登录地点:</p>
            </Col>
            <Col span="16" class="padding-left-8">广西</Col>
        </Row>
    </Card>
</div>
</template>

<script>
import {getToken} from '@/utils/auth';
export default {
    computed: {
        avatorPath() {
            return localStorage.avatorImgPath;
        }
    },
    data() {
        return {
            userName: ''
        };
    },
    mounted() {
        this.userName = getToken('user');
    }
}
</script>

<style scoped>

</style>