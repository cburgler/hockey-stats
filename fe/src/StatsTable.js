import React from "react";

import BootstrapTable from "react-bootstrap-table-next";

import { getMatchupStatsHomeLast } from "./common";

const StatsTable = ({ stats, todaysMatchups, setMatchup, matchup }) => {
    const isMatchup = !!Object.keys(matchup).length;
    const teamsPlayingToday = todaysMatchups.reduce(
        (teams, matchup) => teams.concat(Object.keys(matchup)),
        []
    );

    const columns = [
        {
            text: "Team",
            dataField: "Team",
            classes: (team) =>
                !isMatchup && teamsPlayingToday.includes(team)
                    ? "team-playing-today"
                    : "",
        },
        {
            text: "W",
            dataField: "W",
            sort: !isMatchup,
            headerClasses: "win-loss-otl-column text-center",
            classes: "text-center",
        },
        {
            text: "L",
            dataField: "L",
            headerClasses: "win-loss-otl-column text-center",
            classes: "text-center",
        },
        {
            text: "OTL",
            dataField: "OTL",
            headerClasses: "win-loss-otl-column text-center",
            classes: "text-center",
        },
        {
            text: "xGF%",
            dataField: "xGF%",
            sort: !isMatchup,
            headerClasses: "analytics-column text-center",
            classes: "text-center",
        },
        {
            text: "xGF/60",
            dataField: "xGF/60",
            sort: !isMatchup,
            headerClasses: "analytics-column text-center",
            classes: "text-center",
        },
        {
            text: "xGA/60",
            dataField: "xGA/60",
            sort: !isMatchup,
            headerClasses: "analytics-column text-center",
            classes: "text-center",
        },
        {
            text: "PP xGF/60",
            dataField: "PP xGF/60",
            sort: !isMatchup,
            headerClasses: "analytics-column text-center",
            classes: "text-center",
        },
        {
            text: "PK xGA/60",
            dataField: "PK xGA/60",
            sort: !isMatchup,
            headerClasses: "analytics-column text-center",
            classes: "text-center",
        },
    ];

    const clickRow = {
        onClick: (_, row) => {
            if (isMatchup) {
                setMatchup({});
            } else if (teamsPlayingToday.includes(row.Team)) {
                setMatchup(
                    todaysMatchups.filter((matchup) => row.Team in matchup)[0]
                );
            }
        },
    };

    return (
        <div>
            <BootstrapTable
                columns={columns}
                data={
                    isMatchup ? getMatchupStatsHomeLast(stats, matchup) : stats
                }
                keyField="Team"
                classes="stats-table table-sm table-responsive-sm"
                rowEvents={clickRow}
                bootstrap4={true}
                defaultSorted={[{ dataField: "xGF%", order: "desc" }]}
            />
        </div>
    );
};

export default StatsTable;
