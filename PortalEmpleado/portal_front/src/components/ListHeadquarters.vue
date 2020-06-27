<template>
  <div class="home">
    <article class="headquarters">
      <div class="headquarter" v-for="(headquarter, index) in headquarters" :key="headquarter.id">
        <p>Id servicio: {{ headquarter.id }}</p>
        <p>Activo: {{ headquarter.activo }}</p>
        <p>Nombre: {{ headquarter.nombre }}</p>
        <p>Dirección: {{ headquarter.direccion }}</p>
        <p>Código postal: {{ headquarter.codigo_postal }}</p>
        <p>Localidad: {{ headquarter.localidad }}</p>
        <p>Provincia: {{ headquarter.provincia }}</p>
        <p>Pais: {{ headquarter.pais }}</p>
        <p>Fecha creación:{{headquarter.fecha_registro | moment("DD-MM-YYYY")}}</p>
        <p>ultima actualizacion: {{headquarter.ultima_actualizacion | moment("DD-MM-YYYY")}}</p>
        <div class="buttons">
          <button @click="deleteHeadquarterEvent(index)">BORRAR</button>
          <button @click="editHeadquarterEvent(index)">EDITAR</button>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "ListHeadquarters",
  props: { headquarters: Array },
  methods: {
    //FUNCION QUE EMITE UN EVENTO PARA EDITAR UN CLIENTE
    editHeadquarterEvent(index) {
      //GUARDANDO LA INFORMACIÓN DEL CLIENTE SELECCIONADO
      let data = this.headquarters[index];
      //ENVIANDO LA INFORMACIÓN DEL CLIENTE A LA VISTA
      this.$emit("edit", data);
    },

    //FUNCION QUE EMITE UN EVENTO PARA BORRAR UN CLIENTE
    deleteHeadquarterEvent(index) {
      let data = this.headquarters[index].id;
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
.headquarters {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  /*   background: whitesmoke; */
  color: red;
  width: 60%;
}

.headquarter {
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