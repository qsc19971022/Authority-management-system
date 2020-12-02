<template>
    <el-form ref="form" label-position="right" label-width="0" :rules="rules" :model="registerData">
        <el-form-item prop="email">
            <el-input prefix-icon="el-icon-message" v-model="registerData.phone"></el-input>
        </el-form-item>
        <el-form-item prop="password">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="registerData.password"></el-input>
        </el-form-item>
        <el-form-item prop="code">
            <el-row>
                <el-col :span="18" >
                    <el-input style="height: 40px" v-model="registerData.code"></el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="success" class="email-button">获取验证码</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" style="width: 100%;" @click="formValidate">立即注册</el-button>
        </el-form-item>
        <el-form-item prop="checked">
            <el-checkbox v-model="registerData.checked">
                <p>
                    阅读并接受
                    <a href="javascript:;">《用户协议》</a>
                    及
                    <a href="javascript:;">《用户隐私权保护声明》</a>
                </p>
            </el-checkbox>
        </el-form-item>
    </el-form>
</template>

<script>

    import {Vue, Component, Watch} from 'vue-property-decorator';
    import {registerUser} from "../api/index";

    @Component({
        // 如果在类中找不到需要添加的内容, 那么就可以写在这个地方
        name: 'emailUser',
        components: {

        }
    })
    export default class normalUser extends Vue {
        registerData = {
            email:'',
            password:'',
            code:'',
            checked:false,
            type:'email'
        };
        validateEmail = (rule, value, callback) => {
            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (!value) {
                callback(new Error('邮箱不能为空'));
            } else if (value.length < 7) {
                callback(new Error('邮箱至少是7位'));
            } else if (!reg.test(value)) {
                callback(new Error('邮箱格式不正确'));
            } else {
                callback();
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
            let reg = /^[0-9]{6}$/;
            if (!value) {
                callback(new Error('请填写验证码'));
            } else if (value.length < 6) {
                callback(new Error('验证码必须是6位'));
            } else if (!reg.test(value)) {
                callback(new Error('验证码格式不正确'));
            } else {
                callback();
            }
        };
        validateCheck (rule, value, callback) {
            if (!value) {
                callback(new Error('请选择用户协议'));
            } else {
                callback();
            }
        };
        formValidate() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    registerUser(this.registerData).then(data => {
                        if (data.status === 200) {
                            this.$router.push('/login');
                            this.$message.success('注册成功');
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
        rules= {
            email: [
                { validator: this.validateEmail, trigger: 'blur' }
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
        getImgCode(){
            this.$refs.imgCode.src = `http://127.0.0.1:7001/imagecode?r=${Math.random()}`;
            // this.imgCode.src = 'http://127.0.0.1:7001/getcode';
        };
        resetForm() {
            this.$refs.form.resetFields();
        }
    }
</script>
<style scoped>
    a{
        text-decoration: none;
        color: black;
    }
    .email-button{
        margin-left: 14px;
    }
</style>
