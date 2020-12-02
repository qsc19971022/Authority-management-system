<template>
    <div class="login-container">
        <div class="login-box">
            <h1>欢迎登录</h1>
            <el-form ref="form" label-position="right" label-width="0" :rules="rules" :model="loginData">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="loginData.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" type="password" v-model="loginData.password"></el-input>
                </el-form-item>
                <el-form-item prop="code">
                    <el-row>
                        <el-col :span="18" >
                            <el-input style="height: 40px" v-model="loginData.code"></el-input>
                        </el-col>
                        <el-col :span="5">
                            <img src="http://http://127.0.0.1:7001/imagecode" ref="imgCode" @click="getImgCode" style="width: 120px;margin-left: 20px; height: 40px">
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="width: 100%;" @click="formValidate">立即登录</el-button>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col :span="18">
                            <el-button @click="jump" type="text">没有账号？去注册</el-button>
                        </el-col>
                        <el-col :span="6">
                            <span class="iconfont icon-github">
                                <a class="github-btn" href="http://127.0.0.1:7001/github"></a>
                             </span>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>

    import {Vue, Component} from 'vue-property-decorator';
    import {loginUser} from "../api/index.ts";
    @Component({
        // 如果在类中找不到需要添加的内容, 那么就可以写在这个地方
        name: 'login',

    })
    export default class login extends Vue {
        loginData = {
            username:"",
            email:'',
            phone:'',
            password: '',
            code:'',
            checked:false,
            type:'normal'
        };
        userInfo = '';
        validateUsername = (rule, value, callback) => {
            let reg = /^[A-Za-z0-9]{7,}$/;
            if (!value) {
                callback(new Error('请填写用户名'));
            } else if (value.length < 7) {
                callback(new Error('用户名至少是7位'));
            } else if (!reg.test(value)) {
                callback(new Error('用户名必须是数字字母组合'));
            } else {
                callback();
            }
        };
        validateUsername = (rule, value, callback) => {
            let normaReg = /^[A-Za-z0-9]{7,}$/;
            let emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            let phoneReg = /^1[3456789]\d{9}$/;
            if (!value) {
                callback(new Error('请填写用户名'));
            } else if (emailReg.test(value)) {
                this.loginData.type = 'email';
                this.loginData.email = this.loginData.username;
                callback();
            } else if (phoneReg.test(value)) {
                this.loginData.type = 'phone';
                this.loginData.phone = this.loginData.username;
                callback();
            } else if (normaReg.test(value)){
                this.loginData.type = 'normal';
                callback();
            }else {
                callback(new Error('用户名格式不正确'));
            }
        };
        validatePassword (rule, value, callback) {
            let reg = /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,\.#%'\+\*\-:;^_`].*))[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,}$/;
            if (!value) {
                callback(new Error('请填写密码'));
            } else if (value.length < 8) {
                callback(new Error('密码至少是8位'));
            } else if (!reg.test(value)) {
                callback(new Error('密码必须是数字字母符号组合'));
            } else {
                callback();
            }
        };
        validateCode (rule, value, callback) {
            let reg = /^[A-Za-z0-9]{4}$/;
            if (!value) {
                callback(new Error('请填写验证码'));
            } else if (value.length < 4) {
                callback(new Error('验证码必须是4位'));
            } else if (!reg.test(value)) {
                callback(new Error('验证码格式不正确'));
            } else {
                callback();
            }
        };
        rules= {
            username: [
                { validator: this.validateUsername, trigger: 'blur' }
            ],
            password: [
                { validator: this.validatePassword, trigger: 'blur' }
            ],
            code: [
                { validator: this.validateCode, trigger: 'blur' }
            ],
            checked: [
                { validator: this.validateCheck, trigger: 'change' }
            ]
        };
        formValidate() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    loginUser(this.loginData).then(data => {
                        if (data.status === 200) {
                            this.userInfo = data.result;
                            sessionStorage.setItem("user",JSON.stringify(this.userInfo));
                            this.$message.success('登录成功');
                            this.$router.push('/home');
                        } else {
                            this.$message.error(data.msg);
                            this.getImgCode();
                        }
                    }).catch(e => {
                        this.$message.error(e.message);
                        this.getImgCode();
                    });
                } else {
                    this.$message.error('请正确输入注册信息');
                }
            })
        }
        getImgCode(){
            this.$refs.imgCode.src = `http://127.0.0.1:7001/imagecode?r=${Math.random()}`;
        };
        jump() {
            this.$router.push('/register');
        }
    }
</script>
<style lang="scss" scoped>
    .login-container {
        width: 100%;
        height: 100%;
        background: url("../assets/004.jpg") no-repeat;
        background-size: cover;
        .login-box{
            width: 630px;
            height: 420px;
            background-color: #fff;
            border-radius: 10px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            h1{
                text-align: center;
            }
            .el-form{
                padding: 30px;
                box-sizing: border-box;
                span{
                    display: block;
                    width: 40px;
                    height: 40px;
                    position: relative;
                    top: 0;
                    left: 50px;
                    a{
                        display: block;
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                    }
                }
            }
            a{
                text-decoration: none;
                color: black;
            }
        }
    }
</style>
