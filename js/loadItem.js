import { loadCart, paintCartPage, saveCartGoods } from "./cartPage.js";
import { loadWish, paintWishPage, saveWishGoods } from "./wishList.js";

const itemContainer = document.querySelector(".goods-container");

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
function displayItems(shoesBox) {
  if (itemContainer !== null) {
    itemContainer.innerHTML = shoesBox
      .map((shoes) => createHTML(shoes))
      .join("");
  }
  loadWish(shoesBox);
}

//createHTML - wish
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
              <a href="wishlist.html" data-id=${
                shoes.id
              } class="card-icon more-icon"><i class='bx bxs-plus-square'></i></a>
          </div>               
      </div>        
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
  displayItems(userSelect);
  loadCart(userSelect);
}

//main
loadItems().then((shoesBox) => {
  displayItems(shoesBox);
  selectHandler(shoesBox);
  paintWishPage(shoesBox);
  paintCartPage(shoesBox);
});
