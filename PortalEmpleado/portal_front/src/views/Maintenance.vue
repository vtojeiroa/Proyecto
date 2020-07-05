<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful
      title="Mantenimiento"
      description="Página que lista las incidencias y permite darles una respuesta"
    />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <section class="linksAdmin">
      <article class="linksAdmin">
        <menulinksAdmin></menulinksAdmin>
      </article>
    </section>
    <main id="container">
      <!-- LISTA DE INCIDENCIAS PENDIENTES DE RESPUESTA -->
      <div class="maintenance">
        <h2>Gestión de incidencias</h2>

        <h3>Registra la respuesta y cierra la incidencia</h3>

        <!--  ANIMACIÓN DE CSS CARGANDO -->

        <div v-show="loading" class="lds-ripple">
          <div></div>
          <div></div>
        </div>
        <h3>Buscador de incidencias</h3>
        <div class="buttons">
          <!-- BOTON PARA RECARGAR LAS INCIDENCIAS -->

          <input class="button-back" value="Reiniciar" @click="search = ''" />
          <!-- BOTON PARA ABRIR EL MODAL DEL BUSCADOR -->
          <input class="button-go" value="Abrir" @click="openModalSearch()" />
        </div>
        <!-- IMPLEMENTACIÓN DEL MODAL DEL BUSCADOR -->
        <div class="modal" v-show="modalSearch">
          <div class="modalBox">
            <label for="bySearch">Buscador de incidencias:</label>
            <input
              v-model="search"
              id="search"
              name="bySearch"
              type="search"
              placeholder="Introduce el ID o algún dato de la incidencia"
            />
            <br />
            <div class="buttons">
              <input class="button-back" value="Cerrar" @click="closeModalSearch()" />
              <input class="button-go" value="Reiniciar" @click="search = ''" />
            </div>
          </div>
        </div>
        <!-- VISTA DE LAS INCIDENCIAS PENDIENTES DE CERRAR -->
        <closeincidences :closeincidences="filteredCloseIncidences" v-on:close="openModal"></closeincidences>

        <!-- MODAL PARA RESPONDER LA INCIDENCIA-->
        <div class="modal" v-show="modal">
          <div class="modalBox" v-on:close="showEditText">
            <h2>Responde la incidencia</h2>

            <label for="newDescription">Comentario :</label>
            <textarea
              type="text"
              v-model="newDescription"
              rows="10"
              cols="50"
              placeholder="Introduce el comentario de cierre"
            />
            <br />
            <br />
            <div class="buttons">
              <input class="button-back" value="Cerrar" @click="closeModal()" />
              <input class="button-go" value="Responder" @click="closeIncidences()" />
            </div>
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

//IMPORTO EL MENU
import menulinksAdmin from "../components/MenuLinksAdmin.vue";

//IMPORTO EL FOOTER
import footercustom from "../components/FooterCustom.vue";

//IMPORTO COMPONENTE
import closeincidences from "../components/CloseIncidences.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA FUNCION DEL TOKEN
import { getAuthToken } from "../api/utils";
export default {
  name: "Maintenance",
  components: { menucustom, menulinksAdmin, footercustom, closeincidences },
  data() {
    return {
      //ARRAY DE LAS INCIDENCIAS PENDIENTE DE RESPUESTA DE LA BBDD
      closeincidences: [],
      modal: false,
      search: "",
      loading: true,
      id: null,
      newId: "",
      newDescription: "",
      modalSearch: false
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LOS INCIDENCIAS
    getCloseIncidences() {
      const token = getAuthToken();
      let self = this;
      axios
        .get("http://localhost:3000/incidences/active", {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        //SI SALE BIEN
        .then(function(response) {
          self.closeincidences = response.data.data;
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
    },

    //FUNCION PARA CONTESTAR UNA INCIDENCIA
    closeIncidences() {
      const token = getAuthToken();
      const data = localStorage.getItem("email");
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      let self = this;
      axios
        .put("http://localhost:3000/incidences/admin/" + this.newId, {
          description: self.newDescription
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de registrar la respuesta a la incidencia. `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //RECARGA LA PÁGINA
            result => {
              self.closeModal();
              self.getCloseIncidences();
              self.emptyFields();
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
      this.newDescription = "";
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
    //  ABRE EL MODAL DEL BUSCADOR
    openModalSearch() {
      this.modalSearch = true;
    },

    //CIERRA EL MODAL DEL BUSCADOR
    closeModalSearch() {
      this.modalSearch = false;
    }
  },
  created() {
    this.getCloseIncidences();
    this.loading = false;
  },
  computed: {
    filteredCloseIncidences() {
      let result = this.closeincidences;

      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          closeincidence =>
            closeincidence.id === parseInt(this.search) ||
            closeincidence.usuarios_id === parseInt(this.search) ||
            closeincidence.descripcion
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            closeincidence.activo === parseInt(this.search)
        );
        if (!result.length) {
          Swal.fire({
            title:
              "Con los parametros introducidos no hemos encontrado ningún cliente",
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

.modalBox input.button-go,
.modalBox input.button-back {
  min-width: 120px;
  text-align: center;
}
.home {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.linksAdmin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
article.linksAdmin a {
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

main#container {
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 4px 0 #d4d4d4;
  box-sizing: border-box;
  margin: 30px auto;
  padding: 15px 30px;
  width: 95%;
  max-width: 900px;
  border-radius: 10px;
  padding-bottom: 81px;
}

body section article.links {
  display: flex;
  justify-content: center;
}

section article a:hover {
  color: #00909e;
}

tr {
  display: flex;
  flex-wrap: wrap;
  vertical-align: middle;
  align-content: space-between;
}

input.button-go {
  padding: 0.75px;
  vertical-align: middle;
}
h2 {
  text-transform: uppercase;
  padding: 1rem 0;
  text-align: center;
  font-size: 28px;
}

h3 {
  text-transform: uppercase;
  text-align: center;
  padding: 1rem 0;
}

input.button-go,
input.button-back {
  text-align: center;
}
.modalBox input.button-go,
.modalBox input.button-back {
  text-align: center;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  overflow-y: auto;
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
  width: 90%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: 10px;
}

.modalBox form table tbody {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.modalBox form table tbody tr {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}
input,
textarea {
  width: 300px;
  padding: 10px;
}
</style>
