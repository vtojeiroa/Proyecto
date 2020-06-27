<template>
  <div>
    <nav id="nav">
      <router-link :to="{ name: 'UserAttention' }">Atención al usuario</router-link>
      <router-link :to="{ name: 'Login' }">Inicio</router-link>
      <router-link :to="{ name: 'About' }">Sobre mí</router-link>
      <router-link :to="{ name: 'Users' }">Admin</router-link>
      <p class="userName">
        Hola,
        <strong>{{ nombre }}!!!</strong>
      </p>
      <router-link :to="{ name: 'UserProfile' }">Perfil</router-link>
      <a href="/" @click="logoutUser()">Cerrar sesión</a>
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
      Swal.fire({
        icon: "success",
        title: "Desconexión realizada con éxito! Hasta pronto!!",
        showConfirmButton: false,
        timer: 2500
      });
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
  height: 15vh;
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
#nav {
  font-family: "Noto Sans KR", sans-serif;
  padding: 1rem;
  display: flex;
  justify-content: center;
}

#nav a {
  font-weight: 900;
  font-size: 1rem;
  color: #27496d;
  margin: 0 0.5rem;
  text-decoration: none;
}
#nav a:hover {
  color: #00909e;
}

#nav a.router-link-exact-active {
  color: #00909e;
}
button {
  padding: 0.3rem;
  width: 8rem;
  background: red;
  color: whitesmoke;
  border-radius: 10px;
  font-weight: bolder;
  margin: 0 1rem;
}
button:hover {
  background: whitesmoke;
  color: red;
  font-weight: bolderf;
}

p.userName {
  color: mediumblue;
}

p {
  font-weight: bolder;
  color: whitesmoke;
}
</style>
