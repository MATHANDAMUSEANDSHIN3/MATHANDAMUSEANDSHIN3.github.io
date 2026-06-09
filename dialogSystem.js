let dialogCtx = null;

const DialogSystem = (function () {

    const dialogImage = new Image();
    dialogImage.src = "dialogBox.png";

    let active = false;
    let fullText = "";
    let pages = [];
    let currentPage = 0;

    const boxWidth = 896;
    const boxHeight = 160;

    const padding = 32;
    const lineHeight = 32;
    const fontSize = 32;

    const maxTextWidth = boxWidth - padding * 2;
    const maxLinesPerPage = 4;

    function paginateText(ctx, text) {

        const allLines = [];
        const rawLines = text.split("\n");

        ctx.font = `${fontSize}px AsepriteFont`;

        rawLines.forEach(rawLine => {

            const words = rawLine.split(" ");
            let currentLine = "";

            for (let i = 0; i < words.length; i++) {

                const word = words[i];

                const testLine =
                    currentLine +
                    (currentLine ? " " : "") +
                    word;

                const testWidth =
                    ctx.measureText(testLine).width;

                if (
                    testWidth > maxTextWidth &&
                    currentLine !== ""
                ) {

                    allLines.push(currentLine);
                    currentLine = word;

                } else {

                    currentLine = testLine;

                }
            }

            allLines.push(currentLine);

        });

        const paginated = [];

        for (
            let i = 0;
            i < allLines.length;
            i += maxLinesPerPage
        ) {

            paginated.push(
                allLines.slice(i, i + maxLinesPerPage)
            );

        }

        return paginated;
    }

    function toggle(newText, ctx) {

        if (active && fullText === newText) {

            if (currentPage < pages.length - 1) {

                currentPage++;

            } else {

                active = false;
                currentPage = 0;
                pages = [];
                fullText = "";

            }

        } else {

            active = true;
            fullText = newText;
            currentPage = 0;

            pages = paginateText(
                ctx,
                newText
            );

        }

         dialogCtx = ctx;
    }

    function isActive() {
        return active;
    }

    function draw(ctx, canvasWidth, canvasHeight) {

        if (!active) return;

        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;

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

        const lines =
            pages[currentPage] || [];

        lines.forEach((line, index) => {

            ctx.fillText(
                line,
                boxX + padding,
                boxY + 16 + (index * lineHeight)
            );

        });
    }

function setText(newText) {

    fullText = newText;

    pages = paginateText(
        dialogCtx,
        newText
    );

    currentPage = 0;
}

function close() {

    active = false;
    fullText = "";
    pages = [];
    currentPage = 0;
}



    return {
    toggle,
    draw,
    isActive,
    setText,
    close
};

})();
