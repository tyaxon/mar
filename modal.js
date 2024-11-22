// Abrir modal
function openCartModal() {
    console.log('Modal abierto'); // Agregar esta línea para verificar que se ejecuta
    document.getElementById("cart-modal").style.display = "flex";
  }
  
  
  // Cerrar modal
  document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("cart-modal").style.display = "none";
  });
  
  // Actualizar contenido del modal
// Actualizar el modal con los productos del carrito
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

  // Asignar los eventos de los botones después de agregar el HTML
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
}

  
  