<template>
  <div class="home">
    <main>
      <section>
        <div class="allReserves">
          <article class="AllReserves">
            <div class="allReserve" v-for="allreserve in allreserves" :key="allreserve.id">
              <table>
                <tbody>
                  <tr>
                    <td class="text">Tipo:</td>
                    <td class="data">{{allreserve.tipo }}</td>
                  </tr>
                  <tr>
                    <td class="text">Fecha inicio reserva:</td>
                    <td
                      class="data"
                    >{{ allreserve.fecha_hora_inicio_reserva | moment("DD-MM-YYYY HH:mm" ) }}</td>
                  </tr>
                  <tr>
                    <td class="text">Fecha fin reserva:</td>
                    <td
                      class="data"
                    >{{allreserve.fecha_hora_fin_reserva | moment("DD-MM-YYYY HH:mm") }}</td>
                  </tr>
                  <tr>
                    <td class="text">Motivo reserva:</td>
                    <td class="data">{{allreserve.motivo_reserva }}</td>
                  </tr>
                  <tr>
                    <td class="text">Valoracíon:</td>
                    <td class="data">{{allreserve.valoracion }}</td>
                  </tr>
                  <tr>
                    <td class="text">Comentario valoración:</td>
                    <td class="data">{{allreserve.comentario_valoracion }}</td>
                  </tr>

                  <tr>
                    <td class="text">Fecha de Valoracion:</td>
                    <td class="data">{{ allreserve.fecha_registro | moment("DD-MM-YYYY HH:mm")}}</td>
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
  name: "ListAllReserves",
  data() {
    return {};
  },

  props: {
    allreserves: Array
  }
};
</script>
<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
}

.allReserve {
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