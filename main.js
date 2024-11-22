document.addEventListener("DOMContentLoaded", function () {
    loadCartFromLocalStorage();
    updateCartCount();
    updateCartModal();
    fetchProducts();
  
    document.getElementById("cart-button").addEventListener("click", openCartModal);
  
    document.getElementById("category-filter").addEventListener("change", function (event) {
      fetchProducts(event.target.value);
    });
  
    document.getElementById("search-input").addEventListener("input", function (event) {
      fetchProducts("", event.target.value);
    });
  });
  