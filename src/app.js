const obj = document.querySelector(".obj");

//speed of the object moving
let speed = 500;

//Store currently pressed keys
const activeKeys = new Set();

//Store the current position of the object
const currentPosition = {
    x: 0,
    y: 0
};



document.addEventListener("DOMContentLoaded", () => {
    setPosition(
        screen.availWidth / 2,
        screen.availHeight /2
    );
    window.addEventListener("keydown", e => {
        activeKeys.add(e.code);
    });
    
    window.addEventListener("keyup", e => {
        activeKeys.delete(e.code);
    });

    window.addEventListener("click", e=> {
        setPosition(e.x, e.y)
    });
    
    requestAnimationFrame(loop);
});

//check if the key is currently being pressed
const isKeyPressed = (code) => activeKeys.has(code);





//used to track when the last render happened
let lastTime = 0;

//render loop with delta time
function loop(currentTime){
    const delta = (currentTime - lastTime) / 1000;
    update(delta);
    lastTime = currentTime;
    requestAnimationFrame(loop);
}



//handle input
const input = {
    //non-normalized input value
    getInputDirection(){
        let inputX = 0;
        let inputY = 0;
        if(isKeyPressed("ArrowRight")){
            inputX = 1;
        }
        if(isKeyPressed("ArrowLeft")){
            inputX = -1;
        }
        if(isKeyPressed("ArrowUp")){
            inputY = 1;
        }
        if(isKeyPressed("ArrowDown")){
            inputY = -1;
        }
        
        return {
            x:inputX,
            y:inputY
        }
    },
    //used to get a normalized value to prevent going faster when multiple keys are pressed
    normalized(){
        const currentInput = this.getInputDirection();
        const magnitude = Math.hypot(currentInput.x, currentInput.y);
        if(magnitude === 0){
            return {x : 0, y:0, magnitude: 0}
        }
        return {
            x: currentInput.x / magnitude,
            y: currentInput.y / magnitude,
            magnitude: magnitude
        };
    }
};


//triggered every render
function update(delta){
    //normalized input
    const currentInput = input.normalized();

    //dont do anything if nothing is pressed
    if(currentInput.magnitude <= 0){
        return;
    }
    moveObject(currentInput, delta);

}


function moveObject(direction, delta){

    currentPosition.x += (direction.x * delta) * speed;
    currentPosition.y += (direction.y * delta) * speed;
    
    clampObject();

    obj.style.bottom = `${currentPosition.y}px`;
    obj.style.left = `${currentPosition.x}px`
}

//Directly set the position of the object
function setPosition(x,y){

    //since we are using style.bottom we have to subtract from the top of the screen
    const desiredY = (screen.availHeight - 32) - y;
    const desiredX = x;

    //update the objects position state, so it does not desync with the UI
    currentPosition.y = desiredY;
    currentPosition.x = desiredX;

    obj.style.bottom = `${desiredY}px`;
    obj.style.left = `${desiredX}px`;
}

//prevents object from going out of bounds
function clampObject(){
    if(currentPosition.x > screen.width){
        currentPosition.x = 0;
    }
    if(currentPosition.x < 0){
        currentPosition.x = screen.width;
    }
    if(currentPosition.y > screen.availHeight){
        currentPosition.y = 0;
    }
    if(currentPosition.y < 0){
        currentPosition.y = screen.availHeight;
    }
}


//get the position of the object and parse it
function getPosition(){
    const style = getComputedStyle(obj);
    return{
        x: parseFloat(style.left),
        y: parseFloat(style.bottom)
    }
}

