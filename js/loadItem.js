const itemContainer = document.querySelector(".goods-container");

//JSON fetch
function loadItems() {
  return fetch("./data/data.json")
    .then((response) => response.json())
    .then((json) => json.shoesBox);
}

//list출력
function displayItems(shoesBox) {
  itemContainer.innerHTML = shoesBox.map((shoes) => createHTML(shoes)).join("");
}

//list HTML
function createHTML(shoes) {
  return `
    <li class="goods-card">
        <a href="#" class="goods-item-link">
            <div class="card-img-box">
                <img src="${shoes.image}" alt="${shoes.productName}" class="card-img">
            </div>
            <div class="card-info">
                <div class="card-title">
                    <p>${shoes.productName}</p>
                </div>
                <div class="card-precis">
                    <span class="card-price">${shoes.price}</span>
                    <button type="button" class="card-icon"><i class='bx bx-heart'></i></button>
                    <button type="button" class="card-icon"><i class='bx bx-cart'></i></button>
                </div>        
            </div>
        </a>
    </li>
`;
}

//user selected color
function selectHandler(shoesBox) {
  const sortContainer = document.querySelector(".goods-sort");
  sortContainer.addEventListener("change", (e) =>
    selectColorFilter(e, shoesBox)
  );
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
});
