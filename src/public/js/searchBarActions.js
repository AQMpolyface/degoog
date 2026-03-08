import { performSearch } from "./search.js";

const SEARCH_BAR_ACTION_EVENT = "search-bar-action";

function escapeHtml(s) {
  if (typeof s !== "string") return "";
  const div = document.createElement("div");
  div.textContent = s;
  return div.innerHTML;
}

function renderActionButton(action, inputId) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "search-bar-action-btn";
  btn.dataset.actionId = action.id;
  btn.dataset.actionType = action.type;
  btn.dataset.inputId = inputId;
  if (action.type === "navigate" && action.url) btn.dataset.url = action.url;
  if (action.type === "bang" && action.trigger) btn.dataset.trigger = action.trigger;
  if (action.icon) {
    const img = document.createElement("img");
    img.src = escapeHtml(action.icon);
    img.alt = "";
    img.className = "search-bar-action-icon";
    btn.appendChild(img);
  }
  const label = document.createElement("span");
  label.className = "search-bar-action-label";
  label.textContent = action.label;
  btn.appendChild(label);
  return btn;
}

function handleActionClick(e) {
  const btn = e.target.closest(".search-bar-action-btn");
  if (!btn) return;
  const actionId = btn.dataset.actionId;
  const actionType = btn.dataset.actionType;
  const inputId = btn.dataset.inputId;
  const input = document.getElementById(inputId);
  if (actionType === "navigate") {
    const url = btn.dataset.url;
    if (url) window.location.href = url;
    return;
  }
  if (actionType === "bang") {
    const trigger = btn.dataset.trigger;
    if (trigger && input) {
      input.value = `!${trigger} `;
      input.focus();
      const form = input.closest("form");
      if (form && inputId === "results-search-input") {
        performSearch(input.value);
      } else if (form && inputId === "search-input") {
        form.submit();
      }
    }
    return;
  }
  if (actionType === "custom") {
    window.dispatchEvent(
      new CustomEvent(SEARCH_BAR_ACTION_EVENT, {
        detail: { actionId, inputId, input: input ?? null },
      }),
    );
  }
}

export function initSearchBarActions() {
  const containers = document.querySelectorAll(".search-bar-actions");
  if (!containers.length) return;
  const homeInputId = "search-input";
  const resultsInputId = "results-search-input";
  fetch("/api/search-bar/actions")
    .then((r) => r.json())
    .then((data) => {
      const actions = data.actions ?? [];
      containers.forEach((container) => {
        container.innerHTML = "";
        const inputId =
          container.id === "search-bar-actions-results" ? resultsInputId : homeInputId;
        actions.forEach((action) => {
          const btn = renderActionButton(action, inputId);
          container.appendChild(btn);
        });
      });
    })
    .catch(() => {});

  document.body.addEventListener("click", handleActionClick);
}
