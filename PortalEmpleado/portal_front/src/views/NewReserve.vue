<template>
  <div>
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Nueva Reserva" description="Página de registro de una nueva reserva" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <menulinks></menulinks>
    <main id="container">
      <section>
        <!-- MODAL PARA EDITAR EL USUARIO -->

        <article class="content">
          <h2>Registrar una nueva reserva</h2>

          <!-- CONTENIDO DE LA RESERVA -->

          <h3>¡Debes cumplimentar todos los campos!</h3>
          <form class="form">
            <table class="form-table">
              <tbody>
                <tr>
                  <td class="type">
                    <label class="typeReserve" for="typeReserve">Indica el tipo de reserva *:</label>
                  </td>
                  <td>
                    <select name="newType" id="newType" v-model="newType">
                      <option value>Selecciona...</option>
                      <option value="vehiculo">Vehículo</option>
                      <option value="sala de reunion">Sala de reuniones</option>
                      <option value="plaza en el comedor">Plaza en el comedor</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td class="dateinit">
                    <label for="newDateInit">Fecha y hora de inicio de la reserva:</label>
                  </td>
                  <td class="dateinit">
                    <input
                      id="dateinit"
                      name="dateinit"
                      type="datetime-local"
                      placeholder="YYYY-MM-DD HH:MM:SS"
                      v-model="newDateInit"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="dateend">
                    <label for="newDateEnd">Fecha y hora de fin de la reserva:</label>
                  </td>
                  <td class="dateend">
                    <input
                      id="dateend"
                      name="dateend"
                      type="datetime-local"
                      placeholder="YYYY-MM-DD HH:MM:SS"
                      v-model="newDateEnd"
                    />
                  </td>
                </tr>

                <tr>
                  <td class="description">
                    <label for="newDescription">Comentario de la reserva:</label>
                  </td>
                  <td class="description">
                    <textarea
                      id="description"
                      name="description"
                      type="text"
                      maxlength="500"
                      rows="5"
                      cols="40"
                      v-model="newDescription"
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
              @click="registerReserve()"
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
  name: "NewReserve",
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
      newDateInit: "",
      newDateEnd: "",
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

    registerReserve() {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        const token = getAuthToken();
        let data = localStorage.getItem("id");
        let self = this;
        axios.defaults.headers.common["authorization"] = `Bearer ${token}`;

        axios
          .post("http://localhost:3000/reserves", {
            reserveType: self.newType,
            dateInit: self.newDateInit,
            dateEnd: self.newDateEnd,
            commentary: self.newDescription
          })
          .then(function(response) {
            self.$router.go(-1);

            //MOSTRAR UN MENSAJE CON EL RESULTADOS.
            Swal.fire({
              icon: "success",
              title:
                "Reserva registrada correctamente. Trataremos de solucionarla lo antes posible",
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
