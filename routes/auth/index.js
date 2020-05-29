const md5 = require("md5");
const { getRegUserParams } = require("../userRoutes/helpers");

module.exports = (app, db) => {
  app.post("/login", (req, res) => {
    const { login, password } = req.body;
    const hashedPassword = md5(password);
    const users = db.collection("users");
    users.findOne({ login, password: hashedPassword }).then(data => {
      if (data) {
        req.session.user = data;
        req.session.save(err => {
          if (err) {
            throw err;
          }
        });
        res.json(data);
      }
    });
  });

  app.post("/register", (req, res) => {
    const user = getRegUserParams(req.body);
    const users = db.collection("users");
    users.insertOne(user).then(data => {
      const addedUser = data.ops[0];
      if (addedUser) {
        req.session.user = addedUser;
        req.session.save(err => {
          if (err) {
            throw err;
          }
        });
        res.json(addedUser);
      }
    });
  });

  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.json(null);
  });

  app.get("/loadSession", (req, res) => {
    const { user: sessionUser } = req.session;
    const user = sessionUser || null;
    res.json(user);
  });
};
