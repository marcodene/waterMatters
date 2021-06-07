const friendCards = document.querySelectorAll("#card");
const waterPrintItem = document.querySelectorAll(".water-print");
const zoomInImgs = document.querySelectorAll(".zoom-in");
const $cardBox = document.querySelector("#card-box");
const $buttonBox = document.querySelector(".button-box");
const $actionButton = document.querySelector("#action-button");
const $textActionButton = document.querySelector("#action-button>h3");
const $backButton = document.querySelector(".back");
const $navBar = document.querySelector(".nav-bar");
const $title = document.querySelector(".title");
const $addButton = document.querySelector("#add-button");
const $addFriendSection = document.querySelector(".add-friend-section");
const $searchForm = document.querySelector("#search-form");
const $input = document.querySelector("#search-form > input");
const $searchCard = document.querySelector("#search-friend-card");
const $usernameSearchCard = document.querySelector(
  "#search-friend-card > .username"
);
const $waterPrintSearchCard = document.querySelector(
  "#search-friend-card > .water-print"
);
const $profileLink = document.querySelector(".profile-link");

const colors = [
  "#031D44",
  "#04395E",
  "#70A288",
  "#9E75A0",
  "#AF3E4D",
  "#D5896F",
];

// Getting random backgrounds
for (i = 0; i < friendCards.length; i++) {
  // Pick a random color from the array 'colors'.
  friendCards[i].style.backgroundColor =
    colors[Math.floor(Math.random() * colors.length)];
}
// Setting friend's waterPrint
(async () => {
  const response = await axios.get("http://localhost:3000/users/friends");

  response.data.forEach((waterPrint, index) => {
    waterPrintItem[index].innerText = `${waterPrint} L`;
  });
})();

friendCards.forEach((card) => {
  // Handle click on cards
  card.addEventListener("click", (e) => {
    window.scrollTo(0, 0);
    // Return all cards to their original position
    for (let card of friendCards) {
      card.style.position = "static";
    }
    $cardBox.style.paddingTop = "10000px";
    $cardBox.style.marginTop = "6rem";
    document.body.classList.add("stop-scrolling");

    $navBar.style.display = "none";
    $title.style.display = "none";
    zoomInImgs.forEach((img) => (img.style.display = "none"));

    $profileLink.style.display = "flex";
    // Set href to the unique profile page
    const username = card.querySelector("h3").innerText;
    console.log(username);
    const friend = user.friends.filter(
      (friend) => friend.username === username
    );
    $profileLink.querySelector(
      "a"
    ).href = `http://localhost:3000/profile/${friend[0]._id}`;

    $buttonBox.style.display = "block";
    $actionButton.classList.add("remove");
    $textActionButton.textContent = "REMOVE";

    const bottom = card.offsetTop - $cardBox.offsetTop;
    card.style.position = "relative";
    card.style.bottom = `${bottom}px`;
    card.style.zIndex = "1";
  });
});

// Handle click on action button
$actionButton.addEventListener("click", async (e) => {
  if ($actionButton.classList.contains("remove")) {
    handleRemoveClick();
  } else if ($actionButton.classList.contains("add")) {
    handleAddClick();
  }
});

const handleRemoveClick = async () => {
  const answer = window.confirm("Are you sure you wanna delete this friend?");

  if (!answer) {
    return;
  }

  const card = [...friendCards].find(
    (card) => card.style.position === "relative"
  );
  const regex = /<h3 class="username">(.*)<\/h3>/m;
  const username = card.innerHTML.match(regex)[1];
  const id = user.friends.find((user) => user.username === username)._id;

  const response = await axios.delete(
    `http://localhost:3000/users/friend/${id}`
  );
  window.location.reload();
};

const handleAddClick = async () => {
  try {
    const searchingYourself = friendSearched._id === user._id;

    if (searchingYourself) {
      return alert("You cannot add yourself as a friend");
    }

    const alreadyFriend = user.friends.some(
      (user) => user.username === friendSearched.username
    );

    if (alreadyFriend) {
      return alert("This user is already your friend");
    }

    const response = await axios.post(
      `http://localhost:3000/users/friend/${friendSearched._id}`
    );
    alert("Friend successfully added!");
    window.location.reload();
  } catch (e) {
    alert("Something went wrong. Please try again!");
  }
};

// Handle click on back button
$backButton.addEventListener("click", (e) => {
  // for (let card of friendCards) {
  //   card.style.position = "static";
  // }
  // $cardBox.style.paddingTop = "0px";
  // document.body.classList.remove("stop-scrolling");

  // $navBar.style.display = "flex";

  // $actionButton.classList.remove("remove");
  // $actionButton.classList.remove("add");
  // $actionButton.classList.remove("disable");

  // $buttonBox.style.display = "none";
  // $addFriendSection.style.display = "none";
  // $title.style.display = "block";
  // $cardBox.style.display = "block";
  // $zoomInImg.style.display = "block";
  window.location.reload();
});

// Handle click on add button
$addButton.addEventListener("click", (e) => {
  window.scrollTo(0, 0);
  $navBar.style.display = "none";
  $title.style.display = "none";
  $cardBox.style.display = "none";
  $addFriendSection.style.display = "flex";
  $buttonBox.style.display = "block";

  $actionButton.classList.add("disable");
  $textActionButton.textContent = "ADD";
});

var friendSearched = {};

$searchForm.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();

    const username = $input.value;

    searchingFriend();
    const response = await axios.get(
      `http://localhost:3000/users/friend/${username}`
    );

    friendSearched = response.data;

    friendFound(friendSearched);
  } catch (e) {
    if (e.response.status === 404) {
      return noUserFound();
    }

    errorSearching();
  }
});

const searchingFriend = () => {
  $usernameSearchCard.textContent = "Searching ...";
  $waterPrintSearchCard.textContent = `... L`;
  $searchCard.style.backgroundColor = "#c4c4c4";
  $actionButton.classList.remove("add");
  $actionButton.classList.add("disable");
};

const friendFound = (friend) => {
  $searchCard.style.backgroundColor =
    colors[Math.floor(Math.random() * colors.length)];
  $usernameSearchCard.textContent = friend.username;
  $waterPrintSearchCard.textContent = `${friend.waterPrint} L`;
  $actionButton.classList.remove("disable");
  $actionButton.classList.add("add");
};

const noUserFound = () => {
  $usernameSearchCard.textContent = "No user found.";
  $waterPrintSearchCard.textContent = `... L`;
  $searchCard.style.backgroundColor = "#c4c4c4";
  $actionButton.classList.remove("add");
  $actionButton.classList.add("disable");
};

const errorSearching = () => {
  $usernameSearchCard.textContent = "Something went wrong. Please try again!";
  $waterPrintSearchCard.textContent = `... L`;
  $searchCard.style.backgroundColor = "#c4c4c4";
  $actionButton.classList.remove("add");
  $actionButton.classList.add("disable");
};
