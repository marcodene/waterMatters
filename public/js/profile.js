const statNumbers = document.querySelectorAll(".stat-number");
const $resultText = document.querySelector(".result-text");
const $shadow = document.querySelector(".shadow");
const $shareBtn = document.querySelector("a.share");
const $closeShareBtn = document.querySelector(".close");
// const $body = document.querySelector("body");
const $textToCopy = document.querySelector("#text-to-copy");
const $linkBox = document.querySelector(".link-box");
const $copyImg = document.querySelector(".link-box > img");

const handleShareClick = () => {
  $shadow.style.display = "flex";
  $body.classList.add("disable-scroll");
  window.scrollTo({ top: 0 });
};

const handleCloseShareClick = () => {
  $shadow.style.display = "none";
  $body.classList.remove("disable-scroll");

  $linkBox.classList.remove("copied");
  $textToCopy.style.color = "";
  $copyImg.style.filter = "";
};

const handleCopy = () => {
  const textToCopy = $textToCopy.innerText;
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert(`${textToCopy} successfully copied`);
  });

  $linkBox.classList.add("copied");
  $textToCopy.style.color = "var(--white)";
  $copyImg.style.filter =
    "invert(89%) sepia(84%) saturate(0%) hue-rotate(126deg) brightness(108%) contrast(106%)";
};

if ($resultText) {
  const number = $resultText.innerText.split(" L")[0];
  if (number > 100000) {
    $resultText.style.fontSize = "4rem";
  } else if (number > 1000000) {
    $resultText.style.fontSize = "3rem";
  }
}

if (statNumbers.length != 0) {
  for (item of statNumbers) {
    // const number = parseInt(item.innerText);
    // console.log("number: ", number);

    // if (number > 100000) {
    //   console.log("index: ", number.toString()[3]);
    //   const splittedNumber = number.toString().split(number.toString()[3]);
    //   console.log("splittedNumber: ", splittedNumber);

    //   const newNumber = `${splittedNumber[0]}*10^${splittedNumber[1].length + 1}`;
    //   console.log("newNumber: ", newNumber);

    //   item.innerText = newNumber;
    // }

    item.innerHTML =
      item.innerHTML > 100000
        ? `10<sup>${item.innerText.length - 1}</sup>`
        : item.innerText;
  }
}
