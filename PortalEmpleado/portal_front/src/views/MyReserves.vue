<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful title="Mis Reservas" description="Página que lista mis reservas" />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  ANIMACIÓN DE CSS CARGANDO -->

    <div v-show="loading" class="lds-ripple">
      <div></div>
      <div></div>
    </div>

    <!-- VISTA DEL MENÚLINKS -->
    <section class="links">
      <article class="links">
        <menulinks></menulinks>
        <router-link :to="{ name: 'NewReserve' }">Nueva Reserva</router-link>
      </article>
    </section>
    <!-- IMPLEMENTACIÓN DEL BUSCADOR -->
    <section id="content">
      <article class="search-input">
        <h1>Busqueda avanzada</h1>
        <div class="form">
          <form>
            <ul>
              <li>
                <label for="type">Tipo de reserva:</label>
                <select id="type" name="type" v-model="type">
                  <option value>Selecciona...</option>
                  <option value="vehiculo">Vehículo</option>
                  <option value="sala de reunion">Sala de Reunión</option>
                  <option value="Plaza en el comedor">Plaza en el comedor</option>
                </select>
              </li>
              <li>
                <label for="to">Fecha de inicio de la reserva &#62;&#61;:</label>
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
            <input
              type="submit"
              class="button"
              value="Consultar"
              @click="getReserves(type, dateEndReserve, dateInit, dateEnd)"
            />
          </div>
          <input type="submit" class="button" value="Limpiar" @click="emptyFields()" />
        </div>
      </article>
      <article class="search-data">
        <h1 class="title">Mis reservas</h1>

        <!-- VISTA DE LAS RESERVAS -->
        <listmyreserves
          :myreserves="myreserves"
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
        <h2>Actualiza los datos</h2>

        <label for="newDescription">Comentario:</label>
        <input type="text" v-model="newDescription" placeholder="Introduce el comentario" />
        <br />
        <br />
        <button @click="updateReserve()">Actualizar</button>
        <button @click="closeModal()">Cerrar</button>
      </div>
    </div>

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
      vote: ""
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
          console.log(response);
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
              console.log(response);
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
    //FUNCION PARA ELIMINAR UNA RESERVA DE LA BBDD
    deleteReserves(data) {
      const token = getAuthToken();

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
              }).then(result => this.getReserves());
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

              console.log(response);
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
  }
};
</script>
<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
}

.modalBox {
  background: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  display: flex;
  flex-wrap: wrap;
}
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

.home {
  display: flex;
  flex-direction: column;
}

article {
  display: flex;
  flex-direction: column;
  align-self: center;
  border: 2px solid red;
  color: blue;
  /*   width: 300px; */
  align-items: center;
  padding: 0.5rem;
  margin: 1rem;
}
label {
  padding: 1rem;
  font-size: 1.25rem;
}
input {
  padding: 0.5rem;
  width: 17rem;
  height: 1.75rem;
  margin: 0.5rem 0;
  border-radius: 5px;
  font-size: 1rem;
}
button {
  padding: 0.2rem;
  width: 8rem;
  background: red;
  color: whitesmoke;
  border-radius: 10px;
  font-weight: bolder;
}
button:hover {
  background: whitesmoke;
  color: red;
  font-weight: bolder;
}
button.search {
  text-align: center;
}
</style>
