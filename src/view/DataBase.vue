<template>
    <div id="app">
        <div>
            <el-header style="text-align: left; font-size: 12px; background-color: white;">
                <el-button type="primary" @click="addConnDialog = true">
                    新建查询
                </el-button>
            </el-header>
            <el-container style=" border: 1px solid #eee">
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <el-menu style="background-color: rgb(238, 241, 246)" @open="handleOpen">
                        <el-submenu index="1">
                            <template slot="title">
                                <span>我的连接</span>
                            </template>
                            <div v-for="data in connections" :key="data.id">
                                <div @contextmenu.prevent.stop="showMenu(data)">
                                    <el-menu-item :index="data.name" @click="refreshDb(data.id)">
                                        {{data.name}}
                                    </el-menu-item>
                                </div>
                            </div>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-aside width="300px">
                    <el-tree v-if="curDbTables.length > 0" 
                        @node-click="dbNodeClick" :props="props" :data="curDbTables">
                    </el-tree>
                </el-aside>
                <el-container v-if="editableTabs.length > 0">
                    <el-header style="text-align: left; font-size: 12px;">
                        <el-button @click="runSql">运行</el-button>
                        <el-button @click="checkRunSql">选中运行</el-button>
                    </el-header>
                    <el-main>
                        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab"
                            @tab-click="clickTab">
                            <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :label="item.title"
                                :name="item.name">
                            </el-tab-pane>
                            <codemirror v-model="curClickTab.sqlContent" :options="cmOptions" />
                        </el-tabs>
                    </el-main>
                    <el-footer>
                        <el-table :data="curClickTab.tableData" style="width: 100%">
                            <el-table-column v-for="item in curClickTab.tableMeta" :key="item.name" :prop="item.name"
                                :label="item.label" width="180">
                            </el-table-column>
                        </el-table>
                    </el-footer>
                </el-container>
            </el-container>
        </div>


        <div>
            <el-dialog title="添加连接" :visible.sync="addConnDialog">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="连接名称" prop="name">
                        <el-input v-model="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="连接类型" prop="type">
                        <el-select v-model="ruleForm.type" placeholder="请选择连接类型">
                            <el-option v-for="item in supportTypes" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主机" prop="host">
                        <el-input v-model="ruleForm.host"></el-input>
                    </el-form-item>
                    <el-form-item label="用户" prop="user">
                        <el-input v-model="ruleForm.user"></el-input>
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
                    <el-form-item label="连接类型" prop="type">
                        <el-select v-model="editConnForm.type" placeholder="请选择连接类型">
                            <el-option v-for="item in supportTypes" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="主机" prop="host">
                        <el-input v-model="editConnForm.host"></el-input>
                    </el-form-item>
                    <el-form-item label="用户" prop="user">
                        <el-input v-model="editConnForm.user"></el-input>
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

        <div class="menu" v-if="isShowMenu" :style="{'left': menuLeft + 'px', 'top': menuTop + 'px'}">
            <div style="width: 10%">
                <home-menu :conversation="curClickConnection" @hiddenMenu="hiddenMenu" />
            </div>
        </div>
    </div>
</template>
  
<script>
import { codemirror } from 'vue-codemirror'

import homeMenu from '../components/HomeMenu'
import { listConns, deleteConn, updateConn, saveConn, listDbs, runSql } from '../api/database'
export default {
    components: {
        codemirror, homeMenu
    },
    props: ['conversation'],
    created() {
        document.addEventListener('click', () => {
            this.isShowMenu = false
        })
        document.addEventListener('mousedown', (e) => {
            const { button } = e
            if (button === 2) {
                this.isShowMenu = false
            }
        })
    },
    data() {
        return {
            //menu
            isShowMenu: false,
            menuTop: 0,
            menuLeft: 0,
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
            curDbTables: [],
            //当前sql内容
            sqlContent: '',
            //tabs map key: connId + '-' + dbName, value : tab
            edittableTabsMap: new Map(),
            edittableTabsNameMap: new Map(),
            curClickTab: {},

            //result

            //添加连接表单
            addConnDialog: false,
            editConnDialog: false,
            supportTypes: ['mysql', 'oracle'],
            ruleForm: {
                name: '',
                type: '',
                host: '',
                user: '',
                password: ''
            },
            editConnForm: {},
            rules: {
                name: [
                    { required: true, message: '请输入连接名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择连接类型', trigger: 'change' }
                ],
                host: [
                    { required: true, message: '请填写主机地址', trigger: 'blur' }
                ],
                user: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' }
                ]
            }
        }
    },

    mounted() {

    },

    methods: {
        handleOpen(key) {
            if (key == 1) {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.queryConns()
                loading.close();
            }
        },
        //运行sql
        async executeSql(sql, connId, database) {
            const params = {
                sql : sql,
                connId : connId,
                database : database
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
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            const res = await deleteConn(id)
            loading.close();
        },
        //编辑连接
        async editUpdateConn(data) {
            const rest = await updateConn(data)
        },
        //新建连接
        async saveConn(data) {
            const rest = await saveConn(data)
        },
        //new
        async refreshDb(id) {
            //获取连接数据库
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            
            const rest = await this.listDbs(id)

            this.curDbTables = rest

            loading.close();
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
            }
        },
        //节点点击
        dbNodeClick(obj) {
            if (obj.leaf === 'true') {
                //输入select预览
                let sqlContent = `select * from ${obj.name} limit 10`;

                let tabKey = obj.connId + "-" + obj.database;
                let tab = this.edittableTabsMap.get(tabKey)
                if (tab == null) {
                    let newTabName = ++this.tabIndex + '';
                    tab = {
                        title: obj.connName + "-" + obj.database,
                        name: newTabName,
                        sqlContent: sqlContent,
                        database: obj.database,
                        connId: obj.connId,
                        tableData: [],
                        tableMeta: []
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
                return;
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
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            const result = await this.executeSql(sql, tab.connId, tab.database)
            //query
            tab.tableMeta = result.tableMeta
            tab.tableData = result.tableData
            loading.close();
        },

        //添加连接相关
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.saveConn(this.ruleForm)
                    this.queryConns()
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        //menu
        showMenu(data) {
            this.isShowMenu = true
            this.menuLeft = data.pageX
            this.menuTop = data.pageY
            this.curClickConnection = data
        },
        hiddenMenu(data, op) {
            if (op === 'edit') {
                this.editConnForm = data;
                this.editConnDialog = true;
            } else if (op === 'remove') {
                this.deletConn(data.id)
                this.queryConns()
            }

            this.isShowMenu = false
        },
        submitUpdateForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editUpdateConn(this.editConnForm)
                    this.queryConns()
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
  