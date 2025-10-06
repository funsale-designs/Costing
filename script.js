// Key for Local Storage
const STORAGE_KEY = 'kitchenCostingData';

// Array to hold all costing items
let costingItems = [];

/**
 * Helper function to format currency as South African Rand (ZAR).
 * @param {number} amount - The numeric value to format.
 * @returns {string} The formatted currency string (e.g., "R 12.34").
 */
function formatZAR(amount) {
    return new Intl.NumberFormat('en-ZA', { 
        style: 'currency', 
        currency: 'ZAR',
        minimumFractionDigits: 2
    }).format(amount);
}

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
    // Use Number() to ensure cost and quantity are treated as numbers
    const cost = Number(costInput.value);
    const quantity = Number(quantityInput.value);
    const unit = unitInput.value.trim() || 'units';

    if (!name || isNaN(cost) || cost < 0 || isNaN(quantity) || quantity <= 0) {
        alert("Please enter a valid Name, Cost, and Quantity.");
        return;
    }

    const calculatedCost = calculateItemCost(cost, quantity);

    const newItem = {
        id: Date.now(), // Unique ID
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
    // Keep unit value for convenience: unitInput.value = 'kg'; 
}

/**
 * Removes an item from the list by its ID.
 */
function removeItem(id) {
    // Confirmation is useful to prevent accidental deletion on mobile
    if (confirm("Remove this ingredient?")) {
        costingItems = costingItems.filter(item => item.id !== id);
        saveData();
        renderList();
    }
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
        listContainer.innerHTML = '<p class="no-items">No items added yet. Start costing!</p>';
        totalCostDisplay.textContent = formatZAR(0);
        return;
    }

    // Use a DocumentFragment for performance when adding many elements
    const fragment = document.createDocumentFragment();

    costingItems.forEach(item => {
        totalCost += item.totalItemCost;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'list-item';
        itemDiv.dataset.id = item.id; // Store ID for removal

        itemDiv.innerHTML = `
            <div class="list-item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-cost-text">
                    (${item.quantityUsed} ${item.unit} @ ${formatZAR(item.costPerUnit)}/${item.unit})
                </span>
            </div>
            <strong>${formatZAR(item.totalItemCost)}</strong>
            <button class="remove-item-btn" onclick="removeItem(${item.id})">Remove</button>
        `;
        fragment.appendChild(itemDiv);
    });

    listContainer.appendChild(fragment);
    totalCostDisplay.textContent = formatZAR(totalCost);
}

/**
 * Clears all data from the app and Local Storage.
 */
function clearAllData() {
    if (confirm("Are you sure you want to clear ALL kitchen costing data? This cannot be undone.")) {
        costingItems = [];
        localStorage.removeItem(STORAGE_KEY);
        renderList();
    }
}

// Initialize the app when the script loads
document.addEventListener('DOMContentLoaded', loadData);
