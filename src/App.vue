<template>
  <router-view/>
</template>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 30px;
}

#nav a {
  padding:0.4em;
}

#nav a.router-link-exact-active {
  background-color: blue;
  color: white;
}
</style>
