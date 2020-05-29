const ObjectId = require("mongodb").ObjectId;
const { getTournamentRequestParams } = require("./helpers");

module.exports = (app, db) => {
  app.post("/tournament/request/enter/team", (req, res) => {
    const { tournamentId, teamId } = getTournamentRequestParams(req.body);
    const tournamentRequestsCollection = db.collection("tournamentRequests");
    tournamentRequestsCollection
      .findOne({ tournamentId })
      .then(foundedRequest => {
        if (!foundedRequest) {
          return tournamentRequestsCollection
            .insertOne({
              tournamentId: ObjectId(tournamentId),
              teamId: ObjectId(teamId)
            })
            .then(insertData => {
              res.json(insertData.ops[0]);
            });
        }
        res.error("Эта команда уже подала заявку на участие");
      });
  });

  app.post("/tournament/request/accept", (req, res) => {
    const { tournamentId, teamId, requestId } = req.body;
    const teamsTournamentsCollection = db.collection("teamsTournaments");
    const tournamentRequestsCollection = db.collection("tournamentRequests");
    teamsTournamentsCollection
      .insertOne({
        tournamentId: ObjectId(tournamentId),
        teamId: ObjectId(teamId)
      })
      .then(updatedData => {
        tournamentRequestsCollection
          .deleteOne({ _id: ObjectId(requestId) })
          .then(data => {
            res.json(data);
          });
      });
  });

  app.get("/tournament/request/cancel/:id", (req, res) => {
    const { id } = req.params;
    const tournamentRequestsCollection = db.collection("tournamentRequests");
    tournamentRequestsCollection
      .deleteOne({ _id: ObjectId(id) })
      .then(data => res.json(data));
  });

  app.get("/tournament/request/list", (req, res) => {
    const tournamentRequestsCollection = db.collection("tournamentRequests");
    tournamentRequestsCollection
      .aggregate([
        {
          $lookup: {
            from: "tournaments",
            localField: "tournamentId",
            foreignField: "_id",
            as: "tournament"
          }
        },
        {
          $lookup: {
            from: "teams",
            localField: "teamId",
            foreignField: "_id",
            as: "team"
          }
        }
      ])
      .toArray()
      .then(data => {
        const updatedData = data.map(
          ({ _id, tournamentId, teamId, tournament, team }) => ({
            _id,
            tournamentId,
            teamId,
            tournamentTitle: tournament[0].tournamentTitle,
            teamTitle: team[0].teamTitle
          })
        );
        res.json(updatedData);
      });
  });
};
