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

/* ================= DISPLAY CARDS ================= */

function displayIssues(issues) {
  const container = document.getElementById("issuesContainer");

  container.innerHTML = "";

  issues.forEach((issue) => {
    /* Priority color */

    let priorityColor = "badge-low";

    if (issue.priority === "medium") priorityColor = "badge-medium";

    if (issue.priority === "high") priorityColor = "badge-high";

    /* Top border color */

    const border =
      issue.status === "open"
        ? "border-t-4 border-green-500"
        : "border-t-4 border-purple-500";

    /* ================= STATUS ICON ================= */

    let statusIcon = "";

    if (issue.status === "open") {
      statusIcon = `

<div class="w-8 h-8 bg-green-100 flex items-center justify-center rounded-full">

<img src="assets/Open-Status.png" class="w-4">

</div>

`;
    } else {
      statusIcon = `

<div class="w-8 h-8 bg-purple-100 flex items-center justify-center rounded-full">

<img src="assets/Closed- Status .png" class="w-4">

</div>

`;
    }

    /* ================= LABELS ================= */

    let labelsHTML = "";

    if (issue.labels) {
      labelsHTML = issue.labels
        .map((label) => {
          if (label.toLowerCase() === "bug") {
            return `<span class="label-bug">🐞 BUG</span>`;
          }

          if (label.toLowerCase() === "help wanted") {
            return `<span class="label-help">🟡 HELP WANTED</span>`;
          }

          if (label.toLowerCase() === "enhancement") {
            return `<span class="label-enhancement">✨ ENHANCEMENT</span>`;
          }

          return `<span class="badge badge-outline">${label}</span>`;
        })
        .join("");
    }
