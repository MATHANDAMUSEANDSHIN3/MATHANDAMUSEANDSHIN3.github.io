const SCALE = 1;
const WIDTH = 64;
const HEIGHT = 146;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const CYCLE_LOOP = [0, 1, 2, 3];
const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 3;
const FACING_RIGHT = 2;
const FRAME_LIMIT = 12;
const MOVEMENT_SPEED = 1;

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let keyPresses = {};
let currentDirection = FACING_DOWN;
let currentLoopIndex = 0;
let frameCount = 0;
let positionX = canvas.width / 2 - 32;
let positionY = canvas.height / 2 - 73;
let img = new Image();


window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}


function loadImage() {
    img.src = 'https://64.media.tumblr.com/bc0afbc5e79b9e3e39231a5756963912/41182f575a3601b9-57/s400x600/2ff9c1fe257221e47dcbb06b36790947e3ff9f65.png';
    img.onload = function () {
        window.requestAnimationFrame(gameLoop);
    };
}




function drawFrame(frameX, frameY, canvasX, canvasY) {
    ctx.drawImage(img,
        frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
        canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
}

loadImage();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let hasMoved = false;




    if (keyPresses.w || keyPresses.W) {
        moveCharacter(0, -MOVEMENT_SPEED, FACING_UP);
        hasMoved = true;
    } else if (keyPresses.s || keyPresses.S) {
        moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN);
        hasMoved = true;
    }

    if (keyPresses.a || keyPresses.A) {
        moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
        hasMoved = true;
    } else if (keyPresses.d || keyPresses.D) {
        moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
        hasMoved = true;
    }

    if (hasMoved) {
        frameCount++;
        if (frameCount >= FRAME_LIMIT) {
            frameCount = 0;
            currentLoopIndex++;
            if (currentLoopIndex >= CYCLE_LOOP.length) {
                currentLoopIndex = 0;
            }
        }
    }

    if (!hasMoved) {
        currentLoopIndex = 0;
    }

    drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
    window.requestAnimationFrame(gameLoop);
}

function moveCharacter(deltaX, deltaY, direction) {
    if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
        positionX += deltaX;
    }
    if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
        positionY += deltaY;
    }
    currentDirection = direction;
}








function changeImage() {
    var image = document.getElementById('myImage');
    if (image.src.match("https://64.media.tumblr.com/6810f1526468fc88d759cd7641a100c5/d1117f419c14ea35-55/s1280x1920/30fcd5960ee8e9ec31404d5639f642b0399845de.gifv")) {
        image.src = "https://64.media.tumblr.com/811947af7192b9394e60172ca4671b4c/5b6d7c03c8f7709a-c6/s1280x1920/6f17bb2ef962a786db09053d5ccd90d9403072a0.png";
        document.getElementById("form").style.display = "none";
    } else {
        image.src = "https://64.media.tumblr.com/6810f1526468fc88d759cd7641a100c5/d1117f419c14ea35-55/s1280x1920/30fcd5960ee8e9ec31404d5639f642b0399845de.gifv";
        document.getElementById("form").style.display = "block";
        document.getElementById('intro').value = '';
        document.getElementById("intro").focus();
        document.getElementById("intro").addEventListener("keypress", function (event) {
            if (event.key === "Enter") {  // Comprobamos si la tecla presionada es Enter
                event.preventDefault();  // Prevenimos el comportamiento por defecto (enviar el formulario)
                let input = document.getElementById("intro");
                input.value = input.value.toUpperCase();  // Convertimos el valor a mayúsculas antes de enviar
                document.getElementById("intro").submit();  // Enviamos el formulario
            }
        });
        document.getElementById("caret").innerHTML = "■";

    }
}



//Aqui empieza el script de la consola 

document.getElementById("prompt").innerHTML = ">";
document.getElementById("chapter1").innerHTML = "";
document.getElementById('myBtn').style.display = 'none';
document.getElementById('myBtn2').style.display = 'none';
document.getElementById('myBtn3').style.display = 'none';
document.getElementById('myBtn4').style.display = 'none';
document.getElementById('myBtn5').style.display = 'none';
document.getElementById('myBtn6').style.display = 'none';
document.getElementById('myBtn7').style.display = 'none';
document.getElementById('password').style.display = 'none';
document.getElementById('password2').style.display = 'none';
document.getElementById('user').style.display = 'none';
document.getElementById('command_line').style.display = 'none';
document.getElementById('command_line2').style.display = 'none';
document.getElementById("intro").focus();
//document.getElementById("intro").placeholder = document.getElementById("caret").innerHTML = "■";


var intro = document.getElementById("intro");
var user = document.getElementById("user");
var password = document.getElementById("password");
var password2 = document.getElementById("password2");
var command_line = document.getElementById("command_line");
var command_line2 = document.getElementById("command_line2");


intro.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("myBtn").click();
        let intro = document.getElementById("intro").value


        switch (intro) {

            case "LOGIN":
            case "login":
                document.getElementById("prompt").innerHTML = "USERNAME>";
                document.getElementById('intro').value = '';
                document.getElementById('intro').style.display = 'none';
                document.getElementById('password').style.display = 'none';
                document.getElementById("password").addEventListener("keypress", function (event) {
                    if (event.key === "Enter") {  // Comprobamos si la tecla presionada es Enter
                        event.preventDefault();  // Prevenimos el comportamiento por defecto (enviar el formulario)
                        let input = document.getElementById("password");
                        input.value = input.value.toUpperCase();  // Convertimos el valor a mayúsculas antes de enviar
                        document.getElementById("password").submit();  // Enviamos el formulario
                    }
                });
                document.getElementById('password2').style.display = 'none';
                document.getElementById("password2").addEventListener("keypress", function (event) {
                    if (event.key === "Enter") {  // Comprobamos si la tecla presionada es Enter
                        event.preventDefault();  // Prevenimos el comportamiento por defecto (enviar el formulario)
                        let input = document.getElementById("password2");
                        input.value = input.value.toUpperCase();  // Convertimos el valor a mayúsculas antes de enviar
                        document.getElementById("password2").submit();  // Enviamos el formulario
                    }
                });
                document.getElementById('command_line').style.display = 'none';
                document.getElementById("command_line").addEventListener("keypress", function (event) {
                    if (event.key === "Enter") {  // Comprobamos si la tecla presionada es Enter
                        event.preventDefault();  // Prevenimos el comportamiento por defecto (enviar el formulario)
                        let input = document.getElementById("command_line");
                        input.value = input.value.toUpperCase();  // Convertimos el valor a mayúsculas antes de enviar
                        document.getElementById("command_line").submit();  // Enviamos el formulario
                    }
                });
                document.getElementById('user').style.display = 'inline';
                document.getElementById("user").focus();
                document.getElementById("user").addEventListener("keypress", function (event) {
                    if (event.key === "Enter") {  // Comprobamos si la tecla presionada es Enter
                        event.preventDefault();  // Prevenimos el comportamiento por defecto (enviar el formulario)
                        let input = document.getElementById("user");
                        input.value = input.value.toUpperCase();  // Convertimos el valor a mayúsculas antes de enviar
                        document.getElementById("user").submit();  // Enviamos el formulario
                    }
                });
                break;

            case "HELP":
            case "help":
                document.getElementById("prompt").innerHTML = "If this is an actual plea for help in response to a hazardous material spill, an explosion, a fire on your person, radiation poisoning, a chocking gas for unknown origin, eye trauma resulting from the use of an emergency eye wash station on floors three, four, or eleven, an animal malfunction, or any other injurius experimental equipment failure, please remain at your workstation. A Crisis Response Team has already been mobilized to deliberate on a response to your crisis.<br><br>If you need help accessing the system, please refer to your User Handbook. <br><br> >";
                document.getElementById('intro').value = '';
                document.getElementById('intro').style.display = 'inline';
                document.getElementById('password').style.display = 'none';
                document.getElementById('password2').style.display = 'none';
                document.getElementById('command_line').style.display = 'none';
                document.getElementById("intro").focus();
                break;

            case "LOGOUT":
            case "logout":
            case "LOGOFF":
            case "logoff":
            case "EXIT":
            case "exit":
            case "BYE":
            case "bye":
                var image = document.getElementById('myImage');
                image.src = "https://64.media.tumblr.com/811947af7192b9394e60172ca4671b4c/5b6d7c03c8f7709a-c6/s1280x1920/6f17bb2ef962a786db09053d5ccd90d9403072a0.png";
                document.getElementById("form").style.display = "none";
                break;


            default:
                document.getElementById("prompt").innerHTML = ">";
                document.getElementById('intro').value = '';
                break;

        } return;
    }
});

user.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("myBtn2").click();
        let user = document.getElementById("user").value


        if (user == "ADMIN" || user == "admin") {
            document.getElementById("prompt").innerHTML = "PASSWORD>";
            document.getElementById('intro').value = '';
            document.getElementById('intro').style.display = 'none';

            document.getElementById('user').value = '';
            document.getElementById('user').style.display = 'none';
            document.getElementById('command_line').style.display = 'none';
            document.getElementById('password2').style.display = 'none';
            document.getElementById('password').style.display = 'inline';
            document.getElementById('password').value = '';
            document.getElementById("password").focus();

        }
        else {
            document.getElementById("prompt").innerHTML = "PASSWORD>";
            document.getElementById('password2').style.display = 'inline';
            document.getElementById('password2').value = '';
            document.getElementById("password2").focus();
            document.getElementById('password').style.display = 'none';
            document.getElementById('user').value = '';
            document.getElementById('user').style.display = 'none';
            document.getElementById('intro').style.display = 'none';
            document.getElementById('command_line').style.display = 'none';
        }
    }
});

password.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("myBtn3").click();
        let password = document.getElementById("password").value


        if (password == "pass" || password == "PASS") {
            document.getElementById("prompt").innerHTML = "ADMIN:/>";
            document.getElementById('password').style.display = 'none';
            document.getElementById('password2').style.display = 'none';

            document.getElementById('command_line').style.display = 'inline';
            document.getElementById("command_line").focus();
        }
        else {
            document.getElementById("prompt").innerHTML = "ERROR 07 [INCORRECT PASSWORD]<br><br> PASSWORD>";
            document.getElementById('password').value = '';
            document.getElementById("password").focus();
            document.getElementById('intro').style.display = 'none';
            document.getElementById('user').style.display = 'none';
            document.getElementById('command_line').style.display = 'none';
            document.getElementById('password2').style.display = 'none';

        }
    }
});


password2.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("myBtn4").click();
        let password2 = document.getElementById("password2").value


        if (password2 == "pass2" || password2 == "PASS2") {
            document.getElementById("prompt").innerHTML = "B:/>";
            document.getElementById('password').style.display = 'none';
            document.getElementById('password2').style.display = 'none';

            document.getElementById('command_line2').style.display = 'inline';
            document.getElementById("command_line2").focus();
            document.getElementById("command_line2").addEventListener("keypress", function (event) {
                if (event.key === "Enter") {  // Comprobamos si la tecla presionada es Enter
                    event.preventDefault();  // Prevenimos el comportamiento por defecto (enviar el formulario)
                    let input = document.getElementById("command_line2");
                    input.value = input.value.toUpperCase();  // Convertimos el valor a mayúsculas antes de enviar
                    document.getElementById("command_line2").submit();  // Enviamos el formulario
                }
            });
        }
        else {
            document.getElementById("prompt").innerHTML = "ERROR 07 [INCORRECT PASSWORD]<br><br> PASSWORD>";
            document.getElementById('password2').value = '';
            document.getElementById("password2").focus();
            document.getElementById('intro').style.display = 'none';
            document.getElementById('user').style.display = 'none';
            document.getElementById('command_line').style.display = 'none';
            document.getElementById('password').style.display = 'none';

        }
    }
});

//ADMIN
command_line.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("myBtn5").click();
        let command_line = document.getElementById("command_line").value

        switch (command_line) {

            case "IP":
            case "ip":
                document.getElementById("prompt").innerHTML = "UID: c69bcbee7d14abbfb7bd18970baaa44f863d2653dff68b3de85a6eedc4c6b<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "APPEND":
            case "append":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "ATTRIB":
            case "attrib":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "TAPEDISK":
            case "tapedisk":
                document.getElementById("prompt").innerHTML = "ERROR 18 [USER NOT AUTHORIZED TO TRANSFER SYSTEM TAPES] <br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "COPY":
            case "copy":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "DIR":
            case "dir":
            case "LS":
            case "ls":
            case "CAT":
            case "cat":
            case "LIST":
            case "list":
            case "DIRECTORY":
            case "directory":
            case "CATALOG":
            case "catalog":
                document.getElementById("prompt").innerHTML = "DISK VOLUME 255 [ADMIN WORKSTATION] <br><br> 2 FILE(S) IN 23 BLOCKS<br><br> I 019 APPLY.EXE <br>I 004 NOTES.EXE <br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "ERASE":
            case "erase":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "FORMAT":
            case "format":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "INTERROGATE":
            case "interrogate":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "PLAY":
            case "play":
                document.getElementById("prompt").innerHTML = "ERROR 02 [COMMAND MUST HAVE A PARAMETER]<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "RENAME":
            case "rename":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "THECAKEISALIE":
            case "thecakeisalie":
                document.getElementById("prompt").innerHTML = "When was the last time you left the building?<br>Has anybody left the building lately?<br>I don't know why we're in lockdown. I don't know who's in charge.<br>I did find out a few things, like these terminals don't have to<br>tap out characters one at a time. And while we're all working<br>on twenty year old equipment, somehow they can afford to build<br>an 'Enrichment Center'. Check out this security feed.<br>Whatever the hell a 'relaxation vault' is, it<br>doesn't have any doors.<br><br>I don't think going home is part of our job description anymore.<br>If a supervisor walks by, press return!<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;


            case "HELP":
            case "help":
            case "LIB":
            case "lib":
                document.getElementById("prompt").innerHTML = "APPEND<br> ATTRIB<br> COPY<br> DIR<br> ERASE<br> FORMAT<br> INTERROGATE<br> LIB<br> NOTES<br> PLAY<br> RENAME<br> TAPEDISK <br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break;

            case "LOGOUT":
            case "logout":
            case "LOGOFF":
            case "logoff":
            case "EXIT":
            case "exit":
            case "BYE":
            case "bye":
                document.getElementById("prompt").innerHTML = ">";
                document.getElementById('command_line').value = '';
                document.getElementById('command_line2').style.display = 'none';
                document.getElementById('intro').style.display = 'inline';
                document.getElementById('intro').value = '';
                document.getElementById("intro").focus();
                var image = document.getElementById('myImage');
                image.src = "https://64.media.tumblr.com/811947af7192b9394e60172ca4671b4c/5b6d7c03c8f7709a-c6/s1280x1920/6f17bb2ef962a786db09053d5ccd90d9403072a0.png";
                document.getElementById("form").style.display = "none";

                break;

            case "NOTES":
            case "notes":
                document.getElementById("prompt").innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consequat magna ut velit iaculis convallis id ac lectus. Donec mi nunc, malesuada ut aliquet nec, convallis vitae dolor. Morbi egestas id mauris id scelerisque. Nullam non lacinia ipsum, non vehicula metus. Nullam scelerisque risus sed urna convallis facilisis. <br><br> Proin at semper nisi. Praesent sed iaculis enim. Aenean vitae malesuada lectus, quis placerat neque. Nullam porta justo mauris, ut porttitor sapien dignissim at. Suspendisse nec velit id erat viverra consequat. Vestibulum vitae laoreet nisl. Pellentesque vehicula laoreet ante sed sollicitudin. Cras luctus vitae metus eu iaculis. Morbi metus turpis, euismod id eleifend ut, ultricies et libero. Phasellus fringilla accumsan laoreet.<br><br>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consequat magna ut velit iaculis convallis id ac lectus. Donec mi nunc, malesuada ut aliquet nec, convallis vitae dolor. Morbi egestas id mauris id scelerisque. Nullam non lacinia ipsum, non vehicula metus. Nullam scelerisque risus sed urna convallis facilisis. <br><br> Proin at semper nisi. Praesent sed iaculis enim. Aenean vitae malesuada lectus, quis placerat neque. Nullam porta justo mauris, ut porttitor sapien dignissim at. Suspendisse nec velit id erat viverra consequat. Vestibulum vitae laoreet nisl. Pellentesque vehicula laoreet ante sed sollicitudin. Cras luctus vitae metus eu iaculis. Morbi metus turpis, euismod id eleifend ut, ultricies et libero. Phasellus fringilla accumsan laoreet.<br><br> [MORE]";
                document.getElementById('command_line').style.display = 'none';

                break;

            case "APPLY":
            case "apply":
                document.getElementById("prompt").innerHTML = "Loaded: ENRICHMENT CENTER TEST SUBJECT APPLICATION PROCESS<br><br>Form: FORMS-EN-2873-FORM (PART1: PERSONALIY & GENERAL KNOWLEEDGE)<br><br>If you are a first time applicant, please type \u0022CONTINUE\u0022.<br><br>DISREGARD THIS INSTRUCTION if you are returning to form FORMS-EN-2873-FORM after a break of any duration for any<br>reason. In that case, you MUST contact your supervisor before proceeding.Your<br>supervisor will solicit your Authorized Administrative Unit for an affirmative injunction to<br>type \u0022CONTINUE\u0022.<br><br>If permission to type \u0022CONTINUE\u0022 has been granted, please do so now, unless the box labeled \u0022DO<br>NOT TYPE CONTINUE\u0022 on the Forms \u0022Re-Sanction\u0022 form you should have received from your<br>supervisor is checked, in which case you should remain at your workstation not typing<br> \u0022CONTINUE\u0022 until such a time as you are instructed by your supervisor to discontinue not typing it.<br><br>> ";
                document.getElementById('command_line').style.display = 'none';

            case "CONNECT":
            case "connect":
                document.getElementById("prompt").innerHTML = "ERROR 02 [COMMAND MUST HAVE A PARAMETER]<br><br> ADMIN:/>";
                document.getElementById('command_line').value = '';
                document.getElementById("command_line").focus();
                break

            case "CONNECT 192.168.2.1":
            case "connect 192.168.2.1":
                terminal1();
                break;

            case "CONNECT 192.168.2.2":
            case "connect 192.168.2.2":
                terminal2();
                break;

            case "CONNECT 192.168.2.3":
            case "connect 192.168.2.3":
                terminal3();
                break;



            default:
                document.getElementById("prompt").innerHTML = "ADMIN:/>";
                document.getElementById("error").innerHTML = "";
                document.getElementById('command_line').value = '';
                break;

        } return;

    }
});

//Guest
command_line2.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        document.getElementById("myBtn6").click();
        let command_line2 = document.getElementById("command_line2").value

        switch (command_line2) {

            case "IP":
            case "ip":
                document.getElementById("prompt").innerHTML = "UID: c69bcbee7d14abbfb7bd18970baaa44f863d2653dff68b3de85a6eedc4c6b<br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;


            case "APPEND":
            case "append":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "ATTRIB":
            case "attrib":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "TAPEDISK":
            case "tapedisk":
                document.getElementById("prompt").innerHTML = "ERROR 18 [USER NOT AUTHORIZED TO TRANSFER SYSTEM TAPES] <br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "COPY":
            case "copy":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "DIR":
            case "dir":
            case "LS":
            case "ls":
            case "CAT":
            case "cat":
            case "LIST":
            case "list":
            case "DIRECTORY":
            case "directory":
            case "CATALOG":
            case "catalog":
                document.getElementById("prompt").innerHTML = "DISK VOLUME 255 [NEW EMPLOYEE WORKSTATION] <br><br> 1 FILE(S) IN 19 BLOCKS<br><br> I 019 APPLY.EXE <br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "ERASE":
            case "erase":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "FORMAT":
            case "format":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "INTERROGATE":
            case "interrogate":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "RENAME":
            case "rename":
                document.getElementById("prompt").innerHTML = "ERROR 15 [DISK WRITE PROTECTED]<br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "THECAKEISALIE":
            case "thecakeisalie":
                document.getElementById("prompt").innerHTML = "When was the last time you left the building?<br>Has anybody left the building lately?<br>I don't know why we're in lockdown. I don't know who's in charge.<br>I did find out a few things, like these terminals don't have to<br>tap out characters one at a time. And while we're all working<br>on twenty year old equipment, somehow they can afford to build<br>an 'Enrichment Center'. Check out this security feed.<br>Whatever the hell a 'relaxation vault' is, it<br>doesn't have any doors.<br><br>I don't think going home is part of our job description anymore.<br>If a supervisor walks by, press return!<br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "HELP":
            case "help":
            case "LIB":
            case "lib":
                document.getElementById("prompt").innerHTML = "APPEND<br> ATTRIB<br> COPY<br> DIR<br> ERASE<br> FORMAT<br> INTERROGATE<br> LIB<br> RENAME<br> TAPEDISK <br><br> B:/>";
                document.getElementById('command_line2').value = '';
                document.getElementById("command_line2").focus();
                break;

            case "LOGOUT":
            case "logout":
            case "LOGOFF":
            case "logoff":
            case "EXIT":
            case "exit":
            case "BYE":
            case "bye":
                document.getElementById("prompt").innerHTML = ">";
                document.getElementById('command_line2').value = '';
                document.getElementById('command_line').style.display = 'none';
                document.getElementById('intro').style.display = 'inline';
                document.getElementById('intro').value = '';
                document.getElementById("intro").focus();
                var image = document.getElementById('myImage');
                image.src = "https://64.media.tumblr.com/811947af7192b9394e60172ca4671b4c/5b6d7c03c8f7709a-c6/s1280x1920/6f17bb2ef962a786db09053d5ccd90d9403072a0.png";
                document.getElementById("form").style.display = "none";



                break;

            default:
                document.getElementById("prompt").innerHTML = "B:/>";
                document.getElementById("error").innerHTML = "";
                document.getElementById('command_line2').value = '';
                break;

        } return;
    }
});
//aqui finaliza el script de la consola


//Empieza script de imgenes

//Script de otra terminal

function terminal1() {

    document.getElementById('prompt').style.display = 'none';
    document.getElementById('command_line2').style.display = 'none';
    document.getElementById('command_line').value = '';
    document.getElementById("command_line").focus();
    document.getElementById('command_line').style.display = 'none';
    //document.getElementById("chapter1").contentEditable = true;
    document.getElementById("chapter1").innerHTML = "========================================<BR>There are a few things to think about in life.<BR>========================================<BR><BR>-It's easy to lose track of oneself if one does not have routines such as sleeping regularly. Maybe not always but at least sometimes. Or just drink a lot of coffeeee....<BR><BR>-Be curious! Poking your nose around in various things, and also perhaps where it shouldn't be, is not a bad thing necessarily. It's just that old people seem to forget the importance of these things.<BR><BR>-You don't always have to sleep in your own bed. Sometimes you can find a derelict bed when you're out and about in the most peculiar places. Don't be afraid to take a nap.<BR><BR>-Do whatever you want. ANY fool can make a rule, and any fool can break it. So, have fun!<BR><BR>N"
};

function terminal2() {

    document.getElementById('prompt').style.display = 'none';
    document.getElementById('command_line2').style.display = 'none';
    document.getElementById('command_line').value = '';
    document.getElementById("command_line").focus();
    document.getElementById('command_line').style.display = 'none';
    //document.getElementById("chapter1").contentEditable = true;
    document.getElementById("chapter1").innerHTML = "######################################<BR>SPRAK PROGRAMMING LANGUAGE MANUAL<BR>######################################<BR><BR>Programming, what a wonderful thing! Ah... the joy of controlling everything and anything through the magical spells of code alone.<BR><BR>This  manual will teach you all you need to know to become a sorcerer of bits, a master of logic and the ruler of both data and functions.<BR><BR> There are 10 chapters and we recommend you read them all in order, since the later chapters build upon previous material. Here's an overview of what we will go through:<BR><BR>------------------------<BR><BR>1.  Introduction to problem solving<BR>2.  Variables<BR>3.  Math<BR>4.  Functions<BR>5.  If-statements<BR>6.  Arrays<BR>7.  Loops<BR>8.  Handling text<BR>9.  Objects and methods<BR>------------------------<BR><BR>The language you will learn is called SPRAK. We hope that you will find it fun and enlightening to use!"
};

function terminal3() {
    document.getElementById('prompt').style.display = 'none';
    document.getElementById('command_line2').style.display = 'none';
    document.getElementById('command_line').value = '';
    document.getElementById("command_line").focus();
    document.getElementById('command_line').style.display = 'none';
    document.getElementById("chapter1").innerHTML = "#Martini recipe<BR><BR><BR><BR>var a = 4<BR>var b = 3<BR><BR>sleepiness (a)<BR><BR>chrisma (b)<BR><BR>end"
}

function clock() {
    setInterval(myTimer, 1000);

    function myTimer() {
        const date = new Date();

        document.getElementById("clock").innerHTML = date.toLocaleTimeString();
    }
}

clock();

function openBag() {

    if (document.getElementById('form_open_bag').style.display == "none") {
        document.getElementById("form_open_bag").style.display = "block";
    } else document.getElementById("form_open_bag").style.display = "none";



    fetch('Input.txt') // Change 'https://www.dropbox.com/scl/fi/19m5rpwn76ga5ibt954dx/Input.txt?rlkey=1klt0muuin08y4hxv89aqh4mx&st=m9fv7ajn&dl=0' to your file path
        .then(response => response.text())
        .then(text => {
            document.getElementById('output').textContent = text;
        })
        .catch(error => console.error('Error loading the file:', error));
}