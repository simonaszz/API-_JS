// 1. Gaunam krepšelį iš localStorage
const cart = JSON.parse(localStorage.getItem('checkout_cart') || '[]');
const checkoutSummary = document.getElementById('checkout-summary');
const checkoutForm = document.getElementById('checkout-form');

// 2. Jei krepšelis tuščias, rodom žinutę
if (!cart.length) {
    checkoutSummary.innerHTML = '<div class="thankyou" style="color:#d90e0e;">Krepšelis tuščias!</div>';
    checkoutForm.style.display = 'none';
} else {
    // 3. Grupavimas (jei buvo daug tų pačių prekių)
    const grouped = {};
    cart.forEach(item => {
        if (grouped[item.id]) {
            grouped[item.id].count++;
        } else {
            grouped[item.id] = {...item, count: 1};
        }
    });

    // 4. Išvedam krepšelio info
    let html = '<ul>';
    let total = 0;
    Object.values(grouped).forEach(item => {
        html += `<li><span>${item.title} × ${item.count}</span><b>${(item.price * item.count).toFixed(2)} €</b></li>`;
        total += item.price * item.count;
    });
    html += `</ul>
        <div style="text-align:right;font-weight:600;margin-top:1em;">
            Bendra suma: <span style="font-size:1.17em;color:#d90e0e;">${total.toFixed(2)} €</span>
        </div>`;
    checkoutSummary.innerHTML = html;
}

// 5. Forma – pirkimo submit
checkoutForm.onsubmit = function(e) {
    e.preventDefault();
    // Galima čia išsiųsti duomenis į serverį ar integruoti Paysera API
    checkoutSummary.innerHTML = `<div class="thankyou">Ačiū už pirkimą, ${document.getElementById('name').value}!<br>
        Informacija išsiųsta el. paštu.</div>`;
    checkoutForm.style.display = 'none';
    // Išvalom krepšelį (abiem raktams)
    localStorage.removeItem('cart');
    localStorage.removeItem('checkout_cart');
};
