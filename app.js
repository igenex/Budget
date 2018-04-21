//Budget controller
var budgetController = (function () {

  /**
   * @constructor - Constructor for Expense
   * @param {number} id - uniq id 
   * @param {string} description - description
   * @param {number} value - volume of money
   */
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  /**
   * @constructor - Constructor for income
   * @param {number} id - uniq id 
   * @param {string} description - desciption 
   * @param {number} value - volume of money
   */
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //Data Structure for app
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function (type, desc, val) {
      var newItem, ID;

      //new id
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }


      //new item
      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      }

      //pushing in DS
      data.allItems[type].push(newItem);
      return newItem;
    },
    testing: function () {
      return data;
    }
  }

})();


// UI Controller
var UIController = (function () {

  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: document.querySelector(DOMStrings.inputValue).value
      }
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      //Create HTML with placeholer text
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%">' +
          '<div class="item__description">%description%</div>' +
          '<div class="right clearfix">' +
          '<div class="item__value">+ %value%</div>' +
          '<div class="item__delete">' +
          '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
          '</div>' +
          '</div>' +
          '</div>';
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%">' +
          '<div class="item__description">%description%</div>' +
          '<div class="right clearfix">' +
          '<div class="item__value">- %value%</div>' +
          '<div class="item__percentage">21%</div>' +
          '<div class="item__delete">' +
          '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
          '</div>' +
          '</div>' +
          '</div>';
      }
      //replace the placeholders text with some data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);
      //Insert the HTML into the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    getDOMStrings: function () {
      return DOMStrings;
    }
  }

})();

/**
 * Global App controller
 * @param  {object} budgetCtrl - Budget Controller
 * @param  {object} UICtrl - UI Controller
 */
var controller = (function (budgetCtrl, UICtrl) {

  var setupEventListeners = function () {
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    })
  };

  var ctrlAddItem = function () {
    var input, newItem;
    //1. Get the filed input data
    input = UICtrl.getInput();
    //2. Add the item to the budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    //3. Add the item to the UI
    UICtrl.addListItem(newItem, input.type);
    //4. Calc the budget

    //5. Display the budget on the UI

  };

  return {
    init: function () {
      console.log("Application has started");
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();