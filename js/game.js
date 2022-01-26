class Game {
    constructor(levels){
        this.player = new Player();
        this.levels = levels;
        this.currentLevel = 0;
        this.levelTimeScores = [];
        this.foodElements = levels[this.currentLevel].foodElements;
        this.orderedScores = {};
    }

    start () {
        this.timeIntervalCounter = 0;
        this.mainIntervalId = setInterval(()=> {
        this.timeIntervalCounter++;
        this.player.moveX();
        this.player.moveY();
        this.player.detectCollisions();
        this.renderChangedElements();
        }, 10);
        this.showNewFoodElement();
    }

    stop() {
        clearInterval(this.mainIntervalId);
    }

    renderChangedElements(){
        this.player.domElement.style.left = `${this.player.positionX}%`;
        this.player.domElement.style.bottom = `${this.player.positionY}%`;
        let timeElement = document.querySelector("#time");
        timeElement.innerText = `${this.getTime()}`;
    }

    renderNextLevelPage(){
        // let orderedScoresArray =  this.orderedScores[`level${level}`];
        let frame = document.querySelector(".frame").style.display = "none";
        let newFrame = document.createElement("div");
        newFrame.className = "new-frame";
        document.body.appendChild(newFrame);
        let text = document.createElement("h2");
        text.className = "questionNextLevelPage";
        text.innerText = `Well done! Your time on level ${game.currentLevel} was: ${formatTime(this.timeIntervalCounter)}`;
        newFrame.appendChild(text);
        let scoresHeading = document.createElement("h3");
        scoresHeading.innerText = "Top 10 scores of all time:";
        newFrame.appendChild(scoresHeading);
        let table = document.createElement("table");
        newFrame.appendChild(table);
        let tableBody = document.createElement("tbody");
        table.appendChild(tableBody);
        let orderedList = document.createElement("ol");
        newFrame.appendChild(orderedList);
        let orderedScoresArray = this.getOrderedScores();
        let name, time, html = "";
        for (let i=0; i < orderedScoresArray.length; i++) {
            if (orderedScoresArray[i].score == game.this)
            if (i < 10) {
                name = orderedScoresArray[i].name;
                time = formatTime(orderedScoresArray[i].score);
                html += `
                <tr>
                <td>${i + 1}.</td>
                <td>${name}</td>
                <td>${time}</td>
                </tr>`;
            }
        }
        tableBody.innerHTML = html;
    }
    
    getOrderedScores() {
        let level = this.currentLevel;
        let unorderedScores = [];
        for (let i = 0; i < localStorage.length; i++){
            unorderedScores.push({name: `${localStorage.key(i)}`, score:JSON.parse(localStorage.getItem(localStorage.key(i)))});
        }
        return this.orderScores(unorderedScores);
    }

    orderScores(scores) {
        let orderedScores = [];
        let lowest;
        while (scores.length > 0) {
            lowest = this.getLowest(scores);
            orderedScores.push(lowest);
            scores.splice(scores.indexOf(lowest), 1)
        }
        return orderedScores;
    }
    
    getLowest(array) {
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

    getTime(){
        return formatTime(this.timeIntervalCounter);
    }

    showNewFoodElement() {     
        if (this.foodElements.length === 0) {
            console.log("No more foodElements left to show!");
            return;
        }
        this.randomFoodIndex = Math.floor(Math.random()*this.foodElements.length);
        this.randomFoodElement = this.foodElements[this.randomFoodIndex];
        this.randomFoodElement.style.display = "inline-block";
        if(this.foodElements.length === 1) {
            this.randomFoodElement.className = "lastFoodElement";
            this.randomFoodElement.style.width = "2%";
            this.randomFoodElement.style.height = "3%";
        }
    }

    removeFoodElement(index){
        if (this.foodElements[index]) {
            this.foodElements[index].remove();
        }
        this.foodElements.splice(index, 1);
    }
}

class Level {
    constructor(levelParameters) {
        this.startPositionPlayer = levelParameters.startPositionPlayer;
        this.frameObjects = levelParameters.frameObjects;
        this.frameElements = this.createFrameElements(this.frameObjects);
        this.fatalObjects = levelParameters.fatalObjects;
        this.fatalElements = this.createFatalElements(this.fatalObjects);
        this.foodObjects = levelParameters.foodObjects;
        this.foodElements= this.createFoodElements(this.foodObjects);
    }

    createFrameElements(){
        let frame = document.querySelector(".frame");
        let frameElements = [];
        let frameElement;
        this.frameObjects.forEach((frameObject)=>{
            frameElement = document.createElement("div");
            frameElement.style.left = `${frameObject.positionX}%`;
            frameElement.style.bottom = `${frameObject.positionY}%`;
            frameElement.style.width = `${frameObject.width}%`;
            frameElement.style.height = `${frameObject.height}%`;
            frameElement.className = `${frameObject.className}`;
            frame.appendChild(frameElement);
            frameElements.push(frameElement);
        });
        return frameElements;
    }

    createFatalElements () {
        let frame = document.querySelector(".frame");
        let fatalElements = [];
        let fatalElement;
        this.fatalObjects.forEach((fatalObject)=>{
            fatalElement = document.createElement("div");
            fatalElement.style.left = `${fatalObject.positionX}%`;
            fatalElement.style.bottom = `${fatalObject.positionY}%`;
            fatalElement.style.width = `${fatalObject.width}%`;
            fatalElement.style.height = `${fatalObject.height}%`;
            fatalElement.className = `${fatalObject.className}`;
            frame.appendChild(fatalElement);
            fatalElements.push(fatalElement);
        });
        return fatalElements;
    }

    createFoodElements () {
        let frame = document.querySelector(".frame");
        let foodElements = [];
        let foodElement;
        this.foodObjects.forEach((foodObject)=>{
            foodElement = document.createElement("div");
            foodElement.className = `${foodObject.className}`;
            foodElement.style.left = `${foodObject.positionX}%`;
            foodElement.style.bottom = `${foodObject.positionY}%`;
            foodElement.style.width = `${foodObject.width}%`;
            foodElement.style.height = `${foodObject.height}%`;
            foodElement.style.display = `none`;
            frame.appendChild(foodElement);
            foodElements.push(foodElement);
        });
        return foodElements;
    }
}

class Player {
    constructor() {
        this.height = 9;
        this.width = 2;
        this.className = "player";
        this.domElement = this.createPlayerDomElement(this.width, this.height, this.className);
        this.keysPressed = {right: false, left: false, up: false};
        this.positionX = 90;
        this.positionY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.maxVelocity = 0.5;
        this.onSolidUnderground = true;
        this.health = 10;
        this.timeIntervalCounts = [];
    }

    createPlayerDomElement(width, height, className){
        let playerDomElement = document.querySelector("#player");
        playerDomElement.className = `${this.className}`;
        playerDomElement.style.width = `${this.width}%`;
        playerDomElement.style.height = `${this.height}%`;
        return playerDomElement;
    }

    moveX() {
        this.checkOnSolidUnderground();
        if (this.keysPressed.right === true && this.keysPressed.left === false) {
            if (this.onSolidUnderground && Math.abs(this.velocityX) <= this.maxVelocity) {
                this.velocityX += 0.03;
            }
        } else if (this.keysPressed.left === true && this.keysPressed.right === false) {
            if (this.onSolidUnderground && Math.abs(this.velocityX) <= this.maxVelocity) {
                this.velocityX -= 0.03;
            }
        } else if (this.keysPressed.left === false && this.keysPressed.right === false) {
            this.velocityX *= 0.9;
        }
        this.positionX += this.velocityX;
    }

    moveY() {
        this.checkOnSolidUnderground();
        if (this.keysPressed.up === true && this.onSolidUnderground) {
              this.velocityY = 1.8;
        } else if (this.positionY > 0 && this.onSolidUnderground === false) {
            this.velocityY -= 0.05;
        } else if (this.positionY <= 0) {
            this.positionY = 0;
            this.velocityY = 0;
        }
        this.positionY += this.velocityY;
        
    }

    detectCollisions(){
        this.detectBorderCollision();
        this.detectFrameElementCollision();
        // this.detectFatalElementCollision();
        this.detectFoodElementCollision();
    }
    
    checkOnSolidUnderground() {
        let onGround;
        let frameObjects = levels[game.currentLevel].frameObjects;
        if (this.positionY <= 2) {
            onGround = true;
        }
        let onPlatform = false;
        frameObjects.forEach((frameObject)=> {
            if (Math.abs(this.positionY - (frameObject.positionY + frameObject.height)) < 3 &&
                this.positionX < frameObject.positionX + frameObject.width &&
                this.positionX + this.width > frameObject.positionX
                ) {
                    onPlatform = true;
                }
        });
        this.onSolidUnderground = onGround || onPlatform;
    }

    detectBorderCollision() {
        if (this.positionX <= 0){
            this.velocityX = -0.5 * this.velocityX;
            this.positionX = 0;
        }
        if (this.positionX + this.width >= 100){
            this.velocityX = -0.5 * this.velocityX;
            this.positionX = 100 - this.width;
        }
        if (this.positionY + this.height >= 100) {
            this.velocityY = 0;
            this.positionY = 99 - this.height;
        }
    }

    detectFrameElementCollision(){
        let frameObjects = levels[game.currentLevel].frameObjects;
        frameObjects.forEach((frameObject)=> {
            // from the top
            if (this.positionY < frameObject.positionY + frameObject.height + 3 &&
                this.positionY > frameObject.positionY + frameObject.height &&
                this.positionX < frameObject.positionX + frameObject.width &&
                this.positionX + this.width > frameObject.positionX &&
                this.velocityY < 0
                ) {
                this.velocityY = 0;
                this.positionY = frameObject.positionY + frameObject.height + 0.05;
            // from bottom
            } else if (this.positionY + this.height < frameObject.positionY &&
                this.positionY + this.height > frameObject.positionY - 3 &&
                this.positionX < frameObject.positionX + frameObject.width &&
                this.positionX + this.width > frameObject.positionX &&
                this.velocityY > 0) {
                    this.velocityY = 0;
                    this.positionY = frameObject.positionY - this.height - 0.5;
            }
            // from left
            if (this.positionY < frameObject.positionY + frameObject.height &&
                this.positionY + this.height > frameObject.positionY &&
                this.positionX + this.width < frameObject.positionX &&
                this.positionX + this.width > frameObject.positionX - 0.7 &&
                this.velocityX > 0) {
                    this.velocityX = -0.3* this.velocityX;
                    this.positionX = frameObject.positionX - this.width - 0.2;
            // from right
                } else if (this.positionY < frameObject.positionY + frameObject.height &&
                this.positionY + this.height > frameObject.positionY &&
                this.positionX > frameObject.positionX + frameObject.width &&
                this.positionX < frameObject.positionX + frameObject.width + 0.7 &&
                this.velocityX < 0
                ) {
                    this.velocityX = -0.3* this.velocityX;
                    this.positionX = frameObject.positionX + frameObject.width + 0.2;
                }
            });
    }

    detectFatalElementCollision() {
        let fatalObjects = levels[game.currentLevel].fatalObjects;
        fatalObjects.forEach((fatalObject)=> {
        if (this.positionY < fatalObject.positionY + fatalObject.height &&
            this.positionY + this.height > fatalObject.positionY &&
            this.positionX < fatalObject.positionX + fatalObject.width &&
            this.positionX + this.width > fatalObject.positionX){
                this.velocityX = 0;
                this.positionX = levels[game.currentLevel].startPositionPlayer.positionX;
                this.positionY= levels[game.currentLevel].startPositionPlayer.positionY;
                this.keysPressed= {right: false, left: false, up: false};
                alert("Oh no, you drowned! Game Over");
            }
        });
    }

    detectFoodElementCollision() {
        let foodObjects = levels[game.currentLevel].foodObjects;
        foodObjects.forEach((foodObject, index)=> {
        if (this.positionY < foodObject.positionY + foodObject.height &&
            this.positionY + this.height > foodObject.positionY &&
            this.positionX < foodObject.positionX + foodObject.width &&
            this.positionX + this.width > foodObject.positionX){
            game.removeFoodElement(index);
            game.showNewFoodElement();
            foodObjects.splice(index, 1);
            if (foodObjects.length === 0) {
                this.timeIntervalCounts.push(game.timeIntervalCounter);
                game.stop();
                for (let i = 0; i < localStorage.length; i++) {
                    if (localStorage.getItem(localStorage.key(i)) == "currentPlayer") {
                        localStorage.setItem(localStorage.key(i), JSON.stringify(this.timeIntervalCounts))
                    }
                }
                game.renderNextLevelPage();
            }
            }
        });
    }
}

const level1Parameters = {
    startPositionPlayer: {positionX: 95, positionY: 0},
    frameObjects: [
        {positionX: 63, positionY: 0, width: 10, height: 70, className: "frameObjectsLevel1"},
        {positionX: 85, positionY: 20, width: 15, height: 5, className: "frameObjectsLevel1"},
        {positionX: 90, positionY: 40, width: 10, height: 5, className: "frameObjectsLevel1"},
        {positionX: 30, positionY: 40, width: 10, height: 5, className: "frameObjectsLevel1"},
        {positionX: 56, positionY: 20, width: 8, height: 5, className: "frameObjectsLevel1"},
        {positionX: 0, positionY: 0, width: 10, height: 30, className: "frameObjectsLevel1"},
        {positionX: 0, positionY: 65, width: 7, height: 5, className: "frameObjectsLevel1"},
    ],
    fatalObjects: [
        // {positionX: 10, positionY: 0, width: 35, height: 3, className: "fatalObjectsLevel1"}
        // {positionX: 85, positionY: 15, width: 15, height: 10, className: "fatalObjectsLevel1"}
    ],
    foodObjects: [
        // {positionX: 1, positionY: 70, width: 1, height: 3, className: "foodObjectsLevel1"},
        // {positionX: 1, positionY: 30, width: 1, height: 3, className: "foodObjectsLevel1"}
        {positionX: 98, positionY: 25, width: 1, height: 3, className: "foodObjectsLevel1"},
        {positionX: 98, positionY: 45, width: 1, height: 3, className: "foodObjectsLevel1"}
        // {positionX: 61, positionY: 0, width: 1, height: 3, className: "foodObjectsLevel1"},
        // {positionX: 61, positionY: 0, width: 1, height: 3, className: "foodObjectsLevel1"},
        // {positionX: 61, positionY: 25, width: 1, height: 3, className: "foodObjectsLevel1"},
        // {positionX: 61, positionY: 25, width: 1, height: 3, className: "foodObjectsLevel1"},
        // {positionX: 35, positionY: 45, width: 1, height: 3, className: "foodObjectsLevel1"},
        // {positionX: 67, positionY: 70, width: 1, height: 3, className: "foodObjectsLevel1"},
        // {positionX: 98, positionY: 0, width: 1, height: 3, className: "foodObjectsLevel1"},
    ],
    sound: [],
    otherAttributes: {}
}

const level2Parameters = {};
const levelParameters = [level1Parameters, level2Parameters];
const level1 = new Level(levelParameters[0]);
const levels = [level1];
const game = new Game(levels);

let startButton = document.querySelector("#start-button");
startButton.addEventListener("click", ()=> {
    game.start();
    startButton.style.display = "none";
});

function getMinutes(milliseconds) {
    return Math.floor((milliseconds / 100) / 60); 
}

function getMilliseconds(milliseconds) {
    return milliseconds % 100;
}

function getSeconds(milliseconds) {
    return Math.floor(milliseconds / 100) % 60;
}

function computeTwoDigitNumber(value) {
    let stringValue = (value).toString();
    let paddedString;
    if (stringValue.length === 0) {
      return "00";
    }
    if (stringValue.length === 2) {
      return stringValue;
    } else if (stringValue.length === 1) {
      paddedString = `0${stringValue}`;
      return paddedString;
    } else {
      throw new Error("Something went wrong!");
    }
  }

  function formatTime(counter) {
    let minutes = getMinutes(counter);
    let seconds = getSeconds(counter);
    let milliseconds = getMilliseconds(counter);
    let stringMinutes = computeTwoDigitNumber(minutes);
    let stringSeconds = computeTwoDigitNumber(seconds);
    let milliString = computeTwoDigitNumber(milliseconds);
    let formattedTime = `${stringMinutes}:${stringSeconds}:${milliString}`;
    return formattedTime;
  }

window.addEventListener("keydown", (e)=>{
    if (e.key === "w") {
    }
})

window.addEventListener("keydown", (e)=>{
    if (e.key === "ArrowRight") {
        game.player.keysPressed.right = true;
    } else if (e.key === "ArrowLeft") {
        game.player.keysPressed.left = true;
    }
});

window.addEventListener("keyup", (e)=>{
    if (e.key === "ArrowRight") {
        game.player.keysPressed.right = false;
    } else if (e.key === "ArrowLeft") {
        game.player.keysPressed.left = false;
    }
});

window.addEventListener("keydown", (e)=>{
    if (e.key === "ArrowUp") {
        game.player.keysPressed.up = true;
    }
});

window.addEventListener("keyup", (e)=>{
    if (e.key === "ArrowUp") {
        game.player.keysPressed.up = false;
    }
});










