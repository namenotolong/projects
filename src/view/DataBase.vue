<template>
    <div id="app">
        <div>
            <el-header style="text-align: left; font-size: 12px; background-color: white;">
                <el-button type="primary" @click="addConnDialog = true">
                    新建查询
                </el-button>
            </el-header>
            <div>
                <el-container style=" border: 1px solid #eee">
                    <el-aside v-if="showLeft" width="10%" style="background-color: rgb(238, 241, 246)">

                        <el-menu style="background-color: rgb(238, 241, 246)" @open="handleOpen">
                            <el-submenu index="1">
                                <template slot="title">
                                    <span>我的连接</span>
                                </template>
                                <div v-for="data in connections" :key="data.id">
                                    <el-dropdown style="width: 100%;" @command="handleCommand($event, data)" placement="bottom">
                                        <el-menu-item :index="data.name" @click="refreshDb(data.id)">
                                            {{data.name}}
                                        </el-menu-item>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="edit">编辑</el-dropdown-item>
                                            <el-dropdown-item command="delete">删除</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </el-submenu>
                        </el-menu>
                    </el-aside>
                    <el-aside v-if="showLeft" width="10%">
                        <el-table :data="curDbs" border style="width: 100%" @cell-click="dbClick">
                            <el-table-column prop="database" label="库">
                            </el-table-column>
                        </el-table>
                        <!-- <el-tree v-if="curDbTables.length > 0" @node-click="dbNodeClick" :props="props" :data="curDbTables">
                    </el-tree> -->
                    </el-aside>
                    <el-aside v-if="showLeft" width="15%">
                        <el-table :data="curTables" border style="width: 100%" @cell-click="tableClick">
                            <el-table-column label="表">
                                <template slot-scope="scope">
                                    <el-dropdown style="width: 100%;" @command="handleTableCommand($event, scope.row)" placement="bottom-start">
                                        <span style="width: 100%;">{{ scope.row.table }}</span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="desc">查看结构</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-aside>
                    <el-container v-if="editableTabs.length > 0">
                        <el-header style="text-align: left; font-size: 12px;">
                            <el-button @click="runSql">运行</el-button>
                            <el-button @click="checkRunSql">选中运行</el-button>
                            <el-button v-if="showLeft" @click="showLeft = false">收起侧边</el-button>
                            <el-button v-if="!showLeft" @click="showLeft = true">打开侧边</el-button>
                        </el-header>
                        <el-main>
                            <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab"
                                @tab-click="clickTab">
                                <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :label="item.title"
                                    :name="item.name">
                                </el-tab-pane>
                                <codemirror v-if="curClickTab != null" v-model="curClickTab.sqlContent"
                                    :options="cmOptions" />
                            </el-tabs>
                            <div v-if="curClickTab != null 
                          && curClickTab.success == true
                           && curClickTab.showTableData != null
                           && curClickTab.tableMeta
                            && curClickTab.tableMeta.length > 0">
                                <el-table v-if="curClickTab != null 
                              && curClickTab.success == true
                               && curClickTab.showTableData != null
                               && curClickTab.tableMeta
                                && curClickTab.tableMeta.length > 0" :data="curClickTab.showTableData"
                                    style="width: 100%;" @header-click="celldblclick">
                                    <el-table-column v-for="item in curClickTab.tableMeta" :key="item.label"
                                        :prop="item.label" :label="item.label" width="180">
                                    </el-table-column>
                                </el-table>
                                <el-pagination v-if="curClickTab != null" @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange" :current-page="curClickTab.currentPage"
                                    :page-sizes="[10, 20, 100, 200, 300, 400]" :page-size="curClickTab.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="curClickTab.tableData.length">
                                </el-pagination>
                            </div>
                            <div v-else>
                                <span v-if="curClickTab && curClickTab.success == false">{{curClickTab.errorMsg}}</span>
                                <span v-else>查询中……</span>
                            </div>
                        </el-main>
                    </el-container>
                </el-container>
            </div>

        </div>

        <div>
            <el-dialog title="添加连接" :visible.sync="addConnDialog">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="连接名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="连接类型" prop="dbType">
                        <el-select v-model="ruleForm.dbType" placeholder="请选择连接类型">
                            <el-option v-for="item in supportTypes" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主机" prop="host">
                        <el-input v-model="ruleForm.host"></el-input>
                    </el-form-item>
                    <el-form-item label="用户" prop="loginUser">
                        <el-input v-model="ruleForm.loginUser"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="ruleForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>

        <div>
            <el-dialog title="编辑连接" :visible.sync="editConnDialog">
                <el-form :model="editConnForm" :rules="rules" ref="editConnForm" label-width="100px"
                    class="demo-ruleForm">
                    <el-form-item label="连接名称" prop="name">
                        <el-input v-model="editConnForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="连接类型" prop="dbType">
                        <el-select v-model="editConnForm.dbType" placeholder="请选择连接类型">
                            <el-option v-for="item in supportTypes" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主机" prop="host">
                        <el-input v-model="editConnForm.host"></el-input>
                    </el-form-item>
                    <el-form-item label="用户" prop="loginUser">
                        <el-input v-model="editConnForm.loginUser"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="editConnForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitUpdateForm('editConnForm')">更新</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>

        <div>
            <el-dialog title="表结构" :visible.sync="tableDetailDiaglog">
                <div v-if="tableDetail && tableDetail.columnList">
                    <h3>字段结构</h3>
                    <el-table :data="tableDetail.columnList" style="width: 100%">
                        <el-table-column prop="name" label="名称">
                        </el-table-column>
                        <el-table-column prop="type" label="类型">
                        </el-table-column>
                        <el-table-column prop="autoIncrement" label="自增">
                        </el-table-column>
                        <el-table-column prop="size" label="长度">
                        </el-table-column>
                        <el-table-column prop="digits" label="精度">
                        </el-table-column>
                        <el-table-column prop="nullable" label="空值">
                        </el-table-column>
                        <el-table-column prop="defaultValue" label="默认值">
                        </el-table-column>
                        <el-table-column prop="remarks" label="备注">
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="tableDetail && tableDetail.indexList">
                    <h3>索引</h3>
                    <el-table :data="tableDetail.indexList" style="width: 100%">
                        <el-table-column prop="name" label="名称">
                        </el-table-column>
                        <el-table-column prop="fields" label="字段列表">
                        </el-table-column>
                        <el-table-column prop="unique" label="唯一">
                        </el-table-column>
                    </el-table>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
  
<script>
import { codemirror } from 'vue-codemirror'

import { listConns, deleteConn, updateConn, saveConn, listDbs, runSql, listTables, listSupportTypes, tableDetail } from '../api/database'
export default {
    components: {
        codemirror
    },
    props: ['conversation'],
    created() {

    },
    data() {
        return {
            tableDetailDiaglog: false,
            tableDetail: null,
            showLeft: true,
            //menu
            props: {
                label: 'name',
                children: 'tables',
                isLeaf: 'leaf'
            },
            cmOptions: {
                tabSize: 30,
                mode: 'text/x-sql   ',  // 模式
                theme: 'idea',  // 主题
                lineNumbers: true,  // 是否显示行数
                line: true,
                viewportMargin: Infinity,  // 处理高度自适应时搭配使用
                highlightDifferences: true,
                autofocus: false,
                indentUnit: 2,
                smartIndent: true,
                readOnly: false,  // 只读
                showCursorWhenSelecting: true,
                firstLineNumber: 1,
                // 更多配置查询 https://codemirror.net/doc/manual.html#config

                matchBrackets: true,
                lineMapping: true, //自动换行   
                styleActiveLine: true,
                extraKeys: { // 触发按键
                    'Ctrl': 'autocomplete'
                },
                hintOptions: { // 自定义提示选项
                    completeSingle: false, // 当匹配只有一项的时候是否自动补全
                    tables: {
                        users: ['name', 'score', 'birthDate'],
                        countries: ['name', 'population', 'size'],
                        score: ['zooao']
                    }
                }
            },
            codeSnippets: "",
            editableTabsValue: '',
            editableTabs: [],
            tabIndex: 0,
            //联动更新数据
            connections: [],
            curClickConnection: {},
            //当前连接的数据库
            curDbs: [],
            curTables: [],
            //当前sql内容
            sqlContent: '',
            //tabs map key: connId + '-' + dbName, value : tab
            edittableTabsMap: new Map(),
            edittableTabsNameMap: new Map(),
            curClickTab: null,

            //result

            //添加连接表单
            addConnDialog: false,
            editConnDialog: false,
            supportTypes: ['MYSQL', 'ORACLE'],
            ruleForm: {
                name: '',
                dbType: '',
                host: '',
                loginUser: '',
                password: ''
            },
            editConnForm: {},
            rules: {
                name: [
                    { required: true, message: '请输入连接名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                dbType: [
                    { required: true, message: '请选择连接类型', trigger: 'change' }
                ],
                host: [
                    { required: true, message: '请填写主机地址', trigger: 'blur' }
                ],
                loginUser: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' }
                ]
            }
        }
    },
    destroyed() {
        window.onbeforeunload = null
    },

    mounted() {
        this.listTypes();
        window.onbeforeunload = function (e) {
            e = e || window.event;
            // 兼容IE8和Firefox 4之前的版本
            if (e) {
                e.returnValue = '关闭提示';
            }
            // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
            return '关闭提示';
        }
    },

    methods: {
        //table menu
        async handleTableCommand(command, data) {
            if (command === 'desc') {
                const result = await tableDetail(data)
                if (result.columnList && result.columnList.length > 0) {
                    this.tableDetailDiaglog = true;
                    this.tableDetail = result;
                } else {
                    this.$message({ message: '表结构为空', type: 'error' })
                }

            }
        },
        //munu
        handleCommand(command, data) {
            if (command === 'edit') {
                this.editConnForm = data;
                this.editConnDialog = true;
            } else if (command === 'delete') {
                this.$confirm('确认删除吗？')
                    .then(_ => {
                        this.deletConn(data.id)
                    })
                    .catch(_ => { });
            }
        },
        //复制
        celldblclick(column, event) {
            let save = function (e) {
                e.clipboardData.setData('text/plain', column.label);
                e.preventDefault();//阻止默认行为
            }
            document.addEventListener('copy', save);
            document.execCommand("copy");
            document.removeEventListener('copy', save);
            this.$message({ message: '复制成功', type: 'success' }) //加提示
        },

        //
        async listTypes() {
            this.supportTypes = await listSupportTypes()
        },
        handleSizeChange(val) {
            this.curClickTab.pageSize = val;
            this.handleCurrentChange(1)
        },
        handleCurrentChange(val) {
            if (this.curClickTab.success == false) {
                this.curClickTab.showTableData = [];
                return;
            }
            this.curClickTab.currentPage = val;
            if (!this.curClickTab || !this.curClickTab.tableData) {
                this.curClickTab.showTableData = [];
                return;
            }
            if (this.curClickTab.tableData.length < 1) {
                this.curClickTab.showTableData = [];
                return;
            }
            let skipSize = (val - 1) * this.curClickTab.pageSize;

            this.curClickTab.showTableData = this.curClickTab.tableData.slice(skipSize, skipSize + this.curClickTab.pageSize)
        },
        //点击库
        async dbClick(row) {
            let tables = await listTables(row)
            this.curTables = tables;
        },
        async tableClick(obj) {
            //输入select预览
            let sqlContent = `select * from ${obj.table} limit 100`;
            let newTabName = ++this.tabIndex + '';
            let tabKey = obj.connId + "-" + obj.database + '-' + obj.table;
            let tab = this.edittableTabsMap.get(tabKey)
            if (tab == null) {
                tab = {
                    title: obj.database + "-" + obj.table,
                    name: newTabName,
                    sqlContent: sqlContent,
                    database: obj.database,
                    connId: obj.connId,
                    tableData: [],
                    tableMeta: [],
                    pageSize: 10,
                    currentPage: 1,
                    showTableData: [],
                    success: false,
                    errorMsg: '查询中'
                }
                this.editableTabs.push(tab);
                this.edittableTabsMap.set(tabKey, tab)
                this.edittableTabsNameMap.set(newTabName, tab)
                this.editableTabsValue = newTabName;
            } else {
                //切换tab
                tab.sqlContent = sqlContent
                this.editableTabsValue = tab.name;
            }
            this.curClickTab = tab;
            this.doQuery(sqlContent, tab)
        },
        handleOpen(key) {
            if (key == 1) {
                this.queryConns()
            }
        },
        //运行sql
        async executeSql(sql, connId, database) {
            const params = {
                sql: sql,
                connId: connId,
                database: database
            }
            const result = await runSql(params);
            return result;
        },
        //获取数据库
        async listDbs(id) {
            const rest = await listDbs(id)
            return rest;
        },
        //获取所有连接
        async queryConns() {
            const rest = await listConns()
            this.connections = rest
        },
        //删除连接
        async deletConn(id) {
            const res = await deleteConn(id)
            this.queryConns()
        },
        //编辑连接
        async editUpdateConn(data) {
            const rest = await updateConn(data)
            this.queryConns()
            this.editConnDialog = false
        },
        //新建连接
        async saveConn(data) {
            const rest = await saveConn(data)
            this.queryConns()
            this.addConnDialog = false
        },
        //new
        async refreshDb(id) {
            //获取连接数据库
            const rest = await this.listDbs(id)

            this.curDbs = rest
            this.curTables = [];
        },
        //移除tab
        removeTab(targetName) {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                            this.curClickTab = nextTab
                        }
                    }
                });
            }

            this.editableTabsValue = activeName;
            let key = null
            this.editableTabs = tabs.filter(tab => {
                let flag = tab.name !== targetName
                if (!flag) {
                    key = tab.connId + "-" + tab.database;
                }
                return flag;
            });
            if (key !== null) {
                this.edittableTabsMap.delete(key)
            }
            this.edittableTabsNameMap.delete(targetName)
        },
        clickTab(tab) {
            let tabObj = this.edittableTabsNameMap.get(tab.name)
            if (tabObj !== null) {
                this.curClickTab = tabObj;
                //this.handleCurrentChange(1)
            }
        },
        //运行sql
        runSql() {
            this.doQuery(this.curClickTab.sqlContent, this.curClickTab)
        },
        checkRunSql() {
            this.doQuery(window.getSelection().toString(), this.curClickTab)
        },
        async doQuery(sql, tab) {
            const result = await this.executeSql(sql, tab.connId, tab.database)
            //query
            tab.tableMeta = result.tableMeta
            tab.tableData = result.tableData
            tab.success = result.success;
            tab.errorMsg = result.errorMsg;
            tab.sqlContent = result.executeSql;
            this.handleCurrentChange(1)
        },

        //添加连接相关
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveConn(this.ruleForm)
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        submitUpdateForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editUpdateConn(this.editConnForm)
                }
            });
        },
    }
}

</script>

<style scoped>
.container div {
    margin-bottom: 20px;
    margin-top: 10px;
}

.el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
}

.el-aside {
    color: #333;
}

.CodeMirror {
    border: 1px solid #eee;
    height: auto;
    /* 编辑器盒子高度自适应 */
    width: 30%;
}


.conversation-info {
    height: 60px;
    padding: 0 10px 0;
    background-color: #e6e6e6;
}

.conversation-info .active {
    height: 60px;
    padding: 0 10px 0;
    background-color: #cfcfcf;
}

.conversation-info:hover {
    height: 60px;
    padding: 0 10px 0;
    background-color: #cfcfcf;
}

.conversation-info .menu {
    position: fixed;
    z-index: 1004;
    background-color: #fff;
    border-radius: 5px;
}

.conversation-info .wrapper {
    display: flex;
    height: 60px;
    padding: 0 5px;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
}

.el-badge {
    top: 4px;
    overflow: visible;
}

.conversation-avatar {
    width: 40px;
    height: 40px;
}

.conversation-detail {
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.top-item {
    height: 20px;
    width: 260px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.bottom-item {
    height: 14px;
    margin-top: 6px;
    font-size: 12px;
    color: #968b8b;
    width: 200px;
}

.conversation-message {
    float: left;
}

.ellipsis {
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
  