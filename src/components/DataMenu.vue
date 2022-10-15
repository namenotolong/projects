<template>
    <div id="app">
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
</template>
  
<script>

export default {
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

</style>
  