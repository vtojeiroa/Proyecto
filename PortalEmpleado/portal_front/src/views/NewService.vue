<template>
  <div>
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful
      title="Nuevo Servicio"
      description="Página de registro de un nuevo servicio"
    />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <menulinksadmin></menulinksadmin>
    <main id="container">
      <section>
        <!-- MODAL PARA EDITAR EL USUARIO -->

        <article class="content">
          <h1>Registrar un nuevo servicio</h1>

          <!-- PERFIL DEL USUARIO -->

          <h3>¡Debes cumplimentar todos los campos!</h3>
          <form id="form">
            <table class="form-table">
              <tbody>
                <tr>
                  <td class="text">
                    <label for="newSection">Tipo de servicio:</label>
                  </td>
                  <td class="data">
                    <select
                      name="newSection"
                      id="newSection"
                      v-model="newSection"
                    >
                      <option value>Selecciona...</option>
                      <option value="Reserva">Reserva</option>
                      <option value="Incidencia">Incidencia</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td class="text">
                    <label for="newType">Nombre del servicio:</label>
                  </td>
                  <td class="data">
                    <input
                      id="newType"
                      name="newType"
                      type="text"
                      placeholder="Nombre del servicio"
                      v-model="newType"
                    />
                  </td>
                </tr>

                <tr>
                  <td class="text">
                    <label for="newDescription"
                      >Descripción del servicio:</label
                    >
                  </td>
                  <td class="data">
                    <textarea
                      id="description"
                      name="description"
                      type="text"
                      maxlength="500"
                      rows="5"
                      cols="30"
                      v-model="newDescription"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </form>

          <div class="buttons">
            <input
              type="button"
              class="button-back"
              value="Cancelar"
              @click="$router.go(-1)"
            />

            <input
              id="button"
              type="submit"
              class="button-go"
              value="Registrar"
              @click="registerService()"
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
  setName,
} from "../api/utils";

export default {
  name: "NewService",
  components: {
    menucustom,
    menulinksadmin,
    footercustom,
  },
  data() {
    return {
      errorMessage: "",
      correctData: false,
      newType: "",
      newSection: "",
      newDescription: "",
    };
  },
  methods: {
    validatingData() {
      if (!this.newType || !this.newSection || !this.newDescription) {
        this.errorMessage = "No has rellenado todos los datos."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else {
        this.correctData = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    registerService() {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        const token = getAuthToken();
        let data = localStorage.getItem("id");
        let self = this;
        axios.defaults.headers.common["authorization"] = `Bearer ${token}`;

        axios
          .post("http://localhost:3000/services", {
            section: self.newSection,
            type: self.newType,
            description: self.newDescription,
          })
          .then(function(response) {
            self.$router.go(-1);

            //MOSTRAR UN MENSAJE CON EL RESULTADOS.
            Swal.fire({
              icon: "success",
              title: "Servicio registrado correctamente.",
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
  },
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

fieldset.form {
  border: none;
  padding: 1rem;
  border-radius: 10px;

  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
}

h2 {
  padding: 1rem 0;
  margin-left: 20px;
}
h3 {
  padding: 1rem 0;
  text-align: center;
}

h1 {
  text-align: center;
  font-size: 2rem;
  padding: 0.5rem 0;
}
table {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
}

tbody {
  margin: 5px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
tr {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
td {
  padding: 0.5rem 0.2rem;
}
td.text {
  text-transform: uppercase;
  font-size: 14px;
}
td.data {
  font-weight: bold;
  text-align: end;
  align-self: flex-end;
}

label {
  font-size: 15px;
}
input#newType {
  padding: 5px;
  font-size: 15px;
  width: 235px;
}

select,
textarea {
  padding: 5px;
  font-size: 15px;
}

select {
  min-width: 235px;
}
div.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
