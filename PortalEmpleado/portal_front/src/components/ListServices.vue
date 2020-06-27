<template>
  <div class="home">
    <article class="users">
      <div class="user" v-for="(service, index) in services" :key="service.id">
        <p>Id servicio: {{ service.id }}</p>
        <p>Activo: {{ service.activo }}</p>
        <p>Sección: {{ service.seccion }}</p>
        <p>Tipo: {{ service.tipo }}</p>
        <p>Descripción: {{ service.descripcion }}</p>
        <p>Fecha creación:{{service.fecha_registro | moment("DD-MM-YYYY")}}</p>
        <p>ultima actualizacion: {{service.ultima_actualizacion | moment("DD-MM-YYYY")}}</p>
        <div class="buttons">
          <button @click="deleteServiceEvent(index)">BORRAR</button>
          <button @click="editServiceEvent(index)">EDITAR</button>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ListServices",
  props: { services: Array },
  methods: {
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UN CLIENTE
    editServiceEvent(index) {
      //GUARDANDO LA INFORMACIÓN DEL CLIENTE SELECCIONADO
      let data = this.services[index];
      //ENVIANDO LA INFORMACIÓN DEL CLIENTE A LA VISTA
      this.$emit("edit", data);
    },

    //FUNCION QUE EMITE UN EVENTO PARA BORRAR UN CLIENTE
    deleteServiceEvent(index) {
      let data = this.services[index].id;
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
