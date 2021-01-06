import { saveCartGoods, saveCart } from "./loadItem.js";

const cartContainer = document.querySelector(".cart-container");

//createHTML - cart
export function cartCreateHTML(shoes) {
  return `
    <li class="cart-goods">
      <div class="goods-thumb">
        <img src="${shoes.image}" alt="${shoes.productName}" />
      </div>
      <div class="cart-info-box">
        <div class="item-info">
          <div class="info-name">${shoes.productName}</div>
          <div class="info-price">${shoes.price}</div>
          <button class="item-remove" type="button" data-id=${shoes.id}>Remove</button>
        </div>
        <div class="item-count">
          <button class="count-minus" type="button">
            <i class="bx bx-minus"></i>
          </button>
          <span class="count">1</span>
          <button class="count-plus" type="button">
            <i class="bx bx-plus"></i>
          </button>
        </div>
      </div>
    </li>`;
}

//delete cart
function deleteCartGoods(e) {
  const cartRemoveBtns = document.querySelectorAll(".item-remove");

  cartRemoveBtns.forEach((cartRemoveBtn) => {
    if (e.target === cartRemoveBtn) {
      const cleanWish = saveCartGoods.findIndex((item) => {
        return item.id === parseInt(cartRemoveBtn.dataset.id);
      });
      //cart-storage에서 삭제
      saveCartGoods.splice(cleanWish, 1);
      //cart-page에서 삭제
      cartContainer.removeChild(cartContainer.children[cleanWish]);
      saveCart(saveCartGoods);
    }
  });
}

function cartListHandler(e) {
  //delete cart
  deleteCartGoods(e);
}

if (cartContainer !== null) {
  cartContainer.addEventListener("click", cartListHandler);
}
