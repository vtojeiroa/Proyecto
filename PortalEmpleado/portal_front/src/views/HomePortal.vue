<template>
  <div id="app">
    <div class="home">
      <!-- CAMBIAR TITULO DE LA PAGINA -->
      <vue-headful title="Portal del Empleado" description="Página de inicio del Portal." />
      <!-- /CAMBIAR TITULO DE LA PAGINA -->

      <!-- MENU -->
      <menucustom></menucustom>
      <!-- /MENU -->

      <!-- CONTENIDO -->
      <main id="container">
        <!--     <h1>Bienvenido al Portal del Empleado</h1> -->
        <h2>¿Que gestión quieres realizar?</h2>
        <section id="content">
          <article class="login">
            <form class="login">
              <fieldset class="box-login">
                <h2>Gestión de reservas</h2>

                <ul>
                  <h3>Puedes realizar las siguientes reservas:</h3>

                  <li>
                    <p>Vehículo Eléctrico para tus desplazamientos.</p>
                  </li>
                  <li>
                    <p>Sala de Reuniones en tu sede de trabajo.</p>
                  </li>
                  <li>
                    <p>Hora para comer en el comedor de la empresa.</p>
                  </li>
                  <li>
                    <p>Plaza en Vehículo compartido. (Próximamente).</p>
                  </li>
                </ul>
              </fieldset>
            </form>

            <div class="button-login">
              <input
                class="button-login"
                type="submit"
                value="Acceder"
                @click="$router.push('MyReserves')"
              />
            </div>
          </article>
          <article class="login">
            <form class="login">
              <fieldset class="box-login">
                <h2>Gestión de incidencias</h2>
                <ul>
                  <h3>Puedes registrar las siguientes incidencias:</h3>

                  <li>
                    <p>Informática</p>
                  </li>
                  <li>
                    <p>Mantenimiento</p>
                  </li>
                  <li>
                    <p>Limpieza</p>
                  </li>
                  <li>
                    <p>Seguridad</p>
                  </li>
                </ul>
              </fieldset>
            </form>

            <div class="button-login">
              <input
                class="button-login"
                type="submit"
                value="Acceder"
                @click="$router.push('MyIncidences')"
              />
            </div>
          </article>
        </section>
        <section id="profile">
          <article>
            <form class="box-profile" action="profile">
              <fieldset class="box-profile">
                <h2>Gestionar tu perfil</h2>
                <router-link :to="{ name: 'UserProfile' }" class="button-profile">Acceder</router-link>
              </fieldset>
            </form>
          </article>
        </section>
      </main>
      <!-- FOOTER -->
      <footercustom></footercustom>
      <!-- /FOOTER -->
    </div>
  </div>
</template>

<script>
//IMPORTO LA FUNCION LOGINUSER DE UTILS
import { loginUser } from "../api/utils";

//IMPORTO AXIOS
import axios from "axios";

//IMPORTANDO COMPONENTES
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

export default {
  name: "HomePortal",
  components: {
    menucustom,
    footercustom
  },
  data() {
    return {};
  },

  methods: {}
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
#app {
  background-image: url("../assets/FotoFondo.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
main {
  padding-bottom: 81px;
}
main h1 {
  font-size: 2rem;
  text-align: center;
  color: #333;
  margin: 1rem 0;
}
main h2 {
  font-size: 1.5rem;
  text-align: center;
  color: #333;
  margin: 1rem 0;
}

main section#content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
}

main section#profile {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

main section#content h2,
main section#profile h2 {
  padding: 1rem 0;
  font-size: 1.5rem;
  width: 375px;
}

main section article.login,
main section article.profile {
  background: rgba(255, 255, 255, 0.4);
  padding: 5px;
  width: 460px;
  box-sizing: border-box;
  float: left;
  border-radius: 10px;
  border: none;
}

main section article.login form.login,
main section article.profile fieldset form,
main section article form.box-profile {
  display: flex;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  justify-content: center;
  align-content: center;
  align-items: center;
}
main section form fieldset.box-login,
main section form fieldset.box-profile {
  border: none;
  text-align: center;
}
main section article form fieldset.box-login h2,
main section article form fieldset.box-profile h2 {
  color: #333;
  text-transform: uppercase;
  text-align: center;
}
main section article form fieldset.box-login h3 {
  padding: 0.5rem auto;
  font-weight: bolder;
}
main section article form fieldset.box-login p {
  font-size: 0.85rem;
  padding: 0.2rem 0;
  font-weight: bolder;
}

main section article form fieldset.box-login ul,
main section article form fieldset.box-profile ul {
  list-style: none;
  text-align: center;
}
main section#content article p.warning {
  font-size: 11px;
  display: block;
  align-self: center;
  align-self: flex-end;
  color: #8b8b8b;
}

main section article div.button-login,
main section article a.button-profile {
  display: flex;
  justify-content: center;
  margin: 10px;
}
main section article div input.button-login,
main section article a.button-profile {
  background: #142850;
  color: #dae1e7;
  font-size: 1rem;
  font-weight: 900;
  padding: 1rem;
  line-height: 15px;
  border-radius: 50px;
  cursor: pointer;
  width: 100px;
  border: none;
  border: 2px solid #142850;
  transition: all 0.4s ease 0s;
}
main section article input.button-login:hover,
main section article a.button-profile:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
  transition: all 0.4s ease 0s;
}

main section article a {
  display: block;
  text-align: center;
  margin-top: 0px;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}
main section form.box-profile {
  text-align: center;
  border-collapse: collapse;
}

main section form.box-profile fieldset.box-profile {
  margin: 10px;
  padding: 10px;
  font-size: 14px;
  background: rgba(20, 40, 80, 0.65);
  border: none;
  border-radius: 10px;
}
main section article form fieldset.box-profile h2 {
  color: #dae1e7;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  margin: 1px auto;
  max-width: 350px;
}
main section article form.box-profile fieldset.box-profile a.button-profile {
  display: inline-block;
  border: 2px solid #dae1e7;
  margin: 5px;
  max-width: 200px;
  background: #142850;
  color: #dae1e7;
  font-size: 1rem;
  font-weight: 900;
  padding: 1rem;
  line-height: 15px;
  border-radius: 50px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.4s ease 0s;
}

main
  section
  article
  form.box-profile
  fieldset.box-profile
  a.button-profile:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
  transition: all 0.4s ease 0s;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
}

.modalBox {
  background: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
</style>
