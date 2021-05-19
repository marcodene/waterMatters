var template = document.querySelector("#template-esempio").innerHTML;
const main = document.querySelector(".main");
const body = document.querySelector("body");

const breakfast_button = document.querySelector(".meal-button.breakfast");
const lunch_button = document.querySelector(".meal button.lunch");
const dinner_button = document.querySelector(".meal button.dinner");
const meals = document.querySelectorAll(".meal");
const $loadingItem = document.querySelector("#loading");

const loadFood = async (meal) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/foods/${meal}`);
    var foods = response.data;

    if (foods.length === 0) {
      console.log(foods);
      return ($loadingItem.innerText = "No food found!");
    }

    $loadingItem.style.display = "none";
    for (let food of foods) {
      var html = Mustache.render(template, food);

      main.insertAdjacentHTML("beforeend", html);
    }
  } catch (e) {
    $loadingItem.style.display = "block";
    $loadingItem.innerText = "An error occurred. Please try again!";
  }
};

loadFood("breakfast");

console.log(meals);
// breakfast_button.style.backgroundColor = "#FDBD10";

// var breakfast_boolean = true;
// var lunch_boolean = false;
// var dinner_boolean = false;

// function change_background() {
//   if (breakfast_boolean) {
//     breakfast_button.style.backgroundColor = "#FDBD10";
//     lunch_button.style.backgroundColor = "white";
//     dinner_button.style.backgroundColor = "white";
//   }
//   if (lunch_boolean) {
//     breakfast_button.style.backgroundColor = "white";
//     lunch_button.style.backgroundColor = "#FDBD10";
//     dinner_button.style.backgroundColor = "white";
//   }
//   if (dinner_boolean) {
//     breakfast_button.style.backgroundColor = "white";
//     lunch_button.style.backgroundColor = "white";
//     dinner_button.style.backgroundColor = "#FDBD10";
//   }
// }

// body.addEventListener("click", change_background);

// breakfast_button.onclick = function () {
//   breakfast_boolean = true;
//   lunch_boolean = false;
//   dinner_boolean = false;
// };

// lunch_button.onclick = function () {
//   breakfast_boolean = false;
//   lunch_boolean = true;
//   dinner_boolean = false;
// };

// dinner_button.onclick = function () {
//   breakfast_boolean = false;
//   lunch_boolean = false;
//   dinner_boolean = true;
// };

// function change_background(button){
//   button.style.backgroundColor = "yellow"
// }

const changeBackground = (itemIndex) => {
  for (item of meals) {
    item.style.backgroundColor = "var(--white)";
  }

  meals[itemIndex].style.backgroundColor = "var(--color3)";
};

const changeFoods = async (meal) => {
  const foodItems = document.querySelectorAll(".button-box");
  for (let food of foodItems) {
    food.remove();
  }
  $loadingItem.style.display = "block";
  $loadingItem.innerText = "Loading food ...";
  await loadFood(meal);
};
