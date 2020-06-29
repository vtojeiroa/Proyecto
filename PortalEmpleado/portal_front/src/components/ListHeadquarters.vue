<template>
  <div class="home">
    <main>
      <section>
        <article class="headquarters">
          <div
            class="headquarter"
            v-for="(headquarter, index) in headquarters"
            :key="headquarter.id"
          >
            <table>
              <tbody>
                <tr>
                  <td class="text">Id servicio:</td>
                  <td class="data">{{headquarter.id}}</td>
                </tr>
                <tr>
                  <td class="text">Activo:</td>
                  <td class="data">{{headquarter.activo}}</td>
                </tr>
                <tr>
                  <td class="text">Nombre:</td>
                  <td class="data">{{ headquarter.nombre}}</td>
                </tr>
                <tr>
                  <td class="text">Dirección:</td>
                  <td class="data">{{headquarter.direccion}}</td>
                </tr>
                <tr>
                  <td class="text">Código postal:</td>
                  <td class="data">{{ headquarter.codigo_postal }}</td>
                </tr>
                <tr>
                  <td class="text">Localidad:</td>
                  <td class="data">{{headquarter.localidad}}</td>
                </tr>
                <tr>
                  <td class="text">Provincia:</td>
                  <td class="data">{{ headquarter.provincia }}</td>
                </tr>
                <tr>
                  <td class="text">País:</td>
                  <td class="data">{{headquarter.pais}}</td>
                </tr>
                <tr>
                  <td class="text">Fecha creación:</td>
                  <td class="data">{{headquarter.fecha_registro | moment("DD-MM-YYYY")}}</td>
                </tr>
                <tr>
                  <td class="text">Última actualizacion:</td>
                  <td class="data">{{headquarter.ultima_actualizacion | moment("DD-MM-YYYY")}}</td>
                </tr>
                <div class="buttons">
                  <input class="button-back" value="Borrar" @click="deleteHeadquarterEvent(index)" />
                  <input class="button-go" value="Editar" @click="editHeadquarterEvent(index)" />
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
  justify-content: center;
  align-items: center;
}

.headquarter {
  border: 4px solid #142850;
  margin: 2rem auto;
  padding: 1rem;
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
  justify-content: space-between;
}
td.text {
  text-transform: uppercase;
  font-size: 14px;
  align-self: flex-start;
}
td.data {
  max-width: 300px;
  font-weight: bold;
}
img {
  width: 200px;
  border-radius: 10px;
}

input {
  text-align: center;
}
</style>