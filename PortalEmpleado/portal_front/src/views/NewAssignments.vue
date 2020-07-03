<template>
  <div>
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful
      title="Nueva Asignación"
      description="Página de registro de nuevas asignaciones de servicios a las sedes."
    />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <menulinksadmin></menulinksadmin>
    <main id="container">
      <section>
        <!-- MODAL PARA EDITAR EL USUARIO -->

        <article class="content">
          <h2>Registrar una nueva asignación de servicios</h2>

          <!-- PERFIL DEL USUARIO -->

          <h3>¡Debes cumplimentar todos los campos!</h3>
          <fieldset class="form">
            <form id="form">
              <table class="form-table">
                <tbody>
                  <tr>
                    <td class="text">
                      <label class="typeService" for="typeService"
                        >Indica el tipo de servicio :</label
                      >
                    </td>
                    <td>
                      <select
                        class="data"
                        name="newType"
                        id="newType"
                        v-model="newType"
                      >
                        <option value>Selecciona...</option>
                        <option value="vehiculo">Vehículo</option>
                        <option value="sala de reunion"
                          >Sala de reuniones</option
                        >
                        <option value="plaza en el comedor"
                          >Plaza en el comedor</option
                        >
                        <option value="bicicletas electricas"
                          >Bicicletas</option
                        >
                        <option value="informatica">Informática</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="seguridad">Seguridad</option>
                        <option value="limpieza">Limpieza</option>
                        <option value="otras">Otras</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td class="text">
                      <label class="headquarter" for="headquarter"
                        >Indica la sede de trabajo :</label
                      >
                    </td>
                    <td class="data">
                      <input
                        class="data"
                        id="newHeadquarter"
                        name="newHeadquarter"
                        type="text"
                        maxlength="255"
                        autocomplete="off"
                        placeholder="Introduce el nombre de la sede"
                        v-model="newHeadquarter"
                      />
                    </td>

                    <!-- <td>
                    <select name="newHeadquarter" id="newHeadquarter" v-model="newHeadquarter">
                      <option value>Selecciona...</option>
                      <option value="coruña">Coruña</option>
                      <option value="santiago">Santiago</option>
                      <option value="malaga">Málaga</option>
                      <option value="vigo">Vigo</option>
                    </select>
                    </td>-->
                  </tr>
                  <tr>
                    <td class="text">
                      <label for="disponibility">Disponibilidad :</label>
                    </td>
                    <td class="data">
                      <input
                        class="data"
                        id="newDisponibility"
                        name="newDisponibility"
                        type="text"
                        maxlength="255"
                        autocomplete="off"
                        placeholder="Indica la disponibilidad"
                        v-model="newDisponibility"
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
                @click="registerAssignment()"
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
  setName,
} from "../api/utils";

export default {
  name: "NewAssignments",
  components: {
    menucustom,
    menulinksadmin,
    footercustom,
  },
  data() {
    return {
      errorMessage: "",
      correctData: false,
      newHeadquarter: "",
      newType: "",
      newDisponibility: "",
    };
  },
  methods: {
    validatingData() {
      if (!this.newHeadquarter || !this.newType || !this.newDisponibility) {
        this.errorMessage = "No has rellenado todos los datos."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else {
        this.correctData = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    registerAssignment() {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        const token = getAuthToken();

        let self = this;
        axios.defaults.headers.common["authorization"] = `Bearer ${token}`;

        axios
          .post("http://localhost:3000/assignment", {
            headquarter: self.newHeadquarter,
            service_type: self.newType,
            disponibility: self.newDisponibility,
          })

          .then(function(response) {
            self.$router.go(-1);

            //MOSTRAR UN MENSAJE CON EL RESULTADOS.
            Swal.fire({
              icon: "success",
              title: "Asignación de servicios registrada correctamente.",
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
  /*   max-width: 500px; */
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
input.data {
  padding: 5px;
  font-size: 15px;
  min-width: 225px;
}

select,
textarea {
  padding: 5px;
  font-size: 15px;
}

select {
  min-width: 225px;
}
div.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
