const fs = require('fs');

function convertToDecimal(numStr, numBase) {
    return parseInt(numStr, numBase);
}

function lagrangeSolve(coords) {
    const totalPoints = coords.length;
    let constant = 0;

    for (let i = 0; i < totalPoints; i++) {
        let [xi, yi] = coords[i];
        let termValue = yi;

        for (let j = 0; j < totalPoints; j++) {
            if (i !== j) {
                let [xj, _] = coords[j];
                termValue *= xj / (xj - xi);
            }
        }
        constant += termValue;
    }

    return Math.round(constant);
}

function extractSecret(inputData) {
    const meta = inputData.keys;
    const totalShares = meta.n;
    const threshold = meta.k;

    let coordPairs = [];

    for (let idx = 1; idx <= totalShares; idx++) {
        const xCoord = idx;
        const baseNum = parseInt(inputData[idx.toString()]["base"]);
        const rawValue = inputData[idx.toString()]["value"];
        const yCoord = convertToDecimal(rawValue, baseNum);
        coordPairs.push([xCoord, yCoord]);

        if (coordPairs.length === threshold) {
            break;
        }
    }

    const hiddenValue = lagrangeSolve(coordPairs);
    return hiddenValue;
}

// Handle reading JSON and computing the secret
function processFile(filePath) {
    const rawData = fs.readFileSync(filePath);
    const parsedInput = JSON.parse(rawData);
    const hidden = extractSecret(parsedInput);
    console.log(`The secret (constant term c) is: ${hidden}`);
}

processFile('testCase1.json');
processFile('testCase2.json');