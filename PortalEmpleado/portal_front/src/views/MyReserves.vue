<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Mis Reservas" description="Página que lista mis reservas" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!-- VISTA DEL MENÚLINKS -->
    <section class="links">
      <article class="links">
        <menulinks></menulinks>
        <router-link :to="{ name: 'NewReserve' }">Nueva Reserva</router-link>
      </article>
    </section>
    <!--  ANIMACIÓN DE CSS CARGANDO -->

    <div v-show="loading" class="lds-ripple">
      <div></div>
      <div></div>
    </div>

    <!-- IMPLEMENTACIÓN DEL BUSCADOR -->
    <main id="container">
      <section id="content">
        <article class="search-input">
          <h2>Busqueda avanzada</h2>
          <fieldset class="form">
            <form class="form">
              <ul class="search">
                <li class="search">
                  <label for="type">Tipo de reserva:</label>
                  <select id="type" name="type" v-model="type">
                    <option value>Selecciona...</option>
                    <option value="vehiculo">Vehículo</option>
                    <option value="sala de reunion">Sala de Reunión</option>
                    <option value="Plaza en el comedor">Plaza en el comedor</option>
                  </select>
                </li>
                <li>
                  <label for="to">Fecha inicio de reserva &#62;&#61;:</label>
                  <input type="datetime-local" id="until" name="until" v-model="dateEndReserve" />
                </li>
                <h3>Intervalo de fechas de registro de la reserva</h3>
                <li>
                  <label for="from">Fecha inicial &#62;&#61;</label>
                  <input type="datetime-local" id="from" name="from" v-model="dateInit" />
                </li>
                <li>
                  <label for="to">Fecha final &#60;</label>
                  <input type="datetime-local" id="to" name="to" v-model="dateEnd" />
                </li>
              </ul>
            </form>
            <div class="buttons">
              <input type="submit" class="button-back" value="Limpiar" @click="emptyFields()" />
              <input
                type="submit"
                class="button-go"
                value="Consultar"
                @click="getReserves(type, dateEndReserve, dateInit, dateEnd)"
              />
            </div>
            <p>
              Si tienes el código de la reserva, pulsa
              <input
                type="submit"
                class="button-go"
                value="Aquí"
                @click="openModalSearch()"
              />
            </p>
          </fieldset>
        </article>
        <article class="search-data">
          <h1 class="title">Mis reservas</h1>

          <!-- VISTA DE LAS RESERVAS -->
          <listmyreserves
            :myreserves="filteredReserves"
            :myreserve="myreserve"
            :rating="rating"
            :seeReserves="seeReserves"
            :seeVote="seeVote"
            :voteDescription="voteDescription"
            v-on:edited="openModal"
            v-on:edit="updateReserve"
            v-on:delete="deleteReserves"
            v-on:showvote="showVoteView"
            v-on:closevote="closeVoteView"
            v-on:vote="voteReserve"
          ></listmyreserves>
        </article>
      </section>

      <!-- MODAL PARA EDITAR LA RESERVA -->
      <div class="modal" v-show="modal">
        <div class="modalBox">
          <h2>Actualiza los datos del motivo de la reserva</h2>
          <fieldset>
            <label for="newDescription">Comentario:</label>
            <input type="text" v-model="newDescription" placeholder="Introduce el nuevo comentario" />
          </fieldset>
          <div class="buttons">
            <input class="button-back" value="Cerrar" @click="closeModal()" />
            <input class="button-go" value="Actualizar" @click="updateReserve()" />
          </div>
        </div>
      </div>
      <!-- MODAL PARA BUSCAR UNA INCIDENCIA POR EL CÓDIGO -->
      <div class="modal" v-show="modalSearch">
        <div class="modalBox">
          <h2>Introduce el código que has recibido por correo eléctronico</h2>
          <fieldset>
            <label for="search">Código:</label>
            <input v-model="search" class="text" type="text" placeholder="Introduce el código" />
          </fieldset>
          <div class="buttons">
            <input class="button-back" value="Cerrar" @click="closeModalSearch()" />
            <input class="button-go" value="Limpiar" @click="search = ''" />
          </div>
        </div>
      </div>
    </main>
    <!-- VISTA DEL FOOTER -->
    <footercustom></footercustom>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

//IMPORTO EL MENU
import menucustom from "../components/MenuCustom.vue";
//IMPORTO EL MENULINKS
import menulinks from "../components/MenuLinks.vue";
//IMPORTO EL FOOTER
import footercustom from "../components/FooterCustom.vue";

//IMPORTO LA LISTA DE RESERVAS
import listmyreserves from "../components/ListMyReserves.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

import { getAuthToken } from "../api/utils";

export default {
  name: "MyReserves",
  components: { menucustom, menulinks, footercustom, listmyreserves },
  data() {
    return {
      //ARRAY DE LAS RESERVAS DE LA BBDD
      myreserves: [],
      modal: false,
      modalSearch: false,
      loading: true,
      seeVote: false,
      seeReserves: true,
      voteDescription: "",
      myreserve: {},
      indexReserve: {},
      rating: {},
      id: "",
      newDescription: "",
      type: "",
      dateEndReserve: "",
      dateInit: "",
      dateEnd: "",
      vote: "",
      search: ""
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LAS RESERVAS
    getReserves() {
      const token = getAuthToken();
      const data = localStorage.getItem("id");
      let self = this;
      axios
        .get("http://localhost:3000/reserves/list", {
          headers: {
            authorization: `Bearer ${token}`
          },
          params: {
            type: this.type,
            dateEndReserve: this.dateEndReserve,
            date_init: this.dateInit,
            date_end: this.dateEnd
          }
        })
        //SI SALE BIEN
        .then(function(response) {
          self.myreserves = response.data.data;
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

    showEditText(data) {
      this.id = data.id;
      this.newDescription = data.comentario_valoracion;
    },

    //FUNCION PARA ACTUALIZAR UNA RESERVA
    updateReserve() {
      const token = getAuthToken();
      const id = this.myreserve.id;
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      axios
        .put("http://localhost:3000/reserves/" + id, {
          description: self.newDescription
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de actualizar el comentario de la reserva `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //recarga la página
            result => {
              self.closeModal();
              self.getReserves();
            }
          );
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
    //  ABRE EL MODAL PARA EDITAR LOS DATOS DE LA RESERVA
    openModal(index) {
      this.myreserve = this.myreserves[index];
      this.modal = true;
    },
    // CIERRA EL MODAL DESPUES DE EDITAR LOS DATOS DE LA RESERVA
    closeModal() {
      this.modal = false;
    },

    //  ABRE EL MODAL PARA BUSCAR UNA RESERVA POR EL CÓDIGO
    openModalSearch() {
      this.modalSearch = true;
    },
    // CIERRA EL MODAL DESPUES DE BUSCAR LA RESERVA POR EL CÓDIGO
    closeModalSearch() {
      this.modalSearch = false;
    },
    //FUNCION PARA ELIMINAR UNA RESERVA DE LA BBDD
    deleteReserves(data) {
      const token = getAuthToken();
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás deshacerlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, bórralo!"
      }).then(result => {
        if (result.value) {
          axios
            .delete("http://localhost:3000/reserves/" + data)

            //  SI SALE BIEN
            .then(function(response) {
              //MOSTRAR UN MENSAJE CON EL RESULTADO
              Swal.fire({
                icon: "success",
                title: `Acabas de borrar la reserva `,
                showConfirmButton: false,
                timer: 2500
              }).then(result => {
                self.getReserves();
              });
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
        }
      });
    },

    //FUNCIÓN PARA VOTAR LAS RESERVAS
    voteReserve(myreserve, voteDescription, rating) {
      const token = getAuthToken();
      const userId = localStorage.getItem("id");
      const id = myreserve.id;
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      axios
        .post(`http://localhost:3000/reserves/${id}/vote`, {
          vote: rating,
          description: voteDescription
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de votar la reserva `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //recarga la página
            result => {
              this.closeVoteView();
              this.getReserves();
            }
          );
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

    emptyFields() {
      this.type = "";
      this.dateEndReserve = "";
      this.dateInit = "";
      this.dateEnd = "";
      this.getReserves();
    },
    showVoteView() {
      this.seeVote = true;
      this.seeReserves = false;
    },
    closeVoteView() {
      this.seeVote = false;
      this.seeReserves = true;
    }
  },
  created() {
    this.getReserves();
    this.loading = false;
  },
  computed: {
    filteredReserves() {
      let result = this.myreserves;

      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          myreserve =>
            myreserve.codigo_reserva === parseInt(this.search) ||
            myreserve.id === parseInt(this.search)
        );
        if (!result.length) {
          Swal.fire({
            title: "El código introducido no corresponde a ninguna reserva",
            text: "Vuelve a intentarlo",
            showConfirmButton: false,
            timer: 2500
          });
        }
        return result;
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

section article.links {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
section article.links a {
  background: #142850;
  color: #dae1e7;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.75rem;
  line-height: 15px;
  border-radius: 50px;
  cursor: pointer;
  width: 150px;
  border: none;
  border: 2px solid #142850;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
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
  border-radius: 10px;
  padding-bottom: 81px;
}
body main section#content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
body main section article ul.link {
  align-self: center;
  width: 100%;
}
body section article.links {
  display: flex;
  justify-content: center;
}

fieldset {
  border: none;
  padding: 1rem;
  border-radius: 10px;
}

ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

ul li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 0.2rem 0;
}

input.button-go {
  padding: 0.75px;
  vertical-align: middle;
}
h2 {
  padding: 1rem 0;
  text-align: center;
}
h3 {
  padding: 1rem 0;
  text-align: center;
}
fieldset.form {
  border-radius: 0;
  border: none;
  border-bottom: 3px solid #142850;
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
</style>
