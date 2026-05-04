requireAdmin();

let productsList = [];
let categoriesList = [];

async function loadProducts() {
  try {
    const res = await apiFetch('/products');
    productsList = res;
    renderProductsTable();
  } catch (err) { console.error(err); }
}

async function loadCategories() {
  try {
    categoriesList = await apiFetch('/categories');
    const sel = document.getElementById('categoryId');
    sel.innerHTML = '<option value="">None</option>' + categoriesList.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  } catch (err) {}
}

function renderProductsTable() {
  const tbody = document.getElementById('productsTbody');
  tbody.innerHTML = productsList.map(p => `
    <tr>
      <td>${p.id}</td>
      <td><img src="${p.image_url}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;"></td>
      <td>${p.name}</td>
      <td>${p.category_name || '-'}</td>
      <td>₹${p.price}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editProduct(${p.id})" style="padding:4px 8px; cursor:pointer;">Edit</button>
        <button onclick="deleteProduct(${p.id})" style="padding:4px 8px; cursor:pointer; color:red;">Delete</button>
      </td>
    </tr>
  `).join('');
}

function showModal(id = null) {
  const form = document.getElementById('productForm');
  form.reset();
  document.getElementById('productId').value = '';
  
  if (id) {
    const p = productsList.find(x => x.id === id);
    if(p) {
      document.getElementById('productId').value = p.id;
      document.getElementById('name').value = p.name;
      document.getElementById('price').value = p.price;
      document.getElementById('originalPrice').value = p.original_price || '';
      document.getElementById('stock').value = p.stock;
      document.getElementById('categoryId').value = p.category_id || '';
      document.getElementById('imageUrl').value = p.image_url || '';
      document.getElementById('description').value = p.description || '';
      document.getElementById('isFeatured').checked = p.is_featured;
    }
  }
  document.getElementById('productModal').classList.add('active');
}

function hideModal() {
  document.getElementById('productModal').classList.remove('active');
}

window.editProduct = showModal;
window.deleteProduct = async (id) => {
  if(!confirm('Delete this product?')) return;
  try {
    await apiFetch(`/products/${id}`, { method: 'DELETE' });
    loadProducts();
  } catch(err) { alert(err.message); }
};

document.getElementById('productForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const payload = {
    name: document.getElementById('name').value,
    price: document.getElementById('price').value,
    original_price: document.getElementById('originalPrice').value || null,
    stock: document.getElementById('stock').value,
    category_id: document.getElementById('categoryId').value || null,
    image_url: document.getElementById('imageUrl').value,
    description: document.getElementById('description').value,
    is_featured: document.getElementById('isFeatured').checked
  };
  
  try {
    if(id) await apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    else await apiFetch('/products', { method: 'POST', body: JSON.stringify(payload) });
    hideModal();
    loadProducts();
  } catch(err) { alert(err.message); }
});

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadProducts();
});
