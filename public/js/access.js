// Elements
const $showHideIcon = document.querySelector("#show-hide");
const $showHideConfirmIcon = document.querySelector("#show-hide-confirm");
const $passwordInput = document.querySelector("#password-input");
const $confirmPasswordInput = document.querySelector("#confirm-password-input");

// Toggle the visibility of the password in the input
const showHideToggle = (id) => {
  const input = id === "confirm-pass" ? $confirmPasswordInput : $passwordInput;
  const icon = id === "confirm-pass" ? $showHideConfirmIcon : $showHideIcon;
  if (input.type === "password") {
    input.type = "text";
    icon.src = "./img/show-pass-icon.svg";
  } else {
    input.type = "password";
    icon.src = "./img/hide-pass-icon.svg";
  }
};
