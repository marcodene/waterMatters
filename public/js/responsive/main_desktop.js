import data from "/public/js/db.js";
var template = document.querySelector("#template-esempio").innerHTML;
const main = document.querySelector(".main");


let i;
for (i = 0; i < data.length; i++) {
  var html = Mustache.render(template, data[i]);

  main.insertAdjacentHTML("beforeend", html);
}



const body = document.querySelector("body")

const breakfast_button = document.querySelector(".meal-button.breakfast")
const lunch_button = document.querySelector(".meal button.lunch")
const dinner_button = document.querySelector(".meal button.dinner")
const meals_buttons = document.querySelectorAll(".meal button")
breakfast_button.style.backgroundColor = "#FDBD10"


var breakfast_boolean = true
var lunch_boolean = false
var dinner_boolean = false

function change_background(){
  if(breakfast_boolean){
    breakfast_button.style.backgroundColor = "#FDBD10"
    lunch_button.style.backgroundColor = "white"
    dinner_button.style.backgroundColor = "white"
  }
  if (lunch_boolean){
    breakfast_button.style.backgroundColor = "white"
    lunch_button.style.backgroundColor = "#FDBD10"
    dinner_button.style.backgroundColor = "white"
  }
  if (dinner_boolean){
    breakfast_button.style.backgroundColor = "white"
    lunch_button.style.backgroundColor = "white"
    dinner_button.style.backgroundColor = "#FDBD10"
  }
}


body.addEventListener("click", change_background);  

breakfast_button.onclick = function(){
    breakfast_boolean = true
    lunch_boolean = false
    dinner_boolean = false
  }
  
  lunch_button.onclick = function(){
    breakfast_boolean = false
    lunch_boolean = true
    dinner_boolean = false
  }
  
  dinner_button.onclick = function(){
    breakfast_boolean = false
    lunch_boolean = false
    dinner_boolean = true
  }