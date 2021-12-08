<template>
  <main class="theme">
    <div>
      <iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=17.53443315625191%2C59.82979244010069%2C17.73871019482613%2C59.88883631266539&amp;layer=mapnik"
              style="border: 1px solid black"></iframe>
    </div>
  </main>
</template>

<script>
export default {
  name: "TestSite"
}
</script>

<style scoped>
.theme {

  background: linear-gradient(-45deg, #ee9052, #d22736, #1682a8, #22d999);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }

}

</style>