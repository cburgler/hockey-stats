import React from "react";

import BootstrapTable from "react-bootstrap-table-next";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { getMatchupStatsHomeLast } from "./common";

const MatchupGoalies = ({ stats, matchup }) => {
    if (Object.keys(matchup).length === 0) {
        return null;
    }
    const matchupStatsHomeLast = getMatchupStatsHomeLast(stats, matchup);

    const columns = [
        { text: "Goalie", dataField: "Player" },
        { text: "GP", dataField: "GP", sort: true },
        { text: "TOI", dataField: "TOI" },
        { text: "SV%", dataField: "SV%" },
    ];
    const rowClasses = (row, team) => {
        if (
            matchup[team].starting_goalie.goalie === row.Player &&
            matchup[team].starting_goalie.status === "Probable"
        ) {
            return "probable-goalie";
        }
        if (
            matchup[team].starting_goalie.goalie === row.Player &&
            matchup[team].starting_goalie.status === "Confirmed"
        ) {
            return "confirmed-goalie";
        }
    };
    return (
        <>
            <Row className="mt-5">
                {matchupStatsHomeLast.map((team) => (
                    <Col>
                        <h5>{team.Team}</h5>
                        <BootstrapTable
                            columns={columns}
                            data={team.goalies}
                            keyField="Player"
                            classes="stats-table table-sm table-responsive-sm"
                            rowClasses={(row) => rowClasses(row, team.Team)}
                            bootstrap4={true}
                            defaultSorted={[
                                {
                                    dataField: "GP",
                                    order: "desc",
                                },
                            ]}
                        />
                    </Col>
                ))}
            </Row>
        </>
    );
};

export default MatchupGoalies;
