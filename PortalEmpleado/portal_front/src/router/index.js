"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
  {
    path: "/registry",
    name: "Registry",
    component: () => import("../views/Registry.vue"),
  },
  {
    path: "/userattention",
    name: "UserAttention",
    component: () => import("../views/UserAttention.vue"),
  },
  {
    path: "/passwordrecovery",
    name: "PasswordRecovery",
    component: () => import("../views/PasswordRecovery.vue"),
  },
  {
    path: "/userprofile",
    name: "UserProfile",
    component: () => import("../views/UserProfile.vue"),
  },
  {
    path: "/editemail",
    name: "EditEmail",
    component: () => import("../views/EditEmail.vue"),
  },
  {
    path: "/myreserves",
    name: "MyReserves",
    component: () => import("../views/MyReserves.vue"),
  },
  {
    path: "/myreserves/new",
    name: "NewReserve",
    component: () => import("../views/NewReserve.vue"),
  },
  {
    path: "/myincidences",
    name: "MyIncidences",
    component: () => import("../views/MyIncidences.vue"),
  },
  {
    path: "/myincidences/new",
    name: "NewIncidence",
    component: () => import("../views/NewIncidence.vue"),
  },
  {
    path: "/users",
    name: "Users",
    component: () => import("../views/Users.vue"),
  },
  {
    path: "/services",
    name: "Services",
    component: () => import("../views/Services.vue"),
  },
  {
    path: "/services/new",
    name: "NewService",
    component: () => import("../views/NewService.vue"),
  },
  {
    path: "/headquarters",
    name: "Headquarters",
    component: () => import("../views/Headquarters.vue"),
  },
  {
    path: "/headquarters/new",
    name: "NewHeadquarter",
    component: () => import("../views/NewHeadquarter.vue"),
  },
  {
    path: "/assignments",
    name: "Assignments",
    component: () => import("../views/Assignments.vue"),
  },
  {
    path: "/assignments/new",
    name: "NewAssignments",
    component: () => import("../views/NewAssignments.vue"),
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    component: () => import("../views/Maintenance.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () => import("../views/About.vue"),
  },
  {
    path: "*",
    name: "Error",
    component: () => import("../views/Error.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
