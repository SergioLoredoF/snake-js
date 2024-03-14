let snake = {
    head: [12,7],
    body: [[11,7]],
}

let footCord =  [(Math.floor(Math.random() * (20 - 2 + 1)) + 2), (Math.floor(Math.random() * (12 - 2 + 1)) + 2)]
console.warn("FoodCordInit: ", footCord)

let direction = 'right'
let newDirection = 'right';

let wropeUp = false

let initVelocity = 1000;

//si apretas arriba abajo es el pex

//listener de teclas asigna direccion
document.addEventListener('keydown', function(event) {
    const directionPush = {
        w:  direction != 'down'  ? 'up'   : 'down',
        s:  direction != 'up'    ? 'down' : 'up',
        a:  direction != 'right' ? 'left' : 'right',
        d:  direction != 'left'  ? 'right': 'left'
    }
    newDirection = directionPush[event.key]
  });

const newFoodCords = () => {
    // asigna con matematicas donde saldra la comida
    footCord =  [(Math.floor(Math.random() * (20 - 2 + 1)) + 2), (Math.floor(Math.random() * (12 - 2 + 1)) + 2)]
}

const calMoveHead = () => {
    //comprobar direccion
    if(direction === 'down'  && newDirection != 'up' )   direction = newDirection
    if(direction === 'up'    && newDirection != 'down')  direction = newDirection
    if(direction === 'right' && newDirection != 'left')  direction = newDirection
    if(direction === 'left'  && newDirection != 'right') direction = newDirection

    const move = {
        right : [(snake.head[0] + 1), snake.head[1]],
        left  : [(snake.head[0] - 1), snake.head[1]],
        up    : [snake.head[0], (snake.head[1] - 1)],
        down  : [snake.head[0], (snake.head[1] + 1)]
    }
    return move[direction]
}

const calMoveBody = () => {
    //se quita la cola y se añade a la cabeza

    let newBody = snake.body
    if(!wropeUp){
        newBody.shift()
    } else {
        wropeUp = false
    }
    newBody.push(snake.head)

    return newBody
}

const moveSnake = () => {
    //acomoda las coordenadas de la serpiente sumando uno en direccion
    //elimina ultimo cubo de cola y el ultimo arrelo de cuerpo se vuelve cola (usar slice)
    //Hacemos cabeza parte del cuerpo
    //snake.body.push(snake.head);
   
    //calculamos el cuerpo
    snake = { ...snake, body: calMoveBody() }
     //Creamos nueva cabeza en base al movimiento
     snake = { ...snake, head: calMoveHead() }
}

const eatFoodValidate = async () => {
    //valida que cabeza cordenada y comida coordenada sean iguales
    //Suma un cubito detras de la cabeza de la serpiente


    if(footCord.toString() === snake.head.toString()) {
        console.warn("Comiendo")
        await newFoodCords()
        wropeUp = true

        //Aumentamos la velocidad
        if(snake.body.length % 2 === 0 && initVelocity > 50){
            clearInterval(interval);
            
            if (initVelocity > 400 ){
                initVelocity = (initVelocity - 300)
                console.warn("Velocidad: ", initVelocity)
                interval = setInterval(() => {
                    //mueve snake y comprueba si come
                    moveSnake();
                    eatFoodValidate();
                    validateDie();
                    printScreen();
                }, initVelocity);
            } else if( initVelocity > 100) {
                initVelocity = (initVelocity - 50)
                console.warn("Velocidad: ", initVelocity)
                interval = setInterval(() => {
                    //mueve snake y comprueba si come
                    moveSnake();
                    eatFoodValidate();
                    validateDie();
                    printScreen();
                }, initVelocity);
            }else {
                console.warn("Velocidad: ", initVelocity)
                interval = setInterval(() => {
                    //mueve snake y comprueba si come
                    moveSnake();
                    eatFoodValidate();
                    validateDie();
                    printScreen();
                }, initVelocity);
            }
        }
    } 


}

const validateDie = () => {
    //valida que cabeza no tenga las mismas coordenadas del cuerpo
    //valida que cabeza no toque la periferia del tablero
    if(snake.head[0] === 1){
        document.getElementById("muerte").style.visibility = "visible";
        document.getElementById("puntaje").innerHTML = `Puntaje: ${snake.body.length}`
        clearInterval(interval);
    }
    if(snake.head[0] === 21){
        document.getElementById("muerte").style.visibility = "visible";
        document.getElementById("puntaje").innerHTML = `Puntaje: ${snake.body.length}`
        clearInterval(interval);
    }
    if(snake.head[1] === 1){
        document.getElementById("muerte").style.visibility = "visible";
        document.getElementById("puntaje").innerHTML = `Puntaje: ${snake.body.length}`
        clearInterval(interval);
    }
    if(snake.head[1] === 13){
        document.getElementById("muerte").style.visibility = "visible";
        document.getElementById("puntaje").innerHTML = `Puntaje: ${snake.body.length}`
        clearInterval(interval);
    }

    snake.body.forEach(item =>{
        if(item.toString() === snake.head.toString()){
            document.getElementById("muerte").style.visibility = "visible";
            document.getElementById("puntaje").innerHTML = `Puntaje: ${snake.body.length}`
            clearInterval(interval);
        }
    })

}

const printScreen = () => {
    //pinta cuerpo de la serpiente
    document.getElementById("escene").innerHTML = 
    `<div class="snake snake-head" style="grid-column-start: ${snake.head[0]}; grid-row-start: ${snake.head[1]}; border-radius:${
        direction === 'right' ? '0 30px 30px 0' :
        direction === 'left'  ? '30px 0 0 30px' :
        direction === 'up'    ? '30px 30px 0 0' :
        direction === 'down'  ? '0 0 30px 30px' : ''
    } ;" />`

    snake.body.forEach((item, index) => {
        document.getElementById("escene").innerHTML += 
            `<div class="snake snake-body" style="grid-column-start: ${item[0]}; grid-row-start: ${item[1]};" />`
    })

    document.getElementById("escene").innerHTML += 
    `<div class="food" style="grid-column-start: ${footCord[0]}; grid-row-start: ${footCord[1]};" />
    `

    document.getElementById("escene").innerHTML += 
    `
    <div class="wall" style="grid-column: 1 / 22; grid-row-start: 1;" />`
    document.getElementById("escene").innerHTML += 
    `<div class="wall" style="grid-column: 1 / 22; grid-row-start: 13;" />`

    document.getElementById("escene").innerHTML += 
    `    <div class="wall" style="grid-column-start: 1;  grid-row: 1 / 13;" />`

    document.getElementById("escene").innerHTML += 
    `    <div class="wall" style="grid-column-start: 21; grid-row: 1 / 13;" />`
}

let interval = setInterval(() => {
    //mueve snake y comprueba si come   
    moveSnake();
    eatFoodValidate();
    validateDie();
    printScreen();
}, initVelocity);


const gameAgain = () => {

    document.getElementById("muerte").style.visibility = "hidden";

    snake = {
        head: [12,7],
        body: [[11,7]],
    }
    
    footCord =  [(Math.floor(Math.random() * (20 - 2 + 1)) + 2), (Math.floor(Math.random() * (12 - 2 + 1)) + 2)]
    console.warn("FoodCordInit: ", footCord)
    
    direction = 'right'
    
    wropeUp = false
    initVelocity = 1000
   
    interval = setInterval(() => {
        //mueve snake y comprueba si come
        moveSnake();
        eatFoodValidate();
        validateDie();
        printScreen();
    }, initVelocity);
}