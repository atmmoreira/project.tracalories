// Storage Controller
const StorageController = (function () {
  return {
    storeItem: function (item) {
      let items = [];
      // Check if any items in localStorage
      if (localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set localStorage
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        // Get what is already in localStorage
        items = JSON.parse(localStorage.getItem('items'));
        // Push the new item
        items.push(item);
        // Reset localStorage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function () {
      let items;
      if (localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function (updateItem) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (updateItem.id === item.id) {
          items.splice(index, 1, updateItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function (id) {
      let items = JSON.parse(localStorage.getItem('items'));

      items.forEach(function (item, index) {
        if (id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemFromStorage: function () {
      localStorage.removeItem('items');
    }
  }
})();

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
    items: StorageController.getItemsFromStorage(),
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
    updateItem: function (name, calories) {
      // Calories to number
      calories = parseInt(calories);
      let found = null;

      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) {
      // Get ids
      ids = data.items.map(function (item) {
        return item.id;
      });
      // Get index
      const index = ids.indexOf(id);
      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
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
    listItems: '.item-list li',
    addButton: '.add-btn',
    updateButton: '.update-btn',
    deleteButton: '.delete-btn',
    clearButton: '.clear-btn',
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
            <i class="ph-pencil-simple-bold text-warning edit-item"></i>
          </li>
        `;
      });
      // Insert List items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value,
      };
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
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemID = listItem.getAttribute('id');
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
            <div class="ms-2 me-auto">
              <div class="fw-bold calories-name">${item.name}</div>
              <em>Calories: <small class="calories-info">${item.calories}</small></em>
            </div>
            <i class="ph-pencil-simple-bold text-warning edit-item"></i>
        `;
        }
      });
    },
    clearInputFields: function () {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value =
        ItemController.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =
        ItemController.getCurrentItem().calories;
      UIController.showEditState();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      // Turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
    },
    getSelectors: function () {
      return UISelectors;
    },
    showTotalCalories: function (totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent =
        totalCalories;
    },
    deleteListItem: function (id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
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
  };
})();

// App Controller
const AppController = (function (ItemController, StorageController, UIController) {
  // Load event listeners
  const loadEventListeners = function () {
    // Get UI Selectors
    const UISelectors = UIController.getSelectors();
    // Add item event
    document
      .querySelector(UISelectors.addButton)
      .addEventListener('click', itemAddSubmit);
    // Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if (e.key === 13) {
        e.preventDefault();
        return false;
      }
    });
    // Edit icon event
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);
    // Update Item event
    document
      .querySelector(UISelectors.updateButton)
      .addEventListener('click', itemUpdateSubmit);
    // Delete Item event
    document
      .querySelector(UISelectors.deleteButton)
      .addEventListener('click', itemDeleteSubmit);
    // Back buttom event
    document
      .querySelector(UISelectors.backButton)
      .addEventListener('click', UIController.clearEditState);
    // Clear Items event
    document
      .querySelector(UISelectors.clearButton)
      .addEventListener('click', clearAllItemsClick);
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
      // Store in locanStorage
      StorageController.storeItem(addNewItem);
      // Clear fields
      UIController.clearInputFields();
    }
    event.preventDefault();
  };
  // Update item submit
  const itemEditClick = function (event) {
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
      ItemController.setCurrentItem(itemToEdit);
      // Add item to form
      UIController.addItemToForm();
    }
    event.preventDefault();
  };
  // Update item submit
  const itemUpdateSubmit = function (event) {
    // Get item Input
    const input = UIController.getItemInput();
    // Update Item
    const updateItem = ItemController.updateItem(input.name, input.calories);
    // Update UI
    UIController.updateListItem(updateItem);
    // Get total calories
    const totalCalories = ItemController.getTotalCalories();
    // Add total calories to UI
    UIController.showTotalCalories(totalCalories);
    // Update local storage
    StorageController.updateItemStorage(updateItem);
    // Clear inputs
    UIController.clearEditState();
    event.preventDefault();
  };
  // Delete buttom event
  const itemDeleteSubmit = function (event) {
    // Get current item
    const currentItem = ItemController.getCurrentItem();
    // Delete from data structure
    ItemController.deleteItem(currentItem.id);
    // Delete from UI
    UIController.deleteListItem(currentItem.id);
    // Get total calories
    const totalCalories = ItemController.getTotalCalories();
    // Add total calories to UI
    UIController.showTotalCalories(totalCalories);
    // Delete from localStorage
    StorageController.deleteItemFromStorage(currentItem.id);
    // Clear UI list
    UIController.clearEditState();
    event.preventDefault();
  };
  // Clear All Items
  const clearAllItemsClick = function () {
    // Delete All items from data structure
    ItemController.clearAllItems();
    // Get total calories
    const totalCalories = ItemController.getTotalCalories();
    // Add total calories to UI
    UIController.showTotalCalories(totalCalories);
    // Remove from UI
    UIController.removeItems();
    // Clear from localstorage
    StorageController.clearItemFromStorage();
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
})(ItemController, StorageController, UIController);

// Initialize App
AppController.init();
