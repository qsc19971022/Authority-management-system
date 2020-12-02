<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
            <el-row>
                <el-col><div class="grid-content bg-purple">
                    <el-form :inline="true" :model="searchData" class="demo-form-inline">
                        <el-form-item>
                            <el-input style="width: 500px" v-model="searchData.key" placeholder="关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="search">查询</el-button>
                            <el-button type="primary" class="add-user" @click="addRole">添加角色</el-button>
                        </el-form-item>
                    </el-form>
                </div></el-col>
            </el-row>
            <el-table
                    :data="tableData"
                    stripe
                    :v-loading="loading"
                    border
                    style="width: 100%">
                <el-table-column
                        prop="roleName"
                        label="角色名称">
                </el-table-column>
                <el-table-column
                        prop="roleDesc"
                        label="角色备注">
                </el-table-column>
                <el-table-column
                        prop="roleState"
                        label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                @change="changeStatus(scope.row)"
                                v-model="scope.row.roleState"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="showEditRole(scope.row)" icon="el-icon-edit"></el-button>
                        <el-button size="small" type="warning" @click="showAddRight(scope.row)" icon="el-icon-setting"></el-button>
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="deleteRole(scope.row)"></el-button>
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
                title="添加角色"
                :visible.sync="addDialogVisible"
                width="30%">
            <el-form ref="form" label-position="right" label-width="0" :rules="rules" :model="addData">
                <el-form-item prop="roleName">
                    <el-input prefix-icon="el-icon-user" v-model="addData.roleName"></el-input>
                </el-form-item>
                <el-form-item prop="roleDesc">
                    <el-input prefix-icon="el-icon-message" v-model="addData.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertRole">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="编辑"
                :visible.sync="editDialogVisible"
                width="30%">
            <el-form ref="editForm" label-position="right" label-width="0" :rules="rules" :model="editData">
                <el-form-item prop="roleName">
                    <el-input prefix-icon="el-icon-user" v-model="editData.roleName"></el-input>
                </el-form-item>
                <el-form-item prop="roleDesc">
                    <el-input prefix-icon="el-icon-message" v-model="editData.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="权限分配"
                :visible.sync="rightDialogVisible"
                width="30%">
            <el-tree
                    :data="defaultArray"
                    :props="defaultProps"
                    :default-expand-all="true"
                    show-checkbox
                    node-key="id"
                    ref="tree"
                    :default-checked-keys="defaultSelected">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRight">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import {Vue, Component} from 'vue-property-decorator';
    import {addRole,deleteRole,editRole,getRolesList,getAllRights,addRoleRights,deleteRoleRights} from "@/api";
    @Component({
        // 如果在类中找不到需要添加的内容, 那么就可以写在这个地方
        name: 'Roles',
        components: {

        }
    })
    export default class Roles extends Vue {
        addData = {
            roleName: '',
            roleDesc: ''
        };
        editData = {
            roleName: '',
            roleDesc: ''
        };
        loading = true;
        tableData= [];
        addDialogVisible = false;
        editDialogVisible = false;
        rightDialogVisible = false;
        defaultSelected = [49,56,58];
        searchData = {
            key:'',
            currentPage: 1,
            pageSize: 8
        };
        tableCount = 0;
        defaultProps = {
            children: 'children',
            label: 'rightName'
        };
        defaultArray = [];
        roleId = 0;
        selected = [];
        search() {
            this.getList();
        }
        addRole() {
            this.addDialogVisible = true;
            this.$nextTick( () => {
                this.$refs.form.resetFields();
            })
        }
        deleteRole(row) {
            let id = {id: row.id};
            deleteRole(id).then( data => {
                if (data.status === 200) {
                    this.getList();
                    this.$message.success('删除角色成功');
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
            editRole(user).then(data => {
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
        showEditRole(data) {
            this.editDialogVisible = true;
            this.$nextTick( () => {
                this.$refs.editForm.resetFields();
            });
            this.editData = Object.assign(this.editData,data);
        }
        showAddRight(row) {
            this.rightDialogVisible = true;
            this.defaultSelected = [];
            row.rights.map(item => {
                if (item.level === 2) {
                    this.defaultSelected.push(item.id);
                }
            });
            this.$nextTick( () => {
                this.$refs.tree.setCheckedKeys(this.defaultSelected);
                let selected1 = this.$refs.tree.getCheckedKeys();
                let selected2 = this.$refs.tree.getHalfCheckedKeys();
                this.selected = selected1.concat(selected2);// 选中选项
            });
            getAllRights().then(data => {
                if (data.status === 200) {
                    this.defaultArray = data.result;
                    this.roleId = row.id;
                    this.$message.success("权限列表获取成功");
                } else {
                    this.$message.error("获取权限列表失败");
                }
            } )
        }
        async addRight() {
            let selected1 = this.$refs.tree.getCheckedKeys();
            let selected2 = this.$refs.tree.getHalfCheckedKeys();
            let selected = selected1.concat(selected2);// 选中选项
            let addSelect = selected.filter(item => {   //  新增选项
                return !this.selected.includes(item);
            });
            let remainSelect = selected.filter(item => {  // 剩余的
                return this.defaultSelected.includes(item);
            });
            let deleteSelect = this.defaultSelected.filter(item => {  // 删除的
                return !remainSelect.includes(item);
            });
            let option = {
                roleId: this.roleId,
                rightsId: []
            };
            if (addSelect.length > 0) {
                option.rightsId = addSelect;
                addRoleRights(option).then(data => {
                    if (data.status === 200) {
                        this.rightDialogVisible = false;
                        this.$message.success("权限编辑成功");
                        option.rightsId = [];
                    } else {
                        this.$message.success("权限编辑失败");
                    }
                }).catch(e => {
                    this.$message.success(e.message);
                })
            }
            if (deleteSelect.length > 0) {
                option.rightsId = deleteSelect;
                deleteRoleRights(option).then(data => {
                    if (data.status === 200) {
                        this.rightDialogVisible = false;
                        this.$message.success("权限编辑成功");
                    } else {
                        this.$message.success("权限编辑失败");
                    }
                }).catch(e => {
                    this.$message.success(e.message);
                })
            }
        }
        editRole() {
            this.editDialogVisible = false;
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    editRole(this.editData).then(data => {
                        if (data.status === 200) {
                            let index = this.tableData.findIndex(res => {
                                return res.id === this.editData.id;
                            });
                            this.$set(this.tableData,index,this.editData);
                            this.$message.success('编辑角色成功');
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
        insertRole() {
            this.addDialogVisible = false;
            this.$refs.form.validate(valid => {
                if (valid) {
                    addRole(this.addData).then(data => {
                        if (data.status === 200) {
                            this.getList();
                            this.$message.success('添加角色成功');
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
        getList() {
            getRolesList(this.searchData).then(res => {
                if (res.status === 200) {
                    this.tableData = res.result.roles;
                    this.tableCount = res.result.count;
                    this.loading = false;
                }
            }).catch(e => {
                this.$message.error(e.message);
            })
        }
        created() {
            this.getList();
        }
        rules= {
            roleName: [
                { required: true, message: '请输入角色名称', trigger: 'blur' },
                { min: 2,  message: '长度至少2个字符', trigger: 'blur' }
            ],
            roleDesc: [
                { required: true, message: '请输入角色描述', trigger: 'blur' },
                { min: 2,  message: '长度至少2个字符', trigger: 'blur' }
            ],
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
