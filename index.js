const SHEET_URL = "https://sheets.googleapis.com/v4/spreadsheets/1aBcDeFgHiJkLmnOPQRsTUVwxYZ12345/values/Tabla_1?key=AIzaSyCsjBMMk59ZByodPnqyrnDEbkKBjXGq9cM";

fetch(SHEET_URL)
  .then(response => response.json())
  .then(data => {
    const rows = data.values;
    console.log(rows); // Aquí procesas las filas
    rows.slice(1).forEach(row => { // Omitir la primera fila (encabezados)
        const [id, nombre, descripcion, precio, imagen, categoria] = row;
      
        const productHTML = `
          <div class="product">
            <img src="${imagen}" alt="${nombre}">
            <h3>${nombre}</h3>
            <p>${descripcion}</p>
            <span>Precio: $${precio}</span>
          </div>
        `;
      
        document.getElementById(categoria.toLowerCase()).innerHTML += productHTML;
      });
      
  })
  .catch(error => console.error("Error:", error));
