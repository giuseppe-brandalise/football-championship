import ITeamPontuation from '../Interfaces/ITeamPontuation';
import IMatches from '../Interfaces/IMatches';

function makeBasePontuation(matches: IMatches[], homeTeam: boolean): ITeamPontuation[] {
  return matches.reduce((acc: ITeamPontuation[], cur: IMatches) => {
    if (acc.find(({ name }) => (homeTeam ? name === cur.homeTeam?.teamName
      : name === cur.awayTeam?.teamName))) return acc;
    acc.push({
      name: homeTeam ? cur.homeTeam?.teamName as string : cur.awayTeam?.teamName as string,
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: '0',
    });
    return acc;
  }, []);
}

function modifyTeam(team: ITeamPontuation, game: IMatches, homeTeam: boolean): ITeamPontuation {
  const upTeam = team;
  const victory = homeTeam ? game.homeTeamGoals - game.awayTeamGoals
    : game.awayTeamGoals - game.homeTeamGoals;

  if (victory > 0) {
    upTeam.totalVictories += 1;
    upTeam.totalPoints += 3;
  } else if (victory === 0) {
    upTeam.totalDraws += 1;
    upTeam.totalPoints += 1;
  } else {
    upTeam.totalLosses += 1;
  }
  upTeam.totalGames += 1;
  upTeam.goalsFavor += homeTeam ? game.homeTeamGoals : game.awayTeamGoals;
  upTeam.goalsOwn += homeTeam ? game.awayTeamGoals : game.homeTeamGoals;
  upTeam.goalsBalance = upTeam.goalsFavor - upTeam.goalsOwn;
  upTeam.efficiency = ((upTeam.totalPoints / (upTeam.totalGames * 3)) * 100).toFixed(2);
  return upTeam;
}

function sortBoard(board: ITeamPontuation[]): ITeamPontuation[] {
  return board.sort((a, b) => {
    if (a.totalPoints !== b.totalPoints) return b.totalPoints - a.totalPoints;
    if (a.goalsBalance !== b.goalsBalance) return b.goalsBalance - a.goalsBalance;
    return b.goalsFavor - a.goalsFavor;
  });
}

function sumMatches(home: ITeamPontuation, away: ITeamPontuation): ITeamPontuation {
  const teamPontuation = {
    name: home.name,
    totalPoints: home.totalPoints + away.totalPoints,
    totalGames: home.totalGames + away.totalGames,
    totalVictories: home.totalVictories + away.totalVictories,
    totalDraws: home.totalDraws + away.totalDraws,
    totalLosses: home.totalLosses + away.totalLosses,
    goalsFavor: home.goalsFavor + away.goalsFavor,
    goalsOwn: home.goalsOwn + away.goalsOwn,
  };
  return {
    ...teamPontuation,
    goalsBalance: teamPontuation.goalsFavor - teamPontuation.goalsOwn,
    efficiency: ((teamPontuation.totalPoints / (teamPontuation.totalGames * 3)) * 100).toFixed(2),
  };
}

export function calculateHomePoints(matches: IMatches[]): ITeamPontuation[] {
  const basePontuation = makeBasePontuation(matches, true);
  const updatedTable = matches.reduce((acc, cur) => {
    const currentTeam = acc.findIndex(({ name }) => name === cur.homeTeam?.teamName);
    acc[currentTeam] = modifyTeam(acc[currentTeam], cur, true);
    return acc;
  }, basePontuation);
  return sortBoard(updatedTable);
}

export function calculateAwayPoints(matches: IMatches[]): ITeamPontuation[] {
  const basePontuation = makeBasePontuation(matches, false);
  const updatedTable = matches.reduce((acc, cur) => {
    const currentTeam = acc.findIndex(({ name }) => name === cur.awayTeam?.teamName);
    acc[currentTeam] = modifyTeam(acc[currentTeam], cur, false);
    return acc;
  }, basePontuation);
  return sortBoard(updatedTable);
}

export function calculateTotalPoints(matches: IMatches[]): ITeamPontuation[] {
  const basePontuation = makeBasePontuation(matches, false);
  const homeTable = calculateHomePoints(matches);
  const awayTable = calculateAwayPoints(matches);
  const updatedTable = homeTable.reduce((acc, cur, i) => {
    const visitor = awayTable.find(({ name }) => name === cur.name);
    acc[i] = sumMatches(cur, visitor as ITeamPontuation);
    return acc;
  }, basePontuation);
  return sortBoard(updatedTable);
}

export default {
  calculateHomePoints,
  calculateAwayPoints,
  calculateTotalPoints,
};
