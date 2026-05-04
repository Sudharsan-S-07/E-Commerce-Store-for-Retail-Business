requireAdmin();

let catsList = [];

async function loadCategories() {
  try {
    catsList = await apiFetch('/categories');
    renderTable();
  } catch (err) {}
}

function renderTable() {
  const tbody = document.getElementById('catsTbody');
  tbody.innerHTML = catsList.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.slug}</td>
      <td>
        <button onclick="editCat(${c.id})" style="padding:4px 8px; cursor:pointer;">Edit</button>
        <button onclick="deleteCat(${c.id})" style="padding:4px 8px; cursor:pointer; color:red;">Delete</button>
      </td>
    </tr>
  `).join('');
}

function showModal(id = null) {
  const form = document.getElementById('catForm');
  form.reset();
  document.getElementById('catId').value = '';
  
  if (id) {
    const c = catsList.find(x => x.id === id);
    if(c) {
      document.getElementById('catId').value = c.id;
      document.getElementById('name').value = c.name;
      document.getElementById('slug').value = c.slug;
    }
  }
  document.getElementById('catModal').classList.add('active');
}

function hideModal() { document.getElementById('catModal').classList.remove('active'); }

window.editCat = showModal;
window.deleteCat = async (id) => {
  if(!confirm('Delete this category?')) return;
  try { await apiFetch(`/categories/${id}`, { method: 'DELETE' }); loadCategories(); }
  catch(err) { alert(err.message); }
};

document.getElementById('catForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('catId').value;
  const payload = {
    name: document.getElementById('name').value,
    slug: document.getElementById('slug').value
  };
  try {
    if(id) await apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
    else await apiFetch('/categories', { method: 'POST', body: JSON.stringify(payload) });
    hideModal();
    loadCategories();
  } catch(err) { alert(err.message); }
});

document.addEventListener('DOMContentLoaded', loadCategories);
