const TerminalSystem = (function () {

    let active = false;
    let selectedIndex = 0;

    let mode = "inventory";
let currentComputer = null;
let selectedFileIndex = 0;

function isComputerMode() {
    return mode === "computer";
}

    function toggle() {
        active = !active;

        const panel = document.getElementById("terminalPanel");

        if (active) {
            panel.style.display = "block";
            renderList();
        } else {
            panel.style.display = "none";
            backToList();
        }
    }

    function isActive() {
        return active;
    }

function close() {

    active = false;

    mode = "inventory";
    currentComputer = null;
    selectedFileIndex = 0;

    GameState.pendingDoor = null;
    GameState.terminalMode = "normal";

    document
        .getElementById("terminalPanel")
        .style.display = "none";

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
    renderComputerFiles();
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

    close();

    return;
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

        const editor = document.getElementById("codeEditor");

        if (document.activeElement === editor) {
            return;
        }

        const entries =
    mode === "computer"
        ? currentComputer.files
        : InventorySystem.getItems();

if (entries.length === 0) return;

        const key = e.key.toLowerCase();

        if (key === "arrowdown" || key === "s") {

    if (mode === "computer") {

        selectedFileIndex++;

        if (selectedFileIndex >= entries.length) {
            selectedFileIndex = entries.length - 1;
        }

    } else {

        selectedIndex++;

        if (selectedIndex >= entries.length) {
            selectedIndex = entries.length - 1;
        }

    }

    updateSelection();
    return;
}

        if (key === "arrowup" || key === "w") {

    if (mode === "computer") {

        selectedFileIndex--;

        if (selectedFileIndex < 0) {
            selectedFileIndex = 0;
        }

    } else {

        selectedIndex--;

        if (selectedIndex < 0) {
            selectedIndex = 0;
        }

    }

    updateSelection();
    return;
}

      if (key === "l") {

    e.preventDefault();

    if (mode === "computer") {

        openComputerFile(
            currentComputer.files[selectedFileIndex]
        );

        return;

    }

    openDetail(
        entries[selectedIndex]
    );

    return;
}

if (key === "e") {

    e.preventDefault();

    close();

    return;
}

    });

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

    header.style.display = "block";
    header.innerText = computer.name;

    renderComputerFiles();

}

function renderComputerFiles() {

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
     isComputerMode
};

})();