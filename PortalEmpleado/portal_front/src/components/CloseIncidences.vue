<template>
  <div class="home">
    <main>
      <section>
        <article class="closeIncidences">
          <div
            class="closeIncidence"
            v-for="(closeincidence, index) in closeincidences"
            :key="closeincidence.active"
          >
            <table>
              <tbody>
                <tr>
                  <td class="text">Id incidencia:</td>
                  <td class="data">{{ closeincidence.id }}</td>
                </tr>

                <tr>
                  <td class="text">usuario:</td>
                  <td class="data">{{ closeincidence.usuarios_id }}</td>
                </tr>
                <tr>
                  <td class="text">Descripción:</td>
                  <td class="data">{{ closeincidence.descripcion }}</td>
                </tr>
                <tr>
                  <td class="text">Activo:</td>
                  <td class="data">{{ closeincidence.activo }}</td>
                </tr>
                <div class="buttons">
                  <input class="button-go" value="Responder" @click="closeIncidenceEvent(index)" />
                </div>
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "CloseIncidences",
  props: { closeincidences: Array },
  methods: {
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UN CLIENTE
    closeIncidenceEvent(index) {
      //GUARDANDO LA INFORMACIÓN DE LAS INCIDENCIAS
      let data = this.closeincidences[index];
      //ENVIANDO LA INFORMACIÓN DE LAS INCIDENCIAS
      this.$emit("close", data);
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

.closeIncidence {
  border: 4px solid #142850;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 2%;
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
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}
td.text {
  text-transform: uppercase;
  font-size: 14px;
  align-self: flex-start;
  margin-right: 10px;
}
td.data {
  font-weight: bold;
  max-width: 200px;
  text-align: end;
}

input {
  text-align: center;
  min-width: 110px;
}
</style>
