requireAuth();

function getStatusClass(status) {
  status = status.toLowerCase();
  if (status === 'pending') return 'badge-featured';
  if (status === 'confirmed') return 'badge-status';
  if (status === 'shipped') return 'badge-status';
  if (status === 'delivered') return 'badge-featured'; 
  return 'badge-status';
}

async function loadMyOrders() {
  try {
    const orders = await apiFetch('/orders/my-orders');
    const container = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
      container.innerHTML = '<p style="color:var(--color-text-muted);">You have not placed any orders yet.</p><a href="/products.html" class="btn-primary" style="display:inline-block;margin-top:20px;text-decoration:none;">Explore Collection</a>';
      return;
    }
    
    container.innerHTML = orders.map(o => `
      <div class="order-card">
        <div class="order-header">
          <div style="display:flex; gap:40px;">
            <div class="order-header-block">
              <div class="order-header-label">Placed On</div>
              <div class="order-header-value">${new Date(o.created_at).toLocaleDateString()}</div>
            </div>
            <div class="order-header-block">
              <div class="order-header-label">Total Amount</div>
              <div class="order-header-value">₹${parseFloat(o.total_amount).toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div class="order-header-block" style="align-items:flex-end;">
             <div class="order-header-label">Order ID: #${o.id}</div>
             <div style="margin-top:4px;"><span class="badge ${getStatusClass(o.status)}">${o.status}</span></div>
          </div>
        </div>
        
        <div class="order-body">
          <div class="order-item-list">
          ${o.items.map(item => `
            <div class="order-item">
              <img src="${item.product_image}" alt="${item.product_name}">
              <div>
                <a href="/product-detail.html?id=${item.product_id}" class="order-item-name">${item.product_name}</a>
                <div style="font-size:14px; color:var(--color-text-muted); margin-top:6px;">Color: <span style="font-weight:600;">${item.color || 'Obsidian'}</span> | Qty: ${item.quantity}</div>
                <div style="font-size:15px; font-weight:600; color:var(--color-text-main); margin-top:8px;">₹${parseFloat(item.unit_price).toLocaleString('en-IN')}</div>
              </div>
            </div>
          `).join('')}
          </div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadMyOrders);
