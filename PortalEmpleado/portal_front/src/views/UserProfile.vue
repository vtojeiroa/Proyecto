<template>
  <div>
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Mis datos" description="Página de datos del usuario" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>
    <!--  LINKS DATOS -->
    <section class="links">
      <article class="links">
        <menulinks></menulinks>
      </article>
    </section>
    <main id="container">
      <section>
        <!--  ANIMACIÓN DE CSS CARGANDO -->

        <div v-show="loading" class="lds-ripple">
          <div></div>
          <div></div>
        </div>

        <!-- BOTON QUE TE ENVIA A OTRA PÁGINA PARA MODIFICAR EL EMAIL-->
        <p>
          Si quieres cambiar el correo electrónico con el que inicias sesión,
          pincha
          <router-link :to="{ name: 'EditEmail' }">aquí</router-link>
        </p>

        <!-- MODAL PARA EDITAR EL USUARIO -->

        <article class="content">
          <h1>Mis datos</h1>

          <!-- PERFIL DEL USUARIO -->

          <profiledata
            :dataUsers="dataUsers"
            v-on:edit="
              openModalProfile();
              showEditText();
            "
          ></profiledata>
          <div class="modal" v-show="modalProfile">
            <div class="modalBox" v-on:edit="showEditText">
              <h3>¡Mantén actualizados tus datos!</h3>
              <form id="form">
                <table class="form-table">
                  <tbody>
                    <tr class="editAvatar">
                      <td class="image">
                        <label>Actualizar tu Imagen de perfil:</label>
                      </td>
                      <td class="tdFormField">
                        <input
                          id="avatar"
                          type="file"
                          ref="avatar"
                          @change="handleFileUpload()"
                        />
                        <button
                          class="input-button"
                          type="button"
                          @click="uploadImage()"
                        >
                          Actualizar Foto
                        </button>
                        <button class="cancel" @click="cancel()"></button>
                      </td>
                    </tr>
                    <tr>
                      <td class="status">
                        <label for="newStatus">Status* :</label>
                      </td>
                      <td class="status">
                        <input
                          id="status"
                          name="status"
                          type="text"
                          maxlength="255"
                          autocomplete="off"
                          v-model="newStatus"
                          disabled
                        />
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
                      <td class="surname">
                        <label for="newSurname">Apellidos* :</label>
                      </td>
                      <td class="surname">
                        <input
                          id="surname"
                          name="surname"
                          type="text"
                          maxlength="255"
                          autocomplete="off"
                          v-model="newSurname"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="document">
                        <label for="newDocument">Documento identidad :</label>
                      </td>
                      <td class="document">
                        <input
                          id="document"
                          name="document"
                          type="text"
                          maxlength="15"
                          autocomplete="off"
                          v-model="newDocument"
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
                    <tr>
                      <td class="birthdate">
                        <label for="newBirthdate">Fecha de nacimiento* :</label>
                      </td>
                      <td class="birthdate">
                        <input
                          id="birthdate"
                          name="birthdate"
                          type="date"
                          class="birthdate"
                          autocomplete="off"
                          v-model="newBirthdate"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td class="mobile">
                        <label for="newMobile">Teléfono móvil:</label>
                      </td>
                      <td class="mobile">
                        <input
                          id="mobile"
                          name="mobile"
                          type="text"
                          maxlength="12"
                          autocomplete="off"
                          v-model="newMobile"
                        />
                      </td>
                    </tr>
                    <!-- <tr>
                      <td class="headquarter">
                        <label class="headquarter" for="headquarter">Indica tu sede de trabajo *:</label>
                      </td>
                      <td>
                        <select name="headquarter" id="headquarter" v-model="newHeadquarter">
                          <option value>Selecciona...</option>
                          <option value="coruña">Coruña</option>
                          <option value="santiago">Santiago</option>
                          <option value="malaga">Málaga</option>
                          <option value="vigo">Vigo</option>
                        </select>
                      </td>
                    </tr>-->
                  </tbody>
                </table>
              </form>

              <div class="button-data">
                <input
                  type="button"
                  class="button"
                  value="Cancelar"
                  @click="closeModalProfile()"
                />

                <input
                  id="button-data"
                  type="submit"
                  class="button"
                  value="Actualizar"
                  @click="updateUser()"
                />
              </div>
            </div>
          </div>
          <!-- IMPLEMENTACIÓN DEL MODAL PARA MODIFICAR LA CONTRASEÑA -->
          <p>
            Si quieres modificar tu contraseña, pincha
            <input
              type="submit"
              value="modificar contraseña"
              class="button"
              @click="openModal()"
            />
          </p>
          <div class="modal" v-show="modal">
            <div class="modalBox">
              <section class="password">
                <h1>Cambiar contraseña</h1>
                <h3>En este apartado puedes modificar tu contraseña.</h3>
                <form>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <label>Contraseña actual*:</label>
                        </td>
                        <td>
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            autocomplete="off"
                            v-model="oldPassword"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label>Nueva contraseña*:</label>
                        </td>
                        <td>
                          <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            autocomplete="off"
                            v-model="newPassword"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <label>Repetir contraseña*:</label>
                        </td>
                        <td>
                          <input
                            id="newPasswordRepeat"
                            name="newPasswordRepeat"
                            type="password"
                            autocomplete="off"
                            v-model="newPasswordRepeat"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
                <div class="buttonPassword">
                  <input
                    type="button"
                    class="button"
                    value="Cancelar"
                    @click="closeModal()"
                  />
                  <input
                    type="submit"
                    class="button"
                    value="Modificar"
                    @click="
                      updatePassword(
                        oldPassword,
                        newPassword,
                        newPasswordRepeat
                      )
                    "
                  />
                </div>
              </section>
            </div>
          </div>
        </article>
      </section>
    </main>
    <footercustom></footercustom>
  </div>
</template>

<script>
// IMPORTO AXIOS
import axios from "axios";

//IMPORTO LOS COMPONENTERS

import menucustom from "@/components/MenuCustom.vue";
import menulinks from "@/components/MenuLinks.vue";
import profiledata from "@/components/ProfileData.vue";
import footercustom from "@/components/FooterCustom.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA  VARIAS FUNCION DE UTILS
import dateFormat from "dateformat";

import {
  getAuthToken,
  logOut,
  clearLogin,
  getUserName,
  isLoggedIn,
  checkAdmin,
  setName,
  formatDateShort,
} from "../api/utils";

export default {
  name: "UserProfile",
  components: {
    menucustom,
    menulinks,
    profiledata,
    footercustom,
  },
  data() {
    return {
      errorMessage: "",
      //DATOS PARA ACTUALIZAR EL USUARIO
      dataUsers: {},
      avatar: "",
      modalProfile: false,
      correctData: false,
      loading: true,
      id: null,
      idUser: "",
      newId: "",
      newStatus: "",
      newName: "",
      newSurname: "",
      newDocument: "",
      newAddress: "",
      newPostalCode: "",
      newLocation: "",
      newProvince: "",
      newCountry: "",
      newBirthdate: "",
      newMobile: "",
      newAvatar: "",
      newHeadquarter: "",
      date: "",
      //DATOS PARA ACTUALIZAR LA CONTRASEÑA
      modal: false,
      oldPassword: "",
      newPassword: "",
      newPasswordRepeat: "",
      correctDataPassword: false,
    };
  },
  methods: {
    getUser() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");
      let self = this;
      axios
        .get(`http://localhost:3000/users/` + data, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        //SI SALE BIEN
        .then(function(response) {
          self.dataUsers = response.data.data;
          const image = response.data.data.avatar;
          if (!!!self.dataUsers.avatar) {
            self.dataUsers.avatar =
              "http://localhost:3000/uploads/" + "fotoVictor.jpg";
          } else {
            self.dataUsers.avatar = "http://localhost:3000/uploads/" + image;
          }
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

    showEditText() {
      this.newAvatar = this.dataUsers.avatar;
      this.newStatus = this.dataUsers.active;
      this.newName = this.dataUsers.name;
      this.newSurname = this.dataUsers.surname;
      this.newDocument = this.dataUsers.identification_document;
      this.newAddress = this.dataUsers.address;
      this.newPostalCode = this.dataUsers.postal_code;
      this.newLocation = this.dataUsers.location;
      this.newProvince = this.dataUsers.province;
      this.newCountry = this.dataUsers.country;
      this.newBirthdate = this.dataUsers.birthdate_formated;
      this.newMobile = this.dataUsers.phone;
      this.newAvatar = this.dataUsers.avatar;
      this.newHeadquarter = this.dataUsers.headquarters;
    },

    validatingData() {
      if (
        !this.newName ||
        !this.newSurname ||
        !this.newPostalCode ||
        !this.newBirthdate
      ) {
        this.errorMessage = "No has rellenado todos los datos."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else {
        this.correctData = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    //ACTUALIZAMOS LOS DATOS DEL USUARIO Y LA FOTO

    handleFileUpload() {
      this.avatar = this.$refs.avatar.files[0];
      console.log(this.avatar);
    },
    uploadImage() {
      const self = this;
      /*  const token = getAuthToken(); */
      let data = localStorage.getItem("id");
      let formData = new FormData();
      /* formData.append("avatar", self.avatar); */
      formData.append("activo", self.newStatus);
      formData.append("name", self.newName);
      formData.append("surname", self.newSurname);
      formData.append("document", self.newDocument);
      formData.append("address", self.newAddress);
      formData.append("postal_code", self.newPostalCode);
      formData.append("location", self.newLocation);
      formData.append("province", self.newProvince);
      formData.append("country", self.newCountry);
      formData.append("birthdate", self.newBirthdate);
      formData.append("phone", self.newMobile);
      formData.append("avatar", self.newfileImage);
      formData.append("headquarters", self.newHeadquarter);

      axios
        .put("http://localhost:3000/" + "users/" + data, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(function(response) {
          self.getUser();
          self.closeModalProfile();
          Swal.fire({
            icon: "success",
            title: "Cambio de foto de perfil realizado correctamente.",
            showConfirmButton: false,
            timer: 2500,
          });
        })
        .catch((error) =>
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 2500,
          })
        );
    },

    updateUser() {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        const token = getAuthToken();
        let data = localStorage.getItem("id");
        let self = this;
        axios.defaults.headers.common["authorization"] = `Bearer ${token}`;

        axios
          .put("http://localhost:3000/users/" + data, {
            activo: self.newStatus,
            name: self.newName,
            surname: self.newSurname,
            document: self.newDocument,
            address: self.newAddress,
            postal_code: self.newPostalCode,
            location: self.newLocation,
            province: self.newProvince,
            country: self.newCountry,
            birthdate: self.newBirthdate,
            phone: self.newMobile,
            /*  avatar: self.newfileImage, */
            avatar: self.newAvatar,
            headquarters: self.newHeadquarter,
          })
          .then(function(response) {
            self.getUser();
            self.closeModalProfile();
            console.log(response);
            //MOSTRAR UN MENSAJE CON EL RESULTADOS.
            Swal.fire({
              icon: "success",
              title: "Cambios registrados correctamente en su perfil",
              showConfirmButton: false,
              timer: 2500,
            });
          })
          .catch((error) =>
            Swal.fire({
              icon: "error",
              title: error.response.data.message,
              showConfirmButton: false,
              timer: 2500,
            })
          );
      } else {
        Swal.fire({
          icon: "error",
          title: this.errorMessage,
          showConfirmButton: false,
          timer: 2500,
        });
      }
    },

    tagIsAdmin() {
      return checkAdmin();
    },

    emptyFields() {
      this.active = "";
      this.name = "";
      this.surname = "";
      this.identification_document = "";
      this.address = "";
      this.postal_code = "";
      this.location = "";
      this.province = "";
      this.country = "";
      this.birthdate = "";
      this.phone = "";
      this.headquarters = "";
    },

    //  ABRE EL MODAL PARA MODIFICAR LA CONTRASEÑA
    openModalProfile() {
      this.modalProfile = true;
    },
    // CIERRA EL MODAL DESPUES DE MODIFICAR LA CONTRASEÑA
    closeModalProfile() {
      this.modalProfile = false;
    },
    //FUNCIONES PARA VALIDAR LOS DATOS QUE PASAMOS PARA EL CAMBIO DE CONTRASEÑA
    validatingDataPassword() {
      if (!this.oldPassword || !this.newPassword || !this.newPasswordRepeat) {
        this.errorMessage = "No has rellenado todos los datos."; //Establecer mensaje de error
        this.correctDataPassword = false; //NO ENVIAR
      } else if (this.newPassword === this.oldPassword) {
        this.errorMessage =
          "La nueva contraseña no puede se igual a la actual."; //Establecer mensaje de error
        this.correctDataPassword = false; //NO ENVIAR
      } else if (this.newPassword !== this.newPasswordRepeat) {
        this.errorMessage = "Las contraseñas nuevas no coinciden."; //Establecer mensaje de error
        this.correctDataPassword = false; //NO ENVIAR
      } else {
        this.correctDataPassword = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    //FUNCIONES PARA MODIFICAR LA CONTRASEÑA

    updatePassword(oldPassword, newPassword, newPasswordRepeat) {
      this.validatingDataPassword(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctDataPassword) {
        let data = localStorage.getItem("id");
        let self = this;
        axios
          .post(`http://localhost:3000/users/${data}/password`, {
            /*  headers: { authorization: localStorage.getItem("authToken") }, */
            oldPassword: self.oldPassword,
            newPassword: self.newPassword,
            newPasswordRepeat: self.newPasswordRepeat,
          })
          .then(function(response) {
            console.log(response);
            logOut();
            self.emptyFieldsPassword();
            //Lanzar modal de confirmación
            Swal.fire({
              icon: "success",
              title:
                "Cambio de contraseña realizado correctamente. Todos tus tokens quedan invalidados. Haz login de nuevo para conseguir un token válido. ",
              showConfirmButton: false,
              timer: 2500,
            }),
              //Ir a la página de login
              self.$router.push("/");
          })
          .catch((error) =>
            Swal.fire({
              icon: "error",
              title: error.response.data.message,
              showConfirmButton: false,
              timer: 2500,
            })
          );
      } else {
        Swal.fire({
          icon: "error",
          title: this.errorMessage,
          showConfirmButton: false,
          timer: 2500,
        });
      }
    },

    //  ABRE EL MODAL PARA MODIFICAR LA CONTRASEÑA
    openModal() {
      this.modal = true;
    },
    // CIERRA EL MODAL DESPUES DE MODIFICAR LA CONTRASEÑA
    closeModal() {
      this.modal = false;
    },

    // VACIA LOS CAMPOS DESPUES DE MODIFICAR LA CONTRASEÑA
    emptyFieldsPassword() {
      this.oldPassword = "";
      this.newPassword = "";
      this.newPasswordRepeat = "";
    },
  },
  computed: {
    birthdate_formated() {
      return dateFormat(this.dataUsers.birthdate, "mm/dd/yyyy");
    },
  },
  created() {
    this.getUser();
    this.loading = false;
  },
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
}
body main section#content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
body main section#content h2 {
  color: #333;
  font-weight: 800;
  font-size: 29px;
  align-self: flex-start;
  margin-left: 10px;
}
body main section#content h3 {
  color: #333;
  font-weight: 500;
  font-size: 16px;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}
body main section#content p.error {
  font-size: 14px;
  color: red;
  align-self: center;
  padding-top: 15px;
}
body main section#content p {
  font-size: 11px;
  display: block;
  align-self: flex-end;
  color: #8b8b8b;
  margin-right: 20px;
}

body main section form fieldset {
  border: none;
}
body main section form fieldset ul {
  list-style: none;
  text-align: start;
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
body main section form fieldset ul li {
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
body main section form fieldset ul li label {
  font-size: 14px;
  padding: 5px;
  font-weight: 700;
  color: #333;
}

body main section form fieldset ul li input {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #d4d4d4;
  color: #a7a7a7;
  font-size: 1rem;
  font-weight: 500px;
  padding: 5px 10px;
  transition: all 0.2s ease 0s;
  width: 300px;
  margin-left: 5px;
}

body main section form fieldset ul li.checkbox {
  margin-top: 15px;
  text-align: left;
  display: block;
  align-self: center;
}
body main section form fieldset ul li.checkbox input {
  width: 1rem;
  vertical-align: middle;
  margin: 0px 5px 0px 0px;
  color: #8b8b8b;
  border: 1px solid #4d4d4d;
  cursor: pointer;
}
body main section form fieldset ul li.checkbox label {
  font-size: 0.9rem;
  font-weight: 500;
}
body main section form fieldset ul li.checkbox a {
  color: #333;
  text-decoration: none;
  font-weight: 700;
}
body main section form fieldset ul li.button {
  padding-top: 20px;
  text-align: center;
  display: block;
}
body main section form fieldset ul li.button input {
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
}

body main section form fieldset ul li.button input[type="button"] {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}

body main section form fieldset ul li.button input[type="button"]:hover {
  background: #142850;
  color: #dae1e7;
}
body main section form fieldset ul li.button input[type="submit"]:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}
body main section form fieldset ul li.headquarter {
  display: flex;
  flex-direction: column;
}
</style>
