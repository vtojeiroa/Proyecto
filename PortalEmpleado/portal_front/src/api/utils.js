"use strict";

import axios from "axios";
import jwt from "jwt-decode";
//IMPORTO SWAL
import Swal from "sweetalert2";

const moment = require("moment");

const ENDPOINT = "http://localhost:3000";

const AUTH_TOKEN_KEY = "authToken";

const ID = "id";

const ROLE = "role";

const ISADMIN = "role";

const NAME = "name";

const EMAIL = "email";

const HEADQUARTER = "headquarter";

//FUNCION DE LOGIN

export function loginUser(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      let res = await axios({
        url: `${ENDPOINT}/users/login`, //URL DE LA AUTENTICACIÓN
        method: "POST", // MÉTODO DE LA AUTENTICACIÓN
        data: {
          email: email, //EMAIL
          password: password, //CONTRASEÑA
          /*  grant_type: "password", */
        }, //DATOS DE LA AUTENTICACIÓN
      });
      setAuthToken(res.data.data.token);
      setId(res.data.id);
      setName(res.data.name);
      setRole(res.data.role);
      setHeadquarter(res.data.headquarter);
      setEmail(res.data.email);
      setIsAdmin(res.data.role);
      resolve();
    } catch (error) {
      /*    console.log("Error en login:", err);
      reject(err); */
      if (error.response.status) {
        Swal.fire({
          icon: "error",
          title: error.response.data.message,
          showConfirmButton: false,
          timer: 2500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: `Error:${error}`,
          showConfirmButton: false,
          timer: 2500,
        });
      }
    }
  });
}

//GUARDAR TOKEN EN LOCALSTORAGE

export function setAuthToken(token) {
  axios.defaults.headers.common["authorization"] = `Bearer ${token}`;
  //GUARDO EL TOKEN EN LOCALSTORAGE
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

//GUARDAR EL ID EN EL LOCAL STORAGE
export function setId(id) {
  localStorage.setItem(ID, id);
}
//GUARDAR EL ROL EN EL LOCAL STORAGE

export function setRole(role) {
  localStorage.setItem(ROLE, role);
}
//GUARDAR EL NOMBRE EN EL LOCAL STORAGE

export function setName(name) {
  localStorage.setItem(NAME, name);
}
//GUARDAR EL EMAIL EN EL LOCAL STORAGE
export function setEmail(email) {
  localStorage.setItem(EMAIL, email);
}
//GUARDAR LA SEDE EN EL LOCAL STORAGE
export function setHeadquarter(headquarter) {
  localStorage.setItem(HEADQUARTER, headquarter);
}
// LOGOUT -  DESCONECTAR USUARIO

export function logOut() {
  axios.defaults.headers.common["authorization"] = ``;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  clearRole();
  clearName();
  clearEmail();
  clearId();
  clearHeadquarter();
}

//COGER EL TOKEN DEL LOCALSTORAGE
export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

//CONSIGUIENDO LA FECHA DE EXPIRACIÓN DEL TOKEN
export function getTokenExpirationDate(encodedToken) {
  let token = jwt(encodedToken);
  //SI NO HAY FECHA, NO SIGUE
  if (!token.exp) {
    return null;
  }
  let date = new Date(0);
  date.setUTCSeconds(token.exp);
  return date;
}

// COMPROBANDO SI LA FECHA SIGUE VIGENTE O NO
export function isTokenExpired(token) {
  let expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}

// COMPROBAR SI EL USUARIO ESTA LOGUEADO O NO
export function isLoggedIn() {
  let authToken = getAuthToken();
  return !!authToken && !isTokenExpired(authToken);
}

// FUNCIONES PARA COMPROBAR EL ROL DE USER -----------------------------

//BORRAR TOKEN DEL USER EN EL LOCAL STORAGE

export function clearToken() {
  return localStorage.removeItem(AUTH_TOKEN_KEY);
}

//BORRAR ROL DEL USER EN EL LOCAL STORAGE

export function clearRole() {
  return localStorage.removeItem(ROLE);
}
//BORRAR NOMBRE DEL USER EN EL LOCAL STORAGE

export function clearName() {
  return localStorage.removeItem(NAME);
}
//BORRAR EMAIL DEL USER EN EL LOCAL STORAGE

export function clearEmail() {
  return localStorage.removeItem(EMAIL);
}
//BORRAR ID DEL USER EN EL LOCAL STORAGE

export function clearId() {
  return localStorage.removeItem(ID);
}
//BORRAR LA SEDE DEL USER EN EL LOCAL STORAGE

export function clearHeadquarter() {
  return localStorage.removeItem(HEADQUARTER);
}

// RECUPERAR EL ROL QUE HE GUARDADO EN LOCAL STORAGE

export function getIsAdmin() {
  return localStorage.getItem(ROLE);
}

// RECUPERAR EL NOMBRE DEL USUARIO QUE HE GUARDADO EN LOCAL STORAGE

export function getName() {
  return localStorage.getItem(NAME);
}
// RECUPERAR EL EMAIL DEL USUARIO QUE HE GUARDADO EN LOCAL STORAGE

export function getEmail() {
  return localStorage.getItem(EMAIL);
}

//GUARDAR SI ES ADMIN EN EL LOCAL STORAGE

export function setIsAdmin(isAdmin) {
  localStorage.setItem(ISADMIN, isAdmin);
}
// COMPROBAR ROL

export function checkAdmin() {
  let role = false;
  let isAdmin = getIsAdmin();
  if (isAdmin === "true") {
    role = true;
  } else {
    role = false;
  }
  return role;
}

// Format a date to DB
function formatDateToFront(date) {
  return format(date, "dd-MM-yyyy");
}
