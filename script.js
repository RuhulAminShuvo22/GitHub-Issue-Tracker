/* Store all issues */
let allIssues = [];

/* ================= LOGIN ================= */

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    localStorage.setItem("login", "true");
    window.location.href = "index.html";
  } else {
    alert("Invalid Credentials");
  }
}


/* ================= LOAD ISSUES ================= */

async function loadIssues() {
  setActive("allTab");

  document.getElementById("loader").classList.remove("hidden");

  const res = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );

  const data = await res.json();

  allIssues = data.data;

  displayIssues(allIssues);

  document.getElementById("loader").classList.add("hidden");
}

/* Auto load */

if (document.getElementById("issuesContainer")) {
  loadIssues();
}
