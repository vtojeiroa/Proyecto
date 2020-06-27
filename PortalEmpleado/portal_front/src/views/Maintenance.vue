<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful
      title="Mantenimiento"
      description="Página que lista las incidencias y permite darles una respuesta"
    />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!-- LISTA DE CLIENTES -->
    <div class="maintenance">
      <h2>Listado de Incidencias</h2>

      <!--  ANIMACIÓN DE CSS CARGANDO -->

      <div v-show="loading" class="lds-ripple">
        <div></div>
        <div></div>
      </div>
      <div class="button-search">
        <!-- BOTON PARA ABRIR EL MODAL DEL BUSCADOR -->
        <button class="search" @click="openModalSearch()">Abrir el buscador</button>

        <!-- BOTON PARA RECARGAR LOS CLIENTES -->

        <button class="reset" @click="search = ''">reiniciar</button>
      </div>
      <!-- IMPLEMENTACIÓN DEL MODAL DEL BUSCADOR -->
      <div class="modalSearch" v-show="modalSearch">
        <div class="modalSearchBox">
          <label for="bySearch">Buscador de incidencias:</label>
          <input
            v-model="search"
            id="search"
            name="bySearch"
            type="search"
            placeholder="Introduce el ID o algún dato de la incidencia"
          />
          <br />
          <button class="reset" @click="search = ''">Limpiar el buscador</button>
          <button @click="closeModalSearch()">Cerrar el buscador</button>
        </div>
      </div>
      <!-- VISTA DE LOS CLIENTES -->
      <closeincidences :closeincidences="filteredCloseIncidences" v-on:close="openModal"></closeincidences>

      <!-- MODAL PARA EDITAR CLIENTES -->
      <div class="modal" v-show="modal">
        <div class="modalBox" v-on:close="showEditText">
          <h2>Actualiza los datos</h2>

          <label for="newDescription">Comentario :</label>
          <input
            type="text"
            v-model="newDescription"
            placeholder="Introduce el comentario de cierre"
          />
          <br />
          <br />

          <button @click="closeIncidences()">Cerrar Incidencia</button>
          <button @click="closeModal()">Cerrar</button>
        </div>
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

//IMPORTO EL FOOTER
import footercustom from "../components/FooterCustom.vue";

//IMPORTO CLIENTESLISTA
import closeincidences from "../components/CloseIncidences.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA FUNCION DEL TOKEN
import { getAuthToken } from "../api/utils";
export default {
  name: "Maintenance",
  components: { menucustom, footercustom, closeincidences },
  data() {
    return {
      //ARRAY DE LOS CLIENTES DE LA BBDD
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
    //FUNCIÓN PARA CARGAR LOS CLIENTES
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
            //recarga la página
            result => {
              self.closeModal();
              self.getCloseIncidences();
              console.log(response);
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
      console.log(result);
      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          closeincidence =>
            closeincidence.id === parseInt(this.search) ||
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
.modalSearch {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
}

.modalSearchBox {
  background: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
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
  color: whitesmoke;
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
