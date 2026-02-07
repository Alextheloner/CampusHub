const API = "http://localhost:5000/api/resources";
const token = localStorage.getItem("campusHubToken");

if (!token) {
  window.location.href = "login.html";
}

/* ===== UPLOAD RESOURCE ===== */
const form = document.getElementById("resourceForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("pdfFile").files[0];
  const title = document.getElementById("title").value;

  if (!file) return alert("Please select a file");

  const formData = new FormData();
  formData.append("file", file);     // must match multer field name
  formData.append("title", title);

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: token
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) return alert(data.msg || "Upload failed");

    alert("Upload successful ✅");
    form.reset();
    fetchResources();

  } catch (err) {
    alert("Server error");
  }
});


/* ===== FETCH ALL RESOURCES ===== */
async function fetchResources() {
  try {
    const res = await fetch(API, {
      headers: {
        Authorization: campusHubToken
      }
    });

    const data = await res.json();

    displayResources(data);

  } catch (err) {
    console.log(err);
  }
}


/* ===== DISPLAY RESOURCES ===== */
function displayResources(resources) {
  const container = document.getElementById("resourcesList");
  container.innerHTML = "";

  resources.forEach(r => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${r.title}</strong></p>
      <a href="http://localhost:5000/${r.fileurl}" target="_blank">Download</a>
      <hr/>
    `;
    container.appendChild(div);
  });
}

fetchResources();

/* ===== TOGGLE UPLOAD FORM ===== */  ;

const showBtn = document.getElementById("showUploadForm");
const uploadForm = document.getElementById("uploadForm");

showBtn.addEventListener("click", () => {
  uploadForm.classList.toggle("hidden");
});

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", document.getElementById("resourceTitle").value);
  formData.append(
    "description",
    document.getElementById("resourceDescription").value
  );
  formData.append(
    "file",
    document.getElementById("resourceFile").files[0]
  );

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${campusHubToken}`
      },
      body: formData
    });

    if (!res.ok) {
      alert("Upload failed");
      return;
    }

    alert("Resource uploaded successfully");
    window.location.reload();
  } catch (err) {
    alert("Server error");
  }
});
