"use strict";

import Vue from "vue";
import VueRouter from "vue-router";

/* IMPORTO LAS FUNCIONES PARA COMPROBAR SI ESTÁ LOGADO Y SI ES ADMIN */
import { isLoggedIn } from "../api/utils";
import { checkAdmin } from "../api/utils";

//IMPORTO SWAL
import Swal from "sweetalert2";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      //RUTA PÚBLICA
      allowAnonymous: true,
    },
  },
  {
    path: "/registry",
    name: "Registry",
    component: () => import("../views/Registry.vue"),
    meta: {
      //RUTA PÚBLICA
      allowAnonymous: true,
    },
  },
  {
    path: "/userattention",
    name: "UserAttention",
    component: () => import("../views/UserAttention.vue"),
    meta: {
      //RUTA PÚBLICA
      allowAnonymous: true,
    },
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
    meta: {
      //RUTA PRIVADA
      allowAnonymous: false,
    },
  },
  {
    path: "/homeportal",
    name: "HomePortal",
    component: () => import("../views/HomePortal.vue"),
    meta: {
      //RUTA PRIVADA
      allowAnonymous: false,
    },
  },

  {
    path: "/passwordrecovery",
    name: "PasswordRecovery",
    component: () => import("../views/PasswordRecovery.vue"),
    meta: {
      //RUTA PÚBLICA
      allowAnonymous: true,
    },
  },
  {
    path: "/userprofile",
    name: "UserProfile",
    component: () => import("../views/UserProfile.vue"),
    meta: {
      //RUTA PRIVADA
      allowAnonymous: false,
    },
  },
  /* {
    path: "/editemail",
    name: "EditEmail",
    component: () => import("../views/EditEmail.vue"),
    meta: {
      //RUTA PRIVADA
      allowAnonymous: false,
    },
  }, */
  {
    path: "/myreserves",
    name: "MyReserves",
    component: () => import("../views/MyReserves.vue"),
    meta: {
      //RUTA PRIVADA
      allowAnonymous: false,
    },
  },
  {
    path: "/myreserves/new",
    name: "NewReserve",
    component: () => import("../views/NewReserve.vue"),
    meta: {
      //RUTA PRIVADA
      allowAnonymous: false,
    },
  },
  {
    path: "/myincidences",
    name: "MyIncidences",
    component: () => import("../views/MyIncidences.vue"),
    meta: {
      //RUTA PRIVADA
      allowAnonymous: false,
    },
  },
  {
    path: "/myincidences/new",
    name: "NewIncidence",
    component: () => import("../views/NewIncidence.vue"),
    meta: {
      //RUTA PRIVADA
      allowAnonymous: false,
    },
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users.vue"),
    meta: {
      //RUTA PRIVADA - SÓLO ADMIN
      allowAnonymous: false,
      allowNoAdmin: false,
    },
  },
  {
    path: "/services",
    name: "Services",
    component: () => import("../views/Services.vue"),
    meta: {
      //RUTA PRIVADA - SÓLO ADMIN
      allowAnonymous: false,
      allowNoAdmin: false,
    },
  },
  {
    path: "/services/new",
    name: "NewService",
    component: () => import("../views/NewService.vue"),
    meta: {
      //RUTA PRIVADA - SÓLO ADMIN
      allowAnonymous: false,
      allowNoAdmin: false,
    },
  },
  {
    path: "/headquarters",
    name: "Headquarters",
    component: () => import("../views/Headquarters.vue"),
    meta: {
      //RUTA PRIVADA - SÓLO ADMIN
      allowAnonymous: false,
      allowNoAdmin: false,
    },
  },
  {
    path: "/headquarters/new",
    name: "NewHeadquarter",
    component: () => import("../views/NewHeadquarter.vue"),
    meta: {
      //RUTA PRIVADA - SÓLO ADMIN
      allowAnonymous: false,
      allowNoAdmin: false,
    },
  },
  {
    path: "/assignments",
    name: "Assignments",
    component: () => import("../views/Assignments.vue"),
    meta: {
      //RUTA PRIVADA - SÓLO ADMIN
      allowAnonymous: false,
      allowNoAdmin: false,
    },
  },
  {
    path: "/assignments/new",
    name: "NewAssignments",
    component: () => import("../views/NewAssignments.vue"),
    meta: {
      //RUTA PRIVADA - SÓLO ADMIN
      allowAnonymous: false,
      allowNoAdmin: false,
    },
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    component: () => import("../views/Maintenance.vue"),
    meta: {
      //RUTA PRIVADA - SÓLO ADMIN
      allowAnonymous: false,
      allowNoAdmin: false,
    },
    beforeEnter: (to, from, next) => {
      if (to.meta.allowNoAdmin === false && !checkAdmin()) {
        next({
          path: "/productos",
          query: { redirect: to.fullPath },
        });
        Swal.fire({
          //MOSTRAR MENSAJE CON LA INFORMACIÓN
          icon: "success",
          title: `Lo sentimos,no tienes permisos para acceder a esta página`,
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        next();
      }
    },
  },
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error.vue"),
    meta: {
      //RUTA PÚBLICA

      allowAnonymous: true,
    },
  },
];

const router = new VueRouter({
  routes,
});

// COMPROBANDO CADA PÁGINA POR SI LA PERSONA ESTÁ LOGUEADA

router.beforeEach((to, from, next) => {
  // SI LA RUTA ES PRIVADA Y LA PERSONA NO TIENE TOKEN
  if (!to.meta.allowAnonymous && !isLoggedIn()) {
    next({
      path: "/",
      query: { redirect: to.fullPath },
    });
    Swal.fire({
      //MOSTRAR MENSAJE CON LA INFORMACIÓN
      icon: "success",
      title: `Lo sentimos,no tienes permiso para acceder a esta página`,
      showConfirmButton: false,
      timer: 2000,
    });
  } else {
    next();
  }
});

export default router;
