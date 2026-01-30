// dark theme toggle
document.addEventListener("DOMContentLoaded", function () {
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const lightIcon = document.getElementById("theme-toggle-light-icon");
  const darkIcon = document.getElementById("theme-toggle-dark-icon");

  function updateIcons() {
    if (html.classList.contains("dark")) {
      darkIcon.style.display = "flex";
      darkIcon.textContent = "dark_mode";
      lightIcon.style.display = "none";
    } else {
      lightIcon.textContent = "light_mode";
      lightIcon.style.display = "flex";
      darkIcon.style.display = "none";
    }
  }

  function getPreferredTheme() {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // Set the initial theme
  const preferredTheme = getPreferredTheme();
  if (preferredTheme === "dark") {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }
  updateIcons();

  themeToggle.addEventListener("click", function () {
    html.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light"
    );
    updateIcons();
  });
});

// Signup button redirect
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.onclick = function () {
    window.location.href = "/signup.html"; // or './signup.html' depending on your folder
  };
}
// Login button redirect
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.onclick = function () {
    window.location.href = "/login.html"; // or './login.html'
  };
}

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("campusHubToken");
    window.location.href = "/login.html";
  });