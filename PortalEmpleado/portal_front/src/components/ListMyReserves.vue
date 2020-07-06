<template>
  <div class="home">
    <main>
      <section>
        <div class="myreserves" v-show="seeReserves">
          <article class="myreserves">
            <div class="myreserve" v-for="(myreserve, index) in myreserves" :key="myreserve.id">
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
                      new Date(myreserve.fecha_registro).toLocaleString('es-ES',{timeZone:'UTC'})
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
                      new Date(myreserve.fecha_hora_inicio_reserva).toLocaleString('es-ES',{timeZone:'UTC'})
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text">Fecha fin reserva:</td>
                    <td class="data">
                      {{
                      new Date(myreserve.fecha_hora_fin_reserva).toLocaleString('es-ES',{timeZone:'UTC'})
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td class="text">Motivo reserva:</td>
                    <td class="data">{{ myreserve.motivo_reserva }}</td>
                  </tr>
                  <tr v-show="myreserve.valoracion">
                    <td class="text">Valoracíon:</td>

                    <td class="data">
                      <star-rating
                        class="starsValoration"
                        :inline="true"
                        :star-size="20"
                        :read-only="true"
                        :rating="Number(myreserve.valoracion)"
                        :increment="0.01"
                        :show-rating="false"
                      ></star-rating>
                    </td>
                  </tr>
                  <tr v-show="myreserve.comentario_valoracion">
                    <td class="text">Comentario valoración:</td>
                    <td class="data">{{ myreserve.comentario_valoracion }}</td>
                  </tr>
                  <tr v-show="myreserve.fecha_registro_valoracion">
                    <td class="text">Fecha valoración:</td>
                    <td class="data">
                      {{
                      new Date(myreserve.fecha_registro_valoracion).toLocaleString('es-ES',{timeZone:'UTC'})
                      }}
                    </td>
                  </tr>
                  <tr
                    v-show="
                      myreserve.codigo_reserva &&
                        myreserve.codigo_reserva !== 'close' &&
                        !myreserve.valoracion
                    "
                  >
                    <td class="text">Código reserva:</td>
                    <td class="data">{{ myreserve.codigo_reserva }}</td>
                  </tr>
                  <div class="buttons">
                    <input
                      v-show=" new Date(myreserve.fecha_hora_inicio_reserva).toLocaleString('es-ES',{timeZone:'UTC'}) > date"
                      class="button-back"
                      @click="deleteReserveEvent(index)"
                      value="BORRAR"
                    />
                    <input
                      v-show=" new Date(myreserve.fecha_hora_inicio_reserva).toLocaleString('es-ES',{timeZone:'UTC'}) > date"
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
                        new Date(myreserve.fecha_hora_fin_reserva).toLocaleString('es-ES',{timeZone:'UTC'}) < date &&
                          !myreserve.valoracion
                      "
                      value="Valorar"
                    />
                  </div>
                </tbody>
                <p
                  class="code"
                  v-show="new Date(myreserve.fecha_hora_inicio_reserva).toLocaleString('es-ES',{timeZone:'UTC'}) > date"
                >La reserva está activa, puedes modificarla o borrarla.</p>
                <p
                  class="code"
                  v-show="new Date(myreserve.fecha_hora_inicio_reserva).toLocaleString('es-ES',{timeZone:'UTC'}) < date && new Date(myreserve.fecha_hora_fin_reserva).toLocaleString('es-ES',{timeZone:'UTC'}) > date"
                >Estás disfrutando la reserva. Recuerda valorarla al finalizar.</p>
                <p
                  class="code"
                  v-show="
                    new Date(myreserve.fecha_hora_fin_reserva).toLocaleString('es-ES',{timeZone:'UTC'}) < date &&
                      !myreserve.fecha_registro_valoracion
                  "
                >La reserva ha finalizado, puedes valorarla.</p>
                <p
                  class="code"
                  v-show="myreserve.valoracion"
                >Reserva cerrada, ya has valorado esta reserva.</p>
              </table>
            </div>
          </article>
        </div>
      </section>

      <section>
        <div class="vote" v-show="seeVote">
          <div class="modal" style="overflow-y: scroll;" v-show="modalVote">
            <div class="modalBox">
              <article class="vote">
                <h2>Valora esta reserva</h2>
                <h3>Selecciona la valoración y escribe un comentario</h3>
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
                        value="Cerrar"
                      />
                      <input
                        class="button-go"
                        @click="voteReserveEvent(newReserve, voteDescription) ;
                          closeModalVote()"
                        value="Valorar"
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
      modalVote: false
    };
  },

  props: {
    myreserves: Array,
    seeVote: Boolean,
    seeReserves: Boolean,
    date: String
  },
  methods: {
    editedEvent(index) {
      this.$emit("edited", index);
    },

    //FUNCION QUE EMITE UN EVENTO PARA BORRAR UNA RESERVA
    deleteReserveEvent(index) {
      let data = this.myreserves[index].id;
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
      this.voteDescription = "";
      this.rating = 0;
      this.modalVote = false;
    }
  }
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
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  border-radius: 2%;
  min-width: 200px;
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
  text-align: end;
}

input {
  text-align: center;
}

div.buttons {
  display: flex;
  flex-wrap: wrap;
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
  padding: 2rem 2rem;
  background: #dae1e7;
}
.modalBox fieldset form ul li.star {
  padding-bottom: 1rem;
}
.modalBox fieldset form ul li textarea {
  font-size: 16px;
  padding: 10px;
  max-height: 200px;
  max-width: 300px;
}
p {
  text-align: center;
}
</style>
