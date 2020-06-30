<template>
  <div id="app">
    <div class="home">
      <!-- CAMBIAR TITULO DE LA PAGINA -->
      <vue-headful title="Error 404" description="Página no encontrada." />
      <!-- CAMBIAR TITULO DE LA PAGINA -->

      <!-- MENU -->
      <menucustom></menucustom>
      <!-- /MENU -->
      <main>
        <!-- CONTENIDO -->
        <h1>Error 404</h1>
        <h2>Hemos buscado a conciencia, pero no encotramos la página que deseas.</h2>
        <h2>
          <router-link :to="{ name: 'Login' }">¡¡¡Volvamos a empezar.!!!</router-link>
        </h2>
      </main>
      <!-- /CONTENIDO -->

      <!-- FOOTER -->
      <footercustom></footercustom>
      <!-- /FOOTER -->
    </div>
  </div>
</template>

<script>
//IMPORTANDO API
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

export default {
  name: "Error",
  components: {
    menucustom,
    footercustom
  }
};
</script>
<style scoped>
#app {
  background-image: url("../assets/Desierto2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
.home {
  text-align: center;
}
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
h1 {
  color: #142850;
  /*  color: #ff6666; */
  font-size: 80px;
  padding: 30px 16px;
}
h2 {
  font-size: 35px;
  padding: 16px 0 0;
}
a {
  color: #142850;
}
</style>