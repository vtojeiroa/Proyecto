<template>
  <div class="home">
    <main>
      <section>
        <div class="myreserves" v-show="seeReserves">
          <article class="myreserves">
            <div
              class="myreserve"
              v-for="(myreserve, index) in myreserves"
              :key="myreserve.id"
            >
              <table>
                <tbody>
                  <tr>
                    <td class="text">Id reserva:</td>
                    <td class="data">{{ myreserve.id }}</td>
                  </tr>
                  <tr>
                    <td class="text">Servicio:</td>
                    <td class="data">{{ myreserve.servicio }}</td>
                  </tr>
                  <tr>
                    <td class="text">Fecha de registro:</td>

                    <td class="data">
                      {{
                        myreserve.fecha_registro | moment("DD/MM/YYYY HH:mm")
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text">Tipo:</td>
                    <td class="data">{{ myreserve.tipo }}</td>
                  </tr>
                  <!--  <tr>
                    <td class="text">usuario:</td>
                    <td class="data">{{ myreserve.usuarios_id}}</td>
                  </tr>-->
                  <tr>
                    <td class="text">Fecha inicio reserva:</td>
                    <td class="data">
                      {{
                        myreserve.fecha_hora_inicio_reserva
                          | moment("DD-MM-YYYY HH:mm")
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text">Fecha fin reserva:</td>
                    <td class="data">
                      {{
                        myreserve.fecha_hora_fin_reserva
                          | moment("DD-MM-YYYY HH:mm")
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text">Motivo reserva:</td>
                    <td class="data">{{ myreserve.motivo_reserva }}</td>
                  </tr>
                  <tr v-show="myreserve.valoracion">
                    <td class="text">Valoracíon:</td>
                    <td class="data">{{ myreserve.valoracion }}</td>
                  </tr>
                  <tr v-show="myreserve.comentario_valoracion">
                    <td class="text">Comentario valoración:</td>
                    <td class="data">{{ myreserve.comentario_valoracion }}</td>
                  </tr>
                  <tr v-show="myreserve.fecha_registro_valoracion">
                    <td class="text">Fecha valoración:</td>
                    <td class="data">
                      {{
                        myreserve.fecha_registro_valoracion
                          | moment("DD-MM-YYYY HH:mm")
                      }}
                    </td>
                  </tr>
                  <tr v-show="myreserve.codigo_reserva">
                    <td class="text">Código reserva:</td>
                    <td class="data">{{ myreserve.codigo_reserva }}</td>
                  </tr>
                  <div class="buttons">
                    <input
                      v-show="myreserve.fecha_hora_fin_reserva > date"
                      class="button-back"
                      @click="deleteReserveEvent(index)"
                      value="BORRAR"
                    />
                    <input
                      v-show="myreserve.fecha_hora_fin_reserva > date"
                      class="button-go"
                      @click="editedEvent(index)"
                      value="EDITAR"
                    />

                    <input
                      class="button-go"
                      @click="
                        seeVoteEvent(index);
                        openModalVote();
                      "
                      v-show="
                        myreserve.fecha_hora_fin_reserva < date &&
                          !myreserve.valoracion
                      "
                      value="Valorar"
                    />
                  </div>
                </tbody>
                <p v-show="myreserve.fecha_hora_fin_reserva > date">
                  La reserva está activa, puedes modificarla o borrarla.
                </p>
                <p
                  v-show="
                    myreserve.fecha_hora_fin_reserva < date &&
                      !myreserve.valoracion
                  "
                >
                  La reserva ha finalizado, puedes valorarla.
                </p>
                <p v-show="myreserve.valoracion">
                  Reserva cerrada, ya has valorado esta reserva.
                </p>
              </table>
            </div>
          </article>
        </div>
      </section>

      <section>
        <div class="vote" v-show="seeVote">
          <div class="modal" style="overflow-y: scroll;" v-show="modalVote">
            <div class="modalBox">
              <article class="search-input">
                <h2>Valora esta reserva</h2>
                <div class="form">
                  <fieldset class="valoration">
                    <form>
                      <ul>
                        <li class="star">
                          <!-- <label for="vote">Valoración :</label> -->

                          <star-rating
                            inactive-color="#142850"
                            @rating-selected="rating = $event"
                            :rating="rating"
                          ></star-rating>
                        </li>
                        <li class>
                          <!--  <label for="description">Comentario:</label> -->
                          <textarea
                            type="text"
                            rows="10"
                            cols="40"
                            v-model="voteDescription"
                            placeholder="Introduce el comentario"
                          />
                        </li>
                      </ul>
                    </form>
                    <div class="buttons">
                      <input
                        class="button-back"
                        @click="
                          closeVoteEvent();
                          closeModalVote();
                        "
                        value="CERRAR"
                      />
                      <input
                        class="button-go"
                        @click="voteReserveEvent(newReserve, voteDescription)"
                        value="VOTAR"
                      />
                    </div>
                  </fieldset>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ListMyReserves",
  data() {
    return {
      rating: 0,
      voteDescription: "",
      newReserve: {},
      modalVote: false,
    };
  },

  props: {
    myreserves: Array,
    seeVote: Boolean,
    seeReserves: Boolean,
    date: String,
  },
  methods: {
    editedEvent(index) {
      this.$emit("edited", index);
    },

    //FUNCION QUE EMITE UN EVENTO PARA BORRAR UNA RESERVA
    deleteReserveEvent(index) {
      let data = this.myreserves[index].id;
      //FUNCION QUE EMITE UN EVENTO PARA EDITAR UNA RESERVA
      this.$emit("delete", data);
    },
    //FUNCION QUE EMITE UN EVENTO PARA VOTAR UNA RESERVA
    seeVoteEvent(index) {
      this.newReserve = this.myreserves[index];
      this.$emit("showvote");
    },

    voteReserveEvent(newReserve, voteDescription, rating) {
      this.$emit("vote", newReserve, voteDescription, this.rating);
    },
    //FUNCION QUE EMITE UN EVENTO PARA VOTAR UNA RESERVA
    closeVoteEvent() {
      this.$emit("closevote");
    },
    //  ABRE EL MODAL PARA VOTAR LA RESERVA
    openModalVote() {
      this.modalVote = true;
    },
    // CIERRA EL MODAL DESPUES DE VOTAR LA RESERVA
    closeModalVote() {
      this.modalVote = false;
    },
  },
};
</script>
<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
}

.myreserve {
  border: 4px solid #142850;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 2%;
  min-width: 300px;
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
  flex-wrap: wrap;
  justify-content: space-between;
}
td {
  padding: 0.2rem 0;
}
td.text {
  text-transform: uppercase;
  font-size: 14px;
  align-self: flex-start;
}
td.data {
  font-weight: bold;
  max-width: 200px;
}

input {
  text-align: center;
}

div.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
ul,
.modalBox ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
li {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}
.modalBox fieldset {
  /*  border: none; */
  padding: 2rem 2rem;
  background: #dae1e7;
}
.modalBox fieldset form ul li.star {
  padding-bottom: 1rem;
}
.modalBox fieldset form ul li textarea {
  font-size: 16px;
  padding: 10px;
}
p.code {
  text-align: center;
}
</style>
