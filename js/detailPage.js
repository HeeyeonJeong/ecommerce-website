//load detail goods
export function loadDetail(shoesBox) {
  let url = location.search;
  let params = url.substring(url.indexOf("?") + 1, url.length);

  const detailGoods = shoesBox.find((shoes) => {
    return shoes.id === parseInt(params);
  });

  paintDetail(detailGoods);
}

const detailImage = document.querySelector(".detail-photo");
const detailTitle = document.querySelector(".detail-name");
const detialPrice = document.querySelector(".detail-price");

function paintDetail(detailGoods) {
  if (detailGoods) {
    detailImage.src = detailGoods.image;
    detailTitle.innerHTML = detailGoods.productName;
    detialPrice.innerHTML = detailGoods.price.toLocaleString();
  }
}

paintDetail();
