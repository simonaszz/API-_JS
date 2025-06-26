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
                <h2>${product.title}</h2>
                <img src="${product.thumbnail}" alt="${product.title}">
               <p class="price">Price: <span>${product.price}</span></p><button class="add-to-cart">Dėti į krepšelį</button>
            `;
            productsContainer.appendChild(productElement);




            const btn = productElement.querySelector('.add-to-cart');

            btn.addEventListener('click', () => {
                cart.push(product); // Pridedam į krepšelį
                alert(`Pridėta į krepšelį: ${product.title}`); // Parodomas pranešimas
            });
        });
    });









