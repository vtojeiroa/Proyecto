<template>
  <div>
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Modificar email" description="Página modificar el email" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!-- ACTUALIZACIÓN  DEL EMAIL -->

    <h1>Cambio de correo electrónico</h1>
    <h3>Por favor, introduce la nueva dirección de correo electrónico con la que te gustaría acceder al Portal del Empleado a partir de ahora. Te enviaremos un correo electrónico de verificación a la nueva dirección para que la puedas cambiar.</h3>

    <form>
      <table>
        <tbody>
          <tr>
            <td>
              <label for="email">Correo electrónico actual* :</label>
            </td>
            <td>
              <input id="email" name="email" type="email" v-model="oldEmail" />
            </td>
          </tr>
          <tr>
            <td>
              <label for="newEmail">Correo electrónico nuevo* :</label>
            </td>
            <td>
              <input id="newEmail" name="newEmail" type="email" v-model="newEmail" />
            </td>
          </tr>
          <tr>
            <td>
              <label for="newEmail1">Repetir correo electrónico nuevo* :</label>
            </td>
            <td>
              <input id="newEmail1" name="newEmail1" type="email" v-model="newEmailRepeat" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>

    <div class="button-group">
      <input type="button" class="button" value="Cancelar" onclick="history.back(-1);" />
      <input
        type="submit"
        class="button"
        value="Enviar"
        @click="updateEmail(oldEmail,newEmail,newEmailRepeat)  "
      />
    </div>

    <footercustom></footercustom>
  </div>
</template>

<script>
// IMPORTO AXIOS
import axios from "axios";

import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";
//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA FUNCIÓN DE LOGOUT
import { getAuthToken, setEmail } from "../api/utils";

export default {
  name: "EditEmail",
  components: {
    menucustom,
    footercustom
  },
  data() {
    return {
      errorMessage: "",
      modalEmail: false,
      correctDataEmail: false,
      oldEmail: "",
      newEmail: "",
      newEmailRepeat: ""
    };
  },
  methods: {
    validatingDataEmail() {
      if (!this.oldEmail || !this.newEmail || !this.newEmailRepeat) {
        this.errorMessage = "No has rellenado todos los datos."; //Establecer mensaje de error
        this.correctDataEmail = false; //NO ENVIAR
      } else if (this.newEmail === this.oldEmail) {
        this.errorMessage =
          "El nuevo correo electrónico no puede ser igual al actual."; //Establecer mensaje de error
        this.correctDataEmail = false; //NO ENVIAR
      } else if (this.newEmail !== this.newEmailRepeat) {
        this.errorMessage = "Las contraseñas nuevas no coinciden."; //Establecer mensaje de error
        this.correctDataEmail = false; //NO ENVIAR
      } else {
        this.correctDataEmail = true; //ENVIAR
        this.errorMessage = ""; //NO SE MUESTRA EL MENSAJE
      }
    },

    //FUNCION PARA ACTUALIZAR EL EMAIL DEL USUARIO

    updateEmail(oldEmail, newEmail, newEmailRepeat) {
      this.validatingDataEmail();
      if (this.correctDataEmail) {
        const token = getAuthToken();
        const data = localStorage.getItem("id");
        let self = this;
        axios
          .post(`http://localhost:3000/users/${data}/email`, {
            headers: {
              authorization: `Bearer ${token}`
            },
            oldEmail: self.oldEmail,
            newEmail: self.newEmail,
            newEmailRepeat: self.newEmailRepeat
          })
          //SI SALE BIEN
          .then(function(response) {
            console.log(response);
            setEmail(newEmail);
            this.$router.push("/");
            //MOSTRAR UN MENSAJE CON EL RESULTADOS.

            Swal.fire({
              icon: "success",
              title: `Modificación del correo electrónico realizada correctamente. `,
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
.lds-ripple {
  display: inline-block;
  align-self: center;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}

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
  font-size: 14px;
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
  color: #a7a7a7;
  font-size: 1rem;
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
}
body main section form fieldset ul li.checkbox a {
  color: #333;
  text-decoration: none;
  font-weight: 700;
}
body main section form fieldset ul li.button {
  padding-top: 20px;
  text-align: center;
  display: block;
}
body main section form fieldset ul li.button input {
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
}

body main section form fieldset ul li.button input[type="button"] {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}

body main section form fieldset ul li.button input[type="button"]:hover {
  background: #142850;
  color: #dae1e7;
}
body main section form fieldset ul li.button input[type="submit"]:hover {
  background: #dae1e7;
  color: #142850;
  border: 2px solid #142850;
}
body main section form fieldset ul li.headquarter {
  display: flex;
  flex-direction: column;
}
</style>
