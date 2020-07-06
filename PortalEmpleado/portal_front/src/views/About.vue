<template>
  <div id="app">
    <div class="About">
      <!-- CAMBIAR TITULO DE LA PAGINA -->
      <vue-headful title="Sobre mí" description="Información sobre este proyecto." />
      <!-- /CAMBIAR TITULO DE LA PAGINA -->

      <!-- MENU -->
      <menucustom></menucustom>
      <!-- /MENU -->

      <!-- CONTENIDO -->
      <main>
        <section>
          <h1>Esta web...</h1>
          <h2>Ha sido desarrollada por Víctor Tojeiro</h2>
          <img src alt />
          <div class="links">
            <a href="https://www.linkedin.com/in/vtojeiroa" target="_blank">
              <img src="../assets/linkedin-2.svg" alt="logo linkedin" />
            </a>
            <a href="https://github.com/vtojeiroa" target="_blank">
              <img src="../assets/GitHub-Mark-32px.png" alt="logo github" />
            </a>
          </div>
          <h2>
            empleando los conociminentos adquiridos en el Bootcamp de HackaBoss,
            utilizando:
          </h2>
          <ul>
            <li>
              <a href="https://developer.mozilla.org/es/docs/HTML/HTML5" target="_blank">
                <img src="../assets/HTML5.svg" alt="logo html5" />
              </a>
            </li>

            <li>
              <a href="https://vuejs.org/" target="_blank">
                <img src="../assets/css3.svg" alt="logo css3" />
              </a>
            </li>
            <li>
              <a href="https://vuejs.org/" target="_blank">
                <img src="../assets/logo.png" alt="logo vue" />
              </a>
            </li>
            <li>
              <a href="https://nodejs.org/es/" target="_blank">
                <img src="../assets/nodejs.svg" alt="logo nodejs" />
              </a>
            </li>
            <li>
              <a href="https://www.mysql.com/" target="_blank">
                <img src="../assets/mysql.svg" alt="logo mysql" />
              </a>
            </li>
            <li>
              <a href="https://github.com/axios/axios" target="_blank">
                <img src="../assets/axios-icon.svg" alt="logo vue-axios" />
              </a>
            </li>
            <li>
              <a href="https://sweetalert2.github.io/" target="_blank">
                <img src="../assets/SweetAlert2.png" alt="logo SweetAlert2" />
              </a>
            </li>
            <li>
              <a href="https://www.npmjs.com/package/vue-headful" target="_blank">Vue-Headful</a>
            </li>
            <li>
              <a href="https://www.npmjs.com/package/vue-star-rating" target="_blank">
                <img src="../assets/start-rating.png" alt="logo start-rating" />
              </a>
            </li>

            <li>
              <a href="https://loading.io/css/" target="_blank">CSS Loader Spiner</a>
            </li>
          </ul>
          <h2>
            y el apoyo incondicional de Alberto, Brais, David, Felix, Isa y
            Raul.
          </h2>
        </section>
      </main>
      <!-- /CONTENIDO -->
      <!-- FOOTER -->
      <footercustom></footercustom>
      <!-- /FOOTER -->
    </div>
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
#app {
  background-image: url("../assets/me.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
.home {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
main {
  padding-bottom: 81px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-end;
  align-items: center;
  height: 80vh;
}
main section {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.4);
  padding: 20px;
  width: 500px;
  box-sizing: border-box;
  float: left;
  border-radius: 10px;
  border: none;
  text-align: center;
}
h1 {
  font-size: 1.75rem;
  padding: 1rem;
  color: #333;
}
h2 {
  font-size: 1.25rem;
  color: #333;
  padding: 5px 0;
}

img {
  width: 25px;
  margin-right: 15px;
}

ul {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  list-style: none;
  background: rgba(255, 255, 255, 0.6);
  padding: 10px 0;
}
li {
  text-align: center;
  padding: 5px 0;
}

li a {
  color: #333;
  text-decoration: none;
}
@media (min-width: 500px) {
  h1 {
    font-size: 2.5rem;
    padding: 2rem;
  }
  h2 {
    font-size: 1.5rem;
  }

  img {
    width: 50px;
  }
}
</style>
