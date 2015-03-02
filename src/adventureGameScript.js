/*
Author: Samantha Hoke
Date: 2/6/2015
Prog 109 Winter 2015
*/

//DECLARATIONS AND INITIALIZATIONS

//parallel arrays for location information
//Location text
var mapLocations = [];
mapLocations[0] = "A dark cave. You can't see anything.";
mapLocations[1] = "The edge of the desert. Sand is everywhere.";
mapLocations[2] = "A barren cliff-top. The cliff drops straight to the desert.";
mapLocations[3] = "Steep cliffs rise straight out of the dunes.";
mapLocations[4] = "Your plane lies settled in the dunes.";
mapLocations[5] = "A dry riverbed snakes across the dunes.";
mapLocations[6] = "The ruins of a stone well.";
mapLocations[7] = "A dilapidated cottage.";
mapLocations[8] = "A small graveyard. A few worn headstones tilt randomly.";

//Location images
var images = [];
images[0] = "caveUnlit.jpg";
images[1] = "desert.jpg";
images[2] = "clifftop.jpg";
images[3] = "cliffBase.jpg";
images[4] = "plane.jpg";
images[5] = "riverbed.jpg";
images[6] = "well.jpg";
images[7] = "cottage.jpg";
images[8] = "graveyard.jpg";

//Location blocked messages
var blockedMessages = [];
blockedMessages[0] = "The cliffs rise up sheer behind the cave.";
blockedMessages[1] = "The desert looks endless - and deadly.";
blockedMessages[2] = "Only a bird could go over that cliff.";
blockedMessages[3] = "The cliff is too steep to climb.";
blockedMessages[4] = "";
blockedMessages[5] = "The riverbed is too deep and dangerous to cross.";
blockedMessages[6] = "The treacherous dunes encroach upon the edge of the well.";
blockedMessages[7] = "The endless desert spreads beyond the cottage.";
blockedMessages[8] = "The dunes are too high and shifting to cross.";

//Location help messages
var helpMessages = [];
helpMessages[0] = "Maybe there's a way to see what's in that cave?<br/>";
helpMessages[1] = "";
helpMessages[2] = "";
helpMessages[3] = "";
helpMessages[4] = "Maybe this lamp will help somewhere...<br/>";
helpMessages[5] = "";
helpMessages[6] = "Maybe these dry grasses would be useful for something...<br/>";
helpMessages[7] = "Those gray stones look helpful...<br/>";
helpMessages[8] = "";

//Location music
var sounds = [];
sounds[0] = "caveUnlit.mp3";
sounds[1] = "desert.mp3";
sounds[2] = "clifftop.mp3";
sounds[3] = "cliffBase.mp3";
sounds[4] = "plane.mp3";
sounds[5] = "riverbed.mp3";
sounds[6] = "well.mp3";
sounds[7] = "cottage.mp3";
sounds[8] = "graveyard.mp3";

//Items and commands arrays
var items =         ["flint","tinder","lamp"];
var itemLocations = [7,       6,       4];
var backpack = [];
var wordsIKnow = ["north", "south", "east", "west", "play","pause", "take", "drop",  "use", "fly", "help",
                  "save", "load", "reset"];
var itemsIKnow = ["flint", "tinder", "lamp", "notebook"];

//String variables
var action ="";
var item = "";
var gameMessage = "You are in the desert, searching for an explorer's lost journal. <br/>";
var helpMessage = "Try any of these words: <br/>" + wordsIKnow.join(", ") + ",<br/>"
                    + itemsIKnow.join(", ");
var userInput = "";
var gameStateMessage = "";//Holds message to display on save/load/reset

//Other variables
var isLampLit = false;
var currentLocation = 4;
var isPaused = false;//Used to know whether to pause music when moving to new location
var lastSound = "";//Holds last played sound
var gameState = "";//Holds name of game state function just called

//HTML elements
//Buttons
var submit = document.querySelector("#submit");
var save = document.querySelector("#save");
var load = document.querySelector("#load");
var reset = document.querySelector("#reset");
var pause = document.querySelector("#pause");
var play = document.querySelector("#play");
//Image and audio
var img = document.querySelector("#img");
var audioElement = document.querySelector("audio");
//Input
var input = document.querySelector("#input");
//Outputs
var output = document.querySelector("#output");
var locationHeader = document.querySelector("#location");
var helpArea = document.querySelector("#helpMessage");
var gameStateArea = document.querySelector("#gameStateArea");

/*Map elements and array*/
var map = document.querySelector("#map");
var tiles = document.querySelectorAll(".mapTile");


//Event listeners
submit.addEventListener("click", clickHandler, false);
save.addEventListener("click", saveHandler, false);
load.addEventListener("click", loadHandler, false);
reset.addEventListener("click", resetHandler, false);
window.addEventListener("keydown", keyHandler, false);
pause.addEventListener("click", pauseHandler, false);
play.addEventListener("click", playHandler, false);

//Event handlers
function clickHandler() {
    playGame();
}

function keyHandler(event) {
    //Allows user to use Enter key to submit input
    if (event.keyCode === 13) {
        playGame();
    }
}

function saveHandler() {
    saveGame();
}

function loadHandler() {
    loadGame();
}

function resetHandler() {
    resetGame();
}

function pauseHandler() {
    isPaused = true;
    audioElement.pause();
}

function playHandler() {
    isPaused = false;
    audioElement.play();
}

//Initial rendering
render();

//Functions

//Runs main game functionality
function playGame() {
    //reset messages
    action = "";
    item = "";
    gameMessage = "";
    helpMessage = "";
    gameState = "";
    gameStateMessage = "";
    
    //Get user input and clear input textbox
    getInput();
    input.value = "";

    //Switch on action
    switch (action) {
        //Directions
        case "north":
            goNorth();
            break;
        case "south":
            goSouth();
            break;
        case "east":
            goEast();
            break;
        case "west":
            goWest();
            break;
        //Fly
        case "fly":
            //If at plane and have notebook
            if (backpack.indexOf("notebook") !== -1 && currentLocation === 4) {
                //Game won
                gameMessage += "<em>You fly back to the Library of Alexandria.</em>";
                endGame();
            } else {
                //Either not at plane, don't have notebook or both
                if (currentLocation !== 4) {
                    gameMessage += "<strong> You can't fly here.</strong><br/>";
                }
                if (backpack.indexOf("notebook") === -1) {
                    gameMessage += "<strong> You can't leave yet. You haven't found the explorer's journal.</strong><br/>";
                }
            }
            break;
        //Item commands
        case "take":
            takeItem();
            break;
        case "drop":
            dropItem();
            break;
        case "use":
            useItem();
            break;
        //Help
        case "help":
            if (helpMessages[currentLocation] !== "") {
                helpMessage += "<em>" + helpMessages[currentLocation] + "</em><br/>";
            }
            break;
        //Save/load commands
        case "save":
            saveGame();
            break;
        case "load":
            loadGame();
            break;
        case "reset":
            resetGame();
            break;
        //Music commands
        case "pause":
            audioElement.pause();
            isPaused = true;
            break;
        case "play":
            audioElement.play();
            isPaused = false;
            break;
        //Unknown command
        default:
            gameMessage += "<strong>I don't understand that.</strong>";
            break;
            
            
    }
    //Add default help message
    helpMessage += "Try any of these words: <br/>" +
                wordsIKnow.join(", ") + ",<br/>" +
                itemsIKnow.join(", ");

    //Render changes
    render();
}

//Gets user input and set action and item
function getInput() {
    //Get input and set to lower case
    userInput = input.value;
    userInput = userInput.toLowerCase();

    //Check for known actions
    for (var i = 0; i < wordsIKnow.length; i++) {
        if (userInput.indexOf(wordsIKnow[i]) !== -1) {
            //If action is found, set action
            action = wordsIKnow[i];
            break;
        }
    }

    //Check for known items
    for (var i = 0; i < itemsIKnow.length; i++) {
        if (userInput.indexOf(itemsIKnow[i]) !== -1) {
            //If item is found, set item
            item = itemsIKnow[i];
            break;
        }
    }
}

//Moves north if possible
function goNorth() {
    if (currentLocation >= 3) {
        //User is not on top row, so go up
        currentLocation -= 3;
    }
    else {
        //User is already on top row
        gameMessage += "<strong><em> You can't go that way. <br/>" +
            blockedMessages[currentLocation] + "</em></strong>";
    }
}

//Moves south if possible
function goSouth() {
    if (currentLocation < 6) {
        //User is not on bottom row, so go down
        currentLocation += 3;
    }
    else {
        //User is already on bottom row
        gameMessage += "<strong><em> You can't go that way. <br/>" +
            blockedMessages[currentLocation] + "</em></strong>";
    }
}

//Moves east if possible
function goEast() {
    if (currentLocation % 3 === 2) {
        //User is at right edge of map already
        gameMessage += "<strong><em> You can't go that way. <br/>" +
            blockedMessages[currentLocation] + "</em></strong>";
    }
    else {
        //User is not at right edge of map, so move right
        currentLocation += 1;
    }
}

//Moves west if possible
function goWest() {
    if (currentLocation % 3 === 0) {
        //User is at left edge of map already
        gameMessage += "<strong><em> You can't go that way. <br/>" +
            blockedMessages[currentLocation] + "</em></strong>";
    }
    else {
        //User is not at left edge of map, so move left
        currentLocation -= 1;
    }
}

//Updates HTML display
function render() {
    //set image
    img.src = "../images/" + images[currentLocation];

    //Change audio source if in new location
    if (sounds[currentLocation] !== lastSound) {
        audioElement.src = "../sounds/" + sounds[currentLocation];
        lastSound = sounds[currentLocation];
        if (isPaused) {
            //Pause music when loaded if user already paused music
            audioElement.pause();
        }
    }
    
    //Display all text

    //Set item text
    var itemsHere = "<br/> You see a ";
    var itemArray = [];
    for (var i = 0; i < items.length; i++) {
        if (itemLocations[i] === currentLocation) {
            itemArray.push(items[i]);
        }
    }
    
    //Add item text to gameMessage
    if (itemArray.length > 0) {
        gameMessage += itemsHere + "<strong>" + itemArray.join(", ") + "</strong>";
    }

    //Display backpack contents
    if (backpack.length > 0) {
        gameMessage += "<br/> You are carrying <strong>" + backpack.join(", ") + "</strong>";
    }

    //Set innerHTML of HTML elements
    output.innerHTML = gameMessage;
    locationHeader.innerHTML = mapLocations[currentLocation];
    helpArea.innerHTML = helpMessage;
    
    //Display game state
    renderGameState();
    
    //Display map
    renderMap();
}

//Renders map
function renderMap() {
    //Resets color of tiles
    for (var i = 0; i < tiles.length; i++) {
        tiles[i].style.backgroundColor = "tan";
    }
    //Changes color of current locations tile
    tiles[currentLocation].style.backgroundColor = "brown";
}

//Renders only game state
//This is separated from render so that save can call just this method to prevent double render
function renderGameState() {
    gameStateArea.innerHTML = "<em>" + gameStateMessage + "</em>";
}

//Takes item and places it in backpack
function takeItem() {
    //Check item is known
    if (item !== "") {
        //Get item index
        var itemIndex = items.indexOf(item);

        //Check item is in items array and at currentLocation
        if (itemIndex != -1 && itemLocations[itemIndex] === currentLocation) {
            //Add item to backpack
            backpack.push(items[itemIndex]);

            //Remove item from items and itemLocations
            items.splice(itemIndex, 1);
            itemLocations.splice(itemIndex, 1);

            //Remove help message for chosen item from current location 
                switch (item) {
                    case "flint":
                        helpMessages[currentLocation] = helpMessages[currentLocation].replace("Those gray stones look helpful...<br/>", "");
                        break;
                    case "tinder":
                        helpMessages[currentLocation] = helpMessages[currentLocation].replace("Maybe these dry grasses would be useful for something...<br/>", "");
                        break;
                    case "lamp":
                        helpMessages[currentLocation] = helpMessages[currentLocation].replace("Maybe this lamp will help somewhere...<br/>", "");
                        break;
                    case "notebook":
                        helpMessages[currentLocation] = helpMessages[currentLocation].replace("How could we get that notebook back to Alexandria?<br/>", "");
                        break;
                }
            
            
        }
        else {
            //Item is either not in items array or not at currentLocation
            gameMessage += "<strong>You can't take that.</strong>";
        }
    }
    else {
        //Item is empty, therefore not known
        gameMessage += "<strong>I don't know that item.</strong>";
    }
    
}

//Removes item from backpack and adds to items and item location
function dropItem() {
    //Check backpack contains items
    if (backpack.length > 0) {
        //Get item index
        var itemIndex = backpack.indexOf(item);

        //Check item is in backpack
        if (itemIndex != -1) {
            //Add item to items array and current location
            items.push(backpack[itemIndex]);
            itemLocations.push(currentLocation);

            //Set help message for location
            switch (item) {
                case "flint":
                    helpMessages[currentLocation] += "Those gray stones look helpful...<br/>";
                    break;
                case "tinder":
                    helpMessages[currentLocation] += "Maybe these dry grasses would be useful for something...<br/>";
                    break;
                case "lamp":
                    helpMessages[currentLocation] += "Maybe this lamp will help somewhere...<br/>";
                    break;
                case "notebook":
                    helpMessages[currentLocation] += "How could we get that notebook back to Alexandria?<br/>";
                    break;
            }
            //Remove item from backpack
            backpack.splice(itemIndex, 1);
        }
        else {
            //Item is not in backpack
            gameMessage += "<strong>You are not carrying that.</strong>";
        }
    }
    else {
        //Backpack is empty
        gameMessage += "<strong>You are not carrying anything.</strong>";
    }
}

//Uses item based on item and location
function useItem() {
    //check user has item
    if (backpack.indexOf(item) !== -1) {
        //switch on item
        switch (item) {
            case "tinder":
                gameMessage += "<em>This doesn't work so well by itself. Maybe something else can be used on it?</em>";
                break;
            case "flint":
                //Check user has tinder and lamp
                if (backpack.indexOf("tinder") != -1 && backpack.indexOf("lamp") != -1) {
                    gameMessage += "<em>The lamp is lit. Maybe you can go somewhere dark now...</em>";
                    //Tinder is used up. Remove from game
                    var tinder = backpack.indexOf("tinder");
                    backpack.splice(tinder, 1);
                    //Track whether lamp is lit
                    isLampLit = true;
                }
                else {
                    //User doesn't have necessary items
                    gameMessage += "<em>You are missing something to use this...</em>";
                }
                break;
            case "lamp":
                //Check lamp is lit
                if (isLampLit) {
                    //Check if at cave
                    if (currentLocation === 0) {
                        //Change location info
                        mapLocations[0] = "A large cave.";
                        images[0] = "caveLit.jpg";
                        sounds[0] = "caveLit.mp3";
                        helpMessages[0] = "How could we get that notebook back to Alexandria?<br/>";
                        //Add notebook to game at cave
                        items.push("notebook");
                        itemLocations.push(0);
                    }
                    else {
                        //If not at cave, do nothing
                        gameMessage += "<em>It's already light here.</em>";
                    }
                }
                else {
                    //Lamp is unlit and can't be used yet
                    gameMessage += "<em>The lamp is unlit. It gives out no light.</em>";
                }

                break;
            case "notebook":
                //Check if at plane
                if (currentLocation === 4) {
                    //Game won
                    gameMessage += "<em>You fly back to the Library of Alexandria.</em>";
                    endGame();
                }
                else {
                    //User not at plane. Do nothing.
                    gameMessage += "<em>You need to get this notebook back to the Library of Alexandria.</em>";
                }
                break;
            default:
                //Unknown item
                gameMessage += "<strong>I don't know that item.</strong>";
                break;
        }
    
        
    }
    else {
        gameMessage += "<strong>You don't have that item.</strong>";
    }
}

//Ends game
function endGame() {
    //Disable input and submit
    input.disabled = true;
    submit.disabled = true;
    //Display win message
    gameMessage += "<strong><em>You have won!</em></strong>";
    //Empty backpack
    while (backpack.length > 0) {
        backpack.pop();
    }
    /*Render is done by playGame()*/
}

//Saves game state using localStorage
function saveGame() {
    //Check localStorage is supported
    if(window.localStorage) { /*Used instead of if(typeof(localStorage !== undefined) because that does not
                                properly catch undefined localStorage in IE*/
        //Set localStorage items - arrays are stored joined as strings to prevent errors on retrieval
        //Arrays that can be empty are tested. If empty, an empty string is saved to test on load

        //Save Location
        localStorage.setItem("currentLocation", currentLocation);

        //Save backpack 
        if (backpack.length > 0) {
            var backpackItems = backpack.join(",");
            localStorage.setItem("backpack", backpackItems);
        }
        else {
            //If empty, store an empty string 
            localStorage.setItem("backpack", "");
        }
        
        //Save items
        if (items.length > 0) {
            var strItems = items.join(",");
            localStorage.setItem("items", strItems);
        }
        else {
            //If empty, store an empty string
            localStorage.setItem("items", "");
        }
        

        //Save item locations
        if (itemLocations.length > 0) {
            var strItemLocs = itemLocations.join(",");
            localStorage.setItem("itemLocations", strItemLocs);
        }
        else {
            //If empty, store and empty string
            localStorage.setItem("itemLocations", "");

        }
        

        //Save lamp state
        localStorage.setItem("lampLit", isLampLit);

        //Save map locations
        var strLocations = mapLocations.join(",");
        localStorage.setItem("locations", strLocations);

        //Save help messages
        var strHelpMessages = helpMessages.join(",");
        localStorage.setItem("helpMessages", strHelpMessages);

        //Save sounds
        var strSounds = sounds.join(",");
        localStorage.setItem("sounds", strSounds);

        //Save images
        var strImages = images.join(",");
        localStorage.setItem("images", strImages);

        //Alert saved properly if not resetting
        if (gameState !== "reset") {
            gameStateMessage = "Game saved successfully!";
        }

        
    }
    else {
        //Alert user local storage is not available
        gameStateMessage = "Saving not available in this browser.";
    }
    renderGameState();
}

//Loads saved game state
//All non-string values are parsed back to original type when loaded 
//to prevent problems when using strict equal (===)
function loadGame() {
    //Check local storage is supported
    if (window.localStorage) {
        //Enable buttons in case game was won
        submit.disabled = false;
        input.disabled = false;
        //Load currentLocation
        var location = localStorage.getItem("currentLocation");
        if (typeof (location) !== undefined) {
            currentLocation = parseInt(location);
        }
        //Load lamp state - must be parsed because all non-empty strings are treated as true
        var lampLit = localStorage.getItem("lampLit");
        if (typeof (lampLit) !== undefined) {
            if (lampLit === "false") {
                isLampLit = false;
            }
            else {
                isLampLit = true;
            }
            
        }
        //Load backpack
        var itemsInBackpack = localStorage.getItem("backpack");
        if (typeof (itemsInBackpack) !== undefined) {
            var backpackStr = itemsInBackpack.toString(); //convert to string to allow split()
            //Check backpack wasn't empty when saved
            if (backpackStr !== "") {
                //Convert back to array
                backpack = backpackStr.split(",");
            }
            else {
                //Array was empty on save, so empty it
                while (backpack.length > 0) {
                    backpack.pop();
                }
            }
            
        }

        //Load items
        var itemsInWorld = localStorage.getItem("items");
        if (typeof (itemsInWorld) !== undefined) {
            var itemsStr = itemsInWorld.toString();
            //Check array wasn't empty on save
            if (itemsStr !== "") {
                items = itemsStr.split(",");
            }
            else {
                //Items was empty on save, so empty it
                while (items.length > 0) {
                    items.pop();
                }
            }
            
        }

        //Load item locations
        var itemsLocs = localStorage.getItem("itemLocations");
        if (typeof (itemsLocs) !== undefined) {
            var itemLocsStr = itemsLocs.toString();
            if (itemLocsStr !== "") {
                //Split string to array and parse each value back to a number
                var itemLocationsStrArray = itemLocsStr.split(",");
                for (var i = 0; i < itemLocationsStrArray.length; i++) {
                itemLocations[i] = parseInt(itemLocationsStrArray[i]);
                }
            }
            else {
                //Item locations was empty on save, so empty it
                while (itemLocations.length > 0) {
                    itemLocations.pop();
                }
            }
            
        }
        
        //Load map locations
        var strLocations = localStorage.getItem("locations");
        if (typeof (strLocations) !== undefined) {
            var locations = strLocations.toString();
            mapLocations = locations.split(",");
        }

        //Load help messages
        var strHelpMessages = localStorage.getItem("helpMessages");
        if (typeof (strHelpMessages) !== undefined) {
            var messages = strHelpMessages.toString();
            helpMessages = messages.split(",");
        }

        //Load sounds
        var strSounds = localStorage.getItem("sounds");
        if (typeof (strSounds) !== undefined) {
            var soundsStr = strSounds.toString();
            sounds = soundsStr.split(",");
        }

        //Load images
        var strImages = localStorage.getItem("images");
        if (typeof (strImages) !== undefined) {
            var imagesStr = strImages.toString();
            images = imagesStr.split(",");
        }

        //Set game state message
        gameStateMessage = "Game loaded sucessfully!";
    }
    else {
        //Alert user local storage is not supported
        gameStateMessage = "Loading not available in this browser.";
    }
    //Reset gameMessage
    gameMessage = "";

    //Check if load was triggered by typed command
    if (action !== "load") {
        //Only renders on button click to prevent double render from playGame()
        render();
    }

    //Return focus to input
    input.focus();
    
}

//Resets game to original state and saves
function resetGame() {
    //hold old action to test if run by typed command
    var oldAction = action;

    //Re-enable buttons in case game was won
    input.disabled = false;
    submit.disabled = false;

    //Reset lamp state
    isLampLit = false;

    //Reset music state
    isPaused = false;

    //Reset cave to original state
    mapLocations[0] = "A dark cave. You can't see anything.";
    images[0] = "caveUnlit.jpg";
    sounds[0] = "caveUnlit.mp3";

    //Return to starting location
    currentLocation = 4;

    //Reset string variables
    gameMessage = "You are in the desert, searching for an explorer's lost journal. <br/>";
    item = "";
    action = "";

    //Reset help messages - all have to be reset because use of items may have changes all of them
    helpMessages[0] = "Maybe there's a way to see what's in that cave?<br/>";
    helpMessages[1] = "";
    helpMessages[2] = "";
    helpMessages[3] = "";
    helpMessages[4] = "Maybe this lamp will help somewhere...<br/>";
    helpMessages[5] = "";
    helpMessages[6] = "Maybe these dry grasses would be useful for something...<br/>";
    helpMessages[7] = "Those gray stones look helpful...<br/>";
    helpMessages[8] = "";

    //Reset item arrays
    items = ["flint", "tinder", "lamp"];
    itemLocations = [7, 6, 4];

    //Empty backpack
    while (backpack.length > 0) {
        backpack.pop();
    }

    //Set gameState
    gameState = "reset";
    gameStateMessage = "Game reset successfully!";

    //Save if local storage supported
    if (window.localStorage) {
        saveGame();
    }
    
    //Check old action to see if run by typed command to prevent double render from playGame()
    if (oldAction !== "reset") {
        //If run by button, reset help message and render
        helpMessage = "Try any of these words: " + wordsIKnow.join(", ") +
        " <br/> " + itemsIKnow.join(", ");
        render();
    }

    //Return focus to input
    input.focus();
    
}
