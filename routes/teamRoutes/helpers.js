function getTeamParams(body) {
  const { teamTitle, teamDescription } = body;
  return { teamTitle, teamDescription };
}

module.exports = { getTeamParams };
