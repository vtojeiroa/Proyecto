<template>
  <div>
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Atención al usuario" description="Página de atención al usuario" />
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
                  <label class="email" for="email">Correo electrónico:</label>
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
                  <label class="email2" for="email2">Repetir correo electrónico:</label>
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
                  <label class="telephone" for="contact-telephone">Teléfono de contacto:</label>
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
                  <label class="query" for="field-query-type">Tipo de consulta:</label>
                </td>
                <td class="data">
                  <select id="query-type" name="queryType" class="query" v-model="typeConsult">
                    <option value>Seleccionar...</option>
                    <option value="Consulta sobre el servicio de Reservas">Reservas</option>
                    <option value="Consulta sobre el servicio de incidencias">Incidencias</option>
                    <option
                      value="Consulta sobre el Portal del Empleado"
                    >Consulta sobre el acceso/registro al portal</option>
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
                    rows="8"
                    cols="35"
                    v-model="message"
                  ></textarea>
                </td>
              </tr>

              <h4>
                Si lo crees necesario, puedes adjuntar un archivo que nos
                pueda ser útil de cara a resolver tu consulta. Las
                extensiones permitidas para el fichero son las siguientes:
                <strong>gif, png, jpg, jpeg, pdf, doc, docx, txt</strong>.
              </h4>

              <tr class="attachment-1">
                <td class="text">
                  <label class="attachment-1" for="attachment-1">Archivo adjunto:</label>/td>
                </td>
                <td class="data">
                  <input id="attachment-1" name="attachment-1" type="file" />
                </td>
              </tr>
            </fieldset>
          </form>
          <div class="button">
            <input type="button" class="button" value="Atrás" @click="$router.go(-1)" />
            <input type="submit" value="Enviar" class="button" @click="sendQuestion()" />
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
    footercustom
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
      correctData: false
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
            message: self.message
          })
          .then(function(response) {
            console.log(response);
            //Lanzar modal de confirmación
            Swal.fire({
              icon: "success",
              title:
                "Hemos enviado un mail con tú consulta. En breve recibiras nuestra ayuda",
              showConfirmButton: false,
              timer: 2500
            }),
              //Ir a la página de login
              self.$router.go(-1),
              self.emptyFields();
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
    },

    emptyFields() {
      this.name === "";
      this.email === "";
      this.repeatEmail === "";
      this.phone === "";
      this.typeConsult === "";
      this.message === "";
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
  padding-bottom: 81px;
}
body main section#content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
body main section#content article {
  display: flex;
  flex-direction: column;
  align-items: center;
}

body main section#content article h2 {
  color: #333;
  font-weight: 800;
  font-size: 29px;
  align-self: flex-start;
  margin-left: 10px;
}
body main section#content article h3 {
  color: #333;
  font-weight: 500;
  font-size: 16px;
  text-align: left;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}

body main section form fieldset {
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
}
/* body main section form fieldset ul {
  list-style: none;
  text-align: start;
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
}
body main section form fieldset ul li {
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 500px;
}
body main section form fieldset r li label {
  font-size: 14px;
  padding: 5px;
  font-weight: 700;
  color: #333;
}

body main section form fieldset tr td input {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #d4d4d4;
  color: #333;
  font-size: 14px;
  font-weight: 500px;
  padding: 5px 10px;
  transition: all 0.2s ease 0s;
  width: 300px;
  margin-left: 5px;
} */

body main section div.button {
  padding-top: 20px;
  text-align: center;
  display: block;
}
body main section div.button input {
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
  margin-right: 5px;
}

body main section div.button input[type="button"] {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}

body main section div.button input[type="button"]:hover {
  background: #142850;
  color: #dae1e7;
}
body main section div.button input[type="submit"]:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}
body main section form fieldset ul li.headquarter {
  display: flex;
  flex-direction: column;
}
</style>
