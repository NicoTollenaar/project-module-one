class Game {
    constructor(){
        this.player = new Player();
        this.currentLevel = 0;
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
        let frame = document.querySelector("#frame");
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
        let frame = document.querySelector("#frame");
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
      
        let frame = document.querySelector("#frame");
        let foodElements = [];
        let foodElement;
        this.foodObjects.forEach((foodObject)=>{
            foodElement = document.createElement("div");
            foodElement.style.left = `${foodObject.positionX}%`;
            foodElement.style.bottom = `${foodObject.positionY}%`;
            foodElement.style.width = `${foodObject.width}%`;
            foodElement.style.height = `${foodObject.height}%`;
            foodElement.className = `${foodObject.className}`;
            frame.appendChild(foodElement);
            foodElements.push(foodElement);
        });
        return foodElements;
    }

}

class Player {
    constructor() {
        this.height = 10;
        this.width = 3;
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
                this.velocityX += 0.02;
            }
        } else if (this.keysPressed.left === true && this.keysPressed.right === false) {
            if (this.onSolidUnderground && Math.abs(this.velocityX) <= this.maxVelocity) {
                this.velocityX -= 0.02;
            }
        } else if (this.keysPressed.left === false && this.keysPressed.right === false) {
            this.velocityX *= 0.9;
        }
        this.positionX += this.velocityX;
        this.detectBorderCollision();
        this.detectFrameElementCollision();
        // this.detectFatalElementCollision();
        this.detectFoodElementCollision();
}

    moveY() {
        this.checkOnSolidUnderground();
        if (this.keysPressed.up === true && this.onSolidUnderground) {
              this.velocityY = 2.8;
        } else if (this.positionY > 0 && this.onSolidUnderground === false) {
            this.velocityY -= 0.1;
        } else if (this.positionY <= 0) {
            this.positionY = 0;
            this.velocityY = 0;
        }
        this.positionY += this.velocityY;
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
        // console.log("Foodobjects in detect food collision: ", foodObjects);
        foodObjects.forEach((foodObject, index)=> {
        if (this.positionY < foodObject.positionY + foodObject.height &&
            this.positionY + this.height > foodObject.positionY &&
            this.positionX < foodObject.positionX + foodObject.width &&
            this.positionX + this.width > foodObject.positionX){
            levels[game.currentLevel].foodElements[index].remove();
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
        {positionX: 0, positionY: 70, width: 7, height: 5, className: "frameObjectsLevel1"},
    ],
    fatalObjects: [
        // {positionX: 10, positionY: 0, width: 35, height: 3, className: "fatalObjectsLevel1"}
        // {positionX: 85, positionY: 15, width: 15, height: 10, className: "fatalObjectsLevel1"}
    ],
    foodObjects: [
        {positionX: 1, positionY: 75, width: 1, height: 3, className: "foodObjectsLevel1"},
        {positionX: 1, positionY: 30, width: 1, height: 3, className: "foodObjectsLevel1"},
        {positionX: 98, positionY: 25, width: 1, height: 3, className: "foodObjectsLevel1"},
        {positionX: 98, positionY: 45, width: 1, height: 3, className: "foodObjectsLevel1"}
    ],
    sound: [],
    otherAttributes: {}
}

const level2Parameters = {};
const levelParameters = [level1Parameters, level2Parameters];

const game = new Game();
const player = new Player();
const level1 = new Level(levelParameters[0]);
const levels = [level1];

level1.createFrameElements();

let counter = 0;

let startButton = document.querySelector("#start-button");
startButton.addEventListener("click", ()=> {
    startButton.style.display = "none";
    setInterval(()=> {
        player.moveX();
        player.moveY();
        player.domElement.style.left = `${player.positionX}%`;
        player.domElement.style.bottom = `${player.positionY}%`;
        counter++;
        console.log("Minutes: ", getMinutes());
        console.log("Seconds: ", getSeconds());
        console.log("Milliseconds: ", getMilliseconds());
        renderTime();
    }, 10);
});

function renderTime(){
    let time = formatTime();
    let timeElement = document.querySelector("#time");
    timeElement.innerText = `${time}`;
}

function getMinutes() {
    return Math.floor((counter / 100) / 60); 
}

function getMilliseconds() {
    return counter % 100;
}

function getSeconds() {
    return Math.floor(counter / 100) % 60;
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
      console.log("Logging stringValue in error: ", stringValue);
      throw new Error("Something went wrong!");
    }
  }

  function formatTime() {
    let minutes = getMinutes();
    let seconds = getSeconds();
    let milliseconds = getMilliseconds();
    let stringMinutes = this.computeTwoDigitNumber(minutes);
    let stringSeconds = this.computeTwoDigitNumber(seconds);
    let milliString = this.computeTwoDigitNumber(milliseconds);
    // let formattedTime = `${stringMinutes}:${stringSeconds}:${milliString}`;
    let formattedTime = `${stringMinutes}:${stringSeconds}`;
    console.log("Milliseconds, string: ", milliseconds, milliString);
    console.log("Seconds, string: ", seconds, stringSeconds);
    console.log("Minutes, string: ", minutes, stringMinutes);
    console.log("Formatted time: ", formattedTime);
    return formattedTime;
  }

window.addEventListener("keydown", (e)=>{
    if (e.key === "w") {
        console.log("Minutes: ", getMinutes());
        console.log("Seconds: ", getSeconds());
    }
})

window.addEventListener("keydown", (e)=>{
    if (e.key === "ArrowRight") {
        player.keysPressed.right = true;
    } else if (e.key === "ArrowLeft") {
        player.keysPressed.left = true;
    }
});

window.addEventListener("keyup", (e)=>{
    if (e.key === "ArrowRight") {
        player.keysPressed.right = false;
    } else if (e.key === "ArrowLeft") {
        player.keysPressed.left = false;
    }
});

window.addEventListener("keydown", (e)=>{
    if (e.key === "ArrowUp") {
        player.keysPressed.up = true;
    }
});

window.addEventListener("keyup", (e)=>{
    if (e.key === "ArrowUp") {
        player.keysPressed.up = false;
    }
});










