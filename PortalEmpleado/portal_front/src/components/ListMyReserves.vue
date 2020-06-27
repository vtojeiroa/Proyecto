<template>
  <div class="home">
    <div class="myreserves" v-show="seeReserves">
      <article class="myreserves">
        <div class="myreserve" v-for="(myreserve, index) in myreserves" :key="myreserve.id">
          <p>Id reserva: {{ myreserve.id }}</p>
          <p>Servicio: {{ myreserve.servicio }}</p>
          <p>Tipo: {{ myreserve.tipo }}</p>
          <p>usuario: {{ myreserve.usuarios_id }}</p>
          <p>
            Fecha inicio reserva:
            {{
            myreserve.fecha_hora_inicio_reserva | moment("DD-MM-YYYY HH:mm")
            }}
          </p>
          <p>
            Fecha fin reserva:
            {{ myreserve.fecha_hora_fin_reserva | moment("DD-MM-YYYY HH:mm") }}
          </p>
          <p>Motivo reserva: {{ myreserve.motivo_reserva }}</p>
          <p>Valoracíon: {{ myreserve.valoracion }}</p>
          <p>Comentario valoración: {{ myreserve.comentario_valoracion }}</p>
          <p>
            Fecha valoración:
            {{
            myreserve.fecha_registro_valoracion | moment("DD-MM-YYYY HH:mm")
            }}
          </p>
          <p>Código reserva: {{ myreserve.codigo_reserva }}</p>
          <p>
            Fecha de registro:
            {{ myreserve.fecha_registro | moment("DD-MM-YYYY HH:mm") }}
          </p>
          <div class="buttons">
            <button @click="deleteReserveEvent(index)">BORRAR</button>
            <button @click="editedEvent(index)">EDITAR</button>

            <button @click="seeVoteEvent(index);openModalVote()">REALIZAR VOTACIÓN</button>
          </div>
        </div>
      </article>
    </div>
    <div class="vote" v-show="seeVote">
      <div class="modal" style="overflow-y: scroll;" v-show="modalVote">
        <div class="modalBox">
          <article class="search-input">
            <h1>Valora esta reserva</h1>
            <div class="form">
              <fieldset>
                <form>
                  <ul>
                    <li>
                      <label for="vote">Valoración :</label>

                      <star-rating @rating-selected="rating = $event" :rating="rating"></star-rating>
                    </li>
                    <li>
                      <label for="description">Comentario:</label>
                      <textarea
                        type="text"
                        rows="5"
                        cols="40"
                        v-model="voteDescription"
                        placeholder="Introduce el comentario"
                      />
                      <br />
                      <br />

                      <button @click="voteReserveEvent(newReserve, voteDescription)">VOTAR</button>
                      <button @click="closeVoteEvent();closeModalVote()">CERRAR</button>
                    </li>
                  </ul>
                </form>
              </fieldset>
            </div>
          </article>
        </div>
      </div>
    </div>
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
    seeReserves: Boolean
  },
  methods: {
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UNA RESERVA
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
      this.modalVote = false;
    }
  }
};
</script>
<style scoped>
.home {
  display: flex;
  align-items: center;
}
.myreserves {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /*   background: whitesmoke; */
  color: red;
  width: 60%;
}

.myreserve {
  border: 1rem solid rgba(238, 13, 24, 0.808);
  border-radius: 50;
  margin: 2rem auto;
  padding: 1rem;
  width: 350px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 10%;
}

p {
  color: blue;
  font-weight: bolder;
  padding: 0.3rem;
}
button {
  padding: 0.3rem;
  width: 6rem;
  background: red;
  color: whitesmoke;
  border-radius: 10px;
  font-weight: bolder;
  margin: 1rem 1rem;
}
button:hover {
  background: whitesmoke;
  color: red;
  font-weight: bolder;
}
</style>