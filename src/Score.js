import { Fragment } from "react";

const Score = ({ score, best }) => {
    return (
        <Fragment>
            <div className="score">score: {score}</div>
            <div className="bestScore">best: {best}</div>
        </Fragment>
    );
};

export default Score;
