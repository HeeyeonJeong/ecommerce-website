import {
  totalCartCount,
  loadCart,
  paintCartPage,
  saveCartGoods,
} from "./cartPage.js";
import { loadWish, paintWishPage, saveWishGoods } from "./wishList.js";
import { loadDetail } from "./detailPage.js";

//header, footer markup data include
async function asyncMarkupData() {
  const allElements = document.getElementsByTagName("*");
  Array.prototype.forEach.call(allElements, function (el) {
    const includePath = el.dataset.includePath;
    if (includePath) {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          el.outerHTML = this.responseText;
        }
      };
      xhttp.open("GET", includePath, true);
      xhttp.send();
    }
  });
}

//localStrage에 wish/cart goods가 존재하는지 체크
function storageCheck(json, saveGoods, mode) {
  if (saveGoods) {
    for (let i = 0; i < json.shoesBox.length; i++) {
      saveGoods.forEach((goods) => {
        if (goods.id === json.shoesBox[i].id) {
          json.shoesBox[i][mode] = true;
        }
      });
    }
  }
}

//JSON fetch
async function loadItems() {
  const response = await fetch("./data/data.json");
  const json = await response.json();
  storageCheck(json, saveWishGoods, "wish");
  storageCheck(json, saveCartGoods, "cart");
  return json.shoesBox;
}

//list 출력
function displayItems(shoesBox, currentPageNum) {
  const itemContainer = document.querySelector(".goods-container");
  const pageBtns = document.querySelectorAll(".page-btn");

  //data slice
  let dataPerPage = 6;
  let startIndexItem = currentPageNum - 1;

  let pageShowBox = shoesBox.slice(
    dataPerPage * startIndexItem,
    dataPerPage * currentPageNum
  );

  //data print
  if (itemContainer !== null) {
    itemContainer.innerHTML = pageShowBox
      .map((shoes) => createHTML(shoes))
      .join("");
  }

  //pageBtn active
  pageBtns.forEach((pageBtn) => {
    const pageNum = parseInt(pageBtn.innerHTML);
    if (pageNum === currentPageNum) {
      pageBtn.classList.add("active");
    } else {
      pageBtn.classList.remove("active");
    }
  });
}

//createHTML
export function createHTML(shoes) {
  return `
    <li class="goods-card">
      <div class="card-img-box">
          <img src="${shoes.image}" alt="${shoes.productName}" class="card-img">
      </div>
      <div class="card-info">
          <div class="card-title">
              <p>${shoes.productName}</p>
          </div>
          <div class="card-precis">
              <span class="card-price">${shoes.price.toLocaleString()}</span>
              <button type="button" data-id=${
                shoes.id
              } class="card-icon like-icon">${
    shoes.wish
      ? `<i class='bx bxs-heart' style='color:#d64040'></i>`
      : `<i class='bx bx-heart'></i>`
  }</button>
              <button type="button" data-id=${
                shoes.id
              } class="card-icon cart-icon"><i class='bx bx-cart'></i></button>
              <a href=detail.html?${
                shoes.id
              } class="card-icon more-icon"><i class='bx bxs-plus-square'></i></a>
          </div>               
      </div>        
    </li>
`;
}

//pagination paint
function pagination(shoesBox) {
  const pageContainer = document.querySelector(".goods-pagination");

  let pageArray = [];
  let totalCount = shoesBox.length;
  let totalPage = Math.ceil(totalCount / 6);
  let currentPage = 1;

  for (let i = 1; i <= totalPage; i++) {
    pageArray.push(i);
  }

  if (pageContainer !== null) {
    pageContainer.innerHTML = pageArray
      .map((num) => paginationHTML(num))
      .join("");
  }

  function pageData(e) {
    if (e.target.tagName === "BUTTON") {
      let currentPage = parseInt(e.target.innerHTML);

      displayItems(shoesBox, currentPage);

      loadCart(shoesBox);
      loadWish(shoesBox);
    }
  }

  pageContainer && pageContainer.addEventListener("click", pageData);

  displayItems(shoesBox, currentPage);
}

//pagination - html
function paginationHTML(num) {
  return `
  <li class="page-list">
    <button type="button" class="page-btn">${num}</button>
  </li>
  `;
}

//user selected color
function selectHandler(shoesBox) {
  const sortContainer = document.querySelector(".goods-sort");
  if (sortContainer !== null) {
    sortContainer.addEventListener("change", (e) =>
      selectColorFilter(e, shoesBox)
    );
  }
}

//color filtering
function selectColorFilter(e, shoesBox) {
  const choiceSortBox = e.target;
  const userChoiceColor =
    choiceSortBox.options[choiceSortBox.selectedIndex].dataset;
  const userSelect = shoesBox.filter(
    (shoes) => shoes[userChoiceColor.key] === userChoiceColor.value
  );
  pagination(userSelect);
  loadCart(userSelect);
  loadWish(userSelect);
}

//main
asyncMarkupData()
  .then(() => {
    return loadItems();
  })
  .then((shoesBox) => {
    totalCartCount();
    pagination(shoesBox);
    loadDetail(shoesBox);
    selectHandler(shoesBox);
    paintWishPage(shoesBox);
    paintCartPage(shoesBox);
  });
