<template>
  <div>
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Nueva Sede" description="Página de registro de una nueva sede" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <menulinksadmin></menulinksadmin>
    <main id="container">
      <section>
        <!-- MODAL PARA EDITAR EL USUARIO -->

        <article class="content">
          <h1>Registrar una nueva sede</h1>

          <!-- PERFIL DEL USUARIO -->

          <h3>¡Debes cumplimentar todos los campos!</h3>
          <form id="form">
            <table class="form-table">
              <tbody>
                <tr>
                  <td class="name">
                    <label for="newName">Nombre :</label>
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
                    <label for="newPostalCode">Código postal :</label>
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
                  <td class="country">
                    <label for="newCountry">Pais:</label>
                  </td>
                  <td class="newCountry">
                    <input
                      id=" country"
                      name=" country"
                      type="text"
                      maxlength="50"
                      autocomplete="off"
                      v-model="newCountry"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>

          <div class="button-data">
            <input type="button" class="button" value="Cancelar" @click="$router.go(-1)" />

            <input
              id="button"
              type="submit"
              class="button"
              value="Registrar"
              @click="registerHeadquarter()"
            />
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

//IMPORTO LOS COMPONENTES

import menucustom from "@/components/MenuCustom.vue";
import menulinksadmin from "@/components/MenuLinksAdmin.vue";
import footercustom from "@/components/FooterCustom.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA  VARIAS FUNCION DE UTILS

import {
  getAuthToken,
  logOut,
  clearLogin,
  getUserName,
  isLoggedIn,
  checkAdmin,
  setName
} from "../api/utils";

export default {
  name: "NewHeadquarters",
  components: {
    menucustom,
    menulinksadmin,
    footercustom
  },
  data() {
    return {
      errorMessage: "",
      correctData: false,
      newName: "",
      newAddress: "",
      newPostalCode: "",
      newLocation: "",
      newProvince: "",
      newCountry: ""
    };
  },
  methods: {
    validatingData() {
      if (
        !this.newName ||
        !this.newAddress ||
        !this.newPostalCode ||
        !this.newLocation ||
        !this.newProvince ||
        !this.newCountry
      ) {
        this.errorMessage = "No has rellenado todos los datos."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else {
        this.correctData = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    registerHeadquarter() {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        const token = getAuthToken();
        let data = localStorage.getItem("id");
        let self = this;
        axios.defaults.headers.common["authorization"] = `Bearer ${token}`;

        axios
          .post("http://localhost:3000/headquarters", {
            name: self.newName,
            address: self.newAddress,
            postal_code: self.newPostalCode,
            location: self.newLocation,
            province: self.newProvince,
            country: self.newCountry
          })

          .then(function(response) {
            self.$router.go(-1);

            console.log(response);
            //MOSTRAR UN MENSAJE CON EL RESULTADOS.
            Swal.fire({
              icon: "success",
              title: "Sede registrada correctamente.",
              showConfirmButton: false,
              timer: 2500
            });
          })
          .catch(error =>
            Swal.fire({
              icon: "error",
              title: error.response.data.message,
              showConfirmButton: false,
              timer: 2500
            })
          );
      } else {
        Swal.fire({
          icon: "error",
          title: this.errorMessage,
          showConfirmButton: false,
          timer: 2500
        });
      }
    }
  }
};
</script>

<style scoped>
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
