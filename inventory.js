const InventorySystem = (function () {

    const items = [];

    function addItem(item) {

    items.push({ ...item });

    console.log(
        "ITEM ADDED:",
        item.name
    );

}

    function getItems() {

        return items;

    }

    function clear() {

        items.length = 0;

    }

    function hasItem(itemId) {
    return items.some(item => item.id === itemId);
}

function hasPin(pin) {

    return items.some(item =>
        item.pin === pin
    );

}

    return {

    addItem,
    hasItem,
    hasPin,
    getItems,
    clear

    };

})();