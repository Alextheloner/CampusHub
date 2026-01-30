const API_URL = "/api/announcements";
const container = document.getElementById("announcementsContainer");
const addBtn = document.getElementById("addAnnouncementBtn");

const token = localStorage.getItem("campusHubToken");

//  If no token, go back to login
if (!token) {
  window.location.href = "login.html";
}

// fetch and display announcements
async function loadAnnouncements() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("campusHubToken");
      window.location.href = "login.html";
      return;
    }

    const data = await res.json();
    renderAnnouncements(data);
  } catch (err) {
    console.error("Error loading announcements:", err);
  }
}

// render announcements
function renderAnnouncements(announcements) {
  container.innerHTML = "";

  announcements.reverse().forEach(item => {
    const card = document.createElement("div");
    card.className =
      "flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm";

    card.innerHTML = `
      <div class="mb-2 flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          ${item.title}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          ${new Date(item.createdAt).toDateString()}
        </p>
      </div>
      <p class="mb-4 text-gray-600 dark:text-gray-300">
        ${item.message}
      </p>
    `;

    container.appendChild(card);
  });
}

// add announcement
addBtn.addEventListener("click", async () => {
  const title = prompt("Enter announcement title:");
  const message = prompt("Enter announcement message:");

  if (!title || !message) return alert("All fields required");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ title, message })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.msg || "Failed to add announcement");
      return;
    }

    loadAnnouncements();
  } catch (err) {
    alert("Server error");
  }
});

// 🚀 INIT
loadAnnouncements();
