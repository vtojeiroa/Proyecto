<template>
  <div>
    <nav id="nav">
      <router-link :to="{ name: 'UserAttention' }">Atención al usuario</router-link>
      <router-link v-show="loggedIn()" :to="{ name: 'HomePortal' }">Inicio</router-link>
      <router-link v-show="loggedIn()" :to="{ name: 'About' }">Sobre mí</router-link>
      <p class="userName" v-show="loggedIn()">
        Hola,
        {{ nombre }}!!!
      </p>
      <router-link v-show="tagIsAdmin()" :to="{ name: 'Users' }">Admin</router-link>
      <router-link v-show="loggedIn()" :to="{ name: 'UserProfile' }">Perfil</router-link>
      <a href="/" @click="logoutUser()" v-show="loggedIn()">Cerrar sesión</a>
    </nav>
    <section id="header">
      <h1>PORTAL DEL EMPLEADO</h1>
    </section>
  </div>
</template>

<script>
import { logOut, getName, isLoggedIn, checkAdmin } from "../api/utils";

export default {
  name: "MenuCustom",
  data() {
    return {
      nombre: ""
    };
  },
  methods: {
    // COGER EL NOMBRE PARA MOSTRARLO EN EL MENU

    getName() {
      this.nombre = getName();
    },

    //DESCONECTAR AL USUARIO- BORRO TOKEN Y NOMBRE
    logoutUser() {
      this.nombre = "";
      return logOut();
      this.$router.push("/");
      /*  Swal.fire({
        icon: "success",
        title: `Desconexión realizada con éxito! Hasta pronto ${this.nombre}!!`,
        showConfirmButton: false,
        timer: 2500
      }); */
    },

    // ESTA LOGADO??

    loggedIn() {
      return isLoggedIn();
    },

    // ES ADMIN??

    tagIsAdmin() {
      return checkAdmin();
    }
  },
  created() {
    this.getName();
  }
};
</script>

<style scoped>
section#header {
  background-image: url("../assets/FotoFondo.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  flex-basis: 100%;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
section#header h1 {
  color: #142850;
  font-weight: 900;
  font-size: 2.5rem;
  text-align: center;
  padding: 1rem;
}
nav#nav {
  font-family: "Noto Sans KR", sans-serif;
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

#nav a {
  font-weight: 900;
  font-size: 1rem;
  color: #27496d;
  margin: 0 0.5rem;
  text-decoration: none;
  margin: 0 1rem;
}
#nav a:hover {
  color: #00909e;
}

#nav a.router-link-exact-active {
  color: #00909e;
}

p.userName {
  color: #142850;
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 900;
  font-size: 1rem;
  margin: 0 0.5rem;
  flex-grow: 0.3;
  text-align: center;
}

p {
  font-weight: bolder;
  color: whitesmoke;
}
</style>
