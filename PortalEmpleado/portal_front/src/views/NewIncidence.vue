<template>
  <div>
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Nueva Incidencia" description="Página de registro de una nueva incidencia" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <menulinks></menulinks>
    <main id="container">
      <section>
        <!-- MODAL PARA EDITAR EL USUARIO -->

        <article class="content">
          <h2>Registrar una nueva incidencia</h2>

          <!-- CONTENIDO DE LA INCIDENCIA -->

          <h3>¡Debes cumplimentar todos los campos!</h3>
         
            <form class="form">
              <table class="form-table">
                <tbody>
                  <tr>
                    <td class="text">
                      <label
                        class="typeIncidence"
                        for="typeIncidence"
                      >Indica el tipo de incidencia *:</label>
                    </td>
                    <td class="data">
                      <select name="newType" id="NewType" v-model="newType">
                        <option value>Selecciona...</option>
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
                      <label for="newDescription">Descripcion de la incidencia:</label>
                    </td>
                    <td class="data">
                      <textarea
                        id="description"
                        name="description"
                        type="text"
                        maxlength="500"
                        rows="5"
                        cols="35"
                        v-model="newDescription"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>

            <div class="buttons">
              <input type="button" class="button" value="Cancelar" @click="$router.go(-1)" />

              <input
                id="button"
                type="submit"
                class="button-go"
                value="Registrar"
                @click="
                registerIncidence()"
              />
            </div> </fieldset>
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
import menulinks from "@/components/MenuLinks.vue";
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
  name: "NewIncidence",
  components: {
    menucustom,
    menulinks,
    footercustom
  },
  data() {
    return {
      errorMessage: "",
      correctData: false,
      /*  id: null, */
      newType: "",
      newDescription: ""
    };
  },
  methods: {
    validatingData() {
      if (!this.newType || !this.newDescription) {
        this.errorMessage = "No has rellenado todos los datos."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else {
        this.correctData = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    registerIncidence() {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        const token = getAuthToken();
        let data = localStorage.getItem("id");
        let self = this;
        axios.defaults.headers.common["authorization"] = `Bearer ${token}`;

        axios
          .post("http://localhost:3000/incidences", {
            incidenceType: self.newType,
            description: self.newDescription
          })
          .then(function(response) {
            self.$router.go(-1);

            //MOSTRAR UN MENSAJE CON EL RESULTADOS.
            Swal.fire({
              icon: "success",
              title:
                "Incidencia registrada correctamente. Trataremos de solucionarla lo antes posible",
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
  margin-bottom: 81px;
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
  justify-content: space-between;
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
  font-size: 15px;
  vertical-align: center;
}
input {
  padding: 5px;
  font-size: 15px;
}
select,
textarea {
  padding: 10px;
  font-size: 15px;
}
select {
  min-width: 235px;
}
</style>
