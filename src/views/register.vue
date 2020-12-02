<template>
    <div class="register-container">
        <div class="register-box">
            <h1>欢迎注册</h1>
            <el-tabs tab-position="left" style="height: 330px;" @tab-click="handleClick">
                <el-tab-pane label="普通注册">
                    <normalUser ref="normalUser"></normalUser>
                </el-tab-pane>
                <el-tab-pane label="邮箱注册">
                    <emailUser ref="emailUser"></emailUser>
                </el-tab-pane>
                <el-tab-pane label="短信注册">
                    <phoneUser ref="phoneUser"></phoneUser>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>

    import {Vue, Component, Watch} from 'vue-property-decorator';
    import normalUser from '../components/normalUser';
    import emailUser from '../components/emailUser';
    import phoneUser from "@/components/phoneUser";
    @Component({
        // 如果在类中找不到需要添加的内容, 那么就可以写在这个地方
        name: 'register',
        components: {
            normalUser,
            emailUser,
            phoneUser
        }
    })
    export default class Register extends Vue {
        handleClick(tab, event) {
            this.$refs.normalUser.resetForm();
            this.$refs.emailUser.resetForm();
            this.$refs.phoneUser.resetForm();
        }

    }
</script>
<style lang="scss" scoped>
    .register-container {
        width: 100%;
        height: 100%;
        background: url("../assets/004.jpg") no-repeat;
        background-size: cover;
        .register-box{
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
                padding-right: 20px;
                box-sizing: border-box;
            }
            a{
                text-decoration: none;
                color: black;
            }
        }
    }
</style>
