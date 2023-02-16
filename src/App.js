import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Toggle from "react-toggle";

import "./App.css";
import "./toggle.css";
import Score from "./Score";

import { byteLength, generateChoices, jsonBlob, lowMiddleOrHigh } from "./util";

const HardModeInput = ({ clickHandler, length }) => {
    return (
        <div className="answerInput">
            <label for="answer">Your guess</label>
            <input type="text" name="answer"></input>
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

    // tracking the scores
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);

    // tracking which mode, easy/hard, which is the same as select/supply
    // "select" is when the user has three choices and picks one
    // "supply" is when the user has to input the answer
    const [currentMode, setCurrentMode] = useState("easy");

    const checkSelectAnswer = (correct) => {
        if (correct) {
            const newData = jsonBlob();
            const newLength = byteLength(JSON.stringify(newData));
            const newChoice = lowMiddleOrHigh();
            setJsonData(newData);
            setActualLengthOfJson(newLength);
            setChoiceOptions(generateChoices(newChoice, newLength));
            setCurrentStreak(currentStreak + 1);
        } else {
            setCurrentStreak(0);
        }
    };

    const checkSupplyAnswer = (answer) => {
        console.log(answer);
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
                    onChange={() =>
                        setCurrentMode(currentMode === "easy" ? "hard" : "easy")
                    }
                />
                <label htmlFor="mode-toggle">{currentMode} mode</label>
                <div className="score-mobile">
                    <Score score={currentStreak} best={longestStreak} />
                </div>
                {currentMode === "easy" ? (
                    <EasyModeInput
                        clickHandler={checkSelectAnswer}
                        choiceOptions={choiceOptions}
                    />
                ) : (
                    <HardModeInput
                        clickHandler={checkSupplyAnswer}
                        length={actualLengthOfJson}
                    />
                )}
                <div className="codeblock">
                    <pre>{JSON.stringify(jsonData, null, 2)}</pre>
                </div>
            </main>
        </div>
    );
}
