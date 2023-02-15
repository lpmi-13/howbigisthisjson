import { useState } from "react";
import "./App.css";

import { byteLength, generateChoices, jsonBlob, lowMiddleOrHigh } from "./util";

const PlaySection = ({ checkAnswer, choiceOptions }) => {
    return (
        <div className="choices">
            {choiceOptions.map(({ answer, correct }) => (
                <button
                    key={answer}
                    type="button"
                    onClick={() => checkAnswer(correct)}
                >
                    {answer}
                </button>
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

    const checkAnswer = (correct) => {
        if (correct) {
            const newData = jsonBlob();
            const newLength = byteLength(JSON.stringify(newData));
            const newChoice = lowMiddleOrHigh();
            setJsonData(newData);
            setActualLengthOfJson(newLength);
            setCorrectChoice(newChoice);
            setChoiceOptions(generateChoices(newChoice, newLength));
        } else {
            return;
        }
    };

    return (
        <div className="App">
            <header>how big is this json? (in bytes)</header>
            <main>
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
