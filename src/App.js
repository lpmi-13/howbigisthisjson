import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import "./App.css";
import Score from "./Score";

import { byteLength, generateChoices, jsonBlob, lowMiddleOrHigh } from "./util";

const PlaySection = ({ checkAnswer, choiceOptions }) => {
    return (
        <div className="choices">
            {choiceOptions.map(({ answer, correct }) => (
                <motion.button
                    key={answer}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => checkAnswer(correct)}
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
    const [correctChoice, setCorrectChoice] = useState(initialCorrectChoice);
    const [choiceOptions, setChoiceOptions] = useState(initialOptions);

    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);

    const checkAnswer = (correct) => {
        if (correct) {
            const newData = jsonBlob();
            const newLength = byteLength(JSON.stringify(newData));
            const newChoice = lowMiddleOrHigh();
            setJsonData(newData);
            setActualLengthOfJson(newLength);
            setCorrectChoice(newChoice);
            setChoiceOptions(generateChoices(newChoice, newLength));
            setCurrentStreak(currentStreak + 1);
        } else {
            setCurrentStreak(0);
        }
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
                <div className="score-mobile">
                    <Score score={currentStreak} best={longestStreak} />
                </div>
                <PlaySection
                    checkAnswer={checkAnswer}
                    choiceOptions={choiceOptions}
                />
                <div className="codeblock">
                    <pre>{JSON.stringify(jsonData, null, 2)}</pre>
                </div>
            </main>
        </div>
    );
}
