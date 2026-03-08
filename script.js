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

    /* ================= CARD ================= */

    container.innerHTML += `

<div onclick="openModal(${issue.id})"
class="card bg-white shadow ${border} p-4">

<div class="flex justify-between items-start">

${statusIcon}

<span class="${priorityColor}">
${issue.priority.toUpperCase()}
</span>

</div>

<h2 class="font-semibold text-sm mt-3">
${issue.title}
</h2>

<p class="text-xs text-gray-500 mt-2">
${issue.description}
</p>

<div class="flex flex-wrap gap-2 mt-3">
${labelsHTML}
</div>

<div class="border-t mt-3 pt-2">

<p class="text-xs text-gray-400">
#${issue.id} by ${issue.author}
</p>

<p class="text-xs text-gray-400">
${new Date(issue.createdAt).toLocaleDateString()}
</p>

</div>

</div>

`;
  });
}


/* ================= ACTIVE TAB ================= */

function setActive(tab) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("tab-active"));

  document.getElementById(tab).classList.add("tab-active");
}

/* ================= FILTER ================= */

function filterStatus(status) {
  setActive(status + "Tab");

  const filtered = allIssues.filter((issue) => issue.status === status);

  displayIssues(filtered);
}

/* ================= SEARCH ================= */

async function searchIssue() {
  const text = document.getElementById("searchInput").value;

  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${text}`,
  );

  const data = await res.json();

  displayIssues(data.data);
}

/* ================= MODAL ================= */

async function openModal(id) {
  const res = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );

  const data = await res.json();

  const issue = data.data;

  document.getElementById("modalContent").innerHTML = `

<h3 class="font-bold text-lg">${issue.title}</h3>

<p class="py-2">${issue.description}</p>

<p><b>Author:</b> ${issue.author}</p>
<p><b>Status:</b> ${issue.status}</p>
<p><b>Priority:</b> ${issue.priority}</p>
<p><b>Labels:</b> ${issue.labels.join(", ")}</p>
<p><b>Created:</b> ${new Date(issue.createdAt).toLocaleDateString()}</p>

`;

  document.getElementById("issueModal").showModal();
}

// done //