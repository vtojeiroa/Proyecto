<template>
  <div class="home">
    <article class="user">
      <img :src="dataUsers.avatar" width="100" alt="Foto de perfil" />

      <!--   <p>Id usuario: {{ dataUsers.id }}</p>
      <p>Activo: {{ dataUsers.active }}</p>-->
      <p>Nombre: {{ dataUsers.name }}</p>
      <p>Apellido: {{ dataUsers.surname }}</p>
      <p>Doc. Identidad: {{ dataUsers.identification_document }}</p>
      <p>Email: {{ dataUsers.email }}</p>
      <p>Direción: {{ dataUsers.address }}</p>
      <p>Código postal: {{ dataUsers.postal_code }}</p>
      <p>Localidad: {{ dataUsers.location }}</p>
      <p>Provincia: {{ dataUsers.province }}</p>
      <p>Pais: {{ dataUsers.country }}</p>
      <p>Teléfono: {{ dataUsers.phone }}</p>
      <p>Fecha de nacimiento:{{ dataUsers.birthdate }}</p>
      <p>Sede: {{ dataUsers.headquarters }}</p>
      <div class="buttons">
        <button @click="editUserEvent()">EDITAR</button>
      </div>
    </article>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ProfileData",
  props: { dataUsers: Object },
  methods: {
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UN CLIENTE
    editUserEvent(index) {
      let data = this.dataUsers[index];
      //ENVIANDO LA INFORMACIÓN DEL CLIENTE A LA VISTA
      this.$emit("edit", data);
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
