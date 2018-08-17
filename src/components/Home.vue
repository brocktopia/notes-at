<template>
  <div class="app-container">

    <header>
      <h2>Home</h2>
    </header>

    <div class="content">
      <img class="logo" src="../assets/logo.png" width="180" height="40" />
      <p>
        <b>notes<span class="at-char">@</span></b> allows you to connect an idea with a place.
        Create a new note and it will be tagged with the location where the note was created.
        The location will be stored as geolocation coordinates and can be associated with a place on Google Maps.
        You can organized notes into notebooks which can be viewed as a list or as points on a map.
      </p>
      <p>To get started create a new notebook now.</p>
      <button class="create-notebook" @click="createNewNotebook()">Create a Notebook</button>
    </div>

    <div class="navigation">
      <router-link to="/notebooks">Go to Notebooks</router-link>
    </div>

  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {}
    },
    methods: {
      createNewNotebook: function() {
        console.log('createNewNotebook()');
        this.$router.push('/notebooks/new')
      }
    }
  }
</script>

<style scoped>
  .content {
    padding: 20px;
  }
  .logo {
    display: block;
    margin: 30px auto;
  }
  .at-char {
    color: #4e7eef;
  }
  .create-notebook {
    display: block;
    margin: 30px auto;
  }
</style>