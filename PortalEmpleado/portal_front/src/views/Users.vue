<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Usuarios" description="Página que lista los usuarios" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <section class="links">
      <article class="links">
        <menulinksAdmin v-on:showusers="showUsersMenu"></menulinksAdmin>
      </article>
    </section>

    <!-- LISTA DE CLIENTES -->
    <div class="users" v-show="seeUsers">
      <h2>Listado de usuarios</h2>

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
      <listusers :users="filteredUsers" v-on:edit="openModal" v-on:delete="deleteUsers"></listusers>

      <!-- MODAL PARA EDITAR CLIENTES -->
      <div class="modal" v-show="modal">
        <div class="modalBox" v-on:edit="showEditText">
          <h2>Actualiza los datos</h2>
          <label for="newId">ID :</label>
          <input type="text" v-model="newId" placeholder="Introduce el id" />
          <br />
          <label for="newStatus">Estado:</label>
          <input type="text" v-model="newStatus" placeholder="Introduce el estado" />
          <br />
          <br />
          <label for="newRole">Tipo de usuario:</label>
          <input type="text" v-model="newRole" placeholder="Introduce el estado" />
          <br />
          <br />
          <label for="newName">Nombre:</label>
          <input type="text" v-model="newName" placeholder="Introduce el nombre" />
          <br />
          <br />
          <label for="newSurname">Apellido:</label>
          <input type="text" v-model="newSurname" placeholder="Introduce el apellido" />
          <br />
          <br />
          <label for="newDocument">Documento de identidad:</label>
          <input
            type="text"
            v-model="newDocument"
            placeholder="Introduce el documento de identidad"
          />
          <br />
          <br />
          <label for="newEmail">Correo electrónico:</label>
          <input type="email" v-model="newEmail" placeholder="Introduce el correo electrónico" />
          <br />
          <br />
          <label for="newAvatar">Foto:</label>
          <input type="text" v-model="newAvatar" placeholder="Introduce una foto" />
          <br />
          <br />
          <label for="newAddress">Dirección:</label>
          <input type="text" v-model="newAddress" placeholder="Introduce la dirección" />
          <br />
          <br />
          <label for="newPostalCode">Código postal:</label>
          <input type="text" v-model="newPostalCode" placeholder="Introduce el código postal" />
          <br />
          <br />
          <label for="newLocation">Ciudad:</label>
          <input type="text" v-model="newLocation" placeholder="Introduce la ciudad" />
          <br />
          <br />
          <label for="newProvince">Provincia:</label>
          <input type="text" v-model="newProvince" placeholder="Introduce la provinia" />
          <br />
          <br />
          <label for="newCountry">Pais:</label>
          <input type="text" v-model="newCountry" placeholder="Introduce el pais" />
          <br />
          <br />

          <label for="newPhone">Teléfono:</label>
          <input type="text" v-model="newPhone" placeholder="Introduce el teléfono" />
          <br />
          <br />
          <label for="newBirthdate">Fecha de nacimiento:</label>
          <input type="date" v-model="newBirthdate" placeholder="Introduce la fecha de nacimiento" />
          <br />
          <br />
          <label for="newHeadquarter">Sede:</label>
          <input type="text" v-model="newHeadquarter" placeholder="Introduce la sede de trabajo" />
          <br />
          <br />
          <button @click="updateUser()">Actualizar</button>
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
import listusers from "../components/ListUsers.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA FUNCION DEL TOKEN
import { getAuthToken } from "../api/utils";
export default {
  name: "Users",
  components: { menucustom, menulinksAdmin, footercustom, listusers },
  data() {
    return {
      //ARRAY DE LOS CLIENTES DE LA BBDD
      users: [],
      modal: false,
      search: "",
      loading: true,
      id: null,
      newId: "",
      newStatus: "",
      newRole: "",
      newName: "",
      newSurname: "",
      newDocument: "",
      newEmail: "",
      newAvatar: "",
      newAddress: "",
      newPostalCode: "",
      newLocation: "",
      newProvince: "",
      newCountry: "",
      newPhone: "",
      newBirthdate: "",
      newHeadquarter: "",
      modalSearch: false,
      seeUsers: true
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LOS CLIENTES
    getUsers() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");
      let self = this;
      axios
        .get("http://localhost:3000/admin/users", {
          headers: {
            authorization: `Bearer ${token}`
          }
        })
        //SI SALE BIEN
        .then(function(response) {
          self.users = response.data.data;
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
      this.newRole = data.tipo_usuario;
      this.newName = data.nombre;
      this.newSurname = data.apellidos;
      this.newDocument = data.num_doc_identidad;
      this.newEmail = data.email;
      this.newAddress = data.direccion;
      this.newPostalCode = data.codigo_postal;
      this.newLocation = data.localidad;
      this.newProvince = data.provincia;
      this.newCountry = data.pais;
      this.newPhone = data.telefono;
      this.newBirthdate = data.fecha_nacimiento;
      this.newHeadquarter = data.sedes_id;
    },

    //FUNCION PARA ACTUALIZAR UN CLIENTE
    updateUser() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");
      let self = this;
      axios
        .put("http://localhost:3000/users/" + this.newId, {
          headers: {
            authorization: `Bearer ${token}`
          },
          activo: self.newStatus,
          name: self.newName,
          surname: self.newSurname,
          identification_document: self.newDocument,
          address: self.newAddress,
          postal_code: self.newPostalCode,
          location: self.newLocation,
          province: self.newProvince,
          country: self.newCountry,
          phone: self.newPhone,
          birthdate: self.newBirthdate,
          headquarters: self.newHeadquarter
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de actualizar los datos del usuario `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //recarga la página
            result => {
              self.closeModal();
              self.location;
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
    deleteUsers(data) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });

      swalWithBootstrapButtons
        .fire({
          title: "¿Estás seguro?",
          text: "¡No podrás deshacerlo!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Si, bórralo!",
          cancelButtonText: "No, cancélalo!",
          reverseButtons: true
        })
        .then(result => {
          if (result.value) {
            const token = getAuthToken();
            const data = localStorage.getItem("id");
            axios
              .delete("http://localhost:3000/admin/users/" + data, {
                headers: {
                  authorization: `Bearer ${token}`
                },
                id: data
              })
              //  SI SALE BIEN
              .then(function(response) {
                //MOSTRAR UN MENSAJE CON EL RESULTADO
                Swal.fire({
                  icon: "success",
                  title: `Acabas de borrar los datos del usuario `,
                  showConfirmButton: false,
                  timer: 2500
                }).then(result => {
                  search = "";
                  console.log(response);
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
            swalWithBootstrapButtons.fire(
              "¡Eliminado!",
              "El usuario ha sido borrado.",
              "success"
            );
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              "Cancelado",
              "El usuario sigue en la BBDD :)",
              "error"
            );
          }
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
    },
    //CIERRA EL MODAL DEL BUSCADOR
    showUsersMenu() {
      this.seeUsers = true;
    }
  },
  created() {
    this.getUsers();
    this.loading = false;
  },
  computed: {
    filteredUsers() {
      let result = this.users;
      console.log(result);
      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          user =>
            user.nombre.toLowerCase().includes(this.search.toLowerCase()) ||
            user.id === parseInt(this.search) ||
            user.apellidos.toLowerCase().includes(this.search.toLowerCase()) ||
            user.localidad.toLowerCase().includes(this.search.toLowerCase()) ||
            user.sedes_id === parseInt(this.search)
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
