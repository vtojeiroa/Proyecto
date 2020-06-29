<template>
  <div id="footer">
    <!--   <nav class="footer-links">
      <a class="link-privacy" href="/privacidad.html" target="_blank">Política de privacidad</a>
      <a class="link link-cookies" href="/cookies.html" target="_blank">Política de cookies</a>
      <a class="link link-terms" href="/uso.html" target="_blank">Condiciones de uso</a>
    </nav>-->

    <p>Copyright © 2020 Portal del Empleado para HackaBoss • Todos los derechos reservados</p>
  </div>
</template>

<script>
export default {
  name: "FooterCustom"
};
</script>

<style scoped>
#footer {
  width: 100%;
  height: 81px;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
}
nav.footer-links {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
nav.footer-links a {
  font-size: 14px;
  font-weight: 700;
  color: #142850;
  text-decoration: none;
  padding: 19px 9px 0;
  margin: 0px auto;
  overflow: hidden;
  max-width: 900px;
}
nav.footer-links a:hover {
  color: #00909e;
}

p {
  padding: 20px 0px;
  color: #142850;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  display: block;
}
</style>
