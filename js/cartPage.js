const cartContainer = document.querySelector(".cart-container");
const cartTotalPrice = document.querySelector(".total-price");

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
          <div class="info-name">${shoes.productName}</div>
          <div class="info-price">${shoes.price.toLocaleString()}</div>
          <button class="item-remove" type="button" data-id=${
            shoes.id
          }>Remove</button>
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

//total price
function totalPrice() {
  const priceBox = saveCartGoods.reduce((prev, curr) => {
    return prev + curr.price;
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
  }
  totalPrice();
}

//save cart
function saveCart(saveCartGoods) {
  localStorage.setItem("cartList", JSON.stringify(saveCartGoods));
}

//cart goods
export function loadCart(shoesBox) {
  const cartbtns = document.querySelectorAll(".cart-icon");
  cartbtns.forEach((cartbtn) => {
    cartbtn.addEventListener("click", (e) => {
      const goodsCart = e.target.parentNode;
      if (goodsCart) {
        shoesBox.find((shoes) => {
          if (shoes.id === parseInt(goodsCart.dataset.id)) {
            if (saveCartGoods.some((cart) => cart.id === shoes.id)) {
              console.log("이미 있음");
              alert("장바구니에 있는 상품입니다.");
            } else {
              //장바구니 추가
              shoes.cart = true;
              console.log("장바구니 추가");
              alert("장바구니에 담았습니다.");
              return saveCartGoods.push(shoes);
            }
          }
        });
      }
      saveCart(saveCartGoods);
    });
  });
}

//delete cart
function deleteCart(e) {
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
      totalPrice();
    }
  });
}

//cart-page controller
function cartListHandler(e) {
  //delete cart
  deleteCart(e);
}

if (cartContainer !== null) {
  cartContainer.addEventListener("click", cartListHandler);
}
