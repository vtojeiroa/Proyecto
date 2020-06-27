<template>
  <div class="home">
    <article class="headquarters">
      <div class="headquarter" v-for="(assignment, index) in assignments" :key="assignment.id">
        <p>Id asignación: {{ assignment.id }}</p>
        <p>Nombre: {{ assignment.sede }}</p>
        <p>Servicio: {{ assignment.servicio }}</p>
        <p>Tipo de servicio: {{ assignment.tipo }}</p>
        <p>Disponibilidad: {{ assignment.disponibilidad_servicios }}</p>
        <div class="buttons">
          <button @click="deleteAssignmentEvent(index)">BORRAR</button>
          <button @click="editAssignmentEvent(index)">EDITAR</button>
        </div>
      </div>
    </article>
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
  align-items: center;
}
.headquarters {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /*   background: whitesmoke; */
  color: red;
  width: 60%;
}

.headquarter {
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