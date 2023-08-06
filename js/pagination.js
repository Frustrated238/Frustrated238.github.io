import { fetchData } from "./apiCall.js";
import { appendItemsToList } from "./renderListItems.js";
let currentPage = 1;
let totalPages = 20;
export function renderPaginationBtns() {
  const pagesWrapper = document.querySelector("#pages");
  pagesWrapper.innerHTML = "";

  renderPageButton(1, pagesWrapper);

  if (currentPage > 1) {
    renderDots(pagesWrapper);
  }
  let startPage = Math.max(currentPage - 1, 2);
  let endPage = Math.min(currentPage + 1, totalPages - 1);

  for (let page = startPage; page <= endPage; page++) {
    renderPageButton(page, pagesWrapper);
  }
  if (currentPage < totalPages - 4) {
    renderDots(pagesWrapper);
  }
  renderPageButton(totalPages, pagesWrapper);
}

export function renderPageButton(page, container) {
  const button = document.createElement("button");
  button.classList =
    "border border-black rounded-[100%] w-[39px] h-[39px] flex justify-center items-center text-[18px] font-Inter leading-[18px]";
  button.textContent = page;
  if (button.textContent == currentPage) {
    button.classList.add("bg-black", "text-white");
  } else {
    button.classList.remove("bg-black", "text-white");
  }
  button.addEventListener("click", () => handlePaginationClick(page));
  container.appendChild(button);
}

export function renderDots(container) {
  const dots = document.createElement("span");
  dots.classList =
    "border border-black rounded-[100%] w-[39px] h-[39px] flex justify-center items-center text-[18px] font-Inter leading-[18px]";
  dots.textContent = "...";
  container.appendChild(dots);
}

export function handlePaginationClick(page) {
  const currentButtonValue = page;
  const allButtons = document.querySelectorAll("#pages button");
  const contentList = document.querySelector("#itemList");
  localStorage.setItem("currentPage", currentButtonValue);

  allButtons.forEach((button) => {
    if (button.textContent == currentButtonValue) {
      button.classList.add("bg-black", "text-white");
    } else {
      button.classList.remove("bg-black", "text-white");
    }
  });

  contentList.innerHTML = "";
  fetchData(currentButtonValue).then((data) => {
    localStorage.setItem("currentStoreItems", JSON.stringify(data.products));
    appendItemsToList(data.products);
  });

  currentPage = page;
  renderPaginationBtns(currentPage);
}
