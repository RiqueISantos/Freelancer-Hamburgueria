const cart = document.getElementById("user-cart");
const closeBtn = document.getElementById("close-modal-btn");
const modal = document.getElementById("modal-container");
const addCartBtn = document.getElementsByClassName("add-cart-btn");
const menu = document.getElementById("menu");
const cartItemsContainer = document.getElementById("cart-items");
const totalCart = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("input-address");
const checkoutBtn = document.getElementById("checkout-btn");
const addressWarn = document.getElementById("address-warn");
const openingHours = document.getElementById("opening-hours");
const listCart = [];

cart.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style["display"] = "flex";
  updateCartModal();
});

modal.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target === modal) {
    modal.style["display"] = "none";
  }
});

closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style["display"] = "none";
});

menu.addEventListener("click", (event) => {
  event.preventDefault();

  let parentButton = event.target.closest(".add-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price")).toFixed(
      2
    );
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = listCart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    listCart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";

  let total = 0;

  listCart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.innerHTML = `
      <div class = "containerModal">
        <div class = "elementModal">
          <p class = "nameModal">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class = "priceModal">R$ ${item.price}</p>
        </div>

        <div>
          <button class = "remove-to-cart-btn" data-name = "${item.name}">
            Remover 
          </button>        
        </div>

      </div>
    `;

    total += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  totalCart.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCount.innerHTML = listCart.length;
}

cartItemsContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-to-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = listCart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const items = listCart[index];

    if (items.quantity > 1) {
      items.quantity -= 1;
      updateCartModal();
      return;
    }

    listCart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", (event) => {
  let inputValue = event.target.value;

  if (inputValue !== " ") {
    addressInput.classList.remove("warn");
    addressWarn.style["display"] = "none";
  }
});

checkoutBtn.addEventListener("click", () => {
  const isOpen = restaurantOperation();
  if (!isOpen) {
    Toastify({
      text: "Ops o restaurante está fechado no momento!",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444)",
      },
    }).showToast();
    return;
  }

  if (listCart.length == 0) {
    return;
  }

  if (addressInput.value == "") {
    addressWarn.style["display"] = "block";
    addressInput.classList.add("warn");
    return;
  }

  const cartItems = listCart
    .map((item) => {
      return `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}
`;
    })
    .join("");

  // api whatsApp
  const message = encodeURIComponent(cartItems);
  const phone = "968596802";

  window.open(
    `https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`,
    "_blank"
  );

  listCart.length = 0;
  addressInput.value = "";
  updateCartModal();
});

function restaurantOperation() {
  const atualHours = new Date().getHours();

  return atualHours >= 18 && atualHours <= 22;
}

const isOpen = restaurantOperation();

if (isOpen) {
  openingHours.style["background-color"] = "rgb(15, 206, 85)";
} else {
  openingHours.style["background-color"] = "rgb(233, 65, 59)";
}
