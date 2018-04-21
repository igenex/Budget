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
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  }

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

  calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(item => {
      sum += item.value;
    });
    data.totals[type] = sum;
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
    },
    budget: 0,
    percentage: -1
  };



  return {

    addItem: function (type, desc, val) {
      var newItem, ID, calculateTotal;

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

    deleteItem: function (type, id) {
      var ids, index
      ids = data.allItems[type].map(item => {
        return item.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income & expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp
      // calculate the % of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allItems.exp.forEach(item => {
        item.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function () {
      var allPerc = data.allItems.exp.map(item => item.getPercentage());
      return allPerc;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month' 
  }

  formatNumber = function(num, type) {
    var numSplit, int, dec, sign;
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");
    [int, dec] = numSplit;
    if(int.length > 3) {
      int = int.substr(0,int.length - 3) + "," + int.substr(int.length - 3, 3);
    } 
    return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value,
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
      }
    },
    addListItem: function (obj, type) {
      var html, newHtml, element;
      //Create HTML with placeholer text
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%">' +
          '<div class="item__description">%description%</div>' +
          '<div class="right clearfix">' +
          '<div class="item__value">%value%</div>' +
          '<div class="item__delete">' +
          '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
          '</div>' +
          '</div>' +
          '</div>';
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%">' +
          '<div class="item__description">%description%</div>' +
          '<div class="right clearfix">' +
          '<div class="item__value">%value%</div>' +
          '<div class="item__percentage">---</div>' +
          '<div class="item__delete">' +
          '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
          '</div>' +
          '</div>' +
          '</div>';
      }
      //replace the placeholders text with some data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      //Insert the HTML into the dom
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function (selectorID) {
      console.log(selectorID);
      var el = document.querySelector('#'+selectorID);
      el.parentElement.removeChild(el);
    },

    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMStrings.inputDescription + ", " + DOMStrings.inputValue);
      // fieldsArr = [].slice.call(fields);
      fieldsArr = Array.from(fields);
      fieldsArr.forEach(field => {
        field.value = "";
        fieldsArr[0].focus();
      });

    },
    displayBudget: function (obj) {
      var type;
      type = obj.budget > 0 ? 'inc' : 'exp';
      document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = "---";
      }
    },
    displayPercentages: function(percentage) {
      var fields, nodeListForEach;
      fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      nodeListForEach = function(list, cb) {
        for(let i = 0; i < list.length; i++) {
          cb(list[i], i);
        }
      }

      nodeListForEach(fields, function(curr, index) {
        if(percentage[index] > 0) {
          curr.textContent = percentage[index] + '%';
        } else {
          curr.textContent = '---';
        }
        
      });
    },
    displayMonth: function() {
      var now, year, month;
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      now = new Date();
      year = now.getFullYear();
      month = now.getMonth();

      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + " " + year;
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
  var setupEventListeners, updateBudget, ctrlAddItem, budget, ctrlDeleteItem,
    updatePercentages;

  setupEventListeners = function () {
    var DOM = UICtrl.getDOMStrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', e => {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  updatePercentages = function () {
    var percentages;
    //1. Calculate persentages
    budgetCtrl.calculatePercentages();
    //2. Read % from the budget controller
    percentages = budgetCtrl.getPercentage();
    //3. Update the UI with the new %
    UICtrl.displayPercentages(percentages);
  }

  ctrlDeleteItem = function (e) {
    var itemID, splitID, type, ID;
    itemID = e.target.parentElement.parentElement.parentElement.parentElement.id;
    if (itemID) {
      splitID = itemID.split("-");
      [type, ID] = splitID;

      //1. Delete the item from the data structure
      budgetCtrl.deleteItem(type, +ID);
      //2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      //3. Upldate and show the new budget
      updateBudget();
      //4. Update the %
      updatePercentages();
    }
  };

  updateBudget = function () {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();
    //2. Return the budget
    budget = budgetCtrl.getBudget();
    //3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  }

  ctrlAddItem = function () {
    var input, newItem;
    //1. Get the filed input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      //4. Calc the budget
      UICtrl.clearFields();
      //5. Calculate & update budget
      updateBudget();
      //6. Update the %
      updatePercentages();
    }

  };

  return {
    init: function () {
      console.log("Application has started");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  }

})(budgetController, UIController);

controller.init();