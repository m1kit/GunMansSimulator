<template>
  <div id="app">
    <b-navbar type="is-danger">
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          GunMan's game Simulator
        </b-navbar-item>
      </template>

      <template slot="end">
        <!-- b-navbar-item tag="div">
          <div class="buttons">
            <a class="button is-light">
              View Source(currently unavailable)
            </a>
          </div>
        </b-navbar-item-->
      </template>
    </b-navbar>
    <GunmansGameSimulator />
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>GunMan's game Simulator</strong> by Mikihito Matsuura. The source code is hosted at
          <a href="https://github.com/m1kit/GunMansSimulator">GitHub</a>.
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import GunmansGameSimulator from "./components/GunmansGameSimulator"

export default {
  name: 'app',
  components: {
    GunmansGameSimulator,
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
