const SHEET_URL = "https://sheets.googleapis.com/v4/spreadsheets/1Uok1tS2ap4BpvG-RRubjFFGeewECz2JcdNyp1bjpFEE/values/mar!A1:F100?key=AIzaSyCsjBMMk59ZByodPnqyrnDEbkKBjXGq9cM";

// Función para obtener productos desde Google Sheets
async function fetchProducts(category = "", query = "") {
  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

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
