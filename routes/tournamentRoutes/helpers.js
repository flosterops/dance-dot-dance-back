function getTournamentParams(body) {
  const {
    tournamentTitle,
    tournamentDescription,
    tournamentPrice,
    startDate,
    finishDate,
    maxTeams
  } = body;

  return {
    tournamentTitle,
    tournamentDescription,
    tournamentPrice,
    startDate,
    finishDate,
    maxTeams,
    winners: [],
    teams: [],
    status: 1
  };
}

function getEditTournamentParams(body) {
  return ({
    tournamentTitle,
    tournamentDescription,
    tournamentPrice,
    startDate,
    finishDate,
    maxTeams
  } = body);
}

module.exports = { getTournamentParams, getEditTournamentParams };
