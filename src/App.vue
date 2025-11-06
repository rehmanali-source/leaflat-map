<template>
  <LiveMonitoring />
</template>

<script>
import LiveMonitoring from "./components/LiveMonitoring.vue";

export default {
  name: "App",
  components: {
    LiveMonitoring,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 6px;
}
</style>
