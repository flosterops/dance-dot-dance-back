const ObjectId = require("mongodb").ObjectId;
const { getTeamParams } = require("./helpers");

module.exports = (app, db) => {
  app.post("/team/add", (req, res) => {
    const { userId } = req.body;
    const team = {
      ...getTeamParams(req.body),
      activity: []
    };
    const teamsCollection = db.collection("teams");
    const usersCollection = db.collection("users");
    teamsCollection.insertOne(team).then(data => {
      const team = data.ops[0];
      usersCollection
        .findOneAndUpdate(
          { _id: ObjectId(userId) },
          { $set: { teamId: team._id } }
        )
        .then(data => {
          res.json(data);
        });
    });
  });

  app.get("/team/:id", (req, res) => {
    const { id } = req.params;
    const teamsCollection = db.collection("teams");
    const usersCollection = db.collection("users");
    teamsCollection.findOne({ _id: ObjectId(id) }).then(data => {
      usersCollection
        .find({ teamId: ObjectId(id) })
        .toArray()
        .then(members => {
          const updatedMembers = [];
          members.forEach(({ _id, name, surname, patronymic }) =>
            updatedMembers.push({ _id, name, surname, patronymic })
          );
          res.json({ ...data, teamMembers: updatedMembers });
        });
    });
  });

  app.post("/editTeam", (req, res) => {
    const teamsCollection = db.collection("teams");
    const { id, name, members, description } = req.body;
  });

  app.get("/teams", (req, res) => {
    const teamsCollection = db.collection("teams");
    teamsCollection
      .find()
      .toArray()
      .then(data => res.json(data));
  });
};
