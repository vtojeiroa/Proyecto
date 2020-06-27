<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Sedes" description="Página que lista las diferentes sedes de la empresa" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <section class="links">
      <article class="links">
        <menulinksAdmin></menulinksAdmin>
        <router-link :to="{ name: 'NewHeadquarter' }">Nueva Sede</router-link>
      </article>
    </section>

    <!-- LISTA DE CLIENTES -->
    <div class="headquarters">
      <h2>Listado de sedes</h2>

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
          <label for="bySearch">Buscador de sedes:</label>
          <input
            v-model="search"
            id="search"
            name="bySearch"
            type="search"
            placeholder="Introduce algún dato de la sede"
          />
          <br />
          <button class="reset" @click="search = ''">Limpiar el buscador</button>
          <button @click="closeModalSearch()">Cerrar el buscador</button>
        </div>
      </div>
      <!-- VISTA DE LOS CLIENTES -->
      <listheadquarters
        :headquarters="filteredHeadquarters"
        v-on:edit="openModal"
        v-on:delete="deleteHeadquarters"
      ></listheadquarters>

      <!-- MODAL PARA EDITAR CLIENTES -->
      <div class="modal" v-show="modal">
        <div class="modalBox" v-on:edit="showEditText">
          <h3>Actualiza los datos</h3>

          <form id="form">
            <table class="form-table">
              <tbody>
                <tr class="status">
                  <td class="image">
                    <label for="newStatus">Estado:</label>
                  </td>
                  <td class="tdFormField">
                    <select name="newStatus" id="newStatus" v-model="newStatus">
                      <option value>Selecciona...</option>
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td class="name">
                    <label for="newName">Nombre* :</label>
                  </td>
                  <td class="name">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      maxlength="255"
                      autocomplete="off"
                      v-model="newName"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="address">
                    <label for="newAddress">Dirección :</label>
                  </td>
                  <td class="address">
                    <input
                      id="address"
                      name="address"
                      type="text"
                      maxlength="255"
                      autocomplete="off"
                      v-model="newAddress"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="postal_code">
                    <label for="newPostalCode">Código postal* :</label>
                  </td>
                  <td class="postal_code">
                    <input
                      id=" postal_code"
                      name=" postal_code"
                      type="text"
                      maxlength="15"
                      autocomplete="off"
                      v-model="newPostalCode"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="location">
                    <label for="newLocation">Localidad :</label>
                  </td>
                  <td class="location">
                    <input
                      id=" location"
                      name=" location"
                      type="text"
                      maxlength="50"
                      autocomplete="off"
                      v-model="newLocation"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="province">
                    <label for="newProvince">Provincia :</label>
                  </td>
                  <td class="province">
                    <input
                      id=" province"
                      name=" province"
                      type="text"
                      maxlength="50"
                      autocomplete="off"
                      v-model="newProvince"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="newCountry">
                    <label for="country">Pais :</label>
                  </td>
                  <td class="country">
                    <input
                      id=" country"
                      name=" country"
                      type="text"
                      autocomplete="off"
                      v-model="newCountry"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>

          <div class="button-data">
            <input type="button" class="button" value="Cerrar" @click="closeModal()" />

            <input
              id="button-data"
              type="submit"
              class="button"
              value="Actualizar"
              @click="updateHeadquarters()"
            />
          </div>
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
import listheadquarters from "../components/ListHeadquarters.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA FUNCION DEL TOKEN
import { getAuthToken } from "../api/utils";
export default {
  name: "Headquarters",
  components: { menucustom, menulinksAdmin, footercustom, listheadquarters },
  data() {
    return {
      //ARRAY DE LOS CLIENTES DE LA BBDD
      headquarters: [],
      modal: false,
      search: "",
      loading: true,
      id: null,
      modalSearch: false,
      newId: "",
      newStatus: "",
      newName: "",
      newAddress: "",
      newPostalCode: "",
      newLocation: "",
      newProvince: "",
      newCountry: ""
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LOS CLIENTES
    getHeadquarters() {
      const token = getAuthToken();
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      let self = this;
      axios
        .get("http://localhost:3000/headquarters")
        //SI SALE BIEN
        .then(function(response) {
          self.headquarters = response.data.data;
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
      this.newName = data.nombre;
      this.newAddress = data.direccion;
      this.newPostalCode = data.codigo_postal;
      this.newLocation = data.localidad;
      this.newProvince = data.provincia;
      this.newCountry = data.pais;
    },

    //FUNCION PARA ACTUALIZAR UN CLIENTE
    updateHeadquarters(data) {
      const token = getAuthToken();
      /* const data = localStorage.getItem("id"); */
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      axios
        .put("http://localhost:3000/headquarters/" + this.newId, {
          active: self.newStatus,
          name: self.newName,
          address: self.newAddress,
          postal_code: self.newPostalCode,
          location: self.newLocation,
          province: self.newProvince,
          country: self.newCountry
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de actualizar los datos de la sede `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //recarga la página
            result => {
              self.closeModal();
              self.getHeadquarters();
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
    deleteHeadquarters(data) {
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
            .delete("http://localhost:3000/headquarters/" + data)
            //  SI SALE BIEN
            .then(function(response) {
              //MOSTRAR UN MENSAJE CON EL RESULTADO
              Swal.fire({
                icon: "success",
                title: `Acabas de borrar la sede `,
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
    this.getHeadquarters();
    this.loading = false;
  },
  computed: {
    filteredHeadquarters() {
      let result = this.headquarters;
      console.log(result);
      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          headquarter =>
            headquarter.nombre
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            headquarter.id === parseInt(this.search) ||
            headquarter.activo === parseInt(this.search)
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
