const slideOpenBtn = document.querySelector(".top-nav-modal");
const slideCloseBtn = document.querySelector(".category-close");
const slideMenu = document.querySelector(".top-nav-category");

//slide sidebar menu
function slideMenuHandler(e) {
  const target = e.target;
  const activetarget = e.currentTarget.document.activeElement;
  if (activetarget === slideOpenBtn) {
    slideMenu.classList.add("open");
  } else if (activetarget === slideCloseBtn || target !== slideMenu) {
    slideMenu.classList.remove("open");
  }
}

window.addEventListener("click", slideMenuHandler);
