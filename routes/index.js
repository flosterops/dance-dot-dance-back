const userRoutes = require("./userRoutes/index");
const teamRoutes = require("./teamRoutes/index");
const tournamentRoutes = require("./tournamentRoutes/index");
const authRoute = require("./auth/index");
const teamRequests = require("./teamsRequest/index");
const tournamentRequests = require("./tournamentRequests/index");

module.exports = (app, db) => {
  userRoutes(app, db);
  teamRoutes(app, db);
  tournamentRoutes(app, db);
  authRoute(app, db);
  teamRequests(app, db);
  tournamentRequests(app, db);
};
