<template>
  <div id="app">

    <navigation></navigation>

    <div class="container">
      <router-view :key="this.$route.fullPath"></router-view>
    </div>

  </div>
</template>

<script>
// Components
import Navigation from './components/Navigation'

export default {
  name: 'app',
  components: { Navigation },
  data () {
    return {

    }
  }
}
</script>
  html, body {
    height: 100%;
    width: 100%;
  }
<style>

</style>
