const $usernameInput = document.querySelector("#username-input");

const updateUser = async () => {
  const username = $usernameInput.value;

  try {
    const response = await axios({
      method: "patch",
      url: `${url}/users/edit`,
      data: {
        username: `${username}`,
      },
    });
  } catch (e) {}
};
