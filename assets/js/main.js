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
    items: [
      { id: 0, name: 'Steack Dinner', calories: 1200 },
      { id: 1, name: 'Cookie', calories: 200 },
      { id: 2, name: 'Eggs', calories: 100 },
    ],
    currentItem: null,
    totalCalories: 0,
  };
  // Public Methods
  return {
    getItems: function () {
      return data.items;
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
  };

  // Public Methods
  return {
    populateItemList: function (items) {
      let html = '';
      items.forEach((item) => {
        html += `
          <li
            class="list-group-item d-flex justify-content-between align-items-start"
            id="item-${item.id}"
          >
            <div class="ms-2 me-auto">
              <div class="fw-bold calories-name">${item.name}</div>
              <em>Calories: <small class="calories-info">${item.calories}</small></em>
            </div>
            <a href="#" class="text-warning p-1 text-decoration-none edit-item" title="Edit">
              <i class="ph-pencil-simple-bold"></i>
            </a>
          </li>
        `;
      });
      // Insert List items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
  };
})();

// App Controller
const AppController = (function (ItemController, UIController) {
  // Public Methods
  return {
    init: function () {
      // Fetch items from data structure
      const items = ItemController.getItems();
      // Populate list with items
      UIController.populateItemList(items);
    },
  };
})(ItemController, UIController);

// Initialize App
AppController.init();
