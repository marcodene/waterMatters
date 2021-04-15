const validateUser = (user, fields) => {
  const userObject = user.toObject();
  for (i = 0; i < fields.length; i++) {
    delete userObject[fields[i]];
  }
  return userObject;
};

module.exports = validateUser;
