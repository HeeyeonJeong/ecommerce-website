//load detail goods
export function loadDetail(shoesBox) {
  let url = location.search;
  let params = url.substring(url.indexOf("?") + 1, url.length);

  const detailGoods = shoesBox.find((shoes) => {
    return shoes.id === parseInt(params);
  });

  console.log(detailGoods);
}
