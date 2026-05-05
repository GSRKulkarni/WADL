document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/products')
      .then(response => response.json())
      .then(products => {
        const catalog = document.getElementById('productCatalog');
        products.forEach(product => {
          const div = document.createElement('div');
          div.className = 'product';
          div.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
          `;
          catalog.appendChild(div);
        });
      })
      .catch(error => console.error('Failed to load products:', error));
  });

  