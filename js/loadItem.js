const itemContainer = document.querySelector(".goods-container");
const wishContainer = document.querySelector(".wish-container");
const wishEmpty = document.querySelector(".empty");
const cartContainer = document.querySelector(".cart-container");

//wish-storage
let saveWishGoods = localStorage.getItem("wishList")
  ? JSON.parse(localStorage.getItem("wishList"))
  : [];

//JSON fetch
async function loadItems() {
  const response = await fetch("./data/data.json");
  const json = await response.json();
  //localStrage에 wishgoods가 존재하는 경우
  if (saveWishGoods) {
    for (let i = 0; i < json.shoesBox.length; i++) {
      saveWishGoods.forEach((goods) => {
        if (goods.id === json.shoesBox[i].id) {
          json.shoesBox[i].wish = true;
        }
      });
    }
  }
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
  loadCart(shoesBox);
}

//list HTML
function createHTML(shoes) {
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
              <span class="card-price">${shoes.price}</span>
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

//save wish
function saveWish(saveWishGoods) {
  localStorage.setItem("wishList", JSON.stringify(saveWishGoods));
}

// paint wish list
function paintWishPage(shoesBox) {
  const loadWishGoods = localStorage.getItem("wishList");
  if (wishContainer !== null) {
    wishContainer.innerHTML = JSON.parse(loadWishGoods)
      .map((shoes) => createHTML(shoes))
      .join("");
    if (wishContainer.children.length !== 0) {
      wishEmpty.classList.add("hidden");
    }
  }
  loadWish(shoesBox);
}

//delete wish list
function deletWishPage(cleanWish) {
  if (wishContainer !== null) {
    wishContainer.removeChild(wishContainer.children[cleanWish]);
  }
  if (wishContainer.children.length === 0) {
    wishEmpty.classList.remove("hidden");
  }
}

//wish goods
function loadWish(shoesBox) {
  const likebtns = document.querySelectorAll(".like-icon");
  likebtns.forEach((likebtn) => {
    likebtn.addEventListener("click", (e) => {
      const goodsBtn = e.target.parentNode;
      if (goodsBtn) {
        shoesBox.find((shoes) => {
          if (shoes.id === parseInt(goodsBtn.dataset.id)) {
            if (shoes.wish) {
              const cleanWish = saveWishGoods.findIndex((item) => {
                return item.id === parseInt(goodsBtn.dataset.id);
              });
              saveWishGoods.splice(cleanWish, 1);
              shoes.wish = false;
              goodsBtn.innerHTML = `<i class='bx bx-heart'></i>`;
              deletWishPage(cleanWish);
              return saveWishGoods;
            } else {
              shoes.wish = true;
              goodsBtn.innerHTML = `<i class='bx bxs-heart' style='color:#d64040'></i>`;
              return saveWishGoods.push(shoes);
            }
          }
        });
      }
      saveWish(saveWishGoods);
    });
  });
}

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

//save cart
function saveCart(saveCartGoods) {
  localStorage.setItem("cartList", JSON.stringify(saveCartGoods));
}

// paint wish list
function paintCartPage() {
  const loadCartGoods = localStorage.getItem("cartList");
  console.log(loadCartGoods);
  if (cartContainer !== null) {
    cartContainer.innerHTML = JSON.parse(loadCartGoods)
      .map((shoes) => cartCreateHTML(shoes))
      .join("");
  }
}

//cart-storage
let saveCartGoods = localStorage.getItem("cartList")
  ? JSON.parse(localStorage.getItem("cartList"))
  : [];

//cart goods
function loadCart(shoesBox) {
  const cartbtns = document.querySelectorAll(".cart-icon");
  cartbtns.forEach((cartbtn) => {
    cartbtn.addEventListener("click", (e) => {
      const goodsCart = e.target.parentNode;
      if (goodsCart) {
        shoesBox.find((shoes) => {
          if (shoes.id === parseInt(goodsCart.dataset.id)) {
            if (shoes.cart) {
              //이미 장바구니에 들어가있는 경우
              //수정사항: landing페이지에서 cart 재클릭 금지,
              //재클릭시 - alert창 '이미 장바구니에 들어가있는 상품입니다.'
              //cart-page에서만 삭제가능
            } else {
              //장바구니 추가
              shoes.cart = true;
              return saveCartGoods.push(shoes);
            }
          }
        });
      }
      saveCart(saveCartGoods);
    });
  });
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
}

//main
loadItems().then((shoesBox) => {
  displayItems(shoesBox);
  selectHandler(shoesBox);
  paintWishPage(shoesBox);
  paintCartPage();
});
