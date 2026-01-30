const form = document.getElementById("timetable-form");
const courseNameInput = document.getElementById("course-name");
const dayInput = document.getElementById("day-of-week");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");
const locationInput = document.getElementById("location");

const API_URL = "/api/timetable";
const token = localStorage.getItem("campusHubToken");

//  redirect if not logged in
if (!token) {
  alert("Please login again");
  window.location.href = "/login.html";
}

// Load timetable on page load
document.addEventListener("DOMContentLoaded", loadTimetable);

//  Add class
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    courseName: courseNameInput.value,
    day: dayInput.value,
    startTime: startTimeInput.value,
    endTime: endTimeInput.value,
    location: locationInput.value,
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.msg || "Failed to add class");

    form.reset();
    loadTimetable();
  } catch (err) {
    console.error(err);
    alert("Error adding class");
  }
});

//  Fetch all classes
async function loadTimetable() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const classes = await res.json();
    clearTimetable();
    classes.forEach(renderClass);
  } catch (err) {
    console.error(err);
  }
}

//  Clear UI before re-render
function clearTimetable() {
  ["monday", "tuesday", "wednesday", "thursday", "friday"].forEach((day) => {
    const col = document.getElementById(`day-${day}`);
    if (col) col.innerHTML = "";
  });
}

//  Render class card
function renderClass(item) {
  const dayColumn = document.getElementById(
    `day-${item.day.toLowerCase()}`
  );

  if (!dayColumn) return;

  const div = document.createElement("div");
  div.className =
    "rounded-lg border border-green-200 bg-green-100 p-3 text-sm text-green-800 shadow-sm dark:border-green-900 dark:bg-green-950 dark:text-green-200";

  div.innerHTML = `
    <div class="flex items-start justify-between">
      <h3 class="font-bold">${item.courseName}</h3>
      <div class="flex gap-1">
        <button onclick="deleteClass('${item._id}')" class="text-green-600">
          <span class="material-symbols-outlined text-base">delete</span>
        </button>
      </div>
    </div>
    <p class="text-xs">${item.startTime} - ${item.endTime}</p>
    <p class="mt-1 text-xs">${item.location || ""}</p>
  `;

  dayColumn.appendChild(div);
}

//  Delete class
async function deleteClass(id) {
  if (!confirm("Delete this class?")) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    loadTimetable();
  } catch (err) {
    console.error(err);
    alert("Failed to delete");
  }
}

//  Download timetable as PDF
const downloadBtn = document.getElementById("download-pdf-btn");

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const timetable = document.getElementById("timetable-area");

    // temporarily expand for PDF
    timetable.classList.add("pdf-mode");

    const opt = {
      margin: 0.2,
      filename: "CampusHub_Timetable.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 3,
        useCORS: true,
        scrollY: 0
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "landscape"
      }
    };

    html2pdf()
      .set(opt)
      .from(timetable)
      .save()
      .then(() => {
        // return to normal view
        timetable.classList.remove("pdf-mode");
      });
  });
}
