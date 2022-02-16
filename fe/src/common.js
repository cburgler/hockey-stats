export const getMatchupStatsHomeLast = (stats, matchup) => {
    let matchupStats = stats.filter(({ Team }) => Team in matchup);
    if (matchup[matchupStats[0].Team].venue === "home") {
        matchupStats = [matchupStats[1], matchupStats[0]];
    }
    return matchupStats;
};
