// Función para generar el mensaje de WhatsApp
function generateWhatsAppMessage(cartItems) {
  let message = "Hola, estoy interesado en los siguientes productos:\n";
  
  cartItems.forEach(item => {
    message += `- ${item.name} (Cantidad: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}\n`;
  });

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  message += `\nTotal: $${totalPrice}`;

  return message; // No es necesario usar encodeURIComponent aquí ya que se hace en la URL
}

// Función para redirigir a WhatsApp
function redirectToWhatsApp(cartItems) {
  // Asegúrate de tener datos actualizados del carrito
  if (cartItems.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Carrito vacío',
      text: '¡Por favor agrega productos al carrito antes de continuar!',
    });
    return;
  }

  const message = generateWhatsAppMessage(cartItems);
  const phoneNumber = "5492241540585";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// Abrir modal
function openCartModal() {
  console.log('Modal abierto');
  document.getElementById("cart-modal").style.display = "flex";
}

// Cerrar modal
document.getElementById("close-modal").addEventListener("click", function () {
  document.getElementById("cart-modal").style.display = "none";
});

// Actualizar contenido del modal
function updateCartModal() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  cartItemsContainer.innerHTML = '';  // Limpiar contenido del modal
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

  // Asignar eventos de botones después de agregar HTML
  document.querySelectorAll('.increase-quantity').forEach(button => {
    button.addEventListener('click', function() {
      increaseQuantity(button.getAttribute('data-id'));
    });
  });

  document.querySelectorAll('.decrease-quantity').forEach(button => {
    button.addEventListener('click', function() {
      decreaseQuantity(button.getAttribute('data-id'));
    });
  });

  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function() {
      removeFromCart(button.getAttribute('data-id'));
    });
  });

  totalPriceElement.textContent = totalPrice.toFixed(2);  // Actualizar el total

  // Asignar el evento al botón de checkout para redirigir a WhatsApp
  document.getElementById("checkout-button").addEventListener("click", function() {
    redirectToWhatsApp(cart);
  });
}
