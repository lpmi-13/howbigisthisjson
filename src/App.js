import "./App.css";

const jsonBlob = {
    customer1: {
        ID: 3,
        location: "UK",
        orders: 3,
    },
    customer3: {
        ID: 8,
        location: "UK",
        orders: 9,
    },
    customer2: {
        ID: 6,
        location: "UK",
        orders: 13,
    },
};

function byteLength(str) {
    // returns the byte length of an utf8 string
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--; //trail surrogate
    }
    return s;
}

function App() {
    return (
        <div className="App">
            <main>
                <p>how big is this json?</p>
                <div className="codeblock">
                    <pre>{JSON.stringify(jsonBlob, null, 2)}</pre>
                </div>
                <div className="answer">
                    it is {byteLength(JSON.stringify(jsonBlob))} bytes long!
                </div>
            </main>
        </div>
    );
}

export default App;
