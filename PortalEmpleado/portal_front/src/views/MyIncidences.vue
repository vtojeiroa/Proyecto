<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful
      title="Mis Incidencias"
      description="Página que lista mis incidencias"
    />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>
    <section class="links">
      <article class="links">
        <menulinks></menulinks>
        <router-link :to="{ name: 'NewIncidence' }"
          >Nueva Incidencia</router-link
        >
      </article>
    </section>

    <!--  ANIMACIÓN DE CSS CARGANDO -->

    <div v-show="loading" class="lds-ripple">
      <div></div>
      <div></div>
    </div>
    <!-- LISTA DE CLIENTES -->

    <!-- IMPLEMENTACIÓN DEL BUSCADOR -->
    <section id="content">
      <article class="search-input">
        <h1>Busqueda avanzada</h1>
        <div class="form">
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
                <input type="date" id="from" name="from" v-model="dateInit" />
              </li>
              <li>
                <label for="to">Fecha final &#60;</label>
                <input type="date" id="to" name="to" v-model="dateEnd" />
              </li>
            </ul>
          </form>
          <div class="form-element form-element-submit">
            <input
              type="submit"
              class="button"
              value="Consultar"
              @click="getIncidences(type, status, dateInit, dateEnd)"
            />
          </div>
          <input
            type="submit"
            class="button"
            name="form"
            value="Limpiar"
            @click="emptyFields()"
          />
        </div>
      </article>
      <article class="search-data">
        <h1 class="title">Mis incidencias</h1>

        <!-- VISTA DE LAS INCIDENCIAS -->
        <listmyincidences
          :myincidences="myincidences"
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

    <!-- MODAL PARA EDITAR CLIENTES -->
    <div class="modal" v-show="modal">
      <div class="modalBox" v-on:edit="showEditText">
        <h2>Actualiza los datos</h2>

        <label for="newDescription">Comentario:</label>
        <input
          type="text"
          v-model="newDescription"
          placeholder="Introduce el comentario"
        />
        <br />
        <br />
        <button @click="updateIncidence()">Actualizar</button>
        <button @click="closeModal()">Cerrar</button>
      </div>
    </div>

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
      loading: true,
      seeVote: false,
      seeIncidences: true,
      voteDescription: "",
      myincidencee: {},
      rating: {},
      vote: "",
      id: "",
      newId: "",
      newDescription: "",
      type: "",
      status: "",
      dateInit: "",
      dateEnd: "",
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
            authorization: `Bearer ${token}`,
          },
          params: {
            type: this.type,
            active: this.status,
            date_init: this.dateInit,
            date_end: this.dateEnd,
          },
        })
        //SI SALE BIEN
        .then(function(response) {
          console.log(response);
          self.myincidences = response.data.data;
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
          description: self.newDescription,
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de actualizar los datos de la incidencia `,
            showConfirmButton: false,
            timer: 2500,
          }).then(
            //recarga la página
            (result) => {
              self.closeModal();
              self.getIncidences();
              console.log(response);
            }
          );
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

    //  ABRE EL MODAL PARA EDITAR LOS DATOS DEL CLIENTE Y MUESTRA LOS DATOS ORIGINALES
    openModal(data) {
      this.modal = true;
      this.showEditText(data);
    },
    // CIERRA EL MODAL DESPUES DE EDITAR LOS DATOS DEL CLIENTE
    closeModal() {
      this.modal = false;
    },
    //FUNCION PARA ELIMINAR UNA INCIDENCIA DE LA BBDD
    deleteIncidences(data) {
      const token = getAuthToken();
      /* const data = localStorage.getItem("id"); */
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás deshacerlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, bórralo!",
      }).then((result) => {
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
                timer: 2500,
              }).then((result) => this.getIncidences());
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
          description: voteDescription,
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de votar la reserva `,
            showConfirmButton: false,
            timer: 2500,
          }).then(
            //recarga la página
            (result) => {
              this.closeVoteView();
              this.getIncidences();

              console.log(response);
            }
          );
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

    emptyFields() {
      this.type = "";
      this.status = "";
      this.dateInit = "";
      this.dateEnd = "";
      this.getIncidences();
    },
    showVoteView() {
      this.seeVote = true;
      this.seeIncidences = false;
    },
    closeVoteView() {
      this.seeVote = false;
      this.seeIncidences = true;
    },
  },
  created() {
    this.getIncidences();
    this.loading = false;
  },
};
</script>
<style scoped>
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
  display: flex;
  flex-wrap: wrap;
}
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

.home {
  display: flex;
  flex-direction: column;
}

article {
  display: flex;
  flex-direction: column;
  align-self: center;
  border: 2px solid red;
  color: blue;
  /*   width: 300px; */
  align-items: center;
  padding: 0.5rem;
  margin: 1rem;
}
label {
  padding: 1rem;
  font-size: 1.25rem;
}
input {
  padding: 0.5rem;
  width: 17rem;
  height: 1.75rem;
  margin: 0.5rem 0;
  border-radius: 5px;
  font-size: 1rem;
}
button {
  padding: 0.2rem;
  width: 8rem;
  background: red;
  color: whitesmoke;
  border-radius: 10px;
  font-weight: bolder;
}
button:hover {
  background: whitesmoke;
  color: red;
  font-weight: bolder;
}
button.search {
  text-align: center;
}
</style>
