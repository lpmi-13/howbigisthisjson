import { Fragment } from "react";

export const SelectScore = ({ score, best }) => {
    return (
        <Fragment>
            <div className="score">score: {score}</div>
            <div className="bestScore">best: {best}</div>
        </Fragment>
    );
};

export const SupplyScore = ({ score, best }) => {
    return (
        <Fragment>
            <div className="score">last guess: {score}%</div>
            <div className="bestScore">best: {best}%</div>
        </Fragment>
    );
};
