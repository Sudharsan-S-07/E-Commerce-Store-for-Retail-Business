let currentProductId = null;
let selectedQuantity = 1;
let selectedColor = 'Obsidian';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

function toggleAcc(btn) {
  const content = btn.nextElementSibling;
  const icon = btn.querySelector('.icon');
  
  if (content.classList.contains('active')) {
    content.classList.remove('active');
    icon.textContent = '+';
  } else {
    // Optional: close all others like Gymshark does
    document.querySelectorAll('.accordion-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.accordion-header .icon').forEach(i => i.textContent = '+');
    
    content.classList.add('active');
    icon.textContent = '-';
  }
}

async function loadProduct() {
  if(!productId) {
    document.getElementById('productDetailContainer').innerHTML = '<h2>Product not found</h2>';
    return;
  }
  
  try {
    const p = await apiFetch(`/products/${productId}`);
    currentProductId = p.id;
    
    document.getElementById('pImage').src = p.image_url;
    document.getElementById('pName').textContent = p.name;
    document.title = p.name + ' - RetailMart';
    document.getElementById('pBreadcrumbName').textContent = p.name;
    if(p.category_name) {
      document.getElementById('pBreadcrumbCat').textContent = p.category_name;
      const cats = await apiFetch('/categories');
      const cat = cats.find(c => c.name === p.category_name);
      if(cat) document.getElementById('pBreadcrumbCat').href = `/products.html?category=${cat.slug}`;
    }
    
    document.getElementById('pPrice').textContent = parseFloat(p.price).toLocaleString('en-IN');
    if(p.original_price > p.price) {
      document.getElementById('pOriginalPrice').textContent = '₹' + parseFloat(p.original_price).toLocaleString('en-IN');
      const discount = Math.round(((p.original_price - p.price) / p.original_price) * 100);
      document.getElementById('pDiscount').textContent = `${discount}% OFF`;
    } else {
      document.getElementById('pOriginalPrice').parentElement.style.display = 'none';
    }
    
    // GYMSHARK ACCORDION DATA HYDRATION
    let featureListHTML = '';
    if (p.features) {
      try {
        const feats = typeof p.features === 'string' ? JSON.parse(p.features) : p.features;
        featureListHTML = `<ul class="accordion-ul">${feats.map(f => `<li>${f}</li>`).join('')}</ul>`;
      } catch(e) {}
    }
    
    document.getElementById('accDescContent').innerHTML = `
      <div class="text-block" style="text-transform:uppercase; font-weight:700; margin-bottom:8px;">${p.name}</div>
      <div class="text-block">${p.description || ''}</div>
      ${featureListHTML}
    `;
    
    document.getElementById('accSizeFit').textContent = p.size_fit || 'Standard fit.';
    document.getElementById('accMaterials').textContent = p.materials || 'Premium materials.';
    document.getElementById('accSku').textContent = p.sku || 'N/A';
    
    document.getElementById('pStock').innerHTML = p.stock > 0 
      ? `In Stock - Ships immediately` 
      : `<span style="color:var(--color-danger);">Out of Stock</span>`;
      
    document.getElementById('pRating').innerHTML = `★ ${parseFloat(p.rating).toFixed(1)} <span style="margin-left:8px;">(${p.review_count} Reviews)</span>`;
    
    if(p.stock <= 0) {
      const btn = document.getElementById('btnAddToCart');
      btn.disabled = true;
      btn.textContent = 'Out of Stock';
      btn.style.background = '#e2e8f0';
      btn.style.color = '#94a3b8';
    }
    
  } catch(err) {
    console.error(err);
    document.getElementById('productDetailContainer').innerHTML = '<h2>Error loading product</h2>';
  }
}

window.adjustQty = function(amount) {
  selectedQuantity += amount;
  if(selectedQuantity < 1) selectedQuantity = 1;
  document.getElementById('selectedQty').textContent = selectedQuantity;
};

window.selectColor = function(element) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
  element.classList.add('active');
  selectedColor = element.getAttribute('data-color');
  document.getElementById('selectedColorName').textContent = selectedColor;
};

document.getElementById('btnAddToCart')?.addEventListener('click', async () => {
  if(!currentProductId) return;
  const token = localStorage.getItem('token');
  if(!token) {
    window.location.href = '/login.html';
    return;
  }
  
  try {
    await apiFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ 
        product_id: currentProductId, 
        quantity: selectedQuantity,
        color: selectedColor 
      })
    });
    
    showToast('Added to bag successfully');
    renderCartCount();
    
    selectedQuantity = 1;
    document.getElementById('selectedQty').textContent = selectedQuantity;
  } catch(err) {
    showToast(err.message, 'error');
  }
});

document.addEventListener('DOMContentLoaded', loadProduct);
