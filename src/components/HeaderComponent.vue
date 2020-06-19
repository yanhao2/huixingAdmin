<template>

</template>

<script>
export default {
  name: "HeaderComponent",
    props: ['name'],
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  created () {

  },
  mounted () {

  },
  updated () {
  }
}
</script>

<style lang="scss">
    .HeaderComponent{
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        border-bottom: 1px solid #E9E9E9;
        padding: 5px 10px;
        .row{
            display: flex;
            align-items: center;
            .border{
                width: 4px;
                height: 15px;
                background-color: #1378F6;
                margin-right: 10px;
            }
        }
    }
</style>
