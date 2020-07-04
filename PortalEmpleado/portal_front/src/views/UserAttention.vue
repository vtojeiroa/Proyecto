<template>
  <div>
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful
      title="Atención al usuario"
      description="Página de atención al usuario"
    />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!-- /MENU -->

    <!-- CONTENIDO -->
    <main id="container">
      <section id="content">
        <article id="content">
          <h2>Atención al usuario</h2>
          <h3>
            Déjanos un mensaje y nos pondremos en contacto contigo lo antes
            posible.
          </h3>
          <form method="post">
            <fieldset class="form">
              <table>
                <tbody>
                  <tr class="form">
                    <td class="text">
                      <label class="name" for="name">Nombre completo:</label>
                    </td>
                    <td class="data">
                      <input
                        id="contact-name"
                        name="contactName"
                        type="text"
                        maxlength="255"
                        class="name"
                        v-model="name"
                      />
                    </td>
                  </tr>
                  <tr class="email">
                    <td class="text">
                      <label class="email" for="email"
                        >Correo electrónico:</label
                      >
                    </td>
                    <td class="data">
                      <input
                        id="contact-email"
                        name="contactEmail"
                        type="email"
                        maxlength="255"
                        class="email"
                        v-model="email"
                      />
                    </td>
                  </tr>
                  <tr class="email2">
                    <td class="text">
                      <label class="email2" for="email2"
                        >Repetir correo electrónico:</label
                      >
                    </td>
                    <td class="data">
                      <input
                        id="contact-email2"
                        name="contactEmail2"
                        type="email"
                        maxlength="255"
                        class="email2"
                        v-model="repeatEmail"
                      />
                    </td>
                  </tr>
                  <tr class="telephone">
                    <td class="text">
                      <label class="telephone" for="contact-telephone"
                        >Teléfono de contacto:</label
                      >
                    </td>
                    <td class="data">
                      <input
                        id="telephone"
                        name="telephone"
                        type="text"
                        maxlength="255"
                        class="telephone"
                        v-model="phone"
                      />
                    </td>
                  </tr>
                  <tr class="query">
                    <td class="text">
                      <label class="query" for="field-query-type"
                        >Tipo de consulta:</label
                      >
                    </td>
                    <td class="data">
                      <select
                        id="query-type"
                        name="queryType"
                        class="query"
                        v-model="typeConsult"
                      >
                        <option value>Seleccionar...</option>
                        <option value="Consulta sobre el servicio de Reservas"
                          >Reservas</option
                        >
                        <option
                          value="Consulta sobre el servicio de incidencias"
                          >Incidencias</option
                        >
                        <option value="Consulta sobre el Portal del Empleado"
                          >Consulta sobre el acceso/registro al portal</option
                        >
                        <option value="Otras consultas">Otras consultas</option>
                      </select>
                    </td>
                  </tr>
                  <tr class="message">
                    <td class="text">
                      <label class="message" for="message">Tu mensaje:</label>
                    </td>
                    <td class="data">
                      <textarea
                        class="message"
                        id="field-message"
                        name="message"
                        rows="6"
                        cols="25"
                        v-model="message"
                      ></textarea>
                    </td>
                  </tr>
                </tbody>
              </table>
            </fieldset>
          </form>
          <div class="buttons">
            <input
              type="button"
              class="button-back"
              value="Atrás"
              @click="$router.go(-1)"
            />
            <input
              type="submit"
              value="Enviar"
              class="button-go"
              @click="sendQuestion()"
            />
          </div>
        </article>
      </section>
    </main>
    <!-- /CONTENIDO -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
// IMPORTO AXIOS
import axios from "axios";

import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";
//IMPORTO SWAL
import Swal from "sweetalert2";

import { getAuthToken } from "../api/utils";

export default {
  name: "UserAttention",
  components: {
    menucustom,
    footercustom,
  },
  data() {
    return {
      name: "",
      email: "",
      repeatEmail: "",
      phone: "",
      typeConsult: "",
      message: "",
      errorMessage: "",
      correctData: false,
    };
  },
  methods: {
    validatingData() {
      if (
        !this.name ||
        !this.email ||
        !this.repeatEmail ||
        !this.phone ||
        !this.typeConsult ||
        !this.message
      ) {
        this.errorMessage = "No has rellenado todos los datos."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else if (this.email !== this.repeatEmail) {
        this.errorMessage = "Los emails no coinciden."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else {
        this.correctData = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    sendQuestion(name, email, phone, typeConsult, message) {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        const token = getAuthToken();
        let self = this;
        axios
          .post("http://localhost:3000/attention", {
            email: self.email,
            name: self.name,
            phone: self.phone,
            service: self.typeConsult,
            message: self.message,
          })
          .then(function(response) {
            console.log(response);
            //Lanzar modal de confirmación
            Swal.fire({
              icon: "success",
              title:
                "Hemos enviado un mail con tú consulta. En breve recibiras nuestra ayuda",
              showConfirmButton: false,
              timer: 2500,
            }),
              //Ir a la página de login
              self.$router.go(-1),
              self.emptyFields();
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

    emptyFields() {
      this.name === "";
      this.email === "";
      this.repeatEmail === "";
      this.phone === "";
      this.typeConsult === "";
      this.message === "";
    },
  },
};
</script>

<style scoped>
body main {
  background: #fff;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  box-shadow: 0 0 4px 0 #d4d4d4;
  box-sizing: border-box;
  margin: 20px auto;
  padding: 15px 15px;
  width: 90%;
  max-width: 900px;
  border-radius: 10px;
  padding-bottom: 81px;
}
form {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
fieldset {
  border: none;
  padding: 1rem;
  border-radius: 10px;
  max-width: 700px;
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
}
tr {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 500px;
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
}

label {
  font-size: 15px;
}
input {
  padding: 5px;
  font-size: 15px;
}

select {
  padding: 5px;
  font-size: 15px;
  max-width: 215px;
}

textarea {
  padding: 10px;
  font-size: 15px;
}

div.buttons {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
