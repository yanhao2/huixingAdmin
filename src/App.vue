<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: "App",
        data () {
            return {
            }
        },
        computed: {
            token() {
                return this.$store.getters.getSortageToken;
            },
        },
        methods: {
            LoadData () {
                if (!this.token) {
                    this.$router.push({path: `/login`});
                }
            }
        },
        created () {
            this.LoadData()
        },
        mounted () {

        },
        updated () {
        }
    }
</script>


<style lang="scss">
    #app,html, body {
        height: 100%;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #333;
        .ivu-table-cell{
            padding-left: 0;
            padding-right: 0;
        }
    }
</style>
