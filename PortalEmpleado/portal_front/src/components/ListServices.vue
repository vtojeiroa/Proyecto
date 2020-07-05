<template>
  <div class="home">
    <main>
      <section>
        <article class="services">
          <div class="service" v-for="(service, index) in services" :key="service.id">
            <table>
              <tbody>
                <tr>
                  <td class="text">Id servicio:</td>
                  <td class="data">{{service.id}}</td>
                </tr>
                <tr>
                  <td class="text">Activo:</td>
                  <td class="data">{{service.activo}}</td>
                </tr>
                <tr>
                  <td class="text">Sección:</td>
                  <td class="data">{{service.seccion}}</td>
                </tr>
                <tr>
                  <td class="text">Tipo:</td>
                  <td class="data">{{service.tipo}}</td>
                </tr>
                <tr>
                  <td class="text">Descripción:</td>
                  <td class="data">{{service.descripcion}}</td>
                </tr>
                <tr>
                  <td class="text">Fecha creación:</td>
                  <td
                    class="data"
                  >{{new Date(service.fecha_registro).toLocaleString('es-ES',{timeZone:'UTC'})}}</td>
                </tr>
                <tr>
                  <td class="text">ultima actualizacion:</td>
                  <td
                    class="data"
                  >{{new Date(service.ultima_actualizacion).toLocaleString('es-ES',{timeZone:'UTC'})}}</td>
                </tr>

                <div class="buttons">
                  <input class="button-back" value="Borrar" @click="deleteServiceEvent(index)" />
                  <input class="button-go" value="Editar" @click="editServiceEvent(index)" />
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
  justify-content: center;
  align-items: center;
}

.service {
  border: 4px solid #142850;
  margin: 2rem auto;
  padding: 1rem;
  width: 95%;
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
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
}
td.text {
  text-transform: uppercase;
  font-size: 14px;
  text-align: start;
  margin-right: 10px;
}
td.data {
  max-width: 320px;
  font-weight: bold;
  text-align: end;
}
img {
  width: 200px;
  border-radius: 10px;
}

input {
  text-align: center;
}
</style>
