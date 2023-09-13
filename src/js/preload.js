const { ipcRenderer, remote } = require("electron");
const DarkReader = require("darkreader");

const { setOSTheme } = require("./preload-theme");

const currentWindow = remote.getCurrentWindow();

if (!window.chrome) {
  window.chrome = {};
}

/* Title reply and request */
window.addEventListener("DOMContentLoaded", () => {
  const titleBar = document.getElementById("titlebar");

  // Receive title from child preload view
  ipcRenderer.on("title-reply", function (_, title) {
    titleBar.innerHTML = title;
    document.title = title;
  });

  ipcRenderer.send("title-request");
});

/* Theme reply and request */
window.addEventListener("DOMContentLoaded", () => {
  ipcRenderer.on("theme-reply", function (_, toThemeStyle) {
    setOSTheme(toThemeStyle);
  });

  ipcRenderer.send("theme-request", currentWindow.webContents.id);
});


window.addEventListener("DOMContentLoaded", () => {
  // give header element -webkit-app-region: drag;
  const header = document.querySelector("header");
  header.style["-webkit-app-region"] = "drag";

  // give header's children elemts with role="button" -webkit-app-region: no-drag;
  // and also form elements
  
  const buttons = header.querySelectorAll("[role='button'], button, input, select, textarea");
  buttons.forEach((button) => {
    // if its not .gb_kd.gb_ad or its children
    if (!button.classList.contains("gb_kd") && !button.closest(".gb_kd")) {
    button.style["-webkit-app-region"] = "no-drag";
  });
});