const $usernameInput = document.querySelector("#username-input");

const updateUser = async () => {
  const username = $usernameInput.value;
  console.log(username);

  try {
    const response = await axios({
      method: "patch",
      url: "http://localhost:3000/users/edit",
      data: {
        username: `${username}`,
      },
    });
    console.log(response.data);
  } catch (e) {
    console.log(e);
  }
};
