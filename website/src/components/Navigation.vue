<template>
    
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item">
          <p><strong>APP</strong></p>
      </router-link>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        
        <router-link to="/" class="navbar-item" excat>
            Home
        </router-link>

        <router-link to="/about" class="navbar-item" excat>
            About
        </router-link>
        
        <!--
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            More
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item">
              About
            </a>
            <a class="navbar-item">
              Jobs
            </a>
            <a class="navbar-item">
              Contact
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item">
              Report an issue
            </a>
          </div>
        </div>
        -->
      </div>

      <!--
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button is-primary">
              <strong>Create post</strong>
            </a>
          </div>
        </div>
      </div>
      -->
    </div>
  </nav>

</template>

<script>
</script>

<style>
</style>