<template>
  <router-view></router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  created() {
    this.$router.replace('/template/templates')
  }
})
</script>

<style scoped>

</style>
