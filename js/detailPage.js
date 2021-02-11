import { totalCartCount, saveCart, saveCartGoods } from "./cartPage.js";
import { saveWishGoods, saveWish } from "./wishList.js";

const detailImage = document.querySelector(".detail-photo");
const detailTitle = document.querySelector(".detail-name");
const detialPrice = document.querySelector(".detail-price");
const detialWishBtn = document.querySelector(".detail-wish");
const detialCartBtn = document.querySelector(".detail-cart");
const detialBtnBox = document.querySelector(".detail-info-control");

//load detail goods
export function loadDetail(shoesBox) {
  let url = location.search;
  let params = url.substring(url.indexOf("?") + 1, url.length);

  const detailGoods = shoesBox.find((shoes) => {
    return shoes.id === parseInt(params);
  });

  paintDetail(detailGoods);
  detailSelectGoods(detailGoods);
}

function paintDetail(detailGoods) {
  if (detailGoods) {
    detailImage.src = detailGoods.image;
    detailTitle.innerHTML = detailGoods.productName;
    detialPrice.innerHTML = detailGoods.price.toLocaleString();
  }
}

function detailSelectGoods(detailGoods) {
  detialBtnBox &&
    detialBtnBox.addEventListener("click", (e) => {
      const targetBtn = e.target;
      if (targetBtn === detialWishBtn) {
        if (detailGoods.wish) {
          alert("위시리스트에 있는 상품입니다.");
        } else {
          detailGoods.wish = true;
          alert("위시리스트에 담았습니다.");
          saveWishGoods.push(detailGoods);
          saveWish(saveWishGoods);
        }
      } else if (targetBtn === detialCartBtn) {
        if (detailGoods.cart) {
          alert("장바구니에 있는 상품입니다.");
        } else {
          detailGoods.cart = true;
          detailGoods.order += 1;
          alert("장바구니에 담았습니다.");
          saveCartGoods.push(detailGoods);
          saveCart(saveCartGoods);
          totalCartCount();
        }
      }
    });
}
