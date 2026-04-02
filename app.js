function togglePass() {
  let pass = document.getElementById("pass");
  pass.type = pass.type === "password" ? "text" : "password";
}

function showModal(msg) {
  let modal = document.getElementById("modal");
  modal.style.display = "flex";
  modal.innerHTML = `<div class="box">${msg}</div>`;
  setTimeout(() => modal.style.display = "none", 2000);
}

// REGISTRO
function register() {
  fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      showModal("Registrado ✔ ahora inicia sesión");
    } else {
      showModal("Usuario ya existe");
    }
  });
}

// LOGIN
function login() {
  fetch("/login", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error === "no registrado") {
      showModal("No estás registrado");
    } else if (data.error === "contraseña incorrecta") {
      showModal("Contraseña incorrecta");
    } else {
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location = "app.html";
    }
  });
}