<template>
  <div class="home">
    <main>
      <section>
        <article class="users">
          <div class="user" v-for="(user, index) in users" :key="user.id">
            <table>
              <div class="image" v-show="user.foto">
                <img
                  :src="'http://localhost:3000/uploads/' + user.foto"
                  alt="Foto de perfil"
                />
              </div>
              <tbody>
                <tr>
                  <td class="text">Id usuario:</td>
                  <td class="data">{{ user.id }}</td>
                </tr>
                <tr>
                  <td class="text">Activo:</td>
                  <td class="data">{{ user.activo }}</td>
                </tr>
                <tr>
                  <td class="text">Tipo de usuario:</td>
                  <td class="data">{{ user.tipo_usuario }}</td>
                </tr>
                <tr>
                  <td class="text">Nombre:</td>
                  <td class="data">{{ user.nombre }}</td>
                </tr>
                <tr>
                  <td class="text">Apellido:</td>
                  <td class="data">{{ user.apellidos }}</td>
                </tr>
                <tr>
                  <td class="text">Doc. Identidad:</td>
                  <td class="data">{{ user.num_doc_identidad }}</td>
                </tr>
                <tr>
                  <td class="text">Email:</td>
                  <td class="data">{{ user.email }}</td>
                </tr>
                <tr>
                  <td class="text">Direción:</td>
                  <td class="data">{{ user.direccion }}</td>
                </tr>
                <tr>
                  <td class="text">Código postal:</td>
                  <td class="data">{{ user.codigo_postal }}</td>
                </tr>
                <tr>
                  <td class="text">Localidad:</td>
                  <td class="data">{{ user.localidad }}</td>
                </tr>
                <tr>
                  <td class="text">Provincia:</td>
                  <td class="data">{{ user.provincia }}</td>
                </tr>
                <tr>
                  <td class="text">Pais:</td>
                  <td class="data">{{ user.pais }}</td>
                </tr>
                <tr>
                  <td class="text">Teléfono:</td>
                  <td class="data">{{ user.telefono }}</td>
                </tr>
                <tr>
                  <td class="text">Fecha de nacimiento:</td>
                  <td class="data">
                    {{ user.fecha_nacimiento | moment("DD-MM-YYYY") }}
                  </td>
                </tr>
                <tr>
                  <td class="text">Sede:</td>
                  <td class="data">{{ user.sedes_id }}</td>
                </tr>
              </tbody>
              <div class="buttons">
                <input
                  class="button-back"
                  value="Borrar"
                  @click="deleteUserEvent(index)"
                />
                <input
                  class="button-go"
                  value="Editar"
                  @click="editUserEvent(index)"
                />
              </div>
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
  name: "ListUsers",
  props: { users: Array, image: String },
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
    },
  },
};
</script>
<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user {
  border: 4px solid #142850;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 2%;
  min-width: 400px;
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
  justify-content: space-between;
}
td.text {
  text-transform: uppercase;
  font-size: 14px;
}
td.data {
  font-weight: bold;
}
.image {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
img {
  width: 100px;
  border-radius: 20px;
}
input {
  text-align: center;
}
</style>
