const SHEET_URL = "https://sheets.googleapis.com/v4/spreadsheets/1Uok1tS2ap4BpvG-RRubjFFGeewECz2JcdNyp1bjpFEE/values/mar!A1:F100?key=AIzaSyCsjBMMk59ZByodPnqyrnDEbkKBjXGq9cM";
const productsPerPage = 10;
let currentPage = 1;
let cart = [];
let cartCount = 0;

// Función para actualizar los botones de paginación
function updatePaginationButtons(totalProducts) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const paginationContainer = document.getElementById("pagination");

  // Limpiar los botones anteriores de paginación
  paginationContainer.innerHTML = '';

  // Crear los botones de paginación
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");
    
    // Añadir un listener de clic para cambiar de página
    button.addEventListener("click", function() {
      currentPage = i;
      fetchProducts();  // Volver a cargar los productos para la nueva página
    });

    paginationContainer.appendChild(button);
  }
}

// Función para obtener los productos desde la hoja de Google Sheets
async function fetchProducts(category = "", query = "") {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const rows = data.values;

    if (rows && rows.length > 1) {
      const [headers, ...products] = rows;
      const filteredProducts = products.filter(product => {
        const matchesCategory = category ? product[2] === category : true;
        const matchesQuery = product[1].toLowerCase().includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      });
      displayProducts(filteredProducts);
      updatePaginationButtons(filteredProducts.length);
    } else {
      console.error("No hay datos en la hoja.");
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

// Función para mostrar los productos en la página
function displayProducts(products) {
  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = ''; // Limpiar antes de mostrar productos

  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const currentProducts = products.slice(start, end);

  currentProducts.forEach(product => {
    const [id, name, category, price, stock, image] = product;

    const productCard = `
      <div class="product-card">
        <img src="img/${image}" alt="${name}" class="product-image" />
        <h3>${name}</h3>
        <p>Precio: $${price}</p>
        <p>Categoría: ${category}</p>
        <p>Stock: ${stock}</p>
        <button class="add-to-cart" data-id="${id}" data-name="${name}" data-price="${price}" data-image="${image}" data-stock="${stock}">Agregar al carrito</button>
      </div>
    `;

    productsContainer.innerHTML += productCard;
  });

  const buttons = document.querySelectorAll('.add-to-cart');
  buttons.forEach(button => {
    button.addEventListener('click', addToCart);
  });

  loadCartState();
}

// Función para agregar un producto al carrito
function addToCart(event) {
  const button = event.target;
  const productId = button.getAttribute("data-id");
  const productName = button.getAttribute("data-name");
  const productPrice = parseFloat(button.getAttribute("data-price"));
  const productImage = button.getAttribute("data-image");
  const productStock = parseInt(button.getAttribute("data-stock"));

  const existingProductIndex = cart.findIndex(item => item.id === productId);

  if (existingProductIndex === -1) {
    cart.push({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      stock: productStock,
      quantity: 1
    });
    cartCount++;
  }

  button.textContent = "En el carrito";
  button.disabled = true;

  saveCartToLocalStorage();  // Guarda el carrito actualizado
  updateCartCount();         // Actualiza el contador del carrito
  updateCartModal();         // Actualiza el modal del carrito
  openCartModal();           // Abre el modal cuando un producto es añadido
}

// Función para actualizar el contador del carrito
function updateCartCount() {
  const cartCountElement = document.getElementById("cart-count");
  cartCountElement.textContent = cartCount;
}

// Función para mostrar el contenido del carrito en el modal
function updateCartModal() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceElement = document.getElementById("total-price");

  cartItemsContainer.innerHTML = ''; // Limpiar antes de mostrar los productos del carrito

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

  // Añadir eventos para eliminar productos y cambiar cantidades
  const removeButtons = document.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', removeFromCart);
  });

  const decreaseButtons = document.querySelectorAll('.decrease-quantity');
  decreaseButtons.forEach(button => {
    button.addEventListener('click', decreaseQuantity);
  });

  const increaseButtons = document.querySelectorAll('.increase-quantity');
  increaseButtons.forEach(button => {
    button.addEventListener('click', increaseQuantity);
  });
}

// Función para abrir el modal del carrito
function openCartModal() {
  document.getElementById("cart-modal").style.display = "flex";
}

// Función para cerrar el modal del carrito
document.getElementById("close-modal").addEventListener("click", function() {
  document.getElementById("cart-modal").style.display = "none";
});

// Función para manejar el clic en el ícono del carrito
document.getElementById("cart-icon").addEventListener("click", openCartModal); // Cambia "cart-icon" por el id real del ícono de carrito

// Llamamos a las funciones al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  loadCartFromLocalStorage();  // Cargar carrito desde localStorage
  updateCartCount();  // Asegúrate de actualizar el contador al cargar la página
  updateCartModal();  // Actualizar el contenido del carrito en el modal (pero NO lo abre automáticamente)
  fetchProducts();  // Traer los productos
});


// Filtros de categoría
document.getElementById("category-filter").addEventListener("change", function(event) {
  const selectedCategory = event.target.value;
  fetchProducts(selectedCategory);
});

// Búsqueda de productos
document.getElementById("search-input").addEventListener("input", function(event) {
  const searchQuery = event.target.value;
  fetchProducts("", searchQuery);  // Usamos vacío para no filtrar por categoría
});
