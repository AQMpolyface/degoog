import { state } from "./state.js";
import { MAX_PAGE } from "./constants.js";
import { destroyMediaObserver } from "./media.js";

export function showHome() {
  window.location.href = "/";
}

export function showResults() {
  document.getElementById("main-home").style.display = "none";
  document.getElementById("results-page").style.display = "";
  document.getElementById("header").style.display = "none";
  document.body.classList.add("has-results");
}

export function setActiveTab(type) {
  state.currentType = type;
  document.querySelectorAll(".results-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.type === type);
  });
}
