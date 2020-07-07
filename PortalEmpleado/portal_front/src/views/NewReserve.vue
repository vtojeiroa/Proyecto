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
        <!-- MODAL CON LOS TIPO DE RESERVAS-->

        <div class="modal" v-show="modalData">
          <div class="modalBox">
            <h3>Estos son los tipos de reservas que puedes registrar</h3>
            <ul v-for="typereserve in typereserves" :key="typereserve.id">
              <li>
                <p class="type">{{typereserve.tipo}}</p>
                <p>{{typereserve.descripcion}}</p>
              </li>
            </ul>

            <div class="buttons">
              <input class="button-back" value="Cerrar" @click="modalData=false" />
            </div>
          </div>
        </div>

        <article class="content">
          <h2>Registrar una nueva reserva</h2>

          <!-- CONTENIDO DE LA RESERVA -->

          <h3>¡Debes cumplimentar todos los campos!</h3>
          <form class="form">
            <table class="form-table">
              <tbody>
                <tr>
                  <td class="text">
                    <label class="typeReserve" for="typeReserve">Indica el tipo de reserva :</label>
                  </td>
                  <td class="data">
                    <select class="data" name="newType" id="newType" v-model="newType">
                      <option value>Selecciona...</option>
                      <option
                        placeholder="Nombre del servicio"
                        v-for="typereserve in typereserves"
                        :key="typereserve.id"
                        :value="typereserve.tipo"
                      >{{typereserve.tipo}}</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <td class="text">
                    <label for="newDateInit">Fecha y hora de inicio de la reserva:</label>
                  </td>
                  <td class="data">
                    <input
                      id="data"
                      name="dateinit"
                      type="datetime-local"
                      placeholder="YYYY-MM-DD HH:MM:SS"
                      v-model="newDateInit"
                    />
                  </td>
                </tr>
                <tr>
                  <td class="text">
                    <label for="newDateEnd">Fecha y hora de fin de la reserva:</label>
                  </td>
                  <td class="data">
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
                  <td class="text">
                    <label for="newDescription">Comentario de la reserva:</label>
                  </td>
                  <td class="data" id="datadescription">
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
            <input type="button" class="button-back" value="Cancelar" @click="$router.go(-1)" />

            <input
              id="button"
              type="submit"
              class="button-go"
              value="Registrar"
              @click="registerReserve()"
            />
          </div>
          <p></p>
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
      newType: "",
      newDateInit: "",
      newDateEnd: "",
      newDescription: "",
      typereserves: [],
      modalData: true
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LOS TIPOS DE RESERVAS
    getTypeReserves() {
      const token = getAuthToken();
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      let self = this;
      axios
        .get("http://localhost:3000/reserves/type")
        //SI SALE BIEN
        .then(function(response) {
          self.typereserves = response.data.data.data;
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
                "Reserva registrada correctamente. Acabamos de enviarte un correo con los datos de la misma",
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
  },
  created() {
    this.getTypeReserves();
  }
};
</script>

<style scoped>
body main#container {
  background: #fff;
  display: flex;
  justify-content: center;
  box-shadow: 0 0 4px 0 #d4d4d4;
  box-sizing: border-box;
  margin: 20px auto;
  padding: 15px 15px;
  width: 100%;
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
  align-self: center;
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
.modalBox {
  width: 50%;
}
.modalBox ul {
  list-style: none;
  display: flex;
  flex-direction: center;
  flex-wrap: wrap;
}
.modalBox li {
  max-width: 500px;
}

.modalBox h3 {
  text-transform: uppercase;
}
.modalBox p.type {
  text-transform: uppercase;
  font-weight: 900;
  text-decoration: underline;
  text-align: center;
}
.modalBox p {
  text-align: center;
}
.modalBox input.button-back {
  text-align: center;
}
</style>
