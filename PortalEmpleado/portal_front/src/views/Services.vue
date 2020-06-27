<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Services" description="Página que lista los servicios" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <section class="links">
      <article class="links">
        <menulinksAdmin></menulinksAdmin>
        <router-link :to="{ name: 'NewService' }">Nuevo Servicio</router-link>
      </article>
    </section>

    <!-- LISTA DE CLIENTES -->
    <div class="services">
      <h2>Listado de servicios</h2>

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
          <label for="bySearch">Buscador de usuarios:</label>
          <input
            v-model="search"
            id="search"
            name="bySearch"
            type="search"
            placeholder="Introduce algún dato del cliente"
          />
          <br />
          <button class="reset" @click="search = ''">Limpiar el buscador</button>
          <button @click="closeModalSearch()">Cerrar el buscador</button>
        </div>
      </div>
      <!-- VISTA DE LOS CLIENTES -->
      <listservices :services="filteredServices" v-on:edit="openModal" v-on:delete="deleteServices"></listservices>

      <!-- MODAL PARA EDITAR CLIENTES -->
      <div class="modal" v-show="modal">
        <div class="modalBox" v-on:edit="showEditText">
          <h2>Actualiza los datos</h2>

          <br />
          <br />
          <label for="newStatus">Estado:</label>
          <select name="newStatus" id="newStatus" v-model="newStatus">
            <option value>Selecciona...</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
          <br />
          <br />
          <label for="newSection">Tipo de servicio:</label>
          <select name="newSection" id="newSection" v-model="newSection">
            <option value>Selecciona...</option>
            <option value="Reserva">Reserva</option>
            <option value="Incidencia">Incidencia</option>
          </select>
          <br />
          <br />
          <label for="newType">Tipo:</label>
          <input type="text" v-model="newType" placeholder="Introduce el tipo" />
          <br />
          <br />
          <label for="newDescription">Descripción:</label>
          <input type="text" v-model="newDescription" placeholder="Introduce la descripción" />
          <br />
          <br />
          <button @click="updateServices()">Actualizar</button>
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

//IMPORTO EL MENU
import menulinksAdmin from "../components/MenuLinksAdmin.vue";

//IMPORTO EL FOOTER
import footercustom from "../components/FooterCustom.vue";

//IMPORTO CLIENTESLISTA
import listservices from "../components/ListServices.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA FUNCION DEL TOKEN
import { getAuthToken } from "../api/utils";
export default {
  name: "Users",
  components: { menucustom, menulinksAdmin, footercustom, listservices },
  data() {
    return {
      //ARRAY DE LOS CLIENTES DE LA BBDD
      services: [],
      modal: false,
      search: "",
      loading: true,
      id: null,
      newId: "",
      newStatus: "",
      newSection: "",
      newType: "",
      newDescription: "",
      /*  newCreation: "", */
      newHeadquarter: "",
      modalSearch: false
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LOS CLIENTES
    getServices() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");
      let self = this;
      axios
        .get("http://localhost:3000/services", {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        //SI SALE BIEN
        .then(function(response) {
          self.services = response.data.data;
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
      this.newStatus = data.activo;
      this.newSection = data.seccion;
      this.newType = data.tipo;
      this.newDescription = data.descripcion;
    },

    //FUNCION PARA ACTUALIZAR UN CLIENTE
    updateServices() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      axios
        .put("http://localhost:3000/services/" + this.newId, {
          active: self.newStatus,
          section: self.newSection,
          type: self.newType,
          description: self.newDescription
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de actualizar los datos del servicio `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //recarga la página
            result => {
              self.closeModal();
              self.getServices();
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
    //FUNCION PARA ELIMINAR UN CLIENTE DE LA BBDD
    deleteServices(data) {
      const token = getAuthToken();
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
            .delete("http://localhost:3000/services/" + data)
            //  SI SALE BIEN
            .then(function(response) {
              //MOSTRAR UN MENSAJE CON EL RESULTADO
              Swal.fire({
                icon: "success",
                title: `Acabas de borrar el servicio `,
                showConfirmButton: false,
                timer: 2500
              }).then(result => {
                location.reload();
              });
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
    //  ABRE EL MODAL PARA EDITAR LOS DATOS DEL SERVICIO Y MUESTRA LOS DATOS ORIGINALES
    openModal(data) {
      this.modal = true;
      this.showEditText(data);
    },
    // CIERRA EL MODAL DESPUES DE EDITAR LOS DATOS DEL SERVICIO
    closeModal() {
      this.modal = false;
    },
    //  ABRE EL MODAL DEL BUSCADOR
    openModalSearch() {
      this.modalSearch = true;
    },

    //CIERRA EL MODAL DEL BUSCADOR
    closeModalSearch() {
      this.search = "";
      this.modalSearch = false;
    }
  },
  created() {
    this.getServices();
    this.loading = false;
  },
  computed: {
    filteredServices() {
      let result = this.services;
      console.log(result);
      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          service =>
            service.descripcion
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            service.id === parseInt(this.search) ||
            service.activo === parseInt(this.search)
        );
        if (!result.length) {
          Swal.fire({
            title:
              "Con los parametros introducidos no hemos encontrado ningún servicio",
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
