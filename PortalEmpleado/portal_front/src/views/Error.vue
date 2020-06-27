<template>
  <div class="home">
    <!-- CAMBIAR TITULO DE LA PAGINA -->
    <vue-headful title="Error 404" description="Página no encontrada." />
    <!-- CAMBIAR TITULO DE LA PAGINA -->

    <!-- MENU -->
    <menucustom></menucustom>
    <!-- /MENU -->

    <!-- CONTENIDO -->
    <h1>Error 404</h1>
    <h2>Página web no encontrada</h2>

    <!-- /CONTENIDO -->

    <!-- FOOTER -->
    <footercustom></footercustom>
    <!-- /FOOTER -->
  </div>
</template>

<script>
//IMPORTANDO API
import menucustom from "@/components/MenuCustom.vue";
import footercustom from "@/components/FooterCustom.vue";

export default {
  name: "Error",
  components: {
    menucustom,
    footercustom
  }
};
</script>
<style scoped>
.home {
  text-align: center;
}
h1 {
  color: #ff6666;
  font-size: 80px;
  padding: 8px 16px;
}
p {
  font-size: 12px;
  padding: 16px 0 0;
}
</style>