// $main already defined in js/nav.js
const $textElem = document.querySelector("main h1");

const handleCopy = () => {
  const textToCopy = "info.watermatters@gmail.com";
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert(`${textToCopy} successfully copied`);
  });

  $textElem.classList.add("copied");
};
