<template>
  <div class="allReserves">
    <section id="content">
      <!--  ANIMACIÓN DE CSS CARGANDO -->

      <div v-show="loading" class="lds-ripple">
        <div></div>
        <div></div>
      </div>

      <article class="allReserves">
        <h1>VALORACIONES REGISTRADAS</h1>
        <p>Servicio : {{values.service}}</p>
        <p>Tipo de servicio : {{values.type}}</p>
        <p>Valoración media : {{parseFloat(Math.round(valorations.avgvotes*100)/100).toFixed(2)}}</p>
        <p>Número de valoraciones : {{valorations.totalvotes}}</p>

        <div class="allValorations" v-for="searchinc in searchincs" :key="searchinc.id">
          <table>
            <tr>
              <th style="width: 200px;">Fecha de registro</th>
              <th style="width: 150px;">Valoración</th>
              <th style="width: 500px;">Comentario</th>
              <th style="width: 150px;">Servicio</th>
            </tr>
            <tr>
              <td>{{ searchinc.servicio }}</td>
              <td>{{ searchinc.valoracion }}</td>
              <td>{{ searchinc.comentario_valoracion }}</td>
              <td>
                <span>{{searchinc.fecha_registro | moment("DD-MM-YYYY HH:mm")}}</span>
              </td>
            </tr>
          </table>
        </div>
      </article>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "SearchValorations",
  data() {
    return {};
  },

  props: {
    searchincs: Array,
    valorations: Object,
    values: {},
    loading: Boolean
  }
};
</script>
<style scoped>
.home {
  display: flex;
  align-items: center;
}
.myreserves {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /*   background: whitesmoke; */
  color: red;
  width: 60%;
}

.myreserve {
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
.lds-ripple {
  display: inline-block;
  align-self: center;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
