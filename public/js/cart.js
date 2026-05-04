async function renderCartCount() {
  const user = getUser();
  if (!user) return;
  try {
    const items = await apiFetch('/cart');
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const badge = document.getElementById('cartCountBadge');
    if (badge) badge.textContent = count;
  } catch {}
}

async function addToCart(productId) {
  const user = getUser();
  if (!user) { window.location.href = '/login.html'; return; }
  try {
    await apiFetch('/cart', { method: 'POST', body: JSON.stringify({ product_id: productId, quantity: 1 }) });
    renderCartCount();
    showToast('Added to cart!');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function showToast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if(!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `background:${type==='success'?'#067D62':'#CC0C39'};color:white;padding:12px 20px;margin-top:10px;border-radius:4px;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.2);transition:opacity 0.3s;`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function renderProductCard(p) {
  const discount = p.original_price ? Math.round((1 - p.price/p.original_price)*100) : 0;
  const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5-Math.round(p.rating));
  return `
    <div class="product-card" onclick="window.location.href='/product-detail.html?id=${p.id}'">
      <img src="${p.image_url || 'https://placehold.co/200x200?text=Product'}" alt="${p.name}" onerror="this.src='https://placehold.co/200x200?text=No+Image'">
      <div class="product-name">${p.name}</div>
      <div><span class="stars">${stars}</span><span class="review-count">(${p.review_count})</span></div>
      <div class="price"><span class="price-currency">₹</span>${parseFloat(p.price).toLocaleString('en-IN')}</div>
      ${discount > 0 ? `<div><span class="original-price">₹${parseFloat(p.original_price).toLocaleString('en-IN')}</span> <span class="discount">${discount}% off</span></div>` : ''}
      <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart(${p.id})">Add to Cart</button>
    </div>
  `;
}
