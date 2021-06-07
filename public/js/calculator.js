var template = document.querySelector("#template-esempio").innerHTML;
const main = document.querySelector(".main");
const foodBoxes = document.querySelectorAll(".meal-box");
const $breakfastBox = document.querySelector(".breakfast");
const breakfast_button = document.querySelector(".meal-button.breakfast");
const lunch_button = document.querySelector(".meal button.lunch");
const dinner_button = document.querySelector(".meal button.dinner");
const meals = document.querySelectorAll(".meal");
const $loadingItem = document.querySelector("#loading");
const $calculateLoading = document.querySelector(".calculate-loading");

const loadFood = async (meal) => {
  const $mealBox = document.querySelector(`.${meal}`);
  try {
    const response = await axios.get(
      `http://localhost:3000/api/foods/${meal === "breakfast" ? meal : "lunch"}`
    );
    var foods = response.data;

    if (foods.length === 0) {
      return ($loadingItem.innerText = "No food found!");
    }

    $loadingItem.style.display = "none";
    for (let food of foods) {
      if (meal === "dinner") {
        food.meal = "dinner";
      }

      const imgNameFormatted = encodeURI(food.name);
      food = { ...food, img: `/img/foods/${imgNameFormatted}.png` };
      var html = Mustache.render(template, food);

      $mealBox.insertAdjacentHTML("beforeend", html);
    }
  } catch (e) {
    $loadingItem.style.display = "block";
    $loadingItem.innerText = "An error occurred. Please try again!";
  }
};

loadFood("breakfast");
loadFood("lunch");
loadFood("dinner");
$breakfastBox.style.display = "grid";

const changeBackground = (itemIndex) => {
  for (item of meals) {
    item.style.backgroundColor = "var(--white)";
  }

  meals[itemIndex].style.backgroundColor = "var(--color3)";
};

const changeFoods = async (meal) => {
  // const foodItems = document.querySelectorAll(".food-box");
  // for (let food of foodItems) {
  //   food.remove();
  // }
  // $loadingItem.style.display = "block";
  // $loadingItem.innerText = "Loading food ...";
  // await loadFood(meal);
  const $mealBox = document.querySelector(`.${meal}`);

  for (let box of foodBoxes) {
    box.style.display = "none";
  }
  $mealBox.style.display = "grid";
};

const foodSelected = [];

const handleCounterClick = (_id, meal, action) => {
  const $counter = document.querySelector(`.${meal} [id='${_id}'] #counter`);
  const $decrease = document.querySelector(`.${meal} [id='${_id}'] #decrease`);
  const $selected = document.querySelector(`.${meal} [id='${_id}'] .selected`);
  let counter = parseInt($counter.innerText);

  // if (!foodSelected[_id]) {
  //   foodSelected[_id] = 0;
  // }

  const isFoodAlreadyBeenSelected = foodSelected.some(
    (food) => food.foodId === _id
  );
  if (!isFoodAlreadyBeenSelected) {
    foodSelected.push({
      foodId: _id,
      portions: 0,
    });
  }

  console.log(foodSelected);

  foodIndex = foodSelected.findIndex((food) => food.foodId === _id);

  console.log(foodIndex);

  if (action === "increase") {
    // foodSelected[_id] += 1;
    foodSelected[foodIndex].portions += 1;
    counter += 1;
  }
  if (action === "decrease") {
    // foodSelected[_id] -= 1;
    foodSelected[foodIndex].portions -= 1;
    counter -= 1;
  }

  if (counter <= 0) {
    counter = 0;
    // foodSelected[_id] = 0;
    foodSelected[foodIndex].portions = 0;
    $decrease.classList.add("disabled");
    $selected.style.right = "0px";
  } else {
    $decrease.classList.remove("disabled");
    $selected.style.right = "4px";
  }

  $counter.innerText = counter;
};

const handleCalculateClick = async () => {
  if (foodSelected.length === 0) {
    return alert("Please select some food");
  }
  console.log(foodSelected);
  $calculateLoading.style.display = "flex";

  try {
    const response = await axios.post(
      "http://localhost:3000/users/history",
      foodSelected
    );
    console.log(response);
    window.location = "http://localhost:3000/result";
  } catch (e) {
    alert("Somethig went wrong. Please refresh the page and try again");
  }
};

// let menuOpen = false;
// $menuBtn.addEventListener("click", () => {
//   if (!menuOpen) {
//     console.log("open");
//     $menuBtn.classList.add("open");
//     $menu.classList.add("growing-animation");
//     $menu.addEventListener("animationend", () => {
//       $body.classList.add("disable-scroll");
//       $menuUl.style.display = "flex";
//       menuOpen = true;
//     });
//   } else {
//     console.log("close");
//     $menuBtn.classList.remove("open");
//     $menu.classList.remove("growing-animation");
//     $body.classList.remove("disable-scroll");
//     $menuUl.style.display = "none";
//     menuOpen = false;
//   }
// });
