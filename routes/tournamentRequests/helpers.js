function getTournamentRequestParams(body) {
  return ({ tournamentId, teamId } = body);
}

module.exports = { getTournamentRequestParams };
