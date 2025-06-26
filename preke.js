// --- Užkraunam krepšelio kiekį viršuje ---
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.getElementById('cart-count');
    if(cartCount) cartCount.textContent = cart.length;
}
updateCartCount();

// --- Gaunam prekės ID iš URL ---
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

const productId = getProductIdFromUrl();
const productDetails = document.getElementById('product-details');

// --- Gaunam prekę iš API ---
fetch(`https://dummyjson.com/products/${productId}`)
    .then(res => res.json())
    .then(product => {
        productDetails.innerHTML = `
            <div class="single-product">
                <div class="product-gallery">
                    <img src="${product.images?.[0] || product.thumbnail}" alt="${product.title}" class="main-img">
                    <div class="thumbs">
                        ${(product.images || []).map(img => `<img src="${img}" class="thumb">`).join('')}
                    </div>
                </div>
                <div class="product-info">
                    <h2>${product.title}</h2>
                    <div class="product-meta">
                        <span class="product-category">Kategorija: ${product.category}</span>
                        <span class="product-brand">Gamintojas: ${product.brand}</span>
                    </div>
                    <div class="product-price">
                        Kaina: <span>${product.price} €</span>
                        <span class="discount">(${product.discountPercentage}% nuolaida)</span>
                    </div>
                    <div class="product-stock">Likutis: <b>${product.stock}</b></div>
                    <div class="product-rating">Įvertinimas: <b>${product.rating} / 5</b></div>
                    <p class="product-desc">${product.description}</p>
                    <button id="add-to-cart-detail" class="add-to-cart-btn">Dėti į krepšelį</button>
                </div>
            </div>
            <div class="reviews-block">
                <h3>Atsiliepimai:</h3>
                ${product.reviews && product.reviews.length > 0 ? `
                  <ul class="reviews">
                    ${product.reviews.map(r => `
                      <li>
                        <b>${r.reviewerName}</b> (${new Date(r.date).toLocaleDateString()})<br>
                        ⭐ ${r.rating} <br>
                        <span>${r.comment}</span>
                      </li>
                    `).join('')}
                  </ul>
                ` : '<p>Nėra atsiliepimų.</p>'}
            </div>
        `;

        // Galerijos thumbs paspaudimas keičia pagrindinį paveikslėlį
        document.querySelectorAll('.thumb').forEach(img => {
            img.onclick = () => {
                document.querySelector('.main-img').src = img.src;
            }
        });

        // Pridėjimas į krepšelį
        document.getElementById('add-to-cart-detail').onclick = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart.push(product);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        };
    })
    .catch(() => {
        productDetails.innerHTML = '<p style="color:red;">Prekė nerasta.</p>';
    });
