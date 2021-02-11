const cartContainer = document.querySelector(".cart-container");
const cartTotalPrice = document.querySelector(".total-price");
const cartBox = document.querySelector(".cart-container-box");
const cartEmpty = document.querySelector(".empty");

//cart-storage
export let saveCartGoods = localStorage.getItem("cartList")
  ? JSON.parse(localStorage.getItem("cartList"))
  : [];

//createHTML - cart
function cartCreateHTML(shoes) {
  return `
    <li class="cart-goods">
      <div class="goods-thumb">
        <img src="${shoes.image}" alt="${shoes.productName}" />
      </div>
      <div class="cart-info-box">
        <div class="item-info">
          <dl>
            <dt class="info-name">${shoes.productName}</dt>
            <dd class="info-price">${shoes.price.toLocaleString()}</dd>
          </dl>
          <button class="item-remove" type="button" data-id=${
            shoes.id
          }>Remove</button>
        </div>
        <div class="item-control">
          <div class="item-count">
            <button class="count-minus" type="button" data-id=${
              shoes.id
            } data-value="minus">
              <i class="bx bx-minus"></i>
            </button>
            <span class="count">${shoes.order}</span>
            <button class="count-plus" type="button"  data-id=${
              shoes.id
            } data-value="plus">
              <i class="bx bx-plus"></i>
            </button>
          </div>
          <strong class="single-total-price">
            ${(shoes.price * shoes.order).toLocaleString()}
          </strong>
        </div>
      </div>
    </li>`;
}

//total price
function totalPrice() {
  const priceBox = saveCartGoods.reduce((prev, curr) => {
    return prev + curr.price * curr.order;
  }, 0);
  if (cartTotalPrice) {
    cartTotalPrice.innerHTML = priceBox.toLocaleString();
  }
}

// cart-page paint
export function paintCartPage() {
  const loadCartGoods = localStorage.getItem("cartList");
  if (cartContainer !== null) {
    cartContainer.innerHTML = JSON.parse(loadCartGoods)
      .map((shoes) => cartCreateHTML(shoes))
      .join("");
    if (cartContainer.children.length !== 0) {
      cartEmpty.classList.add("hidden");
      cartBox.classList.remove("hidden");
    }
  }
  totalPrice();
}

//save cart
export function saveCart(saveCartGoods) {
  localStorage.setItem("cartList", JSON.stringify(saveCartGoods));
}

//cart goods
export function loadCart(shoesBox) {
  const cartbtns = document.querySelectorAll(".cart-icon");
  cartbtns.forEach((cartbtn) => {
    cartbtn.addEventListener("click", (e) => {
      const goodsCart = e.target.parentNode;
      goodsCart &&
        shoesBox.find((shoes) => {
          if (shoes.id === parseInt(goodsCart.dataset.id)) {
            if (saveCartGoods.some((cart) => cart.id === shoes.id)) {
              console.log("이미 있음");
              alert("장바구니에 있는 상품입니다.");
            } else {
              //장바구니 추가
              shoes.cart = true;
              shoes.order += 1;
              console.log("장바구니 추가");
              alert("장바구니에 담았습니다.");
              return saveCartGoods.push(shoes);
            }
          }
        });
      saveCart(saveCartGoods);
      totalCartCount();
    });
  });
}

//delete cart
function deleteCart(e) {
  const cartRemoveBtns = document.querySelectorAll(".item-remove");
  cartRemoveBtns.forEach((cartRemoveBtn) => {
    if (e.target === cartRemoveBtn) {
      const cleanCart = saveCartGoods.findIndex((item) => {
        return item.id === parseInt(cartRemoveBtn.dataset.id);
      });
      //cart-storage에서 삭제
      saveCartGoods.splice(cleanCart, 1);
      //cart-page에서 삭제
      cartContainer.removeChild(cartContainer.children[cleanCart]);
      //변경사항 저장
      saveCart(saveCartGoods);
      totalPrice();
      totalCartCount();
    }
  });
  if (cartContainer.children.length === 0) {
    cartEmpty.classList.remove("hidden");
    cartBox.classList.add("hidden");
  }
}

//single goods price and count
function singleGoodsControl(e, plusMinusBtns) {
  const goodsCount = document.querySelectorAll(".count");
  const singleGoodsPrice = document.querySelectorAll(".single-total-price");

  plusMinusBtns.forEach((plusMinusBtn) => {
    if (e.target.parentNode === plusMinusBtn) {
      const cartdataId = saveCartGoods.findIndex((item) => {
        return item.id === parseInt(plusMinusBtn.dataset.id);
      });
      const pickGoods = saveCartGoods[cartdataId];
      //cart-storage에서 수량 증감
      if (plusMinusBtn.dataset.value === "plus") {
        pickGoods.order++;
      } else {
        pickGoods.order > 1 && pickGoods.order--;
      }
      //cart-page에서 수량 증감
      goodsCount[cartdataId].innerHTML = pickGoods.order;
      //수량에 따른 신발 가격
      singleGoodsPrice[cartdataId].innerHTML = (
        pickGoods.price * pickGoods.order
      ).toLocaleString();
      //변경사항 저장
      saveCart(saveCartGoods);
    }
  });
}

//cart total number of goods
export function totalCartCount() {
  const totalCounts = document.querySelectorAll(".top-cart-count");
  totalCounts.forEach((totalCount) => {
    totalCount.innerHTML = saveCartGoods.length;
    if (saveCartGoods.length === 0) {
      totalCount.innerHTML = "";
    }
  });
}

window.addEventListener("load", totalCartCount);

//cart-page controller
function cartListHandler(e) {
  const plusBtns = document.querySelectorAll(".count-plus");
  const minusBtns = document.querySelectorAll(".count-minus");

  //single goods price and count
  singleGoodsControl(e, plusBtns);
  singleGoodsControl(e, minusBtns);

  deleteCart(e);
  totalPrice();
}

if (cartContainer !== null) {
  cartContainer.addEventListener("click", cartListHandler);
}
