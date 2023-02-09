// Storage Controller

// Item Controller
const ItemController = (function () {
  // Item Constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  // Data Structure / State
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0,
  };
  // Public Methods
  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      // Create ID
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Calories to number
      calories = parseInt(calories);
      // Create new item
      addNewItem = new Item(ID, name, calories);
      // Add items array
      data.items.push(addNewItem);

      return addNewItem;
    },
    getItemById: function (id) {
      let found = null;
      // Loop through items
      data.items.forEach(function (item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentitem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let total = 0;
      // Loop throught items and add cals
      data.items.forEach(function (item) {
        total += item.calories;
      });
      // Set total cal i data structure
      data.totalCalories = total;
      // Return total
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

// UI Controller
const UIController = (function () {
  const UISelectors = {
    itemList: '.item-list',
    addButton: '.add-btn',
    updateButton: '.update-btn',
    deleteButton: '.delete-btn',
    backButton: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
  };
  // Public Methods
  return {
    populateItemList: function (items) {
      let html = '';
      items.forEach((item) => {
        html += `
          <li class="list-group-item d-flex justify-content-between align-items-start" id="item-${item.id}">
            <div class="ms-2 me-auto">
              <div class="fw-bold calories-name">${item.name}</div>
              <em>Calories: <small class="calories-info">${item.calories}</small></em>
            </div>
            <a href="#" class="text-warning p-1 text-decoration-none edit-item" title="Edit"> <i class="ph-pencil-simple-bold"></i> </a>
          </li>
        `;
      });
      // Insert List items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem: function (item) {
      // Create li element
      const li = document.createElement('li');
      // Add classes
      li.className =
        'list-group-item d-flex justify-content-between align-items-start';
      // Add ID
      li.id = `item-${item.id}`;
      li.innerHTML = `
        <div class="ms-2 me-auto">
          <div class="fw-bold calories-name">${item.name}</div>
          <em>Calories: <small class="calories-info">${item.calories}</small></em>
        </div>
        <i class="ph-pencil-simple-bold text-warning edit-item"></i>
      `;
      // Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    clearInputFields: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemController.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemController.getCurrentItem().calories;
      UIController.showEditState();
    },
    getSelectors: function () {
      return UISelectors;
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    clearEditState: function () {
      UIController.clearInputFields();
      document.querySelector(UISelectors.updateButton).style.display = 'none';
      document.querySelector(UISelectors.deleteButton).style.display = 'none';
      document.querySelector(UISelectors.backButton).style.display = 'none';
      document.querySelector(UISelectors.addButton).style.display = 'inline';
    },
    showEditState: function () {
      document.querySelector(UISelectors.updateButton).style.display = 'inline';
      document.querySelector(UISelectors.deleteButton).style.display = 'inline';
      document.querySelector(UISelectors.backButton).style.display = 'inline';
      document.querySelector(UISelectors.addButton).style.display = 'none';
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
    },
  };
})();

// App Controller
const AppController = (function (ItemController, UIController) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UIController.getSelectors();
    // Add item event
    document
      .querySelector(UISelectors.addButton)
      .addEventListener('click', itemAddSubmit);
    // Edit icon event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemUpdateSubmit);
  };
  // Add item submit
  const itemAddSubmit = function (event) {
    // Get form input from Ui Controller
    const input = UIController.getItemInput();
    // Check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      // Add item
      const addNewItem = ItemController.addItem(input.name, input.calories);
      // Add item to UI list
      UIController.addListItem(addNewItem);
      // Get total calories
      const totalCalories = ItemController.getTotalCalories();
      // Add total calories to UI
      UIController.showTotalCalories(totalCalories);
      // Clear fields
      UIController.clearInputFields();
    }
    event.preventDefault();
  };
  // Update item submit
  const itemUpdateSubmit = function (event) {
    if (event.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = event.target.parentNode.id;
      // Break into array
      const listIdArr = listId.split('-');
      // Get the actual id
      const id = parseInt(listIdArr[1]);
      // Get item
      const itemToEdit = ItemController.getItemById(id);
      // Set current item
      ItemController.setCurrentitem(itemToEdit);
      // Add item to form
      UIController.addItemToForm();
    }
    event.preventDefault();
  };
  // Public Methods
  return {
    init: function () {
      // Clear edit state / se initial set
      UIController.clearEditState();
      // Fetch items from data structure
      const items = ItemController.getItems();
      // Populate list with items
      UIController.populateItemList(items);
      // Get total calories
      const totalCalories = ItemController.getTotalCalories();
      // Add total calories to UI
      UIController.showTotalCalories(totalCalories);
      // Load event listeners
      loadEventListeners();
    },
  };
})(ItemController, UIController);

// Initialize App
AppController.init();
