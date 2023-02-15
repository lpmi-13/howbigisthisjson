import { faker } from "@faker-js/faker";

export const numberOfCustomers = () => Math.floor(Math.random() * (10 - 2) + 2);
export const numberOfOrders = () => Math.floor(Math.random() * (5 - 2) + 2);
// we use this to determine whether the calculated number of bytes is the low,
// medium, or high number presented in the guess choices
export const lowMiddleOrHigh = () => Math.floor(Math.random() * 3 + 1);

export const byteLength = (str) => {
    // returns the byte length of a utf8 string
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
    }
    return s;
};

const twentyPercent = (answer) => Math.floor(answer * 0.2);

export const addTwentyTwice = (answer) => {
    return [
        { correct: true, answer },
        { correct: false, answer: answer + twentyPercent(answer) },
        { correct: false, answer: answer + 2 * twentyPercent(answer) },
    ];
};

export const addTwentyMinusTwenty = (answer) => {
    return [
        { correct: false, answer: answer - twentyPercent(answer) },
        { correct: true, answer },
        { correct: false, answer: answer + twentyPercent(answer) },
    ];
};

export const minusTwentyTwice = (answer) => {
    return [
        { correct: false, answer: answer - twentyPercent(answer) * 2 },
        { correct: false, answer: answer - twentyPercent(answer) },
        { correct: true, answer },
    ];
};

export const generateChoices = (correctAnswer, actualLength) => {
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

export function createRandomOrder() {
    return {
        model: faker.vehicle.model(),
        type: faker.vehicle.type(),
        registration: faker.vehicle.vin(),
        price: faker.finance.amount(),
    };
}

export function generateOrders() {
    let orderArray = [];
    for (let i = 1; i < numberOfOrders(); i++) {
        orderArray.push(createRandomOrder());
    }
    return orderArray;
}

export function createRandomCustomer() {
    return {
        userId: faker.datatype.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        location: faker.address.city(),
        registeredAt: faker.date.past(),
        orders: generateOrders(),
    };
}

export const jsonBlob = () => {
    let customerMap = {};
    for (let i = 1; i < numberOfCustomers(); i++) {
        customerMap[`customer${i}`] = createRandomCustomer();
    }
    return customerMap;
};
