const $body = document.querySelector("body");
const $menuBtn = document.querySelector(".menu-btn");
const $menu = document.querySelector(".splash");
const $menuUl = document.querySelector("ul");
const $navBar = document.querySelector("nav");
const $main = document.querySelector("main");

let menuOpen = false;
$menuBtn.addEventListener("click", () => {
  // if (!menuOpen) {
  //   // $menuBtn.classList.add("open");
  //   $menuUl.style.display = "flex";
  // } else {
  //   // $menuBtn.classList.remove("open");
  //   $menuUl.style.display = "none";
  // }
  $menuUl.style.hidden = !menuOpen;
  $navBar.classList.toggle("nav--open");
  $body.classList.toggle("disable-scroll");
  $menuBtn.classList.toggle("open");
  // $menuUl.hidden = !menuOpen;
  menuOpen = !menuOpen;
});
