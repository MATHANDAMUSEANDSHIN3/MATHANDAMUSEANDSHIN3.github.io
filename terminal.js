const TerminalSystem = (function () {

    let consoleInput = "";
let consoleState = "command";
let typedUsername = "";
let currentUser = null;
let consoleOutput = "";
let editingFile = null;

    let active = false;
    let selectedIndex = 0;

    let mode = "inventory";
let currentComputer = null;
let selectedFileIndex = 0;

let cursorVisible = true;
let lastCursorBlink = 0;

function isComputerMode() {
    return mode === "computer";
}

  function toggle() {

    active = !active;

    const panel =
        document.getElementById("terminalPanel");

    if (active) {

        panel.style.display = "block";
        renderList();

    } else {

        close();

    }
}

    function isActive() {
        return active;
    }

function close() {

    active = false;
    editingFile = null;

    mode = "inventory";
    currentComputer = null;
    selectedFileIndex = 0;

    // Preserve GameState.pendingDoor and GameState.terminalMode so closing the terminal
    // with ESC doesn't cancel a pending door interaction unexpectedly.

    // Reset header text so BAG shows "Item" again when closing a computer
    const header = document.getElementById("terminalHeader");
    if (header) header.innerText = "Item";

    document
        .getElementById("terminalPanel")
        .style.display = "none";

    // Blur any focused interactive element so subsequent Enter presses
    // don't activate a focused button (e.g., BAG) and interfere with
    // the global Enter behavior for opening doors.
    try {
        const active = document.activeElement;
        if (active && (active.tagName === 'BUTTON' || active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
            active.blur();
        }
    } catch (e) {
        // ignore
    }

    backToList();
}

    function renderList() {
        const list = document.getElementById("itemList");
        const detail = document.getElementById("itemDetail");
        const items = InventorySystem.getItems();

        list.innerHTML = "";
        list.style.display = "block";
        detail.style.display = "none";

        items.forEach((item, index) => {
            const row = document.createElement("div");

            row.className = "itemRow";

            if (index === selectedIndex) {
                row.classList.add("selected");
            }

            row.innerText = item.name;

            row.addEventListener("mouseenter", () => {
                selectedIndex = index;
                updateSelection();
            });

            row.addEventListener("click", () => {
                selectedIndex = index;
                openDetail(item);
            });

            list.appendChild(row);
        });
    }

    function updateSelection() {

    const rows =
        document.querySelectorAll(".itemRow");

    rows.forEach((row, index) => {

        if (mode === "computer") {

            row.classList.toggle(
                "selected",
                index === selectedFileIndex
            );

        } else {

            row.classList.toggle(
                "selected",
                index === selectedIndex
            );

        }

    });

}

    function openDetail(item) {
        const list = document.getElementById("itemList");
        const detail = document.getElementById("itemDetail");
        const editor = document.getElementById("codeEditor");
        const header =
    document.getElementById("terminalHeader");

        list.style.display = "none";
        detail.style.display = "block";
        header.style.display = "none";

       editor.value =
    Object.keys(item)
        .filter(key =>
            key !== "id" &&
            key !== "type"
        )
        .map(key =>
            key.toUpperCase() + " = " + item[key]
        )
        .join("\n");
        editor.dataset.itemIndex = selectedIndex;

        editor.focus();

document.getElementById("backButton").style.display = "inline-block";
document.getElementById("compileButton").style.display = "inline-block";
document.getElementById("useButton").style.display = "inline-block";

    }

    function backToList() {

        const list = document.getElementById("itemList");
        const detail = document.getElementById("itemDetail");
        const header =
    document.getElementById("terminalHeader");

        detail.style.display = "none";
        list.style.display = "block";
        header.style.display = "block";
    

       if (mode === "computer") {
    renderComputerConsole();
} else {
    renderList();
}
    }

if (mode === "computer") {

    const index =
        Number(editor.dataset.fileIndex);

    const file =
        currentComputer.files[index];

    if (!file) return;

    file.content =
        editor.value;

    console.log(
        "FILE SAVED:",
        file.name,
        file.content
    );

    document.getElementById("backButton").style.display = "inline-block";
document.getElementById("compileButton").style.display = "inline-block";
document.getElementById("useButton").style.display = "inline-block";

    close();

    return;
}

function openInventory() {


    active = true;
    mode = "inventory";

    const panel = document.getElementById("terminalPanel");

    if (panel) {
        panel.style.display = "block";
        panel.style.visibility = "visible";
        panel.style.opacity = "1";
        // Ensure it's above other elements
        panel.style.zIndex = "9999";
    }

    // Asegurar header por defecto
    const header = document.getElementById("terminalHeader");
    if (header) header.innerText = "Item";

    renderList();

    // If opening because of a pending door, prefer selecting a key-like item
    const items = InventorySystem.getItems();
    if (GameState.terminalMode === "useItem" && items.length > 0) {
        let keyIdx = items.findIndex(it => it.type === "key" || it.pin);
        if (keyIdx === -1) keyIdx = 0;
        selectedIndex = keyIdx;
        updateSelection();
    }

    console.log("TerminalSystem.openInventory called (end)", {
        active,
        panelDisplay: panel ? panel.style.display : null,
        itemsCount: items.length,
        selectedIndex
    });

}

    function compileCurrentItem() {

    const editor =
        document.getElementById("codeEditor");

    if (mode === "computer") {

        const index =
            Number(editor.dataset.fileIndex);

        const file =
            currentComputer.files[index];

        if (!file) return;

        file.content =
            editor.value;

        console.log(
            "FILE SAVED:",
            file.name,
            file.content
        );

        close();

        return;
    }

    const items =
        InventorySystem.getItems();

    const index =
        Number(editor.dataset.itemIndex);

    const item =
        items[index];

    if (!item) return;

    const code =
        editor.value;

    const lines =
        code.split("\n");

    lines.forEach(line => {

        const cleanLine =
            line.trim();

        if (cleanLine === "") return;

        if (cleanLine.startsWith("//")) return;

        const parts =
            cleanLine.split("=");

        if (parts.length < 2) return;

        const key =
            parts[0]
                .trim()
                .toLowerCase();

        let value =
            parts
                .slice(1)
                .join("=")
                .trim();

        if (
            value.startsWith('"') &&
            value.endsWith('"')
        ) {
            value =
                value.slice(1, -1);
        }

        item[key] = value;

        console.log("SET:", key, value);
    });

    console.log("ITEM AFTER COMPILE:", item);

    close();

}

function useCurrentItem() {

    const editor =
        document.getElementById("codeEditor");

    const items =
        InventorySystem.getItems();

    const index =
        Number(editor.dataset.itemIndex);

    const item =
        items[index];

    if (!item) return;

    if (!GameState.pendingDoor) {

        console.log(
            "ITEM USED:",
            item.name,
            item.pin
        );

        return;
    }

    const door =
        GameState.pendingDoor;

    if (item.pin === door.requiredPin) {

        console.log("ACCESS GRANTED");

        const targetMap =
            door.targetMap;

        const spawnX =
            door.spawnX;

        const spawnY =
            door.spawnY;

        GameState.pendingDoor = null;
        GameState.terminalMode = "normal";

        close();

        changeMap(
            targetMap,
            spawnX,
            spawnY
        );

    } else {

    console.log("ACCESS DENIED");

    GameState.pendingDoor = null;
    GameState.terminalMode = "normal";
    GameState.interactionLock = true;

    close();

    DialogSystem.toggle(
        "Access denied",
        ctx
    );

    return;
}

}

   window.addEventListener("keydown", (e) => {

    if (!active) return;

    const editor =
        document.getElementById("codeEditor");

 if (
    mode === "computer" &&
    editingFile &&
    document.activeElement === editor &&
    e.ctrlKey &&
    e.key.toLowerCase() === "enter"
) {

    e.preventDefault();

    editingFile.content =
        editor.value;

    editingFile = null;

    consoleOutput =
        "FILE SAVED";

    consoleInput = "";
    consoleState = "session";

    renderComputerConsole();

    return;
}  

if (
    mode === "computer" &&
    document.activeElement === editor &&
    e.ctrlKey &&
    e.key.toLowerCase() === "q"
) {

    e.preventDefault();

    editingFile = null;

    consoleOutput =
        "EDIT CANCELLED";

    consoleInput = "";
    consoleState = "session";

    renderComputerConsole();

    return;
}

    if (document.activeElement === editor) {
        return;
    }

    const key =
        e.key.toLowerCase();

    // ESC SIEMPRE CIERRA

if (key === "escape") {

    e.preventDefault();
    e.stopImmediatePropagation();

    keys["enter"] = false;
    keys["escape"] = false;

    close();

    return;
}

    const entries =
        mode === "computer"
            ? currentComputer.files
            : InventorySystem.getItems();

    if (entries.length === 0) return;

    // CONSOLA DE LOGIN

    if (
        mode === "computer" &&
        consoleState !== "files"
    ) {

        e.preventDefault();

        if (key === "backspace") {

            consoleInput =
                consoleInput.slice(0, -1);

            renderComputerConsole();

            return;

        }

        if (key === "enter") {


            const command =
                consoleInput
                    .trim()
                    .toUpperCase();

            executeComputerCommand(
                command
            );

            return;

        }

        if (e.key.length === 1) {

            consoleInput +=
                e.key.toUpperCase();

            renderComputerConsole();

            return;

        }

        return;

    }

    // ABAJO

    if (
        key === "arrowdown" ||
        key === "s"
    ) {

        if (mode === "computer") {

            selectedFileIndex++;

            if (
                selectedFileIndex >=
                entries.length
            ) {

                selectedFileIndex =
                    entries.length - 1;

            }

        } else {

            selectedIndex++;

            if (
                selectedIndex >=
                entries.length
            ) {

                selectedIndex =
                    entries.length - 1;

            }

        }

        updateSelection();

        return;

    }

    // ARRIBA

    if (
        key === "arrowup" ||
        key === "w"
    ) {

        if (mode === "computer") {

            selectedFileIndex--;

            if (
                selectedFileIndex < 0
            ) {

                selectedFileIndex = 0;

            }

        } else {

            selectedIndex--;

            if (
                selectedIndex < 0
            ) {

                selectedIndex = 0;

            }

        }

        updateSelection();

        return;

    }

    // ABRIR

    if (key === "enter") {

        e.preventDefault();

        if (mode === "computer") {

            openComputerFile(
                currentComputer.files[
                    selectedFileIndex
                ]
            );

            return;

        }

        openDetail(
            entries[selectedIndex]
        );

        return;

    }

}, true);

    document
        .getElementById("backButton")
        .addEventListener("click", backToList);

    document
        .getElementById("compileButton")
        .addEventListener("click", compileCurrentItem);

    document
    .getElementById("useButton")
    .addEventListener("click", useCurrentItem);
        

    function draw() {
        // La BAG ahora es HTML, no canvas.
    }

    function openComputer(computer) {

    active = true;
    mode = "computer";
    currentComputer = computer;
    selectedFileIndex = 0;

    const panel =
        document.getElementById("terminalPanel");

    const header =
        document.getElementById("terminalHeader");

    panel.style.display = "block";
   header.style.display = "none";

   document.getElementById("backButton").style.display = "none";
document.getElementById("compileButton").style.display = "none";
document.getElementById("useButton").style.display = "none";

    consoleInput = "";
    consoleOutput = "";
consoleState = "command";
typedUsername = "";
currentUser = null;


if (computer.accessMode === "message") {
    renderComputerMessage();
    return;
}

renderComputerConsole();

}

function renderComputerConsole() {

    const list =
        document.getElementById("itemList");

    const detail =
        document.getElementById("itemDetail");

    const header =
        document.getElementById("terminalHeader");

    list.innerHTML = "";
    list.style.display = "block";
    detail.style.display = "none";
    header.style.display = "none";

    let prompt = ">";

    if (consoleState === "username") {
        prompt = "USERNAME>";
    }

    if (consoleState === "password") {
        prompt = "PASSWORD>";
    }

    if (consoleState === "session") {
        prompt = currentUser.role + ":/>";
    }

    const row =
        document.createElement("div");

    row.className = "consoleRow";

  const displayInput =

    consoleState === "password"

        ? "*".repeat(
            consoleInput.length
        )

        : consoleInput.toUpperCase();

row.innerHTML =

    (
        consoleOutput
            ? consoleOutput.replace(/\n/g, "<br>") + "<br>"
            : ""
    ) +

    prompt + " " +

    displayInput +

    `<span id="terminalCursor"></span>`;

    list.appendChild(row);

}

function renderComputerMessage() {

    const list =
        document.getElementById("itemList");

    const detail =
        document.getElementById("itemDetail");

    const header =
        document.getElementById("terminalHeader");

    list.innerHTML = "";
    list.style.display = "block";
    detail.style.display = "none";
    header.style.display = "block";

    const row =
        document.createElement("div");

    row.className = "itemRow selected";

    row.innerText =
        currentComputer.message || "NO DATA";

    list.appendChild(row);

}

function executeComputerCommand(command) {

    if (consoleState === "command") {

        if (command === "LOGIN") {
            consoleOutput = "";
            consoleState = "username";
            consoleInput = "";
            renderComputerConsole();
            return;
        }

        consoleOutput = "";
        consoleInput = "";
        renderComputerConsole();
        return;
    }

    if (consoleState === "username") {

        typedUsername = command;
        consoleOutput = "";
        consoleState = "password";
        consoleInput = "";
        renderComputerConsole();
        return;
    }

    if (consoleState === "password") {

        const user =
            currentComputer.users.find(user =>
                user.username === typedUsername &&
                user.password === command
            );

        if (user) {
            currentUser = user;
            consoleOutput = "";
            consoleState = "session";
            consoleInput = "";
            renderComputerConsole();
            return;
        }

        typedUsername = "";
        consoleOutput = "";
        consoleState = "command";
        consoleInput = "";
        renderComputerConsole();
        return;
    }

    if (consoleState === "session") {

if (command.startsWith("EDIT ")) {

    const fileName =
        command
            .replace("EDIT ", "")
            .trim();

    const fileIndex =
        currentComputer.files.findIndex(file =>
            file.name.toUpperCase() === fileName
        );

    if (fileIndex === -1) {
        consoleInput = "";
        renderComputerConsole();
        return;
    }

    selectedFileIndex =
        fileIndex;

    consoleInput = "";

    openComputerFile(
        currentComputer.files[fileIndex]
    );

    return;
}

if (command === "ITEMS") {

    const items =
        InventorySystem.getItems();

    if (items.length === 0) {
        consoleOutput =
            "NO ITEMS";
        consoleInput = "";
        renderComputerConsole();
        return;
    }

    consoleOutput =
        items
            .map((item, index) =>
                index + " " + item.name
            )
            .join("\n");

    consoleInput = "";
    renderComputerConsole();
    return;
}

        if (command === "HELP") {

            consoleOutput =
    "APPEND\n" +
"ATTRIB\n" +
"COPY\n" +
"DIR\n" +
"ERASE\n" +
"FORMAT\n" +
"INTERROGATE\n" +
"LIB\n" +
"NOTES\n" +
"PLAY\n" +
"RENAME\n" +
"TAPEDISK";

            consoleInput = "";
            renderComputerConsole();
            return;
        }

        if (command === "DIR" || command === "LS") {

            consoleOutput =
                currentComputer.files.length +
                " FILE(S)\n\n" +
                currentComputer.files
                    .map(file => file.name)
                    .join("\n");

            consoleInput = "";
            renderComputerConsole();
            return;
        }

        if (command.startsWith("TYPE ITEM ")) {

    const itemIndex =
        Number(
            command
                .replace("TYPE ITEM ", "")
                .trim()
        );

    const items =
        InventorySystem.getItems();

    const item =
        items[itemIndex];

    if (!item) {
        consoleInput = "";
        renderComputerConsole();
        return;
    }

    consoleOutput =
        Object.keys(item)
            .filter(key =>
                key !== "id" &&
                key !== "type"
            )
            .map(key =>
                key.toUpperCase() +
                " = " +
                item[key]
            )
            .join("\n");

    consoleInput = "";
    renderComputerConsole();
    return;
}

         if (command.startsWith("TYPE ")) {

    const fileName =
        command
            .replace("TYPE ", "")
            .trim();

    const file =
        currentComputer.files.find(file =>
            file.name.toUpperCase() === fileName
        );

    if (!file) {
        consoleOutput = "";
        consoleInput = "";
        renderComputerConsole();
        return;
    }

    consoleOutput =
        file.content;

    consoleInput = "";
    renderComputerConsole();
    return;
}

        if (command.startsWith("OPEN ")) {

    const fileName =
        command
            .replace("OPEN ", "")
            .trim();

    const fileIndex =
        currentComputer.files.findIndex(file =>
            file.name.toUpperCase() === fileName
        );

    if (fileIndex === -1) {
        consoleOutput = "";
        consoleInput = "";
        renderComputerConsole();
        return;
    }

    selectedFileIndex = fileIndex;

    openComputerFile(
        currentComputer.files[fileIndex]
    );

    consoleInput = "";

    return;
}

        if (command === "CLS" || command === "CLEAR") {

    consoleOutput = "";
    consoleInput = "";
    renderComputerConsole();
    return;
}

        if (command === "LOGOUT" || command === "EXIT") {
            consoleOutput = "";
            consoleState = "command";
            currentUser = null;
            typedUsername = "";
            consoleInput = "";
            renderComputerConsole();
            return;
        }

        if (command === "IP") {

    consoleOutput =
        currentComputer.ip ||
        "NO IP ASSIGNED";

    consoleInput = "";
    renderComputerConsole();
    return;
}

        consoleOutput = "";
        consoleInput = "";
        renderComputerConsole();
        return;
    }

}

function renderComputerFiles() {

    consoleState = "files";

    const list =
        document.getElementById("itemList");

    const detail =
        document.getElementById("itemDetail");

    list.innerHTML = "";
    list.style.display = "block";
    detail.style.display = "none";

    currentComputer.files.forEach((file, index) => {

        const row =
            document.createElement("div");

        row.className = "itemRow";

        if (index === selectedFileIndex) {
            row.classList.add("selected");
        }

        row.innerText = file.name;

        row.addEventListener("mouseenter", () => {
            selectedFileIndex = index;
            updateSelection();
        });

        row.addEventListener("click", () => {
            selectedFileIndex = index;
            openComputerFile(file);
        });

        list.appendChild(row);

    });

}

function openComputerFile(file) {

      editingFile = file;

    const list =
        document.getElementById("itemList");

    const detail =
        document.getElementById("itemDetail");

    const editor =
        document.getElementById("codeEditor");

    const header =
        document.getElementById("terminalHeader");

    list.style.display = "none";
    detail.style.display = "block";
    header.style.display = "none";

    editor.value = file.content;

    editor.scrollTop = 0;
editor.selectionStart = 0;
editor.selectionEnd = 0;
    editor.dataset.fileIndex = selectedFileIndex;



    editor.focus();

}

    return {
    toggle,
    close,
    isActive,
    draw,
    openComputer,
     isComputerMode,
     openInventory
};

})();