<template>
  <div id="app">
    <div class="home">
      <!-- CAMBIAR TITULO DE LA PAGINA -->
      <vue-headful
        title="Portal del Empleado"
        description="Página de inicio del Portal."
      />
      <!-- /CAMBIAR TITULO DE LA PAGINA -->

      <!-- MENU -->
      <menucustominitial></menucustominitial>
      <!-- /MENU -->

      <!-- CONTENIDO -->
      <main id="container">
        <section id="content">
          <article class="login">
            <form class="login">
              <fieldset class="box-login">
                <h2>Bienvenid@ al Portal, accede a tu cuenta</h2>
                <table class="form-table">
                  <tbody>
                    <tr>
                      <td class="email">
                        <label for="email">Correo electrónico *:</label>
                      </td>
                      <td class="email">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          autocomplete="on"
                          class="email"
                          v-model="email"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="password">
                        <label for="password">Contraseña *:</label>
                      </td>
                      <td class="tdFormField">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          autocomplete="on"
                          class="password"
                          v-model="password"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </fieldset>
            </form>
            <p class="warning">
              Todos los campos marcados con * son obligatorios
            </p>
            <div class="button-login">
              <input
                class="button-login"
                type="submit"
                value="Acceder"
                @click="login()"
              />
            </div>
            <router-link :to="{ name: 'PasswordRecovery' }"
              >Olvidé la contraseña</router-link
            >
          </article>
          <form class="box-create-account" action="create-account">
            <fieldset class="box-create-account">
              <h2>
                ¿Eres nuevo en
                <strong>el Portal</strong>?
              </h2>
              <router-link :to="{ name: 'Registry' }" class="button"
                >Crea tu cuenta</router-link
              >
            </fieldset>
          </form>
        </section>
        <!-- /CONTENIDO -->
        <section id="search">
          <article class="searchvalorations">
            <h3>Visualiza las valoraciones que han registrado los usuarios</h3>
            <!-- MODAL PARA  LA IMPLEMENTACIÓN DEL BUSCADOR DE INCIDENCIAS -->
            <button class="button-search" @click="openModalValorations()">
              Iniciar búqueda
            </button>

            <div
              class="modal"
              style="overflow-y: scroll;"
              v-show="modalValorations"
            >
              <div class="modalBox">
                <fieldset class="searchValorations">
                  <h2>
                    Selecciona el servicio para visualizar sus valoraciones
                  </h2>

                  <form class="searchValorations">
                    <table class="searchValorations">
                      <tbody>
                        <tr>
                          <td>
                            <label for="service">Tipo de servicio:</label>
                            <select
                              id="typeservice"
                              name="typeservice"
                              v-model="typeService"
                            >
                              <option value>Selecciona...</option>
                              <option value="vehiculo"
                                >Reserva de vehículo</option
                              >
                              <option value="sala de reunion"
                                >Reserva de sala de Reunión</option
                              >
                              <option value="Plaza en el comedor"
                                >Reserva de plaza en el comedor</option
                              >
                              <option value="informatica"
                                >Incidencia informática</option
                              >
                              <option value="limpieza"
                                >Incidencia Limpieza</option
                              >
                              <option value="mantenimiento"
                                >Incidencia Mantenimiento</option
                              >
                              <option value="seguridad">Seguridad</option>
                              <option value="otras">Otras</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </form>
                  <div class="buttons">
                    <input
                      type="submit"
                      class="back"
                      value="CERRAR"
                      @click="
                        closeModalValorations();
                        closeValorationsView();
                        emptyFieldsValorations();
                      "
                    />
                    <input
                      type="submit"
                      class="search"
                      value="VER"
                      @click="
                        getValorations();
                        showValorationsView();
                      "
                    />
                  </div>
                </fieldset>

                <searchvalorations
                  :searchincs="searchincs"
                  :valorations="valorations"
                  :values="values"
                  v-show="seeValorations"
                ></searchvalorations>
              </div>
            </div>
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
import { loginUser, getAuthToken } from "../api/utils";

//IMPORTO AXIOS
import axios from "axios";

//IMPORTANDO COMPONENTES
import menucustominitial from "@/components/MenuCustomInitial.vue";
import footercustom from "@/components/FooterCustom.vue";
import searchvalorations from "@/components/SearchValorations.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

export default {
  name: "Login",
  components: {
    menucustominitial,
    footercustom,
    searchvalorations,
  },
  data() {
    return {
      email: "",
      password: "",
      searchincs: [],
      valorations: {},
      values: {},
      modalValorations: false,
      typeService: "",
      seeValorations: false,
    };
  },

  methods: {
    async login() {
      try {
        if (this.email === "" || this.password === "")
          throw Error("No has cubierto todos los campos");
        //INTENTO HACER LOGIN
        await loginUser(this.email, this.password);
        Swal.fire({
          icon: "success",
          title: `Login realizado con éxito!`,
          showConfirmButton: false,
          timer: 2000,
        });

        //SI HAY LOGIN, QUE ME LLEVE AL HOME
        this.$router.push("HomePortal");
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `${error}`,
          showConfirmButton: false,
          timer: 2500,
        });
      }
    },

    //FUNCIÓN PARA CARGAR TODAS LAS VALORACIONES
    getValorations(typeService) {
      let self = this;
      axios
        .get("http://localhost:3000/votes", {
          params: {
            type: this.typeService,
          },
        })
        //SI SALE BIEN
        .then(function(response) {
          self.searchincs = response.data.data;

          self.valorations = response.data.average[0];

          self.values = response.data.values;
        })
        //SI SALE MAL
        .catch((error) =>
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 2500,
          })
        );
    },

    // ABRE EL MODAL PARA HACER LA BUSQUEDA DE INCIDENCIAS
    openModalValorations() {
      this.modalValorations = true;
    },
    // CIERRA EL MODAL DESPUES AL FINALIZAR LA BUSQUEDA DE INCIDENCIAS
    closeModalValorations() {
      this.modalValorations = false;
      this.emptyFieldsValorations();
    },
    emptyFieldsValorations() {
      this.typeService = "";

      this.getValorations();
    },
    showValorationsView() {
      this.seeValorations = true;
    },
    closeValorationsView() {
      this.seeValorations = false;
    },
  },
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
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  min-height: 80vh;
}

main section#content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}

main section#search {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
}

main section#content h2,
main section#search h2 {
  padding: 1rem 0;
  font-size: 1.5rem;
}

main section article.login {
  background: rgba(255, 255, 255, 0.4);
  max-width: 375px;
  box-sizing: border-box;
  float: left;
  border-radius: 10px;
  border: none;
  /* max-width: 375px; */
}

main section article.searchvalorations {
  background: rgba(255, 255, 255, 0.4);
  padding: 10px 0;
  max-width: 375px;
  box-sizing: border-box;
  float: left;
  border-radius: 10px;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

main section article.login form.login,
main section article.searchvalorations fieldset form.searchValorations,
main section form.box-create-account {
  display: flex;
  font-size: 1rem;
  font-weight: 700;
  color: #333;
  justify-content: center;
  align-content: center;
  align-items: center;
  padding: 10px 0;
}
main section form fieldset.box-login,
main section article fieldset.searchValorations {
  border: none;
}
main section article form fieldset.box-login h2,
main section article h3 {
  color: #333;
  text-transform: uppercase;
  text-align: center;
}
main section article form fieldset.box-login table tbody tr {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding: 5px;
}

main section article form fieldset.box-login table tbody tr.email {
  margin-bottom: 20px;
}

main section article form fieldset.box-login table tbody td label.email,
main section form fieldset.box-login table tbody td label.password,
main section form fieldset.searchValorations table tbody tr td select label {
  font-size: 14px;
  font-weight: 700;
  color: #555;
  vertical-align: center;
}

main section article form fieldset.box-login table tbody td input.email,
main section form fieldset.box-login table tbody td input.password {
  background: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d4d4d4;
  padding: 5px 10px;
  transition: all 0.2s ease 0s;
  width: 200px;
}
main section#content article p.warning {
  font-size: 11px;
  display: block;
  text-align: center;
  color: #8b8b8b;
}

main section article div.button-login,
main section article button.button-search {
  display: flex;
  justify-content: center;
  margin: 10px;
}
main section article div input.button-login,
main section article button.button-search {
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
}

main section article button.button-search {
  width: 155px;
}

main section article input.button-login:hover,
main section article button.button-search:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}

main section article a {
  display: block;
  text-align: center;
  margin-top: 0px;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}
main section form.box-create-account {
  text-align: center;
  border-collapse: collapse;
}

main section form.box-create-account fieldset.box-create-account {
  margin: 10px;
  padding: 10px;
  font-size: 14px;
  background: rgba(20, 40, 80, 0.65);
  border: none;
  border-radius: 10px;
}
main section form fieldset.box-create-account h2 {
  color: #dae1e7;
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 500;
  margin: 1px auto;
  max-width: 350px;
}
main section form.box-create-account fieldset.box-create-account a.button {
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
}

main
  section
  form.box-create-account
  fieldset.box-create-account
  a.button:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modalBox {
  background: #dae1e7;
  color: #142850;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}
.modalBox h1 {
  font-size: 2rem;
  text-align: center;
}

.modalBox h2 {
  color: #333;
  text-transform: uppercase;
  text-align: center;
}
.modalBox label {
  font-size: 18px;
  font-weight: 700;
  color: #555;
}
.modalBox select {
  background: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #d4d4d4;
  padding: 5px 10px;
  transition: all 0.2s ease 0s;
  width: 250px;
}
</style>
