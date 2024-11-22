let cart = [];
let cartCount = 0;

// Cargar carrito desde Local Storage
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {  
      cart = JSON.parse(savedCart);
      cartCount = cart.length; 
    }
  }
  

// Guardar carrito en Local Storage
function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


// Agregar producto al carrito
function addToCart(event) {
    const button = event.target;
    const productId = button.getAttribute("data-id");
    const productName = button.getAttribute("data-name");
    const productPrice = parseFloat(button.getAttribute("data-price"));
    const productImage = button.getAttribute("data-image");
    const productStock = parseInt(button.getAttribute("data-stock"));

    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex === -1) {
      cart.push({ id: productId, name: productName, price: productPrice, image: productImage, stock: productStock, quantity: 1 });
      cartCount++;
    }

    // Cambiar el estado del botón
    button.textContent = "En el carrito";  // Cambiar el texto del botón
    button.disabled = true;  // Desactivar el botón

    saveCartToLocalStorage();
    updateCartCount();
    updateCartModal();
}

  

// Actualizar contador del carrito
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.textContent = cartCount;
}

// Aumentar la cantidad de un producto en el carrito
function increaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);
  if (product && product.quantity < product.stock) {
    product.quantity++;
    
    saveCartToLocalStorage();
    updateCartCount();
    updateCartModal();
  }
}

// Disminuir la cantidad de un producto en el carrito
function decreaseQuantity(productId) {
  const product = cart.find(item => item.id === productId);
  if (product && product.quantity > 1) {
    product.quantity--;
    
    saveCartToLocalStorage();
    updateCartCount();
    updateCartModal();
  }
}


// Eliminar un producto del carrito
function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
      cartCount -= cart[productIndex].quantity;
      cart.splice(productIndex, 1);
      saveCartToLocalStorage();
      updateCartCount();
      updateCartModal();
      updateCartButton(productId, false);  // Cambiar el botón a "Agregar al carrito"
    }
  }
  
  // Función para actualizar el estado del botón en la página
  function updateCartButton(productId, isInCart) {
    const button = document.querySelector(`[data-id="${productId}"]`);
    if (button) {
      if (isInCart) {
        button.textContent = "En el carrito";  // Cambiar el texto a "En el carrito"
        button.disabled = true;  // Desactivar el botón cuando está en el carrito
      } else {
        button.textContent = "Agregar al carrito";  // Cambiar el texto a "Agregar al carrito"
        button.disabled = false;  // Habilitar el botón nuevamente
      }
    }
  }
  
// Actualizar el modal con los productos del carrito
function updateCartModal() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
  
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
  
    cart.forEach(item => {
      const itemTotalPrice = item.price * item.quantity;
      totalPrice += itemTotalPrice;
  
      const cartItemHTML = `
        <div class="cart-item">
          <img src="img/${item.image}" alt="${item.name}" class="cart-item-image" />
          <div class="cart-item-info">
            <p>${item.name}</p>
            <p>Precio: $${item.price}</p>
            <p>
              Cantidad: 
              <button class="decrease-quantity" data-id="${item.id}">-</button>
              ${item.quantity}
              <button class="increase-quantity" data-id="${item.id}">+</button>
            </p>
          </div>
          <button class="remove-item" data-id="${item.id}">Eliminar</button>
          <p>Total: $${itemTotalPrice.toFixed(2)}</p>
        </div>
      `;
      cartItemsContainer.innerHTML += cartItemHTML;
    });
  
    totalPriceElement.textContent = totalPrice.toFixed(2);
  
    // Agregar el evento de eliminar a los botones de "Eliminar"
    document.querySelectorAll(".remove-item").forEach(button => {
      button.addEventListener("click", removeFromCart);
    });
  }
  function updateCartUI() {
    const addButtons = document.querySelectorAll(".add-to-cart");
  
    addButtons.forEach(button => {
      const productId = button.getAttribute("data-id");
      const isInCart = cart.some(item => item.id === productId);
  
      // Si el producto está en el carrito, oculta el botón "Agregar al carrito"
      if (isInCart) {
        button.classList.add("hidden"); // Ocultar el botón
      } else {
        button.classList.remove("hidden"); // Mostrar el botón
      }
    });
  }
  

// Mostrar el modal de carrito
function showCartModal() {
  const modal = document.getElementById("cart-modal");
  modal.style.display = "block";
}

// Cerrar el modal de carrito
function closeCartModal() {
  const modal = document.getElementById("cart-modal");
  modal.style.display = "none";
}

// Cerrar el modal si el usuario hace clic fuera del contenido del modal
window.onclick = function(event) {
  const modal = document.getElementById("cart-modal");
  if (event.target === modal) {
    closeCartModal();
  }
}

// Llamar a la función para cargar el carrito cuando la página se carga
loadCartFromLocalStorage();
updateCartCount();

// Mostrar el modal cuando se hace clic en el carrito
document.getElementById("cart-button").addEventListener("click", showCartModal);

// Cerrar el modal cuando se hace clic en la "x"
document.getElementById("close-modal").addEventListener("click", closeCartModal);