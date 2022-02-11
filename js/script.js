"use strict";

const elLogoutBtn = document.querySelector(".logout");
const localToken = window.localStorage.getItem("token");

if (!localToken) {
  window.location.replace("login.html");
}

elLogoutBtn.addEventListener("click", function () {
  window.localStorage.removeItem("token");

  window.location.replace("login.html");
});
