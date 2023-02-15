import {
    byteLength,
    lowMiddleOrHigh,
    numberOfCustomers,
    numberOfOrders,
} from "../src/util";

const DATA_FOR_JSON = {
    customer1: {
        orders: [
            {
                cars: "yes",
                big: true,
                blobbed: "maybe",
            },
        ],
    },
    customer2: {
        orders: [
            {
                cars: "no",
                big: false,
                blobbed: "maybe",
            },
        ],
    },
};

const STATIC_JSON_STRING_WITH_WHITESPACE = `
  {
    "customer1": {
        "orders": [
            {
                "cars": "yes",
                "big": true,
                "blobbed": "maybe" 
            }
        ]
    },
    "customer2": {
        "orders":    [
            {
                "cars": "no",
                "big": false,
                "blobbed": "maybe" 
            }
        ]
    }
  }
`;

const STATIC_JSON_STRING_WITH_SOME_WHITESPACE = `
{
    "customer1": {
        "orders": [
            {"cars":"yes","big":true,"blobbed":"maybe"}
        ]
    },
    "customer2": {
        "orders": [
            {"cars":"no","big":false,"blobbed":"maybe"}
        ]
    }
}
`;

const STATIC_JSON_STRING_WITH_NO_WHITESPACE = `
{"customer1":{"orders":[{"cars":"yes","big":true,"blobbed":"maybe"}]},"customer2":{"orders":[{"cars":"no","big":false,"blobbed":"maybe"}]}}
`;

test("get a number between 1 and 3, inclusive", () => {
    const value = lowMiddleOrHigh();
    expect(value).toBeGreaterThanOrEqual(1);
    expect(value).toBeLessThanOrEqual(3);
});

// to be super certain of these two functions we could run the test 1,000 times or
// something, but it's not that big of a deal
test("get a number of customers between 1 and 10, inclusive", () => {
    const customers = numberOfCustomers();
    expect(customers).toBeGreaterThanOrEqual(1);
    expect(customers).toBeLessThanOrEqual(10);
});

test("get a number of orders between 1 and 5, inclusive", () => {
    const orders = numberOfOrders();
    expect(orders).toBeGreaterThanOrEqual(1);
    expect(orders).toBeLessThanOrEqual(5);
});

describe("proving length of json data doesn't count whitespace", () => {
    const expectedConstantLength = 139;

    test("get the length of a json blob in bytes", () => {
        const convertedJson = JSON.stringify(DATA_FOR_JSON);
        const lengthOfData = byteLength(convertedJson);
        expect(lengthOfData).toBe(expectedConstantLength);
    });

    test("the length of the three unprocessed json strings are not the same", () => {
        const lengthOfUnprocessedJsonWithWhiteSpace = byteLength(
            STATIC_JSON_STRING_WITH_WHITESPACE
        );
        const lengthOfUnprocessedJsonWithSomeWhiteSpace = byteLength(
            STATIC_JSON_STRING_WITH_SOME_WHITESPACE
        );
        const lengthOfUnprocessedJsonWithNoWhiteSpace = byteLength(
            STATIC_JSON_STRING_WITH_NO_WHITESPACE
        );

        expect(lengthOfUnprocessedJsonWithWhiteSpace).not.toEqual(
            lengthOfUnprocessedJsonWithSomeWhiteSpace
        );
        expect(lengthOfUnprocessedJsonWithWhiteSpace).not.toEqual(
            lengthOfUnprocessedJsonWithNoWhiteSpace
        );
        expect(lengthOfUnprocessedJsonWithSomeWhiteSpace).not.toEqual(
            lengthOfUnprocessedJsonWithNoWhiteSpace
        );
    });

    test("get the length of a processed json string with lots of whitespace", () => {
        const lengthOfData = byteLength(
            JSON.stringify(JSON.parse(STATIC_JSON_STRING_WITH_WHITESPACE))
        );
        expect(lengthOfData).toBe(expectedConstantLength);
    });

    test("get the length of a processed json string with some whitespace", () => {
        const lengthOfData = byteLength(
            JSON.stringify(JSON.parse(STATIC_JSON_STRING_WITH_SOME_WHITESPACE))
        );
        expect(lengthOfData).toBe(expectedConstantLength);
    });

    test("get the length of a processed json string with no whitespace", () => {
        const lengthOfData = byteLength(
            JSON.stringify(JSON.parse(STATIC_JSON_STRING_WITH_NO_WHITESPACE))
        );
        expect(lengthOfData).toBe(expectedConstantLength);
    });
});
