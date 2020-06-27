import Vue from "vue";
import App from "./App.vue";
import router from "./router";

/* IMPORTO HEADFUL */
import vueHeadful from "vue-headful";

Vue.component("vue-headful", vueHeadful);

/* IMPORTO STARTRATING PARA TRABAJAR LAS VALORACIONES  */
import StarRating from "vue-star-rating";

Vue.component("star-rating", StarRating);

/* IMPORTO VUE-MOMENT PARA TRABAJAR LAS FECHAS  */
Vue.use(require("vue-moment"));

/* IMPORTO VUE-DATE-FNS PARA GESTIONAR LAS FECHAS*/

import VueDateFns from "vue-date-fns";

Vue.use(VueDateFns);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
