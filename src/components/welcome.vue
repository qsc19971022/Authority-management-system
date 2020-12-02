<template>
    <h1>欢迎访问</h1>
</template>

<script>

    import {Vue, Component, Watch} from 'vue-property-decorator';

    @Component({
        // 如果在类中找不到需要添加的内容, 那么就可以写在这个地方
        name: 'welcome',
        components: {

        }
    })
    export default class Home extends Vue {

        @Watch('message', {deep: true})
        messageChange(newValue, oldValue){
            console.log(newValue, oldValue);
        }
    }
</script>
