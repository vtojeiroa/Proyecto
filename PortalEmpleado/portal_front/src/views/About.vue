<template>
  <div class="About">
    <!-- CAMBIAR TITULO DE LA PAGINA -->
    <vue-headful title="About" description="Información sobre Hack A Music." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENIDO -->
    <main>
      <section>
        <h1>Esta web...</h1>
        <p>
          Ha sido creada por
          <a
            href="https://www.linkedin.com/in/vtojeiroa"
            target="_blank"
          >Víctor Tojeiro</a>
        </p>

        <img src="../assets/fotoVictor.jpg" alt="Imagen de Víctor" title="Imagen de Víctor" />
        <ul>
          <li></li>
          <li>
            <a href="https://vuejs.org/" target="_blank">VUE</a>,
          </li>
          <li>
            <a href="https://nodejs.org/es/" target="_blank">NODE</a>,
          </li>
          <li>
            <a href="https://www.mysql.com/" target="_blank">MySQL</a>,
          </li>
          <li>
            la librería
            <a href="https://github.com/axios/axios" target="_blank">AXIOS</a>,
          </li>
          <li>
            <a href="https://sweetalert2.github.io/" target="_blank">SweetAlert</a>,
          </li>
          <li>
            <a href="https://www.npmjs.com/package/vue-headful" target="_blank">Vue-Headful</a>,
          </li>
          <li>
            <a href="https://loading.io/css/" target="_blank">CSS Loader Spiner</a>,
          </li>
          <li>
            <a href="https://www.npmjs.com/package/vue-star-rating" target="_blank">Start-Rating</a>,
          </li>
          <li>
            <a href="https://www.npmjs.com/package/vue-moment" target="_blank">Moment</a>,
          </li>
        </ul>
      </section>
    </main>
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
main {
  padding-bottom: 81px;
}
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
}

img {
  margin: 2rem auto;
  max-width: 175px;
  border-radius: 50%;
}
h1 {
  font-size: 2rem;
  padding: 2rem;
}

ul {
  list-style: none;
}
li {
  text-align: center;
}

a:visited {
  color: #196faf;
}

a {
  color: #142850;
}

p {
  color: #333;

  margin: 0 auto;
}
</style>
