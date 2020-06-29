<template>
  <div class="home">
    <main>
      <section>
        <article class="assignments">
          <div class="assignment" v-for="(assignment, index) in assignments" :key="assignment.id">
            <table>
              <tbody>
                <tr>
                  <td class="text">Id asignación:</td>
                  <td class="data">{{assignment.id}}</td>
                </tr>
                <tr>
                  <td class="text">Nombre:</td>
                  <td class="data">{{ assignment.sede}}</td>
                </tr>
                <tr>
                  <td class="text">Servicio:</td>
                  <td class="data">{{assignment.servicio}}</td>
                </tr>
                <tr>
                  <td class="text">Tipo de servicio:</td>
                  <td class="data">{{assignment.tipo}}</td>
                </tr>
                <tr>
                  <td class="text">Disponibilidad:</td>
                  <td class="data">{{assignment.disponibilidad_servicios}}</td>
                </tr>

                <div class="buttons">
                  <input class="button-back" value="Borrar" @click="deleteAssignmentEvent(index)" />
                  <input class="button-go" value="Editar" @click="editAssignmentEvent(index)" />
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
  name: "ListAssignments",
  props: { assignments: Array },
  methods: {
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UN CLIENTE
    editAssignmentEvent(index) {
      //GUARDANDO LA INFORMACIÓN DEL CLIENTE SELECCIONADO
      let data = this.assignments[index];
      //ENVIANDO LA INFORMACIÓN DEL CLIENTE A LA VISTA
      this.$emit("edit", data);
    },

    //FUNCION QUE EMITE UN EVENTO PARA BORRAR UN CLIENTE
    deleteAssignmentEvent(index) {
      let data = this.assignments[index].id;
      this.$emit("delete", data);
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

.assignment {
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
  justify-content: space-between;
}
td.text {
  text-transform: uppercase;
  font-size: 14px;
  align-self: flex-start;
}
td.data {
  max-width: 300px;
  font-weight: bold;
}
img {
  width: 200px;
  border-radius: 10px;
}

input {
  text-align: center;
}
</style>