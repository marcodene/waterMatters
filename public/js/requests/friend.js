// Elements
const $searchUserInput = document.querySelector("#search-friend-input");
const $addUserInput = document.querySelector("#add-friend-input");
const $removeUserInput = document.querySelector("#remove-friend-input");

const $friendFoundBox = document.querySelector("#friend-response");

const searchFriend = async () => {
  const username = $searchUserInput.value;
  $friendFoundBox.innerHTML = "";

  try {
    const response = await axios.get(`${url}/users/friend/${username}`);

    $friendFoundBox.innerHTML = `<h5>${response.data.username}</h5>`;
  } catch (e) {
    if (e.response.status === 404) {
      return ($friendFoundBox.innerHTML = `<h5>No user found!</h5>`);
    }

    $friendFoundBox.innerHTML = `<h5>Unknown error. Please try again.</h5>`;
  }
};

const addFriend = async () => {
  const username = $addUserInput.value;
  $friendFoundBox.innerHTML = "";

  try {
    const response = await axios.post(`${url}/users/friend/${username}`);

    $friendFoundBox.innerHTML = `<h5>${response.data.friend.username}</h5>`;
  } catch (e) {
    if (e.response.status === 404) {
      return ($friendFoundBox.innerHTML = `<h5>No user found!</h5>`);
    }

    if (e.response.data.error) {
      return ($friendFoundBox.innerHTML = `<h5>${e.response.data.error}</h5>`);
    }

    $friendFoundBox.innerHTML = `<h5>Unknown error. Please try again.</h5>`;
  }
};

const removeFriend = async () => {
  const username = $removeUserInput.value;
  $friendFoundBox.innerHTML = "";

  try {
    const response = await axios.delete(`${url}/users/friend/${username}`);

    $friendFoundBox.innerHTML = `<h5>${response.data}</h5>`;
  } catch (e) {
    if (e.response.status === 404) {
      return ($friendFoundBox.innerHTML = `<h5>No user found!</h5>`);
    }

    $friendFoundBox.innerHTML = `<h5>Unknown error. Please try again.</h5>`;
  }
};

const addMeal = async () => {
  try {
    const response = await axios.post(`${url}/users/history`, [
      {
        foodId: "60759e5a5ac9172ee2617c42",
        portions: 3,
      },
      {
        foodId: "60759e5a5ac9172ee2617c49",
        portions: 7,
      },
    ]);
  } catch (e) {}
};

const getWaterPrint = async () => {
  try {
    const response = await axios.get(`${url}/users/water-print`);
  } catch (e) {}
};
