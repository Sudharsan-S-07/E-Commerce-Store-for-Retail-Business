requireAdmin();

async function loadOrders() {
  try {
    const orders = await apiFetch('/orders/all');
    const tbody = document.getElementById('ordersTbody');
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>#${o.id}</td>
        <td>${o.customer_name}<br><small style="color:var(--amazon-text-secondary)">${o.customer_email}</small></td>
        <td>${new Date(o.created_at).toLocaleDateString()}</td>
        <td>₹${parseFloat(o.total_amount).toLocaleString('en-IN')}</td>
        <td>
          <select onchange="updateStatus(${o.id}, this.value)" style="padding:4px;">
            <option value="Pending" ${o.status==='Pending'?'selected':''}>Pending</option>
            <option value="Confirmed" ${o.status==='Confirmed'?'selected':''}>Confirmed</option>
            <option value="Shipped" ${o.status==='Shipped'?'selected':''}>Shipped</option>
            <option value="Delivered" ${o.status==='Delivered'?'selected':''}>Delivered</option>
            <option value="Cancelled" ${o.status==='Cancelled'?'selected':''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (err) {}
}

window.updateStatus = async (id, status) => {
  try {
    await apiFetch(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  } catch(err) { alert(err.message); loadOrders(); }
};

document.addEventListener('DOMContentLoaded', loadOrders);
