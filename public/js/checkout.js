requireAuth();

async function renderCheckoutSummary() {
  try {
    const items = await apiFetch('/cart');
    if(items.length === 0) {
      window.location.href = '/cart.html';
      return;
    }
    
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const container = document.getElementById('checkoutItems');
    container.innerHTML = items.map(item => `
      <div class="summary-item">
        <img src="${item.image_url}" alt="${item.name}">
        <div style="flex:1;">
          <div style="font-size:14px; font-weight:600; color:var(--color-text-main); margin-bottom:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${item.name}</div>
          <div style="font-size:13px; color:var(--color-text-muted);">Color: ${item.color || 'Obsidian'}</div>
          <div style="font-size:13px; color:var(--color-text-muted); margin-top:4px;">Qty: ${item.quantity}</div>
        </div>
        <div style="font-size:15px; font-weight:600; color:var(--color-text-main);">₹${parseFloat(item.price * item.quantity).toLocaleString('en-IN')}</div>
      </div>
    `).join('');
    
    const formattedTotal = total.toLocaleString('en-IN');
    if (document.getElementById('checkoutTotalRaw')) document.getElementById('checkoutTotalRaw').textContent = formattedTotal;
    document.getElementById('checkoutTotal').textContent = formattedTotal;
  } catch(err) {
    console.error(err);
  }
}

async function placeOrder(e) {
  e.preventDefault();
  const btn = document.getElementById('btnPlaceOrder');
  btn.disabled = true;
  btn.textContent = 'Placing...';
  
  const payload = {
    delivery_name: document.getElementById('cName').value,
    delivery_phone: document.getElementById('cPhone').value,
    delivery_address: document.getElementById('cAddress').value,
    delivery_city: document.getElementById('cCity').value,
    delivery_pincode: document.getElementById('cPincode').value
  };
  
  try {
    const res = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(payload) });
    alert('Order Placed Successfully! ID: ' + res.orderId);
    window.location.href = '/orders.html';
  } catch(err) {
    showToast(err.message, 'error');
    btn.disabled = false;
    btn.textContent = 'Place Order';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutSummary();
  const user = getUser();
  if(user) {
    document.getElementById('cName').value = user.name || '';
  }
  document.getElementById('checkoutForm').addEventListener('submit', placeOrder);
});
