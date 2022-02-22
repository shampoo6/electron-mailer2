<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style>
  #app {
    height: 100%;
  }

  .content-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex-grow: 1;
    overflow: auto;
  }
</style>
