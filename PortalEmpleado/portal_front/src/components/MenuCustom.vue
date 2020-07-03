<template>
  <div>
    <nav id="nav">
      <router-link :to="{ name: 'UserAttention' }"
        >Atención al usuario</router-link
      >
      <router-link v-show="loggedIn()" :to="{ name: 'HomePortal' }"
        >Portal</router-link
      >
      <router-link v-show="loggedIn()" :to="{ name: 'About' }"
        >Sobre mí</router-link
      >
      <p class="userName" v-show="loggedIn()">
        Hola,
        {{ nombre }}!!!
      </p>
      <router-link v-show="tagIsAdmin()" :to="{ name: 'Users' }"
        >Admin</router-link
      >
      <router-link v-show="loggedIn()" :to="{ name: 'UserProfile' }"
        >Perfil</router-link
      >
      <a href="/" @click="logoutUser()" v-show="loggedIn()">Cerrar sesión</a>
    </nav>
    <section id="header">
      <img src="../assets/Logo.jpg" alt="Logo del portal" />
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
      nombre: "",
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
    },

    // ESTA LOGADO??

    loggedIn() {
      return isLoggedIn();
    },

    // ES ADMIN??

    tagIsAdmin() {
      return checkAdmin();
    },
  },
  created() {
    this.getName();
  },
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
section#header img {
  width: 50px;

  border-radius: 10px;
}
section#header h1 {
  color: #142850;
  font-weight: 900;
  font-size: 1.5rem;
  text-align: center;
  padding: 1rem 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
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
  margin: 0;
  padding: 0;
}
@media (min-width: 750px) {
  section#header h1 {
    font-size: 3.5rem;
  }
  img {
    width: 70px;
  }
}
</style>
