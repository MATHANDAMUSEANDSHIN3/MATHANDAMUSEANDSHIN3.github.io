const TerminalSystem = (function () {

    let active = false;
    let selectedIndex = 0;

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

    document
        .getElementById(
            "terminalPanel"
        )
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
        const rows = document.querySelectorAll(".itemRow");

        rows.forEach((row, index) => {
            row.classList.toggle(
                "selected",
                index === selectedIndex
            );
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
    "PIN = " + (item.pin || "");
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
    

        renderList();
    }

    function compileCurrentItem() {
        const editor = document.getElementById("codeEditor");
        const items = InventorySystem.getItems();

        const index = Number(editor.dataset.itemIndex);
        const item = items[index];

        if (!item) return;

        const code =
    editor.value;

const lines =
    code.split("\n");

lines.forEach(line => {

    const parts =
        line.split("=");

    if (parts.length < 2) return;

    const key =
        parts[0].trim().toLowerCase();

    const value =
        parts.slice(1).join("=").trim();

    if (key === "pin") {
        item.pin = value;
    }

});

        console.log(
    "COMPILED:",
    item.name,
    item.pin
);

close();
    }

    window.addEventListener("keydown", (e) => {
        if (!active) return;

        const editor = document.getElementById("codeEditor");

        if (document.activeElement === editor) {
            return;
        }

        const items = InventorySystem.getItems();

        if (items.length === 0) return;

        const key = e.key.toLowerCase();

        if (key === "arrowdown" || key === "s") {
            selectedIndex++;

            if (selectedIndex >= items.length) {
                selectedIndex = items.length - 1;
            }

            updateSelection();
            return;
        }

        if (key === "arrowup" || key === "w") {
            selectedIndex--;

            if (selectedIndex < 0) {
                selectedIndex = 0;
            }

            updateSelection();
            return;
        }

        if (key === "l") {
            openDetail(items[selectedIndex]);
            return;
        }
    });

    document
        .getElementById("backButton")
        .addEventListener("click", backToList);

    document
        .getElementById("compileButton")
        .addEventListener("click", compileCurrentItem);

    function draw() {
        // La BAG ahora es HTML, no canvas.
    }

    return {
        toggle,
        close,
        isActive,
        draw
    };

})();