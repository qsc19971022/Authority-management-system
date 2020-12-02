<template>
    <el-form ref="form" label-position="right" label-width="0" :rules="rules" :model="registerData">
        <el-form-item prop="phone">
            <el-input prefix-icon="el-icon-mobile-phone" v-model="registerData.phone"></el-input>
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
                    <el-button type="success" :disabled="button"  ref="codeButton" @click="getCode" class="email-button">获取验证码</el-button>
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

    import {Vue, Component, Ref} from 'vue-property-decorator';
    import {registerPhoneCode,registerUser} from "../api/index";

    @Component({
        // 如果在类中找不到需要添加的内容, 那么就可以写在这个地方
        name: 'emailUser',
        components: {

        }
    })
    export default class normalUser extends Vue {
        registerData = {
            phone:'',
            password:'',
            code:'',
            checked:false,
            type:'phone'
        };
        button = false;
        flag = true;
        validatePhone = (rule, value, callback) => {
            let reg = /^1[3456789]\d{9}$/;
            if (!value) {
                this.flag = false;
                callback(new Error('手机号码不能为空'));
            } else if (value.length < 11) {
                this.flag = false;
                callback(new Error('手机号码至少是11位'));
            } else if (!reg.test(value)) {
                this.flag = false;
                callback(new Error('手机号码格式不正确'));
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
                        }
                    }).catch(e => {
                        this.$message.error(e.message);
                    });
                } else {
                    this.$message.error('请正确输入注册信息');
                }
            })
        }
        rules= {
            phone: [
                { validator: this.validatePhone, trigger: 'blur' }
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
        getCode(){
            if (this.flag) {
                registerPhoneCode(this.registerData).then(data => {
                    if (data.status === 200) {
                        this.$message.success('验证码发送成功');
                        this.button = true;
                    } else {
                        this.$message.error(data.msg);
                    }
                }).catch(e => {
                    this.$message.error(e.message);
                });
            }
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
