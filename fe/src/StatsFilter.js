import React from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import StatsButtonToolbar from "./StatsButtonToolbar";

const NUM_GAMES_VALUES = [3, 5, 8, 13, 21, 34];
const VENUE_VALUES = ["all", "home", "away"];

const StatsFilter = ({ numGames, setNumGames, venue, setVenue }) => {
    return (
        <Row xs="auto">
            <Col>
                <StatsButtonToolbar
                    values={NUM_GAMES_VALUES}
                    onClick={(e) => setNumGames(Number(e.target.value))}
                    selectedValue={numGames}
                />
            </Col>
            <Col>
                <StatsButtonToolbar
                    values={VENUE_VALUES}
                    onClick={(e) => setVenue(e.target.value)}
                    selectedValue={venue}
                />
            </Col>
        </Row>
    );
};

export default StatsFilter;
