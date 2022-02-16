import React, { useEffect, useRef, useState } from "react";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

import MatchupGoalies from "./MatchupGoalies";
import StatsFilter from "./StatsFilter";
import StatsTable from "./StatsTable";

const TWENTY_MINUTES = 1200000;

const App = () => {
    const [stats, setStats] = useState([]);
    const [isFetchingStats, setIsFetchingStats] = useState(false);
    const [numGames, setNumGames] = useState(13);
    const [venue, setVenue] = useState("all");
    const [todaysMatchups, setTodaysMatchups] = useState([]);
    const [matchup, setMatchup] = useState({});
    const abortController = useRef();

    useEffect(() => {
        // get stats for selected # of previous games and venue
        abortController.current?.abort(); // prevent race condition / mismatched data
        abortController.current = new AbortController();

        const getStats = async () => {
            const timeoutID = setTimeout(() => setIsFetchingStats(true), 100);
            fetch(
                `${process.env.REACT_APP_API_URL}?num_games=${numGames}&venue=${venue}`,
                {
                    signal: abortController.current.signal,
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    setStats(data);
                    clearTimeout(timeoutID);
                    setIsFetchingStats(false);
                })
                .catch((error) => {
                    if (error.name !== "AbortError") {
                        console.error("Unable to get stats:", error);
                    }
                });
        };
        getStats();
    }, [numGames, venue]);

    useEffect(() => {
        // get today's matchups
        const getTodaysMatchups = async () => {
            fetch(`${process.env.REACT_APP_API_URL}/matchups`)
                .then((response) => response.json())
                .then((data) => setTodaysMatchups(data));
        };
        getTodaysMatchups();
        setInterval(getTodaysMatchups, TWENTY_MINUTES);
    }, []);

    return (
        <>
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
                crossOrigin="anonymous"
            />
            {isFetchingStats && (
                <Spinner animation="border" role="status" className="spinner" />
            )}
            <Container>
                <StatsFilter
                    numGames={numGames}
                    setNumGames={setNumGames}
                    venue={venue}
                    setVenue={setVenue}
                />
                <StatsTable
                    stats={stats}
                    todaysMatchups={todaysMatchups}
                    setMatchup={setMatchup}
                    matchup={matchup}
                />
                <MatchupGoalies stats={stats} matchup={matchup} />
            </Container>
        </>
    );
};

export default App;
