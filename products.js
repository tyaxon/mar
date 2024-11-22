const productsPerPage = 10;
let currentPage = 1;

// Función para mostrar productos
function displayProducts(products) {
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = '';
  
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const currentProducts = products.slice(start, end);
  
    currentProducts.forEach(product => {
      const [id, name, category, price, stock, image] = product;
  
      // Verificar si el producto está en el carrito
      const isInCart = cart.some(item => item.id === id);
  
      const productCard = `
        <div class="product-card">
          <img src="img/${image}" alt="${name}" class="product-image" />
          <h3>${name}</h3>
          <p>Precio: $${price}</p>
          <p>Categoría: ${category}</p>
          <p>Stock: ${stock}</p>
          <button class="add-to-cart" 
                  data-id="${id}" 
                  data-name="${name}" 
                  data-price="${price}" 
                  data-image="${image}" 
                  data-stock="${stock}"
                  ${isInCart ? 'disabled' : ''}>
            ${isInCart ? 'En el carrito' : 'Agregar al carrito'}
          </button>
          ${isInCart ? `<button class="remove-from-cart" data-id="${id}">Eliminar del carrito</button>` : ''}
        </div>
      `;
      productsContainer.innerHTML += productCard;
    });
  
    // Agregar eventos para el botón de "Agregar al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', addToCart);
    });
  
    // Agregar eventos para el botón de "Eliminar del carrito"
    document.querySelectorAll('.remove-from-cart').forEach(button => {
      button.addEventListener('click', removeFromCart);
    });
  }
  

// Función para actualizar botones de paginación
function updatePaginationButtons(totalProducts) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("pagination-button");
    button.addEventListener("click", function () {
      currentPage = i;
      fetchProducts();
    });
    paginationContainer.appendChild(button);
  }
}
