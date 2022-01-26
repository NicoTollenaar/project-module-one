function orderScores(scores) {
    let orderedScores = [];
    let lowest;
    while (scores.length > 0) {
        lowest = getLowest(scores);
        console.log("In while loop, scores: ", scores);
        console.log("In while loop, lowest: ", lowest);
        orderedScores.push(lowest);
        scores.splice(scores.indexOf(lowest), 1)
    }
    console.log("Ordered scores: ", orderedScores);
    return orderedScores;
}


function getLowest(array) {
    let lowestScore = array[0].score;
    let lowestIndex = 0;
    for (let i = 1; i < array.length; i++) {
        if (array[i].score < lowestScore) {
            lowestScore = array[i].score;
            lowestIndex = i;
        }
    }
    return array[lowestIndex];
}

function generateArray(length) {
    let scoresArray = [];
    for (let i=0; i <= length; i++) {
        let scoreObject = {};
        scoreObject.name = `${i}`;
        scoreObject.score = Math.floor(Math.random()*100); 
        scoresArray.push(scoreObject);
    }
    console.log("Generated score array: ", scoresArray);
    return scoresArray;
}

let unorderedScores = generateArray(10);
orderScores(unorderedScores);
