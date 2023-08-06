import { fetchData } from "./apiCall.js";
import { appendItemsToList } from "./renderListItems.js";
import { renderPaginationBtns } from "./pagination.js";

let currentPage = 1;
localStorage.setItem("shopingCart", JSON.stringify([]));

document.addEventListener("DOMContentLoaded", () => {
  fetchData(currentPage).then((data) => {
    localStorage.setItem("currentStoreItems", JSON.stringify(data.products));
    appendItemsToList(data.products);
  });
  renderPaginationBtns();
});
