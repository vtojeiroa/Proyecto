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
          <h2>Registrar una nueva sede</h2>

          <!-- PERFIL DEL USUARIO -->

          <h3>¡Debes cumplimentar todos los campos!</h3>
          <fieldset class="form">
            <form class="form">
              <table class="form-table">
                <tbody>
                  <tr>
                    <td class="text">
                      <label for="newName">Nombre :</label>
                    </td>
                    <td class="data">
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
                    <td class="text">
                      <label for="newAddress">Dirección :</label>
                    </td>
                    <td class="data">
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
                    <td class="text">
                      <label for="newPostalCode">Código postal :</label>
                    </td>
                    <td class="data">
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
                    <td class="text">
                      <label for="newLocation">Localidad :</label>
                    </td>
                    <td class="data">
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
                    <td class="text">
                      <label for="newProvince">Provincia :</label>
                    </td>
                    <td class="data">
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
                    <td class="text">
                      <label for="newCountry">Pais:</label>
                    </td>
                    <td class="data">
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

            <div class="buttons">
              <input type="button" class="button-back" value="Cancelar" @click="$router.go(-1)" />

              <input
                id="button"
                type="submit"
                class="button-go"
                value="Registrar"
                @click="registerHeadquarter()"
              />
            </div>
          </fieldset>
        </article>
      </section>
    </main>
    <!-- VISTA DEL FOOTER -->
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
  border-radius: 10px;
  padding-bottom: 81px;
}

fieldset {
  border: none;
  padding: 1rem;
  border-radius: 10px;
}

h2 {
  padding: 1rem 0;
}
h3 {
  padding: 1rem 0;
  text-align: center;
}

ul li label,
ul li select {
  display: block;
  align-self: initial;
}
.modalBox fieldset input {
  width: 405px;
}
.modalBox article fieldset form ul li label {
  font-size: 18px;
  font-weight: 700;
  color: #555;
}
.modalBox article fieldset form ul li select,
.modalBox article fieldset form ul li input {
  background: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  font-weight: 500;
  border: 1px solid #d4d4d4;
  padding: 5px 10px;
  transition: all 0.2s ease 0s;
  width: 250px;
}
.modalBox input.button-go,
.modalBox input.button-back {
  min-width: 120px;
  text-align: center;
}

h1 {
  text-align: center;
  font-size: 2rem;
  padding: 0.5rem 0;
}
table {
  min-width: 300px;
}

tbody {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  margin: 5px;
}
tr {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  vertical-align: center;
}
td {
  padding: 1rem 0.2rem;
}
td.text {
  text-transform: uppercase;
  font-size: 14px;
  align-self: flex-start;
}
td.data {
  font-weight: bold;
}

label {
  font-size: 18px;
}
input,
select,
textarea {
  padding: 10px;
  font-size: 15px;
}
</style>
