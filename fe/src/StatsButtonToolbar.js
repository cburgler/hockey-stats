import React from "react";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

const StatsButtonToolbar = ({ values, selectedValue, onClick }) => {
    const ToolbarButton = ({ value }) => {
        return (
            <Button
                value={value}
                active={selectedValue === value}
                onClick={onClick}
            >
                {value}
            </Button>
        );
    };

    return (
        <>
            <ButtonToolbar>
                <ButtonGroup className="mb-3 mt-3">
                    {values.map((value) => (
                        <ToolbarButton value={value} key={value} />
                    ))}
                </ButtonGroup>
            </ButtonToolbar>
        </>
    );
};

export default StatsButtonToolbar;
