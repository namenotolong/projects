<template>
    <div id="app">
        <div class="container">
            <div id="header">
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
            </div>
            <div id="content">
                <div id="left">
                    <el-row class="tac">
                        <el-col :span="4">
                            <el-menu default-active="2" class="el-menu-vertical-demo" 
                            background-color="#545c64" text-color="#fff"
                                active-text-color="#ffd04b">
                                <el-submenu index="1">
                                    <template slot="title">
                                        <span>我的链接</span>
                                    </template>
                                    <el-menu-item-group>
                                        <template slot="title">MySQL</template>
                                        <el-menu-item index="1-1">选项1</el-menu-item>
                                        <el-menu-item index="1-2">选项2</el-menu-item>
                                    </el-menu-item-group>
                                    <el-menu-item-group title="PostgreSQL">
                                        <el-menu-item index="1-3">选项3</el-menu-item>
                                    </el-menu-item-group>
                                </el-submenu>
                            </el-menu>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    components: {
    },
    data() {
        return {

        }
    },

    mounted() {

    },

    methods: {

    }
}

</script>

<style scoped>
 .container  div {
     margin-bottom: 20px;
     margin-top: 10px;
 }
</style>
  