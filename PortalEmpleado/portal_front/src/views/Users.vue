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
    <main id="container">
      <!-- LISTA DE CLIENTES -->
      <div class="users" v-show="seeUsers">
        <h2>Gestión de usuarios</h2>

        <h3>Gestiona el perfil de los usuarios del portal</h3>
        <!--  ANIMACIÓN DE CSS CARGANDO -->

        <div v-show="loading" class="lds-ripple">
          <div></div>
          <div></div>
        </div>
        <h3>Buscador de usuarios</h3>
        <div class="buttons" id="search">
          <!-- BOTON PARA RECARGAR LOS CLIENTES -->

          <input class="button-back" value="Reiniciar" @click="search = ''" />
          <!-- BOTON PARA ABRIR EL MODAL DEL BUSCADOR -->
          <input class="button-go" value="Abrir" @click="openModalSearch()" />
        </div>
        <!-- IMPLEMENTACIÓN DEL MODAL DEL BUSCADOR -->
        <div class="modal" v-show="modalSearch">
          <div class="modalBox">
            <label for="bySearch">Buscador de usuarios:</label>
            <input
              v-model="search"
              id="search"
              name="bySearch"
              type="search"
              placeholder="Introduce algún dato del cliente"
            />
            <br />
            <div class="buttons">
              <input class="button-back" value="Cerrar" @click="closeModalSearch()" />
              <input class="button-go" value="Reiniciar" @click="search = ''" />
            </div>
          </div>
        </div>
        <!-- VISTA DE LOS CLIENTES -->
        <listusers :users="filteredUsers" v-on:edit="openModal" v-on:delete="deleteUsers"></listusers>

        <!-- MODAL PARA EDITAR CLIENTES -->
        <div class="modal" style="overflow-y:auto" v-show="modal">
          <div class="modalBox" v-on:edit="showEditText">
            <h2>Actualiza los datos</h2>
            <fieldset>
              <form>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label for="newId">ID :</label>
                      </td>
                      <td>
                        <input type="text" v-model="newId" placeholder="Introduce el id" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newStatus">Estado:</label>
                      </td>
                      <td class="data">
                        <select
                          class="newStatus"
                          name="newStatus"
                          id="newStatus"
                          v-model="newStatus"
                        >
                          <option value>Selecciona...</option>
                          <option value="1">Activo</option>
                          <option value="0">Inactivo</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newRole">Tipo de usuario:</label>
                      </td>
                      <td>
                        <input type="text" v-model="newRole" placeholder="Introduce el estado" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newName">Nombre:</label>
                      </td>
                      <td>
                        <input type="text" v-model="newName" placeholder="Introduce el nombre" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newSurname">Apellido:</label>
                      </td>
                      <td>
                        <input type="text" v-model="newSurname" placeholder="Introduce el apellido" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newDocument">Documento de identidad:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          v-model="newDocument"
                          placeholder="Introduce el documento de identidad"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newEmail">Correo electrónico:</label>
                      </td>
                      <td>
                        <input
                          type="email"
                          v-model="newEmail"
                          placeholder="Introduce el correo electrónico"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <label for="newAvatar">Foto:</label>
                      </td>
                      <td>
                        <input type="text" v-model="newAvatar" placeholder="Introduce una foto" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newAddress">Dirección:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          v-model="newAddress"
                          placeholder="Introduce la dirección"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newPostalCode">Código postal:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          v-model="newPostalCode"
                          placeholder="Introduce el código postal"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newLocation">Ciudad:</label>
                      </td>
                      <td>
                        <input type="text" v-model="newLocation" placeholder="Introduce la ciudad" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newProvince">Provincia:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          v-model="newProvince"
                          placeholder="Introduce la provinia"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newCountry">Pais:</label>
                      </td>
                      <td>
                        <input type="text" v-model="newCountry" placeholder="Introduce el pais" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newPhone">Teléfono:</label>
                      </td>
                      <td>
                        <input type="text" v-model="newPhone" placeholder="Introduce el teléfono" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newBirthdate">Fecha de nacimiento:</label>
                      </td>
                      <td>
                        <input
                          type="date"
                          v-model="newBirthdate"
                          placeholder="Introduce la fecha de nacimiento"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label for="newHeadquarter">Sede:</label>
                      </td>
                      <td>
                        <input
                          type="text"
                          v-model="newHeadquarter"
                          placeholder="Introduce la sede de trabajo"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </fieldset>
            <div class="buttons">
              <input class="button-back" value="Cerrar" @click="closeModal()" />
              <input class="button-go" value="Actualizar" @click="updateUser()" />
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

//IMPORTO CLIENTESLISTA
import listusers from "../components/ListUsers.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA FUNCION DEL TOKEN
import { getAuthToken, formatDateToFront } from "../api/utils";
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
      seeUsers: true,
      image: "http://localhost:3000/uploads/" + "fotoavatar.jpg"
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LOS CLIENTES
    getUsers() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      axios
        .get("http://localhost:3000/admin/users", {})
        //SI SALE BIEN
        .then(function(response) {
          self.users = response.data.data;

          const image = response.data.foto;
          if (!!!self.users.avatar) {
            self.users.avatar =
              "http://localhost:3000/uploads/" + "fotoavatar.jpg";
          } else {
            self.users.avatar = "http://localhost:3000/uploads/" + image;
          }
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
      this.newAvatar = data.foto;
    },

    //FUNCION PARA ACTUALIZAR UN CLIENTE
    updateUser() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");

      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      axios
        .put("http://localhost:3000/users/" + this.newId, {
          activo: self.newStatus,
          name: self.newName,
          surname: self.newSurname,
          document: self.newDocument,
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
              self.getUsers();
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
          const token = getAuthToken();
          axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
          let self = this;
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
                self.getUsers();
                search = "";
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

      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          user =>
            user.nombre.toLowerCase().includes(this.search.toLowerCase()) ||
            user.id === parseInt(this.search) ||
            user.apellidos.toLowerCase().includes(this.search.toLowerCase()) ||
            user.tipo_usuario
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            user.email.toLowerCase().includes(this.search.toLowerCase()) ||
            user.activo === parseInt(this.search) ||
            user.sedes_id.toLowerCase().includes(this.search.toLowerCase())
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
.modalBox input {
  width: 280px;
  padding: 10px;
}
.modalBox label {
  padding: 10px;
}
</style>
