const ObjectId = require("mongodb").ObjectId;
const { getTournamentParams, getEditTournamentParams } = require("./helpers");
const moment = require("moment");

module.exports = (app, db) => {
  app.post("/addTournament", (req, res) => {
    const tournament = getTournamentParams(req.body);
    const tournaments = db.collection("tournaments");
    tournaments.insertOne(tournament).then(data => res.json(data));
  });

  app.get("/tournament/:id", (req, res) => {
    const tournaments = db.collection("tournaments");
    const { id } = req.params;
    tournaments.findOne({ _id: ObjectId(id) }).then(data => res.json(data));
  });

  app.get("/tournaments", (req, res) => {
    const tournaments = db.collection("tournaments");
    tournaments
      .find()
      .toArray()
      .then(data => res.json(data));
  });

  app.post("/tournament/edit", (req, res) => {
    const { id } = req.body;
    const tournaments = db.collection("tournaments");
    const updatedTournament = getEditTournamentParams(req.body);
    tournaments
      .updateOne({ _id: ObjectId(id) }, updatedTournament)
      .then(data => {
        res.json(data);
      });
  });

  app.get("/tournaments/actual", (req, res) => {
    const tournamentsCollection = db.collection("tournaments");
    tournamentsCollection
      .aggregate([
        {
          $match: {
            startDate: { $lt: moment().unix() }
          }
        },
        {
          $match: {
            status: 1
          }
        }
      ])
      .toArray()
      .then(data => res.json(data));
  });

  app.get("/tournament/teams/:id", (req, res) => {
    const teamsTournamentsCollection = db.collection("teamsTournaments");
    const { id } = req.params;
    teamsTournamentsCollection
      .aggregate([
        {
          $lookup: {
            from: "teams",
            localField: "teamId",
            foreignField: "_id",
            as: "team"
          }
        },
        {
          $match: {
            tournamentId: ObjectId(id)
          }
        }
      ])
      .toArray()
      .then(data => {
        const filteredData = data.map(item => item.team[0]);
        res.json(filteredData);
      });
  });

  app.post("/tournament/finish", (req, res) => {
    const { winnerId, tournamentId } = req.body;
    const tournamentsCollection = db.collection("tournaments");
    tournamentsCollection
      .findOneAndUpdate(
        { _id: ObjectId(tournamentId) },
        { $set: { status: 2, winnerId } }
      )
      .then(data => res.json(data));
  });
};
