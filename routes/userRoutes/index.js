const ObjectId = require("mongodb").ObjectId;
const { getRegUserParams } = require("./helpers");

module.exports = (app, db) => {
  app.post("/editUser", (req, res) => {
    const users = db.collection("users");
    const { id, name, surname, patronymic, password } = req.body;
  });

  app.post("/deleteUser", (req, res) => {
    const users = db.collection("users");
    const { id } = req.body;
  });

  app.get("/user/:id", (req, res) => {
    const users = db.collection("users");
    const { id } = req.params;
    users.findOne({ _id: ObjectId(id) }).then(data => {
      res.json(data);
    });
  });
};
