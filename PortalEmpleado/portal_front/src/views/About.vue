<template>
  <div class="About">
    <!-- CAMBIAR TITULO DE LA PAGINA -->
    <vue-headful title="About" description="Información sobre Hack A Music." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENIDO -->
    <h1>Esta web...</h1>
    <p>
      Ha sido creada por
      <a
        href="https://www.linkedin.com/in/vtojeiroa"
        target="_blank"
      >Víctor Tojeiro</a>
    </p>

    <img src="../assets/fotoVictor.jpg" alt="Imagen de Víctor" title="Imagen de Víctor" />
    <p>
      usando la API de
      <a href="https://www.last.fm/api/?lang=es" target="_blank">LastFM</a>, la
      librería
      <a href="https://github.com/axios/axios" target="_blank">AXIOS</a>,
      <a href="https://sweetalert2.github.io/" target="_blank">SweetAlert</a>,
      <a href="https://www.npmjs.com/package/vue-headful" target="_blank">Vue-Headful</a>,
      <a href="https://loading.io/css/" target="_blank">CSS Loader Spiner</a>,
      <a href="https://animate.style/" target="_blank">Animate.css</a>
,
    </p>
    <!-- /CONTENIDO -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
//IMPORTANDO COMPONENTES
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

export default {
  name: "About",
  components: {
    menucustom,
    footercustom
  }
};
</script>

<style scoped>
/* .About {
  background-image: url("../assets/FotoFondo1.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  min-height: 100vh;
} */

img {
  margin: 2rem auto;
  max-width: 175px;
  border-radius: 50%;
}

a:visited {
  color: #196faf;
}

a {
  color: blue;
}

p {
  max-width: 500px;
  margin: 0 auto;
}
</style>
