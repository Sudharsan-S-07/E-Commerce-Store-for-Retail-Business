requireAdmin();

async function loadCustomers() {
  try {
    const customers = await apiFetch('/customers');
    const tbody = document.getElementById('customersTbody');
    tbody.innerHTML = customers.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td>${c.email}</td>
        <td>${c.phone || '-'}</td>
        <td>${c.city || '-'}</td>
        <td>${new Date(c.created_at).toLocaleDateString()}</td>
      </tr>
    `).join('');
  } catch (err) {}
}

document.addEventListener('DOMContentLoaded', loadCustomers);
