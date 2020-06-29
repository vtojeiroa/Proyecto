<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Mis Incidencias" description="Página que lista mis incidencias" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>
    <!-- VISTA DEL MENÚLINKS -->
    <section class="links">
      <article class="links">
        <menulinks></menulinks>
        <router-link :to="{ name: 'NewIncidence' }">Nueva Incidencia</router-link>
      </article>
    </section>

    <!--  ANIMACIÓN DE CSS CARGANDO -->

    <div v-show="loading" class="lds-ripple">
      <div></div>
      <div></div>
    </div>
    <!-- LISTA DE CLIENTES -->

    <!-- IMPLEMENTACIÓN DEL BUSCADOR -->
    <main id="container">
      <section id="content">
        <article class="search-input">
          <h2>Busqueda avanzada</h2>
          <fieldset class="form">
            <form>
              <ul>
                <li>
                  <label for="status">Estado de la incidencia:</label>
                  <select id="status" name="status" v-model="status">
                    <option value>Selecciona...</option>
                    <option value="1">Pendientes</option>
                    <option value="0">Cerradas</option>
                  </select>
                </li>
                <li>
                  <label for="type">Tipo de incidencia:</label>
                  <select id="type" name="type" v-model="type">
                    <option value>Selecciona...</option>
                    <option value="informatica">Informática</option>
                    <option value="limpieza">Limpieza</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="seguridad">Seguridad</option>
                    <option value="otras">Otras</option>
                  </select>
                </li>

                <h3>Intervalo de fechas de registro de la incidencia</h3>
                <li>
                  <label for="from">Fecha inicial &#62;&#61;</label>
                  <input type="datetime-local" id="from" name="from" v-model="dateInit" />
                </li>
                <li>
                  <label for="to">Fecha final &#60;</label>
                  <input type="datetime-local" id="to" name="to" v-model="dateEnd" />
                </li>
              </ul>
            </form>
            <div class="buttons">
              <input
                type="submit"
                class="button-back"
                name="form"
                value="Limpiar"
                @click="emptyFields()"
              />
              <input
                type="submit"
                class="button-go"
                value="Consultar"
                @click="getIncidences(type, status, dateInit, dateEnd)"
              />
            </div>
            <p>
              Si tienes el código de la incidencia, pulsa
              <input
                type="submit"
                class="button-go"
                value="Aquí"
                @click="openModalSearch()"
              />
            </p>
          </fieldset>
        </article>
        <article class="search-data">
          <h1 class="title">Mis incidencias</h1>

          <!-- VISTA DE LAS INCIDENCIAS -->
          <listmyincidences
            :myincidences="filteredIncidences"
            :rating="rating"
            :seeIncidences="seeIncidences"
            :seeVote="seeVote"
            :voteDescription="voteDescription"
            v-on:edit="openModal"
            v-on:delete="deleteIncidences"
            v-on:showvote="showVoteView"
            v-on:closevote="closeVoteView"
            v-on:vote="voteIncidence"
          ></listmyincidences>
        </article>
      </section>

      <!-- MODAL PARA EDITAR INCIDENCIAS -->
      <div class="modal" v-show="modal">
        <div class="modalBox" v-on:edit="showEditText">
          <h2>Actualiza los datos</h2>
          <fieldset>
            <label for="newDescription">Comentario:</label>
            <input
              class="text"
              type="text"
              v-model="newDescription"
              placeholder="Introduce el comentario"
            />
          </fieldset>
          <div class="buttons">
            <input class="button-back" value="Cerrar" @click="closeModal()" />
            <input class="button-go" value="Actualizar" @click="updateIncidence()" />
          </div>
        </div>
      </div>

      <!-- MODAL PARA BUSCAR UNA INCIDENCIA POR EL CÓDIGO -->
      <div class="modal" v-show="modalSearch">
        <div class="modalBox">
          <h2>Introduce el código que has recibido por correo eléctronico</h2>
          <fieldset>
            <label for="search">Código:</label>
            <input v-model="search" class="text" type="text" placeholder="Introduce el código" />
          </fieldset>
          <div class="buttons">
            <input class="button-back" value="Cerrar" @click="closeModalSearch()" />
            <input class="button-go" value="Limpiar" @click="search = ''" />
          </div>
        </div>
      </div>
    </main>
    <!-- VISTA DEL FOOTER -->
    <footercustom></footercustom>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

//IMPORTO EL MENU
import menucustom from "../components/MenuCustom.vue";

//IMPORTO EL MENULINKS
import menulinks from "../components/MenuLinks.vue";

//IMPORTO EL FOOTER
import footercustom from "../components/FooterCustom.vue";

//IMPORTO CLIENTESLISTA
import listmyincidences from "../components/ListMyIncidences.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

import { getAuthToken } from "../api/utils";

export default {
  name: "MyIncidences",
  components: { menucustom, menulinks, footercustom, listmyincidences },
  data() {
    return {
      //ARRAY DE LAS INCIDENCIAS DE LA BBDD
      myincidences: [],
      modal: false,
      modalSearch: false,
      loading: true,
      seeVote: false,
      seeIncidences: true,
      voteDescription: "",
      /*  myincidence: {}, */
      rating: {},
      vote: "",
      id: "",
      newId: "",
      newDescription: "",
      type: "",
      status: "",
      dateInit: "",
      dateEnd: "",
      search: ""
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LOS CLIENTES
    getIncidences() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");
      let self = this;
      axios
        .get("http://localhost:3000/incidences/list", {
          headers: {
            authorization: `Bearer ${token}`
          },
          params: {
            type: this.type,
            active: this.status,
            date_init: this.dateInit,
            date_end: this.dateEnd
          }
        })
        //SI SALE BIEN
        .then(function(response) {
          self.myincidences = response.data.data;
        })
        //SI SALE MAL
        .catch(error =>
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 2500
          })
        );
    },

    showEditText(data) {
      this.newId = data.id;
      this.newDescription = description;
    },

    //FUNCION PARA ACTUALIZAR UN CLIENTE
    updateIncidence() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      axios
        .put("http://localhost:3000/incidences/" + this.newId, {
          description: self.newDescription
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de actualizar los datos de la incidencia `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //recarga la página
            result => {
              self.closeModal();
              self.getIncidences();
            }
          );
        })
        //SI SALE MAL
        .catch(error =>
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 2500
          })
        );
    },

    //  ABRE EL MODAL PARA EDITAR LOS DATOS DEL CLIENTE Y MUESTRA LOS DATOS ORIGINALES
    openModal(data) {
      this.modal = true;
      this.showEditText(data);
    },
    // CIERRA EL MODAL DESPUES DE EDITAR LOS DATOS DEL CLIENTE
    closeModal() {
      this.modal = false;
    },

    //  ABRE EL MODAL PARA BUSCAR UNA INCIDENCIA POR EL CÓDIGO
    openModalSearch() {
      this.modalSearch = true;
    },
    // CIERRA EL MODAL DESPUES DE BUSCAR LA INCIDENCIA POR EL CÓDIGO
    closeModalSearch() {
      this.modalSearch = false;
    },

    //FUNCION PARA ELIMINAR UNA INCIDENCIA DE LA BBDD
    deleteIncidences(data) {
      const token = getAuthToken();
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás deshacerlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, bórralo!"
      }).then(result => {
        if (result.value) {
          axios
            .delete("http://localhost:3000/incidences/" + data)

            //  SI SALE BIEN
            .then(function(response) {
              //MOSTRAR UN MENSAJE CON EL RESULTADO
              Swal.fire({
                icon: "success",
                title: `Acabas de borrar la incidencia `,
                showConfirmButton: false,
                timer: 2500
              }).then(
                //recarga la página
                result => {
                  self.getIncidences();
                }
              );
            })
            //SI SALE MAL
            .catch(error =>
              Swal.fire({
                icon: "error",
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 2500
              })
            );
        }
      });
    },

    //FUNCIÓN PARA VOTAR LAS RESERVAS
    voteIncidence(myincidence, voteDescription, rating) {
      const token = getAuthToken();
      const userId = localStorage.getItem("id");
      const id = myincidence.id;
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      axios
        .post(`http://localhost:3000/incidences/${id}/vote`, {
          vote: rating,
          description: voteDescription
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de votar la reserva `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //recarga la página
            result => {
              self.closeVoteView();
              self.emptyFieldsVotes();
            }
          );
        })
        //SI SALE MAL
        .catch(error =>
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 2500
          })
        );
    },

    emptyFields() {
      this.type = "";
      this.status = "";
      this.dateInit = "";
      this.dateEnd = "";
      this.search = "";
      this.getIncidences();
    },
    emptyFieldsVotes() {
      this.rating = {};
      this.voteDescription = "";
      this.getIncidences();
    },

    showVoteView() {
      this.seeVote = true;
      this.seeIncidences = false;
    },
    closeVoteView() {
      this.seeVote = false;
      this.seeIncidences = true;
    }
  },
  created() {
    this.getIncidences();
    this.loading = false;
  },
  computed: {
    filteredIncidences() {
      let result = this.myincidences;

      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          myincidence =>
            myincidence.codigo_incidencia === parseInt(this.search) ||
            myincidence.id === parseInt(this.search)
        );
        if (!result.length) {
          Swal.fire({
            title: "El código introducido no corresponde a ninguna incidencia",
            text: "Vuelve a intentarlo",
            showConfirmButton: false,
            timer: 2500
          });
        }
        return result;
      }
    }
  }
};
</script>
<style scoped>
.lds-ripple {
  display: inline-block;
  align-self: center;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
section article.links {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
section article.links a {
  background: #142850;
  color: #dae1e7;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.75rem;
  line-height: 15px;
  border-radius: 50px;
  cursor: pointer;
  width: 150px;
  border: none;
  border: 2px solid #142850;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
}
body main {
  background: #fff;
  margin: 10px;
  display: flex;
  justify-content: center;
  box-shadow: 0 0 4px 0 #d4d4d4;
  box-sizing: border-box;
  margin: 30px auto;
  padding: 15px 30px;
  width: 95%;
  max-width: 900px;
  border-radius: 10px;
  padding-bottom: 81px;
}
body main section#content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
body main section article ul.link {
  align-self: center;
  width: 100%;
}
body section article.links {
  display: flex;
  justify-content: center;
}

fieldset {
  border: none;
  padding: 1rem;
  border-radius: 10px;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

ul li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0;
}
input {
  text-align: center;
}

input.button-go {
  padding: 0.75px;
  vertical-align: middle;
}
h2 {
  padding: 1rem 0;
  text-align: center;
}
h3 {
  padding: 1rem 0;
  text-align: center;
}
fieldset.form {
  border-radius: 0;
  border: none;
  border-bottom: 3px solid #142850;
}

ul li label,
ul li select {
  display: block;
  align-self: initial;
}
.modalBox {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
}

.modalBox label {
  font-size: 18px;
  font-weight: 700;
  color: #555;
}
.modalBox select,
.modalBox input.text,
.modalBox textarea {
  background: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #d4d4d4;
  padding: 5px 10px;
  transition: all 0.2s ease 0s;
  width: 405px;
}

.modalBox input.button-go,
.modalBox input.button-back {
  text-align: center;
}
h1 {
  text-align: center;
  font-size: 2rem;
  padding: 0.5rem 0;
}
.modalBox input.button-go,
.modalBox input.button-back {
  min-width: 120px;
  text-align: center;
}
</style>
