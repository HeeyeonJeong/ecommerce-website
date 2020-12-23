const itemContainer = document.querySelector(".goods-container");
const wishContainer = document.querySelector(".wish-container");
const wishEmpty = document.querySelector(".empty");

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
});
