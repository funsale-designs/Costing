// Key for Local Storage
const STORAGE_KEY = 'kitchenCostingData';

// Array to hold all costing items
let costingItems = [];

/**
 * Loads data from Local Storage on app startup.
 */
function loadData() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        costingItems = JSON.parse(storedData);
    }
    renderList();
}

/**
 * Saves the current costingItems array to Local Storage.
 */
function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(costingItems));
}

/**
 * Calculates the total cost for a single item.
 * NOTE: This basic model assumes the input `itemCost` is the "Cost per Unit" (e.g., Cost per kg),
 * and `itemQuantity` is the amount used (e.g., kg used). Adjust calculation as needed.
 * @param {number} cost - Cost per unit.
 * @param {number} quantity - Quantity used.
 * @returns {number} The calculated cost.
 */
function calculateItemCost(cost, quantity) {
    // Simple calculation: Cost per Unit * Quantity Used
    return cost * quantity;
}

/**
 * Adds a new item to the costing list.
 */
function addItem() {
    const nameInput = document.getElementById('itemName');
    const costInput = document.getElementById('itemCost');
    const quantityInput = document.getElementById('itemQuantity');
    const unitInput = document.getElementById('itemUnit');

    const name = nameInput.value.trim();
    const cost = parseFloat(costInput.value);
    const quantity = parseFloat(quantityInput.value);
    const unit = unitInput.value.trim() || 'units';

    if (!name || isNaN(cost) || cost < 0 || isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid Name, Cost, and Quantity.");
        return;
    }

    const calculatedCost = calculateItemCost(cost, quantity);

    const newItem = {
        id: Date.now(), // Unique ID for identification
        name: name,
        costPerUnit: cost,
        quantityUsed: quantity,
        unit: unit,
        totalItemCost: calculatedCost
    };

    costingItems.push(newItem);
    saveData();
    renderList();

    // Clear inputs
    nameInput.value = '';
    costInput.value = '';
    quantityInput.value = '';
    unitInput.value = '';
}

/**
 * Removes an item from the list by its ID.
 * @param {number} id - The unique ID of the item to remove.
 */
function removeItem(id) {
    costingItems = costingItems.filter(item => item.id !== id);
    saveData();
    renderList();
}

/**
 * Renders the entire list of items and updates the total cost.
 */
function renderList() {
    const listContainer = document.getElementById('costing-list');
    const totalCostDisplay = document.getElementById('totalCost');
    let totalCost = 0;
    listContainer.innerHTML = ''; // Clear existing list

    if (costingItems.length === 0) {
        listContainer.innerHTML = '<p>No items added yet.</p>';
        totalCostDisplay.textContent = '$0.00';
        return;
    }

    const ul = document.createElement('ul');

    costingItems.forEach(item => {
        totalCost += item.totalItemCost;

        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${item.name}</strong>: 
            $${item.totalItemCost.toFixed(2)} 
            (Used ${item.quantityUsed} ${item.unit} @ $${item.costPerUnit.toFixed(2)}/${item.unit})
            <button onclick="removeItem(${item.id})" style="margin-left: 10px;">Remove</button>
        `;
        ul.appendChild(li);
    });

    listContainer.appendChild(ul);
    totalCostDisplay.textContent = `$${totalCost.toFixed(2)}`;
}

/**
 * Clears all data from the app and Local Storage.
 */
function clearAllData() {
    if (confirm("Are you sure you want to clear ALL kitchen costing data? This cannot be undone.")) {
        costingItems = [];
        localStorage.removeItem(STORAGE_KEY);
        renderList();
        alert("Data cleared.");
    }
}

// Initialize the app when the script loads
loadData();
