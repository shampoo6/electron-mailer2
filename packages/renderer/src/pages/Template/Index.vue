<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "Index",
  created() {
    this.$router.replace('/template/templates')
  }
}
</script>

<style scoped>

</style>
