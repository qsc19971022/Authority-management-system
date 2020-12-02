<template>
    <el-container>
        <el-header>
            <div class="header-left">团学班级成员管理系统</div>
            <div class="header-right">
                <img :src="`http://127.0.0.1:7001${userInfo.avatar_url}`">
                <p>{{userInfo.username || userInfo.email || userInfo.phone }}</p>
                <el-button @click="exit">退出</el-button>
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px"><el-menu
                    :default-active="pathUrl"
                    class="el-menu-vertical-demo"
                    background-color="#fff"
                    text-color="#666"
                    :router="true"
                    active-text-color="#409EFF">
                <el-submenu :index="item.rightName" v-for="item in roles" :key="item.rightName">
                    <template slot="title">
                        <i :class="item.rightIcon"></i>
                        <span>{{item.rightName}}</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item  @click="defaultActive(data.rightPath)" :index="data.rightPath" v-for="data in item.children" :key="data.rightPath">
                            <template slot="title">
                                <i :class="data.rightIcon"></i>
                                <span>{{data.rightName}}</span>
                            </template>
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
            </el-menu></el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>

    import {Vue, Component} from 'vue-property-decorator';
    import Cookies from 'js-cookie';
    @Component({
        // 如果在类中找不到需要添加的内容, 那么就可以写在这个地方
        name: 'Home',
        components: {

        }
    })
    export default class Home extends Vue {
        roles = [];
        pathUrl = '';
        userInfo = {};
        exit() {
            Cookies.remove('token');
            this.$router.push('/login');
            sessionStorage.removeItem('pathUrl');
            sessionStorage.removeItem('user');
        }
        defaultActive(path){
            this.pathUrl = path;
            sessionStorage.setItem('pathUrl',path);
        }
        mounted(){
            this.pathUrl = sessionStorage.getItem('pathUrl');
            this.userInfo = JSON.parse(sessionStorage.getItem('user'));
            this.userInfo.allRights.map(item => {
                if (item.rightType === 'menu') {
                    this.roles = item.children;
                }
            })
        }
    }
</script>
<style lang="scss" scoped>
    .el-container{
        background-color: #f6f6f6;
        width: 100%;
        height: 100%;
        .el-header{
            display: flex;
            background-color: #409EFF;
            justify-content: space-between;
            align-items: center;
            .header-left{
                color: #fff;
                font-size: 30px;
                font-weight: bolder;
                font-family: "Apple LiSung";
            }
            .header-right{
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 0 10px;
                img{
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    overflow: hidden;
                    margin-right: 6px;
                }
                p{
                    color: white;
                    margin-right: 40px;
                }
            }
        }
        .el-aside{
            height: 100%;
            background-color: #fff;
        }
    }

</style>
