import { loadCart } from "./cartPage.js";
import { createHTML } from "./loadItem.js";

const wishContainer = document.querySelector(".wish-container");
const wishEmpty = document.querySelector(".empty");

//wish-storage
export let saveWishGoods = localStorage.getItem("wishList")
  ? JSON.parse(localStorage.getItem("wishList"))
  : [];

//save wish
export function saveWish(saveWishGoods) {
  localStorage.setItem("wishList", JSON.stringify(saveWishGoods));
}

// wish-page paint
export function paintWishPage(shoesBox) {
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
  loadCart(shoesBox);
}

//delete wish list
function deletWish(cleanWish) {
  if (wishContainer !== null) {
    wishContainer.removeChild(wishContainer.children[cleanWish]);
    if (wishContainer.children.length === 0) {
      wishEmpty.classList.remove("hidden");
    }
  }
}

//wish goods
export function loadWish(shoesBox) {
  const likebtns = document.querySelectorAll(".like-icon");
  likebtns.forEach((likebtn) => {
    likebtn.addEventListener("click", (e) => {
      const goodsBtn = e.target.parentNode;
      goodsBtn &&
        shoesBox.find((shoes) => {
          if (shoes.id === parseInt(goodsBtn.dataset.id)) {
            if (shoes.wish) {
              const cleanWish = saveWishGoods.findIndex((item) => {
                return item.id === parseInt(goodsBtn.dataset.id);
              });
              saveWishGoods.splice(cleanWish, 1);
              shoes.wish = false;
              goodsBtn.innerHTML = `<i class='bx bx-heart'></i>`;
              console.log("위시리스트 지움");
              deletWish(cleanWish);
              return saveWishGoods;
            } else {
              shoes.wish = true;
              console.log("위시리스트 추가");
              goodsBtn.innerHTML = `<i class='bx bxs-heart' style='color:#d64040'></i>`;
              return saveWishGoods.push(shoes);
            }
          }
        });
      saveWish(saveWishGoods);
    });
  });
}
