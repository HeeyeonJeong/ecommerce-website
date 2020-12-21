const itemContainer = document.querySelector(".goods-container");
const wishContainer = document.querySelector(".wish-container");

//JSON fetch
async function loadItems() {
  const response = await fetch("./data/data.json");
  const json = await response.json();
  return json.shoesBox;
}

//list출력
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
              <button type="button" data-id=${shoes.id} class="card-icon like-icon"><i class='bx bx-heart'></i></button>
              <button type="button" data-id=${shoes.id} class="card-icon cart-icon"><i class='bx bx-cart'></i></button>
              <a href="wishlist.html" data-id=${shoes.id} class="card-icon more-icon"><i class='bx bxs-plus-square'></i></a>
          </div>               
      </div>        
    </li>
`;
}

//save wish
function saveWish(wishObj) {
  localStorage.setItem("wishList", JSON.stringify(wishObj));
}

// paint wish list
function paintWishPage() {
  const loadWishGoods = localStorage.getItem("wishList");
  if (wishContainer !== null) {
    wishContainer.innerHTML = JSON.parse(loadWishGoods)
      .map((shoes) => createHTML(shoes))
      .join("");
  }
}

//wish-storage
let wishObj = localStorage.getItem("wishList")
  ? JSON.parse(localStorage.getItem("wishList"))
  : [];

//wish goods
function loadWish(shoesBox) {
  const likebtns = document.querySelectorAll(".like-icon");
  likebtns.forEach((likebtn) => {
    likebtn.addEventListener("click", (e) => {
      const goodsBtn = e.target.parentNode;
      const userWish = shoesBox.find((shoes) => {
        if (shoes.id === parseInt(goodsBtn.dataset.id)) {
          return shoes;
        }
      });
      wishObj.push(userWish);
      saveWish(wishObj);
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
  paintWishPage();
});
