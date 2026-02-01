// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  const data = JSON.parse(localStorage.getItem(key));

  // Ensure cart is always an array
  if (key === "so-cart") {
    return Array.isArray(data) ? data : [];
  }

  return data;
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Function to render a list of items with a template function
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false
) {
  if (clear) {
    parentElement.innerHTML = "";
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Helper to load HTML templates
export async function loadTemplate(path) {
  const res = await fetch(path);
  if (res.ok) {
    const template = await res.text();
    return template;
  }
}

// Helper to render a template into a parent element
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// Main function to load Header and Footer globally
export async function loadHeaderFooter() {
  const path = window.location.pathname;
  const isInSubfolder = path.includes("/src/");
  const basePath = isInSubfolder ? "../../" : "/";

  const headerTemplate = await loadTemplate(`${basePath}partials/header.html`);
  const footerTemplate = await loadTemplate(`${basePath}partials/footer.html`);

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// Add this to the end of utils.mjs
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  
  // Create the alert content with a close button (X)
  alert.innerHTML = `<p>${message}</p><span>X</span>`;
  
  // Add an event listener to the "X" to remove the alert when clicked
  alert.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN") {
      alert.remove();
    }
  });

  const main = document.querySelector("main");
  main.prepend(alert);

  // If scroll is true, scroll to the top of the page
  if (scroll) {
    window.scrollTo(0, 0);
  }
}
