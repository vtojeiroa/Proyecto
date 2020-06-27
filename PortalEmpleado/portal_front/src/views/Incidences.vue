<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Incidencias" description="Página de Incidencias" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!-- LISTA DE CLIENTES -->

    <h2>Listado de incidencias</h2>

    <!--  ANIMACIÓN DE CSS CARGANDO -->

    <div v-show="loading" class="lds-ripple">
      <div></div>
      <div></div>
    </div>
    <div class="button-search">
      <!-- BOTON PARA ABRIR EL MODAL DEL BUSCADOR -->
      <button class="search" @click="openModalSearch()">Abrir el buscador</button>

      <!-- BOTON PARA RECARGAR LAS INCIDENCIAS -->

      <button class="reset" @click="search = ''">reiniciar</button>
    </div>
    <!-- IMPLEMENTACIÓN DEL MODAL DEL BUSCADOR -->
    <div class="modalSearch" v-show="modalSearch">
      <div class="modalSearchBox">
        <label for="bySearch">Buscador de clientes:</label>
        <input
          v-model="search"
          id="search"
          name="bySearch"
          type="search"
          placeholder="Introduce algún dato de la incidencia"
        />
        <br />
        <button class="reset" @click="search = ''">Limpiar el buscador</button>
        <button @click="closeModalSearch()">Cerrar el buscador</button>
      </div>
    </div>
    <!-- VISTA DE LAS INCIDENCIAS -->
    <clienteslista :clientes="filteredClients" v-on:edit="openModal" v-on:delete="deleteClients"></clienteslista>

    <!-- MODAL PARA EDITAR CLIENTES -->
    <div class="modal" v-show="modal">
      <div class="modalBox" v-on:edit="showEditText">
        <h2>Actualiza los datos</h2>
        <label for="newName">Nombre:</label>
        <input type="text" v-model="newName" placeholder="Introduce el nombre" />
        <br />
        <br />
        <label for="newSurname">Apellido:</label>
        <input type="text" v-model="newSurname" placeholder="Introduce el apellido" />
        <br />
        <br />
        <label for="newCity">Ciudad:</label>
        <input type="text" v-model="newCity" placeholder="Introduce la ciudad" />
        <br />
        <br />
        <label for="newCompany">Empresa:</label>
        <input type="text" v-model="newCompany" placeholder="Introduce la empresa" />
        <br />
        <br />
        <button @click="updateClient()">Actualizar</button>
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
//IMPORTO EL FOOTER
import footercustom from "../components/FooterCustom.vue";

//IMPORTO CLIENTESLISTA
import listincidences from "../components/ListIncidences.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";
import { getAuthToken } from "../api/utils";

export default {
  name: "Clientes",
  components: { menucustom, footercustom, listincidences },
  data() {
    return {
      //ARRAY DE LOS CLIENTES DE LA BBDD
      incidences: [],
      modal: false,
      search: "",
      loading: true,
      id: null,
      newName: "",
      newSurname: "",
      newCity: "",
      newCompany: "",
      modalSearch: false
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LOS CLIENTES
    getClients() {
      let self = this;
      axios
        .get("http://localhost:3050/clientes")
        //SI SALE BIEN
        .then(function(response) {
          console.log(response);
          self.clientes = response.data;
        })
        //SI SALE MAL
        .catch(function(error) {
          console.log(error);
        });
    },

    showEditText(data) {
      this.newName = data.nombre;
      this.newSurname = data.apellido;
      this.newCity = data.ciudad;
      this.newCompany = data.empresa;
      this.id = data.id;
    },

    //FUNCION PARA ACTUALIZAR UN CLIENTE
    updateClient() {
      let self = this;
      axios
        .put("http://localhost:3050/clientes/update/" + self.id, {
          id: self.id,
          nombre: self.newName,
          apellido: self.newSurname,
          ciudad: self.newCity,
          empresa: self.newCompany
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de actualizar los datos del cliente `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //recarga la página
            result => {
              location.reload();
              console.log(response);
            }
          );
        })
        //SI SALE MAL
        .catch(function(error) {
          console.log(error);
        });
    },
    //FUNCION PARA ELIMINAR UN CLIENTE DE LA BBDD
    deleteClients(data) {
      axios
        .delete("http://localhost:3050/clientes/del/" + data, {
          id: data
        })
        //  SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de borrar los datos del cliente `,
            showConfirmButton: false,
            timer: 2500
          }).then(result => {
            location.reload();
            console.log(response);
          });
        })
        //SI SALE MAL
        .catch(function(error) {
          console.log(error);
        });
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
    this.getClients();
    this.loading = false;
  },
  computed: {
    filteredClients() {
      let result = this.clientes;
      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          cliente =>
            cliente.nombre.toLowerCase().includes(this.search.toLowerCase()) ||
            cliente.id === parseInt(this.search) ||
            cliente.apellido
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            cliente.ciudad.toLowerCase().includes(this.search.toLowerCase()) ||
            cliente.empresa.toLowerCase().includes(this.search.toLowerCase())
        );
        if (!result.length) {
          Swal.fire({
            title:
              "Con los parametros introducidos no hemos encontrado ningún cliente",
            text: "Vuelve a intentarlo",
            confirmButtonText: "Ok"
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
