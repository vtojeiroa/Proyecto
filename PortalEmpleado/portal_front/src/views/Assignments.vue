<template>
  <div class="home">
    <!-- USO HEADFUL PARA PERSONALIZAR EL NOMBRE DE LA PÁGINA -->

    <vue-headful
      title="Asignaciones"
      description="Página que lista las diferentes Asinaciones de sercicios por sede"
    />
    <!-- VISTA DEL MENÚ -->
    <menucustom></menucustom>

    <!--  LINKS DATOS -->
    <section class="linksAdmin">
      <article class="linksAdmin">
        <menulinksAdmin></menulinksAdmin>
        <router-link :to="{ name: 'NewAssignments' }">Nueva asignación</router-link>
      </article>
    </section>
    <main id="container">
      <!-- LISTA DE ASIGNACIONES -->
      <div class="assignments">
        <h2>Gestión de asignaciones</h2>
        <h3>Gestiona el alta, modificación y baja de las asignaciones</h3>

        <!--  ANIMACIÓN DE CSS CARGANDO -->

        <div v-show="loading" class="lds-ripple">
          <div></div>
          <div></div>
        </div>
        <h3>Buscador de asignaciones</h3>
        <div class="buttons">
          <!-- BOTON PARA RECARGAR -->
          <input class="button-back" value="Reiniciar" @click="search = ''" />

          <!-- BOTON PARA ABRIR EL MODAL DEL BUSCADOR -->
          <input class="button-go" value="Abrir" @click="openModalSearch()" />
        </div>
        <!-- IMPLEMENTACIÓN DEL MODAL DEL BUSCADOR -->
        <div class="modal" v-show="modalSearch">
          <div class="modalBox">
            <label for="bySearch">Buscador de asignaciones:</label>
            <input
              v-model="search"
              id="search"
              name="bySearch"
              type="search"
              placeholder="Introduce algún dato de la asignación"
            />
            <div class="buttons">
              <input class="button-back" value="Cerrar" @click="closeModalSearch()" />
              <input class="button-go" value="Reiniciar" @click="search = ''" />
            </div>
          </div>
        </div>
        <!-- VISTA DE LAS ASIGNACIONES -->
        <listassignments
          :assignments="filteredAssignments"
          v-on:edit="openModal"
          v-on:delete="deleteAssignments"
        ></listassignments>

        <!-- MODAL PARA EDITAR ASIGNACIONES -->
        <div class="modal" v-show="modal">
          <div class="modalBox" v-on:edit="showEditText">
            <h3>Actualiza los datos</h3>

            <form id="form">
              <table class="form-table">
                <tbody>
                  <tr>
                    <td class="text">
                      <label for="disponibility">Disponibilidad :</label>
                    </td>
                    <td class="data">
                      <input
                        name="newDisponibility"
                        type="text"
                        maxlength="255"
                        autocomplete="off"
                        v-model="newDisponibility"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>

            <div class="buttons">
              <input type="button" class="button-back" value="Cerrar" @click="closeModal()" />

              <input
                id="button-data"
                type="submit"
                class="button-go"
                value="Actualizar"
                @click="updateAssignments()"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- VISTA DEL FOOTER -->
    <footercustom></footercustom>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

//IMPORTO EL MENU
import menucustom from "../components/MenuCustom.vue";

//IMPORTO EL MENU
import menulinksAdmin from "../components/MenuLinksAdmin.vue";

//IMPORTO EL FOOTER
import footercustom from "../components/FooterCustom.vue";

//IMPORTO EL COMPONENTE
import listassignments from "../components/ListAssignments.vue";

//IMPORTO SWAL
import Swal from "sweetalert2";

//IMPORTO LA FUNCION DEL TOKEN
import { getAuthToken } from "../api/utils";
export default {
  name: "Assignments",
  components: { menucustom, menulinksAdmin, footercustom, listassignments },
  data() {
    return {
      //ARRAY DE LOS CLIENTES DE LA BBDD
      assignments: [],
      modal: false,
      search: "",
      loading: true,
      id: null,
      modalSearch: false,
      newId: "",
      newHeadquarter: "",
      newType: "",
      newDisponibility: ""
    };
  },
  methods: {
    //FUNCIÓN PARA CARGAR LAS ASIGNACIONES
    getAssignments() {
      const token = getAuthToken();
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      let self = this;
      axios
        .get("http://localhost:3000/assignment")
        //SI SALE BIEN
        .then(function(response) {
          self.assignments = response.data.data;
        })
        //SI SALE MAL
        .catch(error =>
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 2500
          })
        );
    },
    showEditText(data) {
      this.newId = data.id;
      this.newHeadquarter = data.sede;
      this.newType = data.tipo;
      this.newDisponibility = data.disponibilidad_servicios;
    },

    //FUNCION PARA ACTUALIZAR UNA ASIGNACIÓN
    updateAssignments(data) {
      const token = getAuthToken();
      let self = this;
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      axios
        .put("http://localhost:3000/assignment/" + this.newId, {
          headquarter: self.newHeadquarter,
          service_type: self.newType,
          disponibility: self.newDisponibility
        })
        //SI SALE BIEN
        .then(function(response) {
          //MOSTRAR UN MENSAJE CON EL RESULTADO
          Swal.fire({
            icon: "success",
            title: `Acabas de actualizar los datos de la asignación `,
            showConfirmButton: false,
            timer: 2500
          }).then(
            //RECARGAR LA PÁGINA
            result => {
              self.closeModal();
              self.getAssignments();
            }
          );
        })
        //SI SALE MAL
        .catch(error =>
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            showConfirmButton: false,
            timer: 2500
          })
        );
    },
    //FUNCION PARA ELIMINAR UNA ASIGNACIÓN DE LA BBDD
    deleteAssignments(data) {
      let self = this;
      const token = getAuthToken();
      axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás deshacerlo!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, bórralo!"
      }).then(result => {
        if (result.value) {
          axios
            .delete("http://localhost:3000/assignment/" + data)
            //  SI SALE BIEN
            .then(function(response) {
              //MOSTRAR UN MENSAJE CON EL RESULTADO
              Swal.fire({
                icon: "success",
                title: `Acabas de borrar la assignación `,
                showConfirmButton: false,
                timer: 2500
              }).then(result => {
                self.getAssignments();
              });
            })
            //SI SALE MAL
            .catch(error =>
              Swal.fire({
                icon: "error",
                title: error.response.data.message,
                showConfirmButton: false,
                timer: 2500
              })
            );
        }
      });
    },
    //  ABRE EL MODAL PARA EDITAR LOS DATOS DE LA ASIGNACIÓN Y MUESTRA LOS DATOS ORIGINALES
    openModal(data) {
      this.modal = true;
      this.showEditText(data);
      this.search = "";
    },
    // CIERRA EL MODAL DESPUES DE EDITAR LOS DATOS DE LA ASIGNACIÓN
    closeModal() {
      this.modal = false;
    },
    //  ABRE EL MODAL DEL BUSCADOR
    openModalSearch() {
      this.modalSearch = true;
    },

    //CIERRA EL MODAL DEL BUSCADOR
    closeModalSearch() {
      this.modalSearch = false;
    }
  },
  created() {
    this.getAssignments();
    this.loading = false;
  },
  computed: {
    filteredAssignments() {
      let result = this.assignments;

      if (!this.search) {
        return result;
      } else {
        result = result.filter(
          assignment =>
            assignment.id === parseInt(this.search) ||
            assignment.sede.toLowerCase().includes(this.search.toLowerCase()) ||
            assignment.servicio
              .toLowerCase()
              .includes(this.search.toLowerCase()) ||
            assignment.tipo.toLowerCase().includes(this.search.toLowerCase())
        );
        if (!result.length) {
          Swal.fire({
            title:
              "Con los parametros introducidos no hemos encontrado ningún servicio",
            text: "Vuelve a intentarlo",
            showConfirmButton: false,
            timer: 2500
          });
        }
        return result;
      }
    }
  }
};
</script>
<style scoped>
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
.home {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.linksAdmin {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
article.linksAdmin a {
  background: #142850;
  color: #dae1e7;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.75rem;
  line-height: 15px;
  border-radius: 50px;
  cursor: pointer;
  width: 150px;
  border: none;
  border: 2px solid #142850;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  margin-top: 1rem;
}

main#container {
  background: #fff;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  box-shadow: 0 0 4px 0 #d4d4d4;
  box-sizing: border-box;
  margin: 30px auto;
  padding: 15px 30px;
  width: 95%;
  max-width: 900px;
  border-radius: 10px;
  padding-bottom: 81px;
}

body section article.links {
  display: flex;
  justify-content: center;
}

section article a:hover {
  color: #00909e;
}

tr {
  display: flex;
  flex-wrap: wrap;
  vertical-align: middle;
  align-content: space-between;
}

input.button-go {
  padding: 0.75px;
  vertical-align: middle;
}
h2 {
  text-transform: uppercase;
  padding: 1rem 0;
  text-align: center;
  font-size: 28px;
}

h3 {
  text-transform: uppercase;
  text-align: center;
  padding: 1rem 0;
}

input.button-go,
input.button-back {
  text-align: center;
}
.modalBox input.button-go,
.modalBox input.button-back {
  text-align: center;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modalBox {
  background: #dae1e7;
  color: #142850;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 90%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  border-radius: 10px;
}

.modalBox form table tbody {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}
.modalBox form table tbody tr {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}
input#search {
  width: 302px;
}
</style>
