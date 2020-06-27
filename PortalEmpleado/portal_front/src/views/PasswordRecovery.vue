<template>
  <div>
    <!-- CAMBIAR TITULO DE LA PAGINA -->
    <vue-headful title="Recuperar Contraseña" description="Página de inicio del Portal." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- MENU -->
    <menucustom></menucustom>

    <!-- /MENU -->

    <!-- CONTENIDO -->
    <main id="container">
      <section id="content">
        <h2>Recuperación de contraseña</h2>
        <h3>
          Introduce tu dirección de correo electrónico, el código postal y la
          fecha de nacimiento y en breve te enviaremos un correo con las
          instrucciones para cambiar tu contraseña.
        </h3>
        <p>Todos los campos marcados con * son obligatorios</p>

        <p class="error" v-show="errorMessage">¡¡{{ errorMessage }}!!</p>
        <form method="post" enctype="multipart/form-data" action="support-request.action">
          <fieldset class="form">
            <ul class="form">
              <li class="email">
                <label class="email" for="email">Correo electrónico *:</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  maxlength="255"
                  class="email"
                  autocomplete="off"
                  v-model="email"
                />
              </li>
              <li class="postalzip">
                <label class="postalzip" for="postalzip">Código postal *:</label>
                <input
                  id="postalzip"
                  name="postalzip"
                  type="text"
                  maxlength="10"
                  class="postalzip"
                  autocomplete="off"
                  v-model="postalZip"
                />
              </li>

              <li class="birthdate">
                <label class="birthdate" for="birthdate">Fecha de nacimiento *:</label>
                <input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  class="birthdate"
                  autocomplete="off"
                  v-model="birthdate"
                />
              </li>
            </ul>
          </fieldset>
        </form>

        <div class="button">
          <input type="button" class="button" value="Cancelar" onclick="location.href = '.';" />
          <input
            type="submit"
            value="Enviar"
            class="button"
            @click="recoveryPassword(email, postalZip, birthdate)"
          />
        </div>
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
  name: "PasswordRecovery",
  components: {
    menucustom,
    footercustom
  },
  data() {
    return {
      email: "",
      postalZip: "",
      birthdate: "",
      errorMessage: "",
      correctData: false
    };
  },
  methods: {
    validatingData() {
      if (!this.email || !this.postalZip || !this.birthdate) {
        this.errorMessage = "No has rellenado todos los campos."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else {
        this.correctData = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },
    recoveryPassword(email, postalZip, birthdate) {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        const token = getAuthToken();
        const data = localStorage.getItem("id");
        let self = this;
        axios
          .post("http://localhost:3000/users/password/recovery", {
            headers: {
              authorization: `Bearer ${token}`
            },
            email: self.email,
            postal_code: self.postalZip,
            birthdate: self.birthdate
          })
          .then(function(response) {
            self.emptyFields();
            console.log(response);
            //Lanzar modal de confirmación
            Swal.fire({
              icon: "success",
              title:
                "Hemos enviado un mail con las instrucciones para recuperar tu contraseña. ",
              showConfirmButton: false,
              timer: 3000
            }), //Ir a la página de login
              self.$router.push("/"),
              this.emptyFields();
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
      this.email = "";
      this.postalZip = "";
      this.birthdate = "";
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

body main section#content p {
  font-size: 11px;
  display: block;
  align-self: flex-end;
  color: #8b8b8b;
}
body main section#content p.error {
  color: red;
  align-self: center;
  padding-top: 15px;
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
  flex-direction: column;
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
  color: #555;
  font-size: 1rem;
  font-weight: 500px;
  padding: 5px 10px;
  transition: all 0.2s ease 0s;
  width: 300px;
  margin-left: 5px;
}

body main section div.button {
  padding-top: 20px;
  text-align: center;
  display: block;
}
body main section input.button {
  background: #142850;
  color: #dae1e7;
  border: 2px solid #142850;
  font-size: 1rem;
  font-weight: 900;
  padding: 1rem;
  line-height: 15px;
  border-radius: 50px;
  cursor: pointer;
  width: 100px;
  border: none;
}

body main section input.button[type="button"] {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
  margin-right: 5px;
}

body main section input.button[type="button"]:hover {
  background: #142850;
  color: #dae1e7;
}
body main section input.button[type="submit"]:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}
</style>
