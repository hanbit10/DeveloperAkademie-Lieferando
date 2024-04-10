async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

let menus = [
  {
    food: "Bulgogi",
    price: "10.99",
    description: ["Marinated beef grilled to perfection", "Served with rice and lettuce wraps"],
  },
  {
    food: "Jaejuk",
    price: "8.50",
    description: ["Spicy vegetable and seafood soup", "Made with gochujang (Korean chili paste)"],
  },
  {
    food: "Japchae",
    price: "9.50",
    description: ["Stir-fried glass noodles with vegetables and meat", "Sweet and savory dish seasoned with soy sauce and sesame oil"],
  },
  {
    food: "Dakgalbi",
    price: "12.99",
    description: ["Spicy stir-fried chicken with vegetables and rice cakes", "Served on a hot plate"],
  },
  {
    food: "Bibimbap",
    price: "10.50",
    description: ["Mixed rice dish with assorted vegetables and meat", "Topped with a fried egg and spicy gochujang sauce"],
  },
  {
    food: "Kimchi jjigae",
    price: "12.99",
    description: ["Spicy kimchi stew with pork or tofu", "Comforting and full of flavor"],
  },
  {
    food: "Galbitang",
    price: "12.99",
    description: ["Clear beef short rib soup", "Simmered with radish and Korean herbs"],
  },
  {
    food: "Samgyetang",
    price: "12.99",
    description: ["Ginseng chicken soup", "Nutritious and revitalizing, with whole chicken and ginseng"],
  },
  {
    food: "Seolleongtang",
    price: "10.50",
    description: ["Milky beef bone soup", "Slow-simmered for hours, served with rice and scallions"],
  },
  {
    food: "Sundubu Jjigae",
    price: "9.50",
    description: ["Soft tofu stew", "Spicy and comforting, with tofu, vegetables, and seafood"],
  },
  {
    food: "Kimchi",
    price: "3.50",
    description: ["Fermented spicy cabbage", "A staple in Korean cuisine"],
  },
  {
    food: "Korean Pancakes (Jeon)",
    price: "4.50",
    description: ["Assorted savory pancakes", "Made with various ingredients like seafood, vegetables, or kimchi"],
  },
  {
    food: "Korean Egg Rolls (Gyeran Mari)",
    price: "4.50",
    description: ["Rolled omelette with vegetables", "Sliced and served as a side dish or snack"],
  },
  {
    food: "Tteokbokki",
    price: "6.99",
    description: ["Spicy stir-fried rice cakes", "Topped with fish cakes and boiled eggs"],
  },
  {
    food: "Mandu",
    price: "7.50",
    description: ["Korean dumplings filled with meat and vegetables", "Steamed or fried options available"],
  },
  {
    food: "Fried Shrimps",
    price: "4.99",
    description: ["Golden fried shrimps served with dipping sauce", "Succulent and crunchy"],
  },
  {
    food: "Onion Rings",
    price: "3.50",
    description: ["Deep-fried battered onion rings", "Crunchy and delicious"],
  },
  {
    food: "Fried Chicken Wings",
    price: "4.99",
    description: ["Spicy or barbecue-flavored wings", "Served with ranch dressing"],
  },
  {
    food: "Chicken Tenders",
    price: "5.50",
    description: ["Crispy breaded chicken tenders", "Perfect for dipping in honey mustard sauce"],
  },
  {
    food: "Mozzarella Sticks",
    price: "4.99",
    description: ["Deep-fried breaded mozzarella cheese sticks", "Served with marinara sauce"],
  },
  {
    food: "Soda",
    price: "2.50",
    description: ["Refreshing carbonated drink", "1 litre"],
  },
  {
    food: "Iced Tea",
    price: "3.00",
    description: ["Cold brewed tea served over ice", "1 litre"],
  },
  {
    food: "Fruit Punch",
    price: "3.50",
    description: ["Tropical fruit blend", "1 litre"],
  },
  {
    food: "Lemonade",
    price: "3.00",
    description: ["Freshly squeezed lemonade", "1 litre"],
  },
  {
    food: "Orange Juice",
    price: "3.50",
    description: ["Freshly squeezed orange juice", "1 litre"],
  },
  {
    food: "Apple Juice",
    price: "3.50",
    description: ["100% pure apple juice", "1 litre"],
  },
  {
    food: "Cranberry Juice",
    price: "3.50",
    description: ["Tart and refreshing", "1 litre"],
  },
  {
    food: "Coconut Water",
    price: "4.00",
    description: ["Natural electrolytes", "1 litre"],
  },
];

let baskets = [];
let amount = 0;

function render() {
  if (localStorage.getItem("baskets") !== null) {
    getBaskets();
  }

  if (localStorage.getItem("amount") !== null) {
    getAmount();
  }

  renderFavorite();
  renderMenu();
  renderSoup();
  renderSideMenu();
  renderFries();
  renderDrinks();
  renderBaskets();
}

function getId(el) {
  let element = document.getElementById(el);
  return element;
}

function getMenuData(index) {
  let menu = menus[index];
  let food = menu["food"];
  return /*html*/ `
  <div onclick='addBasket("${food}")' class="dish-menu">
    <div class="dish-menu-title"> ${menu["food"]} </div>
    <span class="dish-menu-desc"> ${menu["description"]} </span>
    <div class="dish-menu-price"> ${menu["price"]} € </div>
    <div class="dish-menu-add">+</div>
  </div>`;
}

function addBasket(getFood) {
  let mIndex = menus.findIndex((e) => e.food === getFood);
  let menu = menus[mIndex];
  let obj = {
    food: menu["food"],
    price: menu["price"],
    amount: 1,
  };
  let fIndex = baskets.findIndex((e) => e.food === obj["food"]);
  let consist = baskets.some((e) => e.food === obj["food"]);

  if (amount >= 20) {
    alert("Yout can't order anymore");
  } else if (consist) {
    if (baskets[fIndex]["amount"] >= 5) {
      alert("You can't order more than 5 same dish!");
    } else {
      baskets[fIndex]["amount"] += 1;
      amount++;
    }
  } else if (baskets.length >= 8) {
    alert("You can't order more of other dish!");
  } else {
    baskets.push(obj);
    amount++;
  }

  saveBaskets();
  saveAmount();
  render();
}

function renderBaskets() {
  let element = getId("calcElement");
  let element2 = getId("calcTotal");
  let element3 = getId("calcBasket");
  element.innerHTML = "";
  element2.innerHTML = "";
  element3.innerHTML = "";
  let price = 0;
  let eachPrice = 0;

  for (let i = 0; i < baskets.length; i++) {
    let basket = baskets[i];
    let food = basket["food"];
    price += +basket["price"] * basket["amount"];
    eachPrice = +basket["price"] * basket["amount"];
    element.innerHTML += getCalc(i, food, eachPrice);
  }

  if (baskets.length == 0) {
    element2.innerHTML = getEmptyBasket();
    element3.classList.add("tablet-d-none");
    element.classList.add("tablet-d-none");
  } else {
    element2.innerHTML += getTotalBasket(price.toFixed(2));
    element3.innerHTML = getCalcBasket(price.toFixed(2));
    element.classList.remove("tablet-d-none");
    element3.classList.remove("tablet-d-none");
  }
}

function getEmptyBasket() {
  return /*html*/ `
  <div class="calc-total-item">
    <img class="calc-img" src="/bitLieferando/assets/icons/bag-shopping-solid.svg" alt="">
    <h2>Fill out the basket</h2>
    <div>You basket is empty</div>
  </div> `;
}

function getTotalBasket(price) {
  return /*html*/ `
  <div class="calc-total-item">
    <div class="calc-total">Total price ${price} €</div> 
    <div onclick="getCheckout()" class="calc-checkout">Checkout ${price} €</div>
  </div> `;
}

function getCheckout() {
  alert("Test checkout is proceed");
  baskets = [];
  amount = 0;
  saveBaskets();
  saveAmount();
  render();
}

function getCalc(index, food, eachPrice) {
  let basket = baskets[index];
  return /*html*/ `
  <div class="calc-box">
    <div class="calc-food-item">
      <span class="calc-food"> ${basket["food"]} </span>
      <span class="calc-price"> ${eachPrice} € </span>  
    </div>
    <div class="calc-amount">
      <div class="calc-btn" onclick='removeBasket("${food}")'>-</div>
        <span class="calc-btn-amount">${basket["amount"]}</span>
      <div class="calc-btn" onclick='addBasket("${food}")'>+</div>
    </div>
  </div> `;
}

function getCalcBasket(price) {
  return /*html*/ `
  <div class="calc-total-item">
    <div onclick="openBasket()" class="calc-basket-btn"> (${amount}) Basket ${price} €</div> 
  </div> `;
}

function openBasket() {
  let element = getId("calcContent");
  element.classList.remove("tablet-d-none");
}

function closeBasket() {
  let element = getId("calcContent");
  element.classList.add("tablet-d-none");
}

function removeBasket(getFood) {
  let fIndex = baskets.findIndex((e) => e.food === getFood);
  let basket = baskets[fIndex];
  if (basket["amount"] > 0) {
    basket["amount"] = +basket["amount"] - 1;
    amount--;
  } else if (basket["amount"] == 0) {
    baskets.splice(fIndex, 1);
  }
  saveBaskets();
  saveAmount();
  render();
}

function saveBaskets() {
  localStorage.setItem("baskets", JSON.stringify(baskets));
}

function saveAmount() {
  localStorage.setItem("amount", JSON.stringify(amount));
}

function getAmount() {
  const item = localStorage.getItem("amount");
  amount = +item;
}

function getBaskets() {
  const item = localStorage.getItem("baskets");
  baskets = JSON.parse(item);
}

function renderFavorite() {
  let element = getId("getFavorite");
  element.innerHTML = "";
  let index = [0, 1, 4, 5, 6];
  for (let i = 0; i < index.length; i++) {
    element.innerHTML += getFavorite(index[i]);
  }
}

function getFavorite(index) {
  let menu = getMenuData(index);
  return menu;
}

function renderMenu() {
  let element = getId("getMenu");
  element.innerHTML = "";
  for (let i = 0; i < 5; i++) {
    element.innerHTML += getMenu(i);
  }
}

function getMenu(index) {
  let menu = getMenuData(index);
  return menu;
}

function renderSoup() {
  let element = getId("getSoup");
  element.innerHTML = "";
  for (let i = 5; i < 10; i++) {
    element.innerHTML += getSoup(i);
  }
}

function getSoup(index) {
  let menu = getMenuData(index);
  return menu;
}

function renderSideMenu() {
  let element = getId("getSideMenu");
  element.innerHTML = "";
  for (let i = 10; i < 15; i++) {
    element.innerHTML += getSideMenu(i);
  }
}

function getSideMenu(index) {
  let menu = getMenuData(index);
  return menu;
}

function renderFries() {
  let element = getId("getFries");
  element.innerHTML = "";
  for (let i = 15; i < 20; i++) {
    element.innerHTML += getFries(i);
  }
}

function getFries(index) {
  let menu = getMenuData(index);
  return menu;
}

function renderDrinks() {
  let element = getId("getDrinks");
  element.innerHTML = "";
  for (let i = 20; i < menus.length; i++) {
    element.innerHTML += getDrinks(i);
  }
}

function getDrinks(index) {
  let menu = getMenuData(index);
  return menu;
}
