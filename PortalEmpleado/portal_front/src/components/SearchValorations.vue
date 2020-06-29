<template>
  <div class="valorations">
    <main id="content">
      <section class="valorations">
        <article class="valorations">
          <h1>DATOS REGISTRADOS</h1>
          <p>Servicio : {{values.service}}</p>
          <p>Tipo de servicio : {{values.type}}</p>
          <p>Valoración media : {{parseFloat(Math.round(valorations.avgvotes*100)/100).toFixed(2)}}</p>
          <p>Número de valoraciones : {{valorations.totalvotes}}</p>
        </article>
        <article class="datavaloration">
          <div class="allValorations" v-for="searchinc in searchincs" :key="searchinc.id">
            <table>
              <tr>
                <th style="width: 150px;">Valoración</th>
                <th style="width: 500px;">Comentario</th>
                <th style="width: 150px;">Fecha de registro</th>
              </tr>
              <tr>
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
    </main>
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
    values: {}
  }
};
</script>
<style scoped>
.main section {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
section.valorations {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
article.valorations,
article.datavaloration {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  color: #142850;
  font-size: 15px;
  border: 4px solid #142850;
  margin: 1rem 0;
  padding: 1rem;
  display: inline-block;
  border-radius: 10px;
  text-align: center;
}

h1 {
  font-size: 15px;
  font-weight: bolder;
  text-decoration-line: underline;
}

p {
  color: #333;
  font-weight: bolder;
  padding: 0.3rem;
}
</style>
