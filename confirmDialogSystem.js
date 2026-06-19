const ConfirmDialogSystem = (function () {

    const dialogImage = new Image();
    dialogImage.src = "dialogBox.png";

    const cursorImage = new Image();
cursorImage.src = "Pointer.png";


    let active = false;
    let selectedOption = 0;
    let yesCallback = null;
    let message = "";

    const boxWidth = 896;
    const boxHeight = 160;

    const padding = 32;
    const lineHeight = 32;
    const fontSize = 32;

    function open(text, onYes) {
        active = true;
        selectedOption = 0;
        yesCallback = onYes;
        message = text;
    }

    function close() {
        active = false;
        selectedOption = 0;
        yesCallback = null;
        message = "";
    }

    function confirm() {

    if (selectedOption === 0) {

        SoundSystem.play(
            "accept"
        );

        const callback =
            yesCallback;

        close();

        if (callback) {
            callback();
        }

        return;
    }

    SoundSystem.play(
        "cancel"
    );

    close();

}

   function moveSelection(direction) {

    const previousOption =
        selectedOption;

    selectedOption += direction;

    if (selectedOption < 0) {
        selectedOption = 1;
    }

    if (selectedOption > 1) {
        selectedOption = 0;
    }

    if (
        previousOption !==
        selectedOption
    ) {

        SoundSystem.play("cursor");

    }

}

    function isActive() {
        return active;
    }

    function draw(ctx, canvasWidth, canvasHeight) {
        if (!active) return;

        ctx.imageSmoothingEnabled = false;

        const boxX =
            (canvasWidth - boxWidth) / 2;

        const boxY =
            canvasHeight - boxHeight;

        ctx.drawImage(
            dialogImage,
            boxX,
            boxY,
            boxWidth,
            boxHeight
        );

        ctx.font =
            `${fontSize}px AsepriteFont`;

        ctx.fillStyle = "#fff599";
        ctx.textBaseline = "top";

        ctx.fillText(
            message,
            boxX + padding,
            boxY + 16
        );

        const optionX =
    boxX + (padding * 2);

const cursorX =
    optionX - 40;

const yesY =
    boxY + 16 + (1 * lineHeight);

const noY =
    boxY + 16 + (2 * lineHeight);

const cursorWidth = 32;
const cursorHeight = 32;

if (selectedOption === 0) {

    ctx.drawImage(
        cursorImage,
        cursorX,
        yesY,
        cursorWidth,
        cursorHeight
    );

}

if (selectedOption === 1) {

    ctx.drawImage(
        cursorImage,
        cursorX,
        noY,
        cursorWidth,
        cursorHeight
    );

}

ctx.fillText(
    "Yes",
    optionX,
    yesY
);

ctx.fillText(
    "No",
    optionX,
    noY
);


    }

    return {
        open,
        close,
        confirm,
        moveSelection,
        isActive,
        draw
    };

})();