const ObjectId = require("mongodb").ObjectId;
const { getTeamRequestParams } = require("./helpers");

module.exports = (app, db) => {
  app.post("team/request/enter", (req, res) => {
    const teamRequestsCollection = db.collection("teamRequests");
    const dancerRequest = getTeamRequestParams(req.body);
    teamRequestsCollection
      .insertOne(dancerRequest)
      .then(data => res.json(data.ops[0]));
  });

  app.post("team/request/enter/accept", (req, res) => {
    const { dancerId, teamId } = getTeamRequestParams(req.body);
    const { _id: requestId } = req.body;
    const usersCollection = db.collection("users");
    const teamRequests = db.collection("teamRequests");
    teamRequests.deleteOne({ _id: ObjectId(requestId) }).then(data => {});
    usersCollection
      .findOneAndUpdate({ _id: ObjectId(dancerId) }, { teamId })
      .then(data => res.json(data));
  });

  app.get("/team/request/enter/cancel/:id", (req, res) => {
    const { _id: id } = req.params;
    const teamRequests = db.collection("teamRequests");
    teamRequests.deleteOne({ _id: ObjectId(id) }).then(data => res.json(data));
  });

  app.get("/enterTeam/list", (req, res) => {
    const teamRequests = db.collection("teamRequests");
    teamRequests
      .find()
      .toArray()
      .then(requests => res.json(requests));
  });
};
