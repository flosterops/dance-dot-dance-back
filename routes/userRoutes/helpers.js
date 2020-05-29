const md5 = require("md5");

function getRegUserParams(body) {
  const { login, password, name, surname, patronymic, phone } = body;
  const hashedPassword = md5(password);
  return {
    login,
    password: hashedPassword,
    name,
    surname,
    patronymic,
    phone,
    teamId: ""
  };
}

module.exports = { getRegUserParams };
