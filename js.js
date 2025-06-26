const cart = [];

fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(productsData => {
        const productsContainer = document.getElementById('products');
        productsData.products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.classList.add('product');
            productElement.innerHTML = `
                <span class="border-left"></span>
                <span class="border-right"></span>
                <h2 class="product-title">${product.title}</h2>
                <img src="${product.thumbnail}" alt="${product.title}">
                <div class="price">Kaina: <span>${product.price} €</span></div>
                <button class="add-to-cart-btn">Dėti į krepšelį</button>
            `;
            productsContainer.appendChild(productElement);

            const btn = productElement.querySelector('.add-to-cart-btn');
            btn.addEventListener('click', () => {
                cart.push(product);
                // ALERT galima pakeisti į krepšelio skaičiuko atnaujinimą
                alert(`Pridėta į krepšelį: ${product.title}`);
            });
        });
    });
