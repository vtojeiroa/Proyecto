<template>
  <div class="home">
    <main>
      <section>
        <div class="allIncidences">
          <article class="AllIncidences">
            <div class="allIncidence" v-for="allincidence in allincidences" :key="allincidence.id">
              <table>
                <tbody>
                  <tr>
                    <td class="text">Id incidencia:</td>
                    <td class="data">{{ allincidence.id }}</td>
                  </tr>
                  <!--  <tr>
                    <td class="text">Servicio:</td>
                    <td class="data">{{allincidence.servicio }}</td>
                  </tr>-->
                  <tr>
                    <td class="text">Tipo:</td>
                    <td class="data">{{ allincidence.tipo }}</td>
                  </tr>
                  <!--  <tr>
                    <td class="text">Servicio:</td>
                    <td class="data">{{ allincidence.servicios_id}}</td>
                  </tr>-->
                  <!-- <tr>
                    <td class="text">usuario:</td>
                    <td class="data">{{ allincidence.usuarios_id}}</td>
                  </tr>-->
                  <tr>
                    <td class="text">Descripción:</td>
                    <td class="data">{{ allincidence.descripcion }}</td>
                  </tr>
                  <!-- <tr>
                    <td class="text">Activo:</td>
                    <td class="data">{{allincidence.activo }}</td>
                  </tr>-->
                  <tr v-show="allincidence.fecha_resolucion">
                    <td class="text">Fecha de resolución:</td>
                    <td class="data">
                      {{
                      new Date(allincidence.fecha_resolucion).toLocaleString('es-ES',{timeZone:'UTC'})
                      }}
                    </td>
                  </tr>
                  <tr v-show="allincidence.comentario_resolucion">
                    <td class="text">Comentario:</td>
                    <td class="data">{{ allincidence.comentario_resolucion }}</td>
                  </tr>
                  <tr v-show="allincidence.valoracion">
                    <td class="text">Valoracíon:</td>
                    <td class="data">{{ allincidence.valoracion }}</td>
                  </tr>
                  <tr v-show="allincidence.comentario_valoracion">
                    <td class="text">Comentario valoración:</td>
                    <td class="data">{{ allincidence.comentario_valoracion }}</td>
                  </tr>
                  <tr v-show="allincidence.fecha_registro_valoracion">
                    <td class="text">Fecha valoración:</td>
                    <td class="data">
                      {{
                      new Date(allincidence.fecha_registro_valoracion).toLocaleString('es-ES',{timeZone:'UTC'})
                      }}
                    </td>
                  </tr>
                  <!--  <tr>
                    <td class="text">Código incidencia:</td>
                    <td class="data">{{ allincidence.codigo_incidencia }}</td>
                  </tr>-->
                  <tr>
                    <td class="text">Fecha de registro:</td>
                    <td class="data">
                      {{
                      new Date(allincidence.fecha_registro).toLocaleString('es-ES',{timeZone:'UTC'})
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ListAllIncidences",
  data() {
    return {};
  },

  props: {
    allincidences: Array
  }
};
</script>
<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
}

.allIncidence {
  border: 4px solid #142850;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 2%;
  min-width: 300px;
}
table {
  min-width: 300px;
}

tbody {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 5px;
}
tr {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
td {
  padding: 0.2rem 0;
}
td.text {
  text-transform: uppercase;
  font-size: 14px;
  align-self: flex-start;
}
td.data {
  font-weight: bold;
  max-width: 200px;
}

input {
  text-align: center;
}

div.buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
ul,
.modalBox ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
li {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
}
.modalBox fieldset {
  /*  border: none; */
  padding: 2rem 2rem;
  background: #dae1e7;
}
.modalBox fieldset form ul li.star {
  padding-bottom: 1rem;
}
.modalBox fieldset form ul li textarea {
  font-size: 16px;
  padding: 10px;
}
</style>
