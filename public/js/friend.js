// Elements
const $searchUserInput = document.querySelector("#search-friend-input");
const $addUserInput = document.querySelector("#add-friend-input");
const $removeUserInput = document.querySelector("#remove-friend-input");

const $friendFoundBox = document.querySelector("#friend-response");

const searchFriend = async () => {
  const username = $searchUserInput.value;
  $friendFoundBox.innerHTML = "";

  try {
    const response = await axios.get(
      `http://localhost:3000/users/friend/${username}`
    );
    console.log(response);
    console.log(response.data);

    $friendFoundBox.innerHTML = `<h5>${response.data.username}</h5>`;
  } catch (e) {
    if (e.response.status === 404) {
      return ($friendFoundBox.innerHTML = `<h5>No user found!</h5>`);
    }

    $friendFoundBox.innerHTML = `<h5>Unknown error. Please try again.</h5>`;

    console.log(e.response.status);
    console.log(e.response.data);
  }
};

const addFriend = async () => {
  const username = $addUserInput.value;
  $friendFoundBox.innerHTML = "";

  try {
    const response = await axios.post(
      `http://localhost:3000/users/friend/${username}`
    );

    console.log(response);
    console.log(response.data);

    $friendFoundBox.innerHTML = `<h5>${response.data.friend.username}</h5>`;
  } catch (e) {
    if (e.response.status === 404) {
      return ($friendFoundBox.innerHTML = `<h5>No user found!</h5>`);
    }

    if (e.response.data.error) {
      return ($friendFoundBox.innerHTML = `<h5>${e.response.data.error}</h5>`);
    }
    console.log(e.response);

    $friendFoundBox.innerHTML = `<h5>Unknown error. Please try again.</h5>`;
  }
};

const removeFriend = async () => {
  const username = $removeUserInput.value;
  $friendFoundBox.innerHTML = "";

  try {
    const response = await axios.delete(
      `http://localhost:3000/users/friend/${username}`
    );

    console.log(response);
    console.log(response.data);

    $friendFoundBox.innerHTML = `<h5>${response.data}</h5>`;
  } catch (e) {
    if (e.response.status === 404) {
      return ($friendFoundBox.innerHTML = `<h5>No user found!</h5>`);
    }

    $friendFoundBox.innerHTML = `<h5>Unknown error. Please try again.</h5>`;
  }
};
