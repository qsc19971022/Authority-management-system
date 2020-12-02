<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="18"><div class="grid-content bg-purple">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline">
                        <el-form-item>
                            <el-select v-model="searchData.role" placeholder="所选角色">
                                <el-option label="-所有角色-" value=""></el-option>
                                <el-option label="管理员" value="manger"></el-option>
                                <el-option label="普通用户" value="normal"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="searchData.origin" placeholder="所有来源">
                                <el-option label="-所有来源-" value=""></el-option>
                                <el-option label="Github" value="github"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-select v-model="searchData.type" placeholder="所有用户">
                                <el-option label="-所有用户-" value=""></el-option>
                                <el-option label="用户名" value="username"></el-option>
                                <el-option label="手机" value="phone"></el-option>
                                <el-option label="邮箱" value="email"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="searchData.key" placeholder="关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search">查询</el-button>
                            <el-button type="primary" @click="exportResult">导出搜索结果</el-button>
                        </el-form-item>
                    </el-form>
                </div></el-col>
                <el-col :span="6"><div class="grid-content bg-purple">
                    <el-button type="primary" class="add-user" @click="addUser">添加用户</el-button>
                    <el-upload
                            style="display: inline-block;margin-left: 20px"
                            class="upload-excel"
                            action="api/v1/import/"
                            :show-file-list="false"
                            :on-success="handleExcelSuccess"
                            accept=".xlsx"
                            :before-upload="beforeExcelUpload">
                        <el-button type="primary">导入用户</el-button>
                    </el-upload>
                </div></el-col>
            </el-row>
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%">
                <el-table-column
                        type="index"
                        width="50">
                </el-table-column>
                <el-table-column
                        prop="username"
                        label="用户名"
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        width="180"
                        label="电话">
                </el-table-column>
                <el-table-column
                        prop="roleName"
                        label="角色">
                </el-table-column>
                <el-table-column
                        prop="status"
                        width="120"
                        label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                @change="changeStatus(scope.row)"
                                v-model="scope.row.status"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="showEditUser(scope.row)" icon="el-icon-edit"></el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteUser(scope.row)"></el-button>
                        <el-tooltip class="item" effect="dark" content="角色分配" :enterable="false" placement="top">
                            <el-button size="small" type="warning" @click="showRole(scope.row)" icon="el-icon-setting"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="searchData.currentPage"
                    :page-sizes="[8, 16]"
                    :page-size="searchData.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableCount">
            </el-pagination>
        </el-card>

        <el-dialog
                title="添加用户"
                :visible.sync="addDialogVisible"
                width="30%">
            <el-form ref="form" label-position="right" label-width="0" :rules="rules" :model="addData">
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="addData.username"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input prefix-icon="el-icon-message" v-model="addData.email"></el-input>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input prefix-icon="el-icon-phone" v-model="addData.phone"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" type="password" v-model="addData.password"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertUser">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="编辑"
                :visible.sync="editDialogVisible"
                width="30%">
            <el-form ref="editForm" label-position="right" label-width="0" :rules="editRules" :model="editData">
                <el-form-item style="text-align: center">
                    <el-upload
                            class="avatar-uploader"
                            action="http://127.0.0.1.com:7001/api/v1/upload/"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="editData" :src="'http://127.0.0.1:7001' + editData.avatar_url" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input prefix-icon="el-icon-user" v-model="editData.username"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input prefix-icon="el-icon-message" v-model="editData.email"></el-input>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input prefix-icon="el-icon-phone" v-model="editData.phone"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="el-icon-lock" type="password" v-model="editData.password"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="角色分配"
                :visible.sync="roleDialogVisible"
                width="30%">
            <el-form ref="form" :model="roleForm" label-width="80px">
                <el-form-item label="当前用户">
                    <el-input :disabled="true" v-model="roleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="用户角色">
                    <el-input :disabled="true" v-model="roleForm.role"></el-input>
                </el-form-item>
                <el-form-item label="新的角色">
                    <el-select v-model="value" placeholder="请选择用户角色">
                        <el-option
                                v-for="item in roleForm.roleName"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="delRole">删除角色</el-button>
    <el-button type="primary" @click="addRole">添加角色</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>

    import {Vue, Component} from 'vue-property-decorator';
    import {addUser,deleteUser,editUser,getUserList,getRolesList,addUserRole,delUserRole} from "@/api";
    import XLSX from 'xlsx';
    import { saveAs } from 'file-saver';
    @Component({
        // 如果在类中找不到需要添加的内容, 那么就可以写在这个地方
        name: 'User',
        components: {

        }
    })
    export default class User extends Vue {
        addData = {
            username: '',
            email: '',
            phone: '',
            password: ''
        };
        editData = {
            username: '',
            email: '',
            phone: '',
            password: '',
            avatar_url:''
        };
        tableData= [];
        addDialogVisible = false;
        editDialogVisible = false;
        searchData = {
            role:'',
            origin:'',
            type:'',
            key:'',
            currentPage: 1,
            pageSize: 8
        };
        tableCount = 0;
        roleDialogVisible = false;
        roleForm = {
            id:'',
            username:'',
            role:'',
            roleName:[]
        };
        value = '';
        search() {
            this.getList();
        }
        exportResult() {
            const users = this.tableData;
            const user = users.length ? users[0] : null;
            const data = [];
            if(user){
                const cloumnTitles = Object.keys(user);
                data.push(cloumnTitles);
                users.forEach((user)=>{
                    const temp = [];
                    cloumnTitles.forEach((key)=>{
                        temp.push(user[key]);
                    });
                    data.push(temp);
                });
            }
            const sheet = XLSX.utils.aoa_to_sheet(data);
            // 2.创建一个新的表格
            const workbook = XLSX.utils.book_new();
            // 3.把数据添加到表格中, 并给这个表格起一个名称
            XLSX.utils.book_append_sheet(workbook, sheet, 'user');
            // 4.将生成好的表格保存到本地
            // XLSX.writeFile(workbook, 'users.xls'); // 有兼容问题
            const wopts = { bookType:'xlsx', bookSST:false, type:'array' };
            const wbout = XLSX.write(workbook,wopts);
            saveAs(new Blob([wbout],{type:"application/octet-stream"}), "users.xlsx");
        }
        addUser() {
            this.addDialogVisible = true;
            this.$nextTick( () => {
                this.$refs.form.resetFields();
            })
        }
        deleteUser(row) {
            let id = {id: row.id};
            deleteUser(id).then( data => {
                if (data.status === 200) {
                    this.getList();
                    this.$message.success('删除用户成功');
                } else {
                    this.$message.error(data.result.msg);
                }
            }).catch( error => {
                this.$message.error(error.message)
            })
        }
        handleSizeChange(size) {
            this.searchData.pageSize = size;
            this.getList();
        }
        handleCurrentChange(currentSize) {
            this.searchData.currentPage = currentSize;
            this.getList();
        }
        changeStatus(user) {
            editUser(user).then(data => {
                if (data.status === 200) {
                    let index = this.tableData.findIndex(res => {
                        return res.id === user.id;
                    });
                    this.$set(this.tableData,index,user);
                    this.$message.success('编辑用户状态成功');
                } else {
                    this.$message.error('编辑用户状态成功');
                    user.status = !user.status;
                }
            }).catch(e => {
                this.$message.error(e.message);
            });
        }
        showEditUser(data) {
            this.editDialogVisible = true;
            this.$nextTick( () => {
                this.$refs.editForm.resetFields();
            });
            this.editData = Object.assign(this.editData,data);
        }
        editUser() {
            this.editDialogVisible = false;
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    editUser(this.editData).then(data => {
                        if (data.status === 200) {
                            let index = this.tableData.findIndex(res => {
                                return res.id === this.editData.id;
                            });
                            this.$set(this.tableData,index,this.editData);
                            this.$message.success('编辑用户成功');
                        } else {
                            this.$message.error(data.msg);
                        }
                    }).catch(e => {
                        this.$message.error(e.message);
                    });
                } else {
                    this.$message.error('请输入正确的表单格式');
                }
            })
        }
        insertUser() {
            this.addDialogVisible = false;
            this.$refs.form.validate(valid => {
                if (valid) {
                    addUser(this.addData).then(data => {
                        if (data.status === 200) {
                            this.getList();
                            this.$message.success('添加用户成功');
                        } else {
                            this.$message.error(data.msg);
                        }
                    }).catch(e => {
                        this.$message.error(e.message);
                    });
                } else {
                    this.$message.error('请输入正确的表单格式');
                }
            })
        }
        handleAvatarSuccess(res,file) {
            if (res.status === 200) {
                this.editData.avatar_url = res.result.filePath;
            }
        }
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
        handleExcelSuccess(res,file) {
            if (res.status === 200) {
                this.getList();
                this.$message.success('导入用户成功！');
            } else {
                this.$message.success(res.msg);
            }
        }
        beforeExcelUpload(file) {
            const isJPG = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传文件只能是 Excel 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
        showRole(row) {
            this.roleDialogVisible = true;
            this.roleForm.roleName = '请选择用户角色';
            getRolesList({}).then(res => {
                if (res.status === 200) {
                    this.roleForm.id = row.id;
                    this.roleForm.username = row.username;
                    this.roleForm.roleName = res.result.roles;
                    this.roleForm.role = row.roleName;
                    this.$message.success('获取角色成功');
                }
            }).catch(e => {
                this.$message.error(e.message);
            })
        }
        addRole() {
            let data = {
                userId: this.roleForm.id,
                roleId: this.value
            };
            if (this.value) {
                this.roleDialogVisible = false;
                addUserRole(data).then(data => {
                    if (data.status === 200) {
                        this.getList();
                        this.$message.success("角色分配成功");
                    } else {
                        this.$message.error("角色分配失败");
                    }
                }).catch(error => {
                    this.$message.error("角色分配失败");
                })
            } else {
                this.$message.warning("请选择要分配的角色");
            }
        }
        delRole() {
            let data = {
                userId: this.roleForm.id,
                roleId: this.value
            };
            if (this.value) {
                this.roleDialogVisible = false;
                delUserRole(data).then(data => {
                    if (data.status === 200) {
                        this.getList();
                        this.$message.success("角色删除成功");
                    } else {
                        this.$message.error("角色删除失败");
                    }
                }).catch(error => {
                    this.$message.error("角色删除失败");
                })
            } else {
                this.$message.warning("请选择要分配的角色");
            }
        }
        getList() {
            getUserList(this.searchData).then(res => {
                if (res.status === 200) {
                    this.tableData = res.result.users;
                    this.tableData.map(item => {
                       let roles = '';
                       item.roles.map(data => {
                          roles += data.roleName + ' ';
                        });
                        item.roleName = roles;
                    });
                    this.tableCount = res.result.count;
                }
            }).catch(e => {
                this.$message.error(e.message);
            })
        }
        created() {
            this.getList();
        }
        validateUsername = (rule, value, callback) => {
            let reg = /^[A-Za-z0-9/-]{7,}$/;
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
        validatePhone = (rule, value, callback) => {
            let reg = /^1[3456789]\d{9}$/;
            if (value && !reg.test(value)) {
                callback(new Error('手机号码格式不正确'));
            }  else {
                callback();
            }
        };
        validateEmail = (rule, value, callback) => {
            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (value && !reg.test(value)) {
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
        validateEditPassword (rule, value, callback) {
            let reg = /^(?:(?=.*[0-9].*)(?=.*[A-Za-z].*)(?=.*[,\.#%'\+\*\-:;^_`].*))[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,}$/;
            if (value && !reg.test(value)) {
                callback(new Error('密码必须是数字字母符号组合'));
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
            email: [
                { validator: this.validateEmail, trigger: 'blur' }
            ],
            phone: [
                { validator: this.validatePhone, trigger: 'blur' }
            ]
        };
        editRules= {
            username: [
                { validator: this.validateUsername, trigger: 'blur' }
            ],
            password: [
                { validator: this.validateEditPassword, trigger: 'blur' }
            ],
            email: [
                { validator: this.validateEmail, trigger: 'blur' }
            ],
            phone: [
                { validator: this.validatePhone, trigger: 'blur' }
            ]
        };
    }
</script>
<style lang="scss" scoped>
    .el-breadcrumb{
        padding-bottom: 20px;
    }
    .el-card{
        min-height: 400px;
    }
    .add-user{
        margin-left: -20px;
    }
    .el-table{
        margin-bottom: 20px;
    }
    .avatar-uploader {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
