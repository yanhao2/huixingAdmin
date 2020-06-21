<template>
    <div>
        <quill-editor
            :content="content"
            :options="editorOption"
            @change="onEditorChange($event)"
        />
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'

    import { quillEditor } from 'vue-quill-editor'
    export default {
        name: "Editor",
        components: {quillEditor},
        props: ['updateDataEvent', 'content'], // 接收父组件的方法
        data() {
            return {
                editorOption: {
                    modules:{
                        toolbar:[
                            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                            ['blockquote', 'code-block']
                        ]
                    }
                },
            }
        },
        computed: {

        },
        mounted() {

        },
        methods: {
            onEditorChange({ quill, html, text }) {
                this.$emit('updateDataEvent', html)

            }
        },
        created() {

        },
        updated() {
        }
    }
</script>

<style lang="scss">
    .quill-editor{
        height: 100%;
        .ql-toolbar{
            .ql-formats{
                .ql-picker{
                    line-height: 24px;
                }
            }

        }
        .ql-container{
            height: calc(100% - 83px);
        }
    }

</style>
