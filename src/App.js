import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Toggle from "react-toggle";

import "./App.css";
import "./toggle.css";
import { SelectScore, SupplyScore } from "./Score";

import { byteLength, generateChoices, jsonBlob, lowMiddleOrHigh } from "./util";

const HardModeInput = ({ changeHandler, clickHandler, guess }) => {
    return (
        <div className="answerInput">
            <input
                type="text"
                name="guess"
                aria-label="Guess"
                onChange={changeHandler}
                value={guess}
            ></input>
            <button type="submit" onClick={clickHandler}>
                Guess
            </button>
        </div>
    );
};

const EasyModeInput = ({ clickHandler, choiceOptions }) => {
    return (
        <div className="choices">
            {choiceOptions.map(({ answer, correct }) => (
                <motion.button
                    key={answer}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => clickHandler(correct)}
                >
                    {answer}
                </motion.button>
            ))}
        </div>
    );
};

const initialData = jsonBlob();
const initialLength = byteLength(JSON.stringify(initialData));
const initialCorrectChoice = lowMiddleOrHigh();
const initialOptions = generateChoices(initialCorrectChoice, initialLength);

export function App() {
    const [jsonData, setJsonData] = useState(initialData);
    // eslint-disable-next-line
    const [actualLengthOfJson, setActualLengthOfJson] = useState(initialLength);
    // eslint-disable-next-line
    const [choiceOptions, setChoiceOptions] = useState(initialOptions);

    // tracking the scores for the easy mode
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);

    // tracking how close the guess was in hard mode
    const [guess, setGuess] = useState("");
    const [percentGuess, setPercentGuess] = useState(0);
    const [closestGuess, setClosestGuess] = useState(0);

    // tracking which mode, easy/hard, which is the same as select/supply
    // "select" is when the user has three choices and picks one
    // "supply" is when the user has to input the answer
    const [currentMode, setCurrentMode] = useState("easy");

    const checkSelectAnswer = (correct) => {
        if (correct) {
            handleNewData();
            setCurrentStreak(currentStreak + 1);
        } else {
            setCurrentStreak(0);
        }
    };

    const checkSupplyAnswer = () => {
        const upperBound = actualLengthOfJson * 2;
        const lowerBound = 0;
        // we can restrict guesses a bit
        if (upperBound > guess > lowerBound) {
            const percentClose = Math.floor(
                (Math.abs(actualLengthOfJson - guess) / actualLengthOfJson) *
                    100
            );
            const score = Math.abs(100 - percentClose);
            setPercentGuess(score);
            if (score > closestGuess) {
                setClosestGuess(score);
            }
        } else {
            setPercentGuess(0);
        }
        handleNewData();
    };

    const handleInput = (input) => {
        setGuess(input.target.value);
    };

    const handleNewData = () => {
        const newData = jsonBlob();
        const newLength = byteLength(JSON.stringify(newData));
        const newChoice = lowMiddleOrHigh();
        setJsonData(newData);
        setActualLengthOfJson(newLength);
        setChoiceOptions(generateChoices(newChoice, newLength));
        setGuess("");
    };

    useEffect(() => {
        setLongestStreak(
            currentStreak > longestStreak ? currentStreak : longestStreak
        );
    }, [currentStreak, longestStreak]);

    return (
        <div className="App">
            <header>
                how big is this json?
                <p className="small-text">(in bytes)</p>
            </header>
            <main>
                <Toggle
                    id="mode-toggle"
                    defaultChecked={true}
                    onChange={() => {
                        setCurrentMode(
                            currentMode === "easy" ? "hard" : "easy"
                        );
                        handleNewData();
                    }}
                />
                <label htmlFor="mode-toggle">{currentMode} mode</label>
                {currentMode === "easy" ? (
                    <>
                        <div className="score-mobile">
                            <SelectScore
                                score={currentStreak}
                                best={longestStreak}
                            />
                        </div>
                        <EasyModeInput
                            clickHandler={checkSelectAnswer}
                            choiceOptions={choiceOptions}
                        />
                    </>
                ) : (
                    <>
                        <div className="score-mobile">
                            <SupplyScore
                                score={percentGuess}
                                best={closestGuess}
                            />
                        </div>
                        <HardModeInput
                            changeHandler={handleInput}
                            clickHandler={checkSupplyAnswer}
                            guess={guess}
                            length={actualLengthOfJson}
                        />
                    </>
                )}
                <div className="codeblock">
                    <pre>{JSON.stringify(jsonData, null, 2)}</pre>
                </div>
            </main>
        </div>
    );
}
