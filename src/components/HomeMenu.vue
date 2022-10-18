<template>
    <div class="conversation-item-menu box-shadow1">
        <span class="menu-item operation-text" @click.stop="remove">编辑</span>
        <el-popover placement="top" width="160" v-model="showDelPop">
            <p>是否确定删除？</p>
            <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="showDelPop = false">取消</el-button>
                <el-button type="primary" size="mini" @click.stop="deleteConversation">确定</el-button>
            </div>
            <span slot="reference" class="menu-item operation-text" @click.stop="()=>{}">删除</span>
        </el-popover>
    </div>
</template>
  
<script>
export default {
    name: 'HomeMenu',
    props: ['conversation'],
    data() {
        return {
            showDelPop: false,
            friendInfo: {}
        }
    },
    computed: {
        userInfo() {
            return this.$store.state.user.userInfo
        }
    },
    methods: {
        remove() {
            this.$emit('hiddenMenu', this.conversation, "edit")
        },
       
        deleteConversation() {
            this.$emit('hiddenMenu', this.conversation, "remove")
        }
    }
}
</script>
  
<style>
.conversation-item-menu {
    padding: 5px;
}

.box-shadow1 {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.menu-item {
    display: block;
    margin-top: 5px;
}

.operation-text {
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 3px;
    color: #7e7e7e;
    transition: all .5s ease-in;
}

.operation-text:hover {
    background-color: #E9EAEC;
}





</style>
  
  