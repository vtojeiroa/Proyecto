<template>
  <div class="home">
    <article class="users">
      <div class="user" v-for="(user, index) in users" :key="user.id">
        <img :src="user.avatar" />
        <p>Id usuario: {{ user.id }}</p>
        <p>Activo: {{ user.activo }}</p>
        <p>Tipo de usuario: {{ user.tipo_usuario }}</p>
        <p>Nombre: {{ user.nombre }}</p>
        <p>Apellido: {{ user.apellidos }}</p>
        <p>Doc. Identidad: {{ user.num_doc_identidad }}</p>
        <p>Email: {{ user.email }}</p>
        <p>Direción: {{ user.direccion }}</p>
        <p>Código postal: {{ user.codigo_postal }}</p>
        <p>Localidad: {{ user.localidad }}</p>
        <p>Provincia: {{ user.provincia }}</p>
        <p>Pais: {{ user.pais }}</p>
        <p>Teléfono: {{ user.telefono }}</p>
        <p>Fecha de nacimiento:{{user.fecha_nacimiento | moment("DD-MM-YYYY")}}</p>
        <p>Sede: {{ user.sedes_id }}</p>
        <div class="buttons">
          <button @click="deleteUserEvent(index)">BORRAR</button>
          <button @click="editUserEvent(index)">EDITAR</button>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ListUsers",
  props: { users: Array },
  methods: {
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UN CLIENTE
    editUserEvent(index) {
      //GUARDANDO LA INFORMACIÓN DEL CLIENTE SELECCIONADO
      let data = this.users[index];
      //ENVIANDO LA INFORMACIÓN DEL CLIENTE A LA VISTA
      this.$emit("edit", data);
    },

    //FUNCION QUE EMITE UN EVENTO PARA BORRAR UN CLIENTE
    deleteUserEvent(index) {
      let data = this.users[index].id;
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
