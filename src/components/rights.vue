<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/users' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
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
                            <el-button type="primary" class="add-user" @click="addRole">添加权限</el-button>
                        </el-form-item>
                    </el-form>
                </div></el-col>
            </el-row>
            <el-table
                    :data="tableData"
                    stripe
                    border
                    style="width: 100%">
                <el-table-column
                        prop="rightName"
                        label="权限名称">
                </el-table-column>
                <el-table-column
                        prop="rightDesc"
                        label="权限描述">
                </el-table-column>
                <el-table-column
                        prop="level"
                        label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
                        <el-tag type="info" v-else-if="scope.row.level == 2">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="rightState"
                        label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                @change="changeStatus(scope.row)"
                                v-model="scope.row.rightState"
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
                title="添加权限"
                :visible.sync="addDialogVisible"
                width="30%">
            <el-form ref="form" label-position="right" label-width="0" :rules="rules" :model="addData">
                <el-form-item prop="rightName">
                    <el-input prefix-icon="el-icon-user" placeholder="请选择权限名称" v-model="addData.rightName"></el-input>
                </el-form-item>
                <el-form-item prop="rightDesc">
                    <el-input prefix-icon="el-icon-message" placeholder="请选择权限描述" v-model="addData.rightDesc"></el-input>
                </el-form-item>
                <el-form-item prop="rightType">
                    <el-select v-model="addData.rightType" placeholder="-请选择权限类型-">
                        <el-option
                                v-for="item in typeList"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="rightPath">
                    <el-input prefix-icon="el-icon-message" placeholder="请选择权限路径" v-model="addData.rightPath"></el-input>
                </el-form-item>
                <el-form-item prop="level">
                    <el-select v-model="addData.level" placeholder="-请选择权限等级-">
                        <el-option
                                v-for="item in levelList"
                                :key="item.id"
                                :label="item.levelName"
                                :value="item.level">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="rightMethod">
                    <el-select v-model="addData.rightMethod" placeholder="-请选择权限功能-">
                        <el-option
                                v-for="item in methodList"
                                :key="item.id"
                                :label="item.methodName"
                                :value="item.method">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertRole">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
                title="编辑权限"
                :visible.sync="editDialogVisible"
                width="30%">
            <el-form ref="editForm" label-position="right" label-width="0" :rules="rules" :model="editData">
                <el-form-item prop="rightName">
                    <el-input prefix-icon="el-icon-user" placeholder="请选择权限名称" v-model="editData.rightName"></el-input>
                </el-form-item>
                <el-form-item prop="rightDesc">
                    <el-input prefix-icon="el-icon-message" placeholder="请选择权限描述" v-model="editData.rightDesc"></el-input>
                </el-form-item>
                <el-form-item prop="rightType">
                    <el-select v-model="editData.rightType" placeholder="-请选择权限类型-">
                        <el-option
                                v-for="item in typeList"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="rightPath">
                    <el-input prefix-icon="el-icon-message" placeholder="请选择权限路径" v-model="editData.rightPath"></el-input>
                </el-form-item>
                <el-form-item prop="level">
                    <el-select v-model="editData.level" placeholder="-请选择权限等级-">
                        <el-option
                                v-for="item in levelList"
                                :key="item.id"
                                :label="item.levelName"
                                :value="item.level">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="rightMethod">
                    <el-select v-model="editData.rightMethod" placeholder="-请选择权限功能-">
                        <el-option
                                v-for="item in methodList"
                                :key="item.id"
                                :label="item.methodName"
                                :value="item.method">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>


            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import {Vue, Component} from 'vue-property-decorator';
    import {addRights,delRights,editRights,getRights} from "@/api";
    @Component({
        // 如果在类中找不到需要添加的内容, 那么就可以写在这个地方
        name: 'Rights',
        components: {

        }
    })
    export default class Right extends Vue {
        addData = {
            rightName: '',
            rightDesc: '',
            rightType:'',
            rightPath:'',
            level:'',
            rightMethod:''
        };
        typeList = [
            {type:'menu',typeName:'菜单权限',id:0},
            {type:'router',typeName:'路由权限',id:1},
            {type:'action',typeName:'请求权限',id:2}
        ];
        levelList = [
            {level:0,levelName:'一级',id:1_1},
            {level:1,levelName:'二级',id:1_2},
            {level:2,levelName:'三级',id:2_3}
        ];
        methodList = [
            {method:null,methodName:'全部',id:20},
            {method:'post',methodName:'新增',id:21},
            {method:'delete',methodName:'删除',id:22},
            {method:'put',methodName:'修改',id:23},
            {method:'get',methodName:'查看',id:24}
        ];
        editData = {
            rightName: '',
            rightDesc: '',
            rightType:'',
            rightPath:'',
            level:'',
            rightMethod:''
        };
        tableData= [];
        addDialogVisible = false;
        editDialogVisible = false;
        searchData = {
            key:'',
            currentPage: 1,
            pageSize: 8
        };
        tableCount = 0;
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
            delRights(id).then( data => {
                if (data.status === 200) {
                    this.getList();
                    this.$message.success('删除权限成功');
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
            editRights(user).then(data => {
                if (data.status === 200) {
                    let index = this.tableData.findIndex(res => {
                        return res.id === user.id;
                    });
                    this.$set(this.tableData,index,user);
                    this.$message.success('编辑权限状态成功');
                } else {
                    this.$message.error('编辑权限状态成功');
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
        editRole() {
            this.editDialogVisible = false;
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    editRights(this.editData).then(data => {
                        if (data.status === 200) {
                            let index = this.tableData.findIndex(res => {
                                return res.id === this.editData.id;
                            });
                            this.$set(this.tableData,index,this.editData);
                            this.editData = Object.assign(this.editData,data);
                            this.$message.success('编辑权限成功');
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
            this.$refs.form.validate(valid => {
                if (valid) {
                    addRights(this.addData).then(data => {
                        if (data.status === 200) {
                            this.addDialogVisible = false;
                            this.getList();
                            this.$message.success('添加权限成功');
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
            getRights(this.searchData).then(res => {
                if (res.status === 200) {
                    this.tableData = res.result.rights;
                    this.tableCount = res.result.count;
                }
            }).catch(e => {
                this.$message.error(e.message);
            })
        }
        created() {
            this.getList();
        }
        rules= {
            rightName: [
                { required: true, message: '请输入权限名称', trigger: 'blur' },
                { min: 2,  message: '长度至少2个字符', trigger: 'blur' }
            ],
            rightDesc: [
                { required: true, message: '请输入权限描述', trigger: 'blur' },
                { min: 2,  message: '长度至少2个字符', trigger: 'blur' }
            ],
            rightType: [
                { required: true, message: '请选择权限类型', trigger: 'change' }
            ],
            rightPath: [
                { required: false, message: '请输入权限路径', trigger: 'blur' },
                { min: 2,  message: '长度至少6个字符', trigger: 'blur' }
            ],
            level: [
                { required: true, message: '请选择权限等级', trigger: 'change' }
            ],
            rightMethod: [
                { required: false, message: '请选择权限功能', trigger: 'change' }
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
</style>
