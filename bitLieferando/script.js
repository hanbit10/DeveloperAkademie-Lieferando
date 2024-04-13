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

let menus = [];

var xhr = new XMLHttpRequest();
xhr.open("GET", "/bitLieferando/assets/data/menu.json", true);
xhr.responseType = "json";
xhr.onload = function () {
  if (xhr.status === 200) {
    var data = xhr.response;
    menus = data;
  }
};
xhr.send();

let baskets = [];
let amount = 0;

function render() {
  getLocalStorageItems();
  renderFavorite();
  renderMenu();
  renderSoup();
  renderSideMenu();
  renderFries();
  renderDrinks();
  renderBaskets();
}

function getId(el) {
  return document.getElementById(el);
}

function getLocalStorageItems() {
  if (localStorage.getItem("baskets") !== null) {
    getBaskets();
  }

  if (localStorage.getItem("amount") !== null) {
    getAmount();
  }
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
  let obj = getObj(menu);
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

function getObj(menu) {
  let obj = {
    food: menu["food"],
    price: menu["price"],
    amount: 1,
  };
  return obj;
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
    element2.innerHTML += getTotalBasket(price);
    element3.innerHTML = getCalcBasket(price);
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
    <div class="calc-total">Total price ${price.toFixed(2)} €</div> 
    <div onclick="getCheckout()" class="calc-checkout">Checkout ${price.toFixed(2)} €</div>
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
      <span class="calc-price"> ${eachPrice.toFixed(2)} € </span>  
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
    <div onclick="openBasket()" class="calc-basket-btn"> (${amount}) Basket ${price.toFixed(2)} €</div> 
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
  if (basket["amount"] >= 1) {
    basket["amount"] = +basket["amount"] - 1;
    amount--;
  }

  if (basket["amount"] == 0) {
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
