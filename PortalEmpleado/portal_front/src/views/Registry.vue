<template>
  <div>
    <!-- CAMBIAR TITULO DE LA PAGINA -->
    <vue-headful title="Portal del Empleado" description="Página de inicio del Portal." />
    <!-- /CAMBIAR TITULO DE LA PAGINA -->

    <!-- MENU -->
    <menucustom></menucustom>

    <!-- /MENU -->

    <!-- CONTENIDO -->
    <main id="container">
      <section id="content">
        <h2>Registro</h2>
        <h3>
          Introduce los datos que te indicamos a continuación y en breve
          recibirás un correo para tu registro en el Portal del Empleado.
        </h3>
        <p>Todos los campos marcados con * son obligatorios</p>

        <p class="error" v-show="errorMessage">¡¡{{ errorMessage }}!!</p>
        <form>
          <fieldset class="form">
            <ul class="form">
              <li class="name">
                <!--  <label class="name" for="name">Nombre *:</label> -->
                <input
                  id="name"
                  name="name"
                  type="text"
                  maxlength="45"
                  class="name"
                  autocomplete="off"
                  placeholder="Indica tu nombre *:"
                  v-model="name"
                />

                <!-- <label class="surname" for="surname">Apellidos *:</label> -->
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  maxlength="255"
                  class="surname"
                  autocomplete="off"
                  placeholder="Indica tus apellidos *:"
                  v-model="surname"
                />
              </li>

              <li class="email">
                <!-- <label class="email" for="email">Correo electrónico *:</label> -->
                <input
                  id="field-contact-email"
                  name="contactEmail"
                  type="text"
                  maxlength="255"
                  class="email"
                  autocomplete="off"
                  placeholder="Indica tu correo electrónico *:"
                  v-model="email"
                />

                <!--  <label class="email2" for="email2"
                  >Repetir correo electrónico *:</label
                >-->
                <input
                  id="email2"
                  name="contactEmail2"
                  type="text"
                  maxlength="255"
                  class="email2"
                  autocomplete="off"
                  placeholder="Repite tu correo electrónico *:"
                  v-model="repeatEmail"
                />
              </li>
              <li class="password">
                <!--  <label class="password" for="password">contraseña *:</label> -->
                <input
                  id="password"
                  name="password"
                  type="password"
                  maxlength="255"
                  class="password"
                  autocomplete="off"
                  placeholder="Indica una contraseña *:"
                  v-model="password"
                />

                <!-- <label class="passwordRepeat" for="passwordRepeat"
                  >Repetir contraseña *:</label
                >-->
                <input
                  id="passwordRepeat"
                  name="passwordRepeat"
                  type="password"
                  maxlength="255"
                  class="passwordRepeat"
                  autocomplete="off"
                  placeholder="Repite la contraseña *:"
                  v-model="repeatPassword"
                />
              </li>
              <li class="headquarter">
                <label class="headquarter" for="headquarter">Indica tu sede de trabajo *:</label>
                <select name="headquarter" id="headquarter" v-model="headquarter">
                  <option value>Selecciona...</option>
                  <option value="coruña">Coruña</option>
                  <option value="santiago">Santiago</option>
                  <option value="malaga">Málaga</option>
                  <option value="vigo">Vigo</option>
                </select>
              </li>
              <li class="checkbox">
                <input
                  id="checkbox"
                  name="checkbox"
                  type="checkbox"
                  value="false"
                  v-model="acceptConditions"
                />
                <label id="checkbox" for="checkbox">
                  Al enviar mis datos acepto la
                  <a
                    class="checkbox"
                    href="/privacidad.html"
                    target="_blank"
                  >
                    <strong>política de privacidad</strong>
                  </a>
                  y las
                  <a href="/uso.html" target="_blank">
                    <strong>condiciones de uso</strong>
                  </a>.
                </label>
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
            @click="addClient(name, surname, email, password, headquarter)"
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
  name: "Registry",
  components: {
    menucustom,
    footercustom
  },
  data() {
    return {
      name: "",
      surname: "",
      email: "",
      repeatEmail: "",
      password: "",
      repeatPassword: "",
      headquarter: "",
      acceptConditions: false,
      errorMessage: "",
      correctData: false
    };
  },
  methods: {
    validatingData() {
      if (
        !this.name ||
        !this.surname ||
        !this.email ||
        !this.repeatEmail ||
        !this.password ||
        !this.repeatPassword ||
        !this.headquarter
      ) {
        this.errorMessage = "No has rellenado todos los datos."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else if (this.email !== this.repeatEmail) {
        this.errorMessage = "Los emails no coinciden."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else if (this.password !== this.repeatPassword) {
        this.errorMessage = "Las contraseñas no coinciden."; //Establecer mensaje de error
        this.correctData = false; //NO ENVIAR
      } else if (this.acceptConditions == false) {
        this.errorMessage = "No has aceptado las condiciones.";
        this.correctData = false; //NO ENVIAR
      } else {
        this.correctData = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    addClient(
      name,
      surname,
      email,
      repeatEmail,
      password,
      repeatPassword,
      headquarter,
      acceptConditions
    ) {
      this.validatingData(); //VALIDANDO DATOS DEL FORMULARIO
      if (this.correctData) {
        const token = getAuthToken();
        const data = localStorage.getItem("id");
        let self = this;
        axios
          .post("http://localhost:3000/users", {
            headers: {
              authorization: `Bearer ${token}`
            },
            name: self.name,
            surname: self.surname,
            email: self.email,
            password: self.password,
            headquarter: self.headquarter
          })
          .then(function(response) {
            console.log(response);
            //Lanzar modal de confirmación
            Swal.fire({
              icon: "success",
              title:
                "Hemos enviado un mail con un enlace para validar tu registro en el Portal",
              showConfirmButton: false,
              timer: 2500
            }),
              //Ir a la página de login
              self.$router.push("/"),
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
      this.surname === "";
      this.email === "";
      this.repeatEmail === "";
      this.password === "";
      this.repeatPassword === "";
      this.headquarter === "";
      this.acceptConditions === "";
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
  font-size: 1px;
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
  color: #333;
  font-size: 14px;
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
  vertical-align: middle;
}
body main section form fieldset ul li.checkbox a {
  color: #333;
  text-decoration: none;
  font-weight: 700;
}
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
