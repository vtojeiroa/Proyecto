<template>
  <div class="home">
    <main>
      <section>
        <div class="incidencesbycode" v-show="seeIncidencesbycode">
          <article class="incidencesbycode">
            <div>
              <table>
                <tbody>
                  <tr>
                    <td class="text">Id incidencia:</td>
                    <td class="data">{{incidencebycode.id }}</td>
                  </tr>
                  <!--  <tr>
                    <td class="text">Servicio:</td>
                    <td class="data">{{incidencebycode.servicio }}</td>
                  </tr>-->
                  <tr>
                    <td class="text">Tipo:</td>
                    <td class="data">{{incidencebycode.tipo }}</td>
                  </tr>
                  <!--  <tr>
                    <td class="text">Servicio:</td>
                    <td class="data">{{ incidencebycode.servicios_id}}</td>
                  </tr>-->
                  <!-- <tr>
                    <td class="text">usuario:</td>
                    <td class="data">{{ incidencebycode.usuarios_id}}</td>
                  </tr>-->
                  <tr>
                    <td class="text">Descripción:</td>
                    <td class="data">{{incidencebycode.descripcion }}</td>
                  </tr>
                  <!-- <tr>
                    <td class="text">Activo:</td>
                    <td class="data">{{incidencebycode.activo }}</td>
                  </tr>-->
                  <tr>
                    <td class="text">Fecha de resolución:</td>
                    <td
                      class="data"
                    >{{ new Date(incidencebycode.fecha_resolucion).toLocaleString('es-ES',{timeZone:'UTC'}) }}</td>
                  </tr>
                  <tr>
                    <td class="text">Comentario:</td>
                    <td class="data">{{incidencebycode.comentario_resolucion }}</td>
                  </tr>
                  <tr>
                    <td class="text">Valoracíon:</td>
                    <td class="data">{{incidencebycode.valoracion }}</td>
                  </tr>
                  <tr>
                    <td class="text">Comentario valoración:</td>
                    <td class="data">{{ incidencebycode.comentario_valoracion }}</td>
                  </tr>
                  <tr>
                    <td class="text">Fecha valoración:</td>
                    <td
                      class="data"
                    >{{new Date(incidencebycode.fecha_registro_valoracion).toLocaleString('es-ES',{timeZone:'UTC'}) }}</td>
                  </tr>
                  <tr>
                    <td class="text">Código incidencia:</td>
                    <td class="data">{{ incidencebycode.codigo_incidencia }}</td>
                  </tr>
                  <tr>
                    <td class="text">Fecha de registro:</td>
                    <td
                      class="data"
                    >{{new Date(incidencebycode.fecha_registro).toLocaleString('es-ES',{timeZone:'UTC'})}}</td>
                  </tr>
                  <div class="buttons">
                    <input
                      class="button-back"
                      @click="deleteIncidenceByCodeEvent(index)"
                      value="BORRAR"
                    />
                    <input
                      class="button-go"
                      @click="editIncidenceByCodeEvent(index)"
                      value="EDITAR"
                    />
                    <input
                      class="button-go"
                      @click="seeVoteByCodeEvent(index);openModalVoteByCode()"
                      v-show="incidencebycode.fecha_resolucion && !incidencebycode.valoracion"
                      value="VOTAR"
                    />
                  </div>
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
      <section>
        <div class="vote" v-show="seeVoteByCode">
          <div class="modal" style="overflow-y: scroll;" v-show="modalVoteByCode">
            <div class="modalBox">
              <article class="search-input">
                <h2>Valora esta reserva</h2>
                <div class="form">
                  <fieldset>
                    <form>
                      <ul>
                        <li>
                          <label for="vote">Valoración :</label>

                          <star-rating
                            inactive-color="#142850"
                            @rating-selected="rating = $event"
                            :rating="rating"
                          ></star-rating>
                        </li>
                        <li>
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
                        @click="closeVoteByCodeEvent();closeModalVoteByCode()"
                        value="CERRAR"
                      />
                      <input
                        class="button-go"
                        @click="voteIncidenceByCodeEvent(incidencecode, voteDescriptione)"
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
  name: "ListIncidencesByCode",
  data() {
    return {
      rating: 0,
      voteDescription: "",
      incidenceCode: {},
      modalVoteByCode: false
    };
  },
  props: {
    incidencebycode: Object,
    seeVoteByCode: Boolean,
    seeIncidencesbycode: Boolean
  },
  methods: {
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UNA INCIDENCIA
    editIncidencebyCodeEvent(index) {
      //GUARDANDO LA INFORMACIÓN DEL INCIDENCIA SELECCIONADO
      let data = this.bycode[index];
      //ENVIANDO LA INFORMACIÓN DEL INCIDENCIA A LA VISTA
      this.$emit("editbycode", data);
    },

    //FUNCION QUE EMITE UN EVENTO PARA BORRAR UNA INCIDENCIA
    deleteIncidenceByCodeEvent(index) {
      let data = this.bycode[index].id;
      this.$emit("deletebycode", data);
    },
    //FUNCION QUE EMITE UN EVENTO PARA VOTAR UNA INCIDENCIA
    seeVoteByCodeEvent(index) {
      this.incidencecode = this.bycode[index];
      this.$emit("showvotebycode");
    },

    voteIncidenceByCodeEvent(incidenceCode, voteDescription, rating) {
      this.$emit("votebycode", incidenceCode, voteDescription, this.rating);
    },
    //FUNCION QUE EMITE UN EVENTO PARA VOTAR UNA INCIDENCIA
    closeVoteByCodeEvent() {
      this.$emit("closevotebycode");
    },
    //  ABRE EL MODAL PARA VOTAR LA INCIDNCIEA
    openModalVoteByCode() {
      this.modalVoteByCode = true;
    },
    // CIERRA EL MODAL DESPUES DE VOTAR LA INCIDNCIEA
    closeModalVoteByCode() {
      this.modalVoteByCode = false;
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

.myincidence {
  border: 4px solid #142850;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 2%;
  min-width: 95%px;
}
table {
  min-width: 350px;
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
</style>
