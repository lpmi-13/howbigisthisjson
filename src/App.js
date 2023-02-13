import { Fragment, useState } from "react";
import "./App.css";
import { faker } from "@faker-js/faker";

const numberOfCustomers = () => Math.floor(Math.random() * (10 - 2) + 2);
const numberOfOrders = () => Math.floor(Math.random() * (5 - 2) + 2);

// we use this to determine whether the calculated number of bytes is the low,
// medium, or high number presented in the guess choices
const lowMiddleOrHigh = () => Math.floor(Math.random() * 3 + 1);

function createRandomOrder() {
    return {
        model: faker.vehicle.model(),
        type: faker.vehicle.type(),
        registration: faker.vehicle.vin(),
        price: faker.finance.amount(),
    };
}

function generateOrders() {
    let orderArray = [];
    for (let i = 1; i < numberOfOrders(); i++) {
        orderArray.push(createRandomOrder());
    }
    return orderArray;
}

function createRandomCustomer() {
    return {
        userId: faker.datatype.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        location: faker.address.city(),
        registeredAt: faker.date.past(),
        orders: generateOrders(),
    };
}

const jsonBlob = () => {
    let customerMap = {};
    for (let i = 1; i < numberOfCustomers(); i++) {
        customerMap[`customer${i}`] = createRandomCustomer();
    }
    return customerMap;
};

function byteLength(str) {
    // returns the byte length of a utf8 string
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
    }
    return s;
}

const addTwentyTwice = (answer) => {
    const twentyPercent = Math.floor(answer * 0.2);
    return [
        { correct: true, answer },
        { correct: false, answer: answer + twentyPercent },
        { correct: false, answer: answer + 2 * twentyPercent },
    ];
};

const addTwentyMinusTwenty = (answer) => {
    const twentyPercent = Math.floor(answer * 0.2);
    return [
        { correct: false, answer: answer - twentyPercent },
        { correct: true, answer },
        { correct: false, answer: answer + twentyPercent },
    ];
};

const minusTwentyTwice = (answer) => {
    const twentyPercent = Math.floor(answer * 0.2);
    return [
        { correct: false, answer: answer - twentyPercent * 2 },
        { correct: false, answer: answer - twentyPercent },
        { correct: true, answer },
    ];
};

const generateChoices = (correctAnswer, actualLength) => {
    switch (correctAnswer) {
        case 1:
            return addTwentyTwice(actualLength);
        case 2:
            return addTwentyMinusTwenty(actualLength);
        case 3:
            return minusTwentyTwice(actualLength);
        default:
            return addTwentyMinusTwenty(actualLength);
    }
};

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

function App() {
    const [jsonData, setJsonData] = useState(initialData);
    const [actualLengthOfJson, setActualLengthOfJson] = useState(initialLength);

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

export default App;
