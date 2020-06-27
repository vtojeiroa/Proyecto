<template>
  <div class="home">
    <article class="closeIncidences">
      <div
        class="closeIncidence"
        v-for="(closeincidence, index) in closeincidences"
        :key="closeincidence.active"
      >
        <p>Id incidencia: {{ closeincidence.id }}</p>
        <p>usuario: {{ closeincidence.usuarios_id }}</p>
        <p>Descripción: {{ closeincidence.descripcion }}</p>
        <p>Activo: {{ closeincidence.activo }}</p>
        <div class="buttons">
          <button @click="closeIncidenceEvent(index)">CERRAR INCIDENCIA</button>
        </div>
      </div>
    </article>
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
  align-items: center;
}
.closeincidences {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /*   background: whitesmoke; */
  color: red;
  width: 60%;
}

.closeincidence {
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