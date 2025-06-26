// 1. Sukuriame tuščią krepšelio masyvą – čia saugosime prekes, kurias įdės vartotojas
const cart = [];

/* 1.1. Funkcija, kuri užkrauna krepšelį iš localStorage, jei yra išsaugotas */
function loadCart() {
    const stored = localStorage.getItem('cart');
    if (stored) {
        cart.length = 0;
        JSON.parse(stored).forEach(item => cart.push(item));
    }
}

/* 1.2. Funkcija, kuri išsaugo krepšelį į localStorage */
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 2. Funkcija, kuri atnaujina prekių kiekį krepšelyje (viršuje, šalia vežimėlio)
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
    cartCount.classList.remove('pop');
    void cartCount.offsetWidth;
    cartCount.classList.add('pop');
}

// 2.1. Iškart užkraunam krepšelį iš saugyklos (jei jau buvo anksčiau)
loadCart();
updateCartCount();

// 3. Parsisiunčiam prekių sąrašą iš API ir kuriame korteles kiekvienai prekei
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
                cart.push(product);       // Įdedam prekę į krepšelį
                updateCartCount();        // Atnaujinam prekių kiekį viršuje
                saveCart();               // Išsaugom atnaujintą krepšelį
            });
        });
    });

/* KREPŠELIO MODALAS */

const cartInfo = document.getElementById('cart-info');
const cartModal = document.getElementById('cart-modal');
const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');
const closeModal = document.querySelector('.close-modal');

cartInfo.addEventListener('click', () => {
    renderCart();
    cartModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    cartModal.style.display = 'none';
});
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
});

function renderCart() {
    cartList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li>Krepšelis tuščias</li>';
        cartTotal.textContent = '';
        document.getElementById('buy-btn').style.display = 'none';
        return;
    }

    const grouped = {};
    cart.forEach(item => {
        if (grouped[item.id]) {
            grouped[item.id].count++;
        } else {
            grouped[item.id] = {...item, count: 1};
        }
    });

    Object.values(grouped).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="cart-item-title">${item.title}</span>
            <button class="qty-btn minus" title="Mažinti">−</button>
            <span class="cart-item-qty">${item.count}</span>
            <button class="qty-btn plus" title="Pridėti">+</button>
            <span class="cart-item-sum">${(item.price * item.count).toFixed(2)} €</span>
            <button class="remove-btn" title="Pašalinti">🗑</button>
        `;
        cartList.appendChild(li);

        // Mažinimo mygtukas ("−")
        li.querySelector('.minus').onclick = () => {
            const index = cart.findIndex(pr => pr.id === item.id);
            if (index !== -1) cart.splice(index, 1);
            updateCartCount();
            saveCart();
            renderCart();
        };
        // Didinimo mygtukas ("+")
        li.querySelector('.plus').onclick = () => {
            cart.push(item);
            updateCartCount();
            saveCart();
            renderCart();
        };
        // Šiukšliadėžės mygtukas
        li.querySelector('.remove-btn').onclick = () => {
            for (let i = cart.length - 1; i >= 0; i--) {
                if (cart[i].id === item.id) cart.splice(i, 1);
            }
            updateCartCount();
            saveCart();
            renderCart();
        };

        total += item.price * item.count;
    });

    cartTotal.textContent = `Iš viso: ${total.toFixed(2)} €`;
    document.getElementById('buy-btn').style.display = '';
}

// PIRKIMO MYGTUKAS – NUKREIPIA Į CHECKOUT.HTML
const buyBtn = document.getElementById('buy-btn');
if (buyBtn) {
    buyBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        localStorage.setItem('checkout_cart', JSON.stringify(cart));
        window.location.href = 'checkout.html';
    });
}
