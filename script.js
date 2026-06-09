const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// PIXEL PERFECT
ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;


const playerWidth = 64;
const playerHeight = 160;

const speed = 2;

const diagonalX = 2;
const diagonalY = 1;

const keys = {};

const bagButton =
    document.getElementById("bag_button");

bagButton.addEventListener("click", () => {

    if (DialogSystem.isActive()) return;

    TerminalSystem.toggle();

});

let pinMode = false;
let currentDoor = null;
let enteredPin = "";

const maps = {

  dulce_house: {
    background: "background2.png",
    width: 1920,
    height: 1600,
    collisions: [

      [32, 640, 384, 32],
      [544, 640, 256, 32],
      [32, 1056, 1088, 32],
      [1120, 640, 32, 416],
      [256, 160, 32, 288],
      [672, 160, 32, 288],
      [416, 96, 128, 32],
      [384, 512, 32, 128],
      [544, 512, 32, 128],
      [800, 624, 16, 16],
      [832, 608, 16, 16],
      [864, 592, 16, 16],
      [ 896, 576, 16, 16],
      [ 928, 560, 16, 16],

    ],
    interactions: [

      {
        x: 400,
        y: 300,
        width: 64,
        height: 160,
        text:
          "MOM: A lot of strange things have been happening these past few days. I've heard rumors that animals have been getting sick. Take good care of your pet!.\n\n\nDULCE: Sure, it´s my best friend."
      },

      {
        x: 416,
        y: 1056,
        width: 128,
        height: 32,
        text: "This door is sealed by a mystery force."
      }

    ],
items: [

    {
        itemId: "key_001",
        x: 900,
        y: 700,
        width: 32,
        height: 32
    },

    {
        itemId: "key_002",
        x: 200,
        y: 300,
        width: 32,
        height: 32
    }

],

    doors: [

  {
    x: 864,
    y: 608,
    width: 64,
    height: 32,

    targetMap: "dulce_kitchen",

   spawnX: 448,
   spawnY: 448,

   requiredPin: "1234"


  },
  {
    x: 576,
    y: 144,
    width: 64,
    height: 32,

    targetMap: "dulce_room",

   spawnX: 448,
   spawnY: 448,

  requiredPin: "2345"
  }

]

  },

dulce_kitchen: {
    background: "background3.png",
    width: 960,
    height: 800,
    collisions: [
    ],
    interactions: [],
    doors: [

  {
    x: 448,
    y: 608,
    width: 64,
    height: 32,

    targetMap: "dulce_house",

   spawnX: 864,
   spawnY: 608
  }

],items: [],

  },

  dulce_room: {
    background: "background3.png",
    width: 960,
    height: 800,
    collisions: [
    ],
    interactions: [],
    doors: [

  {
    x: 448,
    y: 608,
    width: 64,
    height: 32,

    targetMap: "dulce_house",

   spawnX: 576,
   spawnY: 148

  }

],items: [],

  }
};


let currentMap = "dulce_house";
let currentItem = null;

let bgWidth = maps[currentMap].width;
let bgHeight = maps[currentMap].height;

const background = new Image();
background.src = maps[currentMap].background;

const playerSprite = new Image();
playerSprite.src = "Spritesheet.png";

let bgX = -(bgWidth / 2 - canvasWidth / 2);
let bgY = -(bgHeight / 2 - canvasHeight / 2);

let centerX = (canvasWidth - playerWidth) / 2;
let centerY = (canvasHeight - playerHeight) / 2;

let playerX = centerX;
let playerY = centerY;

let directionIndex = 4;

let frame = 0;
let frameTimer = 0;

const frameSpeed = 16;

const maxWalkFrame = 7;
const maxIdleFrame = 3;

// TECLAS

let accessDenied = false;
let transitionLock = false;

window.addEventListener("keydown", (e) => {

   if (transitionLock) {
        return;
    }

  const key = e.key.toLowerCase();
  keys[key] = true;

  if (TerminalSystem.isActive()) {
    return;
}

  if (key === "l") {

    const playerRect = {

      x: playerX - bgX,
      y: playerY - bgY,
      width: playerWidth,
      height: playerHeight

    };


    if (currentItem) {

    const itemData = ItemDatabase[currentItem.itemId];

    if (!itemData) {
        console.log("ITEM DATA NOT FOUND:", currentItem.itemId);
        return;
    }

    InventorySystem.addItem(itemData);

    console.log("ITEM PICKED:", itemData.name);

    maps[currentMap].items =
        maps[currentMap].items.filter(item =>
            item !== currentItem
        );

    currentItem = null;

    return;
}

    // BUSCAR PUERTA

    const door = maps[currentMap].doors.find(door =>

      playerRect.x < door.x + door.width &&
      playerRect.x + playerRect.width > door.x &&
      playerRect.y < door.y + door.height &&
      playerRect.y + playerRect.height > door.y

    );

    if (door) {

if (
    door.requiredPin &&
    !InventorySystem.hasPin(
        door.requiredPin
    )
) {

    DialogSystem.toggle(
        "ACCESS DENIED",
        ctx
    );

    return;
}
      
        changeMap(
          door.targetMap,
          door.spawnX,
          door.spawnY
        );

        return;
      
    }

    // NPCs / zonas interactuables

    const zone = maps[currentMap].interactions.find(zone => {

      const touchingHorizontally =

        playerRect.y + playerRect.height > zone.y &&
        playerRect.y < zone.y + zone.height &&

        (

          Math.abs(
            playerRect.x +
            playerRect.width -
            zone.x

          ) <= 4 ||

          Math.abs(

            playerRect.x -
            (zone.x + zone.width)

          ) <= 4

        );

      const touchingVertically =

        playerRect.x + playerRect.width > zone.x &&
        playerRect.x < zone.x + zone.width &&

        (

          Math.abs(

            playerRect.y +
            playerRect.height -
            zone.y

          ) <= 4 ||

          Math.abs(

            playerRect.y -
            (zone.y + zone.height)

          ) <= 4

        );

      return (
        touchingHorizontally ||
        touchingVertically
      );

    });

    if (zone) {

      DialogSystem.toggle(
        zone.text || "Sin texto",
        ctx
      );

    }
  }



});






window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});


canvas.addEventListener(
    "click",
    (e) => {

        if (!TerminalSystem.isActive())
            return;

        console.log(
            e.offsetX,
            e.offsetY
        );

    }
);

// DIRECCIÓN
function getDirection() {

  const up = keys["arrowup"] || keys["w"];
  const down = keys["arrowdown"] || keys["s"];
  const left = keys["arrowleft"] || keys["a"];
  const right = keys["arrowright"] || keys["d"];

  if (up && right) return 1;
  if (right && down) return 3;
  if (down && left) return 5;
  if (left && up) return 7;

  if (up) return 0;
  if (right) return 2;
  if (down) return 4;
  if (left) return 6;

  return -1;
}
function changeMap(mapName, spawnX = null, spawnY = null) {

  currentMap = mapName;

  bgWidth = maps[currentMap].width;
  bgHeight = maps[currentMap].height;

  background.src = maps[currentMap].background;

  if (spawnX === null || spawnY === null) {
    spawnX = bgWidth / 2 - playerWidth / 2;
    spawnY = bgHeight / 2 - playerHeight / 2;
  }

  bgX = -(spawnX - canvasWidth / 2 + playerWidth / 2);
  bgY = -(spawnY - canvasHeight / 2 + playerHeight / 2);

  bgX = Math.min(0, Math.max(canvasWidth - bgWidth, bgX));
  bgY = Math.min(0, Math.max(canvasHeight - bgHeight, bgY));

  playerX = spawnX + bgX;
  playerY = spawnY + bgY;

  CollisionSystem.clear();

  if (maps[currentMap].collisions) {
    maps[currentMap].collisions.forEach(collision => {
      CollisionSystem.add(
        collision[0],
        collision[1],
        collision[2],
        collision[3]
      );
    });
  }

  if (maps[currentMap].interactions) {
    maps[currentMap].interactions.forEach(zone => {
      CollisionSystem.add(
        zone.x,
        zone.y,
        zone.width,
        zone.height
      );
    });
  }

  currentItem = null;
}

// UPDATE
function update() {



  
if (
    DialogSystem.isActive() ||
    TerminalSystem.isActive()
) return;

  let moved = false;

  const dir = getDirection();

  if (dir !== -1) {
    directionIndex = dir;
  }

  const futureRect = {
    x: playerX - bgX,
    y: playerY - bgY,
    width: playerWidth,
    height: playerHeight
  };

  // MOVIMIENTO + COLISIONES
  if (dir !== -1) {

    if ([0, 1, 7].includes(dir)) futureRect.y -= speed;
    if ([3, 4, 5].includes(dir)) futureRect.y += speed;

    if ([1, 2, 3].includes(dir)) futureRect.x += speed;
    if ([5, 6, 7].includes(dir)) futureRect.x -= speed;

    if (!CollisionSystem.check(futureRect)) {

let moveX = 0;
let moveY = 0;

switch (dir) {

  case 0:
    moveY = -speed;
    break;

  case 1:
    moveX = diagonalX;
    moveY = -diagonalY;
    break;

  case 2:
    moveX = speed;
    break;

  case 3:
    moveX = diagonalX;
    moveY = diagonalY;
    break;

  case 4:
    moveY = speed;
    break;

  case 5:
    moveX = -diagonalX;
    moveY = diagonalY;
    break;

  case 6:
    moveX = -speed;
    break;

  case 7:
    moveX = -diagonalX;
    moveY = -diagonalY;
    break;
}

// MOVIMIENTO VERTICAL

if (moveY < 0) {

  if (bgY < 0 && Math.abs(playerY - centerY) <= 2) {
    bgY -= moveY;
  }
  else if (playerY > 0) {
    playerY += moveY;
  }

}
else if (moveY > 0) {

  if (bgY > canvasHeight - bgHeight && Math.abs(playerY - centerY) <= 2) {
    bgY -= moveY;
  }
  else if (playerY + playerHeight < canvasHeight) {
    playerY += moveY;
  }
}

// MOVIMIENTO HORIZONTAL

if (moveX > 0) {

  if (bgX > canvasWidth - bgWidth && Math.abs(playerX - centerX) <= 2) {
    bgX -= moveX;
  }
  else if (playerX + playerWidth < canvasWidth) {
    playerX += moveX;
  }

}
else if (moveX < 0) {

  if (bgX < 0 && Math.abs(playerX - centerX) <= 2) {
    bgX -= moveX;
  }
  else if (playerX > 0) {
    playerX += moveX;
  }
}

moved = true;
     
    }
  }

  // LIMITES
  bgX = Math.min(0, Math.max(canvasWidth - bgWidth, bgX));
  bgY = Math.min(0, Math.max(canvasHeight - bgHeight, bgY));

  playerX = Math.max(0, Math.min(canvasWidth - playerWidth, playerX));
  playerY = Math.max(0, Math.min(canvasHeight - playerHeight, playerY));

  const playerWorldRect = {
  x: playerX - bgX,
  y: playerY - bgY,
  width: playerWidth,
  height: playerHeight
};

const item = (maps[currentMap].items || []).find(item =>

  playerWorldRect.x < item.x + item.width &&
  playerWorldRect.x + playerWorldRect.width > item.x &&
  playerWorldRect.y < item.y + item.height &&
  playerWorldRect.y + playerWorldRect.height > item.y

);



if (item) {

    console.log("ITEM DETECTED:", item.itemId);
    currentItem = item;

} else {

    currentItem = null;

}


const door = maps[currentMap].doors.find(door =>

  playerWorldRect.x < door.x + door.width &&
  playerWorldRect.x + playerWorldRect.width > door.x &&
  playerWorldRect.y < door.y + door.height &&
  playerWorldRect.y + playerWorldRect.height > door.y

);
// Busca esto casi al final de tu función update():


  // ANIMACIÓN
  if (frameTimer++ >= frameSpeed) {

    frameTimer = 0;

    if (moved) {
      frame = (frame + 1) % (maxWalkFrame + 1);
    }
    else {
      frame = ((frame - 8 + 1 + maxIdleFrame + 1) % (maxIdleFrame + 1)) + 8;
    }
  }
}

// DRAW
function draw() {

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const drawBgX = Math.round(bgX);
  const drawBgY = Math.round(bgY);

  const drawPlayerX = Math.round(playerX);
  const drawPlayerY = Math.round(playerY);

  const sx = (frame % 12) * playerWidth;
  const sy = directionIndex * playerHeight;

  // BACKGROUND
  ctx.drawImage(
    background,
    drawBgX,
    drawBgY
  );

  // PLAYER
  ctx.drawImage(
    playerSprite,
    sx,
    sy,
    playerWidth,
    playerHeight,
    drawPlayerX,
    drawPlayerY,
    playerWidth,
    playerHeight
  );

  // DEBUG COLLISIONS
  CollisionSystem.debugDraw(
    ctx,
    drawBgX,
    drawBgY
  );

  // ZONAS
  ctx.fillStyle = "rgba(0,255,0,0.3)";

 (maps[currentMap].items || []).forEach(zone => {

    ctx.fillRect(
      Math.round(zone.x + bgX),
      Math.round(zone.y + bgY),
      zone.width,
      zone.height
    );

  });

 // DOORS
ctx.fillStyle = "rgba(255,0,0,0.3)";

maps[currentMap].doors.forEach(door => {

    ctx.fillRect(
        Math.round(door.x + bgX),
        Math.round(door.y + bgY),
        door.width,
        door.height
    );

});

// ITEMS
ctx.fillStyle = "yellow";

maps[currentMap].items.forEach(item => {

    ctx.fillRect(
        Math.round(item.x + bgX),
        Math.round(item.y + bgY),
        item.width,
        item.height
    );

});

  // DIALOG
  DialogSystem.draw(
    ctx,
    canvasWidth,
    canvasHeight - 32
  );

  // TERMINAL
  TerminalSystem.draw(
    ctx,
    canvasWidth,
    canvasHeight
  );
} //Aqui termina draw




// LOOP
function gameLoop() {

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

// INICIO DEL JUEGO
background.onload = () => {
  playerSprite.onload = () => {

    // Ejecutamos changeMap manualmente por primera vez.
    // Esto cargará el fondo inicial ("dulce_house") y sus colisiones de forma automática.
    changeMap(currentMap, bgWidth / 2, bgHeight / 2);

    // Arrancamos el bucle del juego
    gameLoop();
  };
};