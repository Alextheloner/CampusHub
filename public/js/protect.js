const token = localStorage.getItem("campusHubToken");

if (!token) {
  window.location.href = "/login.html";
}
