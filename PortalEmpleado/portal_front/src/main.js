import Vue from "vue";
import App from "./App.vue";
import router from "./router";

/* IMPORTO HEADFUL */
import vueHeadful from "vue-headful";

Vue.component("vue-headful", vueHeadful);

/* IMPORTO START RATING PARA TRABAJAR LAS VALORACIONES  */
import StarRating from "vue-star-rating";

Vue.component("star-rating", StarRating);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
