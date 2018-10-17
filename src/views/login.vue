<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long :loading="loginLoading">
                                <span v-if="!loginLoading">登录</span>
                                <span v-else>登录中...</span>
                            </Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">欢迎登录标准云管理系统</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import {login, fetchAccess} from '@/api/system';
import {cryptPwd} from '@/utils';
import {setToken} from '@/utils/auth';
export default {
    data () {
        return {
            loginLoading: false,
            form: {
                userName: '',
                password: '',
                authorityList: []
            },
            rules: {
                userName: [
                    { required: true, message: '用户名不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    this.loginLoading = true;
                    // let md5Password = cryptPwd(this.form.password);
                    // login({userAccount: this.form.userName, password: md5Password}).then(res => {
                    //     this.loginLoading = false;
                    //     setToken('user', res.data.data.userName, { expires: 1 });
                    //     setToken('token', res.data.data.token, { expires: 1 });
                    //     this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                    //     this.getResource().then(res => {
                    //         if (res && Array.isArray(res)) {
                    //             setToken('access', JSON.stringify(res), { expires: 1 });
                    //         }else {
                    //             let arr = [];
                    //             setToken('access', JSON.stringify(arr), { expires: 1 });
                    //         }
                    //         this.$router.push({
                    //             name: 'home_index'
                    //         });
                    //     });
                    // }).catch(err => {
                    //     this.loginLoading = false;
                    // });
                    
                    setTimeout(() => {
                        this.loginLoading = false;
                        setToken('user', this.form.userName);
                        this.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                        if (this.form.userName === 'iview_admin') {
                            setToken('access', 0);
                        } else {
                            setToken('access', 1);
                        }
                        this.$router.push({name: 'home_index'});
                    }, 1500);
                }
            });
        },
        getResource () {
            return new Promise((resolve, reject) => {
                fetchAccess().then(res => {
                    let accessArray = [];
                    res.data.data.forEach(ele => {
                        accessArray.push(ele.id);
                        if(ele.children) {
                            ele.children.forEach(item => {
                                accessArray.push(item.id);
                            });
                        }
                    });
                    resolve(accessArray);
                });
            });
        }
    }
};
</script>

<style>

</style>
