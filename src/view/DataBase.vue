<template>
    <div id="app">
        <div>
            <el-header style="text-align: left; font-size: 12px; background-color: white;">
                <el-dropdown>
                    <el-button type="primary">
                        新建查询
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>MySQL</el-dropdown-item>
                        <el-dropdown-item>PostgreSQL</el-dropdown-item>
                        <el-dropdown-item>Oracle</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-container style=" border: 1px solid #eee">
                <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                    <el-menu style="background-color: rgb(238, 241, 246)">
                        <el-submenu index="1">
                            <template slot="title">我的连接</template>
                            <el-menu-item v-for="data in connections" :key="data.id" :index="data.name"
                                @click="refreshDb(data.id)">
                                {{data.name}}</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-aside width="300px">
                    <el-tree v-if="hasCheckoutConnection" @node-click="dbNodeClick" :props="props" :load="loadNode"
                        lazy>
                    </el-tree>
                </el-aside>
                <el-container v-if="editableTabs.length > 0">
                    <el-header style="text-align: left; font-size: 12px;">
                        <el-button>运行</el-button>
                        <el-button>选中运行</el-button>
                    </el-header>
                    <el-main>
                        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
                            <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :label="item.title"
                                :name="item.name">
                            </el-tab-pane>
                            <codemirror v-model="curClickTab.sqlContent" :options="cmOptions" />
                        </el-tabs>
                    </el-main>
                    <el-footer>
                        <el-table :data="tableData" style="width: 100%">
                            <el-table-column prop="date" label="日期" width="180">
                            </el-table-column>
                            <el-table-column prop="name" label="姓名" width="180">
                            </el-table-column>
                            <el-table-column prop="address" label="地址">
                            </el-table-column>
                        </el-table>
                    </el-footer>
                </el-container>
            </el-container>
        </div>
    </div>
</template>
  
<script>
import { codemirror } from 'vue-codemirror'
export default {
    components: {
        codemirror,
    },
    data() {
        return {
            props: {
                label: 'name',
                children: 'zones',
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
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄'
            }],
            editableTabsValue: '',
            editableTabs: [],
            tabIndex: 0,


            //联动更新数据
            connections: [{ name: "test", "id": 1 }],
            //当前连接的数据库
            curDbs: [{ name: 'test', type: 'database', connId: '1', database: 'test' }, { name: 'test2', type: 'database', connId: '2', database: 'test2' }],
            hasCheckoutConnection: false,
            //当前sql内容
            sqlContent: '',
            //tabs map key: connId + '-' + dbName, value : tab
            edittableTabsMap: new Map(),
            edittableTabsNameMap: new Map(),
            curClickTab: {},
        }
    },

    mounted() {

    },

    methods: {
        loadNode(node, resolve) {
            if (node.level === 0) {
                return resolve(this.curDbs);
            } else {
                //获取当前库下表
                setTimeout(() => {
                    const data = [{
                        name: 'leaf',
                        type: 'table',
                        database: node.data.database,
                        connId: node.data.connId,
                        connName: node.data.name,
                        leaf: true
                    }];

                    resolve(data);
                }, 500);
            }
        },
        //new
        refreshDb(id) {
            console.log(id)
            this.hasCheckoutConnection = true;
            //获取连接数据库
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            setTimeout(() => {
                loading.close();
            }, 500);
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
            console.log(`delete key:${key}`)
            if (key !== null) {
                this.edittableTabsMap.delete(key)
            }
            this.edittableTabsNameMap.delete(targetName)
        },
        clickTab(tab) {
            let tabObj = this.edittableTabsNameMap.get(tab.name)
            if (tabObj !== null){
                this.curClickTab = tabObj;
            }
        },
        //节点点击
        dbNodeClick(obj) {
            if (obj.leaf) {
                //输入select预览
                let sqlContent = `select * from ${obj.name} limit 10`;

                let tabKey = obj.connId + "-" + obj.database;
                let tab = this.edittableTabsMap.get(tabKey)
                if (tab == null) {
                    console.log(`key ${tabKey} not exists, now insert`)
                    let newTabName = ++this.tabIndex + '';
                    tab = {
                        title: obj.connName + "-" + obj.database,
                        name: newTabName,
                        sqlContent: sqlContent,
                        database: obj.database,
                        connId: obj.connId
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
                this.doQuery(sqlContent, tab.connId, tab.database)
                return;
            } else {
                //加载表
            }
            console.log(obj.name)
            console.log(obj.type)
        },
        doQuery(sql, connId, database) {
            console.log(`start query sql:[{${sql}}] connId:[${connId}] database:[{${database}}]`)
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
</style>
  