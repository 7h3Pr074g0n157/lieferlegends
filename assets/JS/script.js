let cart = [],
  shoppingCart = document.getElementById('shopping-cart'),
  shoppingCartIcon = document.getElementById('shopping-cart--icon');

let foodSorts = document.querySelectorAll('.main-nav__item');
foodSorts.forEach((sort) => {
  sort.addEventListener('click', handleSortFood);
});

let filterFood = document.getElementById('main-header__filter-food');

let dishTitle = document.getElementById('dish-heading'),
  dishSup = document.getElementById('dish-sup'),
  dishSub = document.getElementById('dish-sub'),
  dishPrice = document.getElementById('dish-price'),
  dishImage = document.getElementById('dish-image');

function formatPrice(price) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

function createDishes(id, sorts, heading, sup, sub, price, image) {
  return `
  <article class="dish-card" data-sorts="${sorts}">
          <div class="dish-main">
            <header class="dish-main__header">
              <h3 id="dish-heading">${heading}</h3>
            </header>
            <div class="dish-main__description">
              <p id="dish-sup" class="dish-main__description--sup">${sup}</p>
              <p id="dish-sub" class="dish-main__description--sub">${sub}</p>
            </div>
            <div id="dish-price" class="dish-main__price">
            ${price}
            </div>
          </div>
          <aside class="dish-aside">
            <div data-id="${id}" class="dish-aside__add fas fa-plus"></div>
            <img
              src="assets/images/dish/${image}"
              id="dish-image"
              class="dish-aside__img"
              alt=""
            />
          </aside>
        </article>
  `;
}

function findProduct(id, datas) {
  return datas.find((data) => data.id === id);
}

function findIndex(id) {
  return cart.findIndex((item) => item.id == id);
}

function handleDeleteItem(e) {
  e.stopPropagation();
  cart.splice(findIndex(this.parentElement.dataset.id), 1);
  displayShoppingCard();
}

function resetDisplayShoppingCart() {
  let = itemList = document.getElementById('shopping-cart__items');
  itemList.innerHTML = '';
  [...document.getElementsByClassName('cart-item__delete')].forEach(
    (cartItem) => cartItem.removeEventListener('click', handleDeleteItem)
  );
  return itemList;
}

function displayShoppingCard() {
  let itemList = resetDisplayShoppingCart();

  itemList.innerHTML = `
  <tr class="shopping-cart__item shopping-cart__item--headline">
  <th class="cart-item__headline">Produkt:</th>
  <th class="cart-item__headline">Preis:</th>
  <th></th>
  </tr>
  `;

  cart.forEach((cartItem) => {
    itemList.innerHTML += `
    <tr class="shopping-cart__item" data-id="${cartItem.id}">
    
    <td class="cart-item__heading">${cartItem.heading}</td>
    <td class="cart-item__price">${formatPrice(cartItem.price)}</td>
    
    <td><i class="cart-item__delete fas fa-trash"></i></td>
    </tr>
    `;
    [...document.getElementsByClassName('cart-item__delete')].forEach(
      (cartItem) => cartItem.addEventListener('click', handleDeleteItem)
    );
  });

  itemList.innerHTML += `
  <tr class="shopping-cart__item shopping-cart__item--footer">
  <td class="cart-item__footer">Gesamt:</td>
  <td class="cart-item__footer">${formatPrice(
    cart.reduce((acc, curr) => {
      return acc + curr.price;
    }, 0)
  )}</td>
  <td></td>
  </tr>
  `;

  console.log();
}

function handleFilterFood() {
  let regex = new RegExp(this.value, 'i');
  [...document.getElementsByClassName('dish-card')].forEach((card) => {
    let heading = card.querySelector('#dish-heading').textContent;

    card.style.display = 'flex';
    if (!regex.test(heading)) {
      card.style.display = 'none';
    }
  });
}

function handleSortFood() {
  filterFood.value = '';
  [...document.getElementsByClassName('dish-card')].forEach((card) => {
    let sorts = card.dataset.sorts.split(','),
      sort = this.dataset.sort;

    card.style.display = 'flex';
    if (sort === 'all') {
      card.style.display = 'flex';
    } else if (!sorts.includes(sort)) {
      card.style.display = 'none';
    }
  });
}

function handleAddItem(e) {
  e.stopPropagation();
  fetch('assets/JS/products.json')
    .then((response) => response.json())
    .then((datas) => {
      const product = findProduct(+e.target.dataset.id, datas);
      cart.push(product);
      displayShoppingCard();
    });
}

fetch('assets/JS/products.json')
  .then((response) => response.json())
  .then((datas) => {
    datas.forEach((data) => {
      document.getElementById('dishes').innerHTML += createDishes(
        data.id,
        data.sorts,
        data.heading,
        data.sup,
        data.sub,
        formatPrice(data.price),
        data.image
      );
    });

    [...document.getElementsByClassName('dish-aside__add')].forEach((card) => {
      card.addEventListener('click', handleAddItem);
    });
  });

shoppingCartIcon.addEventListener('click', () => {
  if (cart.length != 0) {
    document
      .getElementById('shopping-cart--items-wrapper')
      .classList.toggle('d-none');
  }
});

filterFood.addEventListener('input', handleFilterFood);
