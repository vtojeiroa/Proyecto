<template>
  <div class="home">
    <main>
      <section>
        <article class="user">
          <img :src="dataUsers.avatar" width="100" alt="Foto de perfil" />
          <table>
            <tbody>
              <tr>
                <td class="text">Nombre:</td>
                <td class="data">{{ dataUsers.name }}</td>
              </tr>
              <tr>
                <td class="text">Apellido:</td>
                <td class="data">{{ dataUsers.surname }}</td>
              </tr>
              <tr>
                <td class="text">Doc. Identidad:</td>
                <td class="data">{{ dataUsers.identification_document }}</td>
              </tr>
              <tr>
                <td class="text">Email:</td>
                <td class="data">{{ dataUsers.email }}</td>
              </tr>
              <tr>
                <td class="text">Direción:</td>
                <td class="data">{{ dataUsers.address }}</td>
              </tr>
              <tr>
                <td class="text">Código postal:</td>
                <td class="data">{{ dataUsers.postal_code }}</td>
              </tr>
              <tr>
                <td class="text">Localidad:</td>
                <td class="data">{{ dataUsers.location }}</td>
              </tr>
              <tr>
                <td class="text">Provincia:</td>
                <td class="data">{{ dataUsers.province }}</td>
              </tr>
              <tr>
                <td class="text">Pais:</td>
                <td class="data">{{ dataUsers.country }}</td>
              </tr>
              <tr>
                <td class="text">Teléfono:</td>
                <td class="data">{{ dataUsers.phone }}</td>
              </tr>
              <tr>
                <td class="text">Fecha de nacimiento:</td>
                <td
                  class="data"
                  v-show="dataUsers.birthdate !== '01/01/1970'  "
                >{{ new Date(dataUsers.birthdate).toLocaleDateString("es-ES") }}</td>
              </tr>
              <tr>
                <td class="text">Sede:</td>
                <td class="data">{{dataUsers.headquarters }}</td>
              </tr>
            </tbody>
            <p>
              <input class="button-go" value="EDITAR" @click="editUserEvent()" />
            </p>
          </table>
          <p>
            ¿ Quieres darte de baja del Portal de Empleado? pincha
            <input
              type="submit"
              value="Baja"
              class="button-go"
              @click="dropUserEvent()"
            />
          </p>
        </article>
      </section>
    </main>
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
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UN CLIENTE
    dropUserEvent(index) {
      let data = this.dataUsers[index];
      this.$emit("drop", data);
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
  padding-right: 20px;
}
td.data {
  font-weight: bold;
}
img {
  width: 175px;
  border-radius: 10px;
  margin-right: 20px;
}
input {
  text-align: center;
}
input.button-go {
  padding: 0.75px;
  vertical-align: middle;
  align-self: center;
}
p {
  margin-top: 10px;
  text-align: center;
}
</style>
