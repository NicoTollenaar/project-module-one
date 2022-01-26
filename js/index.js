let startButton = document.querySelector("#start-button");
let inputField = document.querySelector("#name-input-field");
startButton.addEventListener("click", ()=>{
    let name = inputField.value;
    console.log("name input filed: ", name);
    localStorage.setItem(`${name}`, "currentPlayer");
    console.log(localStorage.getItem("name"));
});

for (let key in localStorage) {
    if(localStorage.hasOwnProperty(key)) {
    console.log(key, localStorage.getItem(key));
    }
}