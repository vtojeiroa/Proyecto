<template>
  <div class="myIncidences">
    <div class="myincidences" v-show="seeIncidences">
      <article class="myincidences">
        <div
          class="myincidence"
          v-for="(myincidence, index) in myincidences"
          :key="myincidence.id"
        >
          <p>Id incidencia: {{ myincidence.id }}</p>
          <p>Servicio: {{ myincidence.servicio }}</p>
          <p>Tipo: {{ myincidence.tipo }}</p>
          <p>Servicio: {{ myincidence.servicios_id }}</p>
          <p>usuario: {{ myincidence.usuarios_id }}</p>
          <p>Descripción: {{ myincidence.descripcion }}</p>
          <p>Activo: {{ myincidence.activo }}</p>
          <p>
            Fecha de resolución:
            {{ myincidence.fecha_resolucion | moment("DD-MM-YYYY HH:MM") }}
          </p>
          <p>Comentario {{ myincidence.comentario_resolucion }}</p>
          <p>Valoracíon: {{ myincidence.valoracion }}</p>
          <p>Comentario valoración: {{ myincidence.comentario_valoracion }}</p>
          <p>
            Fecha valoración:
            {{
              myincidence.fecha_registro_valoracion | moment("DD-MM-YYYY hh:mm")
            }}
          </p>
          <p>Código incidencia: {{ myincidence.codigo_incidencia }}</p>
          <p>
            Fecha de registro:
            {{ myincidence.fecha_registro | moment("DD-MM-YYYY HH:MM") }}
          </p>
          <div class="buttons">
            <button @click="deleteIncidenceEvent(index)">BORRAR</button>
            <button @click="editIncidenceEvent(index)">EDITAR</button>
            <button @click="seeVoteEvent(index)">
              REALIZAR VOTACIÓN
            </button>
          </div>
        </div>
      </article>
    </div>
    <div class="vote" v-show="seeVote">
      <article class="search-input">
        <h1>Valora esta reserva</h1>
        <div class="form">
          <fieldset>
            <form>
              <ul>
                <li>
                  <label for="vote">Valoración :</label>

                  <star-rating
                    @rating-selected="rating = $event"
                    :rating="rating"
                  ></star-rating>
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

                  <button
                    @click="voteIncidenceEvent(newIncidence, voteDescription)"
                  >
                    VOTAR
                  </button>
                  <button @click="closeVoteEvent()">
                    CERRAR
                  </button>
                </li>
              </ul>
            </form>
          </fieldset>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ListMyIncidences",
  data() {
    return {
      rating: 0,
      voteDescription: "",
      newIncidence: {},
    };
  },
  props: { myincidences: Array, seeVote: Boolean, seeIncidences: Boolean },
  methods: {
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UN CLIENTE
    editIncidenceEvent(index) {
      //GUARDANDO LA INFORMACIÓN DEL CLIENTE SELECCIONADO
      let data = this.myincidences[index];
      //ENVIANDO LA INFORMACIÓN DEL CLIENTE A LA VISTA
      this.$emit("edit", data);
    },

    //FUNCION QUE EMITE UN EVENTO PARA BORRAR UN CLIENTE
    deleteIncidenceEvent(index) {
      let data = this.myincidences[index].id;
      this.$emit("delete", data);
    },
    //FUNCION QUE EMITE UN EVENTO PARA VOTAR UNA RESERVA
    seeVoteEvent(index) {
      this.newIncidence = this.myincidences[index];
      this.$emit("showvote");
    },

    voteIncidenceEvent(newIncidence, voteDescription, rating) {
      this.$emit("vote", newIncidence, voteDescription, this.rating);
    },
    //FUNCION QUE EMITE UN EVENTO PARA VOTAR UNA RESERVA
    closeVoteEvent() {
      this.$emit("closevote");
    },
  },
};
</script>
<style scoped>
.home {
  display: flex;
  align-items: center;
}
.users {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /*   background: whitesmoke; */
  color: red;
  width: 60%;
}

.user {
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
